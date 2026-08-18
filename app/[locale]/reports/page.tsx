'use client';

import { useTranslations } from 'next-intl';

export default function ReportsPage() {
  const t = useTranslations('Reports');
  return (
    <main className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <p className="text-slate-400">{t('comingSoon')}</p>
      </div>
    </main>
  );
}
