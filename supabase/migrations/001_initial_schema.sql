-- Create custom types for status and release_type (or use TEXT with CHECK constraints)

-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ARTISTS
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  social_links JSONB DEFAULT '[]'::jsonb,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RELEASES
CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  release_type TEXT NOT NULL,
  release_date TIMESTAMPTZ NOT NULL,
  artwork_url TEXT,
  artwork_format TEXT,
  spotify_url TEXT,
  youtube_url TEXT,
  about TEXT,
  about_visible BOOLEAN DEFAULT true,
  status TEXT NOT NULL CHECK (status IN ('draft', 'live', 'archived')),
  streaming_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artist_id, slug)
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

-- RLS: PROFILES
-- Authenticated user can read their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Authenticated user can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- RLS: ARTISTS
-- Public users can read artist profiles
CREATE POLICY "Public artists are viewable by everyone" 
ON artists FOR SELECT 
USING (true);

-- Authenticated owner can create their own artist profile
CREATE POLICY "Users can insert own artist" 
ON artists FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Authenticated owner can update their own artist
CREATE POLICY "Users can update own artist" 
ON artists FOR UPDATE 
USING (auth.uid() = user_id);

-- Authenticated owner can delete their own artist
CREATE POLICY "Users can delete own artist" 
ON artists FOR DELETE 
USING (auth.uid() = user_id);

-- RLS: RELEASES
-- Public users can read live releases
CREATE POLICY "Public live releases are viewable by everyone" 
ON releases FOR SELECT 
USING (status = 'live');

-- Authenticated owner can read their own releases (all statuses)
CREATE POLICY "Users can view own releases" 
ON releases FOR SELECT 
USING (
  artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
);

-- Authenticated owner can create releases only for artists they own
CREATE POLICY "Users can insert own releases" 
ON releases FOR INSERT 
WITH CHECK (
  artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
);

-- Authenticated owner can update their own releases
CREATE POLICY "Users can update own releases" 
ON releases FOR UPDATE 
USING (
  artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
);

-- Authenticated owner can delete their own releases
CREATE POLICY "Users can delete own releases" 
ON releases FOR DELETE 
USING (
  artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
);


-- TRIGGER FOR NEW USER PROFILE CREATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- STORAGE: ARTWORK BUCKET
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artwork', 'artwork', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE RLS
-- Assuming `storage.objects` table has RLS enabled by default in Supabase.
-- Public read
CREATE POLICY "Public artwork read" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'artwork');

-- Auth owner write (Insert, Update, Delete)
-- Path structure: artwork/{user_id}/{release_id}/...
-- (storage.foldername(name))[1] gets the user_id from the path
CREATE POLICY "Owner artwork insert" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'artwork' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owner artwork update" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'artwork' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owner artwork delete" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'artwork' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
