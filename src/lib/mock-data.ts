import { Artist, Release, SocialLink, StreamingLink, User } from '../types';

export const mockUser: User = {
  id: 'u1',
  email: 'mailnewibink@gmail.com',
  name: 'Ibink',
  avatarUrl: 'https://images.unsplash.com/photo-1522867086086-6330113c4db6?auto=format&fit=crop&q=80&w=256&h=256',
  createdAt: new Date().toISOString(),
};

export const mockArtist: Artist = {
  id: 'a1',
  userId: 'u1',
  username: 'ibink',
  displayName: 'Ibink',
  avatarUrl: 'https://images.unsplash.com/photo-1522867086086-6330113c4db6?auto=format&fit=crop&q=80&w=256&h=256',
  bio: 'Independent musician and producer.',
};

export const mockReleases: Release[] = [
  {
    id: 'r1',
    artistId: 'a1',
    title: 'Hujan di Bulan Juli',
    slug: 'hujan-di-bulan-juli',
    releaseType: 'single',
    releaseDate: '2023-07-15T00:00:00Z',
    artworkUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800&h=800',
    spotifyUrl: 'https://open.spotify.com/track/placeholder1',
    about: 'This song was written during a period of change. It is about holding on to small memories while learning to let something go.',
    aboutVisible: true,
    status: 'live',
    streamingLinks: [
      { platform: 'spotify', url: 'https://spotify.com', sortOrder: 0 },
      { platform: 'apple_music', url: 'https://apple.com', sortOrder: 1 },
      { platform: 'youtube_music', url: 'https://youtube.com', sortOrder: 2 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'r2',
    artistId: 'a1',
    title: 'Senja',
    slug: 'senja',
    releaseType: 'single',
    releaseDate: '2024-02-10T00:00:00Z',
    artworkUrl: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800&h=800',
    spotifyUrl: 'https://open.spotify.com/track/placeholder2',
    about: 'A reflection on the passage of time as the sun goes down.',
    aboutVisible: true,
    status: 'live',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'r3',
    artistId: 'a1',
    title: 'Malam',
    slug: 'malam',
    releaseType: 'single',
    releaseDate: '2024-08-01T00:00:00Z',
    artworkUrl: 'https://images.unsplash.com/photo-1534080112461-12501a1c97a8?auto=format&fit=crop&q=80&w=800&h=800',
    spotifyUrl: '',
    about: '',
    aboutVisible: false,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockStreamingLinks: StreamingLink[] = [
  { platform: 'spotify', url: 'https://spotify.com', sortOrder: 0 },
  { platform: 'apple_music', url: 'https://apple.com', sortOrder: 1 },
  { platform: 'youtube_music', url: 'https://youtube.com', sortOrder: 2 },
];

export const mockSocialLinks: SocialLink[] = [
  { platform: 'instagram', url: 'https://instagram.com/ibink', sortOrder: 0 },
  { platform: 'x', url: 'https://x.com/ibink', sortOrder: 1 },
  { platform: 'youtube', url: 'https://youtube.com/c/ibink', sortOrder: 2 },
];

