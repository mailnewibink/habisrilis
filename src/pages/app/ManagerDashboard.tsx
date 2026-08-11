import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { Loader2, Trash2, Plus, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ManagerDashboard = () => {
  const { t } = useLanguage();

  const { user, artists, activeArtist, setActiveArtistId, logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (window.confirm("Delete your HabisRilis account?\n\nThis will permanently remove your HabisRilis data. This action cannot be undone.")) {
      setIsDeleting(true);
      setError(null);
      try {
        if (user) {
          await supabase.from('profiles').delete().eq('id', user.id);
        }
        await logout();
      } catch (err: any) {
        console.error("Error deleting account:", err);
        setError(err.message || 'Failed to delete account.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSelectArtist = (artistId: string) => {
    setActiveArtistId(artistId);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 font-sans">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold uppercase tracking-tighter text-[#111111]">Manager Dashboard</h1>
          <Button variant="outline" size="sm" onClick={logout}>{t('dashboard.signOut')}</Button>
        </div>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-[10px] text-sm text-center font-medium">{error}</div>}
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500">My Artists</h2>
            {user?.plan === 'manager_pro' ? (
              <div>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Manager Pro &bull; Unlimited Artists</p>
                <p className="text-[10px] font-bold text-purple-600 mt-1 uppercase tracking-widest flex items-center gap-1">🎁 Free until 31 Dec 2026</p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Manager Free &bull; {artists.length} / 2 Artists</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/app/claim-artist">
              <Button size="sm" variant="outline" className="gap-2 text-[10px] uppercase tracking-widest">
                Claim Artist
              </Button>
            </Link>
            <Link to="/app/setup">
              <Button size="sm" className="gap-2 text-[10px] uppercase tracking-widest">
                <Plus className="w-4 h-4" />
                Add Artist
              </Button>
            </Link>
          </div>
        </div>

        {user?.plan !== 'manager_pro' && artists.length >= 2 && (
          <div className="bg-white border border-gray-200 rounded-[14px] p-8 text-center shadow-sm mb-8 flex flex-col items-center">
            <h3 className="text-lg font-bold tracking-tight mb-2">You've reached your free artist limit.</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6 text-sm">
              Upgrade to Manager Pro to manage unlimited artists.
            </p>
            <Link to="/app/upgrade">
              <Button>Upgrade to Pro</Button>
            </Link>
          </div>
        )}

        {artists.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[14px] p-12 text-center shadow-sm mb-12">
            <h3 className="text-lg font-bold tracking-tight mb-2">No Artists Yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6 text-sm">
              Create your first artist profile to start managing releases.
            </p>
            <Link to="/app/setup">
              <Button>Create Artist Profile</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 mb-12">
            {artists.map((artist) => (
              <button
                key={artist.id}
                onClick={() => handleSelectArtist(artist.id)}
                className="group flex items-center justify-between bg-white border border-gray-200 p-4 rounded-[14px] shadow-sm hover:border-black hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  {artist.avatarUrl ? (
                    <img src={artist.avatarUrl} alt={artist.displayName} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <span className="text-lg font-bold text-gray-400">{artist.displayName.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#111111]">{artist.displayName}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">@{artist.username}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        )}
        
        <div className="flex justify-end pt-8 border-t border-gray-200">
          <Button 
             onClick={handleDeleteAccount} 
             variant="outline" 
             className="gap-2 !border-red-200 !text-red-500 hover:!bg-red-500 hover:!text-white"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};
