-- Recreate get_current_plan
CREATE OR REPLACE FUNCTION public.get_current_plan()
RETURNS text AS $$
DECLARE
  v_plan text;
  v_status text;
  v_promo_expires timestamptz;
BEGIN
  SELECT plan, status, promotion_expires_at INTO v_plan, v_status, v_promo_expires
  FROM public.manager_subscriptions
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_plan = 'manager_pro' AND v_status = 'active' THEN
    IF v_promo_expires IS NOT NULL AND now() > v_promo_expires THEN
      RETURN 'free';
    END IF;
    RETURN 'manager_pro';
  END IF;
  
  RETURN 'free';
EXCEPTION WHEN OTHERS THEN
  RETURN 'free';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Recreate activate_manager_pro_launch_promo
CREATE OR REPLACE FUNCTION public.activate_manager_pro_launch_promo(p_billing_cycle text)
RETURNS boolean AS $$
DECLARE
  v_account_type text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
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

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Explicitly grant execute
GRANT EXECUTE ON FUNCTION public.get_current_plan() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_plan() TO anon;
GRANT EXECUTE ON FUNCTION public.activate_manager_pro_launch_promo(text) TO authenticated;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
