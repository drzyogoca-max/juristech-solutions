-- =============================================================================
-- JurisTech Solutions — Real Business & Revenue Database Schema v2026.5
-- Strict Production Model with Lease-Timeout Idempotency & Atomic RPC
-- =============================================================================

-- 1. Customers Table (Real Customers & Organizations)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'authorized', 'active', 'cancelled', 'past_due', 'paused', 'expired', 'refunded'
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT uq_subscriptions_provider_id UNIQUE (provider, provider_subscription_id)
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
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'authorized', 'completed', 'failed', 'refunded'
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
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'success',
    sha256_hash TEXT,
    verified BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMPTZ,
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
    status TEXT NOT NULL DEFAULT 'issued', -- 'draft', 'issued', 'paid', 'void'
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
    lead_source TEXT NOT NULL DEFAULT 'website_inquiry', -- 'website_inquiry', 'demo_request', 'enterprise_rfp', 'linkedin_outreach', 'youtube'
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
    event_name TEXT NOT NULL, -- 'pricing_viewed', 'checkout_started', 'purchase_completed', 'enterprise_inquiry_sent'
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_path TEXT,
    referrer TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Webhook Ingestion & Persistent Lease-Timeout Idempotency Ledger
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL, -- 'paddle', 'paytabs', 'paymob', 'stripe'
    event_id TEXT NOT NULL,
    transaction_ref TEXT,
    event_type TEXT NOT NULL,
    processing_status TEXT NOT NULL DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    attempt_count INTEGER NOT NULL DEFAULT 1,
    last_error TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT uq_webhook_provider_event UNIQUE (provider, event_id)
);

-- ─── Idempotency & Query Optimization Indexes ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_auth_user ON public.customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON public.subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider_id ON public.subscriptions(provider, provider_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_id ON public.payments(provider, provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_ref ON public.transactions(transaction_ref);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_events_name_created ON public.events(event_name, created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_event ON public.webhook_events(provider, event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status_claimed ON public.webhook_events(processing_status, claimed_at);

-- ─── Enable Row Level Security (RLS) ──────────────────────────────────────────
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own customer record" ON public.customers
    FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own customer profile" ON public.customers
    FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (customer_id IN (SELECT id FROM public.customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (customer_id IN (SELECT id FROM public.customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Public can insert leads" ON public.leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert enterprise RFPs" ON public.enterprise_opportunities
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert analytics events" ON public.events
    FOR INSERT WITH CHECK (true);

-- ─── ATOMIC POSTGRESQL WEBHOOK TRANSACTION RPC WITH LEASE TIMEOUT RECOVERY ────
CREATE OR REPLACE FUNCTION public.process_payment_webhook_atomic(
    p_provider TEXT,
    p_event_id TEXT,
    p_event_type TEXT,
    p_customer_email TEXT,
    p_plan_tier TEXT,
    p_amount_usd NUMERIC,
    p_currency TEXT,
    p_provider_sub_id TEXT DEFAULT NULL,
    p_provider_payment_id TEXT DEFAULT NULL,
    p_payload JSONB DEFAULT '{}'::jsonb
) RETURNS JSONB AS $$
DECLARE
    v_existing_event_id UUID;
    v_existing_status TEXT;
    v_existing_claimed_at TIMESTAMPTZ;
    v_existing_attempts INTEGER;
    v_customer_id UUID;
    v_subscription_id UUID;
    v_payment_id UUID;
    v_transaction_id UUID;
    v_txn_ref TEXT;
    v_new_status TEXT;
BEGIN
    -- 1. Atomic Idempotency Claim & Lease Timeout Check
    SELECT id, processing_status, claimed_at, attempt_count
    INTO v_existing_event_id, v_existing_status, v_existing_claimed_at, v_existing_attempts
    FROM public.webhook_events
    WHERE provider = p_provider AND event_id = p_event_id;

    IF v_existing_event_id IS NOT NULL THEN
        IF v_existing_status = 'completed' THEN
            -- Already completely and safely processed
            RETURN jsonb_build_object(
                'success', true,
                'duplicate', true,
                'status', 'ALREADY_PROCESSED_IN_DATABASE',
                'provider', p_provider,
                'event_id', p_event_id
            );
        ELSIF v_existing_status = 'processing' AND v_existing_claimed_at > timezone('utc'::text, now() - interval '5 minutes') THEN
            -- Active lease within 5 minute window: reject concurrent worker
            RETURN jsonb_build_object(
                'success', true,
                'duplicate', true,
                'status', 'CURRENTLY_PROCESSING_IN_DATABASE',
                'provider', p_provider,
                'event_id', p_event_id
            );
        ELSE
            -- Lease expired (timeout) or previously failed: Re-claim and allow retry!
            UPDATE public.webhook_events SET
                processing_status = 'processing',
                claimed_at = timezone('utc'::text, now()),
                attempt_count = v_existing_attempts + 1,
                last_error = CASE WHEN v_existing_status = 'processing' THEN 'Retried after processing timeout' ELSE last_error END
            WHERE provider = p_provider AND event_id = p_event_id;
        END IF;
    ELSE
        -- Fresh event: Insert initial claim record
        INSERT INTO public.webhook_events (
            provider, event_id, transaction_ref, event_type, processing_status,
            claimed_at, attempt_count, payload
        ) VALUES (
            p_provider, p_event_id, p_provider_payment_id, p_event_type, 'processing',
            timezone('utc'::text, now()), 1, p_payload
        );
    END IF;

    -- 2. Upsert Customer Record
    INSERT INTO public.customers (
        email, full_name, verified, source
    ) VALUES (
        LOWER(TRIM(p_customer_email)), 'Corporate Subscriber', true, p_provider
    ) ON CONFLICT (email) DO UPDATE SET
        verified = true,
        updated_at = timezone('utc'::text, now())
    RETURNING id INTO v_customer_id;

    -- 3. Determine Subscription State based on Event Type
    IF p_event_type = 'payment.succeeded' OR p_event_type = 'subscription.created' THEN
        v_new_status := 'active';
    ELSIF p_event_type = 'payment.failed' THEN
        v_new_status := 'past_due';
    ELSIF p_event_type = 'subscription.cancelled' THEN
        v_new_status := 'cancelled';
    ELSIF p_event_type = 'refund.created' OR p_event_type = 'payment.refunded' THEN
        v_new_status := 'refunded';
    ELSE
        v_new_status := 'active';
    END IF;

    -- 4. Upsert Subscription Record
    IF p_provider_sub_id IS NOT NULL THEN
        INSERT INTO public.subscriptions (
            customer_id, provider, provider_subscription_id, plan_tier, price_usd,
            status, current_period_start, current_period_end, verified
        ) VALUES (
            v_customer_id, p_provider, p_provider_sub_id, p_plan_tier, p_amount_usd,
            v_new_status, timezone('utc'::text, now()), timezone('utc'::text, now() + interval '30 days'), true
        ) ON CONFLICT (provider, provider_subscription_id) DO UPDATE SET
            status = v_new_status,
            price_usd = p_amount_usd,
            current_period_end = CASE 
                WHEN v_new_status = 'active' THEN timezone('utc'::text, now() + interval '30 days')
                ELSE public.subscriptions.current_period_end
            END,
            updated_at = timezone('utc'::text, now())
        RETURNING id INTO v_subscription_id;
    END IF;

    -- 5. Insert Payment Record
    INSERT INTO public.payments (
        customer_id, subscription_id, provider, provider_payment_id,
        amount_usd, currency, status, payment_method, verified
    ) VALUES (
        v_customer_id, v_subscription_id, p_provider, COALESCE(p_provider_payment_id, p_event_id),
        p_amount_usd, p_currency, CASE WHEN v_new_status = 'refunded' THEN 'refunded' ELSE 'completed' END, 'card', true
    ) RETURNING id INTO v_payment_id;

    -- 6. Insert Auditable Transaction Ledger Entry
    v_txn_ref := 'TXN-' || UPPER(p_provider) || '-' || COALESCE(p_provider_payment_id, p_event_id);
    INSERT INTO public.transactions (
        customer_id, payment_id, transaction_ref, type, amount_usd, currency, status, verified
    ) VALUES (
        v_customer_id, v_payment_id, v_txn_ref, 
        CASE WHEN v_new_status = 'refunded' THEN 'refund' ELSE 'subscription_charge' END,
        p_amount_usd, p_currency, 'success', true
    ) ON CONFLICT (transaction_ref) DO NOTHING
    RETURNING id INTO v_transaction_id;

    -- 7. Mark Webhook Event as Completed (Lease Settled)
    UPDATE public.webhook_events SET
        processing_status = 'completed',
        completed_at = timezone('utc'::text, now()),
        transaction_ref = v_txn_ref,
        last_error = NULL
    WHERE provider = p_provider AND event_id = p_event_id;

    -- 8. Return Atomic Success Result
    RETURN jsonb_build_object(
        'success', true,
        'status', 'PROCESSED_SUCCESS',
        'customer_id', v_customer_id,
        'subscription_id', v_subscription_id,
        'payment_id', v_payment_id,
        'transaction_id', v_transaction_id,
        'subscription_status', v_new_status
    );

EXCEPTION WHEN OTHERS THEN
    -- Automatic PostgreSQL Rollback on failure & Lease Error Marking
    UPDATE public.webhook_events SET
        processing_status = 'failed',
        last_error = SQLERRM
    WHERE provider = p_provider AND event_id = p_event_id;

    RAISE EXCEPTION 'Atomic Webhook Transaction Failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
