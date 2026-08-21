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
    titleAr: 'منصة تحليل العقود بالذكاء الاصطناعي | JurisTech Solutions',
    descriptionEn:
      'Premier AI contract review and automated legal document analysis platform. Detect liability traps, audit clauses, and draft sovereign agreements.',
    descriptionAr:
      'منصة JurisTech لتحليل العقود بالذكاء الاصطناعي وكشف الثغرات والبنود التعسفية وإدارة المخاطر القانونية للشركات وصياغة الاتفاقيات بدقة تشريعية واستشارات فورية.',
    keywords: 'منصة تحليل العقود بالذكاء الاصطناعي, كشف الثغرات القانونية, تدقيق العقود التجارية, AI contract review software, corporate legal risk audit',
    schemaType: 'SoftwareApplication',
  },
  '/dashboard': {
    path: '/dashboard',
    titleEn: 'Legal AI Dashboard & Risk Intelligence | JurisTech',
    titleAr: 'لوحة تحليل العقود وإدارة المخاطر | JurisTech Solutions',
    descriptionEn:
      'Enterprise AI contract review dashboard. Instant clause redlining, liability cap analysis, and multi-jurisdictional compliance across US & GCC.',
    descriptionAr:
      'المنصة الذكية الأولى لتحليل العقود وكشف الثغرات والبنود التعسفية وإدارة المخاطر القانونية للشركات. صياغة العقود التجارية واستشارات قانونية فورية للشركات.',
    keywords: 'AI-powered contract risk scoring, automated legal document analysis platform, contract liability analyzer, AI contract review',
    schemaType: 'SoftwareApplication',
  },
  '/chat': {
    path: '/chat',
    titleEn: '24/7 AI Legal Counsel & Virtual Attorney | JurisTech',
    titleAr: 'المستشار القانوني الذكي للشركات | JurisTech Solutions',
    descriptionEn:
      '24/7 enterprise AI legal counsel for corporate disputes, commercial contract terms, Delaware statutes, Saudi Companies Law & UNCITRAL regulations.',
    descriptionAr:
      'مستشارك القانوني الذكي المتاح 24 ساعة: استشارات قانونية موثوقة لحل النزاعات العقدية، فحص شروط الاتفاقيات، وتدقيق أنظمة الشركات والعمل بالسعودية والخليج.',
    keywords: 'AI legal counsel, virtual attorney USA, corporate lawyer AI, GCC legal assistant',
    schemaType: 'SoftwareApplication',
  },
  '/contracts': {
    path: '/contracts',
    titleEn: 'AI Commercial Contract Drafting Studio | JurisTech',
    titleAr: 'صياغة وتدقيق العقود الذكية للشركات | JurisTech',
    descriptionEn:
      'Generate, draft, and auto-redline commercial contracts for GCC, US & international jurisdictions. UNCITRAL compliant with instant Word exports.',
    descriptionAr:
      'صياغة العقود التجارية والاتفاقيات الذكية وتدقيقها بالذكاء الاصطناعي — متوافقة مع أنظمة التجارة والاستثمار في السعودية والإمارات والخليج وأمريكا والأونسيترال.',
    keywords: 'AI commercial contract drafting, smart contract builder, NDA agreement generator',
    schemaType: 'SoftwareApplication',
  },
  '/risk': {
    path: '/risk',
    titleEn: 'AI Contract Risk Scoring & Vulnerability Audit | JurisTech',
    titleAr: 'فحص المخاطر التعاقدية للشركات | JurisTech Solutions',
    descriptionEn:
      'Instant AI contract risk scoring: detect indemnification traps, uncapped liabilities, penalty clauses, and statutory compliance gaps.',
    descriptionAr:
      'فحص وتدقيق المخاطر القانونية للشركات وكشف البنود التعسفية وثغرات المسؤولية المالية والشرط الجزائي بالذكاء الاصطناعي مع اقتراح الصياغات البديلة المعتمدة.',
    keywords: 'contract vulnerability audit, indemnification trap scanner, AI contract risk',
    schemaType: 'SoftwareApplication',
  },
  '/company-formation': {
    path: '/company-formation',
    titleEn: 'Corporate Formation & Statutory Governance | JurisTech',
    titleAr: 'تأسيس الشركات وحوكمة الشركاء | JurisTech Solutions',
    descriptionEn:
      'AI-powered corporate formation, Articles of Association drafting, partner governance mandates, and statutory compliance across Saudi Arabia & UAE.',
    descriptionAr:
      'تأسيس الشركات وصياغة عقود التأسيس والأنظمة الأساسية وحوكمة الشركاء بالذكاء الاصطناعي في السعودية والإمارات ومصر والأردن ودول الخليج وفق أحدث أنظمة الشركات.',
    keywords: 'تأسيس الشركات, حوكمة الشركات, عقد تأسيس شركة ذات مسؤولية محدودة',
    schemaType: 'SoftwareApplication',
  },
  '/vault': {
    path: '/vault',
    titleEn: 'Encrypted AI Legal Vault & Document Management | JurisTech',
    titleAr: 'خزينة المستندات المشفّرة والوثائق | JurisTech',
    descriptionEn:
      'Bank-grade encrypted legal document repository with automated expiry alerts, OCR search, and multi-jurisdictional compliance tracking.',
    descriptionAr:
      'خزّن مستنداتك القانونية وتتبعها في خزينة مشفّرة آمنة مع تنبيهات انتهاء الصلاحية والبحث الذكي بالمستندات وفق معايير الأمان والتشفير السيادي.',
    keywords: 'encrypted document vault, legal document management, cloud legal storage',
    schemaType: 'SoftwareApplication',
  },
  '/repository': {
    path: '/repository',
    titleEn: '1,000,000+ Certified Smart Legal Templates | JurisTech',
    titleAr: 'مستودع العقود والنماذج الذكية المعتمدة | JurisTech',
    descriptionEn:
      'Explore 1,000,000+ certified legal contracts, corporate templates, M&A agreements, employment contracts, and SaaS SLAs grounded in global laws.',
    descriptionAr:
      'أضخم مستودع وخزينة عقود ونماذج قانونية بالشرق الأوسط والعالم: تصفح أكثر من 1,000,000 عقد وتوليد وتدقيق فوري بالذكاء الاصطناعي مطابق للأنظمة الدولية.',
    keywords: 'legal contracts templates, M&A agreements, certified legal repository',
    schemaType: 'SoftwareApplication',
  },
  '/templates': {
    path: '/templates',
    titleEn: 'Smart Legal Templates Studio & AI Generator | JurisTech',
    titleAr: 'استوديو النماذج والتوليد القانوني | JurisTech',
    descriptionEn:
      'Interactive Smart Legal Templates Studio with AI customizer, risk audit score, voice drafting, and instant PDF/Word exports for 50+ jurisdictions.',
    descriptionAr:
      'استوديو النماذج القانونية التفاعلي: صياغة وتخصيص وتدقيق المخاطر بالذكاء الاصطناعي وتصدير فوري بصيغة Word و PDF خالٍ من الفراغات وبدقة لغوية.',
    keywords: 'AI legal template generator, contract customization, Word export legal',
    schemaType: 'SoftwareApplication',
  },
  '/negotiation': {
    path: '/negotiation',
    titleEn: 'AI Contract Negotiation & Digital E-Signature | JurisTech',
    titleAr: 'غرف التفاوض والتوقيع الرقمي المشفر | JurisTech',
    descriptionEn:
      'Automate contract redlining, counter-offer recommendations, and court-admissible e-signatures for US & international commercial deals.',
    descriptionAr:
      'غرف التفاوض الرقمية الذكية وتعليم التعديلات والتوقيع الإلكتروني المشفر بشهادات SHA-256 المعتمدة لتسريع إبرام الصفقات وحل النزاعات.',
    keywords: 'contract negotiation room, digital signature legal, SHA-256 e-seal',
    schemaType: 'SoftwareApplication',
  },
  '/enterprise-audit': {
    path: '/enterprise-audit',
    titleEn: 'Enterprise AI Compliance & Regulatory Audit | JurisTech',
    titleAr: 'تدقيق المؤسسات والامتثال التنظيمي | JurisTech',
    descriptionEn:
      'Enterprise-grade compliance audits for US SEC, GDPR, HIPAA, CCPA/CPRA, and UNCITRAL frameworks powered by sovereign legal AI.',
    descriptionAr:
      'تدقيق شامل للامتثال القانوني على مستوى المؤسسات والشركات بالذكاء الاصطناعي — تحديد الثغرات والمخاطر التنظيمية وخطط المعالجة الاستباقية.',
    keywords: 'enterprise legal compliance, regulatory audit AI, GDPR SEC compliance',
    schemaType: 'SoftwareApplication',
  },
  '/legal-compliance': {
    path: '/legal-compliance',
    titleEn: 'Global & US Regulatory Compliance Knowledge Hub | JurisTech',
    titleAr: 'دليل الامتثال واللوائح التشريعية | JurisTech',
    descriptionEn:
      'Comprehensive guide to US Federal regulations, state privacy mandates, GDPR, and international commercial trade frameworks.',
    descriptionAr:
      'دليل الامتثال القانوني الشامل — الأنظمة واللوائح السعودية، القوانين الاتحادية الإماراتية، تشريعات الشركات الأمريكية، وحوكمة حماية البيانات.',
    keywords: 'regulatory compliance guide, GCC business regulations, Delaware legal compliance',
    schemaType: 'SoftwareApplication',
  },
  '/payment': {
    path: '/payment',
    titleEn: 'Enterprise Subscriptions & Secure Payments | JurisTech',
    titleAr: 'خطط الاشتراك وباقات الشركات | JurisTech Solutions',
    descriptionEn:
      'Upgrade your corporate legal operations. Secure checkout via PayPal, Credit Card, InstaPay Egypt, and Direct Bank Wire (SWIFT).',
    descriptionAr:
      'اشترك الآن في باقات منصة JurisTech Solutions للشركات والمكاتب القانونية — دفع آمن عبر البطاقات الائتمانية والتحويل البنكي المباشر SWIFT و InstaPay.',
    keywords: 'enterprise legaltech subscription, corporate legal pricing, payment portal',
    schemaType: 'SoftwareApplication',
  },
  '/support': {
    path: '/support',
    titleEn: '24/7 Client Support & Advisory Helpdesk | JurisTech',
    titleAr: 'الدعم الفني والاستشارات الفورية | JurisTech',
    descriptionEn:
      '24/7 technical and legal support desk for enterprise clients and platform subscribers with instant advisory response.',
    descriptionAr:
      'فريق الدعم الاستشاري والفني متاح 24 ساعة طوال أيام الأسبوع للإجابة على كافة الاستفسارات التعاقدية وتقديم المساندة الفنية الفورية للعملاء.',
    keywords: 'legaltech support, client advisory helpdesk, 24/7 legal support',
    schemaType: 'SoftwareApplication',
  },
  '/about': {
    path: '/about',
    titleEn: 'About JurisTech Solutions & Sovereign AI Legal Ecosystem',
    titleAr: 'عن المنصة والريادة التشريعية | JurisTech Solutions',
    descriptionEn:
      'Learn about JurisTech Solutions — pioneering sovereign legal AI infrastructure and automated contract governance globally.',
    descriptionAr:
      'تعرّف على منصة JurisTech Solutions — الرائدة إقليمياً وعالمياً في حلول الذكاء الاصطناعي القانوني للشركات وتدقيق العقود المليونية.',
    keywords: 'about JurisTech Solutions, sovereign legal AI, legaltech company profile',
    schemaType: 'AboutPage',
  },
  '/reports': {
    path: '/reports',
    titleEn: 'Strategic Legal Intelligence & Analytics Reports | JurisTech',
    titleAr: 'التقارير الإستراتيجية وتحليلات المخاطر | JurisTech',
    descriptionEn:
      'Comprehensive corporate legal risk metrics, contract dispute analytics, and legislative trend reports for C-Suite executives.',
    descriptionAr:
      'تقارير دورية شاملة ومؤشرات حية لتحليل المخاطر العقدية، رصد النزاعات التجارية، واتجاهات التشريعات واللوائح للشركات والمدراء التنفيذيين.',
    keywords: 'legal intelligence reports, contract risk analytics, B2B legal metrics',
    schemaType: 'SoftwareApplication',
  },
  '/privacy': {
    path: '/privacy',
    titleEn: 'Privacy Policy & Data Governance Mandate | JurisTech',
    titleAr: 'سياسة الخصوصية وحماية البيانات | JurisTech Solutions',
    descriptionEn:
      'Our commitment to client confidentiality, AES-256 encryption, Zero-Knowledge document security, and GDPR compliance.',
    descriptionAr:
      'التزامنا الصارم بحماية سرية بياناتك وخصوصية مستنداتك القانونية وفق أعلى معايير التشفير العسكري AES-256 وحوكمة البيانات العالمية GDPR.',
    keywords: 'legal privacy policy, data protection, AES-256 confidentiality',
    schemaType: 'WebPage',
  },
  '/terms': {
    path: '/terms',
    titleEn: 'Terms of Service & Usage Agreement | JurisTech Solutions',
    titleAr: 'شروط وأحكام الاستخدام الرسمية | JurisTech Solutions',
    descriptionEn:
      'Official Terms of Service governing platform usage, enterprise SLAs, and AI legal advisory standards for JurisTech Solutions.',
    descriptionAr:
      'الشروط والأحكام الرسمية الحاكمة لاستخدام منصة JurisTech Solutions وحلول الذكاء الاصطناعي القانوني واتفاقيات مستوى الخدمة (SLA).',
    keywords: 'terms of service, legaltech usage terms, SLA commitments',
    schemaType: 'WebPage',
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
