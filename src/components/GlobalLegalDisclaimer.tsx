import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';
import { SupportedLanguage } from '../services/engine-ai/languageDetector';

const DISCLAIMER_TEXTS: Record<SupportedLanguage, string> = {
  ar: 'JurisTech أداة ذكاء اصطناعي مساعدة، ومخرجاتها ليست استشارة قانونية ولا تغني عن مراجعة محامٍ مرخّص في الدولة المعنية.',
  en: 'JurisTech is an AI-powered legal assistant. Outputs do not constitute formal legal advice and do not substitute for review by a licensed attorney in the relevant jurisdiction.',
  fr: "JurisTech est un outil d'assistance juridique par IA. Ses résultats ne constituent pas un conseil juridique et ne remplacent pas la consultation d'un avocat agréé dans la juridiction concernée.",
  de: 'JurisTech ist ein KI-gestütztes juristisches Assistenztool. Die Ausgaben stellen keine Rechtsberatung dar und ersetzen nicht die Prüfung durch einen zugelassenen Anwalt in der jeweiligen Rechtsordnung.',
  es: 'JurisTech es una herramienta de asistencia legal con IA. Sus resultados no constituyen asesoramiento jurídico formal ni sustituyen la revisión de un abogado habilitado en la jurisdicción correspondiente.',
  zh: 'JurisTech 是一款人工智能法律辅助工具。其输出结果不构成正式法律意见，亦不能替代相关司法管辖区执业律师的审查。',
  tr: 'JurisTech bir yapay zekâ hukuki yardımcı aracıdır. Çıktıları hukuki tavsiye niteliği taşımaz ve ilgili yargı yetki alanındaki yetkili bir avukatın incelemesinin yerini almaz.',
};

export interface GlobalLegalDisclaimerProps {
  variant?: 'banner' | 'footer' | 'export' | 'card';
  className?: string;
  showIcon?: boolean;
}

export default function GlobalLegalDisclaimer({
  variant = 'banner',
  className = '',
  showIcon = true,
}: GlobalLegalDisclaimerProps) {
  const { isRtl, i18n } = usePlatformLocale();
  const currentLang = (i18n.language?.slice(0, 2) as SupportedLanguage) || (isRtl ? 'ar' : 'en');
  const text = DISCLAIMER_TEXTS[currentLang] || (isRtl ? DISCLAIMER_TEXTS.ar : DISCLAIMER_TEXTS.en);

  if (variant === 'footer') {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`p-3.5 sm:p-4 rounded-xl bg-[#0D1F3C]/90 border border-[#D4AF37]/30 flex items-start gap-3 text-xs text-slate-300 shadow-sm ${className}`}
        role="note"
        aria-label="Legal Disclaimer"
      >
        {showIcon && <AlertTriangle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />}
        <p className="leading-relaxed m-0 font-medium text-slate-300">
          <span className="font-bold text-[#D4AF37] block sm:inline sm:ml-1.5 sm:mr-1.5">
            {isRtl ? 'تنويه قانوني إلزامي:' : 'Mandatory Statutory Notice:'}
          </span>
          {text}
        </p>
      </div>
    );
  }

  if (variant === 'export') {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-[11px] text-amber-200/90 leading-tight ${className}`}
        role="note"
        aria-label="Export Legal Disclaimer"
      >
        {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
        <span className="font-normal">{text}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex items-start gap-3 text-xs leading-relaxed text-slate-300 ${className}`}
        role="note"
      >
        {showIcon && <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
        <div>
          <span className="font-bold text-amber-300 block mb-0.5">
            {isRtl ? 'تنويه نظامي — نطاق عمل المنصة:' : 'Statutory Notice — Platform Scope:'}
          </span>
          <span>{text}</span>
        </div>
      </div>
    );
  }

  // Default 'banner' variant (e.g. for /chat top or page headers)
  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-200/90 font-medium ${className}`}
      role="alert"
    >
      {showIcon && <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />}
      <p className="m-0 leading-normal flex-1">
        <strong className="font-bold text-amber-300 ml-1 mr-1">
          {isRtl ? 'تنبيه نظامي:' : 'Legal Notice:'}
        </strong>
        {text}
      </p>
    </div>
  );
}
