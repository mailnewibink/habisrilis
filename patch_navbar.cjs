const fs = require('fs');
let content = fs.readFileSync('src/components/layout/PublicNavbar.tsx', 'utf-8');
const oldLinks = `           <Link to="/what" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">What</Link>
           <Link to="/why" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">Why</Link>
           <Link to="/how" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">How</Link>`;
const newLinks = `           <Link to="/about" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">{t('nav.about')}</Link>
           <Link to="/pricing" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">{t('nav.pricing')}</Link>`;
content = content.replace(oldLinks, newLinks);
fs.writeFileSync('src/components/layout/PublicNavbar.tsx', content);
