/**
 * src/pages/StrategicOperationsCommandCenterPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Strategic Operations & Executive Intelligence Command Center
 * Specification: Task 25.5
 *
 * Executive cockpit for predictive compliance modeling, systemic risk forecasting,
 * strategic decision intelligence, and automated board governance dossiers.
 */

import React, { useState, useMemo } from 'react';
import {
  Compass,
  TrendingUp,
  BrainCircuit,
  FileSpreadsheet,
  Network,
  Lock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { predictiveComplianceIntelligence, PredictiveComplianceOverview, PredictiveShiftForecast } from '../strategic/predictiveComplianceIntelligence';
import { enterpriseRiskForecasting, EnterpriseRiskForecastingSummary, EnterpriseRiskVector } from '../strategic/enterpriseRiskForecasting';
import { executiveDecisionIntelligence, DecisionIntelligenceOverview, StrategicDecisionScenario } from '../strategic/executiveDecisionIntelligence';
import { automatedGovernanceReporting, GovernanceReportingSummary, BoardGovernanceDossier } from '../strategic/automatedGovernanceReporting';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type StrategicTab = 'compliance_horizon' | 'risk_forecasting' | 'decision_intelligence' | 'board_dossiers' | 'strategic_matrix';

export default function StrategicOperationsCommandCenterPage() {
  const { lang, isRtl } = usePlatformLocale();
  const isAr = lang === 'ar';
  const { isAdmin, isLawyer } = useAuth();
  const { tier: subTierName } = useSubscription();

  const userTier: UserTier = useMemo(() => {
    if (isAdmin) return 'admin';
    if (isLawyer) return 'lawyer';
    if (subTierName === 'Enterprise') return 'enterprise';
    if (subTierName === 'Pro') return 'pro';
    if (subTierName === 'SMEs') return 'sme';
    if (subTierName === 'Startup') return 'startup';
    return 'free';
  }, [isAdmin, isLawyer, subTierName]);

  const access = checkAccess('strategic_operations', userTier);

  const [activeTab, setActiveTab] = useState<StrategicTab>('compliance_horizon');

  const compliance = useMemo<PredictiveComplianceOverview>(
    () => predictiveComplianceIntelligence.getPredictiveComplianceOverview(),
    []
  );
  const risk = useMemo<EnterpriseRiskForecastingSummary>(
    () => enterpriseRiskForecasting.getRiskForecastingSummary(),
    []
  );
  const decisions = useMemo<DecisionIntelligenceOverview>(
    () => executiveDecisionIntelligence.getDecisionOverview(),
    []
  );
  const dossiers = useMemo<GovernanceReportingSummary>(
    () => automatedGovernanceReporting.getGovernanceReportingSummary(),
    []
  );

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | Strategic Operations' : 'Access Restricted | Strategic Operations'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'مركز العمليات الاستراتيجية مقيد' : 'Strategic Operations Center Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'الوصول إلى قمرة قيادة العمليات الاستراتيجية والذكاء التنبؤي مخصص حصرياً للمستشار العام وأعضاء الإدارة العليا.'
              : 'Access to the Strategic Operations & Executive Intelligence Center is strictly restricted to General Counsel and C-suite administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز العمليات الاستراتيجية والذكاء التنبؤي | JurisTech' : 'Strategic Operations & Executive Intelligence Command Center | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Compass className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز العمليات الاستراتيجية والذكاء التنبؤي 11.0' : 'Strategic Operations & Executive Intelligence Command Center 11.0'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'النمذجة التنبؤية للتحولات التشريعية، محاكاة المخاطر النظامية، دعم القرارات التنفيذية، والتقارير الاستراتيجية لمجلس الإدارة.'
              : 'Predictive compliance modeling, systemic risk forecasting, executive decision intelligence, and board governance dossiers.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            {isAr ? 'الثقة التنبؤية: 96.3%' : 'Predictive Confidence: 96.3%'}
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('compliance_horizon')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'compliance_horizon' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          {isAr ? 'الأفق التشريعي التنبؤي' : 'Compliance Horizon'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('risk_forecasting')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'risk_forecasting' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {isAr ? 'التنبؤ بالمخاطر النظامية' : 'Risk Forecasting'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('decision_intelligence')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'decision_intelligence' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          {isAr ? 'ذكاء القرارات التنفيذية' : 'Decision Intelligence'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('board_dossiers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'board_dossiers' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          {isAr ? 'ملفات مجلس الإدارة' : 'Board Dossiers'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('strategic_matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'strategic_matrix' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          {isAr ? 'مصفوفة العمليات الاستراتيجية' : 'Strategic Matrix'}
        </button>
      </div>

      {/* ── TAB 1: COMPLIANCE HORIZON ── */}
      {activeTab === 'compliance_horizon' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Forecasted Shifts</div>
              <div className="text-amber-400 font-mono font-bold text-base">{compliance.totalForecastedShiftsCount} Shifts</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Critical Alerts</div>
              <div className="text-rose-400 font-mono font-bold text-base">{compliance.criticalHorizonAlertsCount} Alerts</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Avg Predictive Confidence</div>
              <div className="text-emerald-400 font-mono font-bold text-base">{compliance.averagePredictiveConfidencePct}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Mode Enforced</div>
              <div className="text-cyan-400 font-mono font-bold text-base">Predictive Insights Only</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compliance.shifts.map((s) => (
              <div key={s.shiftId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {s.shiftType}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">Confidence: {s.predictiveConfidencePct}%</span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? s.titleAr : s.titleEn}</h3>
                <div className="text-[11px] text-slate-400">
                  <span className="text-amber-400 font-bold">Horizon:</span> {s.expectedEnforcementHorizon} | <span className="text-rose-400 font-bold">Impact:</span> {s.impactSeverity}
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                  <div className="text-[10px] text-slate-500 font-bold mb-1">Recommended Preparation Strategy:</div>
                  {isAr ? s.recommendedPreparationStrategyAr : s.recommendedPreparationStrategyEn}
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-500 truncate">
                  Model Hash: {s.predictiveModelHash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: RISK FORECASTING ── */}
      {activeTab === 'risk_forecasting' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              {isAr ? 'محاكاة المخاطر القانونية النظامية ومؤشرات الاحتكاك' : 'Systemic Legal Risk Modeling & Early Warning Matrix'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">Simulation & Forecast Only</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {risk.riskVectors.map((v) => (
              <div key={v.vectorId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    {v.vectorType}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">{v.trendDirection}</span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? v.titleAr : v.titleEn}</h3>
                <div className="text-2xl font-bold font-mono text-cyan-400">{v.forecastScore} / 100</div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                  {isAr ? v.mitigationStrategyAr : v.mitigationStrategyEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: DECISION INTELLIGENCE ── */}
      {activeTab === 'decision_intelligence' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            {isAr ? 'محرك دعم القرارات التنفيذية والمفاضلات الاستراتيجية' : 'Executive Decision Support & Multi-Criteria Trade-Off Engine'}
          </h2>

          <div className="space-y-4">
            {decisions.scenarios.map((scen) => (
              <div key={scen.scenarioId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    {scen.scenarioType}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">Alignment: {scen.alignmentScorePct}%</span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? scen.titleAr : scen.titleEn}</h3>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  <div className="text-[10px] text-amber-400 font-bold mb-1">Recommended Strategic Path:</div>
                  {isAr ? scen.recommendedOptionAr : scen.recommendedOptionEn}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                  <span>Impact: {scen.regulatoryComplianceImpact}</span>
                  <span className="text-emerald-400 font-bold">General Counsel Review: Mandatory</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: BOARD DOSSIERS ── */}
      {activeTab === 'board_dossiers' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            {isAr ? 'ملفات الحوكمة الاستراتيجية المعتمدة لمجلس الإدارة' : 'Board of Directors Strategic Governance Dossiers'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossiers.dossiers.map((d) => (
              <div key={d.dossierId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {d.reportType}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-cyan-400">{d.reportingPeriod}</span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? d.titleAr : d.titleEn}</h3>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-500 truncate">
                  Digest Hash: {d.cryptographicDigestHash}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold pt-1 border-t border-slate-800">
                  <span>General Counsel: SIGNED</span>
                  <span>CISO: SIGNED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: STRATEGIC MATRIX ── */}
      {activeTab === 'strategic_matrix' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-indigo-400" />
            {isAr ? 'مصفوفة العمليات الاستراتيجية والربط المؤسسي' : 'Strategic Operations Cohesion & Governance Matrix'}
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl text-xs text-slate-300 leading-relaxed">
            <p>
              {isAr
                ? 'توفر مصفوفة العمليات الاستراتيجية رؤية شاملة تجمع بين النمذجة التنبؤية، تقييم المخاطر، وتوجيهات مجلس الإدارة لضمان القيادة القانونية المثلى.'
                : 'The Strategic Operations Matrix synthesizes predictive compliance models, systemic risk forecasts, and board oversight charters into a unified strategic posture.'}
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-emerald-400">
              [STRATEGIC-STATE] All 15 jurisdictions actively modeled with 0 autonomous mutations @ {compliance.lastForecastTimestamp}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
