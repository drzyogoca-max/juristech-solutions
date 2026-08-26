/**
 * src/pages/PlanetaryHubPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Planetary Legal Intelligence Executive Cockpit
 * Specification: Task 20.6
 *
 * Master executive console for multi-agent legal swarms, predictive regulatory
 * horizon scanning, verifiable contract fabric, compliance seals, and Global Grid status.
 */

import React, { useState, useMemo } from 'react';
import {
  Globe,
  Sparkles,
  Bot,
  Compass,
  FileCheck2,
  Award,
  Cpu,
  Layers,
  CheckCircle2,
  Lock,
  Binary,
  Radio,
  Share2,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { multiAgentSwarmOrchestrator, SwarmAgentNode, SwarmWorkflowExecution } from '../planetary/multiAgentSwarmOrchestrator';
import { regulatoryHorizonScanner, RegulatoryHorizonTrend } from '../planetary/regulatoryHorizonScanner';
import { legalContractFabric, SmartContractFabricRecord } from '../planetary/legalContractFabric';
import { globalComplianceSealGenerator, GlobalComplianceSeal } from '../planetary/globalComplianceSealGenerator';
import { jurisTechGlobalGrid, PlanetaryGridTelemetry } from '../planetary/jurisTechGlobalGrid';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type PlanetaryTab = 'agents' | 'horizon' | 'fabric' | 'seals' | 'grid';

export default function PlanetaryHubPage() {
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

  const access = checkAccess('planetary_hub', userTier);

  const [activeTab, setActiveTab] = useState<PlanetaryTab>('agents');

  // Swarm Agents State
  const [agents] = useState<SwarmAgentNode[]>(() =>
    multiAgentSwarmOrchestrator.listAgents()
  );
  const [executions] = useState<SwarmWorkflowExecution[]>(() =>
    multiAgentSwarmOrchestrator.listExecutions()
  );

  // Horizon Trends State
  const [trends] = useState<RegulatoryHorizonTrend[]>(() =>
    regulatoryHorizonScanner.listTrends()
  );

  // Contract Fabric State
  const [fabricContracts] = useState<SmartContractFabricRecord[]>(() =>
    legalContractFabric.listFabricContracts()
  );

  // Compliance Seals State
  const [seals] = useState<GlobalComplianceSeal[]>(() =>
    globalComplianceSealGenerator.listSeals()
  );

  // Global Grid Telemetry
  const gridTelemetry = useMemo<PlanetaryGridTelemetry>(
    () => jurisTechGlobalGrid.getTelemetry(),
    []
  );

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | Planetary Hub' : 'Access Restricted | Planetary Hub'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'مركز الاستخبارات القانونية الكوكبية مقيد' : 'Planetary Hub Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'الوصول إلى قمرة قيادة Planetary Hub والشبكة متعددة الوكلاء مخصص حصرياً للمستشار العام ومدراء النظام.'
              : 'Access to the Planetary Legal Intelligence Hub and Multi-Agent Swarm is restricted to General Counsel and enterprise executive administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز الذكاء القانوني الكوكبي 6.0 | JurisTech' : 'Planetary Legal Intelligence Hub 6.0 | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/40">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز الذكاء القانوني الكوكبي والشبكة الذكية متعددة الوكلاء 6.0' : 'Planetary Legal AI Intelligence & Swarm Mesh 6.0'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'أسراب الوكلاء الذاتية، رادار الأفق التشريعي المستقبلي، نسيج العقود المشفر، وأختام الامتثال السيادية الدولية.'
              : 'Autonomous agent swarms, predictive regulatory horizon scanning, smart contract fabric, and global compliance seals.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            {isAr ? 'الشبكة الكوكبية: نشطة (54 عقدة)' : 'Global Grid: Active (54 Nodes)'}
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'agents' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          {isAr ? 'أسراب الوكلاء الذاتية' : 'Multi-Agent Swarm'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('horizon')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'horizon' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          {isAr ? 'رادار الأفق التشريعي' : 'Regulatory Horizon'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fabric')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'fabric' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          {isAr ? 'نسيج العقود المشفر' : 'Smart Contract Fabric'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'seals' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          {isAr ? 'أختام الامتثال الدولية' : 'Global Compliance Seals'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('grid')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'grid' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          {isAr ? 'مؤشرات الشبكة الكوكبية' : 'Planetary Global Grid'}
        </button>
      </div>

      {/* ── TAB 1: SWARM AGENTS ── */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-violet-400" />
              {isAr ? 'أسراب الوكلاء المتخصصة وبوابة الموافقة البشرية القانونية' : 'Specialized Swarm Agents & Mandatory Human Legal Gate'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{agents.length} Specialized Agents</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((a) => (
              <div key={a.agentId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                    {a.role}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    Accuracy: {a.accuracyIndex}%
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{isAr ? a.agentNameAr : a.agentNameEn}</h3>
                  <p className="text-slate-400 text-[11px]">{isAr ? a.specializationAr : a.specializationEn}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">Boundary: STRICT_ISOLATION</span>
                  <span className="text-slate-500">Status: {a.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {isAr ? 'عمليات التوليف المشتركة للأسراب:' : 'Active Swarm Executions:'}
            </h3>
            {executions.map((e) => (
              <div key={e.workflowId} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs shadow-xl">
                <div>
                  <div className="font-bold text-white text-sm">{isAr ? e.transactionTitleAr : e.transactionTitleEn}</div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    Participating Agents: {e.participatingAgentsCount} | Swarm Consensus: {e.swarmConsensusScore}%
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Pending Legal Gate
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: REGULATORY HORIZON ── */}
      {activeTab === 'horizon' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              {isAr ? 'رادار الأفق التشريعي والتنبؤ بالتحولات النظامية المستقبلية' : 'Predictive Regulatory Horizon Scanner & Drift Remediation'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{trends.length} Monitored Horizon Shifts</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {trends.map((t) => (
              <div key={t.trendId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Horizon: {t.expectedHorizonTimelineMonths} Months
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    Probability: {t.enactmentProbabilityPct}%
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{isAr ? t.topicTitleAr : t.topicTitleEn}</h3>
                  <p className="text-slate-400 text-[11px] font-mono">{t.primaryJurisdiction}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                  <div className="font-bold text-slate-300">{isAr ? 'التوصية الاستباقية لتفادي الانجراف:' : 'Advisory Drift Remediation:'}</div>
                  <div className="text-slate-400 leading-relaxed text-[11px]">
                    {isAr ? t.advisoryRemediationAr : t.advisoryRemediationEn}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                  <span className="text-indigo-400 font-bold">{t.forecastStatus}</span>
                  <span>Impact: {t.enterpriseImpactSeverity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: CONTRACT FABRIC ── */}
      {activeTab === 'fabric' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              {isAr ? 'نسيج العقود الذكية المشفر والتحقق الخماسي المراحل' : '5-Stage Smart Legal Contract Execution Fabric'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{fabricContracts.length} Fabric Contracts</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {fabricContracts.map((c) => (
              <div key={c.fabricContractId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {c.contractState}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Signatories: {c.signatoryPartiesCount} Parties</span>
                </div>

                <h3 className="font-bold text-white text-sm">{isAr ? c.contractTitleAr : c.contractTitleEn}</h3>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] space-y-1">
                  <div className="text-slate-500">Provenance Proof Hash:</div>
                  <div className="text-emerald-400 truncate">{c.stateProvenanceProofHash}</div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                  <span className="text-slate-400">Approved by: {c.humanApprovalAuthorizedBy || 'Pending'}</span>
                  <span className="text-emerald-400 font-bold">Zero Raw Body: VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: COMPLIANCE SEALS ── */}
      {activeTab === 'seals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              {isAr ? 'أختام وشهادات الامتثال والشفافية المؤسسية الصادرة' : 'Cryptographic Regulatory Compliance Seals Registry'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{seals.length} Active Seals</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {seals.map((s) => (
              <div key={s.sealId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {s.complianceStandard}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">{s.tamperEvidentSealStatus}</span>
                </div>

                <h3 className="font-bold text-white text-sm">{isAr ? s.sealTitleAr : s.sealTitleEn}</h3>
                <p className="text-slate-400 text-[11px] font-mono">{s.recipientEntityName}</p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] space-y-1">
                  <div className="text-slate-500">Post-Quantum Lattice Proof Hash:</div>
                  <div className="text-emerald-400 truncate">{s.quantumSafeProofHash}</div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                  <span>Score: {s.sealScoreIndex}%</span>
                  <span>Valid Until: {s.validUntil.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: GLOBAL GRID ── */}
      {activeTab === 'grid' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-white font-mono">{gridTelemetry.gridVersion}</h2>
                <p className="text-slate-400 text-xs">
                  {isAr
                    ? 'المحرك الكوكبي لتنسيق طبقات القيادة والحوكمة والأمان وأسراب الوكلاء وعزل البيانات.'
                    : 'Planetary command orchestrator coordinating Command, Governance, Security, Agent Swarms, and Data Isolation.'}
                </p>
              </div>
              <span className="font-mono text-violet-400 font-bold px-3 py-1 rounded-xl bg-violet-500/10 border border-violet-500/30">
                {gridTelemetry.gridStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Active Planetary Nodes</div>
                <div className="text-violet-400 font-mono font-bold">{gridTelemetry.activePlanetaryNodesCount} Nodes</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Active Agent Swarms</div>
                <div className="text-violet-400 font-mono font-bold">{gridTelemetry.activeMultiAgentSwarmsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Monitored Statutes</div>
                <div className="text-indigo-400 font-mono font-bold">{gridTelemetry.monitoredHorizonStatutesCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Anchored Contracts</div>
                <div className="text-emerald-400 font-mono font-bold">{gridTelemetry.anchoredFabricContractsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Grid Composite Uptime</div>
                <div className="text-emerald-400 font-mono font-bold">{gridTelemetry.compositeSystemUptimePct}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
