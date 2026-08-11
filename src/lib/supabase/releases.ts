import { supabase } from '../supabase';
import { Release, ReleaseStatus } from '../../types';
import { DEMO_ARTIST, DEMO_ARTIST_2, DEMO_RELEASES, DEMO_RELEASES_2 } from '../demo-data';

export const getReleasesByArtistId = async (artistId: string, onlyLive = false): Promise<Release[]> => {
  if (artistId === DEMO_ARTIST.id) return DEMO_RELEASES;
  if (artistId === DEMO_ARTIST_2.id) return DEMO_RELEASES_2;

  let query = supabase
    .from('releases')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });
    
  if (onlyLive) {
    query = query.eq('status', 'live');
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  return data.map(mapRelease);
};

export const getReleaseBySlug = async (artistId: string, slug: string): Promise<Release | null> => {
  if (artistId === DEMO_ARTIST.id) return DEMO_RELEASES.find(r => r.slug === slug) || null;
  if (artistId === DEMO_ARTIST_2.id) return DEMO_RELEASES_2.find(r => r.slug === slug) || null;

  const { data, error } = await supabase
    .from('releases')
    .select('*')
    .eq('artist_id', artistId)
    .eq('slug', slug)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return mapRelease(data);
};

export const createRelease = async (release: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>): Promise<Release> => {
  const { data, error } = await supabase
    .from('releases')
    .insert({
      artist_id: release.artistId,
      title: release.title,
      slug: release.slug,
      release_type: release.releaseType,
      release_date: release.releaseDate,
      artwork_url: release.artworkUrl,
      artwork_format: release.artworkFormat,
      spotify_url: release.spotifyUrl,
      
      about: release.about,
      about_visible: release.aboutVisible,
      status: release.status,
      streaming_links: [...(release.streamingLinks || []), ...(release.youtubeUrl ? [{ platform: '_youtube_video', url: release.youtubeUrl, sortOrder: 999 }] : [])]
    })
    .select()
    .single();
    
  if (error) throw error;
  return mapRelease(data);
};

export const updateRelease = async (id: string, updates: Partial<Release>): Promise<void> => {
  const payload: any = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.slug !== undefined) payload.slug = updates.slug;
  if (updates.releaseType !== undefined) payload.release_type = updates.releaseType;
  if (updates.releaseDate !== undefined) payload.release_date = updates.releaseDate;
  if (updates.artworkUrl !== undefined) payload.artwork_url = updates.artworkUrl;
  if (updates.artworkFormat !== undefined) payload.artwork_format = updates.artworkFormat;
  if (updates.spotifyUrl !== undefined) payload.spotify_url = updates.spotifyUrl;
  
  if (updates.about !== undefined) payload.about = updates.about;
  if (updates.aboutVisible !== undefined) payload.about_visible = updates.aboutVisible;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.streamingLinks !== undefined || updates.youtubeUrl !== undefined) {
    const links = updates.streamingLinks || [];
    if (updates.youtubeUrl) {
      payload.streaming_links = [...links, { platform: '_youtube_video', url: updates.youtubeUrl, sortOrder: 999 }];
    } else {
      payload.streaming_links = links;
    }
  }
  payload.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('releases')
    .update(payload)
    .eq('id', id);
    
  if (error) throw error;
};

export const deleteRelease = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('releases')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

const mapRelease = (data: any): Release => ({
  id: data.id,
  artistId: data.artist_id,
  title: data.title,
  slug: data.slug,
  releaseType: data.release_type,
  releaseDate: data.release_date,
  artworkUrl: data.artwork_url,
  artworkFormat: data.artwork_format,
  spotifyUrl: data.spotify_url,
  youtubeUrl: (data.streaming_links || []).find((l: any) => l.platform === '_youtube_video')?.url || undefined,
  about: data.about,
  aboutVisible: data.about_visible,
  status: data.status as ReleaseStatus,
  streamingLinks: (data.streaming_links || []).filter((l: any) => l.platform !== '_youtube_video'),
  createdAt: data.created_at,
  updatedAt: data.updated_at
});
