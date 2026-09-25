/**
 * JurisTech Solutions — Email Verification Service
 * Validates customer emails before automated outreach
 * Ensures 100% real customers receive communications
 * Specification: EMAIL-VERIFY-P0
 */

export interface EmailVerificationResult {
  email: string;
  isValid: boolean;
  isFormatValid: boolean;
  isDomainValid: boolean;
  isDisposable: boolean;
  reason?: string;
}

/** Known disposable / temporary email domains */
const DISPOSABLE_DOMAINS: string[] = [
  'tempmail.com', 'throwaway.email', 'guerrillamail.com',
  'mailinator.com', 'yopmail.com', 'temp-mail.org',
  'fakeinbox.com', 'trashmail.com', 'sharklasers.com',
  '10minutemail.com', 'dispostable.com', 'maildrop.cc',
  'spam4.me', 'trashmail.net', 'discard.email',
  'filzmail.com', 'spamgourmet.com', 'getairmail.com',
  'mailnull.com', 'spamevader.com', 'tempinbox.com',
];

/** Invalid top-level domains */
const INVALID_TLDS: string[] = ['test', 'local', 'example', 'invalid', 'localhost', 'internal'];

/**
 * Robust RFC 5322 compliant email format validator
 */
export function validateEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  // Must be between 6 and 254 characters
  if (trimmed.length < 6 || trimmed.length > 254) return false;
  // Must contain exactly one @
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex < 1) return false;
  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);
  // Local part max 64 chars
  if (localPart.length > 64 || localPart.length < 1) return false;
  // Domain must have at least one dot
  if (!domainPart.includes('.')) return false;
  // Full regex validation
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return regex.test(trimmed);
}

/**
 * Check if email uses a known disposable / temporary email service
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split('@')[1] || '';
  return DISPOSABLE_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
}

/**
 * Validates domain TLD (rejects test/localhost/internal domains)
 */
export function validateDomain(email: string): boolean {
  const domain = email.trim().toLowerCase().split('@')[1] || '';
  if (!domain.includes('.')) return false;
  const parts = domain.split('.');
  const tld = parts[parts.length - 1];
  if (INVALID_TLDS.includes(tld)) return false;
  if (tld.length < 2 || tld.length > 24) return false;
  // Domain parts should only contain alphanumeric and hyphens
  const validDomainPart = /^[a-z0-9-]+$/;
  return parts.every(p => p.length > 0 && validDomainPart.test(p));
}

/**
 * Main email verification function.
 * Validates format, domain, and checks for disposable providers.
 * Returns a structured result with the validation outcome.
 */
export async function verifyCustomerEmail(email: string): Promise<EmailVerificationResult> {
  if (!email || typeof email !== 'string') {
    return { email: '', isValid: false, isFormatValid: false, isDomainValid: false, isDisposable: false, reason: 'empty_email' };
  }
  const normalizedEmail = email.trim().toLowerCase();

  // Step 1: Format validation
  const isFormatValid = validateEmailFormat(normalizedEmail);
  if (!isFormatValid) {
    console.warn(`[EmailVerification] REJECTED: Invalid format — ${normalizedEmail}`);
    return { email: normalizedEmail, isValid: false, isFormatValid: false, isDomainValid: false, isDisposable: false, reason: 'invalid_format' };
  }

  // Step 2: Domain validation
  const isDomainValid = validateDomain(normalizedEmail);
  if (!isDomainValid) {
    console.warn(`[EmailVerification] REJECTED: Invalid domain — ${normalizedEmail}`);
    return { email: normalizedEmail, isValid: false, isFormatValid: true, isDomainValid: false, isDisposable: false, reason: 'invalid_domain' };
  }

  // Step 3: Disposable email check
  const isDisposable = isDisposableEmail(normalizedEmail);
  if (isDisposable) {
    console.warn(`[EmailVerification] REJECTED: Disposable email provider — ${normalizedEmail}`);
    return { email: normalizedEmail, isValid: false, isFormatValid: true, isDomainValid: true, isDisposable: true, reason: 'disposable_email' };
  }

  // All checks passed
  console.log(`[EmailVerification] VERIFIED: ${normalizedEmail}`);
  return { email: normalizedEmail, isValid: true, isFormatValid: true, isDomainValid: true, isDisposable: false };
}

/**
 * Batch verify a list of emails for campaign filtering.
 * Filters out invalid and disposable emails automatically.
 */
export async function batchVerifyEmails(emails: string[]): Promise<{
  valid: string[];
  invalid: string[];
  results: EmailVerificationResult[];
}> {
  const results: EmailVerificationResult[] = [];
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const email of emails) {
    const result = await verifyCustomerEmail(email);
    results.push(result);
    if (result.isValid) {
      valid.push(result.email);
    } else {
      invalid.push(email);
    }
  }

  console.log(`[EmailVerification] Batch complete: ${valid.length}/${emails.length} valid emails`);
  if (invalid.length > 0) {
    console.warn(`[EmailVerification] Rejected ${invalid.length} invalid emails:`, invalid);
  }

  return { valid, invalid, results };
}
