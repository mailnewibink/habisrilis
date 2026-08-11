const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace("import { WhatPage } from './pages/public/WhatPage';", "import { AboutPage } from './pages/public/AboutPage';\nimport { PricingPage } from './pages/public/PricingPage';");
content = content.replace("import { WhyPage } from './pages/public/WhyPage';\n", "");
content = content.replace("import { HowPage } from './pages/public/HowPage';\n", "");

content = content.replace("<Route path=\"/what\" element={<WhatPage />} />", "<Route path=\"/about\" element={<AboutPage />} />\n          <Route path=\"/pricing\" element={<PricingPage />} />");
content = content.replace("          <Route path=\"/why\" element={<WhyPage />} />\n", "");
content = content.replace("          <Route path=\"/how\" element={<HowPage />} />\n", "");

fs.writeFileSync('src/App.tsx', content);
