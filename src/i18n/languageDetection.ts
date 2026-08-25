/**
 * src/i18n/languageDetection.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Strict 5-Tier Language Detection Engine
 * Specification: GLOBAL-I18N-P0 Section 4
 * 
 * Detection Hierarchy Priority:
 *   1. Explicit URL locale (/ar/..., /fr/..., etc.)
 *   2. User saved language preference ('juristech.locale' in localStorage)
 *   3. Authenticated user's profile language
 *   4. Browser language (navigator.language)
 *   5. English fallback ('en')
 */

import { SupportedLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './languageConfig';

export const STORAGE_LOCALE_KEY = 'juristech.locale';
export const LEGACY_STORAGE_LOCALE_KEY = 'locale';

/**
 * Normalizes any language string into one of the 7 supported codes.
 */
export function normalizeLanguageCode(lang?: string | null): SupportedLanguage {
  if (!lang) return DEFAULT_LANGUAGE;
  const clean = lang.toLowerCase().trim();

  if (clean === 'ar' || clean.startsWith('ar-') || clean.startsWith('ar_')) return 'ar';
  if (clean === 'fr' || clean.startsWith('fr-') || clean.startsWith('fr_')) return 'fr';
  if (clean === 'es' || clean.startsWith('es-') || clean.startsWith('es_')) return 'es';
  if (clean === 'de' || clean.startsWith('de-') || clean.startsWith('de_')) return 'de';
  if (clean === 'tr' || clean.startsWith('tr-') || clean.startsWith('tr_')) return 'tr';
  if (clean === 'zh' || clean.startsWith('zh-') || clean.startsWith('zh_')) return 'zh';
  if (clean === 'en' || clean.startsWith('en-') || clean.startsWith('en_')) return 'en';

  return DEFAULT_LANGUAGE;
}

/**
 * Extracts locale from the current URL pathname (Tier 1).
 * e.g., '/ar/pricing' -> 'ar', '/zh/dashboard' -> 'zh'
 */
export function getLocaleFromUrl(pathname?: string): SupportedLanguage | null {
  if (typeof window === 'undefined' && !pathname) return null;
  const path = pathname || window.location.pathname;
  const match = path.match(/^\/(en|ar|fr|es|de|tr|zh)(\/|$)/i);
  if (match && match[1]) {
    return normalizeLanguageCode(match[1]);
  }
  return null;
}

/**
 * Retrieves saved locale from localStorage (Tier 2).
 */
export function getSavedLocale(): SupportedLanguage | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_LOCALE_KEY) || localStorage.getItem(LEGACY_STORAGE_LOCALE_KEY);
    if (saved && saved in SUPPORTED_LANGUAGES) {
      return normalizeLanguageCode(saved);
    }
  } catch {
    // localStorage might be unavailable or restricted
  }
  return null;
}

/**
 * Extracts browser language (Tier 4).
 */
export function getBrowserLocale(): SupportedLanguage {
  if (typeof window === 'undefined' || !navigator) return DEFAULT_LANGUAGE;
  const browserLang = navigator.language || (navigator as any).userLanguage;
  return normalizeLanguageCode(browserLang);
}

/**
 * Saves the selected locale across all supported storage keys.
 */
export function persistLocalePreference(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_LOCALE_KEY, lang);
    localStorage.setItem(LEGACY_STORAGE_LOCALE_KEY, lang);
    localStorage.setItem('i18nextLng', lang);
  } catch (err) {
    console.warn('[LanguageDetection] Failed saving locale preference:', err);
  }
}

/**
 * Strict 5-Tier Language Detection Master Function
 */
export function detectInitialLanguage(userProfileLanguage?: string): SupportedLanguage {
  // 1. Explicit URL locale
  const urlLocale = getLocaleFromUrl();
  if (urlLocale) return urlLocale;

  // 2. User saved language preference
  const savedLocale = getSavedLocale();
  if (savedLocale) return savedLocale;

  // 3. Authenticated user's profile language
  if (userProfileLanguage) {
    const profileLocale = normalizeLanguageCode(userProfileLanguage);
    if (profileLocale) return profileLocale;
  }

  // 4. Browser language
  const browserLocale = getBrowserLocale();
  if (browserLocale) return browserLocale;

  // 5. English fallback
  return DEFAULT_LANGUAGE;
}
