import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { institutionalOperatingSystemEngine } from '../enterprise/institutionalOperatingSystemEngine';
import { crossBorderGovernanceFederationEngine } from '../enterprise/crossBorderGovernanceFederationEngine';
import { continuousInstitutionalAuditFabric } from '../enterprise/continuousInstitutionalAuditFabric';
import { institutionalAttestationFabric } from '../enterprise/institutionalAttestationFabric';
import { 
  Building2, 
  Globe2, 
  ShieldCheck, 
  FileCheck, 
  Activity, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Network,
  Cpu,
  BadgeCheck,
  TrendingUp,
  Scale,
  Award
} from 'lucide-react';

type ActiveTab = 'institutional_lifecycle' | 'cross_border_federation' | 'continuous_audit_fabric' | 'longitudinal_telemetry' | 'executive_seal_registry';

export default function InstitutionalOSCommandCenterPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const [activeTab, setActiveTab] = useState<ActiveTab>('institutional_lifecycle');

  const institutionalOverview = institutionalOperatingSystemEngine.getInstitutionalOperatingSystemOverview();
  const federationOverview = crossBorderGovernanceFederationEngine.getCrossBorderFederationOverview();
  const auditOverview = continuousInstitutionalAuditFabric.getContinuousInstitutionalAuditOverview();
  const attestationOverview = institutionalAttestationFabric.getInstitutionalAttestationOverview();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 via-blue-500/20 to-emerald-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-300 via-blue-200 to-emerald-300 bg-clip-text text-transparent">
                {isAr ? 'مركز قيادة نظام التشغيل المؤسسي العالمي 17.0' : 'Institutional Legal Operating System Command Center 17.0'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {isAr 
                  ? 'إدارة دورة حياة الكيانات، اتحاد الحوكمة العابر للحدود، نسيج التدقيق المستمر، وسجل الإثباتات المؤسسية v24.0.0'
                  : 'Entity Lifecycle Coordination, Cross-Border Governance Federation, Continuous Audit Fabric & Institutional Seals v24.0.0'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Institutional Trust Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-indigo-500/30 rounded-xl px-4 py-2.5 shadow-lg shadow-indigo-950/20">
          <BadgeCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <div className="text-xs text-slate-400">{isAr ? 'مؤشر الثقة المؤسسية الشامل' : 'Institutional Trust Score'}</div>
            <div className="text-sm font-bold text-emerald-300">{attestationOverview.aggregateInstitutionalTrustScore} / 100 ({isAr ? 'سيادي معتمد' : 'Sovereign Certified'})</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('institutional_lifecycle')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'institutional_lifecycle'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Building2 className="w-4 h-4" />
          {isAr ? 'دورة حياة الكيانات المؤسسية' : 'Entity Lifecycle'}
        </button>

        <button
          onClick={() => setActiveTab('cross_border_federation')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'cross_border_federation'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Globe2 className="w-4 h-4" />
          {isAr ? 'اتحاد الحوكمة عبر الحدود' : 'Cross-Border Federation'}
        </button>

        <button
          onClick={() => setActiveTab('continuous_audit_fabric')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'continuous_audit_fabric'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          {isAr ? 'نسيج التدقيق المستمر' : 'Continuous Audit Fabric'}
        </button>

        <button
          onClick={() => setActiveTab('longitudinal_telemetry')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'longitudinal_telemetry'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <TrendingUp className="w-4 h-4" />
          {isAr ? 'التتبع المؤسسي طويل الأجل' : 'Longitudinal Telemetry'}
        </button>

        <button
          onClick={() => setActiveTab('executive_seal_registry')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'executive_seal_registry'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <FileCheck className="w-4 h-4" />
          {isAr ? 'سجل الأختام التنفيذية' : 'Executive Seals'}
        </button>
      </div>

      {/* Tab 1: Institutional Lifecycle */}
      {activeTab === 'institutional_lifecycle' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'الكيانات المؤسسية المنسقة' : 'Managed Entities'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{institutionalOverview.totalManagedEntitiesCount} {isAr ? 'كيانات مؤسسية' : 'Entities'}</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isAr ? 'عزل كامل بين المستأجرين (Zero Cross-Contamination)' : 'Strict Tenant Isolation Enforced'}
              </div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'متوسط أداء اتفاقية مستوى الخدمة' : 'Avg SLA Performance'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{institutionalOverview.averageSlaPerformancePct}%</div>
              <div className="text-xs text-slate-400 mt-2">{isAr ? 'أداء لحظي فائق الاستقرار' : 'Real-time high availability'}</div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'مؤشر الصحة المؤسسية الكلي' : 'Institutional Health'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{institutionalOverview.overallInstitutionalHealthScore}%</div>
              <div className="text-xs text-indigo-400 mt-2">{isAr ? 'تنسيق مؤسسي غير ذاتي' : 'Advisory coordination only'}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              {isAr ? 'سجل الكيانات المؤسسية وتدفقات الحوكمة المعتمدة' : 'Institutional Entity Registry & Governance Flows'}
            </h3>
            <div className="space-y-4">
              {institutionalOverview.entities.map((entity) => (
                <div key={entity.entityId} className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{entity.entityName}</div>
                      <div className="text-xs text-slate-400">{entity.entityType} • {isAr ? 'الولاية:' : 'Jurisdiction:'} <span className="text-slate-300 font-mono">{entity.jurisdictionCode}</span> • {isAr ? 'منطقة البيانات:' : 'Residency:'} <span className="text-indigo-300 font-mono">{entity.dataResidencyZone}</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">{isAr ? 'أداء الـ SLA' : 'SLA Rate'}</div>
                        <div className="text-sm font-bold text-emerald-400">{entity.slaPerformanceRatePct}%</div>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {entity.regulatoryStatus}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{isAr ? 'تاريخ آخر تدقيق:' : 'Last Audited:'} {new Date(entity.lastAuditedAt).toLocaleDateString()}</span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{entity.governanceHashSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cross-Border Federation */}
      {activeTab === 'cross_border_federation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'العقد الاتحادية الإقليمية' : 'Federated Hubs'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{federationOverview.totalFederatedHubsCount} {isAr ? 'محاور اقتصادية' : 'Economic Hubs'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط التوافق التشريعي' : 'Avg Statutory Harmony'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{federationOverview.averageStatutoryHarmonyPct}%</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'السيادة التشريعية' : 'Statutory Sovereignty'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{isAr ? 'محترمة 100%' : '100% Enforced'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {federationOverview.hubs.map((hub) => (
              <div key={hub.hubId} className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{hub.hubName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{hub.primaryJurisdiction} ({hub.jurisdictionCode})</div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                    {hub.statutoryHarmonyScorePct}% {isAr ? 'توافق' : 'Harmony'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div><span className="text-slate-300 font-medium">{isAr ? 'إلزامية الإقامة السيادية:' : 'Data Residency:'}</span> {hub.sovereignDataResidencyMandate}</div>
                  <div className="flex justify-between">
                    <span>{isAr ? 'حالة التشفير العابر للحدود:' : 'DPA Enclave Status:'}</span>
                    <span className="text-emerald-400 font-mono font-medium">{hub.crossBorderDpaEnclaveStatus}</span>
                  </div>
                  <div className="font-mono text-slate-500 truncate pt-1">{hub.crossBorderHarmonizationHashSha512}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Continuous Audit Fabric */}
      {activeTab === 'continuous_audit_fabric' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'أطر الامتثال المراقبة' : 'Monitored Frameworks'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{auditOverview.totalMonitoredFrameworksCount} {isAr ? 'أطر معيارية' : 'Frameworks'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط الجاهزية للتدقيق' : 'Avg Audit Readiness'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{auditOverview.averageAuditReadinessPct}%</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'نقاط التحكم المطابقة' : 'Passing Controls'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{auditOverview.totalPassingControlsCount} / {auditOverview.totalMonitoredControlsCount}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {isAr ? 'مصفوفة التدقيق والامتثال اللحظي المستمر' : 'Continuous Compliance & Audit Frameworks Matrix'}
            </h3>
            <div className="space-y-4">
              {auditOverview.frameworks.map((fw) => (
                <div key={fw.frameworkCode} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{fw.frameworkTitle}</div>
                      <div className="text-xs text-slate-400">{fw.frameworkCode} • {fw.passingControlPointsCount}/{fw.monitoredControlPointsCount} {isAr ? 'ضوابط محققة' : 'Controls Passing'}</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      {fw.auditReadinessPct}% {isAr ? 'جاهزية' : 'Readiness'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{isAr ? 'حالة المراقبة المستمرة:' : 'Status:'} <span className="text-indigo-300 font-medium">{fw.continuousObservabilityStatus}</span></span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{fw.cryptographicAuditDigestSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Longitudinal Telemetry */}
      {activeTab === 'longitudinal_telemetry' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              {isAr ? 'التتبع الحوكمي والتشغيلي طويل الأجل والمبادئ الحاكمة' : 'Longitudinal Institutional Telemetry & Guiding Principles'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                <div className="font-bold text-indigo-300">{isAr ? 'المبدأ الحاكم الأول: انعدام الصلاحية الذاتية' : 'Invariant 1: No Autonomous Authority'}</div>
                <p className="text-slate-400">
                  {isAr 
                    ? 'نظام التشغيل المؤسسي ينسق ويوفر الرؤية الاسترشادية الشاملة ولا يتخذ أي إجراء قانوني أو تنفيذي أو مالي ذاتي دون توقيع بشري تنفيذي معتمد.'
                    : 'The Institutional OS coordinates and provides comprehensive observability without autonomous execution authority.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                <div className="font-bold text-indigo-300">{isAr ? 'المبدأ الحاكم الثاني: عزل البيانات وانعدام التخزين' : 'Invariant 2: Zero Data Exploitation & Zero Retention'}</div>
                <p className="text-slate-400">
                  {isAr 
                    ? 'لا يتم الاحتفاظ بأي مستندات قانونية خام أو عقود عملاء سرية؛ التدقيق والاعتماد يعتمد كلياً على الإثباتات والبصمات التشفيرية المشفرة.'
                    : 'Zero raw legal documents or confidential customer contracts are persisted; all compliance audits rely on cryptographic digests.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Executive Seal Registry */}
      {activeTab === 'executive_seal_registry' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              {isAr ? 'سجل الأختام التشفيرية والاعتماد التنفيذي المزدوج v24.0.0' : 'Institutional Seals Registry & Dual Executive Verification'}
            </h3>
            <div className="space-y-4">
              {attestationOverview.records.map((rec) => (
                <div key={rec.attestationId} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{rec.attestationTitle}</div>
                      <div className="text-xs text-slate-400">{rec.attestingExecutiveCounsel} & {rec.attestingRiskOfficer} • {rec.scopeDomain}</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      {rec.sealStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{isAr ? 'التاريخ والوقت:' : 'Timestamp:'} {new Date(rec.attestationTimestamp).toUTCString()}</span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{rec.verificationHashSha512}</span>
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
