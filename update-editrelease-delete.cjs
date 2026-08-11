const fs = require('fs');
let code = fs.readFileSync('src/pages/app/EditRelease.tsx', 'utf-8');

code = code.replace(
  /await deleteArtwork\(artist\.id, originalRelease\.id\);/,
  "deleteArtwork(artist.id, originalRelease.id).catch(console.error);"
);

fs.writeFileSync('src/pages/app/EditRelease.tsx', code);
