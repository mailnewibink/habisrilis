const fs = require('fs');
let content = fs.readFileSync('src/pages/public/ClaimArtist.tsx', 'utf-8');

const brokenSection = `            ) : (
          {!canClaim ? (`;

const brokenSection2 = `            ) : (
                        {!canClaim ? (`

content = content.replace(brokenSection2, `            ) : !canClaim ? (`);
fs.writeFileSync('src/pages/public/ClaimArtist.tsx', content);
