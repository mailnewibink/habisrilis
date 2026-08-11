import React from 'react';
import { SocialLink } from '../../types';
import { Instagram, Youtube, Twitter, Facebook, Globe, Music2, Music, Linkedin, Github, Twitch } from 'lucide-react';

const getIconForPlatform = (platform: string) => {
  const p = platform.toLowerCase();
  switch (p) {
    case 'instagram': return <Instagram className="w-4 h-4" />;
    case 'youtube': return <Youtube className="w-4 h-4" />;
    case 'twitter':
    case 'x': return <Twitter className="w-4 h-4" />;
    case 'facebook': return <Facebook className="w-4 h-4" />;
    case 'tiktok': return <Music2 className="w-4 h-4" />; // Fallback since no native tiktok
    case 'spotify': return <Music className="w-4 h-4" />;
    case 'linkedin': return <Linkedin className="w-4 h-4" />;
    case 'github': return <Github className="w-4 h-4" />;
    case 'twitch': return <Twitch className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
};

export const SocialLinks = ({ links }: { links: SocialLink[] }) => {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {links.map((link) => {
        let urlString = link.url.trim();
        if (urlString && !urlString.startsWith('http://') && !urlString.startsWith('https://')) {
          urlString = 'https://' + urlString;
        }
        return (
          <a
            key={link.platform}
            href={urlString}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors p-2"
          >
            {getIconForPlatform(link.platform)}
            <span>{link.platform}</span>
          </a>
        );
      })}
    </div>
  );
};
