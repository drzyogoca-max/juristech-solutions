-- ==============================================================================
-- Migration: 20260909_p1_centralized_crm_and_identity.sql
-- JurisTech Solutions | Production Forensic Remediation: P1 Identity & Centralized CRM
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 0. PROFILES TABLE (DEFENSIVE INITIALIZATION) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'client',
    full_name TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ─── 1. CENTRALIZED CRM LEADS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    company_name TEXT,
    client_name TEXT,
    contact_email TEXT UNIQUE NOT NULL,
    phone TEXT,
    jurisdiction TEXT DEFAULT 'GLOBAL',
    status TEXT DEFAULT 'LEAD', -- Canonical: ANONYMOUS / LEAD / REGISTERED_USER / TRIAL_USER / ACTIVE_CUSTOMER / PAST_DUE / CANCELLED / EXPIRED / ADMIN
    source_type TEXT DEFAULT 'REAL', -- REAL / SEED / SYNTHETIC
    verification_status TEXT DEFAULT 'UNVERIFIED', -- VERIFIED / UNVERIFIED / SEED
    estimated_value_usd NUMERIC DEFAULT 0,
    lead_score INTEGER DEFAULT 50,
    notes_ar TEXT,
    notes_en TEXT,
    last_activity_ar TEXT,
    last_activity_en TEXT,
    last_contact_date TIMESTAMPTZ,
    dispatched_at TIMESTAMPTZ,
    auto_dispatch BOOLEAN DEFAULT FALSE,
    outreach_status TEXT DEFAULT 'DRAFT', -- DRAFT / APPROVED / SENT / FAILED
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Indexes for CRM Leads
CREATE INDEX IF NOT EXISTS idx_crm_leads_contact_email ON public.crm_leads (contact_email);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads (status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_user_id ON public.crm_leads (user_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_visitor_id ON public.crm_leads (visitor_id);

-- ─── 2. CRM AUDIT LOGS TABLE ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_type TEXT,
    trigger TEXT, -- MANUAL_DISPATCH / AUTO_DISPATCH / LEAD_INQUIRY / WEBHOOK
    action_type TEXT NOT NULL,
    status TEXT NOT NULL, -- SUCCESS / FAILED / QUEUED / SKIPPED
    error_message TEXT,
    message_id TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_crm_audit_logs_lead ON public.crm_audit_logs (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_audit_logs_email ON public.crm_audit_logs (recipient_email);

-- ─── 3. ENHANCE CUSTOMERS & SUBSCRIPTIONS WITH AUTH USER & VISITOR LINK ───────
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customers') THEN
        ALTER TABLE public.customers
            ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            ADD COLUMN IF NOT EXISTS visitor_id TEXT,
            ADD COLUMN IF NOT EXISTS customer_status TEXT DEFAULT 'LEAD';
        CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers (user_id);
        CREATE INDEX IF NOT EXISTS idx_customers_visitor_id ON public.customers (visitor_id);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') THEN
        ALTER TABLE public.subscriptions
            ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions (user_id);
    END IF;
END $$;

-- ─── 4. FIX RLS ON VISITOR LOGS (TELEMETRY) ──────────────────────────────────
ALTER TABLE IF EXISTS public.visitor_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "visitor_logs_admin_select" ON public.visitor_logs;
DROP POLICY IF EXISTS "visitor_logs_telemetry_insert" ON public.visitor_logs;

-- Allow telemetry logging from any visitor
CREATE POLICY "visitor_logs_telemetry_insert" ON public.visitor_logs
    FOR INSERT TO authenticated, anon
    WITH CHECK (true);

-- Allow Admin inspection via Email Whitelist, Profiles table, or App Metadata
CREATE POLICY "visitor_logs_admin_select" ON public.visitor_logs
    FOR SELECT TO authenticated
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

-- ─── 5. RLS FOR CRM LEADS & AUDIT LOGS ───────────────────────────────────────
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins have full access
CREATE POLICY "crm_leads_admin_all" ON public.crm_leads
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

-- Public / Anonymous can capture lead inquiries (Contact form / Demo booking)
CREATE POLICY "crm_leads_public_insert" ON public.crm_leads
    FOR INSERT TO authenticated, anon
    WITH CHECK (true);

-- Users can view their own lead record if associated
CREATE POLICY "crm_leads_user_select" ON public.crm_leads
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Admins can view audit logs
CREATE POLICY "crm_audit_logs_admin_all" ON public.crm_audit_logs
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
