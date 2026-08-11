import React, { useState } from 'react';
import { Button } from './Button';
import { useAuth } from '../../auth/AuthContext';
import { followArtist, unfollowArtist } from '../../lib/supabase/followers';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FollowButtonProps {
  artistId: string;
  initialIsFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

export const FollowButton = ({ artistId, initialIsFollowing, onFollowChange, className = '' }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Sync internal state if prop changes
  React.useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleToggleFollow = async () => {
    if (!user) {
      // Prompt sign in if not logged in
      try {
        sessionStorage.setItem('habisrilis_return_to', window.location.pathname);
        await signInWithGoogle();
      } catch (err) {
        console.error('Sign in failed:', err);
      }
      return;
    }

    const previousState = isFollowing;
    setIsFollowing(!previousState);
    if (onFollowChange) onFollowChange(!previousState);
    
    setLoading(true);
    try {
      if (previousState) {
        await unfollowArtist(artistId, user.id);
      } else {
        await followArtist(artistId, user.id);
      }
    } catch (err) {
      // Revert optimistic update
      setIsFollowing(previousState);
      if (onFollowChange) onFollowChange(previousState);
      console.error('Failed to toggle follow:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'primary'}
      size="sm"
      className={`rounded-full px-6 font-bold uppercase tracking-widest text-[11px] ${className}`}
      onClick={handleToggleFollow}
      disabled={loading}
    >
      {loading ? (
        'Loading...'
      ) : isFollowing ? (
        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Following</span>
      ) : (
        'Follow'
      )}
    </Button>
  );
};
