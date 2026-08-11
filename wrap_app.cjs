const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appContent.includes('LanguageWrapper')) {
  appContent = appContent.replace(
    "import { LanguageProvider } from './contexts/LanguageContext';",
    "import { LanguageProvider } from './contexts/LanguageContext';\nimport { LanguageWrapper } from './components/layout/LanguageWrapper';"
  );

  appContent = appContent.replace(
    "<BrowserRouter>",
    "<LanguageWrapper>\n        <BrowserRouter>"
  );

  appContent = appContent.replace(
    "</BrowserRouter>",
    "</BrowserRouter>\n        </LanguageWrapper>"
  );
  fs.writeFileSync('src/App.tsx', appContent);
}
