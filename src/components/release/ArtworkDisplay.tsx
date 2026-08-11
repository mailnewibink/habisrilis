import React from 'react';

export const ArtworkDisplay = ({ url, alt }: { url: string; alt: string }) => {
  return (
    <div className="relative w-full aspect-square overflow-hidden bg-gray-100 rounded-[10px] border border-gray-100 shadow-sm">
      {url ? (
        <img
          src={url}
          alt={alt}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest">
          No Artwork
        </div>
      )}
    </div>
  );
};
