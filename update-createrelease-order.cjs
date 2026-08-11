const fs = require('fs');
let code = fs.readFileSync('src/pages/app/CreateRelease.tsx', 'utf-8');

// Replace the logic to match the exact requested order
code = code.replace(
  /const slug = generateSlug\(data\.title\) \|\| releaseRef\.id;([\s\S]*?)await setDoc\(releaseRef, newRelease\);/g,
  `const slug = generateSlug(data.title) || releaseRef.id;
      
      const newRelease: Release = {
        id: releaseRef.id,
        artistId: artist.id,
        title: data.title,
        slug: slug,
        releaseType: data.releaseType || 'single',
        releaseDate: data.releaseDate,
        artworkUrl: '',
        artworkFormat: '',
        spotifyUrl: data.spotifyUrl || '',
        about: data.about || '',
        aboutVisible: data.aboutVisible ?? true,
        status: status,
        streamingLinks: data.streamingLinks || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // 1. Create/save release first
      await setDoc(releaseRef, newRelease);
      
      // 2. Process & upload artwork
      let finalArtworkUrl = data.artworkUrl || '';
      if (finalArtworkUrl.startsWith('blob:')) {
        try {
          const uploaded = await uploadArtwork(artist.id, releaseRef.id);
          if (uploaded) {
            // 3. Update release document
            await setDoc(releaseRef, { artworkUrl: uploaded.url, artworkFormat: uploaded.format }, { merge: true });
          } else {
            throw new Error('Failed to get upload response');
          }
        } catch (uploadErr) {
          throw new Error('Release created but artwork upload failed. Please edit the release to try again.');
        }
      }`
);

fs.writeFileSync('src/pages/app/CreateRelease.tsx', code);
