-- JurisTech Solutions — Visitor Logs Table
-- Ensures visitor tracking is properly set up in Supabase

CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_id      TEXT NOT NULL,
  page_path       TEXT NOT NULL DEFAULT '/',
  referrer        TEXT,
  country         TEXT,
  city            TEXT,
  region          TEXT,
  device_type     TEXT DEFAULT 'Desktop',
  browser         TEXT,
  os              TEXT,
  screen_res      TEXT,
  is_admin        BOOLEAN NOT NULL DEFAULT false,
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  dwell_time_sec  INTEGER,
  user_agent      TEXT,
  ip_hash         TEXT  -- SHA256 hash of IP for dedup, never raw IP
);

-- Ensure columns exist if table was previously created with a legacy schema
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS screen_res TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS dwell_time_sec INTEGER;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS ip_hash TEXT;

-- Backfill session_id from visitor_id if visitor_id existed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'visitor_logs' AND column_name = 'visitor_id'
  ) THEN
    UPDATE public.visitor_logs SET session_id = visitor_id WHERE session_id IS NULL;
  END IF;
END $$;

-- Indexes for fast analytics queries
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON public.visitor_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session    ON public.visitor_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_country    ON public.visitor_logs(country);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_is_admin   ON public.visitor_logs(is_admin);

-- Enable Row Level Security
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for API writes)
DROP POLICY IF EXISTS "service_role_all" ON public.visitor_logs;
CREATE POLICY "service_role_all" ON public.visitor_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Allow anon INSERT (for visitor tracking from browser)
DROP POLICY IF EXISTS "anon_insert_visitor_logs" ON public.visitor_logs;
CREATE POLICY "anon_insert_visitor_logs" ON public.visitor_logs
  FOR INSERT WITH CHECK (true);

-- Allow anon SELECT only for non-sensitive columns via a view
DROP VIEW IF EXISTS public.public_visitor_stats;
CREATE VIEW public.public_visitor_stats AS
  SELECT
    DATE(created_at) AS visit_date,
    country,
    city,
    device_type,
    COUNT(*) AS page_views,
    COUNT(DISTINCT session_id) AS unique_sessions
  FROM public.visitor_logs
  WHERE is_admin = false
  GROUP BY 1, 2, 3, 4;
