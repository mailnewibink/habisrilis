export type ReleaseStatus = 'draft' | 'live' | 'archived';
export type ReleaseType = 'single' | 'ep' | 'album';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  accountType?: 'artist' | 'manager' | 'fan';
  plan?: 'free' | 'manager_pro';
  createdAt: string;
}

export interface SocialLink {
  platform: string; // e.g., 'instagram', 'tiktok', 'youtube', 'x', 'other'
  url: string;
  sortOrder: number;
}

export interface Artist {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  socialLinks?: SocialLink[];
  verificationStatus?: 'unclaimed' | 'claim_pending' | 'verified';
  createdAt?: string;
  updatedAt?: string;
}

export interface StreamingLink {
  platform: string; // e.g., 'spotify', 'apple_music', 'youtube_music', 'tiktok', 'deezer', 'other'
  url: string;
  sortOrder: number;
}

export interface Release {
  id: string;
  artistId: string;
  title: string;
  slug: string;
  releaseType: ReleaseType;
  releaseDate: string;
  artworkUrl?: string;
  artworkFormat?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  about?: string;
  aboutVisible: boolean;
  status: ReleaseStatus;
  streamingLinks?: StreamingLink[];
  createdAt: string;
  updatedAt: string;
}
