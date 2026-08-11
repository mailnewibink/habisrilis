const fs = require('fs');
let code = fs.readFileSync('src/pages/app/CreateRelease.tsx', 'utf-8');

code = code.replace(
  /throw new Error\('Release created but artwork upload failed\. Please edit the release to try again\.'\);/,
  `throw new Error('Release created but artwork failed: ' + (uploadErr instanceof Error ? uploadErr.message : 'Unknown error'));`
);

fs.writeFileSync('src/pages/app/CreateRelease.tsx', code);
