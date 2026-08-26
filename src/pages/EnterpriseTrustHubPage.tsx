/**
 * src/pages/EnterpriseTrustHubPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Executive Enterprise Trust Hub
 * Specification: Task 22.6
 *
 * Executive cockpit for enterprise procurement management, certification evidence
 * generation, customer onboarding tracking, and trust posture analytics.
 */

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  FileSpreadsheet,
  Lock,
  CheckCircle2,
  Clock,
  HardDrive,
  FileCheck,
  Server,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { enterpriseTrustCenter, EnterpriseTrustPostureReport } from '../trust/enterpriseTrustCenter';
import { certificationEvidenceAutomation, AutomatedEvidenceBundle } from '../trust/certificationEvidenceAutomation';
import { enterpriseOnboardingFramework, EnterpriseOnboardingPipeline } from '../trust/enterpriseOnboardingFramework';
import { enterpriseProcurementPackage, SecurityQuestionnaireMappingItem } from '../trust/enterpriseProcurementPackage';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type TrustHubTab = 'posture' | 'evidence' | 'onboarding' | 'procurement';

export default function EnterpriseTrustHubPage() {
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

  const access = checkAccess('trust_hub', userTier);

  const [activeTab, setActiveTab] = useState<TrustHubTab>('posture');

  const report = useMemo<EnterpriseTrustPostureReport>(() => enterpriseTrustCenter.getTrustPostureReport(), []);
  const [bundles] = useState<AutomatedEvidenceBundle[]>(() => certificationEvidenceAutomation.listBundles());
  const [pipelines] = useState<EnterpriseOnboardingPipeline[]>(() => enterpriseOnboardingFramework.listPipelines());
  const [questions] = useState<SecurityQuestionnaireMappingItem[]>(() => enterpriseProcurementPackage.listQuestionnaireItems());

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | Trust Hub' : 'Access Restricted | Trust Hub'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'مركز الثقة المؤسسية مقيد' : 'Enterprise Trust Hub Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'الوصول إلى قمرة قيادة الثقة والاعتمادات المؤسسية مخصص حصرياً للمستشار العام ومدراء النظام.'
              : 'Access to the Enterprise Trust Hub is restricted to General Counsel and enterprise executive administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز الثقة والاعتمادات المؤسسية | JurisTech' : 'Enterprise Trust & Procurement Hub | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز الثقة والاعتمادات والمشتريات المؤسسية 8.0' : 'Enterprise Trust, Certification & Procurement Hub 8.0'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'إدارة إثباتات الامتثال، استبيانات الأمان (SIG/CAIQ)، متابعة إدخال العملاء، وتوليد حزم التدقيق المعتمدة.'
              : 'Compliance evidence automation, SIG / CAIQ procurement mappings, enterprise onboarding tracking, and trust posture analytics.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isAr ? 'مؤشر الثقة: 99.8%' : 'Trust Index: 99.8%'}
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('posture')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'posture' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          {isAr ? 'مؤشرات الثقة والامتثال' : 'Trust & Compliance Posture'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'evidence' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          {isAr ? 'أتمتة حزم الأدلة' : 'Evidence Automation'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('onboarding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'onboarding' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          {isAr ? 'إدخال كبرى المؤسسات' : 'Enterprise Onboarding'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('procurement')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'procurement' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          {isAr ? 'استبيانات المشتريات SIG/CAIQ' : 'Procurement RFP Mappings'}
        </button>
      </div>

      {/* ── TAB 1: POSTURE ── */}
      {activeTab === 'posture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.frameworks.map((fw) => (
              <div key={fw.frameworkId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {fw.authority}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">
                    {fw.alignmentScorePct}% {fw.status}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? fw.frameworkNameAr : fw.frameworkNameEn}</h3>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] space-y-1">
                  <div className="text-slate-500">Cryptographic Attestation Hash:</div>
                  <div className="text-emerald-400 truncate">{fw.cryptographicProofHash}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: EVIDENCE BUNDLES ── */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              {isAr ? 'حزم الأدلة التشفيرية المجهزة للتدقيق' : 'Automated Certification Evidence Bundles'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">Proof Generated != Data Stored</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {bundles.map((bundle) => (
              <div key={bundle.bundleId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {bundle.standardType}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    {bundle.readinessLevelPct}% Ready
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? bundle.bundleTitleAr : bundle.bundleTitleEn}</h3>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] space-y-1">
                  <div className="text-slate-500">Bundle Hash:</div>
                  <div className="text-emerald-400 truncate">{bundle.cryptographicBundleHash}</div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Controls: {bundle.controlCount}</span>
                  <span className="text-amber-400">Auditor Review Required</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: ONBOARDING PIPELINE ── */}
      {activeTab === 'onboarding' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            {isAr ? 'مسار إدخال واعتماد المؤسسات الكبرى' : 'Active Enterprise Onboarding Pipelines'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pipelines.map((pipe) => (
              <div key={pipe.pipelineId} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    {pipe.targetDeploymentTier}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">{pipe.progressPct}%</span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? pipe.enterpriseNameAr : pipe.enterpriseNameEn}</h3>
                <div className="space-y-1 text-slate-400 text-[11px]">
                  <div>Phase: <span className="text-cyan-400 font-mono font-bold">{pipe.currentPhase}</span></div>
                  <div>Namespace: <span className="text-slate-300 font-mono text-[10px]">{pipe.tenantNamespace}</span></div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Counsel Sign-off: {pipe.humanSignOffApproved ? 'APPROVED' : 'PENDING'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: PROCUREMENT RFP ANSWERS ── */}
      {activeTab === 'procurement' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              {isAr ? 'مصفوفة إجابات الاستبيانات الأمنية SIG Lite / CSA CAIQ' : 'Pre-Mapped Security Questionnaire Responses'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">Answer Assistance Only</span>
          </div>

          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.questionId} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {q.standardReference} • {q.category}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">Verified Answer</span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? q.questionTextAr : q.questionTextEn}</h3>
                <p className="text-slate-300 text-xs leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  {isAr ? q.verifiedResponseAr : q.verifiedResponseEn}
                </p>
                <div className="text-[10px] font-mono text-slate-500 truncate">
                  Evidence Hash: {q.verificationEvidenceHash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
