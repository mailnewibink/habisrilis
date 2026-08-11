const fs = require('fs');
let code = fs.readFileSync('src/lib/storage-utils.ts', 'utf-8');

code = code.replace(
  /export const uploadArtwork = async \([\s\S]*?\} catch \(err\) \{/g,
  `const withTimeout = <T>(promise: Promise<T>, ms: number = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Storage operation timed out')), ms))
  ]);
};

export const uploadArtwork = async (artistId: string, releaseId: string): Promise<{url: string, format: string} | null> => {
  try {
    const blob = await get('temp-artwork');
    if (!blob) return null;
    
    const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
    const filename = \`artwork.\${ext}\`;
    const storageRef = ref(storage, \`artworks/\${artistId}/\${releaseId}/\${filename}\`);
    
    await withTimeout(uploadBytes(storageRef, blob, {
      contentType: blob.type
    }));
    
    const downloadUrl = await withTimeout(getDownloadURL(storageRef));
    
    // Clear temp storage after successful upload
    await del('temp-artwork');
    
    return { url: downloadUrl, format: ext };
  } catch (err) {`
);

fs.writeFileSync('src/lib/storage-utils.ts', code);
