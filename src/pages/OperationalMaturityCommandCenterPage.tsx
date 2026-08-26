import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { partnerNetworkActivationEngine } from '../enterprise/partnerNetworkActivationEngine';
import { enterpriseTrustAnalyticsEngine } from '../enterprise/enterpriseTrustAnalyticsEngine';
import { regulatoryIntelligenceExpansionEngine } from '../enterprise/regulatoryIntelligenceExpansionEngine';
import { aiGovernanceOperationsEngine } from '../enterprise/aiGovernanceOperationsEngine';
import { enterpriseObservabilityFabric } from '../enterprise/enterpriseObservabilityFabric';
import { 
  Activity, 
  Network, 
  BarChart3, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Scale, 
  Layers, 
  Sparkles, 
  Globe2, 
  FileText
} from 'lucide-react';

type ActiveTab = 'partner_activation' | 'trust_analytics' | 'regulatory_expansion' | 'ai_governance_ops' | 'observability_fabric';

export default function OperationalMaturityCommandCenterPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const [activeTab, setActiveTab] = useState<ActiveTab>('partner_activation');

  const partnerOverview = partnerNetworkActivationEngine.getPartnerNetworkActivationOverview();
  const trustOverview = enterpriseTrustAnalyticsEngine.getEnterpriseTrustAnalyticsOverview();
  const regOverview = regulatoryIntelligenceExpansionEngine.getRegulatoryIntelligenceExpansionOverview();
  const aiOverview = aiGovernanceOperationsEngine.getAIGovernanceOperationsOverview();
  const obsOverview = enterpriseObservabilityFabric.getEnterpriseObservabilityFabricOverview();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-emerald-500/20 border border-blue-500/30 rounded-xl text-blue-400">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-300 via-indigo-200 to-emerald-300 bg-clip-text text-transparent">
                  {isAr ? 'مركز قيادة النضج التشغيلي 19.0' : 'Operational Maturity Command Center 19.0'}
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {isAr ? 'الإصدار التشغيلي v26.0.0' : 'Operational v26.0.0'}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {isAr 
                  ? 'تفعيل شبكة الشركاء العالمية، تحليلات الثقة المؤسسية، التوسع التشريعي، وحوكمة الذكاء الاصطناعي التشغيلية'
                  : 'Global Partner Activation, Enterprise Trust Analytics, Regulatory Expansion & AI Governance Ops'}
              </p>
            </div>
          </div>
        </div>

        {/* Operational Uptime Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-blue-500/30 rounded-xl px-4 py-2.5 shadow-lg shadow-blue-950/20">
          <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
          <div>
            <div className="text-xs text-slate-400">{isAr ? 'مؤشر الجاهزية والاعتمادية' : 'Platform Reliability Index'}</div>
            <div className="text-sm font-bold text-blue-300">{obsOverview.platformUptimePct}% ({isAr ? 'تشغيل عالمي فائق' : 'Tier-IV Core'})</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('partner_activation')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'partner_activation'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Network className="w-4 h-4" />
          {isAr ? 'تفعيل شبكة الشركاء' : 'Partner Activation'}
        </button>

        <button
          onClick={() => setActiveTab('trust_analytics')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'trust_analytics'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <BarChart3 className="w-4 h-4" />
          {isAr ? 'تحليلات الثقة المؤسسية' : 'Trust Analytics'}
        </button>

        <button
          onClick={() => setActiveTab('regulatory_expansion')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'regulatory_expansion'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Compass className="w-4 h-4" />
          {isAr ? 'التوسع التشريعي الدولي' : 'Regulatory Expansion'}
        </button>

        <button
          onClick={() => setActiveTab('ai_governance_ops')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'ai_governance_ops'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Cpu className="w-4 h-4" />
          {isAr ? 'عمليات حوكمة الذكاء الاصطناعي' : 'AI Governance Ops'}
        </button>

        <button
          onClick={() => setActiveTab('observability_fabric')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'observability_fabric'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          {isAr ? 'نسيج المراقبة والاعتمادية' : 'Observability Fabric'}
        </button>
      </div>

      {/* Tab 1: Partner Network Activation */}
      {activeTab === 'partner_activation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'الشركاء المفعلون تشغيلياً' : 'Activated Partners'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{partnerOverview.totalActivatedPartnersCount} {isAr ? 'كيانات مفعلة' : 'Entities'}</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isAr ? 'عزل كامل للبيانات دون كشف مستندات العملاء' : 'Zero Client Data Exposure Enforced'}
              </div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط مؤشر الثقة للشبكة' : 'Network Trust Index'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{partnerOverview.averageTrustIndexPct}%</div>
              <div className="text-xs text-slate-400 mt-2">{isAr ? 'مطابقة سنوية موثقة' : 'Annual Audit Verified'}</div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'الاعتماد البشري المزدوج' : 'Dual Human Approval'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{isAr ? 'إلزامي 100%' : '100% Enforced'}</div>
              <div className="text-xs text-indigo-400 mt-2">{isAr ? 'لا تعاقد آلي مستقل' : 'No Autonomous Contracts'}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-400" />
              {isAr ? 'سجل تفعيل شبكة الشركاء ومكاتب المحاماة العالمية' : 'Activated Global Law Firm & Advisory Network'}
            </h3>
            <div className="space-y-4">
              {partnerOverview.partners.map((p) => (
                <div key={p.partnerId} className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{p.legalEntityName}</div>
                      <div className="text-xs text-slate-400">{p.tierCategory} • {isAr ? 'الولاية:' : 'Jurisdiction:'} <span className="text-slate-300 font-mono">{p.headquarteredJurisdiction}</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">{isAr ? 'مؤشر الثقة' : 'Trust Index'}</div>
                        <div className="text-sm font-bold text-emerald-400">{p.trustIndexPct}%</div>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {p.registrationStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 font-medium">{isAr ? 'نطاق الصلاحيات المحدد:' : 'Authorized Scope:'}</span> {p.authorizedScopeSummary}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{isAr ? 'تاريخ التجديد:' : 'Renewal Date:'} {new Date(p.activationExpiryDate).toLocaleDateString()}</span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{p.cryptographicActivationSealSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Trust Analytics */}
      {activeTab === 'trust_analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'مؤشر الثقة المؤسسي العام' : 'Institutional Trust Index'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{trustOverview.overallInstitutionalTrustIndex} / 100</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'العقد المؤسسية المقيمة' : 'Evaluated Nodes'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{trustOverview.evaluatedPartnerNodesCount} {isAr ? 'عقد فيدرالية' : 'Nodes'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'انعدام الإقصاء الخوارزمي' : 'Non-Discriminatory Metric'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{isAr ? 'مضمون 100%' : '100% Guaranteed'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trustOverview.metrics.map((m) => (
              <div key={m.metricId} className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{isAr ? m.metricLabelAr : m.metricLabelEn}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{isAr ? 'الوزن النسبي:' : 'Weight:'} {m.weightPct}%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-400">{m.scorePct}%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {isAr ? m.explanationAr : m.explanationEn}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>{isAr ? 'مرجع سجل التدقيق:' : 'Audit Trail:'} <span className="font-mono text-slate-300">{m.auditTrailReference}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Regulatory Expansion */}
      {activeTab === 'regulatory_expansion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'المناطق القضائية المرصودة' : 'Monitored Jurisdictions'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{regOverview.totalMonitoredJurisdictionsCount} {isAr ? 'دول ومناطق' : 'Jurisdictions'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'الأنظمة واللوائح النشطة الممسوحة' : 'Active Statutes Tracked'}</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">{regOverview.totalActiveStatutesTrackedCount} {isAr ? 'نظام ولائحة' : 'Statutes'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'مصدر الرصد' : 'Statutory Grounding'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{isAr ? 'جرائد رسمية فقط' : 'Official Gazettes Only'}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              {isAr ? 'سجل الرصد التشريعي السيادي الموسع' : 'Sovereign Regulatory Monitoring Ledger'}
            </h3>
            <div className="space-y-4">
              {regOverview.jurisdictions.map((j) => (
                <div key={j.jurisdictionId} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{j.jurisdictionName}</div>
                      <div className="text-xs text-slate-400">{j.officialGazetteSource}</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                      {j.statutoryStatus} • {j.activeStatutesCount} {isAr ? 'أنظمة' : 'Statutes'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 pt-1">
                    <span className="text-slate-400 font-medium">{isAr ? 'الأنظمة المشمولة:' : 'Covered Frameworks:'}</span> {j.monitoredStatutoryDomain}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{isAr ? 'آخر مسح رسمي:' : 'Last Official Scan:'} {new Date(j.lastGazetteScanTimestamp).toLocaleDateString()}</span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{j.sovereignProofHashSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Governance Operations */}
      {activeTab === 'ai_governance_ops' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'النماذج الذكية المقيمة' : 'Assessed AI Models'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{aiOverview.totalAssessedModelsCount} {isAr ? 'محركات مؤسسية' : 'Engines'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط الالتزام المعياري' : 'Average Alignment'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{aiOverview.averageAlignmentScorePct}%</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'بوابة القرار التنفيذي' : 'Decision Gate'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{isAr ? 'اعتماد بشري إلزامي' : 'Human Signed Only'}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              {isAr ? 'سجل التقييم التشغيلي لنماذج الذكاء الاصطناعي (ISO 42001 / EU AI Act / SDAIA)' : 'Continuous AI Operational Assessment Ledger'}
            </h3>
            <div className="space-y-4">
              {aiOverview.models.map((m) => (
                <div key={m.modelArtifactId} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{m.modelDesignation}</div>
                      <div className="text-xs text-slate-400">{m.targetedStandard} • {isAr ? 'معدل الهلوسة:' : 'Hallucination:'} <span className="text-emerald-400 font-bold">{m.hallucinationRatePct}%</span></div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      {m.complianceState}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{isAr ? 'مؤشر العدالة والشفافية:' : 'Fairness Index:'} {m.fairnessIndexPct}%</span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{m.cryptographicAssessmentDigestSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Observability Fabric */}
      {activeTab === 'observability_fabric' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'الجاهزية التامة (Uptime)' : 'Core Availability'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{obsOverview.platformUptimePct}%</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط زمن الاستجابة' : 'Mean Latency'}</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">{obsOverview.averageResponseLatencyMs}ms</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'اختراق الحدود الأمنية' : 'Boundary Breaches'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{obsOverview.securityBoundariesBreachCount} ({isAr ? 'آمن تماماً' : '100% Safe'})</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'دقة التأصيل القانوني' : 'Citation Grounding'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{obsOverview.aiPrecisionScorePct}%</div>
            </div>
          </div>

          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              {isAr ? 'مؤشرات نسيج المراقبة والاعتمادية والحدود الأمنية' : 'Observability Telemetry & Security Boundary Metrics'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              {obsOverview.metrics.map((m) => (
                <div key={m.metricKey} className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-blue-300">{isAr ? m.metricTitleAr : m.metricTitleEn}</div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {m.metricValue}
                    </span>
                  </div>
                  <p className="text-slate-400">
                    <span className="text-slate-500">{isAr ? 'المعيار المرجعي:' : 'Benchmark:'}</span> {m.benchmarkStandard}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
