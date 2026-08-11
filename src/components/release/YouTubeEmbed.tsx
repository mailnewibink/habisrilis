import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getYouTubeVideoId } from '../../lib/youtube-utils';

interface YouTubeEmbedProps {
  url: string;
  autoLoad?: boolean;
}

export const YouTubeEmbed = ({ url, autoLoad }: YouTubeEmbedProps) => {
  const { t } = useLanguage();

  const [isLoaded, setIsLoaded] = useState(autoLoad || false);
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-gray-100 border border-red-200 rounded-[14px] flex flex-col items-center justify-center p-6 text-center text-red-500 shadow-sm">
        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest">{t('release.invalidYoutube')}</span>
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return (
    <div className="w-full aspect-video rounded-[14px] overflow-hidden bg-black shadow-sm relative group">
      {!isLoaded ? (
        <button 
          onClick={() => setIsLoaded(true)}
          className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none flex items-center justify-center"
        >
          <img 
            src={thumbnailUrl} 
            alt="YouTube Video Thumbnail" 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-12 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors shadow-lg">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        <iframe
          src={embedUrl}
          title="YouTube video player"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  );
};
