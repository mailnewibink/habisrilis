const fs = require('fs');

// SpotifyEmbed.tsx
let spotContent = fs.readFileSync('src/components/release/SpotifyEmbed.tsx', 'utf-8');
if (!spotContent.includes('useLanguage')) {
  spotContent = spotContent.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';"
  );
  spotContent = spotContent.replace(
    "export const SpotifyEmbed = ({ spotifyUrl }: { spotifyUrl?: string }) => {",
    "export const SpotifyEmbed = ({ spotifyUrl }: { spotifyUrl?: string }) => {\n  const { lang } = useLanguage();\n"
  );
  spotContent = spotContent.replace(
    /Spotify preview will appear here\./g,
    "{lang === 'id' ? 'Pratinjau Spotify akan muncul di sini.' : 'Spotify preview will appear here.'}"
  );
  spotContent = spotContent.replace(
    /Spotify preview unavailable/g,
    "{lang === 'id' ? 'Pratinjau Spotify tidak tersedia' : 'Spotify preview unavailable'}"
  );
  fs.writeFileSync('src/components/release/SpotifyEmbed.tsx', spotContent);
}

// StreamingLinks.tsx
let streamContent = fs.readFileSync('src/components/release/StreamingLinks.tsx', 'utf-8');
if (!streamContent.includes('useLanguage')) {
  streamContent = streamContent.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';"
  );
  streamContent = streamContent.replace(
    "export const StreamingLinks = ({ links, children }: { links?: StreamingLink[], children?: React.ReactNode }) => {",
    "export const StreamingLinks = ({ links, children }: { links?: StreamingLink[], children?: React.ReactNode }) => {\n  const { lang } = useLanguage();\n"
  );
  streamContent = streamContent.replace(
    />Listen on<\/h3>/,
    ">{lang === 'id' ? 'Dengarkan di' : 'Listen on'}</h3>"
  );
  streamContent = streamContent.replace(
    />Play<\/span>/g,
    ">{lang === 'id' ? 'Putar' : 'Play'}</span>"
  );
  fs.writeFileSync('src/components/release/StreamingLinks.tsx', streamContent);
}

// YouTubeEmbed.tsx
let ytContent = fs.readFileSync('src/components/release/YouTubeEmbed.tsx', 'utf-8');
if (!ytContent.includes('useLanguage')) {
  ytContent = ytContent.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';"
  );
  ytContent = ytContent.replace(
    "export const YouTubeEmbed = ({ url, autoLoad }: YouTubeEmbedProps) => {",
    "export const YouTubeEmbed = ({ url, autoLoad }: YouTubeEmbedProps) => {\n  const { lang } = useLanguage();\n"
  );
  ytContent = ytContent.replace(
    />Invalid YouTube URL<\/span>/,
    ">{lang === 'id' ? 'URL YouTube Tidak Valid' : 'Invalid YouTube URL'}</span>"
  );
  fs.writeFileSync('src/components/release/YouTubeEmbed.tsx', ytContent);
}

