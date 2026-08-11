import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { VerifiedBadge } from '../ui/VerifiedBadge';
import { Button } from '../ui/Button';

interface ArtistCardProps {
  key?: React.Key;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isVerified?: boolean;
  totalReleases?: number;
}

export const ArtistCard = ({ username, displayName, avatarUrl, isVerified, totalReleases }: ArtistCardProps) => {
  return (
    <div className="flex flex-col items-center p-6 border border-gray-200 rounded-[14px] bg-white text-center hover:border-black transition-colors group">
      <div className="mb-4 relative">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-full object-cover border border-gray-200 group-hover:border-black transition-colors" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-black transition-colors">
            <span className="text-xl font-bold text-gray-400">{displayName.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center mb-4 h-full">
        <div className="flex items-center gap-[4px] justify-center mb-1">
          <h3 className="font-bold text-[#111111] truncate max-w-[150px]">{displayName}</h3>
          {isVerified && (
            <VerifiedBadge className="w-[14px] h-[14px]" iconClassName="w-[10px] h-[10px]" />
          )}
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">@{username}</p>
        {totalReleases !== undefined && (
          <p className="text-[10px] text-gray-500">{totalReleases} {totalReleases === 1 ? 'Release' : 'Releases'}</p>
        )}
      </div>
      <Link to={`/@${username}`} className="w-full mt-auto">
        <Button variant="outline" size="sm" fullWidth className="text-xs">
          Open Profile
        </Button>
      </Link>
    </div>
  );
};
