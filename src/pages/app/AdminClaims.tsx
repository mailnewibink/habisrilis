import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const AdminClaims = () => {
  const { t } = useLanguage();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Security gate
  useEffect(() => {
    if (user && user.email !== 'mailnewibink@gmail.com') {
      navigate('/app');
    }
  }, [user, navigate]);

  const fetchClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('admin-list-claims');
      
      if (error) {
        throw new Error(error.message || 'Failed to fetch claims');
      }

      setClaims(data?.data || []);
    } catch (err: any) {
      console.error('Error fetching claims:', err);
      setError(err.message || 'Unable to load claim requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email === 'mailnewibink@gmail.com') {
      fetchClaims();
    }
  }, [user]);

  const handleApprove = async (claim: any) => {
    if (!window.confirm(`Approve Artist Claim?\n\nYou are about to verify:\n${claim.artists?.display_name}\n@${claim.artists?.username}\n\nClaimant User ID:\n${claim.user_id}\n\nVerification URL:\n${claim.social_link}\n\nThis will:\n- verify the artist\n- make the claimant the owner\n- retain the previous owner as manager`)) {
      return;
    }

    setProcessingId(claim.id);
    try {
      const { data, error } = await supabase.functions.invoke('admin-approve-claim', {
        body: { claim_id: claim.id }
      });
      if (error) throw error;
      alert('Artist verified successfully.');
      fetchClaims();
    } catch (err: any) {
      console.error('Error approving claim:', err);
      alert(err.message || 'The action could not be completed. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (claim: any) => {
    if (!window.confirm(`Reject Artist Claim?\n\n${claim.artists?.display_name}\n@${claim.artists?.username}`)) {
      return;
    }

    setProcessingId(claim.id);
    try {
      const { data, error } = await supabase.functions.invoke('admin-reject-claim', {
        body: { claim_id: claim.id }
      });
      if (error) throw error;
      alert('Claim rejected successfully.');
      fetchClaims();
    } catch (err: any) {
      console.error('Error rejecting claim:', err);
      alert(err.message || 'The action could not be completed. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getDashboardRoute = () => {
    if (user?.accountType === 'manager') return '/app/manager';
    if (user?.accountType === 'fan') return '/app/fan';
    return '/app';
  };

  if (user?.email !== 'mailnewibink@gmail.com') {
    return null; // Don't render anything while redirecting
  }

  const filteredClaims = claims.filter(c => c.status === activeTab);

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 font-sans pb-20 md:pb-6">
      <div className="max-w-3xl mx-auto py-8">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-tighter text-[#111111] mb-2">Admin</h1>
          <p className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-6">Claim Requests</p>
          
          <Link 
            to={getDashboardRoute()} 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors px-4 py-2 border border-gray-200 rounded-[10px] bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {(['pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-[10px] transition-colors ${
                activeTab === tab 
                  ? 'bg-black text-white' 
                  : 'bg-white border border-gray-200 text-gray-500 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-[14px] text-sm text-center mb-8 border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading claim requests...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClaims.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-[14px] p-12 text-center shadow-sm">
                <h3 className="text-lg font-bold tracking-tight mb-2 uppercase">No {activeTab} Claims</h3>
                <p className="text-gray-500 text-sm">
                  {activeTab === 'pending' 
                    ? 'There are currently no artist verification requests waiting for review.' 
                    : `There are no ${activeTab} claims.`}
                </p>
              </div>
            ) : (
              filteredClaims.map((claim) => (
                <div key={claim.id} className="bg-white border border-gray-200 rounded-[14px] p-6 shadow-sm flex flex-col gap-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {claim.artists?.avatar_url ? (
                        <img src={claim.artists.avatar_url} alt={claim.artists.display_name} className="w-16 h-16 rounded-full object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                          <span className="text-xl font-bold text-gray-400">{claim.artists?.display_name?.charAt(0) || '?'}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-[#111111] flex items-center gap-2">
                          {claim.artists?.display_name}
                          {claim.artists?.verification_status === 'verified' && (
                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-black fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          )}
                        </h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">@{claim.artists?.username}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded border ${
                        claim.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        claim.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {claim.status}
                      </span>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">
                        {new Date(claim.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Claimant ID</label>
                      <p className="text-xs text-gray-600 font-mono break-all">{claim.user_id}</p>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Claim Type</label>
                      <p className="text-xs text-gray-600 font-bold">Artist</p>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Verification Code</label>
                      <p className="text-xs text-gray-600 font-mono font-bold bg-gray-50 p-2 rounded inline-block">{claim.verification_code}</p>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Verification URL</label>
                      <a href={claim.social_link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline break-all block">
                        {claim.social_link}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-50 justify-end">
                    <Link to={`/@${claim.artists?.username}`} target="_blank" className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full text-[10px] uppercase tracking-widest gap-2">
                        View Profile
                      </Button>
                    </Link>
                    
                    {claim.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => handleReject(claim)}
                          disabled={processingId === claim.id}
                          className="w-full sm:w-auto text-[10px] uppercase tracking-widest !border-red-200 !text-red-600 hover:!bg-red-50"
                        >
                          {processingId === claim.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reject'}
                        </Button>
                        <Button 
                          onClick={() => handleApprove(claim)}
                          disabled={processingId === claim.id}
                          className="w-full sm:w-auto text-[10px] uppercase tracking-widest !bg-green-600 hover:!bg-green-700 !text-white border-0"
                        >
                          {processingId === claim.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve'}
                        </Button>
                      </>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
