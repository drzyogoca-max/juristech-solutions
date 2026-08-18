-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION: 20260814_make_payments_public.sql
-- Allow public select and insert for payments and payment receipts
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Payments: allow public select and inserts (bypass RLS for guest payments)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts on payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public select on payments" ON public.payments;

CREATE POLICY "Allow public select on payments" 
  ON public.payments FOR SELECT 
  USING (true);

CREATE POLICY "Allow public inserts on payments" 
  ON public.payments FOR INSERT 
  WITH CHECK (true);


-- 2. Payment Receipts: allow public select and inserts (prevent RLS block on receipt upload)
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own receipts" ON public.payment_receipts;
DROP POLICY IF EXISTS "Users can insert own receipts" ON public.payment_receipts;
DROP POLICY IF EXISTS "Allow public select on payment_receipts" ON public.payment_receipts;
DROP POLICY IF EXISTS "Allow public inserts on payment_receipts" ON public.payment_receipts;

CREATE POLICY "Allow public select on payment_receipts" 
  ON public.payment_receipts FOR SELECT 
  USING (true);

CREATE POLICY "Allow public inserts on payment_receipts" 
  ON public.payment_receipts FOR INSERT 
  WITH CHECK (true);

-- 3. Make user_id nullable in payment_receipts to support guest payments
ALTER TABLE IF EXISTS public.payment_receipts ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE IF EXISTS public.admin_review_queue ALTER COLUMN user_id DROP NOT NULL;

-- 4. Create Vault Documents table if not exists and disable RLS to prevent blocks
CREATE TABLE IF NOT EXISTS public.vault_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    doc_type VARCHAR(100) NOT NULL,
    content_preview TEXT,
    content_encrypted TEXT,
    size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE IF EXISTS public.vault_documents DISABLE ROW LEVEL SECURITY;

-- 5. Create visitor_logs table to store synced visitors analytics data across browsers
CREATE TABLE IF NOT EXISTS public.visitor_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    country_code VARCHAR(10),
    city VARCHAR(255),
    region VARCHAR(255),
    ip VARCHAR(100),
    isp VARCHAR(255),
    page_path VARCHAR(255) NOT NULL,
    traffic_source VARCHAR(100),
    referrer_domain VARCHAR(255),
    device_type VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    utm_source VARCHAR(255),
    utm_campaign VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE IF EXISTS public.visitor_logs DISABLE ROW LEVEL SECURITY;

-- 6. Create radar_leads table to store B2B leads data across browsers
CREATE TABLE IF NOT EXISTS public.radar_leads (
    id VARCHAR(255) PRIMARY KEY,
    ip VARCHAR(100),
    location VARCHAR(255),
    company_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    country VARCHAR(100),
    sector_interest TEXT,
    lead_score INTEGER DEFAULT 0,
    ai_score_tier VARCHAR(50) DEFAULT 'COLD',
    score_breakdown JSONB DEFAULT '{}'::jsonb,
    native_language VARCHAR(50) DEFAULT 'ar',
    status TEXT DEFAULT 'New',
    visited_pages TEXT[] DEFAULT '{}',
    last_active TEXT,
    auto_dispatched BOOLEAN DEFAULT FALSE,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    source VARCHAR(50) DEFAULT 'direct'
);

ALTER TABLE IF EXISTS public.radar_leads DISABLE ROW LEVEL SECURITY;



