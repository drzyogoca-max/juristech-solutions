import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../messages/en.json';
import ar from '../messages/ar.json';
import fr from '../messages/fr.json';
import es from '../messages/es.json';
import de from '../messages/de.json';
import zh from '../messages/zh.json';
import tr from '../messages/tr.json';

const savedLocale = localStorage.getItem('locale') || 'en';

i18n.use(initReactI18next).init({
  resources: { en, ar, fr, es, de, zh, tr },
  lng: savedLocale,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Update document language and text direction dynamically on language change
function applyDocumentDirection(lang: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}

applyDocumentDirection(savedLocale);

i18n.on('languageChanged', (lng) => {
  applyDocumentDirection(lng);
  localStorage.setItem('locale', lng);
});

export default i18n;
