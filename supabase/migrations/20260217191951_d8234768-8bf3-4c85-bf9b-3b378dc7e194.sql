
-- Create storage bucket for college/course/exam images
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users update uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to delete uploads
CREATE POLICY "Authenticated users delete uploads" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);
