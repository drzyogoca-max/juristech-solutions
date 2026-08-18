/**
 * src/components/PredictiveRiskAnalyzer.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AI Predictive Legal Risk Analyzer Engine
 * Evaluates contract clauses for litigation exposure, ambiguity, and liability risks before execution.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, AlertTriangle, CheckCircle, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { autonomousRiskEngine, ContractRiskAssessment } from '../services/autonomousRiskEngine';

export default function PredictiveRiskAnalyzer() {
  const { t } = useTranslation();
  const [contractText, setContractText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<ContractRiskAssessment | null>(null);

  const handleAnalyze = async () => {
    if (!contractText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await autonomousRiskEngine.evaluateContractRisk(
        'Predictive Audit Document',
        contractText
      );
      setAssessment(result);
    } catch (err) {
      console.error('Risk analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              {t('predictiveRisk.title', 'AI Predictive Legal Risk Module')}
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h2>
            <p className="text-xs text-slate-400">
              {t('predictiveRisk.subtitle', 'Predicts potential litigation risks and contract vulnerabilities prior to signing')}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          rows={5}
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
          placeholder={t('predictiveRisk.placeholder', 'Paste contract text or clauses here to predict legal exposure...')}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-purple-500 leading-relaxed font-mono"
        />

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !contractText.trim()}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <span>Evaluating Contract AI Model...</span>
          ) : (
            <>
              <span>Run AI Risk Prediction</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {assessment && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Prediction Report</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Risk Exposure Index:</span>
              <span
                className={`text-sm font-black px-3 py-1 rounded-lg ${
                  assessment.overallRiskScore >= 70
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : assessment.overallRiskScore >= 40
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {assessment.overallRiskScore}/100 ({assessment.riskLevel})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identified Red Flags</h4>
              <ul className="space-y-2 text-xs text-red-300">
                {assessment.highRiskFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-red-500/5 p-2.5 rounded-xl border border-red-500/10">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mitigation Recommendations</h4>
              <ul className="space-y-2 text-xs text-emerald-300">
                {assessment.mitigationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
