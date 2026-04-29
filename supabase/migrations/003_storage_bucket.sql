-- 003_storage_bucket.sql
-- Moms&Pops — Storage bucket for memory uploads with RLS
-- Run in Supabase SQL Editor or via supabase migration

-- ═══════════════════════════════════════════════════════
-- STORAGE BUCKET
-- ═══════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'memories',
  'memories',
  false,
  10485760, -- 10MB per file
  '{text/plain,text/csv,application/json,application/pdf,image/jpeg,image/png,audio/mpeg,audio/wav,audio/mp4}'
)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════

-- Users can upload to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'memories'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own files
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'memories'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'memories'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- The edge function needs to list files in a batch
CREATE POLICY "Users can list their own folder"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'memories'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
