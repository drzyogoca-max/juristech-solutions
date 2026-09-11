-- ==============================================================================
-- Migration: 20260910_p1_b2b_acquisition_engine.sql
-- JurisTech Solutions | Autonomous B2B Customer Acquisition Engine Foundation
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1. PERMANENT SUPPRESSION LIST ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_suppression_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    reason TEXT NOT NULL, -- UNSUBSCRIBE, BOUNCE, SPAM_REPORT, DO_NOT_CONTACT, MANUAL
    source TEXT DEFAULT 'SYSTEM', -- USER_REQUEST, EMAIL_HEADER, BOUNCE_WEBHOOK, ADMIN
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_crm_suppression_email ON public.crm_suppression_list (email);

-- ─── 2. DAILY ACQUISITION REPORTS ARCHIVE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_acquisition_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id TEXT NOT NULL,
    execution_date DATE NOT NULL DEFAULT CURRENT_DATE,
    accounts_evaluated INTEGER DEFAULT 0,
    accounts_eligible INTEGER DEFAULT 0,
    accounts_dispatched INTEGER DEFAULT 0,
    accounts_suppressed INTEGER DEFAULT 0,
    accounts_bounced INTEGER DEFAULT 0,
    replies_detected INTEGER DEFAULT 0,
    opportunities_created INTEGER DEFAULT 0,
    status TEXT DEFAULT 'COMPLETED', -- COMPLETED / FAILED / DRY_RUN
    report_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_crm_acquisition_campaign ON public.crm_acquisition_reports (campaign_id);
CREATE INDEX IF NOT EXISTS idx_crm_acquisition_date ON public.crm_acquisition_reports (execution_date);

-- ─── 3. RLS HARDENING FOR SUPPRESSION & REPORTS ──────────────────────────────
ALTER TABLE public.crm_suppression_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_acquisition_reports ENABLE ROW LEVEL SECURITY;

-- Admins have full access to suppression list
CREATE POLICY "crm_suppression_admin_all" ON public.crm_suppression_list
    FOR ALL TO authenticated
    USING (
        (auth.jwt() ->> 'email') IN (
            'founder@juristech.solutions',
            'drzyogo.ca@gmail.com',
            'juristech.solutions@outlook.com',
            'admin@juristech.solutions'
        )
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
              AND profiles.role IN ('admin', 'super-admin')
        )
    );

-- Allow public / webhook opt-out insertion
CREATE POLICY "crm_suppression_public_insert" ON public.crm_suppression_list
    FOR INSERT TO authenticated, anon
    WITH CHECK (true);

-- Admins have full access to daily acquisition reports
CREATE POLICY "crm_acquisition_reports_admin_all" ON public.crm_acquisition_reports
    FOR ALL TO authenticated
    USING (
        (auth.jwt() ->> 'email') IN (
            'founder@juristech.solutions',
            'drzyogo.ca@gmail.com',
            'juristech.solutions@outlook.com',
            'admin@juristech.solutions'
        )
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
              AND profiles.role IN ('admin', 'super-admin')
        )
    );
