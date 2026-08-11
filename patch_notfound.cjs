const fs = require('fs');
let content = fs.readFileSync('src/pages/public/NotFound.tsx', 'utf-8');
if (!content.includes('useLanguage')) {
  content = content.replace(
    "import { Link } from 'react-router-dom';",
    "import { Link } from 'react-router-dom';\nimport { useLanguage } from '../../contexts/LanguageContext';"
  );
  content = content.replace(
    "export const NotFound = () => {",
    "export const NotFound = () => {\n  const { lang } = useLanguage();\n"
  );
  content = content.replace(
    />The page you're looking for doesn't exist\.<\/p>/,
    ">{lang === 'id' ? 'Halaman yang Anda cari tidak ada.' : 'The page you\\'re looking for doesn\\'t exist.'}</p>"
  );
  content = content.replace(
    /\s*Return Home\s*<\/Link>/,
    "\n        {lang === 'id' ? 'Kembali ke Beranda' : 'Return Home'}\n      </Link>"
  );
  fs.writeFileSync('src/pages/public/NotFound.tsx', content);
}
