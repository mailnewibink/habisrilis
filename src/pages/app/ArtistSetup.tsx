import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Artist } from '../../types';
import { Loader2 } from 'lucide-react';
import { checkUsernameAvailable, createArtist } from '../../lib/supabase/artists';

export const ArtistSetup = () => {
  const { t } = useLanguage();

  const { user, artists, refreshArtistProfile, setActiveArtistId, updateUserAccountType } = useAuth();
  const navigate = useNavigate();
  
  const [artistName, setArtistName] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  
  const isFirstArtist = artists.length === 0;

  const accountType = user?.accountType || 'artist';
  const plan = user?.plan || 'free';
  const ownedArtistsCount = artists.length;

  let canCreate = true;
  let limitMessage = '';

  if (accountType === 'artist' && ownedArtistsCount >= 1) {
    canCreate = false;
    limitMessage = 'Artist accounts can only manage one Artist Profile.';
  } else if (accountType === 'manager' && plan === 'free' && ownedArtistsCount >= 2) {
    canCreate = false;
    limitMessage = 'Manage up to 2 artists on the Free plan.';
  }


  useEffect(() => {
    const checkUsername = async () => {
      const cleanUsername = username.trim().toLowerCase();
      if (!cleanUsername) {
        setUsernameAvailable(null);
        return;
      }
      
      const usernameRegex = /^[a-z0-9-]+$/;
      if (!usernameRegex.test(cleanUsername)) {
        setUsernameAvailable(false);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const isAvailable = await checkUsernameAvailable(cleanUsername);
        setUsernameAvailable(isAvailable);
      } catch (err) {
        console.error('Error checking username:', err);
        setUsernameAvailable(null); // fail safely
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timer = setTimeout(checkUsername, 500); // debounce
    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!artistName.trim() || !username.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (usernameAvailable === false) {
      setError('This username is not available or invalid.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (user.accountType === 'fan') {
        await updateUserAccountType('artist');
        // Wait a small moment to ensure the JWT reflects the change for RLS
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      const cleanUsername = username.trim().toLowerCase();
      const newArtist: Omit<Artist, 'id'> = {
        userId: user.id,
        username: cleanUsername,
        displayName: artistName.trim(),
        avatarUrl: user.avatarUrl,
      };
      
      const createdArtist = await createArtist(newArtist);
      await refreshArtistProfile();
      setActiveArtistId(createdArtist.id);
      
      if (user.accountType === 'manager') {
        navigate('/app/manager');
      } else {
        navigate('/app');
      }
    } catch (err) {
      console.error('Error creating artist profile:', err);
      setError('An error occurred while creating your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 selection:bg-gray-200">
      <div className="w-full max-w-md bg-white p-10 border border-gray-100 shadow-sm rounded-[14px]">
        <div className="mb-8 text-center">
          <div className="w-8 h-8 bg-black mx-auto mb-6"></div>
          {canCreate ? (
            isFirstArtist ? (
              <>
                <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome to habisrilis.web.id.</h1>
                <p className="text-gray-500 font-light text-sm">First, let's set up your artist profile.</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight mb-2">Add New Artist</h1>
                <p className="text-gray-500 font-light text-sm">Set up another artist profile.</p>
              </>
            )
          ) : accountType === 'manager' && plan === 'free' && ownedArtistsCount >= 2 ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight mb-2">You've reached your free artist limit.</h1>
              <p className="text-gray-500 font-light text-sm mb-6">Upgrade to Manager Pro to manage unlimited artists.</p>
              <Button fullWidth onClick={() => navigate('/app/upgrade')}>
                Upgrade to Pro
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Limit reached</h1>
              <p className="text-gray-500 font-light text-sm">{limitMessage}</p>
            </>
          )}
        </div>

        {canCreate ? (
          <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="artistName" className="block text-sm font-bold uppercase tracking-widest mb-2">
              Artist Name
            </label>
            <Input
              id="artistName"
              placeholder="e.g. Ibink"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-bold uppercase tracking-widest mb-2">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400 font-medium">@</span>
              <Input
                id="username"
                placeholder="ibink"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`pl-8 pr-10 ${
                  usernameAvailable === false ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 
                  usernameAvailable === true ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : ''
                }`}
                disabled={isSubmitting}
              />
              <div className="absolute right-3 flex items-center">
                {isCheckingUsername && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                {!isCheckingUsername && usernameAvailable === true && (
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {!isCheckingUsername && usernameAvailable === false && (
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-light">
              {usernameAvailable === false 
                ? <span className="text-red-500 font-medium">Username is unavailable or invalid.</span>
                : `This will be your public profile URL: habisrilis.web.id/@${username.trim().toLowerCase() || 'username'}`}
            </p>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <Button type="submit" fullWidth size="lg" disabled={isSubmitting || usernameAvailable === false}>
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
          </Button>
          
          {!isFirstArtist && (
             <Button 
               type="button" 
               variant="ghost" 
               fullWidth 
               onClick={() => user?.accountType === 'manager' ? navigate('/app/manager') : navigate('/app')}
               disabled={isSubmitting}
               className="mt-2"
             >
               Cancel
             </Button>

          )}
        </form>
        ) : (
          <div className="space-y-4">
            {accountType === 'manager' && plan === 'free' ? (
              <>
                <Button fullWidth size="lg" onClick={() => navigate('/app/upgrade')}>Upgrade to Manager Pro</Button>
                <Button variant="ghost" fullWidth onClick={() => navigate('/app/manager')}>Return to Dashboard</Button>
              </>
            ) : (
              <Button variant="ghost" fullWidth onClick={() => navigate('/app')}>Return to Dashboard</Button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
