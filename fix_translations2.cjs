const fs = require('fs');

let path = 'src/lib/i18n/translations.ts';
let content = fs.readFileSync(path, 'utf8');

// Add to ID
content = content.replace("heroTitle: 'Tempat rilisan", "eyebrow: 'Tentang Habis Rilis',\n      heroTitle: 'Tempat rilisan");

// Add to EN
content = content.replace("heroTitle: 'Where music", "eyebrow: 'About Habis Rilis',\n      heroTitle: 'Where music");

fs.writeFileSync(path, content);
