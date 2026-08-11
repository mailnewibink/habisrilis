import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Missing Supabase configuration. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided.');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : new Proxy({} as SupabaseClient, {
      get: (target, prop) => {
        if (prop === 'auth') {
           return {
             onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
             signInWithOAuth: () => Promise.reject(new Error('Missing Supabase configuration')),
             signOut: () => Promise.resolve(),
             getSession: () => Promise.resolve({ data: { session: null }, error: null }),
           };
        }
        return () => Promise.reject(new Error('Missing Supabase configuration.'));
      }
    });
