const fs = require('fs');
let landing = fs.readFileSync('src/pages/public/LandingPage.tsx', 'utf-8');

// I will just create three pages with a simpler header if it's too complex, or I can extract it.
// Let's see how much state is in LandingPage.tsx.
