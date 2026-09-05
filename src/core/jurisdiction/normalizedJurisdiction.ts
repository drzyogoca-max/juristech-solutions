/**
 * src/core/jurisdiction/normalizedJurisdiction.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Normalized Statutory Jurisdiction Model
 * Sprint 01 Foundation (Phase 9G)
 *
 * Canonical Hierarchy:
 * Country -> Jurisdiction -> Regulation -> Source -> Version -> Effective Date
 */

import { JURISDICTION_PROFILES, JurisdictionLegalProfile } from '../../lib/jurisdictionResolver';
import { JURISDICTIONS, JurisdictionInfo } from '../../lib/jurisdiction';

export interface StatutoryRegulationItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  officialSource: string;
  version: string;
  effectiveDate?: string;
  statutoryCategory: 'CIVIL' | 'COMMERCIAL' | 'COMPANIES' | 'LABOR' | 'DATA_PROTECTION' | 'ARBITRATION' | 'INTERNATIONAL';
}

export interface NormalizedJurisdictionProfile {
  countryCode: string;
  countryNameEn: string;
  countryNameAr: string;
  jurisdictionNameEn: string;
  jurisdictionNameAr: string;
  courtVenueEn: string;
  courtVenueAr: string;
  arbitrationCenterEn: string;
  arbitrationCenterAr: string;
  currencyCode: string;
  regulations: StatutoryRegulationItem[];
  subJurisdictions?: Array<{
    code: string;
    nameEn: string;
    nameAr: string;
    legalSystem: 'COMMON_LAW' | 'CIVIL_LAW' | 'SHARIA_CIVIL';
  }>;
  isRestricted?: boolean;
}

/**
 * Authoritative Canonical Registry for Core Sovereign Jurisdictions
 */
export const CANONICAL_STATUTORY_JURISDICTIONS: Record<string, NormalizedJurisdictionProfile> = {
  SA: {
    countryCode: 'SA',
    countryNameEn: 'Kingdom of Saudi Arabia',
    countryNameAr: 'المملكة العربية السعودية',
    jurisdictionNameEn: 'Saudi Commercial and Civil Judiciary',
    jurisdictionNameAr: 'القضاء العام والمحاكم التجارية في المملكة العربية السعودية',
    courtVenueEn: 'Competent Commercial and General Courts of Riyadh',
    courtVenueAr: 'المحاكم التجارية والمحاكم العامة بالرياض',
    arbitrationCenterEn: 'Saudi Center for Commercial Arbitration (SCCA)',
    arbitrationCenterAr: 'المركز السعودي للتحكيم التجاري (SCCA)',
    currencyCode: 'SAR',
    regulations: [
      {
        id: 'SA_REG_01',
        code: 'KSA-CTL-M191',
        nameAr: 'نظام المعاملات المدنية',
        nameEn: 'Civil Transactions Law (Royal Decree M/191)',
        officialSource: 'Umm Al-Qura Official Gazette Issue 4991',
        version: '1444H / 2023',
        effectiveDate: '2023-12-16',
        statutoryCategory: 'CIVIL',
      },
      {
        id: 'SA_REG_02',
        code: 'KSA-CL-M132',
        nameAr: 'نظام الشركات الجديد',
        nameEn: 'Companies Law (Royal Decree M/132)',
        officialSource: 'Umm Al-Qura Official Gazette Issue 4945',
        version: '1443H / 2022',
        effectiveDate: '2023-01-19',
        statutoryCategory: 'COMPANIES',
      },
      {
        id: 'SA_REG_03',
        code: 'KSA-PDPL-M148',
        nameAr: 'نظام حماية البيانات الشخصية',
        nameEn: 'Personal Data Protection Law (PDPL)',
        officialSource: 'Saudi Data and AI Authority (SDAIA) / Royal Decree M/148',
        version: '1445H / 2023 Amended',
        effectiveDate: '2024-09-14',
        statutoryCategory: 'DATA_PROTECTION',
      },
      {
        id: 'SA_REG_04',
        code: 'KSA-AL-M34',
        nameAr: 'نظام التحكيم السعودي',
        nameEn: 'Saudi Arbitration Law (Royal Decree M/34)',
        officialSource: 'Umm Al-Qura Official Gazette Issue 4409',
        version: '1433H / 2012',
        effectiveDate: '2012-07-08',
        statutoryCategory: 'ARBITRATION',
      },
    ],
  },

  AE: {
    countryCode: 'AE',
    countryNameEn: 'United Arab Emirates',
    countryNameAr: 'دولة الإمارات العربية المتحدة',
    jurisdictionNameEn: 'UAE Federal and Financial Free Zones Judiciary',
    jurisdictionNameAr: 'القضاء الاتحادي والمحاكم المالية بدولة الإمارات',
    courtVenueEn: 'Competent Courts of the UAE (Federal / Dubai / Abu Dhabi Courts)',
    courtVenueAr: 'محاكم دبي والمحاكم الاتحادية المختصة',
    arbitrationCenterEn: 'Dubai International Arbitration Centre (DIAC)',
    arbitrationCenterAr: 'مركز دبي للتحكيم الدولي (DIAC)',
    currencyCode: 'AED',
    subJurisdictions: [
      {
        code: 'ADGM',
        nameEn: 'Abu Dhabi Global Market (ADGM)',
        nameAr: 'سوق أبوظبي العالمي',
        legalSystem: 'COMMON_LAW',
      },
      {
        code: 'DIFC',
        nameEn: 'Dubai International Financial Centre (DIFC)',
        nameAr: 'مركز دبي المالي العالمي',
        legalSystem: 'COMMON_LAW',
      },
      {
        code: 'UAE_FEDERAL',
        nameEn: 'UAE Federal Onshore Jurisdiction',
        nameAr: 'القضاء الاتحادي الداخلي لدولة الإمارات',
        legalSystem: 'CIVIL_LAW',
      },
    ],
    regulations: [
      {
        id: 'AE_REG_01',
        code: 'UAE-CC-L05',
        nameAr: 'قانون المعاملات المدنية الاتحادي',
        nameEn: 'UAE Civil Transactions Law (Federal Law No. 5 of 1985)',
        officialSource: 'UAE Federal Official Gazette',
        version: '1985-As-Amended-2023',
        effectiveDate: '1985-12-15',
        statutoryCategory: 'CIVIL',
      },
      {
        id: 'AE_REG_02',
        code: 'UAE-CCL-L32',
        nameAr: 'قانون الشركات التجارية الاتحادي',
        nameEn: 'Commercial Companies Law (Federal Decree-Law No. 32 of 2021)',
        officialSource: 'UAE Ministry of Economy / Federal Gazette',
        version: '2021',
        effectiveDate: '2022-01-02',
        statutoryCategory: 'COMPANIES',
      },
      {
        id: 'AE_REG_03',
        code: 'UAE-PDPL-L45',
        nameAr: 'مرسوم بقانون اتحادي بشأن حماية البيانات الشخصية',
        nameEn: 'Federal Decree-Law No. 45/2021 (PDPL)',
        officialSource: 'UAE Data Office',
        version: '2021',
        effectiveDate: '2022-01-02',
        statutoryCategory: 'DATA_PROTECTION',
      },
    ],
  },

  EG: {
    countryCode: 'EG',
    countryNameEn: 'Arab Republic of Egypt',
    countryNameAr: 'جمهورية مصر العربية',
    jurisdictionNameEn: 'Egyptian Economic and Civil Judiciary',
    jurisdictionNameAr: 'المحاكم الاقتصادية والقضاء المدني المصري',
    courtVenueEn: 'Cairo Economic and Commercial Courts',
    courtVenueAr: 'المحاكم الاقتصادية بالقاهرة',
    arbitrationCenterEn: 'Cairo Regional Centre for International Commercial Arbitration (CRCICA)',
    arbitrationCenterAr: 'المركز الإقليمي العربي للتحكيم التجاري الدولي بالقاهرة (CRCICA)',
    currencyCode: 'EGP',
    regulations: [
      {
        id: 'EG_REG_01',
        code: 'EG-CC-L131',
        nameAr: 'القانون المدني المصري',
        nameEn: 'Egyptian Civil Code (Law No. 131 of 1948)',
        officialSource: 'Egyptian Official Gazette Issue 108 bis',
        version: '1948-As-Amended',
        effectiveDate: '1949-10-15',
        statutoryCategory: 'CIVIL',
      },
      {
        id: 'EG_REG_02',
        code: 'EG-PDPL-L151',
        nameAr: 'قانون حماية البيانات الشخصية',
        nameEn: 'Personal Data Protection Law (Law No. 151 of 2020)',
        officialSource: 'Egyptian Official Gazette Issue 28 bis',
        version: '2020',
        effectiveDate: '2020-10-16',
        statutoryCategory: 'DATA_PROTECTION',
      },
    ],
  },

  QA: {
    countryCode: 'QA',
    countryNameEn: 'State of Qatar',
    countryNameAr: 'دولة قطر',
    jurisdictionNameEn: 'Qatari Judiciary & Qatar International Court',
    jurisdictionNameAr: 'القضاء القطري ومحكمة قطر الدولية لفض المنازعات',
    courtVenueEn: 'Doha Competent Courts and QICDRC',
    courtVenueAr: 'محاكم الدوحة المختصة ومحكمة قطر الدولية (QICDRC)',
    arbitrationCenterEn: 'Qatar International Center for Conciliation and Arbitration (QICCA)',
    arbitrationCenterAr: 'مركز قطر للمشارطة والتحكيم التجاري (QICCA)',
    currencyCode: 'QAR',
    regulations: [
      {
        id: 'QA_REG_01',
        code: 'QA-CC-L22',
        nameAr: 'القانون المدني القطري',
        nameEn: 'Qatar Civil Code (Law No. 22 of 2004)',
        officialSource: 'Qatar Official Gazette',
        version: '2004',
        effectiveDate: '2004-08-08',
        statutoryCategory: 'CIVIL',
      },
    ],
  },

  GLOBAL: {
    countryCode: 'GLOBAL',
    countryNameEn: 'Global Cross-Border Baseline',
    countryNameAr: 'الإطار القانوني الدولي عبر الحدود',
    jurisdictionNameEn: 'International Commercial Arbitration & Cross-Border Model Law',
    jurisdictionNameAr: 'التحكيم التجاري الدولي وقواعد النماذج الدولية',
    courtVenueEn: 'Agreed Neutral Arbitration Seat (LCIA, ICC Paris, SIAC, or SCCA)',
    courtVenueAr: 'مقر وهيئة التحكيم الدولي المتفق عليها',
    arbitrationCenterEn: 'International Chamber of Commerce (ICC) / LCIA / SCCA',
    arbitrationCenterAr: 'غرفة التجارة الدولية (ICC) / مركز لندن للتحكيم الدولي (LCIA)',
    currencyCode: 'USD',
    regulations: [
      {
        id: 'GLOBAL_REG_01',
        code: 'UNCITRAL-1985',
        nameAr: 'قانون الأونسيترال النموذجي للتحكيم التجاري الدولي',
        nameEn: 'UNCITRAL Model Law on International Commercial Arbitration',
        officialSource: 'United Nations Commission on International Trade Law',
        version: '1985 with amendments as adopted in 2006',
        effectiveDate: '2006-07-07',
        statutoryCategory: 'INTERNATIONAL',
      },
      {
        id: 'GLOBAL_REG_02',
        code: 'CISG-1980',
        nameAr: 'اتفاقية الأمم المتحدة بشأن عقود البيع الدولي للبضائع',
        nameEn: 'United Nations Convention on Contracts for the International Sale of Goods (CISG)',
        officialSource: 'United Nations Treaty Series, vol. 1489',
        version: '1980',
        effectiveDate: '1988-01-01',
        statutoryCategory: 'INTERNATIONAL',
      },
    ],
  },
};

/**
 * Normalizes jurisdiction records into the canonical statutory hierarchy
 * Hierarchy: Country -> Jurisdiction -> Regulation -> Source -> Version -> Effective Date
 */
export function getNormalizedJurisdiction(countryCode: string): NormalizedJurisdictionProfile | null {
  const code = (countryCode || '').toUpperCase().trim();

  // Check Authoritative Canonical Registry first
  if (CANONICAL_STATUTORY_JURISDICTIONS[code]) {
    return CANONICAL_STATUTORY_JURISDICTIONS[code];
  }

  // Fallback to dynamic resolver if available
  const profile: JurisdictionLegalProfile | undefined = JURISDICTION_PROFILES[code];
  const generalInfo: JurisdictionInfo | undefined = JURISDICTIONS[code];

  if (!profile && !generalInfo) return CANONICAL_STATUTORY_JURISDICTIONS.GLOBAL;

  const regulations: StatutoryRegulationItem[] = (profile?.statutoryCodes || generalInfo?.governingLaws || []).map((lawStr, idx) => {
    let category: StatutoryRegulationItem['statutoryCategory'] = 'COMMERCIAL';
    const lower = lawStr.toLowerCase();
    if (lower.includes('civil') || lower.includes('مدني')) category = 'CIVIL';
    else if (lower.includes('compan') || lower.includes('شركات')) category = 'COMPANIES';
    else if (lower.includes('labor') || lower.includes('عمل')) category = 'LABOR';
    else if (lower.includes('arbitrat') || lower.includes('تحكيم')) category = 'ARBITRATION';
    else if (lower.includes('data') || lower.includes('بيانات')) category = 'DATA_PROTECTION';
    else if (lower.includes('uncitral') || lower.includes('cisg') || lower.includes('icc')) category = 'INTERNATIONAL';

    return {
      id: `${code}_REG_${idx + 1}`,
      code: `${code}-LAW-${idx + 1}`,
      nameAr: lawStr,
      nameEn: lawStr,
      officialSource: profile?.governingLawEn || generalInfo?.legalFramework || lawStr,
      version: '2026.1-CURRENT',
      statutoryCategory: category,
    };
  });

  return {
    countryCode: code,
    countryNameEn: profile?.countryEn || generalInfo?.countryName || code,
    countryNameAr: profile?.countryAr || generalInfo?.countryNameAr || code,
    jurisdictionNameEn: profile?.exclusiveCourtsEn || generalInfo?.arbitrationVenue || 'Competent National Jurisdiction',
    jurisdictionNameAr: profile?.exclusiveCourtsAr || generalInfo?.arbitrationVenueAr || 'المحاكم الوطنية المختصة',
    courtVenueEn: profile?.exclusiveCourtsEn || 'Competent Commercial Courts',
    courtVenueAr: profile?.exclusiveCourtsAr || 'المحاكم التجارية المختصة',
    arbitrationCenterEn: profile?.arbitrationCenterEn || generalInfo?.arbitrationVenue || 'Official Arbitration Center',
    arbitrationCenterAr: profile?.arbitrationCenterAr || generalInfo?.arbitrationVenueAr || 'مركز وهيئة التحكيم المعتمد',
    currencyCode: profile?.currencyCode || generalInfo?.currencyCode || 'USD',
    regulations,
    isRestricted: generalInfo?.isBlocked || false,
  };
}
