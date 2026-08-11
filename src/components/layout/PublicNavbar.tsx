import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, Loader2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { cn } from '../../lib/utils';
import { VerifiedBadge } from '../ui/VerifiedBadge';
import { searchGlobal } from '../../lib/supabase/public';
import { Artist, Release } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageToggle } from '../LanguageToggle';


export const PublicNavbar = () => {
  const navigate = useNavigate();
  const { user, isLoggingIn, effectiveAccountType, signInWithGoogle } = useAuth();
  const { lang } = useLanguage();
  const { t } = useLanguage();
  
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

  const handleLogin = async () => {
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
    } else {
      await signInWithGoogle();
    }
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-2">
          <img src="https://res.cloudinary.com/dvy4znkvy/image/upload/v1786332080/h_4_sxrvod.png" alt="habisrilis.web.id logo" className="h-6 w-auto object-contain" />
          <span className="font-bold text-lg tracking-tighter hidden sm:block">habisrilis<span className="text-gray-600">.web.id</span></span>
        </Link>
        <div className="flex-1 max-w-md mx-6">
           <div className="relative" ref={searchContainerRef}>
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <Input 
               placeholder={t('nav.searchPlaceholder')} 
               className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white"
               value={searchQuery}
               onChange={(e) => {
                 setSearchQuery(e.target.value);
                 if (e.target.value.trim().length >= 2) setIsSearchOpen(true);
                 else { setIsSearchOpen(false); setSearchResults(null); }
                 setSelectedIndex(-1);
               }}
               onFocus={() => {
                 if (searchQuery.trim().length >= 2) setIsSearchOpen(true);
               }}
               onKeyDown={handleSearchKeyDown}
               role="combobox"
               aria-expanded={isSearchOpen}
               aria-controls="search-dropdown"
               aria-activedescendant={selectedIndex >= 0 ? `search-item-${selectedIndex}` : undefined}
             />
             {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />}
             
             {isSearchOpen && (
               <div 
                 id="search-dropdown"
                 role="listbox"
                 className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-[60vh] overflow-y-auto z-50 flex flex-col"
               >
                 {isSearching && !searchResults ? (
                    <div className="p-4 space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-md animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-100 rounded w-1/2 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/4 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                 ) : searchItems.length > 0 ? (
                   <div className="py-2">
                     {searchResults?.artists && searchResults.artists.length > 0 && (
                       <div className="mb-2">
                         <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('nav.artists')}</div>
                         {searchResults.artists.map((artist) => {
                           const index = searchItems.findIndex(item => item.type === 'artist' && item.data.id === artist.id);
                           const isSelected = selectedIndex === index;
                           return (
                             <div
                               key={artist.id}
                               id={`search-item-${index}`}
                               role="option"
                               aria-selected={isSelected}
                               onClick={() => handleSelect({ type: 'artist', data: artist })}
                               className={cn(
                                 "px-4 py-2 flex items-center gap-3 cursor-pointer transition-colors",
                                 isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                               )}
                             >
                               <img src={artist.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.displayName)}&background=random`} alt={artist.displayName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                               <div className="flex flex-col">
                                 <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-sm text-gray-900">{artist.displayName}</span>
                                    {artist.verificationStatus === 'verified' && <VerifiedBadge className="w-3.5 h-3.5" iconClassName="w-2.5 h-2.5" />}
                                 </div>
                                 <span className="text-xs text-gray-500">@{artist.username}</span>
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     )}
                     {searchResults?.releases && searchResults.releases.length > 0 && (
                       <div>
                         <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('nav.releases')}</div>
                         {searchResults.releases.map((release) => {
                           const index = searchItems.findIndex(item => item.type === 'release' && item.data.id === release.id);
                           const isSelected = selectedIndex === index;
                           return (
                             <div
                               key={release.id}
                               id={`search-item-${index}`}
                               role="option"
                               aria-selected={isSelected}
                               onClick={() => handleSelect({ type: 'release', data: release })}
                               className={cn(
                                 "px-4 py-2 flex items-center gap-3 cursor-pointer transition-colors",
                                 isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                               )}
                             >
                               <img src={release.artworkUrl} alt={release.title} className="w-10 h-10 rounded-md object-cover shadow-sm" />
                               <div className="flex flex-col">
                                 <span className="font-medium text-sm text-gray-900">{release.title}</span>
                                 <span className="text-xs text-gray-500">{release.artist?.displayName || 'Unknown Artist'}</span>
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     )}
                   </div>
                 ) : searchResults ? (
                   <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
                     <span className="text-2xl mb-2">🔍</span>
                     <p className="text-sm font-medium text-gray-900 mb-1">{t('nav.noResults')}</p>
                   </div>
                 ) : null}
               </div>
             )}
           </div>
        </div>
        <div className="flex items-center gap-4">
           <LanguageToggle />
           <Link to="/about" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">{t('nav.about')}</Link>
           <Link to="/pricing" className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity hidden lg:block">{t('nav.pricing')}</Link>
           {user ? (
             <Button variant="outline" size="sm" onClick={handleLogin} disabled={isLoggingIn}>
               {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : (effectiveAccountType ? t('nav.dashboard') : t('nav.completeSetup'))}
             </Button>
           ) : (
             <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" onClick={handleLogin} disabled={isLoggingIn}>
                 {t('nav.signIn')}
               </Button>
               <Button variant="outline" size="sm" onClick={handleLogin} disabled={isLoggingIn}>
                 {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : t('nav.signUp')}
               </Button>
             </div>
           )}
        </div>
      </nav>
    </header>
  );
};
