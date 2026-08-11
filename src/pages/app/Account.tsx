import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { AccordionSection } from '../../components/ui/AccordionSection';
import { ImageUpload } from '../../components/release/ImageUpload';
import { deleteDirectImage } from '../../lib/supabase/storage';
import { LogOut, Loader2, Trash2, UserX } from 'lucide-react';
import { Artist } from '../../types';
import { Link } from 'react-router-dom';
import { checkUsernameAvailable, updateArtist, deleteArtist } from '../../lib/supabase/artists';
import { getReleasesByArtistId } from '../../lib/supabase/releases';
import { supabase } from '../../lib/supabase';

export const Account = () => {
  const { t } = useLanguage();

  const { user, artist, logout, refreshArtistProfile, updateUserAccountType } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingArtist, setIsDeletingArtist] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isBecomingManager, setIsBecomingManager] = useState(false);
  const [formData, setFormData] = useState<Partial<Artist>>(artist || {});
  const [error, setError] = useState<string | null>(null);

  const handleBecomeManager = async () => {
    if (window.confirm("Become a Manager\n\nYour current Artist account will remain intact.\nYou'll be able to manage multiple artists and releases.\nYou'll start with Manager Free, which includes up to 2 artists.")) {
      setIsBecomingManager(true);
      setError(null);
      try {
        await updateUserAccountType('manager');
      } catch (err: any) {
        console.error("Error becoming manager:", err);
        setError(err.message || 'Failed to update account type.');
        setIsBecomingManager(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleDeleteArtist = async () => {
    if (!artist) return;
    
    if (window.confirm("Delete this artist profile?\n\nThis will permanently delete this artist profile, its releases, and associated uploaded artwork. Your HabisRilis account will remain active.")) {
      setIsDeletingArtist(true);
      setError(null);
      try {
        const releases = await getReleasesByArtistId(artist.id);
        for (const release of releases) {
          if (release.artworkUrl && release.artworkUrl.includes('artwork')) {
            await deleteDirectImage('artwork', release.artworkUrl).catch(console.error);
          }
        }
        
        if (artist.avatarUrl && artist.avatarUrl.includes('artwork')) {
          await deleteDirectImage('artwork', artist.avatarUrl).catch(console.error);
        }
        
        await deleteArtist(artist.id);
        await refreshArtistProfile(); // Triggers re-routing
      } catch (err: any) {
        console.error("Error deleting artist:", err);
        setError(err.message || 'Failed to delete artist profile.');
      } finally {
        setIsDeletingArtist(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Delete your HabisRilis account?\n\nThis will permanently remove your HabisRilis data. This action cannot be undone.")) {
      setIsDeletingAccount(true);
      setError(null);
      try {
        // Clean up artist data if present
        if (artist) {
          const releases = await getReleasesByArtistId(artist.id);
          for (const release of releases) {
            if (release.artworkUrl && release.artworkUrl.includes('artwork')) {
              await deleteDirectImage('artwork', release.artworkUrl).catch(console.error);
            }
          }
          if (artist.avatarUrl && artist.avatarUrl.includes('artwork')) {
            await deleteDirectImage('artwork', artist.avatarUrl).catch(console.error);
          }
          await deleteArtist(artist.id);
        }
        
        // Clean up user profile record
        if (user) {
          await supabase.from('profiles').delete().eq('id', user.id);
        }
        
        // Note: Full auth.users deletion typically requires an Edge Function 
        // using service_role key. Since we can't expose that here, we perform 
        // safe client-side cleanup and then sign out.
        await logout();
      } catch (err: any) {
        console.error("Error deleting account:", err);
        setError(err.message || 'Failed to delete account.');
      } finally {
        setIsDeletingAccount(false);
      }
    }
  };

  const handleSocialChange = (platform: string, url: string) => {
    const newLinks = [...(formData.socialLinks || [])];
    const existingIndex = newLinks.findIndex(l => l.platform === platform);
    
    if (url.trim() === '') {
      if (existingIndex !== -1) newLinks.splice(existingIndex, 1);
    } else {
      if (existingIndex !== -1) {
        newLinks[existingIndex] = { platform, url, sortOrder: existingIndex };
      } else {
        newLinks.push({ platform, url, sortOrder: newLinks.length });
      }
    }
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const getSocialUrl = (platform: string) => {
    return formData.socialLinks?.find(l => l.platform === platform)?.url || '';
  };

  const handleSave = async () => {
    if (!artist || !user) return;
    
    if (!formData.displayName || !formData.username) {
      setError('Artist Name and Username are required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const cleanUsername = formData.username.trim().toLowerCase().replace(/[^a-z0-9\-]/g, '');
      
      if (cleanUsername !== artist.username) {
        const isAvailable = await checkUsernameAvailable(cleanUsername);
        
        if (!isAvailable) {
          setError('Username is already taken.');
          setIsSaving(false);
          return;
        }
      }

      await updateArtist(artist.id, {
        displayName: formData.displayName.trim(),
        username: cleanUsername,
        avatarUrl: formData.avatarUrl || '',
        bio: formData.bio || '',
        socialLinks: formData.socialLinks || []
      });

      // Cleanup old avatar if it was replaced or removed
      if (
        artist.avatarUrl && 
        artist.avatarUrl !== formData.avatarUrl && 
        artist.avatarUrl.includes('artwork')
      ) {
        deleteDirectImage('artwork', artist.avatarUrl).catch(console.error);
      }

      await refreshArtistProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="mx-auto max-w-md pt-8 pb-20">
        <div className="mb-10 flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            {artist?.avatarUrl || user?.avatarUrl ? (
              <img
                src={artist?.avatarUrl || user?.avatarUrl}
                alt={artist?.displayName}
                className="h-24 w-24 object-cover rounded-full border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="h-24 w-24 bg-gray-100 rounded-full border border-gray-200 shadow-sm flex items-center justify-center">
                <span className="text-gray-400 font-bold uppercase text-2xl">{artist?.displayName?.charAt(0) || '?'}</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-[#111111] uppercase">{artist?.displayName || user?.name}</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">@{artist?.username || 'user'}</p>
        </div>

        <div className="mb-8 rounded-[14px] shadow-sm border border-gray-200 bg-white p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Account Info</h3>
            <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold uppercase tracking-widest hover:text-gray-500">Edit</button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email</label>
              <p className="font-bold text-[#111111] tracking-wide">{user?.email}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Artist Name</label>
              <p className="font-bold text-[#111111] tracking-wide">{artist?.displayName}</p>
            </div>
            {artist?.bio && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bio</label>
                <p className="text-sm text-[#111111] leading-relaxed whitespace-pre-wrap">{artist.bio}</p>
              </div>
            )}
          </div>
        </div>

        {user?.accountType === 'artist' && (
          <div className="mb-8 rounded-[14px] shadow-sm border border-gray-200 bg-white p-8">
            <h3 className="text-lg font-bold tracking-tight mb-2">Want to manage multiple artists?</h3>
            <p className="text-sm text-gray-500 mb-6 font-light">Become a Manager to manage multiple artists and releases.</p>
            <Button variant="outline" fullWidth onClick={handleBecomeManager} disabled={isBecomingManager}>
              {isBecomingManager ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Become a Manager'}
            </Button>
          </div>
        )}

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-[10px] text-sm text-center">{error}</div>}
        
        {user?.email === 'mailnewibink@gmail.com' && (
          <Link to="/app/admin/claims">
            <Button variant="outline" fullWidth className="mb-4 gap-2 border-gray-200">
              Admin Claims Dashboard
            </Button>
          </Link>
        )}

        <Button onClick={handleLogout} variant="outline" fullWidth className="mb-4 gap-2">
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
        
        {artist && (
          <Button 
            onClick={handleDeleteArtist} 
            variant="outline" 
            fullWidth 
            className="mb-4 gap-2" 
            disabled={isDeletingArtist || isDeletingAccount}
          >
            {isDeletingArtist ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
            Delete Artist Profile
          </Button>
        )}
        
        <Button 
          onClick={handleDeleteAccount} 
          variant="outline" 
          fullWidth 
          className="gap-2 !border-red-200 !text-red-500 hover:!bg-red-500 hover:!text-white"
          disabled={isDeletingArtist || isDeletingAccount}
        >
          {isDeletingAccount ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete Account
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md pt-8 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tighter text-[#111111] uppercase">Edit Profile</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setFormData(artist || {}); }}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </div>

      {error && <div className="mb-4 text-red-500 font-medium text-sm">{error}</div>}

      <div className="space-y-6">
        <div className="border border-gray-200 bg-white p-6 rounded-[14px] shadow-sm space-y-6">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Profile Image</label>
            <ImageUpload 
              value={formData.avatarUrl || ''} 
              onChange={url => setFormData({ ...formData, avatarUrl: url })}
              bucket="artwork"
              maxSize={1000}
              circular={true}
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Artist Name</label>
            <Input 
              value={formData.displayName || ''} 
              onChange={e => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Username</label>
            <Input 
              value={formData.username || ''} 
              onChange={e => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Bio</label>
            <Textarea 
              value={formData.bio || ''} 
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell your story..."
            />
          </div>
        </div>

        <AccordionSection title="Social Links" defaultOpen={true}>
           <div className="space-y-6">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Instagram</label>
              <Input 
                value={getSocialUrl('instagram')}
                onChange={e => handleSocialChange('instagram', e.target.value)}
                placeholder="Instagram URL" 
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">TikTok</label>
              <Input 
                value={getSocialUrl('tiktok')}
                onChange={e => handleSocialChange('tiktok', e.target.value)}
                placeholder="TikTok URL" 
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">X (Twitter)</label>
              <Input 
                value={getSocialUrl('x')}
                onChange={e => handleSocialChange('x', e.target.value)}
                placeholder="X URL" 
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">YouTube</label>
              <Input 
                value={getSocialUrl('youtube')}
                onChange={e => handleSocialChange('youtube', e.target.value)}
                placeholder="YouTube URL" 
              />
            </div>
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};
