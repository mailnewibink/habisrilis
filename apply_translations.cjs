const fs = require('fs');


function applyTranslation(file, search, replacement) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        content = content.replace(search, replacement);
        fs.writeFileSync(file, content);
    }
}

// PublicNavbar.tsx
const navFile = 'src/components/layout/PublicNavbar.tsx';
let navContent = fs.readFileSync(navFile, 'utf-8');
// Replace the hardcoded translations inside PublicNavbar with the t() function
navContent = navContent.replace(/const translations = \{[\s\S]*?\};\n/, '');
navContent = navContent.replace(/const t = translations\[lang as keyof typeof translations\];/, 'const { t } = useLanguage();');
navContent = navContent.replace(/t\.searchPlaceholder/g, "t('nav.searchPlaceholder')");
navContent = navContent.replace(/t\.artists/g, "t('nav.artists')");
navContent = navContent.replace(/t\.releases/g, "t('nav.releases')");
navContent = navContent.replace(/t\.noResults/g, "t('nav.noResults')");
navContent = navContent.replace(/t\.what/g, "t('nav.what')");
navContent = navContent.replace(/t\.why/g, "t('nav.why')");
navContent = navContent.replace(/t\.how/g, "t('nav.how')");
navContent = navContent.replace(/t\.about/g, "t('nav.about')");
navContent = navContent.replace(/t\.dashboard/g, "t('nav.dashboard')");
navContent = navContent.replace(/t\.completeSetup/g, "t('nav.completeSetup')");
navContent = navContent.replace(/t\.signIn/g, "t('nav.signIn')");
fs.writeFileSync(navFile, navContent);

// LandingPage.tsx
const landingFile = 'src/pages/public/LandingPage.tsx';
let landingContent = fs.readFileSync(landingFile, 'utf-8');
landingContent = landingContent.replace(/const translations = \{[\s\S]*?\};\n/, '');
landingContent = landingContent.replace(/const t = translations\[lang as keyof typeof translations\];/, 'const { t } = useLanguage();');
landingContent = landingContent.replace(/\{lang === 'id' \? 'Setiap lagu' : 'Every song'\}/g, "{t('landing.titleLine1')}");
landingContent = landingContent.replace(/Every song/g, "{t('landing.titleLine1')}");
landingContent = landingContent.replace(/deserves its/g, "{t('landing.titleLine2')}");
landingContent = landingContent.replace(/own page\./g, "{t('landing.titleLine3')}");
landingContent = landingContent.replace(/\{t\.subtitle\}/g, "{t('landing.subtitle')}");
landingContent = landingContent.replace(/Go to Dashboard/g, "{t('landing.goToDashboard')}");
landingContent = landingContent.replace(/Complete Setup/g, "{t('landing.completeSetup')}");
landingContent = landingContent.replace(/Sign in with Google/g, "{t('landing.signInWithGoogle')}");
landingContent = landingContent.replace(/See Example/g, "{t('landing.seeExample')}");
landingContent = landingContent.replace(/Featured Release/g, "{t('landing.featuredRelease')}");
landingContent = landingContent.replace(/No featured release/g, "{t('landing.noFeaturedRelease')}");
landingContent = landingContent.replace(/Trending Releases/g, "{t('landing.trendingReleases')}");
landingContent = landingContent.replace(/New Releases/g, "{t('landing.newReleases')}");
landingContent = landingContent.replace(/Verified Artists/g, "{t('landing.verifiedArtists')}");
landingContent = landingContent.replace(/Recent Artists/g, "{t('landing.recentArtists')}");
fs.writeFileSync(landingFile, landingContent);

// WhatPage.tsx
const whatFile = 'src/pages/public/WhatPage.tsx';
let whatContent = fs.readFileSync(whatFile, 'utf-8');
if (!whatContent.includes('useLanguage')) {
  whatContent = whatContent.replace("import React, { useEffect } from 'react';", "import React, { useEffect } from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");
  whatContent = whatContent.replace("export const WhatPage = () => {", "export const WhatPage = () => {\n  const { t } = useLanguage();");
}
whatContent = whatContent.replace(/What is Habis Rilis\?/g, "{t('what.title')}");
whatContent = whatContent.replace(/"Musikmu sudah rilis\.<br \/>Sekarang, kasih tempat untuk ditemui\."/g, "\"<span dangerouslySetInnerHTML={{ __html: t('what.h1') }} />\"");
whatContent = whatContent.replace(/Habis Rilis adalah ruang untuk menemukan, membagikan, dan mengikuti rilisan musik dari berbagai artis dalam satu tempat\./g, "{t('what.p1')}");
whatContent = whatContent.replace(/01 — Release Page/g, "{t('what.step1')}");
whatContent = whatContent.replace(/Setiap rilisan punya halaman sendiri yang berisi artwork, cerita tentang lagu, Spotify, platform streaming, dan informasi lainnya\./g, "{t('what.step1desc')}");
whatContent = whatContent.replace(/02 — Discover/g, "{t('what.step2')}");
whatContent = whatContent.replace(/Pendengar bisa menemukan artis dan rilisan baru tanpa harus sudah mengenal nama artisnya\./g, "{t('what.step2desc')}");
whatContent = whatContent.replace(/03 — Follow/g, "{t('what.step3')}");
whatContent = whatContent.replace(/Pendengar bisa mengikuti artis yang mereka suka dan mendapatkan rilisan terbaru mereka\./g, "{t('what.step3desc')}");
whatContent = whatContent.replace(/04 — One Place/g, "{t('what.step4')}");
whatContent = whatContent.replace(/Satu tempat untuk artis membagikan rilisan dan pendengar menemukan musik baru\./g, "{t('what.step4desc')}");
whatContent = whatContent.replace(/>Explore Habis Rilis</g, ">{t('what.explore')}<");
whatContent = whatContent.replace(/>Create Your Release Page</g, ">{t('what.createPage')}<");
whatContent = whatContent.replace(/habisrilis\.web\.id © 2026 — Made for Music/, "{t('common.footer')}");
fs.writeFileSync(whatFile, whatContent);

// WhyPage.tsx
const whyFile = 'src/pages/public/WhyPage.tsx';
let whyContent = fs.readFileSync(whyFile, 'utf-8');
if (!whyContent.includes('useLanguage')) {
  whyContent = whyContent.replace("import React, { useEffect } from 'react';", "import React, { useEffect } from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");
  whyContent = whyContent.replace("export const WhyPage = () => {", "export const WhyPage = () => {\n  const { t } = useLanguage();");
}
whyContent = whyContent.replace(/Why Habis Rilis\?/g, "{t('why.title')}");
whyContent = whyContent.replace(/"Karena merilis lagu seharusnya bukan akhir dari cerita\."/g, "\"{t('why.h1')}\"");
whyContent = whyContent.replace(/"Ketika sebuah lagu dirilis, perjalanan sebenarnya baru dimulai\."/g, "\"{t('why.p1')}\"");
whyContent = whyContent.replace(/Banyak artis independen merilis musik melalui berbagai platform streaming\. Namun setelah dirilis:/g, "{t('why.problemIntro')}");
whyContent = whyContent.replace(/Pendengar mungkin tidak tahu lagu itu ada\./g, "{t('why.problem1')}");
whyContent = whyContent.replace(/Konteks penting dan cerita tentang lagu seringkali hilang\./g, "{t('why.problem2')}");
whyContent = whyContent.replace(/Link tersebar di berbagai platform tanpa tempat sentral\./g, "{t('why.problem3')}");
whyContent = whyContent.replace(/Menemukan musik independen baru bisa menjadi hal yang sulit\./g, "{t('why.problem4')}");
whyContent = whyContent.replace(/Rilisan bukan cuma sebuah link\./g, "{t('why.notJustLinkTitle')}");
whyContent = whyContent.replace(/Sebuah lagu punya cerita\.<br \/>\s*Ada proses di baliknya\.<br \/>\s*Ada artwork\.<br \/>\s*Ada orang yang membuatnya\.<br \/>\s*Dan ada pendengar yang mungkin sedang mencari lagu itu\./g, "<span dangerouslySetInnerHTML={{ __html: t('why.notJustLinkDesc') }} />");
whyContent = whyContent.replace(/Untuk Artis/g, "{t('why.forArtistTitle')}");
whyContent = whyContent.replace(/Memberikan artis tempat yang sederhana untuk mempresentasikan rilisan mereka, membuatnya lebih mudah untuk dibagikan, dan membangun koneksi langsung dengan pendengar\./g, "{t('why.forArtistDesc')}");
whyContent = whyContent.replace(/Untuk Pendengar/g, "{t('why.forListenerTitle')}");
whyContent = whyContent.replace(/Memberikan pendengar cara yang lebih mudah untuk menemukan artis baru, mengikuti perkembangan mereka, dan tidak ketinggalan rilisan terbaru\./g, "{t('why.forListenerDesc')}");
whyContent = whyContent.replace(/Lebih dari sekadar link\.<br \/>\s*Lebih dekat dengan musiknya\./g, "<span dangerouslySetInnerHTML={{ __html: t('why.closerTitle') }} />");
whyContent = whyContent.replace(/>Temukan Rilisan</g, ">{t('why.cta')}<");
whyContent = whyContent.replace(/habisrilis\.web\.id © 2026 — Made for Music/, "{t('common.footer')}");
fs.writeFileSync(whyFile, whyContent);

// HowPage.tsx
const howFile = 'src/pages/public/HowPage.tsx';
let howContent = fs.readFileSync(howFile, 'utf-8');
if (!howContent.includes('useLanguage')) {
  howContent = howContent.replace("import React, { useEffect } from 'react';", "import React, { useEffect } from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");
  howContent = howContent.replace("export const HowPage = () => {", "export const HowPage = () => {\n  const { t } = useLanguage();");
}
howContent = howContent.replace(/How Habis Rilis Works/g, "{t('how.title')}");
howContent = howContent.replace(/"Sesederhana itu\."/g, "\"{t('how.h1')}\"");
howContent = howContent.replace(/01 — Create/g, "{t('how.step1')}");
howContent = howContent.replace(/Artis membuat halaman untuk rilisan mereka\./g, "{t('how.step1Title')}");
howContent = howContent.replace(/02 — Share/g, "{t('how.step2')}");
howContent = howContent.replace(/Bagikan satu link ke mana saja\./g, "{t('how.step2Title')}");
howContent = howContent.replace(/Halaman rilisan menjadi destinasi sentral untuk semua pendengar, dari platform mana pun mereka berasal\./g, "{t('how.step2Desc')}");
howContent = howContent.replace(/03 — Discover/g, "{t('how.step3')}");
howContent = howContent.replace(/Pendengar membuka rilisan, mengenal artisnya, lalu mengikuti jika mereka suka\./g, "{t('how.step3Title')}");
howContent = howContent.replace(/Fan Experience/g, "{t('how.fanExpTitle')}");
howContent = howContent.replace(/Setelah mengikuti artis, rilisan terbaru mereka bisa ditemukan kembali dari Fan Dashboard\./g, "{t('how.fanExpDesc')}");
howContent = howContent.replace(/Artist Experience/g, "{t('how.artistExpTitle')}");
howContent = howContent.replace(/Artis juga memiliki dashboard untuk mengelola profil dan rilisan mereka dengan mudah\./g, "{t('how.artistExpDesc')}");
howContent = howContent.replace(/Musik bertemu orang yang tepat\./g, "{t('how.outroTitle')}");
howContent = howContent.replace(/>Start with Habis Rilis</g, ">{t('how.cta')}<");
howContent = howContent.replace(/habisrilis\.web\.id © 2026 — Made for Music/, "{t('common.footer')}");
fs.writeFileSync(howFile, howContent);

// ExamplesShowcase.tsx
const exFile = 'src/pages/public/ExamplesShowcase.tsx';
let exContent = fs.readFileSync(exFile, 'utf-8');
exContent = exContent.replace(/const translations = \{[\s\S]*?\};\n/, '');
exContent = exContent.replace(/const t = translations\[lang as keyof typeof translations\];/, 'const { t } = useLanguage();');
exContent = exContent.replace(/t\.back/g, "t('common.back')");
exContent = exContent.replace(/t\.title/g, "t('examples.title')");
exContent = exContent.replace(/t\.subtitle/g, "t('examples.subtitle')");
exContent = exContent.replace(/t\.desc/g, "t('examples.desc')");
exContent = exContent.replace(/t\.noExamples/g, "t('examples.noExamples')");
fs.writeFileSync(exFile, exContent);

// ArtistProfile.tsx
const artistFile = 'src/pages/public/ArtistProfile.tsx';
let artistContent = fs.readFileSync(artistFile, 'utf-8');
artistContent = artistContent.replace(/const translations = \{[\s\S]*?\};\n/, '');
artistContent = artistContent.replace(/const t = translations\[lang as keyof typeof translations\];/, 'const { t } = useLanguage();');
artistContent = artistContent.replace(/t\.notFoundTitle/g, "t('artist.notFoundTitle')");
artistContent = artistContent.replace(/t\.notFoundDesc/g, "t('artist.notFoundDesc')");
artistContent = artistContent.replace(/t\.returnHome/g, "t('common.returnHome')");
artistContent = artistContent.replace(/t\.releases/g, "t('artist.releases')");
artistContent = artistContent.replace(/t\.about/g, "t('artist.about')");
artistContent = artistContent.replace(/t\.follow/g, "t('common.follow')");
fs.writeFileSync(artistFile, artistContent);

// ReleasePage.tsx
const releaseFile = 'src/pages/public/ReleasePage.tsx';
let releaseContent = fs.readFileSync(releaseFile, 'utf-8');
releaseContent = releaseContent.replace(/const translations = \{[\s\S]*?\};\n/, '');
releaseContent = releaseContent.replace(/const t = translations\[lang as keyof typeof translations\];/, 'const { t } = useLanguage();');
releaseContent = releaseContent.replace(/t\.notFoundTitle/g, "t('release.notFoundTitle')");
releaseContent = releaseContent.replace(/t\.notFoundDesc/g, "t('release.notFoundDesc')");
releaseContent = releaseContent.replace(/t\.returnArtist/g, "t('release.returnArtist')");
releaseContent = releaseContent.replace(/t\.returnHome/g, "t('common.returnHome')");
releaseContent = releaseContent.replace(/t\.youtubeVideo/g, "t('release.youtubeVideo')");
fs.writeFileSync(releaseFile, releaseContent);

// NotFound.tsx
const notFoundFile = 'src/pages/public/NotFound.tsx';
let notFoundContent = fs.readFileSync(notFoundFile, 'utf-8');
notFoundContent = notFoundContent.replace(/\{lang === 'id' \? 'Halaman yang Anda cari tidak ada\.' : 'The page you\\'re looking for doesn\\'t exist\.'\}/g, "{t('notfound.desc')}");
notFoundContent = notFoundContent.replace(/\{lang === 'id' \? 'Kembali ke Beranda' : 'Return Home'\}/g, "{t('common.returnHome')}");
fs.writeFileSync(notFoundFile, notFoundContent);

// ReleaseCard.tsx
const rcFile = 'src/components/release/ReleaseCard.tsx';
let rcContent = fs.readFileSync(rcFile, 'utf-8');
if (!rcContent.includes('const { t } = useLanguage();')) {
  rcContent = rcContent.replace("const { lang } = useLanguage();", "const { t } = useLanguage();");
}
rcContent = rcContent.replace(/\{lang === 'id' \? 'Dengarkan' : 'Listen Now'\}/g, "{t('common.listenNow')}");
fs.writeFileSync(rcFile, rcContent);

// ArtistCard.tsx
const acFile = 'src/components/release/ArtistCard.tsx';
let acContent = fs.readFileSync(acFile, 'utf-8');
if (!acContent.includes('useLanguage')) {
  acContent = acContent.replace("import React from 'react';", "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");
  acContent = acContent.replace("export const ArtistCard = ({ artist }: ArtistCardProps) => {", "export const ArtistCard = ({ artist }: ArtistCardProps) => {\n  const { t } = useLanguage();");
}
acContent = acContent.replace(/>\s*Open Profile\s*<\/span>/, "> {t('common.openProfile')} </span>");
fs.writeFileSync(acFile, acContent);

// ArtistHeader.tsx
const ahFile = 'src/components/release/ArtistHeader.tsx';
let ahContent = fs.readFileSync(ahFile, 'utf-8');
if (!ahContent.includes('useLanguage')) {
  ahContent = ahContent.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");
  ahContent = ahContent.replace("export const ArtistHeader = ({ artist, showFollow = false }: { artist: Artist, showFollow?: boolean }) => {", "export const ArtistHeader = ({ artist, showFollow = false }: { artist: Artist, showFollow?: boolean }) => {\n  const { t } = useLanguage();");
}
ahContent = ahContent.replace(/>Unfollow</g, ">{t('common.unfollow')}<");
ahContent = ahContent.replace(/>Following</g, ">{t('common.following')}<");
ahContent = ahContent.replace(/>Follow</g, ">{t('common.follow')}<");
ahContent = ahContent.replace(/\{followers !== null \? \`\$\{followers\} Followers\` : ''\}/g, "{followers !== null ? `${followers} ${t('common.followers')}` : ''}");
fs.writeFileSync(ahFile, ahContent);

// LatestReleaseCard.tsx
const lrcFile = 'src/components/release/LatestReleaseCard.tsx';
let lrcContent = fs.readFileSync(lrcFile, 'utf-8');
if (!lrcContent.includes('useLanguage')) {
  lrcContent = lrcContent.replace("import React from 'react';", "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");
  lrcContent = lrcContent.replace("export const LatestReleaseCard = ({ release, artistUsername }: { release: Release; artistUsername: string }) => {", "export const LatestReleaseCard = ({ release, artistUsername }: { release: Release; artistUsername: string }) => {\n  const { t } = useLanguage();");
}
lrcContent = lrcContent.replace(/>Latest Release<\/h2>/g, ">{t('release.latestRelease')}</h2>");
lrcContent = lrcContent.replace(/>Listen Now<\/Button>/g, ">{t('common.listenNow')}</Button>");
fs.writeFileSync(lrcFile, lrcContent);

// ReleaseGallery.tsx
const rgFile = 'src/components/release/ReleaseGallery.tsx';
let rgContent = fs.readFileSync(rgFile, 'utf-8');
if (!rgContent.includes('useLanguage')) {
  rgContent = rgContent.replace("import React from 'react';", "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");
  rgContent = rgContent.replace("export const ReleaseGallery = ({ releases, artistName, artistUsername }: { releases: Release[], artistName: string, artistUsername: string }) => {", "export const ReleaseGallery = ({ releases, artistName, artistUsername }: { releases: Release[], artistName: string, artistUsername: string }) => {\n  const { t } = useLanguage();");
}
rgContent = rgContent.replace(/>Other Releases<\/h2>/g, ">{t('release.otherReleases')}</h2>");
fs.writeFileSync(rgFile, rgContent);

// ShareActions.tsx
const shareFile = 'src/components/release/ShareActions.tsx';
let shareContent = fs.readFileSync(shareFile, 'utf-8');
if (!shareContent.includes('const { t }')) {
  shareContent = shareContent.replace("const { lang } = useLanguage();", "const { t } = useLanguage();");
}
shareContent = shareContent.replace(/\{lang === 'id' \? 'Bagikan rilisan ini' : 'Share this release'\}/g, "{t('release.shareRelease')}");
shareContent = shareContent.replace(/\{copied \? \(lang === 'id' \? 'Tersalin!' : 'Copied!'\) : \(lang === 'id' \? 'Salin Tautan' : 'Copy Link'\)\}/g, "{copied ? t('common.copied') : t('common.copyLink')}");
shareContent = shareContent.replace(/\{lang === 'id' \? 'Bagikan' : 'Share'\}/g, "{t('common.share')}");
fs.writeFileSync(shareFile, shareContent);

// FollowingArtistCard.tsx
const facFile = 'src/components/release/FollowingArtistCard.tsx';
let facContent = fs.readFileSync(facFile, 'utf-8');
if (!facContent.includes('const { t }')) {
  facContent = facContent.replace("const { lang } = useLanguage();", "const { t } = useLanguage();");
}
facContent = facContent.replace(/\{followers !== null \? \(lang === 'id' \? \`\$\{followers\} Pengikut\` : \`\$\{followers\} Followers\`\) : ''\}/g, "{followers !== null ? `${followers} ${t('common.followers')}` : ''}");
fs.writeFileSync(facFile, facContent);

// StreamingLinks.tsx
const streamFile = 'src/components/release/StreamingLinks.tsx';
let streamContent = fs.readFileSync(streamFile, 'utf-8');
if (!streamContent.includes('const { t }')) {
  streamContent = streamContent.replace("const { lang } = useLanguage();", "const { t } = useLanguage();");
}
streamContent = streamContent.replace(/\{lang === 'id' \? 'Dengarkan di' : 'Listen on'\}/g, "{t('release.listenOn')}");
streamContent = streamContent.replace(/\{lang === 'id' \? 'Putar' : 'Play'\}/g, "{t('release.play')}");
fs.writeFileSync(streamFile, streamContent);

// SpotifyEmbed.tsx
const spotFile = 'src/components/release/SpotifyEmbed.tsx';
let spotContent = fs.readFileSync(spotFile, 'utf-8');
if (!spotContent.includes('const { t }')) {
  spotContent = spotContent.replace("const { lang } = useLanguage();", "const { t } = useLanguage();");
}
spotContent = spotContent.replace(/\{lang === 'id' \? 'Pratinjau Spotify akan muncul di sini\.' : 'Spotify preview will appear here\.'\}/g, "{t('release.spotifyPreview')}");
spotContent = spotContent.replace(/\{lang === 'id' \? 'Pratinjau Spotify tidak tersedia' : 'Spotify preview unavailable'\}/g, "{t('release.spotifyUnavailable')}");
fs.writeFileSync(spotFile, spotContent);

// YouTubeEmbed.tsx
const ytFile = 'src/components/release/YouTubeEmbed.tsx';
let ytContent = fs.readFileSync(ytFile, 'utf-8');
if (!ytContent.includes('const { t }')) {
  ytContent = ytContent.replace("const { lang } = useLanguage();", "const { t } = useLanguage();");
}
ytContent = ytContent.replace(/\{lang === 'id' \? 'URL YouTube Tidak Valid' : 'Invalid YouTube URL'\}/g, "{t('release.invalidYoutube')}");
fs.writeFileSync(ytFile, ytContent);

// AboutSong.tsx
const asFile = 'src/components/release/AboutSong.tsx';
let asContent = fs.readFileSync(asFile, 'utf-8');
if (!asContent.includes('const { t }')) {
  asContent = asContent.replace("const { lang } = useLanguage();", "const { t } = useLanguage();");
}
asContent = asContent.replace(/\{lang === 'id' \? 'TENTANG LAGU' : 'ABOUT THE SONG'\}/g, "{t('release.aboutSong')}");
fs.writeFileSync(asFile, asContent);


