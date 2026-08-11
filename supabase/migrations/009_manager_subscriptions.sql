-- 1. Create manager_subscriptions table
CREATE TABLE IF NOT EXISTS public.manager_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'manager_pro')),
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'canceled', 'expired')),
  price NUMERIC,
  currency TEXT CHECK (currency = 'IDR'),
  provider TEXT CHECK (provider IN ('development', 'midtrans', 'xendit', 'stripe')),
  promotion TEXT,
  promotion_expires_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.manager_subscriptions ENABLE ROW LEVEL SECURITY;

-- Select policy
CREATE POLICY "Users can view own subscriptions"
  ON public.manager_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Update get_current_plan to check subscription table and expiration
CREATE OR REPLACE FUNCTION public.get_current_plan()
RETURNS text AS $$
DECLARE
  v_plan text;
  v_status text;
  v_promo_expires timestamptz;
BEGIN
  -- Check subscription table first
  SELECT plan, status, promotion_expires_at INTO v_plan, v_status, v_promo_expires
  FROM public.manager_subscriptions
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_plan = 'manager_pro' AND v_status = 'active' THEN
    -- If promotional, check expiration
    IF v_promo_expires IS NOT NULL AND now() > v_promo_expires THEN
      RETURN 'free';
    END IF;
    RETURN 'manager_pro';
  END IF;
  
  -- Fallback to user metadata if no subscription record (for backward compatibility if needed)
  RETURN COALESCE(NULLIF(auth.jwt() -> 'user_metadata' ->> 'plan', ''), 'free');
EXCEPTION WHEN OTHERS THEN
  RETURN 'free';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3. Create activation RPC
CREATE OR REPLACE FUNCTION public.activate_manager_pro_launch_promo(p_billing_cycle text)
RETURNS boolean AS $$
DECLARE
  v_account_type text;
BEGIN
  -- Verify authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get account type
  SELECT raw_user_meta_data->>'account_type' INTO v_account_type
  FROM auth.users
  WHERE id = auth.uid();
  
  IF COALESCE(v_account_type, '') != 'manager' THEN
    RAISE EXCEPTION 'Only managers can activate manager pro';
  END IF;
  
  IF p_billing_cycle NOT IN ('monthly', 'yearly') THEN
    RAISE EXCEPTION 'Invalid billing cycle';
  END IF;
  
  IF now() > '2026-12-31 23:59:59Z'::timestamptz THEN
    RAISE EXCEPTION 'Launch promotion has expired';
  END IF;

  -- Insert or update subscription
  INSERT INTO public.manager_subscriptions (
    user_id, plan, billing_cycle, status, price, currency, provider, promotion, promotion_expires_at, started_at
  )
  VALUES (
    auth.uid(),
    'manager_pro',
    p_billing_cycle,
    'active',
    0,
    'IDR',
    'development',
    'launch_free_2026',
    '2026-12-31 23:59:59Z'::timestamptz,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    plan = 'manager_pro',
    billing_cycle = p_billing_cycle,
    status = 'active',
    price = 0,
    currency = 'IDR',
    provider = 'development',
    promotion = 'launch_free_2026',
    promotion_expires_at = '2026-12-31 23:59:59Z'::timestamptz,
    started_at = now(),
    updated_at = now();

  -- Update user metadata for client-side easy access
  UPDATE auth.users 
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN '{"plan": "manager_pro"}'::jsonb
      ELSE raw_user_meta_data || '{"plan": "manager_pro"}'::jsonb
    END
  WHERE id = auth.uid();

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
