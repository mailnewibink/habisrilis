import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { ChevronDown, Plus, Check, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VerifiedBadge } from '../ui/VerifiedBadge';

export const ArtistSwitcher = () => {
  const { user, artists, activeArtist, setActiveArtistId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeArtist) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
      >
        {activeArtist.avatarUrl ? (
          <img src={activeArtist.avatarUrl} alt={activeArtist.displayName} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500">{activeArtist.displayName.charAt(0)}</span>
          </div>
        )}
        <div className="flex items-center">
          <span className="font-bold text-sm tracking-tighter truncate max-w-[120px]">{activeArtist.displayName}</span>
          {activeArtist.verificationStatus === 'verified' && (
            <div className="flex items-center gap-[4px] ml-[6px]">
              <VerifiedBadge className="w-[14px] h-[14px]" iconClassName="w-[10px] h-[10px]" />
              <span className="text-[12px] font-medium">Verified</span>
            </div>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-[14px] shadow-lg py-2 z-50">
          <div className="px-4 py-2 mb-1 border-b border-gray-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Switch Artist</p>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {artists.map(artist => (
              <button
                key={artist.id}
                onClick={() => {
                  setActiveArtistId(artist.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors ${activeArtist.id === artist.id ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {artist.avatarUrl ? (
                    <img src={artist.avatarUrl} alt={artist.displayName} className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                      <span className="text-xs font-bold text-gray-500">{artist.displayName.charAt(0)}</span>
                    </div>
                  )}
                  <div className="text-left overflow-hidden">
                    <p className="text-sm font-bold tracking-tight text-[#111111] truncate">{artist.displayName}</p>
                    <p className="text-[10px] font-medium text-gray-500 truncate">@{artist.username}</p>
                  </div>
                </div>
                {activeArtist.id === artist.id && (
                  <Check className="w-4 h-4 text-black shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="px-2 pt-2 mt-1 border-t border-gray-50 flex flex-col gap-1">
            {user?.accountType !== 'artist' && (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/app/claim-artist');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 rounded-[10px] transition-colors"
            >
              <Search className="w-4 h-4" />
              Claim Artist
            </button>
            )}
            {user?.accountType !== 'artist' && (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/app/setup');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 rounded-[10px] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Artist
            </button>
            )}
            {user?.accountType === 'manager' && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/app/manager');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 rounded-[10px] transition-colors"
              >
                Manager Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
