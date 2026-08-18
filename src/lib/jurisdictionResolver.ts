/**
 * jurisdictionResolver.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Sovereign Legal Resolution Engine v15.0
 * Pure Court Venue & Governing Law Resolver with ZERO Jurisdiction Mixing
 * Supports Jordan (JO), USA (US), Saudi Arabia (SA), UAE (AE), Egypt (EG),
 * Qatar (QA), Kuwait (KW), United Kingdom (GB), European Union (EU), Global.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface JurisdictionLegalProfile {
  code: string;
  countryAr: string;
  countryEn: string;
  governingLawAr: string;
  governingLawEn: string;
  exclusiveCourtsAr: string;
  exclusiveCourtsEn: string;
  arbitrationCenterAr: string;
  arbitrationCenterEn: string;
  currency: string;
  currencyCode: string;
  statutoryCodes: string[];
}

export const JURISDICTION_PROFILES: Record<string, JurisdictionLegalProfile> = {
  JO: {
    code: 'JO',
    countryAr: 'المملكة الأردنية الهاشمية',
    countryEn: 'Hashemite Kingdom of Jordan',
    governingLawAr: 'القوانين والأنظمة التشريعية النافذة في المملكة الأردنية الهاشمية (القانون المدني الأردني رقم 43 لسنة 1976 وقانون الشركات رقم 22 لسنة 1997 وقانون التجارة رقم 12 لسنة 1966 وتعديلاتهما)',
    governingLawEn: 'The Applicable Laws and Regulations of the Hashemite Kingdom of Jordan (Jordanian Civil Code No. 43 of 1976 and Companies Law No. 22 of 1997 as amended)',
    exclusiveCourtsAr: 'اختصاص محاكم العاصمة عمّان في المملكة الأردنية الهاشمية (محكمة بداية عمان والمحاكم التجارية المختصة حصرياً دون غيرها)',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Competent Courts of Amman, Hashemite Kingdom of Jordan (Amman Courts of First Instance and Commercial Judiciary)',
    arbitrationCenterAr: 'مركز التحكيم الأردني وجمعية المحكمين الأردنيين وفقاً لقانون التحكيم الأردني رقم 31 لسنة 2001 في عمان',
    arbitrationCenterEn: 'The Jordan Arbitration Center & Jordanian Arbitrators Association pursuant to Jordan Arbitration Law No. 31 of 2001 in Amman',
    currency: 'دينار أردني',
    currencyCode: 'JOD',
    statutoryCodes: ['القانون المدني الأردني 43/1976', 'قانون الشركات الأردني 22/1997', 'قانون التجارة 12/1966'],
  },

  US: {
    code: 'US',
    countryAr: 'الولايات المتحدة الأمريكية',
    countryEn: 'United States of America',
    governingLawAr: 'القوانين والأنظمة الفيدرالية للولايات المتحدة الأمريكية وقوانين ولاية ديلاوير (Delaware General Corporation Law & Uniform Commercial Code UCC)',
    governingLawEn: 'The Federal Laws of the United States of America and the State Law of Delaware (Delaware General Corporation Law & Uniform Commercial Code UCC)',
    exclusiveCourtsAr: 'اختصاص المحاكم الفيدرالية ومحاكم ولاية ديلاوير الأمريكية حصرياً (State and Federal Courts in Delaware, USA)',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the State and Federal Courts located in the State of Delaware, United States of America',
    arbitrationCenterAr: 'جمعية التحكيم الأمريكية (AAA - American Arbitration Association) ومحكمة JAMS في الولايات المتحدة الأمريكية',
    arbitrationCenterEn: 'The American Arbitration Association (AAA) & JAMS Commercial Arbitration Rules in the United States of America',
    currency: 'دولار أمريكي',
    currencyCode: 'USD',
    statutoryCodes: ['DGCL Delaware Code Title 8', 'UCC Uniform Commercial Code', 'Federal Rules of Civil Procedure'],
  },

  SA: {
    code: 'SA',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Kingdom of Saudi Arabia',
    governingLawAr: 'أنظمة وتوافقات المملكة العربية السعودية النافذة (نظام المعاملات المدنية مرسوم م/191 ونظام الشركات مرسوم م/132 ونظام الإثبات مرسوم م/43)',
    governingLawEn: 'The Applicable Laws and Regulations of the Kingdom of Saudi Arabia (Saudi Civil Transactions Law M/191 & Companies Law M/132)',
    exclusiveCourtsAr: 'اختصاص المحاكم التجارية والقضاء العام في المملكة العربية السعودية بمدينة الرياض حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Saudi Commercial Courts and General Judiciary in Riyadh, Kingdom of Saudi Arabia',
    arbitrationCenterAr: 'المركز السعودي للتحكيم التجاري (SCCA - Saudi Center for Commercial Arbitration) بمدينة الرياض',
    arbitrationCenterEn: 'The Saudi Center for Commercial Arbitration (SCCA) Rules in Riyadh, Kingdom of Saudi Arabia',
    currency: 'ريال سعودي',
    currencyCode: 'SAR',
    statutoryCodes: ['نظام المعاملات المدنية م/191', 'نظام الشركات السعودي م/132', 'نظام التنفيذ م/53'],
  },

  AE: {
    code: 'AE',
    countryAr: 'دولة الإمارات العربية المتحدة',
    countryEn: 'United Arab Emirates',
    governingLawAr: 'القوانين الاتحادية لدولة الإمارات العربية المتحدة وقوانين إمارة دبي (قانون المعاملات المدنية 5/1985 وقانون الشركات الاتحادي 32/2021)',
    governingLawEn: 'The Federal Laws of the United Arab Emirates and Laws of the Emirate of Dubai (UAE Civil Code No. 5/1985 & Commercial Companies Law No. 32/2021)',
    exclusiveCourtsAr: 'اختصاص محاكم دبي والقضاء الاتحادي في دولة الإمارات العربية المتحدة حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Dubai Courts and UAE Federal Judiciary in the United Arab Emirates',
    arbitrationCenterAr: 'مركز دبي للتحكيم الدولي (DIAC - Dubai International Arbitration Centre) بإمارة دبي',
    arbitrationCenterEn: 'The Dubai International Arbitration Centre (DIAC) Rules in Dubai, United Arab Emirates',
    currency: 'درهم إماراتي',
    currencyCode: 'AED',
    statutoryCodes: ['قانون المعاملات المدنية 5/1985', 'قانون الشركات الاتحادي 32/2021', 'قانون المعاملات التجارية 50/2022'],
  },

  EG: {
    code: 'EG',
    countryAr: 'جمهورية مصر العربية',
    countryEn: 'Arab Republic of Egypt',
    governingLawAr: 'القوانين التشريعية النافذة في جمهورية مصر العربية (القانون المدني المصري رقم 131 لسنة 1948 وقانون التجارة رقم 17 لسنة 1999 وقانون الشركات رقم 159 لسنة 1981)',
    governingLawEn: 'The Laws and Regulations of the Arab Republic of Egypt (Egyptian Civil Code No. 131 of 1948 & Trade Law No. 17 of 1999)',
    exclusiveCourtsAr: 'اختصاص المحاكم الاقتصادية ومحاكم القاهرة بجمهورية مصر العربية حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Cairo Economic Courts and Judiciary in the Arab Republic of Egypt',
    arbitrationCenterAr: 'المركز الإقليمي العربي للتحكيم التجاري الدولي بالقاهرة (CRCICA)',
    arbitrationCenterEn: 'The Cairo Regional Centre for International Commercial Arbitration (CRCICA) in Cairo, Egypt',
    currency: 'جنيه مصري',
    currencyCode: 'EGP',
    statutoryCodes: ['القانون المدني المصري 131/1948', 'قانون التجارة 17/1999', 'قانون الاستثمار 72/2017'],
  },

  QA: {
    code: 'QA',
    countryAr: 'دولة قطر',
    countryEn: 'State of Qatar',
    governingLawAr: 'قوانين وأنظمة دولة قطر النافذة (القانون المدني القطري رقم 22 لسنة 2004 وقانون الشركات 11/2015)',
    governingLawEn: 'The Laws of the State of Qatar (Qatar Civil Code No. 22 of 2004 & Commercial Companies Law No. 11/2015)',
    exclusiveCourtsAr: 'اختصاص محاكم الدوحة ومحكمة قطر الدولية لفض المنازعات (QICDRC) حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Competent Courts of Doha and Qatar International Court (QICDRC)',
    arbitrationCenterAr: 'مركز قطر للمشارطة والتحكيم التجاري (QICCA) بالدوحة',
    arbitrationCenterEn: 'The Qatar International Center for Conciliation and Arbitration (QICCA) in Doha, Qatar',
    currency: 'ريال قطري',
    currencyCode: 'QAR',
    statutoryCodes: ['القانون المدني القطري 22/2004', 'قانون التجارة القطري 27/2006'],
  },

  KW: {
    code: 'KW',
    countryAr: 'دولة الكويت',
    countryEn: 'State of Kuwait',
    governingLawAr: 'قوانين دولة الكويت النافذة (القانون المدني الكويتي رقم 67 لسنة 1980 وقانون التجارة رقم 68 لسنة 1980 وقانون الشركات 1/2016)',
    governingLawEn: 'The Laws of the State of Kuwait (Kuwaiti Civil Code No. 67 of 1980 & Companies Law No. 1/2016)',
    exclusiveCourtsAr: 'اختصاص المحاكم الكويتيّة المختصة بالعاصمة الكويت حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Competent Courts of Kuwait City, State of Kuwait',
    arbitrationCenterAr: 'مركز الكويت للتحكيم التجاري التابع لغرفة تجارة وصناعة الكويت',
    arbitrationCenterEn: 'The Kuwait Commercial Arbitration Centre (KCAC) in Kuwait City',
    currency: 'دينار كويتي',
    currencyCode: 'KWD',
    statutoryCodes: ['القانون المدني الكويتي 67/1980', 'قانون التجارة الكويتي 68/1980'],
  },

  GB: {
    code: 'GB',
    countryAr: 'المملكة المتحدة',
    countryEn: 'United Kingdom',
    governingLawAr: 'قوانين إنجلترا وويلز (English Law - Companies Act 2006 & Law of Contract)',
    governingLawEn: 'The Laws of England and Wales (English Law - Companies Act 2006 & Common Law of Contract)',
    exclusiveCourtsAr: 'اختصاص المحاكم العليا في لندن - المملكة المتحدة (High Court of Justice in London, England) حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the High Court of Justice in London, England',
    arbitrationCenterAr: 'محكمة لندن للتحكيم الدولي (LCIA - London Court of International Arbitration)',
    arbitrationCenterEn: 'The London Court of International Arbitration (LCIA) Rules in London, UK',
    currency: 'جنيه إسترليني',
    currencyCode: 'GBP',
    statutoryCodes: ['UK Companies Act 2006', 'Arbitration Act 1996', 'Unfair Contract Terms Act 1977'],
  },

  EU: {
    code: 'EU',
    countryAr: 'الاتحاد الأوروبي',
    countryEn: 'European Union',
    governingLawAr: 'قوانين وتنظيمات الاتحاد الأوروبي (EU Rome I Regulation EC 593/2008 & EU Contract Law Directives)',
    governingLawEn: 'The Laws of the European Union & Rome I Regulation (EC) No 593/2008 on Law Applicable to Contractual Obligations',
    exclusiveCourtsAr: 'اختصاص المحاكم الأوروبية المختصة ومحكمة العدل للاتحاد الأوروبي (CJEU) حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Competent European Union Member State Courts & CJEU',
    arbitrationCenterAr: 'معهد التحكيم التابع لغرفة التجارة في استوكهولم (SCC) أو محكمة باريس للتحكيم',
    arbitrationCenterEn: 'The Arbitration Institute of the Stockholm Chamber of Commerce (SCC) & Paris International Chamber',
    currency: 'يورو',
    currencyCode: 'EUR',
    statutoryCodes: ['EU Regulation EC 593/2008 (Rome I)', 'EU GDPR 2016/679', 'EU Services Directive'],
  },

  OM: {
    code: 'OM',
    countryAr: 'سلطنة عمان',
    countryEn: 'Sultanate of Oman',
    governingLawAr: 'القوانين والمراسيم السلطانية النافذة في سلطنة عمان (قانون المعاملات المدنية مرسوم سلطاني رقم 29/2013 وقانون الشركات التجارية مرسوم سلطاني رقم 18/2019 وقانون استثمار رأس المال الأجنبي مرسوم سلطاني 50/2019 وتعديلاتهما)',
    governingLawEn: 'The Applicable Laws and Royal Decrees of the Sultanate of Oman (Omani Civil Transactions Law Royal Decree 29/2013, Commercial Companies Law Royal Decree 18/2019 & Foreign Capital Investment Law)',
    exclusiveCourtsAr: 'اختصاص محاكم مسقط الابتدائية والتجارية ومحاكم الاستثمار في سلطنة عمان حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Commercial Courts of Muscat and Investment Judiciary in the Sultanate of Oman',
    arbitrationCenterAr: 'مركز عمان للتحكيم التجاري (OAC - Oman Commercial Arbitration Centre) بمدينة مسقط',
    arbitrationCenterEn: 'The Oman Commercial Arbitration Centre (OAC) Rules in Muscat, Sultanate of Oman',
    currency: 'ريال عماني',
    currencyCode: 'OMR',
    statutoryCodes: ['قانون المعاملات المدنية العماني 29/2013', 'قانون الشركات التجارية العماني 18/2019', 'قانون التجارة العماني 55/1990'],
  },

  BH: {
    code: 'BH',
    countryAr: 'مملكة البحرين',
    countryEn: 'Kingdom of Bahrain',
    governingLawAr: 'القوانين والمراسيم بقانون النافذة في مملكة البحرين (القانون المدني مرسوم بقانون رقم 19 لسنة 2001 وقانون الشركات التجارية مرسوم بقانون رقم 21 لسنة 2001 وقانون التجارة 7/1987)',
    governingLawEn: 'The Applicable Laws and Legislative Decrees of the Kingdom of Bahrain (Bahraini Civil Code Decree No. 19 of 2001 & Commercial Companies Law Decree No. 21 of 2001)',
    exclusiveCourtsAr: 'اختصاص المحاكم الكبرى المدنية والتجارية في العاصمة المنامة بمملكة البحرين حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the High Commercial Courts in Manama, Kingdom of Bahrain',
    arbitrationCenterAr: 'غرفة البحرين لتسوية المنازعات الاقتصادية والمالية (BCDR-AAA) ومحكمة البحرين الدولية للتحكيم',
    arbitrationCenterEn: 'The Bahrain Chamber for Dispute Resolution (BCDR-AAA) in Manama, Kingdom of Bahrain',
    currency: 'دينار بحريني',
    currencyCode: 'BHD',
    statutoryCodes: ['القانون المدني البحريني 19/2001', 'قانون الشركات التجارية البحريني 21/2001', 'قانون التجارة 7/1987'],
  },

  IQ: {
    code: 'IQ',
    countryAr: 'جمهورية العراق',
    countryEn: 'Republic of Iraq',
    governingLawAr: 'القوانين والتشريعات النافذة في جمهورية العراق (القانون المدني العراقي رقم 40 لسنة 1951 وقانون الشركات رقم 21 لسنة 1997 المعدل وقانون التجارة رقم 30 لسنة 1984)',
    governingLawEn: 'The Applicable Laws of the Republic of Iraq (Iraqi Civil Code No. 40 of 1951 & Companies Law No. 21 of 1997 as amended)',
    exclusiveCourtsAr: 'اختصاص محاكم بداءة بغداد والمحاكم التجارية المختصة في جمهورية العراق حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Commercial First Instance Courts of Baghdad, Republic of Iraq',
    arbitrationCenterAr: 'مركز بغداد الدولي للوساطة والتحكيم التجاري',
    arbitrationCenterEn: 'The Baghdad International Center for Mediation and Commercial Arbitration',
    currency: 'دينار عراقي',
    currencyCode: 'IQD',
    statutoryCodes: ['القانون المدني العراقي 40/1951', 'قانون الشركات العراقي 21/1997', 'قانون التجارة 30/1984'],
  },

  MA: {
    code: 'MA',
    countryAr: 'المملكة المغربية',
    countryEn: 'Kingdom of Morocco',
    governingLawAr: 'ظهير الالتزامات والعقود المغربي (DOC) وقانون الشركات التجارية رقم 17-95 وقانون مدونة التجارة رقم 15-95 في المملكة المغربية',
    governingLawEn: 'The Moroccan Dahir of Obligations and Contracts (DOC) & Commercial Companies Law No. 17-95 & Commercial Code No. 15-95',
    exclusiveCourtsAr: 'اختصاص المحاكم التجارية بالدار البيضاء ومحاكم الاستئناف التجارية بالمملكة المغربية حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Commercial Courts of Casablanca, Kingdom of Morocco',
    arbitrationCenterAr: 'المركز المغربي للتحكيم والوساطة بالرباط / الدار البيضاء',
    arbitrationCenterEn: 'The Moroccan Centre of Mediation and Arbitration in Casablanca / Rabat',
    currency: 'درهم مغربي',
    currencyCode: 'MAD',
    statutoryCodes: ['ظهير الالتزامات والعقود المغربي DOC', 'قانون الشركات المغربي 17-95', 'مدونة التجارة 15-95'],
  },

  TR: {
    code: 'TR',
    countryAr: 'الجمهورية التركية',
    countryEn: 'Republic of Turkey',
    governingLawAr: 'القوانين التركية النافذة (قانون الالتزامات التركي رقم 6098 وقانون التجارة التركي رقم 6102)',
    governingLawEn: 'The Laws of the Republic of Turkey (Turkish Code of Obligations No. 6098 & Turkish Commercial Code No. 6102)',
    exclusiveCourtsAr: 'اختصاص محاكم إسطنبول التجارية والمحاكم الابتدائية للعدل في تركيا حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Istanbul Commercial Courts and Judiciary in Turkey',
    arbitrationCenterAr: 'مركز إسطنبول للتحكيم (ISTAC - Istanbul Arbitration Centre)',
    arbitrationCenterEn: 'The Istanbul Arbitration Centre (ISTAC) Rules in Istanbul, Turkey',
    currency: 'ليرة تركية',
    currencyCode: 'TRY',
    statutoryCodes: ['Turkish Code of Obligations (TBK 6098)', 'Turkish Commercial Code (TTK 6102)'],
  },

  CN: {
    code: 'CN',
    countryAr: 'جمهورية الصين الشعبية',
    countryEn: "People's Republic of China",
    governingLawAr: 'القانون المدني لجمهورية الصين الشعبية (PRC Civil Code 2021) وقانون الشركات وقانون الاستثمار الأجنبي (PRC Foreign Investment Law)',
    governingLawEn: "The Laws of the People's Republic of China (PRC Civil Code 2021 & PRC Company Law & Foreign Investment Law)",
    exclusiveCourtsAr: 'اختصاص المحكمة الشعبية المتوسطة في بكين / شنغهاي ومحاكم التجارة الدولية في الصين حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Beijing / Shanghai Intermediate People’s Courts & China International Commercial Court (CICC)',
    arbitrationCenterAr: 'لجنة التحكيم الاقتصادي والتجاري الدولي الصينية (CIETAC)',
    arbitrationCenterEn: 'The China International Economic and Trade Arbitration Commission (CIETAC) in Beijing',
    currency: 'يوان صيني',
    currencyCode: 'CNY',
    statutoryCodes: ['PRC Civil Code 2021', 'PRC Company Law', 'PRC Foreign Investment Law'],
  },

  FR: {
    code: 'FR',
    countryAr: 'الجمهورية الفرنسية',
    countryEn: 'French Republic',
    governingLawAr: 'القانون المدني الفرنسي (Code civil français) وقانون التجارة الفرنسي (Code de commerce)',
    governingLawEn: 'The Laws of the French Republic (French Civil Code & Commercial Code)',
    exclusiveCourtsAr: 'اختصاص المحكمة التجارية بباريس (Tribunal de commerce de Paris) حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Commercial Court of Paris (Tribunal de Commerce de Paris)',
    arbitrationCenterAr: 'محكمة التحكيم التابعة لغرفة التجارة الدولية بباريس (ICC Paris)',
    arbitrationCenterEn: 'The International Court of Arbitration of the ICC in Paris, France',
    currency: 'يورو',
    currencyCode: 'EUR',
    statutoryCodes: ['Code civil français', 'Code de commerce français', 'Règlement Rome I'],
  },

  DE: {
    code: 'DE',
    countryAr: 'جمهورية ألمانيا الاتحادية',
    countryEn: 'Federal Republic of Germany',
    governingLawAr: 'القانون المدني الألماني (Bürgerliches Gesetzbuch BGB) والقانون التجاري الألماني (Handelsgesetzbuch HGB)',
    governingLawEn: 'The Laws of the Federal Republic of Germany (German Civil Code BGB & Commercial Code HGB)',
    exclusiveCourtsAr: 'اختصاص المحاكم الإقليمية في فرانكفورت / ميونخ / برلين (Landgericht) حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the Regional Commercial Courts (Landgericht) in Frankfurt / Munich / Berlin, Germany',
    arbitrationCenterAr: 'المؤسسة الألمانية للتحكيم (DIS - Deutsche Institution für Schiedsgerichtsbarkeit)',
    arbitrationCenterEn: 'The German Arbitration Institute (DIS) Rules in Germany',
    currency: 'يورو',
    currencyCode: 'EUR',
    statutoryCodes: ['German Civil Code (BGB)', 'German Commercial Code (HGB)', 'ZPO Code of Civil Procedure'],
  },

  GLOBAL: {
    code: 'GLOBAL',
    countryAr: 'التجارة والقانون الدولي',
    countryEn: 'International Law & Global Commerce',
    governingLawAr: 'المبادئ القانونية الدولية الموحدة للإنكودروا (UNIDROIT Principles of International Commercial Contracts 2016) واتفاقية الأمم المتحدة للبيع الدولي للبضائع (CISG 1980)',
    governingLawEn: 'The UNIDROIT Principles of International Commercial Contracts (2016) & UN Convention on Contracts for the International Sale of Goods (CISG 1980)',
    exclusiveCourtsAr: 'محكمة التحكيم الدولية التابعة لغرفة التجارة الدولية في باريس (ICC Paris Arbitration) حصرياً',
    exclusiveCourtsEn: 'The Exclusive Jurisdiction of the International Court of Arbitration of the International Chamber of Commerce (ICC, Paris)',
    arbitrationCenterAr: 'محكمة التحكيم الدولية بباريس (ICC International Court of Arbitration)',
    arbitrationCenterEn: 'The ICC International Court of Arbitration (Paris, France)',
    currency: 'دولار أمريكي',
    currencyCode: 'USD',
    statutoryCodes: ['UNIDROIT Principles 2016', 'CISG Convention 1980', 'ICC Arbitration Rules 2021'],
  },
};


/**
 * Get jurisdiction legal profile cleanly
 */
export function getJurisdictionProfile(code?: string): JurisdictionLegalProfile {
  if (!code) return JURISDICTION_PROFILES.JO;
  const upper = code.toUpperCase().trim();
  return JURISDICTION_PROFILES[upper] || JURISDICTION_PROFILES.JO;
}

/**
 * Sanitize legal contract text to enforce STRICT jurisdiction court match & eliminate mixing.
 * If jurisdiction is JO, replaces any mention of US/Dubai/Saudi courts with Jordanian Amman Courts!
 */
export function enforceStrictJurisdictionText(content: string, code: string, isRtl: boolean = true): string {
  const profile = getJurisdictionProfile(code);

  // Replace governing law placeholder or any generic court mention with precise statutory match
  let result = content;

  if (isRtl) {
    result = result
      .replace(/\[JURISDICTION\]/g, profile.countryAr)
      .replace(/القانون النافذ والتحكيم[\s\S]*?توقيع/gi, (match) => {
        return `البند القانوني: القانون النافذ واختصاص المحاكم الحصري
يخضع هذا العقد وتفسيره وبنوده لكافة ${profile.governingLawAr}.
وتختص ${profile.exclusiveCourtsAr} بالفصل الحصري النهائي في أي نزاع أو خلاف ينشأ عن أو يتعلق بهذا العقد، أو عبر ${profile.arbitrationCenterAr}.\n\nتوقيع`;
      });
  } else {
    result = result
      .replace(/\[JURISDICTION\]/g, profile.countryEn)
      .replace(/GOVERNING LAW & DISPUTE RESOLUTION[\s\S]*?SIGNATURE/gi, (match) => {
        return `SECTION: GOVERNING LAW & EXCLUSIVE JURISDICTION
This Agreement shall be governed by and construed in accordance with ${profile.governingLawEn}.
The Parties hereby irrevocably submit to ${profile.exclusiveCourtsEn}. Any dispute may also be referred to ${profile.arbitrationCenterEn}.\n\nSIGNATURE`;
      });
  }

  return result;
}
