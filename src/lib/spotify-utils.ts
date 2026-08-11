export const extractSpotifyEmbedUrl = (input: string): string | null => {
  if (!input) return null;
  let urlString = input.trim();

  // If it's an iframe code, extract the src attribute
  if (urlString.startsWith('<iframe') && urlString.includes('src="')) {
    const srcMatch = urlString.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      urlString = srcMatch[1];
    }
  }

  // Handle spotify URI format like spotify:track:123
  if (urlString.startsWith('spotify:')) {
    const parts = urlString.split(':');
    if (parts.length === 3) {
      return `https://open.spotify.com/embed/${parts[1]}/${parts[2]}`;
    }
  }

  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
    urlString = 'https://' + urlString;
  }

  try {
    const urlObj = new URL(urlString);
    if (!urlObj.hostname.includes('spotify.com')) return null;

    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const validTypes = ['track', 'album', 'playlist', 'episode', 'show'];

    let typeIndex = -1;
    let type = '';

    for (let i = 0; i < pathParts.length; i++) {
      if (validTypes.includes(pathParts[i])) {
        type = pathParts[i];
        typeIndex = i;
        break;
      }
    }

    if (typeIndex !== -1 && pathParts.length > typeIndex + 1) {
      const id = pathParts[typeIndex + 1];
      return `https://open.spotify.com/embed/${type}/${id}`;
    }
    
    return null;
  } catch {
    return null;
  }
};

export const validateSpotifyEmbed = (url: string | null, releaseType: 'single' | 'ep' | 'album' | undefined): string | null => {
  if (!url) return null;
  
  const embedUrl = extractSpotifyEmbedUrl(url);
  if (!embedUrl) return null; // We'll just let it fail silently or return invalid format if we want, but let's just check type match

  const isTrack = embedUrl.includes('/embed/track/');
  const isAlbum = embedUrl.includes('/embed/album/');
  
  if (releaseType === 'single') {
    if (isAlbum) {
      return "Please use a Spotify Track Embed for a Single release.";
    }
  } else if (releaseType === 'album' || releaseType === 'ep') {
    if (isTrack) {
      return "Please use a Spotify Album Embed for an Album / EP release.";
    }
  }

  return null;
};
