import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export const NotFound = () => {
  const { t, lang } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-[#F9F9F9]">
      <h1 className="text-4xl font-bold tracking-tighter uppercase text-[#111111] mb-4">404</h1>
      <p className="text-gray-500 mb-8 max-w-md">{t('notfound.desc')}</p>
      <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
        {t('common.returnHome')}
      </Link>
    </div>
  );
};
