const fs = require('fs');
let code = fs.readFileSync('src/pages/app/EditRelease.tsx', 'utf-8');

// Replace the artwork upload block
code = code.replace(
  /let finalArtworkUrl = data\.artworkUrl \|\| '';\s*if \(finalArtworkUrl\.startsWith\('blob:'\)\) \{[\s\S]*?\}\s*await updateDoc\(releaseRef, \{([\s\S]*?)artworkUrl: finalArtworkUrl,([\s\S]*?)\}\);/,
  `let finalArtworkUrl = data.artworkUrl || '';
      let artworkFormat = data.artworkFormat || '';
      
      if (finalArtworkUrl.startsWith('blob:')) {
        const uploaded = await uploadArtwork(artist.userId, originalRelease.id);
        if (uploaded) {
          finalArtworkUrl = uploaded.url;
          artworkFormat = uploaded.format;
        } else {
          throw new Error('Failed to upload artwork. Please try again.');
        }
      }

      await updateDoc(releaseRef, {$1artworkUrl: finalArtworkUrl,
        artworkFormat: artworkFormat,$2});`
);

// Add deleteArtwork
if (!code.includes('deleteArtwork')) {
  code = code.replace(
    /import \{ uploadArtwork, clearTempArtwork \} from '\.\.\/\.\.\/lib\/storage-utils';/,
    "import { uploadArtwork, clearTempArtwork, deleteArtwork } from '../../lib/storage-utils';"
  );
  
  code = code.replace(
    /await deleteDoc\(doc\(db, 'releases', originalRelease\.id\)\);/,
    "await deleteDoc(doc(db, 'releases', originalRelease.id));\n      await deleteArtwork(artist.userId, originalRelease.id);"
  );
}

fs.writeFileSync('src/pages/app/EditRelease.tsx', code);
