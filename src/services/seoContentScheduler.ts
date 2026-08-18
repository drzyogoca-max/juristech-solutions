/**
 * src/services/seoContentScheduler.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * v2.0 — Automated Multilingual Legal Blog, CMS Publisher & Landing Page Engine
 * Extended with 10+ SEO-targeted articles, JSON-LD Schema, and dynamic landing page generation
 */

export interface LegalArticle {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  targetMarket: 'US' | 'EU' | 'Gulf' | 'Egypt' | 'Jordan' | 'Global';
  jurisdiction: string;
  category: 'Contract Law' | 'eIDAS & Signatures' | 'Corporate Governance' | 'GDPR & Privacy' | 'Company Formation' | 'Labor Law' | 'SWIFT & Banking' | 'AI & LegalTech';
  summary: string;
  summaryAr?: string;
  keywords: string[];
  publishedAt: string;
  readTimeMinutes: number;
  schema?: Record<string, unknown>;
}

export interface LandingPage {
  slug: string;
  title: string;
  titleAr: string;
  keyword: string;
  jurisdiction: string;
  metaDescription: string;
  heroText: string;
  ctaUrl: string;
}

// ─── JSON-LD Schema builder ────────────────────────────────────────────────────

function buildArticleSchema(article: LegalArticle): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalForumPosting',
    'name': article.title,
    'headline': article.title,
    'description': article.summary,
    'keywords': article.keywords.join(', '),
    'datePublished': article.publishedAt,
    'author': {
      '@type': 'Organization',
      'name': 'JurisTech Solutions',
      'url': 'https://juristech.solutions',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'JurisTech Solutions',
      'logo': { '@type': 'ImageObject', 'url': 'https://juristech.solutions/logo.png' },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://juristech.solutions/blog/${article.slug}`,
    },
  };
}

class SeoContentScheduler {
  private articles: LegalArticle[] = [
    // ── Original Articles ──────────────────────────────────────────────────────
    {
      id: 'art-1',
      title: 'eIDAS Digital Signatures: Comprehensive Legal Guide for Cross-Border Contracts',
      titleAr: 'التوقيعات الرقمية وفق لائحة eIDAS: الدليل القانوني الشامل للعقود العابرة للحدود',
      slug: 'eidas-digital-signatures-cross-border-contracts',
      targetMarket: 'EU',
      jurisdiction: 'EU',
      category: 'eIDAS & Signatures',
      summary: 'Understanding EU Regulation 910/2014 and how cryptographic SHA-256 signatures ensure legal enforceability across 27 EU member states.',
      keywords: ['eIDAS', 'digital signature', 'cross-border contracts', 'EU regulation', 'qualified electronic signature', 'QES'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 5,
    },
    {
      id: 'art-2',
      title: 'GCC Corporate Compliance & Bank Wire SWIFT Transfer Verification',
      titleAr: 'الامتثال المؤسسي الخليجي والتحقق من حوالات SWIFT البنكية',
      slug: 'gcc-corporate-compliance-swift-wire-verification',
      targetMarket: 'Gulf',
      jurisdiction: 'GCC',
      category: 'SWIFT & Banking',
      summary: 'Best practices for Middle East enterprises conducting wire transfers and maintaining anti-fraud SWIFT MT103 audit trails under FATF 2023.',
      keywords: ['SWIFT', 'wire transfer', 'GCC compliance', 'FATF', 'MT103', 'IBAN', 'bank transfer audit'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 4,
    },
    {
      id: 'art-3',
      title: 'US & International Data Privacy: Harmonizing GDPR and CCPA Regulations',
      slug: 'us-international-data-privacy-gdpr-ccpa',
      targetMarket: 'US',
      jurisdiction: 'US',
      category: 'GDPR & Privacy',
      summary: 'Strategies for global law firms to maintain automated data privacy compliance across GDPR (EU 2016/679) and CCPA (California Consumer Privacy Act) jurisdictions.',
      keywords: ['GDPR', 'CCPA', 'data privacy', 'data protection', 'privacy compliance', 'SCCs'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 6,
    },

    // ── NEW SEO-Targeted Articles ──────────────────────────────────────────────

    {
      id: 'art-4',
      title: 'Company Formation in Saudi Arabia: Complete 2025 Guide (LLC, SJSC, Freezone)',
      titleAr: 'تأسيس شركة في السعودية 2025: الدليل الكامل (ذ.م.م، مساهمة مبسطة، منطقة حرة)',
      slug: 'company-formation-saudi-arabia-2025-guide',
      targetMarket: 'Gulf',
      jurisdiction: 'SA',
      category: 'Company Formation',
      summary: 'Step-by-step guide to registering an LLC or simplified joint-stock company in Saudi Arabia under the new Companies Law (Royal Decree M/132), including capital requirements, MOCI registration, and Zakat enrollment.',
      summaryAr: 'دليل خطوة بخطوة لتسجيل شركة ذ.م.م أو شركة مساهمة مبسطة في المملكة العربية السعودية وفق نظام الشركات الجديد (مرسوم م/132).',
      keywords: ['company formation Saudi Arabia', 'تأسيس شركة السعودية', 'LLC Saudi Arabia', 'نظام الشركات م/132', 'MOCI', 'Absher business', 'Saudi business license'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 7,
    },
    {
      id: 'art-5',
      title: 'Company Formation in UAE: 100% Foreign Ownership Guide (Mainland & Freezone)',
      titleAr: 'تأسيس شركة في الإمارات: دليل التملك الأجنبي 100% (البر والمنطقة الحرة)',
      slug: 'company-formation-uae-foreign-ownership-freezone',
      targetMarket: 'Gulf',
      jurisdiction: 'AE',
      category: 'Company Formation',
      summary: 'Complete guide to UAE company formation under Federal Decree-Law 32/2021, covering 100% foreign ownership on mainland, JAFZA, RAKEZ, DIFC, and ADGM freezone options with zero corporate tax benefits.',
      summaryAr: 'الدليل الكامل لتأسيس شركة في الإمارات وفق المرسوم الاتحادي 32/2021، يشمل التملك 100% للأجانب في البر الرئيسي والمناطق الحرة.',
      keywords: ['company formation UAE', 'تأسيس شركة الإمارات', 'UAE freezone', 'JAFZA', 'DIFC', '100% foreign ownership UAE', 'DED license'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 6,
    },
    {
      id: 'art-6',
      title: 'How to Register a Company in Egypt: Legal Requirements & GAFI Fast-Track (2025)',
      titleAr: 'كيف تؤسس شركة في مصر: المتطلبات القانونية والمسار السريع GAFI 2025',
      slug: 'company-registration-egypt-gafi-legal-requirements-2025',
      targetMarket: 'Egypt',
      jurisdiction: 'EG',
      category: 'Company Formation',
      summary: 'How to register a company in Egypt under Companies Law 159/1981 and Investment Law 72/2017, including GAFI one-stop-shop, tax card, and commercial registry requirements.',
      keywords: ['company formation Egypt', 'تأسيس شركة مصر', 'GAFI Egypt', 'Egyptian companies law', 'قانون الشركات المصري', 'commercial registry Egypt'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 5,
    },
    {
      id: 'art-7',
      title: 'AI Contract Auditing vs. Traditional Law Firms: Speed, Cost & Accuracy Comparison',
      titleAr: 'تدقيق العقود بالذكاء الاصطناعي مقابل مكاتب المحاماة التقليدية: مقارنة السرعة والتكلفة والدقة',
      slug: 'ai-contract-auditing-vs-traditional-law-firms',
      targetMarket: 'Global',
      jurisdiction: 'GLOBAL',
      category: 'AI & LegalTech',
      summary: 'Data-driven comparison showing how AI legal platforms like JurisTech Solutions reduce contract review time from 72 hours to under 3 seconds while achieving 94%+ accuracy across 15 jurisdictions.',
      keywords: ['AI contract review', 'legal AI', 'contract auditing AI', 'AI legal tech', 'contract risk analysis', 'automated contract review'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 5,
    },
    {
      id: 'art-8',
      title: 'Force Majeure Clauses: A Comparative Analysis Across GCC, EU, and US Law',
      titleAr: 'بنود القوة القاهرة: تحليل مقارن بين قوانين الخليج والاتحاد الأوروبي والولايات المتحدة',
      slug: 'force-majeure-clauses-comparative-gcc-eu-us',
      targetMarket: 'Global',
      jurisdiction: 'GLOBAL',
      category: 'Contract Law',
      summary: 'Legal comparison of force majeure provisions across Saudi Civil Law (M/191), UAE Civil Code (Art. 249), Egyptian Civil Code (Art. 165), ICC 2020 Force Majeure Clause, and US Restatement (Second) of Contracts.',
      keywords: ['force majeure', 'قوة قاهرة', 'force majeure GCC', 'force majeure UAE', 'ICC force majeure clause', 'contract termination'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 8,
    },
    {
      id: 'art-9',
      title: 'International Arbitration Guide: ICC vs DIAC vs CRCICA vs LCIA (2025)',
      titleAr: 'دليل التحكيم الدولي: ICC مقابل DIAC مقابل CRCICA مقابل LCIA 2025',
      slug: 'international-arbitration-icc-diac-crcica-lcia-guide-2025',
      targetMarket: 'Global',
      jurisdiction: 'GLOBAL',
      category: 'Contract Law',
      summary: 'Comprehensive guide comparing ICC Paris, DIAC Dubai, CRCICA Cairo, and LCIA London arbitration rules — covering fees, timelines, enforceability under New York Convention, and strategic selection for MENA disputes.',
      keywords: ['international arbitration', 'ICC arbitration', 'DIAC', 'CRCICA', 'LCIA', 'التحكيم الدولي', 'New York Convention', 'arbitration clause'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 9,
    },
    {
      id: 'art-10',
      title: 'ERP Integration with Legal Contract Management Systems: SAP, Odoo & Salesforce',
      slug: 'erp-integration-legal-contract-management-sap-odoo-salesforce',
      targetMarket: 'Global',
      jurisdiction: 'GLOBAL',
      category: 'AI & LegalTech',
      summary: 'How enterprises are integrating ERP systems (SAP S/4HANA, Odoo, Salesforce) with AI-powered legal contract management platforms via REST API and Webhook for real-time contract lifecycle automation.',
      keywords: ['ERP legal integration', 'SAP contract management', 'Odoo legal', 'Salesforce CLM', 'contract lifecycle management', 'legal tech integration'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 6,
    },
    {
      id: 'art-11',
      title: 'NDA Drafting Best Practices: Mutual vs One-Way Confidentiality Agreements (2025)',
      titleAr: 'أفضل ممارسات صياغة اتفاقيات السرية NDA: المتبادلة والأحادية الجانب 2025',
      slug: 'nda-drafting-best-practices-mutual-one-way-2025',
      targetMarket: 'Global',
      jurisdiction: 'GLOBAL',
      category: 'Contract Law',
      summary: 'Expert guide on drafting enforceable NDAs covering definition of confidential information, exclusions, term & termination, jurisdiction, remedies for breach, and AI-assisted risk redlining.',
      keywords: ['NDA drafting', 'non-disclosure agreement', 'اتفاقية سرية', 'confidentiality agreement', 'NDA template', 'NDA clauses'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 7,
    },
    {
      id: 'art-12',
      title: 'Saudi Labor Law 2025: Key Rights for Employees & Employers (M/51 Updates)',
      titleAr: 'نظام العمل السعودي 2025: أبرز حقوق العمال وأصحاب العمل (تحديثات م/51)',
      slug: 'saudi-labor-law-2025-employee-employer-rights',
      targetMarket: 'Gulf',
      jurisdiction: 'SA',
      category: 'Labor Law',
      summary: 'Updated guide to Saudi Labor Law (Royal Decree M/51) covering probationary periods (90-180 days), end-of-service rewards, wrongful termination compensation (Article 77), and HRSD enforcement mechanisms.',
      keywords: ['Saudi labor law', 'نظام العمل السعودي', 'نهاية الخدمة السعودية', 'فصل تعسفي السعودية', 'Saudi employment law', 'HRSD Saudi Arabia'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 6,
    },
    {
      id: 'art-13',
      title: 'Bahrain & Kuwait Company Registration: GCC Investment Guide 2025',
      titleAr: 'تسجيل شركة في البحرين والكويت: دليل الاستثمار الخليجي 2025',
      slug: 'bahrain-kuwait-company-registration-gcc-investment-guide',
      targetMarket: 'Gulf',
      jurisdiction: 'GCC',
      category: 'Company Formation',
      summary: 'Step-by-step guide to registering companies in Bahrain (SIJILAT platform) and Kuwait (MoCI registry), including 100% foreign ownership eligibility, capital requirements, and freezone options.',
      keywords: ['company registration Bahrain', 'تأسيس شركة البحرين', 'تأسيس شركة الكويت', 'SIJILAT Bahrain', 'Kuwait company formation', 'GCC investment'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 6,
    },
  ];

  public getScheduledArticles(): LegalArticle[] {
    return this.articles.map((a) => ({ ...a, schema: buildArticleSchema(a) }));
  }

  public getArticlesByMarket(market: LegalArticle['targetMarket']): LegalArticle[] {
    return this.articles.filter((a) => a.targetMarket === market || a.targetMarket === 'Global');
  }

  public getArticlesByKeyword(keyword: string): LegalArticle[] {
    const kw = keyword.toLowerCase();
    return this.articles.filter((a) =>
      a.keywords.some((k) => k.toLowerCase().includes(kw)) ||
      a.title.toLowerCase().includes(kw) ||
      (a.titleAr || '').includes(kw)
    );
  }

  public scheduleWeeklyPublish(): LegalArticle {
    console.log('[SEO Content Scheduler] Running automated weekly article scheduler...');
    const newArt: LegalArticle = {
      id: `art_${Date.now()}`,
      title: `AI Legal Intelligence Weekly: Contract Risk Mitigation Update ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      slug: `ai-legal-intelligence-weekly-${Date.now()}`,
      targetMarket: 'Global',
      jurisdiction: 'GLOBAL',
      category: 'AI & LegalTech',
      summary: 'Automated weekly research digest on AI contract risk auditing, statutory RAG integration updates, and global legal compliance shifts.',
      keywords: ['AI legal', 'contract risk', 'legal update', 'JurisTech Solutions'],
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 5,
    };
    this.articles.unshift(newArt);
    return newArt;
  }

  /**
   * Generate a dynamic SEO landing page spec for a given keyword/jurisdiction
   */
  public generateLandingPageContent(keyword: string, jurisdiction: string, lang: 'ar' | 'en' = 'en'): LandingPage {
    const jurisdictionNames: Record<string, { en: string; ar: string }> = {
      SA: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
      AE: { en: 'UAE', ar: 'الإمارات العربية المتحدة' },
      EG: { en: 'Egypt', ar: 'جمهورية مصر العربية' },
      JO: { en: 'Jordan', ar: 'المملكة الأردنية الهاشمية' },
      KW: { en: 'Kuwait', ar: 'دولة الكويت' },
      BH: { en: 'Bahrain', ar: 'مملكة البحرين' },
      QA: { en: 'Qatar', ar: 'دولة قطر' },
      GLOBAL: { en: 'Globally', ar: 'دولياً' },
    };

    const j = jurisdictionNames[jurisdiction] || { en: jurisdiction, ar: jurisdiction };
    const slug = `${keyword.toLowerCase().replace(/\s+/g, '-')}-${jurisdiction.toLowerCase()}`;

    return {
      slug,
      title: `${keyword} in ${j.en} — AI-Powered Legal Platform | JurisTech Solutions`,
      titleAr: `${keyword} في ${j.ar} — منصة الذكاء الاصطناعي القانوني | JurisTech Solutions`,
      keyword,
      jurisdiction,
      metaDescription: `Expert ${keyword} services in ${j.en} powered by AI. Instant contract auditing, legal compliance, and statutory analysis across all jurisdictions. Try free at JurisTech Solutions.`,
      heroText: lang === 'ar'
        ? `احصل على استشارة قانونية فورية بالذكاء الاصطناعي لـ "${keyword}" في ${j.ar}. تحليل تشريعي شامل، تدقيق عقود، وامتثال قانوني في ثوانٍ.`
        : `Get instant AI-powered legal guidance for "${keyword}" in ${j.en}. Comprehensive statutory analysis, contract auditing, and compliance checks in seconds.`,
      ctaUrl: 'https://juristech.solutions/chat',
    };
  }
}

export const seoContentScheduler = new SeoContentScheduler();
