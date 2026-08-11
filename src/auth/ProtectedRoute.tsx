import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireArtist?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireArtist = true }) => {
  const { user, artist, loading, artistLoading } = useAuth();
  const location = useLocation();

  if (loading || artistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const effectiveAccountType = user.accountType || (artist ? 'artist' : null);

  // If no account type and not currently on the onboarding page, redirect to onboarding
  if (!effectiveAccountType && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user has account type but is on the onboarding page, redirect to their home
  if (effectiveAccountType && location.pathname === '/onboarding') {
    if (effectiveAccountType === 'manager') return <Navigate to="/app/manager" replace />;
    if (effectiveAccountType === 'fan') return <Navigate to="/app/fan" replace />;
    if (effectiveAccountType === 'artist') return <Navigate to="/app" replace />;
  }

  // Route protection for different account types
  if (location.pathname.startsWith('/app/admin')) {
    if (user.email !== 'mailnewibink@gmail.com') {
      return <Navigate to="/app" replace />;
    }
  }

  if (effectiveAccountType === 'manager') {
    if (location.pathname.startsWith('/app') && location.pathname !== '/app/setup' && location.pathname !== '/app/manager' && location.pathname !== '/app/claim-artist' && !location.pathname.startsWith('/app/admin') && !artist) {
      return <Navigate to="/app/manager" replace />;
    }
    if (!location.pathname.startsWith('/app')) {
      return <Navigate to="/app/manager" replace />;
    }
  }

  if (effectiveAccountType === 'fan' && !location.pathname.startsWith('/app/fan') && location.pathname !== '/app/setup') {
    return <Navigate to="/app/fan" replace />;
  }

  if (effectiveAccountType === 'artist' && requireArtist && !artist) {
    // If this route requires an artist profile and the user doesn't have one,
    // redirect them to the setup flow.
    return <Navigate to="/app/setup" replace />;
  }
  

  return <>{children}</>;
};
