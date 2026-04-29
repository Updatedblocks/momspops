-- 002_brain_upgrade.sql
-- Moms&Pops — Soul Profile JSONB, Echo Balance, Memory Tables
-- Run this in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/lxwzvdmpwrxaxinlgfxa/sql/new

-- ═══════════════════════════════════════════════════════
-- PROFILES ALTERATION
-- ═══════════════════════════════════════════════════════
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS echo_balance INT DEFAULT 50,
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'echoes';

COMMENT ON COLUMN public.profiles.echo_balance IS 'Margin-protector: 0–100. Below 30 triggers conservative mode. Governs how much of the raw soul_profile bleeds into generation.';
COMMENT ON COLUMN public.profiles.tier IS 'Subscription tier: echoes, voice, presence';

-- ═══════════════════════════════════════════════════════
-- PERSONAS ALTERATION
-- ═══════════════════════════════════════════════════════
ALTER TABLE public.personas
  ADD COLUMN IF NOT EXISTS soul_profile JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

COMMENT ON COLUMN public.personas.soul_profile IS 'Full 40-point cognitive distillation (syntactic_architecture, lexical_fingerprint, emotional_topography, relational_dynamics).';
COMMENT ON COLUMN public.personas.status IS 'Lifecycle: draft, distilling, ready';

-- ═══════════════════════════════════════════════════════
-- CHAT LOGS (Short-Term RAM)
-- ═══════════════════════════════════════════════════════
CREATE TABLE public.chat_logs (
  id         uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  persona_id uuid NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       text NOT NULL CHECK (role IN ('user', 'assistant')),
  content    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.chat_logs IS 'Short-Term RAM — rolling conversation window per persona.';

-- ═══════════════════════════════════════════════════════
-- MEMORY NODES (Long-Term Archive)
-- ═══════════════════════════════════════════════════════
CREATE TABLE public.memory_nodes (
  id         uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  persona_id uuid NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.memory_nodes IS 'Long-Term Archive — durable compressed memories extracted from chat_logs.';

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════
ALTER TABLE public.chat_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_nodes ENABLE ROW LEVEL SECURITY;

-- ── Policies: chat_logs ────────────────────────────────
CREATE POLICY "Users can view their own chat logs"
  ON public.chat_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat logs"
  ON public.chat_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat logs"
  ON public.chat_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat logs"
  ON public.chat_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- ── Policies: memory_nodes ─────────────────────────────
CREATE POLICY "Users can view their own memory nodes"
  ON public.memory_nodes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memory nodes"
  ON public.memory_nodes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory nodes"
  ON public.memory_nodes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory nodes"
  ON public.memory_nodes
  FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════
CREATE INDEX idx_chat_logs_persona_id    ON public.chat_logs(persona_id);
CREATE INDEX idx_chat_logs_user_id       ON public.chat_logs(user_id);
CREATE INDEX idx_chat_logs_created_at    ON public.chat_logs(created_at DESC);
CREATE INDEX idx_memory_nodes_persona_id ON public.memory_nodes(persona_id);
CREATE INDEX idx_memory_nodes_user_id    ON public.memory_nodes(user_id);
CREATE INDEX idx_personas_status         ON public.personas(status);
