'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold px-3 py-1 rounded-lg border border-slate-700 hover:border-slate-600">
        <Languages className="w-4 h-4" />
        <span>{locale.toUpperCase()}</span>
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl hidden group-hover:block">
        {locales.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => switchLanguage(code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 transition-colors ${
              code === locale ? 'text-cyan-400' : 'text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
