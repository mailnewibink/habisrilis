import { supabase } from '../supabase';
import { Artist, Release } from '../../types';

export const getNewReleases = async (limit = 8): Promise<Release[]> => {
  const { data, error } = await supabase
    .from('releases')
    .select('*, artists(*)')
    .eq('status', 'live')
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching new releases:', error);
    return [];
  }
  
  return mapReleasesResponse(data);
};

export const getTrendingReleases = async (limit = 8): Promise<Release[]> => {
  const { data, error } = await supabase
    .from('releases')
    .select('*, artists(*)')
    .eq('status', 'live')
    .order('release_date', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching trending releases:', error);
    return [];
  }
  
  return mapReleasesResponse(data);
};

const mapReleasesResponse = (data: any[]): Release[] => {
  return data.map((d: any) => ({
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
    status: d.status,
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

export const getVerifiedArtists = async (limit = 8): Promise<any[]> => {
  const { data, error } = await supabase
    .from('artists')
    .select('*, releases(count)')
    .eq('verification_status', 'verified')
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching verified artists:', error);
    return [];
  }
  
  return mapArtistsResponse(data);
};

export const getRecentArtists = async (limit = 8): Promise<any[]> => {
  const { data, error } = await supabase
    .from('artists')
    .select('*, releases(count)')
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching recent artists:', error);
    return [];
  }
  
  return mapArtistsResponse(data);
};

export const searchGlobal = async (query: string): Promise<{ artists: any[], releases: Release[] }> => {
  if (!query) return { artists: [], releases: [] };
  
  const { data: artistsData, error: artistsError } = await supabase
    .from('artists')
    .select('*, releases(count)')
    .ilike('display_name', `%${query}%`)
    .limit(5);
    
  const { data: releasesData, error: releasesError } = await supabase
    .from('releases')
    .select('*, artists(*)')
    .ilike('title', `%${query}%`)
    .eq('status', 'live')
    .limit(5);
    
  const artists = mapArtistsResponse(artistsData || []);
  
  const releases = mapReleasesResponse(releasesData || []);
  
  return { artists, releases };
};

const mapArtistsResponse = (data: any[]): any[] => {
  return data.map((d: any) => ({
    id: d.id,
    userId: d.user_id,
    username: d.username,
    displayName: d.display_name,
    avatarUrl: d.avatar_url,
    bio: d.bio,
    socialLinks: d.social_links,
    verificationStatus: d.verification_status || 'unclaimed',
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    totalReleases: d.releases && d.releases.length > 0 ? d.releases[0].count : 0
  }));
};
