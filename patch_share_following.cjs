const fs = require('fs');

// ShareActions.tsx
let shareContent = fs.readFileSync('src/components/release/ShareActions.tsx', 'utf-8');
if (!shareContent.includes('useLanguage')) {
  shareContent = shareContent.replace(
    "import { Share2, Link as LinkIcon, MessageCircle } from 'lucide-react';",
    "import { Share2, Link as LinkIcon, MessageCircle } from 'lucide-react';\nimport { useLanguage } from '../../contexts/LanguageContext';"
  );
  shareContent = shareContent.replace(
    "export const ShareActions = ({ url, title, artistName, shareText, size = 'md', fullWidth = false }: ShareActionsProps) => {",
    "export const ShareActions = ({ url, title, artistName, shareText, size = 'md', fullWidth = false }: ShareActionsProps) => {\n  const { lang } = useLanguage();\n"
  );
  shareContent = shareContent.replace(
    />Share this release<\/h4>/,
    ">{lang === 'id' ? 'Bagikan rilisan ini' : 'Share this release'}</h4>"
  );
  shareContent = shareContent.replace(
    /\{copied \? 'Copied!' : 'Copy Link'\}/,
    "{copied ? (lang === 'id' ? 'Tersalin!' : 'Copied!') : (lang === 'id' ? 'Salin Tautan' : 'Copy Link')}"
  );
  shareContent = shareContent.replace(
    /\s*Share\s*<\/button>/,
    "\n        {lang === 'id' ? 'Bagikan' : 'Share'}\n      </button>"
  );
  fs.writeFileSync('src/components/release/ShareActions.tsx', shareContent);
}

// FollowingArtistCard.tsx
let followContent = fs.readFileSync('src/components/release/FollowingArtistCard.tsx', 'utf-8');
if (!followContent.includes('useLanguage')) {
  followContent = followContent.replace(
    "import { Link } from 'react-router-dom';",
    "import { Link } from 'react-router-dom';\nimport { useLanguage } from '../../contexts/LanguageContext';"
  );
  followContent = followContent.replace(
    "export const FollowingArtistCard = ({ id, username, displayName, avatarUrl, isVerified }: FollowingArtistCardProps) => {",
    "export const FollowingArtistCard = ({ id, username, displayName, avatarUrl, isVerified }: FollowingArtistCardProps) => {\n  const { lang } = useLanguage();\n"
  );
  followContent = followContent.replace(
    /\{followers !== null \? `\$\{followers\} Followers` : ''\}/,
    "{followers !== null ? (lang === 'id' ? `${followers} Pengikut` : `${followers} Followers`) : ''}"
  );
  fs.writeFileSync('src/components/release/FollowingArtistCard.tsx', followContent);
}

