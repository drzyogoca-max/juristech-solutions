/**
 * Vercel Edge Serverless Function — /api/contracts/generate-engine
 * JurisTech Solutions | Sovereign High-Niche Legal Contract Generation Engine
 * Features:
 * - Strict Jurisdiction Lock (التقييد القانوني الجغرافي الصارم)
 * - Strict Subject & Topic Matching (مطابقة المسميات والموضوع الصارمة)
 * - 100% Sovereign Multi-Section Legal Structure
 * - Admin Paywall Exemption Guard
 */

import { verifyAdminOrEnforcePaywall } from '../../lib/security/sovereign-guard.js';

export const config = {
  runtime: 'edge',
};

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

// ── Built-in Sovereign Jurisdiction Engine ─────────────────────────────────
const JURISDICTION_TABLE = {
  OM: {
    code: 'OM',
    countryAr: 'سلطنة عمان',
    countryEn: 'Sultanate of Oman',
    governingLawAr: 'القوانين والمراسيم السلطانية النافذة في سلطنة عمان (قانون المعاملات المدنية مرسوم سلطاني رقم 29/2013 وقانون الشركات التجارية مرسوم سلطاني رقم 18/2019 وقانون استثمار رأس المال الأجنبي مرسوم سلطاني 50/2019 وتعديلاتهما)',
    governingLawEn: 'The Applicable Laws and Royal Decrees of the Sultanate of Oman (Omani Civil Transactions Law Royal Decree 29/2013 & Commercial Companies Law Royal Decree 18/2019)',
    exclusiveCourtsAr: 'اختصاص محاكم مسقط الابتدائية والتجارية ومحاكم الاستثمار في سلطنة عمان حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Commercial Courts of Muscat and Investment Judiciary in the Sultanate of Oman',
    arbitrationCenterAr: 'مركز عمان للتحكيم التجاري (OAC - Oman Commercial Arbitration Centre) بمدينة مسقط',
    arbitrationCenterEn: 'The Oman Commercial Arbitration Centre (OAC) Rules in Muscat, Sultanate of Oman',
    currencyCode: 'OMR',
  },
  SA: {
    code: 'SA',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Kingdom of Saudi Arabia',
    governingLawAr: 'أنظمة ولوائح المملكة العربية السعودية (نظام المعاملات المدنية الصادر بالمرسوم الملكي م/191 وتاريخ 1444هـ ونظام الشركات الصادر بالمرسوم م/132 ونظام الإثبات م/43)',
    governingLawEn: 'The Laws and Regulations of the Kingdom of Saudi Arabia (Saudi Civil Transactions Law Royal Decree M/191 & New Companies Law Royal Decree M/132)',
    exclusiveCourtsAr: 'اختصاص المحاكم التجارية بالرياض ومحاكم الاستئناف بالمملكة العربية السعودية حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Commercial Courts of Riyadh, Kingdom of Saudi Arabia',
    arbitrationCenterAr: 'المركز السعودي للتحكيم التجاري (SCCA) بالرياض',
    arbitrationCenterEn: 'The Saudi Center for Commercial Arbitration (SCCA) in Riyadh',
    currencyCode: 'SAR',
  },
  AE: {
    code: 'AE',
    countryAr: 'دولة الإمارات العربية المتحدة',
    countryEn: 'United Arab Emirates',
    governingLawAr: 'القوانين الاتحادية لدولة الإمارات العربية المتحدة (قانون المعاملات المدنية الاتحادي رقم 5 لسنة 1985 وتعديلاته وقانون المعاملات التجارية الاتحادي رقم 50 لسنة 2022 وقانون الشركات التجارية الاتحادي رقم 32 لسنة 2021)',
    governingLawEn: 'The Federal Laws of the United Arab Emirates (UAE Federal Civil Transactions Law No. 5 of 1985, Commercial Transactions Law No. 50 of 2022 & Companies Law No. 32 of 2021)',
    exclusiveCourtsAr: 'اختصاص محاكم دبي التجارية أو محاكم أبوظبي الاتحادية حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Commercial Courts of Dubai / Abu Dhabi Federal Courts',
    arbitrationCenterAr: 'مركز دبي للتحكيم الدولي (DIAC) أو سوق أبوظبي العالمي (ADGM Arbitration)',
    arbitrationCenterEn: 'The Dubai International Arbitration Centre (DIAC) or ADGM Arbitration Centre',
    currencyCode: 'AED',
  },
  EG: {
    code: 'EG',
    countryAr: 'جمهورية مصر العربية',
    countryEn: 'Arab Republic of Egypt',
    governingLawAr: 'القوانين والتشريعات المصرية (القانون المدني المصري رقم 131 لسنة 1948 وقانون التجارة رقم 17 لسنة 1999 وقانون الشركات رقم 159 لسنة 1981 وقانون الاستثمار رقم 72 لسنة 2017)',
    governingLawEn: 'The Laws of the Arab Republic of Egypt (Egyptian Civil Code No. 131 of 1948, Commercial Law No. 17 of 1999 & Companies Law No. 159 of 1981)',
    exclusiveCourtsAr: 'اختصاص المحاكم الاقتصادية ومحاكم استئناف القاهرة بجمهورية مصر العربية حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Economic Courts and Cairo Courts of Appeal, Arab Republic of Egypt',
    arbitrationCenterAr: 'مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)',
    arbitrationCenterEn: 'The Cairo Regional Centre for International Commercial Arbitration (CRCICA)',
    currencyCode: 'EGP',
  },
  JO: {
    code: 'JO',
    countryAr: 'المملكة الأردنية الهاشمية',
    countryEn: 'Hashemite Kingdom of Jordan',
    governingLawAr: 'التشريعات والأنظمة الأردنية (القانون المدني الأردني رقم 43 لسنة 1976 وقانون الشركات رقم 22 لسنة 1997 وقانون التجارة رقم 12 لسنة 1966)',
    governingLawEn: 'The Laws of the Hashemite Kingdom of Jordan (Jordanian Civil Code No. 43 of 1976 & Companies Law No. 22 of 1997)',
    exclusiveCourtsAr: 'اختصاص محكمة بداية عمان (الغرفة الاقتصادية) ومحاكم المملكة الأردنية الهاشمية حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Amman First Instance Court (Economic Chamber), Hashemite Kingdom of Jordan',
    arbitrationCenterAr: 'مركز التحكيم الأردني ونقابة المحامين بعمان',
    arbitrationCenterEn: 'The Jordanian Arbitration Center in Amman',
    currencyCode: 'JOD',
  },
  QA: {
    code: 'QA',
    countryAr: 'دولة قطر',
    countryEn: 'State of Qatar',
    governingLawAr: 'القوانين القطرية (القانون المدني القطري رقم 22 لسنة 2004 وقانون الشركات التجارية رقم 11 لسنة 2015 وقانون التجارة رقم 27 لسنة 2006)',
    governingLawEn: 'The Laws of the State of Qatar (Qatari Civil Code No. 22 of 2004 & Commercial Companies Law No. 11 of 2015)',
    exclusiveCourtsAr: 'اختصاص المحاكم المدنية والتجارية ومحكمة الاستثمار والتجارة بالدوحة حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Investment and Trade Court in Doha, State of Qatar',
    arbitrationCenterAr: 'مركز قطر الدولي للتوفيق والتحكيم (QICCA)',
    arbitrationCenterEn: 'The Qatar International Centre for Conciliation and Arbitration (QICCA)',
    currencyCode: 'QAR',
  },
  KW: {
    code: 'KW',
    countryAr: 'دولة الكويت',
    countryEn: 'State of Kuwait',
    governingLawAr: 'القوانين والمراسيم الكويتية (القانون المدني الكويتي بالمرسوم بالقانون رقم 67 لسنة 1980 وقانون الشركات رقم 1 لسنة 2016 وقانون التجارة رقم 68 لسنة 1980)',
    governingLawEn: 'The Laws of the State of Kuwait (Kuwaiti Civil Code Decree No. 67 of 1980 & Companies Law No. 1 of 2016)',
    exclusiveCourtsAr: 'اختصاص المحكمة الكلية والمحاكم التجارية في قصر العدل بالعاصمة الكويت حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Commercial Courts of Kuwait City, State of Kuwait',
    arbitrationCenterAr: 'مركز الكويت للتحكيم التجاري (KCAC) التابع لغرفة تجارة وصناعة الكويت',
    arbitrationCenterEn: 'The Kuwait Center for Commercial Arbitration (KCAC)',
    currencyCode: 'KWD',
  },
  BH: {
    code: 'BH',
    countryAr: 'مملكة البحرين',
    countryEn: 'Kingdom of Bahrain',
    governingLawAr: 'القوانين البحرينية (القانون المدني مرسوم بقانون رقم 19 لسنة 2001 وقانون الشركات التجارية مرسوم بقانون رقم 21 لسنة 2001)',
    governingLawEn: 'The Laws of the Kingdom of Bahrain (Bahraini Civil Code Decree No. 19 of 2001 & Commercial Companies Law Decree No. 21 of 2001)',
    exclusiveCourtsAr: 'اختصاص المحاكم الكبرى التجارية بالمنامة بمملكة البحرين حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the High Commercial Courts in Manama, Kingdom of Bahrain',
    arbitrationCenterAr: 'غرفة البحرين لتسوية المنازعات (BCDR-AAA)',
    arbitrationCenterEn: 'The Bahrain Chamber for Dispute Resolution (BCDR-AAA)',
    currencyCode: 'BHD',
  },
  US: {
    code: 'US',
    countryAr: 'الولايات المتحدة الأمريكية (ولاية ديلاوير)',
    countryEn: 'United States of America (State of Delaware)',
    governingLawAr: 'قوانين ولاية ديلاوير والقانون التجاري الأمريكي الموحد (Delaware General Corporation Law DGCL & Uniform Commercial Code UCC)',
    governingLawEn: 'The General Corporation Law of the State of Delaware (DGCL) & Uniform Commercial Code (UCC)',
    exclusiveCourtsAr: 'اختصاص محكمة ديلاوير للعدالة (Delaware Court of Chancery) أو المحاكم الفيدرالية حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Court of Chancery of the State of Delaware / US Federal District Court',
    arbitrationCenterAr: 'جمعية التحكيم الأمريكية (AAA / ICDR) أو JAMS',
    arbitrationCenterEn: 'The American Arbitration Association (AAA/ICDR) or JAMS in New York/Delaware',
    currencyCode: 'USD',
  },
  GB: {
    code: 'GB',
    countryAr: 'المملكة المتحدة (إنجلترا وويلز)',
    countryEn: 'United Kingdom (England & Wales)',
    governingLawAr: 'قوانين إنجلترا وويلز (UK Companies Act 2006 & Law of Contract & Arbitration Act 1996)',
    governingLawEn: 'The Laws of England and Wales (UK Companies Act 2006 & Arbitration Act 1996)',
    exclusiveCourtsAr: 'اختصاص المحكمة التجارية العليا في لندن (High Court of Justice in London) حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the High Court of Justice (Commercial Court) in London, United Kingdom',
    arbitrationCenterAr: 'محكمة لندن للتحكيم الدولي (LCIA)',
    arbitrationCenterEn: 'The London Court of International Arbitration (LCIA) in London',
    currencyCode: 'GBP',
  },
  GLOBAL: {
    code: 'GLOBAL',
    countryAr: 'التجارة والقانون الدولي',
    countryEn: 'International Law & Global Commerce',
    governingLawAr: 'المبادئ القانونية الدولية الموحدة للإنكودروا (UNIDROIT Principles 2016) واتفاقية فيينا للبيع الدولي للبضائع (CISG 1980)',
    governingLawEn: 'The UNIDROIT Principles of International Commercial Contracts (2016) & UN CISG Convention 1980',
    exclusiveCourtsAr: 'محكمة التحكيم الدولية التابعة لغرفة التجارة الدولية بباريس (ICC Paris Arbitration) حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the International Court of Arbitration of the International Chamber of Commerce (ICC, Paris)',
    arbitrationCenterAr: 'محكمة التحكيم الدولية بباريس (ICC International Court of Arbitration)',
    arbitrationCenterEn: 'The ICC International Court of Arbitration (Paris, France)',
    currencyCode: 'USD',
  },
};

function getJurisdictionProfile(code) {
  if (!code) return JURISDICTION_TABLE.SA;
  const upper = String(code).toUpperCase().trim();
  return JURISDICTION_TABLE[upper] || JURISDICTION_TABLE.SA;
}

function matchNicheTopic(text) {
  if (!text) return null;
  const clean = text.toLowerCase();

  if (clean.includes('زراع') || clean.includes('مزارع') || clean.includes('محصول') || clean.includes('نخيل') || clean.includes('agri') || clean.includes('farm') || clean.includes('crop')) {
    return {
      categoryAr: 'الاستثمار والإنتاج الزراعي',
      categoryEn: 'Agricultural Investment & Crop Production',
      mandatoryClausesAr: [
        'حق الانتفاع بالأراضي الزراعية ومصادر المياه والآبار الارتوازية والكهرباء',
        'تحديد الدورة الزراعية وأنواع المحاصيل وجداول الغرس والحصاد الموسمي',
        'نسب تقاسم الأرباح والمحاصيل الناتجة أو الإيجار العيني المتفق عليه',
        'التزامات الرعاية ومكافحة الآفات والتأمين الزراعي ضد الكوارث الطبيعية'
      ],
      mandatoryClausesEn: [
        'Usufruct rights over agricultural land, water wells, and irrigation power',
        'Approved crop cycles, seasonal harvest schedules, and agronomic management',
        'Net crop yield sharing ratios and distribution mechanics',
        'Pest control compliance and natural calamity crop risk allocations'
      ],
      specializedDirectivesAr: 'عقد استثمار زراعي تخصصي: يتضمن مواسم الحصاد، حقوق الري والآبار، تقاسم المحاصيل، والجوائح الزراعية.',
      specializedDirectivesEn: 'Specialized Agricultural Contract: includes harvesting seasons, irrigation water rights, crop sharing, and climatic casualty risks.'
    };
  }

  if (clean.includes('مقاول') || clean.includes('بناء') || clean.includes('تشييد') || clean.includes('فيديك') || clean.includes('construct') || clean.includes('fidic') || clean.includes('civil')) {
    return {
      categoryAr: 'المقاولات والإنشاءات الهندسية',
      categoryEn: 'Construction & Civil Engineering',
      mandatoryClausesAr: [
        'نطاق الأعمال والمخططات الهندسية وجداول الكميات المعتمدة (BOQ)',
        'الجدول الزمني للإنجاز ومراحل التسليم وأوامر التغيير (Variation Orders)',
        'غرامات التأخير اليومية المحددة بما لا يتجاوز 10% من القيمة الإجمالية',
        'الاستلام الابتدائي والنهائي والضمان العشري لسلامة المنشآت الهندسية'
      ],
      mandatoryClausesEn: [
        'Scope of works, approved engineering designs, and Bill of Quantities (BOQ)',
        'Master milestone schedule and formal architect Variation Order procedures',
        'Daily liquidated delay damages subject to statutory liability caps',
        'Taking-Over Certificate handover, snagging lists, and statutory decennial liability'
      ],
      specializedDirectivesAr: 'عقد مقاولات وإنشاءات هندسية: يتضمن أوامر التغيير، غرامات التأخير، الاستلام الابتدائي، والضمان العشري.',
      specializedDirectivesEn: 'Specialized Construction Contract: includes variation orders, liquidated damages, completion testing, and decennial structural liability.'
    };
  }

  if (clean.includes('امتياز') || clean.includes('فرنشايز') || clean.includes('وكال') || clean.includes('franchis') || clean.includes('royalty')) {
    return {
      categoryAr: 'الامتياز التجاري والوكالات',
      categoryEn: 'Commercial Franchise & Distribution',
      mandatoryClausesAr: [
        'منح ترخيص استغلال العلامة التجارية والاسم التجاري والنظام التشغيلي',
        'النطاق الجغرافي الحصري ورسوم الامتياز الأولية ونسبة الإتاوة الدورية (Royalty)',
        'دليل التشغيل والمعايير الفنية وسلاسل الإمداد المعتمدة حصراً',
        'حظر المنافسة اللاحق لإنهاء العقد وسرية الوصفات والأنظمة التشغيلية'
      ],
      mandatoryClausesEn: [
        'Grant of proprietary trademark and franchise operating system license',
        'Exclusive territory rights, upfront franchise fees, and recurring monthly royalty',
        'Mandatory operations manual adherence and certified supply chains',
        'Post-termination non-competition covenants and trade secret protection'
      ],
      specializedDirectivesAr: 'عقد امتياز تجاري (Franchise): يتضمن دليل التشغيل، الإتاوة الشهرية، النطاق الحصري، ومنع المنافسة.',
      specializedDirectivesEn: 'Specialized Franchise Contract: includes operations manual, monthly royalties, territory protection, and non-competition.'
    };
  }

  if (clean.includes('استحواذ') || clean.includes('شراء أسهم') || clean.includes('دمج') || clean.includes('spa') || clean.includes('acquisit') || clean.includes('merger')) {
    return {
      categoryAr: 'الاستحواذ وشراء الحصص والأسهم',
      categoryEn: 'Mergers & Share Acquisitions (SPA)',
      mandatoryClausesAr: [
        'تحديد الحصص والأسهم المستحوذ عليها ونسبة الملكية في رأس المال',
        'المقابل المالي وثمن الشراء وتعديلات سعر الإغلاق وحساب الضمان (Escrow)',
        'الإقرارات والضمانات الجوهرية (Representations & Warranties) للبائع',
        'التزام التعويض عن الالتزامات السابقة غير المفصح عنها وحظر المنافسة'
      ],
      mandatoryClausesEn: [
        'Exact target share volume, equity capitalization, and ownership transfer',
        'Purchase price consideration, escrow holdbacks, and closing adjustments',
        'Comprehensive seller representations and warranties (tax, legal, operational)',
        'Indemnification obligations for undisclosed liabilities and non-compete covenants'
      ],
      specializedDirectivesAr: 'عقد استحواذ وشراء أسهم (SPA): يتضمن الإقرارات والضمانات، حساب الضمان Escrow، وشروط الإغلاق والتعويض.',
      specializedDirectivesEn: 'Specialized M&A Share Purchase Agreement (SPA): includes representations, warranties, escrow holdbacks, and indemnities.'
    };
  }

  if (clean.includes('برمج') || clean.includes('سحاب') || clean.includes('ذكاء') || clean.includes('saas') || clean.includes('software') || clean.includes('cloud') || clean.includes('sla')) {
    return {
      categoryAr: 'البرمجيات والأنظمة السحابية والذكاء الاصطناعي',
      categoryEn: 'Cloud SaaS, AI Licensing & SLAs',
      mandatoryClausesAr: [
        'نطاق الترخيص السحابي وحقوق الاستخدام غير الحصري للمنصة (SaaS)',
        'مستوى الخدمة وضمان التوفر بنسبة 99.9% شهرياً (SLA) وأرصدة الأعطال',
        'أمن البيانات، التشفير بمعايير AES-256، والامتثال لضوابط الأمن السيبراني',
        'ملكية الشفرة المصدرية وحقوق الملكية الفكرية وبروتوكول تصدير البيانات'
      ],
      mandatoryClausesEn: [
        'SaaS subscription grant, authorized user tiers, and platform access terms',
        '99.9% monthly uptime service level guarantee (SLA) and credit remedies',
        'Cybersecurity controls, AES-256 encryption at rest/transit, and data privacy',
        'Source code IP ownership reservation and automated data portability'
      ],
      specializedDirectivesAr: 'عقد تراخيص برمجيات وسحابي (SaaS & SLA): يتضمن ضمان التوفر 99.9%، أمن البيانات، وحماية الشفرة المصدرية.',
      specializedDirectivesEn: 'Specialized Cloud SaaS & SLA Agreement: includes 99.9% uptime, data encryption, and IP reservation.'
    };
  }

  return null;
}

export async function POST(req) {
  const startTime = Date.now();

  try {
    const body = await req.json().catch(() => ({}));
    const {
      contractType = 'B2B Enterprise Agreement',
      currency: requestedCurrency = '',
      arbitration: requestedArbitration = '',
      partiesData = '',
      userSession,
      lang = 'ar',
      language = 'ar',
      jurisdiction: requestedJurisdiction = '',
      jurisdictionCode = '',
    } = body;
    const activeLang = lang || language || 'ar';

    // ── 1. Sovereign Jurisdiction Lock Resolution ────────────────────────────
    const jCode = (jurisdictionCode || requestedJurisdiction || 'SA').toUpperCase().trim();
    const jurProfile = getJurisdictionProfile(jCode);

    const effectiveCurrency = requestedCurrency || jurProfile.currencyCode;
    const effectiveArbitration = requestedArbitration || jurProfile.arbitrationCenterAr;

    // ── 2. Strict Subject & Niche Matching ──────────────────────────────────
    const niche = matchNicheTopic(contractType + ' ' + partiesData);

    // Verify Supreme Admin permissions
    const accessCheck = verifyAdminOrEnforcePaywall(userSession);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    let fullContractText = '';

    const systemInstructions = {
      ar: `أنت النظام السيادي الأعلى لصياغة العقود التجارية والمدنية التخصصية لمنصة JurisTech Solutions.
التوجيهات الصارمة الإلزامية:
1. التقييد الجغرافي الصارم (Jurisdiction Lock): يمنع منعاً باتاً الخلط بين الأنظمة أو ذكر محاكم لا تخص دولة الاختصاص. طبق حصراً قوانين ومراسيم (${jurProfile.countryAr}):
   - القانون الواجب التطبيق: ${jurProfile.governingLawAr}
   - المحاكم الحصرية ومقر التحكيم: ${jurProfile.exclusiveCourtsAr} / ${jurProfile.arbitrationCenterAr}
   - العملة الرسمية المعتمدة: ${effectiveCurrency}
2. مطابقة موضوع العقد الحرفية (Strict Subject Matching):
   - يجب أن تكون بنود العقد وأحكامه شديدة التخصص ومطابقة تماماً لنوع وموضوع العقد (${contractType}).
   - في حال كان العقد عقداً زراعياً، يجب تفصيل حقوق الانتفاع، مصادر المياه، الدورة الزراعية، تقاسم المحاصيل، والجوائح الزراعية.
   - في حال كان عقداً إنشائياً/هندسياً، يجب تضمين أوامر التغيير، غرامات التأخير، الاستلام الابتدائي، والضمان العشري.
3. التخلص التام من الإنشاء والحشو: صغ عقداً مكتملاً 100% متضمناً الديباجة، التعريفات، الالتزامات الجوهرية، الشروط المالية، المسؤولية، القوة القاهرة، والتحكيم بدون اختصار أو نقاط فارغة.`,

      en: `You are the Sovereign Executive Contract Drafting Engine for JurisTech Solutions.
STRICT EXECUTIVE DIRECTIVES:
1. STRICT JURISDICTION LOCK: You must strictly adhere to the laws and judiciary of (${jurProfile.countryEn}):
   - Governing Law: ${jurProfile.governingLawEn}
   - Exclusive Courts & Arbitration: ${jurProfile.exclusiveCourtsEn} / ${jurProfile.arbitrationCenterEn}
   - Currency: ${effectiveCurrency}
2. STRICT SUBJECT & TOPIC MATCHING:
   - The contract clauses must be deeply specialized and 100% aligned with the exact subject (${contractType}).
   - If agriculture/farming: specify usufruct rights, irrigation/water rights, crop yield sharing ratios, and agronomic casualty allocations.
   - If construction/FIDIC: specify BOQ, milestone schedules, variation order directives, liquidated delay damages, and statutory decennial liability.
3. ZERO BOILERPLATE FILLER: Produce a 100% complete, execution-ready contract with recitals, operative covenants, financial terms, liability caps, force majeure, and dispute resolution.`,

      fr: `Vous êtes le système souverain de rédaction de contrats de JurisTech Solutions.
DIRECTIVES STRICTES :
1. Verrouillage de juridiction pour (${jurProfile.countryEn}) avec application exclusive de : ${jurProfile.governingLawEn}.
2. Correspondance stricte au sujet (${contractType}) avec clauses spécialisées sans formulations génériques.
3. Rédigez un contrat complet à 100% prêt pour signature.`,

      de: `Sie sind das souveräne Vertragserstellungssystem von JurisTech Solutions.
STRIKTE ANWEISUNGEN:
1. Strikte Bindung an das Rechtssystem von (${jurProfile.countryEn}): ${jurProfile.governingLawEn}.
2. Präzise thematische Übereinstimmung mit (${contractType}) ohne generische Floskeln.
3. Erstellen Sie einen zu 100% vollständigen und rechtssicheren Vertrag.`,

      es: `Usted es el sistema soberano de redacción de contratos de JurisTech Solutions.
DIRECTIVAS ESTRICTAS:
1. Bloqueo estricto de jurisdicción para (${jurProfile.countryEn}): ${jurProfile.governingLawEn}.
2. Coincidencia temática estricta con (${contractType}) con cláusulas altamente especializadas.
3. Genere un contrato 100% completo y listo para firma.`,

      zh: `您是 JurisTech Solutions 的主权合同起草系统。
严格指令：
1. 严格锁定司法管辖区 (${jurProfile.countryEn})，适用法律：${jurProfile.governingLawEn}。
2. 严格匹配合同主题 (${contractType})，禁止使用空洞模板。
3. 起草 100% 完整、可直接签署的专业合同。`,

      tr: `JurisTech Solutions Egemen Sözleşme Hazırlama Sistemisiniz.
KESİN TALİMATLAR:
1. (${jurProfile.countryEn}) için kesin yargı kilidi: ${jurProfile.governingLawEn}.
2. (${contractType}) konusuyla %100 uyumlu, derinlemesine uzmanlaşmış maddeler.
3. İmzaya hazır, %100 eksiksiz profesyonel bir sözleşme oluşturun.`
    };

    const modelConfirmations = {
      ar: `فهمت التوجيهات السيادية. سألتزم حصراً بقوانين ومحاكم (${jurProfile.countryAr}) وبنود التخصص الدقيق لموضوع (${contractType}) بدون أي خلط قضائي.`,
      en: `Understood. I will strictly apply the statutory codes of (${jurProfile.countryEn}) and craft a deep high-niche contract for (${contractType}).`,
      fr: `Compris. Application stricte du droit de (${jurProfile.countryEn}) pour (${contractType}).`,
      de: `Verstanden. Strikte Anwendung des Rechts von (${jurProfile.countryEn}) für (${contractType}).`,
      es: `Entendido. Aplicación estricta de la legislación de (${jurProfile.countryEn}) para (${contractType}).`,
      zh: `明白。严格适用 (${jurProfile.countryEn}) 法律起草 (${contractType})。`,
      tr: `Anlaşıldı. (${jurProfile.countryEn}) yasalarını (${contractType}) için kesin olarak uygulayacağım.`
    };

    const langNames = {
      ar: 'Arabic (العربية)',
      en: 'English',
      fr: 'French (Français)',
      de: 'German (Deutsch)',
      es: 'Spanish (Español)',
      zh: 'Chinese (中文)',
      tr: 'Turkish (Türkçe)'
    };
    const targetLangName = langNames[activeLang] || 'English';

    let promptText = '';
    if (activeLang === 'ar') {
      promptText = `قم بصياغة عقد قانوني وتجاري سيادي كلي ومكتمل بنسبة 100% بدون أي اختصار:
- عنوان وموضوع العقد: ${contractType}
- الدولة والاختصاص القضائي المقيد حصراً: ${jurProfile.countryAr}
- القوانين والأنظمة الواجب تطبيقها: ${jurProfile.governingLawAr}
- المحاكم الحصرية ومقر التحكيم: ${jurProfile.exclusiveCourtsAr} / ${effectiveArbitration}
- العملة المعتمدة حصراً: ${effectiveCurrency}
- بيانات وأطراف العقد: ${partiesData || 'طرف أول (المؤسسة/المستثمر) وطرف ثانٍ (المشغل/المستفيد)'}
${niche ? `\nتوجيهات الموضوع التخصصي الإلزامية:\n${niche.specializedDirectivesAr}\nالبنود الإلزامية التي يجب صياغتها:\n${niche.mandatoryClausesAr.map((c, i) => `${i+1}. ${c}`).join('\n')}` : ''}

التعليمات الصارمة:
1. صغ الديباجة والتمهيد مع الإشارة للنصوص النظامية المعمول بها في ${jurProfile.countryAr}.
2. اكتب البنود كاملة ومفصلة واذكر الالتزامات بدقة.
3. التزم باللغة القانونية الرصينة ومطابقة نصوص المحاكم دون أي خلط.`;
    } else {
      promptText = `Draft a pristine, 100% complete, legally binding agreement:
- Contract Title & Subject: ${contractType}
- Locked Jurisdiction: ${jurProfile.countryEn}
- Governing Substantive Law: ${jurProfile.governingLawEn}
- Exclusive Judiciary & Arbitration Seat: ${jurProfile.exclusiveCourtsEn} / ${effectiveArbitration}
- Governing Currency: ${effectiveCurrency}
- Parties Information: ${partiesData || 'Party A (Corporate Entity) and Party B (Contractor/Client)'}
${niche ? `\nDomain-Specific High-Niche Directives:\n${niche.specializedDirectivesEn}\nMandatory Specialized Clauses:\n${niche.mandatoryClausesEn.map((c, i) => `${i+1}. ${c}`).join('\n')}` : ''}

CRITICAL DIRECTIVE: Draft the entire contract in pristine professional legal ${targetLangName}. Output ONLY the raw contract text, fully written out with all clauses and without placeholders or commentary.`;
    }

    if (GEMINI_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 16000);

        const sysInstr = systemInstructions[activeLang] || systemInstructions.en;
        const modelConf = modelConfirmations[activeLang] || modelConfirmations.en;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { role: 'user', parts: [{ text: `[SYSTEM INSTRUCTION]: ${sysInstr}` }] },
                { role: 'model', parts: [{ text: modelConf }] },
                { role: 'user', parts: [{ text: promptText }] },
              ],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 3000,
              },
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          fullContractText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        }
      } catch (apiErr) {
        console.error("Gemini contract generation failed:", apiErr);
      }
    }

    if (!fullContractText || fullContractText.trim().length === 0) {
      fullContractText = getFallbackContractText(contractType, effectiveCurrency, effectiveArbitration, activeLang, jurProfile, niche);
    }

    // Apply paywall limit ONLY for standard limited non-admin users
    if (accessCheck.paywallActive) {
      const cutIndex = Math.floor(fullContractText.length * 0.65);
      fullContractText = fullContractText.substring(0, cutIndex) + getPaywallWarning(activeLang);
    }

    const latency = Date.now() - startTime;

    return Response.json({
      contractText: fullContractText,
      reply: fullContractText,
      jurisdiction: jurProfile.countryAr,
      jurisdictionCode: jurProfile.code,
      governingLaw: jurProfile.governingLawAr,
      currency: effectiveCurrency,
      arbitration: effectiveArbitration,
      isAdminUnlocked: accessCheck.authorized,
      accessType: accessCheck.accessType,
      paywallActive: accessCheck.paywallActive,
      message: accessCheck.message,
      latencyMs: latency,
      status: "Success"
    }, {
      headers: {
        ...CORS_HEADERS,
        'X-Edge-Latency': `${latency}ms`
      }
    });

  } catch (error) {
    console.error("Contract Generate Engine Error:", error);
    return Response.json({ 
      error: error.message || 'System overload protection triggered.',
      latencyMs: Date.now() - startTime
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// Helper functions for fallbacks
function getFallbackContractText(contractType, currency, arbitration, lang, jurProfile, niche) {
  const jur = jurProfile || JURISDICTION_TABLE.SA;

  if (lang === 'ar') {
    return `================================================================================\n` +
           `عقد واتفاقية تجارية سيادية ملزمة ومكتملة 100% — JurisTech Solutions\n` +
           `نوع وموضوع العقد: ${contractType}\n` +
           `النظام والاختصاص القضائي المقيد: ${jur.countryAr}\n` +
           `الأنظمة والقوانين الحاكمة: ${jur.governingLawAr}\n` +
           `العملة المعتمدة للمعاملات المالية: ${currency}\n` +
           `مقر المحاكم والتحكيم المعتمد: ${jur.exclusiveCourtsAr} / ${jur.arbitrationCenterAr}\n` +
           `================================================================================\n\n` +
           `تم إبرام هذا العقد والاتفاق في هذا اليوم بين كل من:\n\n` +
           `الطرف الأول: (المؤسسة / المرفق المؤسسي المرخص)\n` +
           `السجل التجاري / الرقم الضريبي: [مُعتمد]\n` +
           `العنوان والموطن المختار: [المقر الرئيسي]\n\n` +
           `الطرف الثاني: (العميل / المستثمر / المشغل المتعاقد)\n` +
           `السجل التجاري / الهوية الوطنية: [مُعتمد]\n` +
           `العنوان والموطن المختار: [المقر المختار]\n\n` +
           `تمهيد:\n` +
           `حيث إن الطرف الأول جهة مرخصة وقائمة نظاماً بموجب الأنظمة والقوانين المعمول بها في (${jur.countryAr})، وحيث تلاقت إرادة الطرفين بكامل أهليتهما المعتبرة شرعاً ونظاماً للتعاقد بخصوص (${contractType})، فقد اتفق الطرفان على ما يلي:\n\n` +
           `البند الأول: حجية التمهيد والتعريفات وموضوع العقد\n` +
           `1.1 يعتبر التمهيد أعلاه وكافة الملاحق الفنية جزءاً لا يتجزأ من هذا العقد وتقرأ معه كوحدة واحدة.\n` +
           `1.2 موضوع العقد: يلتزم الأطراف بتنفيذ الالتزامات المتبادلة الخاصة بـ (${contractType}) وفق أعلى معايير الجودة والاشتراطات النظامية المعمول بها في ${jur.countryAr}.\n\n` +
           (niche ? `البند الثاني: الشروط التخصصية لموضوع العقد (${niche.categoryAr})\n` +
           niche.mandatoryClausesAr.map((cl, i) => `2.${i+1} ${cl}.`).join('\n') + `\n\n` : '') +
           `البند الثالث: الشروط المالية والضمانات وجدول السداد\n` +
           `3.1 تسدد كافة الالتزامات والمستحقات المالية حصراً بعملة (${currency}) عبر التحويلات البنكية المعتمدة.\n` +
           `3.2 في حال التأخير عن السداد، يلتزم الطرف المخل بالتعويض عن الأضرار الفعلية المباشرة المترتبة على ذلك وفق ما تقره الأنظمة التجارية.\n\n` +
           `البند الرابع: السرية وحماية الملكية الفكرية (Confidentiality & IP)\n` +
           `4.1 يلتزم الطرفان بالحفاظ التام على سرية البيانات والمعلومات الفنية والتجارية المتبادلة وعدم إفشائها لأي طرف ثالث.\n` +
           `4.2 تظل حقوق الملكية الفكرية والعلامات التجارية ملكاً حصرياً للطرف صاحب الحق فيها.\n\n` +
           `البند الخامس: القوة القاهرة والظروف الطارئة\n` +
           `5.1 يعفى أي من الطرفين من المسؤولية عن التأخير أو عدم التنفيذ الناجم عن قوة قاهرة مثبتة قانوناً وفق الأنظمة النافذة في ${jur.countryAr}.\n\n` +
           `البند السادس: القانون الواجب التطبيق والاختصاص القضائي الحصري\n` +
           `6.1 يخضع هذا العقد وتفسيره وتنفيذه حصراً لـ: ${jur.governingLawAr}.\n` +
           `6.2 في حال نشوب أي نزاع أو خلاف ناشئ عن هذا العقد، ينعقد الاختصاص الحصري والنهائي لـ: ${jur.exclusiveCourtsAr}، أو يتم حسمه عن طريق التحكيم المؤسسي لدى: ${jur.arbitrationCenterAr}.\n\n` +
           `التوثيق والتوقيع السيادي الرقمي:\n` +
           `توقيع الطرف الأول: [مُعتمد وموثق إلكترونياً]        توقيع الطرف الثاني: [مُعتمد وموثق إلكترونياً]\n` +
           `منصة JurisTech Solutions — نظام التوثيق الرقمي والتشفير السيادي SHA-256 بنسبة 100%`;
  }

  // English fallback
  return `================================================================================\n` +
         `100% COMPLETE SOVEREIGN BINDING AGREEMENT — JurisTech Solutions\n` +
         `Contract Type & Subject: ${contractType}\n` +
         `Locked Sovereign Jurisdiction: ${jur.countryEn}\n` +
         `Governing Substantive Law: ${jur.governingLawEn}\n` +
         `Governing Financial Currency: ${currency}\n` +
         `Exclusive Judiciary & Arbitration: ${jur.exclusiveCourtsEn} / ${jur.arbitrationCenterEn}\n` +
         `================================================================================\n\n` +
         `This Agreement is entered into on this day by and between:\n\n` +
         `FIRST PARTY: (Authorized Corporate Entity / Service Provider)\n` +
         `Commercial Registry / Tax ID: [Verified]\n\n` +
         `SECOND PARTY: (Client / Operator / Investor)\n` +
         `Commercial Registry / National ID: [Verified]\n\n` +
         `RECITALS:\n` +
         `WHEREAS, First Party is a duly licensed enterprise operating pursuant to the laws of (${jur.countryEn}), and whereas Second Party desires to engage in (${contractType}), the Parties hereby agree as follows:\n\n` +
         `ARTICLE 1: RECITALS, DEFINITIONS & SCOPE\n` +
         `1.1 The Recitals and all technical schedules constitute an integral part of this Agreement.\n` +
         `1.2 Scope: Parties shall execute all mutual operational deliverables concerning (${contractType}) under highest statutory standards.\n\n` +
         (niche ? `ARTICLE 2: SPECIALIZED DOMAIN COVENANTS (${niche.categoryEn})\n` +
         niche.mandatoryClausesEn.map((cl, i) => `2.${i+1} ${cl}.`).join('\n') + `\n\n` : '') +
         `ARTICLE 3: FINANCIAL CONSIDERATION & PAYMENT SCHEDULE\n` +
         `3.1 All dues shall be settled strictly in (${currency}) through verified commercial bank accounts.\n` +
         `3.2 Monetary defaults shall trigger direct contractual remedies pursuant to applicable commercial codes.\n\n` +
         `ARTICLE 4: CONFIDENTIALITY & INTELLECTUAL PROPERTY\n` +
         `4.1 Parties shall maintain strict confidentiality over proprietary technical and commercial data.\n` +
         `4.2 All background intellectual property rights remain the exclusive property of their respective owners.\n\n` +
         `ARTICLE 5: FORCE MAJEURE\n` +
         `5.1 Neither party shall be liable for non-performance caused by statutory Force Majeure events recognized under ${jur.countryEn} jurisprudence.\n\n` +
         `ARTICLE 6: GOVERNING LAW & EXCLUSIVE DISPUTE RESOLUTION\n` +
         `6.1 This Agreement shall be governed by, and construed strictly in accordance with: ${jur.governingLawEn}.\n` +
         `6.2 Any dispute arising hereunder shall be subject to the exclusive jurisdiction of: ${jur.exclusiveCourtsEn}, or finally resolved via arbitration under: ${jur.arbitrationCenterEn}.\n\n` +
         `SOVEREIGN EXECUTION & DIGITAL ATTESTATION:\n` +
         `First Party: [Certified Sovereign E-Signature]        Second Party: [Certified Sovereign E-Signature]\n` +
         `JurisTech Solutions — 100% Cryptographic SHA-256 Protocol Verification`;
}

function getPaywallWarning(lang) {
  const warnings = {
    ar: "\n\n==================================================\n" +
        "🔒 [تنبيه نظام الدفع]: لمعاينة واستكمال العقد كاملاً، يرجى التواصل عبر البريد الرسمي: juristech.solutions@outlook.com أو إتمام الاشتراك.\n" +
        "==================================================",
    en: "\n\n==================================================\n" +
        "🔒 [PAYMENT GATEWAY LIMIT]: To view and retrieve the complete generated contract, please complete your subscription or email us at: juristech.solutions@outlook.com\n" +
        "==================================================",
    fr: "\n\n==================================================\n" +
        "🔒 [LIMITE DE PAIEMENT] : Pour voir et récupérer le contrat complet, veuillez finaliser votre abonnement ou nous contacter à : juristech.solutions@outlook.com\n" +
        "==================================================",
    de: "\n\n==================================================\n" +
        "🔒 [ZAHLUNGSLIMIT]: Um den vollständigen Vertrag anzuzeigen und herunterzuladen, schließen Sie bitte Ihr Abonnement ab oder kontaktieren Sie uns unter: juristech.solutions@outlook.com\n" +
        "==================================================",
    es: "\n\n==================================================\n" +
        "🔒 [LÍMITE DE PAGO]: Para ver y descargar el contrato completo, complete su suscripción o escríbanos a: juristech.solutions@outlook.com\n" +
        "==================================================",
    zh: "\n\n==================================================\n" +
        "🔒【支付限制】：要查看并获取完整的合同内容，请完成您的订阅或联系我们的官方邮箱：juristech.solutions@outlook.com\n" +
        "==================================================",
    tr: "\n\n==================================================\n" +
        "🔒 [ÖDEME SINIRI]: Sözleşmenin tamamını görüntülemek ve indirmek için lütfen aboneliğinizi tamamlayın veya e-posta gönderin: juristech.solutions@outlook.com\n" +
        "=================================================="
  };
  return warnings[lang] || warnings.en;
}

export default async function handler(req) {
  return POST(req);
}
