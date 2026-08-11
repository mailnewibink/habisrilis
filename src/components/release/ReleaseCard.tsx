import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface ReleaseCardProps {
  key?: React.Key;
  artistName: string;
  title: string;
  artworkUrl: string;
  slug?: string;
  artistUsername?: string;
  hideListenButton?: boolean;
  releaseType?: string;
  releaseDate?: string;
}

export const ReleaseCard = ({ artistName, title, artworkUrl, slug, artistUsername, hideListenButton, releaseType, releaseDate }: ReleaseCardProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  const handleArtworkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLightboxOpen(true);
  };

  const closeLightbox = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLightboxOpen(false);
  };

  const content = (
    <div 
      onClick={() => { if (slug && artistUsername) navigate(`/@${artistUsername}/${slug}`); }}
      className={`group relative flex flex-col w-full max-w-sm mx-auto bg-white border border-gray-200 p-4 rounded-[14px] shadow-sm hover:shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] ${slug && artistUsername ? "cursor-pointer" : ""}`}
    >
      <div 
        onClick={handleArtworkClick}
        className="relative w-full aspect-square mb-6 bg-gray-100 rounded-[10px] overflow-hidden cursor-zoom-in"
        role="button"
        tabIndex={0}
      >
        <img
          src={artworkUrl}
          alt={`Artwork for ${title} by ${artistName}`}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      <div className={`text-left ${hideListenButton ? '' : 'mb-6'}`}>
        <h2 className="text-xl font-bold tracking-tight text-[#111111] mb-1 break-words">{title}</h2>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest break-words">{artistName}</p>
          {(releaseType || releaseDate) && (
             <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
               {releaseType}{releaseType && releaseDate ? ' • ' : ''}{releaseDate ? new Date(releaseDate).getFullYear() : ''}
             </p>
          )}
        </div>
      </div>

      {!hideListenButton && (
        <div className="flex h-10 w-full rounded-[10px] items-center justify-center gap-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-black/90">
          <Play className="h-3 w-3 fill-current" />
          {t('common.listenNow')}
        </div>
      )}
    </div>
  );

  const lightbox = isLightboxOpen && typeof document !== 'undefined' ? createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={closeLightbox}
    >
      <button 
        onClick={closeLightbox}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>
      <img
        src={artworkUrl}
        alt={`Artwork for ${title} by ${artistName}`}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  ) : null;

  return (
    <>
      {content}
      {lightbox}
    </>
  );
};
