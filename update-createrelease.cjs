const fs = require('fs');
let code = fs.readFileSync('src/pages/app/CreateRelease.tsx', 'utf-8');

// Replace the final handleSave part where it saves artworkUrl
code = code.replace(
  /const newRelease: Release = \{([\s\S]*?)artworkUrl: data\.artworkUrl \|\| '',([\s\S]*?)\};/,
  `let finalArtworkUrl = data.artworkUrl || '';
      let artworkFormat = '';
      
      if (finalArtworkUrl.startsWith('blob:')) {
        const uploaded = await uploadArtwork(artist.userId, releaseRef.id);
        if (uploaded) {
          finalArtworkUrl = uploaded.url;
          artworkFormat = uploaded.format;
        } else {
          throw new Error('Failed to upload artwork. Please try again.');
        }
      }

      const newRelease: Release = {$1artworkUrl: finalArtworkUrl,
        artworkFormat: artworkFormat,$2};`
);

fs.writeFileSync('src/pages/app/CreateRelease.tsx', code);
