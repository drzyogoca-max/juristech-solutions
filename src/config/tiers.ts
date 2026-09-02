/**
 * src/config/tiers.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Editable Pricing Tiers Configuration
 * Reads Paddle Price IDs from environment variables.
 */

export interface Tier {
  name: 'Pro';
  title: string;
  description: string;
  features: string[];
  priceId: { month: string; year: string };
  badge?: string;
  highlight?: boolean;
}

export const PRICING_TIERS: Tier[] = [
  {
    name: 'Pro',
    title: 'JurisTech Pro Sovereign Plan',
    description: 'Full sovereign legal AI suite for growing companies, law practices, and legal operations teams.',
    highlight: true,
    badge: 'Official Active SaaS Offer',
    features: [
      'Unlimited contract analysis & autonomous generation',
      'Advanced Risk Guard & Stylometric Inspection',
      'M&A & Cross-Border RAG Legal Assistant',
      'Automated E-Signatures & PDF Engine',
      'Priority 15-min SLA Support',
      'Full API Access & Server-side Webhook Integrations',
    ],
    priceId: {
      month: import.meta.env.VITE_PADDLE_PRO_PRICE_ID_MONTH || 'pri_01m1hrzf3gsc22yvse2yhf70ya',
      year: import.meta.env.VITE_PADDLE_PRO_PRICE_ID_YEAR || 'pri_01m1hs9fc5xt8vch12cd0r5xxv',
    },
  },
];
