-- 1. Helper to get user's account type
CREATE OR REPLACE FUNCTION public.get_current_account_type()
RETURNS text AS $$
BEGIN
  RETURN NULLIF(auth.jwt() -> 'user_metadata' ->> 'account_type', '');
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2. Helper to get user's plan
CREATE OR REPLACE FUNCTION public.get_current_plan()
RETURNS text AS $$
BEGIN
  RETURN COALESCE(NULLIF(auth.jwt() -> 'user_metadata' ->> 'plan', ''), 'free');
EXCEPTION WHEN OTHERS THEN
  RETURN 'free';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3. Helper to count owned artists
CREATE OR REPLACE FUNCTION public.count_owned_artists()
RETURNS integer AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT count(*) INTO v_count
  FROM public.artist_members
  WHERE user_id = auth.uid() AND role = 'owner';
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 4. Drop existing INSERT policies on artists
DROP POLICY IF EXISTS "Users can insert own artist" ON public.artists;

-- 5. Create new INSERT policy on artists
CREATE POLICY "Users can insert own artist" ON public.artists
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  (
    (public.get_current_account_type() = 'artist' AND public.count_owned_artists() < 1)
    OR
    (public.get_current_account_type() = 'manager' AND public.get_current_plan() = 'free' AND public.count_owned_artists() < 2)
    OR
    (public.get_current_account_type() = 'manager' AND public.get_current_plan() = 'manager_pro')
    OR
    (public.get_current_account_type() IS NULL AND public.count_owned_artists() < 1)
  )
);

-- 6. Update artist_claims INSERT policy
DROP POLICY IF EXISTS "Users can insert own claims" ON public.artist_claims;

CREATE POLICY "Users can insert own claims" ON public.artist_claims
FOR INSERT WITH CHECK (
  auth.uid() = user_id 
  AND status = 'pending'
  AND (
    (public.get_current_account_type() = 'manager' AND public.get_current_plan() = 'free' AND public.count_owned_artists() < 2)
    OR
    (public.get_current_account_type() = 'manager' AND public.get_current_plan() = 'manager_pro')
  )
);

