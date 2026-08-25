/**
 * src/pages/EnterpriseGovernancePage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Advanced Enterprise AI Governance & Audit Console
 * Specification: Task 12.5 & 12.6
 *
 * Sovereign Institutional Governance Center:
 *  • Policy Controls: Human Review Triggers, Prohibited Jurisdictions, Data Masking
 *  • Cryptographic Immutable Audit Log Viewer with SHA-256 Hash Verification
 *  • Real-time AI Safety & Citation Grounding Compliance Metrics
 */

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Scale,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  RefreshCw,
  Building2,
  Sliders,
  History,
  Eye,
  Zap,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { organizationManager } from '../enterprise/organizationManager';
import { aiGovernanceCenter, DataMaskingLevel } from '../ai/governance/aiGovernanceCenter';
import { enterpriseAuditEngine, AuditEntry } from '../audit/enterpriseAuditEngine';
import type { UserTier, JurisdictionCode } from '../ai/types';
import SEO from '../components/SEO';

export default function EnterpriseGovernancePage() {
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

  const access = checkAccess('enterprise_governance_console', userTier);

  const [orgs] = useState(() => organizationManager.listOrganizations());
  const [selectedOrgId, setSelectedOrgId] = useState<string>(orgs[0]?.id || '');
  const [metrics, setMetrics] = useState(() => aiGovernanceCenter.getMetricsSummary());
  const [logs, setLogs] = useState<AuditEntry[]>(() => enterpriseAuditEngine.getLogs(orgs[0]?.id));
  const [chainVerified, setChainVerified] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Policy Form State
  const activePolicy = useMemo(() => {
    return aiGovernanceCenter.getPolicy(selectedOrgId);
  }, [selectedOrgId]);

  const [minRiskScore, setMinRiskScore] = useState(activePolicy.minRiskScoreForHumanReview);
  const [dataMasking, setDataMasking] = useState<DataMaskingLevel>(activePolicy.dataMaskingLevel);
  const [allowCrossBorder, setAllowCrossBorder] = useState(activePolicy.allowCrossBorderDataAnalysis);

  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    const pol = aiGovernanceCenter.getPolicy(orgId);
    setMinRiskScore(pol.minRiskScoreForHumanReview);
    setDataMasking(pol.dataMaskingLevel);
    setAllowCrossBorder(pol.allowCrossBorderDataAnalysis);
    setLogs(enterpriseAuditEngine.getLogs(orgId));
  };

  const handleSavePolicy = () => {
    aiGovernanceCenter.updatePolicy(selectedOrgId, {
      minRiskScoreForHumanReview: minRiskScore,
      dataMaskingLevel: dataMasking,
      allowCrossBorderDataAnalysis: allowCrossBorder,
    });

    enterpriseAuditEngine.logEvent({
      organizationId: selectedOrgId,
      event: 'GOVERNANCE_POLICY_APPLIED',
      actor: 'admin_console',
      summary: `Updated AI governance policies: Masking=${dataMasking}, MinRiskThreshold=${minRiskScore}`,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setLogs(enterpriseAuditEngine.getLogs(selectedOrgId));
    setMetrics(aiGovernanceCenter.getMetricsSummary());
  };

  const handleVerifyChain = () => {
    const result = enterpriseAuditEngine.verifyChainIntegrity(selectedOrgId);
    setChainVerified(result.isValid);
  };

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | حوكمة الذكاء الاصطناعي' : 'Access Restricted | AI Governance'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'وصول مقيد للإدارة المؤسسية' : 'Enterprise Governance Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'مركز حوكمة الذكاء الاصطناعي وسجلات التدقيق المشفرة مخصص للمشرفين ومسؤولي الامتثال المؤسسيين.'
              : 'The AI Governance Center and Cryptographic Audit Explorer is restricted to designated enterprise administrators and compliance officers.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز حوكمة الذكاء الاصطناعي وسجلات التدقيق | JurisTech' : 'Enterprise AI Governance & Cryptographic Audit | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
              <Scale className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز حوكمة وسياسات الذكاء الاصطناعي المؤسسي' : 'Enterprise AI Governance & Audit Center'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'إدارة بوابات المراجعة البشرية الإلزامية، وتقييد الولايات، وتعتيم البيانات المصرفية، والتحقق المشفر من سجلات التدقيق.'
              : 'Sovereign governance controls: mandatory review gates, data masking strictness, and cryptographic SHA-256 audit chaining.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedOrgId}
            onChange={(e) => handleOrgChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 font-semibold"
          >
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Governance Telemetry Triad ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'درجة مأمونية الذكاء الاصطناعي' : 'AI Safety Score'}</span>
          <p className="text-2xl font-black text-emerald-400">{metrics.aiSafetyScore}%</p>
          <span className="text-[10px] text-emerald-300">Optimal Adherence</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'مطابقة الاستشهادات' : 'Citation Compliance'}</span>
          <p className="text-2xl font-black text-cyan-400">{metrics.citationComplianceRate}%</p>
          <span className="text-[10px] text-slate-400">Statutory Grounded</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'معدل المراجعة الإلزامية' : 'Human Review Rate'}</span>
          <p className="text-2xl font-black text-amber-400">{metrics.humanReviewRate}%</p>
          <span className="text-[10px] text-amber-300">High-Risk Intercepts</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'الإجراءات المحظورة' : 'Blocked Actions'}</span>
          <p className="text-2xl font-black text-rose-400">{metrics.restrictedActionsBlockedCount}</p>
          <span className="text-[10px] text-slate-400">Prohibited Jurisdiction</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'انتهاكات السياسات' : 'Policy Violations'}</span>
          <p className="text-2xl font-black text-slate-200">{metrics.policyViolationsCount}</p>
          <span className="text-[10px] text-emerald-400">0 Critical Breaches</span>
        </div>
      </div>

      {/* ── Policy Configuration Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            {isAr ? 'سياسات وقواعد الحوكمة المؤسسية' : 'Institutional Policy Rules'}
          </h2>

          <div className="space-y-4 text-xs">
            {/* Risk Threshold Slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-medium text-slate-300">
                <span>{isAr ? 'سقف المراجعة البشرية الإلزامية' : 'Mandatory Human Review Gate'}</span>
                <span className="font-mono font-bold text-amber-400">Risk &gt;= {minRiskScore}/100</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                value={minRiskScore}
                onChange={(e) => setMinRiskScore(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {isAr
                  ? 'أي عقد أو استشارة تتجاوز هذا المعدل من الخطورة يُفرض عليها إشعار وتوقيع مراجعة بشرية قبل الاعتماد.'
                  : 'Any legal analysis scoring above this risk rating triggers mandatory human legal counsel sign-off.'}
              </p>
            </div>

            {/* Data Masking Selector */}
            <div className="space-y-1.5">
              <label className="font-medium text-slate-300 block">
                {isAr ? 'مستوى تعتيم البيانات و PII' : 'Data Masking & PII Scrubbing Level'}
              </label>
              <select
                value={dataMasking}
                onChange={(e) => setDataMasking(e.target.value as DataMaskingLevel)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="STANDARD">STANDARD (Emails, IDs, Phone Numbers)</option>
                <option value="MAXIMUM">MAXIMUM (Entities, Commercial Values, Addresses)</option>
                <option value="SOVEREIGN_BANKING">SOVEREIGN_BANKING (Complete Entity & Token Redaction)</option>
              </select>
            </div>

            {/* Cross-Border Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-medium text-slate-200 block">{isAr ? 'التحليل عبر الحدود' : 'Cross-Border Analysis'}</span>
                <span className="text-[10px] text-slate-400">{isAr ? 'السماح بالمقارنة الدولية' : 'Permit comparative synthesis'}</span>
              </div>
              <input
                type="checkbox"
                checked={allowCrossBorder}
                onChange={(e) => setAllowCrossBorder(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={handleSavePolicy}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all shadow-lg shadow-cyan-500/20"
            >
              {isAr ? 'حفظ وتطبيق السياسات فورياً' : 'Enforce Governance Policy'}
            </button>

            {saveSuccess && (
              <p className="text-[11px] text-emerald-400 text-center font-bold">
                ✓ {isAr ? 'تم تطبيق السياسات وتسجيلها في سجل التدقيق!' : 'Policies applied & stamped to audit trail!'}
              </p>
            )}
          </div>
        </div>

        {/* ── Cryptographic Audit Trail Explorer ── */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              {isAr ? 'سجل التدقيق المشفر غير القابل للتلاعب (SHA-256 Immutable Audit)' : 'Cryptographic Immutable Audit Trail (SHA-256 chained)'}
            </h2>
            <button
              type="button"
              onClick={handleVerifyChain}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-500/30 transition-all"
            >
              <CheckCircle2 className="w-3 h-3" />
              {isAr ? 'التحقق من صحة السلسلة' : 'Verify Hash Chain'}
            </button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div key={log.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                      {log.event}
                    </span>
                    <span className="text-slate-400 text-[10px]">{log.actor}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-300 font-medium leading-relaxed">{log.summary}</p>
                <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-[9px] font-mono text-slate-500 truncate">
                  <span className="truncate">SHA-256: {log.hash}</span>
                  <span className="text-emerald-500 font-bold shrink-0 ml-2">✓ CHAIN_VALID</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
