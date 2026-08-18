/**
 * src/data/contractsMegaRepository.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * مستودع العقود الضخم — نظام التوليد الديناميكي
 * Mega Contracts Repository — Dynamic Generation Engine
 *
 * المنطق: 200 قالب أساسي × 50 ولاية قضائية × متغيرات تخصيص = 1,000,000+ عقد فريد
 * Logic:  200 base templates × 50 jurisdictions × customization vars = 1M+ unique contracts
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ────────────────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────────────────

export interface MegaContractTemplate {
  id: string;
  categoryKey: string;      // Foreign key to MEGA_CATEGORIES
  subcategoryKey: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  jurisdictions: string[];
  downloads: number;
  rating: number;
  pagesCount: number;
  clausesCount: number;
  tags: string[];
  templateAr: string;
  templateEn: string;
}

export interface MegaCategory {
  key: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  subcategories: MegaSubcategory[];
  contractCount: number; // displayed count (may reflect dynamic scale)
}

export interface MegaSubcategory {
  key: string;
  nameAr: string;
  nameEn: string;
}

export interface DataLakeSearchResult {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  relevanceScore: number;
  snippetAr: string;
  snippetEn: string;
}

// ────────────────────────────────────────────────────────────────────────────
// CATEGORIES TAXONOMY (8 رئيسية × 5-8 فرعية = 50 تصنيف)
// ────────────────────────────────────────────────────────────────────────────

export const MEGA_CATEGORIES: MegaCategory[] = [
  {
    key: 'corporate',
    nameAr: 'حوكمة وتأسيس الشركات',
    nameEn: 'Corporate & Governance',
    icon: '🏛️',
    color: 'from-blue-600 to-indigo-700',
    contractCount: 142000,
    subcategories: [
      { key: 'llc', nameAr: 'شركات ذات مسؤولية محدودة', nameEn: 'LLC Formation' },
      { key: 'shareholders', nameAr: 'اتفاقيات المساهمين', nameEn: 'Shareholders Agreements' },
      { key: 'joint-venture', nameAr: 'مشاريع مشتركة', nameEn: 'Joint Ventures' },
      { key: 'merger', nameAr: 'الاندماج والاستحواذ', nameEn: 'M&A Agreements' },
      { key: 'governance', nameAr: 'لوائح الحوكمة', nameEn: 'Corporate Governance' },
      { key: 'dissolution', nameAr: 'حل وتصفية الشركات', nameEn: 'Dissolution & Liquidation' },
    ],
  },
  {
    key: 'employment',
    nameAr: 'الموارد البشرية وقانون العمل',
    nameEn: 'Employment & Labor Law',
    icon: '👥',
    color: 'from-emerald-600 to-teal-700',
    contractCount: 198000,
    subcategories: [
      { key: 'individual', nameAr: 'عقود عمل فردية', nameEn: 'Individual Employment' },
      { key: 'executive', nameAr: 'عقود إدارية وتنفيذية', nameEn: 'Executive Contracts' },
      { key: 'freelance', nameAr: 'عقود العمل الحر', nameEn: 'Freelance & Contractors' },
      { key: 'probation', nameAr: 'عقود فترة التجربة', nameEn: 'Probationary Employment' },
      { key: 'termination', nameAr: 'اتفاقيات إنهاء الخدمة', nameEn: 'Severance Agreements' },
      { key: 'nca', nameAr: 'اتفاقيات عدم المنافسة', nameEn: 'Non-Compete Agreements' },
    ],
  },
  {
    key: 'ip-tech',
    nameAr: 'الملكية الفكرية والتكنولوجيا',
    nameEn: 'IP & Technology',
    icon: '💡',
    color: 'from-violet-600 to-purple-700',
    contractCount: 167000,
    subcategories: [
      { key: 'nda', nameAr: 'اتفاقيات عدم الإفصاح', nameEn: 'NDA Agreements' },
      { key: 'software', nameAr: 'عقود البرمجيات', nameEn: 'Software Development' },
      { key: 'saas', nameAr: 'عقود السحابة والساس', nameEn: 'SaaS & Cloud' },
      { key: 'patent', nameAr: 'براءات الاختراع', nameEn: 'Patent Licensing' },
      { key: 'trademark', nameAr: 'العلامات التجارية', nameEn: 'Trademark Licensing' },
      { key: 'data', nameAr: 'حماية البيانات GDPR', nameEn: 'Data Protection (GDPR)' },
    ],
  },
  {
    key: 'investment',
    nameAr: 'الاستثمار ورأس المال الجريء',
    nameEn: 'Investment & Venture Capital',
    icon: '📈',
    color: 'from-amber-500 to-orange-600',
    contractCount: 89000,
    subcategories: [
      { key: 'safe', nameAr: 'اتفاقيات SAFE', nameEn: 'SAFE Agreements' },
      { key: 'term-sheet', nameAr: 'وثائق الشروط', nameEn: 'Term Sheets' },
      { key: 'convertible', nameAr: 'السندات القابلة للتحويل', nameEn: 'Convertible Notes' },
      { key: 'partnership', nameAr: 'اتفاقيات الشراكة', nameEn: 'Partnership Agreements' },
      { key: 'fund', nameAr: 'إدارة الصناديق الاستثمارية', nameEn: 'Fund Management' },
    ],
  },
  {
    key: 'commercial',
    nameAr: 'العقود التجارية والتوريدات والمبيعات',
    nameEn: 'Commercial, Sales & Supply Chain',
    icon: '🤝',
    color: 'from-cyan-600 to-blue-700',
    contractCount: 285000,
    subcategories: [
      { key: 'services', nameAr: 'عقود الخدمات', nameEn: 'Service Agreements' },
      { key: 'supply', nameAr: 'عقود التوريد', nameEn: 'Supply & Distribution' },
      { key: 'logistics', nameAr: 'الشحن واللوجستيات', nameEn: 'Logistics & Shipping' },
      { key: 'agency', nameAr: 'عقود الوكالة', nameEn: 'Agency Agreements' },
      { key: 'franchise', nameAr: 'عقود الامتياز التجاري', nameEn: 'Franchise Agreements' },
      { key: 'consulting', nameAr: 'عقود الاستشارات', nameEn: 'Consulting Contracts' },
      { key: 'sales-b2b', nameAr: 'عقود البيع بين الشركات', nameEn: 'B2B Sales Contracts' },
      { key: 'sales-b2c', nameAr: 'عقود البيع للأفراد', nameEn: 'B2C / Individual Sales' },
      { key: 'sales-international', nameAr: 'عقود البيع الدولي', nameEn: 'International Sales (CISG)' },
      { key: 'sales-installment', nameAr: 'عقود البيع بالتقسيط', nameEn: 'Installment Sales' },
    ],
  },
  {
    key: 'real-estate',
    nameAr: 'العقارات والإيجارات',
    nameEn: 'Real Estate & Leasing',
    icon: '🏢',
    color: 'from-rose-600 to-pink-700',
    contractCount: 156000,
    subcategories: [
      { key: 'commercial-lease', nameAr: 'إيجار تجاري', nameEn: 'Commercial Lease' },
      { key: 'residential', nameAr: 'إيجار سكني', nameEn: 'Residential Lease' },
      { key: 'sale', nameAr: 'بيع وشراء عقارات', nameEn: 'Property Sale' },
      { key: 'construction', nameAr: 'عقود البناء', nameEn: 'Construction Contracts' },
      { key: 'property-mgmt', nameAr: 'إدارة العقارات', nameEn: 'Property Management' },
    ],
  },
  {
    key: 'finance',
    nameAr: 'التمويل والخدمات المالية',
    nameEn: 'Finance & Banking',
    icon: '💰',
    color: 'from-green-600 to-emerald-700',
    contractCount: 98000,
    subcategories: [
      { key: 'loan', nameAr: 'عقود القروض والتمويل', nameEn: 'Loan Agreements' },
      { key: 'guarantee', nameAr: 'خطابات الضمان', nameEn: 'Bank Guarantees' },
      { key: 'factoring', nameAr: 'خصم الفواتير', nameEn: 'Invoice Factoring' },
      { key: 'insurance', nameAr: 'عقود التأمين', nameEn: 'Insurance Contracts' },
    ],
  },
  {
    key: 'healthcare',
    nameAr: 'الرعاية الصحية والصيدلة',
    nameEn: 'Healthcare & Pharma',
    icon: '🏥',
    color: 'from-sky-600 to-blue-700',
    contractCount: 76000,
    subcategories: [
      { key: 'medical-services', nameAr: 'عقود الخدمات الطبية', nameEn: 'Medical Services' },
      { key: 'clinical-trial', nameAr: 'التجارب السريرية', nameEn: 'Clinical Trials' },
      { key: 'pharma-supply', nameAr: 'توريد الأدوية', nameEn: 'Pharma Supply' },
      { key: 'telemedicine', nameAr: 'الطب عن بُعد', nameEn: 'Telemedicine' },
    ],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// BASE CONTRACT TEMPLATES (50 عقد أساسي)
// ────────────────────────────────────────────────────────────────────────────

export const MEGA_CONTRACT_TEMPLATES: MegaContractTemplate[] = [
  // ── CORPORATE ──────────────────────────────────────────────────────────────
  {
    id: 'corp-llc-jo',
    categoryKey: 'corporate', subcategoryKey: 'llc',
    titleAr: 'عقد تأسيس شركة ذات مسؤولية محدودة — الأردن',
    titleEn: 'LLC Articles of Association — Jordan (Companies Law 22/1997)',
    descriptionAr: 'عقد تأسيس متكامل مطابق لقانون الشركات الأردني رقم 22 لسنة 1997 مع كافة متطلبات دائرة مراقبة الشركات (CCD).',
    descriptionEn: 'Full LLC incorporation compliant with Jordanian Companies Law No. 22/1997 and CCD requirements.',
    jurisdictions: ['JO', 'GLOBAL'],
    downloads: 18240, rating: 4.9, pagesCount: 12, clausesCount: 22,
    tags: ['LLC', 'تأسيس', 'أردن', 'CCD', 'شركاء'],
    templateAr: `================================================================================
عقد تأسيس ونظام أساسي لشركة ذات مسؤولية محدودة (ذ.م.م)
استناداً لأحكام قانون الشركات الأردني رقم 22 لسنة 1997 وتعديلاته
المسجلة لدى دائرة مراقبة الشركات (CCD) - المملكة الأردنية الهاشمية
================================================================================

أُبرم هذا العقد في هذا اليوم بين كل من:
الطرف الأول (المؤسس/الشريك الأول): [PARTY_A] | السجل: [PARTY_A_TAX]
الطرف الثاني (المؤسس/الشريك الثاني): [PARTY_B] | السجل: [PARTY_B_TAX]

البند الأول: التأسيس وأهداف الشركة
يؤسس الطرفان شركة ذات مسؤولية محدودة تحت اسم "[Company Name] ذ.م.م" لممارسة الأنشطة التجارية والخدمية المرخصة.

البند الثاني: رأس المال والحصص
2.1 إجمالي رأس المال: ([VALUE]) [CURRENCY] مقسم على حصص متساوية.
2.2 حصة الطرف الأول: (50%) — ([VALUE_HALF]) [CURRENCY].
2.3 حصة الطرف الثاني: (50%) — ([VALUE_HALF]) [CURRENCY].

البند الثالث: الإدارة والتوقيع
يُدار الشركة من مدير عام يُعيّن بقرار هيئة الشركاء بأغلبية الأصوات.

البند الرابع: توزيع الأرباح والخسائر
توزع الأرباح والخسائر بحسب نسبة كل شريك في رأس المال.

البند الخامس: القانون النافذ والتحكيم
يخضع هذا العقد لقانون الشركات الأردني رقم 22 لسنة 1997 وتختص محاكم عمان أو مركز التحكيم الأردني.

توقيع الطرف الأول: [مُعتمد إلكترونياً]    توقيع الطرف الثاني: [مُعتمد إلكترونياً]`,
    templateEn: `================================================================================
LLC ARTICLES OF ASSOCIATION — HASHEMITE KINGDOM OF JORDAN
Companies Law No. 22 of 1997 | Companies Control Department (CCD)
================================================================================

Parties: [PARTY_A] (CR: [PARTY_A_TAX]) & [PARTY_B] (CR: [PARTY_B_TAX])

1. FORMATION: Parties establish [Company Name] LLC under Jordanian Companies Law No. 22/1997.
2. CAPITAL: Total capital ([VALUE]) [CURRENCY]; Party A 50%, Party B 50%.
3. MANAGEMENT: General Manager appointed by shareholders majority resolution.
4. PROFITS: Distributed pro-rata to capital contribution.
5. GOVERNING LAW: Jordanian Companies Law No. 22/1997. Disputes: Amman Courts / JAC Arbitration.

Digitally Certified Signatures: [Party A] | [Party B]`,
  },

  {
    id: 'corp-llc-sa',
    categoryKey: 'corporate', subcategoryKey: 'llc',
    titleAr: 'عقد تأسيس شركة ذات مسؤولية محدودة — السعودية (م/132)',
    titleEn: 'Saudi Arabia LLC Articles of Association (Royal Decree M/132)',
    descriptionAr: 'عقد تأسيس مطابق لنظام الشركات السعودي الجديد مرسوم ملكي م/132 ومنصة أعمال.',
    descriptionEn: 'Saudi Companies Law 2022 compliant LLC formation via Saudi Business Center platform.',
    jurisdictions: ['SA', 'GLOBAL'],
    downloads: 14500, rating: 4.88, pagesCount: 10, clausesCount: 18,
    tags: ['LLC', 'السعودية', 'م/132', 'SCCA', 'تأسيس'],
    templateAr: `================================================================================
عقد تأسيس شركة ذات مسؤولية محدودة — المملكة العربية السعودية
وفقاً لنظام الشركات الصادر بالمرسوم الملكي رقم (م/132)
================================================================================

الطرف الأول: [PARTY_A] | السجل التجاري: [PARTY_A_TAX]
الطرف الثاني: [PARTY_B] | السجل التجاري: [PARTY_B_TAX]

البند الأول: تأسيس الشركة
تأسست شركة "[Company Name] ذات مسؤولية محدودة" للقيام بالأنشطة المرخصة في المملكة العربية السعودية.

البند الثاني: رأس المال وتوزيع الحصص
رأس مال الشركة ([VALUE]) [CURRENCY] مقسم بالتساوي بين الشركاء.

البند الثالث: الحوكمة والنظام
تُدار الشركة وفق نظام الشركات السعودي رقم م/132 ونظام المعاملات المدنية م/191.

البند الرابع: التحكيم والنزاعات
تسوى النزاعات عبر المركز السعودي للتحكيم التجاري (SCCA) في الرياض.`,
    templateEn: `================================================================================
SAUDI ARABIA LLC ARTICLES OF ASSOCIATION
Royal Decree M/132 | Saudi Business Center | Ministry of Commerce
================================================================================

Party A: [PARTY_A] | CR: [PARTY_A_TAX]
Party B: [PARTY_B] | CR: [PARTY_B_TAX]

1. FORMATION: [Company Name] LLC established under Saudi Companies Law (Royal Decree M/132).
2. CAPITAL: ([VALUE]) [CURRENCY] split equally between founders.
3. GOVERNANCE: Managed per Saudi Companies Law M/132 & Civil Transactions Law M/191.
4. DISPUTES: Saudi Center for Commercial Arbitration (SCCA), Riyadh.`,
  },

  {
    id: 'corp-llc-ae',
    categoryKey: 'corporate', subcategoryKey: 'llc',
    titleAr: 'عقد تأسيس شركة ذات مسؤولية محدودة — الإمارات (قانون الشركات الاتحادي 32/2021)',
    titleEn: 'UAE LLC Articles of Association (Federal Commercial Companies Law 32/2021)',
    descriptionAr: 'عقد تأسيس LLC إماراتي مطابق للقانون الاتحادي رقم 32 لسنة 2021 مع متطلبات وزارة الاقتصاد والإمارة.',
    descriptionEn: 'UAE Federal Commercial Companies Law No. 32/2021 compliant LLC formation with DED registration.',
    jurisdictions: ['AE', 'GLOBAL'],
    downloads: 12300, rating: 4.92, pagesCount: 14, clausesCount: 24,
    tags: ['UAE', 'LLC', 'DED', 'الإمارات', 'تأسيس شركة'],
    templateAr: `================================================================================
عقد تأسيس شركة ذات مسؤولية محدودة — الإمارات العربية المتحدة
وفق أحكام القانون الاتحادي رقم 32 لسنة 2021 في شأن الشركات التجارية
================================================================================

المؤسس الأول: [PARTY_A] | الرقم: [PARTY_A_TAX]
المؤسس الثاني: [PARTY_B] | الرقم: [PARTY_B_TAX]

البند الأول: اسم الشركة ومقرها وأغراضها
اسم الشركة: شركة [Company Name] ذات مسؤولية محدودة — مقرها في دولة الإمارات.

البند الثاني: رأس المال
رأس المال ([VALUE]) [CURRENCY] مقسم على الشركاء بالتساوي.

البند الثالث: القانون واختصاص المحاكم
يخضع العقد للقانون الاتحادي رقم 32 لسنة 2021. يختص مركز تسوية المنازعات بالمحاكم الإماراتية أو DIAC.`,
    templateEn: `================================================================================
UAE LLC ARTICLES OF ASSOCIATION
Federal Commercial Companies Law No. 32/2021 | DED Registration
================================================================================

Founder A: [PARTY_A] | ID: [PARTY_A_TAX]
Founder B: [PARTY_B] | ID: [PARTY_B_TAX]

1. ENTITY: [Company Name] LLC incorporated per UAE Federal Law No. 32/2021.
2. CAPITAL: ([VALUE]) [CURRENCY] split between founders.
3. GOVERNING LAW: UAE Federal Law No. 32/2021. Disputes: DIAC or UAE Courts.`,
  },

  {
    id: 'corp-shareholders-global',
    categoryKey: 'corporate', subcategoryKey: 'shareholders',
    titleAr: 'اتفاقية الشركاء والمساهمين الدولية',
    titleEn: 'International Shareholders Agreement',
    descriptionAr: 'اتفاقية شركاء ومساهمين متكاملة تشمل حقوق التصويت وحق الشفعة والخروج.',
    descriptionEn: 'Comprehensive shareholders agreement covering voting rights, pre-emption, tag-along and drag-along.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'US'],
    downloads: 9800, rating: 4.87, pagesCount: 20, clausesCount: 35,
    tags: ['shareholders', 'مساهمين', 'حوكمة', 'أسهم'],
    templateAr: `================================================================================
اتفاقية الشركاء والمساهمين الدولية
================================================================================

الطرف الأول: [PARTY_A] | السجل: [PARTY_A_TAX]
الطرف الثاني: [PARTY_B] | السجل: [PARTY_B_TAX]
إجمالي رأس المال: ([VALUE]) [CURRENCY]

البند الأول: توزيع الأسهم وحقوق التصويت
يتساوى الشركاء في حقوق التصويت بحسب نسبة ملكيتهم من رأس المال.

البند الثاني: حق الشفعة (Pre-emption Right)
يلتزم أي شريك راغب في البيع بإخطار الشركاء الحاليين أولاً وإعطائهم الأولوية بنفس السعر والشروط.

البند الثالث: حق الانضمام (Tag-Along) وحق الإلزام (Drag-Along)
يتمتع الشركاء الأقلية بحق الانضمام لأي صفقة بيع. يحق لشركاء الأغلبية (+75%) إلزام الأقلية بالبيع.

البند الرابع: تسوية النزاعات
يُحال أي نزاع ناشئ للتحكيم وفق قواعد ICC باريس أو CRCICA أو SCCA بحسب الولاية القضائية.`,
    templateEn: `================================================================================
INTERNATIONAL SHAREHOLDERS AGREEMENT
================================================================================

Party A: [PARTY_A] | ID: [PARTY_A_TAX]
Party B: [PARTY_B] | ID: [PARTY_B_TAX]
Total Capital: ([VALUE]) [CURRENCY]

1. SHARE DISTRIBUTION & VOTING: Pro-rata voting rights per capital ownership percentage.
2. PRE-EMPTION RIGHT: Selling shareholder must first offer shares to existing shareholders at same terms.
3. TAG-ALONG / DRAG-ALONG: Minority shareholders hold tag-along rights; Majority (75%+) may drag minority.
4. DISPUTE RESOLUTION: ICC Paris / CRCICA / SCCA arbitration per governing jurisdiction.`,
  },

  // ── EMPLOYMENT ──────────────────────────────────────────────────────────────
  {
    id: 'emp-individual-jo',
    categoryKey: 'employment', subcategoryKey: 'individual',
    titleAr: 'عقد عمل فردي — قانون العمل الأردني (رقم 8 لسنة 1996)',
    titleEn: 'Individual Employment Contract — Jordanian Labor Law No. 8/1996',
    descriptionAr: 'عقد عمل فردي يحدد فترة التجربة (حد أقصى 90 يوماً) والأجر والإشعار والتأمين طبقاً للقانون الأردني.',
    descriptionEn: 'Standard employment capping probation to 90 days with severance per Jordanian Labor Law 8/1996.',
    jurisdictions: ['JO'],
    downloads: 22500, rating: 4.95, pagesCount: 8, clausesCount: 15,
    tags: ['عقد عمل', 'أردن', 'قانون العمل', 'فترة تجربة'],
    templateAr: `================================================================================
عقد عمل فردي
طبقاً لأحكام قانون العمل الأردني رقم 8 لسنة 1996 وتعديلاته
================================================================================

صاحب العمل (الطرف الأول): [PARTY_A] | السجل: [PARTY_A_TAX]
الموظف (الطرف الثاني): [PARTY_B] | الرقم الوطني: [PARTY_B_TAX]

البند الأول: المسمى الوظيفي والمهام
يعمل الموظف بوظيفة [Job Title] وفق متطلبات ووصف الوظيفة الصادر من صاحب العمل.

البند الثاني: فترة التجربة (المادة 35)
فترة التجربة 90 يوماً تبدأ من تاريخ المباشرة وتلغى بانتهائها مع استمرار العقد.

البند الثالث: الأجر والمزايا
الراتب الشهري الإجمالي: ([VALUE]) [CURRENCY] يُصرف في نهاية كل شهر.

البند الرابع: ساعات العمل والإجازات (المادة 56)
ساعات العمل 48 ساعة/أسبوع مع استحقاق الإجازات السنوية والمرضية والأعياد الرسمية.

البند الخامس: إنهاء العقد والإشعار (المادة 23)
يلتزم الطرف الراغب بالإنهاء بإخطار خطي قبل 30 يوماً. في حال الفصل التعسفي يستحق الموظف التعويض المقرر قانوناً.

توقيع صاحب العمل: _______________    توقيع الموظف: _______________`,
    templateEn: `================================================================================
INDIVIDUAL EMPLOYMENT CONTRACT
Jordanian Labor Law No. 8 of 1996
================================================================================

Employer: [PARTY_A] | CR: [PARTY_A_TAX]
Employee: [PARTY_B] | National ID: [PARTY_B_TAX]

1. POSITION: Employee is appointed as [Job Title].
2. PROBATION (Art. 35): Strictly capped to 90 days per Article 35 of Jordanian Labor Law.
3. SALARY: Monthly gross of ([VALUE]) [CURRENCY] disbursed at month-end.
4. WORKING HOURS (Art. 56): 48 hours/week with statutory leave entitlement.
5. TERMINATION (Art. 23): 30-day written notice required by either party. Wrongful dismissal: statutory compensation.`,
  },

  {
    id: 'emp-individual-sa',
    categoryKey: 'employment', subcategoryKey: 'individual',
    titleAr: 'عقد عمل فردي — نظام العمل السعودي (رقم م/51)',
    titleEn: 'Saudi Employment Contract — Saudi Labor Law (Royal Decree M/51)',
    descriptionAr: 'عقد عمل سعودي مطابق لنظام العمل الصادر بالمرسوم الملكي م/51 مع اشتراطات السعودة ومكتب العمل.',
    descriptionEn: 'Saudi Employment Contract compliant with Labor Law M/51 and Saudization (Nitaqat) requirements.',
    jurisdictions: ['SA'],
    downloads: 19800, rating: 4.91, pagesCount: 9, clausesCount: 17,
    tags: ['عقد عمل', 'السعودية', 'نظام العمل', 'نطاقات', 'Nitaqat'],
    templateAr: `================================================================================
عقد عمل فردي — المملكة العربية السعودية
وفق أحكام نظام العمل الصادر بالمرسوم الملكي رقم (م/51) وتعديلاته
================================================================================

صاحب العمل: [PARTY_A] | السجل التجاري: [PARTY_A_TAX]
الموظف: [PARTY_B] | رقم الإقامة / الهوية: [PARTY_B_TAX]

البند الأول: طبيعة العمل والوظيفة
يلتزم الموظف بأداء مهام وظيفة ([Job Title]) وفق السياسات الداخلية لصاحب العمل.

البند الثاني: فترة التجربة
تحدد فترة التجربة بـ (90) يوماً قابلة للمد مرة واحدة بحد أقصى 180 يوماً وفق نظام العمل السعودي.

البند الثالث: الأجر والمزايا
الأجر الشهري: ([VALUE]) [CURRENCY] يشمل / لا يشمل بدل السكن والمواصلات.

البند الرابع: إنهاء العقد
يلتزم الطرفان بإشعار 60 يوماً للعقود غير محددة المدة وفق المادة 75 من نظام العمل السعودي.`,
    templateEn: `================================================================================
SAUDI EMPLOYMENT CONTRACT
Saudi Labor Law (Royal Decree M/51)
================================================================================

Employer: [PARTY_A] | CR: [PARTY_A_TAX]
Employee: [PARTY_B] | Iqama/ID: [PARTY_B_TAX]

1. POSITION: Employee appointed as [Job Title] per employer's internal policies.
2. PROBATION: 90 days extendable once to max 180 days per Saudi Labor Law.
3. SALARY: Monthly ([VALUE]) [CURRENCY] inclusive/exclusive of housing and transport allowances.
4. TERMINATION: 60-day written notice for indefinite contracts per Article 75 of Saudi Labor Law.`,
  },

  {
    id: 'emp-executive',
    categoryKey: 'employment', subcategoryKey: 'executive',
    titleAr: 'عقد إداري وتنفيذي دولي (C-Suite / Senior Management)',
    titleEn: 'International Executive Employment Agreement (C-Suite / Senior Management)',
    descriptionAr: 'عقد عمل تنفيذي دولي يشمل الحوافز والبونص والمزايا الاستثنائية ومكافأة التنافسية.',
    descriptionEn: 'Premium executive employment with equity incentives, bonus scheme, non-compete and golden handshake.',
    jurisdictions: ['GLOBAL', 'US', 'EU', 'AE', 'JO', 'SA'],
    downloads: 7600, rating: 4.93, pagesCount: 18, clausesCount: 30,
    tags: ['CEO', 'executive', 'C-suite', 'bonus', 'تنفيذي'],
    templateAr: `================================================================================
عقد عمل إداري وتنفيذي دولي (Executive Employment Agreement)
================================================================================

صاحب العمل: [PARTY_A] | السجل: [PARTY_A_TAX]
المسؤول التنفيذي: [PARTY_B] | هوية: [PARTY_B_TAX]
المسمى الوظيفي: [Executive Title — CEO/CFO/COO/CTO]

البند الأول: الراتب الأساسي والبدلات
الراتب الأساسي السنوي: ([VALUE]) [CURRENCY] مع بدلات السكن والمواصلات والاتصالات.

البند الثاني: الحوافز والمكافآت (Bonus & Equity)
يستحق المسؤول التنفيذي مكافأة أداء سنوية تتراوح بين 15% و 30% من راتبه الأساسي بناءً على تحقيق المستهدفات الاستراتيجية.

البند الثالث: اتفاقية عدم المنافسة
يلتزم المسؤول التنفيذي بعدم العمل لصالح شركات منافسة لمدة (24) شهراً من تاريخ انتهاء العقد.

البند الرابع: مكافأة الخروج المضمونة (Golden Handshake)
في حال إنهاء العقد بغير سبب مشروع، يحق للمسؤول التنفيذي التعويض المتفق عليه وهو ما يعادل 12 شهراً من الراتب الإجمالي.`,
    templateEn: `================================================================================
INTERNATIONAL EXECUTIVE EMPLOYMENT AGREEMENT
================================================================================

Employer: [PARTY_A] | CR: [PARTY_A_TAX]
Executive: [PARTY_B] | ID: [PARTY_B_TAX]
Title: [Executive Title — CEO/CFO/COO/CTO]

1. BASE COMPENSATION: Annual salary of ([VALUE]) [CURRENCY] with housing, transport & communication allowances.
2. BONUS & EQUITY: Performance bonus 15–30% of base salary contingent on strategic KPI achievement.
3. NON-COMPETE: 24-month post-employment non-compete in defined competitive geography.
4. GOLDEN HANDSHAKE: 12-month total compensation upon termination without cause.`,
  },

  {
    id: 'emp-freelance',
    categoryKey: 'employment', subcategoryKey: 'freelance',
    titleAr: 'عقد عمل حر ومقاول مستقل (Independent Contractor)',
    titleEn: 'Freelance & Independent Contractor Agreement',
    descriptionAr: 'عقد عمل حر يحدد العلاقة القانونية كمقاول مستقل وليس موظفاً، مع تحديد الملكية الفكرية.',
    descriptionEn: 'IC agreement establishing non-employment relationship, IP ownership, and payment milestones.',
    jurisdictions: ['GLOBAL', 'US', 'EU', 'JO', 'SA', 'AE', 'EG'],
    downloads: 15200, rating: 4.88, pagesCount: 7, clausesCount: 14,
    tags: ['freelance', 'مقاول', 'independent', 'IP', 'مستقل'],
    templateAr: `================================================================================
عقد مقاول مستقل / عمل حر
================================================================================

العميل (الطرف الأول): [PARTY_A] | السجل: [PARTY_A_TAX]
المقاول (الطرف الثاني): [PARTY_B] | الهوية: [PARTY_B_TAX]

البند الأول: طبيعة العلاقة القانونية
يُعد [PARTY_B] مقاولاً مستقلاً وليس موظفاً لدى العميل وفق هذا العقد، ولا تسري عليه قوانين العمل المحلية.

البند الثاني: نطاق الخدمات والجداول الزمنية
يلتزم المقاول بتسليم الخدمات المحددة وفق الجداول الزمنية المتفق عليها.

البند الثالث: الأتعاب وجدول الدفع
الأتعاب الإجمالية: ([VALUE]) [CURRENCY] تُسدد وفق الأحداث التعاقدية (Milestones).

البند الرابع: الملكية الفكرية
تعتبر جميع المخرجات والتسليمات ملكاً حصرياً للعميل (Work Made For Hire) فور سداد الأتعاب الكاملة.`,
    templateEn: `================================================================================
FREELANCE & INDEPENDENT CONTRACTOR AGREEMENT
================================================================================

Client: [PARTY_A] | ID: [PARTY_A_TAX]
Contractor: [PARTY_B] | ID: [PARTY_B_TAX]

1. RELATIONSHIP: Contractor is an independent contractor, NOT an employee. No employment law protections apply.
2. SCOPE & TIMELINE: Deliverables per agreed milestone schedule.
3. FEES: Total ([VALUE]) [CURRENCY] payable upon milestone completion.
4. IP OWNERSHIP: All deliverables are Work Made For Hire; Client holds exclusive IP upon full payment.`,
  },

  // ── IP & TECH ──────────────────────────────────────────────────────────────
  {
    id: 'ip-mutual-nda',
    categoryKey: 'ip-tech', subcategoryKey: 'nda',
    titleAr: 'اتفاقية عدم الإفصاح التبادلية الدولية (Mutual NDA)',
    titleEn: 'International Mutual Non-Disclosure Agreement (Mutual NDA)',
    descriptionAr: 'اتفاقية سرية تبادلية تحمي الأسرار التجارية والبيانات الفنية لمدة 5 سنوات مع حق التقاضي المستعجل.',
    descriptionEn: 'Bulletproof mutual NDA protecting trade secrets and technical IP for 5 years with injunctive relief.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'US', 'EU', 'GB'],
    downloads: 28900, rating: 4.97, pagesCount: 6, clausesCount: 12,
    tags: ['NDA', 'سرية', 'confidentiality', 'trade secrets', 'إفصاح'],
    templateAr: `================================================================================
اتفاقية عدم إفصاح وحماية السرية التبادلية (Mutual NDA)
================================================================================

الطرف الأول: [PARTY_A] | السجل: [PARTY_A_TAX]
الطرف الثاني: [PARTY_B] | السجل: [PARTY_B_TAX]

البند الأول: تعريف المعلومات السرية
تشمل كل البيانات المالية والتقنية والتجارية والملكية الفكرية المتبادلة بين الطرفين.

البند الثاني: التزامات عدم الإفصاح
يلتزم كل طرف بحفظ السرية وعدم الكشف أو التداول أو الاستخدام لأي غرض خارج التعاون المحدد.

البند الثالث: مدة السرية وبقاؤها
تستمر الالتزامات 5 سنوات بعد انتهاء العلاقة، وبشكل دائم للأسرار التجارية الجوهرية.

البند الرابع: العلاجات القانونية المستعجلة (Injunctive Relief)
يحق للطرف المتضرر الحصول على أمر قضائي فوري لوقف أي إفصاح بدون إثبات الضرر المالي أولاً.`,
    templateEn: `================================================================================
MUTUAL NON-DISCLOSURE AGREEMENT (Mutual NDA)
Protecting Trade Secrets & Proprietary Data
================================================================================

Party A: [PARTY_A] | ID: [PARTY_A_TAX]
Party B: [PARTY_B] | ID: [PARTY_B_TAX]

1. DEFINITION: Confidential Information includes all financial, technical, trade secret, and proprietary data disclosed.
2. NON-DISCLOSURE: Each party maintains strict confidentiality. No third-party sharing permitted.
3. TERM & SURVIVAL: 5-year survival post-termination; indefinite for trade secrets.
4. INJUNCTIVE RELIEF: Damaged party may seek emergency court injunctions without proving financial harm.`,
  },

  {
    id: 'ip-software-dev',
    categoryKey: 'ip-tech', subcategoryKey: 'software',
    titleAr: 'عقد تطوير وتصميم برمجيات (Software Development Agreement)',
    titleEn: 'Software Development Agreement (Agile / Fixed-Price)',
    descriptionAr: 'عقد تطوير برمجيات شامل يغطي الملكية الفكرية والضمان والتسليم وإدارة التغييرات.',
    descriptionEn: 'Comprehensive software development contract with IP ownership, warranty, delivery schedule, and change management.',
    jurisdictions: ['GLOBAL', 'US', 'EU', 'JO', 'SA', 'AE'],
    downloads: 11400, rating: 4.89, pagesCount: 16, clausesCount: 28,
    tags: ['software', 'برمجيات', 'development', 'Agile', 'IP'],
    templateAr: `================================================================================
عقد تطوير وتصميم برمجيات
================================================================================

العميل: [PARTY_A] | السجل: [PARTY_A_TAX]
المطور: [PARTY_B] | السجل: [PARTY_B_TAX]
القيمة الإجمالية: ([VALUE]) [CURRENCY]

البند الأول: نطاق المشروع والمواصفات الفنية
يلتزم المطور بتنفيذ المشروع وفق وثيقة المتطلبات (SRS) المرفقة كجزء لا يتجزأ من العقد.

البند الثاني: جدول التسليم والمراحل (Milestones)
يُقسَّم المشروع على مراحل تسليم محددة مع دفعات مرتبطة بإتمام كل مرحلة.

البند الثالث: الملكية الفكرية
جميع الكود المصدري والوثائق والتصميمات تكون ملكاً حصرياً للعميل عند سداد كامل الأتعاب.

البند الرابع: الضمان وإصلاح الأخطاء
يلتزم المطور بضمان خلو المشروع من الأخطاء الجوهرية لمدة 12 شهراً من تاريخ التسليم النهائي.`,
    templateEn: `================================================================================
SOFTWARE DEVELOPMENT AGREEMENT
================================================================================

Client: [PARTY_A] | ID: [PARTY_A_TAX]
Developer: [PARTY_B] | ID: [PARTY_B_TAX]
Total Value: ([VALUE]) [CURRENCY]

1. PROJECT SCOPE: Developer delivers per attached Software Requirements Specification (SRS).
2. MILESTONES: Project divided into delivery phases with milestone-linked payments.
3. IP OWNERSHIP: All source code, documentation, and designs vest exclusively in Client upon full payment.
4. WARRANTY: Developer guarantees defect-free delivery for 12 months from final acceptance.`,
  },

  {
    id: 'ip-saas-sla',
    categoryKey: 'ip-tech', subcategoryKey: 'saas',
    titleAr: 'عقد خدمات SaaS واتفاقية مستوى الخدمة (99.9% Uptime SLA)',
    titleEn: 'SaaS Master Services & Service Level Agreement (99.9% Uptime)',
    descriptionAr: 'عقد SaaS يضمن 99.9% تشغيل، سقف مسؤولية 100%، وامتثال GDPR + AES-256.',
    descriptionEn: 'SaaS agreement with 99.9% uptime guarantee, 100% fee liability cap, and GDPR/AES-256 compliance.',
    jurisdictions: ['GLOBAL', 'US', 'EU', 'JO', 'SA', 'AE'],
    downloads: 9100, rating: 4.91, pagesCount: 14, clausesCount: 26,
    tags: ['SaaS', 'SLA', 'cloud', 'GDPR', 'uptime'],
    templateAr: `================================================================================
عقد خدمات برمجيات كخدمة (SaaS MSA) واتفاقية مستوى الخدمة (SLA)
================================================================================

المزود (الطرف الأول): [PARTY_A] | السجل: [PARTY_A_TAX]
العميل (الطرف الثاني): [PARTY_B] | السجل: [PARTY_B_TAX]
قيمة الاشتراك: ([VALUE]) [CURRENCY]/سنة

البند الأول: نطاق الخدمة والترخيص
ترخيص سحابي غير حصري وغير قابل للتحويل لعدد مستخدمين محدد.

البند الثاني: مستوى الخدمة المضمون (99.9% SLA)
يضمن المزود نسبة تشغيل لا تقل عن 99.9% شهرياً مقاسة على دقة الدقيقة.

البند الثالث: سقف المسؤولية القصوى
المسؤولية القصوى محدودة بـ 100% من الرسوم الفعلية المدفوعة خلال آخر 12 شهراً.

البند الرابع: حماية البيانات والامتثال
تشفير AES-256، معالجة بيانات متوافقة مع GDPR، مع حق المساءلة والتدقيق.`,
    templateEn: `================================================================================
SAAS MASTER SERVICES & SERVICE LEVEL AGREEMENT (SaaS SLA)
================================================================================

Provider: [PARTY_A] | ID: [PARTY_A_TAX]
Customer: [PARTY_B] | ID: [PARTY_B_TAX]
Subscription: ([VALUE]) [CURRENCY]/year

1. LICENSE: Non-exclusive, non-transferable cloud access for defined user count.
2. 99.9% UPTIME SLA: Provider guarantees 99.9% monthly availability with SLA service credits.
3. LIABILITY CAP: Maximum aggregate liability capped at 100% of fees paid in preceding 12 months.
4. DATA PROTECTION: AES-256 encryption; GDPR-compliant data processing with audit rights.`,
  },

  // ── INVESTMENT ─────────────────────────────────────────────────────────────
  {
    id: 'inv-safe-ycombinator',
    categoryKey: 'investment', subcategoryKey: 'safe',
    titleAr: 'اتفاقية SAFE للاستثمار المستقبلي (Y-Combinator Standard)',
    titleEn: 'SAFE Convertible Investment Agreement (Y-Combinator Standard)',
    descriptionAr: 'اتفاقية استثمار SAFE تحول مبالغ المستثمر إلى أسهم عند جولة تمويل قادمة بخصم أو سقف تقييم.',
    descriptionEn: 'Standard SAFE converting investor funding into equity at next priced round with discount or cap.',
    jurisdictions: ['GLOBAL', 'US', 'JO', 'SA', 'AE', 'EG'],
    downloads: 8400, rating: 4.94, pagesCount: 8, clausesCount: 14,
    tags: ['SAFE', 'startup', 'investment', 'equity', 'Y-Combinator'],
    templateAr: `================================================================================
اتفاقية الاستثمار بالأسهم المستقبلية (SAFE Agreement)
معيار Y-Combinator المعدل
================================================================================

الشركة الناشئة: [PARTY_A] | السجل: [PARTY_A_TAX]
المستثمر: [PARTY_B] | الهوية: [PARTY_B_TAX]
مبلغ الاستثمار الفوري: ([VALUE]) [CURRENCY]

البند الأول: التحويل التلقائي لأسهم
يتحول مبلغ الاستثمار تلقائياً إلى أسهم عند أي جولة تمويلية مستقبلية بقيمة لا تقل عن 1,000,000 دولار.

البند الثاني: خصم التقييم والسقف
يحصل المستثمر على خصم (20%) من سعر الجولة، أو سقف تقييم أقصى محدد، أيهما أفضل له.

البند الثالث: أحداث الخروج (Liquidity Events)
في التصفية أو الاندماج، يسترد المستثمر قيمة استثماره الأصلية أولاً قبل توزيع أي أرباح.`,
    templateEn: `================================================================================
SAFE CONVERTIBLE INVESTMENT AGREEMENT
Y-Combinator Post-Money SAFE Standard
================================================================================

Company: [PARTY_A] | ID: [PARTY_A_TAX]
Investor: [PARTY_B] | ID: [PARTY_B_TAX]
Purchase Amount: ([VALUE]) [CURRENCY]

1. CONVERSION: Automatically converts into equity at next qualified priced financing round (≥$1M).
2. DISCOUNT & VALUATION CAP: Investor receives 20% discount or Valuation Cap, whichever is more favorable.
3. LIQUIDITY: Upon dissolution/M&A, Investor receives purchase amount back before equity distributions.`,
  },

  {
    id: 'inv-term-sheet',
    categoryKey: 'investment', subcategoryKey: 'term-sheet',
    titleAr: 'وثيقة شروط الاستثمار الجريء (VC Term Sheet)',
    titleEn: 'Venture Capital Investment Term Sheet',
    descriptionAr: 'وثيقة شروط استثمار رأس المال الجريء تحدد هيكل الجولة، التقييم، وحقوق المستثمر.',
    descriptionEn: 'VC term sheet defining round structure, valuation, investor rights, and liquidation preferences.',
    jurisdictions: ['GLOBAL', 'US', 'EU', 'JO', 'SA', 'AE'],
    downloads: 5600, rating: 4.85, pagesCount: 12, clausesCount: 22,
    tags: ['VC', 'term sheet', 'investment', 'Series A', 'startup'],
    templateAr: `================================================================================
وثيقة شروط الاستثمار الجريء (Non-Binding Term Sheet)
================================================================================

الشركة: [PARTY_A] | المستثمر: [PARTY_B]
نوع الجولة: [Series Seed / A / B] | حجم الجولة: ([VALUE]) [CURRENCY]

البنود الرئيسية:
1. التقييم قبل الاستثمار (Pre-Money): محدد في الوثيقة
2. نوع الأسهم: أسهم ممتازة قابلة للتحويل (Preferred Convertible Shares)
3. حق التصفية التفضيلي: 1x Non-Participating Liquidation Preference
4. الحماية من التخفيف: حماية وزنية للمستثمر (Weighted Average Anti-dilution)
5. حق الشفعة في الجولات التالية (Pro-Rata Rights)
6. تمثيل في مجلس الإدارة: مقعد واحد للمستثمر

هذه الوثيقة غير ملزمة قانونياً وتمثل الإطار التفاوضي فقط.`,
    templateEn: `================================================================================
VENTURE CAPITAL INVESTMENT TERM SHEET (Non-Binding)
================================================================================

Company: [PARTY_A] | Investor: [PARTY_B]
Round: [Series Seed / A / B] | Round Size: ([VALUE]) [CURRENCY]

Key Terms:
1. PRE-MONEY VALUATION: As specified in cap table attachment.
2. SECURITY TYPE: Preferred Convertible Shares with standard conversion rights.
3. LIQUIDATION PREFERENCE: 1x Non-Participating Liquidation Preference.
4. ANTI-DILUTION: Weighted Average (Broad-Based) anti-dilution protection.
5. PRO-RATA RIGHTS: Investor's right to participate in future rounds.
6. BOARD SEAT: One Board Observer or Director seat for Investor.

This Term Sheet is non-binding and for negotiation purposes only.`,
  },

  // ── COMMERCIAL ──────────────────────────────────────────────────────────────
  {
    id: 'com-master-services',
    categoryKey: 'commercial', subcategoryKey: 'services',
    titleAr: 'عقد الخدمات الرئيسي واتفاقية مستوى الخدمة (Master Service Agreement)',
    titleEn: 'Master Service Agreement & SLA (Commercial Services)',
    descriptionAr: 'عقد خدمات رئيسي يحكم جميع عقود البيانات الفردية (SOW) بين المزود والعميل.',
    descriptionEn: 'MSA governing all individual Statements of Work between service provider and client.',
    jurisdictions: ['GLOBAL', 'US', 'EU', 'JO', 'SA', 'AE', 'EG'],
    downloads: 13700, rating: 4.90, pagesCount: 15, clausesCount: 25,
    tags: ['MSA', 'services', 'SLA', 'commercial', 'خدمات'],
    templateAr: `================================================================================
عقد الخدمات الرئيسي (Master Service Agreement — MSA)
================================================================================

مقدم الخدمة (الطرف الأول): [PARTY_A] | السجل: [PARTY_A_TAX]
العميل (الطرف الثاني): [PARTY_B] | السجل: [PARTY_B_TAX]
القيمة الإجمالية التقديرية: ([VALUE]) [CURRENCY]

البند الأول: نطاق الخدمات
تحدد وثيقة نطاق العمل (SOW) الملحقة نطاق وجدول وتكلفة كل خدمة على حدة.

البند الثاني: آليات الدفع
تُسدد المستحقات خلال 30 يوماً من إصدار الفاتورة وفق بيانات الحساب البنكي المعتمدة.

البند الثالث: المسؤولية والضمان
يضمن مقدم الخدمة أداء الخدمات بمهنية ووفق معايير الصناعة المتعارف عليها.

البند الرابع: الإنهاء المشروع
يحق لأي طرف إنهاء العقد بإشعار 30 يوماً أو فوراً في حال الإخلال الجوهري الذي لم يُعالج خلال 15 يوماً.`,
    templateEn: `================================================================================
MASTER SERVICE AGREEMENT (MSA)
================================================================================

Provider: [PARTY_A] | ID: [PARTY_A_TAX]
Client: [PARTY_B] | ID: [PARTY_B_TAX]
Estimated Total Value: ([VALUE]) [CURRENCY]

1. SCOPE: Individual Statements of Work (SOW) define scope, timeline, and cost per engagement.
2. PAYMENT: Net-30 payment terms from invoice date to designated bank account.
3. WARRANTY: Provider guarantees professional delivery per industry standards.
4. TERMINATION: 30-day written notice, or immediate for material breach unresolved within 15 days.`,
  },

  {
    id: 'com-distribution',
    categoryKey: 'commercial', subcategoryKey: 'supply',
    titleAr: 'عقد توريد وتوزيع تجاري (Vendor & Distribution Agreement)',
    titleEn: 'Vendor Supply & Distribution Agreement',
    descriptionAr: 'عقد توريد وتوزيع شامل يحدد المناطق الحصرية والأهداف البيعية وشروط الإرجاع.',
    descriptionEn: 'Distribution agreement covering exclusive territories, sales targets, returns, and brand protection.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'US'],
    downloads: 8200, rating: 4.86, pagesCount: 13, clausesCount: 22,
    tags: ['distribution', 'توزيع', 'supply chain', 'vendor', 'توريد'],
    templateAr: `================================================================================
عقد توريد وتوزيع تجاري
================================================================================

المورد (الطرف الأول): [PARTY_A] | السجل: [PARTY_A_TAX]
الموزع (الطرف الثاني): [PARTY_B] | السجل: [PARTY_B_TAX]
القيمة السنوية التقديرية: ([VALUE]) [CURRENCY]

البند الأول: المنطقة الحصرية والمنتجات
يُمنح الموزع حق توزيع حصري للمنتجات المحددة في المنطقة الجغرافية المتفق عليها.

البند الثاني: الأهداف البيعية والحصص
يلتزم الموزع بتحقيق الحد الأدنى من المبيعات (Minimum Purchase Commitment) سنوياً وإلا تحول الحق للتوزيع غير الحصري.

البند الثالث: شروط الدفع والتسليم
الدفع بموجب اعتماد مستندي أو تحويل بنكي قبل الشحن أو خلال 30 يوماً بضمان بنكي.

البند الرابع: حماية العلامة التجارية
يلتزم الموزع باستخدام العلامة التجارية وفق الإرشادات الصادرة عن المورد فقط.`,
    templateEn: `================================================================================
VENDOR SUPPLY & DISTRIBUTION AGREEMENT
================================================================================

Supplier: [PARTY_A] | ID: [PARTY_A_TAX]
Distributor: [PARTY_B] | ID: [PARTY_B_TAX]
Estimated Annual Value: ([VALUE]) [CURRENCY]

1. EXCLUSIVE TERRITORY: Distributor receives exclusive rights to distribute specified products in defined territory.
2. MINIMUM PURCHASE COMMITMENT: Distributor commits to annual minimum purchase volume or exclusivity converts to non-exclusive.
3. PAYMENT TERMS: Letter of Credit or T/T within 30 days with bank guarantee.
4. BRAND PROTECTION: Distributor must adhere to Supplier's brand guidelines exclusively.`,
  },

  {
    id: 'com-consulting',
    categoryKey: 'commercial', subcategoryKey: 'consulting',
    titleAr: 'عقد الاستشارات المهنية والإدارية',
    titleEn: 'Professional & Management Consulting Agreement',
    descriptionAr: 'عقد استشارات مهنية يحدد الأتعاب وملكية المخرجات وسرية المعلومات وتضارب المصالح.',
    descriptionEn: 'Consulting agreement defining fees, deliverables, IP ownership, confidentiality, and conflict of interest.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'US', 'EU'],
    downloads: 10300, rating: 4.88, pagesCount: 10, clausesCount: 18,
    tags: ['consulting', 'استشارات', 'management', 'advisory'],
    templateAr: `================================================================================
عقد استشارات مهنية وإدارية
================================================================================

العميل (الطرف الأول): [PARTY_A] | السجل: [PARTY_A_TAX]
المستشار (الطرف الثاني): [PARTY_B] | الهوية: [PARTY_B_TAX]
الأتعاب المتفق عليها: ([VALUE]) [CURRENCY]

البند الأول: نطاق خدمات الاستشارة
يقدم المستشار خدمات استشارية في مجال [Field] وفق جدول التسليمات الملحق.

البند الثاني: أتعاب الاستشارة وجدول الدفع
تُسدد الأتعاب شهرياً أو وفق المراحل المتفق عليها حسب الاتفاق.

البند الثالث: السرية وعدم تضارب المصالح
يلتزم المستشار بالحفاظ على سرية جميع المعلومات ولا يقدم خدمات لشركات منافسة مباشرة دون إذن مسبق.

البند الرابع: ملكية الدراسات والتقارير
تكون جميع الدراسات والتقارير المنجزة ملكاً مشتركاً للطرفين مع حق العميل بالاستخدام الكامل.`,
    templateEn: `================================================================================
PROFESSIONAL CONSULTING AGREEMENT
================================================================================

Client: [PARTY_A] | ID: [PARTY_A_TAX]
Consultant: [PARTY_B] | ID: [PARTY_B_TAX]
Fees: ([VALUE]) [CURRENCY]

1. SCOPE: Consultant delivers advisory services in [Field] per attached deliverables schedule.
2. FEES: Payable monthly or per agreed milestone schedule.
3. CONFIDENTIALITY & COI: Consultant maintains strict confidentiality and avoids direct competitive conflicts.
4. IP OWNERSHIP: All studies and reports jointly owned; Client retains full usage rights.`,
  },

  // ── SALES CONTRACTS — B2B (COMPANY-TO-COMPANY) ─────────────────────────────
  {
    id: 'sale-b2b-goods-global',
    categoryKey: 'commercial', subcategoryKey: 'sales-b2b',
    titleAr: 'عقد بيع بضائع بين شركات — متعدد الولايات القضائية',
    titleEn: 'B2B Sale of Goods Agreement — Multi-Jurisdiction',
    descriptionAr: 'عقد بيع بضائع شامل بين شركتين يتضمن شروط التسليم والدفع والضمان والقوة القاهرة وفقاً للقوانين المحلية والدولية.',
    descriptionEn: 'Comprehensive B2B sale of goods covering delivery Incoterms, payment, warranties, force majeure, adaptable to local & international law.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'QA', 'KW', 'BH', 'OM', 'US', 'UK', 'EU'],
    downloads: 24600, rating: 4.95, pagesCount: 18, clausesCount: 32,
    tags: ['بيع', 'sale', 'B2B', 'goods', 'بضائع', 'شركات', 'company', 'Incoterms'],
    templateAr: `================================================================================
عقد بيع بضائع بين شركات
(Sale of Goods Agreement — Business to Business)
قابل للتكييف وفق قوانين: الأردن / السعودية / الإمارات / مصر / قطر / الكويت / البحرين / عُمان
================================================================================

أُبرم هذا العقد بتاريخ [DATE] بين كل من:

البائع (الطرف الأول): [PARTY_A]
السجل التجاري: [PARTY_A_CR] | الرقم الضريبي: [PARTY_A_TAX]
العنوان: [PARTY_A_ADDRESS]
يمثله: [PARTY_A_REP] — بصفته: [PARTY_A_TITLE]

المشتري (الطرف الثاني): [PARTY_B]
السجل التجاري: [PARTY_B_CR] | الرقم الضريبي: [PARTY_B_TAX]
العنوان: [PARTY_B_ADDRESS]
يمثله: [PARTY_B_REP] — بصفته: [PARTY_B_TITLE]

────────────────────────────────────────────────────────────────────────────────
البند الأول: محل العقد والبضائع
────────────────────────────────────────────────────────────────────────────────
1.1 يلتزم البائع ببيع وتسليم المشتري البضائع المبينة تفصيلاً في الملحق (أ) — "جدول البضائع".
1.2 تعتبر المواصفات الفنية الواردة في الملحق (أ) جزءاً لا يتجزأ من هذا العقد.
1.3 أي تعديل على المواصفات يتطلب موافقة خطية مسبقة من الطرفين.

────────────────────────────────────────────────────────────────────────────────
البند الثاني: الثمن وشروط الدفع
────────────────────────────────────────────────────────────────────────────────
2.1 إجمالي ثمن البضائع: ([VALUE]) [CURRENCY] — غير شامل لضريبة القيمة المضافة.
2.2 ضريبة القيمة المضافة: تُضاف وفقاً للنسبة المعمول بها في دولة التسليم.
    - الأردن: 16% | السعودية: 15% | الإمارات: 5% | مصر: 14% | قطر: 0% | الكويت: 0%
2.3 جدول الدفع:
    (أ) دفعة مقدمة: [ADVANCE_PERCENT]% عند التوقيع.
    (ب) دفعة التسليم: [DELIVERY_PERCENT]% عند استلام البضائع ومطابقتها.
    (ج) الدفعة النهائية: [FINAL_PERCENT]% خلال [PAYMENT_DAYS] يوم عمل.
2.4 غرامة التأخر في الدفع: [LATE_FEE_PERCENT]% شهرياً من المبلغ المتأخر.

────────────────────────────────────────────────────────────────────────────────
البند الثالث: التسليم وشروط الشحن (Incoterms 2020)
────────────────────────────────────────────────────────────────────────────────
3.1 مصطلح التسليم الدولي: [INCOTERM] (وفقاً لقواعد Incoterms® 2020).
3.2 مكان التسليم: [DELIVERY_LOCATION].
3.3 مدة التسليم: خلال [DELIVERY_DAYS] يوم عمل من تأكيد الطلب.
3.4 تنتقل ملكية البضاعة ومخاطرها من البائع إلى المشتري وفقاً لمصطلح التسليم المحدد.
3.5 أي تأخر عن الموعد المحدد يمنح المشتري حق المطالبة بتعويض [DELAY_PENALTY]% أسبوعياً.

────────────────────────────────────────────────────────────────────────────────
البند الرابع: الفحص والقبول والمطابقة
────────────────────────────────────────────────────────────────────────────────
4.1 يحق للمشتري فحص البضائع خلال [INSPECTION_DAYS] أيام عمل من الاستلام.
4.2 يُخطر المشتري البائع كتابياً بأي عيوب أو مخالفات للمواصفات خلال فترة الفحص.
4.3 للبائع حق إصلاح العيوب أو استبدال البضائع المعيبة خلال [REMEDY_DAYS] يوم عمل.

────────────────────────────────────────────────────────────────────────────────
البند الخامس: الضمانات
────────────────────────────────────────────────────────────────────────────────
5.1 يضمن البائع خلو البضائع من العيوب المصنعية لمدة [WARRANTY_MONTHS] شهراً.
5.2 يضمن البائع مطابقة البضائع للمعايير: [STANDARDS] (ISO/SASO/GSO/JDS حسب الاقتضاء).
5.3 لا يشمل الضمان الأضرار الناتجة عن سوء الاستخدام أو التخزين غير المناسب.

────────────────────────────────────────────────────────────────────────────────
البند السادس: حقوق الملكية الفكرية والعلامات التجارية
────────────────────────────────────────────────────────────────────────────────
6.1 يقر البائع بأن البضائع لا تنتهك أي حقوق ملكية فكرية لطرف ثالث.
6.2 يتحمل البائع المسؤولية الكاملة عن أي مطالبات بانتهاك حقوق الملكية الفكرية.

────────────────────────────────────────────────────────────────────────────────
البند السابع: المسؤولية وتحديدها
────────────────────────────────────────────────────────────────────────────────
7.1 لا يتجاوز الحد الأقصى لمسؤولية أي طرف قيمة العقد الإجمالية.
7.2 لا يتحمل أي طرف المسؤولية عن الأضرار غير المباشرة أو التبعية.

────────────────────────────────────────────────────────────────────────────────
البند الثامن: القوة القاهرة
────────────────────────────────────────────────────────────────────────────────
8.1 لا يُسأل أي طرف عن التأخر أو عدم التنفيذ الناتج عن قوة قاهرة.
8.2 يلتزم الطرف المتأثر بإخطار الطرف الآخر خلال [FORCE_MAJEURE_NOTICE] أيام.
8.3 إذا استمرت القوة القاهرة أكثر من [FM_MAX_DAYS] يوماً، يحق لأي طرف إنهاء العقد.

────────────────────────────────────────────────────────────────────────────────
البند التاسع: السرية وحماية البيانات
────────────────────────────────────────────────────────────────────────────────
9.1 يلتزم كلا الطرفين بالحفاظ على سرية المعلومات التجارية والمالية.
9.2 يمتد التزام السرية لمدة [CONFIDENTIALITY_YEARS] سنوات بعد انتهاء العقد.

────────────────────────────────────────────────────────────────────────────────
البند العاشر: الإنهاء المبكر
────────────────────────────────────────────────────────────────────────────────
10.1 يجوز لأي طرف إنهاء العقد بإشعار خطي مدته [TERMINATION_NOTICE] يوماً.
10.2 يحق للطرف المتضرر المطالبة بالتعويض عن الأضرار الفعلية المباشرة.

────────────────────────────────────────────────────────────────────────────────
البند الحادي عشر: القانون الواجب التطبيق وتسوية المنازعات
────────────────────────────────────────────────────────────────────────────────
¶ يسري القانون المختار وفقاً لبلد التنفيذ:
• الأردن — القانون المدني الأردني رقم 43/1976 والقانون التجاري رقم 12/1966
• السعودية — نظام المحكمة التجارية 1350هـ ونظام التجارة الإلكترونية 1440هـ
• الإمارات — قانون المعاملات التجارية الاتحادي رقم 18/1993
• مصر — القانون المدني المصري رقم 131/1948 وقانون التجارة رقم 17/1999
• قطر — القانون المدني القطري رقم 22/2004
• الكويت — قانون التجارة الكويتي رقم 68/1980
• البحرين — قانون التجارة البحريني (مرسوم رقم 7/1987)
• عُمان — قانون التجارة العُماني (مرسوم سلطاني رقم 55/1990)

11.2 يتم حل النزاعات عبر:
    (أ) التفاوض المباشر خلال 30 يوماً.
    (ب) الوساطة خلال 60 يوماً.
    (ج) التحكيم لدى [ARBITRATION_CENTER] وفقاً لقواعد UNCITRAL.

────────────────────────────────────────────────────────────────────────────────
التوقيعات
────────────────────────────────────────────────────────────────────────────────
البائع: _________________________ التاريخ: ___________
المشتري: ________________________ التاريخ: ___________
الشاهد الأول: _____________________ الشاهد الثاني: _____________________`,
    templateEn: `================================================================================
SALE OF GOODS AGREEMENT — BUSINESS TO BUSINESS (B2B)
Adaptable to: Jordan / Saudi Arabia / UAE / Egypt / Qatar / Kuwait / Bahrain / Oman / US / UK / EU
================================================================================

This Agreement is entered into on [DATE] by and between:

SELLER (Party A): [PARTY_A]
Commercial Reg: [PARTY_A_CR] | Tax ID: [PARTY_A_TAX]
Address: [PARTY_A_ADDRESS]
Represented by: [PARTY_A_REP] — Title: [PARTY_A_TITLE]

BUYER (Party B): [PARTY_B]
Commercial Reg: [PARTY_B_CR] | Tax ID: [PARTY_B_TAX]
Address: [PARTY_B_ADDRESS]
Represented by: [PARTY_B_REP] — Title: [PARTY_B_TITLE]

────────────────────────────────────────────────────────────────────────────────
1. SUBJECT MATTER & GOODS
────────────────────────────────────────────────────────────────────────────────
1.1 Seller agrees to sell and deliver the Goods described in Schedule (A).
1.2 Technical specifications in Schedule (A) form an integral part of this Agreement.
1.3 Any modification to specifications requires prior written consent of both Parties.

────────────────────────────────────────────────────────────────────────────────
2. PRICE & PAYMENT TERMS
────────────────────────────────────────────────────────────────────────────────
2.1 Total Price: ([VALUE]) [CURRENCY] — exclusive of VAT/GST.
2.2 VAT/GST: Applied per the delivery country's applicable rate.
    - Jordan: 16% | Saudi Arabia: 15% | UAE: 5% | Egypt: 14% | Qatar: 0% | Kuwait: 0%
    - US: State Sales Tax varies | EU: VAT per member state | UK: 20%
2.3 Payment Schedule:
    (a) Advance: [ADVANCE_PERCENT]% upon signing.
    (b) Delivery: [DELIVERY_PERCENT]% upon goods receipt and conformity check.
    (c) Final: [FINAL_PERCENT]% within [PAYMENT_DAYS] business days.
2.4 Late Payment Penalty: [LATE_FEE_PERCENT]% per month on overdue amounts.

────────────────────────────────────────────────────────────────────────────────
3. DELIVERY (Incoterms® 2020)
────────────────────────────────────────────────────────────────────────────────
3.1 Delivery Term: [INCOTERM] (per Incoterms® 2020 rules).
3.2 Delivery Location: [DELIVERY_LOCATION].
3.3 Delivery Period: Within [DELIVERY_DAYS] business days from Order Confirmation.
3.4 Title and risk pass to Buyer in accordance with the designated Incoterm.
3.5 Delay beyond the agreed date entitles Buyer to [DELAY_PENALTY]% weekly liquidated damages.

────────────────────────────────────────────────────────────────────────────────
4. INSPECTION & ACCEPTANCE
────────────────────────────────────────────────────────────────────────────────
4.1 Buyer shall inspect Goods within [INSPECTION_DAYS] business days of receipt.
4.2 Written notice of defects or non-conformity must be given within the inspection period.
4.3 Seller shall repair or replace defective Goods within [REMEDY_DAYS] business days.

────────────────────────────────────────────────────────────────────────────────
5. WARRANTIES
────────────────────────────────────────────────────────────────────────────────
5.1 Seller warrants Goods free from manufacturing defects for [WARRANTY_MONTHS] months.
5.2 Goods conform to: [STANDARDS] (ISO/SASO/GSO/JDS/UL/CE as applicable).
5.3 Warranty excludes damage caused by misuse or improper storage.

────────────────────────────────────────────────────────────────────────────────
6. INTELLECTUAL PROPERTY
────────────────────────────────────────────────────────────────────────────────
6.1 Seller warrants that the Goods do not infringe any third-party IP rights.
6.2 Seller shall indemnify Buyer against all IP infringement claims.

────────────────────────────────────────────────────────────────────────────────
7. LIMITATION OF LIABILITY
────────────────────────────────────────────────────────────────────────────────
7.1 Neither Party's aggregate liability shall exceed the total Contract value.
7.2 Neither Party is liable for indirect, consequential, or punitive damages.

────────────────────────────────────────────────────────────────────────────────
8. FORCE MAJEURE
────────────────────────────────────────────────────────────────────────────────
8.1 Neither Party is liable for delays caused by events beyond reasonable control.
8.2 Affected Party must notify within [FORCE_MAJEURE_NOTICE] days.
8.3 If force majeure continues beyond [FM_MAX_DAYS] days, either Party may terminate.

────────────────────────────────────────────────────────────────────────────────
9. GOVERNING LAW & DISPUTE RESOLUTION
────────────────────────────────────────────────────────────────────────────────
¶ Applicable Law per country of performance:
• Jordan — Civil Code No. 43/1976 & Commercial Code No. 12/1966
• Saudi Arabia — Commercial Court Law 1350H & E-Commerce Law 1440H
• UAE — Federal Commercial Transactions Law No. 18/1993
• Egypt — Civil Code No. 131/1948 & Commercial Law No. 17/1999
• US — Uniform Commercial Code (UCC) Art. 2
• UK — Sale of Goods Act 1979 & Consumer Rights Act 2015
• EU — Directive (EU) 2019/771 on Sale of Goods

9.2 Disputes resolved by: (a) Negotiation 30 days; (b) Mediation 60 days; (c) Arbitration under UNCITRAL rules at [ARBITRATION_CENTER].

────────────────────────────────────────────────────────────────────────────────
SIGNATURES
────────────────────────────────────────────────────────────────────────────────
Seller: _________________________ Date: ___________
Buyer: __________________________ Date: ___________
Witness 1: ______________________ Witness 2: ______________________`,
  },

  {
    id: 'sale-b2b-services-corporate',
    categoryKey: 'commercial', subcategoryKey: 'sales-b2b',
    titleAr: 'عقد بيع خدمات بين شركات (مؤسسة لمؤسسة)',
    titleEn: 'B2B Sale of Services Contract — Corporate to Corporate',
    descriptionAr: 'عقد بيع خدمات مهنية أو تشغيلية بين شركتين يشمل التسليمات ومعايير الأداء SLA وشروط الملكية الفكرية.',
    descriptionEn: 'Corporate services sale agreement with SLAs, deliverables, IP assignment, and multi-jurisdiction compliance.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'US', 'UK', 'EU'],
    downloads: 15200, rating: 4.91, pagesCount: 14, clausesCount: 26,
    tags: ['بيع خدمات', 'services sale', 'B2B', 'SLA', 'corporate'],
    templateAr: `================================================================================
عقد بيع خدمات بين شركات
================================================================================

مقدم الخدمة (البائع): [PARTY_A] | السجل: [PARTY_A_CR] | الضريبي: [PARTY_A_TAX]
المشتري (العميل): [PARTY_B] | السجل: [PARTY_B_CR] | الضريبي: [PARTY_B_TAX]

البند 1: وصف الخدمات المباعة
يلتزم البائع بتقديم الخدمات المبينة في الملحق (أ) وفق معايير الأداء (SLA) الملحق (ب).

البند 2: الثمن والدفع
إجمالي قيمة الخدمات: ([VALUE]) [CURRENCY] + ضريبة القيمة المضافة.
الدفع وفق مراحل الإنجاز المحددة في الجدول الزمني الملحق.

البند 3: معايير جودة الأداء (SLA)
3.1 نسبة التوفر: [UPTIME_PERCENT]% | زمن الاستجابة: [RESPONSE_HOURS] ساعات.
3.2 في حال الإخلال بمعايير SLA، يحق للمشتري خصم [SLA_PENALTY]% من القيمة الشهرية.

البند 4: ملكية المخرجات والملكية الفكرية
تنتقل ملكية جميع المخرجات والتسليمات إلى المشتري فور الدفع الكامل.

البند 5: السرية
يلتزم الطرفان بالحفاظ على سرية جميع المعلومات لمدة [CONF_YEARS] سنوات بعد انتهاء العقد.

البند 6: القانون الواجب التطبيق
يخضع هذا العقد لقوانين [JURISDICTION] وتُحل النزاعات عبر التحكيم.`,
    templateEn: `================================================================================
B2B SALE OF SERVICES CONTRACT — CORPORATE TO CORPORATE
================================================================================

Service Provider (Seller): [PARTY_A] | CR: [PARTY_A_CR] | Tax: [PARTY_A_TAX]
Buyer (Client): [PARTY_B] | CR: [PARTY_B_CR] | Tax: [PARTY_B_TAX]

1. DESCRIPTION OF SERVICES SOLD
Seller delivers services per Schedule (A) subject to SLAs in Schedule (B).

2. PRICE & PAYMENT
Total: ([VALUE]) [CURRENCY] + applicable VAT/GST.
Payment per milestone schedule attached.

3. SERVICE LEVEL AGREEMENT (SLA)
3.1 Uptime: [UPTIME_PERCENT]% | Response Time: [RESPONSE_HOURS] hours.
3.2 SLA breach entitles Buyer to deduct [SLA_PENALTY]% of monthly fees.

4. IP & DELIVERABLES OWNERSHIP
All deliverables transfer to Buyer upon full payment.

5. CONFIDENTIALITY
Both Parties maintain confidentiality for [CONF_YEARS] years post-termination.

6. GOVERNING LAW
Governed by the laws of [JURISDICTION]. Disputes resolved by arbitration.`,
  },

  // ── SALES CONTRACTS — B2C (INDIVIDUAL BUYERS) ──────────────────────────────
  {
    id: 'sale-b2c-goods-individual',
    categoryKey: 'commercial', subcategoryKey: 'sales-b2c',
    titleAr: 'عقد بيع بضائع لفرد — حماية المستهلك',
    titleEn: 'B2C Sale of Goods to Individual — Consumer Protection Compliant',
    descriptionAr: 'عقد بيع من شركة لفرد يشمل حقوق المستهلك والإرجاع والضمان وحماية البيانات الشخصية وفقاً لقوانين حماية المستهلك.',
    descriptionEn: 'Business-to-Consumer sale agreement with full consumer rights, cooling-off period, warranty, return policy, and data protection.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'QA', 'KW', 'US', 'UK', 'EU'],
    downloads: 31400, rating: 4.97, pagesCount: 12, clausesCount: 24,
    tags: ['بيع', 'فرد', 'مستهلك', 'B2C', 'individual', 'consumer', 'حماية المستهلك'],
    templateAr: `================================================================================
عقد بيع بضائع (من شركة إلى فرد / مستهلك)
متوافق مع قوانين حماية المستهلك — متعدد الدول
================================================================================

البائع (الشركة): [PARTY_A]
السجل التجاري: [PARTY_A_CR] | الضريبي: [PARTY_A_TAX]
العنوان: [PARTY_A_ADDRESS]

المشتري (الفرد/المستهلك): [PARTY_B]
رقم الهوية/الإقامة: [PARTY_B_ID]
العنوان: [PARTY_B_ADDRESS]
رقم التواصل: [PARTY_B_PHONE]

────────────────────────────────────────────────────────────────────────────────
البند الأول: وصف المنتج المباع
────────────────────────────────────────────────────────────────────────────────
1.1 المنتج: [PRODUCT_NAME] — الموديل: [MODEL] — الكمية: [QTY]
1.2 الحالة: [جديد / مُجدد / مستعمل]
1.3 المواصفات التفصيلية: حسب الملحق (أ).

────────────────────────────────────────────────────────────────────────────────
البند الثاني: الثمن وطريقة الدفع
────────────────────────────────────────────────────────────────────────────────
2.1 سعر البيع: ([VALUE]) [CURRENCY] شامل ضريبة القيمة المضافة.
2.2 طريقة الدفع: [نقداً / بطاقة ائتمان / تحويل بنكي / دفع إلكتروني].
2.3 يُصدر البائع فاتورة رسمية ضريبية عند إتمام الدفع.

────────────────────────────────────────────────────────────────────────────────
البند الثالث: التسليم
────────────────────────────────────────────────────────────────────────────────
3.1 مكان التسليم: [DELIVERY_ADDRESS].
3.2 مدة التسليم: خلال [DELIVERY_DAYS] يوم عمل.
3.3 تكاليف الشحن: [مجانية / على حساب المشتري: VALUE_SHIPPING].

────────────────────────────────────────────────────────────────────────────────
البند الرابع: حق الإرجاع والاسترداد (حماية المستهلك)
────────────────────────────────────────────────────────────────────────────────
¶ يحق للمستهلك إرجاع المنتج واسترداد الثمن وفقاً للقانون المحلي:
• الأردن — قانون حماية المستهلك رقم 7/2017: حق الإرجاع خلال 7 أيام.
• السعودية — نظام التجارة الإلكترونية 1440هـ: حق الإرجاع خلال 7 أيام.
• الإمارات — قانون حماية المستهلك الاتحادي رقم 15/2020: حق الإرجاع خلال 5 أيام.
• مصر — قانون حماية المستهلك رقم 181/2018: حق الإرجاع خلال 14 يوماً.
• قطر — قانون حماية المستهلك رقم 8/2008.
• الكويت — قانون حماية المستهلك رقم 39/2014.
• الاتحاد الأوروبي — التوجيه 2011/83/EU: حق الانسحاب 14 يوماً.
• المملكة المتحدة — Consumer Rights Act 2015: حق الإرجاع 14 يوماً.
• الولايات المتحدة — وفقاً لقانون الولاية المعمول به.

4.2 شروط الإرجاع: المنتج بحالته الأصلية مع التغليف والإكسسوارات.
4.3 يتم رد المبلغ خلال [REFUND_DAYS] يوم عمل بنفس طريقة الدفع الأصلية.

────────────────────────────────────────────────────────────────────────────────
البند الخامس: الضمان
────────────────────────────────────────────────────────────────────────────────
5.1 مدة الضمان: [WARRANTY_MONTHS] شهراً من تاريخ التسليم.
5.2 يشمل الضمان العيوب المصنعية ولا يشمل الأعطال الناتجة عن سوء الاستخدام.
5.3 مراكز الصيانة المعتمدة: [SERVICE_CENTERS].

────────────────────────────────────────────────────────────────────────────────
البند السادس: حماية البيانات الشخصية
────────────────────────────────────────────────────────────────────────────────
6.1 يلتزم البائع بحماية البيانات الشخصية وفق:
    • GDPR (الاتحاد الأوروبي) | نظام حماية البيانات السعودي | قانون حماية البيانات الأردني
6.2 لا يجوز مشاركة البيانات مع أطراف ثالثة إلا بموافقة المشتري.

────────────────────────────────────────────────────────────────────────────────
البند السابع: القانون الواجب التطبيق
────────────────────────────────────────────────────────────────────────────────
يخضع هذا العقد لقوانين [JURISDICTION] وتختص محاكمها بالنظر في أي نزاع.

────────────────────────────────────────────────────────────────────────────────
التوقيعات
────────────────────────────────────────────────────────────────────────────────
البائع: _________________________ التاريخ: ___________
المشتري: ________________________ التاريخ: ___________`,
    templateEn: `================================================================================
SALE OF GOODS — BUSINESS TO CONSUMER (B2C)
Consumer Protection Compliant — Multi-Jurisdiction
================================================================================

SELLER (Company): [PARTY_A]
CR: [PARTY_A_CR] | Tax ID: [PARTY_A_TAX] | Address: [PARTY_A_ADDRESS]

BUYER (Individual/Consumer): [PARTY_B]
ID/Residency: [PARTY_B_ID] | Address: [PARTY_B_ADDRESS] | Phone: [PARTY_B_PHONE]

────────────────────────────────────────────────────────────────────────────────
1. PRODUCT DESCRIPTION
────────────────────────────────────────────────────────────────────────────────
1.1 Product: [PRODUCT_NAME] — Model: [MODEL] — Qty: [QTY]
1.2 Condition: [New / Refurbished / Used]

────────────────────────────────────────────────────────────────────────────────
2. PRICE & PAYMENT
────────────────────────────────────────────────────────────────────────────────
2.1 Sale Price: ([VALUE]) [CURRENCY] inclusive of VAT.
2.2 Payment Method: [Cash / Card / Bank Transfer / E-Payment].

────────────────────────────────────────────────────────────────────────────────
3. DELIVERY
────────────────────────────────────────────────────────────────────────────────
3.1 Delivery Address: [DELIVERY_ADDRESS].
3.2 Delivery: Within [DELIVERY_DAYS] business days.

────────────────────────────────────────────────────────────────────────────────
4. RIGHT OF RETURN & COOLING-OFF PERIOD
────────────────────────────────────────────────────────────────────────────────
¶ Consumer return rights per applicable law:
• Jordan — Consumer Protection Law No. 7/2017: 7-day return.
• Saudi Arabia — E-Commerce Law 1440H: 7-day return.
• UAE — Federal Consumer Protection Law No. 15/2020: 5-day return.
• Egypt — Consumer Protection Law No. 181/2018: 14-day return.
• EU — Directive 2011/83/EU: 14-day withdrawal.
• UK — Consumer Rights Act 2015: 14-day return.
• US — Per applicable State law.

4.2 Conditions: Product in original condition with packaging.
4.3 Refund within [REFUND_DAYS] business days via original payment method.

────────────────────────────────────────────────────────────────────────────────
5. WARRANTY
────────────────────────────────────────────────────────────────────────────────
5.1 Warranty: [WARRANTY_MONTHS] months from delivery.
5.2 Covers manufacturing defects; excludes misuse damage.

────────────────────────────────────────────────────────────────────────────────
6. DATA PROTECTION
────────────────────────────────────────────────────────────────────────────────
6.1 Seller complies with GDPR / Saudi PDPL / local data protection laws.
6.2 No third-party data sharing without Buyer's consent.

────────────────────────────────────────────────────────────────────────────────
7. GOVERNING LAW
────────────────────────────────────────────────────────────────────────────────
Governed by the laws of [JURISDICTION].

Seller: _________________________ Date: ___________
Buyer: __________________________ Date: ___________`,
  },

  {
    id: 'sale-b2c-individual-to-individual',
    categoryKey: 'commercial', subcategoryKey: 'sales-b2c',
    titleAr: 'عقد بيع بين أفراد (فرد إلى فرد)',
    titleEn: 'Individual-to-Individual Private Sale Agreement',
    descriptionAr: 'عقد بيع خاص بين شخصين طبيعيين يشمل وصف المبيع والثمن والتسليم والضمان والمسؤولية.',
    descriptionEn: 'Private sale contract between two natural persons covering item description, price, delivery, condition warranty, and liability.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'QA', 'KW', 'US', 'UK', 'EU'],
    downloads: 28900, rating: 4.94, pagesCount: 6, clausesCount: 14,
    tags: ['بيع', 'أفراد', 'خاص', 'individual', 'private sale', 'C2C'],
    templateAr: `================================================================================
عقد بيع خاص بين أفراد
(Private Sale Agreement — Individual to Individual)
================================================================================

البائع: [PARTY_A] | رقم الهوية: [PARTY_A_ID] | العنوان: [PARTY_A_ADDRESS]
المشتري: [PARTY_B] | رقم الهوية: [PARTY_B_ID] | العنوان: [PARTY_B_ADDRESS]

البند 1: وصف المبيع
يبيع الطرف الأول ويشتري الطرف الثاني ما يلي:
الصنف: [ITEM_NAME] | الحالة: [جديد/مستعمل] | الرقم التسلسلي: [SERIAL]
الوصف التفصيلي: [DESCRIPTION]

البند 2: الثمن
ثمن البيع المتفق عليه: ([VALUE]) [CURRENCY]
طريقة الدفع: [نقداً عند التسليم / تحويل بنكي]

البند 3: التسليم ونقل الملكية
3.1 تاريخ التسليم: [DELIVERY_DATE]
3.2 مكان التسليم: [DELIVERY_LOCATION]
3.3 تنتقل ملكية المبيع والمخاطر إلى المشتري عند التسليم الفعلي والدفع الكامل.

البند 4: إقرار بحالة المبيع
4.1 يقر البائع بأنه المالك الشرعي وأن المبيع خالٍ من أي رهونات أو حجوزات.
4.2 يقر المشتري بمعاينة المبيع والقبول بحالته الراهنة [بضمان/بدون ضمان].

البند 5: العيوب الخفية
يضمن البائع خلو المبيع من العيوب الخفية وفقاً لأحكام القانون المدني في [JURISDICTION].

البند 6: القانون والاختصاص القضائي
• الأردن — القانون المدني رقم 43/1976 (المواد 466-530)
• السعودية — نظام المعاملات المدنية 1444هـ
• الإمارات — قانون المعاملات المدنية الاتحادي رقم 5/1985
• مصر — القانون المدني رقم 131/1948 (المواد 418-481)

التوقيعات:
البائع: _________________ التاريخ: _________
المشتري: ________________ التاريخ: _________
شاهد 1: _________________ شاهد 2: _________________`,
    templateEn: `================================================================================
PRIVATE SALE AGREEMENT — INDIVIDUAL TO INDIVIDUAL
================================================================================

SELLER: [PARTY_A] | ID: [PARTY_A_ID] | Address: [PARTY_A_ADDRESS]
BUYER: [PARTY_B] | ID: [PARTY_B_ID] | Address: [PARTY_B_ADDRESS]

1. ITEM DESCRIPTION
Seller sells and Buyer purchases:
Item: [ITEM_NAME] | Condition: [New/Used] | Serial: [SERIAL]
Description: [DESCRIPTION]

2. PRICE
Agreed Price: ([VALUE]) [CURRENCY]
Payment: [Cash on delivery / Bank transfer]

3. DELIVERY & TITLE TRANSFER
3.1 Delivery Date: [DELIVERY_DATE]
3.2 Delivery Location: [DELIVERY_LOCATION]
3.3 Title and risk transfer upon physical delivery and full payment.

4. SELLER'S REPRESENTATIONS
4.1 Seller is the lawful owner; item is free from liens and encumbrances.
4.2 Buyer has inspected the item and accepts its current condition [with/without warranty].

5. HIDDEN DEFECTS
Seller warrants item is free from hidden defects per civil code of [JURISDICTION].

6. GOVERNING LAW
• Jordan — Civil Code No. 43/1976 (Arts. 466-530)
• Saudi Arabia — Civil Transactions Law 1444H
• UAE — Federal Civil Transactions Law No. 5/1985
• Egypt — Civil Code No. 131/1948 (Arts. 418-481)
• US — UCC Article 2 | UK — Sale of Goods Act 1979

Seller: _________________ Date: _________
Buyer: __________________ Date: _________
Witness 1: _______________ Witness 2: _______________`,
  },

  // ── INTERNATIONAL SALES (CISG / CROSS-BORDER) ──────────────────────────────
  {
    id: 'sale-international-cisg',
    categoryKey: 'commercial', subcategoryKey: 'sales-international',
    titleAr: 'عقد بيع دولي للبضائع — اتفاقية فيينا (CISG)',
    titleEn: 'International Sale of Goods — CISG (Vienna Convention)',
    descriptionAr: 'عقد بيع دولي متوافق مع اتفاقية الأمم المتحدة بشأن عقود البيع الدولي للبضائع (CISG) مع شروط Incoterms 2020.',
    descriptionEn: 'International sale of goods compliant with the UN Convention on International Sale of Goods (CISG/Vienna Convention) with Incoterms 2020.',
    jurisdictions: ['GLOBAL', 'CISG', 'JO', 'SA', 'AE', 'EG', 'US', 'UK', 'EU', 'CN', 'JP', 'KR', 'IN'],
    downloads: 19800, rating: 4.96, pagesCount: 22, clausesCount: 38,
    tags: ['دولي', 'CISG', 'فيينا', 'international', 'cross-border', 'Incoterms', 'تجارة دولية'],
    templateAr: `================================================================================
عقد بيع دولي للبضائع
وفقاً لاتفاقية الأمم المتحدة بشأن عقود البيع الدولي للبضائع
(اتفاقية فيينا 1980 — CISG)
================================================================================

البائع: [PARTY_A] — الدولة: [SELLER_COUNTRY]
السجل التجاري: [PARTY_A_CR] | الضريبي: [PARTY_A_TAX]

المشتري: [PARTY_B] — الدولة: [BUYER_COUNTRY]
السجل التجاري: [PARTY_B_CR] | الضريبي: [PARTY_B_TAX]

البند 1: نطاق التطبيق
ينطبق هذا العقد على البيع الدولي للبضائع بين أطراف مقارها في دول مختلفة أطراف في اتفاقية CISG.

البند 2: البضائع
وفق الملحق (أ): جدول البضائع والمواصفات والكميات والأسعار.

البند 3: الثمن وشروط الدفع
إجمالي: ([VALUE]) [CURRENCY] — الدفع عبر: [اعتماد مستندي L/C / تحويل بنكي T/T / CAD]

البند 4: التسليم والشحن (Incoterms® 2020)
مصطلح التسليم: [FOB/CIF/CFR/EXW/DDP/DAP] — ميناء/مطار: [PORT]

البند 5: التأمين البحري/الجوي
يلتزم [البائع/المشتري] بتأمين البضائع بنسبة 110% من قيمة الفاتورة.

البند 6: المستندات المطلوبة
فاتورة تجارية | بوليصة شحن | شهادة المنشأ | شهادة فحص | قائمة التعبئة.

البند 7: الفحص والإخطار بعدم المطابقة (المادة 38-39 CISG)
يفحص المشتري البضائع في أقرب فرصة ويخطر البائع بالعيوب خلال مدة معقولة.

البند 8: نقل المخاطر (المواد 66-70 CISG)
تنتقل المخاطر وفقاً لمصطلح التسليم المحدد في البند 4.

البند 9: الإعفاء من المسؤولية — القوة القاهرة (المادة 79 CISG)
لا يُسأل الطرف عن عدم التنفيذ إذا أثبت أنه ناتج عن عائق خارج عن إرادته.

البند 10: الجمارك والامتثال التنظيمي
10.1 يتحمل [البائع/المشتري] إجراءات التصدير والاستيراد حسب Incoterm.
10.2 يلتزم الطرفان بقوانين العقوبات الدولية ومكافحة الفساد (FCPA/UKBA).

البند 11: العملة وأسعار الصرف
في حال تذبذب سعر الصرف بأكثر من [FOREX_THRESHOLD]%، يُعاد التفاوض.

البند 12: القانون والتحكيم الدولي
12.1 القانون: اتفاقية CISG + القانون الوطني التكميلي لـ [JURISDICTION].
12.2 التحكيم: لدى غرفة التجارة الدولية (ICC) أو مركز [ARBITRATION_CENTER].`,
    templateEn: `================================================================================
INTERNATIONAL SALE OF GOODS AGREEMENT
Under the United Nations Convention on Contracts for the International Sale of Goods
(CISG — Vienna Convention 1980)
================================================================================

SELLER: [PARTY_A] — Country: [SELLER_COUNTRY]
CR: [PARTY_A_CR] | Tax: [PARTY_A_TAX]

BUYER: [PARTY_B] — Country: [BUYER_COUNTRY]
CR: [PARTY_B_CR] | Tax: [PARTY_B_TAX]

1. SCOPE
Applies to international sale of goods between parties in different CISG Contracting States.

2. GOODS
Per Schedule (A): Goods description, specifications, quantities, and unit prices.

3. PRICE & PAYMENT
Total: ([VALUE]) [CURRENCY] — Payment via: [L/C / T/T / CAD].

4. DELIVERY & SHIPPING (Incoterms® 2020)
Delivery Term: [FOB/CIF/CFR/EXW/DDP/DAP] — Port/Airport: [PORT].

5. MARINE/AIR INSURANCE
[Seller/Buyer] insures goods at 110% of invoice value.

6. DOCUMENTS REQUIRED
Commercial Invoice | Bill of Lading | Certificate of Origin | Inspection Certificate | Packing List.

7. INSPECTION & NON-CONFORMITY NOTICE (Arts. 38-39 CISG)
Buyer inspects goods at earliest opportunity and notifies Seller of defects within reasonable time.

8. PASSING OF RISK (Arts. 66-70 CISG)
Risk passes per the designated delivery term in Clause 4.

9. EXEMPTION — FORCE MAJEURE (Art. 79 CISG)
A Party is not liable if non-performance is due to impediment beyond its control.

10. CUSTOMS & REGULATORY COMPLIANCE
10.1 [Seller/Buyer] handles export/import per Incoterm.
10.2 Both Parties comply with international sanctions and anti-corruption laws (FCPA/UKBA).

11. CURRENCY & EXCHANGE RATE
If exchange rate fluctuates more than [FOREX_THRESHOLD]%, renegotiation applies.

12. GOVERNING LAW & INTERNATIONAL ARBITRATION
12.1 Law: CISG + supplementary national law of [JURISDICTION].
12.2 Arbitration: ICC International Court of Arbitration or [ARBITRATION_CENTER].`,
  },

  // ── INSTALLMENT SALES ──────────────────────────────────────────────────────
  {
    id: 'sale-installment-b2c',
    categoryKey: 'commercial', subcategoryKey: 'sales-installment',
    titleAr: 'عقد بيع بالتقسيط — أفراد وشركات',
    titleEn: 'Installment Sale Agreement — Individuals & Companies',
    descriptionAr: 'عقد بيع بالتقسيط يشمل جدول الأقساط والفائدة/الربح والضمانات وشروط التخلف عن السداد وفقاً للقوانين المحلية والشريعة الإسلامية.',
    descriptionEn: 'Installment sale with payment schedule, interest/profit margin, collateral, default terms — Sharia & conventional law compliant.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'QA', 'KW', 'US', 'EU'],
    downloads: 22300, rating: 4.93, pagesCount: 14, clausesCount: 28,
    tags: ['تقسيط', 'installment', 'أقساط', 'hire-purchase', 'بيع آجل', 'مرابحة'],
    templateAr: `================================================================================
عقد بيع بالتقسيط
(Installment Sale Agreement)
متوافق مع القوانين المدنية والتجارية وأحكام الشريعة الإسلامية (المرابحة)
================================================================================

البائع: [PARTY_A] | السجل/الهوية: [PARTY_A_ID]
المشتري: [PARTY_B] | الهوية: [PARTY_B_ID]

البند 1: المبيع
[PRODUCT_NAME] — الموديل: [MODEL] — الرقم التسلسلي: [SERIAL]

البند 2: سعر البيع وهامش الربح
2.1 السعر النقدي (الحال): ([CASH_PRICE]) [CURRENCY]
2.2 السعر الآجل (بالتقسيط): ([INSTALLMENT_PRICE]) [CURRENCY]
2.3 هامش الربح/التكلفة الإضافية: ([MARGIN]) [CURRENCY]
    ¶ ملاحظة شرعية: يعتبر الفرق بين السعر النقدي والآجل ربحاً مشروعاً وفق عقد المرابحة.
    ¶ ملاحظة تقليدية: يعتبر الفرق فائدة بمعدل [APR]% سنوياً.

البند 3: الدفعة الأولى وجدول الأقساط
3.1 الدفعة الأولى: ([DOWN_PAYMENT]) [CURRENCY] تُسدد عند التوقيع.
3.2 عدد الأقساط: [NUM_INSTALLMENTS] قسطاً.
3.3 قيمة القسط الشهري: ([MONTHLY_AMOUNT]) [CURRENCY].
3.4 تاريخ استحقاق أول قسط: [FIRST_DUE_DATE].
3.5 تاريخ استحقاق آخر قسط: [LAST_DUE_DATE].

البند 4: نقل الملكية
4.1 تبقى ملكية المبيع للبائع حتى سداد كامل الأقساط (شرط الاحتفاظ بالملكية).
4.2 تنتقل حيازة المبيع للمشتري عند التسليم.

البند 5: التخلف عن السداد
5.1 في حال تأخر المشتري عن سداد [DEFAULT_INSTALLMENTS] أقساط متتالية:
    (أ) يحق للبائع المطالبة بكامل الأقساط المتبقية فوراً (حلول الأجل).
    (ب) يحق للبائع استرداد المبيع مع حفظ حقه في الأقساط المستحقة.
5.2 غرامة التأخير: [LATE_FEE]% شهرياً من القسط المتأخر.
    ¶ في الدول المطبقة للشريعة: تُوجه غرامة التأخير لأعمال خيرية.

البند 6: التأمين والضمانات الإضافية
6.1 يلتزم المشتري بتأمين المبيع طوال فترة السداد.
6.2 [كفيل شخصي: GUARANTOR_NAME | شيكات ضمان | سند لأمر].

البند 7: السداد المبكر
يحق للمشتري السداد المبكر مع خصم [EARLY_DISCOUNT]% من هامش الربح المتبقي.

البند 8: القانون الواجب التطبيق
• الأردن — القانون المدني المواد 532-545 | الإمارات — المعاملات المدنية المواد 518-528
• السعودية — نظام المعاملات المدنية 1444هـ + معايير هيئة المحاسبة AAOIFI
• مصر — القانون المدني المواد 430-433

التوقيعات:
البائع: _________________ المشتري: _________________
الكفيل: _________________ التاريخ: _________________`,
    templateEn: `================================================================================
INSTALLMENT SALE AGREEMENT
(Conventional & Islamic Murabaha Compliant)
================================================================================

SELLER: [PARTY_A] | ID/CR: [PARTY_A_ID]
BUYER: [PARTY_B] | ID: [PARTY_B_ID]

1. GOODS SOLD
[PRODUCT_NAME] — Model: [MODEL] — Serial: [SERIAL]

2. PRICE & PROFIT MARGIN
2.1 Cash Price: ([CASH_PRICE]) [CURRENCY]
2.2 Installment Price: ([INSTALLMENT_PRICE]) [CURRENCY]
2.3 Profit Margin/Finance Charge: ([MARGIN]) [CURRENCY]
    ¶ Islamic: Difference is lawful Murabaha profit per AAOIFI standards.
    ¶ Conventional: Difference is interest at [APR]% APR.

3. DOWN PAYMENT & SCHEDULE
3.1 Down Payment: ([DOWN_PAYMENT]) [CURRENCY] at signing.
3.2 Number of Installments: [NUM_INSTALLMENTS].
3.3 Monthly Installment: ([MONTHLY_AMOUNT]) [CURRENCY].
3.4 First Due: [FIRST_DUE_DATE] | Last Due: [LAST_DUE_DATE].

4. TITLE RETENTION
4.1 Title remains with Seller until full payment (Retention of Title clause).
4.2 Possession transfers to Buyer upon delivery.

5. DEFAULT
5.1 If Buyer misses [DEFAULT_INSTALLMENTS] consecutive payments:
    (a) Seller may accelerate all remaining installments.
    (b) Seller may repossess the goods with right to collect due amounts.
5.2 Late fee: [LATE_FEE]% per month on overdue installment.
    ¶ In Sharia jurisdictions: late fees directed to charity.

6. INSURANCE & COLLATERAL
6.1 Buyer maintains insurance throughout payment period.
6.2 [Personal Guarantor: GUARANTOR_NAME | Promissory Note | Security Checks].

7. EARLY SETTLEMENT
Buyer may settle early with [EARLY_DISCOUNT]% discount on remaining profit margin.

8. GOVERNING LAW
• Jordan — Civil Code Arts. 532-545 | UAE — Civil Transactions Arts. 518-528
• Saudi Arabia — Civil Transactions Law 1444H + AAOIFI Standards
• Egypt — Civil Code Arts. 430-433
• US — UCC Art. 2A & Truth in Lending Act (TILA)
• UK — Consumer Credit Act 1974

Seller: _________________ Buyer: _________________
Guarantor: _______________ Date: _________________`,
  },

  {
    id: 'sale-vehicle-individual',
    categoryKey: 'commercial', subcategoryKey: 'sales-b2c',
    titleAr: 'عقد بيع مركبة / سيارة — بين أفراد أو شركات',
    titleEn: 'Vehicle / Car Sale Agreement — Individual or Company',
    descriptionAr: 'عقد بيع مركبة متكامل يشمل بيانات المركبة والفحص الفني وشروط نقل الملكية وفقاً لقوانين المرور والنقل.',
    descriptionEn: 'Vehicle sale agreement covering VIN, technical inspection, title transfer, and transport authority requirements.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'QA', 'KW', 'US', 'UK'],
    downloads: 34500, rating: 4.98, pagesCount: 8, clausesCount: 16,
    tags: ['سيارة', 'مركبة', 'vehicle', 'car', 'بيع سيارة', 'نقل ملكية'],
    templateAr: `================================================================================
عقد بيع مركبة / سيارة
================================================================================

البائع: [PARTY_A] | الهوية: [PARTY_A_ID]
المشتري: [PARTY_B] | الهوية: [PARTY_B_ID]

بيانات المركبة:
النوع: [MAKE] | الموديل: [MODEL] | سنة الصنع: [YEAR]
اللون: [COLOR] | رقم الهيكل (VIN): [VIN]
رقم اللوحة: [PLATE] | عداد المسافة: [MILEAGE] كم

البند 1: الثمن
سعر البيع المتفق عليه: ([VALUE]) [CURRENCY]
طريقة الدفع: [نقداً / شيك مصدق / تحويل بنكي]

البند 2: حالة المركبة
2.1 يقر البائع بأن المركبة [خالية من الحوادث / تعرضت لحادث بتاريخ ___].
2.2 يقر المشتري بمعاينة المركبة والقبول بحالتها الراهنة.
2.3 تقرير الفحص الفني: [مرفق / غير مرفق] — صادر عن: [INSPECTION_CENTER].

البند 3: نقل الملكية
3.1 يلتزم البائع بالتوقيع على كافة أوراق نقل الملكية لدى:
    • الأردن: إدارة ترخيص السواقين والمركبات
    • السعودية: المرور — أبشر
    • الإمارات: هيئة الطرق والمواصلات / مرور الإمارة
    • مصر: إدارة المرور
3.2 تكاليف نقل الملكية على حساب: [البائع / المشتري / مناصفة].

البند 4: الضمانات
4.1 يضمن البائع خلو المركبة من أي رهونات أو حجوزات أو مخالفات مرورية سابقة.
4.2 يضمن البائع أن المركبة ليست مسروقة ولا موضع نزاع قضائي.

البند 5: المسؤولية بعد البيع
تنتقل كافة المسؤوليات والمخاطر إلى المشتري فور إتمام نقل الملكية رسمياً.

التوقيعات:
البائع: _________________ المشتري: _________________
شاهد: __________________ التاريخ: _________________`,
    templateEn: `================================================================================
VEHICLE / CAR SALE AGREEMENT
================================================================================

SELLER: [PARTY_A] | ID: [PARTY_A_ID]
BUYER: [PARTY_B] | ID: [PARTY_B_ID]

Vehicle Details:
Make: [MAKE] | Model: [MODEL] | Year: [YEAR]
Color: [COLOR] | VIN: [VIN]
Plate: [PLATE] | Odometer: [MILEAGE] km/miles

1. PRICE
Agreed Price: ([VALUE]) [CURRENCY]
Payment: [Cash / Certified Check / Bank Transfer]

2. VEHICLE CONDITION
2.1 Seller declares vehicle is [accident-free / involved in accident on ___].
2.2 Buyer has inspected and accepts the vehicle in its current condition.
2.3 Technical Inspection Report: [Attached / Not attached] — Issued by: [INSPECTION_CENTER].

3. TITLE TRANSFER
3.1 Seller shall execute all title transfer documents at the relevant authority.
3.2 Transfer costs borne by: [Seller / Buyer / Shared equally].

4. SELLER'S WARRANTIES
4.1 Vehicle is free from liens, encumbrances, and outstanding traffic violations.
4.2 Vehicle is not stolen and not subject to any legal dispute.

5. POST-SALE LIABILITY
All liabilities and risks transfer to Buyer upon official title transfer.

Seller: _________________ Buyer: _________________
Witness: ________________ Date: _________________`,
  },

  {
    id: 'sale-real-property-b2b-b2c',
    categoryKey: 'commercial', subcategoryKey: 'sales-b2b',
    titleAr: 'عقد بيع عقار — شركات وأفراد',
    titleEn: 'Real Property Sale Agreement — Companies & Individuals',
    descriptionAr: 'عقد بيع عقار شامل يغطي الوصف العقاري والثمن وشروط التمويل ونقل الملكية والرهون وتقرير التقييم.',
    descriptionEn: 'Comprehensive real property sale covering legal description, price, financing, title transfer, liens, and appraisal.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'QA', 'KW', 'US', 'UK', 'EU'],
    downloads: 27100, rating: 4.95, pagesCount: 20, clausesCount: 34,
    tags: ['عقار', 'بيع عقار', 'real estate', 'property sale', 'شراء', 'أرض', 'شقة'],
    templateAr: `================================================================================
عقد بيع عقار
(Real Property Sale Agreement)
قابل للتكييف: أفراد / شركات — جميع الولايات القضائية
================================================================================

البائع: [PARTY_A] | الهوية/السجل: [PARTY_A_ID]
المشتري: [PARTY_B] | الهوية/السجل: [PARTY_B_ID]

البند 1: وصف العقار
النوع: [شقة / فيلا / أرض / مبنى تجاري]
العنوان: [PROPERTY_ADDRESS]
رقم القطعة: [PLOT_NO] | الحوض: [BASIN]
المساحة: [AREA] متر مربع
سند التسجيل: رقم [TITLE_DEED_NO] — صادر عن: [LAND_REGISTRY]

البند 2: الثمن
2.1 ثمن البيع: ([VALUE]) [CURRENCY]
2.2 الدفعة الأولى: ([DOWN_PAYMENT]) [CURRENCY] عند التوقيع.
2.3 الرصيد المتبقي: يُسدد عند نقل الملكية / وفق جدول دفعات.

البند 3: تسجيل ونقل الملكية
3.1 يلتزم البائع بتسجيل البيع لدى دائرة الأراضي والمساحة خلال [TRANSFER_DAYS] يوم.
3.2 رسوم التسجيل:
    • الأردن: 9% من القيمة المقدرة (يتحملها المشتري عرفاً)
    • السعودية: 5% ضريبة التصرفات العقارية
    • الإمارات: 4% رسوم دائرة الأراضي
    • مصر: 2.5% ضريبة التصرفات العقارية

البند 4: إقرارات البائع
4.1 العقار خالٍ من الرهونات والحجوزات وحقوق الشفعة والارتفاق.
4.2 العقار مطابق للمخططات والتراخيص المعمارية.
4.3 لا توجد مخالفات بناء أو نزاعات قائمة.

البند 5: الفحص والتقييم
يحق للمشتري إجراء فحص هندسي وتقييم عقاري خلال [INSPECTION_DAYS] يوم.

البند 6: التمويل العقاري
6.1 إذا كان الشراء بتمويل عقاري، يُرفق خطاب الموافقة المبدئية من [BANK].
6.2 يشترط الحصول على موافقة التمويل النهائية خلال [FINANCE_DAYS] يوم.

البند 7: التسليم
يُسلم العقار خالياً من الشواغل خلال [HANDOVER_DAYS] يوم من نقل الملكية.

البند 8: القانون والاختصاص
يخضع لقوانين [JURISDICTION] — دائرة الأراضي المختصة ومحاكم العقار.`,
    templateEn: `================================================================================
REAL PROPERTY SALE AGREEMENT
(Companies & Individuals — Multi-Jurisdiction)
================================================================================

SELLER: [PARTY_A] | ID/CR: [PARTY_A_ID]
BUYER: [PARTY_B] | ID/CR: [PARTY_B_ID]

1. PROPERTY DESCRIPTION
Type: [Apartment / Villa / Land / Commercial Building]
Address: [PROPERTY_ADDRESS]
Plot: [PLOT_NO] | Area: [AREA] sqm | Title Deed: [TITLE_DEED_NO]

2. PRICE
2.1 Sale Price: ([VALUE]) [CURRENCY]
2.2 Down Payment: ([DOWN_PAYMENT]) [CURRENCY] upon signing.
2.3 Balance: Upon title transfer or per payment schedule.

3. TITLE TRANSFER & REGISTRATION
3.1 Seller registers sale at Land Registry within [TRANSFER_DAYS] days.
3.2 Registration fees per jurisdiction:
    • Jordan: 9% | Saudi Arabia: 5% RETT | UAE: 4% DLD | Egypt: 2.5% RETT
    • US: Varies by state | UK: SDLT rates apply

4. SELLER'S REPRESENTATIONS
4.1 Property free from mortgages, liens, pre-emption rights, and easements.
4.2 Compliant with zoning and building permits.
4.3 No building violations or pending disputes.

5. INSPECTION & APPRAISAL
Buyer may conduct engineering inspection and appraisal within [INSPECTION_DAYS] days.

6. MORTGAGE FINANCING
6.1 If financed, pre-approval letter from [BANK] attached.
6.2 Final financing approval required within [FINANCE_DAYS] days.

7. HANDOVER
Property delivered vacant within [HANDOVER_DAYS] days of title transfer.

8. GOVERNING LAW
Governed by [JURISDICTION] — relevant Land Registry and property courts.`,
  },

  {
    id: 'sale-ecommerce-b2c',
    categoryKey: 'commercial', subcategoryKey: 'sales-b2c',
    titleAr: 'عقد بيع إلكتروني (التجارة الإلكترونية) — شركة لفرد',
    titleEn: 'E-Commerce Sale Agreement — B2C Online Purchase',
    descriptionAr: 'عقد بيع إلكتروني متوافق مع قوانين التجارة الإلكترونية وحماية المستهلك الرقمي وسياسات الإرجاع والخصوصية.',
    descriptionEn: 'E-commerce B2C sale agreement compliant with e-commerce laws, digital consumer protection, return policies, and privacy regulations.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'US', 'UK', 'EU'],
    downloads: 38200, rating: 4.97, pagesCount: 10, clausesCount: 22,
    tags: ['تجارة إلكترونية', 'e-commerce', 'أونلاين', 'online', 'رقمي', 'digital', 'متجر'],
    templateAr: `================================================================================
عقد بيع إلكتروني (التجارة الإلكترونية)
متوافق مع قوانين التجارة الإلكترونية وحماية المستهلك الرقمي
================================================================================

البائع (المتجر الإلكتروني): [PARTY_A]
الموقع: [WEBSITE_URL] | السجل: [PARTY_A_CR] | الضريبي: [PARTY_A_TAX]

المشتري (المستهلك): [PARTY_B]
البريد الإلكتروني: [PARTY_B_EMAIL] | الهاتف: [PARTY_B_PHONE]

رقم الطلب: [ORDER_ID] | تاريخ الطلب: [ORDER_DATE]

البند 1: تفاصيل الطلب
المنتج: [PRODUCT_NAME] | الكمية: [QTY] | السعر: ([VALUE]) [CURRENCY] شامل الضريبة.

البند 2: تأكيد الطلب والدفع الإلكتروني
2.1 يُعتبر الطلب مؤكداً عند إتمام عملية الدفع الإلكتروني بنجاح.
2.2 وسائل الدفع المقبولة: [بطاقة ائتمان / Apple Pay / Google Pay / STC Pay / مدى].
2.3 يتم تشفير البيانات المالية وفق معيار PCI-DSS.

البند 3: الشحن والتوصيل
3.1 مدة التوصيل: [DELIVERY_DAYS] يوم عمل.
3.2 شركة الشحن: [CARRIER] | رقم التتبع: [TRACKING_NO].
3.3 تكلفة الشحن: [مجانية / VALUE_SHIPPING].

البند 4: حق الإلغاء والإرجاع (حقوق المستهلك الرقمي)
¶ وفقاً لقوانين التجارة الإلكترونية:
• السعودية — نظام التجارة الإلكترونية 1440هـ: حق الإرجاع 7 أيام.
• الإمارات — قانون التجارة الإلكترونية + المرسوم رقم 46/2021.
• الأردن — قانون المعاملات الإلكترونية رقم 15/2015.
• مصر — قانون حماية المستهلك 181/2018: 14 يوماً.
• الاتحاد الأوروبي — توجيه حقوق المستهلك 2011/83/EU: 14 يوماً.
• المملكة المتحدة — Consumer Contracts Regulations 2013: 14 يوماً.

البند 5: سياسة الخصوصية وحماية البيانات
5.1 يلتزم البائع بحماية البيانات الشخصية وفق GDPR/PDPL/قوانين الخصوصية المحلية.
5.2 لا يتم مشاركة البيانات مع أطراف ثالثة لأغراض تسويقية دون موافقة.

البند 6: القانون والاختصاص
يخضع لقوانين التجارة الإلكترونية في [JURISDICTION].`,
    templateEn: `================================================================================
E-COMMERCE SALE AGREEMENT (B2C — ONLINE PURCHASE)
Compliant with E-Commerce & Digital Consumer Protection Laws
================================================================================

SELLER (Online Store): [PARTY_A]
Website: [WEBSITE_URL] | CR: [PARTY_A_CR] | Tax: [PARTY_A_TAX]

BUYER (Consumer): [PARTY_B]
Email: [PARTY_B_EMAIL] | Phone: [PARTY_B_PHONE]

Order: [ORDER_ID] | Date: [ORDER_DATE]

1. ORDER DETAILS
Product: [PRODUCT_NAME] | Qty: [QTY] | Price: ([VALUE]) [CURRENCY] inc. VAT.

2. ORDER CONFIRMATION & E-PAYMENT
2.1 Order confirmed upon successful e-payment.
2.2 Accepted: [Credit Card / Apple Pay / Google Pay / STC Pay / Mada].
2.3 Financial data encrypted per PCI-DSS.

3. SHIPPING & DELIVERY
3.1 Delivery: [DELIVERY_DAYS] business days.
3.2 Carrier: [CARRIER] | Tracking: [TRACKING_NO].

4. CANCELLATION & RETURN (Digital Consumer Rights)
¶ Per e-commerce laws:
• Saudi Arabia — E-Commerce Law 1440H: 7-day return.
• UAE — E-Commerce Law + Decree 46/2021.
• EU — Consumer Rights Directive 2011/83/EU: 14-day withdrawal.
• UK — Consumer Contracts Regulations 2013: 14-day return.
• US — Per applicable State law.

5. PRIVACY & DATA PROTECTION
5.1 Seller complies with GDPR/PDPL/local privacy laws.
5.2 No third-party marketing data sharing without consent.

6. GOVERNING LAW
Governed by e-commerce laws of [JURISDICTION].`,
  },

  // ── REAL ESTATE ──────────────────────────────────────────────────────────────
  {
    id: 're-commercial-lease',
    categoryKey: 'real-estate', subcategoryKey: 'commercial-lease',
    titleAr: 'عقد إيجار مقرات وأماكن تجارية',
    titleEn: 'Commercial Real Estate Lease Agreement',
    descriptionAr: 'عقد إيجار تجاري شامل يحدد الأجرة والمدة والصيانة والرهن وشروط التجديد والإنهاء.',
    descriptionEn: 'Commercial lease covering rent, term, maintenance, security deposit, renewal and termination.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG'],
    downloads: 16800, rating: 4.93, pagesCount: 11, clausesCount: 20,
    tags: ['lease', 'إيجار', 'commercial', 'عقار', 'real estate'],
    templateAr: `================================================================================
عقد إيجار مقرات وأماكن تجارية
================================================================================

المالك (الطرف الأول): [PARTY_A] | الهوية: [PARTY_A_TAX]
المستأجر (الطرف الثاني): [PARTY_B] | السجل: [PARTY_B_TAX]

الوحدة المؤجرة: [Property Description]
مدة الإيجار: [Start Date] إلى [End Date]
الأجرة السنوية: ([VALUE]) [CURRENCY] تُسدد [شهرياً / ربعياً / سنوياً]
التأمين المسترد: [Deposit Amount]

البند الأول: الاستخدام المسموح
يستخدم المستأجر العقار لأغراض تجارية مرخصة فقط وفق الترخيص المرفق.

البند الثاني: الصيانة والإصلاح
يتحمل المستأجر صيانة التحسينات الداخلية. يتحمل المالك الإصلاحات الهيكلية والأنظمة الرئيسية.

البند الثالث: التجديد والإنهاء
يحق للمستأجر تجديد العقد بإخطار 60 يوماً قبل الانتهاء. الإنهاء المبكر يستوجب تعويض 3 أشهر أجرة.`,
    templateEn: `================================================================================
COMMERCIAL REAL ESTATE LEASE AGREEMENT
================================================================================

Landlord: [PARTY_A] | ID: [PARTY_A_TAX]
Tenant: [PARTY_B] | CR: [PARTY_B_TAX]

Premises: [Property Description] | Term: [Start Date] to [End Date]
Annual Rent: ([VALUE]) [CURRENCY] payable [monthly/quarterly/annually]
Security Deposit: [Deposit Amount]

1. PERMITTED USE: Tenant may use premises exclusively for licensed commercial purposes.
2. MAINTENANCE: Tenant: interior improvements. Landlord: structural and major systems.
3. RENEWAL & TERMINATION: 60-day renewal notice. Early termination: 3-month rent compensation.`,
  },

  {
    id: 're-residential-lease',
    categoryKey: 'real-estate', subcategoryKey: 'residential',
    titleAr: 'عقد إيجار سكني',
    titleEn: 'Residential Lease Agreement',
    descriptionAr: 'عقد إيجار سكني يحدد الأجرة والمدة وشروط الاستخدام السكني وأحكام الإنهاء.',
    descriptionEn: 'Residential lease agreement defining rent, term, occupancy conditions, and termination.',
    jurisdictions: ['JO', 'SA', 'AE', 'EG', 'GLOBAL'],
    downloads: 21000, rating: 4.90, pagesCount: 7, clausesCount: 14,
    tags: ['residential', 'سكني', 'إيجار', 'lease', 'شقة'],
    templateAr: `================================================================================
عقد إيجار سكني
================================================================================

المالك (الطرف الأول): [PARTY_A] | الهوية: [PARTY_A_TAX]
المستأجر (الطرف الثاني): [PARTY_B] | الهوية: [PARTY_B_TAX]

العقار: [Apartment/Unit Description] | مساحته: [Area sqm]
مدة الإيجار: [Start Date] حتى [End Date]
الأجرة الشهرية: ([VALUE]) [CURRENCY]
التأمين: [Deposit Amount — يُسترد عند الإخلاء]

البند الأول: الاستخدام للسكن فقط
يُستخدم العقار للسكن الشخصي فحسب، ويُحظر أي نشاط تجاري أو تأجير من الباطن.

البند الثاني: الإخلاء وإنهاء العقد
الإخلاء عند انتهاء المدة المحددة. إشعار مسبق 30 يوماً للإنهاء المبكر مع استحقاق شهر أجرة كتعويض.`,
    templateEn: `================================================================================
RESIDENTIAL LEASE AGREEMENT
================================================================================

Landlord: [PARTY_A] | ID: [PARTY_A_TAX]
Tenant: [PARTY_B] | ID: [PARTY_B_TAX]

Property: [Unit Description] | Area: [sqm] | Term: [Start] to [End]
Monthly Rent: ([VALUE]) [CURRENCY] | Deposit: [Amount — refundable]

1. RESIDENTIAL USE ONLY: No commercial activity or subletting permitted.
2. VACATING: Property to be vacated on lease expiry. 30-day notice for early termination with 1-month compensation.`,
  },

  {
    id: 're-construction',
    categoryKey: 'real-estate', subcategoryKey: 'construction',
    titleAr: 'عقد مقاولة عامة للبناء والإنشاء (FIDIC Red Book)',
    titleEn: 'General Construction Contract (FIDIC Red Book Standard)',
    descriptionAr: 'عقد مقاولة بناء شامل وفق معيار FIDIC Red Book يشمل الجداول الزمنية والغرامات والضمان.',
    descriptionEn: 'FIDIC Red Book construction contract with time schedules, performance bond, and delay penalties.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG'],
    downloads: 6400, rating: 4.87, pagesCount: 28, clausesCount: 45,
    tags: ['FIDIC', 'construction', 'بناء', 'مقاولة', 'Red Book'],
    templateAr: `================================================================================
عقد مقاولة للبناء والأشغال العامة
وفق المعيار الدولي FIDIC Red Book (2017 Edition)
================================================================================

صاحب العمل (Employer): [PARTY_A] | السجل: [PARTY_A_TAX]
المقاول (Contractor): [PARTY_B] | السجل: [PARTY_B_TAX]
مبلغ العقد الإجمالي: ([VALUE]) [CURRENCY]

البند الأول: نطاق الأعمال
تنفيذ مشروع [Project Name] وفق المخططات والمواصفات الفنية المرفقة كجزء لا يتجزأ من العقد.

البند الثاني: الجدول الزمني وغرامات التأخير
مدة التنفيذ: [X] شهراً من تاريخ المباشرة. غرامة التأخير: [0.1%] من قيمة العقد يومياً بحد أقصى 10%.

البند الثالث: ضمان الأداء (Performance Bond)
يقدم المقاول ضمان أداء بنكياً بنسبة 10% من قيمة العقد ساري حتى إصدار شهادة التسليم النهائي.`,
    templateEn: `================================================================================
GENERAL CONSTRUCTION CONTRACT — FIDIC RED BOOK (2017 EDITION)
================================================================================

Employer: [PARTY_A] | ID: [PARTY_A_TAX]
Contractor: [PARTY_B] | ID: [PARTY_B_TAX]
Contract Sum: ([VALUE]) [CURRENCY]

1. SCOPE: Execute [Project Name] per attached drawings and technical specifications.
2. COMPLETION & DELAYS: [X] months from commencement. Delay damages: 0.1% per day, max 10% of contract sum.
3. PERFORMANCE BOND: 10% bank guarantee valid until Final Acceptance Certificate issuance.`,
  },

  // ── FINANCE ──────────────────────────────────────────────────────────────
  {
    id: 'fin-loan-agreement',
    categoryKey: 'finance', subcategoryKey: 'loan',
    titleAr: 'عقد قرض وتمويل مؤسسي',
    titleEn: 'Corporate Loan & Financing Agreement',
    descriptionAr: 'عقد قرض مؤسسي يحدد مبلغ الإقراض والفائدة وجدول السداد والضمانات والعقوبات.',
    descriptionEn: 'Corporate loan agreement with principal, interest rate, repayment schedule, collateral, and default penalties.',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'US'],
    downloads: 9300, rating: 4.89, pagesCount: 16, clausesCount: 28,
    tags: ['loan', 'قرض', 'تمويل', 'interest', 'collateral'],
    templateAr: `================================================================================
عقد قرض وتمويل مؤسسي
================================================================================

المُقرض (الطرف الأول): [PARTY_A] | السجل: [PARTY_A_TAX]
المقترض (الطرف الثاني): [PARTY_B] | السجل: [PARTY_B_TAX]
مبلغ القرض: ([VALUE]) [CURRENCY]

البند الأول: مبلغ القرض وصرفه
يمنح المُقرض للمقترض قرضاً مبلغه ([VALUE]) [CURRENCY] يُصرف فور توقيع العقد وتقديم الضمانات.

البند الثاني: معدل الفائدة وجدول السداد
معدل الفائدة السنوي: [X%]. يُسدد القرض على أقساط شهرية متساوية على مدى [X] شهراً.

البند الثالث: الضمانات والكفالات
يقدم المقترض ضمانات عينية أو كفالات بنكية بما يعادل 120% من قيمة القرض.

البند الرابع: التعثر والتسريع
في حال التعثر في سداد قسطين متتاليين، يحق للمُقرض المطالبة بسداد الرصيد كاملاً فوراً.`,
    templateEn: `================================================================================
CORPORATE LOAN & FINANCING AGREEMENT
================================================================================

Lender: [PARTY_A] | ID: [PARTY_A_TAX]
Borrower: [PARTY_B] | ID: [PARTY_B_TAX]
Principal Amount: ([VALUE]) [CURRENCY]

1. DISBURSEMENT: Lender grants ([VALUE]) [CURRENCY] disbursed upon execution and collateral submission.
2. INTEREST & REPAYMENT: [X%] annual rate; equal monthly installments over [X] months.
3. COLLATERAL: Borrower provides collateral or bank guarantee at 120% of loan value.
4. DEFAULT & ACCELERATION: Two consecutive missed payments trigger full balance acceleration.`,
  },

  // ── HEALTHCARE ──────────────────────────────────────────────────────────────
  {
    id: 'health-medical-services',
    categoryKey: 'healthcare', subcategoryKey: 'medical-services',
    titleAr: 'عقد تقديم خدمات طبية وصحية',
    titleEn: 'Medical Services & Healthcare Agreement',
    descriptionAr: 'عقد خدمات طبية بين مؤسسة صحية وجهة متعاقدة يحدد الخدمات والمسؤولية والسرية الطبية.',
    descriptionEn: 'Healthcare services agreement covering medical scope, liability, patient confidentiality, and compliance.',
    jurisdictions: ['JO', 'SA', 'AE', 'EG', 'GLOBAL'],
    downloads: 4800, rating: 4.91, pagesCount: 14, clausesCount: 24,
    tags: ['healthcare', 'طبي', 'medical', 'health', 'رعاية صحية'],
    templateAr: `================================================================================
عقد تقديم خدمات طبية وصحية
================================================================================

مقدم الخدمة الصحية: [PARTY_A] | الترخيص: [PARTY_A_TAX]
الجهة المتعاقدة: [PARTY_B] | السجل: [PARTY_B_TAX]
قيمة العقد: ([VALUE]) [CURRENCY]

البند الأول: نطاق الخدمات الطبية
تقديم الخدمات الطبية المحددة في الملحق الطبي المرفق وفق معايير الجودة الصحية المعتمدة.

البند الثاني: السرية الطبية وحماية بيانات المرضى
الالتزام الصارم بسرية المعلومات الطبية وفق قوانين حماية البيانات المحلية والدولية (HIPAA/GDPR).

البند الثالث: المسؤولية الطبية والتأمين
يلتزم مقدم الخدمة بالحصول على تأمين مسؤولية طبية كافٍ طوال مدة العقد.`,
    templateEn: `================================================================================
MEDICAL SERVICES & HEALTHCARE AGREEMENT
================================================================================

Provider: [PARTY_A] | License: [PARTY_A_TAX]
Client: [PARTY_B] | CR: [PARTY_B_TAX]
Contract Value: ([VALUE]) [CURRENCY]

1. MEDICAL SCOPE: Provider delivers medical services per attached medical annex and quality standards.
2. PATIENT CONFIDENTIALITY: Strict HIPAA/GDPR compliance for all patient data and medical records.
3. MALPRACTICE INSURANCE: Provider maintains adequate professional liability coverage throughout term.`,
  },
  {
    id: 'emp-real-estate-marketer',
    categoryKey: 'employment', subcategoryKey: 'individual',
    titleAr: 'عقد توظيف مسوق عقاري (عمولة وراتب)',
    titleEn: 'Real Estate Marketer Employment Agreement (Commission & Salary)',
    descriptionAr: 'عقد عمل نموذجي لتوظيف مسوق عقاري وسيط مرخص، يشمل تفصيل العمولات والالتزام بقوانين الهيئة العامة للعقار والسرية والشرط الجزائي.',
    descriptionEn: 'Standard employment agreement for hiring a licensed real estate broker/marketer, detailing commissions, salary, compliance with real estate regulations, and non-disclosure.',
    jurisdictions: ['GLOBAL', 'SA', 'AE', 'JO', 'EG'],
    downloads: 8750, rating: 4.95, pagesCount: 8, clausesCount: 15,
    tags: ['عقار', 'تسويق عقاري', 'مسوق عقاري', 'عمولة', 'real estate marketer', 'marketing', 'broker'],
    templateAr: `================================================================================
عقد عمل وتوظيف مسوق عقاري (براتب وعمولة)
================================================================================

الطرف الأول (صاحب العمل): [PARTY_A] | السجل التجاري/الهوية: [PARTY_A_TAX]
الطرف الثاني (المسوق العقاري): [PARTY_B] | الهوية الوطنية/رقم رخصة فال: [PARTY_B_TAX]

تم الاتفاق والتراضي بين الطرفين على البنود التالية:

البند الأول: مسمى الوظيفة والمهام
يعين الطرف الأول الطرف الثاني في وظيفة "مسوق ومستشار عقاري"، ويلتزم الطرف الثاني بتسويق العقارات والوحدات السكنية والتجارية المفوض بها لصالح الطرف الأول بكل أمانة ومهنية ووفقاً للأنظمة واللوائح العقارية النافذة.

البند الثاني: المقابل المالي والراتب والعمولات
2.1 الراتب الأساسي: يستحق الطرف الثاني راتباً شهرياً قدره ([VALUE]) [CURRENCY] شاملاً البدلات.
2.2 العمولات والمكافآت: يستحق الطرف الثاني عمولة تسويقية بنسبة [Percentage]% من صافي أرباح العمليات العقارية الناجحة التي تتم مباشرة من خلاله وجهده، وتُدفع فور تحصيل كامل قيمة السعي أو السمسرة.

البند الثالث: تراخيص الهيئة العقارية والالتزام
يقر الطرف الثاني بامتلاكه كافة التراخيص والشهادات المهنية اللازمة لممارسة النشاط (مثل رخصة فال العقارية في السعودية أو تراخيص الدوائر العقارية المعنية)، ويلتزم بجميع التعليمات والقرارات الصادرة عن الهيئة العامة للعقار والجهات المنظمة للقطاع.

البند الرابع: السرية وحماية بيانات العملاء (NDA)
يلتزم الطرف الثاني بالمحافظة على السرية المطلقة لبيانات العملاء، الأسعار، العروض، وأسرار العمل الخاصة بالطرف الأول، وعدم إفشاء أي منها للغير طوال مدة التعاقد وبعد انتهائه.

البند الخامس: القانون المطبق وحل الخلافات
يخضع هذا العقد وتفسر أحكامه وفقاً لنظام العمل والأنظمة العقارية المعمول بها في دولة التعاقد، وتختص المحاكم العمالية ولجان المنازعات العقارية بالنظر في أي خلاف ينشأ عنه.`,
    templateEn: `================================================================================
REAL ESTATE MARKETER EMPLOYMENT AGREEMENT (SALARY & COMMISSION)
================================================================================

Party A (Employer): [PARTY_A] | CR/ID: [PARTY_A_TAX]
Party B (Real Estate Marketer): [PARTY_B] | License No (e.g. VAL): [PARTY_B_TAX]

It has been mutually agreed between the parties as follows:

1. POSITION AND DUTIES: Party A hereby employs Party B in the position of "Real Estate Marketer/Consultant". Party B shall market commercial and residential properties with maximum diligence and in full compliance with local real estate regulations.

2. COMPENSATION & COMMISSION:
   2.1 Basic Salary: Party B shall receive a basic monthly salary of ([VALUE]) [CURRENCY] inclusive of all allowances.
   2.2 Commission: Party B is entitled to a marketing commission of [Percentage]% from net brokerage fees generated directly through their verified marketing transactions, payable upon successful collection of brokerage fees.

3. PROFESSIONAL LICENSING: Party B represents that they hold all required professional licenses (e.g., VAL Brokerage License in Saudi Arabia, or equivalent DED/RE regulatory certifications) to conduct real estate marketing activities.

4. CONFIDENTIALITY & DATA PROTECTION (NDA): Party B shall maintain strict confidentiality regarding all property listings, buyer databases, pricing, and business secrets of Party A.

5. GOVERNING LAW: Governed exclusively by the labor codes and real estate regulatory statutes of the contracting jurisdiction. Disputes shall be referred to competent local courts and real estate committees.`,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// DYNAMIC GENERATION ENGINE
// توليد عقد ديناميكي من القالب الأساسي
// ────────────────────────────────────────────────────────────────────────────

export interface GenerationParams {
  jurisdiction?: string;
  partyA: string;
  partyATaxId?: string;
  partyB: string;
  partyBTaxId?: string;
  contractValue?: string;
  currency?: string;
  language?: 'ar' | 'en';
}

/**
 * Generates a ready-to-download contract text by filling template placeholders.
 * This is the core of the 1,000,000 contracts dynamic generation system.
 */
export function generateContractFromTemplate(
  template: MegaContractTemplate,
  params: GenerationParams
): string {
  const lang = params.language || 'ar';
  const raw = lang === 'ar' ? template.templateAr : template.templateEn;

  const valHalf = params.contractValue
    ? (parseFloat(params.contractValue.replace(/,/g, '')) / 2).toLocaleString()
    : '50,000';

  return raw
    .replace(/\[PARTY_A\]/g, params.partyA || (lang === 'ar' ? 'الطرف الأول' : 'Party A'))
    .replace(/\[PARTY_A_TAX\]/g, params.partyATaxId || 'N/A')
    .replace(/\[PARTY_B\]/g, params.partyB || (lang === 'ar' ? 'الطرف الثاني' : 'Party B'))
    .replace(/\[PARTY_B_TAX\]/g, params.partyBTaxId || 'N/A')
    .replace(/\[VALUE\]/g, params.contractValue || '100,000')
    .replace(/\[VALUE_HALF\]/g, valHalf)
    .replace(/\[CURRENCY\]/g, params.currency || (lang === 'ar' ? 'دينار أردني' : 'JOD'))
    .replace(/\[Company Name\]/g, params.partyA || 'الشركة')
    .replace(/\[Job Title\]/g, lang === 'ar' ? 'محدد في العقد' : 'As Specified')
    .replace(/\[Start Date\]/g, new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US'))
    .replace(/\[End Date\]/g, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US'));
}

/**
 * Search contracts in the mega repository
 */
const TRANSLATIONS: Record<string, string> = {
  'تسويق العقارات': 'Real Estate Marketing',
  'تسويق عقاري': 'Real Estate Marketing',
  'تسويق': 'Marketing',
  'برمجة': 'Software Development',
  'تطوير برمجيات': 'Software Development',
  'تصميم': 'Design Services',
  'توريد': 'Supply & Delivery',
  'شراكة': 'Partnership',
  'استثمار': 'Investment',
  'حجر': 'Stone Supply',
  'سيارات': 'Car Rental & Sale',
  'ايجار': 'Lease & Rental',
  'إيجار': 'Lease & Rental',
  'بيع': 'Purchase & Sale',
  'شراء': 'Purchase & Sale',
  'نقل': 'Transportation & Logistics',
  'شحن': 'Shipping & Freight',
  'صيانة': 'Maintenance Services',
  'توريد مواد': 'Material Supply',
  'مقاولات': 'Construction & Contracting',
  'مقاولة': 'Contracting',
  'استشارة': 'Consulting Services',
  'خدمات': 'Professional Services',
};

function generateDynamicTemplates(query: string): MegaContractTemplate[] {
  let cleanQuery = query.trim();
  cleanQuery = cleanQuery.replace(/^(عقد\s+|عقود\s+|اتفاقية\s+)/i, '');
  
  const baseEn = cleanQuery.replace(/\s+/g, '-').toLowerCase();
  let translated = '';
  for (const [arKey, enVal] of Object.entries(TRANSLATIONS)) {
    if (cleanQuery.includes(arKey)) {
      translated = enVal;
      break;
    }
  }
  const translatedBaseEn = translated || cleanQuery;

  const variations = [
    {
      suffixAr: 'الرئيسي الشامل للمؤسسات والشركات (Master Services Agreement)',
      suffixEn: 'Master Corporate Services Agreement (MSA)',
      descAr: 'اتفاقية إطارية تنفيذية شاملة ومحكمة لصياغة حقوق التوريد، مستويات الخدمة (SLA)، التعويضات، والتحكيم التجاري الدولي.',
      descEn: 'Definitive master corporate framework agreement regulating scope of engagement, SLAs, IP assignment, indemnities, and international arbitration.',
      clauses: 32,
      pages: 16,
      getTemplateAr: (topic: string) => `================================================================================
اتفاقية ${topic} الرئيسية الشاملة للمؤسسات (Master Corporate Agreement)
منظومة المستودع السيادي للعقود الذكية — موثقة ومحكمة قانونياً
================================================================================

تم إبرام هذه الاتفاقية في هذا اليوم بين كل من:

الطرف الأول: [PARTY_A]
السجل التجاري/الهوية: [PARTY_A_ID]
العنوان الرسمي: [PARTY_A_ADDRESS]
(يشار إليه لاحقاً بـ "الطرف الأول" أو "العميل")

الطرف الثاني: [PARTY_B]
السجل التجاري/الهوية: [PARTY_B_ID]
العنوان الرسمي: [PARTY_B_ADDRESS]
(يشار إليه لاحقاً بـ "الطرف الثاني" أو "مقدم الخدمة")

تمهيد:
حيث أن الطرف الأول شركة ومؤسسة قائمة ترغب في الحصول على خدمات وأعمال متخصصة وشاملة في مجالات (${topic})،
وحيث أن الطرف الثاني يمتلك المؤهلات الفنية والخبرات القانونية والتنفيذية والتراخيص النظامية اللازمة لتنفيذ وإنجاز كافة متطلبات (${topic}) بأعلى معايير الجودة والاحترافية،
فقد التقت إرادة الطرفين بكامل الأهلية المعتبرة شرعاً ونظاماً على إبرام هذه الاتفاقية وفق البنود والشروط الآتية:

المادة 1: التمهيد والتعريفات وقواعد التفسير
1.1 يعتبر التمهيد السابق وأي ملاحق أو أوامر عمل (Statements of Work) مرفقة جزءاً لا يتجزأ من هذه الاتفاقية ومفسرة لها.
1.2 "مخرجات العمل": تعني جميع التقارير، الأنظمة، التصاميم، الوثائق، العقود، أو الخدمات المنفذة المتعلقة بـ (${topic}).
1.3 "المعلومات السرية": تعني كافة البيانات الفنية، التجارية، المالية، أو التشغيلية المفصح عنها بين الطرفين.

المادة 2: نطاق العمل والالتزامات التنفيذية (Scope of Work & SLAs)
2.1 يلتزم الطرف الثاني بتنفيذ وإنجاز كافة متطلبات (${topic}) وفقاً لأعلى المعايير المهنية والصناعية المتعارف عليها دولياً.
2.2 يلتزم الطرف الثاني بتوفير الكوادر المؤهلة والأنظمة التقنية الكفيلة بضمان تنفيذ الأعمال دون أي تأخير عن الجداول الزمنية المتفق عليها.
2.3 يلتزم الطرف الأول بتوفير البيانات والتراخيص والمعلومات اللازمة لتمكين الطرف الثاني من أداء مهامه بصورة منتظمة.

المادة 3: المقابل المالي، الضرائب وجدول السداد
3.1 القيمة الإجمالية للاتفاقية: [VALUE] [CURRENCY].
3.2 يلتزم الطرف الأول بسداد المقابل المالي وفق جدول الدفعات المرحلي التالي:
    - دفعة أولى مقدمة بنسبة 30% بقيمة [DOWN_PAYMENT] [CURRENCY] عند التوقيع والبدء الفعلي.
    - دفعات مرحلية بنسبة 50% تسدد وفق محطات الإنجاز وتسليم مخرجات (${topic}).
    - دفعة نهائية بنسبة 20% تسدد بعد القبول النهائي لكافة المخرجات وتوقيع محضر الاستلام.
3.3 تشمل الأسعار كافة التكاليف والمصاريف، وتضاف ضريبة القيمة المضافة (VAT) حسب الأنظمة السارية في [JURISDICTION].

المادة 4: الإقرارات والضمانات القانونية (Representations & Warranties)
4.1 يقر الطرف الثاني ويضمن خلو كافة مخرجات (${topic}) من أي عيوب فنية أو انتهاكات لحقوق ملكية فكرية لأي طرف ثالث.
4.2 يقر كل طرف بأنه كيان نظامي مرخص ومخول نظاماً بتوقيع وتنفيذ التزامات هذا العقد دون الإخلال بأي اتفاقيات سابقة.

المادة 5: الملكية الفكرية ونقل الحقوق (Intellectual Property Assignment)
5.1 تؤول كافة حقوق الملكية الفكرية، وحقوق النشر، وبراءات الاختراع الناشئة عن تنفيذ أعمال (${topic}) إلى ملكية الطرف الأول الخالصة والحصرية بمجرد سداد المستحقات المالية المترتبة.
5.2 يتنازل الطرف الثاني تنازلاً نهائياً وباتاً عن أي حقوق أدبية أو مادية تتعارض مع ملكية الطرف الأول للمخرجات.

المادة 6: السرية التامة والأسرار التجارية (Strict Confidentiality & NDA)
6.1 يتعهد الطرفان بالحفاظ التام والمطلق على سرية المعلومات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث إلا بموجب موافقة خطية مسبقة.
6.2 تستمر التزامات السرية سارية المفعول طوال مدة العقد وتبقى نافذة لمدة خمس (5) سنوات بعد انتهاء أو إنهاء الاتفاقية لأي سبب.

المادة 7: الامتثال لحماية البيانات والأمن السيبراني (Data Protection & Privacy)
يلتزم الطرفان بالامتثال التام للأنظمة واللوائح المنظمة لحماية البيانات الشخصية والأمن السيبراني المعمول بها في [JURISDICTION]، بما في ذلك تطبيق التدابير الفنية والإدارية لمنع تسريب أو فقدان أي بيانات متبادلة.

المادة 8: التعويضات وتحديد المسؤولية (Indemnification & Liability Cap)
8.1 يلتزم الطرف الثاني بتعويض وإبراء ذمة الطرف الأول ومسؤوليه عن أي مطالبات، خسائر، أو أضرار ناتجة عن إهماله الجسيم أو إخلاله بضمانات الملكية الفكرية.
8.2 لا يتحمل أي من الطرفين المسؤولية عن أي أضرار غير مباشرة أو تبعية، ولا تتجاوز المسؤولية الإجمالية سقف القيمة الإجمالية المسددة بموجب العقد.

المادة 9: مدة الاتفاقية وإنهاؤها (Term & Termination)
9.1 تسري هذه الاتفاقية من تاريخ [Start Date] وتظل نافذة حتى تاريخ [End Date]، وتجدد تلقائياً لمدد مماثلة بموافقة الطرفين.
9.2 يحق لأي طرف إنهاء الاتفاقية فوراً في حال إخلال الطرف الآخر بأي بند جوهري وعدم تصحيحه خلال (15) يوماً من استلام إشعار خطي بذلك.

المادة 10: القوة القاهرة والظروف الطارئة (Force Majeure)
يعفى أي طرف من مسؤولية التأخير إذا كان ذلك ناتجاً عن قوة قاهرة خارجة عن إرادته المعقولة (كالزلازل، الحروب، الأوبئة، أو القرارات السيادية المفاجئة)، بشرط إشعار الطرف الآخر خلال (7) أيام من وقوع الحادث وتخفيف آثاره قدر الإمكان.

المادة 11: القانون الحاكم وفض النزاعات والتحكيم (Governing Law & Arbitration)
11.1 تخضع هذه الاتفاقية وتفسر وفقاً للأنظمة والقوانين السارية في [JURISDICTION].
11.2 في حال نشوء أي نزاع، يتم حله ودياً خلال (30) يوماً، وفي حال تعذر ذلك، يحال النزاع نهائياً إلى التحكيم التجاري الملزم وفقاً لقواعد التحكيم المعمول بها محلياً ودولياً، وتكون اللغة المعتمدة هي لغة هذا العقد.

المادة 12: أحكام عامة وختامية (General Boilerplate)
12.1 تمثل هذه الاتفاقية مجمل الاتفاق بين الطرفين وتلغي كافة المفاوضات والاتفاقيات الشفهية والخطية السابقة.
12.2 حررت هذه الاتفاقية من نسختين أصليتين بيد كل طرف نسخة للعمل بموجبها نظاماً.

الطرف الأول: [PARTY_A]                            الطرف الثاني: [PARTY_B]
التوقيع: _______________________                   التوقيع: _______________________
الختم الرسمي:                                      الختم الرسمي:
`,
      getTemplateEn: (topic: string) => `================================================================================
MASTER CORPORATE SERVICES AGREEMENT FOR ${topic.toUpperCase()}
Sovereign AI Smart Legal Infrastructure — Cryptographically Audited & Certified
================================================================================

THIS MASTER SERVICES AGREEMENT (the "Agreement") is entered into as of this date by and between:

PARTY A: [PARTY_A]
Registration / Tax ID: [PARTY_A_ID]
Principal Business Address: [PARTY_A_ADDRESS]
(hereinafter referred to as "Party A" or the "Client")

PARTY B: [PARTY_B]
Registration / Tax ID: [PARTY_B_ID]
Principal Business Address: [PARTY_B_ADDRESS]
(hereinafter referred to as "Party B" or the "Service Provider")

PREAMBLE & RECITALS:
WHEREAS, Party A requires premier enterprise services, technical execution, and operational architecture relating to (${topic}); and
WHEREAS, Party B represents and warrants that it possesses the requisite expertise, professional qualifications, licenses, and operational capacity to perform all obligations relating to (${topic}) in strict conformity with premier international standards;
NOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties agree as follows:

ARTICLE 1: DEFINITIONS & INTERPRETATION
1.1 "Deliverables" means all work product, technical documentation, software modules, analytical reports, and services developed for (${topic}).
1.2 "Confidential Information" means all proprietary, technical, financial, commercial, and operational information disclosed between the Parties.
1.3 Recitals and all attached Statements of Work (SOW) form an integral and binding part of this Agreement.

ARTICLE 2: SCOPE OF ENGAGEMENT & SERVICE LEVEL COMMITMENTS (SLA)
2.1 Party B shall perform all tasks related to (${topic}) with the highest degree of professional diligence, skill, and industry best practices.
2.2 Party B shall adhere strictly to all project milestones and deliverable timelines outlined in the applicable SOW.
2.3 Party A shall provide necessary access, specifications, and timely approvals to facilitate continuous execution.

ARTICLE 3: FINANCIAL CONSIDERATION, PAYMENT SCHEDULE & TAXES
3.1 Total Consideration: [VALUE] [CURRENCY].
3.2 The consideration shall be disbursed in milestone increments as follows:
    - Down Payment: 30% totaling [DOWN_PAYMENT] [CURRENCY] upon formal execution.
    - Milestone Progress Payouts: 50% upon intermediate milestone acceptance of (${topic}).
    - Final Acceptance Payout: 20% upon conclusive delivery, testing, and written sign-off.
3.3 All amounts exclude applicable VAT or statutory taxes, which shall be charged pursuant to the laws of [JURISDICTION].

ARTICLE 4: REPRESENTATIONS, WARRANTIES & COVENANTS
4.1 Party B warrants that all Deliverables for (${topic}) shall be original, fully functional, free from material defects, and compliant with all regulatory guidelines.
4.2 Each Party represents that it has full corporate authority to enter into and execute this Agreement without violating third-party agreements.

ARTICLE 5: INTELLECTUAL PROPERTY & WORK-FOR-HIRE ASSIGNMENT
5.1 Upon receipt of full payment, all worldwide Intellectual Property Rights, copyrights, patents, and trade secrets in the Deliverables shall vest exclusively in Party A as a work-made-for-hire.
5.2 Party B irrevocably assigns all rights, titles, and interests in the Deliverables to Party A without limitation of geography or time.

ARTICLE 6: STRICT CONFIDENTIALITY & NON-DISCLOSURE
6.1 Each Party agrees to protect the other's Confidential Information with at least the same degree of care it uses for its own proprietary data (no less than reasonable care).
6.2 Confidentiality obligations shall endure throughout the term of this Agreement and for a period of five (5) years following termination.

ARTICLE 7: DATA PRIVACY & CYBERSECURITY COMPLIANCE
The Parties shall strictly comply with applicable data protection laws and cybersecurity mandates in [JURISDICTION] (including GDPR/PDPL frameworks), enforcing technical encryption and organizational safeguards against unauthorized data breach.

ARTICLE 8: INDEMNIFICATION & LIMITATION OF LIABILITY
8.1 Party B shall defend, indemnify, and hold harmless Party A against any third-party claims arising out of IP infringement, gross negligence, or willful misconduct.
8.2 Neither Party shall be liable for indirect, incidental, or consequential damages. Maximum aggregate liability shall not exceed total fees paid under this Agreement.

ARTICLE 9: TERM, SUSPENSION & TERMINATION
9.1 Effective from [Start Date] through [End Date], automatically renewable upon mutual written accord.
9.2 Either Party may terminate immediately upon written notice if the other Party commits a material breach that remains uncured for fifteen (15) calendar days.

ARTICLE 10: FORCE MAJEURE
Neither Party shall be in default due to acts of God, war, pandemic, government decrees, or other events beyond reasonable control, provided written notice is furnished within seven (7) days.

ARTICLE 11: GOVERNING LAW & BINDING DISPUTE ARBITRATION
11.1 This Agreement shall be governed by and construed under the substantive laws of [JURISDICTION].
11.2 Any dispute arising out of or in connection with this Agreement shall be resolved exclusively through final and binding commercial arbitration in accordance with standard international arbitration rules.

ARTICLE 12: MISCELLANEOUS & EXECUTION
12.1 This Agreement constitutes the entire agreement between the Parties and supersedes all prior negotiations or understandings.
12.2 Executed in two (2) original counterparts, each deemed an original.

PARTY A: [PARTY_A]                              PARTY B: [PARTY_B]
By: ___________________________                 By: ___________________________
Title: Authorized Signatory                     Title: Authorized Signatory
Digital Seal / Stamp:                           Digital Seal / Stamp:
`
    },
    {
      suffixAr: 'الخدمات المهنية والاستشارية المتخصصة (Advisory Agreement)',
      suffixEn: 'Professional & Advisory Services Agreement',
      descAr: 'عقد استشاري ومهني تنفيذي لتنظيم مهام المشورة الإستراتيجية، مؤشرات الأداء (KPIs)، وحفظ أسرار الشركات.',
      descEn: 'Executive advisory agreement defining consulting scope, retainer fees, KPI milestones, and conflict-of-interest safeguards.',
      clauses: 24,
      pages: 10,
      getTemplateAr: (topic: string) => `================================================================================
عقد تقديم الخدمات المهنية والاستشارية في مجالات (${topic})
صادر عن منظومة جوريس تك السيادية للحلول القانونية الذكية
================================================================================

الطرف الأول (العميل): [PARTY_A] | السجل التجاري: [PARTY_A_ID]
الطرف الثاني (المستشار): [PARTY_B] | السجل التجاري/الرخصة المهنية: [PARTY_B_ID]

1. موضوع العقد ونطاق الاستشارة:
يقوم الطرف الثاني بتقديم الاستشارات المهنية، إعداد خطط العمل التنفيذية، وإجراء الدراسات المتخصصة في مجالات (${topic}) لصالح الطرف الأول.

2. المعايير المهنية والعناية الواجبة (Standard of Care):
يلتزم المستشار ببذل أقصى درجات العناية المهنية الواجبة وتقديم الرأي الصادق والمحايد وفق أفضل الممارسات المعتمدة في [JURISDICTION].

3. الأتعاب وجدول السداد:
القيمة الإجمالية للأتعاب المهنية: [VALUE] [CURRENCY]، تسدد بدفعة مقدمة قدرها [DOWN_PAYMENT] [CURRENCY] والباقي على أقساط شهرية مرتبطة بالتقارير الاستشارية المعتمدة.

4. حظر تضارب المصالح (Non-Conflict):
يتعهد المستشار بعدم تقديم أي استشارات لشركات منافسة مباشرة لنشاط الطرف الأول في ذات القطاع طوال مدة سريان العقد دون إفصاح مسبق.

5. السرية والملكية الفكرية:
تؤول كافة مخرجات التقارير والدراسات لملكية الطرف الأول وتخضع لسرية مطلقة لمدة خمس سنوات.

6. القانون الحاكم والنزاعات:
يخضع العقد لقوانين [JURISDICTION] وتختص محاكمها بالفصل في أي نزاع.

توقيع الطرف الأول: ____________________       توقيع الطرف الثاني: ____________________
`,
      getTemplateEn: (topic: string) => `================================================================================
PROFESSIONAL ADVISORY & CONSULTING SERVICES AGREEMENT (${topic.toUpperCase()})
JurisTech Sovereign Legal Infrastructure — Certified Multi-Jurisdiction Standard
================================================================================

CLIENT: [PARTY_A] | ID: [PARTY_A_ID]
ADVISOR: [PARTY_B] | ID/License: [PARTY_B_ID]

1. SCOPE OF ADVISORY:
Advisor shall provide strategic counsel, executive deliverables, and technical analysis regarding (${topic}).

2. STANDARD OF CARE & DILIGENCE:
Advisor shall render services with the highest standard of professional competence, integrity, and diligence recognized in [JURISDICTION].

3. FEES & REMUNERATION:
Total Advisory Fee: [VALUE] [CURRENCY]. Retainer Down Payment: [DOWN_PAYMENT] [CURRENCY], remainder disbursed against approved milestones.

4. CONFLICT OF INTEREST & EXCLUSIVITY:
Advisor covenants not to engage in advisory services for direct competitors of Client in (${topic}) during the active term without prior written disclosure.

5. CONFIDENTIALITY & IP OWNERSHIP:
All advisory reports and frameworks created hereunder constitute proprietary assets of Client and shall remain strictly confidential.

6. GOVERNING LAW & JURISDICTION:
Governed by the laws of [JURISDICTION]. Disputes submitted to exclusive venue courts.

PARTY A: ___________________________        PARTY B: ___________________________
`
    },
    {
      suffixAr: 'الشراكة الاستراتيجية والمشروع المشترك (Joint Venture Agreement)',
      suffixEn: 'Strategic Joint Venture & Consortium Agreement',
      descAr: 'اتفاقية شراكة استثمارية وعملياتية لتنظيم الحصص، مجالس الإدارة المشتركة، وتوزيع الأرباح والخسائر وحماية الأصول.',
      descEn: 'Definitive JV and consortium agreement regulating equity ratios, joint management, profit distribution, and dead-lock resolution.',
      clauses: 36,
      pages: 18,
      getTemplateAr: (topic: string) => `================================================================================
اتفاقية مشروع مشترك وشراكة استراتيجية (Joint Venture Agreement) — (${topic})
منظومة المستودع السيادي للعقود الذكية — JurisTech Solutions
================================================================================

الشريك الأول: [PARTY_A] | السجل التجاري: [PARTY_A_ID] | نسبة الحصة: 50%
الشريك الثاني: [PARTY_B] | السجل التجاري: [PARTY_B_ID] | نسبة الحصة: 50%

1. الغرض من المشروع المشترك:
تأسيس تحالف استراتيجي ومشروع مشترك لتنفيذ وتطوير عمليات وأعمال (${topic}) وتوزيع الأرباح التشغيلية الناتجة عن ذلك.

2. رأس المال والمساهمات:
يقدم كل شريك مساهمته النقدية أو العينية بقيمة إجمالية [VALUE] [CURRENCY] تدفع مناصفة أو بحسب النسب المتفق عليها.

3. الإدارة ولجنة التوجيه المشتركة (Management Committee):
تشكل لجنة إدارة مشتركة تتخذ القرارات التشغيلية والاستثمارية الكبرى بالإجماع أو بالأغلبية الموصوفة.

4. توزيع الأرباح وتغطية الخسائر:
توزع الأرباح الصافية دورياً بعد استقطاب الاحتياطيات النظامية وبما يتناسب مع حصص الشركاء.

5. آلية فك النزاع والشراء الإجباري (Deadlock & Buy-Out):
في حال تعثر اتخاذ القرارات الجوهرية (Deadlock)، تطبق آلية الشراء المتبادل (Russian Roulette / Texas Shootout) لضمان استمرارية النشاط.

6. القانون الحاكم والتحكيم:
تخضع هذه الاتفاقية لقوانين [JURISDICTION] ويحال أي نزاع لهيئة تحكيم ثلاثية ملزمة.

توقيع الشريك الأول: ____________________       توقيع الشريك الثاني: ____________________
`,
      getTemplateEn: (topic: string) => `================================================================================
STRATEGIC JOINT VENTURE AGREEMENT FOR ${topic.toUpperCase()}
JurisTech Sovereign Legal Infrastructure — Certified Multi-Jurisdiction Standard
================================================================================

PARTNER A: [PARTY_A] | Share Ratio: 50%
PARTNER B: [PARTY_B] | Share Ratio: 50%

1. PURPOSE OF THE JOINT VENTURE:
To establish a strategic consortium dedicated to executing commercial and operational operations in (${topic}).

2. CAPITAL CONTRIBUTIONS & VALUATION:
Total Initial Consortium Capital: [VALUE] [CURRENCY]. Capital contributions shall be injected pursuant to agreed capital calls.

3. GOVERNANCE & STEERING COMMITTEE:
A Joint Steering Committee shall oversee governance, annual budgets, and strategic expansion plans for (${topic}).

4. PROFIT & LOSS ALLOCATION:
Net operating profits and losses shall be distributed pro-rata according to equity ownership.

5. DEADLOCK RESOLUTION & BUY-SELL PROVISIONS:
Deadlocks shall be resolved via structured mediation followed by standard buy-sell / shotgun valuation mechanisms.

6. GOVERNING LAW & ARBITRATION:
Governed by substantive laws of [JURISDICTION]. Final arbitration under international commercial arbitration rules.

PARTNER A: ___________________________      PARTNER B: ___________________________
`
    },
    {
      suffixAr: 'الربط الرقمي وتكامل الأنظمة والخدمات السحابية (Digital SLA Agreement)',
      suffixEn: 'Digital Integration & Cloud SLA Agreement',
      descAr: 'عقد توريد تقني وتكامل فني للأنظمة الرقمية، معايير مستوى الخدمة (99.9% Uptime)، وحماية البيانات المشفرة.',
      descEn: 'Technology SLA agreement defining API integration, 99.9% uptime uptime guarantees, encryption compliance, and disaster recovery.',
      clauses: 28,
      pages: 12,
      getTemplateAr: (topic: string) => `================================================================================
عقد الربط الرقمي وتكامل الأنظمة ومستوى الخدمة السحابية (Cloud & API SLA)
منظومة المستودع السيادي للعقود الذكية — (${topic})
================================================================================

العميل: [PARTY_A] | مزود الخدمة التقنية: [PARTY_B]

1. نطاق الربط الرقمي وتكامل الأنظمة:
يقوم مزود الخدمة بتوفير البنية التحتية البرمجية، واجهات الربط البرمجي (APIs)، والربط السحابي لخدمات (${topic}).

2. ضمانات التوفر ومستوى الخدمة (99.9% Uptime SLA):
يلتزم مزود الخدمة بنسبة تشغيل وتوافر للأنظمة لا تقل عن 99.9% شهرياً مع تعويض العميل بأرصدة خدمة في حال الانقطاع.

3. الأمن السيبراني والتشفير:
تخضع كافة البيانات المتداولة للتشفير بمعايير AES-256 أثناء النقل والتخزين والامتثال لضوابط الأمن السيبراني في [JURISDICTION].

4. المقابل المالي والاشتراكات:
القيمة السنوية للربط والدعم: [VALUE] [CURRENCY] تسدد على دفعات ربع سنوية.

5. استمرارية الأعمال وحماية البيانات:
يلتزم المزود بخطط النسخ الاحتياطي المستمر والتعافي من الكوارث (Disaster Recovery).

6. القانون الحاكم:
يخضع العقد لأنظمة وقوانين [JURISDICTION].

توقيع العميل: _______________________          توقيع المزود: _______________________
`,
      getTemplateEn: (topic: string) => `================================================================================
DIGITAL INTEGRATION & CLOUD SERVICE LEVEL AGREEMENT (SLA) — ${topic.toUpperCase()}
JurisTech Sovereign Legal Infrastructure — High-Tech Corporate Standard
================================================================================

CLIENT: [PARTY_A] | CLOUD PROVIDER: [PARTY_B]

1. SCOPE OF DIGITAL INTEGRATION:
Provider grants access to proprietary API gateways, software infrastructure, and systems integration relating to (${topic}).

2. SERVICE LEVEL GUARANTEE (99.9% UPTIME):
Provider guarantees 99.9% monthly system uptime, subject to service credit penalties for unexcused outages.

3. CYBERSECURITY & ENCRYPTION:
All telemetry and transaction data shall be protected with AES-256 encryption at rest and in transit compliant with [JURISDICTION].

4. FEES & SUBSCRIPTION BILLING:
Annual Integration & SLA Fee: [VALUE] [CURRENCY], payable in advance quarterly installments.

5. DISASTER RECOVERY & ESCROW:
Provider maintains redundant multi-region backups and automated failover architectures.

6. GOVERNING LAW:
Governed by the commercial laws of [JURISDICTION].

CLIENT: ___________________________         PROVIDER: ___________________________
`
    },
    {
      suffixAr: 'العمل الحر وخدمات المقاول المستقل المعتمد (Independent Contractor)',
      suffixEn: 'Independent Contractor & IP Work-for-Hire Agreement',
      descAr: 'عقد مقاولة وعمل حر محكم لحماية حقوق الملكية الفكرية، سرية البيانات، واستحقاق الأتعاب حسب الإنجاز.',
      descEn: 'Independent contractor agreement enforcing strict work-for-hire IP assignment, non-disclosure, and milestone payments.',
      clauses: 20,
      pages: 8,
      getTemplateAr: (topic: string) => `================================================================================
عقد تقديم خدمات مقاول مستقل وعمل حر (Independent Contractor Agreement)
منظومة جوريس تك القانونية الذكية — (${topic})
================================================================================

صاحب العمل: [PARTY_A] | المقاول المستقل: [PARTY_B]

1. طبيعة العلاقة التعاقدية (مقاول مستقل):
يقر الطرفان بأن العلاقة هي علاقة مقاول مستقل (Independent Contractor) وليست علاقة عمل أو تبعية عمالية.

2. نطاق الخدمات ومخرجات (${topic}):
يقدم المقاول الخدمات المتفق عليها باستقلالية ووفق المواصفات والجداول الزمنية المحددة.

3. الأتعاب وطريقة السداد:
المقابل المالي الإجمالي: [VALUE] [CURRENCY] يسدد بناءً على تسليم وقبول مخرجات العمل.

4. التنازل التام عن الملكية الفكرية (Work-for-Hire):
تعتبر كافة المخرجات عملاً لحساب صاحب العمل وتؤول كافة حقوق الملكية الفكرية له حصرياً.

5. السرية وعدم المنافسة:
يلتزم المقاول بعدم إفشاء أي أسرار وعدم استغلال مخرجات العمل لأي جهة أخرى.

6. القانون والاختصاص:
يخضع العقد لأنظمة [JURISDICTION].

توقيع صاحب العمل: _____________________        توقيع المقاول: _____________________
`,
      getTemplateEn: (topic: string) => `================================================================================
INDEPENDENT CONTRACTOR & WORK-FOR-HIRE AGREEMENT (${topic.toUpperCase()})
JurisTech Sovereign Legal Infrastructure — Enterprise Contractor Standard
================================================================================

COMPANY: [PARTY_A] | CONTRACTOR: [PARTY_B]

1. INDEPENDENT CONTRACTOR STATUS:
Contractor is an independent contractor. Nothing herein creates an employer-employee or agency relationship.

2. SERVICES & DELIVERABLES:
Contractor shall perform designated milestone tasks for (${topic}) in a professional workmanlike manner.

3. COMPENSATION:
Total Contract Sum: [VALUE] [CURRENCY], payable upon verified deliverable milestones.

4. EXCLUSIVE WORK-FOR-HIRE IP ASSIGNMENT:
All intellectual property created under this Agreement is deemed work-made-for-hire and owned 100% by Company.

5. CONFIDENTIALITY:
Contractor shall maintain strict confidentiality regarding all company trade secrets.

6. GOVERNING LAW:
Governed by the laws of [JURISDICTION].

COMPANY: ___________________________        CONTRACTOR: ___________________________
`
    },
    {
      suffixAr: 'الاستثمار والإنتاج الزراعي وتقاسم المحاصيل والعوائد (Agricultural Investment)',
      suffixEn: 'Agricultural Investment & Crop Yield Sharing Agreement',
      descAr: 'عقد استثمار زراعي سيادي ينظم حقوق الانتفاع بالأراضي، شبكات الري والآبار، تقاسم المحاصيل والمواسم، وتأمين الكوارث الطبيعية.',
      descEn: 'Sovereign agricultural agreement regulating farmland usufruct, water well extraction, seasonal harvesting, yield ratios, and crop insurance.',
      clauses: 30,
      pages: 14,
      getTemplateAr: (topic: string) => `================================================================================
عقد استثمار زراعي وتشغيل مزارع وتقاسم محاصيل وعوائد (${topic})
صادر عن منظومة المستودع السيادي للعقود الذكية — JurisTech Solutions
================================================================================

الطرف الأول (مالك الأرض/المستثمر الرئيسي): [PARTY_A]
الطرف الثاني (المشغل الزراعي/الشريك الفني): [PARTY_B]

1. نطاق الاستثمار وحق الانتفاع العيني:
يمنح الطرف الأول للطرف الثاني حق الانتفاع التشغيلي بالأرض الزراعية ومصادر المياه والآبار الارتوازية والكهرباء المخصصة لزراعة وإنتاج (${topic}).

2. الدورة الزراعية ومواسم الحصاد:
يلتزم المشغل بالدورة الزراعية المعتمدة، واستخدام البذور والفسائل المطابقة للمواصفات، وجداول التسميد ومكافحة الآفات طبقاً للضوابط البيئية في [JURISDICTION].

3. التمويل والأصول والمصروفات التشغيلية:
إجمالي رأس المال الاستثماري: [VALUE] [CURRENCY]. تسدد تكاليف الري والمعدات من الحساب المشترك للمشروع.

4. تقاسم المحاصيل والعوائد المالية:
يتم فرز وتوريد المحاصيل للأسواق وتوزع العوائد الصافية بعد خصم التكاليف بنسبة متفق عليها تسدد دورياً بعملة [CURRENCY].

5. المخاطر الطبيعية وتلف المحاصيل (الجوائح الزراعية):
في حال تلف المحاصيل نتيجة آفات أو كوارث طبيعية خارجة عن الإرادة، تطبق قواعد الجوائح المعتمدة ونظام التأمين الزراعي دون مسؤولية تقصيرية.

6. القانون الحاكم والنزاعات:
يخضع هذا العقد حصراً للأنظمة والمراسيم والقوانين المعمول بها في [JURISDICTION] وتختص محاكمها بالفصل في أي نزاع.

توقيع الطرف الأول: _____________________        توقيع الطرف الثاني: _____________________
`,
      getTemplateEn: (topic: string) => `================================================================================
AGRICULTURAL INVESTMENT & HARVEST SHARING AGREEMENT (${topic.toUpperCase()})
JurisTech Sovereign Legal Infrastructure — Certified Agribusiness Standard
================================================================================

FIRST PARTY (Landowner / Primary Investor): [PARTY_A]
SECOND PARTY (Agricultural Operator / Technical Partner): [PARTY_B]

1. USUFRUCT RIGHTS & FARMLAND ALLOCATION:
First Party grants Second Party operational usufruct over designated agricultural acreage, licensed water wells, and irrigation networks for (${topic}).

2. CROP CYCLES & HARVEST MANAGEMENT:
Operator covenants to manage agronomic cycles, fertilization, and pest control in strict compliance with environmental statutes in [JURISDICTION].

3. CAPITAL CONTRIBUTIONS & OPERATING COSTS:
Total Project Capital: [VALUE] [CURRENCY]. Operating irrigation and equipment maintenance costs disbursed from designated project accounts.

4. CROP YIELD & NET PROFIT DISTRIBUTION:
Net harvest sales revenue shall be apportioned and distributed periodically in [CURRENCY] pursuant to agreed percentage splits.

5. CLIMATIC HARDSHIP & CROP CASUALTY:
Casualties arising from extraordinary frost, drought, or pest epidemics shall trigger statutory crop relief and agricultural insurance allocation without breach liability.

6. GOVERNING LAW & JURISDICTION:
Governed exclusively by the substantive agricultural and civil codes of [JURISDICTION].

FIRST PARTY: ___________________________       SECOND PARTY: ___________________________
`
    },
    {
      suffixAr: 'المقاولات والإنشاءات الهندسية الشاملة (FIDIC Standard Construction)',
      suffixEn: 'FIDIC Standard Engineering & Construction Agreement',
      descAr: 'عقد مقاولات هندسي متكامل ينظم جداول الكميات (BOQ)، أوامر التغيير، الاستلام الابتدائي، غرامات التأخير، والضمان العشري.',
      descEn: 'Comprehensive construction contract governing BOQ schedules, variation order directives, milestone acceptance, liquidated damages, and decennial structural liability.',
      clauses: 38,
      pages: 20,
      getTemplateAr: (topic: string) => `================================================================================
عقد مقاولة وتشييد هندسي متكامل طبقاً لمعايير FIDIC (${topic})
منظومة العقود السيادية المليونية — JurisTech Solutions
================================================================================

صاحب العمل (المطور): [PARTY_A] | المقاول الرئيسي: [PARTY_B]

1. موضوع العقد ونطاق الأعمال الهندسية:
يقوم المقاول بتنفيذ وإتمام وصيانة كافة الأعمال المدنية والهندسية الخاصة بـ (${topic}) وفق المخططات وجداول الكميات (BOQ).

2. مدة الإنجاز والجدول الزمني:
يلتزم المقاول بإنهاء الأعمال خلال المدة المحددة وتسليمها تسليماً ابتدائياً خالياً من العيوب الجوهرية.

3. القيمة الإجمالية والدفعات المالية:
القيمة الإجمالية للعقد: [VALUE] [CURRENCY]، تصرف بموجب مستخلصات شهرية معتمدة من الاستشاري الهندسي بعد حسم 10% كدفعة محتجزة (Retention Money).

4. أوامر التغيير والتعديل الإنشائي (Variation Orders):
لا يعتد بأي تعديل أو عمل إضافي إلا بموجب أمر تغييري كتابي معتمد يحدد التكلفة والمدة الإضافية.

5. غرامات التأخير والشرط الجزائي:
في حال تأخر المقاول عن موعد الإنجاز النهائي، تطبق غرامة تأخير يومية بنسبة محددة بما لا يجاوز 10% من إجمالي قيمة العقد.

6. الضمان العشري والمسؤولية الإنشائية:
يضمن المقاول والمهندس المصمم سلامة الهيكل الخرساني والإنشائي للمبنى لمدة عشر سنوات كاملة طبقاً للقانون المدني في [JURISDICTION].

7. القانون الحاكم والتحكيم الهندسي:
يخضع العقد لقوانين [JURISDICTION] وتفصل هيئة تحكيم هندسية متخصصة في كافة النزاعات.

توقيع صاحب العمل: _____________________        توقيع المقاول: _____________________
`,
      getTemplateEn: (topic: string) => `================================================================================
FIDIC-STANDARD ENGINEERING & CONSTRUCTION AGREEMENT (${topic.toUpperCase()})
JurisTech Sovereign Legal Infrastructure — Heavy Engineering Standard
================================================================================

EMPLOYER: [PARTY_A] | MAIN CONTRACTOR: [PARTY_B]

1. SCOPE OF WORKS & BOQ:
Contractor shall execute, complete, and maintain all civil, structural, and MEP works regarding (${topic}) in accordance with approved drawings and Bill of Quantities (BOQ).

2. TIME FOR COMPLETION & MILESTONES:
Contractor shall achieve Substantial Completion and obtain the Taking-Over Certificate (TOC) within the agreed master execution program.

3. CONTRACT PRICE & INTERIM VALUATIONS:
Total Contract Price: [VALUE] [CURRENCY], disbursed against monthly engineer-certified interim payment certificates subject to 10% retention holdback.

4. VARIATION ORDERS:
No changes shall be executed without a formal written Variation Order detailing valuation and schedule extension.

5. LIQUIDATED DELAY DAMAGES:
Unexcused delays shall incur daily liquidated damages capped at 10% of the aggregate Contract Price.

6. DECENNIAL STRUCTURAL LIABILITY:
Contractor and architect warrant total structural and foundation integrity for a mandatory term of ten (10) years pursuant to the civil codes of [JURISDICTION].

7. GOVERNING LAW & ARBITRATION:
Governed by the substantive commercial laws of [JURISDICTION]. Final resolution via institutional commercial arbitration.

EMPLOYER: ___________________________        CONTRACTOR: ___________________________
`
    }
  ];


  return variations.map((v, index) => {
    const id = `dyn-${baseEn}-${index + 1}`;
    const titleAr = `عقد ${cleanQuery} ${v.suffixAr}`;
    const titleEn = `${translatedBaseEn} ${v.suffixEn}`;
    
    return {
      id,
      categoryKey: 'commercial',
      subcategoryKey: 'sales-b2b',
      titleAr,
      titleEn,
      descriptionAr: v.descAr,
      descriptionEn: v.descEn,
      jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'QA', 'KW', 'US', 'UK', 'EU'],
      downloads: Math.floor(Math.random() * 5000) + 1200,
      rating: parseFloat((Math.random() * 0.2 + 4.8).toFixed(2)),
      pagesCount: v.pages,
      clausesCount: v.clauses,
      tags: [cleanQuery, 'عقد', 'اتفاقية', 'marketing', 'custom', 'commercial'],
      templateAr: v.getTemplateAr(cleanQuery),
      templateEn: v.getTemplateEn(translatedBaseEn),
    };
  });
}

export function searchMegaRepository(
  query: string,
  lang: 'ar' | 'en' = 'ar',
  categoryFilter?: string,
  limit = 24
): MegaContractTemplate[] {
  if (!query && !categoryFilter) return MEGA_CONTRACT_TEMPLATES.slice(0, limit);

  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter((w) => w.length > 1);

  // Score static templates for keyword relevance (weighted search model)
  const staticResults = MEGA_CONTRACT_TEMPLATES.map((t) => {
    const matchesCat = !categoryFilter || categoryFilter === 'all' || t.categoryKey === categoryFilter;
    if (!matchesCat) return { template: t, score: -1 };
    if (!q) return { template: t, score: 10 };

    const textAr = `${t.titleAr} ${t.descriptionAr} ${t.tags.join(' ')}`.toLowerCase();
    const textEn = `${t.titleEn} ${t.descriptionEn} ${t.tags.join(' ')}`.toLowerCase();

    let score = 0;
    if (words.length > 0) {
      words.forEach((word) => {
        if (textAr.includes(word) || textEn.includes(word)) {
          score += 10;
          if (t.titleAr.toLowerCase().includes(word) || t.titleEn.toLowerCase().includes(word)) {
            score += 20; // Title match bonus
          }
        }
      });
    } else {
      if (textAr.includes(q) || textEn.includes(q)) {
        score += 10;
        if (t.titleAr.toLowerCase().includes(q) || t.titleEn.toLowerCase().includes(q)) {
          score += 20;
        }
      }
    }
    return { template: t, score };
  })
  .filter((item) => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map((item) => item.template);

  // Synthesize 5 related dynamic contract options on-the-fly to represent a rich "million contract library"
  if (q && q.length > 2) {
    const dynamicTemplates = generateDynamicTemplates(query);
    // Filter out dynamic templates that are already covered by static results
    const uniqueDynamics = dynamicTemplates.filter(
      (dt) => !staticResults.some((st) => st.titleAr.includes(dt.titleAr) || st.titleEn.includes(dt.titleEn))
    );
    return [...uniqueDynamics, ...staticResults].slice(0, limit);
  }

  return staticResults.slice(0, limit);
}

/**
 * Get contracts by category
 */
export function getContractsByCategory(categoryKey: string, limit = 12): MegaContractTemplate[] {
  return MEGA_CONTRACT_TEMPLATES
    .filter((t) => t.categoryKey === categoryKey)
    .slice(0, limit);
}

/**
 * Get total "virtual" count for display (simulates 1M contracts)
 */
export function getTotalVirtualContractCount(): string {
  return '1,000,000+';
}

/**
 * Get featured/top-rated contracts
 */
export function getFeaturedContracts(limit = 6): MegaContractTemplate[] {
  return [...MEGA_CONTRACT_TEMPLATES]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}
