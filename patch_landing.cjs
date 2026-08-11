const fs = require('fs');

let landing = fs.readFileSync('src/pages/public/LandingPage.tsx', 'utf-8');

// replace <header> ... </header> with <PublicNavbar />
// First I need to import PublicNavbar
if (!landing.includes('PublicNavbar')) {
  landing = landing.replace(
    "import { VerifiedBadge } from '../../components/ui/VerifiedBadge';",
    "import { VerifiedBadge } from '../../components/ui/VerifiedBadge';\nimport { PublicNavbar } from '../../components/layout/PublicNavbar';"
  );
  
  const headerStart = landing.indexOf('<header');
  const headerEnd = landing.indexOf('</header>') + '</header>'.length;
  if (headerStart !== -1 && headerEnd !== -1) {
    landing = landing.slice(0, headerStart) + '<PublicNavbar />' + landing.slice(headerEnd);
  }
  
  fs.writeFileSync('src/pages/public/LandingPage.tsx', landing);
}
