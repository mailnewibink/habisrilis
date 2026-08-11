const fs = require('fs');
let landing = fs.readFileSync('src/pages/public/LandingPage.tsx', 'utf-8');

landing = landing.replace(
  "about: 'About',",
  "what: 'What',\n    why: 'Why',\n    how: 'How',\n    about: 'About',"
);
landing = landing.replace(
  "about: 'Tentang',",
  "what: 'Apa',\n    why: 'Kenapa',\n    how: 'Bagaimana',\n    about: 'Tentang',"
);

landing = landing.replace(
  /<Link to="\/about" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">\{t.about\}<\/Link>/,
  `<Link to="/what" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">{t.what}</Link>
             <Link to="/why" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">{t.why}</Link>
             <Link to="/how" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">{t.how}</Link>`
);

fs.writeFileSync('src/pages/public/LandingPage.tsx', landing);
