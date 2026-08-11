import React from 'react';
import { Release } from '../../types';
import { ReleaseCard } from './ReleaseCard';
import { useAuth } from '../../auth/AuthContext';
import { SpotifyEmbed } from './SpotifyEmbed';
import { YouTubeEmbed } from './YouTubeEmbed';
import { StreamingLinks } from './StreamingLinks';

export const ReleasePreview = ({ data }: { data?: Partial<Release> }) => {
  const { artist } = useAuth();
  
  return (
    <div className="sticky top-24 hidden lg:block w-[375px] shrink-0">
      <div className="border-[8px] border-gray-900 bg-[#F9F9F9] rounded-[32px] overflow-hidden h-[800px] shadow-2xl relative">
        <div className="h-full w-full overflow-y-auto px-6 py-12 scrollbar-hide">
           <div className="mb-8">
             <ReleaseCard 
               title={data?.title || 'Release Title'} 
               artistName={artist?.displayName || 'Artist Name'} 
               artworkUrl={data?.artworkUrl || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800&h=800'} 
               hideListenButton
             />
           </div>
           
           <div className="space-y-8">
              {data?.spotifyUrl ? (
                <SpotifyEmbed spotifyUrl={data.spotifyUrl} />
              ) : (
                <div className="w-full h-[152px] bg-gray-50 flex items-center justify-center border border-gray-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-center px-4">Spotify Preview</span>
                </div>
              )}
              
              {data?.streamingLinks && data.streamingLinks.length > 0 ? (
                <StreamingLinks links={data.streamingLinks.slice().sort((a, b) => a.sortOrder - b.sortOrder)} />
              ) : (
                <div className="space-y-3">
                  <div className="h-14 w-full bg-white border border-gray-200 rounded-[10px]"></div>
                  <div className="h-14 w-full bg-white border border-gray-200 rounded-[10px]"></div>
                </div>
              )}
              
              {data?.youtubeUrl && (
                <YouTubeEmbed url={data.youtubeUrl} />
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
