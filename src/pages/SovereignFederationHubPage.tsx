/**
 * src/pages/SovereignFederationHubPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Global Sovereign Legal Node Federation Console
 * Specification: Task 19.6
 *
 * Master cockpit for peer-to-peer enterprise knowledge mesh, cross-institutional
 * consensus, regulatory compliance oracles, cross-border M&A clearance simulator,
 * and SLFP protocol coordinator telemetry.
 */

import React, { useState, useMemo } from 'react';
import {
  Network,
  Globe2,
  Share2,
  Scale,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Lock,
  Binary,
  Gavel,
  Radio,
  Vote,
  TrendingUp,
  Activity,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { interEnterpriseKnowledgeMesh, KnowledgeMeshNode, MeshVectorExchangeRecord } from '../federation/interEnterpriseKnowledgeMesh';
import { crossInstitutionalConsensusEngine, RegulatoryConsensusPact } from '../federation/crossInstitutionalConsensus';
import { complianceProofOracleEngine, ComplianceProofOracleRecord } from '../federation/complianceProofOracle';
import { crossBorderMergerSimulator, MergerClearanceSimulationResult } from '../federation/crossBorderMergerSimulator';
import { sovereignFederationProtocolCoordinator, SLFPNetworkTelemetry } from '../federation/sovereignFederationProtocol';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type FederationTab = 'mesh' | 'consensus' | 'oracles' | 'mergers' | 'slfp';

export default function SovereignFederationHubPage() {
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

  const access = checkAccess('sovereign_federation_hub', userTier);

  const [activeTab, setActiveTab] = useState<FederationTab>('mesh');

  // Mesh State
  const [meshNodes] = useState<KnowledgeMeshNode[]>(() =>
    interEnterpriseKnowledgeMesh.listMeshNodes()
  );

  // Consensus State
  const [consensusPacts] = useState<RegulatoryConsensusPact[]>(() =>
    crossInstitutionalConsensusEngine.listPacts()
  );

  // Oracles State
  const [oracles] = useState<ComplianceProofOracleRecord[]>(() =>
    complianceProofOracleEngine.listOracles()
  );

  // M&A Simulator State
  const [mergers] = useState<MergerClearanceSimulationResult[]>(() =>
    crossBorderMergerSimulator.listSimulations()
  );

  // SLFP Telemetry State
  const slfpTelemetry = useMemo<SLFPNetworkTelemetry>(
    () => sovereignFederationProtocolCoordinator.getTelemetry(),
    []
  );

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | Federation Hub' : 'Access Restricted | Federation Hub'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'مركز الاتحاد القانوني السيادي مقيد' : 'Sovereign Federation Hub Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'الوصول إلى لوحة الاتحاد القانوني وبروتوكول SLFP مخصص حصرياً للمستشار العام ومدراء النظام المصرح لهم.'
              : 'Access to the Sovereign Legal Federation Hub and SLFP Protocol Coordinator is restricted to General Counsel and enterprise executive administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز الاتحاد القانوني السيادي 5.0 | JurisTech' : 'Sovereign Legal Federation Hub 5.0 | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40">
              <Network className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز الاتحاد القانوني السيادي وشبكة العقد المؤسسية 5.0' : 'Global Sovereign Legal Node Federation Hub 5.0'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'شبكة المعرفة البينية النظير للنظير، التوافق التنظيمي للمؤسسات، أوراكل الامتثال، ومحاكاة صفقات الاستحواذ العابرة للحدود.'
              : 'Peer-to-peer knowledge mesh, cross-institutional regulatory consensus, compliance proof oracles, and M&A clearance simulator.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            {isAr ? 'بروتوكول SLFP: متصل عبر 28 عقدة' : 'SLFP Mesh: Connected (28 Nodes)'}
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('mesh')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'mesh' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          {isAr ? 'شبكة العقد المعرفية (P2P Mesh)' : 'Knowledge Mesh Nodes'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('consensus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'consensus' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Vote className="w-3.5 h-3.5" />
          {isAr ? 'مواثيق التوافق المؤسسي' : 'Institutional Consensus'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('oracles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'oracles' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          {isAr ? 'أوراكل إثباتات الامتثال' : 'Compliance Proof Oracles'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mergers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'mergers' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {isAr ? 'محاكاة صفقات الاستحواذ الدولية' : 'M&A Clearance Simulator'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('slfp')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'slfp' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          {isAr ? 'منسق بروتوكول SLFP' : 'SLFP Coordinator'}
        </button>
      </div>

      {/* ── TAB 1: KNOWLEDGE MESH NODES ── */}
      {activeTab === 'mesh' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-teal-400" />
              {isAr ? 'عقد الاتحاد السيادي وشبكة تبادل المتجهات المعرفية التجريدية' : 'Sovereign Nodes & Abstract Knowledge Vector Mesh'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{meshNodes.length} Active Sovereign Peers</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {meshNodes.map((n) => (
              <div key={n.nodeId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                    {n.nodeType}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    Trust: {n.meshTrustScore}%
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{isAr ? n.organizationNameAr : n.organizationNameEn}</h3>
                  <p className="text-slate-400 text-[11px] font-mono">{n.jurisdictionJurisdiction}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Shared Knowledge Vectors:</span>
                    <span className="font-mono font-bold text-white">{n.sharedKnowledgeVectorsCount}</span>
                  </div>
                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Data Isolation:</span>
                    <span className="font-mono text-emerald-400 font-bold">STRICTLY_ENFORCED</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                  <span className="text-teal-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    Status: {n.status}
                  </span>
                  <span>Ping: {n.lastPingAt.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: CONSENSUS PACTS ── */}
      {activeTab === 'consensus' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Vote className="w-4 h-4 text-blue-400" />
              {isAr ? 'مواثيق التوافق التنظيمي وتوحيد المصطلحات المؤسسية' : 'Cross-Institutional Regulatory Consensus & Taxonomy Pacts'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{consensusPacts.length} Ratified Pacts</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {consensusPacts.map((p) => (
              <div key={p.pactId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {p.standardDomain}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">{p.consensusStatus}</span>
                </div>

                <h3 className="font-bold text-white text-sm">{isAr ? p.pactTitleAr : p.pactTitleEn}</h3>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Participating Institutions:</span>
                    <span className="text-white font-bold">{p.participatingInstitutionsCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Affirmative Quorum:</span>
                    <span className="text-blue-400 font-bold">{p.affirmativeVotesCount} / {p.participatingInstitutionsCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Consensus Achieved:</span>
                    <span className="text-emerald-400 font-bold">{p.currentConsensusPct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: COMPLIANCE PROOF ORACLES ── */}
      {activeTab === 'oracles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              {isAr ? 'جسور وتغذيات أوراكل إثباتات الامتثال الرسمية' : 'Decentralized Regulatory Compliance Proof Oracles'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{oracles.length} Active Oracle Bridges</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {oracles.map((o) => (
              <div key={o.oracleId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {o.oracleFeedType}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    Reliability: {o.oracleReliabilityIndex}%
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{isAr ? o.authorityNameAr : o.authorityNameEn}</h3>
                  <p className="text-slate-400 text-[11px] font-mono">{o.jurisdictionScope}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] space-y-1">
                  <div className="text-slate-500">Oracle Attestation Proof Token:</div>
                  <div className="text-emerald-400 truncate">{o.oracleProofToken}</div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">{o.attestationStatus}</span>
                  <span className="text-slate-500">Heartbeat: Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: M&A SIMULATOR ── */}
      {activeTab === 'mergers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              {isAr ? 'محاكاة الموافقات التنظيمية والتركز الاقتصادي لصفقات الاستحواذ الدولية' : 'Global Cross-Border M&A Clearance Simulator'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{mergers.length} Active Simulations</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mergers.map((m) => (
              <div key={m.simulationId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Deal: ${(m.dealValueUSD / 1000000).toLocaleString()}M USD
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{m.regulatoryGateStatus}</span>
                </div>

                <h3 className="font-bold text-white text-sm">{isAr ? m.transactionTitleAr : m.transactionTitleEn}</h3>
                <p className="text-slate-400 text-[11px]">{m.targetIndustry}</p>

                <div className="grid grid-cols-2 gap-2 text-center p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px]">
                  <div>
                    <div className="text-slate-500 text-[10px]">Clearance Probability</div>
                    <div className="text-emerald-400 font-bold">{m.aggregateClearanceProbabilityPct}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Expected Review Timeline</div>
                    <div className="text-blue-400 font-bold">{m.estimatedTimelineMonths.expected} Months</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <div className="font-bold text-slate-300">{isAr ? 'عوامل التقييم التنافسي:' : 'Critical Antitrust Factors:'}</div>
                  <ul className="list-disc list-inside text-slate-400 text-[10px] space-y-0.5">
                    {(isAr ? m.criticalAntitrustFactorsAr : m.criticalAntitrustFactorsEn).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: SLFP TELEMETRY ── */}
      {activeTab === 'slfp' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-white font-mono">{slfpTelemetry.protocolVersion}</h2>
                <p className="text-slate-400 text-xs">
                  {isAr
                    ? 'منسق بروتوكول الاتحاد القانوني السيادي لتوجيه إثباتات المعرفة المشفرة وتنسيق التوافق بين العقد.'
                    : 'Master coordinator for zero-knowledge gossiping, latency telemetry, and inter-node consensus synchronization.'}
                </p>
              </div>
              <span className="font-mono text-teal-400 font-bold px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30">
                {slfpTelemetry.networkStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Connected Sovereign Nodes</div>
                <div className="text-teal-400 font-mono font-bold">{slfpTelemetry.connectedSovereignNodesCount} Nodes</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Active Knowledge Vectors</div>
                <div className="text-teal-400 font-mono font-bold">{slfpTelemetry.activeKnowledgeMeshVectorsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Average Inter-Node Latency</div>
                <div className="text-emerald-400 font-mono font-bold">{slfpTelemetry.averageInterNodeLatencyMs} ms</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Cross-Tenant Leakage Risk</div>
                <div className="text-emerald-400 font-mono font-bold">{slfpTelemetry.crossTenantLeakageRiskIndex}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-slate-500 text-[10px]">Federation Composite Uptime</div>
                <div className="text-emerald-400 font-mono font-bold">{slfpTelemetry.compositeFederationUptimePct}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
