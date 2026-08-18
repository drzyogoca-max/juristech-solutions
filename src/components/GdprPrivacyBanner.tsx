import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, CheckCircle2, X, Cookie, ChevronRight } from 'lucide-react';
import { detectVisitorJurisdiction, JurisdictionInfo } from '../lib/jurisdiction';

export default function GdprPrivacyBanner() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [visible, setVisible] = useState(false);
  const [jurisdiction, setJurisdiction] = useState<JurisdictionInfo | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('juristech_gdpr_consent');
    if (!consent) {
      setVisible(true);
    }
    detectVisitorJurisdiction().then(setJurisdiction);
  }, []);

  function handleAccept() {
    localStorage.setItem('juristech_gdpr_consent', JSON.stringify({ status: 'accepted', timestamp: new Date().toISOString() }));
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem('juristech_gdpr_consent', JSON.stringify({ status: 'essential_only', timestamp: new Date().toISOString() }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label={isRtl ? 'إشعار الخصوصية والكوكيز' : 'Privacy & Cookie Consent'}
      className="fixed bottom-0 inset-x-0 z-[60] animate-in slide-in-from-bottom duration-300 font-sans shadow-2xl"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-slate-900/98 border-t border-cyan-500/40 px-4 py-3.5 sm:px-6 sm:py-4 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0 hidden sm:block">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {isRtl ? 'الخصوصية والامتثال القانوني' : 'Privacy & Compliance'}
                </span>
                <span className="text-xs font-bold text-slate-100">
                  {isRtl ? 'إشعار حماية البيانات والأنظمة النافذة' : 'Data Protection Notice'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isRtl
                  ? `تلتزم منصة JurisTech Solutions بالمعايير التشريعية لحماية البيانات والأنظمة المعمول بها في ${jurisdiction?.countryNameAr || 'المملكة الأردنية الهاشمية'}. مخرجات الذكاء الاصطناعي هي استشارات تقنية استرشادية.`
                  : `JurisTech Solutions adheres to statutory data privacy frameworks in ${jurisdiction?.countryName || 'Jordan'}. AI outputs provide informational and drafting assistance.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={handleDecline}
              aria-label={isRtl ? 'الموافقة على الملفات الأساسية فقط' : 'Essential cookies only'}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors border border-slate-700"
            >
              {isRtl ? 'الأساسية فقط' : 'Essential Only'}
            </button>

            <button
              onClick={handleAccept}
              aria-label={isRtl ? 'الموافقة والمتابعة' : 'Accept and proceed'}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 font-bold text-slate-950 text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRtl ? 'موافق ومتابعة' : 'Accept & Proceed'}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
