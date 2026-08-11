import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import { ReleaseCard } from '../../components/release/ReleaseCard';
import { SpotifyEmbed } from '../../components/release/SpotifyEmbed';
import { YouTubeEmbed } from '../../components/release/YouTubeEmbed';
import { StreamingLinks } from '../../components/release/StreamingLinks';
import { AboutSong } from '../../components/release/AboutSong';
import { SocialLinks } from '../../components/release/SocialLinks';
import { ShareActions } from '../../components/release/ShareActions';
import { Artist, Release } from '../../types';
import { getReleasePublicUrl, getReleaseShareText, setSocialMetadata } from '../../lib/share-utils';
import { useAuth } from '../../auth/AuthContext';
import { getArtistByUsername } from '../../lib/supabase/artists';
import { getReleaseBySlug } from '../../lib/supabase/releases';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageToggle } from '../../components/LanguageToggle';



export const ReleasePage = () => {
  const { lang } = useLanguage();
  const { t } = useLanguage();
  const { username, releaseSlug } = useParams<{ username: string; releaseSlug: string }>();
  const { user } = useAuth();
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!username?.startsWith('@')) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const cleanUsername = username.substring(1);
      if (!cleanUsername || !releaseSlug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setShowYouTubePlayer(false);
        const artistData = await getArtistByUsername(cleanUsername);
        
        if (!artistData) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setArtist(artistData);

        const releaseData = await getReleaseBySlug(artistData.id, releaseSlug);
        
        if (!releaseData || releaseData.status !== 'live') {
          setNotFound(true);
        } else {
          setRelease(releaseData);
        }
      } catch (err) {
        console.error('Error fetching release data:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, releaseSlug]);

  useEffect(() => {
    if (release && artist) {
      const publicUrl = getReleasePublicUrl(artist.username, release.slug);
      const title = `${release.title} — ${artist.displayName}`;
      let description = `Listen to ${release.title} by ${artist.displayName}.`;
      
      if ((release.aboutVisible ?? true) && release.about) {
        description = release.about.length > 150 ? release.about.substring(0, 147) + '...' : release.about;
      }

      const imageUrl = release.artworkUrl || `${window.location.origin}/fallback.png`;
      setSocialMetadata(title, description, imageUrl, publicUrl);
    }
  }, [release, artist]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (notFound || !artist || !release) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-[#111111] mb-4">{t('release.notFoundTitle')}</h1>
        <p className="text-gray-500 mb-8 max-w-md">{t('release.notFoundDesc')}</p>
        <Link to={artist ? `/@${artist.username}` : '/'} className="text-[10px] font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
          {t('release.returnArtist')}
        </Link>
      </div>
    );
  }

  const publicUrl = getReleasePublicUrl(artist.username, release.slug);
  const shareText = getReleaseShareText(release.title, artist.displayName, publicUrl);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#111111] font-sans pb-24 transition-colors duration-1000 selection:bg-black selection:text-white">
      <header className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 mb-8 bg-white">
         <Link to={`/@${artist.username}`} className="flex items-center gap-3 group shrink-0">
           {artist.avatarUrl ? (
             <img src={artist.avatarUrl} alt={artist.displayName} className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:border-black transition-colors" />
           ) : (
             <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
               <span className="text-[10px] font-bold text-gray-400">{artist.displayName.charAt(0)}</span>
             </div>
           )}
           <div className="flex flex-col">
             <span className="text-xs font-bold tracking-widest uppercase text-[#111111] group-hover:text-gray-600 transition-colors flex items-center gap-1.5">{artist.displayName}{artist.verificationStatus === 'verified' && (<div className="w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center shrink-0" title="Verified Artist"><Check className="w-2.5 h-2.5 text-white" strokeWidth={3} /></div>)}</span>
             <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">View Profile</span>
           </div>
         </Link>

         {user && user.id === artist.userId && (
           <div className="flex items-center gap-4 shrink-0">
             <Link to="/app" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1">
               <ArrowLeft className="w-3 h-3" />
               My Releases
             </Link>
             <Link to={`/app/edit/${release.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors">
               Edit Release
             </Link>
           </div>
         )}
      </header>

      <div className="mx-auto max-w-md px-6 flex flex-col gap-10">
        <div>
          <ReleaseCard 
            artistName={artist.displayName} 
            title={release.title} 
            artworkUrl={release.artworkUrl || ''} 
            hideListenButton
          />
        </div>

        {release.spotifyUrl && (
          <div>
            <SpotifyEmbed spotifyUrl={release.spotifyUrl} />
          </div>
        )}

        {(release.streamingLinks?.length || release.youtubeUrl) ? (
          <div>
            <StreamingLinks links={release.streamingLinks?.slice().sort((a, b) => a.sortOrder - b.sortOrder)}>
              {release.youtubeUrl && (
                !showYouTubePlayer ? (
                  <button
                    onClick={() => setShowYouTubePlayer(true)}
                    className="flex w-full items-center justify-between rounded-[10px] border border-gray-200 bg-white p-4 transition-colors hover:bg-black hover:text-white group"
                  >
                    <span className="text-sm font-bold tracking-widest uppercase truncate mr-4">{t('release.youtubeVideo')}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-300 transition-colors shrink-0">Play</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <YouTubeEmbed url={release.youtubeUrl} autoLoad={true} />
                    <button
                      onClick={() => setShowYouTubePlayer(false)}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors py-2"
                    >
                      Close Video
                    </button>
                  </div>
                )
              )}
            </StreamingLinks>
          </div>
        ) : null}

        {(release.aboutVisible ?? true) && release.about && (
          <div>
            <AboutSong text={release.about} visible={release.aboutVisible ?? true} />
          </div>
        )}

        <div className="flex flex-col items-center border-t border-gray-200 pt-10">
          <ShareActions 
            url={publicUrl}
            title={release.title}
            artistName={artist.displayName}
            shareText={shareText}
          />
        </div>

        <div className="pt-4 pb-8 flex flex-col items-center">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 text-center">Follow {artist.displayName}</h3>
          <SocialLinks links={artist.socialLinks?.slice().sort((a, b) => a.sortOrder - b.sortOrder) || []} />
        </div>
      </div>
      
      <div className="mt-20 border-t border-gray-200 bg-gray-50/50 pb-12 pt-12 flex flex-col items-center justify-center text-center px-6">
        <Link to="/" className="group flex flex-col items-center hover:opacity-80 transition-opacity">
          <p className="text-[10px] text-gray-500 font-medium tracking-wide">
            Bikin Release Page untuk lagumu
          </p>
          <p className="text-[11px] text-black font-bold mt-2 tracking-widest uppercase">
            habisrilis.web.id
          </p>
        </Link>
      </div>
    </div>
  );
};
