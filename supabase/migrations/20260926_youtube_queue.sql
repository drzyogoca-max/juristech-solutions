-- YouTube video publishing queue
CREATE TABLE IF NOT EXISTS public.youtube_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_for   TIMESTAMPTZ NOT NULL,
  slot            TEXT NOT NULL CHECK (slot IN ('MORNING', 'EVENING')),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'ready', 'uploading', 'published', 'failed')),
  heygen_video_id TEXT,
  youtube_video_id TEXT,
  title_ar        TEXT,
  title_en        TEXT,
  description_ar  TEXT,
  description_en  TEXT,
  tags            JSONB DEFAULT '[]',
  topic_ar        TEXT,
  topic_en        TEXT,
  format          TEXT,
  duration_seconds INTEGER,
  error_message   TEXT,
  published_at    TIMESTAMPTZ,
  video_url       TEXT
);
ALTER TABLE public.youtube_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON public.youtube_queue FOR ALL USING (auth.role() = 'service_role');
CREATE INDEX idx_youtube_queue_status ON public.youtube_queue(status);
CREATE INDEX idx_youtube_queue_heygen_id ON public.youtube_queue(heygen_video_id);
