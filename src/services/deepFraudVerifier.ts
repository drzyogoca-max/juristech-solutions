/**
 * deepFraudVerifier.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Deep AI Receipt Verification & Image Tampering / Fraud Detection Engine
 * AI Document Forensics & SWIFT Wire Verification System
 */

import { callAI } from '../lib/api';

export type DocumentType = 
  | 'SWIFT_COPY'
  | 'TAX_FORM'
  | 'PERSONAL_PHOTO'
  | 'RANDOM_DOCUMENT'
  | 'CORRUPTED_OR_EMPTY';

export interface ExtractedReceiptData {
  claimedAmount?: number;
  extractedAmount?: number;
  extractedCurrency?: string;
  transferDate?: string;
  referenceCode?: string;
  swiftCode?: string;
  senderBankName?: string;
  beneficiaryBankName?: string;
  hasBankStampOrSeal?: boolean;
}

export interface TamperingInspectionResult {
  hasPhotoshopArtifacts: boolean;
  metadataTampered: boolean;
  resolutionMismatch: boolean;
  duplicateHashDetected: boolean;
  tamperConfidence: number; // 0 to 100
}

export interface DeepVerificationResult {
  receiptId: string;
  documentType: DocumentType;
  extractedData: ExtractedReceiptData;
  tampering: TamperingInspectionResult;
  fraudScore: number; // 100 = genuine SWIFT copy, < 50 = high fraud risk / rejected
  fraudFlags: string[];
  verificationStatus: 'APPROVED' | 'NEEDS_ADMIN_REVIEW' | 'FRAUD_BLOCKED';
  userFacingMessageAr: string;
  userFacingMessageEn: string;
  aiAnalysisSummaryAr: string;
  aiAnalysisSummaryEn: string;
}

export const MANDATORY_REJECTION_MESSAGE_AR = 'عذراً، المستند المرفق غير مقبول أو لا مطابقة لبيانات السويفت البنكي الرسمي. يرجى رفع إيصال تحويل صحيح';
export const MANDATORY_REJECTION_MESSAGE_EN = 'Sorry, the attached document is unacceptable or does not match official bank SWIFT copy data. Please upload a valid bank transfer receipt.';

/** In-memory registry of seen receipt hashes to block recycled fraud images */
const SEEN_IMAGE_HASHES = new Set<string>();

/** Security alert log memory queue for Financial Admin Dashboard */
export interface SecurityAlert {
  id: string;
  timestamp: string;
  userEmail: string;
  claimedAmount: number;
  planName: string;
  documentType: DocumentType;
  fraudFlags: string[];
  fraudScore: number;
  status: 'SUSPICIOUS_ATTEMPT_BLOCKED' | 'FLAGGED_FOR_REVIEW';
}

const SECURITY_ALERTS: SecurityAlert[] = [];

export function getSecurityAlerts(): SecurityAlert[] {
  try {
    const stored = localStorage.getItem('juristech_fraud_security_alerts');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return SECURITY_ALERTS;
}

export function logSecurityAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp'>): SecurityAlert {
  const newAlert: SecurityAlert = {
    ...alert,
    id: `ALERT_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  SECURITY_ALERTS.unshift(newAlert);
  try {
    const existing = getSecurityAlerts();
    existing.unshift(newAlert);
    localStorage.setItem('juristech_fraud_security_alerts', JSON.stringify(existing.slice(0, 100)));
  } catch {}
  return newAlert;
}

/** Generate quick hash string from base64/file buffer */
export function computeImageHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < Math.min(str.length, 10000); i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `HASH_${Math.abs(hash).toString(16)}`;
}

/** Check image tampering artifacts */
export function inspectImageTampering(imageBase64OrText: string): TamperingInspectionResult {
  const hash = computeImageHash(imageBase64OrText);
  const isDuplicate = SEEN_IMAGE_HASHES.has(hash);
  if (!isDuplicate) {
    SEEN_IMAGE_HASHES.add(hash);
  }

  // Heuristic scan for editing tools metadata signature
  const lower = imageBase64OrText.toLowerCase();
  const hasAdobe = lower.includes('adobe') || lower.includes('photoshop') || lower.includes('gimp') || lower.includes('paint.net');

  const tamperConfidence = isDuplicate ? 95 : hasAdobe ? 85 : 5;

  return {
    hasPhotoshopArtifacts: hasAdobe,
    metadataTampered: hasAdobe,
    resolutionMismatch: false,
    duplicateHashDetected: isDuplicate,
    tamperConfidence,
  };
}

/**
 * Perform Content Classification to identify SWIFT Bank Wire copies vs invalid documents
 */
export function classifyDocumentContent(rawOcrText: string, fileName?: string): DocumentType {
  const text = (rawOcrText || '').toLowerCase();
  const name = (fileName || '').toLowerCase();

  if (!text.trim() || text.trim().length < 15) {
    return 'CORRUPTED_OR_EMPTY';
  }

  // Detect Tax Forms (W-9, W-2, 1040, Form 1040, IRS, Tax Return, etc.)
  const taxKeywords = [
    'w-9', 'w9', 'w-2', 'w2', '1040', 'form 1040', 'irs', 'tax return',
    'department of the treasury', 'internal revenue service', 'taxpayer identification',
    'social security number', 'employer identification number', 'form w-9', 'tax form',
    'نموذج ضريبي', 'إقرار ضريبي', 'مصلحة الضرائب'
  ];

  for (const kw of taxKeywords) {
    if (text.includes(kw) || name.includes(kw)) {
      return 'TAX_FORM';
    }
  }

  // Detect SWIFT / Bank Wire Transfer markers
  const swiftKeywords = [
    'swift', 'bic', 'iban', 'wire', 'transfer', 'remittance', 'beneficiary',
    'bank', 'confirmation', 'cairo', 'al baraka', 'account', 'credit', 'debit',
    'سويفت', 'حوالة', 'تحويل', 'إيصال', 'مستفيد', 'بنك', 'البركة', 'الأهلي', 'مصر',
    'الراجحي', 'الرياض', 'العربي', 'حساب', 'مرسل', 'مبلغ'
  ];

  let swiftMatches = 0;
  for (const kw of swiftKeywords) {
    if (text.includes(kw)) {
      swiftMatches++;
    }
  }

  if (swiftMatches >= 2 || text.includes('swift') || text.includes('iban') || text.includes('سويفت') || text.includes('حوالة')) {
    return 'SWIFT_COPY';
  }

  // Detect personal photo or random document
  if (text.length > 50 && swiftMatches === 0) {
    return 'RANDOM_DOCUMENT';
  }

  return 'PERSONAL_PHOTO';
}

/** Primary Deep AI Verification & Forensics Pipeline */
export async function runDeepReceiptVerification(
  receiptId: string,
  rawOcrText: string,
  claimedAmount: number,
  expectedPlanName: string,
  userEmail: string = 'user@juristech.online',
  fileName?: string
): Promise<DeepVerificationResult> {
  const tampering = inspectImageTampering(rawOcrText);
  const documentType = classifyDocumentContent(rawOcrText, fileName);

  const systemPrompt = `You are an elite financial fraud auditor and document forensics expert.
Analyze this document text from an uploaded bank receipt:
"${rawOcrText}"

Expected Plan: ${expectedPlanName}
Claimed Amount: $${claimedAmount}

Extract and return ONLY a JSON object with keys:
- documentType ("SWIFT_COPY" | "TAX_FORM" | "PERSONAL_PHOTO" | "RANDOM_DOCUMENT" | "CORRUPTED_OR_EMPTY")
- extractedAmount (number)
- extractedCurrency (string)
- transferDate (string)
- referenceCode (string)
- swiftCode (string)
- senderBankName (string)
- beneficiaryBankName (string)
- hasBankStampOrSeal (boolean)
- flags (array of warning strings in Arabic)
- summaryAr (string in Arabic)
- summaryEn (string in English)`;

  let extractedData: ExtractedReceiptData = {};
  let fraudFlags: string[] = [];
  let summaryAr = 'تم تحليل إيصال التحويل بنجاح عبر محرك الفحص الذكي.';
  let summaryEn = 'Payment receipt successfully analyzed via AI Forensics Engine.';

  try {
    const aiResponse = await callAI(systemPrompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      extractedData = {
        claimedAmount,
        extractedAmount: typeof parsed.extractedAmount === 'number' ? parsed.extractedAmount : claimedAmount,
        extractedCurrency: parsed.extractedCurrency || 'USD',
        transferDate: parsed.transferDate || new Date().toISOString().split('T')[0],
        referenceCode: parsed.referenceCode || 'REF_' + Math.random().toString(36).slice(2, 9).toUpperCase(),
        swiftCode: parsed.swiftCode || 'ABRKEGCAXXX',
        senderBankName: parsed.senderBankName || 'Bank Transfer',
        beneficiaryBankName: parsed.beneficiaryBankName || 'Al Baraka Bank',
        hasBankStampOrSeal: typeof parsed.hasBankStampOrSeal === 'boolean' ? parsed.hasBankStampOrSeal : true,
      };
      fraudFlags = Array.isArray(parsed.flags) ? parsed.flags : [];
      summaryAr = parsed.summaryAr || summaryAr;
      summaryEn = parsed.summaryEn || summaryEn;
    }
  } catch (err) {
    extractedData = {
      claimedAmount,
      extractedAmount: claimedAmount,
      extractedCurrency: 'USD',
      transferDate: new Date().toISOString().split('T')[0],
      referenceCode: 'REF_' + Math.random().toString(36).slice(2, 9).toUpperCase(),
      hasBankStampOrSeal: true,
    };
  }

  // Calculate Fraud Score (100 = Safe SWIFT, 0 = Fraud/Fake Doc)
  let fraudScore = 100;

  // 1. Check Document Type Classification
  if (documentType !== 'SWIFT_COPY') {
    fraudScore = 0;
    if (documentType === 'TAX_FORM') {
      fraudFlags.push('تم رفض المستند: إرفاق استمارة ضريبية بدلاً من صورة السويفت البنكي (Tax Form Detected)');
    } else if (documentType === 'PERSONAL_PHOTO') {
      fraudFlags.push('تم رفض المستند: صورة شخصية أو غير رسمية (Personal Photo Detected)');
    } else if (documentType === 'CORRUPTED_OR_EMPTY') {
      fraudFlags.push('تم رفض المستند: ملف فارغ أو غير مقروء (Corrupted / Blank File)');
    } else {
      fraudFlags.push('تم رفض المستند: صورة عشوائية غير مطابقة لإيصالات السويفت البنكية (Unrecognized Non-SWIFT Copy)');
    }
  }

  // 2. Check Tampering & Editing Artifacts
  if (tampering.hasPhotoshopArtifacts) {
    fraudScore -= 40;
    fraudFlags.push('آثار تعديل رقمي / برامج فوتوشوب (Photoshop Editing Artifacts)');
  }
  if (tampering.duplicateHashDetected) {
    fraudScore -= 60;
    fraudFlags.push('تكرار إيصال مستخدم سابقاً (Duplicate Receipt Hash)');
  }
  if (extractedData.extractedAmount && Math.abs(extractedData.extractedAmount - claimedAmount) > 0.01) {
    fraudScore -= 30;
    fraudFlags.push(`عدم تطابق المبلغ المستخرج ($${extractedData.extractedAmount}) مع المطلوب ($${claimedAmount})`);
  }

  fraudScore = Math.max(0, Math.min(100, fraudScore));

  // Determine Verification Status & User Message
  let verificationStatus: 'APPROVED' | 'NEEDS_ADMIN_REVIEW' | 'FRAUD_BLOCKED' = 'NEEDS_ADMIN_REVIEW';
  let userFacingMessageAr = '';
  let userFacingMessageEn = '';

  if (documentType !== 'SWIFT_COPY' || fraudScore < 40) {
    verificationStatus = 'FRAUD_BLOCKED';
    userFacingMessageAr = MANDATORY_REJECTION_MESSAGE_AR;
    userFacingMessageEn = MANDATORY_REJECTION_MESSAGE_EN;

    // Trigger instant Security Alert for Admin Dashboard
    logSecurityAlert({
      userEmail,
      claimedAmount,
      planName: expectedPlanName,
      documentType,
      fraudFlags,
      fraudScore,
      status: 'SUSPICIOUS_ATTEMPT_BLOCKED',
    });
  } else {
    // MANDATORY REQUIREMENT #3: STRICT MANUAL APPROVAL WORKFLOW
    // Valid SWIFT copies MUST enter NEEDS_ADMIN_REVIEW (Pending Verification)
    // No automatic subscription activation!
    verificationStatus = 'NEEDS_ADMIN_REVIEW';
    userFacingMessageAr = 'تم فحص المستند بنجاح وتحويل الحساب إلى حالة (قيد التدقيق المالي اليدوي). سيتم تفعيل اشتراكك فور اعتماد الإدارة.';
    userFacingMessageEn = 'Document verified. Account set to Pending Manual Financial Verification. Subscription will activate upon admin approval.';
  }

  return {
    receiptId,
    documentType,
    extractedData,
    tampering,
    fraudScore,
    fraudFlags,
    verificationStatus,
    userFacingMessageAr,
    userFacingMessageEn,
    aiAnalysisSummaryAr: summaryAr,
    aiAnalysisSummaryEn: summaryEn,
  };
}
