-- 001_initial_schema.sql
-- Moms&Pops — Base schema with RLS and auto-provisioning trigger
-- Run this in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/lxwzvdmpwrxaxinlgfxa/sql/new

-- ═══════════════════════════════════════════════════════
-- EXTENSION
-- ═══════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════════

-- ── Profiles ──────────────────────────────────────────
CREATE TABLE public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text,
  full_name  text,
  avatar_url text,
  updated_at timestamptz DEFAULT now()
);

-- ── User Settings ─────────────────────────────────────
CREATE TABLE public.user_settings (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme            text    DEFAULT 'system',
  text_size        text    DEFAULT 'base',
  shader_strength  text    DEFAULT 'subtle',
  spontaneous_msgs boolean DEFAULT false,
  message_previews boolean DEFAULT true,
  dnd_enabled      boolean DEFAULT false,
  dnd_start        text    DEFAULT '22:00',
  dnd_end          text    DEFAULT '08:00',
  reminders        boolean DEFAULT false,
  updated_at       timestamptz DEFAULT now()
);

-- ── Personas ──────────────────────────────────────────
CREATE TABLE public.personas (
  id         uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  relation   text,
  tone       text,
  tier       text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas      ENABLE ROW LEVEL SECURITY;

-- ── Policies: profiles ────────────────────────────────
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ── Policies: user_settings ───────────────────────────
CREATE POLICY "Users can view their own settings"
  ON public.user_settings
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ── Policies: personas ────────────────────────────────
CREATE POLICY "Users can manage their own personas"
  ON public.personas
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════
-- AUTO-PROVISIONING TRIGGER
-- Creates a profile + settings row whenever a user signs up
-- ═══════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );

  INSERT INTO public.user_settings (id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════
CREATE INDEX idx_personas_user_id ON public.personas(user_id);
CREATE INDEX idx_personas_tier    ON public.personas(tier);
