const fs = require('fs');

let content = fs.readFileSync('src/pages/public/LandingPage.tsx', 'utf-8');

content = content.replace(
  /artworkUrl={featuredRelease.artworkUrl \|\| ''}/g,
  "artworkUrl={featuredRelease.artwork_url || featuredRelease.artworkUrl || ''}"
);
content = content.replace(
  /releaseType={featuredRelease.releaseType}/g,
  "releaseType={featuredRelease.release_type || featuredRelease.releaseType}"
);
content = content.replace(
  /releaseDate={featuredRelease.releaseDate}/g,
  "releaseDate={featuredRelease.release_date || featuredRelease.releaseDate}"
);
content = content.replace(
  /featuredRelease.artist\?\.displayName/g,
  "featuredRelease.artist?.display_name || featuredRelease.artist?.displayName"
);

fs.writeFileSync('src/pages/public/LandingPage.tsx', content);
