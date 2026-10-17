# JurisTech Solutions — Service & Route Inventory (`SERVICE_INVENTORY.md`)

**Target Production Domain**: [https://www.juristech.solutions](https://www.juristech.solutions)  
**Verification Date**: October 17, 2026  
**Auditor**: Senior Software Engineer & Technical Auditor (Discovery Baseline Phase)  
**Architecture**: React 18 + TypeScript 5 + Vite 5 + Tailwind CSS + Supabase + Vercel Serverless

---

## 1. Executive Summary & Service Preservation Mandate

In accordance with **Non-Negotiable Rule #1 (Preserve every existing service)**:
- **Total Cataloged Operational Services**: 23 Public & Operational Service Suites + 35 Protected Enterprise & Admin Command Centers.
- **Service Deletions**: 0.
- **Service Migrations or Merges**: 0.
- Every service retains its dedicated URL, state context, localized views, and underlying operational engines.

---

## 2. Public & Client Operational Services Inventory

| # | Service Name | Dedicated Route | Component | Access Level | Description & Core Engines |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **Executive Dashboard & Landing** | `/` or `/dashboard` | `Dashboard.tsx` | Public | Real-time platform entry point, metric gauges, system highlights, and quick triage. |
| **02** | **AI Commercial Contract Drafting Studio** | `/contracts` | `ContractsPage.tsx` | Public / Registered | Interactive smart contract authoring, clause-by-clause drafting, auto-generation across 15+ jurisdictions. |
| **03** | **Legal Risk Radar & Vulnerability Audit** | `/risk` | `RiskPage.tsx` | Public / Registered | Automated clause scanner detecting unlimited liability, unilateral indemnities, jurisdiction mismatches, and severe risk scoring. |
| **04** | **Centralized Contracts Repository** | `/repository` | `ContractsRepositoryPage.tsx` | Registered | Version-controlled document storage, contract metadata filtering, status tags, and renewal alerts. |
| **05** | **Encrypted Document Vault** | `/vault` | `VaultPage.tsx` | Registered | AES-256 client-side encrypted storage for sensitive executive contracts and commercial agreements. |
| **06** | **Inspection Room & Forensic Investigation** | `/investigate` | `InvestigationPage.tsx` | Registered | Deep forensic inspection of suspicious terms, hidden penalty clauses, and forensic audit logging. |
| **07** | **Smart Contract Templates Library** | `/templates` | `TemplatesPage.tsx` | Public | 200+ curated and vetted commercial legal templates covering NDAs, SLAs, employment, franchising, and partnerships. |
| **08** | **Power of Attorney (POA) Library** | `/poa-library` | `POALibraryPage.tsx` | Public | GCC, MENA, and international Power of Attorney templates (general, commercial, litigation, real estate) with notarization guidance. |
| **09** | **Contract Negotiation Room & E-Sign** | `/negotiation` | `NegotiationPage.tsx` | Registered | Real-time clause markup, counter-proposal engine, structured audit trail, and cryptographic signature tracking. |
| **10** | **Enterprise Legal Compliance & Audit** | `/enterprise-audit` | `EnterpriseAuditPage.tsx` | Registered | Full enterprise compliance matrix review, ESG, GDPR, and cross-border regulatory audit generation. |
| **11** | **Deal Shield 360 & Due Diligence** | `/deal-shield` | `DealShieldPage.tsx` | Registered | Deal structure risk simulator, clash detection, deal-breaker analysis, and structured M&A transaction protection. |
| **12** | **Corporate Structuring & Company Formation** | `/corporate-structuring` | `CompanyFormationPage.tsx` | Public | End-to-end entity setup guides for UAE (DIFC, ADGM, Mainland), KSA (MISA, LLC), Egypt (GAFI), UK, and US Delaware. |
| **13** | **Corporate Acquisition & Takeovers** | `/acquisition` | `AcquisitionPage.tsx` | Registered | M&A due diligence checklist, share purchase agreement workflows, and acquisition risk assessment. |
| **14** | **B2B Proposal Generation Engine** | `/b2b-proposals` | `B2BProposalPage.tsx` | Registered | AI-driven enterprise proposal generator with custom scope of work, fee schedules, and localized terms. |
| **15** | **Trust Portal & Security Governance** | `/trust` | `TrustPortalPage.tsx` | Public | Real-time system health, security architecture breakdown, encryption specifications, and compliance telemetry. |
| **16** | **Video Hub & Executive Briefings** | `/video-hub` | `VideoHubPage.tsx` | Public | Executive video demonstrations, platform walkthroughs, and legal tech explainer streams. |
| **17** | **Sponsors & Monetization Network** | `/sponsors-ads` | `SponsorsAdsPage.tsx` | Public | Strategic legal tech partnership opportunities, sponsored partner banners, and ecosystem monetization. |
| **18** | **24/7 AI Legal Advisor & Concierge** | `/chat` or `/ai-advisor` | `AIAdvisorPage.tsx` | Public / Registered | Interactive virtual legal advisor powered by Google Gemini (`gemini-2.0-flash`) with cross-border knowledge retrieval. |
| **19** | **Sovereign AI Hub** | `/sovereign-ai-hub` | `AdvancedAIHubPage.tsx` | Registered | Advanced AI model telemetry, prompt governance, model latency diagnostics, and autonomous model health. |
| **20** | **Regulatory & International Compliance** | `/legal-compliance` | `LegalCompliancePage.tsx` | Public | Global IP-based legal jurisdiction resolver, compliance matrices for GCC, Middle East, Europe, Americas, and Africa. |
| **21** | **Executive Reports Center** | `/reports` | `ReportsPage.tsx` | Registered | Comprehensive contract risk, operational maturity, and enterprise governance downloadable reports. |
| **22** | **Enterprise Subscriptions & Payments** | `/payment` | `PaymentPage.tsx` | Public | Gumroad Merchant of Record checkout ($49, $139, $349, $990) & SWIFT direct wire transfer instructions. |
| **23** | **Wire Receipt Verification & Billing** | `/payment/verify` & `/billing` | `ReceiptVerificationPage.tsx` & `BillingPage.tsx` | Registered | SWIFT bank slip upload, transaction reference verification, and active subscription status. |
| **24** | **Customer Support & Service Desk** | `/support` | `SupportPage.tsx` | Public | Multilingual customer support ticketing, FAQ, priority contact channels, and WhatsApp direct link. |
| **25** | **Statutory Corporate Information** | `/about`, `/privacy`, `/terms`, `/refund` | Dedicated Pages | Public | Verified company disclosures, draft privacy mandate, terms of use, and money-back refund conditions. |

---

## 3. Protected Admin & Chairman Command Centers

Accessible exclusively to authenticated platform administrators (`ProtectedAdminRoute`):

1. `/admin` — Master Operational Dashboard
2. `/admin/analytics` — Platform Traffic & Conversion Telemetry
3. `/admin/ai-analytics` — Gemini Token Consumption & Model Diagnostics
4. `/admin/customer-success` — Customer Onboarding & Retention Monitor
5. `/admin/enterprise-governance` — Enterprise Policy & Compliance Gate
6. `/admin/ecosystem` — Integration Ecosystem & External Webhooks
7. `/admin/legal-ops` — Centralized Legal Operations & Ticket Triage
8. `/admin/command-center` — Sovereign Systems Executive Command Center
9. `/admin/regulatory-radar` — Global Regulatory Shift Tracker
10. `/admin/cloud-console` — Cloud Infrastructure & Database Latency Monitor
11. `/admin/singularity-hub` — Core Platform Integration Node
12. `/admin/federation-hub` — Multi-Region Sovereign Node Federation
13. `/admin/planetary-hub` — Global Traffic & Cross-Border Routing Matrix
14. `/admin/operations-center` — Real-Time Incident & Operation Monitor
15. `/admin/trust-hub` — Zero-Trust Security & Encryption Auditor
16. `/admin/scale-readiness` — Infrastructure Load & Concurrency Stress Center
17. `/admin/lifecycle-hub` — Enterprise Contract Lifecycle Orchestrator
18. `/admin/strategic-operations` — Growth, Valuation & Strategic Milestone Hub
19. `/admin/enterprise-adoption` — Enterprise Client Feature Adoption Analytics
20. `/admin/enterprise-operations` — Mission-Critical High-Availability Status
21. `/admin/commercial-intelligence` — Revenue Forecasting & Customer LTV Analytics
22. `/admin/partner-ecosystem` — Channel Partner & Affiliate Revenue Tracker
23. `/admin/global-intelligence` — Worldwide Legal Tech Market Penetration
24. `/admin/institutional-os` — Institutional Core Governance Architecture
25. `/admin/global-ecosystem` — International Partner & API Hub
26. `/admin/operational-maturity` — SRE & Reliability Maturity Index
27. `/admin/institutional-scale` — High-Concurrency Throughput Monitor
28. `/admin/global-intelligence-network` — Distributed Intelligence Feeds
29. `/admin/institutional-marketplace` — Enterprise Legal Service Marketplace
30. `/admin/planetary-sovereign` — Autonomous Data Residency Enforcer
31. `/admin/institutional-reality` — Verification & Audit Trail Explorer
32. `/admin/planetary-consortium` — Global Legal Partner Network
33. `/admin/market-activation` — Regional Go-To-Market Automation
34. `/admin/production-hardening` — Production Security & Performance Hardening
35. `/admin/marketing-crm` — Marketing Outreach & Customer CRM (Anti-Duplication Guard)
36. `/admin/receipt-review` — SWIFT Bank Transfer Slip Verification & Approval
37. `/admin/anti-fraud` — Transaction Risk & Anti-Money-Laundering Auditor
38. `/admin/financial` — Revenue, MRR, ARR, and Gateway Settlements
39. `/admin/review-queue` — Document Forensic Review Queue
40. `/admin/checklist` — Platform Launch & Pre-Flight Operational Checklist
41. `/lead-radar` — B2B Inbound Lead Telemetry
42. `/youtube-studio` — Autonomous YouTube Content & Broadcast Manager

---

## 4. Protected Commercial Invariants (Payment System)

The commercial tiering and payment processing architecture is permanently frozen and protected against modification:

| Plan Identifier | Public Label | Price Point | Provider | Gumroad Permalink | Entitlements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `starter` | Starter / Basic | **$49 / mo** | Gumroad MOR | `https://juristech.gumroad.com/l/nydsh` | 10 contract analyses, 50 templates, basic AI advisor, 1 user seat |
| `professional` | Professional / Growth | **$139 / mo** | Gumroad MOR | `https://juristech.gumroad.com/l/ekrrs` | Unlimited contract analyses, full AI advisor, 5 seats, 10GB vault, formation tools |
| `enterprise` | Enterprise / Advisory | **$349 / mo** | Gumroad MOR | `https://juristech.gumroad.com/l/sqzed` | Custom workflows, team governance, dedicated account manager, unlimited storage |
| `dealroom` | Deal Room / Retainer | **$990 one-time** | Gumroad MOR | `https://juristech.gumroad.com/l/dealroom` | Full M&A deal room, priority lawyer escrow review, custom white-glove audit |

- **Webhook Endpoint**: `/api/webhooks?provider=gumroad`
- **Fallback Verification**: Manual SWIFT direct wire transfer receipt review at `/admin/receipt-review`.

---

## 5. Underlying AI Models & Providers

| Role | Provider | Model ID | Invocation Endpoints |
| :--- | :--- | :--- | :--- |
| **Primary AI Reasoning & Legal RAG** | Google Cloud / Gemini | `gemini-2.0-flash` | `api/chat.js`, `api/ai.js`, `server/ai/cross-border-rag.js`, `server/ai/leviathan-core.js`, `server/contracts/generate-engine.js`, `server/forensic/inspector-engine.js` |
| **Autonomous Content Crons** | OpenAI | `gpt-4o-mini` | `api/cron/youtube-morning.js`, `api/cron/youtube-evening.js` |
| **Studio Dialogue TTS** | Microsoft Edge Neural / ElevenLabs | `ar-SA-HamedNeural`, `en-US-ChristopherNeural`, `eleven_multilingual_v2` | `scripts/generate-dialogue-audio.js`, `api/video-generate.js` |
| **Video Compositing** | Sharp + FFmpeg | Node native Sharp + libx264 FFmpeg | `scripts/render-shorts-sharp.js` |

---

## 6. Route & Service Verification Sign-off

- [x] All 23 public/client services verified in router.
- [x] All 35+ admin command center routes verified and role-gated under `ProtectedAdminRoute`.
- [x] All 8 language prefixes (`/`, `/ar`, `/en`, `/fr`, `/de`, `/es`, `/tr`, `/zh`) verified with single-source-of-truth routing.
- [x] Zero service deprecations, deletions, or unapproved merges.
