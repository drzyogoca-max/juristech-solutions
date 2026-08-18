'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, Download, Loader as Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

const contractTypes = [
  'NDA',
  'Employment Agreement',
  'Commercial Agreement',
  'Partnership Agreement',
  'Service Agreement',
  'Consulting Agreement',
];

export default function ContractsPage() {
  const t = useTranslations('Contracts');
  const [contractType, setContractType] = useState('Commercial Agreement');
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateContract() {
    if (!partyA.trim() || !partyB.trim()) {
      alert(t('fillBoth'));
      return;
    }

    setLoading(true);
    const prompt = `
Generate a professional legal ${contractType} between:

Party A: ${partyA}
Party B: ${partyB}

Include:
- Definitions
- Obligations
- Payment Terms
- Confidentiality
- Liability
- Termination
- Governing Law
- Dispute Resolution
`;

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setGeneratedContract(data.result);
    } catch {
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  }

  function exportPDF() {
    if (!generatedContract) return;
    const pdf = new jsPDF();
    pdf.text(generatedContract, 10, 10);
    pdf.save(`${contractType.replace(/\s/g, '_')}.pdf`);
  }

  return (
    <main className="p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('contractType')}</label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {contractTypes.map(type => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('partyA')}</label>
            <input
              placeholder="e.g., Acme Corp"
              value={partyA}
              onChange={(e) => setPartyA(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('partyB')}</label>
            <input
              placeholder="e.g., Beta Inc"
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            onClick={generateContract}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
            {loading ? t('generating') : t('generate')}
          </button>
        </div>

        {generatedContract && (
          <div className="mt-8 bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('generated')}</h2>
              <button
                onClick={exportPDF}
                className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> {t('exportPDF')}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-slate-950 p-4 rounded-lg overflow-x-auto">
              {generatedContract}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
