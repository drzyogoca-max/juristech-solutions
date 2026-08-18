import { useState, useEffect } from 'react';
import { trackVisitorRadar } from '../services/radarTracker';
import { detectVisitorJurisdiction, JurisdictionInfo } from '../lib/jurisdiction';
import i18n from '../i18n';

export interface AdaptiveConfig {
  country: string;
  headline: string;
  primaryActionText: string;
  complianceNotice: string;
  featuredCategory: string;
  isGCC: boolean;
  heroHeadlineAr: string;
  heroHeadlineEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  governingFrameworkAr: string;
  governingFrameworkEn: string;
}

export function useAdaptiveUI() {
  const [jurisdiction, setJurisdiction] = useState<JurisdictionInfo | null>(null);
  const [adaptiveConfig, setAdaptiveConfig] = useState<AdaptiveConfig>({
    country: 'GLOBAL',
    headline: 'المنصة الذكية الشاملة لتدقيق العقود وحماية المعاملات القانونية',
    primaryActionText: 'تحليل العقد فوراً بالذكاء الاصطناعي',
    complianceNotice: 'متوافق مع الأنظمة واللوائح القانونية الدولية',
    featuredCategory: 'Corporate & Commercial',
    isGCC: false,
    heroHeadlineAr: 'المنصة السيادية الذكية لتحليل وصياغة العقود والحلول القانونية',
    heroHeadlineEn: 'Autonomous Enterprise AI Legal Protection & Multi-Jurisdictional Contract Analysis',
    heroSubtitleAr: 'صياغة العقود التفاعلية، فحص المخاطر والامتثال التشريعي المحلي، وبوابة التفاوض والتوقيع الإلكتروني المباشر',
    heroSubtitleEn: 'Automated jurisdiction-aware contract creation, compliance risk auditing, and live E-Signature negotiation portal',
    governingFrameworkAr: 'أحكام القانون المدني والتشريعات التجارية النافذة',
    governingFrameworkEn: 'Statutory Commercial & Civil Codes',
  });

  useEffect(() => {
    async function initRadarAdaptation() {
      try {
        const [data, jur] = await Promise.all([
          trackVisitorRadar({
            path: typeof window !== 'undefined' ? window.location.pathname : '/',
            dwellTimeSeconds: 5,
            interactionScore: 1,
          }),
          detectVisitorJurisdiction(),
        ]);

        setJurisdiction(jur);

        if (data && data.clientContext) {
          const country = data.clientContext.country || 'GLOBAL';
          const gccCountries = ['SA', 'AE', 'EG', 'QA', 'KW', 'JO', 'OM', 'BH', 'LY', 'IQ', 'LB', 'SY', 'PS'];
          const isGCC = gccCountries.includes(country);

          // Geo-Radar Auto-Language & RTL/LTR Sync if user has not explicitly locked locale
          const userHasExplicitLocale = localStorage.getItem('locale_explicit');
          if (!userHasExplicitLocale) {
            let suggestedLocale = 'en';

            if (['FR', 'MA', 'TN', 'DZ'].includes(country)) {
              suggestedLocale = 'fr';
            } else if (['DE', 'AT', 'CH'].includes(country)) {
              suggestedLocale = 'de';
            } else if (['ES', 'MX', 'AR', 'CO', 'CL', 'PE'].includes(country)) {
              suggestedLocale = 'es';
            } else if (['CN', 'TW', 'HK'].includes(country)) {
              suggestedLocale = 'zh';
            } else if (['TR'].includes(country)) {
              suggestedLocale = 'tr';
            } else if (gccCountries.includes(country)) {
              suggestedLocale = 'ar';
            }

            if (i18n.language !== suggestedLocale) {
              i18n.changeLanguage(suggestedLocale);
              document.documentElement.lang = suggestedLocale;
              document.documentElement.dir = suggestedLocale === 'ar' ? 'rtl' : 'ltr';
            }
          }

          setAdaptiveConfig({
            country,
            headline: isGCC
              ? 'المنصة السيادية الذكية لتحليل وصياغة العقود الاستثمارية وفق الأنظمة الخليجية والمصرية والدولية'
              : 'Enterprise AI Legal Protection & Multi-Jurisdictional Contract Analysis',
            primaryActionText: isGCC ? 'فحص وصياغة عقود الاستثمار والتأسيس' : 'Start High-Precision Legal Audit',
            complianceNotice: isGCC
              ? 'نظام معالجة مشفر ومتوافق مع تشريعات حماية البيانات الشخصية وقوانين الاستثمار (Law 131/1948 & GCC Regulations)'
              : 'Fully Compliant with International Data Governance, CISG 1980, & GDPR Standards',
            featuredCategory: isGCC ? 'عقود الشركاء والتأسيس والاستثمار' : 'Cross-Border SaaS & Corporate Agreements',
            isGCC,
            heroHeadlineAr: isGCC
              ? 'المنصة السيادية الذكية لتحليل وصياغة العقود الاستثمارية وفق الأنظمة العربية والدولية'
              : 'المنصة العالمية الذكية لتحليل وصياغة العقود والحلول القانونية',
            heroHeadlineEn: isGCC
              ? 'Premier Regional Sovereign AI Legal Intelligence & Contract Automation System'
              : 'Autonomous Enterprise AI Legal Protection & Multi-Jurisdictional Contract Analysis',
            heroSubtitleAr: isGCC
              ? 'مطابقة تامة لأحكام القانون المدني المصري رقم 131 لسنة 1948، أنظمة المعاملات المدنية بالشرق الأوسط، وتشريعات الاستثمار'
              : 'صياغة العقود التفاعلية، فحص المخاطر والامتثال التشريعي المحلي، وبوابة التفاوض والتوقيع الإلكتروني المباشر',
            heroSubtitleEn: isGCC
              ? 'Fully compliant with Egyptian Civil Code 131/1948, KSA Companies Law M/132, UAE Federal Statutes, & GCC Commercial Codes'
              : 'Automated jurisdiction-aware contract creation, compliance risk auditing, and live E-Signature negotiation portal',
            governingFrameworkAr: jur.legalFrameworkAr || 'أحكام القانون المدني والتشريعات التجارية النافذة',
            governingFrameworkEn: jur.legalFramework || 'Statutory Commercial & Civil Codes',
          });
        }
      } catch (e) {
        console.error('[ADAPTIVE HOOK ERROR] Radar client synchronization failed:', e);
      }
    }

    initRadarAdaptation();
  }, []);

  return { jurisdiction, adaptiveConfig, isGCC: adaptiveConfig.isGCC };
}
