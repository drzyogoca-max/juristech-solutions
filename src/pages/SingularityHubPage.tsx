/**
 * src/pages/SingularityHubPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Global Legal Intelligence Singularity Console
 * Specification: Task 18.6
 *
 * Master cockpit for cross-border treaty synthesis, self-evolving legal ontology,
 * quantum-safe zero-knowledge audit proofs, dispute simulation chamber, and Legal OS Core kernel.
 */

import React, { useState, useMemo } from 'react';
import {
  Globe,
  Sparkles,
  Layers,
  Scale,
  Shield,
  ShieldCheck,
  Cpu,
  Binary,
  Gavel,
  CheckCircle2,
  Lock,
  Play,
  Share2,
  RefreshCw,
  ExternalLink,
  Activity,
  Award,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { treatySynthesisEngine, TreatyConflictEvaluation } from '../singularity/treatySynthesisEngine';
import { legalOntologyEvolutionEngine, LegalOntologyNode, OntologyEvolutionMetrics } from '../singularity/legalOntologyEvolution';
import { zeroKnowledgeAuditProofEngine, ZeroKnowledgeAuditProof } from '../singularity/zeroKnowledgeAuditProof';
import { disputeSimulationEngine, DisputeSimulationResult } from '../singularity/disputeSimulationEngine';
import { jurisTechLegalOSCore, LegalOSKernelStatus } from '../singularity/jurisTechLegalOSCore';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type SingularityTab = 'treaties' | 'ontology' | 'zkproofs' | 'disputes' | 'kernel';

export default function SingularityHubPage() {
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

  const access = checkAccess('singularity_hub', userTier);

  const [activeTab, setActiveTab] = useState<SingularityTab>('treaties');

  // Treaties State
  const [treaties] = useState<TreatyConflictEvaluation[]>(() =>
    treatySynthesisEngine.listEvaluations()
  );

  // Ontology State
  const [ontologyNodes] = useState<LegalOntologyNode[]>(() =>
    legalOntologyEvolutionEngine.listNodes()
  );
  const ontologyMetrics = useMemo<OntologyEvolutionMetrics>(
    () => legalOntologyEvolutionEngine.getEvolutionMetrics(),
    []
  );

  // ZK Proofs State
  const [zkProofs, setZkProofs] = useState<ZeroKnowledgeAuditProof[]>(() =>
    zeroKnowledgeAuditProofEngine.listProofs()
  );
  const [newProofScopeEn, setNewProofScopeEn] = useState('');
  const [newProofScopeAr, setNewProofScopeAr] = useState('');

  // Disputes State
  const [disputes] = useState<DisputeSimulationResult[]>(() =>
    disputeSimulationEngine.listSimulations()
  );

  // Kernel State
  const kernelStatus = useMemo<LegalOSKernelStatus>(
    () => jurisTechLegalOSCore.getKernelStatus(),
    []
  );

  const handleGenerateProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProofScopeEn || !newProofScopeAr) return;
    const proof = zeroKnowledgeAuditProofEngine.generateProof({
      auditScopeEn: newProofScopeEn,
      auditScopeAr: newProofScopeAr,
      organizationId: 'org_enterprise_demo_01',
      quantumSafeAlgorithm: 'SHA-512/256_LATTICE_ZK',
    });
    setZkProofs([proof, ...zkProofs]);
    setNewProofScopeEn('');
    setNewProofScopeAr('');
  };

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | Singularity Hub' : 'Access Restricted | Singularity Hub'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'مركز سينجولارتي للذكاء القانوني مقيد' : 'Singularity Hub Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'الوصول إلى قمرة قيادة Singularity ونواة نظام التشغيل القانوني مخصص حصرياً للمستشار العام ومسؤولي الإدارة العليا.'
              : 'Access to the Legal AI Singularity Hub and Legal OS Kernel is restricted to General Counsel and enterprise executive administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز سينجولارتي للذكاء القانوني 4.0 | JurisTech' : 'Legal AI Singularity Hub 4.0 | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز سينجولارتي ونظام التشغيل القانوني الذاتي 4.0' : 'Global Legal AI Singularity & OS Hub 4.0'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'توليف المعاهدات العابرة للحدود، شبكة الأنطولوجيا القانونية، إثباتات ZK الكمومية، ومحاكاة النزاعات التجارية.'
              : 'Cross-border treaty synthesis, self-evolving legal ontology, quantum-safe ZK proofs, and dispute simulation chamber.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            {isAr ? 'نواة Legal OS: متصلة 100%' : 'Legal OS Core: Online 100%'}
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('treaties')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'treaties' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          {isAr ? 'توليف المعاهدات الدولية' : 'Treaty Intelligence'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ontology')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'ontology' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          {isAr ? 'الأنطولوجيا والمفاهيم القانونية' : 'Legal Ontology Graph'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zkproofs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'zkproofs' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          {isAr ? 'إثباتات ZK المشفرة الكمومية' : 'Quantum-Safe ZK Proofs'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'disputes' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Gavel className="w-3.5 h-3.5" />
          {isAr ? 'محاكاة النزاعات والتحكيم' : 'Dispute Simulation'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kernel')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'kernel' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          {isAr ? 'نواة تشغيل Legal OS Core' : 'Legal OS Kernel'}
        </button>
      </div>

      {/* ── TAB 1: TREATIES ── */}
      {activeTab === 'treaties' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              {isAr ? 'مصفوفة توليف المعاهدات وحل التعارض القضائي الدولي' : 'Cross-Border Treaty & Multi-Jurisdiction Synthesis'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{treaties.length} Synthesized Treaties</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {treaties.map((t) => (
              <div key={t.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {t.conflictCategory}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    Compatibility: {t.compatibilityIndex}%
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{isAr ? t.primaryTreatyAr : t.primaryTreaty}</h3>
                  <p className="text-slate-400 text-[11px] font-mono">{t.secondaryJurisdiction}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-slate-300">{isAr ? 'التوصية النظامية للقانون الحاكم:' : 'Governing Law Recommendation:'}</div>
                  <div className="text-slate-400 leading-relaxed text-[11px]">
                    {isAr ? t.governingLawRecommendationAr : t.governingLawRecommendationEn}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Counsel Approval Gate Required
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: ONTOLOGY GRAPH ── */}
      {activeTab === 'ontology' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
              <div className="text-slate-400 text-[11px]">{isAr ? 'إجمالي العقد المفاهيمية' : 'Total Concept Nodes'}</div>
              <div className="text-xl font-bold text-white font-mono">{ontologyMetrics.totalConceptualNodes}</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
              <div className="text-slate-400 text-[11px]">{isAr ? 'الروابط البينية للأنظمة' : 'Inter-Statutory Links'}</div>
              <div className="text-xl font-bold text-indigo-400 font-mono">{ontologyMetrics.totalInterStatutoryLinks}</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
              <div className="text-slate-400 text-[11px]">{isAr ? 'كثافة الشبكة الدلالية' : 'Graph Density Index'}</div>
              <div className="text-xl font-bold text-emerald-400 font-mono">{ontologyMetrics.graphDensityIndex}</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
              <div className="text-slate-400 text-[11px]">{isAr ? 'دقة الاستدلال الدلالي' : 'Semantic Accuracy'}</div>
              <div className="text-xl font-bold text-purple-400 font-mono">{ontologyMetrics.semanticAccuracyRating}%</div>
            </div>
          </div>

          <div className="space-y-3">
            {ontologyNodes.map((n) => (
              <div key={n.nodeId} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {n.evolutionStatus}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">Density: {n.semanticGraphDensity}</span>
                </div>

                <h3 className="font-bold text-white text-sm">{isAr ? n.conceptNameAr : n.conceptNameEn}</h3>
                <p className="text-slate-400 text-[11px] font-mono">{n.jurisdictionScope}</p>

                <div className="flex items-center gap-4 text-slate-500 text-[10px] font-mono pt-1 border-t border-slate-800">
                  <span>Connected Statutes: {n.connectedStatutesCount}</span>
                  <span>Precedents Anchored: {n.connectedPrecedentsCount}</span>
                  <span>Reinforced: {n.lastReinforcedAt.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: ZK PROOFS ── */}
      {activeTab === 'zkproofs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Binary className="w-4 h-4 text-emerald-400" />
              {isAr ? 'توليد إثبات ZK مشفر كمومياً جديد' : 'Generate Quantum-Safe ZK Proof'}
            </h2>

            <form onSubmit={handleGenerateProof} className="space-y-3">
              <div>
                <label className="font-medium text-slate-400 block mb-1">{isAr ? 'نطاق التدقيق (إنجليزي):' : 'Audit Scope (English):'}</label>
                <input
                  type="text"
                  value={newProofScopeEn}
                  onChange={(e) => setNewProofScopeEn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="font-medium text-slate-400 block mb-1">{isAr ? 'نطاق التدقيق (عربي):' : 'Audit Scope (Arabic):'}</label>
                <input
                  type="text"
                  value={newProofScopeAr}
                  onChange={(e) => setNewProofScopeAr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400">
                Algorithm: SHA-512/256_LATTICE_ZK (Post-Quantum Ready)
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                {isAr ? 'إصدار إثبات ZK المشفر' : 'Issue Quantum-Safe ZK Proof'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center justify-between">
              <span>{isAr ? 'سجل إثباتات التدقيق المشفرة الصادرة' : 'Verifiable Quantum-Safe Proof Registry'}</span>
              <span className="text-xs text-slate-400 font-mono">{zkProofs.length} Proofs</span>
            </h2>

            <div className="space-y-3">
              {zkProofs.map((p) => (
                <div key={p.proofId} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {p.quantumSafeAlgorithm}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">{p.tamperEvidentStatus}</span>
                  </div>

                  <h3 className="font-bold text-white text-sm">{isAr ? p.auditScopeAr : p.auditScopeEn}</h3>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] space-y-1">
                    <div className="text-emerald-400 truncate">ZK Proof Hash: {p.zkProofHash}</div>
                    <div className="text-slate-500 truncate">Verification Token: {p.zkVerificationToken}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: DISPUTES ── */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Gavel className="w-4 h-4 text-amber-400" />
              {isAr ? 'غرفة محاكاة النزاعات التجارية واحتمالات التحكيم' : 'Commercial Dispute Resolution Simulation Chamber'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{disputes.length} Active Simulations</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {disputes.map((d) => (
              <div key={d.simulationId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Forum: {d.arbitralForum}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{d.governanceComplianceStatus}</span>
                </div>

                <h3 className="font-bold text-white text-sm">{isAr ? d.matterTitleAr : d.matterTitleEn}</h3>

                <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px]">
                  <div>
                    <div className="text-slate-500 text-[10px]">Claimant Win</div>
                    <div className="text-blue-400 font-bold">{d.claimantWinProbabilityPct}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Settlement</div>
                    <div className="text-emerald-400 font-bold">{d.settlementProbabilityPct}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Respondent Win</div>
                    <div className="text-amber-400 font-bold">{d.respondentWinProbabilityPct}%</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <div className="font-bold text-slate-300">
                    {isAr ? 'نطاق التسوية المقترح (USD):' : 'Estimated Settlement Bracket (USD):'}
                  </div>
                  <div className="font-mono text-emerald-400 font-bold">
                    ${d.estimatedSettlementBracketUSD.min.toLocaleString()} — ${d.estimatedSettlementBracketUSD.optimal.toLocaleString()} — ${d.estimatedSettlementBracketUSD.max.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: KERNEL STATUS ── */}
      {activeTab === 'kernel' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-white font-mono">{kernelStatus.kernelVersion}</h2>
                <p className="text-slate-400 text-xs">
                  {isAr
                    ? 'نواة نظام التشغيل القانوني الموحدة التي تجمع كافة طبقات المعرفة والعمليات والحوكمة والسحابة والذكاء التوليدي.'
                    : 'Unified master kernel orchestrating Knowledge, Operations, Governance, Sovereign Cloud, and Singularity AI.'}
                </p>
              </div>
              <span className="font-mono text-emerald-400 font-bold px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                {kernelStatus.kernelStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Layer 1: Knowledge Graph</div>
                <div className="text-emerald-400 font-mono font-bold">{kernelStatus.globalKnowledgeGraphHealthPct}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Layer 2: Autonomous Ops</div>
                <div className="text-emerald-400 font-mono font-bold">{kernelStatus.autonomousOperationsHealthPct}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Layer 3: Governance & Radar</div>
                <div className="text-emerald-400 font-mono font-bold">{kernelStatus.governanceAndAuditHealthPct}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Layer 4: Sovereign Cloud</div>
                <div className="text-emerald-400 font-mono font-bold">{kernelStatus.sovereignCloudHealthPct}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Layer 5: Singularity Hub</div>
                <div className="text-emerald-400 font-mono font-bold">{kernelStatus.singularityIntelligenceHealthPct}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
