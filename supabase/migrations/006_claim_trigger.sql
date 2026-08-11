-- Trigger to automatically set verification_status to claim_pending when a claim is created
CREATE OR REPLACE FUNCTION public.handle_new_artist_claim()
RETURNS trigger AS $$
BEGIN
  -- We use SECURITY DEFINER so it bypasses RLS for the update
  UPDATE public.artists
  SET verification_status = 'claim_pending', updated_at = NOW()
  WHERE id = NEW.artist_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_new_artist_claim ON public.artist_claims;
CREATE TRIGGER trg_new_artist_claim
AFTER INSERT ON public.artist_claims
FOR EACH ROW
WHEN (NEW.status = 'pending')
EXECUTE FUNCTION public.handle_new_artist_claim();

-- Prevent direct updates to verification_status by non-superusers/non-service-role
CREATE OR REPLACE FUNCTION public.protect_verification_status()
RETURNS trigger AS $$
BEGIN
  -- If verification_status has changed
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
    -- In Supabase, the authenticated user role is usually 'authenticated'
    -- The service_role key uses the 'service_role' role
    IF current_user IN ('authenticated', 'anon') THEN
      RAISE EXCEPTION 'You cannot modify verification_status directly';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_verification_status ON public.artists;
CREATE TRIGGER trg_protect_verification_status
BEFORE UPDATE ON public.artists
FOR EACH ROW
EXECUTE FUNCTION public.protect_verification_status();
