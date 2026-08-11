export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  try {
    const parsedUrl = new URL(url);
    
    // Handle youtu.be/VIDEO_ID
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.substring(1);
    }
    
    // Handle www.youtube.com/watch?v=VIDEO_ID
    if (parsedUrl.hostname.includes('youtube.com')) {
      if (parsedUrl.pathname === '/watch') {
        return parsedUrl.searchParams.get('v');
      }
      
      // Handle www.youtube.com/embed/VIDEO_ID
      if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname.substring(7);
      }
    }
    
    return null;
  } catch (err) {
    return null;
  }
};
