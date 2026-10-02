/**
 * seo.ts — JurisTech Solutions
 * Per-page SEO metadata registry.
 * Provides strongly typed page titles (50-60 chars), descriptions (120-160 chars),
 * and keywords for all routes — localized for Arabic and English.
 */

export interface PageSEO {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  keywords: string;
  /** Relative path, used to build canonical URL */
  path: string;
  /** Schema.org structured data type hint */
  schemaType?: 'WebPage' | 'SoftwareApplication' | 'FAQPage' | 'AboutPage';
}

const BASE_URL = 'https://www.juristech.solutions';

export const PAGE_SEO: Record<string, PageSEO> = {
  '/': {
    path: '/',
    titleEn: 'AI Contract Analysis & Risk Audit | JurisTech Solutions',
    titleAr: 'تحليل العقود بالذكاء الاصطناعي وتدقيق المخاطر | JurisTech',
    descriptionEn:
      'Premier AI contract review and automated legal document analysis platform. Detect liability traps, audit clauses, and draft sovereign agreements.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. تحليل العقود بالذكاء الاصطناعي وتدقيق المخاطر.',
    keywords: 'منصة تحليل العقود بالذكاء الاصطناعي, كشف الثغرات القانونية, تدقيق العقود التجارية, AI contract review software, corporate legal risk audit',
    schemaType: 'SoftwareApplication',
  },
  '/dashboard': {
    path: '/dashboard',
    titleEn: 'Legal AI Dashboard & Risk Intelligence | JurisTech',
    titleAr: 'لوحة الذكاء القانوني وتحليل مخاطر العقود | JurisTech',
    descriptionEn:
      'Enterprise AI contract review dashboard. Instant clause redlining, liability cap analysis, and multi-jurisdictional compliance across US & GCC.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. لوحة الذكاء القانوني وتحليل مخاطر العقود.',
    keywords: 'AI-powered contract risk scoring, automated legal document analysis platform, contract liability analyzer, AI contract review',
    schemaType: 'SoftwareApplication',
  },
  '/chat': {
    path: '/chat',
    titleEn: '24/7 AI LegalTech SaaS & Contract Intelligence | JurisTech',
    titleAr: 'المستشار القانوني بالذكاء الاصطناعي على مدار الساعة | JurisTech',
    descriptionEn:
      '24/7 enterprise AI LegalTech software for contract drafting, risk detection, Delaware statutes, Saudi Companies Law & UNCITRAL frameworks.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. المستشار القانوني بالذكاء الاصطناعي على مدار الساعة.',
    keywords: 'LegalTech SaaS, AI contract analysis, contract drafting, corporate compliance AI, GCC legal tech',
    schemaType: 'SoftwareApplication',
  },
  '/contracts': {
    path: '/contracts',
    titleEn: 'AI Sovereign Smart Contracts Studio & Verified Templates Vault | JurisTech',
    titleAr: 'استوديو صياغة العقود التجارية بالذكاء الاصطناعي | JurisTech',
    descriptionEn:
      'Sovereign AI Contract Drafting Studio & Verified Legal Templates Vault. Compliant across GCC, Saudi M/191, Jordan, Egypt, US Delaware DGCL, UK & UNCITRAL.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. استوديو صياغة العقود التجارية بالذكاء الاصطناعي.',
    keywords: 'صياغة العقود بالذكاء الاصطناعي, نماذج عقود تجارية, نظام المعاملات المدنية السعودي, القانون المدني الأردني, Delaware smart contract drafting, UNCITRAL CISG contracts, AI legal generator',
    schemaType: 'SoftwareApplication',
  },
  '/risk': {
    path: '/risk',
    titleEn: 'AI Contract Risk Scoring & Vulnerability Audit | JurisTech',
    titleAr: 'تقييم مخاطر العقود وتدقيق الثغرات القانونية | JurisTech',
    descriptionEn:
      'Instant AI contract risk scoring: detect indemnification traps, uncapped liabilities, penalty clauses, and statutory compliance gaps.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. تقييم مخاطر العقود وتدقيق الثغرات القانونية.',
    keywords: 'contract vulnerability audit, indemnification trap scanner, AI contract risk',
    schemaType: 'SoftwareApplication',
  },
  '/company-formation': {
    path: '/company-formation',
    titleEn: 'Corporate Formation & Statutory Governance | JurisTech',
    titleAr: 'تأسيس الشركات والحوكمة والامتثال القانوني | JurisTech',
    descriptionEn:
      'AI-powered corporate formation, Articles of Association drafting, partner governance mandates, and statutory compliance across Saudi Arabia & UAE.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. تأسيس الشركات والحوكمة والامتثال القانوني.',
    keywords: 'تأسيس الشركات, حوكمة الشركات, عقد تأسيس شركة ذات مسؤولية محدودة',
    schemaType: 'SoftwareApplication',
  },
  '/vault': {
    path: '/vault',
    titleEn: 'Encrypted AI Legal Vault & Document Management | JurisTech',
    titleAr: 'الخزنة القانونية الآمنة وإدارة المستندات | JurisTech',
    descriptionEn:
      'Bank-grade encrypted legal document repository with automated expiry alerts, OCR search, and multi-jurisdictional compliance tracking.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. الخزنة القانونية الآمنة وإدارة المستندات.',
    keywords: 'encrypted document vault, legal document management, cloud legal storage',
    schemaType: 'SoftwareApplication',
  },
  '/repository': {
    path: '/repository',
    titleEn: 'Certified Sovereign Smart Legal Templates Vault | JurisTech',
    titleAr: 'مكتبة العقود والقوالب القانونية العالمية | JurisTech',
    descriptionEn:
      'Explore certified sovereign legal contracts, corporate templates, M&A agreements, employment contracts, and SaaS SLAs grounded in global laws.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. مكتبة العقود والقوالب القانونية العالمية.',
    keywords: 'legal contracts templates, M&A agreements, certified legal repository',
    schemaType: 'SoftwareApplication',
  },
  '/templates': {
    path: '/templates',
    titleEn: 'Smart Legal Templates Studio & AI Generator | JurisTech',
    titleAr: 'استوديو القوالب القانونية ومولد العقود الذكي | JurisTech',
    descriptionEn:
      'Interactive Smart Legal Templates Studio with AI customizer, risk audit score, voice drafting, and instant PDF/Word exports for 50+ jurisdictions.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. استوديو القوالب القانونية ومولد العقود الذكي.',
    keywords: 'AI legal template generator, contract customization, Word export legal',
    schemaType: 'SoftwareApplication',
  },
  '/negotiation': {
    path: '/negotiation',
    titleEn: 'AI Contract Negotiation & Digital E-Signature | JurisTech',
    titleAr: 'التفاوض على العقود والتوقيع الإلكتروني | JurisTech',
    descriptionEn:
      'Automate contract redlining, counter-offer recommendations, and court-admissible e-signatures for US & international commercial deals.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. التفاوض على العقود والتوقيع الإلكتروني.',
    keywords: 'contract negotiation room, digital signature legal, SHA-256 e-seal',
    schemaType: 'SoftwareApplication',
  },
  '/enterprise-audit': {
    path: '/enterprise-audit',
    titleEn: 'Enterprise AI Compliance & Regulatory Audit | JurisTech',
    titleAr: 'تدقيق الامتثال والتنظيم للشركات والمؤسسات | JurisTech',
    descriptionEn:
      'Enterprise-grade compliance audits for US SEC, GDPR, HIPAA, CCPA/CPRA, and UNCITRAL frameworks powered by sovereign legal AI.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. تدقيق الامتثال والتنظيم للشركات والمؤسسات.',
    keywords: 'enterprise legal compliance, regulatory audit AI, GDPR SEC compliance',
    schemaType: 'SoftwareApplication',
  },
  '/legal-compliance': {
    path: '/legal-compliance',
    titleEn: 'Global & US Regulatory Compliance Knowledge Hub | JurisTech',
    titleAr: 'مركز الامتثال القانوني والتنظيمي العالمي | JurisTech',
    descriptionEn:
      'Comprehensive guide to US Federal regulations, state privacy mandates, GDPR, and international commercial trade frameworks.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. مركز الامتثال القانوني والتنظيمي العالمي.',
    keywords: 'regulatory compliance guide, GCC business regulations, Delaware legal compliance',
    schemaType: 'SoftwareApplication',
  },
  '/payment': {
    path: '/payment',
    titleEn: 'Enterprise Subscriptions & Secure Payments | JurisTech',
    titleAr: 'الاشتراكات والدفع الآمن لخدمات JurisTech',
    descriptionEn:
      'Upgrade your corporate legal operations. Secure settlement via Bank Wire SWIFT, Binance Pay, InstaPay Egypt, and PayTabs Card Checkout (Under Review).',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. الاشتراكات والدفع الآمن لخدمات JurisTech.',
    keywords: 'enterprise legaltech subscription, corporate legal pricing, payment portal',
    schemaType: 'SoftwareApplication',
  },
  '/support': {
    path: '/support',
    titleEn: '24/7 Technical Support & Workflow Desk | JurisTech',
    titleAr: 'الدعم الفني والاستشارات التشغيلية على مدار الساعة | JurisTech',
    descriptionEn:
      '24/7 technical and platform support desk for enterprise clients and platform subscribers with instant operational response.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. الدعم الفني والاستشارات التشغيلية على مدار الساعة.',
    keywords: 'legaltech support, technical helpdesk, 24/7 platform support',
    schemaType: 'SoftwareApplication',
  },
  '/about': {
    path: '/about',
    titleEn: 'About JurisTech Solutions & Sovereign AI Legal Ecosystem',
    titleAr: 'عن JurisTech ومنظومة الذكاء الاصطناعي القانوني',
    descriptionEn:
      'Learn about JurisTech Solutions — pioneering sovereign legal AI infrastructure and automated contract governance globally.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. عن JurisTech ومنظومة الذكاء الاصطناعي القانوني.',
    keywords: 'about JurisTech Solutions, sovereign legal AI, legaltech company profile',
    schemaType: 'AboutPage',
  },
  '/reports': {
    path: '/reports',
    titleEn: 'Strategic Legal Intelligence & Analytics Reports | JurisTech',
    titleAr: 'تقارير الذكاء القانوني وتحليلات مخاطر العقود | JurisTech',
    descriptionEn:
      'Comprehensive corporate legal risk metrics, contract dispute analytics, and legislative trend reports for C-Suite executives.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. تقارير الذكاء القانوني وتحليلات مخاطر العقود.',
    keywords: 'legal intelligence reports, contract risk analytics, B2B legal metrics',
    schemaType: 'SoftwareApplication',
  },
  '/privacy': {
    path: '/privacy',
    titleEn: 'Privacy Policy & Data Governance Mandate | JurisTech',
    titleAr: 'سياسة الخصوصية وحوكمة البيانات | JurisTech',
    descriptionEn:
      'Our commitment to client confidentiality, AES-256 encryption, Zero-Knowledge document security, and GDPR compliance.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. سياسة الخصوصية وحوكمة البيانات.',
    keywords: 'legal privacy policy, data protection, AES-256 confidentiality',
    schemaType: 'WebPage',
  },
  '/terms': {
    path: '/terms',
    titleEn: 'Terms of Service & Usage Agreement | JurisTech Solutions',
    titleAr: 'شروط الخدمة واتفاقية استخدام JurisTech',
    descriptionEn:
      'Official Terms of Service governing platform usage, enterprise SLAs, and AI legal advisory standards for JurisTech Solutions.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. شروط الخدمة واتفاقية استخدام JurisTech.',
    keywords: 'terms of service, legaltech usage terms, SLA commitments',
    schemaType: 'WebPage',
  },
  '/video-hub': {
    path: '/video-hub',
    titleEn: 'Interactive Smart Audiovisual Educational Platform | JurisTech',
    titleAr: 'مركز الفيديوهات التعليمية والشروحات القانونية | JurisTech',
    descriptionEn:
      'Interactive AI-powered educational guide & customer journey walkthrough across all 10 platform legal engines with multi-language voice narration.',
    descriptionAr: 'منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. مركز الفيديوهات التعليمية والشروحات القانونية.',
    keywords: 'AI legal educational platform, customer journey walkthrough, smart legal tutorial, 7 languages voice legal guide',
    schemaType: 'SoftwareApplication',
  },
};

export function getPageSEO(pathname: string, lang = 'ar'): { title: string; description: string; keywords: string; schemaType?: string } {
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const entry = PAGE_SEO[cleanPath] || PAGE_SEO['/'];
  const isArabic = lang.startsWith('ar');

  return {
    title: isArabic ? entry.titleAr : entry.titleEn,
    description: isArabic ? entry.descriptionAr : entry.descriptionEn,
    keywords: entry.keywords,
    schemaType: entry.schemaType,
  };
}
