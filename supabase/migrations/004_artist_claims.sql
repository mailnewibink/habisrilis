-- 1. Create artist_members
CREATE TABLE IF NOT EXISTS public.artist_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artist_id, user_id)
);

-- Index for quick lookups by user and artist
CREATE INDEX IF NOT EXISTS idx_artist_members_user_id ON public.artist_members(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_members_artist_id ON public.artist_members(artist_id);

-- Enable RLS
ALTER TABLE public.artist_members ENABLE ROW LEVEL SECURITY;

-- 2. EXISTING ARTIST MIGRATION
-- Insert owner records for existing artists
INSERT INTO public.artist_members (artist_id, user_id, role)
SELECT id, user_id, 'owner'
FROM public.artists
ON CONFLICT (artist_id, user_id) DO NOTHING;

-- 3. Create artist_claims
CREATE TABLE IF NOT EXISTS public.artist_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verification_code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  social_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure a user can only have one pending claim per artist. 
CREATE UNIQUE INDEX IF NOT EXISTS idx_artist_claims_pending 
ON public.artist_claims(artist_id, user_id) 
WHERE status = 'pending';

-- Enable RLS
ALTER TABLE public.artist_claims ENABLE ROW LEVEL SECURITY;

-- 4. Add verification_status to artists
ALTER TABLE public.artists 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unclaimed' CHECK (verification_status IN ('unclaimed', 'claim_pending', 'verified'));

-- 5. TRIGGER FOR NEW ARTISTS
-- Ensure when a new artist is created via artists table, they are added to artist_members
CREATE OR REPLACE FUNCTION public.handle_new_artist_member()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.artist_members (artist_id, user_id, role)
  VALUES (new.id, new.user_id, 'owner')
  ON CONFLICT DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_artist_created ON public.artists;
CREATE TRIGGER on_artist_created
  AFTER INSERT ON public.artists
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_artist_member();

-- 6. RLS SAFETY for artist_members
-- Users can view members of artists they are a member of OR if they are the member.
CREATE POLICY "Users can view members of their artists" ON public.artist_members 
FOR SELECT USING (
  user_id = auth.uid() OR
  artist_id IN (SELECT artist_id FROM public.artist_members WHERE user_id = auth.uid()) OR
  artist_id IN (SELECT id FROM public.artists WHERE user_id = auth.uid())
);

-- 7. RLS SAFETY for artist_claims
CREATE POLICY "Users can insert own claims" ON public.artist_claims 
FOR INSERT WITH CHECK (
  auth.uid() = user_id 
  AND status = 'pending'
);

CREATE POLICY "Users can view own claims" ON public.artist_claims 
FOR SELECT USING (
  auth.uid() = user_id
);

-- 8. EXPAND RLS for artists and releases
CREATE POLICY "Artist members can update artist" ON artists FOR UPDATE USING (
  id IN (SELECT artist_id FROM artist_members WHERE user_id = auth.uid())
);

CREATE POLICY "Artist owner can delete artist" ON artists FOR DELETE USING (
  id IN (SELECT artist_id FROM artist_members WHERE user_id = auth.uid() AND role = 'owner')
);

CREATE POLICY "Members can view own releases" ON releases FOR SELECT USING (
  artist_id IN (SELECT artist_id FROM artist_members WHERE user_id = auth.uid())
);

CREATE POLICY "Members can insert own releases" ON releases FOR INSERT WITH CHECK (
  artist_id IN (SELECT artist_id FROM artist_members WHERE user_id = auth.uid())
);

CREATE POLICY "Members can update own releases" ON releases FOR UPDATE USING (
  artist_id IN (SELECT artist_id FROM artist_members WHERE user_id = auth.uid())
);

CREATE POLICY "Members can delete own releases" ON releases FOR DELETE USING (
  artist_id IN (SELECT artist_id FROM artist_members WHERE user_id = auth.uid())
);
