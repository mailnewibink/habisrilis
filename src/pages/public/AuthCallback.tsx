import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const { user, artists, loading, artistLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    if (!loading && !artistLoading) {
      if (user) {
        // If we are in a popup, close it. The parent window's AuthContext will pick up the session.
        if (window.opener && !window.opener.closed) {
          window.close();
          return;
        }
        
        const effectiveAccountType = user.accountType || (artists && artists.length > 0 ? 'artist' : null);
        const returnTo = sessionStorage.getItem('habisrilis_return_to');
        if (returnTo) {
          sessionStorage.removeItem('habisrilis_return_to');
          navigate(returnTo, { replace: true });
        } else {
          if (!effectiveAccountType) {
            navigate('/onboarding', { replace: true });
          } else if (effectiveAccountType === 'manager') {
            navigate('/app/manager', { replace: true });
          } else if (effectiveAccountType === 'fan') {
            navigate('/app/fan', { replace: true });
          } else {
            navigate('/app', { replace: true });
          }
        }
      } else {
        // If there's no user but we stopped loading, wait a brief moment 
        // to see if the session recovers (e.g. late event fire)
        timeoutId = setTimeout(() => {
          setError('Unable to complete sign-in. Please try again.');
          // Navigate to home after showing error for 3 seconds
          setTimeout(() => navigate('/'), 3000);
        }, 1500); 
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user, artists, loading, artistLoading, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-2">Authentication error</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-black animate-spin mb-4" />
      <p className="text-sm text-gray-500">Signing in...</p>
    </div>
  );
}
