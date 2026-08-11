import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ReleaseCard } from '../../components/release/ReleaseCard';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageToggle } from '../../components/LanguageToggle';



export const ExamplesShowcase = () => {
  const { lang } = useLanguage();
  const { t } = useLanguage();
  const [examples, setExamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const { data, error } = await supabase
          .from('releases')
          .select('*, artist:artists(*)')
          .eq('status', 'live')
          .order('created_at', { ascending: false })
          .limit(9);
          
        if (data) {
          setExamples(data);
        }
      } catch (e) {
        console.error('Error fetching examples', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExamples();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#111111] font-sans pb-24 selection:bg-gray-200">
      <header className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 mb-8 bg-white">
         <Link to="/" className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-black transition-colors">
           <ArrowLeft className="w-4 h-4" />
           <ArrowLeft className="w-4 h-4" />
           {t('common.back')}
         </Link>
         <h1 className="text-xl font-bold tracking-tighter uppercase">{t('examples.title')}</h1>
         <LanguageToggle />
      </header>

      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter uppercase mb-4">{t('examples.subtitle')}</h2>
          <p className="text-gray-500 max-w-lg mx-auto">{t('examples.desc')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : examples.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {examples.map((example, i) => (
              <div key={i} className="flex flex-col gap-4">
                <ReleaseCard
                  artistName={example.artist?.display_name || example.artist?.displayName || 'Unknown Artist'}
                  title={example.title}
                  artworkUrl={example.artwork_url || example.artworkUrl || ''}
                  slug={example.slug}
                  artistUsername={example.artist?.username}
                  releaseType={example.release_type || example.releaseType}
                  releaseDate={example.release_date || example.releaseDate}
                />
                <div className="text-center px-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
                    {example.releaseType}
                  </span>
                  {example.about && (
                    <p className="text-xs text-gray-500 line-clamp-2">{example.about}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">{t('examples.noExamples')}</div>
        )}
      </div>
    </div>
  );
};
