-- 004_persona_avatars.sql
-- Moms&Pops — Avatar URL column + public storage bucket for persona avatars

-- ═══════════════════════════════════════════════════════
-- PERSONAS ALTERATION
-- ═══════════════════════════════════════════════════════
ALTER TABLE public.personas
  ADD COLUMN IF NOT EXISTS avatar_url text;

COMMENT ON COLUMN public.personas.avatar_url IS 'Public URL to persona avatar image in persona-avatars bucket.';

-- ═══════════════════════════════════════════════════════
-- STORAGE BUCKET
-- ═══════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'persona-avatars',
  'persona-avatars',
  true,   -- public so avatar URLs render without signed tokens
  5242880, -- 5MB per file
  '{image/jpeg,image/png,image/webp,image/gif}'
)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- RLS POLICIES (drop old broken ones first if re-running)
-- ═══════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Users can upload persona avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view persona avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update persona avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete persona avatars" ON storage.objects;

-- Users can upload persona avatars
CREATE POLICY "Users can upload persona avatars"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'persona-avatars' AND auth.role() = 'authenticated');

-- Anyone can read (public bucket)
CREATE POLICY "Anyone can view persona avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'persona-avatars');

-- Users can update persona avatars
CREATE POLICY "Users can update persona avatars"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'persona-avatars');

-- Users can delete persona avatars
CREATE POLICY "Users can delete persona avatars"
ON storage.objects
FOR DELETE
USING (bucket_id = 'persona-avatars');
