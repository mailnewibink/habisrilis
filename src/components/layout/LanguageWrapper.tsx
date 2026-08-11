import React, { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <>{children}</>;
};
