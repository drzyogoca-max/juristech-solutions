import fs from 'fs';
import path from 'path';
import { getSemanticHtmlForRoute } from './renderRouteSemanticHtml.mjs';

const DIST_DIR = path.join(process.cwd(), 'dist');
const BASE_URL = 'https://www.juristech.solutions';

const LANGS = [
  'ar', 'ar-SA', 'ar-EG', 'ar-AE', 'ar-KW', 'ar-QA', 'ar-BH', 'ar-JO',
  'en', 'en-US', 'en-GB', 'en-CA', 'en-AU',
  'fr', 'fr-FR', 'fr-BE', 'fr-CH',
  'de', 'de-DE', 'de-AT', 'de-CH',
  'es', 'es-ES', 'es-MX', 'es-US', 'es-AR',
  'zh', 'zh-CN', 'zh-SG', 'zh-HK',
  'tr', 'tr-TR', 'x-default'
];

const ROUTE_METADATA = {
  '/': {
    titleAr: 'تحليل العقود بالذكاء الاصطناعي وتدقيق المخاطر | JurisTech',
    titleEn: 'AI Contract Analysis & Risk Audit | JurisTech Solutions',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. تحليل العقود بالذكاء الاصطناعي وتدقيق المخاطر.',
    descriptionEn: 'Premier AI contract review and automated legal document analysis platform. Detect liability traps, audit clauses, and draft sovereign agreements.',
  },
  '/dashboard': {
    titleAr: 'لوحة الذكاء القانوني وتحليل مخاطر العقود | JurisTech',
    titleEn: 'Legal AI Dashboard & Risk Intelligence | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. لوحة الذكاء القانوني وتحليل مخاطر العقود.',
    descriptionEn: 'Enterprise AI contract review dashboard. Instant clause redlining, liability cap analysis, and multi-jurisdictional compliance across US & GCC.',
  },
  '/chat': {
    titleAr: 'المستشار القانوني بالذكاء الاصطناعي على مدار الساعة | JurisTech',
    titleEn: '24/7 AI Legal Counsel & Virtual Attorney | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. المستشار القانوني بالذكاء الاصطناعي على مدار الساعة.',
    descriptionEn: 'Ask Juris — 24/7 enterprise AI legal counsel for corporate disputes, commercial contract terms, Delaware statutes, Saudi Companies Law & GCC regulations.',
  },
  '/contracts': {
    titleAr: 'استوديو صياغة العقود التجارية بالذكاء الاصطناعي | JurisTech',
    titleEn: 'AI Commercial Contract Drafting Studio | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. استوديو صياغة العقود التجارية بالذكاء الاصطناعي.',
    descriptionEn: 'Generate, draft, and auto-redline commercial contracts for GCC, US & international jurisdictions. UNCITRAL compliant with instant Word exports.',
  },
  '/risk': {
    titleAr: 'تقييم مخاطر العقود وتدقيق الثغرات القانونية | JurisTech',
    titleEn: 'AI Contract Risk Scoring & Vulnerability Audit | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. تقييم مخاطر العقود وتدقيق الثغرات القانونية.',
    descriptionEn: 'Instant AI contract risk scoring: detect indemnification traps, uncapped liabilities, penalty clauses, and statutory compliance gaps.',
  },
  '/company-formation': {
    titleAr: 'تأسيس الشركات والحوكمة والامتثال القانوني | JurisTech',
    titleEn: 'Corporate Formation & Statutory Governance | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. تأسيس الشركات والحوكمة والامتثال القانوني.',
    descriptionEn: 'AI-powered corporate formation, Articles of Association drafting, partner governance mandates, and statutory compliance across Saudi Arabia & UAE.',
  },
  '/vault': {
    titleAr: 'الخزنة القانونية الآمنة وإدارة المستندات | JurisTech',
    titleEn: 'Encrypted AI Legal Vault & Document Management | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. الخزنة القانونية الآمنة وإدارة المستندات.',
    descriptionEn: 'Bank-grade encrypted legal document repository with automated expiry alerts, OCR search, and multi-jurisdictional compliance tracking.',
  },
  '/repository': {
    titleAr: 'مكتبة العقود والقوالب القانونية العالمية | JurisTech',
    titleEn: '1,000,000+ Certified Smart Legal Templates | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. مكتبة العقود والقوالب القانونية العالمية.',
    descriptionEn: 'Explore 1,000,000+ certified legal contracts, corporate templates, M&A agreements, employment contracts, and SaaS SLAs grounded in global laws.',
  },
  '/templates': {
    titleAr: 'استوديو القوالب القانونية ومولد العقود الذكي | JurisTech',
    titleEn: 'Smart Legal Templates Studio & AI Generator | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. استوديو القوالب القانونية ومولد العقود الذكي.',
    descriptionEn: 'Interactive Smart Legal Templates Studio with AI customizer, risk audit score, voice drafting, and instant PDF/Word exports for 50+ jurisdictions.',
  },
  '/negotiation': {
    titleAr: 'التفاوض على العقود والتوقيع الإلكتروني | JurisTech',
    titleEn: 'AI Contract Negotiation & Digital E-Signature | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. التفاوض على العقود والتوقيع الإلكتروني.',
    descriptionEn: 'Automate contract redlining, counter-offer recommendations, and court-admissible e-signatures for US & international commercial deals.',
  },
  '/enterprise-audit': {
    titleAr: 'تدقيق الامتثال والتنظيم للشركات والمؤسسات | JurisTech',
    titleEn: 'Enterprise AI Compliance & Regulatory Audit | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. تدقيق الامتثال والتنظيم للشركات والمؤسسات.',
    descriptionEn: 'Enterprise-grade compliance audits for US SEC, GDPR, HIPAA, CCPA/CPRA, and UNCITRAL frameworks powered by sovereign legal AI.',
  },
  '/legal-compliance': {
    titleAr: 'مركز الامتثال القانوني والتنظيمي العالمي | JurisTech',
    titleEn: 'Global & US Regulatory Compliance Knowledge Hub | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. مركز الامتثال القانوني والتنظيمي العالمي.',
    descriptionEn: 'Comprehensive guide to US Federal regulations, state privacy mandates, GDPR, and international commercial trade frameworks.',
  },
  '/lead-radar': {
    titleAr: 'اكتشاف العملاء المحتملين وذكاء مخاطر الشركات | JurisTech',
    titleEn: 'B2B Legal Prospecting & Corporate Risk Intelligence | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. اكتشاف العملاء المحتملين وذكاء مخاطر الشركات.',
    descriptionEn: 'AI-driven B2B legal prospecting and corporate risk intelligence for enterprise deal flow automation.',
  },
  '/sovereign-ai-hub': {
    titleAr: 'منصة الذكاء الاصطناعي القانوني السيادي | JurisTech',
    titleEn: 'Sovereign AI Legal Infrastructure Hub | JurisTech Solutions',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. منصة الذكاء الاصطناعي القانوني السيادي.',
    descriptionEn: 'Sovereign AI legal infrastructure hub powered by self-hosted LLM models for high-security corporate governance.',
  },
  '/deal-shield': {
    titleAr: 'DealShield 360 لاكتشاف احتياجات العملاء والصفقات الدولية | JurisTech',
    titleEn: 'DealShield 360™ | AI Client Need Discovery & Cross-Border Deal Simulator',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. DealShield 360 لاكتشاف احتياجات العملاء والصفقات الدولية.',
    descriptionEn: 'Sovereign AI enterprise need diagnostic intake and cross-border statutory clash simulator for M&A, VC joint ventures, and international commercial deals.',
  },
  '/youtube-studio': {
    titleAr: 'استوديو قناة JurisTech على YouTube ونمو المحتوى',
    titleEn: 'Official YouTube Channel Studio & 2x Daily Video Automation | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. استوديو قناة JurisTech على YouTube ونمو المحتوى.',
    descriptionEn: 'Official YouTube Channel Studio for founder@juristech.solutions. Automated 2x daily morning & evening video publishing engine.',
  },
  '/youtube': {
    titleAr: 'قناة JurisTech الرسمية على YouTube',
    titleEn: 'Official YouTube Channel & Video Studio | JurisTech Solutions',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. قناة JurisTech الرسمية على YouTube.',
    descriptionEn: 'Official YouTube Channel for JurisTech Solutions. Watch daily legal tech briefings and AI contract audit guides.',
  },
  '/youtube-channel': {
    titleAr: 'قناة JurisTech الرسمية والمحتوى القانوني',
    titleEn: 'Official YouTube Channel & Video Studio | JurisTech Solutions',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. قناة JurisTech الرسمية والمحتوى القانوني.',
    descriptionEn: 'Official YouTube Channel for JurisTech Solutions. Watch daily legal tech briefings and AI contract audit guides.',
  },
  '/b2b-proposals': {
    titleAr: 'مولد عروض B2B ومحرك طلبات العروض للشركات | JurisTech',
    titleEn: 'Enterprise B2B Proposal Engine & AI RFP Hub | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. مولد عروض B2B ومحرك طلبات العروض للشركات.',
    descriptionEn: 'Automated C-Suite B2B proposal generation and RFP compliance auditing for global enterprise clients.',
  },
  '/payment': {
    titleAr: 'الاشتراكات والدفع الآمن لخدمات JurisTech',
    titleEn: 'Enterprise Subscriptions & Secure Payments | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. الاشتراكات والدفع الآمن لخدمات JurisTech.',
    descriptionEn: 'Upgrade your corporate legal operations. Secure checkout via PayPal, Credit Card, InstaPay Egypt, and Direct Bank Wire (SWIFT).',
  },
  '/support': {
    titleAr: 'الدعم الفني والاستشارات التشغيلية على مدار الساعة | JurisTech',
    titleEn: '24/7 Client Support & Advisory Helpdesk | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. الدعم الفني والاستشارات التشغيلية على مدار الساعة.',
    descriptionEn: '24/7 technical and legal support desk for enterprise clients and platform subscribers with instant advisory response.',
  },
  '/about': {
    titleAr: 'عن JurisTech ومنظومة الذكاء الاصطناعي القانوني',
    titleEn: 'About JurisTech Solutions & Sovereign AI Legal Ecosystem',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. عن JurisTech ومنظومة الذكاء الاصطناعي القانوني.',
    descriptionEn: 'Learn about JurisTech Solutions — pioneering sovereign legal AI infrastructure and automated contract governance globally.',
  },
  '/video-hub': {
    titleAr: 'مركز الفيديوهات التعليمية والشروحات القانونية | JurisTech',
    titleEn: 'Video Knowledge Hub & Platform Tutorials | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. مركز الفيديوهات التعليمية والشروحات القانونية.',
    descriptionEn: 'Interactive video tutorials and practical demonstrations of AI contract audit and risk analysis.',
  },
  '/marketing': {
    titleAr: 'النمو العالمي والشراكات الاستراتيجية للشركات | JurisTech',
    titleEn: 'Global Growth & Strategic Enterprise Partnerships | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. النمو العالمي والشراكات الاستراتيجية للشركات.',
    descriptionEn: 'Strategic enterprise growth, B2B partnerships, and institutional rollout programs.',
  },
  '/reports': {
    titleAr: 'تقارير الذكاء القانوني وتحليلات مخاطر العقود | JurisTech',
    titleEn: 'Strategic Legal Intelligence & Analytics Reports | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. تقارير الذكاء القانوني وتحليلات مخاطر العقود.',
    descriptionEn: 'Comprehensive corporate legal risk metrics, contract dispute analytics, and legislative trend reports for C-Suite executives.',
  },
  '/privacy': {
    titleAr: 'سياسة الخصوصية وحوكمة البيانات | JurisTech',
    titleEn: 'Privacy Policy & Data Governance Mandate | JurisTech',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. سياسة الخصوصية وحوكمة البيانات.',
    descriptionEn: 'Our commitment to client confidentiality, AES-256 encryption, Zero-Knowledge document security, and GDPR compliance.',
  },
  '/terms': {
    titleAr: 'شروط الخدمة واتفاقية استخدام JurisTech',
    titleEn: 'Terms of Service & Usage Agreement | JurisTech Solutions',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. شروط الخدمة واتفاقية استخدام JurisTech.',
    descriptionEn: 'Official Terms of Service governing platform usage, enterprise SLAs, and AI legal advisory standards for JurisTech Solutions.',
  },
  '/refund': {
    titleAr: 'سياسة الاسترداد والإلغاء | JurisTech',
    titleEn: 'Refund Policy & Cancellation Terms | JurisTech Solutions',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. سياسة الاسترداد والإلغاء.',
    descriptionEn: 'Official Refund Policy and cancellation terms for digital software subscriptions at JurisTech Solutions.',
  },
  '/pricing': {
    titleAr: 'الأسعار والاشتراكات المؤسسية | JurisTech',
    titleEn: 'Pricing Plans & Enterprise Subscriptions | JurisTech Solutions',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. الأسعار والاشتراكات المؤسسية.',
    descriptionEn: 'Explore transparent pricing plans and enterprise subscription tiers for JurisTech Solutions legal AI.',
  },
  '/billing': {
    titleAr: 'الفوترة وإدارة الاشتراك | JurisTech',
    titleEn: 'Account Billing & Subscription Management | JurisTech Solutions',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. الفوترة وإدارة الاشتراك.',
    descriptionEn: 'Official Merchant billing portal, Paddle subscriptions, and cryptographic payment receipts at JurisTech Solutions.',
  },
  '/trust': {
    titleAr: 'بوابة الثقة والأمان المؤسسي | JurisTech',
    titleEn: 'Enterprise Trust & Security Portal | JurisTech Solutions',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. بوابة الثقة والأمان المؤسسي.',
    descriptionEn: 'JurisTech enterprise trust and security portal. Verified ISO 27001, SDAIA alignment, and 100% zero-retention guarantee.',
  },
};

const PUBLIC_ROUTES = Object.keys(ROUTE_METADATA);

function prerenderRoutes() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('[Prerender SEO] Error: dist/index.html not found. Run build first.');
    return;
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8');

  PUBLIC_ROUTES.forEach((routePath) => {
    const isRoot = routePath === '/';
    const routeDir = isRoot ? DIST_DIR : path.join(DIST_DIR, routePath.replace(/^\//, ''));
    if (!isRoot) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    const metadata = ROUTE_METADATA[routePath] || {};
    const pageTitle = metadata.titleEn || metadata.titleAr || 'منصة تحليل العقود بالذكاء الاصطناعي | JurisTech Solutions';
    const pageDesc = metadata.descriptionEn || metadata.descriptionAr || 'المنصة الذكية لتحليل العقود وكشف الثغرات وإدارة المخاطر القانونية للشركات واستشارات فورية.';
    const canonicalUrl = `${BASE_URL}${routePath === '/' ? '/' : routePath}`;

    let routeHtml = baseHtml;

    // 1. Strip all previous Title, Meta Description, and Canonical Tags to prevent duplicates
    routeHtml = routeHtml.replace(/<title>[\s\S]*?<\/title>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+[^>]*name=["']description["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*\/?>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+[^>]*property=["']og:title["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+[^>]*property=["']og:description["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+[^>]*property=["']og:url["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+[^>]*name=["']twitter:title["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+[^>]*name=["']twitter:description["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<link\s+[^>]*rel=["']alternate["'][^>]*>/gi, '');

    // 2. Generate canonical and hreflangs
    const hreflangTags = ''; // Locale alternates require distinct crawlable URLs.

    // 3. Schema.org JSON-LD structured data with full Organization, Identity, LocalBusiness, and FAQ graph
    const jsonLdBlock = `
    <script type="application/ld+json">
    ${JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': pageTitle,
        'description': pageDesc,
        'url': canonicalUrl,
        'dateModified': '2026-08-21T18:30:00Z',
        'inLanguage': 'en',
        'isPartOf': {
          '@type': 'WebSite',
          'name': 'JurisTech Solutions',
          'url': BASE_URL
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'JurisTech Solutions',
        'alternateName': 'JurisTech Sovereign Legal AI',
        'url': BASE_URL,
        'logo': `${BASE_URL}/logo.png`,
        'image': `${BASE_URL}/og-image.jpg`,
        'founder': {
          '@type': 'Person',
          'name': 'Dr. Mohammed Mostafa',
          'jobTitle': 'Chief Legal Architect & Senior Counsel',
          'email': 'founder@juristech.solutions',
          'telephone': '+201126674337'
        },
        'sameAs': [
          'https://x.com/JurisTechAI',
          'https://www.linkedin.com/in/juristech-solutions-14954b427/',
          'https://facebook.com/JurisTechSolutions',
          'https://instagram.com/juristech.solutions'
        ],
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'telephone': '+201126674337',
            'contactType': 'customer support',
            'email': 'founder@juristech.solutions',
            'availableLanguage': ['Arabic', 'English'],
            'areaServed': ['SA', 'AE', 'EG', 'QA', 'KW', 'BH', 'OM', 'JO', 'US', 'GB', 'EU']
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'د. محمد مصطفى | Dr. Mohammed Mostafa',
        'jobTitle': 'Senior Legal Counsel & Chief AI Architect',
        'worksFor': {
          '@type': 'Organization',
          'name': 'JurisTech Solutions'
        },
        'telephone': '+201126674337',
        'email': 'founder@juristech.solutions',
        'sameAs': [
          'https://www.linkedin.com/in/juristech-solutions-14954b427/',
          'https://x.com/JurisTechAI'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'LegalService',
        'name': 'JurisTech Solutions - Sovereign AI Legal Tech',
        'url': BASE_URL,
        'logo': `${BASE_URL}/favicon.ico`,
        'image': `${BASE_URL}/og-image.jpg`,
        'priceRange': '$$$',
        'telephone': '+201126674337',
        'email': 'founder@juristech.solutions',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'King Fahd Road, Al Olaya',
          'addressLocality': 'Riyadh',
          'addressRegion': 'Riyadh Region',
          'postalCode': '12211',
          'addressCountry': 'SA'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': 24.7136,
          'longitude': 46.6753
        },
        'openingHoursSpecification': {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          'opens': '00:00',
          'closes': '23:59'
        },
        'areaServed': ['SA', 'AE', 'EG', 'QA', 'KW', 'JO', 'BH', 'OM', 'IQ', 'DE', 'FR', 'ES', 'GB', 'CN', 'IN', 'ZA'],
        'serviceType': 'صياغة العقود بالذكاء الاصطناعي, تأسيس الشركات والامتثال التشريعي, فحص وتدقيق مخاطر العقود, المستشار القانوني الذكي الفوري'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'كيف يقوم الذكاء الاصطناعي بتحليل العقود وكشف الثغرات والبنود التعسفية في JurisTech؟',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'يقوم المحرك الذكي بتحليل نصوص ومواد العقد بمقارنتها مع الأنظمة واللوائح المعتمدة وسوابق المحاكم التجارية، وتحديد شروط المسؤولية غير المحدودة والتعويضات الجائرة واقتراح صياغات بديلة متوازنة فوراً.'
            }
          },
          {
            '@type': 'Question',
            'name': 'ما هي الدول والأنظمة القانونية التي تدعمها منصة JurisTech Solutions؟',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'تدعم المنصة أنظمة المملكة العربية السعودية (نظام المعاملات المدنية والشركات)، الإمارات (DIFC / ADGM والقوانين الاتحادية)، مصر، دول الخليج، الولايات المتحدة (Delaware / UCC)، والمملكة المتحدة وقواعد التجارة الدولية UNCITRAL.'
            }
          },
          {
            '@type': 'Question',
            'name': 'هل مستندات وبيانات الشركات مشفرة ومحمية من الاطلاع؟',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'تخضع جميع الوثائق لتشفير مصرفي AES-GCM 256-bit على جانب العميل مع عزل كامل للبيانات وضمان عدم تدريب النماذج العامة عليها وفق متطلبات GDPR و SOC2.'
            }
          }
        ]
      }
    ])}
    </script>
    `;

    // 4. Inject clean singular header block
    const cleanHeaderBlock = `
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDesc}" />
    <link rel="canonical" href="${canonicalUrl}" />
    ${hreflangTags}
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${pageDesc}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${pageDesc}" />
    ${jsonLdBlock}
`;

    routeHtml = routeHtml.replace('</head>', `${cleanHeaderBlock}\n</head>`);

    // 5. Inject Rich Semantic HTML inside <div id="root"></div> for 100% LLM Readability & 0% Rendering Delta
    const semanticContent = getSemanticHtmlForRoute(routePath);
    if (routeHtml.includes('<div id="root"></div>')) {
      routeHtml = routeHtml.replace('<div id="root"></div>', `<div id="root">${semanticContent}</div>`);
    } else {
      routeHtml = routeHtml.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${semanticContent}</div>`);
    }

    const targetFilePath = path.join(routeDir, 'index.html');
    fs.writeFileSync(targetFilePath, routeHtml, 'utf-8');
    console.log(`[Prerender SEO] Created pre-rendered HTML with full semantic content for ${routePath} -> ${targetFilePath}`);
  });

  // Generate crawlable locale-prefixed static copies for the 7 supported UI languages.
  // This prevents /:locale/... from falling through to the SPA root rewrite.
  const LOCALE_OUTPUTS = [
    { code: 'en', dir: 'ltr', titleKey: 'titleEn', descKey: 'descriptionEn' },
    { code: 'ar', dir: 'rtl', titleKey: 'titleAr', descKey: 'descriptionAr' },
    { code: 'fr', dir: 'ltr', titleKey: 'titleEn', descKey: 'descriptionEn' },
    { code: 'de', dir: 'ltr', titleKey: 'titleEn', descKey: 'descriptionEn' },
    { code: 'es', dir: 'ltr', titleKey: 'titleEn', descKey: 'descriptionEn' },
    { code: 'zh', dir: 'ltr', titleKey: 'titleEn', descKey: 'descriptionEn' },
    { code: 'tr', dir: 'ltr', titleKey: 'titleEn', descKey: 'descriptionEn' },
  ];

  PUBLIC_ROUTES.forEach((routePath) => {
    const metadata = ROUTE_METADATA[routePath] || {};
    const baseFile = routePath === '/'
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, routePath.replace(/^\//, ''), 'index.html');
    if (!fs.existsSync(baseFile)) return;
    const baseHtml = fs.readFileSync(baseFile, 'utf8');

    LOCALE_OUTPUTS.forEach(({ code, dir, titleKey, descKey }) => {
      const localeDir = path.join(DIST_DIR, code, routePath === '/' ? '' : routePath.replace(/^\//, ''));
      fs.mkdirSync(localeDir, { recursive: true });
      const title = metadata[titleKey] || metadata.titleEn || metadata.titleAr || 'JurisTech Solutions';
      const desc = metadata[descKey] || metadata.descriptionEn || metadata.descriptionAr || '';
      const canonical = BASE_URL + (routePath === '/' ? '/' + code : '/' + code + routePath);
      let html = baseHtml;
      html = html.replace(/<html\s+lang=["'][^"']*["']\s+dir=["'][^"']*["']/i, '<html lang="' + code + '" dir="' + dir + '"');
      html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + title + '</title>');
      html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, '<meta name="description" content="' + desc.replaceAll('"', '&quot;') + '" />');
      html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, '<link rel="canonical" href="' + canonical + '" />');
      html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, '<meta property="og:url" content="' + canonical + '" />');
      html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, '<meta property="og:title" content="' + title.replaceAll('"', '&quot;') + '" />');
      html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, '<meta property="og:description" content="' + desc.replaceAll('"', '&quot;') + '" />');
      fs.writeFileSync(path.join(localeDir, 'index.html'), html, 'utf8');
    });
  });
  console.log('[Prerender SEO] Locale-prefixed static copies generated for 7 supported languages.');

  // Generate dedicated 404.html for Vercel / static server fallback
  try {
    let notFoundHtml = baseHtml;
    const notFoundSemantic = getSemanticHtmlForRoute('/404');
    notFoundHtml = notFoundHtml.replace(/<title>[\s\S]*?<\/title>/i, '<title>404: الصفحة غير موجودة | JurisTech Solutions</title>');
    if (notFoundHtml.includes('<div id="root"></div>')) {
      notFoundHtml = notFoundHtml.replace('<div id="root"></div>', `<div id="root">${notFoundSemantic}</div>`);
    } else {
      notFoundHtml = notFoundHtml.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${notFoundSemantic}</div>`);
    }
    fs.writeFileSync(path.join(DIST_DIR, '404.html'), notFoundHtml, 'utf-8');
    console.log('[Prerender SEO] Dedicated 404.html generated successfully.');
  } catch (e) {
    console.warn('[Prerender SEO] 404.html generation bypassed:', e);
  }

  console.log('[Prerender SEO] All public routes pre-rendered with canonical URLs & full semantic HTML successfully.');
}

prerenderRoutes();
