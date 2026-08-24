-- =============================================================================
-- JurisTech Solutions — Real Business & Revenue Database Schema v2026.1
-- Strict Production Model for Customers, Subscriptions, Payments & CRM Leads
-- =============================================================================

-- 1. Customers Table (Real Customers & Organizations)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    company_name TEXT,
    jurisdiction TEXT DEFAULT 'GLOBAL',
    country_code TEXT,
    source TEXT DEFAULT 'organic',
    verified BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Subscriptions Table (Active Paid & Recurring Subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'paddle', 'paytabs', 'paymob', 'stripe', 'manual_swift', 'binance_pay'
    provider_subscription_id TEXT,
    plan_tier TEXT NOT NULL, -- 'startup', 'sme', 'enterprise', 'custom'
    price_usd NUMERIC(10, 2) NOT NULL,
    billing_interval TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'past_due', 'paused'
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Payments Table (Individual Financial Charges)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    provider TEXT NOT NULL,
    provider_payment_id TEXT,
    amount_usd NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'completed', -- 'completed', 'pending', 'failed', 'refunded'
    payment_method TEXT, -- 'card', 'wire_swift', 'usdt'
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. Transactions Ledger (Auditable Double-Entry Ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    transaction_ref TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'subscription_charge', -- 'subscription_charge', 'one_off_audit', 'refund'
    amount_usd NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'success',
    sha256_hash TEXT,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Invoices Table (Official Digital Invoices)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL UNIQUE,
    amount_usd NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    pdf_url TEXT,
    status TEXT NOT NULL DEFAULT 'paid', -- 'draft', 'issued', 'paid', 'void'
    due_date TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    sha256_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Leads Pipeline (Real Inbound Customer Leads)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company_name TEXT,
    country TEXT,
    industry TEXT,
    role TEXT,
    lead_source TEXT NOT NULL DEFAULT 'website_inquiry', -- 'website_inquiry', 'demo_request', 'linkedin_outreach', 'youtube'
    status TEXT NOT NULL DEFAULT 'Lead', -- 'Visitor', 'Lead', 'Qualified', 'Demo_Requested', 'Proposal_Sent', 'Customer'
    score INTEGER DEFAULT 50,
    notes TEXT,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Enterprise Opportunities (High-Value Institutional Pipeline)
CREATE TABLE IF NOT EXISTS public.enterprise_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    country TEXT NOT NULL,
    estimated_annual_value_usd NUMERIC(12, 2) NOT NULL DEFAULT 5000.00,
    stage TEXT NOT NULL DEFAULT 'Prospect', -- 'Prospect', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'
    decision_maker_role TEXT,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 8. Analytics & Conversion Events (Funnel Tracking)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL, -- 'pricing_view', 'checkout_start', 'payment_success', 'demo_request'
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_path TEXT,
    referrer TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
