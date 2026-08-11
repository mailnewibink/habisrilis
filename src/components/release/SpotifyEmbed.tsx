import { extractSpotifyEmbedUrl } from '../../lib/spotify-utils';
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const SpotifyEmbed = ({ spotifyUrl }: { spotifyUrl?: string }) => {
  const { t } = useLanguage();

  const [error, setError] = useState(false);

  React.useEffect(() => {
    setError(false);
  }, [spotifyUrl]);

  if (!spotifyUrl) {
    return (
      <div className="w-full flex items-center justify-center h-[152px] bg-gray-50 border border-gray-200">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] px-4 text-center">
          {t('release.spotifyPreview')}
        </p>
      </div>
    );
  }

  const getEmbedUrl = (url: string) => {
    return extractSpotifyEmbedUrl(url);
  };

  const embedUrl = getEmbedUrl(spotifyUrl);

  if (!embedUrl || error) {
    return (
      <div className="w-full flex items-center justify-center h-[152px] bg-gray-50 border border-gray-200">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] px-4 text-center">
          {t('release.spotifyUnavailable')}
        </p>
      </div>
    );
  }

  const isAlbum = embedUrl?.includes('/embed/album/');
  const height = isAlbum ? 352 : 152;

  return (
    <div className="w-full overflow-hidden rounded-xl bg-[#282828]">
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="block"
        onError={() => setError(true)}
      />
    </div>
  );
};
