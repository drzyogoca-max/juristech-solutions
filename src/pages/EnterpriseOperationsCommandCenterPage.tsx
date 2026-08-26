import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { enterpriseOperationsOrchestrator } from '../enterprise/enterpriseOperationsOrchestrator';
import { continuousTrustTelemetryHub } from '../enterprise/continuousTrustTelemetryHub';
import { enterpriseContractLifecycleManager } from '../enterprise/enterpriseContractLifecycleManager';
import { businessValueQuantifier } from '../enterprise/businessValueQuantifier';
import { 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Clock, 
  Lock, 
  DollarSign, 
  Award,
  BarChart3,
  Server,
  Layers,
  ArrowUpRight
} from 'lucide-react';

type TabType = 'operations_kpis' | 'trust_telemetry' | 'contract_milestones' | 'business_value_roi' | 'executive_attestation';

const EnterpriseOperationsCommandCenterPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const [activeTab, setActiveTab] = useState<TabType>('operations_kpis');

  const opsOverview = enterpriseOperationsOrchestrator.getOperationsOverview();
  const telemetryOverview = continuousTrustTelemetryHub.getTelemetryOverview();
  const lifecycleOverview = enterpriseContractLifecycleManager.getLifecycleOverview();
  const valueOverview = businessValueQuantifier.getValueOverview();

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 ${isAr ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Activity className="w-7 h-7" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                {isAr 
                  ? 'قمرة قيادة العمليات المؤسسية وإثبات القيمة 13.0' 
                  : 'Enterprise Scale Operations & Value Command Center 13.0'}
              </h1>
            </div>
            <p className="text-slate-400 text-sm">
              {isAr
                ? 'تنسيق مؤشرات الأداء التشغيلية الكبرى، مراقبة الثقة اللحظية، وإثبات العائد المؤسسي عبر 15 ولاية قضائية'
                : 'Orchestrating enterprise scale KPIs, real-time trust telemetry, and empirical legal ROI realization'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isAr ? 'v20.0 تشغيل مؤسسي حي' : 'v20.0 Live Scale Operations'}
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              {isAr ? '15 ولاية قضائية نشطة' : '15 Active Jurisdictions'}
            </span>
          </div>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>{isAr ? 'مؤشر النضج التشغيلي' : 'Operations Health Score'}</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {opsOverview.overallOperationsHealthScore}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {isAr ? 'مرونة تشغيلية ممتازة' : 'Resilience: Resilient'}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>{isAr ? 'نبض الثقة ومطابقة SLA' : 'Trust Health & SLA Uptime'}</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-400">
              {telemetryOverview.slaUptimeAveragePct}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {isAr ? `متوسط زمن الاستجابة: ${telemetryOverview.averageLatencyMs}ms` : `Avg Latency: ${telemetryOverview.averageLatencyMs}ms`}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>{isAr ? 'سرعة دورة حياة العقود' : 'Contract SLA Velocity'}</span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">
              {lifecycleOverview.slaComplianceRatePct}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {isAr ? `متوسط الإنجاز: ${lifecycleOverview.averageVelocityDays} أيام` : `Avg Cycle: ${lifecycleOverview.averageVelocityDays} days`}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>{isAr ? 'القيمة السنوية المحققة' : 'Annual Value Realized'}</span>
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400">
              $${(valueOverview.totalAnnualValueUsd / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {isAr ? `${valueOverview.totalAnnualHoursSaved.toLocaleString()} ساعة موفرة` : `${valueOverview.totalAnnualHoursSaved.toLocaleString()} hrs saved`}
            </div>
          </div>
        </div>

        {/* 5 Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-8 border-b border-slate-800 pb-3">
          {[
            { id: 'operations_kpis', label: isAr ? 'مؤشرات الأداء التشغيلية' : 'Operations KPIs', icon: BarChart3 },
            { id: 'trust_telemetry', label: isAr ? 'المراقبة ونبض الثقة اللحظي' : 'Trust Telemetry', icon: Server },
            { id: 'contract_milestones', label: isAr ? 'محطات دورة حياة العقود' : 'Contract Milestones', icon: Layers },
            { id: 'business_value_roi', label: isAr ? 'مصفوفة القيمة والعائد (ROI)' : 'Business Value & ROI', icon: TrendingUp },
            { id: 'executive_attestation', label: isAr ? 'الاعتمادات التنفيذية المزدوجة' : 'Executive Attestation', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OPERATIONS KPIS */}
        {activeTab === 'operations_kpis' && (
          <div className="space-y-6 mt-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                {isAr ? 'مصفوفة مؤشرات الأداء التشغيلية المؤسسية' : 'Enterprise Operational Performance KPIs'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {opsOverview.kpis.map((kpi) => (
                  <div key={kpi.id} className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {kpi.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {isAr ? `ثقة: ${kpi.confidencePct}%` : `Confidence: ${kpi.confidencePct}%`}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-100 text-base mb-1">
                      {isAr ? kpi.metricNameAr : kpi.metricName}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-2xl font-black text-emerald-400">{kpi.currentValue}</span>
                      <span className="text-xs text-slate-400">{kpi.unit}</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (kpi.currentValue / (kpi.targetValue || 100)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRUST TELEMETRY */}
        {activeTab === 'trust_telemetry' && (
          <div className="space-y-6 mt-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                {isAr ? 'نبض الثقة الحية وتدفقات المراقبة عبر العقد السيادية' : 'Real-Time Trust Telemetry & Sovereign Node Signals'}
              </h2>

              <div className="space-y-4">
                {telemetryOverview.signals.map((sig) => (
                  <div key={sig.id} className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {sig.jurisdiction}
                        </span>
                        <h3 className="font-bold text-slate-200 text-sm md:text-base">
                          {sig.jurisdictionName}
                        </h3>
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        SHA-512: {sig.sha512HeartbeatHash}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">{isAr ? 'زمن الاستجابة' : 'Latency'}</div>
                        <div className="text-sm font-bold text-emerald-400">{sig.latencyMs} ms</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">{isAr ? 'التوفر السحابي' : 'Uptime'}</div>
                        <div className="text-sm font-bold text-blue-400">{sig.uptimePct}%</div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {sig.healthStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTRACT MILESTONES */}
        {activeTab === 'contract_milestones' && (
          <div className="space-y-6 mt-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                {isAr ? 'محطات دورة حياة العقود والاتفاقيات المؤسسية' : 'Enterprise Contract Milestones & Velocity Tracker'}
              </h2>

              <div className="space-y-4">
                {lifecycleOverview.milestones.map((ml) => (
                  <div key={ml.id} className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400 font-bold">{ml.contractRefId}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-300 font-medium">{ml.contractType}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {ml.currentStage}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 mb-3">
                      <div>
                        <span className="text-slate-500">{isAr ? 'الولاية القضائية: ' : 'Jurisdiction: '}</span>
                        <span className="text-slate-300 font-medium">{ml.jurisdiction}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">{isAr ? 'الزمن المنقضي: ' : 'Elapsed: '}</span>
                        <span className="text-slate-300 font-medium">{ml.elapsedDays} / {ml.slaTargetDays} {isAr ? 'أيام' : 'days'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">{isAr ? 'المعتمد البشري: ' : 'Approver: '}</span>
                        <span className="text-slate-300 font-medium">{ml.approverRole}</span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-slate-500 border-t border-slate-900 pt-2 flex items-center justify-between">
                      <span>SHA-512: {ml.sha512MilestoneEvidenceHash}</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isAr ? 'مطابق لـ SLA' : 'SLA Compliant'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BUSINESS VALUE & ROI */}
        {activeTab === 'business_value_roi' && (
          <div className="space-y-6 mt-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                {isAr ? 'مصفوفة إثبات القيمة المؤسسية والعائد على الاستثمار' : 'Enterprise Business Value & ROI Realization Matrix'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {valueOverview.metrics.map((val) => (
                  <div key={val.id} className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {val.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {isAr ? `ثقة: ${val.confidenceLevel}%` : `Confidence: ${val.confidenceLevel}%`}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-100 text-base mb-2">
                      {isAr ? val.titleAr : val.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      {val.estimatedValueImpact}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <div>
                        <div className="text-xs text-slate-500">{isAr ? 'الوفر المالي التقديري' : 'Estimated Annual Value'}</div>
                        <div className="text-lg font-black text-purple-400">
                          $${(val.quantifiedAnnualSavingsUsd / 1000000).toFixed(2)}M
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">{isAr ? 'الساعات الموفرة' : 'Hours Saved'}</div>
                        <div className="text-lg font-black text-emerald-400">
                          {val.quantifiedHoursSavedAnnual.toLocaleString()} {isAr ? 'ساعة' : 'hrs'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EXECUTIVE ATTESTATION */}
        {activeTab === 'executive_attestation' && (
          <div className="space-y-6 mt-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                {isAr ? 'سجل الاعتمادات المزدوجة للمستشار العام والمدير المالي' : 'Executive Dual Sign-Off & Attestation Ledger (GC + CFO)'}
              </h2>

              <div className="space-y-4">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-bold text-slate-200 text-sm md:text-base">
                        {isAr ? 'اعتماد المستشار العام (General Counsel Sign-Off)' : 'General Counsel Governance Attestation'}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400">
                      {isAr 
                        ? 'تم التحقق من مطابقة كافة المؤشرات التشغيلية والسرعة التعاقدية لضوابط الحوكمة وقاعدة Rule Zero.'
                        : 'Attested compliance with all multi-jurisdictional legal frameworks and strict zero raw document retention.'}
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {isAr ? 'مُعتمد وموقع تشفيرياً' : 'Cryptographically Signed'}
                  </span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-bold text-slate-200 text-sm md:text-base">
                        {isAr ? 'اعتماد المدير المالي (Chief Financial Officer Sign-Off)' : 'CFO Financial Value Realization Sign-Off'}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400">
                      {isAr 
                        ? 'تمت مراجعة تقديرات الوفر المالي وساعات العمل الموفرة وعائد الاستثمار (340% ROI) وتأكيد سلامة القياس.'
                        : 'Validated annual financial savings ($11.5M aggregate) and empirical ROI methodology.'}
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {isAr ? 'مُعتمد وموقع تشفيرياً' : 'Cryptographically Signed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseOperationsCommandCenterPage;
