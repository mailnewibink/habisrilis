import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Artist } from '../../types';

export const ClaimArtistDiscovery = () => {
  const { t } = useLanguage();

  const { user, artists } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Artist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setError(null);
    setResults([]);

    // Clean up username if they included the @ symbol
    const query = searchQuery.trim();
    const cleanUsername = query.startsWith('@') ? query.substring(1) : query;

    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .or(`username.ilike.%${cleanUsername}%,display_name.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;

      if (data) {
        setResults(data.map(artist => ({
          id: artist.id,
          username: artist.username,
          displayName: artist.display_name,
          bio: artist.bio,
          avatarUrl: artist.avatar_url,
          socialLinks: artist.social_links,
          verificationStatus: artist.verification_status || 'unclaimed',
          createdAt: artist.created_at,
          updatedAt: artist.updated_at
        })));
      }
    } catch (err: any) {
      console.error('Error searching artists:', err);
      setError(err.message || 'Failed to search artists.');
    } finally {
      setIsSearching(false);
    }
  };

  const getBackLink = () => {
    if (user?.accountType === 'manager') return '/app/manager';
    return '/app';
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 font-sans">
      <div className="max-w-2xl mx-auto py-8">
        <Link 
          to={getBackLink()}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Dashboard
        </Link>
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-tighter text-[#111111] mb-2">Claim an Artist</h1>
          <p className="text-gray-500 text-sm">Find the Artist Profile you want to claim.</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artist name or @username"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                required
              />
            </div>
            <Button type="submit" disabled={isSearching} className="px-6 h-[50px]">
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SEARCH'}
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>

        <div className="space-y-4">
          {isSearching && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          )}

          {!isSearching && hasSearched && results.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-[14px] p-12 text-center shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-2">No Artist Profile found.</h3>
              <p className="text-gray-500 text-sm">
                Try another artist name or username.
              </p>
            </div>
          )}

          {!isSearching && results.map((result) => {
            const isManagedByCurrentUser = artists.some(a => a.id === result.id);
            
            return (
              <div key={result.id} className="bg-white border border-gray-200 rounded-[14px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {result.avatarUrl ? (
                    <img src={result.avatarUrl} alt={result.displayName} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <span className="text-xl font-bold text-gray-400">{result.displayName.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#111111]">{result.displayName}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">@{result.username}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Link to={`/@${result.username}`}>
                    <Button variant="outline" className="w-full sm:w-auto text-[10px] uppercase tracking-widest">
                      View Profile
                    </Button>
                  </Link>

                  {isManagedByCurrentUser ? (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 px-4 py-2 bg-green-50 rounded border border-green-100">
                      Managed by you
                    </span>
                  ) : result.verificationStatus === 'verified' ? (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-1 px-4 py-2 bg-gray-50 rounded border border-gray-200">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-black fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Verified Artist
                    </span>
                  ) : result.verificationStatus === 'claim_pending' ? (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 px-4 py-2 bg-orange-50 rounded border border-orange-100">
                      Verification Pending
                    </span>
                  ) : (
                    <Link to={`/claim/@${result.username}`}>
                      <Button className="w-full sm:w-auto text-[10px] uppercase tracking-widest">
                        Claim
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
