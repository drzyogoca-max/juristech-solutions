/**
 * src/config/tiers.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Editable Pricing Tiers Configuration
 * Reads Paddle Price IDs from environment variables.
 */

export interface Tier {
  name: 'Starter' | 'Pro' | 'Advanced';
  description: string;
  features: string[];
  priceId: { month: string; year: string };
  badge?: string;
  highlight?: boolean;
}

export const PRICING_TIERS: Tier[] = [
  {
    name: 'Starter',
    description: 'Essential legal AI tools for founders, freelancers, and small practices.',
    features: [
      'Up to 10 contracts / month',
      'Standard AI Legal Assistant',
      'Multi-format PDF & Word Export',
      'Basic Document Inspection',
      'Direct Email Support',
    ],
    priceId: {
      month: import.meta.env.VITE_PADDLE_STARTER_PRICE_ID_MONTH || 'pri_01m0ty6sxjj7w0xpm1r07r50ss',
      year: import.meta.env.VITE_PADDLE_STARTER_PRICE_ID_YEAR || 'pri_01m0ty6sxjj7w0xpm1r07r50ss',
    },
  },
  {
    name: 'Pro',
    description: 'Full sovereign legal AI suite for growing companies and legal teams.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited contract analysis & Generation',
      'Advanced Risk Guard & Stylometric Inspection',
      'M&A & Cross-Border RAG Legal Assistant',
      'Automated E-Signatures & PDF Engine',
      'Priority 15-min SLA Support',
      'Full API Access & Webhook Integrations',
    ],
    priceId: {
      month: import.meta.env.VITE_PADDLE_PRO_PRICE_ID_MONTH || 'pri_01m0ty6sxjj7w0xpm1r07r50ss',
      year: import.meta.env.VITE_PADDLE_PRO_PRICE_ID_YEAR || 'pri_01m0ty6sxjj7w0xpm1r07r50ss',
    },
  },
  {
    name: 'Advanced',
    description: 'Enterprise sovereignty, custom RAG models, and dedicated legal SLA.',
    features: [
      'Everything in Pro included',
      'Custom Sovereignty & Private On-Premise Cloud',
      'Dedicated Autonomous Legal AI Agents',
      'Regulatory Radar & Real-Time Monitor',
      '24/7 Dedicated Legal Operations Specialist',
      'Custom Contract Templates & Governance Policy',
    ],
    priceId: {
      month: import.meta.env.VITE_PADDLE_ADVANCED_PRICE_ID_MONTH || 'pri_01m0ty6sxjj7w0xpm1r07r50ss',
      year: import.meta.env.VITE_PADDLE_ADVANCED_PRICE_ID_YEAR || 'pri_01m0ty6sxjj7w0xpm1r07r50ss',
    },
  },
];
