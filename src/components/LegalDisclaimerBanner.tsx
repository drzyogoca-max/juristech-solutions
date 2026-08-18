import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldAlert, ExternalLink } from 'lucide-react';

export default function LegalDisclaimerBanner() {
  const { i18n } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(false);
  const isRtl = i18n.language === 'ar';

  if (isDismissed) return null;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="bg-amber-500/10 dark:bg-slate-900/90 border-y border-amber-500/30 px-4 py-2.5 shadow-md flex items-center justify-between gap-4 text-xs min-h-[40px] contain-layout"
    >

      <div className="flex items-center gap-2.5 max-w-7xl mx-auto flex-1 flex-wrap">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-slate-800 dark:text-slate-200 font-semibold leading-normal">
          {isRtl ? (
            <>
              يوفر نظام <strong><bdi>JurisTech AI</bdi></strong> معلومات وإرشادات قانونية تقنية استرشادية، ولا يُعد بديلاً عن استشارة محامٍ مرخص.{' '}
            </>
          ) : (
            <>
              <strong><bdi>JurisTech AI</bdi></strong> provides statutory analysis and workflow automation, not direct legal advice. Consult licensed counsel for formal execution.{' '}
            </>
          )}
          <Link
            to="/legal-compliance"
            className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-300 font-extrabold underline underline-offset-2 transition-colors ml-1"
          >
            <span>{isRtl ? 'قراءة مركز الامتثال والاستقلالية القانونية' : 'Read Legal Compliance'}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </p>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        aria-label={isRtl ? 'إغلاق شريط الإشعار القانوني' : 'Close legal disclaimer banner'}
        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-[10px] font-bold uppercase tracking-wider shrink-0 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 transition-colors"
      >
        {isRtl ? 'إغلاق' : 'Close'}
      </button>
    </div>
  );
}
