/**
 * src/data/companyFormationData.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Structured Compliance & Formation Research Dataset
 * Stores jurisdiction metadata, entity types, state rules, and verified statutory checklists.
 * Keeps legal compliance data decoupled from React UI components.
 */

export type VerificationStatus = 
  | 'VERIFIED_SOURCE' 
  | 'USER_PROVIDED' 
  | 'INTERNAL_REFERENCE' 
  | 'UNVERIFIED_REQUIRES_REVIEW';

export interface FormationJurisdiction {
  code: string;
  nameAr: string;
  nameEn: string;
  flag: string;
  hasStateSelection: boolean;
  regulatoryAuthorityAr: string;
  regulatoryAuthorityEn: string;
  lastReviewedDate: string;
  sourceReference: string;
  sourceUrl?: string;
}

export interface USState {
  code: string;
  nameAr: string;
  nameEn: string;
  filingAgencyAr: string;
  filingAgencyEn: string;
  franchiseTaxNoticeAr: string;
  franchiseTaxNoticeEn: string;
  sourceReference: string;
}

export interface FormationEntityType {
  code: string;
  jurisdictionCode: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  minShareholders: number;
  maxShareholders?: number;
  liabilityProtectionAr: string;
  liabilityProtectionEn: string;
}

export interface FormationChecklistItem {
  id: string;
  category: 'FORMATION_STEP' | 'REQUIRED_DOC' | 'COMPLIANCE_REQUIREMENT' | 'VERIFICATION_ITEM';
  jurisdictionCode: string;
  stateCode?: string;
  entityTypeCode: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  source: string;
  sourceUrlIfAvailable?: string;
  verificationStatus: VerificationStatus;
  lastVerified: string;
  notesAr?: string;
  notesEn?: string;
}

// ─── 1. Supported Jurisdictions ────────────────────────────────────────────────
export const JURISDICTIONS_DATA: FormationJurisdiction[] = [
  {
    code: 'SA',
    nameAr: 'المملكة العربية السعودية',
    nameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    hasStateSelection: false,
    regulatoryAuthorityAr: 'وزارة التجارة (MC) والمركز السعودي للأعمال (SBC)',
    regulatoryAuthorityEn: 'Ministry of Commerce (MC) & Saudi Business Center (SBC)',
    lastReviewedDate: '2026-01-15',
    sourceReference: 'نظام الشركات السعودي الصادر بالمرسوم الملكي رقم (م/132) ولائحته التنفيذية',
    sourceUrl: 'https://mc.gov.sa',
  },
  {
    code: 'AE',
    nameAr: 'الإمارات العربية المتحدة',
    nameEn: 'United Arab Emirates',
    flag: '🇦🇪',
    hasStateSelection: false,
    regulatoryAuthorityAr: 'وزارة الاقتصاد ودوائر التنمية الاقتصادية المحلية (DED / DIFC / ADGM)',
    regulatoryAuthorityEn: 'Ministry of Economy & Local Economic Development Departments (DED / DIFC / ADGM)',
    lastReviewedDate: '2026-02-01',
    sourceReference: 'مرسوم بقانون إتحادي رقم (32) لسنة 2021 بشأن الشركات التجارية بالإمارات',
    sourceUrl: 'https://moec.gov.ae',
  },
  {
    code: 'EG',
    nameAr: 'جمهورية مصر العربية',
    nameEn: 'Egypt',
    flag: '🇪🇬',
    hasStateSelection: false,
    regulatoryAuthorityAr: 'الهيئة العامة للاستثمار والمناطق الحرة (GAFI)',
    regulatoryAuthorityEn: 'General Authority for Investment and Free Zones (GAFI)',
    lastReviewedDate: '2026-01-20',
    sourceReference: 'قانون الشركات المصري رقم 159 لسنة 1981 وقانون الاستثمار رقم 72 لسنة 2017',
    sourceUrl: 'https://gafi.gov.eg',
  },
  {
    code: 'US',
    nameAr: 'الولايات المتحدة الأمريكية',
    nameEn: 'United States',
    flag: '🇺🇸',
    hasStateSelection: true, // REQUIRES STATE SELECTION BEFORE STATE-SPECIFIC REQUIREMENTS
    regulatoryAuthorityAr: 'مكاتب وزير الدولة المحلي (Secretary of State - SOS) بالولايات وخزانة IRS',
    regulatoryAuthorityEn: 'State Secretary of State (SOS) Offices & Internal Revenue Service (IRS)',
    lastReviewedDate: '2026-02-10',
    sourceReference: 'State Division of Corporations & IRS Tax Code (Title 26 USC)',
    sourceUrl: 'https://www.irs.gov',
  },
];

// ─── 2. US States Selection ────────────────────────────────────────────────────
export const US_STATES_DATA: USState[] = [
  {
    code: 'US-DE',
    nameAr: 'ديلاوير (Delaware)',
    nameEn: 'Delaware (DE)',
    filingAgencyAr: 'Delaware Division of Corporations',
    filingAgencyEn: 'Delaware Division of Corporations',
    franchiseTaxNoticeAr: 'ضريبة التواجد الفيدرالي الفردية وحفظ التقرير السنوي قبل 1 يونيو للمؤسسات وقبل 1 يونيو لـ LLC',
    franchiseTaxNoticeEn: 'Delaware Annual Franchise Tax due March 1st (Corporations) & June 1st (LLCs)',
    sourceReference: 'Delaware General Corporation Law (8 Del. C.)',
  },
  {
    code: 'US-WY',
    nameAr: 'وايومنغ (Wyoming)',
    nameEn: 'Wyoming (WY)',
    filingAgencyAr: 'Wyoming Secretary of State - Business Division',
    filingAgencyEn: 'Wyoming Secretary of State - Business Division',
    franchiseTaxNoticeAr: 'رسوم التقرير السنوي تضمن الخصوصية وتستحق في أول يوم من شهر التأسيس سنوياً',
    franchiseTaxNoticeEn: 'Wyoming Annual Report due on the first day of the anniversary month of formation',
    sourceReference: 'Wyoming Limited Liability Company Act (W.S. 17-29)',
  },
  {
    code: 'US-CA',
    nameAr: 'كاليفورنيا (California)',
    nameEn: 'California (CA)',
    filingAgencyAr: 'California Secretary of State - Business Programs',
    filingAgencyEn: 'California Secretary of State - Business Programs',
    franchiseTaxNoticeAr: 'تخضع لضريبة الامتياز الأدنى ($800) مع تسليم بيان المعلومات (Statement of Information) خلال 90 يوماً',
    franchiseTaxNoticeEn: 'Subject to $800 minimum franchise tax and Statement of Information (Form SI-550) within 90 days',
    sourceReference: 'California Corporations Code',
  },
  {
    code: 'US-NY',
    nameAr: 'نيويورك (New York)',
    nameEn: 'New York (NY)',
    filingAgencyAr: 'New York Department of State - Division of Corporations',
    filingAgencyEn: 'New York Department of State - Division of Corporations',
    franchiseTaxNoticeAr: 'تطلب إعلان النشر الصحفي الإجباري لـ LLC في جريدتين محليتين خلال 120 يوماً من التأسيس (NY Section 206)',
    franchiseTaxNoticeEn: 'Mandatory Section 206 publication requirement in 2 designated newspapers within 120 days of formation',
    sourceReference: 'New York Limited Liability Company Law',
  },
  {
    code: 'US-TX',
    nameAr: 'تكساس (Texas)',
    nameEn: 'Texas (TX)',
    filingAgencyAr: 'Texas Secretary of State - Corporations Section',
    filingAgencyEn: 'Texas Secretary of State - Corporations Section',
    franchiseTaxNoticeAr: 'تسليم تقرير ضريبة الامتياز السنوي ورسالة معلومات المالك بحلول 15 مايو سنوياً',
    franchiseTaxNoticeEn: 'Texas Franchise Tax Report and Public Information Report (PIR) due May 15th annually',
    sourceReference: 'Texas Business Organizations Code (BOC)',
  },
  {
    code: 'US-FL',
    nameAr: 'فلوريدا (Florida)',
    nameEn: 'Florida (FL)',
    filingAgencyAr: 'Florida Department of State - Division of Corporations (Sunbiz)',
    filingAgencyEn: 'Florida Department of State - Division of Corporations (Sunbiz)',
    franchiseTaxNoticeAr: 'تأكيد التقرير السنوي الإجباري عبر بوابة Sunbiz بين 1 يناير و 1 مايو لتجنب رسوم التأخير ($400)',
    franchiseTaxNoticeEn: 'Annual Report required between January 1st and May 1st via Sunbiz to avoid $400 late penalty',
    sourceReference: 'Florida Revised Limited Liability Company Act (Chapter 605)',
  },
];

// ─── 3. Supported Entity Types ─────────────────────────────────────────────────
export const ENTITY_TYPES_DATA: FormationEntityType[] = [
  // Saudi Arabia
  {
    code: 'SA_LLC',
    jurisdictionCode: 'SA',
    nameAr: 'شركة ذات مسؤولية محدودة (LLC)',
    nameEn: 'Limited Liability Company (LLC)',
    descAr: 'الكيان التجاري الأساسي والأكثر شيوعاً للمؤسسات في المملكة وفق نظام الشركات الجديد.',
    descEn: 'The primary corporate vehicle for standard commercial operations in KSA.',
    minShareholders: 1,
    maxShareholders: 50,
    liabilityProtectionAr: 'محدودة برأس المال الحصصي فقط دون الذمة المالية الخاصة الشريكة',
    liabilityProtectionEn: 'Limited strictly to share capital contribution',
  },
  {
    code: 'SA_SOLE',
    jurisdictionCode: 'SA',
    nameAr: 'شركة الشخص الواحد (Single-Owner LLC)',
    nameEn: 'Single-Owner LLC',
    descAr: 'شركة ذات مسؤولية محدودة يمتلكها مالك شخص واحد (طبيعي أو اعتباري).',
    descEn: 'Limited liability entity owned 100% by a single individual or corporate entity.',
    minShareholders: 1,
    maxShareholders: 1,
    liabilityProtectionAr: 'محدودة برأس مال الشركة المخصص',
    liabilityProtectionEn: 'Limited strictly to designated corporate capital',
  },
  {
    code: 'SA_SIMPLIFIED',
    jurisdictionCode: 'SA',
    nameAr: 'شركة المساهمة المبسطة (SJSC)',
    nameEn: 'Simplified Joint Stock Company (SJSC)',
    descAr: 'كيان مرن مستحدث بنظام الشركات لاستقطاب الاستثمارات والجولات التمويلية.',
    descEn: 'Modern flexible corporate structure tailored for venture investment and startups.',
    minShareholders: 1,
    liabilityProtectionAr: 'محدودة بقيمة الأسهم المكتتب بها',
    liabilityProtectionEn: 'Limited strictly to subscribed share value',
  },

  // UAE
  {
    code: 'AE_LLC',
    jurisdictionCode: 'AE',
    nameAr: 'شركة تجارية ذات مسؤولية محدودة (Mainland LLC)',
    nameEn: 'Mainland LLC',
    descAr: 'شركة تأسيس بالبر الرئيسي تسمح بالتجارة الحرة داخل وخارج الإمارات بنسبة ملكية 100%.',
    descEn: 'Mainland entity allowing full onshore trading in UAE with 100% foreign ownership.',
    minShareholders: 1,
    maxShareholders: 50,
    liabilityProtectionAr: 'محدودة برأس مال الشركة',
    liabilityProtectionEn: 'Limited strictly to corporate share capital',
  },
  {
    code: 'AE_FZ',
    jurisdictionCode: 'AE',
    nameAr: 'مؤسسة / شركة منطقة حرة (FZE / FZCO)',
    nameEn: 'Free Zone Entity (FZE / FZCO)',
    descAr: 'تأسيس بإحدى المناطق الحرة مع إعفاءات ضريبية وسهولة إعفاءات جمركية وإعادة الأرباح.',
    descEn: 'Free Zone setup offering 100% capital repatriation and specialized zone perks.',
    minShareholders: 1,
    liabilityProtectionAr: 'محدودة برأس مال الكيان بالمنطقة الحرة',
    liabilityProtectionEn: 'Limited strictly to free zone registered capital',
  },

  // Egypt
  {
    code: 'EG_LLC',
    jurisdictionCode: 'EG',
    nameAr: 'شركة ذات مسؤولية محدودة (ذ.م.م)',
    nameEn: 'Limited Liability Company (LLC)',
    descAr: 'شركة تجارية تخضع لقانون الشركات رقم 159 لسنة 1981 وتعديلاته لدى الهيئة العامة للاستثمار.',
    descEn: 'Egyptian commercial company governed by Law 159/1981 at GAFI.',
    minShareholders: 2,
    maxShareholders: 50,
    liabilityProtectionAr: 'محدودة بقيمة حصة كل شريك',
    liabilityProtectionEn: 'Limited strictly to member share contributions',
  },
  {
    code: 'EG_SINGLE',
    jurisdictionCode: 'EG',
    nameAr: 'شركة الشخص الواحد (ذ.م.م)',
    nameEn: 'Single-Person LLC',
    descAr: 'شركة تمتلكها شخصية واحدة بموجب التعديل التشريعي لقانون الاستثمار.',
    descEn: 'Single member corporate entity established under GAFI investment statutory updates.',
    minShareholders: 1,
    maxShareholders: 1,
    liabilityProtectionAr: 'محدودة برأس مال الشركة المعين',
    liabilityProtectionEn: 'Limited strictly to declared entity capital',
  },

  // United States
  {
    code: 'US_LLC',
    jurisdictionCode: 'US',
    nameAr: 'شركة ذات مسؤولية محدودة (LLC)',
    nameEn: 'Limited Liability Company (LLC)',
    descAr: 'الكيان الأمريكي الأكثر مرونة، يجمع بين حماية الذمة المالية والشفافية الضريبية (Pass-Through).',
    descEn: 'Flexible US legal structure combining personal asset protection with pass-through taxation.',
    minShareholders: 1,
    liabilityProtectionAr: 'حماية كاملة للأصول الشخصية للأعضاء (Members)',
    liabilityProtectionEn: 'Full personal asset shield for LLC members',
  },
  {
    code: 'US_CCORP',
    jurisdictionCode: 'US',
    nameAr: 'شركة مساهمة من فئة C (C-Corporation)',
    nameEn: 'C-Corporation (C-Corp)',
    descAr: 'الهيكل المعياري المعترف به عالمياً لجلب المستثمرين وصناديق الفينتشر ورأس المال الجريء.',
    descEn: 'Standard US corporate structure required by institutional VCs and stock option plans.',
    minShareholders: 1,
    liabilityProtectionAr: 'حماية كاملة للمساهمين (Shareholders)',
    liabilityProtectionEn: 'Complete corporate shield for shareholders',
  },
];

// ─── 4. Detailed Research Checklist Dataset ────────────────────────────────────
export const CHECKLIST_ITEMS_DATA: FormationChecklistItem[] = [
  // ── Saudi Arabia (KSA) LLC Items
  {
    id: 'SA-LLC-DOC-1',
    category: 'REQUIRED_DOC',
    jurisdictionCode: 'SA',
    entityTypeCode: 'SA_LLC',
    titleAr: 'عقد التأسيس والنظام الأساسي الموحد',
    titleEn: 'Standard Articles of Association (AoA)',
    descriptionAr: 'صياغة عقد التأسيس وفق النموذج المعتمد من وزارة التجارة والمركز السعودي للأعمال متضمناً الأغراض ورأس المال والإدارة.',
    descriptionEn: 'Drafting AoA following Saudi Ministry of Commerce standard templates including business scope, capital, and management.',
    source: 'المركز السعودي للأعمال (Saudi Business Center - SBC)',
    sourceUrlIfAvailable: 'https://misa.gov.sa',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-01-15',
    notesAr: 'يتطلب توثيق الكتروني عبر منصة الأعمال باستخدام النفاذ الوطني.',
    notesEn: 'Requires digital authentication via SBC platform using Absher/Nafath.',
  },
  {
    id: 'SA-LLC-STEP-1',
    category: 'FORMATION_STEP',
    jurisdictionCode: 'SA',
    entityTypeCode: 'SA_LLC',
    titleAr: 'حجز الاسم التجاري وإصدار السجل التجاري الإلكتروني',
    titleEn: 'Trade Name Reservation & E-Commercial Registration (CR)',
    descriptionAr: 'التحقق من عدم تكرار الاسم التجاري وإصدار السجل التجاري الفوري مع تحديد الأنشطة وفق دليل ISIC4.',
    descriptionEn: 'Reserving trade name and issuing instant CR with ISIC4 activity codes via SBC platform.',
    source: 'وزارة التجارة - بوابة الأعمال',
    sourceUrlIfAvailable: 'https://mc.gov.sa',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-01-15',
  },
  {
    id: 'SA-LLC-COMP-1',
    category: 'COMPLIANCE_REQUIREMENT',
    jurisdictionCode: 'SA',
    entityTypeCode: 'SA_LLC',
    titleAr: 'التسجيل في هيئة الزكاة والضريبة والجمارك (ZATCA) والعنوان الوطني',
    titleEn: 'ZATCA Tax Registration & SPL National Address Binding',
    descriptionAr: 'ربط السجل التجاري تلقائياً بملف الزكاة وضريبة القيمة المضافة (VAT) وتسجيل العنوان الوطني للمنشأة بسبل.',
    descriptionEn: 'Auto-linking CR with ZATCA tax file, VAT registration, and SPL National Address verification.',
    source: 'هيئة الزكاة والضريبة والجمارك (ZATCA)',
    sourceUrlIfAvailable: 'https://zatca.gov.sa',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-01-15',
  },
  {
    id: 'SA-LLC-COMP-2',
    category: 'COMPLIANCE_REQUIREMENT',
    jurisdictionCode: 'SA',
    entityTypeCode: 'SA_LLC',
    titleAr: 'التسجيل الإجباري في منصة قوى (Qiwa) والتأمينات الاجتماعية (GOSI)',
    titleEn: 'Qiwa Platform Setup & GOSI Social Insurance Registration',
    descriptionAr: 'فتح ملف المنشأة لدى وزارة الموارد البشرية والتنمية الاجتماعية لتوثيق عقود العمل والالتزام بنسب التوطين (نطاقات).',
    descriptionEn: 'Opening facility profile on Qiwa for employment contract verification and Nitaqat Saudization compliance.',
    source: 'وزارة الموارد البشرية - منصة قوى',
    sourceUrlIfAvailable: 'https://qiwa.sa',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-01-15',
  },

  // ── UAE Mainland LLC Items
  {
    id: 'AE-LLC-DOC-1',
    category: 'REQUIRED_DOC',
    jurisdictionCode: 'AE',
    entityTypeCode: 'AE_LLC',
    titleAr: 'عقد التأسيس الموثق إلكترونياً (MOA)',
    titleEn: 'Notarized Memorandum of Association (MOA)',
    descriptionAr: 'صياغة وتوثيق عقد التأسيس لدى الكاتب العدل بدائرة التنمية الاقتصادية مع بيان رأس المال والشركاء.',
    descriptionEn: 'Drafting and notarizing MOA before DED notary public specifying share capital and management.',
    source: 'دائرة التنمية الاقتصادية بالإمارات (DED)',
    sourceUrlIfAvailable: 'https://moec.gov.ae',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-02-01',
  },
  {
    id: 'AE-LLC-STEP-1',
    category: 'FORMATION_STEP',
    jurisdictionCode: 'AE',
    entityTypeCode: 'AE_LLC',
    titleAr: 'الموافقة المبدئية وحجز الاسم التجاري',
    titleEn: 'Initial Approval & Trade Name Reservation',
    descriptionAr: 'الحصول على موافقة دائرة التنمية الاقتصادية على الاسم التجاري والنشاط قبل توقيع عقد الإيجار (توثيق / إيجاري).',
    descriptionEn: 'Obtaining DED initial approval and name reservation prior to registering office lease (Ejari / Tawtheeq).',
    source: 'دائرة التنمية الاقتصادية المحمية',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-02-01',
  },
  {
    id: 'AE-LLC-COMP-1',
    category: 'COMPLIANCE_REQUIREMENT',
    jurisdictionCode: 'AE',
    entityTypeCode: 'AE_LLC',
    titleAr: 'التسجيل في ضريبة الشركات وضريبة القيمة المضافة (FTA)',
    titleEn: 'Federal Tax Authority (FTA) Corporate Tax & VAT Registration',
    descriptionAr: 'التسجيل الإجباري للحصول على الرقم الضريبي (TRN) والالتزام بنسبة 9% لضريبة الشركات عند تجاوز حد الربح المقرر.',
    descriptionEn: 'Mandatory FTA registration for TRN and 9% Corporate Tax compliance above AED 375k threshold.',
    source: 'الهيئة الاتحادية للضرائب (FTA UAE)',
    sourceUrlIfAvailable: 'https://tax.gov.ae',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-02-01',
  },
  {
    id: 'AE-LLC-COMP-2',
    category: 'COMPLIANCE_REQUIREMENT',
    jurisdictionCode: 'AE',
    entityTypeCode: 'AE_LLC',
    titleAr: 'تسجيل المستفيد الفعلي (UBO Registry)',
    titleEn: 'Ultimate Beneficial Owner (UBO) Declaration',
    descriptionAr: 'إيداع سجل المستفيد الفعلي وسجل الشركاء وفق قرار مجلس الوزراء رقم 58 لسنة 2020 لتفادي الغرامات المالية.',
    descriptionEn: 'Filing UBO register with Ministry of Economy pursuant to Cabinet Resolution No. 58/2020.',
    source: 'وزارة الاقتصاد الإماراتية',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-02-01',
  },

  // ── Egypt LLC Items
  {
    id: 'EG-LLC-DOC-1',
    category: 'REQUIRED_DOC',
    jurisdictionCode: 'EG',
    entityTypeCode: 'EG_LLC',
    titleAr: 'عقد تأسيس ومحضر جماعة المؤسسين المعتمد من GAFI',
    titleEn: 'GAFI Approved Articles of Incorporation & Founder Minutes',
    descriptionAr: 'تقديم عقد تأسيس الشركة والنظام الأساسي مراجَعاً من الشؤون القانونية بالهيئة العامة للاستثمار.',
    descriptionEn: 'Submitting articles of incorporation reviewed by GAFI legal department.',
    source: 'الهيئة العامة للاستثمار والمناطق الحرة (GAFI)',
    sourceUrlIfAvailable: 'https://gafi.gov.eg',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-01-20',
  },
  {
    id: 'EG-LLC-STEP-1',
    category: 'FORMATION_STEP',
    jurisdictionCode: 'EG',
    entityTypeCode: 'EG_LLC',
    titleAr: 'شهادة عدم التباس الاسم واستخراج البنك لشهادة أودع رأس المال',
    titleEn: 'Name Clearance Certificate & Bank Capital Deposit',
    descriptionAr: 'استخراج شهادة عدم التباس الاسم التجاري وإيداع نسبة رأس المال المطلوبة بموجب شهادة بنكية مغلقة.',
    descriptionEn: 'Obtaining non-confusion certificate and bank deposit statement for initial share capital.',
    source: 'السجل التجاري المصري والبنك المركزي',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-01-20',
  },
  {
    id: 'EG-LLC-COMP-1',
    category: 'COMPLIANCE_REQUIREMENT',
    jurisdictionCode: 'EG',
    entityTypeCode: 'EG_LLC',
    titleAr: 'استخراج البطاقة الضريبية والتسجيل بمأمورية الضرائب المختصة',
    titleEn: 'Tax Card Issuance & Egyptian Tax Authority Registration',
    descriptionAr: 'فتح الملف الضريبي للمنشأة وإصدار البطاقة الضريبية والتسجيل بالمنظومة الإلكترونية للفاتورة والفيشة الضريبية.',
    descriptionEn: 'Opening tax file, issuing Tax Card, and registering on the e-Invoicing system (ETA).',
    source: 'مصلحة الضرائب المصرية',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-01-20',
  },

  // ── US LLC (State Specific Items)
  {
    id: 'US-LLC-DOC-1',
    category: 'REQUIRED_DOC',
    jurisdictionCode: 'US',
    entityTypeCode: 'US_LLC',
    titleAr: 'شهادة التأسيس الرسمية (Articles of Organization / Certificate of Formation)',
    titleEn: 'Articles of Organization / Certificate of Formation',
    descriptionAr: 'تقديم وثيقة التأسيس الرسمية لدى مكتب وزير الدولة (Secretary of State) بالولاية المختارة.',
    descriptionEn: 'Filing Certificate of Formation with the state Secretary of State office.',
    source: 'State Division of Corporations',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-02-10',
  },
  {
    id: 'US-LLC-DOC-2',
    category: 'REQUIRED_DOC',
    jurisdictionCode: 'US',
    entityTypeCode: 'US_LLC',
    titleAr: 'اتفاقية التشغيل الداخلي (Operating Agreement)',
    titleEn: 'LLC Operating Agreement (Single / Multi-Member)',
    descriptionAr: 'صياغة اتفاقية تشغيلية تحدد توزيع الأرباح، صلاحيات المدير (Manager)، وآليات انضمام وتخارج الأعضاء.',
    descriptionEn: 'Internal governing document setting member ownership %, voting rights, and liability protection rules.',
    source: 'Internal Corporate Governance Requirement',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-02-10',
  },
  {
    id: 'US-LLC-STEP-1',
    category: 'FORMATION_STEP',
    jurisdictionCode: 'US',
    entityTypeCode: 'US_LLC',
    titleAr: 'تعيين وكيل معتمد بالولاية (Registered Agent)',
    titleEn: 'Designating a State Registered Agent',
    descriptionAr: 'اشتراط وجود وكيل مسجل يمتلك عنواناً فيزيكال داخل الولاية لاستلام الإخطارات والمراسلات القضائية الرسمية.',
    descriptionEn: 'Appointing a physical in-state Registered Agent to handle official service of process and state notices.',
    source: 'State Business Organizations Code',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-02-10',
  },
  {
    id: 'US-LLC-COMP-1',
    category: 'COMPLIANCE_REQUIREMENT',
    jurisdictionCode: 'US',
    entityTypeCode: 'US_LLC',
    titleAr: 'استخراج الرقم الضريبي الفيدرالي (EIN - Employer Identification Number)',
    titleEn: 'Federal EIN Acquisition from IRS (Form SS-4)',
    descriptionAr: 'التقديم لدى دائرة الإيرادات الداخلية الأمريكية (IRS) لاستخراج رقم EIN اللازم لفتح الحسابات البنكية والإقرارات.',
    descriptionEn: 'Obtaining federal tax ID number from the IRS for banking, hiring, and federal tax filings.',
    source: 'Internal Revenue Service (IRS)',
    sourceUrlIfAvailable: 'https://www.irs.gov',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-02-10',
  },
  {
    id: 'US-LLC-COMP-2',
    category: 'COMPLIANCE_REQUIREMENT',
    jurisdictionCode: 'US',
    entityTypeCode: 'US_LLC',
    titleAr: 'تقرير معلومات ملكية الكيان الفيدرالي (BOI Report - FinCEN)',
    titleEn: 'FinCEN Beneficial Ownership Information (BOI) Reporting',
    descriptionAr: 'تقديم تقرير معلومات الملكية النافعة لدى شبكة مكافحة الجرائم المالية الأمريكية (FinCEN) بموجب قانون الشفافية.',
    descriptionEn: 'Mandatory federal BOI report filing with FinCEN under Corporate Transparency Act.',
    source: 'Financial Crimes Enforcement Network (FinCEN)',
    sourceUrlIfAvailable: 'https://fincen.gov/boi',
    verificationStatus: 'VERIFIED_SOURCE',
    lastVerified: '2026-02-10',
  },
];
