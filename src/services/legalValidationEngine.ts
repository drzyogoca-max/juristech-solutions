/**
 * src/services/legalValidationEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Legal Validation Scoring Engine v1.0
 * Comprehensive contract quality and legal compliance scoring system.
 * Integrates gap analysis, document protocol, and jurisdiction validation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { analyzeContractGaps, ContractGapAnalysisResult } from '../lib/contractGapDetector';
import { analyzeRequiredDocuments, MissingDocumentReport } from '../lib/contracts/missingDocumentProtocol';
import { getJurisdictionProfile, JurisdictionLegalProfile } from '../lib/jurisdictionResolver';

// ── TYPES ────────────────────────────────────────────────────────────────────

export interface LegalValidationDimension {
  dimensionId: string;
  nameAr: string;
  nameEn: string;
  score: number;        // 0–100
  maxScore: number;     // Always 100
  weight: number;       // Percentage weight in overall score
  status: 'PASS' | 'WARNING' | 'FAIL';
  findingsAr: string[];
  findingsEn: string[];
}

export interface LegalValidationReport {
  contractId?: string;
  jurisdiction: string;
  overallScore: number;          // 0–100 weighted composite
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  gradeLabel: string;
  dimensions: LegalValidationDimension[];
  gapAnalysis: ContractGapAnalysisResult;
  documentReport: MissingDocumentReport;
  jurisdictionProfile: JurisdictionLegalProfile;
  executionReadiness: boolean;
  executionBlockers: string[];
  certificationSummaryAr: string;
  certificationSummaryEn: string;
  generatedAt: string;
}

// ── SCORING WEIGHTS ───────────────────────────────────────────────────────────

const DIMENSION_WEIGHTS: Record<string, number> = {
  'dim-parties-identification': 15,
  'dim-subject-matter': 15,
  'dim-financial-terms': 15,
  'dim-legal-compliance': 20,
  'dim-dispute-resolution': 10,
  'dim-termination-rights': 10,
  'dim-document-completeness': 10,
  'dim-sharia-compliance': 5,
};

// ── CORE VALIDATION ENGINE ────────────────────────────────────────────────────

/**
 * Executes a comprehensive 8-dimension legal validation of a contract text.
 * Returns an actionable validation report with scores, findings, and grade.
 */
export function executeLegalValidation(
  contractText: string,
  jurisdiction: string = 'GLOBAL',
  contractId?: string
): LegalValidationReport {
  const text = contractText || '';
  const jur = jurisdiction.toUpperCase();
  const jurisdictionProfile = getJurisdictionProfile(jur);

  // Run sub-analyses
  const gapAnalysis = analyzeContractGaps(text);
  const documentReport = analyzeRequiredDocuments(text, jur);

  // ── DIMENSION 1: Parties & Identification ──────────────────────────────────
  const partiesScore = _scoreParties(text);
  const dim1: LegalValidationDimension = {
    dimensionId: 'dim-parties-identification',
    nameAr: 'تحديد أطراف العقد وبياناتهم',
    nameEn: 'Parties Identification & Capacity',
    score: partiesScore,
    maxScore: 100,
    weight: DIMENSION_WEIGHTS['dim-parties-identification'],
    status: partiesScore >= 80 ? 'PASS' : partiesScore >= 50 ? 'WARNING' : 'FAIL',
    findingsAr: _partiesFindingsAr(text, partiesScore),
    findingsEn: _partiesFindingsEn(text, partiesScore),
  };

  // ── DIMENSION 2: Subject Matter Clarity ───────────────────────────────────
  const subjectScore = _scoreSubjectMatter(text);
  const dim2: LegalValidationDimension = {
    dimensionId: 'dim-subject-matter',
    nameAr: 'وضوح موضوع العقد والمحل والسبب',
    nameEn: 'Subject Matter, Object & Consideration',
    score: subjectScore,
    maxScore: 100,
    weight: DIMENSION_WEIGHTS['dim-subject-matter'],
    status: subjectScore >= 75 ? 'PASS' : subjectScore >= 50 ? 'WARNING' : 'FAIL',
    findingsAr: [`درجة وضوح الموضوع: ${subjectScore}/100`, subjectScore < 70 ? 'يُوصى بتفصيل أكبر لنطاق العمل والمخرجات المتوقعة.' : 'الموضوع محدد بشكل واضح.'],
    findingsEn: [`Subject clarity score: ${subjectScore}/100`, subjectScore < 70 ? 'Recommend greater specificity in scope and deliverables.' : 'Subject matter is clearly defined.'],
  };

  // ── DIMENSION 3: Financial Terms ──────────────────────────────────────────
  const financialScore = _scoreFinancialTerms(text);
  const dim3: LegalValidationDimension = {
    dimensionId: 'dim-financial-terms',
    nameAr: 'الشروط المالية وآليات الدفع',
    nameEn: 'Financial Terms & Payment Mechanisms',
    score: financialScore,
    maxScore: 100,
    weight: DIMENSION_WEIGHTS['dim-financial-terms'],
    status: financialScore >= 75 ? 'PASS' : financialScore >= 50 ? 'WARNING' : 'FAIL',
    findingsAr: _financialFindingsAr(text, financialScore),
    findingsEn: _financialFindingsEn(text, financialScore),
  };

  // ── DIMENSION 4: Legal Compliance (Gap Analysis Result) ───────────────────
  const criticalGaps = gapAnalysis.gaps.filter(g => g.severity === 'CRITICAL').length;
  const warningGaps = gapAnalysis.gaps.filter(g => g.severity === 'WARNING').length;
  const legalScore = Math.max(0, 100 - (criticalGaps * 20) - (warningGaps * 7));
  const dim4: LegalValidationDimension = {
    dimensionId: 'dim-legal-compliance',
    nameAr: 'الامتثال القانوني والثغرات التعاقدية',
    nameEn: 'Legal Compliance & Gap Analysis',
    score: legalScore,
    maxScore: 100,
    weight: DIMENSION_WEIGHTS['dim-legal-compliance'],
    status: legalScore >= 80 ? 'PASS' : legalScore >= 50 ? 'WARNING' : 'FAIL',
    findingsAr: [
      `ثغرات حرجة: ${criticalGaps} | تحذيرات: ${warningGaps}`,
      `مؤشر مخاطرة العقد: ${gapAnalysis.riskScore}/100`,
    ],
    findingsEn: [
      `Critical gaps: ${criticalGaps} | Warnings: ${warningGaps}`,
      `Contract risk index: ${gapAnalysis.riskScore}/100`,
    ],
  };

  // ── DIMENSION 5: Dispute Resolution ──────────────────────────────────────
  const disputeScore = _scoreDisputeResolution(text, jurisdictionProfile);
  const dim5: LegalValidationDimension = {
    dimensionId: 'dim-dispute-resolution',
    nameAr: 'آليات حل النزاعات والقانون الواجب التطبيق',
    nameEn: 'Dispute Resolution & Governing Law',
    score: disputeScore,
    maxScore: 100,
    weight: DIMENSION_WEIGHTS['dim-dispute-resolution'],
    status: disputeScore >= 75 ? 'PASS' : disputeScore >= 50 ? 'WARNING' : 'FAIL',
    findingsAr: [disputeScore >= 75 ? 'آلية فض النزاعات محددة بوضوح.' : 'يُوصى بتحديد مركز التحكيم المختص والقانون الحاكم بدقة.'],
    findingsEn: [disputeScore >= 75 ? 'Dispute resolution mechanism is clearly defined.' : 'Recommend specifying exact arbitration center and governing law provision.'],
  };

  // ── DIMENSION 6: Termination Rights ──────────────────────────────────────
  const terminationScore = _scoreTerminationRights(text);
  const dim6: LegalValidationDimension = {
    dimensionId: 'dim-termination-rights',
    nameAr: 'حقوق الإنهاء والخروج والتبعات',
    nameEn: 'Termination Rights, Exit & Consequences',
    score: terminationScore,
    maxScore: 100,
    weight: DIMENSION_WEIGHTS['dim-termination-rights'],
    status: terminationScore >= 70 ? 'PASS' : terminationScore >= 45 ? 'WARNING' : 'FAIL',
    findingsAr: [terminationScore >= 70 ? 'بنود الإنهاء والخروج مستوفاة.' : 'يُوصى بتحديد إجراءات الإنهاء وفترات الإشعار والتداعيات القانونية.'],
    findingsEn: [terminationScore >= 70 ? 'Termination provisions are adequately covered.' : 'Recommend specifying notice periods, exit procedures, and post-termination obligations.'],
  };

  // ── DIMENSION 7: Document Completeness ───────────────────────────────────
  const docScore = documentReport.overallComplianceScore;
  const dim7: LegalValidationDimension = {
    dimensionId: 'dim-document-completeness',
    nameAr: 'اكتمال الوثائق والمرفقات المطلوبة',
    nameEn: 'Required Companion Documents & Annexes',
    score: docScore,
    maxScore: 100,
    weight: DIMENSION_WEIGHTS['dim-document-completeness'],
    status: docScore >= 80 ? 'PASS' : docScore >= 55 ? 'WARNING' : 'FAIL',
    findingsAr: [`وثائق إلزامية مفقودة: ${documentReport.mandatoryMissing}`, documentReport.remediationSummaryAr],
    findingsEn: [`Mandatory missing documents: ${documentReport.mandatoryMissing}`, documentReport.remediationSummaryEn],
  };

  // ── DIMENSION 8: Sharia Compliance (for Islamic Finance) ─────────────────
  const isIslamicFinance = /(مرابحة|إجارة|مشاركة|صكوك|استصناع|وكالة|murabaha|ijara|musharaka|sukuk|istisna|wakala|AAOIFI|sharia)/i.test(text);
  const shariaScore = isIslamicFinance ? _scoreShariaCompliance(text) : 100; // 100 if not Islamic Finance
  const dim8: LegalValidationDimension = {
    dimensionId: 'dim-sharia-compliance',
    nameAr: 'الامتثال الشرعي (للتمويل الإسلامي)',
    nameEn: 'Sharia Compliance (Islamic Finance Contracts)',
    score: shariaScore,
    maxScore: 100,
    weight: DIMENSION_WEIGHTS['dim-sharia-compliance'],
    status: shariaScore >= 80 ? 'PASS' : shariaScore >= 50 ? 'WARNING' : 'FAIL',
    findingsAr: [isIslamicFinance
      ? (shariaScore >= 80 ? 'العقد يحتوي على الضوابط الشرعية الأساسية.' : 'يُوصى بإضافة شهادة مطابقة AAOIFI وبند التصحيح الشرعي.')
      : 'غير مُطبَّق (ليس عقد تمويل إسلامي).'],
    findingsEn: [isIslamicFinance
      ? (shariaScore >= 80 ? 'Contract contains essential Sharia governance clauses.' : 'Recommend adding AAOIFI compliance certificate and Sharia correction clause.')
      : 'Not applicable (not an Islamic Finance contract).'],
  };

  const dimensions = [dim1, dim2, dim3, dim4, dim5, dim6, dim7, dim8];

  // ── COMPOSITE SCORE ────────────────────────────────────────────────────────
  const overallScore = Math.round(
    dimensions.reduce((acc, d) => acc + (d.score * d.weight) / 100, 0)
  );

  const grade = _computeGrade(overallScore);
  const gradeLabel = _gradeLabel(grade);

  // ── EXECUTION BLOCKERS ────────────────────────────────────────────────────
  const executionBlockers: string[] = [];
  if (criticalGaps > 0) executionBlockers.push(`${criticalGaps} critical legal gaps must be resolved`);
  if (documentReport.mandatoryMissing > 0) executionBlockers.push(`${documentReport.mandatoryMissing} mandatory companion documents are missing`);
  if (partiesScore < 40) executionBlockers.push('Party identification is critically incomplete');
  if (financialScore < 30) executionBlockers.push('Financial terms are critically ambiguous or missing');

  const executionReadiness = executionBlockers.length === 0 && overallScore >= 60;

  const certificationSummaryAr = executionReadiness
    ? `✅ العقد جاهز للتنفيذ — الدرجة الإجمالية: ${overallScore}/100 (${grade}). جميع المتطلبات القانونية الأساسية مستوفاة.`
    : `⚠️ العقد غير جاهز للتنفيذ — الدرجة: ${overallScore}/100 (${grade}). ${executionBlockers.length} عائق/عوائق يجب معالجتها.`;

  const certificationSummaryEn = executionReadiness
    ? `✅ Contract is EXECUTION READY — Score: ${overallScore}/100 (${grade}). All core legal requirements are satisfied.`
    : `⚠️ Contract is NOT EXECUTION READY — Score: ${overallScore}/100 (${grade}). ${executionBlockers.length} blocker(s) must be resolved before signing.`;

  return {
    contractId,
    jurisdiction: jur,
    overallScore,
    grade,
    gradeLabel,
    dimensions,
    gapAnalysis,
    documentReport,
    jurisdictionProfile,
    executionReadiness,
    executionBlockers,
    certificationSummaryAr,
    certificationSummaryEn,
    generatedAt: new Date().toISOString(),
  };
}

// ── HELPER SCORERS ────────────────────────────────────────────────────────────

function _scoreParties(text: string): number {
  let score = 40;
  if (/(الطرف الأول|party a|first party|party 1)/i.test(text)) score += 15;
  if (/(الطرف الثاني|party b|second party|party 2)/i.test(text)) score += 15;
  if (/(سجل تجاري|CR|registration|رقم الهوية|national id|tax id)/i.test(text)) score += 15;
  if (/(موقع|address|عنوان)/i.test(text)) score += 15;
  return Math.min(100, score);
}

function _partiesFindingsAr(text: string, score: number): string[] {
  const findings: string[] = [`درجة تحديد الأطراف: ${score}/100`];
  if (!/(سجل تجاري|CR|registration|رقم الهوية)/i.test(text)) findings.push('مطلوب: إضافة السجل التجاري أو رقم الهوية لكلا الطرفين.');
  if (!/(عنوان|موقع|address)/i.test(text)) findings.push('مطلوب: إضافة عناوين الأطراف.');
  if (score >= 80) findings.push('تحديد الأطراف مكتمل ومطابق للمعايير.');
  return findings;
}

function _partiesFindingsEn(text: string, score: number): string[] {
  const findings: string[] = [`Parties identification score: ${score}/100`];
  if (!/(CR|registration|national id|tax id)/i.test(text)) findings.push('Required: Add commercial registration or ID numbers for both parties.');
  if (!/(address)/i.test(text)) findings.push('Required: Add party addresses.');
  if (score >= 80) findings.push('Party identification is complete and standard-compliant.');
  return findings;
}

function _scoreSubjectMatter(text: string): number {
  let score = 40;
  if (/(موضوع|subject matter|نطاق|scope)/i.test(text)) score += 20;
  if (/(تسليم|deliver|مخرجات|output)/i.test(text)) score += 20;
  if (/(مدة|duration|term|فترة)/i.test(text)) score += 20;
  return Math.min(100, score);
}

function _scoreFinancialTerms(text: string): number {
  let score = 30;
  if (/(مبلغ|قيمة|amount|value|\d+,\d+)/i.test(text)) score += 20;
  if (/(عملة|currency|دولار|ريال|JOD|USD|SAR|AED)/i.test(text)) score += 15;
  if (/(دفع|payment|سداد)/i.test(text)) score += 20;
  if (/(تأخر|غرامة|late|penalty)/i.test(text)) score += 15;
  return Math.min(100, score);
}

function _financialFindingsAr(text: string, score: number): string[] {
  const findings: string[] = [`درجة وضوح الشروط المالية: ${score}/100`];
  if (!/(عملة|currency|JOD|USD|SAR|AED)/i.test(text)) findings.push('مطلوب: تحديد العملة المتعاقد بها.');
  if (score >= 80) findings.push('الشروط المالية واضحة ومتكاملة.');
  return findings;
}

function _financialFindingsEn(text: string, score: number): string[] {
  const findings: string[] = [`Financial terms clarity score: ${score}/100`];
  if (!/(currency|JOD|USD|SAR|AED)/i.test(text)) findings.push('Required: Specify the contract currency.');
  if (score >= 80) findings.push('Financial terms are clear and comprehensive.');
  return findings;
}

function _scoreDisputeResolution(text: string, profile: JurisdictionLegalProfile): number {
  let score = 30;
  if (/(تحكيم|arbitration|ICC|SIAC|DIAC|LCIA|ACICA|MCIA)/i.test(text)) score += 30;
  if (/(محكمة|court|jurisdiction|اختصاص قضائي)/i.test(text)) score += 20;
  if (new RegExp(profile.currencyCode, 'i').test(text) || new RegExp(profile.code, 'i').test(text)) score += 20;
  return Math.min(100, score);
}

function _scoreTerminationRights(text: string): number {
  let score = 30;
  if (/(إنهاء|terminate|termination|فسخ)/i.test(text)) score += 25;
  if (/(إشعار|notice|إخطار)/i.test(text)) score += 20;
  if (/(قوة قاهرة|force majeure)/i.test(text)) score += 15;
  if (/(تسوية|settlement|تصفية|liquidation)/i.test(text)) score += 10;
  return Math.min(100, score);
}

function _scoreShariaCompliance(text: string): number {
  let score = 40;
  if (/(AAOIFI|هيئة المحاسبة)/i.test(text)) score += 25;
  if (/(ضوابط شرعية|sharia governance|شريعة إسلامية|islamic sharia)/i.test(text)) score += 20;
  if (/(هيئة رقابة شرعية|sharia supervisory board)/i.test(text)) score += 15;
  return Math.min(100, score);
}

function _computeGrade(score: number): LegalValidationReport['grade'] {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function _gradeLabel(grade: string): string {
  const labels: Record<string, string> = {
    'A+': 'Excellent — Execution Ready',
    'A': 'Very Good — Minor Improvements Recommended',
    'B': 'Good — Moderate Improvements Required',
    'C': 'Fair — Significant Gaps Present',
    'D': 'Poor — Major Revisions Needed',
    'F': 'Fail — Not Suitable for Execution',
  };
  return labels[grade] || 'Unknown';
}
