const fs = require('fs');
let content = fs.readFileSync('src/pages/public/ClaimArtist.tsx', 'utf-8');

const brokenMiddle = `            ) : (
          {!canClaim ? (`;

const fixedMiddle = `            ) : !canClaim ? (`;

content = content.replace(brokenMiddle, fixedMiddle);
fs.writeFileSync('src/pages/public/ClaimArtist.tsx', content);
