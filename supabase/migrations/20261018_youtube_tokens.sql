-- YouTube OAuth Tokens table for autonomous token renewal
CREATE TABLE IF NOT EXISTS public.youtube_tokens (
  id            TEXT PRIMARY KEY DEFAULT 'primary',
  refresh_token TEXT NOT NULL,
  access_token  TEXT,
  expires_at    TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.youtube_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON public.youtube_tokens FOR ALL USING (auth.role() = 'service_role');
