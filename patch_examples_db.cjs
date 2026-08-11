const fs = require('fs');

let content = fs.readFileSync('src/pages/public/ExamplesShowcase.tsx', 'utf-8');

content = content.replace(
  /artworkUrl={example.artworkUrl \|\| ''}/g,
  "artworkUrl={example.artwork_url || example.artworkUrl || ''}"
);
content = content.replace(
  /releaseType={example.releaseType}/g,
  "releaseType={example.release_type || example.releaseType}"
);
content = content.replace(
  /releaseDate={example.releaseDate}/g,
  "releaseDate={example.release_date || example.releaseDate}"
);
content = content.replace(
  /example.artist\?\.displayName/g,
  "example.artist?.display_name || example.artist?.displayName"
);

fs.writeFileSync('src/pages/public/ExamplesShowcase.tsx', content);
