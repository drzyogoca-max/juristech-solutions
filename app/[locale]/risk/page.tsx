'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { TriangleAlert as AlertTriangle, Loader as Loader2 } from 'lucide-react';

export default function RiskPage() {
  const t = useTranslations('Risk');
  const [contractText, setContractText] = useState('');
  const [result, setResult] = useState<null | {
    riskScore: number;
    missingClauses: string[];
    recommendations: string[];
  }>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeRisk() {
    if (!contractText.trim()) {
      alert(t('pasteText'));
      return;
    }

    setLoading(true);
    const prompt = `
Analyze the following contract text for legal risks.
Return a JSON object with:
- riskScore (0-100)
- missingClauses (array of missing clauses)
- recommendations (array of recommendations)

Contract:
${contractText}
`;

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      let parsed;
      try {
        parsed = JSON.parse(data.result);
      } catch {
        const score = data.result.match(/riskScore[:\s]*(\d+)/i);
        const missing = data.result.match(/missingClauses[:\s]*\[(.*?)\]/is);
        const recs = data.result.match(/recommendations[:\s]*\[(.*?)\]/is);
        parsed = {
          riskScore: score ? parseInt(score[1]) : 50,
          missingClauses: missing ? missing[1].split(',').map((s: string) => s.trim()) : [],
          recommendations: recs ? recs[1].split(',').map((s: string) => s.trim()) : [],
        };
      }
      setResult(parsed);
    } catch {
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-4">
          <textarea
            placeholder={t('placeholder')}
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            rows={10}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
          />

          <button
            onClick={analyzeRisk}
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 p-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertTriangle className="w-5 h-5" />}
            {loading ? t('analyzing') : t('analyze')}
          </button>
        </div>

        {result && (
          <div className="mt-8 bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{t('riskScore')}</h2>
              <span className={`text-3xl font-extrabold ${
                result.riskScore < 30 ? 'text-emerald-400' :
                result.riskScore < 60 ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {result.riskScore}%
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-amber-400">{t('missingClauses')}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {result.missingClauses.map((clause, i) => (
                  <li key={i}>{clause}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400">{t('recommendations')}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {result.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
