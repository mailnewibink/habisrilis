const fs = require('fs');

let content = fs.readFileSync('src/pages/public/LandingPage.tsx', 'utf-8');

content = content.replace(
  /<Link to="\/examples" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">Example<\/Link>/g,
  '<Link to="/about" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">About</Link>\n             <Link to="/examples" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">Example</Link>'
);

fs.writeFileSync('src/pages/public/LandingPage.tsx', content);
