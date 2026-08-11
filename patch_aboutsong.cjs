const fs = require('fs');

let content = fs.readFileSync('src/components/release/AboutSong.tsx', 'utf-8');

if (!content.includes('useLanguage')) {
  content = content.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';"
  );
  content = content.replace(
    "export const AboutSong = ({ text, visible }: { text?: string; visible: boolean }) => {",
    "export const AboutSong = ({ text, visible }: { text?: string; visible: boolean }) => {\n  const { lang } = useLanguage();\n"
  );
  content = content.replace(
    /About The Song/i,
    "{lang === 'id' ? 'TENTANG LAGU' : 'ABOUT THE SONG'}"
  );
  fs.writeFileSync('src/components/release/AboutSong.tsx', content);
}
