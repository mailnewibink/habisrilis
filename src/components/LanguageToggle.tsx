import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200 shadow-inner">
      <button 
        onClick={() => setLang('id')}
        className={`flex items-center justify-center w-8 h-6 rounded-full text-base transition-all ${lang === 'id' ? 'bg-white shadow-sm ring-1 ring-gray-200/50' : 'opacity-50 hover:opacity-100 grayscale hover:grayscale-0 scale-90 hover:scale-100'}`}
        aria-label="Bahasa Indonesia"
      >
        🇮🇩
      </button>
      <button 
        onClick={() => setLang('en')}
        className={`flex items-center justify-center w-8 h-6 rounded-full text-base transition-all ${lang === 'en' ? 'bg-white shadow-sm ring-1 ring-gray-200/50' : 'opacity-50 hover:opacity-100 grayscale hover:grayscale-0 scale-90 hover:scale-100'}`}
        aria-label="English"
      >
        🇬🇧
      </button>
    </div>
  );
};
