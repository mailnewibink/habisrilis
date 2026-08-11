-- 1. Function to approve a claim securely
CREATE OR REPLACE FUNCTION public.approve_claim(claim_id UUID)
RETURNS boolean AS $$
DECLARE
  v_artist_id UUID;
  v_user_id UUID;
  v_claim_status TEXT;
  v_artist_status TEXT;
BEGIN
  -- 1. Get claim details
  SELECT artist_id, user_id, status 
  INTO v_artist_id, v_user_id, v_claim_status 
  FROM public.artist_claims 
  WHERE id = claim_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Claim not found';
  END IF;

  IF v_claim_status != 'pending' THEN
    RAISE EXCEPTION 'Claim is not pending';
  END IF;

  -- 2. Get artist details
  SELECT verification_status 
  INTO v_artist_status
  FROM public.artists
  WHERE id = v_artist_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Artist not found';
  END IF;

  IF v_artist_status != 'claim_pending' THEN
    RAISE EXCEPTION 'Artist is not in claim_pending state';
  END IF;

  -- 3. Update claim status
  UPDATE public.artist_claims
  SET status = 'approved', updated_at = NOW()
  WHERE id = claim_id;

  -- 4. Update artist status
  UPDATE public.artists
  SET verification_status = 'verified', updated_at = NOW()
  WHERE id = v_artist_id;

  -- 5. Demote existing owner(s) to manager (unless they are the claimant)
  UPDATE public.artist_members
  SET role = 'manager'
  WHERE artist_id = v_artist_id AND user_id != v_user_id AND role = 'owner';

  -- 6. Add claimant as owner (or upgrade to owner if they are already a manager)
  INSERT INTO public.artist_members (artist_id, user_id, role)
  VALUES (v_artist_id, v_user_id, 'owner')
  ON CONFLICT (artist_id, user_id) 
  DO UPDATE SET role = 'owner';

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke public execute access so this can only be called by service_role (or superuser)
REVOKE EXECUTE ON FUNCTION public.approve_claim(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.approve_claim(UUID) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.approve_claim(UUID) FROM anon;

-- 2. Function to reject a claim securely
CREATE OR REPLACE FUNCTION public.reject_claim(claim_id UUID)
RETURNS boolean AS $$
DECLARE
  v_artist_id UUID;
  v_claim_status TEXT;
  v_pending_count INT;
BEGIN
  SELECT artist_id, status 
  INTO v_artist_id, v_claim_status 
  FROM public.artist_claims 
  WHERE id = claim_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Claim not found';
  END IF;

  IF v_claim_status != 'pending' THEN
    RAISE EXCEPTION 'Claim is not pending';
  END IF;

  -- 1. Update claim status
  UPDATE public.artist_claims
  SET status = 'rejected', updated_at = NOW()
  WHERE id = claim_id;

  -- 2. Check if there are other pending claims for this artist
  SELECT COUNT(*) INTO v_pending_count
  FROM public.artist_claims
  WHERE artist_id = v_artist_id AND status = 'pending';

  -- 3. If no other pending claims, set artist back to unclaimed
  IF v_pending_count = 0 THEN
    UPDATE public.artists
    SET verification_status = 'unclaimed', updated_at = NOW()
    WHERE id = v_artist_id;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke public execute access so this can only be called by service_role (or superuser)
REVOKE EXECUTE ON FUNCTION public.reject_claim(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reject_claim(UUID) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.reject_claim(UUID) FROM anon;

