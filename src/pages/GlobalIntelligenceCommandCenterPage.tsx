import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { governanceSimulationEngine } from '../enterprise/governanceSimulationEngine';
import { globalLegalBenchmarkEngine } from '../enterprise/globalLegalBenchmarkEngine';
import { sectorMaturityIndexEngine } from '../enterprise/sectorMaturityIndexEngine';
import { simulationAttestationRegistry } from '../enterprise/simulationAttestationRegistry';
import { 
  Compass, 
  Binary, 
  BarChart3, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Lock, 
  ArrowUpRight, 
  Activity,
  Zap,
  TrendingUp,
  Cpu,
  FileCheck2,
  Scale
} from 'lucide-react';

type ActiveTab = 'governance_simulation' | 'global_benchmarks' | 'sector_maturity' | 'intelligence_mesh' | 'executive_attestation';

export default function GlobalIntelligenceCommandCenterPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const [activeTab, setActiveTab] = useState<ActiveTab>('governance_simulation');

  const simulationOverview = governanceSimulationEngine.getGovernanceSimulationOverview();
  const benchmarkOverview = globalLegalBenchmarkEngine.getGlobalLegalBenchmarkOverview();
  const maturityOverview = sectorMaturityIndexEngine.getSectorMaturityOverview();
  const attestationOverview = simulationAttestationRegistry.getSimulationAttestationOverview();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent">
                {isAr ? 'مركز قيادة المحاكاة والذكاء المؤسسي العالمي 16.0' : 'Global Intelligence & Governance Simulation Command Center 16.0'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {isAr 
                  ? 'محاكاة القرارات التنبؤية، المقارنة المعيارية العالمية، مصفوفة النضج المؤسسي، وميثاق الحوكمة v23.0.0'
                  : 'Predictive Governance Simulation, Global Benchmarks, Sector Maturity Indices & Executive Charter v23.0.0'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Maturity Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-indigo-500/30 rounded-xl px-4 py-2.5 shadow-lg shadow-indigo-950/20">
          <ShieldCheck className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <div className="text-xs text-slate-400">{isAr ? 'مؤشر النضج المؤسسي الشامل' : 'Global Maturity Score'}</div>
            <div className="text-sm font-bold text-indigo-300">{maturityOverview.overallEnterpriseMaturityScore}% ({maturityOverview.maturityDesignation})</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('governance_simulation')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'governance_simulation'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Binary className="w-4 h-4" />
          {isAr ? 'محاكي القرارات والحوكمة' : 'Governance Simulation'}
        </button>

        <button
          onClick={() => setActiveTab('global_benchmarks')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'global_benchmarks'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <BarChart3 className="w-4 h-4" />
          {isAr ? 'المقارنة المعيارية العالمية' : 'Global Benchmarks'}
        </button>

        <button
          onClick={() => setActiveTab('sector_maturity')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'sector_maturity'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Award className="w-4 h-4" />
          {isAr ? 'مؤشر النضج القطاعي' : 'Sector Maturity'}
        </button>

        <button
          onClick={() => setActiveTab('intelligence_mesh')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'intelligence_mesh'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <TrendingUp className="w-4 h-4" />
          {isAr ? 'شبكة الذكاء التنظيمي' : 'Intelligence Mesh'}
        </button>

        <button
          onClick={() => setActiveTab('executive_attestation')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'executive_attestation'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <FileCheck2 className="w-4 h-4" />
          {isAr ? 'سجل إثباتات المحاكاة' : 'Attestation Registry'}
        </button>
      </div>

      {/* Tab 1: Governance Simulation */}
      {activeTab === 'governance_simulation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'السيناريوهات المحاكاة النشطة' : 'Simulated Scenarios'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{simulationOverview.totalSimulatedScenariosCount} {isAr ? 'سيناريوهات' : 'Scenarios'}</div>
              <div className="text-xs text-indigo-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isAr ? 'محاكاة في بيئة معزولة (Sandbox)' : 'Isolated Sandbox Simulation'}
              </div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'متوسط تقليص المخاطر' : 'Avg Risk Reduction'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{simulationOverview.averageRiskReductionPct}%</div>
              <div className="text-xs text-slate-400 mt-2">{isAr ? 'أثر السياسات المقترحة' : 'Projected policy effect'}</div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'متوسط الثقة التنظيمية' : 'Avg Compliance Confidence'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{simulationOverview.averageComplianceConfidencePct}%</div>
              <div className="text-xs text-indigo-400 mt-2">{isAr ? 'تطابق معايير 2026' : '2026 statutory match'}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Binary className="w-5 h-5 text-indigo-400" />
              {isAr ? 'سجل سيناريوهات المحاكاة التنظيمية وتحليل الأثر التنبؤي' : 'Governance Simulation Scenarios & Predictive Impact Analysis'}
            </h3>
            <div className="space-y-4">
              {simulationOverview.scenarios.map((s) => (
                <div key={s.scenarioId} className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{s.scenarioTitle}</div>
                      <div className="text-xs text-slate-400">{s.targetDomain} • {isAr ? 'الولايات:' : 'Jurisdictions:'} <span className="text-slate-300 font-mono">{s.simulatedJurisdictions.join(', ')}</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">{isAr ? 'تقليص المخاطر' : 'Risk Reduction'}</div>
                        <div className="text-sm font-bold text-emerald-400">{s.riskReductionPct}% ({s.baselineRiskScore} ➔ {s.projectedRiskScoreAfterPolicy})</div>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {s.complianceConfidencePct}% {isAr ? 'ثقة' : 'Confidence'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/60 space-y-1.5">
                    <div>{isAr ? 'التوصيات الاسترشادية المخففة للمخاطر:' : 'Advisory Mitigations:'}</div>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                      {s.recommendedMitigations.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                    <div className="font-mono text-slate-500 truncate pt-1">{s.simulationHashSha512}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Global Benchmarks */}
      {activeTab === 'global_benchmarks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'القطاعات المعيارية المقارنة' : 'Benchmarked Sectors'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{benchmarkOverview.totalBenchmarkedSectorsCount} {isAr ? 'قطاعات حيوية' : 'Sectors'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط تسريع الإنجاز' : 'Avg Velocity Gain'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">+{benchmarkOverview.averageVelocityImprovementPct}%</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط جاهزية التدقيق' : 'Avg Audit Readiness'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{benchmarkOverview.averageAuditReadinessScore} / 100</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benchmarkOverview.metrics.map((bmk) => (
              <div key={bmk.benchmarkId} className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{bmk.sectorName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{isAr ? 'الرتبة المئينية المقارنة:' : 'Comparative Rank:'} <span className="text-emerald-400 font-bold">{bmk.comparativePercentileRank}th Percentile</span></div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    +{bmk.turnaroundVelocityImprovementPct}%
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between">
                    <span>{isAr ? 'زمن المعالجة (ساعات):' : 'Turnaround (Hours):'}</span>
                    <span className="text-slate-200 font-medium">JurisTech {bmk.jurisTechTurnaroundHours}h vs Global Avg {bmk.globalAverageTurnaroundHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isAr ? 'مؤشر الامتثال القطاعي:' : 'Compliance Index:'}</span>
                    <span className="text-indigo-300 font-medium">JurisTech {bmk.jurisTechComplianceIndexPct}% vs Global {bmk.globalComplianceIndexPct}%</span>
                  </div>
                  <div className="font-mono text-slate-500 truncate pt-1">{bmk.cryptographicProofSha512}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Sector Maturity */}
      {activeTab === 'sector_maturity' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              {isAr ? 'مصفوفة النضج المؤسسي عبر الأبعاد الخمسة' : 'Enterprise Maturity Dimensions Matrix'}
            </h3>
            <div className="space-y-4">
              {maturityOverview.dimensions.map((dim) => (
                <div key={dim.dimensionKey} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{dim.dimensionName}</div>
                      <div className="text-xs text-indigo-300">{dim.maturityTier}</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      {dim.maturityScorePct}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 pt-2 border-t border-slate-800/60 space-y-1">
                    <div><span className="text-slate-400">{isAr ? 'نقاط القوة المحققة:' : 'Key Strengths:'}</span> {dim.strengthsSummary}</div>
                    <div><span className="text-slate-400">{isAr ? 'خارطة طريق التحسين الاسترشادية:' : 'Advisory Roadmap:'}</span> {dim.advisoryImprovementRoadmap}</div>
                    <div className="font-mono text-slate-500 truncate pt-1">{dim.evidenceDigestSha512}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Intelligence Mesh */}
      {activeTab === 'intelligence_mesh' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              {isAr ? 'مبادئ شبكة الذكاء التنظيمي والحوكمة الإنسانية' : 'Intelligence Mesh & Human Governance Invariant'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                <div className="font-bold text-indigo-300">{isAr ? 'المبدأ الحاكم: الذكاء يقترح، والإنسان يقرر' : 'Governing Principle: AI Advises, Humans Decide'}</div>
                <p className="text-slate-400">
                  {isAr 
                    ? 'كافة نتائج المحاكاة، ونماذج التنبؤ بالمخاطر، والمقارنات المعيارية تعمل حصرياً كطبقة استرشادية تنفيذية ولا تتخذ أي قرارات تشغيلية أو قانونية ذاتية.'
                    : 'All simulation results, risk forecasting models, and benchmark telemetry operate strictly in advisory mode without autonomous policy execution.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                <div className="font-bold text-indigo-300">{isAr ? 'عزل الحمولات وانعدام التخزين' : 'Zero Payload Retention Invariant'}</div>
                <p className="text-slate-400">
                  {isAr 
                    ? 'لا يتم الاحتفاظ بأي حمولات محاكاة أو بيانات عملاء سرية؛ البصمات التشفيرية المشتركة هي إثباتات رياضية فقط.'
                    : 'Zero simulation payloads or client contracts are persisted; cryptographic proof digests attest mathematical integrity only.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Attestation Registry */}
      {activeTab === 'executive_attestation' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-400" />
              {isAr ? 'سجل إثباتات المحاكاة والاعتماد التنفيذي المزدوج v23.0.0' : 'Simulation Attestation Registry & Dual Executive Seal'}
            </h3>
            <div className="space-y-4">
              {attestationOverview.records.map((rec) => (
                <div key={rec.attestationId} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{rec.scenarioTitle}</div>
                      <div className="text-xs text-slate-400">{rec.attestedByCounsel} & {rec.attestedByRiskOfficer}</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      {rec.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{isAr ? 'تقليص المخاطر المعتمد:' : 'Verified Risk Reduction:'} <span className="text-emerald-400 font-bold">{rec.riskReductionVerifiedPct}%</span></span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{rec.cryptographicEvidenceSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
