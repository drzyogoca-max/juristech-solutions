-- JurisTech Solutions | 2026-10-08 Email Dispatch Log Schema & Security Hardening
-- Creates and locks down the email_dispatch_log table to protect against quota evasion and open relay.

CREATE TABLE IF NOT EXISTS public.email_dispatch_log (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient      TEXT NOT NULL,
  subject        TEXT,
  provider       TEXT,
  dispatched_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.email_dispatch_log ENABLE ROW LEVEL SECURITY;

-- Drop any previous permissive policies
DROP POLICY IF EXISTS "email_dispatch_log_service_role" ON public.email_dispatch_log;
DROP POLICY IF EXISTS "email_dispatch_log_anon_select" ON public.email_dispatch_log;

-- Strict access: only service_role can select/insert/modify
REVOKE ALL ON public.email_dispatch_log FROM anon, authenticated;
GRANT ALL ON public.email_dispatch_log TO service_role;

-- Performance index for daily quota checks
CREATE INDEX IF NOT EXISTS idx_email_dispatch_log_dispatched_at 
  ON public.email_dispatch_log (dispatched_at DESC);
