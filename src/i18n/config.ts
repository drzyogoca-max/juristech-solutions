/**
 * src/i18n/config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Centralized i18next Core Configuration
 * Specification: GLOBAL-I18N-P0
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  I18N_NAMESPACES,
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
} from './languageConfig';
import { setDocumentLanguage } from './rtl';
import { detectInitialLanguage, persistLocalePreference } from './languageDetection';

// Import default English resources immediately for zero first-render blocking
import enCommon from '../locales/en/common.json';
import enNavigation from '../locales/en/navigation.json';
import enHome from '../locales/en/home.json';
import enAuth from '../locales/en/auth.json';
import enDashboard from '../locales/en/dashboard.json';
import enAi from '../locales/en/ai.json';
import enDocuments from '../locales/en/documents.json';
import enContracts from '../locales/en/contracts.json';
import enCompliance from '../locales/en/compliance.json';
import enEnterprise from '../locales/en/enterprise.json';
import enPricing from '../locales/en/pricing.json';
import enBilling from '../locales/en/billing.json';
import enSubscription from '../locales/en/subscription.json';
import enSecurity from '../locales/en/security.json';
import enDocumentation from '../locales/en/documentation.json';
import enContact from '../locales/en/contact.json';
import enErrors from '../locales/en/errors.json';
import enNotifications from '../locales/en/notifications.json';
import enLegal from '../locales/en/legal.json';
import enForms from '../locales/en/forms.json';
import enValidation from '../locales/en/validation.json';
import enAdmin from '../locales/en/admin.json';
import enAccessibility from '../locales/en/accessibility.json';

// Import Arabic resources
import arCommon from '../locales/ar/common.json';
import arNavigation from '../locales/ar/navigation.json';
import arHome from '../locales/ar/home.json';
import arAuth from '../locales/ar/auth.json';
import arDashboard from '../locales/ar/dashboard.json';
import arAi from '../locales/ar/ai.json';
import arDocuments from '../locales/ar/documents.json';
import arContracts from '../locales/ar/contracts.json';
import arCompliance from '../locales/ar/compliance.json';
import arEnterprise from '../locales/ar/enterprise.json';
import arPricing from '../locales/ar/pricing.json';
import arBilling from '../locales/ar/billing.json';
import arSubscription from '../locales/ar/subscription.json';
import arSecurity from '../locales/ar/security.json';
import arDocumentation from '../locales/ar/documentation.json';
import arContact from '../locales/ar/contact.json';
import arErrors from '../locales/ar/errors.json';
import arNotifications from '../locales/ar/notifications.json';
import arLegal from '../locales/ar/legal.json';
import arForms from '../locales/ar/forms.json';
import arValidation from '../locales/ar/validation.json';
import arAdmin from '../locales/ar/admin.json';
import arAccessibility from '../locales/ar/accessibility.json';

// Import French resources
import frCommon from '../locales/fr/common.json';
import frNavigation from '../locales/fr/navigation.json';
import frHome from '../locales/fr/home.json';
import frAuth from '../locales/fr/auth.json';
import frDashboard from '../locales/fr/dashboard.json';
import frAi from '../locales/fr/ai.json';
import frDocuments from '../locales/fr/documents.json';
import frContracts from '../locales/fr/contracts.json';
import frCompliance from '../locales/fr/compliance.json';
import frEnterprise from '../locales/fr/enterprise.json';
import frPricing from '../locales/fr/pricing.json';
import frBilling from '../locales/fr/billing.json';
import frSubscription from '../locales/fr/subscription.json';
import frSecurity from '../locales/fr/security.json';
import frDocumentation from '../locales/fr/documentation.json';
import frContact from '../locales/fr/contact.json';
import frErrors from '../locales/fr/errors.json';
import frNotifications from '../locales/fr/notifications.json';
import frLegal from '../locales/fr/legal.json';
import frForms from '../locales/fr/forms.json';
import frValidation from '../locales/fr/validation.json';
import frAdmin from '../locales/fr/admin.json';
import frAccessibility from '../locales/fr/accessibility.json';

// Import Spanish resources
import esCommon from '../locales/es/common.json';
import esNavigation from '../locales/es/navigation.json';
import esHome from '../locales/es/home.json';
import esAuth from '../locales/es/auth.json';
import esDashboard from '../locales/es/dashboard.json';
import esAi from '../locales/es/ai.json';
import esDocuments from '../locales/es/documents.json';
import esContracts from '../locales/es/contracts.json';
import esCompliance from '../locales/es/compliance.json';
import esEnterprise from '../locales/es/enterprise.json';
import esPricing from '../locales/es/pricing.json';
import esBilling from '../locales/es/billing.json';
import esSubscription from '../locales/es/subscription.json';
import esSecurity from '../locales/es/security.json';
import esDocumentation from '../locales/es/documentation.json';
import esContact from '../locales/es/contact.json';
import esErrors from '../locales/es/errors.json';
import esNotifications from '../locales/es/notifications.json';
import esLegal from '../locales/es/legal.json';
import esForms from '../locales/es/forms.json';
import esValidation from '../locales/es/validation.json';
import esAdmin from '../locales/es/admin.json';
import esAccessibility from '../locales/es/accessibility.json';

// Import German resources
import deCommon from '../locales/de/common.json';
import deNavigation from '../locales/de/navigation.json';
import deHome from '../locales/de/home.json';
import deAuth from '../locales/de/auth.json';
import deDashboard from '../locales/de/dashboard.json';
import deAi from '../locales/de/ai.json';
import deDocuments from '../locales/de/documents.json';
import deContracts from '../locales/de/contracts.json';
import deCompliance from '../locales/de/compliance.json';
import deEnterprise from '../locales/de/enterprise.json';
import dePricing from '../locales/de/pricing.json';
import deBilling from '../locales/de/billing.json';
import deSubscription from '../locales/de/subscription.json';
import deSecurity from '../locales/de/security.json';
import deDocumentation from '../locales/de/documentation.json';
import deContact from '../locales/de/contact.json';
import deErrors from '../locales/de/errors.json';
import deNotifications from '../locales/de/notifications.json';
import deLegal from '../locales/de/legal.json';
import deForms from '../locales/de/forms.json';
import deValidation from '../locales/de/validation.json';
import deAdmin from '../locales/de/admin.json';
import deAccessibility from '../locales/de/accessibility.json';

// Import Turkish resources
import trCommon from '../locales/tr/common.json';
import trNavigation from '../locales/tr/navigation.json';
import trHome from '../locales/tr/home.json';
import trAuth from '../locales/tr/auth.json';
import trDashboard from '../locales/tr/dashboard.json';
import trAi from '../locales/tr/ai.json';
import trDocuments from '../locales/tr/documents.json';
import trContracts from '../locales/tr/contracts.json';
import trCompliance from '../locales/tr/compliance.json';
import trEnterprise from '../locales/tr/enterprise.json';
import trPricing from '../locales/tr/pricing.json';
import trBilling from '../locales/tr/billing.json';
import trSubscription from '../locales/tr/subscription.json';
import trSecurity from '../locales/tr/security.json';
import trDocumentation from '../locales/tr/documentation.json';
import trContact from '../locales/tr/contact.json';
import trErrors from '../locales/tr/errors.json';
import trNotifications from '../locales/tr/notifications.json';
import trLegal from '../locales/tr/legal.json';
import trForms from '../locales/tr/forms.json';
import trValidation from '../locales/tr/validation.json';
import trAdmin from '../locales/tr/admin.json';
import trAccessibility from '../locales/tr/accessibility.json';

// Import Chinese resources
import zhCommon from '../locales/zh/common.json';
import zhNavigation from '../locales/zh/navigation.json';
import zhHome from '../locales/zh/home.json';
import zhAuth from '../locales/zh/auth.json';
import zhDashboard from '../locales/zh/dashboard.json';
import zhAi from '../locales/zh/ai.json';
import zhDocuments from '../locales/zh/documents.json';
import zhContracts from '../locales/zh/contracts.json';
import zhCompliance from '../locales/zh/compliance.json';
import zhEnterprise from '../locales/zh/enterprise.json';
import zhPricing from '../locales/zh/pricing.json';
import zhBilling from '../locales/zh/billing.json';
import zhSubscription from '../locales/zh/subscription.json';
import zhSecurity from '../locales/zh/security.json';
import zhDocumentation from '../locales/zh/documentation.json';
import zhContact from '../locales/zh/contact.json';
import zhErrors from '../locales/zh/errors.json';
import zhNotifications from '../locales/zh/notifications.json';
import zhLegal from '../locales/zh/legal.json';
import zhForms from '../locales/zh/forms.json';
import zhValidation from '../locales/zh/validation.json';
import zhAdmin from '../locales/zh/admin.json';
import zhAccessibility from '../locales/zh/accessibility.json';

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    home: enHome,
    auth: enAuth,
    dashboard: enDashboard,
    ai: enAi,
    documents: enDocuments,
    contracts: enContracts,
    compliance: enCompliance,
    enterprise: enEnterprise,
    pricing: enPricing,
    billing: enBilling,
    subscription: enSubscription,
    security: enSecurity,
    documentation: enDocumentation,
    contact: enContact,
    errors: enErrors,
    notifications: enNotifications,
    legal: enLegal,
    forms: enForms,
    validation: enValidation,
    admin: enAdmin,
    accessibility: enAccessibility,
  },
  ar: {
    common: arCommon,
    navigation: arNavigation,
    home: arHome,
    auth: arAuth,
    dashboard: arDashboard,
    ai: arAi,
    documents: arDocuments,
    contracts: arContracts,
    compliance: arCompliance,
    enterprise: arEnterprise,
    pricing: arPricing,
    billing: arBilling,
    subscription: arSubscription,
    security: arSecurity,
    documentation: arDocumentation,
    contact: arContact,
    errors: arErrors,
    notifications: arNotifications,
    legal: arLegal,
    forms: arForms,
    validation: arValidation,
    admin: arAdmin,
    accessibility: arAccessibility,
  },
  fr: {
    common: frCommon,
    navigation: frNavigation,
    home: frHome,
    auth: frAuth,
    dashboard: frDashboard,
    ai: frAi,
    documents: frDocuments,
    contracts: frContracts,
    compliance: frCompliance,
    enterprise: frEnterprise,
    pricing: frPricing,
    billing: frBilling,
    subscription: frSubscription,
    security: frSecurity,
    documentation: frDocumentation,
    contact: frContact,
    errors: frErrors,
    notifications: frNotifications,
    legal: frLegal,
    forms: frForms,
    validation: frValidation,
    admin: frAdmin,
    accessibility: frAccessibility,
  },
  es: {
    common: esCommon,
    navigation: esNavigation,
    home: esHome,
    auth: esAuth,
    dashboard: esDashboard,
    ai: esAi,
    documents: esDocuments,
    contracts: esContracts,
    compliance: esCompliance,
    enterprise: esEnterprise,
    pricing: esPricing,
    billing: esBilling,
    subscription: esSubscription,
    security: esSecurity,
    documentation: esDocumentation,
    contact: esContact,
    errors: esErrors,
    notifications: esNotifications,
    legal: esLegal,
    forms: esForms,
    validation: esValidation,
    admin: esAdmin,
    accessibility: esAccessibility,
  },
  de: {
    common: deCommon,
    navigation: deNavigation,
    home: deHome,
    auth: deAuth,
    dashboard: deDashboard,
    ai: deAi,
    documents: deDocuments,
    contracts: deContracts,
    compliance: deCompliance,
    enterprise: deEnterprise,
    pricing: dePricing,
    billing: deBilling,
    subscription: deSubscription,
    security: deSecurity,
    documentation: deDocumentation,
    contact: deContact,
    errors: deErrors,
    notifications: deNotifications,
    legal: deLegal,
    forms: deForms,
    validation: deValidation,
    admin: deAdmin,
    accessibility: deAccessibility,
  },
  tr: {
    common: trCommon,
    navigation: trNavigation,
    home: trHome,
    auth: trAuth,
    dashboard: trDashboard,
    ai: trAi,
    documents: trDocuments,
    contracts: trContracts,
    compliance: trCompliance,
    enterprise: trEnterprise,
    pricing: trPricing,
    billing: trBilling,
    subscription: trSubscription,
    security: trSecurity,
    documentation: trDocumentation,
    contact: trContact,
    errors: trErrors,
    notifications: trNotifications,
    legal: trLegal,
    forms: trForms,
    validation: trValidation,
    admin: trAdmin,
    accessibility: trAccessibility,
  },
  zh: {
    common: zhCommon,
    navigation: zhNavigation,
    home: zhHome,
    auth: zhAuth,
    dashboard: zhDashboard,
    ai: zhAi,
    documents: zhDocuments,
    contracts: zhContracts,
    compliance: zhCompliance,
    enterprise: zhEnterprise,
    pricing: zhPricing,
    billing: zhBilling,
    subscription: zhSubscription,
    security: zhSecurity,
    documentation: zhDocumentation,
    contact: zhContact,
    errors: zhErrors,
    notifications: zhNotifications,
    legal: zhLegal,
    forms: zhForms,
    validation: zhValidation,
    admin: zhAdmin,
    accessibility: zhAccessibility,
  },
};

const initialLang = detectInitialLanguage();

// Initialize i18next instance
i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: 'common',
  ns: I18N_NAMESPACES as unknown as string[],
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Prevent SSR / Suspense blocking initial paint
  },
});

// Set initial document attributes
setDocumentLanguage(initialLang);

// Listen to language change events and synchronize HTML attributes and storage
i18n.on('languageChanged', (lng: string) => {
  const normalized = (lng in SUPPORTED_LANGUAGES ? lng : DEFAULT_LANGUAGE) as SupportedLanguage;
  setDocumentLanguage(normalized);
  persistLocalePreference(normalized);
});

export default i18n;
