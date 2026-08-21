import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const locales = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe', dir: 'ltr' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language;
  const isRtl = current === 'ar';

  const switchLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('locale', code);
    localStorage.setItem('locale_explicit', 'true');

    if (typeof document !== 'undefined') {
      document.documentElement.lang = code;
      document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('juristech_lang_change', { detail: { lang: code } }));
    }
  };

  return (
    <div className="relative group">
      <button
        aria-label={isRtl ? 'اختيار اللغة' : 'Select language'}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white text-sm font-semibold px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-slate-500 transition-colors"
      >
        <Languages className="w-4 h-4 text-cyan-400" />
        <span>{current.toUpperCase()}</span>
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
        {locales.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => switchLanguage(code)}
            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 dark:bg-slate-800 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between ${
              code === current ? 'text-cyan-400 font-bold bg-slate-800/50' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>{label}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 font-mono font-bold uppercase">{code}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
