import { validateSpotifyEmbed, extractSpotifyEmbedUrl } from '../../lib/spotify-utils';
import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Copy, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ReleaseForm } from '../../components/release/ReleaseForm';
import { ReleasePreview } from '../../components/release/ReleasePreview';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Release, ReleaseStatus } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import { deleteDirectImage } from '../../lib/supabase/storage';
import { getReleaseBySlug, updateRelease, deleteRelease, createRelease } from '../../lib/supabase/releases';

export const EditRelease = () => {
  const { t } = useLanguage();

  const { artist, user } = useAuth();
  const navigate = useNavigate();
  const { releaseSlug } = useParams<{ releaseSlug: string }>();
  
  const [data, setData] = useState<Partial<Release>>({});
  const [originalRelease, setOriginalRelease] = useState<Release | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  useEffect(() => {
    const fetchRelease = async () => {
      if (!artist || !releaseSlug) return;
      
      try {
        const releaseData = await getReleaseBySlug(artist.id, releaseSlug);
        
        if (!releaseData) {
          setNotFound(true);
        } else {
          setOriginalRelease(releaseData);
          setData(releaseData);
        }
      } catch (err) {
        console.error('Error fetching release:', err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelease();
  }, [artist, releaseSlug]);

  const handleSave = async (status: ReleaseStatus) => {
    if (!artist || !originalRelease || !user) return;
    
    
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
      await updateRelease(originalRelease.id, {
        title: data.title,
        releaseType: data.releaseType,
        releaseDate: data.releaseDate,
        artworkUrl: data.artworkUrl,
        artworkFormat: data.artworkUrl ? 'webp' : '',
        spotifyUrl: extractSpotifyEmbedUrl(data.spotifyUrl || '') || data.spotifyUrl || '',
        youtubeUrl: data.youtubeUrl || '',
        about: data.about || '',
        aboutVisible: data.aboutVisible ?? true,
        status: status,
        streamingLinks: data.streamingLinks || [],
      });
      
      // Cleanup old artwork if it was replaced or removed
      if (
        originalRelease.artworkUrl && 
        originalRelease.artworkUrl !== data.artworkUrl && 
        originalRelease.artworkUrl.includes('artwork')
      ) {
        deleteDirectImage('artwork', originalRelease.artworkUrl).catch(console.error);
      }
      
      navigate('/app');
    } catch (err) {
      console.error('Error updating release:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!originalRelease || !user) return;
    setIsSubmitting(true);
    try {
      if (originalRelease.artworkUrl && originalRelease.artworkUrl.includes('artwork')) {
        await deleteDirectImage('artwork', originalRelease.artworkUrl).catch(console.error);
      }
      await deleteRelease(originalRelease.id);
      navigate('/app');
    } catch (err) {
      console.error('Error deleting release:', err);
      setError('Failed to delete release.');
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = async () => {
    if (!originalRelease || !artist) return;
    setIsSubmitting(true);
    
    try {
      const duplicateData: Omit<Release, 'id' | 'createdAt' | 'updatedAt'> = {
        artistId: artist.id,
        title: `${originalRelease.title} (Copy)`,
        slug: `${originalRelease.slug}-copy-${Math.random().toString(36).substring(7)}`,
        releaseType: originalRelease.releaseType,
        releaseDate: originalRelease.releaseDate,
        artworkUrl: originalRelease.artworkUrl,
        artworkFormat: originalRelease.artworkFormat,
        spotifyUrl: originalRelease.spotifyUrl,
        youtubeUrl: originalRelease.youtubeUrl,
        about: originalRelease.about,
        aboutVisible: originalRelease.aboutVisible,
        status: 'draft',
        streamingLinks: originalRelease.streamingLinks,
      };

      await createRelease(duplicateData);
      
      navigate('/app');
    } catch (err) {
      console.error('Error duplicating release:', err);
      setError('Failed to duplicate release.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (notFound || !originalRelease) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Release Not Found</h2>
        <p className="text-gray-500 mb-8">The release you are trying to edit does not exist.</p>
        <Link to="/app" className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
          Return to My Releases
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-8 lg:gap-16">
        <div className="flex-1 max-w-2xl">
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link to="/app" className="inline-flex h-10 w-10 items-center justify-center bg-white border border-gray-200 rounded-[10px] text-gray-500 hover:text-black hover:border-black transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-2xl font-bold tracking-tighter text-[#111111] uppercase truncate">Edit Release</h1>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
               <Button variant="ghost" onClick={() => setShowDuplicateModal(true)} disabled={isSubmitting} className="shrink-0" title="Duplicate">
                 <Copy className="w-4 h-4" />
               </Button>
               <Button variant="ghost" onClick={() => setShowDeleteModal(true)} disabled={isSubmitting} className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50" title="Delete">
                 <Trash2 className="w-4 h-4" />
               </Button>
               
               <div className="w-px h-6 bg-gray-200 mx-2 shrink-0"></div>

               <Button variant="ghost" onClick={() => handleSave('draft')} disabled={isSubmitting} className="shrink-0">
                 {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Draft'}
               </Button>
               <Button onClick={() => handleSave('live')} disabled={isSubmitting} className="shrink-0">
                 {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Updates'}
               </Button>
            </div>
          </div>
          
          {error && <div className="mb-4 text-red-500 font-medium text-sm">{error}</div>}

          <ReleaseForm data={data} onChange={setData} />
          
          <div className="mt-8 flex md:hidden flex-col gap-4">
              <Button fullWidth onClick={() => handleSave('live')} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Updates'}
              </Button>
              <Button variant="ghost" fullWidth onClick={() => handleSave('draft')} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Draft'}
              </Button>
          </div>
        </div>
        
        <ReleasePreview data={data} />
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Release"
        message={`Are you sure you want to delete "${originalRelease.title}"? This action cannot be undone.`}
      />
      
      <ConfirmModal
        isOpen={showDuplicateModal}
        onCancel={() => setShowDuplicateModal(false)}
        onConfirm={handleDuplicate}
        title="Duplicate Release"
        message={`This will create a draft copy of "${originalRelease.title}". Continue?`}
      />
    </>
  );
};
