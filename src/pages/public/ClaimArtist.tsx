import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Artist } from '../../types';
import { getArtistByUsername } from '../../lib/supabase/artists';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft, Copy, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ClaimArtist = () => {
  const { username } = useParams<{ username: string }>();
  const { user, artists, loading: authLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const [claimRole, setClaimRole] = useState<'artist' | 'manager'>('artist');
  const [socialLink, setSocialLink] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [existingClaim, setExistingClaim] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const accountType = user?.accountType || 'artist';
  const plan = user?.plan || 'free';
  const ownedArtistsCount = artists.length;

  let canClaim = true;
  let limitMessage = '';

  if (accountType === 'artist' && ownedArtistsCount >= 1) {
    canClaim = false;
    limitMessage = 'Artist accounts can only manage one Artist Profile.';
  } else if (accountType === 'manager' && plan === 'free' && ownedArtistsCount >= 2) {
    canClaim = false;
    limitMessage = 'Manage up to 2 artists on the Free plan.';
  } else if (accountType === 'fan') {
    canClaim = false;
    limitMessage = 'Fan accounts cannot claim artists.';
  }


  useEffect(() => {
    const fetchArtist = async () => {
      if (!username?.startsWith('@')) {
        setNotFound(true);
        setLoading(false);
        return;
      }
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
          return;
        }
        setArtist(artistData);
        
        // Generate a code if one doesn't exist
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        setVerificationCode(`HABISRILIS-${randomStr}`);

      } catch (err) {
        console.error('Error fetching artist:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [username]);

  useEffect(() => {
    const checkExistingClaim = async () => {
      if (!user || !artist) return;
      try {
        const { data, error } = await supabase
          .from('artist_claims')
          .select('*')
          .eq('artist_id', artist.id)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (data) {
          setExistingClaim(data);
        }
      } catch (err) {
        console.error('Error checking existing claim:', err);
      }
    };
    checkExistingClaim();
  }, [user, artist]);

  const handleLogin = async () => {
    sessionStorage.setItem('habisrilis_return_to', `/claim/${username}`);
    await signInWithGoogle();
  };

  const copyCode = () => {
    if (existingClaim?.verification_code || verificationCode) {
      navigator.clipboard.writeText(existingClaim?.verification_code || verificationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !artist) return;
    
    if (!socialLink || !socialLink.startsWith('http')) {
      setError('Please provide a valid URL starting with http:// or https://');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Create claim record
      const { data, error: insertError } = await supabase
        .from('artist_claims')
        .insert({
          artist_id: artist.id,
          user_id: user.id,
          verification_code: verificationCode,
          social_link: socialLink,
          status: 'pending'
          // role is omitted because it is not in the schema
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      setExistingClaim(data);
      // We mutate the local state directly so the UI updates
      setArtist({ ...artist, verificationStatus: 'claim_pending' });
    } catch (err: any) {
      console.error('Error submitting claim:', err);
      if (err.code === '23505') {
        setError('A pending claim already exists.');
      } else {
        setError(err.message || 'Failed to submit claim. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 selection:bg-gray-200">
      <div className="w-full max-w-2xl">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {existingClaim && existingClaim.status === 'pending' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-[#111111] mb-4">Claim Submitted</h1>
            <p className="text-gray-500 mb-8">We are reviewing your claim for {artist?.displayName}. You will be notified once the verification process is complete.</p>
            
            <Link to="/app">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        )}

        {existingClaim && existingClaim.status === 'rejected' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-red-600 mb-4">Claim Rejected</h1>
            <p className="text-gray-500 mb-8">Your verification claim was not approved. The verification code you submitted is no longer valid. If you believe this is a mistake, you can submit a new claim.</p>
            
            <Button onClick={() => setExistingClaim(null)} className="w-full mb-4">Submit New Claim</Button>
            <Link to={`/@${artist?.username}`}>
              <Button variant="outline" className="w-full">Return to Profile</Button>
            </Link>
          </div>
        )}

        {!existingClaim && artist && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold uppercase tracking-widest text-[#111111] mb-4">Claim this Artist Profile</h1>
              <p className="text-sm text-gray-500">If you are the artist or an authorized representative, you can request ownership of this profile. Do NOT claim an artist you do not represent.</p>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-10">
              {artist.avatarUrl ? (
                <img src={artist.avatarUrl} alt={artist.displayName} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-200 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-400">{artist.displayName.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-[#111111]">{artist.displayName}</h3>
                <p className="text-xs text-gray-500">@{artist.username}</p>
              </div>
            </div>
            
            {!user ? (
              <div className="text-center border-t border-gray-100 pt-8 mt-4">
                <p className="text-sm text-gray-500 mb-6">You must be signed in to submit a claim.</p>
                <Button onClick={handleLogin} className="w-full h-12">
                  Sign in to Claim
                </Button>
              </div>
            ) : !canClaim ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                {accountType === 'manager' && plan === 'free' ? (
                  <>
                    <h3 className="text-lg font-bold mb-2">You've reached your free artist limit.</h3>
                    <p className="text-gray-500 text-sm mb-6">Upgrade to Manager Pro to manage unlimited artists.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold mb-2">Cannot claim artist</h3>
                    <p className="text-gray-500 text-sm mb-6">{limitMessage}</p>
                  </>
                )}
                {accountType === 'manager' && plan === 'free' && (
                  <Link to="/app/upgrade" className="block w-full mb-2">
                    <Button fullWidth size="lg">Upgrade to Pro</Button>
                  </Link>
                )}
                <Link to="/app">
                  <Button variant="ghost" fullWidth>Return to Dashboard</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
                    I am claiming this profile as:
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setClaimRole('artist')}
                      className={`py-3 px-4 rounded border text-sm font-medium transition-colors ${claimRole === 'artist' ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                    >
                      Artist
                    </button>
                    <button
                      type="button"
                      onClick={() => setClaimRole('manager')}
                      className={`py-3 px-4 rounded border text-sm font-medium transition-colors ${claimRole === 'manager' ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                    >
                      Manager / Label
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-bold text-[#111111] mb-6">Verification Instructions</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Step 1</p>
                      <p className="text-sm text-gray-600 mb-3">Copy your unique verification code.</p>
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-4 py-3">
                        <code className="text-sm font-mono font-bold text-black">{verificationCode}</code>
                        <button type="button" onClick={copyCode} className="text-gray-400 hover:text-black transition-colors">
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Step 2</p>
                      <p className="text-sm text-gray-600">Place it somewhere publicly associated with the artist. Options include:</p>
                      <ul className="list-disc list-inside text-sm text-gray-500 mt-2 ml-1 space-y-1">
                        <li>Spotify Artist Profile</li>
                        <li>Instagram Bio</li>
                        <li>TikTok Bio</li>
                        <li>SoundCloud Description</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Step 3</p>
                      <p className="text-sm text-gray-600 mb-3">Provide a link to where you placed the code.</p>
                      <input
                        type="url"
                        value={socialLink}
                        onChange={(e) => setSocialLink(e.target.value)}
                        placeholder="https://instagram.com/exampleartist"
                        required
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                      />
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100">
                  <Button type="submit" disabled={submitting} className="w-full h-12">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Claim'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
}
