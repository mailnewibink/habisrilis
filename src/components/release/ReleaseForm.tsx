import { validateSpotifyEmbed } from '../../lib/spotify-utils';
import { useLanguage } from '../../contexts/LanguageContext';
import React from 'react';
import { Release, ReleaseType, StreamingLink } from '../../types';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { ImageUpload } from './ImageUpload';
import { AccordionSection } from '../ui/AccordionSection';
import { useAuth } from '../../auth/AuthContext';

interface ReleaseFormProps {
  data: Partial<Release>;
  onChange: (data: Partial<Release>) => void;
}

export const ReleaseForm = ({ data, onChange }: ReleaseFormProps) => {
  const { t } = useLanguage();
  const { artist } = useAuth();
  
  const handleStreamingChange = (platform: string, url: string) => {
    const current = data.streamingLinks || [];
    const existing = current.find(l => l.platform === platform);
    
    let newList;
    if (!url) {
      newList = current.filter(l => l.platform !== platform);
    } else if (existing) {
      newList = current.map(l => l.platform === platform ? { ...l, url } : l);
    } else {
      // Find max sortOrder
      const maxSort = current.reduce((max, l) => Math.max(max, l.sortOrder), -1);
      newList = [...current, { platform, url, sortOrder: maxSort + 1 }];
    }
    
    onChange({ ...data, streamingLinks: newList });
  };

  const getStreamingUrl = (platform: string) => {
    return data.streamingLinks?.find(l => l.platform === platform)?.url || '';
  };

  return (
    <div className="flex flex-col gap-4">
      <AccordionSection title="Basic Information" defaultOpen={true}>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Artwork</label>
            <ImageUpload 
              value={data.artworkUrl || ''} 
              onChange={url => onChange({ ...data, artworkUrl: url })}
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('form.title')}</label>
            <Input 
              value={data.title || ''} 
              onChange={e => onChange({ ...data, title: e.target.value })}
              placeholder="e.g. Hujan di Bulan Juli" 
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Artist Name</label>
            <Input 
              value={artist?.displayName || ''} 
              disabled 
              title="Artist name is managed in your Account settings"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('form.releaseDate')}</label>
              <Input 
                type="date" 
                value={data.releaseDate?.split('T')[0] || ''} 
                onChange={e => onChange({ ...data, releaseDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('form.releaseType')}</label>
              <Select 
                value={data.releaseType || 'single'}
                onChange={e => onChange({ ...data, releaseType: e.target.value as ReleaseType })}
              >
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="album">Album</option>
              </Select>
            </div>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Streaming Platforms" defaultOpen={false}>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Spotify (Embed preview)</label>
            <Input 
              value={data.spotifyUrl || ''} 
              onChange={e => onChange({ ...data, spotifyUrl: e.target.value })}
              placeholder={data.releaseType === 'single' ? "Paste the Spotify Track Embed Code from Spotify." : "Paste the Spotify Album Embed Code from Spotify."} 
            />
            {validateSpotifyEmbed(data.spotifyUrl || null, data.releaseType) ? (
              <p className="mt-2 text-xs text-red-500 font-medium">{validateSpotifyEmbed(data.spotifyUrl || null, data.releaseType)}</p>
            ) : (
              <p className="mt-2 text-xs text-gray-500">Spotify preview will automatically appear on the public Release Page.</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">YouTube Video</label>
            <Input 
              value={data.youtubeUrl || ''} 
              onChange={e => onChange({ ...data, youtubeUrl: e.target.value })}
              placeholder="Paste YouTube video link" 
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Spotify URL</label>
            <Input 
              value={getStreamingUrl('spotify')}
              onChange={e => handleStreamingChange('spotify', e.target.value)}
              placeholder="Spotify URL for streaming link" 
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Apple Music</label>
            <Input 
              value={getStreamingUrl('apple_music')}
              onChange={e => handleStreamingChange('apple_music', e.target.value)}
              placeholder="Apple Music URL" 
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">YouTube Music</label>
            <Input 
              value={getStreamingUrl('youtube_music')}
              onChange={e => handleStreamingChange('youtube_music', e.target.value)}
              placeholder="YouTube Music URL" 
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">TikTok</label>
            <Input 
              value={getStreamingUrl('tiktok')}
              onChange={e => handleStreamingChange('tiktok', e.target.value)}
              placeholder="TikTok URL" 
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Deezer</label>
            <Input 
              value={getStreamingUrl('deezer')}
              onChange={e => handleStreamingChange('deezer', e.target.value)}
              placeholder="Deezer URL" 
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="About The Song" defaultOpen={false}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold tracking-widest text-[#111111] uppercase">Show on Release Page</label>
            <Toggle 
              checked={data.aboutVisible ?? true} 
              onChange={e => onChange({ ...data, aboutVisible: e.target.checked })}
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Story behind the release</label>
            <Textarea 
              value={data.about || ''}
              onChange={e => onChange({ ...data, about: e.target.value })}
              placeholder="Write something about this release..." 
            />
          </div>
        </div>
      </AccordionSection>
    </div>
  );
};
