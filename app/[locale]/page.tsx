'use client';

import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('Dashboard');

  return (
    <main className="p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-bold">{t('contracts')}</h2>
          <p className="text-3xl font-extrabold text-cyan-400">0</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-bold">{t('riskReports')}</h2>
          <p className="text-3xl font-extrabold text-amber-400">0</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-bold">{t('aiRequests')}</h2>
          <p className="text-3xl font-extrabold text-emerald-400">0</p>
        </div>
      </div>
    </main>
  );
}
