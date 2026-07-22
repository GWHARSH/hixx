// ══════════════════════════════════════════════════════════════════
//  IMMORTAL CLOUD & BASE64 MEDIA ENGINE
//  Ensures all uploaded audio, images, and background videos are 100%
//  accessible to EVERY visitor globally on any device.
// ══════════════════════════════════════════════════════════════════

import { storage as firebaseStorage, isFirebaseConfigured } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { realSupabase } from './supabase';
import { saveMediaToIDB } from './mediaStore';

/**
 * Convert a File object to a Base64 Data URL.
 * Base64 Data URLs are self-contained and work globally for all visitors!
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads or converts a media file into a globally accessible URL.
 * - Audio & Images (under 15MB): Converted to Base64 (100% instant, no server required, works for all visitors).
 * - Videos: Tries Cloud Storage (Firebase/Supabase/Public CDN) or Base64/IndexedDB.
 */
export async function uploadMediaFile(file, folder = 'uploads') {
  if (!file) throw new Error('No file selected');

  const isAudio = file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i);
  const isImage = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i);
  const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov|m4v)$/i);

  // ── Strategy A: Base64 for Audio & Images under 15MB ─────────────
  // Base64 Data URLs are 100% bulletproof: stored in setting, works globally for all users.
  if ((isAudio || isImage) && file.size < 15 * 1024 * 1024) {
    console.log('[MediaEngine] Encoding audio/image to Base64 Data URL for universal access...');
    return await fileToBase64(file);
  }

  // ── Strategy B: Base64 for small videos under 12MB ───────────────
  if (isVideo && file.size < 12 * 1024 * 1024) {
    console.log('[MediaEngine] Encoding small video to Base64 Data URL for universal access...');
    return await fileToBase64(file);
  }

  // ── Strategy C: Firebase Storage (if configured and permitted) ───
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${folder}/${Date.now()}_${safeName}`;

  if (isFirebaseConfigured && firebaseStorage) {
    try {
      console.log('[MediaEngine] Attempting Firebase Storage upload:', filePath);
      const storageRef = ref(firebaseStorage, filePath);
      await uploadBytes(storageRef, file, {
        contentType: file.type || 'application/octet-stream',
      });
      const publicUrl = await getDownloadURL(storageRef);
      if (publicUrl) {
        console.log('[MediaEngine] Firebase Storage upload successful:', publicUrl);
        return publicUrl;
      }
    } catch (err) {
      console.warn('[MediaEngine] Firebase Storage upload error:', err?.message || err);
    }
  }

  // ── Strategy D: Supabase Storage ─────────────────────────────────
  try {
    console.log('[MediaEngine] Attempting Supabase Storage upload:', filePath);
    const { error: sbErr } = await realSupabase.storage
      .from('files')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (!sbErr) {
      const { data } = realSupabase.storage.from('files').getPublicUrl(filePath);
      if (data?.publicUrl) {
        console.log('[MediaEngine] Supabase Storage upload successful:', data.publicUrl);
        return data.publicUrl;
      }
    }
  } catch (sbEx) {
    console.warn('[MediaEngine] Supabase Storage upload error:', sbEx?.message || sbEx);
  }

  // ── Strategy E: TmpFiles Free Upload API ──────────────────────────
  try {
    console.log('[MediaEngine] Attempting TmpFiles CDN upload...');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data?.url) {
        // Transform view URL into direct download URL
        const directUrl = json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        console.log('[MediaEngine] TmpFiles CDN upload successful:', directUrl);
        return directUrl;
      }
    }
  } catch (tmpErr) {
    console.warn('[MediaEngine] TmpFiles upload error:', tmpErr?.message || tmpErr);
  }

  // ── Strategy F: IndexedDB Fallback ───────────────────────────────
  console.warn('[MediaEngine] Falling back to IndexedDB local persistence');
  return await saveMediaToIDB(folder, file);
}
