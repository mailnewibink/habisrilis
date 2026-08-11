import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Loader2 } from 'lucide-react';

export const Onboarding = () => {
  const { updateUserAccountType } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = async (role: 'artist' | 'manager') => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateUserAccountType(role);
      // Let ProtectedRoute handle the navigation once the AuthContext updates
    } catch (err) {
      console.error('Error setting role:', err);
      setError('An error occurred while setting up your account. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 selection:bg-gray-200">
      <div className="w-full max-w-md bg-white p-10 border border-gray-100 shadow-sm rounded-[14px]">
        <div className="mb-8 text-center">
          <div className="w-8 h-8 bg-black mx-auto mb-6 rounded-full"></div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome to Habis Rilis</h1>
          <p className="text-gray-500 font-light text-sm">How will you use Habis Rilis?</p>
        </div>
        
        {error && <p className="text-red-500 text-sm font-medium text-center mb-6">{error}</p>}

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-[14px] p-6 hover:border-black transition-colors">
            <h2 className="text-lg font-bold tracking-tighter uppercase mb-1">Artist</h2>
            <p className="text-sm text-gray-500 mb-4 font-light">Create and manage your own Release Page.</p>
            <Button fullWidth onClick={() => handleSelectRole('artist')} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Continue as Artist'}
            </Button>
          </div>
          
          <div className="border border-gray-200 rounded-[14px] p-6 hover:border-black transition-colors">
            <h2 className="text-lg font-bold tracking-tighter uppercase mb-1">Manager</h2>
            <p className="text-sm text-gray-500 mb-4 font-light">Manage multiple artists and releases.</p>
            <Button fullWidth variant="outline" onClick={() => handleSelectRole('manager')} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Continue as Manager'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
