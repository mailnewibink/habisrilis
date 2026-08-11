import { Artist, Release } from '../types';

export const DEMO_ARTIST: Artist = {
  id: 'demo-artist-id',
  userId: 'demo-user-id',
  username: 'demo-ibink',
  displayName: 'Ibink',
  avatarUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=200&h=200',
  bio: 'Indonesian indie pop artist weaving stories through acoustic melodies and heartfelt lyrics.',
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com', sortOrder: 0 },
    { platform: 'youtube', url: 'https://youtube.com', sortOrder: 1 },
    { platform: 'tiktok', url: 'https://tiktok.com', sortOrder: 2 }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const DEMO_RELEASES: Release[] = [
  {
    id: 'demo-release-1',
    artistId: 'demo-artist-id',
    title: 'Hujan di Bulan Juli',
    slug: 'hujan-di-bulan-juli',
    releaseType: 'single',
    releaseDate: new Date().toISOString(),
    artworkUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800&h=800',
    spotifyUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    about: 'Sebuah lagu tentang kenangan yang datang bersama hujan di pertengahan tahun. Terinspirasi dari kisah nyata.',
    aboutVisible: true,
    status: 'live',
    streamingLinks: [
      { platform: 'spotify', url: 'https://spotify.com', sortOrder: 0 },
      { platform: 'apple_music', url: 'https://apple.com', sortOrder: 1 },
      { platform: 'youtube_music', url: 'https://youtube.com', sortOrder: 2 }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'demo-release-2',
    artistId: 'demo-artist-id',
    title: 'Midnight Drive',
    slug: 'midnight-drive',
    releaseType: 'single',
    releaseDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    artworkUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800&h=800',
    spotifyUrl: 'https://open.spotify.com/track/5uO3i7F9h1Fj7jP0dE6w9O',
    about: 'A late night drive through the empty city streets. The feeling of freedom and isolation.',
    aboutVisible: true,
    status: 'live',
    streamingLinks: [
      { platform: 'spotify', url: 'https://spotify.com', sortOrder: 0 },
      { platform: 'apple_music', url: 'https://apple.com', sortOrder: 1 }
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'demo-release-3',
    artistId: 'demo-artist-id',
    title: 'Summer Vibes EP',
    slug: 'summer-vibes-ep',
    releaseType: 'ep',
    releaseDate: new Date(Date.now() - 90 * 86400000).toISOString(),
    artworkUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800&h=800',
    spotifyUrl: 'https://open.spotify.com/album/4cOdK2wGLETKBW3PvgPWqT',
    about: 'A collection of upbeat tracks for the perfect summer days.',
    aboutVisible: true,
    status: 'live',
    streamingLinks: [
      { platform: 'spotify', url: 'https://spotify.com', sortOrder: 0 },
      { platform: 'youtube_music', url: 'https://youtube.com', sortOrder: 1 },
      { platform: 'tiktok', url: 'https://tiktok.com', sortOrder: 2 }
    ],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString()
  }
];

export const DEMO_ARTIST_2: Artist = {
  id: 'demo-artist-2-id',
  userId: 'demo-user-2-id',
  username: 'demo-neon-dreams',
  displayName: 'Neon Dreams',
  avatarUrl: 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?auto=format&fit=crop&q=80&w=200&h=200',
  bio: 'Synthwave and retro-futuristic soundscapes.',
  socialLinks: [
    { platform: 'x', url: 'https://twitter.com', sortOrder: 0 }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const DEMO_RELEASES_2: Release[] = [
  {
    id: 'demo-release-4',
    artistId: 'demo-artist-2-id',
    title: 'Cyber City',
    slug: 'cyber-city',
    releaseType: 'single',
    releaseDate: new Date().toISOString(),
    artworkUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=800&h=800',
    spotifyUrl: 'https://open.spotify.com/track/6FRLCMO5TUHTexlWo8ym1W',
    about: 'Welcome to the future.',
    aboutVisible: true,
    status: 'live',
    streamingLinks: [
      { platform: 'spotify', url: 'https://spotify.com', sortOrder: 0 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
