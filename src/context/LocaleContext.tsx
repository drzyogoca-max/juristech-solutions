import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import i18n from '../i18n/config';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
} from '../i18n/languageConfig';
import { setDocumentLanguage, isRtlLanguage } from '../i18n/rtl';
import {
  detectInitialLanguage,
  persistLocalePreference,
  normalizeLanguageCode,
  getLocaleFromUrl,
} from '../i18n/languageDetection';

export interface LocaleContextType {
  currentLocale: SupportedLanguage;
  isRtl: boolean;
  changeLocale: (locale: SupportedLanguage) => void;
  availableLanguages: typeof SUPPORTED_LANGUAGES;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState<SupportedLanguage>(() => {
    return detectInitialLanguage();
  });

  const isRtl = isRtlLanguage(currentLocale);

  const changeLocale = useCallback((targetLang: SupportedLanguage) => {
    const normalized = normalizeLanguageCode(targetLang);
    setCurrentLocale(normalized);

    // 1. Sync i18n
    if (i18n.language !== normalized) {
      i18n.changeLanguage(normalized);
    }

    // 2. Persist to storage
    persistLocalePreference(normalized);

    // 3. Update document direction & lang
    setDocumentLanguage(normalized);

    // 4. Dispatch custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('juristech_lang_change', {
          detail: { lang: normalized, isRtl: isRtlLanguage(normalized) },
        })
      );
    }
  }, []);

  // Listen to popstate or url changes to update locale if prefix exists
  useEffect(() => {
    const handleLocationChange = () => {
      const urlLocale = getLocaleFromUrl(window.location.pathname);
      if (urlLocale && urlLocale !== currentLocale) {
        changeLocale(urlLocale);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [currentLocale, changeLocale]);

  // Listen to juristech_lang_change from external triggers
  useEffect(() => {
    const handleCustomChange = (e: Event) => {
      const custom = e as CustomEvent<{ lang: string }>;
      if (custom.detail?.lang && custom.detail.lang !== currentLocale) {
        const norm = normalizeLanguageCode(custom.detail.lang);
        if (norm !== currentLocale) {
          setCurrentLocale(norm);
        }
      }
    };

    window.addEventListener('juristech_lang_change', handleCustomChange);
    return () => window.removeEventListener('juristech_lang_change', handleCustomChange);
  }, [currentLocale]);

  // Ensure document attributes match initial locale
  useEffect(() => {
    setDocumentLanguage(currentLocale);
  }, [currentLocale]);

  return (
    <LocaleContext.Provider
      value={{
        currentLocale,
        isRtl,
        changeLocale,
        availableLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    // Fallback if rendered outside LocaleProvider
    const fallbackLocale = normalizeLanguageCode(
      typeof window !== 'undefined'
        ? localStorage.getItem('juristech.locale') || i18n.language
        : 'en'
    );
    return {
      currentLocale: fallbackLocale,
      isRtl: isRtlLanguage(fallbackLocale),
      changeLocale: (l) => {
        i18n.changeLanguage(l);
        persistLocalePreference(l);
        setDocumentLanguage(l);
      },
      availableLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
