import React, { useState } from 'react';
import { Share2, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/Button';

interface ShareActionsProps {
  url: string;
  title: string;
  artistName: string;
  shareText: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const ShareActions = ({ url, title, artistName, shareText, size = 'md', fullWidth = false }: ShareActionsProps) => {
  const { t } = useLanguage();

  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} — ${artistName}`,
          text: 'Dengerin rilisan terbaru gue',
          url: url,
        });
        setErrorMsg('');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setShowOptions(true);
        }
      }
    } else {
      setShowOptions(true);
    }
  };

  const handleCopyLink = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setErrorMsg('');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setErrorMsg("Couldn't share. Try copying the link instead.");
    });
  };

  const handleWhatsApp = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const text = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (showOptions) {
    return (
      <div className="flex flex-col items-center gap-3 w-full">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 text-center">{t('release.shareRelease')}</h4>
        <div className="flex flex-col sm:flex-row justify-center gap-2 w-full">
          <Button variant="outline" size={size} onClick={handleWhatsApp} className="gap-2 border-gray-200 flex-1">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button variant="outline" size={size} onClick={handleCopyLink} className="gap-2 border-gray-200 flex-1">
            <LinkIcon className="h-4 w-4" />
            {copied ? t('common.copied') : t('common.copyLink')}
          </Button>
        </div>
        {errorMsg && (
           <p className="text-xs text-red-500 mt-2 text-center">{errorMsg}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${fullWidth ? 'w-full' : ''}`}>
      <Button variant="outline" size={size} fullWidth={fullWidth} className="gap-2 border-gray-200" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleShare();
      }}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
};
