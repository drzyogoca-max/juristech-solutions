-- ════════════════════════════════════════════════════════════════════════════
-- LegalShield Solution — Receipt Verification & Fraud Prevention Tables
-- Migration: 0010_receipt_verification.sql
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Payment Receipts Table ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.payment_receipts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- User-claimed fields
  transaction_ref   TEXT NOT NULL,
  claimed_amount    NUMERIC(12, 2) NOT NULL,
  claimed_date      DATE NOT NULL,
  plan_id           TEXT NOT NULL DEFAULT 'premium',
  plan_name         TEXT NOT NULL DEFAULT 'Premium Plan',
  
  -- OCR-extracted fields
  ocr_ref           TEXT,
  ocr_amount        NUMERIC(12, 2),
  ocr_date          DATE,
  ocr_confidence    SMALLINT DEFAULT 0,    -- 0–100
  ocr_raw_text      TEXT,
  
  -- Fraud detection
  image_hash        TEXT NOT NULL,         -- SHA-256 fingerprint
  fraud_score       SMALLINT DEFAULT 0,   -- 0–100 (100 = clean)
  fraud_flags       TEXT[] DEFAULT '{}',
  
  -- Status & lifecycle
  status            TEXT NOT NULL DEFAULT 'pending'  -- pending | verified | flagged | rejected
                    CHECK (status IN ('pending', 'verified', 'flagged', 'rejected')),
  auto_activated    BOOLEAN DEFAULT FALSE,
  
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint on transaction_ref to enforce global uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_receipts_ref
  ON public.payment_receipts (UPPER(transaction_ref))
  WHERE status != 'rejected';

-- Index on image_hash for fast duplicate image detection
CREATE INDEX IF NOT EXISTS idx_payment_receipts_hash
  ON public.payment_receipts (image_hash)
  WHERE status != 'rejected';

-- Index on user_id for per-user queries
CREATE INDEX IF NOT EXISTS idx_payment_receipts_user
  ON public.payment_receipts (user_id, created_at DESC);

-- ── 2. Admin Review Queue Table ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.admin_review_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id      UUID NOT NULL REFERENCES public.payment_receipts(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  reason          TEXT NOT NULL,          -- Comma-separated fraud flags
  fraud_score     SMALLINT DEFAULT 0,
  
  status          TEXT NOT NULL DEFAULT 'pending_review'
                  CHECK (status IN ('pending_review', 'approved', 'rejected')),
  
  reviewed_by     UUID REFERENCES auth.users(id),
  reviewed_at     TIMESTAMPTZ,
  admin_notes     TEXT,
  
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_review_queue_status
  ON public.admin_review_queue (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_review_queue_receipt
  ON public.admin_review_queue (receipt_id);

-- ── 3. Subscriptions Table (if not already exists) ───────────────────────────

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id         TEXT NOT NULL,
  plan_name       TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  receipt_id      UUID REFERENCES public.payment_receipts(id),
  activated_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Row Level Security ────────────────────────────────────────────────────

-- payment_receipts: users can read/insert their own rows
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own receipts" ON public.payment_receipts;
CREATE POLICY "Users can view own receipts"
  ON public.payment_receipts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own receipts" ON public.payment_receipts;
CREATE POLICY "Users can insert own receipts"
  ON public.payment_receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins: full access via service role (bypass RLS)

-- admin_review_queue: only admins can SELECT (via service role)
ALTER TABLE public.admin_review_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access admin_review_queue" ON public.admin_review_queue;
CREATE POLICY "Service role full access admin_review_queue"
  ON public.admin_review_queue
  USING (auth.role() = 'service_role');

-- subscriptions: users can read their own subscription
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own subscription" ON public.subscriptions;
CREATE POLICY "Users can upsert own subscription"
  ON public.subscriptions FOR ALL
  USING (auth.uid() = user_id);

-- ── 5. Auto-updated_at trigger ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_payment_receipts_updated_at ON public.payment_receipts;
CREATE TRIGGER set_payment_receipts_updated_at
  BEFORE UPDATE ON public.payment_receipts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
