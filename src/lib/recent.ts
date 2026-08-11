import { safeStorage } from "./storage";
import { Artist } from '../types';

const RECENT_ARTISTS_KEY = 'hr_recent_artists';

export const saveRecentArtist = (artist: Artist) => {
  try {
    const existingStr = safeStorage.getItem(RECENT_ARTISTS_KEY);
    let existing: Artist[] = existingStr ? JSON.parse(existingStr) : [];
    
    // Remove if already exists
    existing = existing.filter(a => a.id !== artist.id);
    
    // Add to front
    existing.unshift(artist);
    
    // Keep max 8
    existing = existing.slice(0, 8);
    
    safeStorage.setItem(RECENT_ARTISTS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save recent artist', e);
  }
};

export const getRecentViewedArtists = (): Artist[] => {
  try {
    const existingStr = safeStorage.getItem(RECENT_ARTISTS_KEY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch (e) {
    console.error('Failed to load recent artists', e);
    return [];
  }
};
