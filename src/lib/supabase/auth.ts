import { supabase } from '../supabase';
import { User } from '../../types';

export const signInWithGoogle = async () => {
  let appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  appUrl = appUrl.replace(/\/$/, ''); // Remove trailing slash if present
  
  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  
  // Open popup synchronously to avoid popup blockers
  const popup = window.open(
    'about:blank', 
    'Google Sign In', 
    `width=${width},height=${height},left=${left},top=${top}`
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${appUrl}/auth/callback`,
      skipBrowserRedirect: true
    }
  });
  
  if (error) {
    if (popup) popup.close();
    throw error;
  }
  
  if (data?.url) {
    if (popup && !popup.closed) {
      popup.location.href = data.url;
    } else {
      window.location.href = data.url;
    }
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || '',
        avatarUrl: session.user.user_metadata?.avatar_url || undefined,
        accountType: session.user.user_metadata?.account_type || undefined,
        plan: 'free', // Will be fetched from manager_subscriptions
        createdAt: session.user.created_at,
      });
    } else {
      callback(null);
    }
  });
};

export const updateAccountType = async (accountType: 'artist' | 'manager' | 'fan') => {
  const { error } = await supabase.auth.updateUser({
    data: { account_type: accountType }
  });
  if (error) throw error;
};
