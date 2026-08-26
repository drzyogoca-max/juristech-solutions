/**
 * src/pages/OperationsCenterPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Operations & Governance Cockpit
 * Specification: Task 21.6
 *
 * Executive cockpit for production observability, adversarial security audits,
 * enterprise governance playbooks, deployment runbooks, and audit evidence vaults.
 */

import React, { useState, useMemo } from 'react';
import {
  Activity,
  ShieldAlert,
  BookOpen,
  Server,
  FileCheck,
  CheckCircle2,
  Lock,
  Zap,
  Clock,
  HardDrive,
  Cpu,
  Layers,
  FileText,
  KeyRound,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { productionObservabilityCenter, SystemTelemetryMetrics, ServiceHealthNode } from '../operations/telemetry/productionObservabilityCenter';
import { adversarialSecurityCenter, AdversarialSecuritySuite } from '../operations/security/adversarialSecurityCenter';
import { independentAuditPreparation, AuditEvidencePackage } from '../audit/independentAuditPreparation';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type OpsTab = 'observability' | 'adversarial' | 'governance' | 'deployment' | 'audit';

export default function OperationsCenterPage() {
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

  const access = checkAccess('operations_center', userTier);

  const [activeTab, setActiveTab] = useState<OpsTab>('observability');

  // Observability State
  const telemetry = useMemo<SystemTelemetryMetrics>(
    () => productionObservabilityCenter.getTelemetryMetrics(),
    []
  );
  const [services] = useState<ServiceHealthNode[]>(() =>
    productionObservabilityCenter.listServiceNodes()
  );

  // Adversarial Security State
  const [securitySuites] = useState<AdversarialSecuritySuite[]>(() =>
    adversarialSecurityCenter.listSecuritySuites()
  );

  // Audit Packages State
  const [auditPackages] = useState<AuditEvidencePackage[]>(() =>
    independentAuditPreparation.listPackages()
  );

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | Operations Center' : 'Access Restricted | Operations Center'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'مركز العمليات والحوكمة المؤسسية مقيد' : 'Operations Center Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'الوصول إلى قمرة قيادة العمليات والحوكمة المتقدمة مخصص حصرياً للمستشار العام ومدراء النظام التنفيذيين.'
              : 'Access to the Operations & Enterprise Governance Cockpit is restricted to General Counsel and enterprise executive administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز العمليات والحوكمة المؤسسية | JurisTech' : 'Enterprise Operations & Governance Center | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز النضج التشغيلي والحوكمة المؤسسية 7.0' : 'Enterprise Operational Maturity & Governance Center 7.0'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'الرؤية الميدانية الشاملة، اختبارات الأمان العدائية، أدلة الحوكمة، حزم النشر السيادية، وخزينة التدقيق المستقل.'
              : 'Production observability telemetry, adversarial security hardening, governance playbooks, and independent audit vaults.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isAr ? 'جاهزية الـ SLA: 99.999%' : 'SLA Readiness: 99.999%'}
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('observability')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'observability' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          {isAr ? 'المراقبة ومقاييس الأداء' : 'Production Observability'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('adversarial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'adversarial' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          {isAr ? 'اختبارات الأمان العدائية' : 'Adversarial Security'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('governance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'governance' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          {isAr ? 'أدلة وسياسات الحوكمة' : 'Governance Playbooks'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('deployment')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'deployment' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          {isAr ? 'حزم النشر والـ SLA' : 'Enterprise Deployment'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'audit' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          {isAr ? 'خزينة التدقيق المستقل' : 'Audit Evidence Vault'}
        </button>
      </div>

      {/* ── TAB 1: OBSERVABILITY ── */}
      {activeTab === 'observability' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">P95 / P99 Latency</div>
              <div className="text-emerald-400 font-mono font-bold text-base">{telemetry.p95LatencyMs}ms / {telemetry.p99LatencyMs}ms</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Active Pipelines</div>
              <div className="text-violet-400 font-mono font-bold text-base">{telemetry.activeConcurrentPipelines} Active</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Memory Utilization</div>
              <div className="text-cyan-400 font-mono font-bold text-base">{telemetry.memoryUtilizationPct}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Composite Availability</div>
              <div className="text-emerald-400 font-mono font-bold text-base">{telemetry.compositeAvailabilityPct}%</div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {isAr ? 'حالة الخدمات الأساسية والجاهزية خلال 90 يوماً:' : 'Core Services Health & 90-Day Uptime:'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.serviceId} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">{s.category}</span>
                    <span className="text-emerald-400 font-mono text-[10px] font-bold">90D Uptime: {s.uptime90DaysPct}%</span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{isAr ? s.serviceNameAr : s.serviceNameEn}</h3>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                    <span>Latency: {s.latencyMs}ms</span>
                    <span className="text-emerald-400 font-bold">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: ADVERSARIAL SECURITY ── */}
      {activeTab === 'adversarial' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              {isAr ? 'محاكاة الهجمات العدائية وفحص مناعة المنظومة' : 'Adversarial Penetration Suites & Immunity Verification'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">Detection & Alert Only</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {securitySuites.map((suite) => (
              <div key={suite.suiteId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    {suite.category}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    {suite.defenseStatus}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm">{isAr ? suite.suiteNameAr : suite.suiteNameEn}</h3>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-500 text-[10px]">{isAr ? 'حمولة الهجوم المحاكاة:' : 'Simulated Attack Payload:'}</div>
                  <div className="text-rose-400 font-mono text-[11px] truncate">
                    {isAr ? suite.attackPayloadSampleAr : suite.attackPayloadSampleEn}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Mitigation: {suite.mitigationLayer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: GOVERNANCE PLAYBOOKS ── */}
      {activeTab === 'governance' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            {isAr ? 'أدلة التوافق والحوكمة المؤسسية المعتمدة' : 'Enterprise AI Governance Framework & Policies'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <FileText className="w-4 h-4" />
                AI Governance Playbook
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isAr
                  ? 'دليل حوكمة الذكاء الاصطناعي المؤسسي، بوابات الموافقة البشرية الإلزامية، ومواءمة أنظمة سدايا والذكاء الأوروبي.'
                  : 'Enterprise AI Governance Playbook, mandatory human approval gates, and SDAIA / EU AI Act alignment.'}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-indigo-300">
                Path: docs/governance/AI_GOVERNANCE_PLAYBOOK.md
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <HardDrive className="w-4 h-4" />
                Data Retention Policy
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isAr
                  ? 'سياسة عدم الاحتفاظ بالوثائق الخام، التفريغ التلقائي للذاكرة المؤقتة، والاعتماد الحصري على إثباتات التجزئة التشفيرية.'
                  : 'Zero-knowledge data retention policy, ephemeral volatile RAM buffers, and cryptographic hash proof storage.'}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-300">
                Path: docs/governance/DATA_RETENTION_POLICY.md
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                Incident Response Procedure
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isAr
                  ? 'إجراءات الاستجابة للحوادث الأمنية والتشغيلية وفق تصنيف SEV-1 إلى SEV-4 وبروتوكول التحقيق الجنائي التشفيري.'
                  : 'Security & AI incident response lifecycle, SEV-1 to SEV-4 classification, and cryptographic forensic audit.'}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-amber-300">
                Path: docs/governance/INCIDENT_RESPONSE_PROCEDURE.md
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: DEPLOYMENT & SLA ── */}
      {activeTab === 'deployment' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            {isAr ? 'حزم النشر للمؤسسات واتفاقيات مستوى الخدمة' : 'Enterprise Sovereign Deployment Packages & SLAs'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Server className="w-4 h-4" />
                Private VPC Runbook
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isAr
                  ? 'كتيب تشغيل ونشر البنية السحابية السيادية المنعزلة لفرق الـ DevOps والأمن السيبراني.'
                  : 'Step-by-step runbook for deploying isolated Sovereign Private VPCs across AWS, Google Cloud, and Azure.'}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-cyan-300">
                Path: deployment/PRIVATE_VPC_RUNBOOK.md
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl text-xs">
              <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
                <KeyRound className="w-4 h-4" />
                Air-Gapped Deployment Guide
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isAr
                  ? 'دليل تشغيل المنظومة الكاملة في بيئات منقطعة كلياً عن الإنترنت للجهات السيادية والحكومية الحساسة.'
                  : 'Air-gapped deployment architecture for 100% disconnected national security and government installations.'}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-violet-300">
                Path: deployment/AIR_GAPPED_DEPLOYMENT_GUIDE.md
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Enterprise SLA Template
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isAr
                  ? 'نموذج اتفاقية مستوى الخدمة المؤسسية المعتمدة مع ضمان جاهزية 99.999% وزمن استجابة أقل من 20ms.'
                  : 'Enterprise Platinum SLA template with 99.999% uptime commitment and sub-20ms P95 latency guarantee.'}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-300">
                Path: deployment/ENTERPRISE_SLA_TEMPLATE.md
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: AUDIT EVIDENCE VAULT ── */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              {isAr ? 'خزينة حزم إثباتات التدقيق التشفيرية المستقلة' : 'Independent Audit Evidence Vault'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">Proof Generated != Data Stored</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {auditPackages.map((pkg) => (
              <div key={pkg.packageId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {pkg.standardCategory}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    Score: {pkg.auditReadinessScorePct}%
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm">{isAr ? pkg.packageTitleAr : pkg.packageTitleEn}</h3>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] space-y-1">
                  <div className="text-slate-500">Cryptographic Proof Hash:</div>
                  <div className="text-emerald-400 truncate">{pkg.cryptographicProofHash}</div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Evidence Items: {pkg.evidenceItemsCount}</span>
                  <span className="text-emerald-400 font-bold">{pkg.verificationStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
