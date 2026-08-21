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
    titleAr: 'منصة تحليل العقود بالذكاء الاصطناعي | JurisTech Solutions',
    titleEn: 'AI Contract Analysis & Risk Audit | JurisTech Solutions',
    descriptionAr: 'منصة JurisTech لتحليل العقود بالذكاء الاصطناعي وكشف الثغرات والبنود التعسفية وإدارة المخاطر القانونية للشركات وصياغة الاتفاقيات واستشارات فورية.',
    descriptionEn: 'Premier AI contract review and automated legal document analysis platform. Detect liability traps, audit clauses, and draft sovereign agreements.',
  },
  '/dashboard': {
    titleAr: 'لوحة تحليل العقود وإدارة المخاطر | JurisTech Solutions',
    titleEn: 'Legal AI Dashboard & Risk Intelligence | JurisTech',
    descriptionAr: 'المنصة الذكية الأولى لتحليل العقود وكشف الثغرات والبنود التعسفية وإدارة المخاطر القانونية للشركات. صياغة العقود التجارية واستشارات قانونية فورية.',
    descriptionEn: 'Enterprise AI contract review dashboard. Instant clause redlining, liability cap analysis, and multi-jurisdictional compliance across US & GCC.',
  },
  '/chat': {
    titleAr: 'المستشار القانوني الذكي للشركات | JurisTech Solutions',
    titleEn: '24/7 AI Legal Counsel & Virtual Attorney | JurisTech',
    descriptionAr: 'مستشارك القانوني الذكي المتاح 24 ساعة: استشارات قانونية موثوقة لحل النزاعات العقدية، فحص شروط الاتفاقيات، وتدقيق أنظمة الشركات والعمل بالسعودية والخليج.',
    descriptionEn: 'Ask Juris — 24/7 enterprise AI legal counsel for corporate disputes, commercial contract terms, Delaware statutes, Saudi Companies Law & GCC regulations.',
  },
  '/contracts': {
    titleAr: 'صياغة وتدقيق العقود الذكية للشركات | JurisTech',
    titleEn: 'AI Commercial Contract Drafting Studio | JurisTech',
    descriptionAr: 'صياغة العقود التجارية والاتفاقيات الذكية وتدقيقها بالذكاء الاصطناعي — متوافقة مع أنظمة التجارة والاستثمار في السعودية والإمارات والخليج وأمريكا والأونسيترال.',
    descriptionEn: 'Generate, draft, and auto-redline commercial contracts for GCC, US & international jurisdictions. UNCITRAL compliant with instant Word exports.',
  },
  '/risk': {
    titleAr: 'فحص المخاطر التعاقدية للشركات | JurisTech Solutions',
    titleEn: 'AI Contract Risk Scoring & Vulnerability Audit | JurisTech',
    descriptionAr: 'فحص وتدقيق المخاطر القانونية للشركات وكشف البنود التعسفية وثغرات المسؤولية المالية والشرط الجزائي بالذكاء الاصطناعي مع اقتراح الصياغات البديلة المعتمدة.',
    descriptionEn: 'Instant AI contract risk scoring: detect indemnification traps, uncapped liabilities, penalty clauses, and statutory compliance gaps.',
  },
  '/company-formation': {
    titleAr: 'تأسيس الشركات وحوكمة الشركاء | JurisTech Solutions',
    titleEn: 'Corporate Formation & Statutory Governance | JurisTech',
    descriptionAr: 'تأسيس الشركات وصياغة عقود التأسيس والأنظمة الأساسية وحوكمة الشركاء بالذكاء الاصطناعي في السعودية والإمارات ومصر والأردن ودول الخليج وفق أحدث أنظمة الشركات.',
    descriptionEn: 'AI-powered corporate formation, Articles of Association drafting, partner governance mandates, and statutory compliance across Saudi Arabia & UAE.',
  },
  '/vault': {
    titleAr: 'خزينة المستندات المشفّرة والوثائق | JurisTech',
    titleEn: 'Encrypted AI Legal Vault & Document Management | JurisTech',
    descriptionAr: 'خزّن مستنداتك القانونية وتتبعها في خزينة مشفّرة آمنة مع تنبيهات انتهاء الصلاحية والبحث الذكي بالمستندات وفق معايير الأمان والتشفير السيادي.',
    descriptionEn: 'Bank-grade encrypted legal document repository with automated expiry alerts, OCR search, and multi-jurisdictional compliance tracking.',
  },
  '/repository': {
    titleAr: 'مستودع العقود والنماذج الذكية المعتمدة | JurisTech',
    titleEn: '1,000,000+ Certified Smart Legal Templates | JurisTech',
    descriptionAr: 'أضخم مستودع وخزينة عقود ونماذج قانونية بالشرق الأوسط والعالم: تصفح أكثر من 1,000,000 عقد وتوليد وتدقيق فوري بالذكاء الاصطناعي مطابق للأنظمة الدولية.',
    descriptionEn: 'Explore 1,000,000+ certified legal contracts, corporate templates, M&A agreements, employment contracts, and SaaS SLAs grounded in global laws.',
  },
  '/templates': {
    titleAr: 'استوديو النماذج والتوليد القانوني | JurisTech',
    titleEn: 'Smart Legal Templates Studio & AI Generator | JurisTech',
    descriptionAr: 'استوديو النماذج القانونية التفاعلي: صياغة وتخصيص وتدقيق المخاطر بالذكاء الاصطناعي وتصدير فوري بصيغة Word و PDF خالٍ من الفراغات وبدقة لغوية.',
    descriptionEn: 'Interactive Smart Legal Templates Studio with AI customizer, risk audit score, voice drafting, and instant PDF/Word exports for 50+ jurisdictions.',
  },
  '/negotiation': {
    titleAr: 'غرف التفاوض والتوقيع الرقمي المشفر | JurisTech',
    titleEn: 'AI Contract Negotiation & Digital E-Signature | JurisTech',
    descriptionAr: 'غرف التفاوض الرقمية الذكية وتعليم التعديلات والتوقيع الإلكتروني المشفر بشهادات SHA-256 المعتمدة لتسريع إبرام الصفقات وحل النزاعات.',
    descriptionEn: 'Automate contract redlining, counter-offer recommendations, and court-admissible e-signatures for US & international commercial deals.',
  },
  '/enterprise-audit': {
    titleAr: 'تدقيق المؤسسات والامتثال التنظيمي | JurisTech',
    titleEn: 'Enterprise AI Compliance & Regulatory Audit | JurisTech',
    descriptionAr: 'تدقيق شامل للامتثال القانوني على مستوى المؤسسات والشركات بالذكاء الاصطناعي — تحديد الثغرات والمخاطر التنظيمية وخطط المعالجة الاستباقية.',
    descriptionEn: 'Enterprise-grade compliance audits for US SEC, GDPR, HIPAA, CCPA/CPRA, and UNCITRAL frameworks powered by sovereign legal AI.',
  },
  '/legal-compliance': {
    titleAr: 'دليل الامتثال واللوائح التشريعية | JurisTech',
    titleEn: 'Global & US Regulatory Compliance Knowledge Hub | JurisTech',
    descriptionAr: 'دليل الامتثال القانوني الشامل — الأنظمة واللوائح السعودية، القوانين الاتحادية الإماراتية، تشريعات الشركات الأمريكية، وحوكمة حماية البيانات.',
    descriptionEn: 'Comprehensive guide to US Federal regulations, state privacy mandates, GDPR, and international commercial trade frameworks.',
  },
  '/lead-radar': {
    titleAr: 'رادار التحليلات الذكي واستكشاف الفرص | JurisTech',
    titleEn: 'B2B Legal Prospecting & Corporate Risk Intelligence | JurisTech',
    descriptionAr: 'رادار استكشاف الفرص والمخاطر العقدية للشركات بالذكاء الاصطناعي — تحليل سلوك الزوار والتحويل الآلي للشركات ورواد الأعمال.',
    descriptionEn: 'AI-driven B2B legal prospecting and corporate risk intelligence for enterprise deal flow automation.',
  },
  '/sovereign-ai-hub': {
    titleAr: 'مركز حلول الذكاء الاصطناعي السيادي | JurisTech',
    titleEn: 'Sovereign AI Legal Infrastructure Hub | JurisTech Solutions',
    descriptionAr: 'بنية تحتية سيادية للذكاء الاصطناعي القانوني — نماذج LLM خاصة بحوكمة وتدقيق العقود الحساسة وأسرار الشركات.',
    descriptionEn: 'Sovereign AI legal infrastructure hub powered by self-hosted LLM models for high-security corporate governance.',
  },
  '/b2b-proposals': {
    titleAr: 'منصة العروض التنافسية للشركات | JurisTech',
    titleEn: 'Enterprise B2B Proposal Engine & AI RFP Hub | JurisTech',
    descriptionAr: 'استخراج وتجهيز العروض الفنية والمالية للشركات الكبرى بالذكاء الاصطناعي مع تدقيق الالتزامات والشروط التعاقدية.',
    descriptionEn: 'Automated C-Suite B2B proposal generation and RFP compliance auditing for global enterprise clients.',
  },
  '/payment': {
    titleAr: 'خطط الاشتراك وباقات الشركات | JurisTech Solutions',
    titleEn: 'Enterprise Subscriptions & Secure Payments | JurisTech',
    descriptionAr: 'اشترك الآن في باقات منصة JurisTech Solutions للشركات والمكاتب القانونية — دفع آمن عبر البطاقات الائتمانية والتحويل البنكي المباشر SWIFT و InstaPay.',
    descriptionEn: 'Upgrade your corporate legal operations. Secure checkout via PayPal, Credit Card, InstaPay Egypt, and Direct Bank Wire (SWIFT).',
  },
  '/support': {
    titleAr: 'الدعم الفني والاستشارات الفورية | JurisTech',
    titleEn: '24/7 Client Support & Advisory Helpdesk | JurisTech',
    descriptionAr: 'فريق الدعم الاستشاري والفني متاح 24 ساعة طوال أيام الأسبوع للإجابة على كافة الاستفسارات التعاقدية وتقديم المساندة الفنية الفورية للعملاء.',
    descriptionEn: '24/7 technical and legal support desk for enterprise clients and platform subscribers with instant advisory response.',
  },
  '/about': {
    titleAr: 'عن المنصة والريادة التشريعية | JurisTech Solutions',
    titleEn: 'About JurisTech Solutions & Sovereign AI Legal Ecosystem',
    descriptionAr: 'تعرّف على منصة JurisTech Solutions — الرائدة إقليمياً وعالمياً في حلول الذكاء الاصطناعي القانوني للشركات وتدقيق العقود المليونية.',
    descriptionEn: 'Learn about JurisTech Solutions — pioneering sovereign legal AI infrastructure and automated contract governance globally.',
  },
  '/video-hub': {
    titleAr: 'مركز الشروحات المرئية والتدريبية | JurisTech',
    titleEn: 'Video Knowledge Hub & Platform Tutorials | JurisTech',
    descriptionAr: 'شروحات مرئية تفاعلية تشرح كيفية صياغة العقود وتدقيق المخاطر بالذكاء الاصطناعي واستخراج التقارير القانونية المعتمدة.',
    descriptionEn: 'Interactive video tutorials and practical demonstrations of AI contract audit and risk analysis.',
  },
  '/marketing': {
    titleAr: 'شراكات النمو والتوسع المؤسسي | JurisTech',
    titleEn: 'Global Growth & Strategic Enterprise Partnerships | JurisTech',
    descriptionAr: 'حلول الشراكات والنمو المؤسسي وبرامج التسويق والانتشار لمنصة JurisTech Solutions لقطاعات الأعمال والشركات الاستثمارية.',
    descriptionEn: 'Strategic enterprise growth, B2B partnerships, and institutional rollout programs.',
  },
  '/reports': {
    titleAr: 'التقارير الإستراتيجية وتحليلات المخاطر | JurisTech',
    titleEn: 'Strategic Legal Intelligence & Analytics Reports | JurisTech',
    descriptionAr: 'تقارير دورية شاملة ومؤشرات حية لتحليل المخاطر العقدية، رصد النزاعات التجارية، واتجاهات التشريعات واللوائح للشركات والمدراء التنفيذيين.',
    descriptionEn: 'Comprehensive corporate legal risk metrics, contract dispute analytics, and legislative trend reports for C-Suite executives.',
  },
  '/privacy': {
    titleAr: 'سياسة الخصوصية وحماية البيانات | JurisTech Solutions',
    titleEn: 'Privacy Policy & Data Governance Mandate | JurisTech',
    descriptionAr: 'التزامنا الصارم بحماية سرية بياناتك وخصوصية مستنداتك القانونية وفق أعلى معايير التشفير العسكري AES-256 وحوكمة البيانات العالمية GDPR.',
    descriptionEn: 'Our commitment to client confidentiality, AES-256 encryption, Zero-Knowledge document security, and GDPR compliance.',
  },
  '/terms': {
    titleAr: 'شروط وأحكام الاستخدام الرسمية | JurisTech Solutions',
    titleEn: 'Terms of Service & Usage Agreement | JurisTech Solutions',
    descriptionAr: 'الشروط والأحكام الرسمية الحاكمة لاستخدام منصة JurisTech Solutions وحلول الذكاء الاصطناعي القانوني واتفاقيات مستوى الخدمة (SLA).',
    descriptionEn: 'Official Terms of Service governing platform usage, enterprise SLAs, and AI legal advisory standards for JurisTech Solutions.',
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
    const pageTitle = metadata.titleAr || metadata.titleEn || 'منصة تحليل العقود بالذكاء الاصطناعي | JurisTech Solutions';
    const pageDesc = metadata.descriptionAr || metadata.descriptionEn || 'المنصة الذكية لتحليل العقود وكشف الثغرات وإدارة المخاطر القانونية للشركات واستشارات فورية.';
    const canonicalUrl = `${BASE_URL}${routePath === '/' ? '/' : routePath}`;

    let routeHtml = baseHtml;

    // 1. Strip all previous Title, Meta Description, and Canonical Tags to prevent duplicates
    routeHtml = routeHtml.replace(/<title>[\s\S]*?<\/title>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+property=["']og:title["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+property=["']og:description["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+property=["']og:url["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+name=["']twitter:title["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+name=["']twitter:description["'][^>]*>/gi, '');
    routeHtml = routeHtml.replace(/<link\s+rel=["']alternate["']\s+hreflang=[^>]*>/gi, '');

    // 2. Generate canonical and hreflangs
    const hreflangTags = LANGS.map(lang => {
      return `<link rel="alternate" hreflang="${lang}" href="${canonicalUrl}" />`;
    }).join('\n    ');

    // 3. Schema.org JSON-LD structured data
    const jsonLdBlock = `
    <script type="application/ld+json">
    ${JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': pageTitle,
        'description': pageDesc,
        'url': canonicalUrl,
        'inLanguage': ['ar', 'en'],
        'isPartOf': {
          '@type': 'WebSite',
          'name': 'JurisTech Solutions',
          'url': BASE_URL
        }
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
    routeHtml = routeHtml.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${semanticContent}</div>`);

    const targetFilePath = path.join(routeDir, 'index.html');
    fs.writeFileSync(targetFilePath, routeHtml, 'utf-8');
    console.log(`[Prerender SEO] Created pre-rendered HTML with full semantic content for ${routePath} -> ${targetFilePath}`);
  });

  console.log('[Prerender SEO] All public routes pre-rendered with canonical URLs & full semantic HTML successfully.');
}

prerenderRoutes();
