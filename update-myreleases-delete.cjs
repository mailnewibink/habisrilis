const fs = require('fs');
let code = fs.readFileSync('src/pages/app/MyReleases.tsx', 'utf-8');

code = code.replace(
  /await deleteArtwork\(user\.id, releaseToDelete\);/,
  "deleteArtwork(user.id, releaseToDelete).catch(console.error);"
);

fs.writeFileSync('src/pages/app/MyReleases.tsx', code);
