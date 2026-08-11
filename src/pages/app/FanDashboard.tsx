import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, Trash2 } from 'lucide-react';
import { ArtistCard } from '../../components/release/ArtistCard';
import { FollowingArtistCard } from '../../components/release/FollowingArtistCard';
import { LatestReleaseCard } from '../../components/release/LatestReleaseCard';
import { getFollowedArtists, getNewReleasesFromFollowed } from '../../lib/supabase/followers';
import { getVerifiedArtists } from '../../lib/supabase/public';
import { getRecentViewedArtists } from '../../lib/recent';
import { Artist, Release } from '../../types';

export const FanDashboard = () => {
  const { t } = useLanguage();

  const { user, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [newReleases, setNewReleases] = useState<Release[]>([]);
  const [recentViewed, setRecentViewed] = useState<Artist[]>([]);
  const [recommendedArtists, setRecommendedArtists] = useState<Artist[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [artists, releases, verified] = await Promise.all([
          getFollowedArtists(user.id),
          getNewReleasesFromFollowed(user.id, 8),
          getVerifiedArtists(12)
        ]);
        setFollowedArtists(artists);
        setNewReleases(releases);
        setRecentViewed(getRecentViewedArtists());
        
        // Randomize recommended artists
        const randomRecommended = verified.sort(() => 0.5 - Math.random()).slice(0, 6);
        setRecommendedArtists(randomRecommended);
      } catch (err) {
        console.error('Error fetching fan dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDeleteAccount = async () => {
    if (window.confirm("Delete your HabisRilis account?\n\nThis will permanently remove your HabisRilis data. This action cannot be undone.")) {
      setIsDeleting(true);
      setError(null);
      try {
        if (user) {
          await supabase.from('profiles').delete().eq('id', user.id);
        }
        await logout();
      } catch (err: any) {
        console.error("Error deleting account:", err);
        setError(err.message || 'Failed to delete account.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const fanName = user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Fan';

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-tighter text-[#111111]">Hello, {fanName}</h1>
          <Button variant="outline" size="sm" onClick={logout}>{t('dashboard.signOut')}</Button>
        </div>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-[10px] text-sm text-center">{error}</div>}
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : (
          <div className="space-y-16 animate-fade-in">
            <section>
              <h2 className="text-xl font-bold tracking-tighter uppercase mb-6 border-b border-gray-200 pb-2">Following Artists</h2>
              {followedArtists.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {followedArtists.map(artist => (
                    <FollowingArtistCard 
                      key={artist.id}
                      id={artist.id}
                      username={artist.username}
                      displayName={artist.displayName}
                      avatarUrl={artist.avatarUrl}
                      isVerified={artist.verificationStatus === 'verified'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-[14px] border border-gray-200 text-gray-500">
                  <p className="text-sm font-medium mb-4 text-gray-900">You're not following any artists yet.</p>
                  <Link to="/">
                    <Button variant="outline" size="sm">Explore Artists</Button>
                  </Link>
                </div>
              )}
            </section>
            
            <section>
              <h2 className="text-xl font-bold tracking-tighter uppercase mb-6 border-b border-gray-200 pb-2">Latest Releases</h2>
              {newReleases.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {newReleases.map(release => (
                    <LatestReleaseCard
                      key={release.id}
                      title={release.title}
                      artistName={release.artist?.displayName || 'Unknown Artist'}
                      artworkUrl={release.artworkUrl}
                      slug={release.slug}
                      artistUsername={release.artist?.username}
                      releaseType={release.releaseType}
                      releaseDate={release.releaseDate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-[14px] border border-gray-200 text-gray-500">
                  <p className="text-sm font-medium mb-1 text-gray-900">No Releases</p>
                  <p className="text-xs">Follow artists to receive<br/>their latest releases.</p>
                </div>
              )}
            </section>

            {recentViewed.length > 0 && (
              <section>
                <h2 className="text-xl font-bold tracking-tighter uppercase mb-6 border-b border-gray-200 pb-2">Recently Viewed</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {recentViewed.slice(0, 10).map(artist => (
                    <ArtistCard 
                      key={artist.id}
                      username={artist.username}
                      displayName={artist.displayName}
                      avatarUrl={artist.avatarUrl}
                      isVerified={artist.verificationStatus === 'verified'}
                      totalReleases={(artist as any).totalReleases}
                    />
                  ))}
                </div>
              </section>
            )}

            {recommendedArtists.length > 0 && (
              <section>
                <h2 className="text-xl font-bold tracking-tighter uppercase mb-6 border-b border-gray-200 pb-2">Recommended Artists</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {recommendedArtists.map(artist => (
                    <ArtistCard 
                      key={artist.id}
                      username={artist.username}
                      displayName={artist.displayName}
                      avatarUrl={artist.avatarUrl}
                      isVerified={artist.verificationStatus === 'verified'}
                      totalReleases={(artist as any).totalReleases}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <div className="flex justify-end mt-16 pt-8 border-t border-gray-200">
          <Button 
            onClick={handleDeleteAccount} 
            variant="outline" 
            className="gap-2 text-[10px] font-bold tracking-widest uppercase !border-red-200 !text-red-500 hover:!bg-red-50 hover:!border-red-300"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};
