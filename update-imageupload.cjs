const fs = require('fs');
let code = fs.readFileSync('src/components/release/ImageUpload.tsx', 'utf-8');

code = code.replace(
  /if \(!file.type.startsWith\('image\/'\)\) \{/,
  `if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }
    
    if (!file.type.startsWith('image/')) {`
);

fs.writeFileSync('src/components/release/ImageUpload.tsx', code);
