import React, { useState } from 'react';
import { 
  Network, 
  Share2, 
  Radar, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Link,
  Layers,
  FileCheck
} from 'lucide-react';
import { globalLegalKnowledgeGraphEngine } from '../enterprise/globalLegalKnowledgeGraphEngine';
import { institutionalCollaborationFabricEngine } from '../enterprise/institutionalCollaborationFabricEngine';
import { crossJurisdictionIntelligenceRadarEngine } from '../enterprise/crossJurisdictionIntelligenceRadar';
import { institutionalTrustEvidenceNetworkEngine } from '../enterprise/institutionalTrustEvidenceNetwork';

export default function GlobalIntelligenceNetworkCommandCenterPage() {
  const [activeTab, setActiveTab] = useState<'graph' | 'radar' | 'collaboration' | 'evidence' | 'charters'>('graph');

  const graphOverview = globalLegalKnowledgeGraphEngine.getGlobalLegalKnowledgeGraphOverview();
  const collaborationOverview = institutionalCollaborationFabricEngine.getInstitutionalCollaborationFabricOverview();
  const radarOverview = crossJurisdictionIntelligenceRadarEngine.getCrossJurisdictionIntelligenceRadarOverview();
  const evidenceOverview = institutionalTrustEvidenceNetworkEngine.getInstitutionalTrustEvidenceNetworkOverview();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Network className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Global Intelligence Network & Collaboration Command Center
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            JurisTech Solutions v28.0.0 — Federated Legal Knowledge Graph & Cross-Boundary Collaboration Fabric
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <Lock className="w-3.5 h-3.5" />
            Rule Zero 100% Preserved
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            <CheckCircle className="w-3.5 h-3.5" />
            Zero Cross-Tenant Sharing
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('graph')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'graph' 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Legal Knowledge Graph ({graphOverview.totalKnowledgeNodesCount})
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'radar' 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Radar className="w-4 h-4" />
          Cross-Jurisdiction Radar ({radarOverview.totalMonitoredAlertsCount})
        </button>

        <button
          onClick={() => setActiveTab('collaboration')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'collaboration' 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Share2 className="w-4 h-4" />
          Collaboration Fabric ({collaborationOverview.totalFederatedTenantsCount})
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'evidence' 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Trust Evidence Network ({evidenceOverview.totalTrustAttestationsCount})
        </button>

        <button
          onClick={() => setActiveTab('charters')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'charters' 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Network Charters & Governance
        </button>
      </div>

      {/* Tab 1: Legal Knowledge Graph */}
      {activeTab === 'graph' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Statutory Knowledge Nodes</span>
              <p className="text-3xl font-bold text-cyan-400 mt-2">{graphOverview.totalKnowledgeNodesCount} Nodes</p>
              <span className="text-xs text-slate-500 mt-1 block">Cryptographically mapped lineage</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Statutory Relations</span>
              <p className="text-3xl font-bold text-emerald-400 mt-2">{graphOverview.totalVerifiedRelationsCount} Relations</p>
              <span className="text-xs text-slate-500 mt-1 block">Human legal officer verified</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Autonomous Legal Interpretation</span>
              <p className="text-3xl font-bold text-blue-400 mt-2">Disabled 🔒</p>
              <span className="text-xs text-slate-500 mt-1 block">Knowledge mapping only</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Monitored Statutory Knowledge Nodes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {graphOverview.nodes.map((n) => (
                <div key={n.nodeId} className="p-4 bg-slate-950/70 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-cyan-950/70 text-cyan-400 border border-cyan-800/40">
                      {n.nodeType} [{n.jurisdictionCode}]
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Links: {n.connectedNodesCount}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{n.officialCitationEn}</h3>
                  <p className="text-xs text-slate-400 font-arabic">{n.officialCitationAr}</p>
                  <div className="text-xs text-slate-500 font-mono truncate pt-2 border-t border-slate-800/60">
                    Provenance: {n.provenanceHashSha512}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cross-Jurisdiction Intelligence Radar */}
      {activeTab === 'radar' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Real-Time Multi-Jurisdiction Regulatory Radar</h2>
            <div className="space-y-3">
              {radarOverview.alerts.map((a) => (
                <div key={a.alertId} className="p-4 bg-slate-950/70 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        {a.jurisdictionCode} • {a.statutoryArea}
                      </span>
                      <span className="text-xs text-slate-500">{a.officialGazetteReference}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{a.alertTitleEn}</h3>
                    <p className="text-xs text-slate-400 font-arabic">{a.alertTitleAr}</p>
                  </div>
                  <div className="text-right flex md:flex-col justify-between items-end gap-1">
                    <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40">
                      {a.severityLevel}
                    </span>
                    <span className="text-xs text-slate-500">Verified: {a.publishedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Institutional Collaboration Fabric */}
      {activeTab === 'collaboration' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collaborationOverview.tenants.map((t) => (
              <div key={t.tenantId} className="p-5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">{t.institutionType}</span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {t.dataIsolationStatus}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{t.institutionNameEn}</h3>
                <p className="text-xs text-slate-400 font-arabic">{t.institutionNameAr}</p>
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-800 space-y-1">
                  <div>Signatory: {t.authorizedSignatoryOfficer}</div>
                  <div>Active Channels: {t.activeChannelsCount}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white">Active Federated Governance Channels</h2>
            <div className="space-y-2">
              {collaborationOverview.channels.map((c) => (
                <div key={c.channelId} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-white block">{c.channelName}</span>
                    <span className="text-xs text-slate-500">Scope: {c.scopeType} • Authorized: {c.humanAuthorizationSignedDate}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
                    {c.channelStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Trust Evidence Network */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evidenceOverview.attestations.map((att) => (
              <div key={att.attestationId} className="p-5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40 block w-fit">
                  {att.governanceScope}
                </span>
                <h3 className="text-sm font-bold text-white">{att.attestationTitleEn}</h3>
                <p className="text-xs text-slate-400 font-arabic">{att.attestationTitleAr}</p>
                <div className="p-2.5 bg-slate-950/70 rounded-lg text-xs font-mono text-slate-400 border border-slate-800">
                  <span className="text-slate-500 block">SHA-512 Seal:</span>
                  {att.cryptographicProofHashSha512}
                </div>
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-800 space-y-1">
                  <div>Signatory: {att.humanSignatoryRole}</div>
                  <div>Valid Thru: {att.validThroughDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Charters & Policies */}
      {activeTab === 'charters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <BookOpen className="w-5 h-5" />
              <h2 className="font-bold text-white">Enterprise Intelligence Network Charter</h2>
            </div>
            <p className="text-xs text-slate-400">Document Code: JUR-CHR-GIN-2026-V28</p>
            <div className="text-xs text-slate-300 space-y-2 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <p>• Federated Knowledge Graph connecting statutory and regulatory nodes.</p>
              <p>• Mandatory source provenance chain to official legal gazettes.</p>
              <p>• Prohibition of autonomous legal reasoning and conclusion generation.</p>
              <p>• Strict non-self-certification and cryptographic evidence registry.</p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="font-bold text-white">Enterprise Collaboration Governance Policy</h2>
            </div>
            <p className="text-xs text-slate-400">Document Code: JUR-POL-CGP-2026-V28</p>
            <div className="text-xs text-slate-300 space-y-2 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <p>• Absolute zero cross-tenant client data visibility.</p>
              <p>• Role separation invariant between admin, legal, and compliance.</p>
              <p>• Mandatory dual human legal officer approval for channels.</p>
              <p>• 100% preservation of payment gateways and zero DB migrations.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
