/**
 * seo.ts — JurisTech Solutions
 * Per-page SEO metadata registry.
 * Provides strongly typed page titles, descriptions, and keywords
 * for all routes — localized for Arabic and English.
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
const BRAND_EN = 'JurisTech Solutions';
const BRAND_AR = 'JurisTech Solutions';

export const PAGE_SEO: Record<string, PageSEO> = {
  '/': {
    path: '/',
    titleEn: `AI-Powered Contract Risk Scoring & Automated Legal Document Analysis | JurisTech Solutions`,
    titleAr: `منصة تحليل العقود بالذكاء الاصطناعي | كشف المخاطر وصياغة العقود التجارية | JurisTech`,
    descriptionEn:
      'Enterprise LegalTech platform for AI-powered contract risk scoring and automated legal document analysis. Detect indemnification traps, audit uncapped liabilities, and draft sovereign agreements across US, EU & GCC jurisdictions.',
    descriptionAr:
      'منصة تحليل العقود بالذكاء الاصطناعي وكشف الثغرات القانونية وإدارة المخاطر للشركات. صياغة وتدقيق العقود التجارية وفحص بنود المسؤولية والتعويض في السعودية والخليج ومصر وأمريكا والدولية.',
    keywords: 'AI-powered contract risk scoring, automated legal document analysis platform for enterprise law firms, LegalTech, AI contract review software, corporate legal risk audit, Delaware LLC incorporation, Saudi Companies Law 2026, UNCITRAL compliance, منصة تحليل العقود بالذكاء الاصطناعي, كشف الثغرات القانونية',
    schemaType: 'SoftwareApplication',
  },
  '/dashboard': {
    path: '/dashboard',
    titleEn: `Automated Legal Document Analysis Platform & AI Contract Risk Scoring | JurisTech`,
    titleAr: `منصة تحليل العقود بالذكاء الاصطناعي | فحص المخاطر التعاقدية للشركات | JurisTech`,
    descriptionEn:
      'Premier AI contract review and automated legal document analysis platform for enterprise law firms. Sub-second clause redlining, AI-powered contract risk scoring, 50 US States compliance, and GCC commercial code audit.',
    descriptionAr:
      'المنصة الذكية الأولى لتحليل العقود وكشف الثغرات والبنود التعسفية وإدارة المخاطر القانونية للشركات. صياغة العقود التجارية واستشارات قانونية فورية للشركات ورواد الأعمال.',
    keywords: 'AI-powered contract risk scoring, automated legal document analysis platform for enterprise law firms, contract liability analyzer, AI contract review software, corporate legal risk audit',
    schemaType: 'SoftwareApplication',
  },
  '/chat': {
    path: '/chat',
    titleEn: `24/7 AI Legal Counsel & Enterprise LegalTech Assistant | JurisTech`,
    titleAr: `المستشار القانوني الذكي للشركات | استشارات قانونية وعقدية فورية | JurisTech`,
    descriptionEn:
      'Ask Juris — 24/7 enterprise AI legal counsel for corporate disputes, commercial contract terms, Delaware statutes, Saudi Companies Law 2026 & UNCITRAL regulations.',
    descriptionAr:
      'مستشارك القانوني الذكي المتاح 24 ساعة: استشارات قانونية موثوقة لحل النزاعات العقدية، فحص شروط الاتفاقيات، وتدقيق أنظمة العمل والشركات في السعودية والخليج وأمريكا.',
    keywords: 'AI legal counsel, enterprise LegalTech assistant, automated legal document analysis, virtual attorney USA, corporate lawyer AI, GCC legal assistant',
    schemaType: 'SoftwareApplication',
  },
  '/contracts': {
    path: '/contracts',
    titleEn: `AI Commercial Contract Drafting & Smart Agreement Builder | JurisTech`,
    titleAr: `صياغة العقود التجارية بالذكاء الاصطناعي وتوليد الاتفاقيات للشركات | JurisTech`,
    descriptionEn:
      'Generate, draft, and auto-redline commercial contracts for GCC, US States & international jurisdictions. UNCITRAL compliant with automated AI risk verification and zero-whitespace Word DOCX exports.',
    descriptionAr:
      'صياغة العقود التجارية والاتفاقيات الذكية وتدقيقها بالذكاء الاصطناعي — متوافقة مع أنظمة التجارة والاستثمار في السعودية والإمارات والخليج وأمريكا والأونسيترال.',
    keywords: 'AI commercial contract drafting, smart contract builder, NDA agreement generator, UNCITRAL contract software, AI-powered contract risk scoring',
    schemaType: 'SoftwareApplication',
  },
  '/risk': {
    path: '/risk',
    titleEn: `AI-Powered Contract Risk Scoring & Vulnerability Audit | JurisTech`,
    titleAr: `تحليل المخاطر القانونية للشركات وكشف ثغرات العقود التجارية | JurisTech`,
    descriptionEn:
      'Instant AI-powered contract risk scoring: detect indemnification traps, uncapped liability, penalty clauses, and statutory compliance gaps across GCC, US Federal & State laws.',
    descriptionAr:
      'فحص وتدقيق المخاطر القانونية للشركات وكشف البنود التعسفية وثغرات المسؤولية المالية والشرط الجزائي بالذكاء الاصطناعي مع اقتراح الصياغات البديلة المعتمدة.',
    keywords: 'AI-powered contract risk scoring, automated legal document analysis platform for enterprise law firms, contract vulnerability audit, indemnification trap scanner',
    schemaType: 'SoftwareApplication',
  },
  '/company-formation': {
    path: '/company-formation',
    titleEn: `Corporate Formation & Statutory Governance Suite | JurisTech Solutions`,
    titleAr: `تأسيس الشركات وحوكمة الشركاء وصياغة الأنظمة الأساسية | JurisTech Solutions`,
    descriptionEn:
      'AI-powered corporate formation, Articles of Association drafting, partner governance mandates, and statutory compliance across Saudi Arabia, UAE, Egypt, Jordan & GCC.',
    descriptionAr:
      'تأسيس الشركات وصياغة عقود التأسيس والأنظمة الأساسية وحوكمة الشركاء بالذكاء الاصطناعي في السعودية والإمارات ومصر والأردن ودول الخليج وفق أحدث أنظمة الشركات.',
    keywords: 'تأسيس الشركات, حوكمة الشركات, عقد تأسيس شركة ذات مسؤولية محدودة, نظام الشركات السعودي الجديد, صياغة النظام الأساسي, UAE company formation, Saudi corporate drafting, Articles of Association AI',
    schemaType: 'SoftwareApplication',
  },

  '/vault': {
    path: '/vault',
    titleEn: `Encrypted AI Legal Vault & Document Management | JurisTech`,
    titleAr: `خزينة المستندات المشفّرة والوثائق | JurisTech & LegalShield`,
    descriptionEn:
      'Bank-grade encrypted legal document repository with automated expiry alerts, OCR search, and multi-jurisdictional compliance tracking.',
    descriptionAr:
      'خزّن مستنداتك القانونية وتتبعها في خزينة مشفّرة آمنة مع تنبيهات انتهاء الصلاحية والبحث الذكي بالمستندات.',
    keywords: 'encrypted document vault, legal document management, cloud legal storage, contract repository, SOC2 compliant vault',
    schemaType: 'SoftwareApplication',
  },
  '/repository': {
    path: '/repository',
    titleEn: `1,000,000+ Certified Smart Legal Contracts & Templates Vault | JurisTech`,
    titleAr: `مستودع وخزينة العقود والنماذج الذكية الموحدة (1,000,000+ عقد معتمد) | JurisTech`,
    descriptionEn:
      'Explore 1,000,000+ certified legal contracts, corporate templates, M&A agreements, employment contracts, and SaaS SLAs. Fully ground in US, UK, EU, Saudi Arabia (M/132), UAE, Egypt, and UNCITRAL laws.',
    descriptionAr:
      'أضخم مستودع وخزينة عقود ونماذج قانونية بالشرق الأوسط والعالم: تصفح أكثر من 1,000,000 عقد وتوليد وتدقيق فوري بالذكاء الاصطناعي مطابق للسعودية والإمارات ومصر والأردن وأمريكا والدولية.',
    keywords: '1000000 legal contracts, AI contract repository, Saudi LLC agreement template, UAE commercial contract, Delaware incorporation contract, UNCITRAL international trade contracts, Saudi M132 contracts',
    schemaType: 'SoftwareApplication',
  },
  '/templates': {
    path: '/templates',
    titleEn: `Smart Legal Templates Studio & AI Contract Generator | JurisTech`,
    titleAr: `استوديو النماذج والتوليد والتدقيق القانوني بالذكاء الاصطناعي | JurisTech`,
    descriptionEn:
      'Interactive Smart Legal Templates Studio with AI customizer, risk audit score, voice drafting, and instant PDF/Word exports for 50+ jurisdictions.',
    descriptionAr:
      'استوديو النماذج القانونية التفاعلي: صياغة وتخصيص وتدقيق المخاطر بالذكاء الاصطناعي وتصدير فورية بصيغة Word و PDF.',
    keywords: 'smart legal templates studio, AI contract generator, live legal risk audit, NDA generator online, SaaS SLA template, B2B contract editor',
    schemaType: 'SoftwareApplication',
  },
  '/negotiation': {
    path: '/negotiation',
    titleEn: `AI Contract Negotiation & Digital E-Signature Studio | JurisTech`,
    titleAr: `التفاوض التعاقدي والتوقيع الرقمي المعتمد | JurisTech & LegalShield`,
    descriptionEn:
      'Automate contract redlining, counter-offer recommendations, and court-admissible e-signatures for US & international commercial deals.',
    descriptionAr:
      'التفاوض على العقود وتعليم التعديلات والتوقيع الإلكتروني بالذكاء الاصطناعي — تسريع اتفاقيات الأعمال عالمياً ومحلياً.',
    keywords: 'AI contract negotiation, DocuSign alternative, legal e-signature USA, automated redlining, negotiation AI assistant',
    schemaType: 'SoftwareApplication',
  },
  '/enterprise-audit': {
    path: '/enterprise-audit',
    titleEn: `Enterprise AI Compliance & Regulatory Audit Studio | JurisTech`,
    titleAr: `تدقيق المؤسسات والامتثال التنظيمي الشامل | JurisTech & LegalShield`,
    descriptionEn:
      'Enterprise-grade compliance audits for US SEC, GDPR, HIPAA, CCPA/CPRA, and UNCITRAL frameworks powered by sovereign legal AI.',
    descriptionAr:
      'تدقيق شامل للامتثال القانوني على مستوى المؤسسات بالذكاء الاصطناعي — تحديد الثغرات والمخاطر التنظيمية وخطط المعالجة.',
    keywords: 'enterprise legal compliance, CCPA audit AI, HIPAA compliance software, SEC regulatory audit, corporate compliance AI',
    schemaType: 'SoftwareApplication',
  },
  '/legal-compliance': {
    path: '/legal-compliance',
    titleEn: `Global & US Regulatory Compliance Knowledge Hub | LegalShield`,
    titleAr: `مركز الامتثال واللوائح التنفيذية | JurisTech & LegalShield`,
    descriptionEn:
      'Comprehensive guide to US Federal regulations, state privacy mandates (CCPA/CPRA, NY SHIELD), GDPR, and international trade laws.',
    descriptionAr:
      'بقَ ممتثلاً للأنظمة العالمية — الأنظمة الأمريكية، GDPR، أونكيترال، CISG، وقوانين البيانات الخليجية.',
    keywords: 'legal compliance USA, CCPA CPRA guide, US privacy compliance, FTC legal rules, commercial regulations hub',
    schemaType: 'WebPage',
  },
  '/lead-radar': {
    path: '/lead-radar',
    titleEn: `B2B Legal Prospecting & Corporate Risk Intelligence | JurisTech`,
    titleAr: `رادار العملاء القانونيين والاستخبارات التجارية | JurisTech & LegalShield`,
    descriptionEn:
      'Identify, evaluate, and score B2B legal prospects with AI intelligence for law firms, corporate legal departments, and enterprises.',
    descriptionAr:
      'تحديد وتأهيل وإشراك عملاء الأعمال المحتملين عالي الجودة بذكاء اصطناعي متقدم لتسجيل نقاط العملاء.',
    keywords: 'B2B legal prospecting, law firm lead generation, corporate risk radar, legal tech CRM intelligence',
    schemaType: 'SoftwareApplication',
  },
  '/payment': {
    path: '/payment',
    titleEn: `LegalShield & JurisTech Pricing | 90% Savings vs US Attorneys`,
    titleAr: `خطط الاشتراك والباقات القانونية | JurisTech & LegalShield`,
    descriptionEn:
      'Compare plans for JurisTech & LegalShield. Unlimited AI legal assistant, contract redlining, and business formation at 1/10th the cost of US law firms.',
    descriptionAr:
      'اختر خطة اشتراك للحصول على استشارات قانونية ذكية غير محدودة وإنشاء عقود وتدقيق مخاطر وميزات المؤسسات.',
    keywords: 'LegalShield pricing, JurisTech pricing, LegalZoom comparison pricing, cheap AI legal advisor USA, affordable legal plans',
    schemaType: 'WebPage',
  },
  '/support': {
    path: '/support',
    titleEn: `24/7 Multilingual Legal Tech Customer Support | JurisTech`,
    titleAr: `دعم العملاء والخدمات القانونية | JurisTech & LegalShield`,
    descriptionEn:
      'Get 24/7 dedicated support via WhatsApp (+201126674337), encrypted messenger, and live AI assistant for all platform inquiries.',
    descriptionAr:
      'احصل على دعم سريع ومتعدد اللغات من JurisTech Solutions — واتساب، بريد إلكتروني، دردشة مباشرة، وموارد ذاتية.',
    keywords: 'legal tech support USA, JurisTech customer service, LegalShield helpline, instant legal tech help',
    schemaType: 'WebPage',
  },
  '/about': {
    path: '/about',
    titleEn: `About JurisTech Solutions & LegalShield | AI Legal Ecosystem`,
    titleAr: `عن منظومة JurisTech Solutions & LegalShield | التقرير الرسمي`,
    descriptionEn:
      'Discover JurisTech Solutions & LegalShield — the premier sovereign AI legal intelligence ecosystem serving enterprises & individuals in US & 30+ countries.',
    descriptionAr:
      'تعرّف على JurisTech Solutions & LegalShield — كيان تقني قانوني مستقل يخدم المهنيين القانونيين والأفراد في أمريكا وأكثر من 30 دولة.',
    keywords: 'about JurisTech Solutions, LegalShield platform story, AI legal tech leaders, sovereign legal AI company',
    schemaType: 'AboutPage',
  },
  '/video-hub': {
    path: '/video-hub',
    titleEn: `US Legal Training & AI LegalTech Video Academy | JurisTech`,
    titleAr: `الأكاديمية القانونية والفيديوهات التدريبية | JurisTech & LegalShield`,
    descriptionEn:
      'Watch step-by-step video tutorials on contract drafting, US LLC formation, contract redlining, and corporate compliance.',
    descriptionAr:
      'شاهد مقاطع الفيديو التدريبية القانونية المنتقاة حول قانون العقود والامتثال وأدوات الذكاء الاصطناعي وأكثر.',
    keywords: 'legal tech video course, contract law tutorials USA, how to draft NDA video, LLC formation tutorial',
    schemaType: 'WebPage',
  },
  '/marketing': {
    path: '/marketing',
    titleEn: `AI Social Marketing Studio for US Law Firms | JurisTech`,
    titleAr: `استوديو التسويق الرقمي للمكاتب القانونية | JurisTech & LegalShield`,
    descriptionEn:
      'Automate legal thought leadership and social marketing for US law firms with ethics-checked AI content generation.',
    descriptionAr:
      'أتمت حملات التسويق عبر وسائل التواصل الاجتماعي لمكتبك القانوني بمحتوى مُنشأ بالذكاء الاصطناعي وتحليلات التفاعل.',
    keywords: 'law firm marketing AI, legal content generator USA, attorney social media tool, law firm SEO marketing',
    schemaType: 'SoftwareApplication',
  },
  '/reports': {
    path: '/reports',
    titleEn: `Corporate Legal Analytics & Risk Reports Generator | JurisTech`,
    titleAr: `تقارير التحليلات والمخاطر القانونية | JurisTech & LegalShield`,
    descriptionEn:
      'Generate institutional-grade legal risk reports, contract portfolio analytics, and audit readiness exports in PDF & Word.',
    descriptionAr:
      'أنشئ تقارير تحليلية قانونية شاملة وملخصات نشاط العقود ولوحات تحكم المخاطر.',
    keywords: 'legal risk report PDF, corporate legal analytics, contract portfolio audit, legal reporting software',
    schemaType: 'SoftwareApplication',
  },
  '/b2b-proposals': {
    path: '/b2b-proposals',
    titleEn: `Enterprise Legal Proposal & RFP Generator | JurisTech`,
    titleAr: `مولّد عروض التقديم والمناقصات للمؤسسات | JurisTech & LegalShield`,
    descriptionEn:
      'Build high-converting corporate legal proposals, retainer agreements, and RFP submissions tailored to US and global clients.',
    descriptionAr:
      'أنشئ عروض أعمال احترافية عالية القيمة للمؤسسات بالذكاء الاصطناعي — مخصصة لمجالك وولايتك القضائية وحجم فريقك.',
    keywords: 'legal RFP proposal generator, law firm proposal builder, enterprise legal retainer quote, AI proposal software',
    schemaType: 'SoftwareApplication',
  },
  '/acquisition': {
    path: '/acquisition',
    titleEn: `Global Corporate M&A Acquisitions & Takeovers Platform | JurisTech`,
    titleAr: `منصة الاستحواذ والاندماج الدولية للشركات M&A | JurisTech & LegalShield`,
    descriptionEn:
      'Structure international corporate acquisitions, asset purchases (APA), share purchases (SPA), and statutory mergers under global regulatory codes (Delaware DGCL, UK, GCC).',
    descriptionAr:
      'منصة صياغة وهيكلة صفقات الاستحواذ والاندماج الدولية: شراء الحصص والأسهم، شراء الأصول، والفحص القانوني النافي للجهالة بالذكاء الاصطناعي.',
    keywords: 'M&A acquisitions platform, corporate takeover legal documents, Delaware DGCL share purchase agreement, statutory merger contract generator',
    schemaType: 'SoftwareApplication',
  },
};

// ─── Multilingual SEO Titles and Descriptions Registry for 7 Languages ──────
const MULTI_LANG_SEO: Record<string, Record<string, { title: string; description: string }>> = {
  fr: {
    '/': {
      title: 'JurisTech Solutions | Intelligence Juridique IA et Automatisation des Contrats',
      description: 'Plateforme mondiale d’IA juridique pour la rédaction automatisée de contrats, l’audit des risques institutionnels et la conformité multi-juridictionnelle.',
    },
    '/dashboard': {
      title: 'Espace Juridique IA | Audit des Risques Contractuels | JurisTech Solutions',
      description: 'Espace de travail juridique IA : audit instantané des contrats, détection des risques et conformité aux normes internationales.',
    },
    '/chat': {
      title: 'Assistant Juridique IA 24/7 | JurisTech Solutions',
      description: 'Consultez votre assistant juridique virtuel IA 24/7 pour le droit des affaires, la rédaction contractuelle et l’analyse des litiges.',
    },
    '/contracts': {
      title: 'Générateur de Contrats Intelligents IA | JurisTech Solutions',
      description: 'Générez, rédigez et révisez automatiquement vos contrats juridiques selon les normes internationales et locales.',
    },
    '/risk': {
      title: 'Audit des Risques Contractuels par IA | JurisTech Solutions',
      description: 'Détection instantanée des pièges d’indemnisation, plafonds de responsabilité et clauses abusives dans vos contrats.',
    },
    '/company-formation': {
      title: 'Création d’Entreprise et Rédaction Statutaire IA | JurisTech Solutions',
      description: 'Création de sociétés, statuts et conformité réglementaire automatisée par IA pour entreprises et startups.',
    },
    '/vault': {
      title: 'Coffre-fort Juridique Chiffré | JurisTech Solutions',
      description: 'Gestion et stockage sécurisé de documents juridiques avec chiffrement de niveau bancaire et alertes d’échéance.',
    },
    '/templates': {
      title: 'Studio de Modèles Juridiques Intelligents | JurisTech Solutions',
      description: 'Plus de 200 modèles certifiés avec personnalisation IA, audit de risques et exportations Word / PDF immédiates.',
    },
    '/payment': {
      title: 'Tarifs et Forfaits Juridiques | JurisTech Solutions',
      description: 'Comparez nos offres d’assistance juridique IA illimitée, de rédaction de contrats et d’audit de conformité.',
    },
  },
  de: {
    '/': {
      title: 'JurisTech Solutions | Autonome KI-Rechtsintelligenz & Vertragsautomatisierung',
      description: 'Globale KI-Rechtsplattform für automatisierte Vertragserstellung, institutionelle Risikoanalyse und länderübergreifende Compliance.',
    },
    '/dashboard': {
      title: 'KI-Rechtsarbeitsbereich | Vertragsrisiko-Audit | JurisTech Solutions',
      description: 'Führender KI-Rechtsarbeitsbereich: Sofortige Vertragsprüfung, Risikoerkennung und Einhaltung gesetzlicher Vorschriften.',
    },
    '/chat': {
      title: '24/7 KI-Rechtsberater | JurisTech Solutions',
      description: 'Fragen Sie Ihren 24/7 KI-Rechtsanwalt für Wirtschaftsrecht, Vertragsprüfung und internationale Schiedsgerichtsbarkeit.',
    },
    '/contracts': {
      title: 'Smarter KI-Vertragsgenerator | JurisTech Solutions',
      description: 'Rechtssichere Verträge erstellen, anpassen und automatisch überarbeiten mit integriertem KI-Audit.',
    },
    '/risk': {
      title: 'KI-Vertragsrisikoanalyse | JurisTech Solutions',
      description: 'Erkennen Sie Haftungsfallen, Vertragsstrafen und kritische Klauseln in Sekundenschnelle mit KI.',
    },
    '/company-formation': {
      title: 'Unternehmensgründung & Satzungserstellung mit KI | JurisTech Solutions',
      description: 'KI-gestützte Gründung von Gesellschaften, Erstellung von Satzungen und regulatorische Compliance.',
    },
    '/vault': {
      title: 'Verschlüsselter Rechts-Tresor | JurisTech Solutions',
      description: 'Hochsichere Verwaltung rechtlicher Dokumente mit automatischer Fristüberwachung und Volltext-OCR.',
    },
    '/templates': {
      title: 'Smarte Rechtsvorlagen-Studio | JurisTech Solutions',
      description: 'Zertifizierte juristische Vorlagen mit KI-Anpassung, Risikoprüfung und sofortigem Word/PDF-Export.',
    },
    '/payment': {
      title: 'Preise & Tarife | JurisTech Solutions',
      description: 'Wählen Sie Ihren passenden Tarif für unbegrenzte KI-Rechtsberatung und automatisierte Vertragserstellung.',
    },
  },
  es: {
    '/': {
      title: 'JurisTech Solutions | Inteligencia Legal IA y Automatización de Contratos',
      description: 'Plataforma jurídica global de IA para redacción automatizada de contratos, auditoría de riesgos institucionales y cumplimiento normativo.',
    },
    '/dashboard': {
      title: 'Espacio de Trabajo Legal IA | Auditoría Contractual | JurisTech Solutions',
      description: 'Espacio de trabajo legal con IA: auditoría inmediata de contratos, detección de cláusulas de riesgo y cumplimiento regulatorio.',
    },
    '/chat': {
      title: 'Asistente Legal IA 24/7 | JurisTech Solutions',
      description: 'Consulte a su abogado virtual de IA disponible 24/7 para derecho mercantil, redacción de contratos y resolución de controversias.',
    },
    '/contracts': {
      title: 'Generador Inteligente de Contratos IA | JurisTech Solutions',
      description: 'Genere, redacte y revise automáticamente contratos legales adaptados a la normativa internacional y local.',
    },
    '/risk': {
      title: 'Auditoría de Riesgos Contractuales por IA | JurisTech Solutions',
      description: 'Detección instantánea de riesgos, límites de responsabilidad y cláusulas abusivas en cualquier contrato.',
    },
    '/company-formation': {
      title: 'Constitución de Empresas y Redacción Estatutaria IA | JurisTech Solutions',
      description: 'Constitución societaria, redacción de estatutos y gobernanza empresarial impulsada por inteligencia artificial.',
    },
    '/vault': {
      title: 'Bóveda de Documentos Legales Cifrada | JurisTech Solutions',
      description: 'Almacenamiento seguro de documentos con cifrado bancario, control de vencimientos y búsqueda OCR.',
    },
    '/templates': {
      title: 'Estudio de Plantillas Legales Inteligentes | JurisTech Solutions',
      description: 'Más de 200 plantillas legales certificadas con personalización por IA y exportación inmediata a Word y PDF.',
    },
    '/payment': {
      title: 'Planes y Precios | JurisTech Solutions',
      description: 'Planes accesibles para asesoría legal con IA ilimitada, redacción y auditoría de riesgos.',
    },
  },
  zh: {
    '/': {
      title: 'JurisTech Solutions | 全球领先的自主AI法律智能与合同自动化平台',
      description: '面向全球企业的AI法律服务平台，提供自动化合同起草、机构风险审计、公司设立及多法域合规审查。',
    },
    '/dashboard': {
      title: 'AI法律工作空间 | 合同风险智能审计 | JurisTech Solutions',
      description: '顶尖AI法律工作区：秒级合同合规审查、隐藏法律风险识别及跨国合规保障。',
    },
    '/chat': {
      title: '24/7 在线AI法律顾问 | JurisTech Solutions',
      description: '全天候AI虚拟法律专家，解答公司法、跨境贸易、合同审查及国际仲裁等法律咨询。',
    },
    '/contracts': {
      title: 'AI智能合同生成与修改系统 | JurisTech Solutions',
      description: '智能生成、起草并自动修订符合国际标准的商业合同，支持一键下载Word与PDF。',
    },
    '/risk': {
      title: 'AI合同风险深度审计系统 | JurisTech Solutions',
      description: '秒级扫描合同漏洞、赔偿责任陷阱与不平等条款，提供专业保护性修改建议。',
    },
    '/company-formation': {
      title: 'AI公司设立与法定章程起草平台 | JurisTech Solutions',
      description: '智能生成公司设立协议、公司章程、股东协议及合规治理文件。',
    },
    '/vault': {
      title: '银行级加密法律文档保险箱 | JurisTech Solutions',
      description: '安全存储与管理法律文档，具备到期自动提醒与智能OCR文本检索功能。',
    },
    '/templates': {
      title: '智能法律模板工作室 | JurisTech Solutions',
      description: '海量权威认证法律模板库，支持AI智能定制与即时Word/PDF导出。',
    },
    '/payment': {
      title: '服务方案与价格 | JurisTech Solutions',
      description: '选择适合您企业的方案，享受无限次AI法律咨询与智能合同生成服务。',
    },
  },
  tr: {
    '/': {
      title: 'JurisTech Solutions | Otonom AI Hukuk Zekası ve Sözleşme Otomasyonu',
      description: 'Otomatik sözleşme taslağı hazırlama, kurumsal risk denetimi ve çoklu yargı alanı uyumluluğu için küresel AI hukuk platformu.',
    },
    '/dashboard': {
      title: 'AI Hukuk Çalışma Alanı | Sözleşme Risk Denetimi | JurisTech Solutions',
      description: 'Gelişmiş AI hukuk çalışma alanı: Anlık sözleşme denetimi, yasal risk tespiti ve mevzuat uyumluluğu.',
    },
    '/chat': {
      title: '7/24 Canlı AI Hukuk Danışmanı | JurisTech Solutions',
      description: 'Şirketler hukuku, sözleşme incelemesi ve uyuşmazlık çözümü için 7/24 AI sanal hukuk danışmanınız.',
    },
    '/contracts': {
      title: 'Akıllı AI Sözleşme Oluşturucu | JurisTech Solutions',
      description: 'Uluslararası ve yerel standartlara uygun yasal sözleşmeleri AI ile oluşturun, düzenleyin ve indirin.',
    },
    '/risk': {
      title: 'AI Sözleşme Risk Denetimi | JurisTech Solutions',
      description: 'Tazminat tuzaklarını, sorumluluk sınırlarını ve riskli maddeleri saniyeler içinde tespit edin.',
    },
    '/company-formation': {
      title: 'AI ile Şirket Kuruluşu ve Ana Sözleşme Hazırlama | JurisTech Solutions',
      description: 'Yapay zeka destekli şirket kuruluş sözleşmeleri, şirket ana sözleşmesi ve yönetim kararları hazırlama.',
    },
    '/vault': {
      title: 'Şifreli Hukuki Belge Kasası | JurisTech Solutions',
      description: 'Banka düzeyinde şifreleme, vade uyarıları ve OCR arama özellikleri ile güvenli belge yönetimi.',
    },
    '/templates': {
      title: 'Akıllı Hukuki Şablonlar Stüdyosu | JurisTech Solutions',
      description: 'AI ile özelleştirilebilir, risk puanlamalı ve anında Word/PDF indirilebilir onaylı şablonlar.',
    },
    '/payment': {
      title: 'Fiyatlandırma ve Abonelik Planları | JurisTech Solutions',
      description: 'Sınırsız AI hukuk danışmanlığı ve sözleşme otomasyonu için planlarımızı karşılaştırın.',
    },
  },
};

// ─── Get SEO data for a given path ───────────────────────────────────────────
export function getPageSEO(pathname: string, lang = 'en'): {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
} {
  const data = PAGE_SEO[pathname] || PAGE_SEO['/dashboard'];
  
  if (lang === 'ar') {
    return {
      title: data.titleAr,
      description: data.descriptionAr,
      keywords: data.keywords,
      canonical: `${BASE_URL}${data.path}`,
    };
  }

  if (MULTI_LANG_SEO[lang]?.[pathname]) {
    return {
      title: MULTI_LANG_SEO[lang][pathname].title,
      description: MULTI_LANG_SEO[lang][pathname].description,
      keywords: data.keywords,
      canonical: `${BASE_URL}${data.path}`,
    };
  }

  return {
    title: data.titleEn,
    description: data.descriptionEn,
    keywords: data.keywords,
    canonical: `${BASE_URL}${data.path}`,
  };
}


