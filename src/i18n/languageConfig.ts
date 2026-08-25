/**
 * src/i18n/languageConfig.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Official 7-Language Multilingual Platform Configuration
 * Specification: GLOBAL-I18N-P0
 */

export type SupportedLanguage = 'en' | 'ar' | 'fr' | 'es' | 'de' | 'tr' | 'zh';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  htmlLang: string;
  localeCode: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageMeta> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    htmlLang: 'en',
    localeCode: 'en-US',
    flag: '🇺🇸',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    htmlLang: 'ar',
    localeCode: 'ar-EG',
    flag: '🇸🇦',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    htmlLang: 'fr',
    localeCode: 'fr-FR',
    flag: '🇫🇷',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    htmlLang: 'es',
    localeCode: 'es-ES',
    flag: '🇪🇸',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    dir: 'ltr',
    htmlLang: 'de',
    localeCode: 'de-DE',
    flag: '🇩🇪',
  },
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    dir: 'ltr',
    htmlLang: 'tr',
    localeCode: 'tr-TR',
    flag: '🇹🇷',
  },
  zh: {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    dir: 'ltr',
    htmlLang: 'zh-CN',
    localeCode: 'zh-CN',
    flag: '🇨🇳',
  },
};

export const LANGUAGE_LIST: LanguageMeta[] = Object.values(SUPPORTED_LANGUAGES);

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

export const I18N_NAMESPACES = [
  'common',
  'navigation',
  'home',
  'auth',
  'dashboard',
  'ai',
  'documents',
  'contracts',
  'compliance',
  'enterprise',
  'pricing',
  'billing',
  'subscription',
  'security',
  'documentation',
  'contact',
  'errors',
  'notifications',
  'legal',
  'forms',
  'validation',
  'admin',
  'accessibility',
] as const;

export type I18nNamespace = typeof I18N_NAMESPACES[number];
