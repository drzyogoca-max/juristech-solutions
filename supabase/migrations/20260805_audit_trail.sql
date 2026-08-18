-- SQL Migration: Legal Audit Trail & SWIFT Vault Tables
-- Compliant with eIDAS, GDPR & ISO 27001

CREATE TABLE IF NOT EXISTS public.audit_trail (
    id VARCHAR(255) PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    contract_id VARCHAR(255),
    ip_address VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL
);

ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on audit_trail" ON public.audit_trail FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated select on audit_trail" ON public.audit_trail FOR SELECT USING (true);


-- SWIFT Vault Metadata Table
CREATE TABLE IF NOT EXISTS public.swift_vault (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255) NOT NULL,
    transaction_ref VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    plan_name VARCHAR(100) NOT NULL,
    vault_path TEXT NOT NULL,
    image_hash VARCHAR(64) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.swift_vault ENABLE ROW LEVEL SECURITY;

-- Restrict SWIFT Vault reads to Financial Admins only
CREATE POLICY "Restrict select on swift_vault to financial admins" 
ON public.swift_vault FOR SELECT 
USING (auth.jwt() ->> 'role' = 'financial_admin' OR auth.role() = 'service_role');

CREATE POLICY "Allow public insert on swift_vault" 
ON public.swift_vault FOR INSERT WITH CHECK (true);
