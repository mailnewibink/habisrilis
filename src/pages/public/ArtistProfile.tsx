import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageToggle } from '../../components/LanguageToggle';
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { ArtistHeader } from '../../components/release/ArtistHeader';
import { SocialLinks } from '../../components/release/SocialLinks';
import { ReleaseGallery } from '../../components/release/ReleaseGallery';
import { Artist, Release } from '../../types';
import { Loader2, Plus, Check, ArrowLeft } from 'lucide-react';
import { getArtistByUsername } from '../../lib/supabase/artists';
import { getReleasesByArtistId } from '../../lib/supabase/releases';
import { followArtist, unfollowArtist, checkIsFollowing, getFollowerCount } from '../../lib/supabase/followers';
import { saveRecentArtist } from '../../lib/recent';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { FollowButton } from '../../components/ui/FollowButton';



export const ArtistProfile = () => {
  const { lang } = useLanguage();
  const { t } = useLanguage();
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username?.startsWith('@')) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Clean up username if it contains @
      const cleanUsername = username.replace('@', '');
      if (!cleanUsername) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const artistData = await getArtistByUsername(cleanUsername);
        
        if (!artistData) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setArtist(artistData);
        saveRecentArtist(artistData);
        
        try {
          const count = await getFollowerCount(artistData.id);
          setFollowersCount(count);
        } catch (followerErr) {
          console.warn('Could not fetch follower count:', followerErr);
          setFollowersCount(0);
        }
        
        if (user) {
          try {
            const following = await checkIsFollowing(artistData.id, user.id);
            setIsFollowing(following);
          } catch (followingErr) {
            console.warn('Could not check following status:', followingErr);
            setIsFollowing(false);
          }
        }
        
        const releasesData = await getReleasesByArtistId(artistData.id, true);
        
        // Sort by releaseDate desc, then createdAt desc
        releasesData.sort((a, b) => {
          const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
          const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
          if (dateA !== dateB) return dateB - dateA;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setReleases(releasesData);
      } catch (err) {
        console.error('Error fetching artist profile:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (notFound || !artist) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-[#111111] mb-4">{t('artist.notFoundTitle')}</h1>
        <p className="text-gray-500 mb-8 max-w-md">The artist profile you are looking for does not exist or may have been removed.</p> 
        <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans pb-20 selection:bg-gray-200">
      <div className="mx-auto max-w-2xl px-6 pt-8">
        <div className="flex flex-col gap-3 mb-8">
          <button 
            onClick={() => window.history.state && window.history.state.idx > 0 ? navigate(-1) : navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors self-start"
          >
            ← Back
          </button>
          
          <nav className="text-[13px] text-[#888888] flex items-center flex-wrap gap-2">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <Link to="/" className="hover:text-black transition-colors">Artists</Link>
            <span>/</span>
            <span className="text-[#111111] flex items-center gap-1">
              {artist.displayName}
              {artist.verificationStatus === 'verified' && (
                <div className="w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center" title="Verified Artist">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              )}
            </span>
          </nav>
        </div>

        <ArtistHeader name={artist.displayName} avatarUrl={artist.avatarUrl} isVerified={artist.verificationStatus === 'verified'} />
        
        <div className="flex flex-col items-center mt-[-1.5rem] mb-10 gap-5">
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            <span>{followersCount.toLocaleString()} Followers</span>
            <span>•</span>
            <span>{releases.length} Releases</span>
          </div>
          <FollowButton 
            artistId={artist.id} 
            initialIsFollowing={isFollowing} 
            onFollowChange={(newIsFollowing) => {
              setIsFollowing(newIsFollowing);
              setFollowersCount(prev => newIsFollowing ? prev + 1 : prev - 1);
            }} 
          />
        </div>

        {artist.verificationStatus === 'unclaimed' && (
          <div className="mt-4 flex justify-center">
            <Link 
              to={`/claim/@${artist.username}`}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black border-b border-transparent hover:border-black transition-colors"
            >
              Claim this Artist
            </Link>
          </div>
        )}
        
        {artist.verificationStatus === 'claim_pending' && (
          <div className="mt-4 flex justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
              Verification Pending
            </span>
          </div>
        )}
        
        {artist.bio && (
          <div className="mb-8 text-center max-w-md mx-auto">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{artist.bio}</p>
          </div>
        )}
        
        <div className="mb-20">
          <SocialLinks links={artist.socialLinks || []} />
        </div>

        <div className="mb-8">
           <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 border-b border-gray-100 pb-4">{t('artist.releases')}</h2>
           {releases.length > 0 ? (
             <ReleaseGallery releases={releases} artistUsername={artist.username} />
           ) : (
             <div className="py-12 text-center text-gray-500 text-sm">
               No releases yet.
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
