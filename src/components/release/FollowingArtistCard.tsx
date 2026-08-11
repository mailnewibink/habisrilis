import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { VerifiedBadge } from '../ui/VerifiedBadge';
import { Button } from '../ui/Button';
import { getFollowerCount } from '../../lib/supabase/followers';

interface FollowingArtistCardProps {
  key?: React.Key;
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export const FollowingArtistCard = ({ id, username, displayName, avatarUrl, isVerified }: FollowingArtistCardProps) => {
  const { t } = useLanguage();

  const [followers, setFollowers] = useState<number | null>(null);
  
  useEffect(() => {
    getFollowerCount(id).then(setFollowers).catch(() => setFollowers(0));
  }, [id]);

  return (
    <Link to={`/@${username}`} className="block group">
      <div className="flex flex-col items-center p-6 border border-gray-200 rounded-[14px] bg-white text-center hover:border-black transition-colors">
        <div className="mb-4 relative">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-full object-cover border border-gray-200 group-hover:border-black transition-colors" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
              <span className="text-xl font-medium text-gray-400">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="font-bold text-gray-900 group-hover:text-black">{displayName}</h3>
          {isVerified && <VerifiedBadge className="w-3.5 h-3.5" iconClassName="w-2.5 h-2.5" />}
        </div>
        
        <p className="text-xs text-gray-500 mb-4">@{username}</p>
        
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 h-3">
          {followers !== null ? `${followers} ${t('common.followers')}` : ''}
        </div>
        
        <Button variant="outline" size="sm" className="w-full text-xs" onClick={(e) => {
          // The Link handles navigation
        }}>
          Open
        </Button>
      </div>
    </Link>
  );
};
