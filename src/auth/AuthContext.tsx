import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Artist } from '../types';
import { signInWithGoogle, signOut, onAuthStateChange, updateAccountType } from '../lib/supabase/auth';
import { getArtistsByUserId } from '../lib/supabase/artists';
import { supabase } from '../lib/supabase';
import { safeStorage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  artist: Artist | null; // Alias for activeArtist
  artists: Artist[];
  activeArtist: Artist | null;
  setActiveArtistId: (id: string) => void;
  loading: boolean;
  artistLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshArtistProfile: () => Promise<void>;
  updateUserAccountType: (accountType: 'artist' | 'manager' | 'fan') => Promise<void>;
  refreshPlan: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [activeArtistId, setActiveArtistIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [artistLoading, setArtistLoading] = useState(true);
  
  const currentUserId = useRef<string | null>(null);

  const fetchUserPlan = async () => {
    try {
      const { data, error } = await supabase.rpc('get_current_plan');
      if (error) {
        if (error.code === 'PGRST202' || error.message?.includes('Could not find the function')) {
          const { data: { session } } = await supabase.auth.getSession();
          return session?.user?.user_metadata?.plan || 'free';
        }
        console.error('Error fetching plan:', error);
        return 'free';
      }
      return data || 'free';
    } catch (err: any) {
      if (err?.code === 'PGRST202' || err?.message?.includes('Could not find the function')) {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.user?.user_metadata?.plan || 'free';
      }
      console.error('Error fetching plan:', err);
      return 'free';
    }
  };

  const fetchArtistProfile = async (uid: string) => {
    try {
      const fetchedArtists = await getArtistsByUserId(uid);
      setArtists(fetchedArtists);
      
      if (fetchedArtists.length > 0) {
        const savedActiveId = safeStorage.getItem('habisrilis_active_artist_id');
        if (savedActiveId && fetchedArtists.some(a => a.id === savedActiveId)) {
          setActiveArtistIdState(savedActiveId);
        } else {
          setActiveArtistIdState(fetchedArtists[0].id);
          safeStorage.setItem('habisrilis_active_artist_id', fetchedArtists[0].id);
        }
      } else {
        setActiveArtistIdState(null);
        safeStorage.removeItem('habisrilis_active_artist_id');
      }
    } catch (error) {
      console.error('Error fetching artist profile:', error);
      setArtists([]);
      setActiveArtistIdState(null);
    } finally {
      setArtistLoading(false);
    }
  };

  useEffect(() => {
    const handleAuthSuccess = (hash: string) => {
      const url = new URL(window.location.href);
      url.hash = hash;
      window.location.href = url.toString();
      window.location.reload();
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'AUTH_SUCCESS' && event.data.hash) {
        handleAuthSuccess(event.data.hash);
      }
    };
    window.addEventListener('message', handleMessage);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('auth_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'AUTH_SUCCESS' && event.data.hash) {
          handleAuthSuccess(event.data.hash);
        }
      };
    } catch (e) {}

    // Check if we are a popup and have an access token
    if (window.opener && !window.opener.closed) {
      if (window.location.hash.includes('access_token=')) {
        window.opener.postMessage({
          type: 'AUTH_SUCCESS',
          hash: window.location.hash
        }, '*');
        
        try {
          if (channel) {
            channel.postMessage({ type: 'AUTH_SUCCESS', hash: window.location.hash });
          }
        } catch (e) {}

        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center;"><div><h2>Login Successful</h2><p>Please wait...</p></div></div>';
        setTimeout(() => window.close(), 500);
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      if (channel) channel.close();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const { data: authListener } = onAuthStateChange(async (supabaseUser) => {
      if (!mounted) return;

      if (supabaseUser) {
        if (currentUserId.current !== supabaseUser.id) {
          setLoading(true);
          setArtistLoading(true);
          
          currentUserId.current = supabaseUser.id;
          
          const [actualPlan] = await Promise.all([
            fetchUserPlan(),
            fetchArtistProfile(supabaseUser.id)
          ]);
          
          if (mounted) {
            setUser({ ...supabaseUser, plan: actualPlan as 'free' | 'manager_pro' });
          }
        } else {
          setUser(prev => prev ? { ...supabaseUser, plan: prev.plan } : supabaseUser);
        }
      } else {
        setUser(null);
        setArtists([]);
        setActiveArtistIdState(null);
        currentUserId.current = null;
        if (mounted) {
          setArtistLoading(false);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const refreshArtistProfile = async () => {
    if (user) {
      await fetchArtistProfile(user.id);
    }
  };

  const handleUpdateUserAccountType = async (accountType: 'artist' | 'manager' | 'fan') => {
    await updateAccountType(accountType);
    if (user) {
      setUser({ ...user, accountType });
    }
  };

  const refreshPlan = async () => {
    if (user) {
      const actualPlan = await fetchUserPlan();
      setUser({ ...user, plan: actualPlan as 'free' | 'manager_pro' });
    }
  };

  const setActiveArtistId = (id: string) => {
    if (artists.some(a => a.id === id)) {
      setActiveArtistIdState(id);
      safeStorage.setItem('habisrilis_active_artist_id', id);
    }
  };

  const activeArtist = artists.find(a => a.id === activeArtistId) || artists[0] || null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      artist: activeArtist, 
      artists,
      activeArtist,
      setActiveArtistId,
      loading, 
      artistLoading,
      signInWithGoogle: handleSignInWithGoogle, 
      logout, 
      refreshArtistProfile, 
      updateUserAccountType: handleUpdateUserAccountType,
      refreshPlan 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
