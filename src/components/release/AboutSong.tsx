import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const AboutSong = ({ text, visible }: { text?: string; visible: boolean }) => {
  const { t } = useLanguage();

  if (!visible || !text) return null;

  return (
    <div className="text-center px-6 py-8 bg-gray-50 rounded-[14px] border border-gray-100 shadow-sm">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">{t('release.aboutSong')}</h3>
      <p className="text-sm leading-relaxed text-[#111111] max-w-lg mx-auto whitespace-pre-wrap">{text}</p>
    </div>
  );
};
