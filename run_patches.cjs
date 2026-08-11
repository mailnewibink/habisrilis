const fs = require('fs');

// App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appContent.includes('LanguageProvider')) {
  appContent = appContent.replace(
    "import { AuthProvider } from './auth/AuthContext';",
    "import { AuthProvider } from './auth/AuthContext';\nimport { LanguageProvider } from './contexts/LanguageContext';"
  );
  appContent = appContent.replace(
    "<BrowserRouter>",
    "<LanguageProvider>\n      <BrowserRouter>"
  );
  appContent = appContent.replace(
    "</BrowserRouter>",
    "</BrowserRouter>\n      </LanguageProvider>"
  );
  fs.writeFileSync('src/App.tsx', appContent);
}

// LandingPage.tsx
let landingContent = fs.readFileSync('src/pages/public/LandingPage.tsx', 'utf-8');
if (!landingContent.includes('useLanguage')) {
  landingContent = landingContent.replace(
    "import { Search, Play, ArrowRight, Loader2 } from 'lucide-react';",
    "import { Search, Play, ArrowRight, Loader2 } from 'lucide-react';\nimport { useLanguage } from '../../contexts/LanguageContext';\nimport { LanguageToggle } from '../../components/LanguageToggle';"
  );
  const landingTDict = `
const translations = {
  en: {
    searchPlaceholder: 'Search artists & releases...',
    artists: 'Artists',
    releases: 'Releases',
    noResults: 'No artists or releases found.',
    tryAnother: 'Try another keyword.',
    about: 'About',
    example: 'Example',
    dashboard: 'Dashboard',
    completeSetup: 'Complete Setup',
    signIn: 'Sign In',
    oneLink: 'One Link.',
    everythingConnected: 'Everything Connected.',
    subtitle: 'The simplest way for artists to share their music. Create a single page with your artwork, streaming links, social profiles, and credits.',
    createRelease: 'Create Your Release',
    howItWorks: 'How it works',
    exampleReleases: 'Example Releases',
    viewAll: 'View All Examples',
    ctaTitle: 'Create your free release page',
    ctaSub: 'Join other artists who use habisrilis.web.id to share their music with the world.',
    getStarted: 'Get Started Now',
    footer: 'habisrilis.web.id © 2026 — Made for Music'
  },
  id: {
    searchPlaceholder: 'Cari artis & rilisan...',
    artists: 'Artis',
    releases: 'Rilisan',
    noResults: 'Artis atau rilisan tidak ditemukan.',
    tryAnother: 'Coba kata kunci lain.',
    about: 'Tentang',
    example: 'Contoh',
    dashboard: 'Dasbor',
    completeSetup: 'Selesaikan Pengaturan',
    signIn: 'Masuk',
    oneLink: 'Satu Tautan.',
    everythingConnected: 'Semuanya Terhubung.',
    subtitle: 'Cara termudah bagi artis untuk membagikan musik mereka. Buat satu halaman dengan sampul karya seni, tautan streaming, profil media sosial, dan kredit.',
    createRelease: 'Buat Rilisan Anda',
    howItWorks: 'Cara kerja',
    exampleReleases: 'Contoh Rilisan',
    viewAll: 'Lihat Semua Contoh',
    ctaTitle: 'Buat halaman rilisan gratis Anda',
    ctaSub: 'Bergabunglah dengan artis lain yang menggunakan habisrilis.web.id untuk membagikan musik mereka kepada dunia.',
    getStarted: 'Mulai Sekarang',
    footer: 'habisrilis.web.id © 2026 — Dibuat untuk Musik'
  }
};
`;
  landingContent = landingContent.replace(
    "export const LandingPage = () => {",
    landingTDict + "\nexport const LandingPage = () => {\n  const { lang } = useLanguage();\n  const t = translations[lang as keyof typeof translations];"
  );
  landingContent = landingContent.replace(/placeholder="Search artists & releases..."/, 'placeholder={t.searchPlaceholder}');
  landingContent = landingContent.replace(/>Artists<\/div>/g, '>{t.artists}</div>');
  landingContent = landingContent.replace(/>Releases<\/div>/g, '>{t.releases}</div>');
  landingContent = landingContent.replace(/>No artists or releases found\.<\/p>/, '>{t.noResults}</p>');
  landingContent = landingContent.replace(/>Try another keyword\.<\/p>/, '>{t.tryAnother}</p>');
  landingContent = landingContent.replace(
    /<div className="flex items-center gap-4">\s*<Link to="\/about" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">About<\/Link>\s*<Link to="\/examples" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">Example<\/Link>\s*<Button variant="outline" size="sm" onClick=\{handleLogin\} disabled=\{isLoggingIn\}>\s*\{isLoggingIn \? <Loader2 className="w-4 h-4 animate-spin" \/> : user \? \(effectiveAccountType \? 'Dashboard' : 'Complete Setup'\) : 'Sign In'\}\s*<\/Button>\s*<\/div>/,
    `<div className="flex items-center gap-4">
             <LanguageToggle />
             <Link to="/about" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">{t.about}</Link>
             <Link to="/examples" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">{t.example}</Link>
             <Button variant="outline" size="sm" onClick={handleLogin} disabled={isLoggingIn}>
               {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : user ? (effectiveAccountType ? t.dashboard : t.completeSetup) : t.signIn}
             </Button>
          </div>`
  );
  landingContent = landingContent.replace(/One Link\./g, '{t.oneLink}');
  landingContent = landingContent.replace(/Everything Connected\./g, '{t.everythingConnected}');
  landingContent = landingContent.replace(/>The simplest way for artists to share their music\. Create a single page with your artwork, streaming links, social profiles, and credits\.<\/p>/g, '>{t.subtitle}</p>');
  landingContent = landingContent.replace(/>Create Your Release<\/Button>/g, '>{t.createRelease}</Button>');
  landingContent = landingContent.replace(/>How it works<\/Link>/g, '>{t.howItWorks}</Link>');
  landingContent = landingContent.replace(/>Example Releases<\/h2>/g, '>{t.exampleReleases}</h2>');
  landingContent = landingContent.replace(/>View All Examples<\/Link>/g, '>{t.viewAll}</Link>');
  landingContent = landingContent.replace(/>Create your free release page<\/h2>/g, '>{t.ctaTitle}</h2>');
  landingContent = landingContent.replace(/>Join other artists who use habisrilis\.web\.id to share their music with the world\.<\/p>/g, '>{t.ctaSub}</p>');
  landingContent = landingContent.replace(/>Get Started Now<\/Button>/g, '>{t.getStarted}</Button>');
  landingContent = landingContent.replace(/habisrilis\.web\.id © 2026 — Made for Music/, '{t.footer}');
  fs.writeFileSync('src/pages/public/LandingPage.tsx', landingContent);
}

// AboutPage.tsx
let aboutContent = fs.readFileSync('src/pages/public/AboutPage.tsx', 'utf-8');
if (!aboutContent.includes('useLanguage')) {
  aboutContent = aboutContent.replace(
    "import React, { useState } from 'react';",
    "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';\nimport { LanguageToggle } from '../../components/LanguageToggle';"
  );
  aboutContent = aboutContent.replace("type Language = 'en' | 'id';", "");
  aboutContent = aboutContent.replace(
    "const [lang, setLang] = useState<Language>('en');",
    "const { lang } = useLanguage();"
  );
  aboutContent = aboutContent.replace(
    /<div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">[\s\S]*?<\/div>/,
    '<LanguageToggle />'
  );
  fs.writeFileSync('src/pages/public/AboutPage.tsx', aboutContent);
}

// ExamplesShowcase.tsx
let examplesContent = fs.readFileSync('src/pages/public/ExamplesShowcase.tsx', 'utf-8');
if (!examplesContent.includes('useLanguage')) {
  examplesContent = examplesContent.replace(
    "import { supabase } from '../../lib/supabase';",
    "import { supabase } from '../../lib/supabase';\nimport { useLanguage } from '../../contexts/LanguageContext';\nimport { LanguageToggle } from '../../components/LanguageToggle';"
  );
  const examplesTDict = `
const translations = {
  en: {
    back: 'Back to Home',
    title: 'Example Releases',
    subtitle: 'See habisrilis.web.id in Action',
    desc: 'Explore these demo releases to see how your music can look on habisrilis.web.id.',
    noExamples: 'No examples found.'
  },
  id: {
    back: 'Kembali',
    title: 'Contoh Rilisan',
    subtitle: 'Lihat habisrilis.web.id Beraksi',
    desc: 'Jelajahi contoh rilisan ini untuk melihat bagaimana musik Anda dapat terlihat di habisrilis.web.id.',
    noExamples: 'Tidak ada contoh ditemukan.'
  }
};
`;
  examplesContent = examplesContent.replace(
    "export const ExamplesShowcase = () => {",
    examplesTDict + "\nexport const ExamplesShowcase = () => {\n  const { lang } = useLanguage();\n  const t = translations[lang as keyof typeof translations];"
  );
  examplesContent = examplesContent.replace(
    />\s*Back to Home\s*<\/Link>/g,
    '>\n           <ArrowLeft className="w-4 h-4" />\n           {t.back}\n         </Link>'
  );
  examplesContent = examplesContent.replace(
    />Example Releases<\/h1>/g,
    '>{t.title}</h1>'
  );
  examplesContent = examplesContent.replace(
    />See habisrilis\.web\.id in Action<\/h2>/g,
    '>{t.subtitle}</h2>'
  );
  examplesContent = examplesContent.replace(
    />Explore these demo releases to see how your music can look on habisrilis\.web\.id\.<\/p>/g,
    '>{t.desc}</p>'
  );
  examplesContent = examplesContent.replace(
    />No examples found\.<\/div>/g,
    '>{t.noExamples}</div>'
  );
  examplesContent = examplesContent.replace(
    /<h1 className="text-xl font-bold tracking-tighter uppercase">\{t\.title\}<\/h1>\s*<\/header>/,
    `<h1 className="text-xl font-bold tracking-tighter uppercase">{t.title}</h1>\n         <LanguageToggle />\n      </header>`
  );
  fs.writeFileSync('src/pages/public/ExamplesShowcase.tsx', examplesContent);
}

// ReleasePage.tsx
let releaseContent = fs.readFileSync('src/pages/public/ReleasePage.tsx', 'utf-8');
if (!releaseContent.includes('useLanguage')) {
  releaseContent = releaseContent.replace(
    "import { getReleaseBySlug } from '../../lib/supabase/releases';",
    "import { getReleaseBySlug } from '../../lib/supabase/releases';\nimport { useLanguage } from '../../contexts/LanguageContext';\nimport { LanguageToggle } from '../../components/LanguageToggle';"
  );
  const releaseTDict = `
const translations = {
  en: {
    notFoundTitle: 'Release Not Found',
    notFoundDesc: "The page you're looking for doesn't exist or is no longer available.",
    returnArtist: 'Return to Artist Profile',
    returnHome: 'Return to Home',
    youtubeVideo: 'YOUTUBE VIDEO'
  },
  id: {
    notFoundTitle: 'Rilisan Tidak Ditemukan',
    notFoundDesc: 'Halaman yang Anda cari tidak ada atau tidak lagi tersedia.',
    returnArtist: 'Kembali ke Profil Artis',
    returnHome: 'Kembali ke Beranda',
    youtubeVideo: 'VIDEO YOUTUBE'
  }
};
`;
  releaseContent = releaseContent.replace(
    "export const ReleasePage = () => {",
    releaseTDict + "\nexport const ReleasePage = () => {\n  const { lang } = useLanguage();\n  const t = translations[lang as keyof typeof translations];"
  );
  releaseContent = releaseContent.replace(/>Release Not Found<\/h1>/g, '>{t.notFoundTitle}</h1>');
  releaseContent = releaseContent.replace(/>The page you're looking for doesn't exist or is no longer available\.<\/p>/g, '>{t.notFoundDesc}</p>');
  releaseContent = releaseContent.replace(/>\s*Return to Artist Profile\s*<\/Link>/g, '>\n          {t.returnArtist}\n        </Link>');
  releaseContent = releaseContent.replace(/>\s*Return to Home\s*<\/Link>/g, '>\n          {t.returnHome}\n        </Link>');
  releaseContent = releaseContent.replace(/>YOUTUBE VIDEO<\/span>/g, '>{t.youtubeVideo}</span>');
  releaseContent = releaseContent.replace(
    /<div className="flex items-center gap-3">/,
    '<div className="flex items-center gap-3">\n             <LanguageToggle />'
  );
  fs.writeFileSync('src/pages/public/ReleasePage.tsx', releaseContent);
}

// ArtistProfile.tsx
let artistContent = fs.readFileSync('src/pages/public/ArtistProfile.tsx', 'utf-8');
if (!artistContent.includes('useLanguage')) {
  artistContent = artistContent.replace(
    "import { getArtistProfile } from '../../lib/supabase/public';",
    "import { getArtistProfile } from '../../lib/supabase/public';\nimport { useLanguage } from '../../contexts/LanguageContext';\nimport { LanguageToggle } from '../../components/LanguageToggle';"
  );
  const artistTDict = `
const translations = {
  en: {
    notFoundTitle: 'Artist Not Found',
    notFoundDesc: "The artist profile you're looking for doesn't exist.",
    returnHome: 'Return to Home',
    releases: 'Releases',
    about: 'About',
    follow: 'Follow',
    shareProfile: 'Share Profile',
    copied: 'Copied!',
    share: 'Share'
  },
  id: {
    notFoundTitle: 'Artis Tidak Ditemukan',
    notFoundDesc: 'Profil artis yang Anda cari tidak ada.',
    returnHome: 'Kembali ke Beranda',
    releases: 'Rilisan',
    about: 'Tentang',
    follow: 'Ikuti',
    shareProfile: 'Bagikan Profil',
    copied: 'Tersalin!',
    share: 'Bagikan'
  }
};
`;
  artistContent = artistContent.replace(
    "export const ArtistProfile = () => {",
    artistTDict + "\nexport const ArtistProfile = () => {\n  const { lang } = useLanguage();\n  const t = translations[lang as keyof typeof translations];"
  );
  artistContent = artistContent.replace(/>Artist Not Found<\/h1>/g, '>{t.notFoundTitle}</h1>');
  artistContent = artistContent.replace(/>The artist profile you're looking for doesn't exist\.<\/p>/g, '>{t.notFoundDesc}</p>');
  artistContent = artistContent.replace(/>\s*Return to Home\s*<\/Link>/g, '>\n          {t.returnHome}\n        </Link>');
  artistContent = artistContent.replace(/>Releases</g, '>{t.releases}<');
  artistContent = artistContent.replace(/>About</g, '>{t.about}<');
  artistContent = artistContent.replace(/>Follow<\/span>/g, '>{t.follow}</span>');
  
  artistContent = artistContent.replace(
    /<div className="flex items-center gap-3">/,
    '<div className="flex items-center gap-3">\n             <LanguageToggle />'
  );
  fs.writeFileSync('src/pages/public/ArtistProfile.tsx', artistContent);
}

// ReleaseCard.tsx
let rcContent = fs.readFileSync('src/components/release/ReleaseCard.tsx', 'utf-8');
if (!rcContent.includes('useLanguage')) {
  rcContent = rcContent.replace(
    "import { createPortal } from 'react-dom';",
    "import { createPortal } from 'react-dom';\nimport { useLanguage } from '../../contexts/LanguageContext';"
  );
  rcContent = rcContent.replace(
    "const navigate = useNavigate();",
    "const navigate = useNavigate();\n  const { lang } = useLanguage();"
  );
  rcContent = rcContent.replace(
    /Listen Now/,
    "{lang === 'id' ? 'Dengarkan' : 'Listen Now'}"
  );
  fs.writeFileSync('src/components/release/ReleaseCard.tsx', rcContent);
}

