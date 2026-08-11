import { validateSpotifyEmbed, extractSpotifyEmbedUrl } from '../../lib/spotify-utils';
import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ReleaseForm } from '../../components/release/ReleaseForm';
import { ReleasePreview } from '../../components/release/ReleasePreview';
import { Release, ReleaseStatus } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import { createRelease } from '../../lib/supabase/releases';

const DRAFT_STORAGE_KEY = 'habisrilis_create_release_draft';

export const CreateRelease = () => {
  const { t } = useLanguage();

  const { artist, user } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState<Partial<Release>>(() => {
    try {
      const savedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch (e) {
      console.error('Failed to parse saved draft', e);
    }
    return {
      title: '',
      releaseType: 'single',
      releaseDate: new Date().toISOString(),
      aboutVisible: true,
      streamingLinks: []
    };
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSave = async (status: ReleaseStatus) => {
    if (!artist || !user) return;
    
    
    const spotifyError = validateSpotifyEmbed(data.spotifyUrl || null, data.releaseType);
    if (spotifyError) {
      setError(spotifyError);
      return;
    }

    if (!data.title || !data.releaseDate) {
      setError('Title and Release Date are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const slug = generateSlug(data.title) || Math.random().toString(36).substring(7);
      
      const newReleaseData: Omit<Release, 'id' | 'createdAt' | 'updatedAt'> = {
        artistId: artist.id,
        title: data.title,
        slug: slug,
        releaseType: data.releaseType || 'single',
        releaseDate: data.releaseDate,
        artworkUrl: data.artworkUrl || '',
        artworkFormat: data.artworkUrl ? 'webp' : '', // Fallback, could extract properly if needed, but not strictly required
        spotifyUrl: extractSpotifyEmbedUrl(data.spotifyUrl || '') || data.spotifyUrl || '',
        youtubeUrl: data.youtubeUrl || '',
        about: data.about || '',
        aboutVisible: data.aboutVisible ?? true,
        status: status,
        streamingLinks: data.streamingLinks || [],
      };
      
      await createRelease(newReleaseData);
      
      // Clear draft on successful save
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      
      navigate('/app');
    } catch (err) {
      console.error('Error creating release:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  };

  return (
    <div className="flex gap-8 lg:gap-16">
      <div className="flex-1 max-w-2xl">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/app" onClick={handleCancel} className="inline-flex h-10 w-10 items-center justify-center bg-white border border-gray-200 rounded-[10px] text-gray-500 hover:text-black hover:border-black transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tighter text-[#111111] uppercase">New Release</h1>
          </div>
          <div className="hidden md:flex items-center gap-3">
             <Button variant="ghost" onClick={() => handleSave('draft')} disabled={isSubmitting}>
               {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Draft'}
             </Button>
             <Button onClick={() => handleSave('live')} disabled={isSubmitting}>
               {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish'}
             </Button>
          </div>
        </div>
        
        {error && <div className="mb-4 text-red-500 font-medium text-sm">{error}</div>}

        <ReleaseForm data={data} onChange={setData} />
        
        <div className="mt-8 flex md:hidden flex-col gap-4">
            <Button fullWidth onClick={() => handleSave('live')} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish'}
            </Button>
            <Button variant="ghost" fullWidth onClick={() => handleSave('draft')} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Draft'}
            </Button>
        </div>
      </div>
      
      <ReleasePreview data={data} />
    </div>
  );
};
