import { supabase } from '../supabase';
import { Artist } from '../../types';

export const followArtist = async (artistId: string, userId: string) => {
  const { error } = await supabase
    .from('artist_followers')
    .insert({ artist_id: artistId, user_id: userId });
  if (error && error.code !== 'PGRST205') throw error;
};

export const unfollowArtist = async (artistId: string, userId: string) => {
  const { error } = await supabase
    .from('artist_followers')
    .delete()
    .eq('artist_id', artistId)
    .eq('user_id', userId);
  if (error && error.code !== 'PGRST205') throw error;
};

export const checkIsFollowing = async (artistId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('artist_followers')
    .select('id')
    .eq('artist_id', artistId)
    .eq('user_id', userId)
    .limit(1);
  if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') throw error;
  return data && data.length > 0;
};

export const getNewReleasesFromFollowed = async (userId: string, limit = 8): Promise<any[]> => {
  const { data: follows, error: followError } = await supabase
    .from('artist_followers')
    .select('artist_id')
    .eq('user_id', userId);
    
  if (followError) { if (followError.code === 'PGRST205') return []; throw followError; }
  
  const artistIds = (follows || []).map(f => f.artist_id);
  if (artistIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from('releases')
    .select('*, artists(*)')
    .eq('status', 'live')
    .in('artist_id', artistIds)
    .order('release_date', { ascending: false })
    .limit(limit);
    
  if (error && error.code !== 'PGRST205') throw error;
  
  return (data || []).map((d: any) => ({
    id: d.id,
    artistId: d.artist_id,
    title: d.title,
    slug: d.slug,
    releaseType: d.release_type,
    releaseDate: d.release_date,
    artworkUrl: d.artwork_url,
    spotifyUrl: d.spotify_url,
    appleMusicUrl: d.apple_music_url,
    youtubeUrl: d.youtube_url,
    about: d.about,
    aboutVisible: d.about_visible,
    theme: d.theme,
    isLive: d.status === 'live',
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    artist: d.artists ? {
      id: d.artists.id,
      userId: d.artists.user_id,
      username: d.artists.username,
      displayName: d.artists.display_name,
      avatarUrl: d.artists.avatar_url,
      bio: d.artists.bio,
      socialLinks: d.artists.social_links,
      verificationStatus: d.artists.verification_status,
      createdAt: d.artists.created_at,
      updatedAt: d.artists.updated_at
    } : undefined
  }));
};

export const getFollowedArtists = async (userId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('artist_followers')
    .select('artists(*, releases(count))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error && error.code !== 'PGRST205') throw error;
  
  return (data || []).filter(d => d.artists).map((d: any) => {
    const a = d.artists;
    return {
      id: a.id,
      userId: a.user_id,
      username: a.username,
      displayName: a.display_name,
      avatarUrl: a.avatar_url,
      bio: a.bio,
      socialLinks: a.social_links,
      verificationStatus: a.verification_status || 'unclaimed',
      createdAt: a.created_at,
      updatedAt: a.updated_at,
      totalReleases: a.releases && a.releases.length > 0 ? a.releases[0].count : 0
    };
  });
};

export const getFollowerCount = async (artistId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('artist_followers')
    .select('id', { count: 'exact', head: true })
    .eq('artist_id', artistId);
  if (error && error.code !== 'PGRST205') throw error;
  return count || 0;
};
