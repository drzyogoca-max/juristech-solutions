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
      'منصة JurisTech لتحليل العقود بالذكاء الاصطناعي وكشف الثغرات والبنود التعسفية وإدارة المخاطر القانونية للشركات وصياغة الاتفاقيات بدقة تشريعية ودعم سير العمل القانوني.',
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
      'المنصة الذكية الأولى لتحليل العقود وكشف الثغرات والبنود التعسفية وإدارة المخاطر القانونية للشركات. صياغة العقود التجارية ودعم سير العمل القانوني للشركات.',
    keywords: 'AI-powered contract risk scoring, automated legal document analysis platform, contract liability analyzer, AI contract review',
    schemaType: 'SoftwareApplication',
  },
  '/chat': {
    path: '/chat',
    titleEn: '24/7 AI LegalTech SaaS & Contract Intelligence | JurisTech',
    titleAr: 'مساعد التحليل القانوني الذكي للشركات | JurisTech Solutions',
    descriptionEn:
      '24/7 enterprise AI LegalTech software for contract drafting, risk detection, Delaware statutes, Saudi Companies Law & UNCITRAL frameworks.',
    descriptionAr:
      'منصة التحليل القانوني الذكي للشركات: فحص شروط الاتفاقيات، كشف الثغرات العقدية، وتدقيق أنظمة الشركات والعمل بالسعودية والخليج.',
    keywords: 'LegalTech SaaS, AI contract analysis, contract drafting, corporate compliance AI, GCC legal tech',
    schemaType: 'SoftwareApplication',
  },
  '/contracts': {
    path: '/contracts',
    titleEn: 'AI Sovereign Smart Contracts Studio & Verified Templates Vault | JurisTech',
    titleAr: 'محرك صياغة العقود الذكية بالذكاء الاصطناعي وخزينة النماذج المعتمدة | JurisTech',
    descriptionEn:
      'Sovereign AI Contract Drafting Studio & Verified Legal Templates Vault. Compliant across GCC, Saudi M/191, Jordan, Egypt, US Delaware DGCL, UK & UNCITRAL.',
    descriptionAr:
      'المحرك الموحد لصياغة وتدقيق العقود الذكية بالذكاء الاصطناعي وخزينة العقود المعتمدة في السعودية والخليج والأردن ومصر وأمريكا وبريطانيا والتجارة الدولية UNCITRAL.',
    keywords: 'صياغة العقود بالذكاء الاصطناعي, نماذج عقود تجارية, نظام المعاملات المدنية السعودي, القانون المدني الأردني, Delaware smart contract drafting, UNCITRAL CISG contracts, AI legal generator',
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
    titleEn: 'Certified Sovereign Smart Legal Templates Vault | JurisTech',
    titleAr: 'مستودع العقود والنماذج الذكية المعتمدة | JurisTech',
    descriptionEn:
      'Explore certified sovereign legal contracts, corporate templates, M&A agreements, employment contracts, and SaaS SLAs grounded in global laws.',
    descriptionAr:
      'مستودع وخزينة عقود ونماذج قانونية ذكية معتمدة: تصفح نماذج العقود وتوليد وتدقيق فوري بالذكاء الاصطناعي مطابق للأنظمة الإقليمية والدولية.',
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
      'Upgrade your corporate legal operations. Secure settlement via Bank Wire SWIFT, Binance Pay, InstaPay Egypt, and PayTabs Card Checkout (Under Review).',
    descriptionAr:
      'اشترك الآن في باقات منصة JurisTech Solutions للشركات والمكاتب القانونية — دفع آمن عبر التحويل البنكي المباشر SWIFT، Binance Pay، InstaPay وبطاقات الائتمان قيد التفعيل.',
    keywords: 'enterprise legaltech subscription, corporate legal pricing, payment portal',
    schemaType: 'SoftwareApplication',
  },
  '/support': {
    path: '/support',
    titleEn: '24/7 Technical Support & Workflow Desk | JurisTech',
    titleAr: 'الدعم الفني ومساندة سير العمل | JurisTech',
    descriptionEn:
      '24/7 technical and platform support desk for enterprise clients and platform subscribers with instant operational response.',
    descriptionAr:
      'فريق الدعم الفني والتقني متاح 24 ساعة طوال أيام الأسبوع للإجابة على كافة الاستفسارات التقنية وتقديم المساندة الفورية للمشتركين.',
    keywords: 'legaltech support, technical helpdesk, 24/7 platform support',
    schemaType: 'SoftwareApplication',
  },
  '/about': {
    path: '/about',
    titleEn: 'About JurisTech Solutions & Sovereign AI Legal Ecosystem',
    titleAr: 'عن المنصة والريادة التشريعية | JurisTech Solutions',
    descriptionEn:
      'Learn about JurisTech Solutions — pioneering sovereign legal AI infrastructure and automated contract governance globally.',
    descriptionAr:
      'تعرّف على منصة JurisTech Solutions — الرائدة إقليمياً وعالمياً في حلول الذكاء الاصطناعي القانوني للشركات وتدقيق العقود التجارية والمؤسسية.',
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
  '/video-hub': {
    path: '/video-hub',
    titleEn: 'Interactive Smart Audiovisual Educational Platform | JurisTech',
    titleAr: 'المنصة التعليمية التفاعلية المرئية للعملاء | حلول جوريس تك',
    descriptionEn:
      'Interactive AI-powered educational guide & customer journey walkthrough across all 10 platform legal engines with multi-language voice narration.',
    descriptionAr:
      'الدليل الاسترشادي وخطة العمل الشاملة لمنصة JurisTech: شرح تفصيلي خطوة بخطوة من لحظة الدخول وحتى آخر خدمة قانونية ناطق بـ 7 لغات.',
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
