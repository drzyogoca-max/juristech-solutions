/**
 * src/ai/security/piiSanitizer.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Legal PII & Confidential Data Sanitizer
 * Specification: JURISTECH-AI-P0 Phase P0-4
 *
 * Scans and redacts sensitive personally identifiable information (PII)
 * before sending queries to AI models. Supports automatic token replacement
 * and secure restoration.
 */

import type { SanitizeResult } from '../types';

export interface PiiTokenMapping {
  sanitizedText: string;
  replacements: Record<string, string>;
  patternsMatched: string[];
}

// Regex patterns for sensitive legal & personal identifiers
const PII_PATTERNS: Array<{ name: string; regex: RegExp; tokenPrefix: string }> = [
  // IBAN Numbers (SA, AE, EG, International)
  {
    name: 'IBAN',
    regex: /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}\b/g,
    tokenPrefix: '[REDACTED_IBAN_',
  },
  // Credit / Debit Card Numbers (Visa, MC, Amex, Mada 16 digits)
  {
    name: 'CREDIT_CARD',
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|(?:9682|5888|4557|5852)[0-9]{12})\b/g,
    tokenPrefix: '[REDACTED_CARD_',
  },
  // Saudi National ID & Iqama (10 digits starting with 1 or 2)
  {
    name: 'SAUDI_NATIONAL_ID',
    regex: /\b[12][0-9]{9}\b/g,
    tokenPrefix: '[REDACTED_NATIONAL_ID_',
  },
  // UAE Emirates ID (784-YYYY-XXXXXXX-X or continuous 15 digits)
  {
    name: 'EMIRATES_ID',
    regex: /\b784-?[0-9]{4}-?[0-9]{7}-?[0-9]\b/g,
    tokenPrefix: '[REDACTED_EMIRATES_ID_',
  },
  // Egyptian National ID (14 digits starting with 2 or 3)
  {
    name: 'EGYPT_NATIONAL_ID',
    regex: /\b[23][0-9]{13}\b/g,
    tokenPrefix: '[REDACTED_EGYPT_ID_',
  },
  // Email Addresses
  {
    name: 'EMAIL',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    tokenPrefix: '[REDACTED_EMAIL_',
  },
  // International / Regional Phone Numbers
  {
    name: 'PHONE',
    regex: /(?:\+|00)?(?:966|971|20|974|965|973|968|962|44|1)[0-9\s\-()]{7,14}\b/g,
    tokenPrefix: '[REDACTED_PHONE_',
  },
  // Passports (General 1-2 letters + 6-9 digits)
  {
    name: 'PASSPORT',
    regex: /\b[A-Z]{1,2}[0-9]{6,9}\b/g,
    tokenPrefix: '[REDACTED_PASSPORT_',
  },
];

/**
 * Redacts sensitive PII from query string, returning tokenized text and restoration map.
 */
export function sanitizeQueryWithMapping(input: string): PiiTokenMapping {
  let sanitized = input;
  const replacements: Record<string, string> = {};
  const patternsMatched: string[] = [];
  let tokenCounter = 1;

  for (const { name, regex, tokenPrefix } of PII_PATTERNS) {
    let matchedInPattern = false;
    sanitized = sanitized.replace(regex, (match) => {
      // Avoid redacting short words or common legal article references
      if (name === 'SAUDI_NATIONAL_ID' && match.length < 10) return match;
      if (name === 'PASSPORT' && /^(ART|LAW|SEC|NO|DEC|VOL|REG)/i.test(match)) return match;

      const token = `${tokenPrefix}${tokenCounter}]`;
      replacements[token] = match;
      tokenCounter++;
      matchedInPattern = true;
      return token;
    });

    if (matchedInPattern && !patternsMatched.includes(name)) {
      patternsMatched.push(name);
    }
  }

  return {
    sanitizedText: sanitized,
    replacements,
    patternsMatched,
  };
}

/**
 * Standard SanitizeResult interface adhering to JURISTECH-AI-P0
 */
export function sanitizeQuery(input: string): SanitizeResult {
  const { sanitizedText, replacements, patternsMatched } = sanitizeQueryWithMapping(input);
  return {
    sanitized: sanitizedText,
    redactedCount: Object.keys(replacements).length,
    patterns: patternsMatched,
  };
}

/**
 * Re-injects original redacted values back into an AI response if requested.
 */
export function restoreSanitized(text: string, replacements: Record<string, string>): string {
  let result = text;
  for (const [token, original] of Object.entries(replacements)) {
    result = result.split(token).join(original);
  }
  return result;
}
