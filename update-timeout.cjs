const fs = require('fs');
let code = fs.readFileSync('src/lib/storage-utils.ts', 'utf-8');

code = code.replace(/ms: number = 10000/g, 'ms: number = 5000');

fs.writeFileSync('src/lib/storage-utils.ts', code);
