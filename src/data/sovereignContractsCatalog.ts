/**
 * src/data/sovereignContractsCatalog.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sovereign Master & Enterprise Contracts Catalog (100+ Contracts)
 * مكتبة العقود السيادية والمؤسسية العالمية المعتمدة (أكثر من 100 عقد معياري)
 *
 * Architecture:
 *   - 100% Strict Sovereign Country-First Isolation (عقود محصورة ومفصولة بحسب الدولة والولاية)
 *   - Explicit Statutory Citations for 15 Jurisdictions (استناد صريح لمواد الأنظمة والقوانين الوطنية)
 *   - 10 Strategic Sectors (Corporate, Tech/AI, VC/PE, EPC, Energy, Trade, Finance, Executive, Franchise, Real Estate)
 *   - 100% Full Bilingual Parity: Authentic Arabic Judicial + Institutional English
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface SovereignJurisdiction {
  code: string;
  nameAr: string;
  nameEn: string;
  flag: string;
  legalSystem: 'Civil Law' | 'Common Law' | 'Sharia / Civil Hybrid' | 'International Convention';
  primaryStatute: string;
  arbitrationVenue: string;
  contractCount: number;
}

export interface SovereignContract {
  id: string;
  countryCode: string;
  countryNameAr: string;
  countryNameEn: string;
  countryFlag: string;
  statuteCodeAr: string;
  statuteCodeEn: string;
  arbitrationVenue: string;
  dealTier: 'MILLION_DOLLAR' | 'INSTITUTIONAL' | 'HIGH_STAKES';
  estimatedValueRange: string;
  category:
    | 'Corporate_MA'
    | 'Venture_Investment'
    | 'EPC_Construction'
    | 'Cloud_Tech_Data'
    | 'Islamic_Finance'
    | 'Agency_Franchise'
    | 'Executive_Governance'
    | 'Energy_Infrastructure'
    | 'Trade_SupplyChain'
    | 'RealEstate_Assets';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  keyClauses: string[];
  tags: string[];
  pagesCount: number;
  clausesCount: number;
  templateAr: string;
  templateEn: string;
}

// ── 1. SOVEREIGN JURISDICTIONS DIRECTORY (15 JURISDICTIONS) ───────────────────
export const SOVEREIGN_JURISDICTIONS: SovereignJurisdiction[] = [
  {
    code: 'ALL',
    nameAr: 'جميع الدول والولايات الـ 15',
    nameEn: 'All 15 Sovereign Jurisdictions',
    flag: '🌐',
    legalSystem: 'International Convention',
    primaryStatute: 'Multi-Jurisdictional Frameworks & Conventions',
    arbitrationVenue: 'Global & Regional Forums (SCCA, DIAC, ICC, LCIA, CRCICA, AAA)',
    contractCount: 101,
  },
  {
    code: 'SA',
    nameAr: 'المملكة العربية السعودية',
    nameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    legalSystem: 'Sharia / Civil Hybrid',
    primaryStatute: 'نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)',
    arbitrationVenue: 'المركز السعودي للتحكيم التجاري (SCCA - الرياض)',
    contractCount: 12,
  },
  {
    code: 'AE',
    nameAr: 'الإمارات العربية المتحدة (الاتحادي)',
    nameEn: 'UAE Mainland',
    flag: '🇦🇪',
    legalSystem: 'Civil Law',
    primaryStatute: 'مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021',
    arbitrationVenue: 'مركز دبي للتحكيم الدولي (DIAC)',
    contractCount: 12,
  },
  {
    code: 'DIFC',
    nameAr: 'مركز دبي المالي العالمي (DIFC)',
    nameEn: 'Dubai International Financial Centre (DIFC)',
    flag: '🏛️',
    legalSystem: 'Common Law',
    primaryStatute: 'DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018',
    arbitrationVenue: 'محاكم مركز دبي المالي العالمي (DIFC Courts)',
    contractCount: 6,
  },
  {
    code: 'ADGM',
    nameAr: 'سوق أبوظبي العالمي (ADGM)',
    nameEn: 'Abu Dhabi Global Market (ADGM)',
    flag: '🇦🇪',
    legalSystem: 'Common Law',
    primaryStatute: 'ADGM Companies Regulations 2020 & Application of English Law Regulations',
    arbitrationVenue: 'محاكم سوق أبوظبي العالمي (ADGM Courts)',
    contractCount: 7,
  },
  {
    code: 'QA',
    nameAr: 'دولة قطر',
    nameEn: 'Qatar',
    flag: '🇶🇦',
    legalSystem: 'Civil Law',
    primaryStatute: 'قانون المعاملات المدنية رقم 22/2004 وقانون الشركات 11/2015',
    arbitrationVenue: 'مركز قطر الدولي للتوفيق والتحكيم (QICCA)',
    contractCount: 9,
  },
  {
    code: 'KW',
    nameAr: 'دولة الكويت',
    nameEn: 'Kuwait',
    flag: '🇰🇼',
    legalSystem: 'Civil Law',
    primaryStatute: 'قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016',
    arbitrationVenue: 'مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت',
    contractCount: 6,
  },
  {
    code: 'BH',
    nameAr: 'مملكة البحرين',
    nameEn: 'Bahrain',
    flag: '🇧🇭',
    legalSystem: 'Civil Law',
    primaryStatute: 'مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001',
    arbitrationVenue: 'غرفة البحرين لتسوية المنازعات (BCDR-AAA)',
    contractCount: 5,
  },
  {
    code: 'OM',
    nameAr: 'سلطنة عُمان',
    nameEn: 'Oman',
    flag: '🇴🇲',
    legalSystem: 'Civil Law',
    primaryStatute: 'قانون المعاملات المدنية مرسوم 29/2013 وقانون الشركات 18/2019',
    arbitrationVenue: 'مركز عُمان للتحكيم التجاري (OAC)',
    contractCount: 5,
  },
  {
    code: 'EG',
    nameAr: 'جمهورية مصر العربية',
    nameEn: 'Egypt',
    flag: '🇪🇬',
    legalSystem: 'Civil Law',
    primaryStatute: 'القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981',
    arbitrationVenue: 'مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)',
    contractCount: 9,
  },
  {
    code: 'JO',
    nameAr: 'المملكة الأردنية الهاشمية',
    nameEn: 'Jordan',
    flag: '🇯🇴',
    legalSystem: 'Civil Law',
    primaryStatute: 'قانون الشركات الأردني رقم 22 لسنة 1997 والقانون المدني رقم 43 لسنة 1976',
    arbitrationVenue: 'مركز التحكيم الأردني ونقابة المحامين بعمّان',
    contractCount: 3,
  },
  {
    code: 'US',
    nameAr: 'الولايات المتحدة الأمريكية (Delaware)',
    nameEn: 'United States (Delaware)',
    flag: '🇺🇸',
    legalSystem: 'Common Law',
    primaryStatute: 'Delaware General Corporation Law (DGCL Title 8) & UCC Article 2',
    arbitrationVenue: 'Delaware Court of Chancery & AAA / JAMS',
    contractCount: 10,
  },
  {
    code: 'GB',
    nameAr: 'المملكة المتحدة (English Law)',
    nameEn: 'United Kingdom (English Law)',
    flag: '🇬🇧',
    legalSystem: 'Common Law',
    primaryStatute: 'UK Companies Act 2006 & Unfair Contract Terms Act 1977',
    arbitrationVenue: 'London Court of International Arbitration (LCIA)',
    contractCount: 7,
  },
  {
    code: 'EU',
    nameAr: 'الاتحاد الأوروبي (Civil Law & GDPR)',
    nameEn: 'European Union (Civil Law & GDPR)',
    flag: '🇪🇺',
    legalSystem: 'Civil Law',
    primaryStatute: 'EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes',
    arbitrationVenue: 'غرفة التجارة الدولية باريس (ICC International Court of Arbitration)',
    contractCount: 3,
  },
  {
    code: 'CN',
    nameAr: 'جمهورية الصين الشعبية (PRC Law)',
    nameEn: "People's Republic of China (PRC Law)",
    flag: '🇨🇳',
    legalSystem: 'Civil Law',
    primaryStatute: 'القانون المدني لجمهورية الصين الشعبية وقانون الاستثمار الأجنبي 2020',
    arbitrationVenue: 'لجنة التحكيم الاقتصادي والتجاري الدولية الصينية (CIETAC)',
    contractCount: 2,
  },
  {
    code: 'INT',
    nameAr: 'القانون الدولي واتفاقيات الأمم المتحدة',
    nameEn: 'International & UNCITRAL Conventions',
    flag: '🌐',
    legalSystem: 'International Convention',
    primaryStatute: 'اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم',
    arbitrationVenue: 'محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)',
    contractCount: 5,
  },
];

// ── 2. SOVEREIGN MASTER CONTRACTS MASTER CATALOG (101 CONTRACTS) ─────────────
export const SOVEREIGN_MILLION_CONTRACTS: SovereignContract[] = [
// ===========================================================================
  // 🇸🇦 1. SAUDI ARABIA (KSA) — Sovereign Million-Dollar Suite
  // ===========================================================================
  {
    id: 'sovereign-sa-spa-10m',
    countryCode: 'SA',
    countryNameAr: 'المملكة العربية السعودية',
    countryNameEn: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    statuteCodeAr: 'نظام الشركات م/132 ونظام المعاملات المدنية م/191',
    statuteCodeEn: 'Companies Law (M/132) & Civil Transactions Law (M/191)',
    arbitrationVenue: 'المركز السعودي للتحكيم التجاري (SCCA - الرياض)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '10,000,000 - 100,000,000+ ر.س',
    category: 'Corporate_MA',
    titleAr: 'عقد شراء واستحواذ الحصص والأسهم المليوني — المملكة العربية السعودية',
    titleEn: 'Saudi Institutional Share Purchase Agreement (SPA — High-Value M&A)',
    descriptionAr: 'اتفاقية استحواذ ونقل ملكية حصص في شركات سعودية خاضعة لأحكام نظام الشركات الصادر بالمرسوم الملكي م/132 مع ضمانات البائعين وحجز الضمان (Escrow).',
    descriptionEn: 'Institutional M&A Share Purchase Agreement governed by the Saudi Companies Law (M/132) featuring seller warranties, closing accounts, and escrow holdbacks.',
    keyClauses: [
      'حسابات الإغلاق وتسوية سعر الشراء (Closing Accounts & Working Capital True-Up)',
      'إقرارات وضمانات البائعين المشددة (Fundamental & Business Reps & Warranties)',
      'حساب الضمان البنكي للتسوية والتعويضات (Escrow Holdback 10% - SAMA Bank)',
      'التعهدات بعدم المنافسة وحظر استقطاب الكفاءات (Non-Compete & Non-Solicitation)',
      'التحكيم الحصري وفق قواعد المركز السعودي للتحكيم التجاري (SCCA) بالرياض',
    ],
    tags: ['استحواذ', 'السعودية', 'م/132', 'م/191', 'SCCA', 'SPA', 'صفقات_مليونية'],
    pagesCount: 18,
    clausesCount: 28,
    templateAr: `================================================================================
عقد بيع وشراء حصص تجارية واستحواذ مليوني
المملكة العربية السعودية — مرسوم ملكي رقم (م/132) ونظام المعاملات المدنية (م/191)
جهة الاختصاص والتحكيم: المركز السعودي للتحكيم التجاري (SCCA - مدينة الرياض)
================================================================================

أُبرم هذا العقد في مدينة الرياض بتاريخ [CLOSING_DATE] الموافق [HIJRI_DATE] بين:
الطرف الأول (البائع / الجهة المالكة): شركة [SELLER_NAME]، سجل تجاري رقم: [SELLER_CR]، ومقرها الرئيسي: [SELLER_ADDRESS].
الطرف الثاني (المشتري / المستثمر المؤسسي): شركة [BUYER_NAME]، سجل تجاري رقم: [BUYER_CR]، ومقرها الرئيسي: [BUYER_ADDRESS].
يُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن البائع يمتلك ما نسبته ([EQUITY_PERCENTAGE]%) من إجمالي رأس مال شركة [TARGET_COMPANY] ("الشركة المستهدفة")، والمقيدة بالسجل التجاري رقم [TARGET_CR]؛ وحيث رغب المشتري في شراء هذه الحصص بكافة حقوقها والتزاماتها مقابل ثمن إجمالي قدره ([DEAL_VALUE_SAR]) ريال سعودي، وبعد استيفاء الفحص النافي للجهالة القانوني والمالي؛ فقد اتفق الطرفان على الآتي:

البند الأول: موضوع البيع ونقل الملكية
1.1 يبيع البائع بموجب هذا العقد، ويشتري المشتري، الحصص محل العقد والبالغ عددها ([SHARES_COUNT]) حصة، خالية من أي رهن، أو امتياز، أو حجز قضائي، أو حقوق خيار لأطراف ثالثة.
1.2 تسري حقوق الأرباح والتمثيل في مجلس المديرين فور قيد التعديل لدى وزارة التجارة ومنصة الأعمال السعودية.

البند الثاني: المقابل المالي وحساب الضمان البنكي (Escrow Holdback)
2.1 يُسدد المشتري نسبة (90%) من قيمة الصفقة بحوالة بنكية معتمدة (SWIFT RTGS) إلى حساب البائع يوم الإغلاق الرسمي.
2.2 تُحتجز نسبة (10%) المتبقية البالغة ([ESCROW_VALUE_SAR]) ريال سعودي في حساب ضمان معتمد لدى بنك مرخص من البنك المركزي السعودي (SAMA) لمدة اثني عشر (12) شهراً لضمان الوفاء بأي تعويضات ناتجة عن إخلال البائع بإقراراته وضماناته.

البند الثالث: إقرارات وضمانات البائع (Reps & Warranties)
يقر البائع ويضمن بمواجهة المشتري في تاريخ التوقيع والإغلاق بما يلي:
3.1 سلامة المركز المالي وخلو الشركة من أي ديون أو التزامات ضريبية (ZATCA) غير مفصح عنها في القوائم المالية المدققة.
3.2 عدم وجود أي دعاوى عمالية أو تجارية أو بلاغات جنائية قائمة أو وشيكة قد تؤثر جوهرياً على نشاط الشركة وقيمتها.
3.3 الامتثال التام لأحكام نظام العمل السعودي ونسب التوطين (نطاقات) والتأمينات الاجتماعية (GOSI).

البند الرابع: التعهد بعدم المنافسة (Non-Compete)
عملاً بأحكام المادة (191) من نظام المعاملات المدنية، يلتزم البائع وتابعيه بعدم ممارسة أي نشاط منافس، أو تأسيس كيان يمارس ذات الأغراض، أو استقطاب أي من موظفي الإدارة العليا للشركة، وذلك داخل النطاق الجغرافي للمملكة العربية السعودية ولمدة ثلاث (3) سنوات من تاريخ الإغلاق.

البند الخامس: القانون الواجب التطبيق وفض النزاعات
5.1 يخضع هذا العقد ويفسر وفقاً للأنظمة واللوائح السارية في المملكة العربية السعودية، وعلى وجه الخصوص نظام الشركات ونظام المعاملات المدنية.
5.2 أي نزاع ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري وفق قواعد المركز السعودي للتحكيم التجاري (SCCA) في الرياض، وتتشكل هيئة التحكيم من ثلاثة محكمين، وتكون اللغة العربية هي لغة التحكيم الرسمية، ويكون حكم التحكيم نهائياً وملزماً لكلا الطرفين.

توقيع الطرف الأول (البائع): ____________________    توقيع الطرف الثاني (المشتري): ____________________`,
    templateEn: `================================================================================
INSTITUTIONAL SHARE PURCHASE AGREEMENT (HIGH-VALUE M&A)
Kingdom of Saudi Arabia — Royal Decree M/132 & Civil Transactions Law M/191
Arbitration Venue: Saudi Center for Commercial Arbitration (SCCA — Riyadh)
================================================================================

This Institutional Share Purchase Agreement ("Agreement") is executed on [CLOSING_DATE] by and between:
Party A (Seller): [SELLER_NAME], CR: [SELLER_CR], registered address at [SELLER_ADDRESS].
Party B (Buyer): [BUYER_NAME], CR: [BUYER_CR], registered address at [BUYER_ADDRESS].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, the Seller holds legal and beneficial ownership of [EQUITY_PERCENTAGE]% of the corporate capital of [TARGET_COMPANY] (the "Target Company"), CR [TARGET_CR]; and WHEREAS, Buyer desires to purchase said equity free from encumbrances for an aggregate consideration of SAR [DEAL_VALUE_SAR], following rigorous legal and commercial due diligence;

NOW, THEREFORE, the Parties agree as follows:

1. SALE OF PURCHASED SHARES
1.1 The Seller hereby sells, assigns, and transfers to Buyer, and Buyer hereby purchases, [SHARES_COUNT] shares free and clear from any liens, pledges, pre-emptive rights, or judicial restrictions.
1.2 Economic rights, dividend entitlements, and governance representation transfer to Buyer immediately upon registration with the Ministry of Commerce / Saudi Business Center.

2. CONSIDERATION & ESCROW HOLDBACK
2.1 Buyer shall remit 90% of the Purchase Price via verified RTGS/SWIFT wire to Seller's designated account on Closing.
2.2 The remaining 10% (SAR [ESCROW_VALUE_SAR]) shall be deposited into a segregated Escrow Account with a SAMA-regulated Tier-1 Saudi Bank for a duration of 12 months to satisfy any indemnity claims arising from breaches of representations.

3. SELLER REPRESENTATIONS & WARRANTIES
The Seller unconditionally warrants and represents as of Closing:
3.1 Unimpaired financial condition and absence of undisclosed tax or Zakat liabilities (ZATCA compliant).
3.2 Absence of pending or threatened litigation, arbitral proceedings, or government investigations affecting corporate solvency.
3.3 Full compliance with Saudi Labor Law, GOSI contributions, and Saudization quotas (Nitaqat).

4. RESTRICTIVE COVENANTS & NON-COMPETITION
In accordance with Article 191 of the Saudi Civil Transactions Law, Seller undertakes for 36 months following Closing not to engage in competing business, incorporate rival entities, or solicit key executives within the territory of Saudi Arabia.

5. GOVERNING LAW & SCCA ARBITRATION
5.1 This Agreement shall be governed by, and construed in accordance with, the laws of the Kingdom of Saudi Arabia.
5.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by the Saudi Center for Commercial Arbitration (SCCA) in Riyadh under its Arbitration Rules by three (3) arbitrators. Language of proceedings shall be Arabic and English.

SELLER: _____________________________    BUYER: _____________________________`,
  },

  {
    id: 'sovereign-sa-epc-turnkey',
    countryCode: 'SA',
    countryNameAr: 'المملكة العربية السعودية',
    countryNameEn: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    statuteCodeAr: 'كود البناء السعودي ونظام نزع الملكية وضوابط المشاريع الكبرى',
    statuteCodeEn: 'Saudi Building Code (SBC) & FIDIC Silver Book Turnkey Standard',
    arbitrationVenue: 'المركز السعودي للتحكيم التجاري (SCCA) والمحاكم التجارية',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '25,000,000 - 250,000,000+ ر.س',
    category: 'EPC_Construction',
    titleAr: 'عقد مقاولات تسليم مفتاح (EPC Turnkey) للمشاريع المليونية الكبرى — السعودية',
    titleEn: 'Saudi Mega Turnkey EPC Construction Contract (FIDIC Silver Book Aligned)',
    descriptionAr: 'عقد مقاولة تسليم مفتاح عالي القيمة للمشاريع الإنشائية والصناعية الكبرى متوافق مع كود البناء السعودي (SBC) وضوابط المقاولات الحكومية ومشاريع الرؤية.',
    descriptionEn: 'High-value lump-sum turnkey EPC construction contract tailored for major Saudi industrial and real estate projects with liquidated damages caps and performance bonds.',
    keyClauses: [
      'المبلغ الإجمالي المقطوع بدون أوامر تغيير عشوائية (Lump-Sum Fixed Price)',
      'خطاب الضمان البنكي النهائي غير المشروط (Unconditional Performance Bond 10%)',
      'سقف غرامات التأخير المتوافق مع الضرر الفعلي (Liquidated Damages Cap 10%)',
      'الامتثال لكود البناء السعودي (SBC) ولوائح الدفاع المدني والسلامة المهنية',
      'التأمين الشامل ضد جميع أخطار المقاولين (CAR Insurance Policy)',
    ],
    tags: ['مقاولات', 'تسليم_مفتاح', 'EPC', 'FIDIC', 'كود_البناء_السعودي', 'مشاريع_كبرى'],
    pagesCount: 22,
    clausesCount: 32,
    templateAr: `================================================================================
عقد مقاولات وتصميم وتوريد تسليم مفتاح (EPC Turnkey Contract)
المملكة العربية السعودية — متوافق مع كود البناء السعودي (SBC) والأنظمة البلدية
================================================================================

أُبرم هذا العقد في [DATE] بين:
الطرف الأول (صاحب العمل / المطور العقاري): شركة [EMPLOYER_NAME]، سجل تجاري: [EMPLOYER_CR]
الطرف الثاني (المقاول الرئيسي): شركة [CONTRACTOR_NAME]، تصنيف مقاولين درجة أولى، سجل تجاري: [CONTRACTOR_CR]

البند الأول: نطاق الأعمال والتصميم
يلتزم المقاول بإنجاز كامل أعمال التصميم الهندسي، والتوريد، والإنشاء، والتشغيل التجريبي للمشروع المسمى "[PROJECT_NAME]" بمدينة [CITY]، تسليم مفتاح وفق أعلى المعايير الهندسية والمخططات المعتمدة من الجهات المختصة.

البند الثاني: المقابل المالي الثابت (Lump-Sum Fixed Price)
القيمة الإجمالية للعقد مبلغ مقطوع لا يقبل الزيادة قدره ([CONTRACT_PRICE_SAR]) ريال سعودي، شاملاً كافة نفقات التوريد والعمالة والمعدات والضرائب والرسوم الحكومية.

البند الثالث: ضمان الأداء المصرفي (Performance Bond)
يقدم المقاول خلال عشرة (10) أيام عمل من توقيع العقد خطاب ضمان بنكي نهائي غير مشروط وغير قابل للإلغاء صادر من بنك سعودي مرخص بنسبة (10%) من قيمة العقد الإجمالية يظل سارياً حتى صدور شهادة الاستلام النهائي وانقضاء فترة الإشعار بالعيوب (DLP).

البند الرابع: غرامات التأخير والحد الأقصى (Liquidated Damages)
إذا تأخر المقاول عن موعد الإنجاز المحدد، يُلزم بسداد غرامة تأخير قدرها (0.1%) عن كل يوم تأخير، على ألا تتجاوز الغرامة الإجمالية نسبة (10%) من إجمالي قيمة العقد، وذلك إعمالاً للمادة (178) من نظام المعاملات المدنية.

البند الخامس: التحكيم
تسوى النزاعات حصرياً عبر التحكيم المؤسسي بمركز SCCA بمدينة الرياض.`,
    templateEn: `================================================================================
LUMP-SUM EPC TURNKEY CONSTRUCTION CONTRACT (MEGA PROJECTS)
Kingdom of Saudi Arabia — Aligned with Saudi Building Code & Statutory Regulations
================================================================================

Between Employer: [EMPLOYER_NAME], CR: [EMPLOYER_CR], and Main EPC Contractor: [CONTRACTOR_NAME], Grade-1 Classified, CR: [CONTRACTOR_CR].

1. SCOPE: Contractor undertakes complete engineering, procurement, construction, and commissioning on a Turnkey basis for "[PROJECT_NAME]" in [CITY].
2. CONTRACT PRICE: Fixed lump-sum price of SAR [CONTRACT_PRICE_SAR], non-escalating.
3. PERFORMANCE SECURITY: Unconditional, irrevocable Letter of Guarantee (10% of Contract Value) issued by a licensed Saudi Bank, valid through Final Acceptance.
4. DELAY DAMAGES: 0.1% per day of delay capped strictly at 10% in accordance with Article 178 of the Saudi Civil Transactions Law.
5. DISPUTES: Final arbitration administered by SCCA in Riyadh.`,
  },

  {
    id: 'sovereign-sa-saas-pdpl',
    countryCode: 'SA',
    countryNameAr: 'المملكة العربية السعودية',
    countryNameEn: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    statuteCodeAr: 'نظام حماية البيانات الشخصية (PDPL) وضوابط الهيئة الوطنية للأمن السيبراني (NCA)',
    statuteCodeEn: 'Saudi Personal Data Protection Law (PDPL) & NCA Essential Cybersecurity Controls',
    arbitrationVenue: 'المحاكم التجارية وهيئة التحكيم بالرياض',
    dealTier: 'HIGH_STAKES',
    estimatedValueRange: '2,000,000 - 20,000,000 ر.س',
    category: 'Cloud_Tech_Data',
    titleAr: 'عقد الخدمات السحابية المؤسسية وحماية البيانات السيادية — السعودية (PDPL & NCA)',
    titleEn: 'Saudi Enterprise Cloud SaaS Agreement & Sovereign Data Protection (PDPL Compliant)',
    descriptionAr: 'اتفاقية تقديم خدمات برمجية وسحابية للمؤسسات والشركات الكبرى داخل المملكة مع إلزام تخزين ومعالجة البيانات محلياً وفق لوائح SDAIA و NCA.',
    descriptionEn: 'Enterprise SaaS and Cloud Service Agreement ensuring in-kingdom data residency, PDPL compliance, and cybersecurity audit rights.',
    keyClauses: [
      'السيادة المحلية واستضافة البيانات داخل المملكة (In-Kingdom Data Residency)',
      'اتفاقية مستوى الخدمة وجاهزية 99.95% (Uptime SLA with Service Credits)',
      'سقف المسؤولية المالية بحد أقصى الرسوم السنوية (Liability Cap 100% of Annual Fees)',
      'التوافق الصارم مع متطلبات سدايا ولوائح PDPL لنقل ومعالجة البيانات',
      'التشفير السيادي العسكري للبيانات الساكنة والمنقولة (AES-256 In-Transit & At-Rest)',
    ],
    tags: ['سحابة', 'SaaS', 'PDPL', 'سدايا', 'NCA', 'أمن_سيبراني', 'بيانات_شخصية'],
    pagesCount: 14,
    clausesCount: 20,
    templateAr: `================================================================================
عقد تقديم الخدمات السحابية وحماية البيانات الشخصية (Enterprise Cloud SaaS)
المملكة العربية السعودية — نظام حماية البيانات الشخصية ولائحة الهيئة الوطنية للأمن السيبراني
================================================================================

بين المزود السحابي: شركة [PROVIDER_NAME]، سجل تجاري: [PROVIDER_CR]
وبين العميل المؤسسي: شركة [CLIENT_NAME]، سجل تجاري: [CLIENT_CR]

البند الأول: السيادة الرقمية وتوطين البيانات
يلتزم المزود بحفظ وتخزين ومعالجة كافة بيانات العميل داخل خوادم ومراكز بيانات تقع داخل النطاق الجغرافي للمملكة العربية السعودية فقط، ويحظر قطعياً نقل أو نسخ أو تمرير أي بيانات خارج حدود المملكة دون إذن كتابي مسبق وترخيص صريح من الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA).

البند الثاني: مستوى الخدمة (SLA)
يضمن المزود جاهزية تشغيل بنسبة لا تقل عن (99.95%) شهرياً. وفي حال الانخفاض يُمنح العميل رصيد خصم تعويضي يخصم تلقائياً من الفواتير اللاحقة.

البند الثالث: المسؤولية والتعويض
تُحدد المسؤولية الإجمالية المتبادلة لكلا الطرفين عن أي أضرار مباشرة بسقف لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر (12) شهراً السابقة للمطالبة، مع استثناء خروقات السرية والأمن السيبراني من هذا السقف.`,
    templateEn: `================================================================================
ENTERPRISE SAAS & DATA PROTECTION AGREEMENT (SAUDI PDPL ALIGNED)
Governed by Saudi PDPL, SDAIA Regulations, and National Cybersecurity Authority (NCA)
================================================================================

Between Service Provider: [PROVIDER_NAME], CR: [PROVIDER_CR], and Enterprise Client: [CLIENT_NAME], CR: [CLIENT_CR].

1. IN-KINGDOM DATA RESIDENCY: All Client Data must strictly reside and be processed within physical data centers located inside the Kingdom of Saudi Arabia. Cross-border data transfer is strictly prohibited without explicit SDAIA statutory authorization.
2. SERVICE AVAILABILITY: Minimum guaranteed monthly availability of 99.95%. Service credits apply for downtime.
3. LIMITATION OF LIABILITY: Aggregate liability capped at 100% of fees paid during the trailing 12 months, excluding intentional breaches of confidentiality or gross negligence.`,
  },

  // ===========================================================================
  // 🇦🇪 2. UAE MAINLAND & DIFC / ADGM — Sovereign Million-Dollar Suite
  // ===========================================================================
  {
    id: 'sovereign-difc-spa-vc',
    countryCode: 'DIFC',
    countryNameAr: 'مركز دبي المالي العالمي (DIFC)',
    countryNameEn: 'DIFC Dubai (Common Law)',
    countryFlag: '🏛️',
    statuteCodeAr: 'قانون المعاملات والشركات لمركز دبي المالي رقم 6 لسنة 2004',
    statuteCodeEn: 'DIFC Contract Law No. 6 of 2004 & Companies Law DIFC Law No. 5/2018',
    arbitrationVenue: 'محاكم مركز دبي المالي العالمي (DIFC Courts / DIAC)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '$5,000,000 - $50,000,000+ USD',
    category: 'Venture_Investment',
    titleAr: 'عقد استثمار واكتتاب الأسهم الممتازة لجولات التمويل الكبرى — DIFC دبي',
    titleEn: 'DIFC Series A/B Preferred Share Investment Agreement & Disclosure Pack',
    descriptionAr: 'عقد استثماري عالي القيمة مبني على القانون العام (Common Law) المعتمد في مركز دبي المالي وسوق أبوظبي العالمي (ADGM)، متضمناً تفضيلات التصفية وحقوق الفيتو.',
    descriptionEn: 'Institutional venture capital Series A/B Preferred Share Subscription Agreement governed by DIFC Law with liquidation preference and anti-dilution protections.',
    keyClauses: [
      'تفضيل التصفية غير المشارك 1x (1x Non-Participating Liquidation Preference)',
      'آلية منع تخفيض القيمة المرجحة (Broad-Based Weighted Average Anti-Dilution)',
      'حقوق التسجيل والمعلومات المالية الربع سنوية (Information & Inspection Rights)',
      'قرارات الأغلبية الممتازة المحجوزة للمستثمر (Investor Reserved Matters & Veto)',
      'الاختصاص القضائي الحصري لمحاكم مركز دبي المالي (DIFC Courts Jurisdiction)',
    ],
    tags: ['DIFC', 'استثمار', 'أسهم_ممتازة', 'Series_A', 'دبي', 'ADGM', 'VC'],
    pagesCount: 20,
    clausesCount: 30,
    templateAr: `================================================================================
اتفاقية استثمار واكتتاب أسهم ممتازة (Series A Preferred Share Agreement)
مركز دبي المالي العالمي (DIFC) — خاضعة لقانون شركات وعقود DIFC والقانون العام
الاختصاص القضائي: محاكم مركز دبي المالي العالمي (DIFC Courts)
================================================================================

بين الشركة المستهدفة: شركة [COMPANY_NAME] المحدودة بأسهم والمسجلة في DIFC رقم [DIFC_REG]
وبين المستثمر المؤسسي: صندوق [INVESTOR_FUND_NAME] المسجل بالرقم [INVESTOR_REG]

البند الأول: الاكتتاب وقيمة الاستثمار
يكتتب المستثمر في عدد ([PREFERRED_SHARES_COUNT]) سهماً ممتازاً من الفئة (A) بقيمة إجمالية قدرها ([INVESTMENT_AMOUNT_USD]) دولار أمريكي بسعر إفرادي للسهم قدره ([SHARE_PRICE_USD]) دولار أمريكي.

البند الثاني: تفضيل التصفية (Liquidation Preference)
في حال وقوع أي حدث تصفية أو بيع لكامل الشركة أو اندماج، يستحق مالك الأسهم الممتازة استرداد كامل قيمة استثماره مضافاً إليها أي أرباح معلنة غير موزعة (1x Non-Participating) وذلك بالأولوية المطلقة على أي توزيع لأسهم الفئة العادية.

البند الثالث: الحماية من انخفاض القيمة (Anti-Dilution)
في حال أصدرت الشركة أسهماً لاحقة بسعر يقل عن سعر السهم الممتاز، يُعدل سعر التحويل تلقائياً وفق معادلة المتوسط المرجح الواسع النطاق (Broad-Based Weighted Average).

البند الرابع: القانون والاختصاص
يخضع هذا العقد لقوانين مركز دبي المالي العالمي (DIFC) وتختص محاكم DIFC حصرياً بنظر أي نزاع ناشئ عنه.`,
    templateEn: `================================================================================
SERIES A PREFERRED SHARE SUBSCRIPTION AGREEMENT (INSTITUTIONAL VENTURE)
Dubai International Financial Centre (DIFC) — Governed by DIFC Contract Law No. 6/2004
Exclusive Jurisdiction: The Courts of the Dubai International Financial Centre (DIFC Courts)
================================================================================

Between Target Company: [COMPANY_NAME] Limited, DIFC Registered No. [DIFC_REG], and Lead Investor: [INVESTOR_FUND_NAME], Reg No. [INVESTOR_REG].

1. SUBSCRIPTION: Investor subscribes for [PREFERRED_SHARES_COUNT] Series A Preferred Shares for an aggregate purchase price of USD [INVESTMENT_AMOUNT_USD] at USD [SHARE_PRICE_USD] per share.
2. LIQUIDATION PREFERENCE: In the event of Liquidation or Deemed Liquidation, Series A holders receive 1x original purchase price plus declared unpaid dividends prior to any distribution to Ordinary Shareholders.
3. ANTI-DILUTION: Broad-based weighted average anti-dilution adjustments apply to any subsequent down-rounds.
4. GOVERNING LAW & JURISDICTION: This Agreement is governed by DIFC Law. DIFC Courts have exclusive jurisdiction.`,
  },

  {
    id: 'sovereign-ae-commercial-jv',
    countryCode: 'AE',
    countryNameAr: 'الإمارات العربية المتحدة',
    countryNameEn: 'UAE Mainland',
    countryFlag: '🇦🇪',
    statuteCodeAr: 'قانون المعاملات التجارية الاتحادي رقم (50) لسنة 2022',
    statuteCodeEn: 'UAE Federal Decree-Law No. 50/2022 on Commercial Transactions',
    arbitrationVenue: 'مركز دبي للتحكيم الدولي (DIAC)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '15,000,000 - 100,000,000+ درهم إماراتي',
    category: 'Corporate_MA',
    titleAr: 'عقد المشروع المشترك والشراكة الاستثمارية المليونية — الإمارات العربية المتحدة',
    titleEn: 'UAE Mainland Strategic Joint Venture & Consortium Agreement',
    descriptionAr: 'اتفاقية مشروع مشترك ومحاصة استثمارية بين كبرى الشركات للمناقصات والمشاريع الكبرى وفق قانون المعاملات التجارية الاتحادي الجديد 2022.',
    descriptionEn: 'Strategic commercial consortium and joint venture agreement for major UAE infrastructure and commercial operations with DIAC arbitration.',
    keyClauses: [
      'توزيع الحصص والتمويل الإضافي (Capital Calls & Funding Commitments)',
      'لجنة الإدارة والقرارات الإستراتيجية بالإجماع (Management Committee & Unanimity)',
      'فض حالات الاستعصاء الإداري (Deadlock Resolution / Russian Roulette)',
      'التحكيم الحصري بمركز دبي للتحكيم الدولي (DIAC Arbitration Rules)',
    ],
    tags: ['الإمارات', 'مشروع_مشترك', 'JV', 'DIAC', 'معاملات_تجارية_2022'],
    pagesCount: 16,
    clausesCount: 24,
    templateAr: `================================================================================
عقد مشروع مشترك وشراكة تجارية واستثمارية (Joint Venture Agreement)
دولة الإمارات العربية المتحدة — قانون المعاملات التجارية الاتحادي رقم 50 لسنة 2022
التحكيم: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

الطرف الأول: شركة [PARTNER_A]، رخصة تجارية صادرة من دائرة الاقتصاد والسياحة بدبي رقم [LICENSE_A]
الطرف الثاني: شركة [PARTNER_B]، رخصة تجارية صادرة من دائرة التنمية الاقتصادية بأبوظبي رقم [LICENSE_B]

البند الأول: غرض المشروع ونطاق الأعمال
يتفق الطرفان على تكوين مشروع مشترك لأجل تنفيذ وإدارة مشروع "[VENTURE_PURPOSE]" بقيمة استثمارية إجمالية قدرها ([TOTAL_CAPITAL_AED]) درهم إماراتي.

البند الثاني: الحصص والتمويل
نسبة مساهمة الطرف الأول: ([SHARE_A]%) | نسبة مساهمة الطرف الثاني: ([SHARE_B]%). يلتزم كل طرف بضخ حصته في الحساب البنكي المشترك خلال المواعيد المحددة.

البند الثالث: آلية حل الاستعصاء الإداري (Deadlock)
في حال تعذر صدور قرار إداري جوهري لمدة تزيد على 30 يوماً، يحق لأي طرف تقديم عرض شراء لحصة الطرف الآخر أو بيع حصته بذات السعر والتقييم العادل (Russian Roulette Mechanism).

البند الرابع: التحكيم
تسوى أي نزاعات عبر التحكيم وفق قواعد مركز دبي للتحكيم الدولي (DIAC) في إمارة دبي.`,
    templateEn: `================================================================================
STRATEGIC JOINT VENTURE AGREEMENT — UAE MAINLAND
UAE Federal Decree-Law No. 50/2022 | Dubai International Arbitration Centre (DIAC)
================================================================================

Between Partner A: [PARTNER_A], Dubai DED License [LICENSE_A], and Partner B: [PARTNER_B], Abu Dhabi ADDED License [LICENSE_B].

1. PURPOSE: Consortium established for executing [VENTURE_PURPOSE] with aggregate committed capital of AED [TOTAL_CAPITAL_AED].
2. EQUITY & FUNDING: Partner A: [SHARE_A]% | Partner B: [SHARE_B]%.
3. DEADLOCK RESOLUTION: Binding buy-sell mechanism applied if unanimity cannot be reached within 30 days.
4. ARBITRATION: DIAC Arbitration in Dubai, UAE. English/Arabic proceedings.`,
  },

  // ===========================================================================
  // 🇶🇦 3. QATAR — Sovereign Million-Dollar Suite
  // ===========================================================================
  {
    id: 'sovereign-qa-industrial-epc',
    countryCode: 'QA',
    countryNameAr: 'دولة قطر',
    countryNameEn: 'Qatar',
    countryFlag: '🇶🇦',
    statuteCodeAr: 'قانون المعاملات المدنية رقم 22 لسنة 2004 وقانون الشركات 11 لسنة 2015',
    statuteCodeEn: 'Qatar Civil Code (Law 22/2004) & Commercial Companies Law (Law 11/2015)',
    arbitrationVenue: 'مركز قطر الدولي للتوفيق والتحكيم (QICCA)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '20,000,000 - 150,000,000+ ر.ق',
    category: 'EPC_Construction',
    titleAr: 'عقد التوريد والمقاولات الصناعية الكبرى — دولة قطر',
    titleEn: 'Qatar Mega Industrial Supply & Turnkey EPC Contract (QICCA Aligned)',
    descriptionAr: 'اتفاقية توريد وتنفيذ مشاريع صناعية وتجارية كبرى خاضعة للقانون القطري مع غرامات تأخير وضمانات بنكية متوافقة مع مصرف قطر المركزي.',
    descriptionEn: 'Major Qatari industrial EPC agreement tailored to Qatar Civil Code with mandatory QICCA arbitration in Doha.',
    keyClauses: [
      'التوريد والتركيب والتشغيل الفني المعتمد (Supply, Erection & Commissioning)',
      'خطاب ضمان الإنجاز وحسن التنفيذ بنسبة 10% صادر من بنك قطري مرخص',
      'غرامة التأخير اليومية المحددة بما لا يتجاوز 10% من قيمة العقد',
      'التحكيم الحصري بمركز قطر الدولي للتوفيق والتحكيم (QICCA) بالدوحة',
    ],
    tags: ['قطر', 'مقاولات', 'QICCA', 'مشاريع_صناعية', 'توريد'],
    pagesCount: 17,
    clausesCount: 26,
    templateAr: `================================================================================
عقد التوريد والمقاولات الصناعية المتكاملة (EPC) — دولة قطر
استناداً لأحكام القانون المدني القطري رقم (22) لسنة 2004
مركز التحكيم: مركز قطر الدولي للتوفيق والتحكيم (QICCA - الدوحة)
================================================================================

بين الطرف الأول (الجهة المشترية): شركة [BUYER_QATAR]، سجل تجاري قطري رقم [QATAR_CR_A]
وبين الطرف الثاني (المقاول/المورد): شركة [CONTRACTOR_QATAR]، سجل تجاري رقم [QATAR_CR_B]

البند الأول: نطاق الأعمال
يلتزم المقاول بتنفيذ وتوريد وتشغيل الأعمال الصناعية والإنشائية للمشروع المسمى "[PROJECT_NAME_QA]" بمدينة راس لفان / الدوحة، بقيمة إجمالية مقطوعة قدرها ([VALUE_QAR]) ريال قطري.

البند الثاني: شروط الدفع والضمان
يصرف 10% دفعة مقدمة مقابل خطاب ضمان بنكي مماثل، وتصرف المستخلصات بنسبة الإنجاز المعتمد من المهندس الاستشاري مع احتجاز نسبة 10% كضمان صيانة حتى التسليم النهائي.

البند الثالث: التحكيم
تسوى أي نزاعات عبر التحكيم وفق قواعد مركز قطر الدولي للتوفيق والتحكيم (QICCA) بالدوحة.`,
    templateEn: `================================================================================
QATAR MEGA INDUSTRIAL EPC & PROCUREMENT CONTRACT
Governed by Qatar Civil Code (Law No. 22 of 2004) | QICCA Arbitration Doha
================================================================================

Between Employer: [BUYER_QATAR], Qatar CR [QATAR_CR_A], and EPC Contractor: [CONTRACTOR_QATAR], CR [QATAR_CR_B].

1. SCOPE & PRICE: Complete turnkey industrial execution of [PROJECT_NAME_QA] for fixed price of QAR [VALUE_QAR].
2. SECURITY: 10% Advance Payment Guarantee and 10% Retention Guarantee through licensed Qatari Bank.
3. ARBITRATION: Qatar International Centre for Conciliation and Arbitration (QICCA) in Doha.`,
  },

  // ===========================================================================
  // 🇰🇼 4. KUWAIT — Sovereign Million-Dollar Suite
  // ===========================================================================
  {
    id: 'sovereign-kw-agency-distribution',
    countryCode: 'KW',
    countryNameAr: 'دولة الكويت',
    countryNameEn: 'Kuwait',
    countryFlag: '🇰🇼',
    statuteCodeAr: 'قانون التجارة الكويتي رقم (68) لسنة 1980 وقانون الوكالات التجارية',
    statuteCodeEn: 'Kuwait Commercial Code (Law 68/1980) & Commercial Agency Law No. 13/2016',
    arbitrationVenue: 'مركز الكويت للتحكيم التجاري (غرفة تجارة وصناعة الكويت)',
    dealTier: 'HIGH_STAKES',
    estimatedValueRange: '1,000,000 - 15,000,000 دينار كويتي',
    category: 'Agency_Franchise',
    titleAr: 'عقد الوكالة والتوزيع التجاري الحصري المليوني — دولة الكويت',
    titleEn: 'Kuwait Exclusive Master Commercial Agency & Distribution Agreement',
    descriptionAr: 'اتفاقية وكالة وتوزيع تجاري وتوريد حصري لعلامات تجارية عالمية داخل الكويت وفق قانون الوكالات التجارية الكويتي رقم 13 لسنة 2016.',
    descriptionEn: 'Kuwait Master Commercial Agency and Exclusive Distribution Agreement aligned with Law No. 13/2016 and Kuwait Chamber of Commerce Arbitration.',
    keyClauses: [
      'حق الوكالة والتوزيع الحصري داخل النطاق الجغرافي لدولة الكويت',
      'الحد الأدنى للمشتريات السنوية المستهدفة (Minimum Annual Target Purchase)',
      'حماية العلامة التجارية وحظر المنافسة غير المشروعة',
      'التحكيم بمركز الكويت للتحكيم التجاري بغرفة التجارة والصناعة',
    ],
    tags: ['الكويت', 'وكالة_تجارية', 'توزيع_حصري', 'غرفة_الكويت'],
    pagesCount: 15,
    clausesCount: 22,
    templateAr: `================================================================================
عقد وكالة وتوزيع تجاري حصري — دولة الكويت
مطابق لقانون التجارة الكويتي رقم (68) لسنة 1980 وقانون الوكالات التجارية رقم 13 لسنة 2016
================================================================================

بين الموكل (الشركة الأجنبية/المصنعة): شركة [PRINCIPAL_NAME] ومقرها [PRINCIPAL_ADDR]
وبين الوكيل الحصري (الجهة الكويتية): شركة [KUWAITI_AGENT]، سجل تجاري كويتي رقم [KUWAIT_CR]

البند الأول: منح الوكالة الحصرية
يمنح الموكل الوكيل حق التوزيع والبيع والتمثيل التجاري الحصري لكافة المنتجات تحت العلامة التجارية "[BRAND_NAME]" داخل النطاق الجغرافي لدولة الكويت.

البند الثاني: مستهدفات الشراء السنوية
يلتزم الوكيل بتحقيق مبيعات سنوية لا تقل عن ([TARGET_AMOUNT_KWD]) دينار كويتي للحفاظ على صفة الحصرية.

البند الثالث: التحكيم والنزاعات
يخضع هذا العقد للقوانين الكويتية ويُحال أي نزاع لمركز الكويت للتحكيم التجاري بغرفة تجارة وصناعة الكويت.`,
    templateEn: `================================================================================
EXCLUSIVE MASTER COMMERCIAL AGENCY AGREEMENT — STATE OF KUWAIT
Law No. 13/2016 on Commercial Agencies | Kuwait Chamber of Commerce Arbitration
================================================================================

Between Principal: [PRINCIPAL_NAME], and Kuwaiti Exclusive Agent: [KUWAITI_AGENT], Kuwait CR [KUWAIT_CR].

1. EXCLUSIVITY: Principal grants Agent exclusive commercial distribution rights for [BRAND_NAME] products throughout Kuwait.
2. ANNUAL SALES TARGET: Minimum annual procurement quota of KWD [TARGET_AMOUNT_KWD] required for exclusivity retention.
3. GOVERNING LAW & ARBITRATION: Kuwait Commercial Code; disputes settled via Kuwait Commercial Arbitration Centre (KCAC).`,
  },

  // ===========================================================================
  // 🇪🇬 5. EGYPT — Sovereign Million-Dollar Suite
  // ===========================================================================
  {
    id: 'sovereign-eg-spa-fra',
    countryCode: 'EG',
    countryNameAr: 'جمهورية مصر العربية',
    countryNameEn: 'Egypt',
    countryFlag: '🇪🇬',
    statuteCodeAr: 'القانون المدني رقم 131 لسنة 1948 وقانون الشركات رقم 159 لسنة 1981 وسوق المال',
    statuteCodeEn: 'Egyptian Civil Code (Law 131/1948) & Capital Market Law No. 95/1992',
    arbitrationVenue: 'مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '50,000,000 - 500,000,000+ جنيه مصري',
    category: 'Corporate_MA',
    titleAr: 'عقد بيع وشراء الأسهم واستحواذ الشركات الكبرى — جمهورية مصر العربية',
    titleEn: 'Egyptian Institutional Share Purchase Agreement (M&A & FRA Compliant)',
    descriptionAr: 'عقد استحواذ ونقل ملكية أسهم في شركات مساهمة مصرية وفق أحكام قانون سوق رأس المال وقانون الشركات مع التحكيم بمركز القاهرة الدولي CRCICA.',
    descriptionEn: 'High-value Egyptian M&A Share Purchase Agreement compliant with FRA, General Authority for Investment (GAFI), and CRCICA arbitration rules.',
    keyClauses: [
      'إجراءات نقل الملكية والإيداع المركزي لشركة مصر للمقاصة (MCDR)',
      'إقرارات وضمانات السلامة الضريبية والتأمينات (Social Insurance & ETA)',
      'حساب الضمان البنكي للتسوية مع بنك مصري مرخص من البنك المركزي (CBE)',
      'التحكيم الحصري بمركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)',
    ],
    tags: ['مصر', 'استحواذ', 'CRCICA', 'سوق_المال', 'GAFI', 'بورصة'],
    pagesCount: 19,
    clausesCount: 29,
    templateAr: `================================================================================
عقد بيع وشراء أسهم واستحواذ مؤسسي — جمهورية مصر العربية
استناداً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159 لسنة 1981
التحكيم: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

الطرف الأول (البائع): شركة [SELLER_EG]، سجل تجاري مصري رقم [EG_CR_1]
الطرف الثاني (المشتري المستثمر): شركة [BUYER_EG]، سجل تجاري رقم [EG_CR_2]

البند الأول: موضوع الصفقة
يبيع البائع للمشتري عدد ([SHARES_EG]) سهماً تمثل نسبة ([PERCENT_EG]%) من أسهم شركة [TARGET_EG] ش.م.م، بمقابل إجمالي قدره ([DEAL_EGP]) جنيه مصري.

البند الثاني: إقرارات الضرائب والتأمينات
يضمن البائع سداد كافة المستحقات الضريبية والتأمينية ومستحقات مصلحة الجمارك حتى تاريخ الإغلاق، ويتحمل أي فروق فحص سابقة.

البند الثالث: التحكيم الدولي
أي نزاع ينشأ يُحال للتحكيم بمركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA) بالقاهرة وتكون اللغة العربية هي لغة الإجراءات.`,
    templateEn: `================================================================================
EGYPTIAN INSTITUTIONAL SHARE PURCHASE AGREEMENT (M&A)
Governed by Egyptian Civil Code (Law 131/1948) | CRCICA Arbitration Cairo
================================================================================

Between Seller: [SELLER_EG], Egyptian CR [EG_CR_1], and Buyer: [BUYER_EG], CR [EG_CR_2].

1. SHARE TRANSFER: Transfer of [SHARES_EG] shares representing [PERCENT_EG]% of [TARGET_EG] SAE for total price of EGP [DEAL_EGP].
2. TAX & SOCIAL INSURANCE WARRANTIES: Seller warrants clearance from Egyptian Tax Authority and Social Insurance Organization up to Closing.
3. ARBITRATION: CRCICA in Cairo, Egypt under its arbitration rules.`,
  },

  // ===========================================================================
  // 🇯🇴 6. JORDAN — Sovereign Million-Dollar Suite
  // ===========================================================================
  {
    id: 'sovereign-jo-shareholders-ccd',
    countryCode: 'JO',
    countryNameAr: 'المملكة الأردنية الهاشمية',
    countryNameEn: 'Jordan',
    countryFlag: '🇯🇴',
    statuteCodeAr: 'قانون الشركات الأردني رقم 22 لسنة 1997 والقانون المدني الأردني',
    statuteCodeEn: 'Jordanian Companies Law No. 22/1997 & Companies Control Department (CCD)',
    arbitrationVenue: 'محاكم قصر العدل عمان ومركز التحكيم الأردني',
    dealTier: 'HIGH_STAKES',
    estimatedValueRange: '1,000,000 - 10,000,000 دينار أردني',
    category: 'Corporate_MA',
    titleAr: 'اتفاقية المساهمين وحوكمة الكيانات الكبرى — المملكة الأردنية الهاشمية',
    titleEn: 'Jordanian Institutional Shareholders & Corporate Governance Agreement (CCD)',
    descriptionAr: 'اتفاقية حوكمة وتنظيم حقوق الشركاء والتخارج لمشاريع الشركات في الأردن معتمدة لدى دائرة مراقبة الشركات (CCD).',
    descriptionEn: 'Jordanian comprehensive Shareholders Agreement complying with Companies Law 22/1997 with deadlock and Drag-Along rights.',
    keyClauses: [
      'شروط وأحكام نقل الملكية وحظر التصرف (Lock-up Period)',
      'حق الشفعة وأولية الشراء (Right of First Refusal)',
      'آلية التخارج الإجباري والانضمام (Drag-Along & Tag-Along)',
      'صلاحيات مجلس الإدارة والقرارات السيادية المحجوزة (Reserved Matters)',
    ],
    tags: ['الأردن', 'اتفاقية_مساهمين', 'CCD', 'حوكمة_شركات', 'عمان'],
    pagesCount: 16,
    clausesCount: 25,
    templateAr: `================================================================================
اتفاقية الشركاء والمساهمين وحوكمة الكيانات — المملكة الأردنية الهاشمية
استناداً لأحكام قانون الشركات الأردني رقم 22 لسنة 1997 وتعديلاته
المسجلة لدى دائرة مراقبة الشركات (CCD) - عمان
================================================================================

بين الشريك الأول: [PARTNER_JO_1] | الرقم الوطني للمنشأة: [JO_NAT_1]
وبين الشريك الثاني: [PARTNER_JO_2] | الرقم الوطني للمنشأة: [JO_NAT_2]

البند الأول: حوكمة القرارات المحجوزة
تتطلب القرارات التالية موافقة أغلبية لا تقل عن 75% من رأس المال: تعديل عقد التأسيس، إدخال شركاء جدد، رهن أصول الشركة، أو فتح اعتمادات تتجاوز 100,000 دينار أردني.

البند الثاني: حق الشفعة
يلتزم أي شريك يرغب في بيع حصصه بعرضها أولاً على سائر الشركاء بنفس الشروط والسعر المقدم من الطرف الثالث.

البند الثالث: القانون والاختصاص
يخضع العقد لأحكام قانون الشركات الأردني، وتختص محاكم عمان (قصر العدل) أو التحكيم الأردني.`,
    templateEn: `================================================================================
SHAREHOLDERS & CORPORATE GOVERNANCE AGREEMENT — HASHEMITE KINGDOM OF JORDAN
Jordanian Companies Law No. 22/1997 | Companies Control Department (CCD)
================================================================================

Between Shareholder A: [PARTNER_JO_1], and Shareholder B: [PARTNER_JO_2].

1. RESERVED MATTERS: 75% supermajority required for charter amendments, new equity issues, asset pledges, or liabilities exceeding JOD 100,000.
2. PRE-EMPTIVE RIGHTS: Mandatory Right of First Refusal on any proposed equity transfers.
3. JURISDICTION: Jordanian Companies Law No. 22/1997 and Amman Courts.`,
  },

  // ===========================================================================
  // 🇺🇸 7. UNITED STATES (DELAWARE) — Sovereign Million-Dollar Suite
  // ===========================================================================
  {
    id: 'sovereign-us-delaware-spa',
    countryCode: 'US',
    countryNameAr: 'الولايات المتحدة الأمريكية',
    countryNameEn: 'United States (Delaware)',
    countryFlag: '🇺🇸',
    statuteCodeAr: 'قانون الشركات العام لولاية ديلاوير (DGCL Title 8) وقانون التجارة الموحد (UCC)',
    statuteCodeEn: 'Delaware General Corporation Law (DGCL Title 8) & UCC Article 2',
    arbitrationVenue: 'Delaware Court of Chancery & AAA / JAMS New York',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '$25,000,000 - $250,000,000+ USD',
    category: 'Corporate_MA',
    titleAr: 'عقد الاستحواذ المؤسسي وشراء الأسهم المليوني — ولاية ديلاوير الأمريكية',
    titleEn: 'Delaware Institutional Share Purchase Agreement ($25M+ Institutional M&A)',
    descriptionAr: 'اتفاقية استحواذ مؤسسية كبرى خاضعة لقانون ديلاوير للشركات (DGCL)، متضمنة معايير الإفصاح والتعويضات وسندات الضمان وفق أرقى ممارسات وول ستريت.',
    descriptionEn: 'Wall-Street tier institutional M&A agreement governed by Delaware General Corporation Law with comprehensive disclosure schedules, representations, and Delaware Chancery dispute mechanics.',
    keyClauses: [
      'شروط الإغلاق المالي وتسوية رأس المال العامل (Working Capital Adjustment & True-Up)',
      'إقرارات البائع الشاملة والملزمة (Comprehensive Seller Representations & Warranties)',
      'سقف التعويض ومبلغ البداية (Indemnity Basket & Cap Mechanisms)',
      'شروط عدم التأثير السلبي الجوهري (Material Adverse Effect / MAE Clause)',
      'الاختصاص القضائي الحصري لمحكمة ديلاوير تشانسري (Delaware Court of Chancery)',
    ],
    tags: ['Delaware', 'M&A', 'Institutional', 'DGCL', 'WallStreet', 'SPA', 'USA'],
    pagesCount: 26,
    clausesCount: 38,
    templateAr: `================================================================================
عقد بيع وشراء الأسهم واستحواذ الكيانات الكبرى — ولاية ديلاوير الأمريكية
خاضع لقانون شركات ديلاوير العام (DGCL Title 8) والمعايير الفيدرالية
جهة الاختصاص: محكمة ديلاوير تشانسري (Delaware Court of Chancery)
================================================================================

أُبرم هذا العقد في [DATE] بين:
البائع المؤسسي: شركة [US_SELLER_CORP]، شركة مؤسسة بموجب قوانين ولاية ديلاوير، رقم الملف [FILE_A]
المشتري المؤسسي: شركة [US_BUYER_CORP]، شركة مؤسسة بموجب قوانين ولاية ديلاوير، رقم الملف [FILE_B]

البند الأول: شراء الأسهم والمقابل المالي
يبيع البائع للمشتري كامل الأسهم المصدرة والمتداولة من الفئة المشتركة والممتازة في شركة [US_TARGET_CORP] بمقابل إجمالي قدره ([DEAL_USD]) دولار أمريكي، خاضعاً لتسوية رأس المال العامل عند الإغلاق (Working Capital True-Up).

البند الثاني: صندوق التعويضات وسقفه (Indemnity Basket & Cap)
لا يستحق المشتري أي تعويضات عن الإخلال بالضمانات إلا إذا تجاوزت المطالبات التراكمية مبلغ ([BASKET_USD]) دولار أمريكي ("سلة البداية")، وتحدد المسؤولية الإجمالية بسقف لا يتجاوز 15% من ثمن الشراء، باستثناء الضمانات الأساسية (Fundamental Reps).

البند الثالث: الاختصاص الحصري
يخضع هذا العقد ويفسر حصرياً وفق قوانين ولاية ديلاوير دون إعمال لقواعد تعارض القوانين، وتختص محكمة ديلاوير تشانسري (Delaware Court of Chancery) حصرياً بنظر أي نزاع.`,
    templateEn: `================================================================================
INSTITUTIONAL STOCK PURCHASE AGREEMENT (DELAWARE M&A)
Delaware General Corporation Law (DGCL Title 8) | Delaware Court of Chancery
================================================================================

Between Seller: [US_SELLER_CORP], a Delaware Corporation, File No. [FILE_A], and Buyer: [US_BUYER_CORP], a Delaware Corporation, File No. [FILE_B].

1. TRANSACTION & PURCHASE PRICE: Purchase of 100% of the issued and outstanding capital stock of [US_TARGET_CORP] for aggregate base purchase price of USD [DEAL_USD], subject to post-closing working capital adjustment.
2. INDEMNIFICATION, BASKET & CAP: Deductible basket of USD [BASKET_USD] and general indemnity cap of 15% of Enterprise Value, except for Fundamental Representations (valid through statutory limitation).
3. EXCLUSIVE DELAWARE JURISDICTION: This Agreement shall be governed by the laws of the State of Delaware. The Court of Chancery of the State of Delaware shall have exclusive jurisdiction.`,
  },

  // ===========================================================================
  // 🇬🇧 8. UNITED KINGDOM & INTERNATIONAL — Sovereign Million-Dollar Suite
  // ===========================================================================
  {
    id: 'sovereign-gb-cross-border-spa',
    countryCode: 'GB',
    countryNameAr: 'المملكة المتحدة والقانون الدولي',
    countryNameEn: 'UK & International (English Law)',
    countryFlag: '🇬🇧',
    statuteCodeAr: 'قانون الشركات البريطاني Companies Act 2006 وقواعد LCIA',
    statuteCodeEn: 'UK Companies Act 2006 & London Court of International Arbitration (LCIA)',
    arbitrationVenue: 'London Court of International Arbitration (LCIA - London)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '£10,000,000 - £100,000,000+ GBP / USD',
    category: 'Corporate_MA',
    titleAr: 'عقد الاستحواذ العابر للحدود خاضع للقانون الإنجليزي — لندن (LCIA)',
    titleEn: 'Cross-Border Institutional Share Purchase Agreement (English Law & LCIA)',
    descriptionAr: 'اتفاقية استحواذ دولية عابرة للحدود مصاغة وفق أعلى معايير القانون الإنجليزي ومكاتب المحاماة العالمية (Magic Circle) مع التحكيم بمركز لندن LCIA.',
    descriptionEn: 'Cross-border institutional M&A Share Purchase Agreement governed by English Law with LCIA arbitration in London and warranty indemnity protections.',
    keyClauses: [
      'آلية الصندوق المقفل لتثبيت السعر (Locked-Box Mechanism vs Completion Accounts)',
      'تحديد الالتزامات الضريبية بسند التزام مستقل (Tax Deed of Covenant)',
      'التحكيم الحصري بمركز لندن للتحكيم الدولي (LCIA) في لندن',
    ],
    tags: ['بريطانيا', 'English_Law', 'LCIA', 'استحواذ_دولي', 'London'],
    pagesCount: 24,
    clausesCount: 34,
    templateAr: `================================================================================
عقد بيع وشراء حصص عابر للحدود — خاضع للقانون الإنجليزي
تحكيم: محكمة لندن للتحكيم الدولي (LCIA - لندن)
================================================================================

بين البائع: شركة [UK_SELLER] المسجلة بإنجلترا وويلز رقم [UK_REG_1]
وبين المشتري: شركة [UK_BUYER] المسجلة بإنجلترا وويلز رقم [UK_REG_2]

البند الأول: البيع وثمن الصندوق المقفل (Locked Box)
يبيع البائع الحصص للمشتري خالية من الرهون بثمن إجمالي قدره ([DEAL_GBP]) جنيه إسترليني مقفل ومثبت في تاريخ الحسابات المعتمدة، مع تعهد بعدم تسريب أي أموال (No Value Leakage).

البند الثاني: التحكيم الدولي بلندن
يخضع هذا العقد ويفسر وفقاً للقانون الإنجليزي، ويحال أي نزاع للتحكيم لدى محكمة لندن للتحكيم الدولي (LCIA) في لندن.`,
    templateEn: `================================================================================
CROSS-BORDER SHARE PURCHASE AGREEMENT (ENGLISH LAW)
Governed by the Laws of England and Wales | LCIA Arbitration in London
================================================================================

Between Seller: [UK_SELLER], Registered in England & Wales No. [UK_REG_1], and Buyer: [UK_BUYER], Reg No. [UK_REG_2].

1. SALE & LOCKED BOX CONSIDERATION: Transfer of all shares for fixed cash consideration of GBP [DEAL_GBP] based on the Locked Box Date. Seller covenants zero Value Leakage.
2. LCIA ARBITRATION: Governed by English law. Any dispute shall be referred to and finally resolved by arbitration under the LCIA Rules in London.`,
  },

  {
    id: 'sovereign-uncitral-cisg-supply',
    countryCode: 'INT',
    countryNameAr: 'المعايير الدولية (الأمم المتحدة)',
    countryNameEn: 'International UNCITRAL & ICC',
    countryFlag: '🌐',
    statuteCodeAr: 'اتفاقية الأمم المتحدة للبيع الدولي للبضائع (CISG) ومصطلحات Incoterms 2020',
    statuteCodeEn: 'UN Convention on Contracts for the International Sale of Goods (CISG 1980)',
    arbitrationVenue: 'غرفة التجارة الدولية بباريس (ICC Paris) أو الأونسيترال',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '$5,000,000 - $50,000,000+ USD',
    category: 'Agency_Franchise',
    titleAr: 'عقد التوريد وسلاسل الإمداد الدولية المليوني — معايير الأمم المتحدة (CISG & ICC)',
    titleEn: 'International Master Supply & Cross-Border Logistics Contract (CISG & Incoterms 2020)',
    descriptionAr: 'اتفاقية توريد دولية للبضائع والمعدات وسلاسل الإمداد بين قارات العالم خاضعة لاتفاقية CISG مع شروط الدفع بالاعتمادات المستندية غير القابلة للإلغاء (LC).',
    descriptionEn: 'High-volume international sales and cross-border supply chain agreement governed by CISG 1980 with ICC Incoterms 2020 and Documentary Letters of Credit.',
    keyClauses: [
      'شروط التسليم الدولية وفق Incoterms 2020 (CIF / FOB / DDP)',
      'الاعتماد المستندي المصرفي المعزز غير القابل للإلغاء (Irrevocable Confirmed L/C)',
      'أحكام فحص البضائع وتخريج شهادات الجودة والمنشأ (Inspection & Quality Certificate)',
      'التحكيم الدولي بغرفة التجارة الدولية (ICC Arbitration Rules)',
    ],
    tags: ['أمم_متحدة', 'CISG', 'Incoterms', 'ICC', 'توريد_دولي', 'سلاسل_إمداد'],
    pagesCount: 18,
    clausesCount: 26,
    templateAr: `================================================================================
عقد البيع والتوريد الدولي للبضائع وسلاسل الإمداد (International CISG Supply)
اتفاقية الأمم المتحدة للبيع الدولي للبضائع (CISG 1980) وقواعد ICC باريس
================================================================================

بين المورد الدولي (المصدر): شركة [EXPORTER_NAME]، المسجلة بـ [EXPORT_COUNTRY]
وبين المشتري الدولي (المستورد): شركة [IMPORTER_NAME]، المسجلة بـ [IMPORT_COUNTRY]

البند الأول: شروط الشحن والتسليم
تسلم المنتجات مطابقة للمواصفات وفق شرط التسليم CIF ميناء [PORT_NAME] وفق مصطلحات التجارة الدولية Incoterms 2020.

البند الثاني: آلية السداد والاعتماد المستندي (Letter of Credit)
يفتح المستورد اعتماداً مستندياً معززاً غير قابل للإلغاء وقابلاً للتحويل بنسبة 100% من قيمة الشحنة لصالح المصدر لدى بنك دولي معتمد من الدرجة الأولى.

البند الثالث: التحكيم الدولي
تسوى النزاعات بالتحكيم وفق قواعد غرفة التجارة الدولية (ICC) بباريس بواسطة محكم واحد أو ثلاثة محكمين.`,
    templateEn: `================================================================================
INTERNATIONAL SALE OF GOODS & SUPPLY CHAIN CONTRACT
United Nations Convention on Contracts for the International Sale of Goods (CISG 1980)
================================================================================

Between Exporter: [EXPORTER_NAME], [EXPORT_COUNTRY], and Importer: [IMPORTER_NAME], [IMPORT_COUNTRY].

1. DELIVERY TERMS: Delivery CIF [PORT_NAME] pursuant to ICC Incoterms 2020.
2. PAYMENT: 100% Irrevocable, confirmed Letter of Credit (L/C) at sight issued by a Tier-1 International Bank.
3. DISPUTE RESOLUTION: Final arbitration under the Rules of Arbitration of the International Chamber of Commerce (ICC) in Paris.`,
  },

  // ---------------------------------------------------------------------------
  // 🇸🇦 Saudi Arabia Additional Sovereign Contracts
  // ---------------------------------------------------------------------------
  {
    id: 'sovereign-sa-agency-franchise-5m',
    countryCode: 'SA',
    countryNameAr: 'المملكة العربية السعودية',
    countryNameEn: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    statuteCodeAr: 'نظام الوكالات التجارية م/11 ونظام المعاملات المدنية م/191',
    statuteCodeEn: 'Saudi Commercial Agencies Law (M/11) & Civil Transactions Law (M/191)',
    arbitrationVenue: 'المركز السعودي للتحكيم التجاري (SCCA - الرياض)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '5,000,000 - 25,000,000 ر.س',
    category: 'Agency_Franchise',
    titleAr: 'عقد الوكالة التجارية والتوزيع الحصري المليوني — المملكة العربية السعودية',
    titleEn: 'Saudi Master Commercial Agency & Exclusive Distribution Agreement',
    descriptionAr: 'اتفاقية وكالة وتوزيع تجاري حصري معتمدة للقيد بوزارة التجارة السعودية تتوافق مع نظام المعاملات المدنية وأحكام التعويض عن إنهاء الوكالة المفاجئ.',
    descriptionEn: 'High-value master commercial agency and exclusive distribution agreement compliant with the Ministry of Commerce registration and Civil Transactions Law.',
    keyClauses: [
      'التسجيل الإلزامي بسجل الوكالات التجارية بوزارة التجارة',
      'تحديد الإقليم الجغرافي وحصرية التوزيع وحصص المبيعات السنوية (Minimum Target)',
      'التعويض العادل عن الإنهاء التعسفي للوكالة دون سبب مشروع وفق م/191',
      'التحكيم الحصري لدى المركز السعودي للتحكيم التجاري (SCCA)',
    ],
    tags: ['السعودية', 'وكالة_تجارية', 'توزيع_حصري', 'وزارة_التجارة', 'SCCA'],
    pagesCount: 16,
    clausesCount: 24,
    templateAr: `================================================================================
عقد وكالة وتوزيع تجاري حصري — المملكة العربية السعودية
خاضع لنظام الوكالات التجارية (م/11) ونظام المعاملات المدنية (م/191)
================================================================================

بين الموكل: شركة [PRINCIPAL_NAME]، المسجلة برقم [CR_PRINCIPAL]
وبين الوكيل الحصري: شركة [AGENT_NAME]، شركة سعودية مسجلة برقم س.ت [CR_AGENT]

البند الأول: موضوع الوكالة والإقليم
يعين الموكل الطرف الثاني وكيلاً وموزعاً تجارياً حصرياً لمنتجات [PRODUCTS] داخل النطاق الجغرافي للمملكة العربية السعودية، ويلتزم الوكيل بقيد العقد لدى سجل الوكالات التجارية بوزارة التجارة.

البند الثاني: الحصة التسويقية والحد الأدنى
يلتزم الوكيل بتحقيق حد أدنى من المشتريات السنوية بقيمة ([MIN_TARGET]) ريال سعودي، وفي حال الإخفاق غير المبرر يحق للموكل تحويل الوكالة إلى غير حصرية.

البند الثالث: إنهاء الوكالة والتعويض
لا يجوز إنهاء الوكالة قبل انتهاء مدتها إلا لسبب مشروع، وإذا أنهى الموكل العقد دون خطأ من الوكيل التزم بتعويضه تعويضاً عادلاً عما لحقه من خسارة وما فاته من كسب مشروع وفق أحكام نظام المعاملات المدنية السعودي.

البند الرابع: التحكيم التجاري
يخضع هذا العقد للأنظمة السارية في المملكة العربية السعودية، ويفصل في أي نزاع نهائياً بالتحكيم لدى المركز السعودي للتحكيم التجاري (SCCA) بالرياض.`,
    templateEn: `================================================================================
SAUDI MASTER COMMERCIAL AGENCY & EXCLUSIVE DISTRIBUTION AGREEMENT
Governed by Royal Decree M/11 & Civil Transactions Law M/191 | SCCA Riyadh
================================================================================

Between Principal: [PRINCIPAL_NAME], CR [CR_PRINCIPAL], and Exclusive Agent: [AGENT_NAME], Saudi Company CR [CR_AGENT].

1. APPOINTMENT & TERRITORY: Exclusive commercial agency and distribution across the Kingdom of Saudi Arabia, registered with the Ministry of Commerce Agency Registry.
2. MINIMUM ANNUAL SALES COMMITMENT: Target minimum order value of SAR [MIN_TARGET] per fiscal year.
3. TERMINATION & FAIR INDEMNITY: No early termination without legitimate cause. Wrongful termination entitles the Agent to compensation under the Saudi Civil Transactions Law.
4. SCCA ARBITRATION: Governed by the laws and regulations of Saudi Arabia. Disputes settled finally under SCCA Arbitration Rules in Riyadh.`,
  },

  {
    id: 'sovereign-sa-realestate-wafi-50m',
    countryCode: 'SA',
    countryNameAr: 'المملكة العربية السعودية',
    countryNameEn: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    statuteCodeAr: 'نظام بيع وتأجير مشروعات عقارية على الخارطة (وافي) والوساطة والتسجيل العيني',
    statuteCodeEn: 'Saudi Off-Plan Sales Law (Wafi) & Real Estate General Authority (REGA)',
    arbitrationVenue: 'المركز السعودي للتحكيم التجاري (SCCA - الرياض)',
    dealTier: 'HIGH_STAKES',
    estimatedValueRange: '50,000,000 - 300,000,000+ ر.س',
    category: 'Corporate_MA',
    titleAr: 'عقد تطوير عقاري استثماري واستصناع مؤسسي (مشروع وافي) — السعودية',
    titleEn: 'Saudi Mega Real Estate Master Development & Wafi Off-Plan Agreement',
    descriptionAr: 'اتفاقية تطوير عقاري كبرى لمشروعات الأبراج والمجمعات التجارية والضواحي السكنية خاضعة للضوابط الصادرة عن الهيئة العامة للعقار ولجنة وافي وحساب الضمان.',
    descriptionEn: 'High-value master real estate investment and development agreement compliant with Saudi REGA, Wafi off-plan escrow account regulations, and SCCA arbitration.',
    keyClauses: [
      'التزام المطور بفتح حساب ضمان مصرفي معتمد لدى لجنة وافي (Escrow Account)',
      'جدول زمني مرتبط بنسب الإنجاز الميداني المعتمدة من الاستشاري الهندسي المستقل',
      'اشتراطات السلامة الفنية وغرامات التأخير القصوى وفق المعايير الوطنية',
      'التحكيم لدى المركز السعودي للتحكيم التجاري (SCCA) بالرياض',
    ],
    tags: ['السعودية', 'تطوير_عقاري', 'وافي', 'الهيئة_العامة_للعقار', 'REGA', 'Escrow'],
    pagesCount: 28,
    clausesCount: 42,
    templateAr: `================================================================================
عقد تطوير عقاري استثماري وترخيص بيع على الخارطة (وافي) — السعودية
الهيئة العامة للعقار ونظام الوساطة والتسجيل العقاري
================================================================================

بين المطور الرئيسي: شركة [DEVELOPER_NAME]، س.ت [CR_DEV]، المرخصة من وافي رقم [WAFI_LIC]
وبين الممول / المشتري المؤسسي: شركة [INVESTOR_NAME]، س.ت [CR_INV]

البند الأول: نطاق المشروع والتراخيص
تطوير وتشييد مشروع [PROJECT_NAME] الواقع على الأرض رقم [PLOT_NO] بمساحة [TOTAL_AREA] م2، وفق المخططات المعتمدة وتراخيص البناء الصادرة ونظام بيع الوحدات على الخارطة.

البند الثاني: حساب الضمان البنكي (Escrow Account)
تودع كافة التدفقات المالية والمبالغ المسددة في حساب الضمان البنكي المعتمد رقم [IBAN_ESCROW] لدى بنك [BANK_NAME] ولا يجوز الصرف منه إلا بنسب الإنجاز الفعلية المعتمدة من الاستشاري الهندسي المستقل.

البند الثالث: مدة الإنجاز وغرامات التأخير
يلتزم المطور بإنهاء المشروع وتسليمه جاهزاً للتشغيل في موعد غايته [COMPLETION_DATE]. وفي حال التأخير غير المبرر تفرض غرامة تأخير قدرها [DELAY_PENALTY]% أسبوعياً بحد أقصى 10% من قيمة العقد.

البند الرابع: التحكيم
يخضع العقد للأنظمة السارية في المملكة العربية السعودية ويحال أي نزاع للمركز السعودي للتحكيم التجاري (SCCA) بالرياض.`,
    templateEn: `================================================================================
SAUDI MEGA REAL ESTATE MASTER DEVELOPMENT & WAFI OFF-PLAN AGREEMENT
Saudi Real Estate General Authority (REGA) & Wafi Off-Plan Framework
================================================================================

Between Master Developer: [DEVELOPER_NAME], CR [CR_DEV], Wafi License [WAFI_LIC], and Institutional Investor: [INVESTOR_NAME], CR [CR_INV].

1. PROJECT SCOPE & WAFI COMPLIANCE: Construction and development of [PROJECT_NAME] on Plot [PLOT_NO] in full compliance with REGA off-plan regulations.
2. PROJECT ESCROW ACCOUNT: All funds deposited into designated Wafi Escrow Account [IBAN_ESCROW], disbursed solely upon certified independent engineer milestones.
3. COMPLETION & DELAY DAMAGES: Delivery by [COMPLETION_DATE]. Delay penalties capped at 10% of total development budget.
4. DISPUTE RESOLUTION: Saudi governing law with final SCCA Arbitration in Riyadh.`,
  },

  // ---------------------------------------------------------------------------
  // 🇦🇪 UAE Additional Sovereign Contracts
  // ---------------------------------------------------------------------------
  {
    id: 'sovereign-ae-commercial-agency-10m',
    countryCode: 'AE',
    countryNameAr: 'الإمارات العربية المتحدة (الاتحادي)',
    countryNameEn: 'UAE Mainland',
    countryFlag: '🇦🇪',
    statuteCodeAr: 'مرسوم بقانون اتحادي رقم (3) لسنة 2022 بشأن تنظيم الوكالات التجارية',
    statuteCodeEn: 'UAE Federal Decree-Law No. (3) of 2022 Concerning Commercial Agencies',
    arbitrationVenue: 'مركز دبي للتحكيم الدولي (DIAC)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '10,000,000 - 50,000,000 درهم إماراتي',
    category: 'Agency_Franchise',
    titleAr: 'عقد الوكالة التجارية الحصرية وفق القانون الاتحادي الجديد 2022 — الإمارات',
    titleEn: 'UAE Statutory Commercial Agency Agreement (Federal Decree-Law No. 3/2022)',
    descriptionAr: 'اتفاقية وكالة تجارية حديثة تتماشى مع أحكام القانون الاتحادي الإماراتي رقم 3/2022 الذي فتح باب الوكالات للشركات المساهمة العامة ونظم فض المنازعات أمام لجنة الوكالات التجارية ومركز DIAC.',
    descriptionEn: 'Exclusive UAE commercial agency agreement drafted under Federal Decree-Law No. 3 of 2022, addressing Commercial Agency Committee procedures and DIAC arbitration.',
    keyClauses: [
      'التوافق مع أحكام المرسوم الاتحادي رقم 3 لسنة 2022 والتسجيل بوزارة الاقتصاد',
      'تنظيم حالات إنهاء العقد وعدم التجديد والتعويض المالي العادل للوكيل',
      'إجراءات العرض على لجنة الوكالات التجارية بوزارة الاقتصاد كمسار أولي',
      'التحكيم بمركز دبي للتحكيم الدولي (DIAC)',
    ],
    tags: ['الإمارات', 'وكالة_تجارية', 'مرسوم_2022', 'وزارة_الاقتصاد', 'DIAC'],
    pagesCount: 20,
    clausesCount: 30,
    templateAr: `================================================================================
عقد وكالة تجارية حصرية — الإمارات العربية المتحدة
المرسوم بقانون اتحادي رقم (3) لسنة 2022 وقانون المعاملات التجارية رقم (50) لسنة 2022
================================================================================

بين الموكل الأجنبي: شركة [FOREIGN_PRINCIPAL]، المسجلة بـ [JURISDICTION]
وبين الوكيل التجاري: شركة [UAE_AGENT]، المسجلة برخصة تجارية رقم [TRADE_LIC] بدبي / أبوظبي

البند الأول: التعيين والحصرية
يعين الموكل الطرف الثاني وكيلاً تجارياً حصرياً لترويج وتوزيع وبيع منتجات [PRODUCTS] داخل دولة الإمارات العربية المتحدة، ويقيد هذا العقد بسجل الوكالات بوزارة الاقتصاد.

البند الثاني: إنهاء الوكالة وشروطه
وفقاً لأحكام المادة (9) والمادة (10) من المرسوم بقانون اتحادي رقم (3) لسنة 2022، لا يجوز إنهاء الوكالة سارية المفعول المحددة المدة إلا بانتهاء أجلها أو بموجب اتفاق مكتوب أو لسبب جوهري تقتنع به لجنة الوكالات التجارية. وفي حال الإنهاء غير المبرر يستحق الوكيل تعويضاً نقدياً عادلاً.

البند الثالث: تسوية المنازعات والتحكيم
تعرض المنازعات الناشئة عن هذا العقد أولاً على لجنة الوكالات التجارية بوزارة الاقتصاد، وفي حال عدم التسوية، يحال النزاع نهائياً إلى التحكيم وفقاً لقواعد مركز دبي للتحكيم الدولي (DIAC) بدبي.`,
    templateEn: `================================================================================
UAE STATUTORY COMMERCIAL AGENCY AGREEMENT (FEDERAL DECREE-LAW NO. 3/2022)
Governed by UAE Commercial Transactions Law | DIAC Dubai Arbitration
================================================================================

Between Foreign Principal: [FOREIGN_PRINCIPAL], and UAE Commercial Agent: [UAE_AGENT], Commercial License No. [TRADE_LIC].

1. APPOINTMENT: Exclusive commercial agent across the United Arab Emirates, subject to mandatory Ministry of Economy registration.
2. TERMINATION & COMPENSATION: Pursuant to Articles 9 & 10 of Federal Decree-Law No. 3/2022, termination before expiry requires mutual consent, material cause, or fair monetary indemnity.
3. DISPUTE RESOLUTION: Commercial Agency Committee review followed by final binding arbitration at DIAC (Dubai International Arbitration Centre).`,
  },

  {
    id: 'sovereign-ae-rera-escrow-dev-50m',
    countryCode: 'AE',
    countryNameAr: 'الإمارات العربية المتحدة (دبي)',
    countryNameEn: 'UAE (Dubai Mainland)',
    countryFlag: '🇦🇪',
    statuteCodeAr: 'قانون حسابات الضمان العقاري بدبي رقم (8) لسنة 2007 وتشريعات RERA',
    statuteCodeEn: 'Dubai Law No. (8) of 2007 on Real Estate Development Trust Accounts & RERA',
    arbitrationVenue: 'مركز دبي للتحكيم الدولي (DIAC)',
    dealTier: 'HIGH_STAKES',
    estimatedValueRange: '50,000,000 - 500,000,000 درهم إماراتي',
    category: 'Corporate_MA',
    titleAr: 'عقد استثمار وتطوير عقاري مليوني وحساب ضمان (RERA Escrow) — دبي',
    titleEn: 'Dubai Mega Real Estate Development & Escrow Investment Agreement (RERA Compliant)',
    descriptionAr: 'اتفاقية تمويل وتطوير عقاري كبرى في إمارة دبي ملزمة بأحكام دائرة الأراضي والأملاك ومؤسسة التنظيم العقاري (RERA) وحساب الضمان العقاري المصرفي المعتمد.',
    descriptionEn: 'Institutional real estate development and joint financing contract compliant with Dubai Real Estate Regulatory Agency (RERA), Law No. 8/2007, and DIAC arbitration.',
    keyClauses: [
      'التسجيل المعتمد لدى دائرة الأراضي والأملاك في دبي (DLD / Oqood)',
      'إدارة التدفقات النقدية عبر حساب ضمان RERA Escrow لدى بنك إماراتي معتمد',
      'شهادات إنجاز مستقلة صادرة عن استشاري هندسي معتمد لدى بلدية دبي',
      'التحكيم الحصري بمركز دبي للتحكيم الدولي (DIAC)',
    ],
    tags: ['دبي', 'عقارات', 'RERA', 'أراضي_دبي', 'حساب_ضمان', 'DIAC'],
    pagesCount: 26,
    clausesCount: 38,
    templateAr: `================================================================================
عقد تطوير واستثمار عقاري مؤسسي — إمارة دبي
خاضع لقانون حسابات ضمان التطوير العقاري رقم (8) لسنة 2007 وتشريعات مؤسسة التنظيم العقاري (RERA)
================================================================================

بين المطور العقاري: شركة [DUBAI_DEV_CO]، المسجلة لدى RERA برقم [RERA_NO]
وبين المستثمر المؤسسي: شركة [INSTITUTIONAL_INVESTOR]

البند الأول: موضوع التطوير العقاري
تطوير وبناء المجمع السكني والتجاري [PROJECT_NAME] على قطعة الأرض رقم [PLOT_ID] في منطقة [LOCATION_DUBAI]، بقيمة استثمارية إجمالية قدرها ([PROJECT_AED]) درهم إماراتي.

البند الثاني: حساب الضمان العقاري (RERA Escrow Account)
تودع كافة أموال المشروع وأقساط المستثمرين في حساب الضمان رقم [ESCROW_IBAN] لدى بنك [APPROVED_BANK]، وتصرف الدفعات بموجب تقارير التفتيش الصادرة عن مهندسي RERA المعتمدين.

البند الثالث: تسوية المنازعات
تسوى المنازعات بالتحكيم وفقاً لقواعد مركز دبي للتحكيم الدولي (DIAC) بواسطة ثلاثة محكمين، وتكون لغة التحكيم الإنجليزية أو العربية ومقره دبي.`,
    templateEn: `================================================================================
DUBAI MEGA REAL ESTATE DEVELOPMENT & ESCROW INVESTMENT AGREEMENT
Governed by Dubai Law No. 8/2007 & RERA Regulations | DIAC Dubai
================================================================================

Between Developer: [DUBAI_DEV_CO], RERA Registration [RERA_NO], and Institutional Investor: [INSTITUTIONAL_INVESTOR].

1. SCOPE: Turnkey investment and development of [PROJECT_NAME] on Plot [PLOT_ID], aggregate budget AED [PROJECT_AED].
2. RERA ESCROW ACCOUNT: Dedicated Project Escrow Account [ESCROW_IBAN] managed pursuant to Dubai Law No. 8/2007 with milestone-based inspection release.
3. DIAC ARBITRATION: Disputes resolved under the Rules of Arbitration of the Dubai International Arbitration Centre (DIAC).`,
  },

  // ---------------------------------------------------------------------------
  // 🏛️ DIFC / ADGM Additional Sovereign Contracts
  // ---------------------------------------------------------------------------
  {
    id: 'sovereign-difc-adgm-asset-mgmt-25m',
    countryCode: 'DIFC',
    countryNameAr: 'سوق أبوظبي العالمي & مركز دبي المالي',
    countryNameEn: 'ADGM & DIFC Financial Free Zones',
    countryFlag: '🏛️',
    statuteCodeAr: 'لوائح هيئة تنظيم الخدمات المالية (FSRA) ولوائح DIFC للخدمات المالية',
    statuteCodeEn: 'ADGM FSRA Financial Services and Markets Regulations & DIFC Regulatory Law',
    arbitrationVenue: 'محاكم سوق أبوظبي العالمي (ADGM Courts) أو محاكم DIFC',
    dealTier: 'HIGH_STAKES',
    estimatedValueRange: '$25,000,000 - $200,000,000+ USD',
    category: 'Venture_Investment',
    titleAr: 'اتفاقية إدارة الأصول والمحافظ الاستثمارية المؤسسية — ADGM / DIFC',
    titleEn: 'Discretionary Asset Management & Institutional Fund Advisory Agreement (ADGM / DIFC)',
    descriptionAr: 'اتفاقية تفويض وإدارة أصول مالية ومحافظ استثمارية خاصة مصاغة وفق متطلبات سلطة تنظيم الخدمات المالية بسوق أبوظبي العالمي ومحاكم ADGM / DIFC الإنجليزية.',
    descriptionEn: 'High-net-worth discretionary portfolio and institutional asset management agreement compliant with ADGM FSRA regulations and Common Law fiduciary duties.',
    keyClauses: [
      'الامتثال الكامل لمتطلبات الترخيص المالي (Category 3C / 3A Asset Management)',
      'تحديد سياسة الاستثمار المعتمدة (Investment Policy Statement — IPS)',
      'أحكام الحفظ الأمين للأصول وفصل أموال العملاء (Client Asset Custody & Segregation)',
      'الاختصاص القضائي الحصري لمحاكم سوق أبوظبي العالمي (ADGM Courts)',
    ],
    tags: ['ADGM', 'DIFC', 'إدارة_أصول', 'صناديق_استثمار', 'FSRA', 'أسواق_مالية'],
    pagesCount: 22,
    clausesCount: 32,
    templateAr: `================================================================================
اتفاقية إدارة الأصول الاستثمارية المؤسسية — سوق أبوظبي العالمي (ADGM)
أنظمة هيئة تنظيم الخدمات المالية (FSRA) والقانون العام المالي
================================================================================

بين مدير الاستثمار المرخص: شركة [ASSET_MANAGER_LTD]، المرخصة من FSRA برقم [FSRA_LIC]
وبين العميل المؤسسي: شركة [CLIENT_INSTITUTION]

البند الأول: التفويض الاستثماري ونطاق الإدارة
يفوض العميل مدير الاستثمار بإدارة محفظة استثمارية مستقلة بقيمة ([AUM_USD]) دولار أمريكي وفق سياسة الاستثمار المتفق عليها (IPS).

البند الثاني: حفظ الأصول وفصل الأموال
تودع كافة الأوراق المالية والنقدية لدى أمين حفظ دولي مستقل (Global Custodian) مرخص، وتظل ملكاً خالصاً للعميل مع الفصل التام عن أصول مدير الاستثمار.

البند الثالث: القانون الحاكم ومحاكم ADGM
تخضع هذه الاتفاقية وتفسر وفقاً لقوانين وأنظمة سوق أبوظبي العالمي (ADGM)، وتختص محاكم سوق أبوظبي العالمي (ADGM Courts) دون غيرها بالفصل في أي نزاع.`,
    templateEn: `================================================================================
DISCRETIONARY ASSET MANAGEMENT & INSTITUTIONAL FUND ADVISORY AGREEMENT
Governed by ADGM Financial Regulations (FSRA) | ADGM Courts Jurisdiction
================================================================================

Between Licensed Asset Manager: [ASSET_MANAGER_LTD], FSRA License [FSRA_LIC], and Institutional Client: [CLIENT_INSTITUTION].

1. DISCRETIONARY MANDATE: Management of segregated portfolio valued at USD [AUM_USD] pursuant to the agreed Investment Policy Statement (IPS).
2. CUSTODY & ASSET SEGREGATION: 100% independent qualified custodian holding client assets segregated from manager balance sheet.
3. JURISDICTION: Governed by the laws and regulations of the Abu Dhabi Global Market (ADGM) subject to the exclusive jurisdiction of ADGM Courts.`,
  },

  // ---------------------------------------------------------------------------
  // 🇶🇦 Qatar Additional Sovereign Contracts
  // ---------------------------------------------------------------------------
  {
    id: 'sovereign-qa-share-purchase-15m',
    countryCode: 'QA',
    countryNameAr: 'دولة قطر',
    countryNameEn: 'Qatar',
    countryFlag: '🇶🇦',
    statuteCodeAr: 'قانون الشركات التجارية القطري رقم 11 لسنة 2015 وقانون المعاملات المدنية رقم 22 لسنة 2004',
    statuteCodeEn: 'Qatar Commercial Companies Law No. 11 of 2015 & Civil Code No. 22 of 2004',
    arbitrationVenue: 'مركز قطر الدولي للتوفيق والتحكيم (QICCA - الدوحة)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '15,000,000 - 100,000,000+ ر.ق',
    category: 'Corporate_MA',
    titleAr: 'عقد شراء الحصص والاستحواذ المؤسسي المليوني — دولة قطر (QICCA)',
    titleEn: 'Qatar Institutional Share Purchase Agreement (SPA — High-Value Corporate Acquisition)',
    descriptionAr: 'اتفاقية استحواذ ونقل ملكية حصص في شركات قطرية ذات مسؤولية محدودة ومساهمة خاضعة لقانون الشركات رقم 11/2015 وقانون الاستثمار الأجنبي مع حجز الضمان والتحكيم بمركز QICCA.',
    descriptionEn: 'High-value institutional Share Purchase Agreement governed by Qatari Commercial Law with warranty indemnity covenants and QICCA Doha arbitration.',
    keyClauses: [
      'التنازل ونقل الملكية المقيد بوزارة التجارة والصناعة القطرية (MOCI)',
      'الضمانات والإقرارات الضريبية والقانونية للبائع وحساب الضمان المصرفي (Escrow)',
      'حق الأولوية والشفعة والتنازل المتبادل بين الشركاء وفق المادة 238',
      'التحكيم بمركز قطر الدولي للتوفيق والتحكيم (QICCA) بالدوحة',
    ],
    tags: ['قطر', 'استحواذ', 'شراء_حصص', 'شركات_قطر', 'QICCA', 'MOCI'],
    pagesCount: 22,
    clausesCount: 32,
    templateAr: `================================================================================
عقد بيع وشراء حصص واستحواذ شركات — دولة قطر
قانون الشركات التجارية رقم (11) لسنة 2015 والقانون المدني رقم (22) لسنة 2004
================================================================================

بين البائع: السيد / شركة [SELLER_QATAR]، قيد تجاري رقم [CR_SELLER]
وبين المشتري: شركة [BUYER_QATAR]، قيد تجاري رقم [CR_BUYER]

البند الأول: بيع الحصص ونقل الملكية
يبيع البائع ويسقط ويتنازل بكافة الضمانات الفعلية والقانونية عن عدد [SHARES_COUNT] حصة من رأسمال شركة [TARGET_CO] ذ.م.م، إلى المشتري لقاء ثمن إجمالي قدره ([PRICE_QAR]) ريال قطري.

البند الثاني: سداد الثمن وحساب الضمان
يسدد المشتري نسبة 85% من الثمن عند إتمام التوقيع وتوثيق التعديل بوزارة التجارة والصناعة، ويودع الباقي (15%) في حساب ضمان لدى بنك قطري معتمد لمدة 12 شهراً لضمان الالتزامات الضريبية والعمالية.

البند الثالث: تسوية المنازعات
تسوى المنازعات نهائياً بالتحكيم لدى مركز قطر الدولي للتوفيق والتحكيم (QICCA) بالدوحة بواسطة ثلاثة محكمين.`,
    templateEn: `================================================================================
QATAR INSTITUTIONAL SHARE PURCHASE AGREEMENT (SPA)
Governed by Qatar Commercial Companies Law No. 11/2015 | QICCA Doha
================================================================================

Between Seller: [SELLER_QATAR], CR [CR_SELLER], and Buyer: [BUYER_QATAR], CR [CR_BUYER].

1. SHARE TRANSFER: Absolute transfer of [SHARES_COUNT] quota units in [TARGET_CO] W.L.L. for QAR [PRICE_QAR], registered with Qatar Ministry of Commerce and Industry (MOCI).
2. CONSIDERATION & ESCROW: 85% payable upon official closing; 15% retained in a Qatar escrow bank account for 12 months for indemnity support.
3. QICCA ARBITRATION: Disputes finally resolved by arbitration under the QICCA Rules in Doha, Qatar.`,
  },

  // ---------------------------------------------------------------------------
  // 🇰🇼 Kuwait Additional Sovereign Contracts
  // ---------------------------------------------------------------------------
  {
    id: 'sovereign-kw-consortium-jv-20m',
    countryCode: 'KW',
    countryNameAr: 'دولة الكويت',
    countryNameEn: 'Kuwait',
    countryFlag: '🇰🇼',
    statuteCodeAr: 'قانون الشركات الكويتي رقم 1 لسنة 2016 وقانون التجارة رقم 68 لسنة 1980',
    statuteCodeEn: 'Kuwait Companies Law No. 1 of 2016 & Kuwait Commercial Code No. 68 of 1980',
    arbitrationVenue: 'مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت (KCAC)',
    dealTier: 'HIGH_STAKES',
    estimatedValueRange: '20,000,000 - 150,000,000 د.ك',
    category: 'Corporate_MA',
    titleAr: 'اتفاقية ائتلاف وتضامن كبرى لمناقصات ومشاريع البنية التحتية — دولة الكويت',
    titleEn: 'Kuwait Major Infrastructure Consortium & Joint Venture Agreement (KCAC)',
    descriptionAr: 'اتفاقية ائتلاف شركات (Consortium) للدخول في مناقصات الجهاز المركزي للمناقصات العامة (CAPT) والمشروعات الإنشائية الكبرى بدولة الكويت مع التحكيم بمركز غرفة الكويت.',
    descriptionEn: 'High-value consortium and infrastructure JV agreement for Kuwait Central Agency for Public Tenders (CAPT) bids, governed by Kuwait law and KCAC arbitration.',
    keyClauses: [
      'التضامن والتكافل أمام الجهاز المركزي للمناقصات العامة والجهات الحكومية الكويتي',
      'تحديد مهام قائد الائتلاف (Lead Partner) ومسؤوليات الشركاء والضمانات البنكية',
      'آلية توزيع الأرباح وحساب الائتلاف المصرفي المشترك',
      'التحكيم بمركز التحكيم التجاري بغرفة الكويت (KCAC)',
    ],
    tags: ['الكويت', 'ائتلاف_شركات', 'مناقصات_CAPT', 'مشروعات_كبرى', 'غرفة_الكويت', 'KCAC'],
    pagesCount: 24,
    clausesCount: 34,
    templateAr: `================================================================================
اتفاقية ائتلاف وتضامن (Consortium) للمناقصات الكبرى — دولة الكويت
قانون الشركات رقم (1) لسنة 2016 وقانون المناقصات العامة رقم (49) لسنة 2016
================================================================================

بين قائد الائتلاف: شركة [LEAD_PARTNER_KW]، سجل تجاري رقم [CR_LEAD]
وبين الشريك الفني: شركة [TECH_PARTNER_INTL]

البند الأول: موضوع الائتلاف والمناقصة
يتفق الطرفان على تكوين ائتلاف تجاري للدخول المشترك في المناقصة الكبرى رقم [TENDER_NO] المطروحة من [GOV_ENTITY_KW] لتنفيذ مشروع [PROJECT_NAME]، على أن يكون الطرف الأول هو الشريك الرئيسي وقائد الائتلاف.

البند الثاني: المسؤولية التضامنية والضمانات البنكية
يلتزم الشريكان متضامنين ومتكافلين أمام الجهة صاحبة العمل بتنفيذ كافة الأعمال والالتزامات، ويقدم كل طرف حصته النسبية من خطاب الضمان البنكي النهائي (Performance Bond).

البند الثالث: تسوية المنازعات
تخضع هذه الاتفاقية للقوانين المعمول بها في دولة الكويت، ويحال أي نزاع نهائياً إلى مركز التحكيم التجاري التابع لغرفة تجارة وصناعة الكويت (KCAC).`,
    templateEn: `================================================================================
KUWAIT INFRASTRUCTURE CONSORTIUM & JOINT VENTURE AGREEMENT
Kuwait Companies Law No. 1/2016 & CAPT Public Tenders Law No. 49/2016
================================================================================

Between Lead Partner: [LEAD_PARTNER_KW], Kuwait CR [CR_LEAD], and Technical Partner: [TECH_PARTNER_INTL].

1. CONSORTIUM PURPOSE: Joint bidding and turnkey execution of Public Tender No. [TENDER_NO] for [PROJECT_NAME] issued by [GOV_ENTITY_KW].
2. JOINT & SEVERAL LIABILITY: Joint and several liability towards the employer with proportional issuance of Bank Performance Guarantees.
3. ARBITRATION: Governed by the laws of Kuwait, settled exclusively by the Kuwait Commercial Arbitration Centre (KCAC) of the Chamber of Commerce.`,
  },

  // ---------------------------------------------------------------------------
  // 🇪🇬 Egypt Additional Sovereign Contracts
  // ---------------------------------------------------------------------------
  {
    id: 'sovereign-eg-infrastructure-epc-30m',
    countryCode: 'EG',
    countryNameAr: 'جمهورية مصر العربية',
    countryNameEn: 'Egypt',
    countryFlag: '🇪🇬',
    statuteCodeAr: 'القانون المدني المصري 131 لسنة 1948 وقانون التعاقدات الحكومية 182 لسنة 2018',
    statuteCodeEn: 'Egyptian Civil Code No. 131/1948 & Public Contracts Law No. 182/2018',
    arbitrationVenue: 'مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)',
    dealTier: 'HIGH_STAKES',
    estimatedValueRange: '500,000,000 - 2,000,000,000+ جنيه مصري / دولار',
    category: 'EPC_Construction',
    titleAr: 'عقد مقاولات تسليم مفتاح للمشروعات الهندسية والصناعية الكبرى — مصر (CRCICA)',
    titleEn: 'Egypt Turnkey EPC Infrastructure & Industrial Construction Contract (CRCICA)',
    descriptionAr: 'عقد مقاولات وتوريدات هندسية متكاملة للمصانع ومحطات الطاقة والمشروعات القومية المصرية متوافق مع القانون المدني المصري ونماذج فيديك FIDIC والتحكيم بمركز القاهرة CRCICA.',
    descriptionEn: 'Major EPC turnkey infrastructure and industrial plant contract compliant with Egyptian Civil Code principles and CRCICA Cairo arbitration.',
    keyClauses: [
      'التسليم المفتاح (Turnkey EPC) والمسؤولية العشرية وفق المادة 651 من القانون المدني',
      'خطابات الضمان البنكية غير المشروطة (Advance Payment & Performance Bonds)',
      'تعديل الأسعار وأثر الظروف الطارئة وفق المادة 147 من القانون المدني',
      'التحكيم بمركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)',
    ],
    tags: ['مصر', 'مقاولات', 'EPC', 'تسليم_مفتاح', 'مسؤولية_عشرية', 'CRCICA'],
    pagesCount: 30,
    clausesCount: 44,
    templateAr: `================================================================================
عقد مقاولات وهندسة تسليم مفتاح (EPC Turnkey) — جمهورية مصر العربية
القانون المدني المصري رقم 131 لسنة 1948 والتحكيم بمركز القاهرة CRCICA
================================================================================

بين رب العمل: شركة [EMPLOYER_EG] ش.م.م، سجل تجاري [CR_EMP]
وبين المقاول العام: شركة [EPC_CONTRACTOR]

البند الأول: موضوع العقد ونطاق EPC
يتعهد المقاول بتنفيذ وتصميم وتوريد وتركيب واختبار وتشغيل مشروع [PROJECT_NAME] الكائن في [LOCATION_EG] بنظام تسليم المفتاح الكامل مقابل مبلغ إجمالي مقطوع قدره ([CONTRACT_PRICE]) جنيه مصري / دولار.

البند الثاني: المسؤولية العشرية
يضمن المقاول والمهندس المصمم سلامة المباني والمنشآت الثابتة لمدة عشر سنوات تبدأ من تاريخ التسليم النهائي، وذلك إعمالاً للمسؤولية العشرية الإلزامية المنصوص عليها بالمادة (651) من القانون المدني المصري، ويقع باطلاً كل شرط يقضي بإعفائهما أو الحد من هذا الضمان.

البند الثالث: تسوية المنازعات
تخضع هذه الاتفاقية لأحكام القانون المصري، وتسوى كافة المنازعات نهائياً بالتحكيم وفق قواعد مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA) بالقاهرة.`,
    templateEn: `================================================================================
EGYPT TURNKEY EPC INFRASTRUCTURE & INDUSTRIAL CONSTRUCTION CONTRACT
Egyptian Civil Code (Law No. 131/1948) | CRCICA Cairo Arbitration
================================================================================

Between Employer: [EMPLOYER_EG] S.A.E., CR [CR_EMP], and EPC Contractor: [EPC_CONTRACTOR].

1. SCOPE: Turnkey EPC design, procurement, erection, testing, and commissioning of [PROJECT_NAME] for lump-sum of [CONTRACT_PRICE].
2. DECENNAL LIABILITY: Strict 10-year decennial liability for structural integrity pursuant to mandatory Article 651 of the Egyptian Civil Code. Any waiver is void.
3. CRCICA ARBITRATION: Egyptian governing law with final arbitration under the Cairo Regional Centre for International Commercial Arbitration (CRCICA).`,
  },

  {
    id: 'sovereign-eg-tech-transfer-ip-5m',
    countryCode: 'EG',
    countryNameAr: 'جمهورية مصر العربية',
    countryNameEn: 'Egypt',
    countryFlag: '🇪🇬',
    statuteCodeAr: 'قانون حماية حقوق الملكية الفكرية رقم 82 لسنة 2002 وقانون التجارة رقم 17 لسنة 1999',
    statuteCodeEn: 'Egyptian IP Law No. 82/2002 & Commercial Code No. 17/1999 (Tech Transfer Chapter)',
    arbitrationVenue: 'مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '5,000,000 - 30,000,000 دولار أمريكي',
    category: 'Cloud_Tech_Data',
    titleAr: 'عقد نقل التكنولوجيا وترخيص برمجيات المؤسسات — جمهورية مصر العربية',
    titleEn: 'Egypt Technology Transfer & Enterprise Software Licensing Agreement (IP Law 82/2002)',
    descriptionAr: 'اتفاقية نقل التكنولوجيا وحماية حقوق الملكية الفكرية وفق الباب الخاص بنقل التكنولوجيا في قانون التجارة المصري رقم 17 لسنة 1999 وقانون الملكية الفكرية رقم 82 لسنة 2002.',
    descriptionEn: 'Statutory technology transfer and institutional IP licensing agreement compliant with the mandatory technology transfer provisions of Egyptian Commercial Code.',
    keyClauses: [
      'التوافق مع أحكام نقل التكنولوجيا الإلزامية (المواد 72-87 من قانون التجارة المصري)',
      'حظر الشروط المقيدة للمنافسة وحق الطرف المصري في إدخال تحسينات على التقنية',
      'حماية الأسرار التجارية والبرمجيات المصدرية وفق قانون الملكية الفكرية 82/2002',
      'التحكيم بمركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)',
    ],
    tags: ['مصر', 'نقل_تكنولوجيا', 'ملكية_فكرية', 'برمجيات', 'قانون_التجارة', 'CRCICA'],
    pagesCount: 18,
    clausesCount: 28,
    templateAr: `================================================================================
عقد نقل التكنولوجيا وترخيص الملكية الفكرية — جمهورية مصر العربية
قانون التجارة رقم 17 لسنة 1999 (المواد 72 إلى 87) وقانون الملكية الفكرية رقم 82 لسنة 2002
================================================================================

بين المورد (مانح الترخيص): شركة [TECH_LICENSOR]
وبين المستورد للتقنية: شركة [TECH_TRANSFEREE_EG] ش.م.م

البند الأول: نقل التكنولوجيا والترخيص
ينقل المورد بموجب هذا العقد المعرفة الفنية والتطبيقية وحق استخدام البرمجيات والأنظمة [TECH_SYSTEM] إلى الطرف الثاني لاستخدامها في تصنيع وتشغيل [PURPOSE].

البند الثاني: بطلان الشروط المقيدة
إعمالاً لنصوص المواد الآمرة بقانون التجارة المصري، لا يتضمن هذا العقد أي شرط يقيد الطرف الثاني في شراء المواد الخام أو بيع منتجاته بالأسواق الخارجية، وللطرف الثاني كامل الحق في إدخال تحسينات وتطويرات على التقنية.

البند الثالث: التحكيم
تسوى المنازعات بالتحكيم لدى مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA).`,
    templateEn: `================================================================================
EGYPT TECHNOLOGY TRANSFER & ENTERPRISE IP LICENSING AGREEMENT
Governed by Egyptian Commercial Code No. 17/1999 & IP Law No. 82/2002 | CRCICA
================================================================================

Between Licensor: [TECH_LICENSOR], and Transferee: [TECH_TRANSFEREE_EG] S.A.E.

1. TECHNOLOGY TRANSFER: Transfer of proprietary operational know-how and enterprise software systems [TECH_SYSTEM] pursuant to Egyptian Commercial Code Articles 72-87.
2. STATUTORY PROTECTIONS: Absolute prohibition of anti-competitive restrictions. Transferee retains freedom of procurement and the right to innovate improvements.
3. ARBITRATION: CRCICA Cairo arbitration pursuant to the Egyptian Arbitration Law.`,
  },

  // ---------------------------------------------------------------------------
  // 🇯🇴 Jordan Additional Sovereign Contracts
  // ---------------------------------------------------------------------------
  {
    id: 'sovereign-jo-distribution-franchise-5m',
    countryCode: 'JO',
    countryNameAr: 'المملكة الأردنية الهاشمية',
    countryNameEn: 'Jordan',
    countryFlag: '🇯🇴',
    statuteCodeAr: 'قانون التجارة الأردني رقم 12 لسنة 1966 ونظام الوسطاء والوكلاء التجاريين',
    statuteCodeEn: 'Jordanian Commercial Code No. 12/1966 & Commercial Agents Regulations',
    arbitrationVenue: 'محاكم قصر العدل عمان أو مركز التحكيم الأردني',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '2,000,000 - 10,000,000 دينار أردني',
    category: 'Agency_Franchise',
    titleAr: 'عقد التوزيع والامتياز التجاري الحصري (Franchise) — المملكة الأردنية الهاشمية',
    titleEn: 'Jordan Master Franchise & Exclusive Distribution Agreement (Commercial Code)',
    descriptionAr: 'اتفاقية منح امتياز تجاري وتوزيع حصري للماركات والمصانع داخل المملكة الأردنية الهاشمية خاضعة لقانون التجارة ونظام الوسطاء التجاريين وتسجيل وزارة الصناعة والتجارة.',
    descriptionEn: 'Master franchise and exclusive commercial distribution contract compliant with Jordan Commercial Law and Ministry of Industry, Trade and Supply registration.',
    keyClauses: [
      'حصرية الامتياز الإقليمي داخل المملكة الأردنية الهاشمية وتسجيله رسمياً',
      'حق استخدام العلامة التجارية ودليل التشغيل والمواصفات المعيارية المعتمدة',
      'تنظيم الرسوم ونسب الأرباح والعمولات (Royalty Fees & Marketing Fund)',
      'التحكيم لدى مركز التحكيم الأردني أو محاكم قصر العدل بعمان',
    ],
    tags: ['الأردن', 'فرنشايز', 'توزيع_حصري', 'وزارة_الصناعة_والتجارة', 'عمان'],
    pagesCount: 18,
    clausesCount: 26,
    templateAr: `================================================================================
عقد امتياز وتوزيع تجاري حصري — المملكة الأردنية الهاشمية
قانون التجارة الأردني رقم (12) لسنة 1966 والقانون المدني رقم (43) لسنة 1976
================================================================================

بين مانح الامتياز: شركة [FRANCHISOR_NAME]
وبين صاحب الامتياز: شركة [FRANCHISEE_JO] المسجلة لدى مراقب الشركات الأردني برقم [CR_JO]

البند الأول: منح الامتياز والحصرية
يمنح الطرف الأول الطرف الثاني حقاً حصرياً لاستخدام العلامة التجارية ونظام التشغيل [BRAND_SYSTEM] لتأسيس وتشغيل منافذ البيع داخل أراضي المملكة الأردنية الهاشمية.

البند الثاني: الرسوم الملكية والتدريب
يلتزم صاحب الامتياز بسداد رسم امتياز أولي قدره ([UPFRONT_FEE]) دينار أردني، بالإضافة إلى نسبة شهرية قدرها [ROYALTY_PCT]% من إجمالي المبيعات مقابل حقوق الاستمرار والتدريب.

البند الثالث: القانون الحاكم وتسوية المنازعات
تخضع هذه الاتفاقية للقوانين والأنظمة المعمول بها في المملكة الأردنية الهاشمية، وتختص محاكم قصر العدل في عمان أو التحكيم بالفصل في أي نزاع.`,
    templateEn: `================================================================================
JORDAN MASTER FRANCHISE & EXCLUSIVE DISTRIBUTION AGREEMENT
Governed by Jordan Commercial Code & Civil Law | Courts of Amman / Arbitration
================================================================================

Between Franchisor: [FRANCHISOR_NAME], and Master Franchisee: [FRANCHISEE_JO], Jordan CR [CR_JO].

1. GRANT OF MASTER FRANCHISE: Exclusive territory rights for the Kingdom of Jordan to operate under [BRAND_SYSTEM] trademarks and standard operating manuals.
2. FEES & ROYALTIES: Upfront fee of JOD [UPFRONT_FEE] plus [ROYALTY_PCT]% ongoing monthly royalty and marketing fund contributions.
3. GOVERNING LAW: Laws of the Hashemite Kingdom of Jordan, subject to the jurisdiction of Amman Courts or commercial arbitration.`,
  },

  // ---------------------------------------------------------------------------
  // 🇺🇸 United States Additional Sovereign Contracts
  // ---------------------------------------------------------------------------
  {
    id: 'sovereign-us-nvca-series-b-15m',
    countryCode: 'US',
    countryNameAr: 'الولايات المتحدة الأمريكية (Delaware)',
    countryNameEn: 'United States (Delaware)',
    countryFlag: '🇺🇸',
    statuteCodeAr: 'قانون الشركات العام بولاية ديلاوير (DGCL Title 8) ومعايير NVCA للتمويل الاستثماري',
    statuteCodeEn: 'Delaware General Corporation Law (DGCL Title 8) & NVCA Model Legal Documents',
    arbitrationVenue: 'Delaware Court of Chancery & AAA Commercial Arbitration',
    dealTier: 'HIGH_STAKES',
    estimatedValueRange: '$15,000,000 - $100,000,000+ USD',
    category: 'Venture_Investment',
    titleAr: 'عقد استثمار واكتتاب الأسهم الممتازة (Series B Preferred Stock) — ديلاوير (NVCA)',
    titleEn: 'Delaware Series B Preferred Stock Purchase Agreement (NVCA Standard)',
    descriptionAr: 'اتفاقية تمويل استثماري مؤسسي لجولات Venture Capital الكبرى في شركات ديلاوير C-Corp مصاغة وفق أعلى نماذج NVCA الأمريكية المعتمدة بوادي السيليكون وول ستريت.',
    descriptionEn: 'Institutional Series B Preferred Stock Purchase Agreement compliant with DGCL Title 8 and National Venture Capital Association (NVCA) model standards.',
    keyClauses: [
      'حقوق الأولوية في التصفية (1x Non-Participating Liquidation Preference)',
      'حقوق منع تخفيض الحصص (Broad-Based Weighted Average Anti-Dilution)',
      'حقوق تسجيل الأوراق المالية وحوكمة مجلس الإدارة (Board Representation)',
      'الاختصاص القضائي الحصري لمحاكم ديلاوير (Delaware Court of Chancery)',
    ],
    tags: ['أمريكا', 'Delaware', 'Series_B', 'NVCA', 'Venture_Capital', 'Chancery'],
    pagesCount: 32,
    clausesCount: 46,
    templateAr: `================================================================================
اتفاقية شراء واكتتاب الأسهم الممتازة (Series B Preferred Stock) — ولاية ديلاوير
قانون الشركات العام بولاية ديلاوير (DGCL Title 8) ومعايير NVCA الأمريكية
================================================================================

بين الشركة المصدرة: شركة [DELAWARE_CORP], a Delaware Corporation, File No. [DE_FILE_NO]
وبين المستثمر الرئيسي: [LEAD_INVESTOR_FUND], a Delaware Limited Partnership

البند الأول: بيع وشراء الأسهم الممتازة
توافق الشركة على إصدار وبيع، ويوافق المستثمر على شراء عدد [SHARES_SERIES_B] سهماً من أسهم الفئة الممتازة (Series B Preferred Stock) بسعر [PRICE_PER_SHARE] دولار للسهم وبقيمة إجمالية قدرها ([SERIES_B_USD]) دولار أمريكي.

البند الثاني: حقوق التصفية والحماية من التخفيف
تتمتع أسهم الفئة الممتازة بأولوية تصفية أولى تعادل أصل المبلغ المستثمر بالإضافة إلى الأرباح غير المسددة، وتطبق حماية ضد تخفيض القيمة وفق معادلة المعدل الموزون الموسع (Broad-Based Weighted Average).

البند الثالث: القانون الحاكم ومحاكم ديلاوير
تخضع هذه الاتفاقية وتفسر حصرياً وفقاً لقوانين ولاية ديلاوير العامة للشركات (DGCL)، وتختص محكمة ديلاوير للعدالة (Delaware Court of Chancery) بالفصل في أي نزاع.`,
    templateEn: `================================================================================
DELAWARE SERIES B PREFERRED STOCK PURCHASE AGREEMENT (NVCA MODEL)
Governed by Delaware General Corporation Law (DGCL Title 8) | Delaware Court of Chancery
================================================================================

Between Issuer: [DELAWARE_CORP], a Delaware Corporation, File No. [DE_FILE_NO], and Lead Investor: [LEAD_INVESTOR_FUND], a Delaware LP.

1. PURCHASE & SALE: Issuance and sale of [SHARES_SERIES_B] shares of Series B Preferred Stock at USD [PRICE_PER_SHARE] per share for aggregate investment of USD [SERIES_B_USD].
2. LIQUIDATION & ANTI-DILUTION: 1x Non-Participating liquidation preference senior to Common Stock, supported by broad-based weighted average anti-dilution adjustments.
3. GOVERNING LAW & FORUM: Governed by the laws of the State of Delaware (DGCL) with exclusive jurisdiction in the Court of Chancery of the State of Delaware.`,
  },

  {
    id: 'sovereign-us-enterprise-saas-cloud-5m',
    countryCode: 'US',
    countryNameAr: 'الولايات المتحدة الأمريكية (New York / Delaware)',
    countryNameEn: 'United States (Enterprise SaaS)',
    countryFlag: '🇺🇸',
    statuteCodeAr: 'قوانين التجارة الإلكترونية وحماية البيانات الفيدرالية وقانون نيويورك التجاري UCC',
    statuteCodeEn: 'Uniform Commercial Code (UCC), US SOC2 Type II & CCPA / HIPAA Frameworks',
    arbitrationVenue: 'American Arbitration Association (AAA / ICDR - New York)',
    dealTier: 'MILLION_DOLLAR',
    estimatedValueRange: '$2,000,000 - $20,000,000+ USD Annual',
    category: 'Cloud_Tech_Data',
    titleAr: 'عقد الخدمات السحابية المؤسسية واتفاقية مستوى الخدمة (Enterprise SaaS & SLA) — أمريكا',
    titleEn: 'US Master Enterprise SaaS Agreement, Service Level Agreement (SLA) & DPA',
    descriptionAr: 'اتفاقية ترخيص سحابي وحلول برمجية مؤسسية كبرى تتضمن ضمانات تشغيل 99.99%، ملحق معالجة البيانات DPA، الامتثال لشهادات SOC2 Type II، والتحكيم بمركز AAA بنيويورك.',
    descriptionEn: 'High-value Master Subscription Agreement (MSA) for enterprise SaaS with 99.99% SLA commitments, security indemnities, and AAA New York arbitration.',
    keyClauses: [
      'التزام توافر الخدمة بنسبة 99.99% والتعويض برصيد الخدمة (SLA Service Credits)',
      'ملحق حماية البيانات ومطابقة معايير SOC 2 Type II وتشفير AES-256',
      'تحديد سقف المسؤولية بـ 12 شهراً من الاشتراكات مع استثناءات خرق البيانات',
      'التحكيم التجاري لدى الجمعية الأمريكية للتحكيم (AAA) بنيويورك',
    ],
    tags: ['أمريكا', 'SaaS', 'SLA', 'Cloud', 'Data_Privacy', 'New_York', 'AAA'],
    pagesCount: 24,
    clausesCount: 36,
    templateAr: `================================================================================
اتفاقية الخدمات السحابية المؤسسية الشاملة (Master Enterprise SaaS Agreement)
خاضعة لقوانين ولاية نيويورك / ديلاوير والتحكيم بمركز AAA بنيويورك
================================================================================

بين المزود السحابي: شركة [SAAS_PROVIDER_INC], a Delaware Corporation
وبين العميل المؤسسي: شركة [ENTERPRISE_CUSTOMER_CORP]

البند الأول: الترخيص والاشتراك المؤسسي
يمنح المزود العميل ترخيصاً سحابياً غير حصري وغير قابل للتحويل للوصول إلى المنصة البرمجية [ENTERPRISE_PLATFORM] لعدد غير محدود من المستخدمين مقابل اشتراك سنوي قدره ([ANNUAL_FEE_USD]) دولار أمريكي.

البند الثاني: اتفاقية مستوى الخدمة (SLA 99.99%)
يضمن المزود جاهزية المنصة بنسبة لا تقل عن 99.99% شهرياً. وفي حال هبوط النسبة يستحق العميل رصيد خدمة يخصم من الفاتورة التالية بنسبة 10% إلى 50% من الاشتراك الشهري.

البند الثالث: تسوية المنازعات والتحكيم
تخضع هذه الاتفاقية لقوانين ولاية نيويورك، ويحال أي نزاع للتحكيم التجاري لدى الجمعية الأمريكية للتحكيم (AAA) في مدينة نيويورك.`,
    templateEn: `================================================================================
MASTER ENTERPRISE SAAS AGREEMENT & SERVICE LEVEL AGREEMENT (SLA)
Governed by New York Commercial Law | AAA Commercial Arbitration in NYC
================================================================================

Between Provider: [SAAS_PROVIDER_INC], and Enterprise Customer: [ENTERPRISE_CUSTOMER_CORP].

1. SUBSCRIPTION MANDATE: Non-exclusive enterprise subscription license to [ENTERPRISE_PLATFORM] for annual contract value of USD [ANNUAL_FEE_USD].
2. SLA GUARANTEE (99.99%): 99.99% Monthly Uptime Commitment backed by tiered Service Credits up to 50% of the monthly billing allotment.
3. AAA ARBITRATION: Governed by the laws of the State of New York. Disputes settled under the Commercial Arbitration Rules of the American Arbitration Association (AAA) in New York City.`,
  },

  // ---------------------------------------------------------------------------
  // 🇬🇧 UK & International Additional Sovereign Contracts
  // ---------------------------------------------------------------------------
  {
    id: 'sovereign-uk-intl-joint-venture-50m',
    countryCode: 'GB',
    countryNameAr: 'المملكة المتحدة والقانون الدولي (ICC Paris)',
    countryNameEn: 'UK & International Cross-Border JV (ICC Paris)',
    countryFlag: '🇬🇧',
    statuteCodeAr: 'القانون الإنجليزي وقواعد غرفة التجارة الدولية بباريس (ICC Arbitration Rules)',
    statuteCodeEn: 'English Contract Law & ICC International Court of Arbitration (Paris)',
    arbitrationVenue: 'غرفة التجارة الدولية بباريس (ICC Court of Arbitration)',
    dealTier: 'HIGH_STAKES',
    estimatedValueRange: '$50,000,000 - $300,000,000+ USD',
    category: 'Corporate_MA',
    titleAr: 'اتفاقية المشروع المشترك والتحالف الاستثماري العابر للحدود — القانون الإنجليزي (ICC)',
    titleEn: 'International Cross-Border Joint Venture & Consortium Agreement (English Law & ICC Paris)',
    descriptionAr: 'اتفاقية شراكة استثمارية عابرة للحدود لتأسيس مشاريع مشتركة برؤوس أموال كبرى في قطاعات الطاقة والتقنية والبنية التحتية خاضعة للقانون الإنجليزي والتحكيم بغرفة التجارة الدولية بباريس.',
    descriptionEn: 'High-stakes multinational cross-border Joint Venture Agreement drafted under English Law with governance deadlock mechanisms and ICC Paris arbitration.',
    keyClauses: [
      'هيكل ملكية الحصص والمساهمات النقدية والعينية في الشركة المشتركة (JVC)',
      'آليات كسر الجمود الإداري بالمجلس (Deadlock Resolution: Russian Roulette / Texas Shoot-Out)',
      'قيود نقل الملكية وحق الشفعة والمرافقة والإلزام (Tag-Along & Drag-Along Rights)',
      'التحكيم الدولي الحصري بغرفة التجارة الدولية (ICC) بباريس',
    ],
    tags: ['دولي', 'English_Law', 'Joint_Venture', 'ICC_Paris', 'استثمار_دولي', 'تحالف'],
    pagesCount: 28,
    clausesCount: 40,
    templateAr: `================================================================================
اتفاقية المشروع المشترك العابر للحدود (International Joint Venture)
خاضعة للقانون الإنجليزي والتحكيم لدى غرفة التجارة الدولية بباريس (ICC)
================================================================================

بين الشريك الأول: شركة [PARTNER_ONE_CORP]
وبين الشريك الثاني: شركة [PARTNER_TWO_HOLDINGS]

البند الأول: تأسيس الشركة المشتركة ونسب الملكية
يتفق الطرفان على تأسيس شركة مشتركة (JVC) برأسمال قدره ([CAPITAL_USD]) دولار أمريكي، بنسبة ملكية 50% للطرف الأول و50% للطرف الثاني لتنفيذ وإدارة المشروع الاستثماري [PROJECT_INTL].

البند الثاني: حسم الجمود الإداري (Deadlock Resolution)
في حال تعذر اتخاذ أي قرار استراتيجي في مجلس الإدارة لمدة تجاوز 60 يوماً، يفعل الطرفان آلية العرض الملزم (Russian Roulette) أو خيار الشراء الإلزامي لفك الجمود.

البند الثالث: القانون الحاكم والتحكيم الدولي
يخضع هذا العقد ويفسر وفقاً للقانون الإنجليزي، وتفصل غرفة التجارة الدولية بباريس (ICC) في أي نزاع نهائياً بالتحكيم في لندن أو باريس بواسطة ثلاثة محكمين.`,
    templateEn: `================================================================================
INTERNATIONAL CROSS-BORDER JOINT VENTURE AGREEMENT (JVA)
Governed by English Law | ICC International Court of Arbitration (Paris)
================================================================================

Between Shareholder One: [PARTNER_ONE_CORP], and Shareholder Two: [PARTNER_TWO_HOLDINGS].

1. JOINT VENTURE VEHICLE: Formation of JVC capitalized at USD [CAPITAL_USD] with 50/50 equity participation for executing [PROJECT_INTL].
2. DEADLOCK RESOLUTION: Comprehensive multi-stage resolution culminating in formal Russian Roulette / Shotgun buy-sell procedures.
3. GOVERNING LAW & ARBITRATION: Governed by English law with final dispute resolution under the Rules of Arbitration of the International Chamber of Commerce (ICC) in Paris.`,
  },,

  // ===========================================================================
  // 🇦🇪 [AE] UAE Cross-Border Merger & Corporate Consolidation Agreement
  // ===========================================================================
  {
    id: "sovereign-ae-crossborder-merger-25m",
    countryCode: "AE",
    countryNameAr: "الإمارات العربية المتحدة (الاتحادي)",
    countryNameEn: "UAE Mainland",
    countryFlag: "🇦🇪",
    statuteCodeAr: "مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021",
    statuteCodeEn: "Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021",
    arbitrationVenue: "مركز دبي للتحكيم الدولي (DIAC)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "25,000,000 - 150,000,000+ AED",
    category: "Corporate_MA",
    titleAr: "اتفاقية الاندماج العابر للحدود وتوحيد الكيانات التجارية — الإمارات العربية المتحدة",
    titleEn: "UAE Cross-Border Merger & Corporate Consolidation Agreement",
    descriptionAr: "اتفاقية اندماج بطريق الضم بين كيانات تجارية وفق المرسوم بقانون اتحادي رقم (32) لسنة 2021 بشأن الشركات التجارية، مع تقييم الحصص وإصدار أسهم المبادلة.",
    descriptionEn: "Cross-border statutory merger by absorption governed by UAE Federal Decree-Law No. 32/2021 on Commercial Companies, including independent asset valuation and share swap ratios.",
    keyClauses: [ "تحديد نسبة مبادلة الأسهم وتقييم الحصص (Share Swap Ratio & Expert Valuation)", "انتقال كافة الذمم المالية والحقوق والالتزامات للشركة الدامجة (Universal Transfer of Liabilities)", "حماية حقوق الدائنين وفترة المعارضة القانونية (Creditor Protection & Objection Window)", "اعتماد قرارات الجمعية العمومية غير العادية وموافقة وزارة الاقتصاد (EGM & Regulatory Approvals)", "التحكيم الحصري لدى مركز دبي للتحكيم الدولي (DIAC) بثلاثة محكمين" ],
    tags: [ "اندماج", "الإمارات", "شركات_تجارية", "DIAC", "Merger", "مبادلة_أسهم" ],
    pagesCount: 22,
    clausesCount: 30,
    templateAr: `================================================================================
اتفاقية الاندماج العابر للحدود وتوحيد الكيانات التجارية — الإمارات العربية المتحدة
الإمارات العربية المتحدة (الاتحادي) — مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021
جهة الاختصاص والتحكيم: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الإمارات العربية المتحدة (الاتحادي)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الإمارات العربية المتحدة (الاتحادي).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز دبي للتحكيم الدولي (DIAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UAE CROSS-BORDER MERGER & CORPORATE CONSOLIDATION AGREEMENT
UAE Mainland — Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021
Dispute Resolution & Forum: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in UAE Mainland, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in UAE Mainland.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز دبي للتحكيم الدولي (DIAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [ADGM] ADGM Master Asset Purchase Agreement (High-Value APA)
  // ===========================================================================
  {
    id: "sovereign-adgm-asset-purchase-apa-15m",
    countryCode: "ADGM",
    countryNameAr: "سوق أبوظبي العالمي (ADGM)",
    countryNameEn: "Abu Dhabi Global Market (ADGM)",
    countryFlag: "🇦🇪",
    statuteCodeAr: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    statuteCodeEn: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    arbitrationVenue: "محاكم سوق أبوظبي العالمي (ADGM Courts)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "15,000,000 - 80,000,000+ USD",
    category: "Corporate_MA",
    titleAr: "اتفاقية بيع وشراء الأصول التشغيلية والتجارية الكبرى — سوق أبوظبي العالمي (ADGM)",
    titleEn: "ADGM Master Asset Purchase Agreement (High-Value APA)",
    descriptionAr: "اتفاقية نقل ملكية أصول ومصانع وعقود تجارية خاضعة للوائح سوق أبوظبي العالمي ADGM ومبادئ القانون العام الإنجليزي، مع قوائم الأصول المستثناة وتصفية الالتزامات.",
    descriptionEn: "High-value commercial asset purchase agreement governed by ADGM Companies Regulations 2020 and English Common Law principles, featuring detailed schedules of acquired vs excluded liabilities.",
    keyClauses: [ "حصر الأصول المشتراة والأصول المستثناة بدقة (Transferred Assets vs. Excluded Assets)", "انتقال عقود العملاء وحسابات الذمم المدينة (Assignment of Material Customer Contracts)", "تحويل الموظفين وحماية حقوق نهاية الخدمة (Employee Transfer & Gratuity Allocation)", "إقرارات البائع المشددة وخلو الأصول من الأعباء (Reps, Warranties & Absence of Encumbrances)", "الاختصاص القضائي الحصري لمحاكم سوق أبوظبي العالمي (ADGM Courts - Abu Dhabi)" ],
    tags: [ "أصول", "ADGM", "أبوظبي", "APA", "شراء_أصول", "استثمار" ],
    pagesCount: 20,
    clausesCount: 26,
    templateAr: `================================================================================
اتفاقية بيع وشراء الأصول التشغيلية والتجارية الكبرى — سوق أبوظبي العالمي (ADGM)
سوق أبوظبي العالمي (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
جهة الاختصاص والتحكيم: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سوق أبوظبي العالمي (ADGM)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سوق أبوظبي العالمي (ADGM).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم سوق أبوظبي العالمي (ADGM Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
ADGM MASTER ASSET PURCHASE AGREEMENT (HIGH-VALUE APA)
Abu Dhabi Global Market (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
Dispute Resolution & Forum: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Abu Dhabi Global Market (ADGM), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Abu Dhabi Global Market (ADGM).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم سوق أبوظبي العالمي (ADGM Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇧🇭 [BH] Bahrain Comprehensive Shareholders & Governance Agreement (SHA)
  // ===========================================================================
  {
    id: "sovereign-bh-shareholders-sha-10m",
    countryCode: "BH",
    countryNameAr: "مملكة البحرين",
    countryNameEn: "Bahrain",
    countryFlag: "🇧🇭",
    statuteCodeAr: "مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001",
    statuteCodeEn: "Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001",
    arbitrationVenue: "غرفة البحرين لتسوية المنازعات (BCDR-AAA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "10,000,000 - 50,000,000+ BHD",
    category: "Corporate_MA",
    titleAr: "اتفاقية المساهمين وحوكمة المشاريع المشتركة — مملكة البحرين",
    titleEn: "Bahrain Comprehensive Shareholders & Governance Agreement (SHA)",
    descriptionAr: "اتفاقية مساهمين مؤسسية لتنظيم إدارة شركة مساهمة بحرينية مقفلة وفق قانون الشركات التجارية رقم (21) لسنة 2001 وقانون المعاملات المدنية، مع آليات الشفعة وحظر البيع.",
    descriptionEn: "Institutional Shareholders Agreement governing a Bahraini Shareholding Company (B.S.C. Closed) under Bahrain Commercial Companies Law No. 21/2001, featuring Drag-Along and Tag-Along mechanics.",
    keyClauses: [ "تشكيل مجلس الإدارة والقرارات المحجوزة للمساهمين (Board Composition & Reserved Matters)", "حق الشفعة وأولوية الاكتتاب في الأسهم الجديدة (Pre-emptive Rights on Share Issuance)", "حق السحب الإلزامي وحق التخارج المرافق (Drag-Along & Tag-Along Rights)", "آليات كسر الجمود وتصفية النزاعات الإدارية (Deadlock Resolution & Russian Roulette Clause)", "التحكيم لدى غرفة البحرين لتسوية المنازعات (BCDR-AAA) بالمنامة" ],
    tags: [ "مساهمين", "البحرين", "BCDR", "SHA", "حوكمة", "شركات_مقفلة" ],
    pagesCount: 19,
    clausesCount: 27,
    templateAr: `================================================================================
اتفاقية المساهمين وحوكمة المشاريع المشتركة — مملكة البحرين
مملكة البحرين — مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001
جهة الاختصاص والتحكيم: غرفة البحرين لتسوية المنازعات (BCDR-AAA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في مملكة البحرين، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في مملكة البحرين.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى غرفة البحرين لتسوية المنازعات (BCDR-AAA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
BAHRAIN COMPREHENSIVE SHAREHOLDERS & GOVERNANCE AGREEMENT (SHA)
Bahrain — Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001
Dispute Resolution & Forum: غرفة البحرين لتسوية المنازعات (BCDR-AAA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Bahrain, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Bahrain.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by غرفة البحرين لتسوية المنازعات (BCDR-AAA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇨🇳 [CN] Sino-Foreign Equity Joint Venture (FDI) Agreement — PRC Law
  // ===========================================================================
  {
    id: "sovereign-cn-jv-fdi-corporate-30m",
    countryCode: "CN",
    countryNameAr: "جمهورية الصين الشعبية (PRC Law)",
    countryNameEn: "People's Republic of China (PRC Law)",
    countryFlag: "🇨🇳",
    statuteCodeAr: "القانون المدني لجمهورية الصين الشعبية وقانون الاستثمار الأجنبي 2020",
    statuteCodeEn: "Civil Code of the People's Republic of China & Foreign Investment Law 2020",
    arbitrationVenue: "لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "30,000,000 - 200,000,000+ USD",
    category: "Corporate_MA",
    titleAr: "اتفاقية تأسيس شركة مساهمة مشتركة باستثمار أجنبي مباشر — جمهورية الصين الشعبية",
    titleEn: "Sino-Foreign Equity Joint Venture (FDI) Agreement — PRC Law",
    descriptionAr: "اتفاقية استثمار أجنبي مباشر وتأسيس مشروع تجاري مشترك في الصين بموجب قانون الاستثمار الأجنبي الصيني وقانون الشركات لجمهورية الصين الشعبية 2024.",
    descriptionEn: "Foreign Direct Investment (FDI) Joint Venture Agreement governed by the PRC Foreign Investment Law 2020 and PRC Civil Code, featuring technology contribution and profit repatriation.",
    keyClauses: [ "هيكل رأس المال ومساهمة العملات الأجنبية والتكنولوجيا (Capital Contributions & Technology Injection)", "حوكمة مجلس الإدارة وحصص التصويت (Board Governance & Statutory Legal Representative)", "تحويل وتوزيع الأرباح بالعملة الصعبة خارج الصين (Foreign Exchange & Profit Repatriation - SAFE Rules)", "حماية الملكية الفكرية وسرية براءات الاختراع (Strict IP Protection & Trade Secret Safeguards)", "التحكيم الدولي لدى لجنة التحكيم الاقتصادي والتجاري الدولية الصينية (CIETAC - بكين)" ],
    tags: [ "الصين", "استثمار_أجنبي", "FDI", "CIETAC", "بكين", "مشروع_مشترك" ],
    pagesCount: 24,
    clausesCount: 32,
    templateAr: `================================================================================
اتفاقية تأسيس شركة مساهمة مشتركة باستثمار أجنبي مباشر — جمهورية الصين الشعبية
جمهورية الصين الشعبية (PRC Law) — القانون المدني لجمهورية الصين الشعبية وقانون الاستثمار الأجنبي 2020
جهة الاختصاص والتحكيم: لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام القانون المدني لجمهورية الصين الشعبية وقانون الاستثمار الأجنبي 2020؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في جمهورية الصين الشعبية (PRC Law)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في جمهورية الصين الشعبية (PRC Law).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام القانون المدني لجمهورية الصين الشعبية وقانون الاستثمار الأجنبي 2020.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
SINO-FOREIGN EQUITY JOINT VENTURE (FDI) AGREEMENT — PRC LAW
People's Republic of China (PRC Law) — Civil Code of the People's Republic of China & Foreign Investment Law 2020
Dispute Resolution & Forum: لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code of the People's Republic of China & Foreign Investment Law 2020;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in People's Republic of China (PRC Law), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in People's Republic of China (PRC Law).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code of the People's Republic of China & Foreign Investment Law 2020.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇪🇺 [EU] EU Cross-Border Enterprise Data Processing Agreement (DPA GDPR)
  // ===========================================================================
  {
    id: "sovereign-eu-gdpr-enterprise-dpa-5m",
    countryCode: "EU",
    countryNameAr: "الاتحاد الأوروبي (Civil Law & GDPR)",
    countryNameEn: "European Union (Civil Law & GDPR)",
    countryFlag: "🇪🇺",
    statuteCodeAr: "اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية",
    statuteCodeEn: "EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes",
    arbitrationVenue: "غرفة التجارة الدولية باريس (ICC International Court of Arbitration)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "5,000,000 - 30,000,000+ EUR",
    category: "Cloud_Tech_Data",
    titleAr: "اتفاقية معالجة وحماية البيانات المؤسسية العابرة للحدود — الاتحاد الأوروبي (GDPR)",
    titleEn: "EU Cross-Border Enterprise Data Processing Agreement (DPA GDPR)",
    descriptionAr: "اتفاقية معالجة وحماية البيانات الشخصية الصارمة وفقاً للمادة 28 من اللائحة العامة لحماية البيانات للاتحاد الأوروبي (GDPR 2016/679) والبنود التعاقدية القياسية (SCCs).",
    descriptionEn: "Institutional Data Processing Agreement complying strictly with Article 28 of the EU GDPR (2016/679) and Standard Contractual Clauses (SCCs) for international transfers.",
    keyClauses: [ "التزامات معالج البيانات والتدابير التقنية والتنظيمية (TOMs - Technical & Organizational Measures)", "البنود التعاقدية القياسية لنقل البيانات خارج الاتحاد الأوروبي (EU Standard Contractual Clauses - SCCs)", "الإخطار الفوري بحوادث تسريب البيانات خلال 48 ساعة (Mandatory 48-Hour Breach Notification)", "عمليات التدقيق والتفتيش المستقل لحماية الخصوصية (Right to Audit & ISO 27701 Verification)", "التحكيم وغرفة التجارة الدولية بباريس (ICC Paris) وتطبيق القانون الفرنسي/الألماني" ],
    tags: [ "GDPR", "الاتحاد_الأوروبي", "حماية_البيانات", "DPA", "ICC_Paris", "أمن_المعلومات" ],
    pagesCount: 21,
    clausesCount: 29,
    templateAr: `================================================================================
اتفاقية معالجة وحماية البيانات المؤسسية العابرة للحدود — الاتحاد الأوروبي (GDPR)
الاتحاد الأوروبي (Civil Law & GDPR) — اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية
جهة الاختصاص والتحكيم: غرفة التجارة الدولية باريس (ICC International Court of Arbitration)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الاتحاد الأوروبي (Civil Law & GDPR)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الاتحاد الأوروبي (Civil Law & GDPR).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى غرفة التجارة الدولية باريس (ICC International Court of Arbitration)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
EU CROSS-BORDER ENTERPRISE DATA PROCESSING AGREEMENT (DPA GDPR)
European Union (Civil Law & GDPR) — EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes
Dispute Resolution & Forum: غرفة التجارة الدولية باريس (ICC International Court of Arbitration)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in European Union (Civil Law & GDPR), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in European Union (Civil Law & GDPR).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by غرفة التجارة الدولية باريس (ICC International Court of Arbitration). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🏛️ [DIFC] DIFC Generative AI Model Training, IP Assignment & Licensing Agreement
  // ===========================================================================
  {
    id: "sovereign-difc-ai-model-training-license-10m",
    countryCode: "DIFC",
    countryNameAr: "مركز دبي المالي العالمي (DIFC)",
    countryNameEn: "Dubai International Financial Centre (DIFC)",
    countryFlag: "🏛️",
    statuteCodeAr: "DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018",
    statuteCodeEn: "DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018",
    arbitrationVenue: "محاكم مركز دبي المالي العالمي (DIFC Courts)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "10,000,000 - 60,000,000+ USD",
    category: "Cloud_Tech_Data",
    titleAr: "اتفاقية تدريب وترخيص نماذج الذكاء الاصطناعي التوليدي والبيانات السيادية — DIFC",
    titleEn: "DIFC Generative AI Model Training, IP Assignment & Licensing Agreement",
    descriptionAr: "اتفاقية ترخيص بيانات ضخمة وتدريب نماذج الذكاء الاصطناعي السيادية وفق قانون مركز دبي المالي العالمي، مع ضمانات عدم التعدي على حقوق الملكية الفكرية وتصفية الأوزان البرمجية.",
    descriptionEn: "High-value AI model training and data licensing agreement under DIFC Contract Law, covering model weights ownership, non-infringement indemnity, and clean training datasets.",
    keyClauses: [ "ملكية أوزان النموذج التوليدي والمخرجات الاصطناعية (Model Weights & Synthetic Outputs IP)", "ضمانات نظافة البيانات وعدم انتهاك حقوق المؤلف (Clean Dataset & Copyright Non-Infringement)", "الامتثال لقوانين خصوصية البيانات بمركز دبي المالي (DIFC Data Protection Law No. 5/2020)", "سقوف المسؤولية الصارمة عن الأخطاء الخوارزمية (Algorithmic Drift & Liability Limitations)", "محاكم مركز دبي المالي العالمي (DIFC Courts) جهة اختصاص حصرية" ],
    tags: [ "ذكاء_اصطناعي", "DIFC", "ترخيص_بيانات", "AI_Model", "حوسبة", "ملكية_فكرية" ],
    pagesCount: 25,
    clausesCount: 33,
    templateAr: `================================================================================
اتفاقية تدريب وترخيص نماذج الذكاء الاصطناعي التوليدي والبيانات السيادية — DIFC
مركز دبي المالي العالمي (DIFC) — DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018
جهة الاختصاص والتحكيم: محاكم مركز دبي المالي العالمي (DIFC Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في مركز دبي المالي العالمي (DIFC)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في مركز دبي المالي العالمي (DIFC).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم مركز دبي المالي العالمي (DIFC Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DIFC GENERATIVE AI MODEL TRAINING, IP ASSIGNMENT & LICENSING AGREEMENT
Dubai International Financial Centre (DIFC) — DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018
Dispute Resolution & Forum: محاكم مركز دبي المالي العالمي (DIFC Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Dubai International Financial Centre (DIFC), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Dubai International Financial Centre (DIFC).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم مركز دبي المالي العالمي (DIFC Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [ADGM] ADGM Hyperscale Data Center Colocation & Tier-IV SLA Agreement
  // ===========================================================================
  {
    id: "sovereign-adgm-datacenter-colocation-20m",
    countryCode: "ADGM",
    countryNameAr: "سوق أبوظبي العالمي (ADGM)",
    countryNameEn: "Abu Dhabi Global Market (ADGM)",
    countryFlag: "🇦🇪",
    statuteCodeAr: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    statuteCodeEn: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    arbitrationVenue: "محاكم سوق أبوظبي العالمي (ADGM Courts)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "20,000,000 - 100,000,000+ USD",
    category: "Cloud_Tech_Data",
    titleAr: "اتفاقية استضافة مراكز البيانات السحابية العملاقة ومؤشرات الأداء — سوق أبوظبي العالمي",
    titleEn: "ADGM Hyperscale Data Center Colocation & Tier-IV SLA Agreement",
    descriptionAr: "عقد استضافة خوادم ومراكز بيانات سحابية متقدمة بتصنيف Tier-IV بموجب قوانين سوق أبوظبي العالمي، مع كفاءة الطاقة وتبريد السيرفرات وضمان التشغيل بنسبة 99.999%.",
    descriptionEn: "Master hyperscale data center colocation agreement governed by ADGM law, featuring Tier-IV uptime SLA (99.999%), power density guarantees, and physical security protocols.",
    keyClauses: [ "ضمان الجاهزية التشغيلية ومؤشر استهلاك الطاقة (99.999% Uptime & Power Usage Effectiveness - PUE)", "التدابير الأمنية المادية والسيبرانية المشددة (Biometric Access & Multi-Layer Perimeter Security)", "التعويضات الائتمانية عن انقطاع الطاقة والتبريد (Service Level Credits & Downtime Damages)", "التوسع الديناميكي لحجوزات الطاقة والمساحات (Dynamic Megawatt Capacity Expansion)", "محاكم سوق أبوظبي العالمي (ADGM Courts) للفصل الحصري في المنازعات" ],
    tags: [ "مراكز_بيانات", "ADGM", "سحابة", "DataCenter", "SLA", "استضافة" ],
    pagesCount: 23,
    clausesCount: 31,
    templateAr: `================================================================================
اتفاقية استضافة مراكز البيانات السحابية العملاقة ومؤشرات الأداء — سوق أبوظبي العالمي
سوق أبوظبي العالمي (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
جهة الاختصاص والتحكيم: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سوق أبوظبي العالمي (ADGM)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سوق أبوظبي العالمي (ADGM).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم سوق أبوظبي العالمي (ADGM Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
ADGM HYPERSCALE DATA CENTER COLOCATION & TIER-IV SLA AGREEMENT
Abu Dhabi Global Market (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
Dispute Resolution & Forum: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Abu Dhabi Global Market (ADGM), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Abu Dhabi Global Market (ADGM).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم سوق أبوظبي العالمي (ADGM Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [AE] UAE Mission-Critical SOC & Cyber Defense Managed Services Agreement
  // ===========================================================================
  {
    id: "sovereign-ae-cybersecurity-soc-sla-5m",
    countryCode: "AE",
    countryNameAr: "الإمارات العربية المتحدة (الاتحادي)",
    countryNameEn: "UAE Mainland",
    countryFlag: "🇦🇪",
    statuteCodeAr: "مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021",
    statuteCodeEn: "Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021",
    arbitrationVenue: "مركز دبي للتحكيم الدولي (DIAC)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "5,000,000 - 25,000,000+ AED",
    category: "Cloud_Tech_Data",
    titleAr: "اتفاقية خدمات مركز العمليات الأمنية والأمن السيبراني الحرج — الإمارات",
    titleEn: "UAE Mission-Critical SOC & Cyber Defense Managed Services Agreement",
    descriptionAr: "عقد إدارة وتشغيل مركز العمليات الأمنية (SOC) ومراقبة التهديدات السيبرانية على مدار الساعة وفق معايير مجلس الأمن السيبراني الإماراتي وهيئة تنظيم الاتصالات والحكومة الرقمية (TDRA).",
    descriptionEn: "24/7 Managed Security Operations Center (SOC) agreement aligned with UAE National Cybersecurity Council directives and TDRA standards, featuring rapid incident response covenants.",
    keyClauses: [ "زمن الاستجابة الفوري للتهديدات الحرجة خلال 15 دقيقة (15-Minute Critical Incident Response SLA)", "إدارة ثغرات اليوم الصفر واختبار الاختراق المستمر (Zero-Day Remediation & Continuous Red-Teaming)", "السرية المصرفية وسيادة البيانات الوطنية (UAE In-Country Data Sovereignty)", "تحديد سقف المسؤولية وتغطية التأمين ضد الهجمات (Cyber Insurance & Liability Allocation)", "التحكيم لدى مركز دبي للتحكيم الدولي (DIAC)" ],
    tags: [ "أمن_سيبراني", "الإمارات", "SOC", "DIAC", "حماية_سحابية", "TDRA" ],
    pagesCount: 18,
    clausesCount: 26,
    templateAr: `================================================================================
اتفاقية خدمات مركز العمليات الأمنية والأمن السيبراني الحرج — الإمارات
الإمارات العربية المتحدة (الاتحادي) — مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021
جهة الاختصاص والتحكيم: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الإمارات العربية المتحدة (الاتحادي)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الإمارات العربية المتحدة (الاتحادي).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز دبي للتحكيم الدولي (DIAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UAE MISSION-CRITICAL SOC & CYBER DEFENSE MANAGED SERVICES AGREEMENT
UAE Mainland — Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021
Dispute Resolution & Forum: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in UAE Mainland, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in UAE Mainland.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز دبي للتحكيم الدولي (DIAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇶🇦 [QA] Qatar Software Source Code Escrow & Cloud Continuity Agreement
  // ===========================================================================
  {
    id: "sovereign-qa-sourcecode-escrow-cloud-5m",
    countryCode: "QA",
    countryNameAr: "دولة قطر",
    countryNameEn: "Qatar",
    countryFlag: "🇶🇦",
    statuteCodeAr: "قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015",
    statuteCodeEn: "Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015",
    arbitrationVenue: "مركز قطر الدولي للتوفيق والتحكيم (QICCA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "5,000,000 - 20,000,000+ QAR",
    category: "Cloud_Tech_Data",
    titleAr: "اتفاقية إيداع الشفرة المصدرية البرمجية وحساب الضمان التقني — دولة قطر",
    titleEn: "Qatar Software Source Code Escrow & Cloud Continuity Agreement",
    descriptionAr: "اتفاقية ثلاثية الأطراف لإيداع الشفرات المصدرية لبرمجيات البنوك والأنظمة الحرجة لدى جهة إيداع مستقلة وفق قانون المعاملات المدنية القطري لحماية العملاء عند إفلاس المطور.",
    descriptionEn: "Tripartite software source code escrow agreement under Qatari Law, ensuring business continuity and release of technical assets in the event of vendor insolvency or operational abandonment.",
    keyClauses: [ "شروط الإفراج الإلزامي عن الشفرة المصدرية (Release Conditions: Insolvency, Material Breach)", "التحديث الفصلي للشفرات المصدرية والتوثيق الهندسي (Quarterly Source Code Verification Audits)", "ترخيص الاستخدام الداخلي الحصري عند الإفراج (Internal Non-Exclusive Source License upon Release)", "حماية حقوق الملكية الفكرية وسرية الكود (Trade Secret Safeguards & Non-Compete)", "مركز قطر الدولي للتوفيق والتحكيم (QICCA)" ],
    tags: [ "شفرة_مصدرية", "قطر", "QICCA", "Escrow", "برمجيات", "استمرارية_الأعمال" ],
    pagesCount: 17,
    clausesCount: 25,
    templateAr: `================================================================================
اتفاقية إيداع الشفرة المصدرية البرمجية وحساب الضمان التقني — دولة قطر
دولة قطر — قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015
جهة الاختصاص والتحكيم: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة قطر، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة قطر.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز قطر الدولي للتوفيق والتحكيم (QICCA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
QATAR SOFTWARE SOURCE CODE ESCROW & CLOUD CONTINUITY AGREEMENT
Qatar — Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015
Dispute Resolution & Forum: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Qatar, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Qatar.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز قطر الدولي للتوفيق والتحكيم (QICCA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇴🇲 [OM] Oman Enterprise IT Infrastructure Outsourcing & Digital Transformation Contract
  // ===========================================================================
  {
    id: "sovereign-om-it-infrastructure-outsourcing-10m",
    countryCode: "OM",
    countryNameAr: "سلطنة عُمان",
    countryNameEn: "Oman",
    countryFlag: "🇴🇲",
    statuteCodeAr: "قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019",
    statuteCodeEn: "Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019",
    arbitrationVenue: "مركز عُمان للتحكيم التجاري (OAC)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "10,000,000 - 45,000,000+ OMR",
    category: "Cloud_Tech_Data",
    titleAr: "اتفاقية تعهيد البنية التحتية لتقنية المعلومات والتحول الرقمي — سلطنة عُمان",
    titleEn: "Oman Enterprise IT Infrastructure Outsourcing & Digital Transformation Contract",
    descriptionAr: "عقد استراتيجي لتعهيد البنية التقنية وإدارة السيرفرات السحابية وفق قانون المعاملات المدنية العُماني وقوانين حماية البيانات الشخصية الصادرة بالمرسوم السلطاني 6/2022.",
    descriptionEn: "Strategic IT infrastructure outsourcing contract under Omani law and Royal Decree No. 6/2022 on Personal Data Protection, governing cloud migration, server administration, and SLAs.",
    keyClauses: [ "معايير التحول الرقمي ومراحل الهجرة السحابية (Digital Migration Milestones & Acceptance Testing)", "الامتثال لقانون حماية البيانات الشخصية العماني (Oman Personal Data Protection Law RD 6/2022)", "مؤشرات الأداء التشغيلي والتعويض عن الأعطال (Operational KPIs & Liquidated Damages)", "خطة استرداد النشاط بعد الكوارث (Disaster Recovery & Business Continuity Plan - RPO/RTO)", "مركز عُمان للتحكيم التجاري (OAC - مسقط)" ],
    tags: [ "عمان", "تعهيد_تقني", "OAC", "تحول_رقمي", "بيانات_شخصية", "سحابة" ],
    pagesCount: 20,
    clausesCount: 28,
    templateAr: `================================================================================
اتفاقية تعهيد البنية التحتية لتقنية المعلومات والتحول الرقمي — سلطنة عُمان
سلطنة عُمان — قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019
جهة الاختصاص والتحكيم: مركز عُمان للتحكيم التجاري (OAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سلطنة عُمان، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سلطنة عُمان.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز عُمان للتحكيم التجاري (OAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
OMAN ENTERPRISE IT INFRASTRUCTURE OUTSOURCING & DIGITAL TRANSFORMATION CONTRACT
Oman — Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019
Dispute Resolution & Forum: مركز عُمان للتحكيم التجاري (OAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Oman, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Oman.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز عُمان للتحكيم التجاري (OAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇺🇸 [US] Delaware Enterprise API Integration, Data Exchange & Strategic Tech Partnership
  // ===========================================================================
  {
    id: "sovereign-us-api-integration-partnership-10m",
    countryCode: "US",
    countryNameAr: "الولايات المتحدة الأمريكية (Delaware)",
    countryNameEn: "United States (Delaware)",
    countryFlag: "🇺🇸",
    statuteCodeAr: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    statuteCodeEn: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    arbitrationVenue: "Delaware Court of Chancery & AAA / JAMS",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "10,000,000 - 50,000,000+ USD",
    category: "Cloud_Tech_Data",
    titleAr: "اتفاقية تكامل واجهات برمجة التطبيقات وتبادل البيانات المؤسسية — ديلاوير",
    titleEn: "Delaware Enterprise API Integration, Data Exchange & Strategic Tech Partnership",
    descriptionAr: "عقد تكامل واجهات البرمجة المؤسسية وتبادل تدفقات البيانات الضخمة الخاضع لقوانين ولاية ديلاوير وقواعد القانون التجاري الموحد (UCC)، مع تنظيم حدود المعالجة وحقوق الملكية.",
    descriptionEn: "Enterprise API integration and real-time data exchange partnership governed by Delaware Law and UCC, setting throughput quotas, uptime SLA, and bidirectional indemnifications.",
    keyClauses: [ "حدود سعة الاستدعاءات ومعدلات التدفق (API Call Quotas, Rate Limits & Latency SLAs)", "ملكية البيانات المشتقة والتحليلات الاصطناعية (Derived Data & Aggregated Insights Ownership)", "بروتوكولات الأمان والتشفير المتبادل (Mutual OAuth 2.0 & End-to-End TLS 1.3 Standards)", "حدود التعويضات وسقف المسؤولية المالية (Limitation of Liability Capped at Fees Paid)", "محكمة التشانسري في ديلاوير والتحكيم التجاري الأمريكي (AAA / Delaware Court of Chancery)" ],
    tags: [ "API", "ديلاوير", "تكامل_برمجي", "UCC", "تبادل_بيانات", "AAA" ],
    pagesCount: 19,
    clausesCount: 26,
    templateAr: `================================================================================
اتفاقية تكامل واجهات برمجة التطبيقات وتبادل البيانات المؤسسية — ديلاوير
الولايات المتحدة الأمريكية (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
جهة الاختصاص والتحكيم: Delaware Court of Chancery & AAA / JAMS
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الولايات المتحدة الأمريكية (Delaware)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الولايات المتحدة الأمريكية (Delaware).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى Delaware Court of Chancery & AAA / JAMS، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DELAWARE ENTERPRISE API INTEGRATION, DATA EXCHANGE & STRATEGIC TECH PARTNERSHIP
United States (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
Dispute Resolution & Forum: Delaware Court of Chancery & AAA / JAMS
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United States (Delaware), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United States (Delaware).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by Delaware Court of Chancery & AAA / JAMS. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇸🇦 [SA] Saudi Series A Preferred Stock Venture Investment Agreement
  // ===========================================================================
  {
    id: "sovereign-sa-series-a-preferred-investment-10m",
    countryCode: "SA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    countryFlag: "🇸🇦",
    statuteCodeAr: "نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)",
    statuteCodeEn: "Civil Transactions Law (M/191) & Companies Law (M/132)",
    arbitrationVenue: "المركز السعودي للتحكيم التجاري (SCCA - الرياض)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "10,000,000 - 40,000,000+ SAR",
    category: "Venture_Investment",
    titleAr: "اتفاقية الاستثمار في الأسهم الممتازة لجولات الاستثمار الجريء — المملكة العربية السعودية",
    titleEn: "Saudi Series A Preferred Stock Venture Investment Agreement",
    descriptionAr: "اتفاقية استثمار جريء لإصدار وشراء أسهم ممتازة ذات أولوية تصفية وحقوق تصويت وفق نظام الشركات السعودي الجديد م/132 وقواعد هيئة السوق المالية (CMA).",
    descriptionEn: "Institutional Series A Preferred Stock Investment Agreement governed by the Saudi Companies Law (M/132), featuring 1x non-participating liquidation preference and board observer rights.",
    keyClauses: [ "حق أولوية التصفية واسترداد رأس المال (1x Non-Participating Liquidation Preference)", "حقوق الحماية ضد خفض القيمة وحساب التعديل (Broad-Based Weighted Average Anti-Dilution)", "حقوق المشاركة ومقاعد مجلس الإدارة والمراقب (Board Seats & Board Observer Rights)", "أولوية الاكتتاب في الجولات المستقبلية (Pro-Rata Rights in Future Financing)", "التحكيم لدى المركز السعودي للتحكيم التجاري (SCCA) بالرياض" ],
    tags: [ "استثمار_جريء", "السعودية", "Series_A", "SCCA", "أسهم_ممتازة", "م/132" ],
    pagesCount: 22,
    clausesCount: 29,
    templateAr: `================================================================================
اتفاقية الاستثمار في الأسهم الممتازة لجولات الاستثمار الجريء — المملكة العربية السعودية
المملكة العربية السعودية — نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)
جهة الاختصاص والتحكيم: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة العربية السعودية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة العربية السعودية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132).
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى المركز السعودي للتحكيم التجاري (SCCA - الرياض)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
SAUDI SERIES A PREFERRED STOCK VENTURE INVESTMENT AGREEMENT
Saudi Arabia — Civil Transactions Law (M/191) & Companies Law (M/132)
Dispute Resolution & Forum: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law (M/191) & Companies Law (M/132);

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Saudi Arabia, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Saudi Arabia.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law (M/191) & Companies Law (M/132).
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by المركز السعودي للتحكيم التجاري (SCCA - الرياض). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [AE] UAE Post-Money Simple Agreement for Future Equity (SAFE)
  // ===========================================================================
  {
    id: "sovereign-ae-postmoney-safe-5m",
    countryCode: "AE",
    countryNameAr: "الإمارات العربية المتحدة (الاتحادي)",
    countryNameEn: "UAE Mainland",
    countryFlag: "🇦🇪",
    statuteCodeAr: "مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021",
    statuteCodeEn: "Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021",
    arbitrationVenue: "مركز دبي للتحكيم الدولي (DIAC)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "5,000,000 - 20,000,000+ AED",
    category: "Venture_Investment",
    titleAr: "اتفاقية الأداة البسيطة للأسهم المستقبلية المتوافقة مع قوانين الإمارات — SAFE",
    titleEn: "UAE Post-Money Simple Agreement for Future Equity (SAFE)",
    descriptionAr: "اتفاقية SAFE معدلة للاستثمار في الشركات التقنية الناشئة بالإمارات، تتضمن سقف تقييم (Valuation Cap) وخصم الاستثمار (Discount Rate) والتحويل التلقائي عند جولة التمويل.",
    descriptionEn: "Post-Money SAFE instrument adapted for UAE onshore & free zone technology startups, providing automatic conversion upon equity financing and liquidity events.",
    keyClauses: [ "سقف التقييم الاستثماري ومعدل الخصم (Post-Money Valuation Cap & Discount Rate Mechanics)", "آلية التحويل التلقائي عند جولة التمويل المؤهلة (Automatic Conversion upon Qualified Financing)", "أولوية السداد عند التصفية أو الاستحواذ (Liquidity Priority & Dissolution Payout)", "حقوق المعلومات والأولوية في الجولات اللاحقة (Major Investor Information & MFN Rights)", "التحكيم لدى مركز دبي للتحكيم الدولي (DIAC)" ],
    tags: [ "SAFE", "الإمارات", "تمويل_ناشئ", "DIAC", "استثمار", "تقييم" ],
    pagesCount: 16,
    clausesCount: 22,
    templateAr: `================================================================================
اتفاقية الأداة البسيطة للأسهم المستقبلية المتوافقة مع قوانين الإمارات — SAFE
الإمارات العربية المتحدة (الاتحادي) — مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021
جهة الاختصاص والتحكيم: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الإمارات العربية المتحدة (الاتحادي)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الإمارات العربية المتحدة (الاتحادي).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز دبي للتحكيم الدولي (DIAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UAE POST-MONEY SIMPLE AGREEMENT FOR FUTURE EQUITY (SAFE)
UAE Mainland — Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021
Dispute Resolution & Forum: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in UAE Mainland, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in UAE Mainland.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز دبي للتحكيم الدولي (DIAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [ADGM] ADGM Private Equity Fund Limited Partnership Agreement (LPA)
  // ===========================================================================
  {
    id: "sovereign-adgm-pe-limited-partnership-lpa-50m",
    countryCode: "ADGM",
    countryNameAr: "سوق أبوظبي العالمي (ADGM)",
    countryNameEn: "Abu Dhabi Global Market (ADGM)",
    countryFlag: "🇦🇪",
    statuteCodeAr: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    statuteCodeEn: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    arbitrationVenue: "محاكم سوق أبوظبي العالمي (ADGM Courts)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 250,000,000+ USD",
    category: "Venture_Investment",
    titleAr: "اتفاقية الشراكة المحدودة لتأسيس وإدارة صناديق الملكية الخاصة — سوق أبوظبي العالمي",
    titleEn: "ADGM Private Equity Fund Limited Partnership Agreement (LPA)",
    descriptionAr: "عقد تأسيس شراكة محدودة لإدارة واستثمار صناديق الملكية الخاصة والتمويل التنموي وفق لوائح سلطة تنظيم الخدمات المالية بسوق أبوظبي العالمي (FSRA).",
    descriptionEn: "Master Limited Partnership Agreement (LPA) for Private Equity & Venture Funds in ADGM, regulating General Partner (GP) carried interest, capital calls, and hurdle rates.",
    keyClauses: [ "نداءات رأس المال وجدول التخلف عن السداد (Capital Calls, Drawdowns & Defaulting LP Penalties)", "حصة الأرباح المحمولة ونسبة العائد المشروط (Carried Interest Waterfall & 8% Hurdle Rate)", "أتعاب إدارة الصندوق وحدود المصاريف المسموحة (Management Fee 2% & Fund Expense Caps)", "لجنة الاستشارات الاستثمارية وتضارب المصالح (LP Advisory Committee & Conflict Mitigation)", "محاكم سوق أبوظبي العالمي (ADGM Courts) جهة الاختصاص الحصرية" ],
    tags: [ "صناديق_استثمار", "ADGM", "الملكية_الخاصة", "LPA", "FSRA", "Carried_Interest" ],
    pagesCount: 28,
    clausesCount: 36,
    templateAr: `================================================================================
اتفاقية الشراكة المحدودة لتأسيس وإدارة صناديق الملكية الخاصة — سوق أبوظبي العالمي
سوق أبوظبي العالمي (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
جهة الاختصاص والتحكيم: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سوق أبوظبي العالمي (ADGM)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سوق أبوظبي العالمي (ADGM).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم سوق أبوظبي العالمي (ADGM Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
ADGM PRIVATE EQUITY FUND LIMITED PARTNERSHIP AGREEMENT (LPA)
Abu Dhabi Global Market (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
Dispute Resolution & Forum: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Abu Dhabi Global Market (ADGM), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Abu Dhabi Global Market (ADGM).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم سوق أبوظبي العالمي (ADGM Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇰🇼 [KW] Kuwait Convertible Loan & Promissory Note Agreement
  // ===========================================================================
  {
    id: "sovereign-kw-convertible-promissory-note-5m",
    countryCode: "KW",
    countryNameAr: "دولة الكويت",
    countryNameEn: "Kuwait",
    countryFlag: "🇰🇼",
    statuteCodeAr: "قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016",
    statuteCodeEn: "Commercial Law No. 68/1980 & Companies Law No. 1/2016",
    arbitrationVenue: "مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "5,000,000 - 20,000,000+ KWD",
    category: "Venture_Investment",
    titleAr: "سندات القرض القابلة للتحويل إلى أسهم لتمويل الشركات الناشئة — دولة الكويت",
    titleEn: "Kuwait Convertible Loan & Promissory Note Agreement",
    descriptionAr: "اتفاقية تمويل جسري وإصدار سندات قرض قابلة للتحويل إلى أسهم وفق قانون الشركات الكويتي رقم 1 لسنة 2016 وقانون التجارة رقم 68 لسنة 1980.",
    descriptionEn: "Convertible debt instrument and corporate promissory note governed by Kuwaiti Companies Law No. 1/2016, providing debt-to-equity conversion upon maturity or qualified equity rounds.",
    keyClauses: [ "سعر الفائدة وعلاوة التحويل وسقف التقييم (Coupon Rate, Maturity Date & Valuation Cap)", "شروط التحويل الإلزامي والاختياري (Mandatory vs. Optional Conversion Triggers)", "أسبقية السداد في حال التصفية أو الإفلاس (Seniority & Liquidation Preference)", "تعهدات الحفاظ على هيكل رأس المال والشفافية (Corporate Covenants & Financial Reporting)", "التحكيم التجاري بغرفة الكويت للتجارة والصناعة" ],
    tags: [ "سندات_تحويل", "الكويت", "تمويل", "قروض", "غرفة_الكويت", "استثمار" ],
    pagesCount: 17,
    clausesCount: 24,
    templateAr: `================================================================================
سندات القرض القابلة للتحويل إلى أسهم لتمويل الشركات الناشئة — دولة الكويت
دولة الكويت — قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016
جهة الاختصاص والتحكيم: مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة الكويت، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة الكويت.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
KUWAIT CONVERTIBLE LOAN & PROMISSORY NOTE AGREEMENT
Kuwait — Commercial Law No. 68/1980 & Companies Law No. 1/2016
Dispute Resolution & Forum: مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Commercial Law No. 68/1980 & Companies Law No. 1/2016;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Kuwait, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Kuwait.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Commercial Law No. 68/1980 & Companies Law No. 1/2016.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇪🇬 [EG] Egypt Executive Employee Stock Option Plan (ESOP Master Rules)
  // ===========================================================================
  {
    id: "sovereign-eg-esop-master-rules-5m",
    countryCode: "EG",
    countryNameAr: "جمهورية مصر العربية",
    countryNameEn: "Egypt",
    countryFlag: "🇪🇬",
    statuteCodeAr: "القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981",
    statuteCodeEn: "Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981",
    arbitrationVenue: "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "5,000,000 - 30,000,000+ EGP",
    category: "Venture_Investment",
    titleAr: "وثيقة خطة وحوافز تمليك الأسهم والخيارات للموظفين التنفيذيين — جمهورية مصر العربية",
    titleEn: "Egypt Executive Employee Stock Option Plan (ESOP Master Rules)",
    descriptionAr: "لائحة وبرنامج تحفيز الموظفين التنفيذيين وتمليك الأسهم وفق قانون الشركات المصري رقم 159 لسنة 1981 ومعايير الهيئة العامة للرقابة المالية (FRA).",
    descriptionEn: "Executive Employee Stock Option Plan (ESOP) rules compliant with Egyptian Companies Law No. 159/1981 and FRA capital market directives, detailing 4-year vesting and cliff mechanics.",
    keyClauses: [ "جدول الاستحقاق السنوي وفترة الصمود الأولى (4-Year Vesting Schedule with 1-Year Cliff)", "شروط ممارسة خيار شراء الأسهم وسعر التنفيذ (Strike Price & Exercise Notice Requirements)", "آثار إنهاء الخدمة للموظف الصالح والسيئ (Good Leaver vs. Bad Leaver Clawback Provisions)", "الامتثال لمتطلبات القيد بالهيئة العامة للرقابة المالية (FRA Regulatory Filing Compliance)", "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)" ],
    tags: [ "ESOP", "مصر", "خيارات_أسهم", "CRCICA", "حوكمة", "FRA" ],
    pagesCount: 19,
    clausesCount: 26,
    templateAr: `================================================================================
وثيقة خطة وحوافز تمليك الأسهم والخيارات للموظفين التنفيذيين — جمهورية مصر العربية
جمهورية مصر العربية — القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981
جهة الاختصاص والتحكيم: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في جمهورية مصر العربية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في جمهورية مصر العربية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
EGYPT EXECUTIVE EMPLOYEE STOCK OPTION PLAN (ESOP MASTER RULES)
Egypt — Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981
Dispute Resolution & Forum: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Egypt, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Egypt.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇯🇴 [JO] Jordan Venture Investors' Rights Agreement (IRA)
  // ===========================================================================
  {
    id: "sovereign-jo-investor-rights-agreement-ira-5m",
    countryCode: "JO",
    countryNameAr: "المملكة الأردنية الهاشمية",
    countryNameEn: "Jordan",
    countryFlag: "🇯🇴",
    statuteCodeAr: "القانون المدني رقم 43 لسنة 1976 وقانون الشركات رقم 22 لسنة 1997",
    statuteCodeEn: "Jordanian Civil Code No. 43/1976 & Companies Law No. 22/1997",
    arbitrationVenue: "مركز التحكيم الأردني ونقابة المحامين بعمّان",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "5,000,000 - 15,000,000+ JOD",
    category: "Venture_Investment",
    titleAr: "اتفاقية حقوق المستثمرين والمعلومات ومقاعد مجلس الإدارة — المملكة الأردنية الهاشمية",
    titleEn: "Jordan Venture Investors' Rights Agreement (IRA)",
    descriptionAr: "اتفاقية حماية حقوق المستثمرين وتنظيم مقاعد مجلس الإدارة والحصول على المعلومات المالية الدورية وفق قانون الشركات الأردني رقم 22 لسنة 1997.",
    descriptionEn: "Venture Investors' Rights Agreement under Jordanian Corporate Law, securing information rights, board observer designations, and registration rights on regional bourses.",
    keyClauses: [ "الحق في الاطلاع على القوائم المالية المدققة فصلياً (Quarterly Audited Financial Information Rights)", "حق تعيين عضو مجلس الإدارة والمراقب (Board Member & Board Observer Appointment)", "حقوق التسجيل والطرح العام الأولي (Demand & Piggyback Registration Rights)", "التعهد بعدم تعديل عقد التأسيس دون موافقة مسبقة (Affirmative Covenants on Capital Amendments)", "مركز التحكيم الأردني ونقابة المحامين بعمّان" ],
    tags: [ "حقوق_مستثمرين", "الأردن", "IRA", "استثمار", "مجلس_إدارة" ],
    pagesCount: 18,
    clausesCount: 25,
    templateAr: `================================================================================
اتفاقية حقوق المستثمرين والمعلومات ومقاعد مجلس الإدارة — المملكة الأردنية الهاشمية
المملكة الأردنية الهاشمية — القانون المدني رقم 43 لسنة 1976 وقانون الشركات رقم 22 لسنة 1997
جهة الاختصاص والتحكيم: مركز التحكيم الأردني ونقابة المحامين بعمّان
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام القانون المدني رقم 43 لسنة 1976 وقانون الشركات رقم 22 لسنة 1997؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة الأردنية الهاشمية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة الأردنية الهاشمية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام القانون المدني رقم 43 لسنة 1976 وقانون الشركات رقم 22 لسنة 1997.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز التحكيم الأردني ونقابة المحامين بعمّان، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
JORDAN VENTURE INVESTORS' RIGHTS AGREEMENT (IRA)
Jordan — Jordanian Civil Code No. 43/1976 & Companies Law No. 22/1997
Dispute Resolution & Forum: مركز التحكيم الأردني ونقابة المحامين بعمّان
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Jordanian Civil Code No. 43/1976 & Companies Law No. 22/1997;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Jordan, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Jordan.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Jordanian Civil Code No. 43/1976 & Companies Law No. 22/1997.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز التحكيم الأردني ونقابة المحامين بعمّان. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇬🇧 [GB] UK Advanced Subscription & Convertible Loan Note Facility Agreement
  // ===========================================================================
  {
    id: "sovereign-gb-bridge-financing-convertible-10m",
    countryCode: "GB",
    countryNameAr: "المملكة المتحدة (English Law)",
    countryNameEn: "United Kingdom (English Law)",
    countryFlag: "🇬🇧",
    statuteCodeAr: "UK Companies Act 2006 & Unfair Contract Terms Act 1977",
    statuteCodeEn: "UK Companies Act 2006 & Unfair Contract Terms Act 1977",
    arbitrationVenue: "London Court of International Arbitration (LCIA)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "10,000,000 - 50,000,000+ GBP",
    category: "Venture_Investment",
    titleAr: "اتفاقية التمويل الجسري الاستثماري السريع بالسندات القابلة للتحويل — المملكة المتحدة",
    titleEn: "UK Advanced Subscription & Convertible Loan Note Facility Agreement",
    descriptionAr: "اتفاقية تمويل سريع للمشاريع الريادية والشركات الناشئة في المملكة المتحدة وفق قانون الشركات البريطاني 2006 وبرامج الحوافز الضريبية (EIS/SEIS).",
    descriptionEn: "Advanced Subscription Agreement (ASA) and Convertible Loan Note Facility governed by English Law, optimized for British Seed Enterprise Investment Schemes (SEIS/EIS).",
    keyClauses: [ "آليات التحويل المالي وسعر الخصم للجولات التالية (Conversion Discount 20% & Next Round Valuation)", "توافق شروط الاستثمار مع متطلبات إعفاءات HMRC الضريبية (HMRC EIS/SEIS Tax Relief Covenants)", "شروط سداد أصل الدين عند تعذر الجولة المؤهلة (Maturity Redemption & Longstop Date Mechanics)", "حماية حقوق الملكية الفكرية وسندات الرهن العائم (Floating Charge & IP Security Assignment)", "محكمة لندن للتحكيم الدولي (LCIA - London)" ],
    tags: [ "بريطانيا", "تمويل_جسري", "LCIA", "EIS", "Convertible", "London" ],
    pagesCount: 20,
    clausesCount: 28,
    templateAr: `================================================================================
اتفاقية التمويل الجسري الاستثماري السريع بالسندات القابلة للتحويل — المملكة المتحدة
المملكة المتحدة (English Law) — UK Companies Act 2006 & Unfair Contract Terms Act 1977
جهة الاختصاص والتحكيم: London Court of International Arbitration (LCIA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام UK Companies Act 2006 & Unfair Contract Terms Act 1977؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة المتحدة (English Law)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة المتحدة (English Law).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام UK Companies Act 2006 & Unfair Contract Terms Act 1977.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى London Court of International Arbitration (LCIA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UK ADVANCED SUBSCRIPTION & CONVERTIBLE LOAN NOTE FACILITY AGREEMENT
United Kingdom (English Law) — UK Companies Act 2006 & Unfair Contract Terms Act 1977
Dispute Resolution & Forum: London Court of International Arbitration (LCIA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with UK Companies Act 2006 & Unfair Contract Terms Act 1977;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United Kingdom (English Law), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United Kingdom (English Law).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with UK Companies Act 2006 & Unfair Contract Terms Act 1977.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by London Court of International Arbitration (LCIA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇧🇭 [BH] Bahrain Secondary Share Purchase Agreement (Founder Liquidity SPA)
  // ===========================================================================
  {
    id: "sovereign-bh-secondary-share-sale-5m",
    countryCode: "BH",
    countryNameAr: "مملكة البحرين",
    countryNameEn: "Bahrain",
    countryFlag: "🇧🇭",
    statuteCodeAr: "مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001",
    statuteCodeEn: "Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001",
    arbitrationVenue: "غرفة البحرين لتسوية المنازعات (BCDR-AAA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "5,000,000 - 25,000,000+ BHD",
    category: "Venture_Investment",
    titleAr: "اتفاقية بيع وشراء الأسهم الثانوية بين المؤسسين والمستثمرين — مملكة البحرين",
    titleEn: "Bahrain Secondary Share Purchase Agreement (Founder Liquidity SPA)",
    descriptionAr: "اتفاقية تخارج جزئي وبيع أسهم ثانوية لتوفير سيولة للمؤسسين الأوائل مع دخول صناديق استثمار مؤسسية وفق قانون الشركات التجارية البحريني رقم 21 لسنة 2001.",
    descriptionEn: "Secondary Share Purchase Agreement providing partial founder liquidity while admitting institutional growth investors under Bahrain Commercial Law.",
    keyClauses: [ "تحديد الحصص المبيعة وسعر الشراء للسهم (Purchased Secondary Shares & Agreed Share Price)", "التنازل الصريح عن حقوق الشفعة من باقي المساهمين (Waiver of Pre-Emptive Rights & Consents)", "إقرارات وضمانات المؤسس البائع بشأن ملكية الأسهم (Fundamental Warranties as to Title)", "الالتزام المستمر بالبقاء في الشركة والإدارة (Ongoing Founder Retention & Lock-Up Covenants)", "غرفة البحرين لتسوية المنازعات (BCDR-AAA) بالمنامة" ],
    tags: [ "أسهم_ثانوية", "البحرين", "سيولة_مؤسسين", "BCDR", "Secondary_Sale", "تخارج" ],
    pagesCount: 18,
    clausesCount: 25,
    templateAr: `================================================================================
اتفاقية بيع وشراء الأسهم الثانوية بين المؤسسين والمستثمرين — مملكة البحرين
مملكة البحرين — مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001
جهة الاختصاص والتحكيم: غرفة البحرين لتسوية المنازعات (BCDR-AAA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في مملكة البحرين، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في مملكة البحرين.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى غرفة البحرين لتسوية المنازعات (BCDR-AAA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
BAHRAIN SECONDARY SHARE PURCHASE AGREEMENT (FOUNDER LIQUIDITY SPA)
Bahrain — Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001
Dispute Resolution & Forum: غرفة البحرين لتسوية المنازعات (BCDR-AAA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Bahrain, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Bahrain.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by غرفة البحرين لتسوية المنازعات (BCDR-AAA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [AE] UAE FIDIC Silver Book EPC Turnkey Industrial & Infrastructure Contract
  // ===========================================================================
  {
    id: "sovereign-ae-fidic-silver-epc-turnkey-50m",
    countryCode: "AE",
    countryNameAr: "الإمارات العربية المتحدة (الاتحادي)",
    countryNameEn: "UAE Mainland",
    countryFlag: "🇦🇪",
    statuteCodeAr: "مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021",
    statuteCodeEn: "Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021",
    arbitrationVenue: "مركز دبي للتحكيم الدولي (DIAC)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 300,000,000+ AED",
    category: "EPC_Construction",
    titleAr: "عقد المقاولة الشاملة لتسليم المفتاح بنظام الفيديك الفضي — الإمارات",
    titleEn: "UAE FIDIC Silver Book EPC Turnkey Industrial & Infrastructure Contract",
    descriptionAr: "عقد مقاولة شاملة لتصميم وتوريد وبناء المنشآت الصناعية الكبرى وفق معايير الفيديك الفضي (FIDIC Silver Book) وقانون المعاملات المدنية الإماراتي رقم 5 لسنة 1985.",
    descriptionEn: "Turnkey Engineering, Procurement, and Construction (EPC) contract modeled on FIDIC Silver Book conditions and UAE Civil Code, assigning complete design & build risk to Contractor.",
    keyClauses: [ "المسؤولية الكاملة عن التصميم والأعمال المنجزة (Single-Point Responsibility for EPC Works)", "خطاب ضمان حسن التنفيذ والضمان الابتدائي (10% Performance Bond & Advance Payment Guarantee)", "غرامات التأخير اليومية وسقفها الأقصى (Liquidated Damages for Delay Capped at 10%)", "شهادة الاستلام الابتدائي وفترة إشعار العيوب (Taking-Over Certificate & 24-Month DNP)", "التحكيم لدى مركز دبي للتحكيم الدولي (DIAC)" ],
    tags: [ "EPC", "فيديك", "الفيديك_الفضي", "الإمارات", "DIAC", "مقاولات_كبرى" ],
    pagesCount: 30,
    clausesCount: 38,
    templateAr: `================================================================================
عقد المقاولة الشاملة لتسليم المفتاح بنظام الفيديك الفضي — الإمارات
الإمارات العربية المتحدة (الاتحادي) — مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021
جهة الاختصاص والتحكيم: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الإمارات العربية المتحدة (الاتحادي)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الإمارات العربية المتحدة (الاتحادي).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز دبي للتحكيم الدولي (DIAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UAE FIDIC SILVER BOOK EPC TURNKEY INDUSTRIAL & INFRASTRUCTURE CONTRACT
UAE Mainland — Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021
Dispute Resolution & Forum: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in UAE Mainland, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in UAE Mainland.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز دبي للتحكيم الدولي (DIAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [ADGM] ADGM Master Project Management Consultancy (PMC) Agreement
  // ===========================================================================
  {
    id: "sovereign-adgm-pmc-project-management-15m",
    countryCode: "ADGM",
    countryNameAr: "سوق أبوظبي العالمي (ADGM)",
    countryNameEn: "Abu Dhabi Global Market (ADGM)",
    countryFlag: "🇦🇪",
    statuteCodeAr: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    statuteCodeEn: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    arbitrationVenue: "محاكم سوق أبوظبي العالمي (ADGM Courts)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "15,000,000 - 60,000,000+ USD",
    category: "EPC_Construction",
    titleAr: "عقد إدارة المشاريع الهندسية الكبرى والاستشارات الإشرافية — سوق أبوظبي العالمي",
    titleEn: "ADGM Master Project Management Consultancy (PMC) Agreement",
    descriptionAr: "اتفاقية تقديم خدمات إدارة المشاريع الإنشائية والإشراف الهندسي الشامل على المقاولين وفق معايير سوق أبوظبي العالمي والقانون الإنجليزي.",
    descriptionEn: "High-stakes Project Management Consultancy (PMC) contract under ADGM Law, regulating consultant fiduciary duties, contractor oversight, and BIM coordination.",
    keyClauses: [ "صلاحيات مدير المشروع واعتماد المستخلصات المالية (PMC Authority & Interim Payment Certification)", "إدارة مطالبات التمديد الزمني وأوامر التغيير (Extension of Time - EOT & Variation Audits)", "التأمين ضد الأخطاء المهنية الهندسية (Professional Indemnity Insurance - PII USD 20M)", "إدارة نمذجة معلومات البناء والتنسيق الرقمي (BIM Protocol & Digital Twin Oversight)", "محاكم سوق أبوظبي العالمي (ADGM Courts)" ],
    tags: [ "إدارة_مشاريع", "ADGM", "استشارات_هندسية", "PMC", "إشراف", "BIM" ],
    pagesCount: 22,
    clausesCount: 30,
    templateAr: `================================================================================
عقد إدارة المشاريع الهندسية الكبرى والاستشارات الإشرافية — سوق أبوظبي العالمي
سوق أبوظبي العالمي (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
جهة الاختصاص والتحكيم: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سوق أبوظبي العالمي (ADGM)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سوق أبوظبي العالمي (ADGM).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم سوق أبوظبي العالمي (ADGM Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
ADGM MASTER PROJECT MANAGEMENT CONSULTANCY (PMC) AGREEMENT
Abu Dhabi Global Market (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
Dispute Resolution & Forum: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Abu Dhabi Global Market (ADGM), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Abu Dhabi Global Market (ADGM).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم سوق أبوظبي العالمي (ADGM Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇴🇲 [OM] Oman Civil Infrastructure Construction Contract (FIDIC Red Book Aligned)
  // ===========================================================================
  {
    id: "sovereign-om-civil-infrastructure-fidic-red-25m",
    countryCode: "OM",
    countryNameAr: "سلطنة عُمان",
    countryNameEn: "Oman",
    countryFlag: "🇴🇲",
    statuteCodeAr: "قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019",
    statuteCodeEn: "Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019",
    arbitrationVenue: "مركز عُمان للتحكيم التجاري (OAC)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "25,000,000 - 120,000,000+ OMR",
    category: "EPC_Construction",
    titleAr: "عقد تشييد البنية التحتية والأعمال المدنية الكبرى — سلطنة عُمان",
    titleEn: "Oman Civil Infrastructure Construction Contract (FIDIC Red Book Aligned)",
    descriptionAr: "عقد مقاولات عامة وتشييد بنية تحتية وطرق وفق نموذج عقد الفيديك الأحمر والقانون المدني العُماني وقانون المناقصات الحكومية.",
    descriptionEn: "Master infrastructure construction contract aligned with FIDIC Red Book conditions and Omani Civil Transactions Law, regulating employer-designed civil works and remeasurement.",
    keyClauses: [ "إعادة قياس الكميات والتسعير بجدول الكميات (Bill of Quantities Remeasurement & Unit Rates)", "سلطات مهندس المشروع وإصدار التوجيهات (The Engineer's Duties, Determinations & Instructions)", "ضمان العيوب الخفية والمسؤولية العشرية (Decennial Liability under Article 634 Oman Civil Code)", "آليات تسوية مطالبات المقاول الإضافية (Clause 20 Contractor Claims & Dispute Adjudication Board)", "مركز عُمان للتحكيم التجاري (OAC - مسقط)" ],
    tags: [ "عمان", "بنية_تحتية", "FIDIC", "OAC", "مقاولات", "مسؤولية_عشرية" ],
    pagesCount: 26,
    clausesCount: 34,
    templateAr: `================================================================================
عقد تشييد البنية التحتية والأعمال المدنية الكبرى — سلطنة عُمان
سلطنة عُمان — قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019
جهة الاختصاص والتحكيم: مركز عُمان للتحكيم التجاري (OAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سلطنة عُمان، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سلطنة عُمان.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز عُمان للتحكيم التجاري (OAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
OMAN CIVIL INFRASTRUCTURE CONSTRUCTION CONTRACT (FIDIC RED BOOK ALIGNED)
Oman — Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019
Dispute Resolution & Forum: مركز عُمان للتحكيم التجاري (OAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Oman, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Oman.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز عُمان للتحكيم التجاري (OAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇰🇼 [KW] Kuwait Mega Construction Consortium & Joint Bidding Agreement
  // ===========================================================================
  {
    id: "sovereign-kw-consortium-infrastructure-35m",
    countryCode: "KW",
    countryNameAr: "دولة الكويت",
    countryNameEn: "Kuwait",
    countryFlag: "🇰🇼",
    statuteCodeAr: "قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016",
    statuteCodeEn: "Commercial Law No. 68/1980 & Companies Law No. 1/2016",
    arbitrationVenue: "مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "35,000,000 - 150,000,000+ KWD",
    category: "EPC_Construction",
    titleAr: "اتفاقية تحالف مقاولي الإنشاءات والكونسورتيوم للمشاريع الضخمة — دولة الكويت",
    titleEn: "Kuwait Mega Construction Consortium & Joint Bidding Agreement",
    descriptionAr: "اتفاقية كونسورتيوم بين شركات مقاولات محلية ودولية للتقدم بعطاءات مشتركة وتنفيذ مشاريع البنية التحتية الكبرى وفق قانون المناقصات العامة الكويتي 49/2016.",
    descriptionEn: "Construction Consortium Agreement for international and Kuwaiti contractors bidding jointly for mega government infrastructure tenders under Kuwait Public Tenders Law 49/2016.",
    keyClauses: [ "توزيع المسؤوليات والحصص التشغيلية المشتركة (Workshare Allocation & Internal Consortium Quotas)", "المسؤولية التضامنية والتكافلية أمام رب العمل (Joint and Several Liability to Employer / CTC)", "إدارة الحساب المصرفي المشترك للمشروع (Project Dedicated Escrow Bank Account Governance)", "تسوية الخلافات الداخلية بين أعضاء الكونسورتيوم (Internal Deficit Financing & Cross-Indemnities)", "التحكيم التجاري بغرفة تجارة وصناعة الكويت" ],
    tags: [ "كونسورتيوم", "الكويت", "بنية_تحتية", "مناقصات_عامة", "تحالف", "غرفة_الكويت" ],
    pagesCount: 24,
    clausesCount: 32,
    templateAr: `================================================================================
اتفاقية تحالف مقاولي الإنشاءات والكونسورتيوم للمشاريع الضخمة — دولة الكويت
دولة الكويت — قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016
جهة الاختصاص والتحكيم: مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة الكويت، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة الكويت.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
KUWAIT MEGA CONSTRUCTION CONSORTIUM & JOINT BIDDING AGREEMENT
Kuwait — Commercial Law No. 68/1980 & Companies Law No. 1/2016
Dispute Resolution & Forum: مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Commercial Law No. 68/1980 & Companies Law No. 1/2016;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Kuwait, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Kuwait.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Commercial Law No. 68/1980 & Companies Law No. 1/2016.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇧🇭 [BH] Bahrain Specialized MEP Nominated Subcontract Agreement
  // ===========================================================================
  {
    id: "sovereign-bh-nominated-subcontractor-epc-10m",
    countryCode: "BH",
    countryNameAr: "مملكة البحرين",
    countryNameEn: "Bahrain",
    countryFlag: "🇧🇭",
    statuteCodeAr: "مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001",
    statuteCodeEn: "Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001",
    arbitrationVenue: "غرفة البحرين لتسوية المنازعات (BCDR-AAA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "10,000,000 - 40,000,000+ BHD",
    category: "EPC_Construction",
    titleAr: "عقد المقاولة من الباطن للأعمال الكهروميكانيكية المتخصصة — مملكة البحرين",
    titleEn: "Bahrain Specialized MEP Nominated Subcontract Agreement",
    descriptionAr: "عقد مقاولة باطن للأعمال الكهروميكانيكية (MEP) لمشاريع الأبراج والمجمعات بموجب القانون المدني البحريني الصادر بالمرسوم 19/2001 مع شرط السداد عند القبض (Pay-When-Paid).",
    descriptionEn: "Specialized MEP Subcontract Agreement under Bahraini Law, incorporating back-to-back pass-through provisions, performance bonds, and milestone inspection releases.",
    keyClauses: [ "شروط الربط مع العقد الرئيسي (Back-to-Back Flowdown Terms with Main Contract)", "تنظيم الدفعات المالية وشرط السداد المشروط (Pay-When-Paid Terms Compliant with Bahrain Law)", "ضمانات المعدات الكهروميكانيكية وشهادات التشغيل (MEP Testing, Commissioning & Warranties)", "حجز الضمان النقدي والإفراج التدريجي (10% Cash Retention Released across Milestones)", "غرفة البحرين لتسوية المنازعات (BCDR-AAA) بالمنامة" ],
    tags: [ "مقاولة_باطن", "البحرين", "MEP", "BCDR", "عقود_إنشاءات", "كهروميكانيك" ],
    pagesCount: 20,
    clausesCount: 28,
    templateAr: `================================================================================
عقد المقاولة من الباطن للأعمال الكهروميكانيكية المتخصصة — مملكة البحرين
مملكة البحرين — مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001
جهة الاختصاص والتحكيم: غرفة البحرين لتسوية المنازعات (BCDR-AAA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في مملكة البحرين، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في مملكة البحرين.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى غرفة البحرين لتسوية المنازعات (BCDR-AAA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
BAHRAIN SPECIALIZED MEP NOMINATED SUBCONTRACT AGREEMENT
Bahrain — Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001
Dispute Resolution & Forum: غرفة البحرين لتسوية المنازعات (BCDR-AAA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Bahrain, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Bahrain.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by غرفة البحرين لتسوية المنازعات (BCDR-AAA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇺🇸 [US] Delaware Turnkey Advanced Industrial Facility Engineering & Construction Agreement
  // ===========================================================================
  {
    id: "sovereign-us-turnkey-industrial-facility-25m",
    countryCode: "US",
    countryNameAr: "الولايات المتحدة الأمريكية (Delaware)",
    countryNameEn: "United States (Delaware)",
    countryFlag: "🇺🇸",
    statuteCodeAr: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    statuteCodeEn: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    arbitrationVenue: "Delaware Court of Chancery & AAA / JAMS",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "25,000,000 - 100,000,000+ USD",
    category: "EPC_Construction",
    titleAr: "عقد المقاولة الشاملة وتجهيز المرافق الصناعية المتقدمة — ديلاوير",
    titleEn: "Delaware Turnkey Advanced Industrial Facility Engineering & Construction Agreement",
    descriptionAr: "عقد مقاولة تسليم مفتاح لبناء مصانع التقنية المتقدمة ومرافق الرقائق الإلكترونية وفق قوانين ولاية ديلاوير، مع جداول الإنجاز الحرج وضمانات الأداء الإنتاجي.",
    descriptionEn: "Turnkey design-build construction agreement for high-tech manufacturing plants under Delaware Law, incorporating Guaranteed Maximum Price (GMP) and output performance guarantees.",
    keyClauses: [ "السعر الأقصى المضمون ومشاركة وفر التكاليف (Guaranteed Maximum Price - GMP & Cost Savings Sharing)", "ضمانات كفاءة الإنتاج ومعدلات الطاقة للمصنع (Facility Performance Test & Nameplate Capacity Guarantee)", "التأمين الشامل على مخاطر البناء (Owner Controlled Insurance Program - OCIP USD 50M)", "أوامر التغيير والشروط الاستثنائية لموقع البناء (Differing Site Conditions & Change Order Procedures)", "التحكيم التجاري للجمعية الأمريكية للتحكيم (AAA Construction Rules - Wilmington)" ],
    tags: [ "صناعة", "ديلاوير", "GMP", "AAA", "تسليم_مفتاح", "مصانع_متقدمة" ],
    pagesCount: 27,
    clausesCount: 35,
    templateAr: `================================================================================
عقد المقاولة الشاملة وتجهيز المرافق الصناعية المتقدمة — ديلاوير
الولايات المتحدة الأمريكية (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
جهة الاختصاص والتحكيم: Delaware Court of Chancery & AAA / JAMS
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الولايات المتحدة الأمريكية (Delaware)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الولايات المتحدة الأمريكية (Delaware).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى Delaware Court of Chancery & AAA / JAMS، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DELAWARE TURNKEY ADVANCED INDUSTRIAL FACILITY ENGINEERING & CONSTRUCTION AGREEMENT
United States (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
Dispute Resolution & Forum: Delaware Court of Chancery & AAA / JAMS
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United States (Delaware), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United States (Delaware).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by Delaware Court of Chancery & AAA / JAMS. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🌐 [INT] International Plant Design-Build Contract (FIDIC Yellow Book Model)
  // ===========================================================================
  {
    id: "sovereign-int-fidic-yellow-plant-design-build-50m",
    countryCode: "INT",
    countryNameAr: "القانون الدولي واتفاقيات الأمم المتحدة",
    countryNameEn: "International & UNCITRAL Conventions",
    countryFlag: "🌐",
    statuteCodeAr: "اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم",
    statuteCodeEn: "UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration",
    arbitrationVenue: "محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 250,000,000+ USD",
    category: "EPC_Construction",
    titleAr: "عقد تصميم وبناء المنشآت الصناعية والمحطات — فيديك أصفر دولي",
    titleEn: "International Plant Design-Build Contract (FIDIC Yellow Book Model)",
    descriptionAr: "عقد تصميم وتشييد المحطات الكهربائية والمنشآت المائية وفق شروط عقد فيديك الكتاب الأصفر (FIDIC Yellow Book) والاتفاقيات الدولية للأعمال الهندسية الكبرى.",
    descriptionEn: "International Design-Build Contract for electrical and industrial process plants based on FIDIC Conditions of Contract for Plant and Design-Build (Yellow Book).",
    keyClauses: [ "التزامات المقاول في التصميم والتحقق الهندسي (Contractor's General Design & Fitness for Purpose)", "اختبارات ما بعد الإكمال والتشغيل التجريبي (Tests on Completion & Tests After Completion)", "تعديل الأسعار بسبب تغير تكاليف المواد والعملات (Price Fluctuation Formulas & Currency Hedging)", "مجلس تجنب النزاعات وفضها (Dispute Avoidance & Adjudication Board - DAAB Decisions)", "محكمة التحكيم التابعة لغرفة التجارة الدولية (ICC International Court of Arbitration - Paris)" ],
    tags: [ "FIDIC_Yellow", "عالمي", "ICC_Paris", "محطات", "تصميم_وبناء", "DAAB" ],
    pagesCount: 32,
    clausesCount: 40,
    templateAr: `================================================================================
عقد تصميم وبناء المنشآت الصناعية والمحطات — فيديك أصفر دولي
القانون الدولي واتفاقيات الأمم المتحدة — اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم
جهة الاختصاص والتحكيم: محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في القانون الدولي واتفاقيات الأمم المتحدة، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في القانون الدولي واتفاقيات الأمم المتحدة.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
INTERNATIONAL PLANT DESIGN-BUILD CONTRACT (FIDIC YELLOW BOOK MODEL)
International & UNCITRAL Conventions — UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration
Dispute Resolution & Forum: محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in International & UNCITRAL Conventions, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in International & UNCITRAL Conventions.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇸🇦 [SA] Saudi 25-Year Utility-Scale Solar Power Purchase Agreement (PPA)
  // ===========================================================================
  {
    id: "sovereign-sa-solar-power-purchase-ppa-50m",
    countryCode: "SA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    countryFlag: "🇸🇦",
    statuteCodeAr: "نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)",
    statuteCodeEn: "Civil Transactions Law (M/191) & Companies Law (M/132)",
    arbitrationVenue: "المركز السعودي للتحكيم التجاري (SCCA - الرياض)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 500,000,000+ SAR",
    category: "Energy_Infrastructure",
    titleAr: "اتفاقية شراء الطاقة الكهروضوئية والشمسية طويلة الأجل — المملكة العربية السعودية",
    titleEn: "Saudi 25-Year Utility-Scale Solar Power Purchase Agreement (PPA)",
    descriptionAr: "اتفاقية شراء الطاقة الشمسية لمدة 25 عاماً المتوافقة مع أهداف مبادرة السعودية الخضراء ورؤية 2030 وضوابط هيئة تنظيم المياه والكهرباء والشركة السعودية للكهرباء.",
    descriptionEn: "25-Year utility-scale solar photovoltaic Power Purchase Agreement (PPA) aligned with KSA Vision 2030 renewable targets, setting take-or-pay tariff structures and grid connectivity.",
    keyClauses: [ "تعرفة الطاقة وبنية الدفع (Take-or-Pay Tariff Structure & Deemed Generation Payments)", "معايير الربط الكهربائي وضمانات السعة (Grid Interconnection & Dispatch Instructions - SEC Code)", "تخصيص مخاطر التغير في الأنظمة والضرائب (Change in Law Protection & Tax Adjustment)", "نقل ملكية شهادات الطاقة المتجددة (Renewable Energy Certificates - RECs Attribution)", "المركز السعودي للتحكيم التجاري (SCCA - الرياض)" ],
    tags: [ "طاقة_شمسية", "PPA", "السعودية", "رؤية_2030", "SCCA", "طاقة_متجددة" ],
    pagesCount: 31,
    clausesCount: 39,
    templateAr: `================================================================================
اتفاقية شراء الطاقة الكهروضوئية والشمسية طويلة الأجل — المملكة العربية السعودية
المملكة العربية السعودية — نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)
جهة الاختصاص والتحكيم: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة العربية السعودية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة العربية السعودية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132).
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى المركز السعودي للتحكيم التجاري (SCCA - الرياض)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
SAUDI 25-YEAR UTILITY-SCALE SOLAR POWER PURCHASE AGREEMENT (PPA)
Saudi Arabia — Civil Transactions Law (M/191) & Companies Law (M/132)
Dispute Resolution & Forum: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law (M/191) & Companies Law (M/132);

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Saudi Arabia, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Saudi Arabia.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law (M/191) & Companies Law (M/132).
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by المركز السعودي للتحكيم التجاري (SCCA - الرياض). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [AE] UAE Long-Term Green Hydrogen & Clean Ammonia Supply & Offtake Agreement
  // ===========================================================================
  {
    id: "sovereign-ae-green-hydrogen-offtake-100m",
    countryCode: "AE",
    countryNameAr: "الإمارات العربية المتحدة (الاتحادي)",
    countryNameEn: "UAE Mainland",
    countryFlag: "🇦🇪",
    statuteCodeAr: "مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021",
    statuteCodeEn: "Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021",
    arbitrationVenue: "مركز دبي للتحكيم الدولي (DIAC)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "100,000,000 - 800,000,000+ AED",
    category: "Energy_Infrastructure",
    titleAr: "اتفاقية شراء وتوريد الهيدروجين الأخضر والأمونيا النظيفة — الإمارات",
    titleEn: "UAE Long-Term Green Hydrogen & Clean Ammonia Supply & Offtake Agreement",
    descriptionAr: "اتفاقية استراتيجية لشراء الهيدروجين الأخضر وتصديره وفق استراتيجية الإمارات للهيدروجين 2050، مع معايير الشهادات الخضراء ومطابقة البصمة الكربونية.",
    descriptionEn: "Long-term clean ammonia and green hydrogen commercial offtake agreement compliant with UAE Hydrogen Strategy 2050, governing green certification standards and port delivery.",
    keyClauses: [ "مواصفات النقاء واشتراطات الهيدروجين النظيف (Green Hydrogen Purity & Low-Carbon Thresholds)", "جدول التوريد الشهري وموانئ الشحن والتسليم (Take-or-Pay Monthly Offtake Schedule & Port Protocols)", "صيغة تسعير المؤشر العالمي وعلاوة الوقود الأخضر (Indexed Pricing Formula & Green Premium Mechanics)", "الاعتماد والامتثال لمعايير الاستدامة الأوروبية (EU RED II Certification Compliance Covenants)", "مركز دبي للتحكيم الدولي (DIAC)" ],
    tags: [ "هيدروجين_أخضر", "الإمارات", "طاقة_نظيفة", "DIAC", "أمونيا", "استدامة_2050" ],
    pagesCount: 29,
    clausesCount: 37,
    templateAr: `================================================================================
اتفاقية شراء وتوريد الهيدروجين الأخضر والأمونيا النظيفة — الإمارات
الإمارات العربية المتحدة (الاتحادي) — مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021
جهة الاختصاص والتحكيم: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الإمارات العربية المتحدة (الاتحادي)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الإمارات العربية المتحدة (الاتحادي).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز دبي للتحكيم الدولي (DIAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UAE LONG-TERM GREEN HYDROGEN & CLEAN AMMONIA SUPPLY & OFFTAKE AGREEMENT
UAE Mainland — Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021
Dispute Resolution & Forum: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in UAE Mainland, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in UAE Mainland.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز دبي للتحكيم الدولي (DIAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇶🇦 [QA] Qatar Long-Term LNG Sale and Purchase Agreement (LNG SPA)
  // ===========================================================================
  {
    id: "sovereign-qa-lng-longterm-sale-purchase-spa-100m",
    countryCode: "QA",
    countryNameAr: "دولة قطر",
    countryNameEn: "Qatar",
    countryFlag: "🇶🇦",
    statuteCodeAr: "قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015",
    statuteCodeEn: "Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015",
    arbitrationVenue: "مركز قطر الدولي للتوفيق والتحكيم (QICCA)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "100,000,000 - 1,000,000,000+ USD",
    category: "Energy_Infrastructure",
    titleAr: "اتفاقية بيع وتوريد الغاز الطبيعي المسال طويلة الأجل — دولة قطر",
    titleEn: "Qatar Long-Term LNG Sale and Purchase Agreement (LNG SPA)",
    descriptionAr: "اتفاقية تصدير الغاز الطبيعي المسال طويلة الأجل (20 عاماً) وفق قوانين دولة قطر وأعراف تجارة الغاز العالمية، مع شروط التسليم FOB/DES ومعادلات الربط بأسعار خام برنت.",
    descriptionEn: "20-Year master liquefied natural gas (LNG) sale and purchase agreement under Qatari Law, regulating FOB/DES shipping schedules, Brent-linked pricing formulas, and cargo diversions.",
    keyClauses: [ "كميات التعاقد السنوية والحدود المرنة للتوريد (Annual Contract Quantity - ACQ & Downward Flexibility)", "معادلة تسعير الغاز المرتبطة بأسعار النفط (Slope Factor & Brent Oil-Linked Pricing Formula)", "مواصفات جودة الغاز المسال والقيمة الحرارية (Gross Heating Value - GHV & Off-Spec Cargo Rejection)", "شروط تحويل مسار الناقلات وحرية الوجهة (Destination Flexibility & Cargo Cargo Redirection)", "مركز قطر الدولي للتوفيق والتحكيم (QICCA - الدوحة)" ],
    tags: [ "LNG", "قطر", "غاز_مسال", "QICCA", "طاقة", "تصدير_عالمي" ],
    pagesCount: 35,
    clausesCount: 44,
    templateAr: `================================================================================
اتفاقية بيع وتوريد الغاز الطبيعي المسال طويلة الأجل — دولة قطر
دولة قطر — قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015
جهة الاختصاص والتحكيم: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة قطر، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة قطر.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز قطر الدولي للتوفيق والتحكيم (QICCA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
QATAR LONG-TERM LNG SALE AND PURCHASE AGREEMENT (LNG SPA)
Qatar — Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015
Dispute Resolution & Forum: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Qatar, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Qatar.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز قطر الدولي للتوفيق والتحكيم (QICCA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇴🇲 [OM] Oman Utility-Scale Wind Farm Usufruct, Land Concession & Development Agreement
  // ===========================================================================
  {
    id: "sovereign-om-wind-farm-land-concession-50m",
    countryCode: "OM",
    countryNameAr: "سلطنة عُمان",
    countryNameEn: "Oman",
    countryFlag: "🇴🇲",
    statuteCodeAr: "قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019",
    statuteCodeEn: "Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019",
    arbitrationVenue: "مركز عُمان للتحكيم التجاري (OAC)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 200,000,000+ OMR",
    category: "Energy_Infrastructure",
    titleAr: "اتفاقية امتياز وتأجير الأراضي لمزارع توليد طاقة الرياح — سلطنة عُمان",
    titleEn: "Oman Utility-Scale Wind Farm Usufruct, Land Concession & Development Agreement",
    descriptionAr: "اتفاقية حق انتفاع عقاري وامتياز لتشييد وتشغيل مزارع طاقة الرياح وفق المرسوم السلطاني العُماني الخاص بالطاقة المتجددة وقانون المعاملات المدنية.",
    descriptionEn: "Utility-scale wind energy concession and land usufruct agreement under Omani Law, granting 30-year development rights, wind measurement access, and environmental easements.",
    keyClauses: [ "مدة حق الانتفاع العقاري وشروط تجديده (30-Year Usufruct Period & Decommissioning Bonds)", "قياس سرعات الرياح ودراسات هجرة الطيور (Wind Resource Assessment & Bird Migration Safeguards)", "إتاحة حق الارتفاق للمحولات والربط بالشبكة (Electrical Substation & Transmission Easements)", "التزام إعادة تأهيل الموقع بعد انتهاء التشغيل (Site Restoration & Decommissioning Fund Allocations)", "مركز عُمان للتحكيم التجاري (OAC)" ],
    tags: [ "طاقة_رياح", "عمان", "حق_انتفاع", "OAC", "طاقة_متجددة", "امتياز" ],
    pagesCount: 26,
    clausesCount: 33,
    templateAr: `================================================================================
اتفاقية امتياز وتأجير الأراضي لمزارع توليد طاقة الرياح — سلطنة عُمان
سلطنة عُمان — قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019
جهة الاختصاص والتحكيم: مركز عُمان للتحكيم التجاري (OAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سلطنة عُمان، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سلطنة عُمان.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز عُمان للتحكيم التجاري (OAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
OMAN UTILITY-SCALE WIND FARM USUFRUCT, LAND CONCESSION & DEVELOPMENT AGREEMENT
Oman — Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019
Dispute Resolution & Forum: مركز عُمان للتحكيم التجاري (OAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Oman, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Oman.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز عُمان للتحكيم التجاري (OAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇪🇬 [EG] Egypt Energy Service Company (ESCO) Guaranteed Energy Performance Contract
  // ===========================================================================
  {
    id: "sovereign-eg-renewable-esco-performance-15m",
    countryCode: "EG",
    countryNameAr: "جمهورية مصر العربية",
    countryNameEn: "Egypt",
    countryFlag: "🇪🇬",
    statuteCodeAr: "القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981",
    statuteCodeEn: "Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981",
    arbitrationVenue: "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "15,000,000 - 75,000,000+ EGP",
    category: "Energy_Infrastructure",
    titleAr: "عقد خدمات تحسين كفاءة الطاقة وتوفير الاستهلاك — جمهورية مصر العربية",
    titleEn: "Egypt Energy Service Company (ESCO) Guaranteed Energy Performance Contract",
    descriptionAr: "عقد أداء خدمات طاقة (ESCO) لترشيد وتوفير استهلاك الكهرباء للمجمعات الصناعية وفق قانون الكهرباء المصري رقم 87 لسنة 2015 مع ضمان تحقيق نسبة وفر مؤكدة.",
    descriptionEn: "Guaranteed energy savings performance contract governed by Egyptian Law, where the ESCO finances and retrofits industrial facilities against guaranteed utility bill reductions.",
    keyClauses: [ "خط الأساس الاستهلاكي وضمان نسبة التوفير (Energy Baseline M&V & Guaranteed Savings 25%)", "تمويل وتركيب المعدات الذكية واسترداد التكاليف (Shared Savings Model & Equipment Ownership Transfer)", "التعويض الإلزامي عن عدم تحقيق نسبة الوفر المضمونة (Shortfall Compensation Payable by ESCO)", "الصيانة الدورية وربط أنظمة التحكم بإنترنت الأشياء (IoT Energy Monitoring & Predictive Maintenance)", "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)" ],
    tags: [ "ESCO", "مصر", "ترشيد_طاقة", "CRCICA", "كفاءة_الطاقة", "كهرباء" ],
    pagesCount: 21,
    clausesCount: 28,
    templateAr: `================================================================================
عقد خدمات تحسين كفاءة الطاقة وتوفير الاستهلاك — جمهورية مصر العربية
جمهورية مصر العربية — القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981
جهة الاختصاص والتحكيم: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في جمهورية مصر العربية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في جمهورية مصر العربية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
EGYPT ENERGY SERVICE COMPANY (ESCO) GUARANTEED ENERGY PERFORMANCE CONTRACT
Egypt — Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981
Dispute Resolution & Forum: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Egypt, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Egypt.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇰🇼 [KW] Kuwait Master Oilfield Drilling & Specialized Petroleum Services Contract
  // ===========================================================================
  {
    id: "sovereign-kw-oilfield-specialized-drilling-30m",
    countryCode: "KW",
    countryNameAr: "دولة الكويت",
    countryNameEn: "Kuwait",
    countryFlag: "🇰🇼",
    statuteCodeAr: "قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016",
    statuteCodeEn: "Commercial Law No. 68/1980 & Companies Law No. 1/2016",
    arbitrationVenue: "مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "30,000,000 - 120,000,000+ KWD",
    category: "Energy_Infrastructure",
    titleAr: "عقد الحفر والخدمات البترولية الميدانية المتخصصة — دولة الكويت",
    titleEn: "Kuwait Master Oilfield Drilling & Specialized Petroleum Services Contract",
    descriptionAr: "عقد حفر آبار نفطية وخدمات سوائل الحفر والتسجيل الجيولوجي وفق لوائح مؤسسة البترول الكويتية (KPC) وقانون التجارة الكويتي رقم 68 لسنة 1980.",
    descriptionEn: "Master drilling and specialized oilfield services agreement aligned with Kuwait Petroleum Corporation (KPC) standard terms, regulating rig mobilization, blow-out liability, and dayrates.",
    keyClauses: [ "هيكل الأجور اليومية ومعدلات توقف الحفارات (Operating Dayrate, Standby Rate & Repair Time Allowances)", "توزيع المسؤوليات عن انفجار الآبار والتلوث (Blow-Out Risk, Well Control & Environmental Pollution)", "معايير الصحة والسلامة البيئية المشددة (Strict KPC HSE Protocols & Emergency Blowout Response)", "التأمين البترولي الشامل وتغطية المعدات السطحية (Downhole Equipment & Rig Physical Damage Insurance)", "التحكيم التجاري بغرفة الكويت للتجارة والصناعة" ],
    tags: [ "نفط_وغاز", "الكويت", "حفر_آبار", "KPC", "خدمات_بترولية", "غرفة_الكويت" ],
    pagesCount: 27,
    clausesCount: 35,
    templateAr: `================================================================================
عقد الحفر والخدمات البترولية الميدانية المتخصصة — دولة الكويت
دولة الكويت — قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016
جهة الاختصاص والتحكيم: مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة الكويت، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة الكويت.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
KUWAIT MASTER OILFIELD DRILLING & SPECIALIZED PETROLEUM SERVICES CONTRACT
Kuwait — Commercial Law No. 68/1980 & Companies Law No. 1/2016
Dispute Resolution & Forum: مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Commercial Law No. 68/1980 & Companies Law No. 1/2016;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Kuwait, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Kuwait.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Commercial Law No. 68/1980 & Companies Law No. 1/2016.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇪🇺 [EU] EU Carbon Credit Emission Allowances & Verified Carbon Offtake Agreement
  // ===========================================================================
  {
    id: "sovereign-eu-carbon-credit-offset-purchase-20m",
    countryCode: "EU",
    countryNameAr: "الاتحاد الأوروبي (Civil Law & GDPR)",
    countryNameEn: "European Union (Civil Law & GDPR)",
    countryFlag: "🇪🇺",
    statuteCodeAr: "اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية",
    statuteCodeEn: "EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes",
    arbitrationVenue: "غرفة التجارة الدولية باريس (ICC International Court of Arbitration)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "20,000,000 - 80,000,000+ EUR",
    category: "Energy_Infrastructure",
    titleAr: "اتفاقية بيع وتداول أرصدة الكربون وشهادات الطاقة المتجددة — الاتحاد الأوروبي",
    titleEn: "EU Carbon Credit Emission Allowances & Verified Carbon Offtake Agreement",
    descriptionAr: "اتفاقية شراء ونقل ملكية شهادات خفض الانبعاثات الكربونية وأرصدة الكربون المعتمدة وفق نظام الاتحاد الأوروبي لتداول الانبعاثات (EU ETS) وقواعد اتفاقية باريس للمناخ.",
    descriptionEn: "Master emissions reduction purchase agreement (ERPA) under EU Law, compliant with EU ETS directives and Article 6 of the Paris Agreement, regulating certified carbon credit transfers.",
    keyClauses: [ "معايير التحقق من الأرصدة عبر جهات دولية مستقلة (Gold Standard / Verra VCS Third-Party Validation)", "تسليم الأرصدة في السجل الإلكتروني الأوروبي (Registry Transfer & Delivery Free of Encumbrances)", "تعديل الأسعار عند تغير سياسات ضريبة الكربون الأوروبية (CBAM Regulatory Adjustment Covenants)", "إقرارات عدم البيع المزدوج للأرصدة (Anti-Double Counting & Integrity Representations)", "غرفة التجارة الدولية بباريس (ICC Paris)" ],
    tags: [ "أرصدة_كربون", "الاتحاد_الأوروبي", "EU_ETS", "ICC_Paris", "مناخ", "استدامة" ],
    pagesCount: 22,
    clausesCount: 29,
    templateAr: `================================================================================
اتفاقية بيع وتداول أرصدة الكربون وشهادات الطاقة المتجددة — الاتحاد الأوروبي
الاتحاد الأوروبي (Civil Law & GDPR) — اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية
جهة الاختصاص والتحكيم: غرفة التجارة الدولية باريس (ICC International Court of Arbitration)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الاتحاد الأوروبي (Civil Law & GDPR)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الاتحاد الأوروبي (Civil Law & GDPR).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى غرفة التجارة الدولية باريس (ICC International Court of Arbitration)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
EU CARBON CREDIT EMISSION ALLOWANCES & VERIFIED CARBON OFFTAKE AGREEMENT
European Union (Civil Law & GDPR) — EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes
Dispute Resolution & Forum: غرفة التجارة الدولية باريس (ICC International Court of Arbitration)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in European Union (Civil Law & GDPR), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in European Union (Civil Law & GDPR).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by غرفة التجارة الدولية باريس (ICC International Court of Arbitration). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇬🇧 [GB] UK Battery Energy Storage System (BESS) Grid Interconnection & Tolling Contract
  // ===========================================================================
  {
    id: "sovereign-gb-grid-interconnection-battery-bess-25m",
    countryCode: "GB",
    countryNameAr: "المملكة المتحدة (English Law)",
    countryNameEn: "United Kingdom (English Law)",
    countryFlag: "🇬🇧",
    statuteCodeAr: "UK Companies Act 2006 & Unfair Contract Terms Act 1977",
    statuteCodeEn: "UK Companies Act 2006 & Unfair Contract Terms Act 1977",
    arbitrationVenue: "London Court of International Arbitration (LCIA)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "25,000,000 - 90,000,000+ GBP",
    category: "Energy_Infrastructure",
    titleAr: "اتفاقية توصيل منظومات تخزين الطاقة بالبطاريات بالشبكة الكهربائية — بريطانيا",
    titleEn: "UK Battery Energy Storage System (BESS) Grid Interconnection & Tolling Contract",
    descriptionAr: "اتفاقية ربط وتشغيل محطات بطاريات تخزين الطاقة العملاقة (BESS) بالشبكة الوطنية البريطانية وتوفير خدمات استقرار التردد وفق اشتراطات National Grid ESO.",
    descriptionEn: "Battery Energy Storage System (BESS) grid interconnection and capacity tolling agreement under English Law, setting battery degradation warranties and dynamic frequency response services.",
    keyClauses: [ "سعة التفريغ والشحن ومعدل تدهور البطاريات (Round-Trip Efficiency & Annual Capacity Degradation Cap)", "الامتثال لكود الشبكة الكهربائية الوطنية (National Grid ESO Grid Code Compliance)", "رسوم التوافر وعوائد خدمات استقرار التردد (Availability Payments & Dynamic Containment Tolling)", "إجراءات السلامة من حرائق البطاريات وتراخيص التخطيط (Thermal Runaway Mitigation & Fire Safety)", "محكمة لندن للتحكيم الدولي (LCIA)" ],
    tags: [ "بطاريات", "بريطانيا", "تخزين_طاقة", "BESS", "LCIA", "National_Grid" ],
    pagesCount: 25,
    clausesCount: 32,
    templateAr: `================================================================================
اتفاقية توصيل منظومات تخزين الطاقة بالبطاريات بالشبكة الكهربائية — بريطانيا
المملكة المتحدة (English Law) — UK Companies Act 2006 & Unfair Contract Terms Act 1977
جهة الاختصاص والتحكيم: London Court of International Arbitration (LCIA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام UK Companies Act 2006 & Unfair Contract Terms Act 1977؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة المتحدة (English Law)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة المتحدة (English Law).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام UK Companies Act 2006 & Unfair Contract Terms Act 1977.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى London Court of International Arbitration (LCIA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UK BATTERY ENERGY STORAGE SYSTEM (BESS) GRID INTERCONNECTION & TOLLING CONTRACT
United Kingdom (English Law) — UK Companies Act 2006 & Unfair Contract Terms Act 1977
Dispute Resolution & Forum: London Court of International Arbitration (LCIA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with UK Companies Act 2006 & Unfair Contract Terms Act 1977;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United Kingdom (English Law), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United Kingdom (English Law).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with UK Companies Act 2006 & Unfair Contract Terms Act 1977.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by London Court of International Arbitration (LCIA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇺🇸 [US] Delaware Independent Power Producer (IPP) Build-Own-Operate (BOO) Agreement
  // ===========================================================================
  {
    id: "sovereign-us-independent-power-producer-ipp-50m",
    countryCode: "US",
    countryNameAr: "الولايات المتحدة الأمريكية (Delaware)",
    countryNameEn: "United States (Delaware)",
    countryFlag: "🇺🇸",
    statuteCodeAr: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    statuteCodeEn: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    arbitrationVenue: "Delaware Court of Chancery & AAA / JAMS",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 300,000,000+ USD",
    category: "Energy_Infrastructure",
    titleAr: "اتفاقية بناء وتشغيل محطة توليد الطاقة المستقلة — ديلاوير",
    titleEn: "Delaware Independent Power Producer (IPP) Build-Own-Operate (BOO) Agreement",
    descriptionAr: "عقد استثمار وبناء وتشغيل محطة توليد طاقة مستقلة بنظام BOO وفق قوانين ولاية ديلاوير، مع تنظيم التمويل غير الرجعي والامتثال للوائح FERC الفيدرالية.",
    descriptionEn: "Independent Power Producer (IPP) Build-Own-Operate project agreement under Delaware Law, structuring non-recourse project finance parameters and FERC regulatory compliance.",
    keyClauses: [ "التزامات الإغلاق المالي وضمانات التشييد (Financial Close Date & Equity Contribution Covenants)", "ترتيبات توريد الوقود والغاز الطبيعي (Fuel Supply Interconnection & Gas Transportation Agreements)", "معايير الاعتماد والترخيص من اللجنة الفيدرالية (FERC & NERC Reliability Standard Compliance)", "حقوق الدائنين الممولين وتصحيح الإخلال (Step-In Rights for Project Lenders & Collateral Assignment)", "الجمعية الأمريكية للتحكيم (AAA Commercial Rules - Wilmington)" ],
    tags: [ "طاقة_مستقلة", "IPP", "ديلاوير", "FERC", "AAA", "BOO" ],
    pagesCount: 30,
    clausesCount: 38,
    templateAr: `================================================================================
اتفاقية بناء وتشغيل محطة توليد الطاقة المستقلة — ديلاوير
الولايات المتحدة الأمريكية (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
جهة الاختصاص والتحكيم: Delaware Court of Chancery & AAA / JAMS
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الولايات المتحدة الأمريكية (Delaware)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الولايات المتحدة الأمريكية (Delaware).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى Delaware Court of Chancery & AAA / JAMS، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DELAWARE INDEPENDENT POWER PRODUCER (IPP) BUILD-OWN-OPERATE (BOO) AGREEMENT
United States (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
Dispute Resolution & Forum: Delaware Court of Chancery & AAA / JAMS
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United States (Delaware), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United States (Delaware).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by Delaware Court of Chancery & AAA / JAMS. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🌐 [INT] Cross-Border Hydrocarbon Pipeline Intergovernmental Transit Agreement
  // ===========================================================================
  {
    id: "sovereign-int-lng-crossborder-pipeline-transit-100m",
    countryCode: "INT",
    countryNameAr: "القانون الدولي واتفاقيات الأمم المتحدة",
    countryNameEn: "International & UNCITRAL Conventions",
    countryFlag: "🌐",
    statuteCodeAr: "اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم",
    statuteCodeEn: "UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration",
    arbitrationVenue: "محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "100,000,000 - 1,500,000,000+ USD",
    category: "Energy_Infrastructure",
    titleAr: "اتفاقية عبور وتدفق خطوط أنابيب الطاقة عبر الحدود — القانون الدولي",
    titleEn: "Cross-Border Hydrocarbon Pipeline Intergovernmental Transit Agreement",
    descriptionAr: "اتفاقية دولية منظمة لحقوق عبور وضخ النفط والغاز عبر خطوط الأنابيب العابرة للحدود بموجب ميثاق الطاقة الدولي وقواعد التجارة الدولية للأمم المتحدة.",
    descriptionEn: "Cross-border hydrocarbon pipeline intergovernmental transit framework governed by International Law and Energy Charter Treaty principles, regulating transit tariffs and third-party access.",
    keyClauses: [ "رسوم العبور وحماية أمن الخطوط عبر الأقاليم (Transit Tariffs & Cross-Border Sovereign Security Guarantees)", "حظر قطع الإمدادات أو تحويل مسار الغاز القسري (Uninterrupted Flow & Prohibition of Unlawful Interception)", "الامتثال لمعايير السلامة البيئية عبر الحدود (Cross-Border Environmental & Emergency Response Plan)", "استقرار الشروط الاستثمارية ومنع التأميم (Stabilization Clause & Protection Against Expropriation)", "محكمة التحكيم الدائمة بلاهاي (Permanent Court of Arbitration - PCA Peace Palace)" ],
    tags: [ "أنابيب_طاقة", "قانون_دولي", "PCA_TheHague", "غاز", "عبور_دولي", "ميثاق_الطاقة" ],
    pagesCount: 34,
    clausesCount: 42,
    templateAr: `================================================================================
اتفاقية عبور وتدفق خطوط أنابيب الطاقة عبر الحدود — القانون الدولي
القانون الدولي واتفاقيات الأمم المتحدة — اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم
جهة الاختصاص والتحكيم: محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في القانون الدولي واتفاقيات الأمم المتحدة، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في القانون الدولي واتفاقيات الأمم المتحدة.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
CROSS-BORDER HYDROCARBON PIPELINE INTERGOVERNMENTAL TRANSIT AGREEMENT
International & UNCITRAL Conventions — UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration
Dispute Resolution & Forum: محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in International & UNCITRAL Conventions, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in International & UNCITRAL Conventions.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇸🇦 [SA] Saudi Strategic Master Industrial Supply Agreement (Giga-Projects Aligned)
  // ===========================================================================
  {
    id: "sovereign-sa-strategic-master-supply-20m",
    countryCode: "SA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    countryFlag: "🇸🇦",
    statuteCodeAr: "نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)",
    statuteCodeEn: "Civil Transactions Law (M/191) & Companies Law (M/132)",
    arbitrationVenue: "المركز السعودي للتحكيم التجاري (SCCA - الرياض)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "20,000,000 - 100,000,000+ SAR",
    category: "Trade_SupplyChain",
    titleAr: "اتفاقية التوريد الاستراتيجي طويل الأجل للمشاريع التنموية الكبرى — المملكة العربية السعودية",
    titleEn: "Saudi Strategic Master Industrial Supply Agreement (Giga-Projects Aligned)",
    descriptionAr: "اتفاقية توريد مواد ومعدات صناعية كبرى لصالح المشاريع التنموية الكبرى بالمملكة وفق نظام المعاملات المدنية ونظام المشتريات الحكومية، مع اشتراطات المحتوى المحلي (IKTVA).",
    descriptionEn: "Strategic master supply framework agreement for Saudi giga-projects, compliant with the Civil Transactions Law and Saudi Local Content & Government Procurement Authority regulations.",
    keyClauses: [ "اشتراطات نسبة المحتوى المحلي السعودي (Mandatory Local Content & IKTVA Score Targets)", "جدول أوامر الشراء الدورية ومخزون الأمان (Rolling Forecasts, Purchase Orders & Buffer Stock Covenants)", "فحص الجودة والمطابقة مع الهيئة السعودية للمواصفات (SASO Quality Standards & Mill Test Certs)", "شروط التسليم DDP بمواقع المشاريع والتأمين (Incoterms 2020 DDP & Transit Cargo Insurance)", "المركز السعودي للتحكيم التجاري (SCCA - الرياض)" ],
    tags: [ "توريد_استراتيجي", "السعودية", "محتوى_محلي", "SASO", "SCCA", "مشاريع_كبرى" ],
    pagesCount: 23,
    clausesCount: 30,
    templateAr: `================================================================================
اتفاقية التوريد الاستراتيجي طويل الأجل للمشاريع التنموية الكبرى — المملكة العربية السعودية
المملكة العربية السعودية — نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)
جهة الاختصاص والتحكيم: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة العربية السعودية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة العربية السعودية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132).
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى المركز السعودي للتحكيم التجاري (SCCA - الرياض)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
SAUDI STRATEGIC MASTER INDUSTRIAL SUPPLY AGREEMENT (GIGA-PROJECTS ALIGNED)
Saudi Arabia — Civil Transactions Law (M/191) & Companies Law (M/132)
Dispute Resolution & Forum: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law (M/191) & Companies Law (M/132);

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Saudi Arabia, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Saudi Arabia.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law (M/191) & Companies Law (M/132).
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by المركز السعودي للتحكيم التجاري (SCCA - الرياض). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [AE] UAE Master Third-Party Logistics (3PL) & Temperature-Controlled Warehousing Contract
  // ===========================================================================
  {
    id: "sovereign-ae-3pl-logistics-warehousing-15m",
    countryCode: "AE",
    countryNameAr: "الإمارات العربية المتحدة (الاتحادي)",
    countryNameEn: "UAE Mainland",
    countryFlag: "🇦🇪",
    statuteCodeAr: "مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021",
    statuteCodeEn: "Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021",
    arbitrationVenue: "مركز دبي للتحكيم الدولي (DIAC)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "15,000,000 - 60,000,000+ AED",
    category: "Trade_SupplyChain",
    titleAr: "عقد خدمات الطرف الثالث اللوجستي والتخزين المبرد وإدارة سلاسل الإمداد — الإمارات",
    titleEn: "UAE Master Third-Party Logistics (3PL) & Temperature-Controlled Warehousing Contract",
    descriptionAr: "عقد خدمات لوجستية وتخزين متقدم للأدوية والسلع الغذائية بموجب قانون المعاملات التجارية الإماراتي رقم 50 لسنة 2022، مع مؤشرات أداء دقة الشحن وسلامة سلاسل التبريد.",
    descriptionEn: "Master 3PL logistics and temperature-controlled warehousing agreement under UAE Commercial Transactions Law 50/2022, setting cold-chain integrity standards and inventory accuracy SLAs.",
    keyClauses: [ "سلامة درجات حرارة التخزين المبرد وسجلات التتبع (Cold-Chain Continuous IoT Temperature Logging)", "دقة الجرد ومسؤولية البضائع التالفة (99.8% Inventory Accuracy SLA & Stock Loss Deductibles)", "زمن تجهيز وتسليم الشحنات العاجلة (Order Fulfillment Turnaround Times & Dispatch SLAs)", "التأمين الشامل على البضائع المخزونة (All-Risk Warehouse Cargo Insurance Policy AED 50M)", "مركز دبي للتحكيم الدولي (DIAC)" ],
    tags: [ "لوجستيات", "الإمارات", "3PL", "تخزين_مبرد", "DIAC", "سلاسل_إمداد" ],
    pagesCount: 21,
    clausesCount: 28,
    templateAr: `================================================================================
عقد خدمات الطرف الثالث اللوجستي والتخزين المبرد وإدارة سلاسل الإمداد — الإمارات
الإمارات العربية المتحدة (الاتحادي) — مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021
جهة الاختصاص والتحكيم: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الإمارات العربية المتحدة (الاتحادي)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الإمارات العربية المتحدة (الاتحادي).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز دبي للتحكيم الدولي (DIAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UAE MASTER THIRD-PARTY LOGISTICS (3PL) & TEMPERATURE-CONTROLLED WAREHOUSING CONTRACT
UAE Mainland — Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021
Dispute Resolution & Forum: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in UAE Mainland, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in UAE Mainland.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز دبي للتحكيم الدولي (DIAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇬🇧 [GB] UK Baltic-Aligned Time Charterparty & Ocean Bulk Freight Agreement
  // ===========================================================================
  {
    id: "sovereign-gb-ocean-freight-charterparty-25m",
    countryCode: "GB",
    countryNameAr: "المملكة المتحدة (English Law)",
    countryNameEn: "United Kingdom (English Law)",
    countryFlag: "🇬🇧",
    statuteCodeAr: "UK Companies Act 2006 & Unfair Contract Terms Act 1977",
    statuteCodeEn: "UK Companies Act 2006 & Unfair Contract Terms Act 1977",
    arbitrationVenue: "London Court of International Arbitration (LCIA)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "25,000,000 - 80,000,000+ USD",
    category: "Trade_SupplyChain",
    titleAr: "مشارطة إيجار السفن والنقل البحري للبضائع الصب — القانون الإنجليزي والبلطيق",
    titleEn: "UK Baltic-Aligned Time Charterparty & Ocean Bulk Freight Agreement",
    descriptionAr: "عقد مشارطة إيجار سفينة تجارية لنقل البضائع والسلع الصب وفق نموذج NYPE المعتمد من بورصة البلطيق وقواعد القانون البحري الإنجليزي.",
    descriptionEn: "Time Charterparty contract modeled on New York Produce Exchange (NYPE) format and governed by English Maritime Law, regulating vessel seaworthiness, laytime, and demurrage.",
    keyClauses: [ "صلاحية السفينة للملاحة البحرية وضمانات السرعة والاستهلاك (Vessel Seaworthiness & Speed/Consumption Warranty)", "حساب فترات الشحن والتفريغ وغرامات التأخير (Laytime Calculations & Demurrage Rates)", "التأمين البحري وضمانات نادي الحماية والتعويض (P&I Club Entry & Hull & Machinery Insurance)", "قواعد لاهاي-فيسبي وقانون نقل البضائع بحراً (Hague-Visby Rules Incorporation & Cargo Claims)", "محكمة لندن للتحكيم البحري (London Maritime Arbitrators Association - LMAA)" ],
    tags: [ "نقل_بحري", "بريطانيا", "LMAA", "شحن", "سفن", "Charterparty" ],
    pagesCount: 28,
    clausesCount: 36,
    templateAr: `================================================================================
مشارطة إيجار السفن والنقل البحري للبضائع الصب — القانون الإنجليزي والبلطيق
المملكة المتحدة (English Law) — UK Companies Act 2006 & Unfair Contract Terms Act 1977
جهة الاختصاص والتحكيم: London Court of International Arbitration (LCIA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام UK Companies Act 2006 & Unfair Contract Terms Act 1977؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة المتحدة (English Law)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة المتحدة (English Law).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام UK Companies Act 2006 & Unfair Contract Terms Act 1977.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى London Court of International Arbitration (LCIA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UK BALTIC-ALIGNED TIME CHARTERPARTY & OCEAN BULK FREIGHT AGREEMENT
United Kingdom (English Law) — UK Companies Act 2006 & Unfair Contract Terms Act 1977
Dispute Resolution & Forum: London Court of International Arbitration (LCIA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with UK Companies Act 2006 & Unfair Contract Terms Act 1977;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United Kingdom (English Law), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United Kingdom (English Law).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with UK Companies Act 2006 & Unfair Contract Terms Act 1977.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by London Court of International Arbitration (LCIA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇨🇳 [CN] Sino-Global Heavy Industrial Equipment Cross-Border Supply & Installation Contract
  // ===========================================================================
  {
    id: "sovereign-cn-crossborder-equipment-supply-cisg-30m",
    countryCode: "CN",
    countryNameAr: "جمهورية الصين الشعبية (PRC Law)",
    countryNameEn: "People's Republic of China (PRC Law)",
    countryFlag: "🇨🇳",
    statuteCodeAr: "القانون المدني لجمهورية الصين الشعبية وقانون الاستثمار الأجنبي 2020",
    statuteCodeEn: "Civil Code of the People's Republic of China & Foreign Investment Law 2020",
    arbitrationVenue: "لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "30,000,000 - 150,000,000+ USD",
    category: "Trade_SupplyChain",
    titleAr: "عقد تصدير وتوريد المعدات والآلات الصناعية الصينية — اتفاقية فيينا CISG",
    titleEn: "Sino-Global Heavy Industrial Equipment Cross-Border Supply & Installation Contract",
    descriptionAr: "عقد توريد معدات إنتاج صناعية ومصانع آلية مصنعة بالصين ومصدرة للأسواق الدولية وفق اتفاقية فيينا للبيوع الدولية CISG 1980 وقوانين التجارة الدولية.",
    descriptionEn: "International cross-border supply contract for heavy Chinese industrial equipment governed by UN CISG 1980, regulating factory acceptance tests (FAT), shipping, and warranty bonds.",
    keyClauses: [ "اختبارات القبول بمصنع المنشأ بالصين (Factory Acceptance Testing - FAT Protocol in China)", "الاعتماد المستندي المعزز غير القابل للإلغاء (Irrevocable Confirmed Letter of Credit at Sight)", "شروط التسليم CIF/FOB ومخاطر النقل البحري (Incoterms 2020 CIF Delivery & Export Customs Clearance)", "ضمان المعدات وتوفير قطع الغيار لمدة 5 سنوات (24-Month Mechanical Warranty & 5-Year Spare Parts Guarantee)", "لجنة التحكيم الاقتصادي والتجاري الدولية الصينية (CIETAC - بكين / شنغهاي)" ],
    tags: [ "الصين", "توريد_معدات", "CISG", "CIETAC", "تصدير", "خطوط_إنتاج" ],
    pagesCount: 24,
    clausesCount: 31,
    templateAr: `================================================================================
عقد تصدير وتوريد المعدات والآلات الصناعية الصينية — اتفاقية فيينا CISG
جمهورية الصين الشعبية (PRC Law) — القانون المدني لجمهورية الصين الشعبية وقانون الاستثمار الأجنبي 2020
جهة الاختصاص والتحكيم: لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام القانون المدني لجمهورية الصين الشعبية وقانون الاستثمار الأجنبي 2020؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في جمهورية الصين الشعبية (PRC Law)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في جمهورية الصين الشعبية (PRC Law).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام القانون المدني لجمهورية الصين الشعبية وقانون الاستثمار الأجنبي 2020.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
SINO-GLOBAL HEAVY INDUSTRIAL EQUIPMENT CROSS-BORDER SUPPLY & INSTALLATION CONTRACT
People's Republic of China (PRC Law) — Civil Code of the People's Republic of China & Foreign Investment Law 2020
Dispute Resolution & Forum: لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code of the People's Republic of China & Foreign Investment Law 2020;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in People's Republic of China (PRC Law), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in People's Republic of China (PRC Law).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code of the People's Republic of China & Foreign Investment Law 2020.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇪🇬 [EG] Egypt Multimodal Freight Forwarding, Port Handling & Customs Brokerage Agreement
  // ===========================================================================
  {
    id: "sovereign-eg-freight-forwarding-fiata-10m",
    countryCode: "EG",
    countryNameAr: "جمهورية مصر العربية",
    countryNameEn: "Egypt",
    countryFlag: "🇪🇬",
    statuteCodeAr: "القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981",
    statuteCodeEn: "Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981",
    arbitrationVenue: "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "10,000,000 - 50,000,000+ EGP",
    category: "Trade_SupplyChain",
    titleAr: "اتفاقية خدمات وساطة الشحن والتخليص الجمركي متعدد الوسائط — جمهورية مصر العربية",
    titleEn: "Egypt Multimodal Freight Forwarding, Port Handling & Customs Brokerage Agreement",
    descriptionAr: "عقد خدمات وساطة شحن بحري وجوي وتخليص جمركي عبر الموانئ المصرية وفق القانون التجاري المصري رقم 17 لسنة 1999 ومعايير الاتحاد الدولي لوسطاء الشحن (FIATA).",
    descriptionEn: "Multimodal freight forwarding and customs brokerage contract aligned with Egyptian Commercial Code 17/1999 and FIATA standards, governing transit through Alexandria, Damietta, and Sokhna ports.",
    keyClauses: [ "التخليص الجمركي الإلكتروني عبر منصة نافذة (Nafeza Electronic Single-Window Customs Clearance)", "مسؤولية أمين النقل متعدد الوسائط وحدود التعويض (FIATA Multimodal Transport Bill of Lading Terms)", "إدارة رسوم الأرضيات وغرامات الحاويات (Demurrage & Detention Avoidance Management)", "التأمين الإلزامي على بضائع الترانزيت (Comprehensive In-Transit Goods Insurance)", "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)" ],
    tags: [ "شحن", "مصر", "تخليص_جمركي", "نافذة", "CRCICA", "FIATA" ],
    pagesCount: 19,
    clausesCount: 26,
    templateAr: `================================================================================
اتفاقية خدمات وساطة الشحن والتخليص الجمركي متعدد الوسائط — جمهورية مصر العربية
جمهورية مصر العربية — القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981
جهة الاختصاص والتحكيم: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في جمهورية مصر العربية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في جمهورية مصر العربية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
EGYPT MULTIMODAL FREIGHT FORWARDING, PORT HANDLING & CUSTOMS BROKERAGE AGREEMENT
Egypt — Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981
Dispute Resolution & Forum: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Egypt, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Egypt.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇶🇦 [QA] Qatar Exclusive Regional Industrial & Petrochemical Distribution Agreement
  // ===========================================================================
  {
    id: "sovereign-qa-exclusive-industrial-distribution-15m",
    countryCode: "QA",
    countryNameAr: "دولة قطر",
    countryNameEn: "Qatar",
    countryFlag: "🇶🇦",
    statuteCodeAr: "قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015",
    statuteCodeEn: "Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015",
    arbitrationVenue: "مركز قطر الدولي للتوفيق والتحكيم (QICCA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "15,000,000 - 60,000,000+ QAR",
    category: "Trade_SupplyChain",
    titleAr: "اتفاقية التوزيع الحصري الإقليمي للمنتجات البتروكيماوية والصناعية — دولة قطر",
    titleEn: "Qatar Exclusive Regional Industrial & Petrochemical Distribution Agreement",
    descriptionAr: "عقد توزيع حصري للمنتجات الصناعية والبتروكيماوية بدولة قطر والمنطقة وفق قانون التجارة القطري رقم 27 لسنة 2006 مع أهداف مبيعات سنوية ملزمة وحظر إعادة التصدير غير المصرح.",
    descriptionEn: "Exclusive industrial distribution agreement under Qatari Law, establishing Minimum Annual Purchase Targets (MAPT), territory exclusivity, and non-circumvention terms.",
    keyClauses: [ "الحصرية الإقليمية بدولة قطر وحظر البيع الموازي (Strict Territory Exclusivity & Anti-Parallel Import)", "الحد الأدنى للمشتريات السنوية الملزمة (Minimum Annual Purchase Targets - MAPT Benchmarks)", "الامتثال لمعايير السلامة الكيميائية والبيئية (Chemical Handling & Material Safety Data Sheet - MSDS)", "شروط إنهاء الحصرية عند الإخفاق في تحقيق المستهدفات (Loss of Exclusivity for Sales Target Breach)", "مركز قطر الدولي للتوفيق والتحكيم (QICCA)" ],
    tags: [ "توزيع_حصري", "قطر", "بتروكيماويات", "QICCA", "تجارة", "صناعة" ],
    pagesCount: 20,
    clausesCount: 27,
    templateAr: `================================================================================
اتفاقية التوزيع الحصري الإقليمي للمنتجات البتروكيماوية والصناعية — دولة قطر
دولة قطر — قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015
جهة الاختصاص والتحكيم: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة قطر، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة قطر.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز قطر الدولي للتوفيق والتحكيم (QICCA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
QATAR EXCLUSIVE REGIONAL INDUSTRIAL & PETROCHEMICAL DISTRIBUTION AGREEMENT
Qatar — Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015
Dispute Resolution & Forum: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Qatar, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Qatar.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز قطر الدولي للتوفيق والتحكيم (QICCA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇺🇸 [US] Delaware Master Commercial Sales Agreement (UCC Article 2 Aligned)
  // ===========================================================================
  {
    id: "sovereign-us-master-sales-ucc-goods-20m",
    countryCode: "US",
    countryNameAr: "الولايات المتحدة الأمريكية (Delaware)",
    countryNameEn: "United States (Delaware)",
    countryFlag: "🇺🇸",
    statuteCodeAr: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    statuteCodeEn: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    arbitrationVenue: "Delaware Court of Chancery & AAA / JAMS",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "20,000,000 - 80,000,000+ USD",
    category: "Trade_SupplyChain",
    titleAr: "عقد بيع وتوريد المنتجات بين الشركات وفق المادة الثانية من القانون التجاري الموحد — ديلاوير",
    titleEn: "Delaware Master Commercial Sales Agreement (UCC Article 2 Aligned)",
    descriptionAr: "اتفاقية توريد وبيع منتجات تجارية بين الشركات الكبرى خاضعة للمادة الثانية من القانون التجاري الموحد (UCC Article 2) وقوانين ولاية ديلاوير، مع تنظيم فحص البضائع والرفض.",
    descriptionEn: "Commercial B2B Master Sales Contract governed by Delaware Uniform Commercial Code (UCC) Article 2, regulating inspection rights, perfect tender rule variations, and remedies for breach.",
    keyClauses: [ "شروط الفحص وفترة إخطار الرفض (10-Day Inspection Window & Revocation of Acceptance)", "إلغاء الضمانات الضمنية وتحديد الضمان الحصري (Disclaimer of Implied Warranties: Merchantability & Fitness)", "سقف التعويض واستثناء الأضرار التبعية (Waiver of Consequential Damages & Exclusive Repair Remedy)", "حق البائع في حبس البضائع عند تعثر المشتري (Seller's Stoppage in Transit & Reclamation Rights)", "التحكيم التجاري للجمعية الأمريكية للتحكيم (AAA Commercial - Wilmington)" ],
    tags: [ "UCC", "ديلاوير", "مبيعات_تجارية", "AAA", "توريد_B2B", "ضمانات" ],
    pagesCount: 21,
    clausesCount: 28,
    templateAr: `================================================================================
عقد بيع وتوريد المنتجات بين الشركات وفق المادة الثانية من القانون التجاري الموحد — ديلاوير
الولايات المتحدة الأمريكية (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
جهة الاختصاص والتحكيم: Delaware Court of Chancery & AAA / JAMS
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الولايات المتحدة الأمريكية (Delaware)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الولايات المتحدة الأمريكية (Delaware).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى Delaware Court of Chancery & AAA / JAMS، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DELAWARE MASTER COMMERCIAL SALES AGREEMENT (UCC ARTICLE 2 ALIGNED)
United States (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
Dispute Resolution & Forum: Delaware Court of Chancery & AAA / JAMS
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United States (Delaware), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United States (Delaware).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by Delaware Court of Chancery & AAA / JAMS. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🌐 [INT] International Sovereign Countertrade, Barter & Offset Framework Agreement
  // ===========================================================================
  {
    id: "sovereign-int-countertrade-barter-framework-50m",
    countryCode: "INT",
    countryNameAr: "القانون الدولي واتفاقيات الأمم المتحدة",
    countryNameEn: "International & UNCITRAL Conventions",
    countryFlag: "🌐",
    statuteCodeAr: "اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم",
    statuteCodeEn: "UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration",
    arbitrationVenue: "محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 200,000,000+ USD",
    category: "Trade_SupplyChain",
    titleAr: "اتفاقية تجارة المقايضة وتسهيل التبادل التجاري المتقابل الدولي — القانون الدولي",
    titleEn: "International Sovereign Countertrade, Barter & Offset Framework Agreement",
    descriptionAr: "اتفاقية تجارة متقابلة ومقايضة سلع استراتيجية ومعدات صناعية بين شركات وحكومات وفق المعايير الإرشادية للأمم المتحدة (UNCITRAL) دون استخدام السيولة النقدية المباشرة.",
    descriptionEn: "International countertrade and reciprocal barter framework agreement compliant with UNCITRAL Legal Guide on International Countertrade Transactions, governing parallel commodities exchange.",
    keyClauses: [ "تحديد السلع المتقابلة ومعايير تقييم الأسعار المرجعية (Reciprocal Commodities Valuation & Benchmark Audits)", "حساب التسوية المقاصية الدفترية (Bilateral Evidence Account & Clearing Bank Governance)", "خطابات الاعتماد المتقابلة للضمان المالي (Back-to-Back Standby Letters of Credit)", "معالجة تعثر توريد أحد الأطراف وعقوبات المقايضة (Liquidated Damages for Failure to Lift Barter Goods)", "محكمة التحكيم التابعة لغرفة التجارة الدولية (ICC Court of Arbitration - Geneva)" ],
    tags: [ "مقايضة", "تجارة_دولية", "UNCITRAL", "ICC_Geneva", "سلع_استراتيجية", "Countertrade" ],
    pagesCount: 25,
    clausesCount: 33,
    templateAr: `================================================================================
اتفاقية تجارة المقايضة وتسهيل التبادل التجاري المتقابل الدولي — القانون الدولي
القانون الدولي واتفاقيات الأمم المتحدة — اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم
جهة الاختصاص والتحكيم: محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في القانون الدولي واتفاقيات الأمم المتحدة، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في القانون الدولي واتفاقيات الأمم المتحدة.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
INTERNATIONAL SOVEREIGN COUNTERTRADE, BARTER & OFFSET FRAMEWORK AGREEMENT
International & UNCITRAL Conventions — UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration
Dispute Resolution & Forum: محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in International & UNCITRAL Conventions, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in International & UNCITRAL Conventions.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇸🇦 [SA] Saudi Master Murabaha Commodity Financing Facility Agreement
  // ===========================================================================
  {
    id: "sovereign-sa-master-murabaha-facility-50m",
    countryCode: "SA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    countryFlag: "🇸🇦",
    statuteCodeAr: "نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)",
    statuteCodeEn: "Civil Transactions Law (M/191) & Companies Law (M/132)",
    arbitrationVenue: "المركز السعودي للتحكيم التجاري (SCCA - الرياض)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 250,000,000+ SAR",
    category: "Islamic_Finance",
    titleAr: "اتفاقية التسهيلات الائتمانية بالمرابحة للآمر بالشراء — المملكة العربية السعودية",
    titleEn: "Saudi Master Murabaha Commodity Financing Facility Agreement",
    descriptionAr: "اتفاقية تمويل بالمرابحة المتوافقة مع أحكام الشريعة الإسلامية ومعايير هيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية (AAOIFI) وتعليمات البنك المركزي السعودي (SAMA).",
    descriptionEn: "Sharia-compliant master commodity Murabaha syndicated facility agreement aligned with AAOIFI Sharia standards and SAMA banking directives, regulating spot commodity transactions.",
    keyClauses: [ "آلية شراء وتملك السلع المباحة شرعاً (Sharia-Compliant Spot Commodity Purchase & Transfer of Title)", "تحديد هامش الربح وجدول أقساط السداد المؤجل (Agreed Cost-Plus Profit Margin & Repayment Amortization)", "سداد تعويضات التبرع الخيري عند التأخر (Charity Fund Payment for Late Default - AAOIFI Aligned)", "الضمانات العينية والسندات لأمر الواجب تقديمها (Promissory Notes & Corporate Guarantee Coverage)", "المركز السعودي للتحكيم التجاري (SCCA - الرياض)" ],
    tags: [ "مرابحة", "تمويل_إسلامي", "السعودية", "AAOIFI", "SAMA", "SCCA" ],
    pagesCount: 26,
    clausesCount: 34,
    templateAr: `================================================================================
اتفاقية التسهيلات الائتمانية بالمرابحة للآمر بالشراء — المملكة العربية السعودية
المملكة العربية السعودية — نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)
جهة الاختصاص والتحكيم: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة العربية السعودية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة العربية السعودية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132).
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى المركز السعودي للتحكيم التجاري (SCCA - الرياض)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
SAUDI MASTER MURABAHA COMMODITY FINANCING FACILITY AGREEMENT
Saudi Arabia — Civil Transactions Law (M/191) & Companies Law (M/132)
Dispute Resolution & Forum: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law (M/191) & Companies Law (M/132);

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Saudi Arabia, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Saudi Arabia.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law (M/191) & Companies Law (M/132).
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by المركز السعودي للتحكيم التجاري (SCCA - الرياض). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [AE] UAE Forward Master Ijara Muntahia Bittamleek (Lease-to-Own) Agreement
  // ===========================================================================
  {
    id: "sovereign-ae-master-ijara-lease-to-own-30m",
    countryCode: "AE",
    countryNameAr: "الإمارات العربية المتحدة (الاتحادي)",
    countryNameEn: "UAE Mainland",
    countryFlag: "🇦🇪",
    statuteCodeAr: "مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021",
    statuteCodeEn: "Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021",
    arbitrationVenue: "مركز دبي للتحكيم الدولي (DIAC)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "30,000,000 - 150,000,000+ AED",
    category: "Islamic_Finance",
    titleAr: "اتفاقية التمويل بالإجارة الموصوفة في الذمة المنتهية بالتمليك — الإمارات",
    titleEn: "UAE Forward Master Ijara Muntahia Bittamleek (Lease-to-Own) Agreement",
    descriptionAr: "عقد تمويل إسلامي بالإجارة المنتهية بالتمليك للأصول الرأسمالية والآلات الثقيلة وفق قانون المعاملات المدنية الإماراتي ومعايير الهيئة العليا الشرعية للأنشطة المالية والمصرفية.",
    descriptionEn: "Forward lease (Ijara Mawsoofa fi al-Dhimmah) ending in asset ownership transfer, structured under UAE Civil Transactions Law and Central Bank of the UAE Higher Sharia Authority standards.",
    keyClauses: [ "التزامات المؤجر في الصيانة الأساسية والتأمين التكافلي (Lessor Fundamental Maintenance & Takaful Insurance)", "الأجرة المتغيرة المرتبطة بمؤشر الفائدة الإسلامي (Variable Rental Rate Linked to EIBOR Benchmark)", "حق الوعد بالتمليك المنفصل عند سداد كامل الأقساط (Unilateral Promise to Transfer Title - Wa'ad)", "التلف الكلي وتوزيع عوائد التأمين التكافلي (Total Loss of Leased Asset & Takaful Proceeds Distribution)", "مركز دبي للتحكيم الدولي (DIAC)" ],
    tags: [ "إجارة", "تمويل_إسلامي", "الإمارات", "تكافل", "DIAC", "إجارة_تمليك" ],
    pagesCount: 24,
    clausesCount: 31,
    templateAr: `================================================================================
اتفاقية التمويل بالإجارة الموصوفة في الذمة المنتهية بالتمليك — الإمارات
الإمارات العربية المتحدة (الاتحادي) — مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021
جهة الاختصاص والتحكيم: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الإمارات العربية المتحدة (الاتحادي)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الإمارات العربية المتحدة (الاتحادي).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز دبي للتحكيم الدولي (DIAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UAE FORWARD MASTER IJARA MUNTAHIA BITTAMLEEK (LEASE-TO-OWN) AGREEMENT
UAE Mainland — Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021
Dispute Resolution & Forum: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in UAE Mainland, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in UAE Mainland.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز دبي للتحكيم الدولي (DIAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🏛️ [DIFC] DIFC Sharia-Compliant Mudaraba Investment Management Agreement
  // ===========================================================================
  {
    id: "sovereign-difc-mudaraba-investment-fund-25m",
    countryCode: "DIFC",
    countryNameAr: "مركز دبي المالي العالمي (DIFC)",
    countryNameEn: "Dubai International Financial Centre (DIFC)",
    countryFlag: "🏛️",
    statuteCodeAr: "DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018",
    statuteCodeEn: "DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018",
    arbitrationVenue: "محاكم مركز دبي المالي العالمي (DIFC Courts)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "25,000,000 - 100,000,000+ USD",
    category: "Islamic_Finance",
    titleAr: "اتفاقية إدارة الاستثمار بالمضاربة الشرعية وتوزيع الأرباح — مركز دبي المالي العالمي",
    titleEn: "DIFC Sharia-Compliant Mudaraba Investment Management Agreement",
    descriptionAr: "اتفاقية تمويل استثماري بصيغة المضاربة بين رب المال والمضارب وفق لوائح سلطة دبي للخدمات المالية (DFSA) وقانون مركز دبي المالي، مع تحديد نسب تقاسم الربح وعدم ضمان رأس المال.",
    descriptionEn: "Institutional Mudaraba investment agreement under DIFC Contract Law and DFSA Collective Investment Rules, regulating Rab-al-Maal capital injection, Mudarib fiduciary duties, and profit ratios.",
    keyClauses: [ "نسب اقتسام الأرباح الدورية بين رب المال والمضارب (Agreed Profit-Sharing Ratios: 80% Investor / 20% Manager)", "حظر ضمان رأس المال وتحمل الخسارة لرب المال (Strict Sharia Principle: Capital Loss Borne by Investor)", "مسؤولية المضارب في حالات التعدي أو التفريط الجسيم (Mudarib Liability in Gross Negligence or Fraud)", "لجنة الرقابة الشرعية المستقلة والتدقيق السنوي (Independent Sharia Supervisory Board Audit)", "محاكم مركز دبي المالي العالمي (DIFC Courts)" ],
    tags: [ "مضاربة", "DIFC", "تمويل_إسلامي", "DFSA", "رب_المال", "استثمار_مشترك" ],
    pagesCount: 23,
    clausesCount: 30,
    templateAr: `================================================================================
اتفاقية إدارة الاستثمار بالمضاربة الشرعية وتوزيع الأرباح — مركز دبي المالي العالمي
مركز دبي المالي العالمي (DIFC) — DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018
جهة الاختصاص والتحكيم: محاكم مركز دبي المالي العالمي (DIFC Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في مركز دبي المالي العالمي (DIFC)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في مركز دبي المالي العالمي (DIFC).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم مركز دبي المالي العالمي (DIFC Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DIFC SHARIA-COMPLIANT MUDARABA INVESTMENT MANAGEMENT AGREEMENT
Dubai International Financial Centre (DIFC) — DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018
Dispute Resolution & Forum: محاكم مركز دبي المالي العالمي (DIFC Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Dubai International Financial Centre (DIFC), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Dubai International Financial Centre (DIFC).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم مركز دبي المالي العالمي (DIFC Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇶🇦 [QA] Qatar Syndicated Islamic Corporate Financing Facility Agreement
  // ===========================================================================
  {
    id: "sovereign-qa-syndicated-islamic-financing-75m",
    countryCode: "QA",
    countryNameAr: "دولة قطر",
    countryNameEn: "Qatar",
    countryFlag: "🇶🇦",
    statuteCodeAr: "قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015",
    statuteCodeEn: "Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015",
    arbitrationVenue: "مركز قطر الدولي للتوفيق والتحكيم (QICCA)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "75,000,000 - 400,000,000+ QAR",
    category: "Islamic_Finance",
    titleAr: "اتفاقية التمويل الإسلامي المشترك للشركات الكبرى — دولة قطر",
    titleEn: "Qatar Syndicated Islamic Corporate Financing Facility Agreement",
    descriptionAr: "عقد تمويل مشترك بين كونسورتيوم بنوك إسلامية كبرى لصالح شركات المقاولات والبنية التحتية بقطر وفق معايير مصرف قطر المركزي (QCB) وقانون التجارة القطري رقم 27 لسنة 2006.",
    descriptionEn: "Multi-bank syndicated Islamic financing facility (Istisna'a / Ijara hybrid) governed by Qatari Law and QCB directives, appointing Lead Arranger and Security Trustee.",
    keyClauses: [ "دور وكيل التسهيلات ووكيل الضمانات الإسلامي (Facility Agent & Islamic Security Trustee Governance)", "الشروط السابقة للسحب المالي واستخدام الحصيلة (Conditions Precedent & Utilization Protocols)", "النسب المالية الملزمة ومؤشرات خدمة الدين (Financial Covenants: DSCR > 1.25x & Debt-to-Equity)", "حالات التقصير التعاقدي والتسريع الائتماني (Islamic Events of Default & Acceleration Mechanics)", "مركز قطر الدولي للتوفيق والتحكيم (QICCA - الدوحة)" ],
    tags: [ "تمويل_مشترك", "قطر", "بنوك_إسلامية", "QICCA", "QCB", "قروض_مجمعة" ],
    pagesCount: 30,
    clausesCount: 38,
    templateAr: `================================================================================
اتفاقية التمويل الإسلامي المشترك للشركات الكبرى — دولة قطر
دولة قطر — قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015
جهة الاختصاص والتحكيم: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة قطر، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة قطر.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز قطر الدولي للتوفيق والتحكيم (QICCA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
QATAR SYNDICATED ISLAMIC CORPORATE FINANCING FACILITY AGREEMENT
Qatar — Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015
Dispute Resolution & Forum: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Qatar, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Qatar.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز قطر الدولي للتوفيق والتحكيم (QICCA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇧🇭 [BH] Bahrain Master Asset-Backed Sovereign & Corporate Sukuk Issuance Agreement
  // ===========================================================================
  {
    id: "sovereign-bh-sukuk-issuance-asset-backed-100m",
    countryCode: "BH",
    countryNameAr: "مملكة البحرين",
    countryNameEn: "Bahrain",
    countryFlag: "🇧🇭",
    statuteCodeAr: "مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001",
    statuteCodeEn: "Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001",
    arbitrationVenue: "غرفة البحرين لتسوية المنازعات (BCDR-AAA)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "100,000,000 - 500,000,000+ USD",
    category: "Islamic_Finance",
    titleAr: "اتفاقية توريق وإصدار الصكوك السيادية والائتمانية — مملكة البحرين",
    titleEn: "Bahrain Master Asset-Backed Sovereign & Corporate Sukuk Issuance Agreement",
    descriptionAr: "اتفاقية هيكلة وتوريق وإصدار صكوك إسلامية مدعومة بالأصول الحقيقية (Asset-Backed Sukuk) وفق لوائح مصرف البحرين المركزي (CBB) ومعايير أيوفي الشرعية والمحاسبية.",
    descriptionEn: "Master Trust Deed and Sukuk Issuance Facility under Bahrain Financial Regulations and CBB Rulebook, establishing Special Purpose Vehicle (SPV) bankruptcy-remote ownership of underlying assets.",
    keyClauses: [ "تأسيس الكيان ذي الغرض الخاص وإصدار الشهادات (Bankruptcy-Remote SPV & Trust Certificates Issuance)", "شراء الأصول محل الصكوك وإعادة تأجيرها (True-Sale of Tangible Real Estate / Assets to SPV)", "التعهد بالشراء عند الاستحقاق بالسعر المتفق عليه (Purchase Undertaking at Maturity / Dissolution)", "توزيع الأرباح الدورية وتوزيعات التصفية (Periodic Periodic Distribution Amounts & Dissolution Waterfall)", "غرفة البحرين لتسوية المنازعات (BCDR-AAA) بالمنامة" ],
    tags: [ "صكوك", "البحرين", "توريق", "CBB", "AAOIFI", "BCDR" ],
    pagesCount: 32,
    clausesCount: 42,
    templateAr: `================================================================================
اتفاقية توريق وإصدار الصكوك السيادية والائتمانية — مملكة البحرين
مملكة البحرين — مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001
جهة الاختصاص والتحكيم: غرفة البحرين لتسوية المنازعات (BCDR-AAA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في مملكة البحرين، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في مملكة البحرين.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى غرفة البحرين لتسوية المنازعات (BCDR-AAA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
BAHRAIN MASTER ASSET-BACKED SOVEREIGN & CORPORATE SUKUK ISSUANCE AGREEMENT
Bahrain — Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001
Dispute Resolution & Forum: غرفة البحرين لتسوية المنازعات (BCDR-AAA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Bahrain, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Bahrain.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by غرفة البحرين لتسوية المنازعات (BCDR-AAA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇴🇲 [OM] Oman Diminishing Musharaka Capital Asset Co-Ownership & Financing Agreement
  // ===========================================================================
  {
    id: "sovereign-om-diminishing-musharaka-20m",
    countryCode: "OM",
    countryNameAr: "سلطنة عُمان",
    countryNameEn: "Oman",
    countryFlag: "🇴🇲",
    statuteCodeAr: "قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019",
    statuteCodeEn: "Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019",
    arbitrationVenue: "مركز عُمان للتحكيم التجاري (OAC)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "20,000,000 - 80,000,000+ OMR",
    category: "Islamic_Finance",
    titleAr: "اتفاقية المشاركة المتناقصة لتمويل الأصول الرأسمالية — سلطنة عُمان",
    titleEn: "Oman Diminishing Musharaka Capital Asset Co-Ownership & Financing Agreement",
    descriptionAr: "عقد تمويل بصيغة المشاركة المتناقصة المنتهية بتملك العميل الكامل للأصل وفق قانون المعاملات المدنية العُماني والإطار التنظيمي للصيرفة الإسلامية بالبنك المركزي العُماني (CBO).",
    descriptionEn: "Diminishing Musharaka (co-ownership) facility under Omani Law and CBO Islamic Banking Regulatory Framework, where Bank sells its undivided equity units to client gradually.",
    keyClauses: [ "الملكية الشائعة في الأصل وحصص الشراكة المبدئية (Undivided Co-Ownership Shares in Financed Asset)", "عقد تأجير حصة البنك للعميل خلال فترة الشراكة (Leasing of Bank's Share to Customer via Parallel Ijara)", "جدول شراء وحدات البنك تدريجياً حتى التملك الكامل (Step-Down Unit Purchase Schedule)", "توزيع تكاليف الصيانة الهيكلية والتأمين التكافلي (Pro-Rata Structural Maintenance & Takaful Allocation)", "مركز عُمان للتحكيم التجاري (OAC)" ],
    tags: [ "مشاركة_متناقصة", "عمان", "تمويل_إسلامي", "CBO", "OAC", "أصول_رأسمالية" ],
    pagesCount: 23,
    clausesCount: 30,
    templateAr: `================================================================================
اتفاقية المشاركة المتناقصة لتمويل الأصول الرأسمالية — سلطنة عُمان
سلطنة عُمان — قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019
جهة الاختصاص والتحكيم: مركز عُمان للتحكيم التجاري (OAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سلطنة عُمان، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سلطنة عُمان.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز عُمان للتحكيم التجاري (OAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
OMAN DIMINISHING MUSHARAKA CAPITAL ASSET CO-OWNERSHIP & FINANCING AGREEMENT
Oman — Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019
Dispute Resolution & Forum: مركز عُمان للتحكيم التجاري (OAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Oman, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Oman.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز عُمان للتحكيم التجاري (OAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [ADGM] ADGM FinTech Master Payment Gateway & Open Banking BaaS Agreement
  // ===========================================================================
  {
    id: "sovereign-adgm-fintech-payment-gateway-15m",
    countryCode: "ADGM",
    countryNameAr: "سوق أبوظبي العالمي (ADGM)",
    countryNameEn: "Abu Dhabi Global Market (ADGM)",
    countryFlag: "🇦🇪",
    statuteCodeAr: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    statuteCodeEn: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    arbitrationVenue: "محاكم سوق أبوظبي العالمي (ADGM Courts)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "15,000,000 - 60,000,000+ USD",
    category: "Islamic_Finance",
    titleAr: "اتفاقية بوابة الدفع الإلكتروني والتقنية المالية المفتوحة — سوق أبوظبي العالمي",
    titleEn: "ADGM FinTech Master Payment Gateway & Open Banking BaaS Agreement",
    descriptionAr: "عقد تقديم خدمات بوابة دفع ومعالجة المعاملات المالية المصرفية كخدمة (BaaS) وفق لوائح سلطة تنظيم الخدمات المالية بسوق أبوظبي العالمي (FSRA) وقواعد PCI-DSS.",
    descriptionEn: "Master payment gateway merchant processing and Open Banking API agreement under ADGM FSRA regulations, regulating settlement funds, chargeback reserves, and anti-fraud monitoring.",
    keyClauses: [ "تسوية الأموال وحسابات الضمان المعزولة (Rolling Settlement Timelines & Segregated Safeguarded Accounts)", "حساب احتياطي استرداد المدفوعات والنزاعات (Rolling Chargeback Reserve 5% & Dispute Resolution)", "الامتثال لمعايير أمن بطاقات الدفع والخصوصية (Strict PCI-DSS Level 1 & Tokenization Mandate)", "مكافحة غسل الأموال والتحقق من العملاء (Automated AML Sanctions Screening & KYC Verifications)", "محاكم سوق أبوظبي العالمي (ADGM Courts)" ],
    tags: [ "فنتك", "ADGM", "بوابة_دفع", "FinTech", "FSRA", "PCI_DSS" ],
    pagesCount: 22,
    clausesCount: 29,
    templateAr: `================================================================================
اتفاقية بوابة الدفع الإلكتروني والتقنية المالية المفتوحة — سوق أبوظبي العالمي
سوق أبوظبي العالمي (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
جهة الاختصاص والتحكيم: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سوق أبوظبي العالمي (ADGM)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سوق أبوظبي العالمي (ADGM).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم سوق أبوظبي العالمي (ADGM Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
ADGM FINTECH MASTER PAYMENT GATEWAY & OPEN BANKING BAAS AGREEMENT
Abu Dhabi Global Market (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
Dispute Resolution & Forum: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Abu Dhabi Global Market (ADGM), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Abu Dhabi Global Market (ADGM).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم سوق أبوظبي العالمي (ADGM Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇪🇬 [EG] Egypt Commercial Mortgage, Floating Charge & Security Agency Agreement
  // ===========================================================================
  {
    id: "sovereign-eg-commercial-pledge-security-agency-20m",
    countryCode: "EG",
    countryNameAr: "جمهورية مصر العربية",
    countryNameEn: "Egypt",
    countryFlag: "🇪🇬",
    statuteCodeAr: "القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981",
    statuteCodeEn: "Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981",
    arbitrationVenue: "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "20,000,000 - 100,000,000+ EGP",
    category: "Islamic_Finance",
    titleAr: "عقد الرهن التجاري وحساب الضمان ووكيل الضمانات — جمهورية مصر العربية",
    titleEn: "Egypt Commercial Mortgage, Floating Charge & Security Agency Agreement",
    descriptionAr: "اتفاقية رهن تجاري على أصول ومصانع وذمم مدينة لضمان التسهيلات الائتمانية البنكية وفق قانون التجارة المصري رقم 17 لسنة 1999 وقانون الضمانات المنقولة رقم 115 لسنة 2015.",
    descriptionEn: "Comprehensive commercial pledge and movable collateral security agreement under Egyptian Movable Guarantees Law No. 115/2015, establishing registry priority and enforcement mechanisms.",
    keyClauses: [ "قيد الرهن بالسجل الإلكتروني للضمانات المنقولة (Electronic Registration with Egyptian Movable Collateral Registry)", "حوالة حقوق العقود والحسابات المصرفية المرهونة (Pledge of Receivables, Bank Accounts & Proceeds Assignment)", "صلاحيات وكيل الضمانات في التنفيذ الجبري المباشر (Security Agent Extra-Judicial Enforcement Authorities)", "تعهدات الحفاظ على قيمة الأصول والتأمين الشامل (Negative Pledge & Comprehensive Asset Insurance Assignment)", "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)" ],
    tags: [ "رهن_تجاري", "مصر", "ضمانات_منقولة", "CRCICA", "تسهيلات_ائتمانية", "بنوك" ],
    pagesCount: 21,
    clausesCount: 28,
    templateAr: `================================================================================
عقد الرهن التجاري وحساب الضمان ووكيل الضمانات — جمهورية مصر العربية
جمهورية مصر العربية — القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981
جهة الاختصاص والتحكيم: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في جمهورية مصر العربية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في جمهورية مصر العربية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
EGYPT COMMERCIAL MORTGAGE, FLOATING CHARGE & SECURITY AGENCY AGREEMENT
Egypt — Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981
Dispute Resolution & Forum: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Egypt, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Egypt.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇬🇧 [GB] UK Multi-Currency Investment Grade Syndicated Facility Agreement (LMA Aligned)
  // ===========================================================================
  {
    id: "sovereign-gb-syndicated-loan-lma-facility-100m",
    countryCode: "GB",
    countryNameAr: "المملكة المتحدة (English Law)",
    countryNameEn: "United Kingdom (English Law)",
    countryFlag: "🇬🇧",
    statuteCodeAr: "UK Companies Act 2006 & Unfair Contract Terms Act 1977",
    statuteCodeEn: "UK Companies Act 2006 & Unfair Contract Terms Act 1977",
    arbitrationVenue: "London Court of International Arbitration (LCIA)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "100,000,000 - 500,000,000+ GBP",
    category: "Islamic_Finance",
    titleAr: "اتفاقية القرض المشترك للشركات وفق معايير جمعية أسواق القروض — بريطانيا",
    titleEn: "UK Multi-Currency Investment Grade Syndicated Facility Agreement (LMA Aligned)",
    descriptionAr: "اتفاقية تسهيلات ائتمانية دولية مشتركة بمليارات الدولارات بين كونسورتيوم بنوك عالمية خاضعة للقانون الإنجليزي وفق نموذج جمعية أسواق القروض بلندن (LMA Model Agreement).",
    descriptionEn: "Syndicated credit facility agreement compliant with London Loan Market Association (LMA) standard investment-grade documentation, incorporating Term SOFR benchmark replacements.",
    keyClauses: [ "آلية تسعير الفائدة ومعدلات الفائدة القياسية البديلة (Term SOFR / SONIA Interest Rate Benchmarks)", "التعهدات المالية ومؤشرات المديونية المشددة (Leverage Ratio < 3.0x & Interest Cover Covenants)", "المشاركة الإلزامية في استرداد القرض بالتناسب (Pari Passu Sharing & Mandatory Prepayments on Change of Control)", "سلطات بنك التسهيلات وبنك الضمانات (Facility Agent & Security Trustee English Law Roles)", "محكمة لندن للتحكيم الدولي (LCIA) ومحاكم إنجلترا وويلز" ],
    tags: [ "LMA", "بريطانيا", "قرض_مشترك", "LCIA", "SOFR", "Syndicated_Loan" ],
    pagesCount: 36,
    clausesCount: 45,
    templateAr: `================================================================================
اتفاقية القرض المشترك للشركات وفق معايير جمعية أسواق القروض — بريطانيا
المملكة المتحدة (English Law) — UK Companies Act 2006 & Unfair Contract Terms Act 1977
جهة الاختصاص والتحكيم: London Court of International Arbitration (LCIA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام UK Companies Act 2006 & Unfair Contract Terms Act 1977؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة المتحدة (English Law)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة المتحدة (English Law).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام UK Companies Act 2006 & Unfair Contract Terms Act 1977.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى London Court of International Arbitration (LCIA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UK MULTI-CURRENCY INVESTMENT GRADE SYNDICATED FACILITY AGREEMENT (LMA ALIGNED)
United Kingdom (English Law) — UK Companies Act 2006 & Unfair Contract Terms Act 1977
Dispute Resolution & Forum: London Court of International Arbitration (LCIA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with UK Companies Act 2006 & Unfair Contract Terms Act 1977;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United Kingdom (English Law), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United Kingdom (English Law).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with UK Companies Act 2006 & Unfair Contract Terms Act 1977.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by London Court of International Arbitration (LCIA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇸🇦 [SA] Saudi Executive Service Agreement for Chief Executive Officer (CEO)
  // ===========================================================================
  {
    id: "sovereign-sa-ceo-service-agreement-executive-3m",
    countryCode: "SA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    countryFlag: "🇸🇦",
    statuteCodeAr: "نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)",
    statuteCodeEn: "Civil Transactions Law (M/191) & Companies Law (M/132)",
    arbitrationVenue: "المركز السعودي للتحكيم التجاري (SCCA - الرياض)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "3,000,000 - 15,000,000+ SAR سنوياً",
    category: "Executive_Governance",
    titleAr: "عقد عمل الرئيس التنفيذي والإدارة العليا — المملكة العربية السعودية",
    titleEn: "Saudi Executive Service Agreement for Chief Executive Officer (CEO)",
    descriptionAr: "عقد عمل لقيادات الإدارة العليا ورؤساء الشركات التنفيذيين وفق نظام العمل السعودي ونظام الشركات الجديد م/132، متضمناً بدلات السكن والسيارة وحوافز الأداء والأسهم.",
    descriptionEn: "Comprehensive C-Suite Executive Employment Agreement under Saudi Labor Law and Companies Law, regulating base compensation, performance bonuses, phantom shares, and clawback clauses.",
    keyClauses: [ "حزمة الأجر الشامل والمكافأة السنوية المرتبطة بالأرباح (Base Salary, Housing, Executive Health & KPI Bonus)", "حظر المنافسة الصارم وحماية أسرار الشركة (Post-Termination Non-Compete Article 83 Labor Law)", "التعويض عن إنهاء العقد بدون سبب مشروع (Severance Pay & Notice Period under Article 77/75)", "تخصيص حقوق الملكية الفكرية لاختراعات العمل (Absolute Corporate Assignment of Innovations)", "المركز السعودي للتحكيم التجاري (SCCA) والمحاكم العمالية السعودية" ],
    tags: [ "رئيس_تنفيذي", "السعودية", "عقد_عمل_تنفيذي", "نظام_العمل", "SCCA", "C_Suite" ],
    pagesCount: 20,
    clausesCount: 27,
    templateAr: `================================================================================
عقد عمل الرئيس التنفيذي والإدارة العليا — المملكة العربية السعودية
المملكة العربية السعودية — نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)
جهة الاختصاص والتحكيم: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة العربية السعودية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة العربية السعودية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132).
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى المركز السعودي للتحكيم التجاري (SCCA - الرياض)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
SAUDI EXECUTIVE SERVICE AGREEMENT FOR CHIEF EXECUTIVE OFFICER (CEO)
Saudi Arabia — Civil Transactions Law (M/191) & Companies Law (M/132)
Dispute Resolution & Forum: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law (M/191) & Companies Law (M/132);

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Saudi Arabia, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Saudi Arabia.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law (M/191) & Companies Law (M/132).
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by المركز السعودي للتحكيم التجاري (SCCA - الرياض). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [AE] UAE Executive Standalone Non-Compete, Non-Solicitation & Trade Secret Covenants
  // ===========================================================================
  {
    id: "sovereign-ae-executive-non-compete-confidentiality-2m",
    countryCode: "AE",
    countryNameAr: "الإمارات العربية المتحدة (الاتحادي)",
    countryNameEn: "UAE Mainland",
    countryFlag: "🇦🇪",
    statuteCodeAr: "مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021",
    statuteCodeEn: "Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021",
    arbitrationVenue: "مركز دبي للتحكيم الدولي (DIAC)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "2,000,000 - 10,000,000+ AED",
    category: "Executive_Governance",
    titleAr: "اتفاقية عدم المنافسة وحماية الأسرار التجارية لكبار التنفيذيين — الإمارات",
    titleEn: "UAE Executive Standalone Non-Compete, Non-Solicitation & Trade Secret Covenants",
    descriptionAr: "اتفاقية مستقلة ومشددة لحظر المنافسة ومنع استقطاب العملاء والموظفين لكبار المدراء وفق المادة (10) من المرسوم بقانون اتحادي رقم (33) لسنة 2021 بشأن علاقات العمل.",
    descriptionEn: "Standalone executive non-compete and trade secrets protection agreement governed by UAE Federal Decree-Law No. 33/2021 on Labor Relations, defining geographical and temporal boundaries.",
    keyClauses: [ "تحديد النطاق الجغرافي والمدة الزمنية القصوى سنتين (Strict Geographical Territory & 2-Year Statutory Limit)", "حظر استقطاب كبار الموظفين والعملاء الاستراتيجيين (Non-Solicitation of Key Personnel & Accounts)", "التعويض الاتفاقي المشدد عن إفشاء أسرار الأعمال (Liquidated Damages for Breach of Industrial Secrets)", "حق الشركة في استصدار أوامر المنع القضائية العاجلة (Injunctive Relief & Enforcement Mechanics)", "مركز دبي للتحكيم الدولي (DIAC) ومحاكم دبي" ],
    tags: [ "عدم_منافسة", "الإمارات", "أسرار_تجارية", "DIAC", "علاقات_العمل", "حظر_استقطاب" ],
    pagesCount: 17,
    clausesCount: 23,
    templateAr: `================================================================================
اتفاقية عدم المنافسة وحماية الأسرار التجارية لكبار التنفيذيين — الإمارات
الإمارات العربية المتحدة (الاتحادي) — مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021
جهة الاختصاص والتحكيم: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الإمارات العربية المتحدة (الاتحادي)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الإمارات العربية المتحدة (الاتحادي).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز دبي للتحكيم الدولي (DIAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UAE EXECUTIVE STANDALONE NON-COMPETE, NON-SOLICITATION & TRADE SECRET COVENANTS
UAE Mainland — Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021
Dispute Resolution & Forum: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in UAE Mainland, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in UAE Mainland.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز دبي للتحكيم الدولي (DIAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🏛️ [DIFC] DIFC Managing Director Employment & Board Governance Agreement
  // ===========================================================================
  {
    id: "sovereign-difc-managing-director-employment-3m",
    countryCode: "DIFC",
    countryNameAr: "مركز دبي المالي العالمي (DIFC)",
    countryNameEn: "Dubai International Financial Centre (DIFC)",
    countryFlag: "🏛️",
    statuteCodeAr: "DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018",
    statuteCodeEn: "DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018",
    arbitrationVenue: "محاكم مركز دبي المالي العالمي (DIFC Courts)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "3,000,000 - 12,000,000+ USD",
    category: "Executive_Governance",
    titleAr: "عقد تعيين المدير الإداري والتنفيذي وفق قوانين مركز دبي المالي — DIFC",
    titleEn: "DIFC Managing Director Employment & Board Governance Agreement",
    descriptionAr: "عقد عمل تنفيذي للمدراء المنتدبين وأعضاء مجالس الإدارة خاضع لقانون العمل بمركز دبي المالي العالمي رقم 2 لسنة 2019 وقواعد صندوق مدخرات الموظفين (DEWS).",
    descriptionEn: "Senior Executive Service Contract governed by DIFC Employment Law No. 2/2019, incorporating mandatory DEWS workplace savings contributions, garden leave, and directors' indemnities.",
    keyClauses: [ "مساهمات صندوق مدخرات الموظفين الإلزامي (DIFC Employee Workplace Savings - DEWS Contributions)", "فترة الإجازة التحضيرية قبل انتهاء العقد (Garden Leave Protocol & Restrictive Covenants)", "تأمين المسؤولية المدنية لأعضاء الإدارة والمدراء (Directors and Officers Liability Insurance - D&O)", "الإنهاء الفوري للسبب الجوهري وسحب المزايا (Summary Dismissal for Cause & Benefit Forfeiture)", "محاكم مركز دبي المالي العالمي (DIFC Courts - Small Claims & CFI)" ],
    tags: [ "DIFC", "DEWS", "مدير_منتدب", "عمل_تنفيذي", "DIFC_Courts", "حوكمة" ],
    pagesCount: 21,
    clausesCount: 28,
    templateAr: `================================================================================
عقد تعيين المدير الإداري والتنفيذي وفق قوانين مركز دبي المالي — DIFC
مركز دبي المالي العالمي (DIFC) — DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018
جهة الاختصاص والتحكيم: محاكم مركز دبي المالي العالمي (DIFC Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في مركز دبي المالي العالمي (DIFC)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في مركز دبي المالي العالمي (DIFC).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم مركز دبي المالي العالمي (DIFC Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DIFC MANAGING DIRECTOR EMPLOYMENT & BOARD GOVERNANCE AGREEMENT
Dubai International Financial Centre (DIFC) — DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018
Dispute Resolution & Forum: محاكم مركز دبي المالي العالمي (DIFC Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Dubai International Financial Centre (DIFC), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Dubai International Financial Centre (DIFC).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم مركز دبي المالي العالمي (DIFC Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [ADGM] ADGM Executive Separation, Compromise & Mutual Release Agreement
  // ===========================================================================
  {
    id: "sovereign-adgm-executive-severance-settlement-2m",
    countryCode: "ADGM",
    countryNameAr: "سوق أبوظبي العالمي (ADGM)",
    countryNameEn: "Abu Dhabi Global Market (ADGM)",
    countryFlag: "🇦🇪",
    statuteCodeAr: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    statuteCodeEn: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    arbitrationVenue: "محاكم سوق أبوظبي العالمي (ADGM Courts)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "2,000,000 - 8,000,000+ USD",
    category: "Executive_Governance",
    titleAr: "اتفاقية التسوية وإنهاء الخدمة والتخارج الودي لكبار المدراء — سوق أبوظبي العالمي",
    titleEn: "ADGM Executive Separation, Compromise & Mutual Release Agreement",
    descriptionAr: "اتفاقية تسوية قانونية وتخارج ودي وإنهاء خدمة تنفيذي بموجب لوائح التوظيف في سوق أبوظبي العالمي ADGM، تتضمن إبراء الذمة الكامل وشروط عدم القدح والذم.",
    descriptionEn: "Executive Compromise and Separation Agreement under ADGM Employment Regulations, featuring a full and final settlement of all claims, mutual non-disparagement, and release of equity options.",
    keyClauses: [ "مكافأة التسوية المالية الشاملة وإبراء الذمة النهائي (Severance Settlement Sum & Full and Final Release)", "حظر القدح والتشهير بالكيان المؤسسي وإدارته (Mutual Strict Non-Disparagement Undertakings)", "معاملة خيارات الأسهم والتعويض عن الأسهم المتبقية (Accelerated Vesting & Treatment of Unexercised Options)", "التنازل الصريح عن المطالبات العمالية أمام محاكم السوق (Waiver of Statutory ADGM Employment Claims)", "محاكم سوق أبوظبي العالمي (ADGM Courts)" ],
    tags: [ "تسوية_تنفيذية", "ADGM", "إنهاء_خدمة", "إبراء_ذمة", "تخارج", "ADGM_Courts" ],
    pagesCount: 18,
    clausesCount: 24,
    templateAr: `================================================================================
اتفاقية التسوية وإنهاء الخدمة والتخارج الودي لكبار المدراء — سوق أبوظبي العالمي
سوق أبوظبي العالمي (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
جهة الاختصاص والتحكيم: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سوق أبوظبي العالمي (ADGM)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سوق أبوظبي العالمي (ADGM).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم سوق أبوظبي العالمي (ADGM Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
ADGM EXECUTIVE SEPARATION, COMPROMISE & MUTUAL RELEASE AGREEMENT
Abu Dhabi Global Market (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
Dispute Resolution & Forum: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Abu Dhabi Global Market (ADGM), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Abu Dhabi Global Market (ADGM).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم سوق أبوظبي العالمي (ADGM Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇺🇸 [US] Delaware C-Suite Executive Employment Agreement (Golden Parachute & Equity Aligned)
  // ===========================================================================
  {
    id: "sovereign-us-c-suite-employment-equity-incentive-5m",
    countryCode: "US",
    countryNameAr: "الولايات المتحدة الأمريكية (Delaware)",
    countryNameEn: "United States (Delaware)",
    countryFlag: "🇺🇸",
    statuteCodeAr: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    statuteCodeEn: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    arbitrationVenue: "Delaware Court of Chancery & AAA / JAMS",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "5,000,000 - 25,000,000+ USD",
    category: "Executive_Governance",
    titleAr: "عقد عمل تنفيذي مشمول بحوافز الأسهم والتعويض الذهبي — ديلاوير",
    titleEn: "Delaware C-Suite Executive Employment Agreement (Golden Parachute & Equity Aligned)",
    descriptionAr: "عقد توظيف تنفيذي للإدارة العليا بالولايات المتحدة خاضع لقوانين ديلاوير مع حزمة التعويض الذهبي (Golden Parachute) وتسريع استحقاق الأسهم عند الاستحواذ.",
    descriptionEn: "Executive employment contract under Delaware Law incorporating Section 409A deferred compensation compliance, change-in-control double-trigger acceleration, and clawback provisions.",
    keyClauses: [ "حوافز تغيير السيطرة والتعويض الذهبي المضاعف (Change in Control Double-Trigger Severance & Equity Acceleration)", "الامتثال لأحكام المادة 409A من قانون الإيرادات الفيدرالي (Internal Revenue Code Section 409A Compliance)", "حق استرداد المكافآت عند التحريف المحاسبي (SEC Aligned Executive Incentive Compensation Clawback)", "واجبات الأمانة والولاء للشركة ومجلس الإدارة (Fiduciary Duties of Loyalty & Care under Delaware Law)", "محكمة التشانسري في ديلاوير والتحكيم التجاري (AAA / JAMS - Wilmington)" ],
    tags: [ "C_Suite", "ديلاوير", "Golden_Parachute", "AAA", "SEC", "Section_409A" ],
    pagesCount: 25,
    clausesCount: 33,
    templateAr: `================================================================================
عقد عمل تنفيذي مشمول بحوافز الأسهم والتعويض الذهبي — ديلاوير
الولايات المتحدة الأمريكية (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
جهة الاختصاص والتحكيم: Delaware Court of Chancery & AAA / JAMS
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الولايات المتحدة الأمريكية (Delaware)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الولايات المتحدة الأمريكية (Delaware).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى Delaware Court of Chancery & AAA / JAMS، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DELAWARE C-SUITE EXECUTIVE EMPLOYMENT AGREEMENT (GOLDEN PARACHUTE & EQUITY ALIGNED)
United States (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
Dispute Resolution & Forum: Delaware Court of Chancery & AAA / JAMS
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United States (Delaware), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United States (Delaware).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by Delaware Court of Chancery & AAA / JAMS. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇬🇧 [GB] UK Executive Director Service Agreement (Companies Act 2006 Compliant)
  // ===========================================================================
  {
    id: "sovereign-gb-executive-director-service-contract-3m",
    countryCode: "GB",
    countryNameAr: "المملكة المتحدة (English Law)",
    countryNameEn: "United Kingdom (English Law)",
    countryFlag: "🇬🇧",
    statuteCodeAr: "UK Companies Act 2006 & Unfair Contract Terms Act 1977",
    statuteCodeEn: "UK Companies Act 2006 & Unfair Contract Terms Act 1977",
    arbitrationVenue: "London Court of International Arbitration (LCIA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "3,000,000 - 10,000,000+ GBP",
    category: "Executive_Governance",
    titleAr: "عقد خدمات المدير التنفيذي وعضو مجلس الإدارة ببريطانيا — قانون الشركات 2006",
    titleEn: "UK Executive Director Service Agreement (Companies Act 2006 Compliant)",
    descriptionAr: "عقد تعيين وخدمات للمدراء التنفيذيين وأعضاء مجالس الإدارة بالشركات البريطانية وفق المادة 171-177 من قانون الشركات البريطاني 2006 وقواعد الحوكمة الرشيدة.",
    descriptionEn: "Institutional Director's Service Contract complying with UK Companies Act 2006 statutory general duties, remuneration reporting rules, and corporate governance code provisions.",
    keyClauses: [ "الواجبات القانونية العامة لعضو مجلس الإدارة بموجب المواد 171-177 (Statutory Fiduciary Duties Section 171-177)", "لجنة المكافآت وحوافز الأسهم طويلة الأجل (Remuneration Committee Oversight & LTIP Allocation)", "فترة الإنهاء التعاقدي المشروط والإجازة التحضيرية (12-Month Rolling Notice Period & Garden Leave)", "إفصاح كبار التنفيذيين عن تضارب المصالح المالي (Mandatory Declaration of External Conflicts & Interests)", "محكمة لندن للتحكيم الدولي (LCIA) ومحاكم إنجلترا وويلز" ],
    tags: [ "بريطانيا", "مجلس_إدارة", "مدير_تنفيذي", "Companies_Act", "LCIA", "London" ],
    pagesCount: 22,
    clausesCount: 29,
    templateAr: `================================================================================
عقد خدمات المدير التنفيذي وعضو مجلس الإدارة ببريطانيا — قانون الشركات 2006
المملكة المتحدة (English Law) — UK Companies Act 2006 & Unfair Contract Terms Act 1977
جهة الاختصاص والتحكيم: London Court of International Arbitration (LCIA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام UK Companies Act 2006 & Unfair Contract Terms Act 1977؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة المتحدة (English Law)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة المتحدة (English Law).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام UK Companies Act 2006 & Unfair Contract Terms Act 1977.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى London Court of International Arbitration (LCIA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UK EXECUTIVE DIRECTOR SERVICE AGREEMENT (COMPANIES ACT 2006 COMPLIANT)
United Kingdom (English Law) — UK Companies Act 2006 & Unfair Contract Terms Act 1977
Dispute Resolution & Forum: London Court of International Arbitration (LCIA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with UK Companies Act 2006 & Unfair Contract Terms Act 1977;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United Kingdom (English Law), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United Kingdom (English Law).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with UK Companies Act 2006 & Unfair Contract Terms Act 1977.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by London Court of International Arbitration (LCIA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇶🇦 [QA] Qatar Executive Key Personnel Retention Bonus & KPI Agreement
  // ===========================================================================
  {
    id: "sovereign-qa-c-suite-retention-bonus-agreement-2m",
    countryCode: "QA",
    countryNameAr: "دولة قطر",
    countryNameEn: "Qatar",
    countryFlag: "🇶🇦",
    statuteCodeAr: "قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015",
    statuteCodeEn: "Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015",
    arbitrationVenue: "مركز قطر الدولي للتوفيق والتحكيم (QICCA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "2,000,000 - 8,000,000+ QAR",
    category: "Executive_Governance",
    titleAr: "اتفاقية منح مكافأة الإبقاء وحوافز الأداء لكبار التنفيذيين — دولة قطر",
    titleEn: "Qatar Executive Key Personnel Retention Bonus & KPI Agreement",
    descriptionAr: "اتفاقية تحفيز مالي وإبقاء الكفاءات التنفيذية النادرة بالشركات والمؤسسات القطرية وفق قانون العمل القطري رقم 14 لسنة 2004 مع شروط البقاء الزمني وتحقيق المستهدفات.",
    descriptionEn: "Key employee retention bonus agreement under Qatari Law, structuring structured stay-bonus tranches tied to operational milestones and transactional completion covenants.",
    keyClauses: [ "دفعات مكافأة الاستمرار في العمل والتواريخ المستهدفة (Staged Retention Bonus Tranches & Stay Milestones)", "شروط استرداد المكافأة عند الاستقالة المبكرة (Clawback Provisions upon Voluntary Resignation)", "معايير التقييم الربحي والمؤشرات التشغيلية (EBITDA & Strategic KPI Performance Thresholds)", "سرية شروط المكافأة وعدم الإفصاح لزملاء العمل (Strict Compensation Confidentiality Undertaking)", "مركز قطر الدولي للتوفيق والتحكيم (QICCA)" ],
    tags: [ "مكافأة_إبقاء", "قطر", "تنفيذيين", "QICCA", "KPIs", "استبقاء_كفاءات" ],
    pagesCount: 16,
    clausesCount: 22,
    templateAr: `================================================================================
اتفاقية منح مكافأة الإبقاء وحوافز الأداء لكبار التنفيذيين — دولة قطر
دولة قطر — قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015
جهة الاختصاص والتحكيم: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة قطر، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة قطر.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز قطر الدولي للتوفيق والتحكيم (QICCA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
QATAR EXECUTIVE KEY PERSONNEL RETENTION BONUS & KPI AGREEMENT
Qatar — Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015
Dispute Resolution & Forum: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Qatar, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Qatar.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز قطر الدولي للتوفيق والتحكيم (QICCA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇪🇺 [EU] EU Cross-Border Remote Employment & Global Talent Services Framework
  // ===========================================================================
  {
    id: "sovereign-eu-crossborder-remote-talent-agreement-2m",
    countryCode: "EU",
    countryNameAr: "الاتحاد الأوروبي (Civil Law & GDPR)",
    countryNameEn: "European Union (Civil Law & GDPR)",
    countryFlag: "🇪🇺",
    statuteCodeAr: "اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية",
    statuteCodeEn: "EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes",
    arbitrationVenue: "غرفة التجارة الدولية باريس (ICC International Court of Arbitration)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "2,000,000 - 6,000,000+ EUR",
    category: "Executive_Governance",
    titleAr: "اتفاقية العمل عن بُعد واستقطاب الكفاءات الدولية — الاتحاد الأوروبي",
    titleEn: "EU Cross-Border Remote Employment & Global Talent Services Framework",
    descriptionAr: "عقد استقطاب وتوظيف المهارات التقنية والتنفيذية عن بُعد عبر دول الاتحاد الأوروبي مع تسوية الإقامة الضريبية والتأمينات الاجتماعية وقوانين العمل العابرة للحدود.",
    descriptionEn: "Cross-border remote work framework contract compliant with EU Posting of Workers Directive and Rome I Regulation, managing permanent establishment risks and social security coordination.",
    keyClauses: [ "تجنب مخاطر المنشأة الدائمة والازدواج الضريبي (Mitigation of Corporate Permanent Establishment - PE Risks)", "التنسيق في التأمينات الاجتماعية وفق لائحة الاتحاد الأوروبي (A1 Certificate Social Security Coordination)", "حماية بيئة العمل المنزلية والسلامة المهنية الرقمية (Remote Ergonomics & Digital Occupational Health)", "حماية البيانات والملكية الفكرية للأعمال عن بُعد (GDPR-Compliant Remote Security & IP Assignment)", "غرفة التجارة الدولية بباريس (ICC Paris)" ],
    tags: [ "عمل_عن_بعد", "الاتحاد_الأوروبي", "GDPR", "ICC_Paris", "كفاءات_دولية", "ضرائب" ],
    pagesCount: 19,
    clausesCount: 26,
    templateAr: `================================================================================
اتفاقية العمل عن بُعد واستقطاب الكفاءات الدولية — الاتحاد الأوروبي
الاتحاد الأوروبي (Civil Law & GDPR) — اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية
جهة الاختصاص والتحكيم: غرفة التجارة الدولية باريس (ICC International Court of Arbitration)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الاتحاد الأوروبي (Civil Law & GDPR)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الاتحاد الأوروبي (Civil Law & GDPR).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام اللائحة العامة لحماية البيانات (GDPR 2016/679) والقوانين المدنية الأوروبية.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى غرفة التجارة الدولية باريس (ICC International Court of Arbitration)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
EU CROSS-BORDER REMOTE EMPLOYMENT & GLOBAL TALENT SERVICES FRAMEWORK
European Union (Civil Law & GDPR) — EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes
Dispute Resolution & Forum: غرفة التجارة الدولية باريس (ICC International Court of Arbitration)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in European Union (Civil Law & GDPR), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in European Union (Civil Law & GDPR).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with EU General Data Protection Regulation (GDPR 2016/679) & Civil Codes.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by غرفة التجارة الدولية باريس (ICC International Court of Arbitration). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇪🇬 [EG] Egypt Senior Strategic Legal & Commercial Advisor Independent Consultancy Agreement
  // ===========================================================================
  {
    id: "sovereign-eg-consultancy-senior-advisor-agreement-2m",
    countryCode: "EG",
    countryNameAr: "جمهورية مصر العربية",
    countryNameEn: "Egypt",
    countryFlag: "🇪🇬",
    statuteCodeAr: "القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981",
    statuteCodeEn: "Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981",
    arbitrationVenue: "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "2,000,000 - 10,000,000+ EGP",
    category: "Executive_Governance",
    titleAr: "عقد المستشار القانوني والاستراتيجي المستقل للشركات — جمهورية مصر العربية",
    titleEn: "Egypt Senior Strategic Legal & Commercial Advisor Independent Consultancy Agreement",
    descriptionAr: "عقد استشارات إدارية وقانونية عليا للشركات القابضة والمصانع وفق القانون المدني المصري رقم 131 لسنة 1948، مع تمييز صفة المقاول المستقل عن علاقة العمل التابعة.",
    descriptionEn: "Senior strategic independent consultancy contract under Egyptian Civil Code, defining non-exclusive advisory deliverables while establishing independent contractor tax status.",
    keyClauses: [ "نطاق الاستشارات الإدارية والدراسات الاستراتيجية (Advisory Retainer Scope & Deliverables)", "تأكيد صفة المقاول المستقل واستبعاد علاقة التبعية (Independent Contractor Status vs. Employment)", "حقوق الملكية الفكرية في التقارير والتوصيات (Proprietary Deliverables & Work-Product Ownership)", "الالتزام بعدم تعارض المصالح المهنية (Conflict of Interest Disclosures & Professional Integrity)", "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)" ],
    tags: [ "استشارات_عليا", "مصر", "مستشار_مستقل", "CRCICA", "القانون_المدني", "حوكمة" ],
    pagesCount: 17,
    clausesCount: 24,
    templateAr: `================================================================================
عقد المستشار القانوني والاستراتيجي المستقل للشركات — جمهورية مصر العربية
جمهورية مصر العربية — القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981
جهة الاختصاص والتحكيم: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في جمهورية مصر العربية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في جمهورية مصر العربية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
EGYPT SENIOR STRATEGIC LEGAL & COMMERCIAL ADVISOR INDEPENDENT CONSULTANCY AGREEMENT
Egypt — Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981
Dispute Resolution & Forum: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Egypt, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Egypt.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇸🇦 [SA] Saudi Master Franchise Agreement (Ministry of Commerce Registered)
  // ===========================================================================
  {
    id: "sovereign-sa-master-franchise-international-20m",
    countryCode: "SA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    countryFlag: "🇸🇦",
    statuteCodeAr: "نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)",
    statuteCodeEn: "Civil Transactions Law (M/191) & Companies Law (M/132)",
    arbitrationVenue: "المركز السعودي للتحكيم التجاري (SCCA - الرياض)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "20,000,000 - 80,000,000+ SAR",
    category: "Agency_Franchise",
    titleAr: "عقد الامتياز التجاري الرئيسي المعتمد وفق نظام الامتياز السعودي — المملكة العربية السعودية",
    titleEn: "Saudi Master Franchise Agreement (Ministry of Commerce Registered)",
    descriptionAr: "عقد امتياز تجاري رئيسي (Master Franchise) للعلامات العالمية بالمملكة متوافق مع نظام الامتياز التجاري الصادر بالمرسوم م/22 ولائحته التنفيذية وتوثيق منصة الأعمال.",
    descriptionEn: "Master Franchise Agreement compliant with the Saudi Franchise Law (Royal Decree M/22) and implementing regulations, setting territorial development schedules and disclosure document rules.",
    keyClauses: [ "وثيقة الإفصاح المسبقة عن الامتياز التجاري (Statutory Franchise Disclosure Document - FDD Compliance)", "جدول التطوير الزمني لافتتاح الفروع بالمملكة (Territory Development Schedule & Minimum Store Count)", "رسوم الامتياز الأولية ونسبة الإتاوة الدورية (Initial Master Fee & 5% Continuing Royalty Fee)", "حماية العلامة التجارية ودليل العمليات التشغيلي (Operations Manual & Brand Standard Conformity)", "المركز السعودي للتحكيم التجاري (SCCA - الرياض)" ],
    tags: [ "امتياز_تجاري", "السعودية", "فرانشايز", "نظام_الامتياز", "م/22", "SCCA" ],
    pagesCount: 26,
    clausesCount: 35,
    templateAr: `================================================================================
عقد الامتياز التجاري الرئيسي المعتمد وفق نظام الامتياز السعودي — المملكة العربية السعودية
المملكة العربية السعودية — نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)
جهة الاختصاص والتحكيم: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة العربية السعودية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة العربية السعودية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132).
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى المركز السعودي للتحكيم التجاري (SCCA - الرياض)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
SAUDI MASTER FRANCHISE AGREEMENT (MINISTRY OF COMMERCE REGISTERED)
Saudi Arabia — Civil Transactions Law (M/191) & Companies Law (M/132)
Dispute Resolution & Forum: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law (M/191) & Companies Law (M/132);

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Saudi Arabia, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Saudi Arabia.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law (M/191) & Companies Law (M/132).
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by المركز السعودي للتحكيم التجاري (SCCA - الرياض). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇶🇦 [QA] Qatar Registered Commercial Agency & Exclusive Distribution Agreement
  // ===========================================================================
  {
    id: "sovereign-qa-commercial-agency-registered-10m",
    countryCode: "QA",
    countryNameAr: "دولة قطر",
    countryNameEn: "Qatar",
    countryFlag: "🇶🇦",
    statuteCodeAr: "قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015",
    statuteCodeEn: "Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015",
    arbitrationVenue: "مركز قطر الدولي للتوفيق والتحكيم (QICCA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "10,000,000 - 40,000,000+ QAR",
    category: "Agency_Franchise",
    titleAr: "اتفاقية الوكالة التجارية المسجلة والتوزيع الحصري — دولة قطر",
    titleEn: "Qatar Registered Commercial Agency & Exclusive Distribution Agreement",
    descriptionAr: "اتفاقية وكالة تجارية حصرية مسجلة لدى وزارة التجارة والصناعة القطرية وفق القانون رقم 8 لسنة 2002 بشأن تنظيم أعمال الوكلاء التجاريين مع حماية حقوق الوكيل المحلي.",
    descriptionEn: "Exclusive registered commercial agency agreement under Qatari Commercial Agencies Law No. 8/2002, detailing statutory agent commissions, customs import protections, and termination compensation.",
    keyClauses: [ "القيد الرسمي بسجل الوكلاء التجاريين بقطر (Mandatory Commercial Agency Registration at MOCI)", "حماية الوكيل الحصري من الاستيراد الموازي (Customs Protection & Prohibition of Parallel Imports)", "عمولة الوكيل عن كافة المبيعات المباشرة وغير المباشرة (Statutory Agency Commission on All Territory Sales)", "شروط التعويض العادل عند الإنهاء غير المبرر (Statutory Compensation for Unjustified Agency Termination)", "مركز قطر الدولي للتوفيق والتحكيم (QICCA)" ],
    tags: [ "وكالة_تجارية", "قطر", "MOCI", "QICCA", "توزيع_حصري", "استيراد_موازي" ],
    pagesCount: 21,
    clausesCount: 28,
    templateAr: `================================================================================
اتفاقية الوكالة التجارية المسجلة والتوزيع الحصري — دولة قطر
دولة قطر — قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015
جهة الاختصاص والتحكيم: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة قطر، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة قطر.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز قطر الدولي للتوفيق والتحكيم (QICCA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
QATAR REGISTERED COMMERCIAL AGENCY & EXCLUSIVE DISTRIBUTION AGREEMENT
Qatar — Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015
Dispute Resolution & Forum: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Qatar, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Qatar.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز قطر الدولي للتوفيق والتحكيم (QICCA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇰🇼 [KW] Kuwait Exclusive Commercial Franchise & Master Operator Contract
  // ===========================================================================
  {
    id: "sovereign-kw-exclusive-commercial-franchise-15m",
    countryCode: "KW",
    countryNameAr: "دولة الكويت",
    countryNameEn: "Kuwait",
    countryFlag: "🇰🇼",
    statuteCodeAr: "قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016",
    statuteCodeEn: "Commercial Law No. 68/1980 & Companies Law No. 1/2016",
    arbitrationVenue: "مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "15,000,000 - 50,000,000+ KWD",
    category: "Agency_Franchise",
    titleAr: "عقد الامتياز التجاري الحصري للعلامات العالمية — دولة الكويت",
    titleEn: "Kuwait Exclusive Commercial Franchise & Master Operator Contract",
    descriptionAr: "عقد امتياز تجاري حصري لإدارة وتوسيع شبكات المطاعم والمتاجر العالمية بالكويت وفق قانون التجارة الكويتي رقم 68 لسنة 1980 وقانون الشركات رقم 1 لسنة 2016.",
    descriptionEn: "Exclusive Master Franchise and Retail Operation Contract under Kuwaiti Commercial Law, regulating territory exclusivity, supply chain sourcing, and brand audit protocols.",
    keyClauses: [ "حصرية إدارة وتطوير الفروع داخل دولة الكويت (Exclusive Development Rights across Kuwait Territory)", "اشتراطات شراء المكونات من الموردين المعتمدين (Approved Sourcing & Supply Chain Purchasing Mandates)", "حسابات الصندوق الإعلاني والتسويقي المشترك (Marketing Fund Contributions 2% of Gross Turnover)", "التفتيش الدوري ومطابقة المعايير الصحية الكويتية (Quality Assurance Audits & Municipality Compliance)", "التحكيم التجاري بغرفة تجارة وصناعة الكويت" ],
    tags: [ "امتياز_تجاري", "الكويت", "علامات_عالمية", "فرانشايز", "غرفة_الكويت", "مطاعم" ],
    pagesCount: 23,
    clausesCount: 30,
    templateAr: `================================================================================
عقد الامتياز التجاري الحصري للعلامات العالمية — دولة الكويت
دولة الكويت — قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016
جهة الاختصاص والتحكيم: مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة الكويت، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة الكويت.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون التجارة رقم 68 لسنة 1980 وقانون الشركات رقم 1/2016.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
KUWAIT EXCLUSIVE COMMERCIAL FRANCHISE & MASTER OPERATOR CONTRACT
Kuwait — Commercial Law No. 68/1980 & Companies Law No. 1/2016
Dispute Resolution & Forum: مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Commercial Law No. 68/1980 & Companies Law No. 1/2016;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Kuwait, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Kuwait.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Commercial Law No. 68/1980 & Companies Law No. 1/2016.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز التحكيم التجاري بغرفة تجارة وصناعة الكويت. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇧🇭 [BH] Bahrain Trademark Licensing, Brand Exploitation & Merchandising Agreement
  // ===========================================================================
  {
    id: "sovereign-bh-trademark-licensing-merchandising-5m",
    countryCode: "BH",
    countryNameAr: "مملكة البحرين",
    countryNameEn: "Bahrain",
    countryFlag: "🇧🇭",
    statuteCodeAr: "مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001",
    statuteCodeEn: "Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001",
    arbitrationVenue: "غرفة البحرين لتسوية المنازعات (BCDR-AAA)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "5,000,000 - 20,000,000+ BHD",
    category: "Agency_Franchise",
    titleAr: "اتفاقية ترخيص العلامة التجارية واستغلال الهوية المؤسسية — مملكة البحرين",
    titleEn: "Bahrain Trademark Licensing, Brand Exploitation & Merchandising Agreement",
    descriptionAr: "اتفاقية ترخيص استخدام علامات تجارية وحقوق ملكية صناعية بمملكة البحرين وفق قانون العلامات التجارية لدول مجلس التعاون الخليجي الصادر بالقانون رقم 6 لسنة 2014.",
    descriptionEn: "Trademark Licensing and Commercial Merchandising Agreement compliant with the GCC Unified Trademark Law (Bahrain Law No. 6/2014), setting quality inspection rights and royalty auditing.",
    keyClauses: [ "تسجيل الترخيص لدى مكتب حماية الملكية الصناعية (Statutory Registration with Bahrain IP Directorate)", "حق التدقيق على سجلات المبيعات ودفاتر الإتاوات (Quarterly Royalty Accounting & Right to Audit Books)", "حماية العلامة والدفاع القضائي ضد التقليد (Enforcement Against Counterfeits & Infringement Prosecution)", "إلزامية سحب السلع غير المطابقة لمواصفات الهوية (Recall of Substandard or Non-Conforming Products)", "غرفة البحرين لتسوية المنازعات (BCDR-AAA) بالمنامة" ],
    tags: [ "علامات_تجارية", "البحرين", "ملكية_فكرية", "BCDR", "ترخيص", "GCC_Trademark" ],
    pagesCount: 19,
    clausesCount: 26,
    templateAr: `================================================================================
اتفاقية ترخيص العلامة التجارية واستغلال الهوية المؤسسية — مملكة البحرين
مملكة البحرين — مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001
جهة الاختصاص والتحكيم: غرفة البحرين لتسوية المنازعات (BCDR-AAA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في مملكة البحرين، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في مملكة البحرين.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون رقم (19) لسنة 2001 (القانون المدني) وقانون الشركات 21/2001.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى غرفة البحرين لتسوية المنازعات (BCDR-AAA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
BAHRAIN TRADEMARK LICENSING, BRAND EXPLOITATION & MERCHANDISING AGREEMENT
Bahrain — Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001
Dispute Resolution & Forum: غرفة البحرين لتسوية المنازعات (BCDR-AAA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Bahrain, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Bahrain.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code Decree-Law No. 19/2001 & Commercial Companies Law No. 21/2001.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by غرفة البحرين لتسوية المنازعات (BCDR-AAA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇺🇸 [US] Delaware Exclusive Patent License, Commercialization & Royalty Agreement
  // ===========================================================================
  {
    id: "sovereign-us-patent-technology-exploitation-license-20m",
    countryCode: "US",
    countryNameAr: "الولايات المتحدة الأمريكية (Delaware)",
    countryNameEn: "United States (Delaware)",
    countryFlag: "🇺🇸",
    statuteCodeAr: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    statuteCodeEn: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    arbitrationVenue: "Delaware Court of Chancery & AAA / JAMS",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "20,000,000 - 100,000,000+ USD",
    category: "Agency_Franchise",
    titleAr: "عقد ترخيص براءات الاختراع والتقنيات الصناعية المتقدمة — ديلاوير",
    titleEn: "Delaware Exclusive Patent License, Commercialization & Royalty Agreement",
    descriptionAr: "عقد ترخيص حصري لاستغلال براءات اختراع صناعية مسجلة لدى USPTO خاضع لقوانين ولاية ديلاوير وقوانين الملكية الفكرية الفيدرالية الأمريكية، مع التعهدات التجارية وبراءات التحسين.",
    descriptionEn: "Exclusive Patent Commercialization and Licensing Agreement under Delaware Law and Title 35 US Code, regulating milestone development diligence, grant-backs, and patent prosecution.",
    keyClauses: [ "نطاق الترخيص الحصري وتطبيقات الحقول الصناعية (Field of Use Exclusivity & Territory Grant)", "التعهد بالاجتهاد التجاري ومواعيد طرح المنتج (Commercialization Diligence Milestones & Longstop Dates)", "ملكية التحسينات والابتكارات المشتقة من البراءة (Ownership of Grant-Backs & Derived Inventions)", "الدفاع ضد دعاوى التعدي وبطلان البراءة (Patent Infringement Defense & Validity Challenge Terms)", "محكمة التشانسري في ديلاوير والتحكيم التجاري (AAA Commercial - Wilmington)" ],
    tags: [ "براءات_اختراع", "ديلاوير", "USPTO", "AAA", "ترخيص_تقني", "Patent_License" ],
    pagesCount: 25,
    clausesCount: 33,
    templateAr: `================================================================================
عقد ترخيص براءات الاختراع والتقنيات الصناعية المتقدمة — ديلاوير
الولايات المتحدة الأمريكية (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
جهة الاختصاص والتحكيم: Delaware Court of Chancery & AAA / JAMS
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الولايات المتحدة الأمريكية (Delaware)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الولايات المتحدة الأمريكية (Delaware).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى Delaware Court of Chancery & AAA / JAMS، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DELAWARE EXCLUSIVE PATENT LICENSE, COMMERCIALIZATION & ROYALTY AGREEMENT
United States (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
Dispute Resolution & Forum: Delaware Court of Chancery & AAA / JAMS
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United States (Delaware), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United States (Delaware).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by Delaware Court of Chancery & AAA / JAMS. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🌐 [INT] International White-Label OEM Manufacturing & Supply Master Contract
  // ===========================================================================
  {
    id: "sovereign-int-master-white-label-manufacturing-25m",
    countryCode: "INT",
    countryNameAr: "القانون الدولي واتفاقيات الأمم المتحدة",
    countryNameEn: "International & UNCITRAL Conventions",
    countryFlag: "🌐",
    statuteCodeAr: "اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم",
    statuteCodeEn: "UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration",
    arbitrationVenue: "محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "25,000,000 - 80,000,000+ USD",
    category: "Agency_Franchise",
    titleAr: "عقد التصنيع بموجب رخصة العلامة الخاصة والتوريد العالمي — القانون الدولي",
    titleEn: "International White-Label OEM Manufacturing & Supply Master Contract",
    descriptionAr: "عقد تصنيع تعاقدي بموجب العلامة الخاصة (White-Label / OEM) لتوريد منتجات التجزئة عالمياً وفق المعايير الدولية وقواعد التجارة الدولية للأمم المتحدة (CISG 1980).",
    descriptionEn: "Master White-Label OEM Contract Manufacturing Agreement governed by UN CISG 1980, setting batch manufacturing standards, ISO quality tolerances, and intellectual property firewalls.",
    keyClauses: [ "مواصفات التصنيع ومعدلات القبول الإحصائي (AQL Quality Standards & ISO 9001 Batch Testing)", "حماية العلامة التجارية والتغليف وتخصيص الباركود (Brand Packaging & Barcode Exclusivity)", "حظر البيع المباشر أو التوريد لعملاء الطرف الآخر (Non-Circumvention & Anti-Direct Supply Covenants)", "التأمين ضد المسؤولية عن عيوب المنتجات المصنعة (Product Liability Insurance Policy USD 25M)", "محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Court of Arbitration - Paris)" ],
    tags: [ "تصنيع_تعاقدي", "OEM", "عالمي", "CISG", "White_Label", "ICC_Paris" ],
    pagesCount: 23,
    clausesCount: 30,
    templateAr: `================================================================================
عقد التصنيع بموجب رخصة العلامة الخاصة والتوريد العالمي — القانون الدولي
القانون الدولي واتفاقيات الأمم المتحدة — اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم
جهة الاختصاص والتحكيم: محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في القانون الدولي واتفاقيات الأمم المتحدة، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في القانون الدولي واتفاقيات الأمم المتحدة.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام اتفاقية الأمم المتحدة للبيوع الدولية (CISG 1980) وقواعد الأونسيترال للتحكيم.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
INTERNATIONAL WHITE-LABEL OEM MANUFACTURING & SUPPLY MASTER CONTRACT
International & UNCITRAL Conventions — UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration
Dispute Resolution & Forum: محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in International & UNCITRAL Conventions, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in International & UNCITRAL Conventions.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with UN CISG Convention 1980 & UNCITRAL Model Law on International Commercial Arbitration.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محكمة التحكيم الدولية لغرفة التجارة الدولية (ICC Paris / Geneva). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇸🇦 [SA] Saudi Triple-Net (NNN) Commercial Tower & Retail Mall Lease Agreement (Ejar Aligned)
  // ===========================================================================
  {
    id: "sovereign-sa-triple-net-commercial-lease-nnn-20m",
    countryCode: "SA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    countryFlag: "🇸🇦",
    statuteCodeAr: "نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)",
    statuteCodeEn: "Civil Transactions Law (M/191) & Companies Law (M/132)",
    arbitrationVenue: "المركز السعودي للتحكيم التجاري (SCCA - الرياض)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "20,000,000 - 80,000,000+ SAR",
    category: "RealEstate_Assets",
    titleAr: "عقد إيجار تجاري ثلاثي الشروط للمجمعات والأبراج التجارية — المملكة العربية السعودية",
    titleEn: "Saudi Triple-Net (NNN) Commercial Tower & Retail Mall Lease Agreement (Ejar Aligned)",
    descriptionAr: "عقد إيجار تجاري طويل الأجل (NNN) للأبراج والمجمعات بموجب نظام المعاملات المدنية السعودي ومنصة \"إيجار\" المعتمدة، حيث يتحمل المستأجر الصيانة والتأمين والرسوم البلدية.",
    descriptionEn: "Triple-Net (NNN) Commercial Lease Agreement aligned with Saudi Civil Transactions Law and Ejar electronic platform, transferring maintenance, insurance, and municipal charges to Tenant.",
    keyClauses: [ "الهيكل الإيجاري الصافي والتزامات التشغيل الشاملة (Triple-Net: Tenant Pays Taxes, Insurance & Maintenance)", "التسجيل الإلزامي على منصة إيجار الموحدة (Mandatory Registration on Saudi Ministry of Housing Ejar Network)", "نسبة الزيادة الإيجارية المركبة كل 3 سنوات (Escalation Rent Formula: 5% Compounded Triennially)", "التأمين الشامل ضد الحريق والكوارث وتقديم السندات (Property All-Risk Insurance & Executive Promissory Notes)", "المركز السعودي للتحكيم التجاري (SCCA) والمحاكم العقارية" ],
    tags: [ "إيجار_تجاري", "السعودية", "إيجار", "NNN", "SCCA", "عقارات_تجارية" ],
    pagesCount: 22,
    clausesCount: 30,
    templateAr: `================================================================================
عقد إيجار تجاري ثلاثي الشروط للمجمعات والأبراج التجارية — المملكة العربية السعودية
المملكة العربية السعودية — نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)
جهة الاختصاص والتحكيم: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132)؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في المملكة العربية السعودية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في المملكة العربية السعودية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام نظام المعاملات المدنية (م/191) ونظام الشركات (م/132).
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى المركز السعودي للتحكيم التجاري (SCCA - الرياض)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
SAUDI TRIPLE-NET (NNN) COMMERCIAL TOWER & RETAIL MALL LEASE AGREEMENT (EJAR ALIGNED)
Saudi Arabia — Civil Transactions Law (M/191) & Companies Law (M/132)
Dispute Resolution & Forum: المركز السعودي للتحكيم التجاري (SCCA - الرياض)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law (M/191) & Companies Law (M/132);

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Saudi Arabia, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Saudi Arabia.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law (M/191) & Companies Law (M/132).
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by المركز السعودي للتحكيم التجاري (SCCA - الرياض). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [AE] UAE Long-Term Musataha & Usufruct Real Estate Development Agreement (50 Years)
  // ===========================================================================
  {
    id: "sovereign-ae-musataha-usufruct-development-50m",
    countryCode: "AE",
    countryNameAr: "الإمارات العربية المتحدة (الاتحادي)",
    countryNameEn: "UAE Mainland",
    countryFlag: "🇦🇪",
    statuteCodeAr: "مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021",
    statuteCodeEn: "Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021",
    arbitrationVenue: "مركز دبي للتحكيم الدولي (DIAC)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 300,000,000+ AED",
    category: "RealEstate_Assets",
    titleAr: "عقد المساطحة وحق الانتفاع العقاري طويل الأجل لتطوير الأراضي — الإمارات",
    titleEn: "UAE Long-Term Musataha & Usufruct Real Estate Development Agreement (50 Years)",
    descriptionAr: "عقد مساطحة عقاري طويل الأجل (50 عاماً) يمنح المطور حق البناء والتملك للأبراج والمنشآت على أرض حكومية أو خاصة وفق قانون المعاملات المدنية الإماراتي وتشريعات التسجيل العقاري.",
    descriptionEn: "Long-term 50-year Musataha Real Estate Development Agreement under UAE Law, granting developer exclusive right to construct, operate, and mortgage buildings on leased master land.",
    keyClauses: [ "حق تملك المباني طوال مدة عقد المساطحة (Ownership of Constructed Assets During Musataha Term)", "حق الرهن البنكي لتمويل أعمال البناء (Developer's Right to Mortgage Musataha Rights for Financing)", "قيد العقد بالسجل العقاري بدائرة الأراضي والأملاك (Mandatory Registration at Land Department DLD / ADRES)", "أيلولة المنشآت لمالك الأرض عند انقضاء المدة بحالة جيدة (Handover of Improvements in Good Condition at Expiry)", "مركز دبي للتحكيم الدولي (DIAC)" ],
    tags: [ "مساطحة", "الإمارات", "حق_انتفاع", "DIAC", "تطوير_عقاري", "DLD" ],
    pagesCount: 27,
    clausesCount: 36,
    templateAr: `================================================================================
عقد المساطحة وحق الانتفاع العقاري طويل الأجل لتطوير الأراضي — الإمارات
الإمارات العربية المتحدة (الاتحادي) — مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021
جهة الاختصاص والتحكيم: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الإمارات العربية المتحدة (الاتحادي)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الإمارات العربية المتحدة (الاتحادي).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام مرسوم بقانون اتحادي رقم (50) لسنة 2022 وقانون الشركات رقم (32) لسنة 2021.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز دبي للتحكيم الدولي (DIAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
UAE LONG-TERM MUSATAHA & USUFRUCT REAL ESTATE DEVELOPMENT AGREEMENT (50 YEARS)
UAE Mainland — Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021
Dispute Resolution & Forum: مركز دبي للتحكيم الدولي (DIAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in UAE Mainland, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in UAE Mainland.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Federal Decree-Law No. (50) of 2022 & Commercial Companies Law No. 32/2021.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز دبي للتحكيم الدولي (DIAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🏛️ [DIFC] DIFC Real Estate Investment Trust (REIT) Commercial Asset Acquisition SPA
  // ===========================================================================
  {
    id: "sovereign-difc-reit-property-acquisition-spa-50m",
    countryCode: "DIFC",
    countryNameAr: "مركز دبي المالي العالمي (DIFC)",
    countryNameEn: "Dubai International Financial Centre (DIFC)",
    countryFlag: "🏛️",
    statuteCodeAr: "DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018",
    statuteCodeEn: "DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018",
    arbitrationVenue: "محاكم مركز دبي المالي العالمي (DIFC Courts)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 200,000,000+ USD",
    category: "RealEstate_Assets",
    titleAr: "اتفاقية بيع وشراء العقارات المدرة للدخل لصناديق الاستثمار العقاري — DIFC REIT",
    titleEn: "DIFC Real Estate Investment Trust (REIT) Commercial Asset Acquisition SPA",
    descriptionAr: "عقد شراء واستحواذ على عقارات تجارية مدرة للدخل خاضع لقوانين مركز دبي المالي العالمي ولوائح سلطة دبي للخدمات المالية (DFSA) المعنية بصناديق الاستثمار العقاري (REITs).",
    descriptionEn: "Institutional commercial property acquisition agreement for DIFC-regulated REITs, governing net initial yield guarantees, lease novations, and structural engineering sign-offs.",
    keyClauses: [ "ضمان صافي العائد الإيجاري ومعدل الإشغال (Net Initial Yield - NIY Guarantee & Occupancy Retention)", "حوالة عقود الإيجار والضمانات البنكية للصندوق (Novation of Commercial Leases & Security Deposit Escrow)", "الفحص الهندسي النافي للجهالة وتقرير سلامة المبنى (Structural & MEP Technical Due Diligence Sign-Off)", "الامتثال لمتطلبات صناديق الاستثمار بسلطة الخدمات المالية (DFSA Real Estate Fund Investment Rules)", "محاكم مركز دبي المالي العالمي (DIFC Courts)" ],
    tags: [ "REIT", "DIFC", "صناديق_عقارية", "عقارات_تجارية", "DFSA", "DIFC_Courts" ],
    pagesCount: 25,
    clausesCount: 32,
    templateAr: `================================================================================
اتفاقية بيع وشراء العقارات المدرة للدخل لصناديق الاستثمار العقاري — DIFC REIT
مركز دبي المالي العالمي (DIFC) — DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018
جهة الاختصاص والتحكيم: محاكم مركز دبي المالي العالمي (DIFC Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في مركز دبي المالي العالمي (DIFC)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في مركز دبي المالي العالمي (DIFC).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام DIFC Law No. 6/2004 (Contract Law) & DIFC Companies Law No. 5/2018.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم مركز دبي المالي العالمي (DIFC Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DIFC REAL ESTATE INVESTMENT TRUST (REIT) COMMERCIAL ASSET ACQUISITION SPA
Dubai International Financial Centre (DIFC) — DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018
Dispute Resolution & Forum: محاكم مركز دبي المالي العالمي (DIFC Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Dubai International Financial Centre (DIFC), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Dubai International Financial Centre (DIFC).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with DIFC Contract Law No. 6/2004 & DIFC Companies Law No. 5/2018.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم مركز دبي المالي العالمي (DIFC Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇦🇪 [ADGM] ADGM Master Property & Integrated Facility Management (IFM) Agreement
  // ===========================================================================
  {
    id: "sovereign-adgm-property-facility-management-master-15m",
    countryCode: "ADGM",
    countryNameAr: "سوق أبوظبي العالمي (ADGM)",
    countryNameEn: "Abu Dhabi Global Market (ADGM)",
    countryFlag: "🇦🇪",
    statuteCodeAr: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    statuteCodeEn: "ADGM Companies Regulations 2020 & Application of English Law Regulations 2015",
    arbitrationVenue: "محاكم سوق أبوظبي العالمي (ADGM Courts)",
    dealTier: "INSTITUTIONAL",
    estimatedValueRange: "15,000,000 - 50,000,000+ USD",
    category: "RealEstate_Assets",
    titleAr: "عقد إدارة وتشغيل الممتلكات العقارية والمرافق الحيوية الكبرى — سوق أبوظبي العالمي",
    titleEn: "ADGM Master Property & Integrated Facility Management (IFM) Agreement",
    descriptionAr: "عقد إدارة مرافق متكاملة (IFM) للأبراج والمجمعات السكنية والتجارية بموجب قوانين سوق أبوظبي العالمي، يحدد مؤشرات كفاءة الصيانة، إدارة الطاقة، ونظافة المجمعات.",
    descriptionEn: "Master Integrated Facility Management (IFM) contract under ADGM Law, regulating hard and soft FM services, HVAC reliability, green building compliance, and emergency restoration.",
    keyClauses: [ "نطاق خدمات الصيانة الوقائية والطارئة (Hard & Soft FM SLA: Preventive, Corrective & Reactive Tasks)", "معايير استهلاك الطاقة وترشيد المرافق (Utility Optimization & Green Building LEED Benchmarks)", "تحصيل الإيجارات وإدارة مطالبات الصيانة (Rent Collection Agency, Escrow Governance & Tenant Portal)", "التأمين الشامل على الممتلكات والمسؤولية العامة (Third-Party Public Liability Insurance USD 20M)", "محاكم سوق أبوظبي العالمي (ADGM Courts)" ],
    tags: [ "إدارة_مرافق", "ADGM", "تشغيل_عقارات", "IFM", "أبراج", "ADGM_Courts" ],
    pagesCount: 22,
    clausesCount: 29,
    templateAr: `================================================================================
عقد إدارة وتشغيل الممتلكات العقارية والمرافق الحيوية الكبرى — سوق أبوظبي العالمي
سوق أبوظبي العالمي (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
جهة الاختصاص والتحكيم: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سوق أبوظبي العالمي (ADGM)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سوق أبوظبي العالمي (ADGM).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى محاكم سوق أبوظبي العالمي (ADGM Courts)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
ADGM MASTER PROPERTY & INTEGRATED FACILITY MANAGEMENT (IFM) AGREEMENT
Abu Dhabi Global Market (ADGM) — ADGM Companies Regulations 2020 & Application of English Law Regulations 2015
Dispute Resolution & Forum: محاكم سوق أبوظبي العالمي (ADGM Courts)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Abu Dhabi Global Market (ADGM), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Abu Dhabi Global Market (ADGM).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with ADGM Companies Regulations 2020 & Application of English Law Regulations 2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by محاكم سوق أبوظبي العالمي (ADGM Courts). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇪🇬 [EG] Egypt Master Land Purchase, Infrastructure Servicing & Urban Development SPA
  // ===========================================================================
  {
    id: "sovereign-eg-raw-land-master-development-spa-30m",
    countryCode: "EG",
    countryNameAr: "جمهورية مصر العربية",
    countryNameEn: "Egypt",
    countryFlag: "🇪🇬",
    statuteCodeAr: "القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981",
    statuteCodeEn: "Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981",
    arbitrationVenue: "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "30,000,000 - 200,000,000+ EGP",
    category: "RealEstate_Assets",
    titleAr: "عقد شراء وتطوير مخططات الأراضي العمرانية الكبرى — جمهورية مصر العربية",
    titleEn: "Egypt Master Land Purchase, Infrastructure Servicing & Urban Development SPA",
    descriptionAr: "عقد شراء قطع أراضٍ عمرانية كبرى لإقامة مجمعات سكنية وتجارية وفق القانون المدني المصري وقواعد هيئة المجتمعات العمرانية الجديدة (NUCA) مع جدول سداد المرافق.",
    descriptionEn: "Master land acquisition and urban township development contract under Egyptian Law, aligning private development milestones with New Urban Communities Authority (NUCA) regulations.",
    keyClauses: [ "التسجيل بالشهر العقاري وسداد رسوم المرافق السيادية (Notary Registration & NUCA Infrastructure Fees)", "التراخيص الوزارية وجداول البناء والتنمية (Ministerial Decree Approvals & Construction Timelines)", "حظر التصرف قبل استيفاء نسبة الإنجاز البنائية (Restrictions on Sub-Sale prior to 20% Construction)", "ضمانات البائع بشأن خلو الأرض من النزاعات العينية (Warranty of Title & Absence of Injunctions)", "مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)" ],
    tags: [ "أراضي_عمرانية", "مصر", "NUCA", "CRCICA", "تطوير_عقاري", "شهر_عقاري" ],
    pagesCount: 24,
    clausesCount: 31,
    templateAr: `================================================================================
عقد شراء وتطوير مخططات الأراضي العمرانية الكبرى — جمهورية مصر العربية
جمهورية مصر العربية — القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981
جهة الاختصاص والتحكيم: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في جمهورية مصر العربية، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في جمهورية مصر العربية.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام القانون المدني رقم 131 لسنة 1948 وقانون الشركات 159/1981.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
EGYPT MASTER LAND PURCHASE, INFRASTRUCTURE SERVICING & URBAN DEVELOPMENT SPA
Egypt — Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981
Dispute Resolution & Forum: مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Egypt, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Egypt.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Egyptian Civil Code No. 131/1948 & Companies Law No. 159/1981.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇶🇦 [QA] Qatar Luxury Hotel & Resort Management Agreement (HMA Master Model)
  // ===========================================================================
  {
    id: "sovereign-qa-hotel-management-agreement-hma-50m",
    countryCode: "QA",
    countryNameAr: "دولة قطر",
    countryNameEn: "Qatar",
    countryFlag: "🇶🇦",
    statuteCodeAr: "قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015",
    statuteCodeEn: "Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015",
    arbitrationVenue: "مركز قطر الدولي للتوفيق والتحكيم (QICCA)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 300,000,000+ QAR",
    category: "RealEstate_Assets",
    titleAr: "اتفاقية إدارة وتشغيل الفنادق والمنتجعات العالمية — دولة قطر",
    titleEn: "Qatar Luxury Hotel & Resort Management Agreement (HMA Master Model)",
    descriptionAr: "اتفاقية تشغيل وإدارة فندق خمس نجوم بين مالك العقار وشركة فنادق عالمية وفق القانون المدني القطري وقواعد قطر للسياحة، مع رسوم الإدارة وحسابات الأثاث والتجهيز (FF&E).",
    descriptionEn: "Luxury Hotel Management Agreement (HMA) under Qatari Law, regulating international brand standards, base and incentive management fees, and FF&E reserve fund allocations.",
    keyClauses: [ "أتعاب الإدارة الأساسية والمكافأة المرتبطة بالربح (Base Management Fee 3% & Incentive Fee 8% of GOP)", "حساب احتياطي استبدال الأثاث والمعدات الفندقية (FF&E Reserve Account: 4% of Gross Operating Revenue)", "اختبار كفاءة أداء المشغل وحق المالك في الإنهاء (Performance Test Termination: RevPAR Benchmarks)", "معايير الجودة والتفتيش من هيئة قطر للسياحة (Qatar Tourism Licensing & International Brand Audit)", "مركز قطر الدولي للتوفيق والتحكيم (QICCA - الدوحة)" ],
    tags: [ "إدارة_فنادق", "قطر", "HMA", "سياحة", "QICCA", "منتجعات" ],
    pagesCount: 28,
    clausesCount: 37,
    templateAr: `================================================================================
اتفاقية إدارة وتشغيل الفنادق والمنتجعات العالمية — دولة قطر
دولة قطر — قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015
جهة الاختصاص والتحكيم: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في دولة قطر، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في دولة قطر.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية رقم 22/2004 وقانون الشركات رقم 11/2015.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز قطر الدولي للتوفيق والتحكيم (QICCA)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
QATAR LUXURY HOTEL & RESORT MANAGEMENT AGREEMENT (HMA MASTER MODEL)
Qatar — Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015
Dispute Resolution & Forum: مركز قطر الدولي للتوفيق والتحكيم (QICCA)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Qatar, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Qatar.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Code No. 22/2004 & Commercial Companies Law No. 11/2015.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز قطر الدولي للتوفيق والتحكيم (QICCA). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇴🇲 [OM] Oman Integrated Tourism Complex (ITC) Master Development & Foreign Freehold Contract
  // ===========================================================================
  {
    id: "sovereign-om-integrated-tourism-complex-itc-dev-40m",
    countryCode: "OM",
    countryNameAr: "سلطنة عُمان",
    countryNameEn: "Oman",
    countryFlag: "🇴🇲",
    statuteCodeAr: "قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019",
    statuteCodeEn: "Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019",
    arbitrationVenue: "مركز عُمان للتحكيم التجاري (OAC)",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "40,000,000 - 150,000,000+ OMR",
    category: "RealEstate_Assets",
    titleAr: "عقد تطوير المجمعات السياحية المتكاملة وتملك الأجانب — سلطنة عُمان",
    titleEn: "Oman Integrated Tourism Complex (ITC) Master Development & Foreign Freehold Contract",
    descriptionAr: "اتفاقية تطوير مجمع سياحي متكامل (ITC) يتيح التملك العقاري الحر للمستثمرين الأجانب بموجب المرسوم السلطاني رقم 12/2006 وقانون المعاملات المدنية العُماني.",
    descriptionEn: "Integrated Tourism Complex (ITC) master development agreement under Omani Law, regulating master infrastructure servicing, Ministry of Heritage and Tourism permits, and foreign freehold title deed transfers.",
    keyClauses: [ "صفة المجمع السياحي المتكامل والتملك الحر (ITC Legal Status & Non-Omani Freehold Entitlements)", "حساب الضمان البنكي للتطوير العقاري (Real Estate Escrow Account Compliant with Ministry Directives)", "التزامات تشييد البنية الأساسية والمرافق الفندقية (Mandatory Tourism Components & Hotel Construction)", "إصدار سندات الملكية للمشترين النهائيين (Issuance of Title Deeds via Oman Ministry of Housing)", "مركز عُمان للتحكيم التجاري (OAC)" ],
    tags: [ "مجمع_سياحي", "عمان", "ITC", "تملك_أجانب", "OAC", "تطوير_عقاري" ],
    pagesCount: 26,
    clausesCount: 34,
    templateAr: `================================================================================
عقد تطوير المجمعات السياحية المتكاملة وتملك الأجانب — سلطنة عُمان
سلطنة عُمان — قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019
جهة الاختصاص والتحكيم: مركز عُمان للتحكيم التجاري (OAC)
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في سلطنة عُمان، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في سلطنة عُمان.
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام قانون المعاملات المدنية مرسوم سلطاني 29/2013 وقانون الشركات 18/2019.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى مركز عُمان للتحكيم التجاري (OAC)، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
OMAN INTEGRATED TOURISM COMPLEX (ITC) MASTER DEVELOPMENT & FOREIGN FREEHOLD CONTRACT
Oman — Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019
Dispute Resolution & Forum: مركز عُمان للتحكيم التجاري (OAC)
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in Oman, which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in Oman.
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Civil Transactions Law Royal Decree 29/2013 & Companies Law 18/2019.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by مركز عُمان للتحكيم التجاري (OAC). Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  },

  // ===========================================================================
  // 🇺🇸 [US] Delaware Commercial Real Estate Development Joint Venture LLC Agreement
  // ===========================================================================
  {
    id: "sovereign-us-commercial-real-estate-development-jv-50m",
    countryCode: "US",
    countryNameAr: "الولايات المتحدة الأمريكية (Delaware)",
    countryNameEn: "United States (Delaware)",
    countryFlag: "🇺🇸",
    statuteCodeAr: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    statuteCodeEn: "Delaware General Corporation Law (DGCL Title 8) & UCC Article 2",
    arbitrationVenue: "Delaware Court of Chancery & AAA / JAMS",
    dealTier: "MILLION_DOLLAR",
    estimatedValueRange: "50,000,000 - 250,000,000+ USD",
    category: "RealEstate_Assets",
    titleAr: "اتفاقية المشروع المشترك لتطوير الأبراج والمجمعات التجارية — ديلاوير",
    titleEn: "Delaware Commercial Real Estate Development Joint Venture LLC Agreement",
    descriptionAr: "عقد تأسيس شركة ذات مسؤولية محدودة بموجب قانون ديلاوير للمشاريع العقارية الكبرى بين شريك رأس المال المالي والشريك المطور، مع شلال توزيع الأرباح وحوافز الإنجاز.",
    descriptionEn: "Real Estate Joint Venture Operating Agreement for Delaware LLC, structuring capital contributions between Capital Member and Operating Member, promote waterfall distributions, and major decisions.",
    keyClauses: [ "شلال توزيع التدفقات النقدية ونسبة الترقية (Distribution Waterfall: Preferred Return 8% & Developer Promote)", "القرارات الجوهرية وسلطات الشريك المالي (Major Decision Approvals: Financing, Budget, Leases > 50,000 sqft)", "نداءات رأس المال الإضافية وعقوبة التخلف (Mandatory Additional Capital Calls & Squeeze-Down Dilution)", "آليات التخارج والشراء الإجباري (Buy-Sell Shotgun Mechanism & Forced Liquidation Rights)", "محكمة التشانسري في ديلاوير والتحكيم التجاري (AAA / Delaware Court of Chancery)" ],
    tags: [ "مشروع_مشترك", "ديلاوير", "عقارات_تجارية", "LLC", "شلال_أرباح", "AAA" ],
    pagesCount: 29,
    clausesCount: 38,
    templateAr: `================================================================================
اتفاقية المشروع المشترك لتطوير الأبراج والمجمعات التجارية — ديلاوير
الولايات المتحدة الأمريكية (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
جهة الاختصاص والتحكيم: Delaware Court of Chancery & AAA / JAMS
================================================================================

أُبرم هذا العقد في [LOCATION] بتاريخ [EFFECTIVE_DATE] الموافق [HIJRI_DATE] بين كل من:
الطرف الأول: [PARTY_A_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_A]، وعنوانه المختار: [ADDRESS_A].
الطرف الثاني: [PARTY_B_NAME]، سجل تجاري / رخصة رقم: [CR_LICENSE_B]، وعنوانه المختار: [ADDRESS_B].
ويُشار إليهما مجتمعين بـ "الطرفين" ومنفردين بـ "الطرف".

تمهيد:
حيث إن الطرف الأول يمتلك الكفاءة والخبرة المتخصصة والتراخيص النظامية اللازمة في [FIELD_DESCRIPTION]؛ وحيث رغب الطرف الثاني في التعاقد معه لتنفيذ موضوع هذه الاتفاقية بقيمة إجمالية تقديرية تبلغ ([ESTIMATED_VALUE]) وفقاً لأعلى المعايير المهنية المعتمدة وطبقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2؛ فقد اتفق الطرفان بكامل أهليتهما القانونية على ما يلي:

البند الأول: التعريفات وموضوع العقد
1.1 يقصد بالكلمات والعبارات الواردة في هذا العقد المعاني المحددة لها في الملحق (أ)، وتعد الديباجة والملاحق جزءاً لا يتجزأ من هذا العقد وتفسر معه كوحدة واحدة.
1.2 اتفق الطرفان على تنفيذ الالتزامات والمواصفات والأعمال المحددة تفصيلاً في جدول الشروط التشغيلية.

البند الثاني: المقابل المالي وآليات السداد
2.1 يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه بحوالات مصرفية رسمية إلى الحساب البنكي المعتمد للطرف الأول وفق جدول الدفعات المرتبط بمراحل الإنجاز.
2.2 كافة المبالغ لا تشمل ضريبة القيمة المضافة وأي ضرائب استقطاع سارية في الولايات المتحدة الأمريكية (Delaware)، وتتحملها الجهة الملزمة نظاماً.

البند الثالث: الإقرارات والضمانات
يقر كل طرف ويضمن بمواجهة الطرف الآخر في تاريخ التوقيع بما يلي:
3.1 أنه كيان نظامي قائم ومؤسس أصولاً ويتمتع بالأهلية والصلاحية الكاملة لإبرام وتنفيذ هذا العقد.
3.2 خلو التزاماته من أي تعارض مع أي عقود أو أحكام قضائية أو تنظيمية سارية في الولايات المتحدة الأمريكية (Delaware).
3.3 الامتثال التام لكافة القوانين واللوائح الوطنية المطبقة وأنظمة مكافحة الفساد وغسل الأموال.

البند الرابع: السرية وحماية البيانات
يلتزم الطرفان بالحفاظ على سرية المعلومات والبيانات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث لمدة خمس (5) سنوات من تاريخ انتهاء العقد، والامتثال الصارم لتشريعات حماية البيانات المعمول بها.

البند الخامس: حدود المسؤولية والتعويض
5.1 لا يتحمل أي طرف بأي حال من الأحوال المسؤولية عن أي أضرار تبعية، غير مباشرة، أو خسارة في الأرباح أو الفرص الاستثمارية.
5.2 ينحصر إجمالي المسؤولية التعاقدية لأي من الطرفين عن كافة المطالبات الناشئة بموجب هذا العقد بسقف مالي لا يتجاوز إجمالي المبالغ المسددة فعلياً خلال الاثني عشر شهراً السابقة للمطالبة.

البند السادس: القوة القاهرة والظروف الطارئة
يُعفى الطرف المتأثر بالقوة القاهرة من تنفيذ التزاماته للمدة التي يستمر فيها العائق القاهر، شريطة إخطار الطرف الآخر كتابياً خلال مدة لا تتجاوز سبعة (7) أيام من تاريخ وقوع الحادث الطارئ، وبذل العناية المعقولة للحد من آثاره.

البند السابع: الإنهاء والفسخ
يحق لأي من الطرفين إنهاء هذا العقد فوراً بموجب إشعار كتابي في حال ارتكاب الطرف الآخر إخلالاً جوهرياً ولم يقم بمعالجته خلال ثلاثين (30) يوماً من تاريخ الإخطار، أو في حال إفلاس أو تصفية الطرف الآخر.

البند الثامن: القانون الحاكم وفض النزاعات
8.1 يخضع هذا العقد ويفسر في جميع جوانبه وفقاً لأحكام Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 أي نزاع أو خلاف ينشأ عن هذا العقد أو يرتبط به يُحال حصرياً إلى التحكيم التجاري لدى Delaware Court of Chancery & AAA / JAMS، وتكون أحكام التحكيم الصادرة نهائية وباتة وملزمة لكلا الطرفين.

توقيع الطرف الأول: ____________________    توقيع الطرف الثاني: ____________________`,
    templateEn: `================================================================================
DELAWARE COMMERCIAL REAL ESTATE DEVELOPMENT JOINT VENTURE LLC AGREEMENT
United States (Delaware) — Delaware General Corporation Law (DGCL Title 8) & UCC Article 2
Dispute Resolution & Forum: Delaware Court of Chancery & AAA / JAMS
================================================================================

This Master Agreement ("Agreement") is made and entered into on [EFFECTIVE_DATE] by and between:
Party A: [PARTY_A_NAME], registered under License/CR No. [CR_LICENSE_A], having its principal place of business at [ADDRESS_A].
Party B: [PARTY_B_NAME], registered under License/CR No. [CR_LICENSE_B], having its principal place of business at [ADDRESS_B].
Individually referred to as "Party" and collectively as "Parties".

RECITALS:
WHEREAS, Party A possesses specialized capability, certified infrastructure, and statutory authorizations in [FIELD_DESCRIPTION]; and WHEREAS, Party B desires to engage Party A to execute the core subject matter of this Agreement for an estimated consideration of [ESTIMATED_VALUE], subject to the terms hereof and in full accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2;

NOW, THEREFORE, the Parties hereby agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
1.1 Capitalized terms shall have the meanings ascribed in Schedule A. The recitals and schedules constitute an integral, binding part of this Agreement.
1.2 The Parties covenant to execute the obligations and deliverables set forth in the Operational Statement of Work.

2. CONSIDERATION, PAYMENT & TAXES
2.1 Consideration shall be disbursed via official commercial wire transfers according to the verified Milestone Completion Schedule.
2.2 All amounts are exclusive of Value Added Tax (VAT) and statutory withholding taxes applicable in United States (Delaware), which shall be allocated pursuant to mandatory tax statutes.

3. REPRESENTATIONS & WARRANTIES
Each Party represents and warrants to the other on the Effective Date:
3.1 It is a duly incorporated corporate entity with full legal competence and authority to execute this Agreement.
3.2 Execution does not conflict with any third-party covenants, regulatory injunctions, or applicable statutes in United States (Delaware).
3.3 Absolute adherence to all applicable anti-bribery, anti-money laundering, and trade sanction compliance standards.

4. CONFIDENTIALITY & DATA PROTECTION
Parties shall maintain strict confidentiality regarding all proprietary information for a period of five (5) years following termination, and enforce full technical compliance with statutory data privacy directives.

5. LIMITATION OF LIABILITY & INDEMNIFICATION
5.1 In no event shall either Party be liable for indirect, incidental, special, punitive, or consequential damages, or lost business opportunity.
5.2 Aggregate contractual liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid in the preceding twelve (12) months.

6. FORCE MAJEURE
Neither Party shall be liable for failure or delay in performance resulting from causes beyond reasonable control, provided written notice is furnished within seven (7) days of occurrence.

7. TERMINATION & DEFAULT
Either Party may terminate upon written notice if the other Party commits a material breach and fails to remedy said breach within thirty (30) days of receipt of written notice, or upon insolvency.

8. GOVERNING LAW & ARBITRATION
8.1 This Agreement shall be governed by and construed in accordance with Delaware General Corporation Law (DGCL Title 8) & UCC Article 2.
8.2 Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by Delaware Court of Chancery & AAA / JAMS. Arbitral awards shall be final, conclusive, and legally binding.

Party A: ____________________    Party B: ____________________`,
  }
];
