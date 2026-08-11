import React from 'react';
import { VerifiedBadge } from '../ui/VerifiedBadge';

interface ArtistHeaderProps {
  name: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export const ArtistHeader = ({ name, avatarUrl, isVerified }: ArtistHeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {avatarUrl && (
        <div className="mb-8">
          <img
            src={avatarUrl}
            alt={name}
            className="h-24 w-24 object-cover rounded-full border border-gray-200 shadow-sm"
          />
        </div>
      )}
      <div className="flex items-center justify-center px-4 w-full">
        <h1 className="text-4xl font-bold tracking-tighter text-[#111111] uppercase break-words">{name}</h1>
        {isVerified && (
          <div className="flex items-center gap-[4px] ml-[6px]">
            <VerifiedBadge className="w-[14px] h-[14px]" iconClassName="w-[10px] h-[10px]" />
            <span className="text-[12px] font-medium text-black">Verified</span>
          </div>
        )}
      </div>
    </div>
  );
};

