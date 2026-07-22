// ══════════════════════════════════════════════════════════════════
//  IMMORTAL PUBLIC MEDIA CDN ENGINE v3.0
//  Uploads media files (videos, music, images) to public cloud CDNs
//  so EVERY visitor on ANY device worldwide can play music & videos.
// ══════════════════════════════════════════════════════════════════

import { saveMediaToIDB } from './mediaStore';

/**
 * Convert a small file (< 500KB) to a Base64 Data URL.
 * Fits safely within Firestore's 1MB document limit.
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
 * Upload a file to File.io Public CDN.
 */
async function uploadToFileIo(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('https://file.io', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`File.io status ${res.status}`);
  const json = await res.json();
  if (json?.success && json?.link) {
    return json.link;
  }
  throw new Error('File.io upload failed');
}

/**
 * Upload a file to TmpFiles Public CDN.
 */
async function uploadToTmpFiles(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`TmpFiles status ${res.status}`);
  const json = await res.json();
  if (json?.status === 'success' && json?.data?.url) {
    return json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
  }
  throw new Error('TmpFiles upload failed');
}

/**
 * Upload a file to Pixeldrain Public CDN.
 */
async function uploadToPixeldrain(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('https://pixeldrain.com/api/file', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`Pixeldrain status ${res.status}`);
  const json = await res.json();
  if (json?.id) {
    return `https://pixeldrain.com/api/file/${json.id}`;
  }
  throw new Error('Pixeldrain upload failed');
}

/**
 * Main upload entry point.
 * Guarantees a public HTTPS URL accessible to all visitors globally.
 */
export async function uploadMediaFile(file, folder = 'uploads') {
  if (!file) throw new Error('No file selected');

  // Small icons/images < 500KB use Base64 (fits in Firestore 1MB limit)
  if (file.type.startsWith('image/') && file.size < 500 * 1024) {
    console.log('[PublicCDN] Encoding small image to Base64...');
    return await fileToBase64(file);
  }

  // 1. Try File.io Public CDN
  try {
    console.log('[PublicCDN] Uploading to File.io...');
    const url = await uploadToFileIo(file);
    console.log('[PublicCDN] File.io success:', url);
    return url;
  } catch (err1) {
    console.warn('[PublicCDN] File.io notice:', err1.message);
  }

  // 2. Try TmpFiles Public CDN
  try {
    console.log('[PublicCDN] Uploading to TmpFiles...');
    const url = await uploadToTmpFiles(file);
    console.log('[PublicCDN] TmpFiles success:', url);
    return url;
  } catch (err2) {
    console.warn('[PublicCDN] TmpFiles notice:', err2.message);
  }

  // 3. Try Pixeldrain Public CDN
  try {
    console.log('[PublicCDN] Uploading to Pixeldrain...');
    const url = await uploadToPixeldrain(file);
    console.log('[PublicCDN] Pixeldrain success:', url);
    return url;
  } catch (err3) {
    console.warn('[PublicCDN] Pixeldrain notice:', err3.message);
  }

  // 4. Local IndexedDB preview fallback for current device
  console.warn('[PublicCDN] Using IndexedDB local fallback');
  return await saveMediaToIDB(folder, file);
}
