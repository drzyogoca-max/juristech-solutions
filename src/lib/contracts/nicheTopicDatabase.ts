/**
 * src/lib/contracts/nicheTopicDatabase.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Sovereign High-Niche Legal Knowledge Base
 * Enforces Strict Topic & Subject Matching for 100% Comprehensive Domain Contracts
 * Eliminates generic boilerplate and injects deep specialized legal structures.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface NicheTopicDefinition {
  keywords: string[];
  categoryAr: string;
  categoryEn: string;
  mandatoryClausesAr: string[];
  mandatoryClausesEn: string[];
  specializedDirectivesAr: string;
  specializedDirectivesEn: string;
}

export const NICHE_TOPIC_REGISTRY: Record<string, NicheTopicDefinition> = {
  // ── 1. AGRICULTURAL & FARMING INVESTMENT (الاستثمار الزراعي) ─────────────────
  agriculture: {
    keywords: ['زراعي', 'زراعة', 'استثمار زراعي', 'محاصيل', 'حصاد', 'أرض زراعية', 'مزارع', 'ري', 'فسائل', 'نخيل', 'بيوت محمية', 'agriculture', 'farming', 'crop', 'harvest', 'irrigation', 'farmland'],
    categoryAr: 'الاستثمار الزراعي والإنتاج الحيواني والنباتي',
    categoryEn: 'Agricultural Investment & Crop Production',
    mandatoryClausesAr: [
      'حق الانتفاع العيني بالأرض الزراعية ومصادر المياه والآبار الارتوازية والكهرباء',
      'تحديد الدورة الزراعية وأنواع المحاصيل المعتمدة وجداول الغرس والحصاد',
      'آلية توزيع العوائد الصافية والمحاصيل ونسب تقاسم الأرباح أو الإيجار العيني',
      'التزامات الرعاية الزراعية والتسميد ومكافحة الآفات وفق المعايير البيئية الرسمية',
      'المخاطر الطبيعية وتلف المحاصيل والتأمين الزراعي التعاوني وصندوق الكوارث الطبيعية',
      'المنشآت الثابتة والمعدات والبيوت المحمية وآلية تسليمها عند انتهاء مدة العقد'
    ],
    mandatoryClausesEn: [
      'Usufruct rights over farmland, water wells, irrigation networks, and power supply',
      'Approved crop types, seasonal harvest schedules, and agricultural rotation cycles',
      'Net crop yield revenue distribution, harvest sharing ratios, or in-kind tenancy',
      'Agronomic care, organic fertilization, and pest control under statutory environmental codes',
      'Crop casualty risk allocation, extreme weather force majeure, and agricultural insurance',
      'Fixed agricultural installations, greenhouses, irrigation pivots, and handover protocol'
    ],
    specializedDirectivesAr: `يجب صياغة العقد كعقد استثمار زراعي متخصص وشامل:
- تضمين مواسم الحصاد والتوريد الزراعي.
- تنظيم استغلال الموارد المائية وحصص الري والآبار المرخصة.
- حماية الأصول الزراعية وفسائل ومعدات الري بالتنقيط.
- تحديد مسؤولية الأطراف في حال الكوارث والجوائح الزراعية.`,
    specializedDirectivesEn: `Draft the contract strictly as a High-Specialized Agricultural Investment Agreement:
- Include crop yield sharing ratios, harvesting seasons, and market supply schedules.
- Regulate water rights, licensed borehole extraction, and drip-irrigation power allocations.
- Protect fixed agronomic assets, pivots, greenhouses, and seedling ownership.
- Allocate pest epidemics and climatic hardship risks with statutory mitigation measures.`
  },

  // ── 2. FIDIC & CONSTRUCTION ENGINEERING (المقاولات والتشييد الهندسي) ─────────
  construction: {
    keywords: ['مقاولات', 'مقاول', 'بناء', 'تشييد', 'هندسي', 'فيديك', 'مقاولة', 'تشطيب', 'إنشاءات', 'ترميم', 'استشاري', 'construction', 'contractor', 'fidic', 'epc', 'building', 'civil works', 'engineering'],
    categoryAr: 'المقاولات والإنشاءات الهندسية ومشاريع البنية التحتية',
    categoryEn: 'Construction, Civil Engineering & FIDIC Projects',
    mandatoryClausesAr: [
      'نطاق الأعمال والمخططات الهندسية وجداول الكميات المعتمدة (BOQ)',
      'الجدول الزمني للإنجاز ومراحل التسليم المرحلي (Milestones)',
      'شروط وأوامر التغيير والتعديل الإنشائي (Variation Orders & Change Directives)',
      'الاستلام الابتدائي والملاحظات وفترة الصيانة والاستلام النهائي (TOC & Final Handover)',
      'الشرط الجزائي وغرامات التأخير اليومية المحددة بما لا يتجاوز 10% من القيمة الإجمالية',
      'الضمان العشري للمباني والمنشآت وفق نصوص القانون المدني وخطابات الضمان البنكي'
    ],
    mandatoryClausesEn: [
      'Scope of works, technical specifications, and approved Bill of Quantities (BOQ)',
      'Master baseline execution schedule and milestone project milestones',
      'Variation orders, scope adjustment pricing, and formal architect change procedures',
      'Substantial completion taking-over certificate (TOC), snagging list, and final acceptance',
      'Liquidated delay damages calculated per calendar day subject to statutory caps (10%)',
      'Decennial structural liability under civil codes, advance payment guarantees, and performance bonds'
    ],
    specializedDirectivesAr: `يجب صياغة العقد كعقد مقاولة وتشييد هندسي متخصص طبقاً لمعايير FIDIC والقانون المدني:
- تفصيل أوامر التغيير وضبط التكلفة والمدد الإضافية.
- اشتراط تقديم خطاب ضمان حسن التنفيذ والضمان الابتدائي.
- تفعيل الضمان العشري لسلامة الهيكل الخرساني والإنشائي.
- آلية الاستلام الابتدائي والنهائي وحجز نسبة الضمان (Retention Money).`,
    specializedDirectivesEn: `Draft the contract strictly as a Professional FIDIC-Standard Construction Agreement:
- Regulate architect instructions, variation order mechanics, and time extension claims.
- Mandate bank performance guarantees and advance payment security bonds.
- Enforce strict decennial liability for structural integrity and foundations.
- Detail the 5-10% retention money release mechanics upon Final Completion Certificate.`
  },

  // ── 3. FRANCHISE & DISTRIBUTION (الامتياز التجاري والوكالات) ─────────────────
  franchise: {
    keywords: ['امتياز', 'فرنشايز', 'امتياز تجاري', 'مانح الامتياز', 'ممنوح الامتياز', 'وكالة تجارية', 'علامة تجارية', 'franchise', 'franchisor', 'franchisee', 'royalty', 'master franchise', 'commercial agency'],
    categoryAr: 'الامتياز التجاري والوكالات التجارية وتوزيع العلامات',
    categoryEn: 'Commercial Franchise & Exclusive Distribution',
    mandatoryClausesAr: [
      'منح ترخيص استغلال العلامة التجارية والاسم التجاري وحقوق الملكية الصناعية',
      'النطاق الجغرافي الحصري للممنوح وحظر افتتاح فروع أخرى في المنطقة المحمية',
      'رسوم الامتياز الأولية (Upfront Fee) ونسبة الإتاوة الدورية (Royalty) ومساهمة التسويق',
      'دليل التشغيل والمعايير الفنية وسرية الوصفات وسلاسل الإمداد المعتمدة حصراً',
      'حقوق التفتيش والمراجعة الدورية وتدريب وتأهيل الكوادر البشرية للممنوح',
      'آثار إنهاء الامتياز، وحظر المنافسة اللاحق لمدة سنتين، وتجريد الفروع من الهوية'
    ],
    mandatoryClausesEn: [
      'Grant of proprietary trademark, trade dress, and industrial system license',
      'Protected territory boundaries and franchisor direct/indirect encroachment covenants',
      'Initial franchise fee, ongoing monthly gross royalty percentage, and brand marketing fund',
      'Proprietary Operations Manual adherence, secret formulation protection, and mandatory supply chains',
      'Franchisor audit and quality inspection rights, and mandatory staff training protocols',
      'Post-termination de-identification, trade secret surrender, and 2-year non-compete covenant'
    ],
    specializedDirectivesAr: `يجب صياغة العقد كعقد امتياز تجاري (Franchise) عالي المستوى متوافق مع أنظمة الامتياز التجاري:
- حماية سرية دليل التشغيل والوصفات وطرق الإعداد.
- تحديد الإتاوة الشهرية من إجمالي المبيعات بدقة.
- قيد الالتزام بسلاسل التوريد المعتمدة حصراً لمنع تشويه جودة العلامة.
- حظر المنافسة الصارم بعد الإنهاء لمدة لا تقل عن 24 شهراً.`,
    specializedDirectivesEn: `Draft the contract strictly as a Premier International Franchise Agreement:
- Secure absolute confidentiality over confidential operations manuals and proprietary formulas.
- Explicitly define monthly royalty percentages on gross revenue without unauthorized deductions.
- Require mandatory sourcing from certified supply chains to safeguard trademark goodwill.
- Impose robust 24-month post-termination non-compete and trade dress decommissioning obligations.`
  },

  // ── 4. MERGERS & ACQUISITIONS (الاستحواذ وشراء الحصص والأسهم) ───────────────
  acquisition: {
    keywords: ['استحواذ', 'شراء أسهم', 'شراء حصص', 'اندماج', 'صفقة', 'نقل ملكية شركة', 'فحص نافي للجهالة', 'spa', 'apa', 'acquisition', 'merger', 'share purchase', 'asset purchase', 'due diligence', 'takeover'],
    categoryAr: 'الاستحواذ والاندماج وشراء الحصص والأسهم (M&A)',
    categoryEn: 'Mergers, Acquisitions & Share Purchase (SPA/APA)',
    mandatoryClausesAr: [
      'تحديد الأسهم أو الحصص المستحوذ عليها ونسبة الملكية في رأس مال الشركة المستهدفة',
      'المقابل المالي وثمن الشراء وتعديلات سعر الإغلاق وحساب الضمان البنكي (Escrow)',
      'الإقرارات والضمانات الجوهرية (Representations & Warranties) للبائع عن الموقف المالي والضريبي',
      'شروط الإغلاق المسبقة (Conditions Precedent) وموافقات الجهات التنظيمية والمنافسة',
      'التزام التعويض عن الالتزامات السابقة غير المفصح عنها والديون الخفية (Indemnification)',
      'حظر منافسة البائع وعدم استقطاب الموظفين والعملاء لمدة 3 سنوات من تاريخ الإغلاق'
    ],
    mandatoryClausesEn: [
      'Exact target equity shares, capitalization table, and ownership transfer scope',
      'Purchase price consideration, working capital adjustments, and escrow holdback account',
      'Comprehensive seller representations and warranties (tax, litigation, environmental, IP)',
      'Conditions precedent to closing, regulatory clearances, and antitrust merger approvals',
      'Seller indemnity hold harmless obligations, de minimis thresholds, and liability caps',
      '3-year post-closing seller non-competition and key employee non-solicitation covenants'
    ],
    specializedDirectivesAr: `يجب صياغة العقد كعقد شراء أسهم وحصص مؤسسي واستحواذ سيادي (SPA):
- وضع جدول إقرارات وضمانات صارمة تحمي المشتري من الضرائب والنزاعات السابقة.
- النص على آلية حجز جزء من الثمن في حساب Escrow لتغطية الالتزامات الطارئة.
- تنظيم التزامات ما قبل الإغلاق وما بعد الإغلاق وإجراءات التنازل لدى وزارة التجارة.`,
    specializedDirectivesEn: `Draft the contract strictly as a Top-Tier Corporate Share Purchase Agreement (SPA):
- Include robust seller representations covering historical taxes, undisclosed liabilities, and IP titles.
- Implement a dedicated escrow holdback mechanism to absorb post-closing indemnification claims.
- Structure interim pre-closing operational covenants and formal regulatory closing filings.`
  },

  // ── 5. SAAS, CLOUD & AI LICENSING (البرمجيات والأنظمة السحابية والذكاء الاصطناعي) ──
  technology: {
    keywords: ['برمجيات', 'سحابي', 'ذكاء اصطناعي', 'تطوير تطبيق', 'موقع الكتروني', 'ترخيص برنامج', 'ربط برمجي', 'api', 'saas', 'software', 'cloud', 'ai', 'sla', 'uptime', 'source code', 'licensing'],
    categoryAr: 'تقنية المعلومات والبرمجيات السحابية وتراخيص الذكاء الاصطناعي',
    categoryEn: 'Information Technology, Cloud SaaS & AI Licensing',
    mandatoryClausesAr: [
      'نطاق الترخيص البرمجي وحقوق الاستخدام غير الحصري والسحابي للمنصة (SaaS Grant)',
      'مستوى الخدمة وضمان التوفر بنسبة 99.9% شهرياً (Service Level Agreement SLA) وأرصدة الأعطال',
      'أمن البيانات، التشفير بمعايير AES-256، والامتثال لقوانين حماية البيانات الشخصية والأمن السيبراني',
      'ملكية الشفرة المصدرية وحقوق الملكية الفكرية وتضمين بيانات تدريب نماذج الذكاء الاصطناعي',
      'إجراءات النسخ الاحتياطي المستمر، التعافي من الكوارث، وخطة استمرارية الأعمال',
      'حدود المسؤولية واستبعاد الأضرار التبعية واسترجاع البيانات وتصديرها عند إنهاء الاشتراك'
    ],
    mandatoryClausesEn: [
      'Software-as-a-Service (SaaS) subscription license grant, authorized seats, and usage limits',
      '99.9% monthly uptime service level guarantee (SLA), maintenance windows, and service outage credits',
      'Data protection, AES-256 encryption at rest/transit, and statutory privacy/cybersecurity compliance',
      'Source code intellectual property reservation, background IP, and AI model training data rights',
      'Automated disaster recovery architectures, data escrow, and continuous failover protocols',
      'Limitation of liability, indirect damage exclusion, and secure data export upon subscription expiry'
    ],
    specializedDirectivesAr: `يجب صياغة العقد كعقد ترخيص برمجي وسحابي متقدم (Enterprise SaaS & SLA):
- تحديد التزامات التوفر بنسبة 99.9% مع جدول معالجة الأعطال حسب درجة الأولوية.
- حماية أمن البيانات وسريتها ومنع استخدام بيانات العميل في تدريب نماذج الذكاء الاصطناعي دون إذن.
- النص على بروتوكول تصدير واسترجاع البيانات عند انتهاء العقد بصيغ مفتوحة ومشفرة.`,
    specializedDirectivesEn: `Draft the contract strictly as an Enterprise Cloud SaaS & SLA Master Agreement:
- Guarantee 99.9% uptime metrics with formal priority incident resolution turnaround SLAs.
- Guard enterprise customer data with strict bans on unauthorized AI model training.
- Mandate structured data return, purge certificates, and uninterrupted data portability upon exit.`
  },

  // ── 6. REAL ESTATE LEASE & ASSET MANAGEMENT (الإيجار التجاري والتطوير العقاري) ──
  realestate: {
    keywords: ['إيجار', 'عقار', 'مكتب', 'مجمع تجاري', 'إيجار تجاري', 'مستودع', 'تطوير عقاري', 'مؤجر', 'مستأجر', 'lease', 'commercial lease', 'tenancy', 'real estate', 'landlord', 'tenant', 'property management'],
    categoryAr: 'الإيجار التجاري والتطوير وإدارة الأصول العقارية',
    categoryEn: 'Commercial Real Estate Lease & Property Management',
    mandatoryClausesAr: [
      'وصف العين المؤجرة بدقة، مساحتها، والمرافق المشتركة ومواقف السيارات التابعة لها',
      'القيمة الإيجارية السنوية، جدول الدفعات، ونسب الزيادة الدورية المعتمدة',
      'التأمين النقدي لضمان الصيانة وإعادة العين المؤجرة بحالتها الأصلية',
      'توزيع التزامات الصيانة الدورية والصيانة الهيكلية والأساسية بين المؤجر والمستأجر',
      'الاستخدام المخصص للعين المؤجرة والاشتراطات البلدية والدفاع المدني ورخص المهن',
      'حالات الإخلاء وفسخ العقد وإخطارات الإنهاء وحق المؤجر في استرداد الحيازة'
    ],
    mandatoryClausesEn: [
      'Demised premises technical description, gross leasable area (GLA), common areas, and parking',
      'Base annual rent, escalation percentage index, and structured installment schedule',
      'Security deposit escrow requirements and condition restoration inspection protocols',
      'Structural versus operational and interior tenant maintenance allocation matrix',
      'Permitted commercial use, municipal compliance, civil defense permits, and licensing warranties',
      'Default remedies, eviction procedures, cure notices, and landlord repossession rights'
    ],
    specializedDirectivesAr: `يجب صياغة العقد كعقد إيجار تجاري واستثماري مؤسسي متكامل:
- تحديد مسؤولية التراخيص البلدية والدفاع المدني بدقة.
- وضع بند واضح للمحافظة على العين المؤجرة وإجراء التحسينات الديكورية.
- النص على آلية واضحة لإعادة العين وتسليمها عند انتهاء المدة بدون نزاعات.`,
    specializedDirectivesEn: `Draft the contract strictly as an Institutional Commercial Real Estate Lease:
- Establish precise landlord vs. tenant civil defense and municipal licensing warranties.
- Regulate tenant fit-out alterations, structural protection, and restoration upon surrender.
- Frame enforceable expedited lease recovery mechanics upon uncurable monetary defaults.`
  }
};

/**
 * Match a user contract title/topic to the most specific niche definition
 */
export function matchNicheTopic(topicOrTitle: string): NicheTopicDefinition | null {
  if (!topicOrTitle) return null;
  const clean = topicOrTitle.toLowerCase().trim();

  for (const key of Object.keys(NICHE_TOPIC_REGISTRY)) {
    const entry = NICHE_TOPIC_REGISTRY[key];
    const matched = entry.keywords.some((kw) => clean.includes(kw.toLowerCase()));
    if (matched) {
      return entry;
    }
  }

  return null;
}
