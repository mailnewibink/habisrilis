const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf-8');

if (!code.includes('artworkFormat')) {
  code = code.replace(
    /artworkUrl\?: string;/,
    "artworkUrl?: string;\n  artworkFormat?: string;"
  );
  fs.writeFileSync('src/types/index.ts', code);
}
