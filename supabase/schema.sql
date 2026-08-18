-- SQL Schema for LegalShield AI Database Setup

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Contracts Table
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    party_a VARCHAR(255) NOT NULL,
    party_b VARCHAR(255) NOT NULL,
    contract_type VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for contracts
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads and inserts for demo/public usage (or authenticated only)
CREATE POLICY "Allow public inserts on contracts" ON public.contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on contracts" ON public.contracts FOR SELECT USING (true);


-- 2. Risk Assessments Table
CREATE TABLE IF NOT EXISTS public.risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    file_name VARCHAR(255),
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    missing_clauses TEXT[] NOT NULL DEFAULT '{}',
    recommendations TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for risk assessments
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads and inserts
CREATE POLICY "Allow public inserts on risk_assessments" ON public.risk_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on risk_assessments" ON public.risk_assessments FOR SELECT USING (true);


-- 3. Chat Messages Table (AI Requests)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID DEFAULT uuid_generate_v4(),
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for chat messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads and inserts
CREATE POLICY "Allow public inserts on chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on chat_messages" ON public.chat_messages FOR SELECT USING (true);


-- 4. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    paypal_order_id VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads and inserts
CREATE POLICY "Allow public inserts on payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on payments" ON public.payments FOR SELECT USING (true);
