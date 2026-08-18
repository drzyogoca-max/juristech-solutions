/**
 * receiptFraudDetection.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Fraud Detection & Anti-Duplication Engine for Payment Receipts
 * 
 * Features:
 *  • Image fingerprint (SHA-256 hash) for duplicate image detection
 *  • Transaction reference duplicate check against Supabase
 *  • Fraud scoring (0–100): amount mismatch, stale date, suspicious patterns
 *  • Auto-approve (score ≥ 80) or flag for admin review (score < 80)
 */

import { supabase } from './supabaseClient';

// ── Types ─────────────────────────────────────────────────────────────────────

export type VerificationStatus = 'pending' | 'verified' | 'flagged' | 'rejected';

export interface ReceiptData {
  userId?: string | null;
  transactionRef: string;      // Claimed by user
  claimedAmount: number;       // Amount user says they paid
  claimedDate: string;         // Date user says payment was made (ISO)
  imageFile: File;
  planId: string;
  planName: string;
}

export interface FraudCheckResult {
  status: VerificationStatus;
  fraudScore: number;           // 0–100 (100 = clean)
  imageHash: string;
  flags: string[];
  autoActivate: boolean;
  reviewReason?: string;
  receiptId?: string;
}

export interface OcrExtractedData {
  transactionRef: string | null;
  amount: number | null;
  date: string | null;
  rawText: string;
  confidence: number;           // 0–100
}

// ── Image Hashing (SHA-256 fingerprint) ──────────────────────────────────────

export async function computeImageHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Duplicate Detection ───────────────────────────────────────────────────────

export async function checkDuplicateTransactionRef(
  transactionRef: string,
  currentUserId: string
): Promise<{ isDuplicate: boolean; existingUserId?: string }> {
  const { data, error } = await supabase
    .from('payment_receipts')
    .select('user_id')
    .eq('transaction_ref', transactionRef.trim().toUpperCase())
    .not('status', 'eq', 'rejected')
    .limit(1);

  if (error || !data || data.length === 0) return { isDuplicate: false };
  const existingUserId = data[0].user_id;
  return {
    isDuplicate: existingUserId !== currentUserId,
    existingUserId,
  };
}

export async function checkDuplicateImageHash(
  imageHash: string,
  currentUserId: string
): Promise<{ isDuplicate: boolean }> {
  const { data, error } = await supabase
    .from('payment_receipts')
    .select('user_id')
    .eq('image_hash', imageHash)
    .not('status', 'eq', 'rejected')
    .limit(1);

  if (error || !data || data.length === 0) return { isDuplicate: false };
  return { isDuplicate: data[0].user_id !== currentUserId };
}

// ── Fraud Scoring Engine ──────────────────────────────────────────────────────

function calcFraudScore(params: {
  refDuplicate: boolean;
  imageDuplicate: boolean;
  amountMatch: boolean | null;
  dateValid: boolean;
  ocrConfidence: number;
  transactionRefFormat: boolean;
}): { score: number; flags: string[] } {
  let score = 100;
  const flags: string[] = [];

  if (params.refDuplicate) {
    score -= 80;
    flags.push('DUPLICATE_TRANSACTION_REF');
  }
  if (params.imageDuplicate) {
    score -= 80;
    flags.push('DUPLICATE_IMAGE_FINGERPRINT');
  }
  if (params.amountMatch === false) {
    score -= 30;
    flags.push('AMOUNT_MISMATCH');
  }
  if (!params.dateValid) {
    score -= 20;
    flags.push('STALE_OR_INVALID_DATE');
  }
  if (params.ocrConfidence < 40) {
    score -= 15;
    flags.push('LOW_OCR_CONFIDENCE');
  }
  if (!params.transactionRefFormat) {
    score -= 10;
    flags.push('INVALID_TRANSACTION_REF_FORMAT');
  }

  return { score: Math.max(0, score), flags };
}

// ── Main Fraud Check ──────────────────────────────────────────────────────────

export async function runFraudCheck(
  receiptData: ReceiptData,
  ocrData: OcrExtractedData
): Promise<FraudCheckResult> {
  const imageHash = await computeImageHash(receiptData.imageFile);

  // Parallel duplicate checks
  const [refCheck, imgCheck] = await Promise.all([
    checkDuplicateTransactionRef(receiptData.transactionRef, receiptData.userId),
    checkDuplicateImageHash(imageHash, receiptData.userId),
  ]);

  // Amount match check (within 2% tolerance)
  let amountMatch: boolean | null = null;
  if (ocrData.amount !== null) {
    const tolerance = receiptData.claimedAmount * 0.02;
    amountMatch =
      Math.abs(ocrData.amount - receiptData.claimedAmount) <= tolerance;
  }

  // Date validity check (within last 14 days)
  let dateValid = true;
  if (ocrData.date) {
    const receiptDate = new Date(ocrData.date);
    const now = new Date();
    const diffDays = (now.getTime() - receiptDate.getTime()) / (1000 * 60 * 60 * 24);
    dateValid = diffDays >= 0 && diffDays <= 14;
  }

  // Transaction ref format check (alphanumeric, 6–30 chars)
  const transactionRefFormat = /^[A-Za-z0-9\-_]{6,30}$/.test(
    receiptData.transactionRef.trim()
  );

  const { score, flags } = calcFraudScore({
    refDuplicate: refCheck.isDuplicate,
    imageDuplicate: imgCheck.isDuplicate,
    amountMatch,
    dateValid,
    ocrConfidence: ocrData.confidence,
    transactionRefFormat,
  });

  const autoActivate = score >= 75 && !refCheck.isDuplicate && !imgCheck.isDuplicate;
  const status: VerificationStatus = refCheck.isDuplicate || imgCheck.isDuplicate
    ? 'rejected'
    : score >= 75
    ? 'verified'
    : 'flagged';

  // Persist receipt record
  const { data: insertData } = await supabase.from('payment_receipts').insert({
    user_id: receiptData.userId,
    transaction_ref: receiptData.transactionRef.trim().toUpperCase(),
    claimed_amount: receiptData.claimedAmount,
    claimed_date: receiptData.claimedDate,
    image_hash: imageHash,
    plan_id: receiptData.planId,
    plan_name: receiptData.planName,
    ocr_ref: ocrData.transactionRef,
    ocr_amount: ocrData.amount,
    ocr_date: ocrData.date,
    ocr_confidence: ocrData.confidence,
    ocr_raw_text: ocrData.rawText?.substring(0, 500),
    fraud_score: score,
    fraud_flags: flags,
    status,
    auto_activated: autoActivate,
  }).select('id').single();

  // If flagged → add to admin review queue
  if (status === 'flagged') {
    await supabase.from('admin_review_queue').insert({
      receipt_id: insertData?.id,
      user_id: receiptData.userId,
      reason: flags.join(', '),
      fraud_score: score,
      status: 'pending_review',
    });
  }

  return {
    status,
    fraudScore: score,
    imageHash,
    flags,
    autoActivate,
    reviewReason: flags.length > 0 ? flags.join(' | ') : undefined,
    receiptId: insertData?.id,
  };
}
