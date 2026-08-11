import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Loader2, Trash2, Star, UserX } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export const SuperAdmin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [releases, setReleases] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'releases' | 'users'>('releases');
  const [currentFeaturedId, setCurrentFeaturedId] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === 'mailnewibink@gmail.com') {
      setIsSuperAdmin(true);
      fetchFeatured();
      fetchReleases();
      fetchUsers();
    } else {
      navigate('/');
    }
  };

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch('/api/admin/releases', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (!res.ok && data.error) {
        setErrorMsg(data.error);
      }
      if (data.releases) setReleases(data.releases);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (!res.ok && data.error) {
        setErrorMsg(data.error);
      }
      if (data.users) setUsers(data.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSetFeatured = async (releaseId: string) => {
    if (!window.confirm('Set this release as featured?')) return;
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
      if (res.ok) setCurrentFeaturedId(releaseId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRelease = async (releaseId: string) => {
    if (!window.confirm('Are you sure you want to delete this release? This cannot be undone.')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`/api/admin/releases/${releaseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (res.ok) fetchReleases();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user account AND all their data? This cannot be undone.')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isSuperAdmin) return null;
  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="p-6">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          <h3 className="font-bold flex items-center gap-2"><UserX className="w-5 h-5"/> Backend Configuration Error</h3>
          <p className="mt-1">{errorMsg}</p>
          <p className="mt-2 text-sm">To fix this, you must add <strong>SUPABASE_SERVICE_ROLE_KEY</strong> to your server's environment variables (e.g., in Netlify settings or AI Studio <code>.env</code> file).</p>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Super Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all releases and users</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'releases' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('releases')}
          >
            Manage Releases
          </Button>
          <Button 
            variant={activeTab === 'users' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </Button>
        </div>
      </div>
      
      {activeTab === 'releases' && (
        <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-widest text-[10px] text-gray-500 font-bold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Artist</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {releases.map(release => (
                <tr key={release.id} className={currentFeaturedId === release.id ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    {currentFeaturedId === release.id && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    {release.title}
                  </td>
                  <td className="px-6 py-4">{release.artist?.displayName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      release.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {release.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetFeatured(release.id)}
                        disabled={currentFeaturedId === release.id || release.status !== 'live'}
                      >
                        Feature
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleDeleteRelease(release.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-widest text-[10px] text-gray-500 font-bold">
              <tr>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Account Type</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4 font-medium">{u.email}</td>
                  <td className="px-6 py-4 uppercase text-xs tracking-wider font-semibold text-gray-500">
                    {u.user_metadata?.account_type || 'Unknown'}
                  </td>
                  <td className="px-6 py-4">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.email === 'mailnewibink@gmail.com'}
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
