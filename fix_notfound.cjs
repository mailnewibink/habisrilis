const fs = require('fs');
let content = fs.readFileSync('src/pages/public/NotFound.tsx', 'utf-8');
if (!content.includes('useLanguage')) {
  content = content.replace("import React", "import { useLanguage } from '../../contexts/LanguageContext';\nimport React");
  content = content.replace("export const NotFound = () => {", "export const NotFound = () => {\n  const { t } = useLanguage();");
}
fs.writeFileSync('src/pages/public/NotFound.tsx', content);
