const fs = require('fs');

// 1. Fix LandingPage.tsx
let landingPath = 'src/pages/public/LandingPage.tsx';
if (fs.existsSync(landingPath)) {
  let landingContent = fs.readFileSync(landingPath, 'utf8');
  landingContent = landingContent.replace('Create a professional Release Page for your music, complete with artwork, Spotify preview, and streaming links.', '{t(\'landing.subtitle\')}');
  fs.writeFileSync(landingPath, landingContent);
}

// 2. Fix LanguageContext.tsx
let langCtxPath = 'src/contexts/LanguageContext.tsx';
if (fs.existsSync(langCtxPath)) {
  let langCtxContent = fs.readFileSync(langCtxPath, 'utf8');
  langCtxContent = langCtxContent.replace("return (saved === 'id' || saved === 'en') ? saved as Language : 'id';", "return (saved === 'id' || saved === 'en') ? saved as Language : 'en';");
  langCtxContent = langCtxContent.replace("lang: 'id',", "lang: 'en',");
  fs.writeFileSync(langCtxPath, langCtxContent);
}

// 3. Fix AboutPage.tsx Eyebrow
let aboutPath = 'src/pages/public/AboutPage.tsx';
if (fs.existsSync(aboutPath)) {
  let aboutContent = fs.readFileSync(aboutPath, 'utf8');
  // replace ABOUT HABIS RILIS with {t('aboutPage.eyebrow')}
  aboutContent = aboutContent.replace('>ABOUT HABIS RILIS<', '>{t(\'aboutPage.eyebrow\')}<');
  fs.writeFileSync(aboutPath, aboutContent);
}
