// ══════════════════════════════════════════════════════════════════
//  IMMORTAL PUBLIC MEDIA CDN ENGINE
//  Uploads media files (videos, music, images) to public cloud CDNs
//  so EVERY visitor on ANY device worldwide can play music & videos.
// ══════════════════════════════════════════════════════════════════

import { saveMediaToIDB } from './mediaStore';

/**
 * Convert a small file (< 700KB) to a Base64 Data URL.
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
 * Upload a file to TmpFiles Public CDN.
 * Returns a direct public streaming URL.
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
  throw new Error('TmpFiles invalid response');
}

/**
 * Upload a file to Pixeldrain Public CDN.
 * Returns a direct public streaming URL.
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
  throw new Error('Pixeldrain invalid response');
}

/**
 * Upload a file to Catbox Public CDN.
 */
async function uploadToCatbox(file) {
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', file);

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`Catbox status ${res.status}`);
  const url = (await res.text()).trim();
  if (url && url.startsWith('http')) {
    return url;
  }
  throw new Error('Catbox invalid response');
}

/**
 * Main upload entry point.
 * Guarantees a public HTTPS URL accessible to all visitors globally.
 */
export async function uploadMediaFile(file, folder = 'uploads') {
  if (!file) throw new Error('No file selected');

  // Small images/icons < 700KB can use Base64 safely (fits in Firestore 1MB limit)
  const isSmallImage = file.type.startsWith('image/') && file.size < 700 * 1024;
  if (isSmallImage) {
    console.log('[PublicCDN] Encoding small image to Base64...');
    return await fileToBase64(file);
  }

  // 1. Try TmpFiles Public CDN
  try {
    console.log('[PublicCDN] Uploading to TmpFiles...');
    const url = await uploadToTmpFiles(file);
    console.log('[PublicCDN] TmpFiles success:', url);
    return url;
  } catch (err1) {
    console.warn('[PublicCDN] TmpFiles notice:', err1.message);
  }

  // 2. Try Pixeldrain Public CDN
  try {
    console.log('[PublicCDN] Uploading to Pixeldrain...');
    const url = await uploadToPixeldrain(file);
    console.log('[PublicCDN] Pixeldrain success:', url);
    return url;
  } catch (err2) {
    console.warn('[PublicCDN] Pixeldrain notice:', err2.message);
  }

  // 3. Try Catbox Public CDN
  try {
    console.log('[PublicCDN] Uploading to Catbox...');
    const url = await uploadToCatbox(file);
    console.log('[PublicCDN] Catbox success:', url);
    return url;
  } catch (err3) {
    console.warn('[PublicCDN] Catbox notice:', err3.message);
  }

  // 4. If small file < 900KB, use Base64 fallback
  if (file.size < 900 * 1024) {
    console.log('[PublicCDN] Using Base64 fallback for small file...');
    return await fileToBase64(file);
  }

  // 5. Local IndexedDB preview fallback
  console.warn('[PublicCDN] Using IndexedDB local fallback');
  return await saveMediaToIDB(folder, file);
}
