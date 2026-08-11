import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { pricingConfig, isLaunchPromotionActive, formatPrice } from '../../config/pricing';
import { supabase } from '../../lib/supabase';
import { Loader2, Check } from 'lucide-react';

export const UpgradePage = () => {
  const { user, updateUserAccountType, refreshPlan } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    if (billingCycle === 'yearly') return;
    setIsActivating(true);
    setError(null);
    try {
      if (isLaunchPromotionActive()) {
        const { error: rpcError } = await supabase.rpc('activate_manager_pro_launch_promo', {
          p_billing_cycle: billingCycle
        });
        
        if (rpcError) {
          if (rpcError.code === 'PGRST202' || rpcError.message?.includes('Could not find the function')) {
             const { error: updateError } = await supabase.auth.updateUser({
               data: { plan: 'manager_pro', billing_cycle: billingCycle }
             });
             if (updateError) throw updateError;
          } else {
             throw rpcError;
          }
        }
        
        // Refresh plan globally from db
        await refreshPlan();
        navigate('/app/manager');
      } else {
        // Future real payment gateway integration goes here
        setError('Checkout flow is not implemented yet.');
      }
    } catch (err: any) {
      console.error('Error activating pro:', err);
      setError(err.message || 'An error occurred during activation.');
    } finally {
      setIsActivating(false);
    }
  };

  if (!user || user.accountType !== 'manager') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Manager Access Only</h2>
        <Button onClick={() => navigate('/app')}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter text-[#111111] mb-4">Manager Pro</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Manage unlimited artists from one account. Unlock all professional management tools for your entire roster.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-full inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                billingCycle === 'monthly' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                billingCycle === 'yearly' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Tahunan
            </button>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Monthly Card */}
          <div
            onClick={() => setBillingCycle('monthly')}
            className={`cursor-pointer rounded-2xl border-2 p-8 transition-all relative ${
              billingCycle === 'monthly' ? 'border-black bg-white shadow-lg' : 'border-gray-200 bg-white/50 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold uppercase tracking-widest">Monthly</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                billingCycle === 'monthly' ? 'border-black bg-black text-white' : 'border-gray-300'
              }`}>
                {billingCycle === 'monthly' && <Check className="w-4 h-4" />}
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold tracking-tighter">
                {formatPrice(pricingConfig.managerPro.monthly.price)}
              </span>
              <span className="text-gray-500 font-medium"> / bulan</span>
            </div>
          </div>

          {/* Yearly Card */}
          <div
            onClick={() => setBillingCycle('yearly')}
            className={`cursor-pointer rounded-2xl border-2 p-8 transition-all relative ${
              billingCycle === 'yearly' ? 'border-black bg-white shadow-lg' : 'border-gray-200 bg-white/50 hover:border-gray-300'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Best Value
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold uppercase tracking-widest">Yearly</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                billingCycle === 'yearly' ? 'border-black bg-black text-white' : 'border-gray-300'
              }`}>
                {billingCycle === 'yearly' && <Check className="w-4 h-4" />}
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold tracking-tighter">
                {formatPrice(pricingConfig.managerPro.yearly.price)}
              </span>
              <span className="text-gray-500 font-medium"> / tahun</span>
            </div>
            <p className="text-sm font-medium text-green-600 mt-2">
              Hemat dibanding paket bulanan
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-8">
          {isLaunchPromotionActive() && (
            <div className="bg-black text-white rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Launch Promotion</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Manager Pro is FREE until 31 December 2026. Manage unlimited artists completely free during our launch period.
              </p>
              <Button
                size="lg"
                fullWidth
                className={billingCycle === 'yearly' ? 'bg-gray-100 text-gray-500 hover:bg-gray-100 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-100'}
                onClick={handleActivate}
                disabled={isActivating || billingCycle === 'yearly'}
              >
                {billingCycle === 'yearly' ? 'Segera Hadir' : (isActivating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Aktifkan Pro Gratis')}
              </Button>
            </div>
          )}
          
          {!isLaunchPromotionActive() && (
            <Button
              size="lg"
              fullWidth
              className={`mt-6 ${billingCycle === 'yearly' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
              onClick={handleActivate}
              disabled={isActivating || billingCycle === 'yearly'}
            >
              {billingCycle === 'yearly' ? 'Segera Hadir' : (isActivating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Payment')}
            </Button>
          )}

          <div className="text-center mt-6">
            <Button variant="ghost" onClick={() => navigate('/app/manager')}>
              Cancel and Return
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
