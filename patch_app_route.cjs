const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  "import { ExamplesShowcase } from './pages/public/ExamplesShowcase';",
  "import { ExamplesShowcase } from './pages/public/ExamplesShowcase';\nimport { AboutPage } from './pages/public/AboutPage';"
);

content = content.replace(
  '<Route path="/examples" element={<ExamplesShowcase />} />',
  '<Route path="/about" element={<AboutPage />} />\n          <Route path="/examples" element={<ExamplesShowcase />} />'
);

fs.writeFileSync('src/App.tsx', content);
