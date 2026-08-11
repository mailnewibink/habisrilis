import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface LatestReleaseCardProps {
  key?: React.Key;
  title: string;
  artistName: string;
  artistUsername?: string;
  artworkUrl: string;
  slug: string;
  releaseType: string;
  releaseDate?: string;
}

export const LatestReleaseCard = ({
  title,
  artistName,
  artistUsername,
  artworkUrl,
  slug,
  releaseType,
  releaseDate
}: LatestReleaseCardProps) => {
  const targetUrl = artistUsername ? `/@${artistUsername}/${slug}` : `/release/${slug}`;

  return (
    <Link to={targetUrl} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-[14px] mb-4 bg-gray-100 border border-gray-200">
        <img
          src={artworkUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <div className="px-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-black">{title}</h3>
        </div>
        <p className="text-xs text-gray-500 truncate mb-2">{artistName}</p>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {releaseType}
            {releaseDate && ` • ${new Date(releaseDate).getFullYear()}`}
          </p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Listen →
          </span>
        </div>
      </div>
    </Link>
  );
};
