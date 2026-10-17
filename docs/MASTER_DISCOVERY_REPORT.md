# JurisTech Solutions — Master Discovery & Technical Baseline Report (`MASTER_DISCOVERY_REPORT.md`)

**Target Production Domain**: [https://www.juristech.solutions](https://www.juristech.solutions)  
**Baseline Date**: October 17, 2026  
**Auditor**: Senior Software Engineer & Technical Auditor (Discovery Baseline Phase)  
**Status**: Step A Discovery Complete — Awaiting Step B Owner Sign-off  

---

## 1. Executive Discovery Summary (10-Line Master Summary)

1. **Framework & Architecture**: React 18 SPA bundled via Vite 5 with TypeScript 5, Tailwind CSS, Supabase backend, and Vercel serverless edge functions.
2. **Page Rendering & Head Strategy**: Single-Page Application with client-side routing (`react-router-dom` v6), dynamic document head via `react-helmet-async`, and unified pre-rendered static HTML shell in `index.html`.
3. **Internationalization & Typography**: Reactively unified under `usePlatformLocale()` across 7 locales (`/ar`, `/en`, `/fr`, `/de`, `/es`, `/tr`, `/zh`) with dynamic bidirectional rendering (`dir="rtl"` / `dir="ltr"`).
4. **Service Inventory (Zero Deletions)**: 23 public/client operational services + 35 enterprise administrative command centers accounted for and preserved.
5. **AI Providers & Live Models**: Google Gemini `gemini-2.0-flash` is the live reasoning engine for contract RAG, assisted by OpenAI `gpt-4o-mini` for social crons, with zero customer contract retention.
6. **Commercial Configuration (Strictly Protected)**: Gumroad Merchant of Record checkout permanently locked at $49/mo (Starter), $139/mo (Professional), $349/mo (Enterprise), and $990 (DealRoom) with SWIFT direct wire verification.
7. **Production Health & Baseline**: Live HTTP probe of all 11 core production endpoints yielded HTTP 200 with zero outages; `tsc --noEmit` baseline verification compiled with zero errors.
8. **Automated Media & Studio Quality**: Broadcast-grade 9:16 Shorts rendered with photorealistic avatars (`public/avatars/`) and natural neural audio (`ar-SA-HamedNeural`, `en-US-ChristopherNeural`) with zero synthetic artifacts.
9. **Pending Owner Disclosures**: Formal legal entity registration, CR number, physical address, and YouTube OAuth production verification are isolated behind `{{TODO_OWNER: ...}}` tags.
10. **Remediation Roadmap**: Step C repairs will proceed sequentially through Phases 1–11 (legal disclaimers, route gating, information architecture, SEO, performance, and international conversion) without altering payment logic or removing services.

---

## 2. Technical Stack & Build System Analysis

### 2.1 Framework & Core Dependencies
- **Frontend Core**: React 18.3.1, React DOM 18.3.1, TypeScript 5.5.3.
- **Build Tool**: Vite 5.4.2 with `@vitejs/plugin-react`.
- **CSS Engine**: Tailwind CSS 3.4.10 with custom royal gold & deep navy design system (`#020B1A`, `#0D1F3C`, `#D4AF37`, `#10B981`).
- **Icons & Motion**: Lucide React 0.344.0, Framer Motion 11.0.8.
- **Database & Auth**: Supabase JS Client 2.39.7 (PostgreSQL with Row-Level Security).
- **Deployment Platform**: Vercel Serverless & Edge Network with automated GitHub CI/CD integration (`origin/main`).

### 2.2 Document Head, Metadata & Internationalization
- **Document Head**: Managed dynamically through `react-helmet-async` in `src/App.tsx` and individual pages, paired with comprehensive Open Graph, Twitter Cards, schema.org JSON-LD structured data (`SoftwareApplication`, `LegalService`), and localized hreflang tags in `index.html`.
- **Internationalization Engine**: Single-source-of-truth translation dictionary in `src/lib/universalTranslator.ts` driven by `usePlatformLocale()`. All page headings, buttons, alerts, and navigation links switch reactively on language toggle without page reloads or residual Arabic strings in English mode.
- **Supported Locales**:
  - `ar`: Arabic (Primary, RTL, Cairo/Amiri typography)
  - `en`: English (Global LTR, Inter typography)
  - `fr`: French (European & North African LTR)
  - `de`: German (DACH region LTR)
  - `es`: Spanish (Ibero-American LTR)
  - `tr`: Turkish (Regional LTR)
  - `zh`: Chinese (Simplified LTR)

### 2.3 Key Shared Layout Components
- **Global Header**: `src/components/Navbar.tsx` (Locale selector, currency indicator, service mega-menu, authentication portal, mobile drawer).
- **Global Footer**: `src/components/Footer.tsx` (Service directory, legal links, localized copyright, jurisdiction notice).
- **Banners & Guards**:
  - `LegalDisclaimerBanner.tsx`: Top warning regarding AI assistance vs. licensed legal counsel.
  - `StepWorkflowBanner.tsx`: Visual workflow step progression for `/contracts`, `/risk`, `/negotiation`.
  - `GdprPrivacyBanner.tsx`: Cookie consent and data sovereignty acknowledgment.
  - `ProtectedAdminRoute.tsx`: Cryptographic role-based guard for Chairman/Admin command centers.

---

## 3. Route & Service Inventory Summary

A comprehensive line-by-line audit is maintained in `/docs/SERVICE_INVENTORY.md`.

- **Total Operational Routes**: 58 distinct route targets across 8 locale prefixes (464 router evaluations).
- **Public & Operational Services**: 23 suites:
  - Commercial Contract Studio (`/contracts`)
  - Legal Risk Radar (`/risk`)
  - Power of Attorney Library (`/poa-library`)
  - Smart Contract Templates (`/templates`)
  - Negotiation & E-Signature Room (`/negotiation`)
  - Inspection & Forensic Room (`/investigate`)
  - Deal Shield 360 (`/deal-shield`)
  - Corporate Structuring & Formation (`/corporate-structuring`)
  - Corporate Acquisition & M&A (`/acquisition`)
  - Encrypted Document Vault (`/vault`)
  - 24/7 AI Legal Advisor (`/chat`, `/ai-advisor`)
  - Enterprise Legal Audit (`/enterprise-audit`)
  - Central Repository (`/repository`)
  - B2B Proposals Engine (`/b2b-proposals`)
  - Trust Portal (`/trust`)
  - Video Hub (`/video-hub`)
  - Sponsors & Monetization (`/sponsors-ads`)
  - Platform Reports (`/reports`)
  - Sovereign AI Hub (`/sovereign-ai-hub`)
  - Regulatory Framework (`/legal-compliance`)
  - Subscriptions & Payments (`/payment`, `/payment/verify`, `/billing`)
  - Customer Service Desk (`/support`)
  - Corporate Disclosures (`/about`, `/privacy`, `/terms`, `/refund`)
- **Protected Admin & Enterprise Centers**: 35 specialized command centers under `/admin/*`, `/lead-radar`, and `/youtube-studio`.

---

## 4. Protected Commercial Architecture & Payment Invariants

Under **Non-Negotiable Rule #2 (Protect payments, prices, and commercial configuration)**:
- **Merchant of Record**: Gumroad API & checkout overlays.
- **Active Webhook Route**: `POST /api/webhooks?provider=gumroad`
- **Protected Product Identifiers & Price Points**:
  - `starter`: **$49 / mo** (Permalink: `https://juristech.gumroad.com/l/nydsh`)
  - `professional`: **$139 / mo** (Permalink: `https://juristech.gumroad.com/l/ekrrs`)
  - `enterprise`: **$349 / mo** (Permalink: `https://juristech.gumroad.com/l/sqzed`)
  - `dealroom`: **$990 one-time** (Permalink: `https://juristech.gumroad.com/l/dealroom`)
- **Direct Wire Option**: Bank SWIFT wire transfer with proof-of-payment upload (`/payment/verify`) and administrative review dashboard (`/admin/receipt-review`).
- **Safety Invariant**: Zero modifications permitted to payment webhooks, prices, or checkout URLs.

---

## 5. Live AI Models & Media Pipeline

### 5.1 AI Models
- **Google Cloud / Google Gemini API**: Model `gemini-2.0-flash` invoked across `api/chat.js`, `api/ai.js`, `server/ai/cross-border-rag.js`, `server/ai/leviathan-core.js`, `server/contracts/generate-engine.js`, and `server/forensic/inspector-engine.js`. Zero retention policy for customer contract text.
- **OpenAI API**: Model `gpt-4o-mini` invoked solely in background serverless crons (`api/cron/youtube-morning.js`, `api/cron/youtube-evening.js`) for script drafting.

### 5.2 Studio Media & Avatars
- **Photorealistic Presenters**: Located in `public/avatars/`:
  - `avatar-gulf-ceo.png`: Gulf Managing Director in formal national attire.
  - `avatar-gulf-counsel.png`: GCC General Counsel in business attire.
  - `avatar-global-ceo.png`: International Chief Executive.
  - `avatar-global-counsel.png`: Global Corporate Legal Director.
- **Audio Synthesis**: High-definition neural audio via Microsoft Edge Neural TTS / ElevenLabs (`ar-SA-HamedNeural`, `en-US-ChristopherNeural`).
- **Rendered Output**:
  - `public/videos/contract-risk-radar-short-ar.mp4` (52.85s, 1.30 MB)
  - `public/videos/contract-risk-radar-short.mp4` (52.69s, 1.34 MB)

---

## 6. Baseline Verification & Performance Telemetry

Recorded in `/docs/perf/baseline.json`:
- **TypeScript Static Compilation**: `node ./node_modules/typescript/bin/tsc --noEmit` completed with **Exit Code 0** (Zero syntax or type errors across the entire codebase).
- **Live HTTP Telemetry**:
  - `https://www.juristech.solutions/`: **HTTP 200** (34.3 KB)
  - `https://www.juristech.solutions/risk`: **HTTP 200** (29.2 KB)
  - `https://www.juristech.solutions/contracts`: **HTTP 200** (29.5 KB)
  - `https://www.juristech.solutions/chat`: **HTTP 200** (29.2 KB)
  - `https://www.juristech.solutions/payment`: **HTTP 200** (35.0 KB)
  - `https://www.juristech.solutions/about`: **HTTP 200** (28.4 KB)
  - `https://www.juristech.solutions/privacy`: **HTTP 200** (31.8 KB)
  - `https://www.juristech.solutions/terms`: **HTTP 200** (31.4 KB)
  - `https://www.juristech.solutions/refund`: **HTTP 200** (28.2 KB)
  - `https://www.juristech.solutions/sitemap.xml`: **HTTP 200** (6.2 KB)
  - `https://www.juristech.solutions/robots.txt`: **HTTP 200** (1.6 KB)

---

## 7. Master Plan Remediation Roadmap (Step C Post-Approval)

Following formal owner review and sign-off, implementation will execute in atomic, reversible commits:

1. **Phase 1 — Legal Transparency & Trust**:
   - Universal `LegalDisclaimerBanner` component standardized across `/chat`, `/contracts`, and global footer.
   - Substantive draft privacy and terms policies clearly watermarked `DRAFT — REQUIRES REVIEW BY A LICENSED LAWYER`.
   - Comprehensive claims audit (replacing unverified superlatives with qualified descriptions).
2. **Phase 2 — Route Access & Authorization**:
   - Verification of `ProtectedAdminRoute` across all 35 admin suites.
   - Comprehensive test suite for public vs. authenticated route gating.
3. **Phase 3 — Information Architecture & Usability**:
   - Structured service navigation mega-menu and breadcrumbs without hiding or removing any of the 23 services.
4. **Phase 4–6 — Performance & Core Web Vitals**:
   - Sub-second asset delivery, font swap optimizations, bundle code-splitting refinement.
5. **Phase 7–11 — International SEO & AI Search Visibility**:
   - LLM search integration (`llms.txt`, `llms-full.txt`), JSON-LD schema expansion, automated YouTube OAuth production refresh guidance.
