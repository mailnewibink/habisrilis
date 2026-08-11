const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

if (!code.includes('maxUploadRetryTime')) {
  code = code.replace(
    /export const storage = getStorage\(app\);/,
    "export const storage = getStorage(app);\nstorage.maxUploadRetryTime = 10000;\nstorage.maxOperationRetryTime = 10000;"
  );
  fs.writeFileSync('src/lib/firebase.ts', code);
}
