/**
 * src/i18n/rtl.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Centralized RTL / LTR & Document Language Manager
 * Specification: GLOBAL-I18N-P0
 */

import { SupportedLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './languageConfig';

/**
 * Checks if a given language code requires Right-to-Left (RTL) text direction.
 * In JurisTech Global-I18N-P0: Arabic ('ar') is RTL, all others are LTR.
 */
export function isRtlLanguage(lang?: string): boolean {
  if (!lang) return false;
  const clean = lang.toLowerCase().trim();
  return clean === 'ar' || clean.startsWith('ar-');
}

/**
 * Updates document.documentElement.lang and document.documentElement.dir
 * in a single, centralized and unified place.
 */
export function setDocumentLanguage(locale: string): void {
  if (typeof document === 'undefined') return;

  const validLang = (locale in SUPPORTED_LANGUAGES ? locale : DEFAULT_LANGUAGE) as SupportedLanguage;
  const meta = SUPPORTED_LANGUAGES[validLang] || SUPPORTED_LANGUAGES.en;

  const isRtl = meta.dir === 'rtl';

  // 1. Update <html> tag attributes
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.dir;

  // 2. Synchronize <body> tag attributes
  if (document.body) {
    document.body.lang = meta.htmlLang;
    document.body.dir = meta.dir;

    if (isRtl) {
      document.body.classList.add('rtl-layout');
      document.body.classList.remove('ltr-layout');
    } else {
      document.body.classList.add('ltr-layout');
      document.body.classList.remove('rtl-layout');
    }
  }

  // 3. Dispatch global synchronization event for reactive components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('juristech_lang_change', {
        detail: { lang: validLang, isRtl, meta },
      })
    );
  }
}

/**
 * Helper to get directional CSS class
 */
export function getDirectionClass(lang?: string): 'rtl' | 'ltr' {
  return isRtlLanguage(lang) ? 'rtl' : 'ltr';
}
