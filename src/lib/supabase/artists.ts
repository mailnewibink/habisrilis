import { supabase } from '../supabase';
import { Artist } from '../../types';
import { DEMO_ARTIST, DEMO_ARTIST_2 } from '../demo-data';

export const getArtistsByUserId = async (userId: string): Promise<Artist[]> => {
  // 1. Fetch via members table for future multi-user claims
  const { data: membersData, error: membersError } = await supabase
    .from('artist_members')
    .select('artists(*)')
    .eq('user_id', userId);

  let memberArtists: any[] = [];
  if (!membersError && membersData) {
    memberArtists = membersData
      .map((m: any) => m.artists)
      .filter(Boolean);
  }

  // 2. Fallback: also fetch legacy user_id
  const { data: legacyData, error: legacyError } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', userId);

  if (legacyError) {
    throw legacyError;
  }

  // Merge and deduplicate
  const allArtists = [...memberArtists, ...legacyData];
  const uniqueArtists = Array.from(new Map(allArtists.map(a => [a.id, a])).values());

  return uniqueArtists.map(mapArtist);
};

export const getArtistByUserId = async (userId: string): Promise<Artist | null> => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  
  return mapArtist(data);
};

export const getArtistByUsername = async (username: string): Promise<Artist | null> => {
  if (username === 'demo-ibink') return DEMO_ARTIST;
  if (username === 'demo-neon-dreams') return DEMO_ARTIST_2;

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('username', username)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapArtist(data);
};

export const createArtist = async (artist: Omit<Artist, 'id'>): Promise<Artist> => {
  const { data, error } = await supabase
    .from('artists')
    .insert({
      user_id: artist.userId,
      username: artist.username,
      display_name: artist.displayName,
      avatar_url: artist.avatarUrl,
      bio: artist.bio,
      social_links: artist.socialLinks || []
    })
    .select()
    .single();
    
  if (error) throw error;
  return mapArtist(data);
};

export const updateArtist = async (id: string, updates: Partial<Artist>): Promise<void> => {
  const payload: any = {};
  if (updates.username !== undefined) payload.username = updates.username;
  if (updates.displayName !== undefined) payload.display_name = updates.displayName;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
  if (updates.bio !== undefined) payload.bio = updates.bio;
  if (updates.socialLinks !== undefined) payload.social_links = updates.socialLinks;
  payload.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('artists')
    .update(payload)
    .eq('id', id);
    
  if (error) throw error;
};

export const deleteArtist = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('artists')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

export const checkUsernameAvailable = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('artists')
    .select('id')
    .eq('username', username)
    .maybeSingle();
    
  if (error) throw error;
  return !data;
};

const mapArtist = (data: any): Artist => ({
  id: data.id,
  userId: data.user_id,
  username: data.username,
  displayName: data.display_name,
  avatarUrl: data.avatar_url,
  bio: data.bio,
  socialLinks: data.social_links,
  verificationStatus: data.verification_status || 'unclaimed',
  createdAt: data.created_at,
  updatedAt: data.updated_at
});
