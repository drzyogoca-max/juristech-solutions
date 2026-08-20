import fs from 'fs';
import path from 'path';

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
  '/dashboard': {
    titleAr: 'منصة تحليل العقود بالذكاء الاصطناعي | فحص المخاطر القانونية للشركات | JurisTech',
    titleEn: 'AI Contract Analysis Platform & Corporate Legal Risk Audit | JurisTech & LegalShield',
    descriptionAr: 'المنصة الذكية الأولى لتحليل العقود وكشف الثغرات والبنود التعسفية وإدارة المخاطر القانونية للشركات. صياغة العقود التجارية واستشارات قانونية فورية.',
    descriptionEn: 'Premier AI contract review and corporate legal risk detection suite. Instant clause redlining, liability cap analysis, and GCC commercial code audit.',
  },
  '/chat': {
    titleAr: 'المستشار القانوني الذكي للشركات | استشارات قانونية وعقدية فورية | JurisTech',
    titleEn: 'AI Legal Counsel for Enterprises & 24/7 Virtual Attorney | JurisTech',
    descriptionAr: 'مستشارك القانوني الذكي المتاح 24 ساعة: استشارات قانونية موثوقة لحل النزاعات العقدية، فحص شروط الاتفاقيات، وتدقيق أنظمة العمل والشركات.',
    descriptionEn: 'Ask Juris — 24/7 enterprise AI legal counsel for corporate disputes, commercial contract terms, Delaware statutes, Saudi Companies Law & GCC regulations.',
  },
  '/contracts': {
    titleAr: 'صياغة العقود التجارية بالذكاء الاصطناعي وتوليد الاتفاقيات للشركات | JurisTech',
    titleEn: 'AI Commercial Contract Drafting & Smart Agreement Builder | JurisTech',
    descriptionAr: 'صياغة العقود التجارية والاتفاقيات الذكية وتدقيقها بالذكاء الاصطناعي — متوافقة مع أنظمة التجارة والاستثمار في السعودية والإمارات والخليج وأمريكا والأونسيترال.',
    descriptionEn: 'Generate, draft, and auto-redline commercial contracts for GCC, US States & international jurisdictions. UNCITRAL compliant with automated AI risk verification.',
  },
  '/risk': {
    titleAr: 'تحليل المخاطر القانونية للشركات وكشف ثغرات العقود التجارية | JurisTech',
    titleEn: 'Corporate Legal Risk Analysis & Contract Vulnerability Audit | JurisTech',
    descriptionAr: 'فحص وتدقيق المخاطر القانونية للشركات وكشف البنود التعسفية وثغرات المسؤولية المالية والشرط الجزائي بالذكاء الاصطناعي مع اقتراح الصياغات البديلة المعتمدة.',
    descriptionEn: 'Instant AI contract risk analysis: detect indemnification traps, uncapped liability, penalty clauses, and statutory compliance gaps across GCC & US laws.',
  },
  '/company-formation': {
    titleAr: 'تأسيس الشركات وحوكمة الشركاء وصياغة الأنظمة الأساسية | JurisTech Solutions',
    titleEn: 'Corporate Formation & Statutory Governance Suite | JurisTech Solutions',
    descriptionAr: 'تأسيس الشركات وصياغة عقود التأسيس والأنظمة الأساسية وحوكمة الشركاء بالذكاء الاصطناعي في السعودية والإمارات ومصر والأردن ودول الخليج وفق أحدث أنظمة الشركات.',
    descriptionEn: 'AI-powered corporate formation, Articles of Association drafting, partner governance mandates, and statutory compliance across Saudi Arabia, UAE, Egypt, Jordan & GCC.',
  },
  '/vault': {
    titleAr: 'خزينة المستندات المشفّرة والوثائق | JurisTech & LegalShield',
    titleEn: 'Encrypted AI Legal Vault & Document Management | JurisTech',
    descriptionAr: 'خزّن مستنداتك القانونية وتتبعها في خزينة مشفّرة آمنة مع تنبيهات انتهاء الصلاحية والبحث الذكي بالمستندات.',
    descriptionEn: 'Bank-grade encrypted legal document repository with automated expiry alerts, OCR search, and multi-jurisdictional compliance tracking.',
  },
  '/repository': {
    titleAr: 'مستودع وخزينة العقود والنماذج الذكية الموحدة (1,000,000+ عقد معتمد) | JurisTech',
    titleEn: '1,000,000+ Certified Smart Legal Contracts & Templates Vault | JurisTech',
    descriptionAr: 'أضخم مستودع وخزينة عقود ونماذج قانونية بالشرق الأوسط والعالم: تصفح أكثر من 1,000,000 عقد وتوليد وتدقيق فوري بالذكاء الاصطناعي مطابق للسعودية والإمارات ومصر والدولية.',
    descriptionEn: 'Explore 1,000,000+ certified legal contracts, corporate templates, M&A agreements, employment contracts, and SaaS SLAs fully ground in international laws.',
  },
  '/templates': {
    titleAr: 'استوديو النماذج والتوليد والتدقيق القانوني بالذكاء الاصطناعي | JurisTech',
    titleEn: 'Smart Legal Templates Studio & AI Contract Generator | JurisTech',
    descriptionAr: 'استوديو النماذج القانونية التفاعلي: صياغة وتخصيص وتدقيق المخاطر بالذكاء الاصطناعي وتصدير فورية بصيغة Word و PDF.',
    descriptionEn: 'Interactive Smart Legal Templates Studio with AI customizer, risk audit score, voice drafting, and instant PDF/Word exports for 50+ jurisdictions.',
  },
  '/negotiation': {
    titleAr: 'التفاوض التعاقدي والتوقيع الرقمي المعتمد | JurisTech & LegalShield',
    titleEn: 'AI Contract Negotiation & Digital E-Signature Studio | JurisTech',
    descriptionAr: 'التفاوض على العقود وتعليم التعديلات والتوقيع الإلكتروني بالذكاء الاصطناعي — تسريع اتفاقيات الأعمال عالمياً ومحلياً.',
    descriptionEn: 'Automate contract redlining, counter-offer recommendations, and court-admissible e-signatures for US & international commercial deals.',
  },
  '/enterprise-audit': {
    titleAr: 'تدقيق المؤسسات والامتثال التنظيمي الشامل | JurisTech & LegalShield',
    titleEn: 'Enterprise AI Compliance & Regulatory Audit Studio | JurisTech',
    descriptionAr: 'تدقيق شامل للامتثال القانوني على مستوى المؤسسات بالذكاء الاصطناعي — تحديد الثغرات والمخاطر التنظيمية وخطط المعالجة.',
    descriptionEn: 'Enterprise-grade compliance audits for US SEC, GDPR, HIPAA, CCPA/CPRA, and UNCITRAL frameworks powered by sovereign legal AI.',
  },
  '/legal-compliance': {
    titleAr: 'مركز الامتثال واللوائح التنفيذية | JurisTech & LegalShield',
    titleEn: 'Global & US Regulatory Compliance Knowledge Hub | LegalShield',
    descriptionAr: 'بقَ ممتثلاً للأنظمة العالمية — الأنظمة الأمريكية، GDPR، أونكيترال، CISG، وقوانين البيانات الخليجية.',
    descriptionEn: 'Comprehensive guide to US Federal regulations, state privacy mandates (CCPA/CPRA, NY SHIELD), GDPR, and international trade laws.',
  },
  '/lead-radar': {
    titleAr: 'رادار التحليلات الذكي واستكشاف الفرص | JurisTech',
    titleEn: 'B2B Legal Prospecting & Corporate Risk Intelligence | JurisTech',
    descriptionAr: 'رادار استكشاف الفرص والمخاطر العقدية للشركات بالذكاء الاصطناعي — تحليل سلوك الزوار والتحويل الآلي.',
    descriptionEn: 'AI-driven B2B legal prospecting and corporate risk intelligence for enterprise deal flow automation.',
  },
  '/sovereign-ai-hub': {
    titleAr: 'مركز حلول الذكاء الاصطناعي السيادي | JurisTech',
    titleEn: 'Sovereign AI Legal Infrastructure Hub | JurisTech Solutions',
    descriptionAr: 'بنية تحتية سيادية للذكاء الاصطناعي القانوني — نماذج LLM خاصة بحوكمة وتدقيق العقود الحساسة.',
    descriptionEn: 'Sovereign AI legal infrastructure hub powered by self-hosted LLM models for high-security corporate governance.',
  },
  '/b2b-proposals': {
    titleAr: 'منصة العروض التنافسية للشركات والمؤسسات | JurisTech',
    titleEn: 'Enterprise B2B Proposal Engine & AI RFP Hub | JurisTech',
    descriptionAr: 'استخراج وتجهيز العروض الفنية والمالية للشركات الكبرى بالذكاء الاصطناعي مع تدقيق الالتزامات.',
    descriptionEn: 'Automated C-Suite B2B proposal generation and RFP compliance auditing for global enterprise clients.',
  },
  '/payment': {
    titleAr: 'اشتراكات الباقات وبوابات الدفع الإلكتروني المشفّرة | JurisTech',
    titleEn: 'Enterprise Subscription & Encrypted Payment Portal | JurisTech',
    descriptionAr: 'اشترك الآن في منصة JurisTech Solutions — باقات الشركات، التحويل البنكي المباشر SWIFT، وPayPal.',
    descriptionEn: 'Upgrade your corporate legal operations. Secure checkout via PayPal, Credit Card, and Direct Bank Wire (SWIFT).',
  },
  '/support': {
    titleAr: 'مركز الدعم الفني وتذاكر المساعدة المشفّرة | JurisTech',
    titleEn: 'Encrypted Support Desk & Client Service Portal | JurisTech',
    descriptionAr: 'فريق الدعم الاستشاري والفني متاح 24/7 للإجابة على جميع الاستفسارات الفنية والعقدية.',
    descriptionEn: '24/7 technical and legal support desk for enterprise clients and platform subscribers.',
  },
  '/about': {
    titleAr: 'عن المنصة ورؤية الذكاء الاصطناعي القانوني | JurisTech Solutions',
    titleEn: 'About JurisTech Solutions & LegalShield Ecosystem',
    descriptionAr: 'تعرّف على منصة JurisTech Solutions — الرائدة عالمياً وإقليمياً في حلول الذكاء الاصطناعي القانوني للشركات.',
    descriptionEn: 'Learn about JurisTech Solutions — pioneering sovereign legal AI infrastructure and automated contract governance globally.',
  },
  '/video-hub': {
    titleAr: 'مركز الشروحات المرئية والبرامج التعليمية | JurisTech',
    titleEn: 'Video Knowledge Hub & Platform Tutorials | JurisTech',
    descriptionAr: 'شروحات مرئية تفاعلية تشرح كيفية صياغة العقود وتدقيق المخاطر بالذكاء الاصطناعي.',
    descriptionEn: 'Interactive video tutorials and practical demonstrations of AI contract audit and risk analysis.',
  },
  '/marketing': {
    titleAr: 'شراكات النمو والتوسع المؤسسي | JurisTech',
    titleEn: 'Global Growth & Strategic Enterprise Partnerships | JurisTech',
    descriptionAr: 'حلول الشراكات والنمو المؤسسي وبرامج التسويق والانتشار لمنصة JurisTech Solutions.',
    descriptionEn: 'Strategic enterprise growth, B2B partnerships, and institutional rollout programs.',
  },
  '/reports': {
    titleAr: 'مركز التقارير والتحليلات الإستراتيجية | JurisTech',
    titleEn: 'Strategic Legal Intelligence & Analytics Reports | JurisTech',
    descriptionAr: 'تقارير دورية شاملة عن مؤشرات المخاطر العقدية وتوجهات التشريعات التجارية للشركات.',
    descriptionEn: 'Comprehensive corporate legal risk metrics and legislative trend analysis reports.',
  },
  '/privacy': {
    titleAr: 'سياسة الخصوصية وحماية البيانات | JurisTech Solutions',
    titleEn: 'Privacy Policy & Data Governance Mandate | JurisTech Solutions',
    descriptionAr: 'التزامنا الكامل بحماية بياناتك وخصوصية مستنداتك وفق أسرار المهنة وتشفير AES-256 وحوكمة GDPR.',
    descriptionEn: 'Our ironclad commitment to data privacy, document encryption, SOC2 compliance, and GDPR data protection.',
  },
  '/terms': {
    titleAr: 'شروط وأحكام الاستخدام الرسمية | JurisTech Solutions',
    titleEn: 'Terms of Service & Platform Usage Agreement | JurisTech Solutions',
    descriptionAr: 'الشروط والأحكام الرسمية الحاكمة لاستخدام منصة JurisTech Solutions وحلول الذكاء الاصطناعي القانوني.',
    descriptionEn: 'Official Terms of Service governing platform usage, SLA commitments, and AI legal advisory terms.',
  },
};

export function prerenderRoutes() {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('[Prerender SEO] Error: dist/index.html does not exist.');
    return;
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  Object.entries(ROUTE_METADATA).forEach(([routePath, seo]) => {
    const cleanRoute = routePath.replace(/^\//, '');
    const routeDir = path.join(DIST_DIR, cleanRoute);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    const canonicalUrl = `${BASE_URL}${routePath}`;
    const pageTitle = `${seo.titleAr} | ${seo.titleEn}`;
    const pageDesc = `${seo.descriptionAr} ${seo.descriptionEn}`;

    // Build hreflang tags
    const hreflangTags = LANGS.map(
      (lang) => `<link rel="alternate" hreflang="${lang}" href="${canonicalUrl}" />`
    ).join('\n    ');

    let routeHtml = baseHtml;

    // Replace Title
    routeHtml = routeHtml.replace(
      /<title>.*?<\/title>/gi,
      `<title>${pageTitle}</title>`
    );

    // Replace Description
    if (routeHtml.includes('<meta name="description"')) {
      routeHtml = routeHtml.replace(
        /<meta name="description".*?>/gi,
        `<meta name="description" content="${pageDesc}" />`
      );
    } else {
      routeHtml = routeHtml.replace(
        '</head>',
        `  <meta name="description" content="${pageDesc}" />\n</head>`
      );
    }

    // Build Pre-rendered JSON-LD Structured Data Schema Block for LLM Search Engine Parsing
    const jsonLdBlock = `
    <script type="application/ld+json">
    ${JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'JurisTech Solutions & LegalShield Ecosystem',
        'url': BASE_URL,
        'logo': `${BASE_URL}/logo.png`,
        'email': 'juristech.solutions@outlook.com',
        'sameAs': [
          'https://www.linkedin.com/in/juristech-solutions-14954b427/',
          'https://www.tiktok.com/@juristech.solutio6',
          'https://legalshieldsolution.online'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'JurisTech AI Legal Assistant & Sovereign Contract Risk Analysis Suite',
        'operatingSystem': 'Web, iOS, Android, Cloud API',
        'applicationCategory': ['LegalTech', 'AI Contract Analysis', 'Automated Risk Assessment Software', 'Enterprise Sovereign Legal AI'],
        'featureList': [
          'AI-powered contract risk scoring',
          'Automated legal document analysis platform for enterprise law firms',
          'Delaware LLC & Saudi Companies Law 2026 statutory audit',
          'Instant court-admissible redlines & DOCX zero-whitespace exporter',
          'Sub-second UNCITRAL & GCC commercial code cross-examination'
        ],
        'offers': {
          '@type': 'Offer',
          'price': '0.00',
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'bestRating': '5',
          'worstRating': '1',
          'ratingCount': '2450',
          'reviewCount': '1890'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'LegalService',
        'name': 'JurisTech Solutions & LegalShield Sovereign AI Legal Platform',
        'image': `${BASE_URL}/logo.png`,
        'priceRange': '$0 - $49/mo',
        'telephone': '+201126674337',
        'url': BASE_URL,
        'areaServed': ['United States', 'US-CA', 'US-NY', 'US-TX', 'US-FL', 'US-DE', 'United Kingdom', 'European Union', 'GCC', 'Saudi Arabia', 'United Arab Emirates', 'Egypt', 'Jordan', 'Oman', 'Kuwait', 'Qatar', 'Bahrain'],
        'knowsAbout': [
          'AI-powered contract risk scoring',
          'Automated legal document analysis platform for enterprise law firms',
          'US Federal & State Contract Law',
          'Delaware Corporate Law',
          'Saudi Companies Law 2026',
          'DIFC & ADGM Commercial Regulations',
          'UNCITRAL & CISG International Commercial Law',
          'Contract Risk Redlining & E-Signatures'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'What is JurisTech Solutions and how does its AI-powered contract risk scoring work?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'JurisTech Solutions is an enterprise LegalTech platform providing AI-powered contract risk scoring, clause vulnerability detection, liability cap inspection, and sovereign legal compliance across US, UK, EU, and GCC commercial law frameworks.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How does automated legal document analysis benefit enterprise law firms and corporate legal teams?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Automated legal document analysis enables law firms and in-house counsel to audit multi-page commercial contracts in sub-second speed, identifying hidden indemnification traps, uncapped liabilities, and non-compliant terms while generating court-admissible redlines.'
            }
          },
          {
            '@type': 'Question',
            'name': 'كيف تساعد منصة تحليل العقود بالذكاء الاصطناعي في كشف المخاطر القانونية للشركات؟',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'تقوم منصة JurisTech بفحص بنود المسؤولية المالية والتعويضات غير المحدودة وغرامات التأخير وشروط عدم المنافسة ومقارنتها بالأنظمة واللوائح السيادية لحماية المنشأة من النزاعات القضائية وتوفير الصياغات البديلة المعتمدة.'
            }
          }
        ]
      }
    ])}
    </script>
    `;

    // Inject/Replace Canonical, Hreflang Tags & Pre-baked JSON-LD
    const canonicalAndHreflangBlock = `
    <!-- Pre-rendered Canonical, Regional Hreflangs & JSON-LD for AI Search Indexing -->
    <link rel="canonical" href="${canonicalUrl}" />
    ${hreflangTags}
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${pageDesc}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${pageDesc}" />
    ${jsonLdBlock}
`;

    routeHtml = routeHtml.replace('</head>', `${canonicalAndHreflangBlock}\n</head>`);

    const targetFilePath = path.join(routeDir, 'index.html');
    fs.writeFileSync(targetFilePath, routeHtml, 'utf-8');
    console.log(`[Prerender SEO] Created pre-rendered HTML for ${routePath} -> ${targetFilePath}`);
  });

  console.log('[Prerender SEO] All public routes pre-rendered with canonical URLs successfully.');
}

prerenderRoutes();
