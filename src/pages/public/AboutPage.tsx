import React, { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { signInWithGoogle } from '../../lib/supabase/auth';

export const AboutPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${t('aboutPage.title')} — Habis Rilis`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", t('aboutPage.heroDesc'));
    }
  }, [t]);

  const handleLogin = async (path: string) => {
    if (user) {
      navigate(path);
      return;
    }
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-gray-200">
      <PublicNavbar />
      
      <main className="pt-32 pb-24 px-6 lg:px-10 max-w-6xl mx-auto">
        {/* HERO */}
        <section className="mb-32 mt-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">{t('aboutPage.eyebrow')}</h2>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] mb-8 max-w-3xl">
            {t('aboutPage.heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-3xl">
            {t('aboutPage.heroDesc')}
          </p>
        </section>

        {/* WHAT & WHY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">{t('aboutPage.whatTitle')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('aboutPage.whatDesc')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">{t('aboutPage.whyTitle')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">
              {t('aboutPage.whyDesc1')}
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-gray-300 font-bold">•</span>
                <span className="text-gray-600">{t('aboutPage.whyB1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-300 font-bold">•</span>
                <span className="text-gray-600">{t('aboutPage.whyB2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-300 font-bold">•</span>
                <span className="text-gray-600">{t('aboutPage.whyB3')}</span>
              </li>
            </ul>
          </section>
        </div>

        {/* HOW IT WORKS */}
        <section className="mb-32">
          <h2 className="text-2xl font-bold tracking-tight mb-12">{t('aboutPage.howTitle')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="border-t border-gray-200 pt-6">
              <div className="text-xs font-bold text-gray-400 mb-4">{t('aboutPage.step1')}</div>
              <h3 className="text-lg font-bold mb-3">{t('aboutPage.step1Title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {t('aboutPage.step1Desc')}
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="text-xs font-bold text-gray-400 mb-4">{t('aboutPage.step2')}</div>
              <h3 className="text-lg font-bold mb-3">{t('aboutPage.step2Title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {t('aboutPage.step2Desc')}
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="text-xs font-bold text-gray-400 mb-4">{t('aboutPage.step3')}</div>
              <h3 className="text-lg font-bold mb-3">{t('aboutPage.step3Title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {t('aboutPage.step3Desc')}
              </p>
            </div>
          </div>
        </section>

        {/* FOR ARTISTS & LISTENERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 border-t border-b border-gray-100 py-24">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">{t('aboutPage.forArtistTitle')}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{t('aboutPage.forArtistDesc')}</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">{t('aboutPage.forListenerTitle')}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{t('aboutPage.forListenerDesc')}</p>
          </div>
        </div>

        {/* FINAL CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-10 max-w-2xl mx-auto leading-tight">{t('aboutPage.ctaTitle')}</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-sm" onClick={() => handleLogin('/app')}>
              {t('aboutPage.createBtn')}
            </Button>
            <Link to="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-sm group">
                {t('aboutPage.exploreBtn')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 lg:px-10 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('common.footer')}</p>
      </footer>
    </div>
  );
};
