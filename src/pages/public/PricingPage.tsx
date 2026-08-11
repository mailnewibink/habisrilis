import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Check, Info } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { signInWithGoogle } from '../../lib/supabase/auth';
import { isLaunchPromotionActive, formatPrice, pricingConfig } from '../../config/pricing';

export const PricingPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    document.title = `${t('pricingPage.title')} — Habis Rilis`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", t('pricingPage.heroDesc'));
    }
  }, [t]);

  const handleLogin = async (path: string) => {
    if (user) {
      navigate(path);
      return;
    }
    
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setIsLoggingIn(false);
    }
  };

  const getProAction = () => {
    if (!user) {
      return () => handleLogin('/app/upgrade');
    }
    
    if (user.accountType === 'manager') {
      return () => navigate('/app/upgrade');
    }
    
    return () => navigate('/app');
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-gray-200">
      <PublicNavbar />
      
      <main className="pt-32 pb-24 px-6 lg:px-10 max-w-7xl mx-auto">
        {/* HERO */}
        <header className="mb-20 text-center">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">{t('pricingPage.title')}</h2>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1] mb-6 max-w-2xl mx-auto">
            {t('pricingPage.heroTitle')}
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-xl mx-auto">
            {t('pricingPage.heroDesc')}
          </p>
        </header>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 max-w-7xl mx-auto items-stretch">
          
          {/* ARTIST */}
          <div className="bg-gray-50 rounded-3xl p-8 flex flex-col h-full border border-gray-100">
            <div className="mb-8">
              <h3 className="text-sm font-bold tracking-tight text-gray-900 mb-2">ARTIST</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold tracking-tighter">Rp0</span>
              </div>
              <span className="inline-block px-2 py-1 bg-gray-200 rounded text-[10px] font-bold uppercase tracking-widest text-gray-700 mb-4">{t('pricingPage.artistTitle')}</span>
              <p className="text-gray-500 text-sm h-12 leading-relaxed">{t('pricingPage.artistDesc')}</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['1 artist profile', 'Unlimited releases', 'Public artist page', 'Release pages', 'Artwork', 'Spotify & streaming links', 'Social sharing', 'Unlimited followers'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full bg-white text-black border border-gray-200 hover:bg-gray-50" onClick={() => handleLogin('/app')} disabled={isLoggingIn}>
              {t('pricingPage.artistCta')}
            </Button>
          </div>

          {/* MANAGER FREE */}
          <div className="bg-gray-50 rounded-3xl p-8 flex flex-col h-full border border-gray-100">
            <div className="mb-8">
              <h3 className="text-sm font-bold tracking-tight text-gray-900 mb-2">MANAGER FREE</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold tracking-tighter">Rp0</span>
              </div>
              <span className="inline-block px-2 py-1 bg-gray-200 rounded text-[10px] font-bold uppercase tracking-widest text-gray-700 mb-4">{t('pricingPage.managerTitle')}</span>
              <p className="text-gray-500 text-sm h-12 leading-relaxed">{t('pricingPage.managerDesc')}</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['Manage up to 2 artists', 'Unlimited releases', 'Artist pages', 'Release pages', 'Followers', 'Social sharing'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full bg-white text-black border border-gray-200 hover:bg-gray-50" onClick={() => handleLogin('/app')} disabled={isLoggingIn}>
              {t('pricingPage.managerCta')}
            </Button>
          </div>

          {/* MANAGER PRO MONTHLY */}
          <div className="bg-[#111] text-white rounded-3xl p-8 flex flex-col h-full relative overflow-hidden">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold tracking-tight text-white">{t('pricingPage.proTitleMonthly') || 'MANAGER PRO MONTHLY'}</h3>
                {isLaunchPromotionActive() && (
                  <span className="inline-block px-2 py-1 bg-purple-500 text-white rounded text-[10px] font-bold uppercase tracking-widest">{t('pricingPage.promo')}</span>
                )}
              </div>
              
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tighter">{formatPrice(pricingConfig.managerPro.monthly.price)}</span>
                  <span className="text-gray-400 text-sm">/ {t('pricingPage.monthly')}</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm h-12 leading-relaxed">{t('pricingPage.proDesc')}</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited artists', 'Unlimited releases', 'Artist pages', 'Release pages', 'Followers', 'Social sharing', 'Everything in Manager Free'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check className="w-5 h-5 text-white shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full bg-white text-black hover:bg-gray-100 border-none" onClick={getProAction()} disabled={isLoggingIn}>
              {t('pricingPage.proCtaMonthly') || 'Upgrade ke Pro'}
            </Button>
          </div>

          {/* MANAGER PRO YEARLY */}
          <div className="bg-white text-black rounded-3xl p-8 flex flex-col h-full relative overflow-hidden border border-gray-200">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold tracking-tight text-black">{t('pricingPage.proTitleYearly') || 'MANAGER PRO YEARLY'}</h3>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                  {t('pricingPage.saveAnnual') || 'Hemat Rp129.000/tahun'}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tighter">{formatPrice(pricingConfig.managerPro.yearly.price)}</span>
                  <span className="text-gray-500 text-sm">/ {t('pricingPage.yearly')}</span>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm h-12 leading-relaxed">{t('pricingPage.proDesc')}</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited artists', 'Unlimited releases', 'Artist pages', 'Release pages', 'Followers', 'Social sharing', 'Everything in Manager Free'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed" disabled>
              {t('pricingPage.proCtaYearly') || 'Segera Hadir'}
            </Button>
          </div>
        </div>

        {/* WHICH IS RIGHT FOR ME */}
        <section className="mb-32 bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-10 text-center">{t('pricingPage.whichTitle')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Artist</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{t('pricingPage.whichArtist')}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Manager Free</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{t('pricingPage.whichManager')}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Manager Pro</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{t('pricingPage.whichPro')}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-12 text-center">{t('pricingPage.faq.title')}</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                {t('pricingPage.faq.q1')}
              </h3>
              <p className="text-gray-600 pl-8 leading-relaxed">{t('pricingPage.faq.a1')}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                {t('pricingPage.faq.q2')}
              </h3>
              <p className="text-gray-600 pl-8 leading-relaxed">{t('pricingPage.faq.a2')}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                {t('pricingPage.faq.q3')}
              </h3>
              <p className="text-gray-600 pl-8 leading-relaxed">{t('pricingPage.faq.a3')}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                {t('pricingPage.faq.q4')}
              </h3>
              <p className="text-gray-600 pl-8 leading-relaxed">{t('pricingPage.faq.a4')}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                {t('pricingPage.faq.q5')}
              </h3>
              <p className="text-gray-600 pl-8 leading-relaxed">{t('pricingPage.faq.a5')}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                {t('pricingPage.faq.q6')}
              </h3>
              <p className="text-gray-600 pl-8 leading-relaxed">{t('pricingPage.faq.a6')}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 lg:px-10 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('common.footer')}</p>
      </footer>
    </div>
  );
};
