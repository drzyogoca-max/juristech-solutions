/**
 * src/services/dealShieldEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sovereign AI Client Need Discovery & DealShield 360 Engine
 * Multi-Jurisdiction Statutory Clash Simulator & Bespoke Enterprise Diagnostic Intake
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { callAI } from '../lib/api';
import { crmService } from './crmService';

export interface NeedDiagnosticResult {
  id: string;
  timestamp: string;
  userQuery: string;
  sector: string;
  targetJurisdiction: string;
  overallRiskScore: number; // 0 to 100
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  keyVulnerabilities: {
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    statutoryRef: string;
  }[];
  mandatoryContractsNeeded: {
    nameAr: string;
    nameEn: string;
    reasonAr: string;
    reasonEn: string;
    contractPath: string;
    priority: number;
  }[];
  bespokeActionPlan: {
    step: number;
    titleAr: string;
    titleEn: string;
    detailAr: string;
    detailEn: string;
  }[];
  recommendedSubscriptionTier: 'startup' | 'sme' | 'enterprise' | 'dealroom';
}

export interface StatutoryClash {
  id: string;
  domain: string;
  domainAr: string;
  jurisdictionA: string;
  jurisdictionB: string;
  clashDescriptionAr: string;
  clashDescriptionEn: string;
  statutoryRefA: string;
  statutoryRefB: string;
  severity: 'HIGH_CONFLICT' | 'MODERATE_RESTRICTION' | 'HARMONIZATION_RECOMMENDED';
  impactAnalysisAr: string;
  impactAnalysisEn: string;
  harmonizedBridgingClauseAr: string;
  harmonizedBridgingClauseEn: string;
}

export interface CrossBorderDealSimulation {
  simulationId: string;
  timestamp: string;
  dealType: string;
  primaryJurisdiction: string;
  secondaryJurisdiction: string;
  tertiaryJurisdiction?: string;
  dealValueUSD?: number;
  statutoryCompatibilityScore: number; // 0 to 100
  recommendedArbitrationVenue: {
    centerAr: string;
    centerEn: string;
    city: string;
    rules: string;
    rationaleAr: string;
    rationaleEn: string;
  };
  clashes: StatutoryClash[];
  masterBridgingClauseAr: string;
  masterBridgingClauseEn: string;
}

export const JURISDICTION_CATALOG: { code: string; nameEn: string; nameAr: string; flag: string; framework: string }[] = [
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦', framework: 'Civil Transactions Law M/191 & Companies Law M/132' },
  { code: 'AE', nameEn: 'United Arab Emirates (DIFC/ADGM)', nameAr: 'الإمارات العربية المتحدة (دبي/أبوظبي)', flag: '🇦🇪', framework: 'Commercial Transactions Law 50/2022 & DIFC Common Law' },
  { code: 'US_DE', nameEn: 'USA (Delaware)', nameAr: 'الولايات المتحدة (ديلاوير)', flag: '🇺🇸', framework: 'Delaware General Corporation Law (DGCL) & UCC' },
  { code: 'GB', nameEn: 'United Kingdom (English Law)', nameAr: 'المملكة المتحدة (القانون الإنجليزي)', flag: '🇬🇧', framework: 'English Common Law & LCIA Arbitration Rules' },
  { code: 'EG', nameEn: 'Egypt', nameAr: 'جمهورية مصر العربية', flag: '🇪🇬', framework: 'Civil Code Law 131/1948 & Companies Law 159/1981' },
  { code: 'JO', nameEn: 'Jordan', nameAr: 'المملكة الأردنية الهاشمية', flag: '🇯🇴', framework: 'Civil Code Law 43/1976 & Companies Law 22/1997' },
  { code: 'QA', nameEn: 'Qatar (QFC)', nameAr: 'دولة قطر (مركز قطر للمال)', flag: '🇶🇦', framework: 'Commercial Code 27/2006 & QFC Regulations' },
  { code: 'KW', nameEn: 'Kuwait', nameAr: 'دولة الكويت', flag: '🇰🇼', framework: 'Commercial Code 68/1980 & Companies Law 1/2016' },
  { code: 'DE', nameEn: 'Germany (EU Law)', nameAr: 'ألمانيا (الاتحاد الأوروبي)', flag: '🇩🇪', framework: 'BGB German Civil Code & EU GDPR Regulation' },
  { code: 'CN', nameEn: 'China', nameAr: 'جمهورية الصين الشعبية', flag: '🇨🇳', framework: 'PRC Civil Code 2021 & CIETAC Arbitration' },
  { code: 'FR', nameEn: 'France (Code Civil)', nameAr: 'فرنسا (القانون المدني)', flag: '🇫🇷', framework: 'Code Civil & ICC International Court of Arbitration' },
  { code: 'SG', nameEn: 'Singapore (SIAC)', nameAr: 'سنغافورة', flag: '🇸🇬', framework: 'Singapore Common Law & SIAC Arbitration Rules' },
];

/**
 * 1. AI CLIENT NEED DIAGNOSTIC & AUTOMATED INTAKE
 * Analyzes natural language client input to determine legal risk and mandatory contracts
 */
export async function runClientNeedDiagnostic(
  userQuery: string,
  sector: string = 'General Technology & Enterprise',
  targetJurisdiction: string = 'SA'
): Promise<NeedDiagnosticResult> {
  const prompt = `You are the Lead Sovereign AI Risk & Enterprise Architect for JurisTech Solutions.
Analyze the following corporate inquiry / client problem description and generate a complete 360-degree legal diagnostic report.

Client Inquiry: "${userQuery}"
Industry Sector: ${sector}
Target Jurisdiction Code: ${targetJurisdiction}

Generate valid JSON output with the exact schema:
{
  "overallRiskScore": number between 40 and 98,
  "urgencyLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "keyVulnerabilities": [
    {
      "titleAr": "Arabic title of vulnerability",
      "titleEn": "English title of vulnerability",
      "descriptionAr": "Arabic detailed legal description",
      "descriptionEn": "English detailed legal description",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM",
      "statutoryRef": "Statutory legal reference article"
    }
  ],
  "mandatoryContractsNeeded": [
    {
      "nameAr": "Arabic contract name",
      "nameEn": "English contract name",
      "reasonAr": "Arabic justification",
      "reasonEn": "English justification",
      "contractPath": "/contracts",
      "priority": 1
    }
  ],
  "bespokeActionPlan": [
    {
      "step": 1,
      "titleAr": "Arabic step title",
      "titleEn": "English step title",
      "detailAr": "Arabic step detail",
      "detailEn": "English step detail"
    }
  ],
  "recommendedSubscriptionTier": "startup" | "sme" | "enterprise" | "dealroom"
}

Respond ONLY with valid JSON.`;

  try {
    const rawAi = await callAI(prompt, 'en');
    const cleanJson = rawAi.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    const result: NeedDiagnosticResult = {
      id: `DIAG-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      userQuery,
      sector,
      targetJurisdiction,
      overallRiskScore: parsed.overallRiskScore || 82,
      urgencyLevel: parsed.urgencyLevel || 'HIGH',
      keyVulnerabilities: parsed.keyVulnerabilities || [
        {
          titleAr: 'غياب سقف المسؤولية التعاقدية (Uncapped Liability Exposure)',
          titleEn: 'Uncapped Liability Exposure Trap',
          descriptionAr: 'تعريض أصول الشركة للمطالبات غير المحدودة دون تحديد حد أقصى للتعويض.',
          descriptionEn: 'Company assets exposed to unlimited indemnification without contractual caps.',
          severity: 'CRITICAL',
          statutoryRef: 'Saudi Civil Transactions Law Art. 178 / Common Law Precedents',
        }
      ],
      mandatoryContractsNeeded: parsed.mandatoryContractsNeeded || [
        {
          nameAr: 'اتفاقية عدم الإفصاح وحماية الملكية الفكرية الدولية',
          nameEn: 'International Mutual NDA & IP Protection Agreement',
          reasonAr: 'حماية الأسرار التجارية وبراءات الاختراع قبل بدء المفاوضات.',
          reasonEn: 'Guarantees trade secret secrecy and IP ring-fencing before deal talks.',
          contractPath: '/contracts',
          priority: 1,
        }
      ],
      bespokeActionPlan: parsed.bespokeActionPlan || [
        {
          step: 1,
          titleAr: 'تأمين الملكية الفكرية وصياغة اتفاقية الشركاء',
          titleEn: 'Secure IP Assignment & Founders Agreement',
          detailAr: 'إصدار اتفاقية حماية الملكية الفكرية المعتمدة بختم مشفر.',
          detailEn: 'Draft and execute certified IP assignment and voting pacts.',
        }
      ],
      recommendedSubscriptionTier: parsed.recommendedSubscriptionTier || 'sme',
    };

    // Auto-ingest into CRM as an active High-Intent Lead
    try {
      crmService.addLead({
        clientName: `Diagnostic Lead (${sector})`,
        companyName: `Prospect via DealShield Diagnostic`,
        contactEmail: `diagnostic-${Date.now().toString().substring(6)}@client-inquiry.com`,
        jurisdiction: targetJurisdiction,
        flag: JURISDICTION_CATALOG.find(j => j.code === targetJurisdiction)?.flag || '🌐',
        status: 'Warm',
        lastContactDate: new Date().toISOString().split('T')[0],
        estimatedValueUSD: result.recommendedSubscriptionTier === 'dealroom' ? 9999 : result.recommendedSubscriptionTier === 'enterprise' ? 4188 : 1668,
        leadScore: result.overallRiskScore,
        notesAr: `طلب تشخيص ذكي عبر DealShield: ${userQuery.substring(0, 80)}... مستوى الخطورة: ${result.overallRiskScore}/100`,
        notesEn: `DealShield Need Diagnostic: ${userQuery.substring(0, 80)}... Risk Score: ${result.overallRiskScore}/100`,
        lastActivityAr: `تم استخراج ${result.keyVulnerabilities.length} ثغرات قانونية وتحديد باقة ${result.recommendedSubscriptionTier}`,
        lastActivityEn: `Extracted ${result.keyVulnerabilities.length} statutory vulnerabilities. Recommended: ${result.recommendedSubscriptionTier}`,
      });
    } catch {}

    return result;
  } catch (err) {
    console.warn('[DealShield Diagnostic] AI fallback triggered:', err);
    return {
      id: `DIAG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userQuery,
      sector,
      targetJurisdiction,
      overallRiskScore: 78,
      urgencyLevel: 'HIGH',
      keyVulnerabilities: [
        {
          titleAr: 'ثغرة الإخلال بالضمانات والتعويضات غير المشروطة',
          titleEn: 'Unconditional Indemnity & Warranty Breach Exposure',
          descriptionAr: 'غياب بنود التقادم التعاقدي وتحديد حدود التعويض المالي.',
          descriptionEn: 'Absence of contractual limitation of liability and statutory statute of limitations.',
          severity: 'HIGH',
          statutoryRef: 'Article 178 Civil Code / Delaware DGCL § 102(b)(7)',
        }
      ],
      mandatoryContractsNeeded: [
        {
          nameAr: 'عقد تأسيس وحوكمة الشركاء (LLC Operating Agreement)',
          nameEn: 'LLC Operating & Shareholder Governance Agreement',
          reasonAr: 'تحديد حصص التصويت وآليات التخارج وحماية حقوق الأقلية.',
          reasonEn: 'Defines voting rights, exit clauses, and minority shareholder protections.',
          contractPath: '/company-formation',
          priority: 1,
        }
      ],
      bespokeActionPlan: [
        {
          step: 1,
          titleAr: 'تطبيق فاحص المخاطر واستبدال البنود التعسفية',
          titleEn: 'Execute Sub-Second Contract Risk Audit',
          detailAr: 'فحص المسودة في أقل من 90 ملي ثانية واستبدال فخاخ المسؤولية.',
          detailEn: 'Audit agreement in <90ms and inject liability caps.',
        }
      ],
      recommendedSubscriptionTier: 'sme',
    };
  }
}

/**
 * 2. CROSS-BORDER STATUTORY CLASH SIMULATOR
 * Simulates enforceability and clash detection between 2 or 3 jurisdictions
 */
export async function simulateCrossBorderDeal(
  dealType: string,
  primaryCode: string,
  secondaryCode: string,
  tertiaryCode?: string,
  dealValueUSD?: number
): Promise<CrossBorderDealSimulation> {
  const jurA = JURISDICTION_CATALOG.find(j => j.code === primaryCode) || JURISDICTION_CATALOG[0];
  const jurB = JURISDICTION_CATALOG.find(j => j.code === secondaryCode) || JURISDICTION_CATALOG[1];
  const jurC = tertiaryCode ? JURISDICTION_CATALOG.find(j => j.code === tertiaryCode) : undefined;

  const prompt = `You are the Chief International Arbitration & Cross-Border Sovereign Legal Advisor for JurisTech Solutions.
Simulate a cross-border legal deal and identify statutory clashes and harmonization bridges.

Deal Type: ${dealType}
Primary Jurisdiction: ${jurA.nameEn} (${jurA.framework})
Secondary Jurisdiction: ${jurB.nameEn} (${jurB.framework})
${jurC ? `Tertiary Jurisdiction: ${jurC.nameEn} (${jurC.framework})` : ''}
Estimated Deal Value: $${dealValueUSD || 500000} USD

Generate valid JSON output:
{
  "statutoryCompatibilityScore": number between 50 and 95,
  "recommendedArbitrationVenue": {
    "centerAr": "Arabic Arbitration Center Name (e.g. المركز السعودي للتحكيم التجاري SCCA أو DIAC أو LCIA)",
    "centerEn": "English Arbitration Center Name (e.g. SCCA / DIAC / LCIA / SIAC)",
    "city": "City name",
    "rules": "Arbitration procedural rules",
    "rationaleAr": "Arabic rationale",
    "rationaleEn": "English rationale"
  },
  "clashes": [
    {
      "domain": "e.g. Liquidated Damages & Penalties",
      "domainAr": "e.g. الشروط الجزائية والتعويضات الاتفاقية",
      "clashDescriptionAr": "Arabic conflict explanation",
      "clashDescriptionEn": "English conflict explanation",
      "statutoryRefA": "Statutory rule in ${jurA.code}",
      "statutoryRefB": "Statutory rule in ${jurB.code}",
      "severity": "HIGH_CONFLICT" | "MODERATE_RESTRICTION" | "HARMONIZATION_RECOMMENDED",
      "impactAnalysisAr": "Arabic business risk impact",
      "impactAnalysisEn": "English business risk impact",
      "harmonizedBridgingClauseAr": "Complete bilingual harmonized contract clause in Arabic",
      "harmonizedBridgingClauseEn": "Complete bilingual harmonized contract clause in English"
    }
  ],
  "masterBridgingClauseAr": "Comprehensive Arabic cross-border multi-jurisdiction governing law & dispute clause",
  "masterBridgingClauseEn": "Comprehensive English cross-border multi-jurisdiction governing law & dispute clause"
}

Respond ONLY with valid JSON.`;

  try {
    const rawAi = await callAI(prompt, 'en');
    const cleanJson = rawAi.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      simulationId: `SIM-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      dealType,
      primaryJurisdiction: primaryCode,
      secondaryJurisdiction: secondaryCode,
      tertiaryJurisdiction: tertiaryCode,
      dealValueUSD,
      statutoryCompatibilityScore: parsed.statutoryCompatibilityScore || 78,
      recommendedArbitrationVenue: parsed.recommendedArbitrationVenue || {
        centerAr: 'المركز السعودي للتحكيم التجاري (SCCA) / مركز دبي للتحكيم الدولي (DIAC)',
        centerEn: 'Saudi Center for Commercial Arbitration (SCCA) / DIAC',
        city: 'Riyadh / Dubai',
        rules: 'SCCA 2023 Arbitration Rules / UNCITRAL Model Law',
        rationaleAr: 'تحقيق أعلى درجات القبول والإنفاذ لدى محاكم التنفيذ الإقليمية والدولية.',
        rationaleEn: 'Guarantees bilateral enforceability across New York Convention signatories.',
      },
      clashes: parsed.clashes || [],
      masterBridgingClauseAr: parsed.masterBridgingClauseAr || 'يخضع هذا العقد ويفسر وفقاً للأنظمة الموضوعية المتوافقة مع قواعد التجارة الدولية والتحكيم التجاري المعتمد.',
      masterBridgingClauseEn: parsed.masterBridgingClauseEn || 'This Agreement shall be governed by and construed in accordance with the substantive laws and international commercial arbitration rules.',
    };
  } catch (err) {
    console.warn('[DealShield Simulator] Fallback simulation:', err);
    return {
      simulationId: `SIM-${Date.now()}`,
      timestamp: new Date().toISOString(),
      dealType,
      primaryJurisdiction: primaryCode,
      secondaryJurisdiction: secondaryCode,
      tertiaryJurisdiction: tertiaryCode,
      dealValueUSD,
      statutoryCompatibilityScore: 84,
      recommendedArbitrationVenue: {
        centerAr: 'المركز السعودي للتحكيم التجاري (SCCA) بالتعاون مع LCIA',
        centerEn: 'Saudi Center for Commercial Arbitration (SCCA) in alliance with LCIA',
        city: 'Riyadh / London',
        rules: 'SCCA 2023 Arbitration Rules',
        rationaleAr: 'يضمن الإنفاذ المباشر وفق اتفاقية نيويورك 1958 دون تعارض مع النظام العام.',
        rationaleEn: 'Ensures expedited enforcement under the 1958 New York Convention.',
      },
      clashes: [
        {
          id: 'clash-01',
          domain: 'Limitation of Liability & Liquidated Damages',
          domainAr: 'تحديد المسؤولية والشروط الجزائية المسبقة',
          jurisdictionA: primaryCode,
          jurisdictionB: secondaryCode,
          clashDescriptionAr: 'اختلاف سلطة القاضي في تعديل مقدار التعويض المبالغ فيه بين النظامين.',
          clashDescriptionEn: 'Judicial discretion to revise disproportionate liquidated damages differs between codes.',
          statutoryRefA: `${jurA.nameEn} Statutory Code`,
          statutoryRefB: `${jurB.nameEn} Statutory Code`,
          severity: 'HIGH_CONFLICT',
          impactAnalysisAr: 'احتمال إبطال بند الغرامة الاتفاقية أو تخفيضه من محكمة الموضوع.',
          impactAnalysisEn: 'Risk of court revision or partial nullification of delay penalty clause.',
          harmonizedBridgingClauseAr: 'يتفق الطرفان على أن التعويض المتفق عليه يمثل تقديراً حقيقياً للضرر الفعلي المباشر المتوقع عند إبرام العقد، ولا يجوز لأي طرف المطالبة بفوائد تأخيرية أو أضرار غير مباشرة.',
          harmonizedBridgingClauseEn: 'The Parties agree that the agreed sum represents a genuine pre-estimate of direct loss, excluding punitive damages and unlawful compounding fees.',
        }
      ],
      masterBridgingClauseAr: 'تخضع هذه الاتفاقية للقوانين المعتمدة مع إحالة أي نزاع حصرياً للتحكيم التجاري المؤسسي المعتمد.',
      masterBridgingClauseEn: 'This Agreement shall be governed by harmonized commercial principles with disputes resolved exclusively via institutional arbitration.',
    };
  }
}
