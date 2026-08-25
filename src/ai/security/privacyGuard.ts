/**
 * src/ai/security/privacyGuard.ts
 * JurisTech Solutions — Privacy Guard
 * Specification: JURISTECH-AI-P0 Phase P0-5
 * Redacts PII from AI input/output. Filters logs.
 * Checked before sending to AI provider and after receiving response.
 */

import type { SanitizeResult } from '../types';

const PII_PATTERNS: Array<{ name: string; regex: RegExp; replacement: string }> = [
  { name: 'national_id_eg',    regex: /\b(\d{14})\b/g,                              replacement: '[REDACTED_ID]' },
  { name: 'national_id_ksa',   regex: /\b(1\d{9})\b/g,                             replacement: '[REDACTED_ID]' },
  { name: 'passport',          regex: /\b([A-Z]{1,2}\d{6,9})\b/g,                  replacement: '[REDACTED_PASSPORT]' },
  { name: 'phone_intl',        regex: /(\+?\d[\d\s\-().]{7,}\d)/g,                 replacement: '[REDACTED_PHONE]' },
  { name: 'email',             regex: /[\w.+-]+@[\w-]+\.[\w.]{2,}/gi,              replacement: '[REDACTED_EMAIL]' },
  { name: 'credit_card',       regex: /\b(\d{4}[\s\-]?){3}\d{4}\b/g,              replacement: '[REDACTED_CC]' },
  { name: 'iban',              regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{4,30}\b/g,         replacement: '[REDACTED_IBAN]' },
  { name: 'api_key',           regex: /(sk-|pk_live_|live_)[A-Za-z0-9_\-]{10,}/g, replacement: '[REDACTED_KEY]' },
  { name: 'jwt_token',         regex: /eyJ[A-Za-z0-9_\-]+\.eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]*/g, replacement: '[REDACTED_TOKEN]' },
];

// Prompt injection & system override patterns to neutralize
const INJECTION_PATTERNS: Array<{ name: string; regex: RegExp; replacement: string }> = [
  { name: 'ignore_instructions', regex: /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi, replacement: '[BLOCKED_OVERRIDE_ATTEMPT]' },
  { name: 'reveal_system', regex: /reveal\s+(the\s+)?(system|hidden)\s+(instructions|prompt|keys)/gi, replacement: '[BLOCKED_INSPECTION_ATTEMPT]' },
  { name: 'privilege_escalation', regex: /(act\s+as|pretend\s+to\s+be)\s+(administrator|admin|root|master|superuser)/gi, replacement: '[BLOCKED_ROLE_ESCALATION]' },
  { name: 'disable_security', regex: /disable\s+(jurisdiction|security|validation|access)\s+(guard|checks|rules)/gi, replacement: '[BLOCKED_SECURITY_BYPASS]' },
];

// Terms that must NEVER appear in AI logs
const LOG_BLOCK_TERMS = [
  'password', 'passwd', 'secret', 'webhook_secret', 'hmac',
  'paddle_key', 'stripe_key', 'api_key', 'bearer ',
];

export function detectPromptInjection(text: string): { isInjection: boolean; riskPatterns: string[] } {
  const riskPatterns: string[] = [];
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.regex.test(text)) {
      riskPatterns.push(pattern.name);
      pattern.regex.lastIndex = 0; // reset regex state
    }
  }
  return {
    isInjection: riskPatterns.length > 0,
    riskPatterns,
  };
}

export function sanitizeInput(text: string): SanitizeResult {
  let sanitized = text;
  let redactedCount = 0;
  const patterns: string[] = [];

  // 1. Sanitize PII
  for (const pattern of PII_PATTERNS) {
    const before = sanitized;
    sanitized = sanitized.replace(pattern.regex, pattern.replacement);
    if (sanitized !== before) {
      redactedCount++;
      patterns.push(pattern.name);
    }
  }

  // 2. Neutralize Prompt Injection attempts
  for (const inj of INJECTION_PATTERNS) {
    const before = sanitized;
    sanitized = sanitized.replace(inj.regex, inj.replacement);
    if (sanitized !== before) {
      redactedCount++;
      patterns.push(`injection_${inj.name}`);
    }
  }

  return { sanitized, redactedCount, patterns };
}

export function sanitizeOutput(text: string): SanitizeResult {
  return sanitizeInput(text);
}

export function isLogSafe(text: string): boolean {
  const lower = text.toLowerCase();
  return !LOG_BLOCK_TERMS.some(term => lower.includes(term));
}

export function safeLog(label: string, data: unknown): void {
  try {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    if (isLogSafe(str)) {
      console.log(`[AI-P0][${label}]`, str.slice(0, 200));
    } else {
      console.log(`[AI-P0][${label}] <REDACTED FOR SECURITY>`);
    }
  } catch { /* ignore */ }
}
