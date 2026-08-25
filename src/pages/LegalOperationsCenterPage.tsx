/**
 * src/pages/LegalOperationsCenterPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Global Legal Intelligence & Operations Command Center
 * Specification: Task 14.6
 *
 * Consolidated Institutional Legal Intelligence Dashboard:
 *  • Interactive Multi-Jurisdiction Knowledge Graph Explorer
 *  • Judicial Precedent Intelligence & Enforceability Predictor
 *  • Autonomous Multi-Agent Contract Negotiation Room Simulator
 *  • Zero-Knowledge Enterprise Legal Memory Settings
 *  • Cross-Firm Industry Benchmarking & Risk Distributions
 */

import React, { useState, useMemo } from 'react';
import {
  Network,
  Scale,
  GitPullRequest,
  Brain,
  BarChart3,
  Lock,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Building2,
  Sliders,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { legalKnowledgeGraph, KnowledgeNode } from '../network/legalKnowledgeGraph';
import { precedentIntelligence, EnforceabilityPrediction } from '../network/precedentIntelligence';
import { multiAgentNegotiationRoom, NegotiationSessionResult } from '../network/multiAgentNegotiation';
import { enterpriseMemoryLayer, EnterpriseMemoryProfile } from '../network/enterpriseMemoryLayer';
import { legalBenchmarkingEngine, IndustrySector, SectorBenchmarkReport } from '../network/legalBenchmarkingEngine';
import { organizationManager } from '../enterprise/organizationManager';
import type { UserTier, JurisdictionCode } from '../ai/types';
import SEO from '../components/SEO';

type LegalOpsTab = 'graph' | 'precedent' | 'negotiation' | 'memory' | 'benchmarks';

export default function LegalOperationsCenterPage() {
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

  const access = checkAccess('legal_ops_command_center', userTier);

  const [activeTab, setActiveTab] = useState<LegalOpsTab>('graph');
  const [orgs] = useState(() => organizationManager.listOrganizations());
  const [selectedOrgId, setSelectedOrgId] = useState<string>(orgs[0]?.id || 'org_enterprise_demo_01');

  // Knowledge Graph State
  const [graphNodes] = useState<KnowledgeNode[]>(() => legalKnowledgeGraph.listAllNodes());
  const [selectedNodeId, setSelectedNodeId] = useState<string>(graphNodes[0]?.id || '');
  const traversedResult = useMemo(() => {
    return legalKnowledgeGraph.traverseNode(selectedNodeId, 2);
  }, [selectedNodeId]);

  // Precedent Intelligence State
  const [selectedClauseType, setSelectedClauseType] = useState('Standard Liability Cap (100%)');
  const [targetJurisdiction, setTargetJurisdiction] = useState<JurisdictionCode>('SA');
  const [prediction, setPrediction] = useState<EnforceabilityPrediction>(() =>
    precedentIntelligence.predictClauseEnforceability('Standard Liability Cap (100%)', 'SA')
  );

  // Negotiation Simulator State
  const [negTopic, setNegTopic] = useState('Liquidated Damages & Liability Super-Caps in SaaS Agreement');
  const [negResult, setNegResult] = useState<NegotiationSessionResult | null>(() =>
    multiAgentNegotiationRoom.runNegotiation({ clauseTopic: 'Liquidated Damages & Liability Super-Caps in SaaS Agreement', jurisdiction: 'SA' })
  );

  // Enterprise Memory State
  const [memoryProfile, setMemoryProfile] = useState<EnterpriseMemoryProfile>(() =>
    enterpriseMemoryLayer.getMemoryProfile(selectedOrgId)
  );

  // Benchmarks State
  const [selectedSector, setSelectedSector] = useState<IndustrySector>('technology_saas');
  const sectorBenchmark = useMemo(() => {
    return legalBenchmarkingEngine.getSectorBenchmark(selectedSector);
  }, [selectedSector]);

  const handlePredict = () => {
    const res = precedentIntelligence.predictClauseEnforceability(selectedClauseType, targetJurisdiction);
    setPrediction(res);
  };

  const handleRunNegotiation = () => {
    const res = multiAgentNegotiationRoom.runNegotiation({
      clauseTopic: negTopic,
      jurisdiction: targetJurisdiction,
    });
    setNegResult(res);
  };

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | مركز العمليات القانونية' : 'Access Restricted | Legal Operations'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'وصول مقيد للإدارة القانونية العليا' : 'Legal Operations Center Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'مركز العمليات القانونية وشبكة المعرفة القضائية مخصص حصرياً للمشرفين والمستشارين القانونيين المعتمدين.'
              : 'The Global Legal Operations Command Center is strictly restricted to authorized enterprise legal administrators and senior counsel.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز العمليات القانونية وشبكة المعرفة العالمية | JurisTech' : 'Global Legal Operations Command Center | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
              <Network className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز العمليات وشبكة الذكاء القانوني العالمية' : 'Global Legal Intelligence & Operations Command Center'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'استكشاف الرسم البياني المعرفي للأنظمة، واستقراء السوابق القضائية، ومحاكاة التفاوض متعدد الوكلاء، والذاكرة المؤسسية المشفرة.'
              : 'Knowledge Graph reasoning, Precedent Intelligence, Multi-Agent Negotiation, Zero-Knowledge Memory, and Market Benchmarks.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedOrgId}
            onChange={(e) => {
              setSelectedOrgId(e.target.value);
              setMemoryProfile(enterpriseMemoryLayer.getMemoryProfile(e.target.value));
            }}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 font-semibold"
          >
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'graph' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          {isAr ? 'الرسم البياني المعرفي (Knowledge Graph)' : 'Knowledge Graph'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('precedent')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'precedent' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          {isAr ? 'استقراء السوابق القضائية' : 'Precedent Intelligence'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('negotiation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'negotiation' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          {isAr ? 'غرفة التفاوض متعددة الوكلاء' : 'Multi-Agent Negotiation'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('memory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'memory' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          {isAr ? 'الذاكرة المؤسسية (Zero-Knowledge)' : 'Enterprise Memory'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('benchmarks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'benchmarks' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          {isAr ? 'المقارنات المعيارية للقطاعات' : 'Legal Benchmarks'}
        </button>
      </div>

      {/* ── TAB 1: KNOWLEDGE GRAPH ── */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              {isAr ? 'العقد والأنظمة القانونية' : 'Knowledge Graph Nodes'}
            </h2>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {graphNodes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNodeId(n.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedNodeId === n.id
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {n.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{n.jurisdiction}</span>
                  </div>
                  <p className="font-bold text-slate-200">{isAr ? n.titleAr : n.titleEn}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              {isAr ? 'تفاصيل الروابط والعلاقات التشريعية والقضائية' : 'Statutory & Judicial Relationship Graph'}
            </h2>

            {traversedResult ? (
              <div className="space-y-5 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-300 font-mono">
                      {isAr ? traversedResult.rootNode.titleAr : traversedResult.rootNode.titleEn}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {traversedResult.rootNode.authorityLevel}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {isAr ? traversedResult.rootNode.summaryAr : traversedResult.rootNode.summaryEn}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {traversedResult.rootNode.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isAr ? 'العقد المرتبطة نظامياً وقضائياً:' : 'Connected Statutory & Judicial Nodes:'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {traversedResult.connectedNodes.map((cn) => (
                      <div key={cn.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-purple-400 font-bold">{cn.type}</span>
                          <span className="font-mono text-[10px] text-slate-500">{cn.jurisdiction}</span>
                        </div>
                        <p className="font-bold text-slate-200">{isAr ? cn.titleAr : cn.titleEn}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{isAr ? cn.summaryAr : cn.summaryEn}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs text-center py-12">{isAr ? 'اختر عقدة لعرض علاقاتها.' : 'Select a node to inspect relationships.'}</p>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: PRECEDENT INTELLIGENCE ── */}
      {activeTab === 'precedent' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400" />
              {isAr ? 'استعلام قابلية الإنفاذ القضائي' : 'Precedent Enforceability Query'}
            </h2>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-300 block">{isAr ? 'نوع البند التعاقدي' : 'Contract Clause Type'}</label>
                <select
                  value={selectedClauseType}
                  onChange={(e) => setSelectedClauseType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-purple-500 font-medium"
                >
                  <option value="Standard Liability Cap (100%)">Standard Liability Cap (100%)</option>
                  <option value="Unlimited Indemnification">Unlimited Indemnification</option>
                  <option value="Liquidated Damages (Daily Delay Penalty)">Liquidated Damages (Daily Delay Penalty)</option>
                  <option value="Non-Compete Covenant (2 Years)">Non-Compete Covenant (2 Years)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-300 block">{isAr ? 'الولاية القضائية' : 'Jurisdiction'}</label>
                <select
                  value={targetJurisdiction}
                  onChange={(e) => setTargetJurisdiction(e.target.value as JurisdictionCode)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-purple-500 font-medium"
                >
                  <option value="SA">Saudi Arabia (Commercial Courts / SCCA)</option>
                  <option value="AE">UAE / DIFC Common Law Courts</option>
                  <option value="GB">England & Wales High Court</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handlePredict}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-600/20"
              >
                {isAr ? 'تحليل السوابق القضائية' : 'Run Precedent Forecaster'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                {isAr ? 'تقرير استقراء السوابق القضائية' : 'Judicial Enforceability Analysis'}
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                prediction.enforceabilityScore > 75 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {prediction.enforceabilityScore}% Enforceability
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block">{isAr ? 'السابقة القضائية المستشهد بها:' : 'Cited Judicial Precedent:'}</span>
                <p className="font-mono text-cyan-300 text-[11px] font-bold">{prediction.primaryPrecedent.caseCitation}</p>
                <p className="text-slate-300 leading-relaxed font-medium">
                  {isAr ? prediction.primaryPrecedent.keyRulingAr : prediction.primaryPrecedent.keyRulingEn}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block">{isAr ? 'التحليل والتعليل القضائي:' : 'Judicial Rationale:'}</span>
                <p className="text-slate-400 leading-relaxed">
                  {isAr ? prediction.judicialRationaleAr : prediction.judicialRationaleEn}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 block">{isAr ? 'توصيات الصياغة لتقليل المخاطر:' : 'Drafting Mitigations:'}</span>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  {prediction.mitigationRecommendations.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: MULTI-AGENT NEGOTIATION ROOM ── */}
      {activeTab === 'negotiation' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-emerald-400" />
              {isAr ? 'محاكاة التفاوض التعاقدي الذاتي متعدد الوكلاء' : 'Multi-Agent Negotiation Simulator'}
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={negTopic}
                onChange={(e) => setNegTopic(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleRunNegotiation}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                {isAr ? 'بدء المحاكاة' : 'Simulate Negotiation'}
              </button>
            </div>
          </div>

          {negResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>{isAr ? 'سجل جولات التفاوض المتبادلة' : 'Multi-Agent Negotiation Transcript'}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Consensus Score: {negResult.consensusScore}%
                  </span>
                </h3>

                <div className="space-y-3">
                  {negResult.messages.map((m) => (
                    <div
                      key={m.turn}
                      className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                        m.agentRole === 'BUYER_COUNSEL'
                          ? 'bg-blue-950/40 border-blue-500/30'
                          : m.agentRole === 'SELLER_COUNSEL'
                          ? 'bg-purple-950/40 border-purple-500/30'
                          : 'bg-emerald-950/40 border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{m.agentName}</span>
                        <span className="font-mono text-[10px] text-slate-400">Turn {m.turn}</span>
                      </div>
                      <p className="font-mono text-slate-200 text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                        &ldquo;{m.proposedClauseText}&rdquo;
                      </p>
                      <p className="text-slate-400 text-[11px]">{isAr ? m.legalRationaleAr : m.legalRationaleEn}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {isAr ? 'الصياغة التوافقية النهائية (Final Compromise)' : 'Final Synthesized Redline Clause'}
                </h3>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <p className="text-emerald-300 font-serif leading-relaxed italic">
                    &ldquo;{isAr ? negResult.finalSynthesizedClauseAr : negResult.finalSynthesizedClauseEn}&rdquo;
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <span className="font-bold text-slate-300 block">{isAr ? 'المكاسب والتسويات المحققة:' : 'Key Harmonized Trade-offs:'}</span>
                  {negResult.keyTradeoffs.map((t, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] space-y-0.5">
                      <span className="font-bold text-cyan-400 block">{t.issue}</span>
                      <span className="text-slate-400 block">{t.resolution}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: ENTERPRISE MEMORY ── */}
      {activeTab === 'memory' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" />
              {isAr ? 'ملف الذاكرة القانونية المؤسسية (Zero-Knowledge)' : 'Zero-Knowledge Institutional Legal Memory'}
            </h2>
            <span className="text-xs font-mono text-emerald-400">Zero Raw Contract Storage Verified ✓</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">{isAr ? 'مقر التحكيم الافتراضي' : 'Default Arbitration Seat'}</span>
              <p className="text-base font-bold text-white font-mono">{memoryProfile.preferredArbitrationSeat}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">{isAr ? 'سقف المسؤولية التعاقدية' : 'Liability Cap Multiplier'}</span>
              <p className="text-base font-bold text-amber-400 font-mono">{memoryProfile.standardLiabilityCapMultiplier}x (100% Fees)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">{isAr ? 'نبرة الصياغة المؤسسية' : 'Corporate Tone Vector'}</span>
              <p className="text-base font-bold text-cyan-400 font-mono">{memoryProfile.corporateToneVector}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <span className="font-bold text-slate-300 block">{isAr ? 'القواعد التوجيهية المجردة المحفوظة:' : 'Abstract Institutional Drafting Directives:'}</span>
            {memoryProfile.abstractPreferredTerms.map((term, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono font-bold text-cyan-400 text-[10px]">{term.category}</span>
                  <p className="text-slate-200">{isAr ? term.ruleSummaryAr : term.ruleSummaryEn}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: BENCHMARKS ── */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(['technology_saas', 'energy_infrastructure', 'banking_fintech', 'construction_realestate'] as IndustrySector[]).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSector(sec)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSector === sec ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {sec.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'متوسط سقف المسؤولية' : 'Median Liability Cap'}</span>
              <p className="text-2xl font-black text-cyan-400">{sectorBenchmark.medianLiabilityCapPercent}%</p>
              <span className="text-[10px] text-slate-500">of Annual Contract Value</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'انتشار السقف الخاص (Super-Cap)' : 'Super-Cap Prevalence'}</span>
              <p className="text-2xl font-black text-purple-400">{sectorBenchmark.superCapPrevalencePercent}%</p>
              <span className="text-[10px] text-slate-500">for Data & IP breaches</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'تبني التحكيم التجاري' : 'Arbitration Adoption'}</span>
              <p className="text-2xl font-black text-emerald-400">{sectorBenchmark.arbitrationAdoptionRate}%</p>
              <span className="text-[10px] text-slate-500">vs Court Litigation</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'حجم العينة الإحصائية' : 'Sample Benchmark Size'}</span>
              <p className="text-2xl font-black text-white">{sectorBenchmark.sampleContractCount.toLocaleString()}</p>
              <span className="text-[10px] text-slate-500">Anonymized Contracts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
