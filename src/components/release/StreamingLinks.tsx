import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { StreamingLink } from '../../types';

const PLATFORM_NAMES: Record<string, string> = {
  spotify: 'Spotify',
  apple_music: 'Apple Music',
  youtube_music: 'YouTube Music',
  tiktok: 'TikTok',
  deezer: 'Deezer',
  other: 'Other'
};

export const StreamingLinks = ({ links, children }: { links?: StreamingLink[], children?: React.ReactNode }) => {
  const { t } = useLanguage();

  if ((!links || links.length === 0) && !children) return null;

  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 text-center">{t('release.listenOn')}</h3>
      <div className="flex flex-col gap-3">
        {links && links.map((link) => {
          let urlString = link.url.trim();
          if (urlString && !urlString.startsWith('http://') && !urlString.startsWith('https://')) {
            urlString = 'https://' + urlString;
          }
          return (
            <a
              key={link.platform}
              href={urlString}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white p-4 transition-colors hover:bg-black hover:text-white group"
            >
              <span className="text-sm font-bold tracking-widest uppercase truncate mr-4">{PLATFORM_NAMES[link.platform] || link.platform}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-300 transition-colors shrink-0">{t('release.play')}</span>
            </a>
          );
        })}
        {children}
      </div>
    </div>
  );
};
