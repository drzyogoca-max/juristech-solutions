/**
 * receiptOCR.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * OCR Engine for Payment Receipt Image Processing
 * Uses Tesseract.js (browser-native, no server required)
 * 
 * Extracts:
 *  • Transaction Reference Number
 *  • Payment Amount
 *  • Transaction Date
 *  • Raw OCR Text + Confidence Score
 */

import { createWorker } from 'tesseract.js';
import type { OcrExtractedData } from './receiptFraudDetection';

// ── OCR Worker Singleton ──────────────────────────────────────────────────────

let ocrWorker: Awaited<ReturnType<typeof createWorker>> | null = null;

async function getOcrWorker() {
  if (!ocrWorker) {
    ocrWorker = await createWorker(['ara', 'eng'], 1, {
      logger: () => {}, // Suppress verbose logging
    });
  }
  return ocrWorker;
}

export async function terminateOcrWorker() {
  if (ocrWorker) {
    await ocrWorker.terminate();
    ocrWorker = null;
  }
}

// ── Pattern Matchers ──────────────────────────────────────────────────────────

// Common receipt transaction reference patterns
const TRANSACTION_REF_PATTERNS = [
  /(?:transaction|transfer|ref(?:erence)?|رقم العملية|المرجع|رقم الحوالة|رقم التحويل)[:\s#]*([A-Za-z0-9\-_]{6,30})/i,
  /(?:TXN|TRN|REF|OP)[:\s#-]*([A-Za-z0-9]{6,20})/i,
  /\b([A-Z]{2,4}[0-9]{8,16})\b/,
  /\b([0-9]{10,20})\b/,
];

// Amount patterns (supports Arabic & Western numerals, AED, USD, SAR, EUR, etc.)
const AMOUNT_PATTERNS = [
  /(?:amount|total|مبلغ|المبلغ|الإجمالي|قيمة)[:\s]*(?:AED|USD|SAR|EUR|KWD|QAR|BHD|OMR|EGP)?\s*([0-9,،.]+)/i,
  /(?:AED|USD|SAR|EUR|KWD|QAR)\s*([0-9,،.]+)/i,
  /([0-9,،.]+)\s*(?:AED|USD|SAR|EUR|KWD|درهم|ريال|دولار)/i,
  /(?:paid|دفع|تم|مبلغ محول)[:\s]*([0-9,،.]+)/i,
];

// Date patterns
const DATE_PATTERNS = [
  /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/,
  /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/,
  /(\d{1,2})\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{2,4})/i,
  /(?:يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)\s+(\d{1,2})[,،\s]+(\d{4})/i,
];

// ── Data Extraction Helpers ───────────────────────────────────────────────────

function extractTransactionRef(text: string): string | null {
  for (const pattern of TRANSACTION_REF_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const ref = (match[1] || match[0]).trim().replace(/\s/g, '');
      if (ref.length >= 6) return ref.toUpperCase();
    }
  }
  return null;
}

function extractAmount(text: string): number | null {
  // Normalize Arabic-Indic numerals to Western
  const normalized = text
    .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/،/g, ',');

  for (const pattern of AMOUNT_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      const raw = (match[1] || match[0]).replace(/,/g, '').trim();
      const num = parseFloat(raw);
      if (!isNaN(num) && num > 0 && num < 1_000_000) return num;
    }
  }
  return null;
}

function extractDate(text: string): string | null {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      try {
        const raw = match[0];
        const parsed = new Date(raw);
        if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 2000) {
          return parsed.toISOString().split('T')[0];
        }
      } catch {
        // Skip invalid dates
      }
    }
  }
  return null;
}

// ── Main OCR Function ─────────────────────────────────────────────────────────

export async function extractReceiptData(
  imageFile: File,
  onProgress?: (progress: number, status: string) => void
): Promise<OcrExtractedData> {
  try {
    onProgress?.(5, 'Initializing OCR engine...');

    const worker = await getOcrWorker();

    onProgress?.(20, 'Loading image...');

    const imageUrl = URL.createObjectURL(imageFile);

    onProgress?.(40, 'Running OCR scan...');

    const { data } = await worker.recognize(imageUrl);

    URL.revokeObjectURL(imageUrl);

    onProgress?.(80, 'Extracting data fields...');

    const rawText = data.text || '';
    const confidence = Math.round(data.confidence || 0);

    const transactionRef = extractTransactionRef(rawText);
    const amount = extractAmount(rawText);
    const date = extractDate(rawText);

    onProgress?.(100, 'OCR complete');

    return { transactionRef, amount, date, rawText, confidence };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      transactionRef: null,
      amount: null,
      date: null,
      rawText: '',
      confidence: 0,
    };
  }
}

// ── Image Quality Pre-check ───────────────────────────────────────────────────

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE_MB = 10;
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Use JPEG, PNG, WebP, or TIFF.' };
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File too large. Max size is ${MAX_SIZE_MB}MB.` };
  }
  return { valid: true };
}
