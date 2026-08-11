-- STORAGE: ARTIST AVATARS BUCKET
INSERT INTO storage.buckets (id, name, public) VALUES ('artist-avatars', 'artist-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Public avatar read" ON storage.objects FOR SELECT USING (bucket_id = 'artist-avatars');

-- Auth owner write (Insert, Update, Delete)
-- Path structure: artist-avatars/{user_id}/...
CREATE POLICY "Owner avatar insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'artist-avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
CREATE POLICY "Owner avatar update" ON storage.objects FOR UPDATE USING (
  bucket_id = 'artist-avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
CREATE POLICY "Owner avatar delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'artist-avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
