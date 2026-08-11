import { Release, Artist } from '../types';

export const getReleasePublicUrl = (artistUsername: string, releaseSlug: string): string => {
  const cleanUsername = artistUsername.replace('@', '');
  const baseUrl = window.location.origin;
  return `${baseUrl}/@${cleanUsername}/${releaseSlug}`;
};

export const getReleaseShareText = (releaseTitle: string, artistName: string, url: string): string => {
  return `Dengerin rilisan terbaru gue:\n\n${releaseTitle} — ${artistName}\n\n${url}`;
};

export const setSocialMetadata = (
  title: string,
  description: string,
  imageUrl: string,
  url: string
) => {
  document.title = title;

  const setMetaTag = (property: string, content: string, attr: 'property' | 'name' = 'property') => {
    let el = document.querySelector(`meta[${attr}="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaTag('og:title', title);
  setMetaTag('og:description', description);
  setMetaTag('og:image', imageUrl);
  setMetaTag('og:url', url);
  setMetaTag('og:type', 'website');
  
  setMetaTag('twitter:card', 'summary_large_image', 'name');
  setMetaTag('twitter:title', title, 'name');
  setMetaTag('twitter:description', description, 'name');
  setMetaTag('twitter:image', imageUrl, 'name');
};
