const fs = require('fs');
let code = fs.readFileSync('src/lib/storage-utils.ts', 'utf-8');

code = code.replace(
  /throw new Error\('Failed to upload artwork to storage\.'\);/,
  `if (err?.code === 'storage/retry-limit-exceeded' || err?.message?.includes('timed out')) {
      throw new Error('Firebase Storage is not enabled or accessible. Please enable Storage in your Firebase Console.');
    }
    throw new Error('Failed to upload artwork to storage: ' + (err?.message || 'Unknown error'));`
);

fs.writeFileSync('src/lib/storage-utils.ts', code);
