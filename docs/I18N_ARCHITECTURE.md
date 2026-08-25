# JurisTech Solutions — Multilingual Platform Architecture (GLOBAL-I18N-P0)

## Overview & Vision

JurisTech Solutions is an enterprise-grade sovereign LegalTech platform operating across global jurisdictions. The **GLOBAL-I18N-P0** specification establishes a centralized, production-safe, and high-performance multilingual architecture supporting **7 official languages**:

1. **English (`en`)** — Default & Fallback Language (LTR)
2. **Arabic (`ar`)** — العربية (RTL)
3. **French (`fr`)** — Français (LTR)
4. **Spanish (`es`)** — Español (LTR)
5. **German (`de`)** — Deutsch (LTR)
6. **Turkish (`tr`)** — Türkçe (LTR)
7. **Simplified Chinese (`zh`)** — 简体中文 (LTR)

---

## 1. Directory Structure

```text
src/
├── i18n/
│   ├── index.ts              # Master i18n module exports
│   ├── config.ts             # Centralized i18next configuration & resource loader
│   ├── languageConfig.ts     # Official language metadata, codes, flags, and namespaces
│   ├── languageDetection.ts  # Strict 5-tier language detection engine
│   └── rtl.ts                # Centralized document language (lang) and direction (dir) manager
├── locales/
│   ├── en/                   # 23 Modular English Namespaces
│   ├── ar/                   # 23 Modular Arabic Namespaces
│   ├── fr/                   # 23 Modular French Namespaces
│   ├── es/                   # 23 Modular Spanish Namespaces
│   ├── de/                   # 23 Modular German Namespaces
│   ├── tr/                   # 23 Modular Turkish Namespaces
│   └── zh/                   # 23 Modular Chinese Namespaces
├── components/
│   └── LanguageSwitcher.tsx  # Accessible, ARIA-compliant 7-language selector
└── lib/
    ├── universalTranslator.ts # Reactive hook (usePlatformLocale, loc, formatCurrency)
    └── languageHelper.ts     # System prompts for AI and normalization
```

---

## 2. The 23 Modular Namespaces

To prevent massive monolithic bundles and ensure clean separation of concerns, translations are structured into **23 dedicated namespaces** with 100% key parity across all 7 languages:

| # | Namespace | Scope & Domain |
|---|---|---|
| 1 | `common.json` | Generic UI buttons, actions, loadings, and global labels |
| 2 | `navigation.json` | Header navigation links, dropdowns, visitor & subscriber menus |
| 3 | `home.json` | Landing page hero, statistics, feature highlights |
| 4 | `auth.json` | Authentication, 2FA, password recovery, session alerts |
| 5 | `dashboard.json` | Executive telemetry, metrics counters, quick actions |
| 6 | `ai.json` | AI legal advisor dialogue, 8-axis analysis, model engine notices |
| 7 | `documents.json` | Document & contract vault, file uploads, cryptographic sealing |
| 8 | `contracts.json` | Smart contract generation studio, parties, financial terms |
| 9 | `compliance.json` | GDPR, SOC 2, statutory limitations, data privacy |
| 10 | `enterprise.json` | M&A due diligence, VPC deployments, enterprise RFP forms |
| 11 | `pricing.json` | Pricing tiers, billing toggles, Paddle checkout CTA |
| 12 | `billing.json` | Subscription state portal, renewal, invoice history |
| 13 | `subscription.json` | PremiumFeatureGuard CTA, tier badges, entitlement notices |
| 14 | `security.json` | AES-256 E2EE, SHA-256 sealing, anti-fraud radar |
| 15 | `documentation.json` | Platform API guides, SDK connectors, whitepapers |
| 16 | `contact.json` | Institutional contact channels, WhatsApp, Outlook |
| 17 | `errors.json` | Localized error messages, network failures, 404/403 |
| 18 | `notifications.json` | Toast alerts, contract generation notices, system alerts |
| 19 | `legal.json` | Terms of Service, Privacy Policy, Refund Policy summaries |
| 20 | `forms.json` | Form inputs, placeholders, required/optional indicators |
| 21 | `validation.json` | Client-side input validation error strings |
| 22 | `admin.json` | Executive control center, anti-fraud auditor, CRM tabs |
| 23 | `accessibility.json` | Screen-reader ARIA descriptions, focus labels |

---

## 3. Strict 5-Tier Language Detection Hierarchy

When a visitor loads the platform, `detectInitialLanguage()` determines the active locale strictly following this priority order:

1. **Explicit URL Locale**: e.g., `/ar/pricing`, `/zh/dashboard`, `/fr/contracts`
2. **User Saved Preference**: `localStorage.getItem('juristech.locale')`
3. **Authenticated User Profile**: Account language stored in metadata
4. **Browser Language**: `navigator.language` normalized to the closest supported code
5. **English Fallback**: Default `en`

---

## 4. Single Source of Truth Routing Strategy

In compliance with specification rules, there is **only ONE React component implementation per page**. Route definitions in `src/App.tsx` support both root paths (`/pricing`) and locale prefixes (`/:locale/pricing`), dynamically synchronizing the active language without reloading the page or duplicating code.

---

## 5. Right-to-Left (RTL) Text Direction

- **Arabic (`ar`)** is configured with `dir="rtl"` and `lang="ar"`.
- **All other 6 languages** (`en`, `fr`, `es`, `de`, `tr`, `zh`) use `dir="ltr"`.
- `setDocumentLanguage(locale)` in `src/i18n/rtl.ts` handles:
  - `document.documentElement.lang`
  - `document.documentElement.dir`
  - `document.body.classList` (`rtl-layout` vs `ltr-layout`)
  - Global `juristech_lang_change` event dispatch.

---

## 6. Multi-Regional SEO & Hreflang Architecture

The `SEO.tsx` component and prerender scripts inject canonical links and bidirectional `hreflang` alternate tags covering:
- Base languages: `en`, `ar`, `fr`, `de`, `es`, `zh`, `tr`
- Regional targets: `ar-SA`, `ar-EG`, `ar-AE`, `en-US`, `en-GB`, `fr-FR`, `de-DE`, `es-ES`, `zh-CN`, `tr-TR`
- `x-default` fallback pointing to the canonical English URL.

---

## 7. Strict Production Invariants Preserved

The globalization layer is strictly **presentation-only**. The following core systems remain completely untouched and isolated:
- **Paddle Merchant of Record**: Product ID (`pro_01m0txshyww92xh07mawyzg52j`), Price ID (`pri_01m0ty6sxjj7w0xpm1r07r50ss`), Client Token (`live_08dad1304849fe550fb9c689a50`), and webhook HMAC signature verifications.
- **Data Boundaries**: `REAL`, `SEED`, `SYNTHETIC`, `DEMO` classifications, MRR calculations, and `getRealInboundLeads()` logic.
- **Database & Schemas**: Zero database migrations or schema alterations.

---

## 8. Developer Validation Script

To verify catalog parity and ensure no missing or empty translation keys exist:
```bash
node scripts/validate-i18n.mjs
```
The script audits all 161 namespace files across all 7 languages and verifies 100% key parity with 0 missing keys.
