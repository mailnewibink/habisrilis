import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Release } from '../../types';
import { ArtworkDisplay } from './ArtworkDisplay';

export const ReleaseGallery = ({ releases, artistUsername }: { releases: Release[]; artistUsername: string }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
      {releases.map((release) => (
        <Link key={release.id} to={`/@${artistUsername}/${release.slug}`} className="group block">
          <ArtworkDisplay url={release.artworkUrl || ''} alt={release.title} />
          <div className="mt-4 text-center">
            <h3 className="text-sm font-bold tracking-tight text-[#111111] truncate">{release.title}</h3>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">{release.releaseType}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
