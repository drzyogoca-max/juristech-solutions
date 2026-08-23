import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { normalizeLanguage } from '../lib/universalTranslator';

const locales = [
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe', dir: 'ltr' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = normalizeLanguage(i18n.language || (typeof window !== 'undefined' ? localStorage.getItem('locale') || 'ar' : 'ar'));
  const isRtl = current === 'ar';

  const switchLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('locale', code);
    localStorage.setItem('i18nextLng', code);
    localStorage.setItem('locale_explicit', 'true');

    if (typeof document !== 'undefined') {
      const isArabic = code === 'ar';
      document.documentElement.lang = code;
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      if (document.body) {
        document.body.lang = code;
        document.body.dir = isArabic ? 'rtl' : 'ltr';
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('juristech_lang_change', { detail: { lang: code } }));
    }
  };

  const activeLabel = locales.find((l) => l.code === current)?.label || current.toUpperCase();

  return (
    <div className="relative group">
      <button
        aria-label={isRtl ? 'اختيار اللغة' : 'Select language'}
        className="flex items-center gap-2 text-slate-300 hover:text-white text-xs font-bold px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 transition-all shadow-sm cursor-pointer"
      >
        <Languages className="w-4 h-4 text-cyan-400" />
        <span>{activeLabel}</span>
      </button>

      <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-48 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 overflow-hidden backdrop-blur-xl`}>
        {locales.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => switchLanguage(code)}
            className={`w-full text-start px-4 py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
              code === current
                ? 'text-cyan-400 font-bold bg-cyan-500/10 border-s-2 border-cyan-400'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <span>{label}</span>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{code}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
