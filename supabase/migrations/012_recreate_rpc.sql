-- Force schema reload by recreating the function
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

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
