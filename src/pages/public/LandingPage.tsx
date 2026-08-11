import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageToggle } from '../../components/LanguageToggle';
import { supabase } from '../../lib/supabase';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ReleaseCard } from '../../components/release/ReleaseCard';
import { ArtistCard } from '../../components/release/ArtistCard';
import { useAuth } from '../../auth/AuthContext';
import { Loader2, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { VerifiedBadge } from '../../components/ui/VerifiedBadge';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { getTrendingReleases, getNewReleases, getVerifiedArtists, getRecentArtists, searchGlobal } from '../../lib/supabase/public';
import { Artist, Release } from '../../types';



export const LandingPage = () => {
  const { lang } = useLanguage();
  const { t } = useLanguage();
  const { signInWithGoogle, user, artist, artistLoading } = useAuth();
  const effectiveAccountType = user?.accountType || (artist ? 'artist' : null);
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [trendingReleases, setTrendingReleases] = useState<Release[]>([]);
  const [newReleases, setNewReleases] = useState<Release[]>([]);
  const [verifiedArtists, setVerifiedArtists] = useState<Artist[]>([]);
  const [recentArtists, setRecentArtists] = useState<Artist[]>([]);
  const [featuredRelease, setFeaturedRelease] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ artists: Artist[], releases: Release[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchItems = useMemo(() => {
    if (!searchResults) return [];
    const items: Array<{ type: 'artist' | 'release'; data: any }> = [];
    searchResults.artists.forEach(a => items.push({ type: 'artist', data: a }));
    searchResults.releases.forEach(r => items.push({ type: 'release', data: r }));
    return items;
  }, [searchResults]);

  const handleSelect = (item: { type: 'artist' | 'release'; data: any }) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults(null);
    if (item.type === 'artist') {
      navigate(`/@${item.data.username}`);
    } else {
      navigate(`/@${item.data.artist?.username || item.data.artistId}/${item.data.slug}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < searchItems.length) {
        handleSelect(searchItems[selectedIndex]);
      } else if (searchItems.length > 0) {
        handleSelect(searchItems[0]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trending, newRel, verified, recent] = await Promise.all([
          getTrendingReleases(8),
          getNewReleases(8),
          getVerifiedArtists(8),
          getRecentArtists(8)
        ]);
        setTrendingReleases(trending);
        setNewReleases(newRel);
        setVerifiedArtists(verified);
        
        try {
          const featuredRes = await fetch('/api/featured');
          const featuredData = await featuredRes.json();
          if (featuredData.featuredReleaseId) {
            const { data: featData } = await supabase.from('releases').select('*, artist:artists(*)').eq('id', featuredData.featuredReleaseId).single();
            if (featData) setFeaturedRelease(featData);
          }
        } catch(e) {}

        setRecentArtists(recent);
      } catch (err) {
        console.error('Error fetching landing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchGlobal(searchQuery);
          setSearchResults(results);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    if (user && isLoggingIn && !artistLoading) {
      if (!effectiveAccountType) {
        navigate('/onboarding');
      } else if (effectiveAccountType === 'manager') {
        navigate('/app/manager');
      } else if (effectiveAccountType === 'fan') {
        navigate('/app/fan');
      } else {
        navigate('/app');
      }
    }
  }, [user, effectiveAccountType, navigate, isLoggingIn]);

  const handleLogin = async () => {
    console.log('Login button clicked. user:', user ? user.id : null);
    if (user) {
      if (!effectiveAccountType) {
        navigate('/onboarding');
      } else if (effectiveAccountType === 'manager') {
        navigate('/app/manager');
      } else if (effectiveAccountType === 'fan') {
        navigate('/app/fan');
      } else {
        navigate('/app');
      }
      return;
    }
    
    setIsLoggingIn(true);
    setError(null);
    try {
      console.log('Calling signInWithGoogle');
      await signInWithGoogle();
      console.log('signInWithGoogle completed');
      
      // If we are in an iframe environment, signInWithGoogle might open a popup.
      // We keep the spinner going until the `user` state changes (which triggers the useEffect above).
      // However, if the user closes the popup without logging in, we would spin forever.
      // For simplicity, we just leave it spinning, or we can listen for window focus.
      
      const onFocus = () => {
        // If window gets focus back and we don't have a user shortly, reset spinner
        setTimeout(() => {
          setIsLoggingIn(false);
          window.removeEventListener('focus', onFocus);
        }, 1000);
      };
      window.addEventListener('focus', onFocus);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError('We couldn\'t sign you in. Please try again. ' + (err?.message || ''));
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-gray-200">
      <PublicNavbar />

      <main>
            <section className="relative px-6 pt-32 pb-20 lg:px-10 lg:pt-48 border-b border-gray-100">
              <div className="mx-auto max-w-7xl">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                  
                  <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
                    <h1 className="text-5xl font-bold leading-[0.9] tracking-tighter sm:text-7xl mb-6">
                      {t('landing.titleLine1')}<br/>{t('landing.titleLine2')}<br/>{t('landing.titleLine3')}
                    </h1>
                    <p className="text-lg text-gray-500 max-w-sm leading-relaxed font-light mx-auto lg:mx-0 mb-10">
                      {t('landing.subtitle')}
                    </p>
                    {error && (
                      <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                      {user ? (
                        <Button size="lg" fullWidth onClick={handleLogin} disabled={isLoggingIn}>
                          {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : (effectiveAccountType ? t('landing.goToDashboard') : t('landing.completeSetup'))}
                        </Button>
                      ) : (
                        <>
                          <Button size="lg" fullWidth onClick={handleLogin} disabled={isLoggingIn}>
                            {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : t('landing.createPage')}
                          </Button>
                        </>
                      )}
                      <Link to="/examples" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest group whitespace-nowrap ml-2">
                        {t('landing.seeExample')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
                    <div className="w-full max-w-[320px] relative z-10">
                      {featuredRelease ? (
                      <ReleaseCard
                        title={featuredRelease.title}
                        artistName={featuredRelease.artist?.display_name || featuredRelease.artist?.displayName || 'Unknown'}
                        artworkUrl={featuredRelease.artwork_url || featuredRelease.artworkUrl || ''}
                        slug={featuredRelease.slug}
                        artistUsername={featuredRelease.artist?.username}
                        releaseType={featuredRelease.release_type || featuredRelease.releaseType}
                        releaseDate={featuredRelease.release_date || featuredRelease.releaseDate}
                        hideListenButton
                      />
                    ) : trendingReleases.length > 0 ? (
                      <ReleaseCard
                        title={trendingReleases[0].title}
                        artistName={trendingReleases[0].artist?.displayName || 'Unknown'}
                        artworkUrl={trendingReleases[0].artworkUrl || ''}
                        slug={trendingReleases[0].slug}
                        artistUsername={trendingReleases[0].artist?.username}
                        releaseType={trendingReleases[0].releaseType}
                        releaseDate={trendingReleases[0].releaseDate}
                        hideListenButton
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                        {t('landing.noFeaturedRelease')}
                      </div>
                    )}
                    <div className="absolute -top-4 -right-4 bg-yellow-400 text-black text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-20">
                      {t('landing.featuredRelease')}
                    </div>
                    </div>
                    {/* Background decorative geometric elements */}
                    <div className="pointer-events-none absolute top-10 right-0 w-48 h-48 border border-gray-200 -rotate-12 opacity-50 hidden lg:block"></div>
                    <div className="pointer-events-none absolute bottom-10 left-10 w-64 h-32 border border-gray-200 rotate-6 opacity-30 hidden lg:block"></div>
                  </div>

                </div>
              </div>
            </section>

            <section className="px-6 py-12 lg:px-10 mx-auto max-w-7xl">
              <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold tracking-tighter uppercase">{t('landing.trendingReleases')}</h2>
              </div>
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
              ) : trendingReleases.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {trendingReleases.map(release => (
                    <ReleaseCard
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
                <p className="text-gray-400 text-sm">No trending releases yet.</p>
              )}
            </section>
            
            <section className="px-6 py-12 bg-[#F9F9F9]">
              <div className="mx-auto max-w-7xl">
                <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold tracking-tighter uppercase">{t('landing.verifiedArtists')}</h2>
                </div>
                {loading ? (
                  <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
                ) : verifiedArtists.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {verifiedArtists.map(artist => (
                      <ArtistCard 
                        key={artist.id}
                        username={artist.username}
                        displayName={artist.displayName}
                        avatarUrl={artist.avatarUrl}
                        isVerified={true}
                        totalReleases={(artist as any).totalReleases}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No verified artists yet.</p>
                )}
              </div>
            </section>

            <section className="px-6 py-12 lg:px-10 mx-auto max-w-7xl">
              <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold tracking-tighter uppercase">{t('landing.newReleases')}</h2>
              </div>
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
              ) : newReleases.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {newReleases.map(release => (
                    <ReleaseCard
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
                <p className="text-gray-400 text-sm">No new releases yet.</p>
              )}
            </section>

            <section className="px-6 py-12 bg-[#F9F9F9]">
              <div className="mx-auto max-w-7xl">
                <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold tracking-tighter uppercase">Recently Added Artists</h2>
                </div>
                {loading ? (
                  <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
                ) : recentArtists.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {recentArtists.map(artist => (
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
                ) : (
                  <p className="text-gray-400 text-sm">No artists yet.</p>
                )}
              </div>
            </section>
      </main>

      <footer className="bg-white py-12 text-center border-t border-gray-100 mt-12">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400">habisrilis.web.id © 2026 — Made for Music</p>
      </footer>
    </div>
  );
};
