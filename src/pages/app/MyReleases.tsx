import { useLanguage } from '../../contexts/LanguageContext';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ReleaseStatus } from '../../components/release/ReleaseStatus';
import { ArtworkDisplay } from '../../components/release/ArtworkDisplay';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { ShareActions } from '../../components/release/ShareActions';
import { useAuth } from '../../auth/AuthContext';
import { Release } from '../../types';
import { Loader2, Trash2, ArrowLeft } from 'lucide-react';
import { getReleasePublicUrl, getReleaseShareText } from '../../lib/share-utils';
import { deleteArtworkFromSupabase } from '../../lib/supabase/storage';
import { getReleasesByArtistId, deleteRelease } from '../../lib/supabase/releases';

export const MyReleases = () => {
  const { t } = useLanguage();

  const { user, artist } = useAuth();
  
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [releaseToDelete, setReleaseToDelete] = useState<Release | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDelete = (e: React.MouseEvent, release: Release) => {
    e.preventDefault();
    e.stopPropagation();
    setReleaseToDelete(release);
  };

  const confirmDelete = async () => {
    if (!releaseToDelete || !user) return;
    setIsDeleting(true);
    try {
      if (releaseToDelete.artworkUrl) {
        await deleteArtworkFromSupabase(user.id, releaseToDelete.id).catch(console.error);
      }
      await deleteRelease(releaseToDelete.id);
      
      // Update state locally
      setReleases(prev => prev.filter(r => r.id !== releaseToDelete.id));
      
      setReleaseToDelete(null);
    } catch (err: any) {
      console.error('Error deleting release:', err);
      alert('Failed to delete release. See console for details.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchReleases = async () => {
      if (!artist) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await getReleasesByArtistId(artist.id);
        
        data.sort((a, b) => {
          const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
          const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
          if (dateA !== dateB) {
            return dateB - dateA;
          }
          const createdA = new Date(a.createdAt).getTime();
          const createdB = new Date(b.createdAt).getTime();
          return createdB - createdA;
        });
        
        setReleases(data);
      } catch (error) {
        console.error('Error fetching releases:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReleases();
  }, [artist]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-gray-300 shadow-sm">
          <ArrowLeft className="w-3 h-3" /> Home
        </Link>
      </div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tighter text-[#111111] uppercase">{t('dashboard.myReleases')}</h1>
        <Link to="/app/new" className="hidden md:block">
          <Button size="sm">{t('dashboard.createRelease')}</Button>
        </Link>
      </div>
      
      {releases.length === 0 ? (
        <EmptyState
          title="No releases yet"
          description="Create your first Release Page to start sharing your music beautifully."
          action={
            <Link to="/app/new">
              <Button>Create Release Page</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {releases.map((release) => {
            const publicUrl = artist ? getReleasePublicUrl(artist.username, release.slug) : '';
            const shareText = artist ? getReleaseShareText(release.title, artist.displayName, publicUrl) : '';
            
            return (
              <div key={release.id} className="group relative flex flex-col border border-gray-200 bg-white p-4 rounded-[14px] shadow-sm transition-all hover:border-black hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={(e) => requestDelete(e, release)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 bg-white rounded-md shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    title="Delete Release"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <Link to={`/app/edit/${release.slug}`} className="block flex-grow mb-4">
                  <div className="mb-4 flex items-center justify-between">
                    <ReleaseStatus status={release.status} />
                    <div className="w-7 h-7"></div>
                  </div>
                  
                  <div className="mb-4 w-full">
                    <ArtworkDisplay url={release.artworkUrl || ''} alt={release.title} />
                  </div>
                  
                  <div>
                    <h3 className="truncate text-lg font-bold tracking-tight text-[#111111]">{release.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{release.releaseType}</p>
                  </div>
                </Link>
                
                {release.status === 'live' && artist ? (
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2">
                    <Link to={`/@${artist.username.replace('@', '')}/${release.slug}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" className="w-full">
                        Open
                      </Button>
                    </Link>
                    <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                      <ShareActions 
                        url={publicUrl}
                        title={release.title}
                        artistName={artist.displayName}
                        shareText={shareText}
                        size="sm"
                        fullWidth
                      />
                    </div>
                  </div>
                ) : release.status === 'draft' ? (
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">Publish to share this Release Page.</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
      
      <ConfirmModal
        isOpen={!!releaseToDelete}
        title="Delete Release Page?"
        message="This release will be permanently deleted."
        onConfirm={confirmDelete}
        onCancel={() => setReleaseToDelete(null)}
        isConfirming={isDeleting}
      />
    </div>
  );
};
