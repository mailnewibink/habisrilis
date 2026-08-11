import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Loader2 } from 'lucide-react';

export const AdminFeatured = () => {
  const { t } = useLanguage();

  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentFeaturedId, setCurrentFeaturedId] = useState<string | null>(null);

  useEffect(() => {
    fetchReleases();
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await fetch('/api/featured');
      const data = await res.json();
      setCurrentFeaturedId(data.featuredReleaseId);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReleases = async () => {
    try {
      const { data, error } = await supabase
        .from('releases')
        .select('id, title, slug, artist:artists(displayName, username)')
        .eq('status', 'live')
        .order('created_at', { ascending: false });
        
      if (data) {
        setReleases(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSetFeatured = async (releaseId: string) => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const res = await fetch('/api/admin/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ featuredReleaseId: releaseId })
      });
      if (res.ok) {
        setCurrentFeaturedId(releaseId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tighter uppercase mb-6">Featured Release</h1>
      
      <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-widest text-[10px] text-gray-500 font-bold">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Artist</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {releases.map(release => (
              <tr key={release.id} className={currentFeaturedId === release.id ? 'bg-black/5' : ''}>
                <td className="px-6 py-4 font-medium">{release.title}</td>
                <td className="px-6 py-4">{release.artist?.displayName}</td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant={currentFeaturedId === release.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleSetFeatured(release.id)}
                    disabled={saving || currentFeaturedId === release.id}
                  >
                    {currentFeaturedId === release.id ? 'Featured' : 'Set as Featured'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
