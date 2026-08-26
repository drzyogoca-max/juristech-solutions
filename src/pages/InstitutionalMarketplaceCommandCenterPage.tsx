import React, { useState } from 'react';
import { Shield, Lock, Globe, FileText, CheckCircle2, Award, Zap, Activity, Eye, Layers } from 'lucide-react';
import { institutionalTrustPassportEngine } from '../enterprise/institutionalTrustPassportEngine';
import { legalIntelligenceFederationProtocolEngine } from '../enterprise/legalIntelligenceFederationProtocol';
import { globalRegulatoryIntelligenceObservatoryEngine } from '../enterprise/globalRegulatoryIntelligenceObservatory';
import { enterpriseGovernanceApiGatewayEngine } from '../enterprise/enterpriseGovernanceApiGateway';
import { independentVerificationEcosystemEngine } from '../enterprise/independentVerificationEcosystem';
import { RULE_ZERO_TASK36 } from '../governance/ruleZero/task36BoundaryPolicy';

export default function InstitutionalMarketplaceCommandCenterPage() {
  const [activeTab, setActiveTab] = useState<'passports' | 'federation' | 'observatory' | 'gateway' | 'verification'>('passports');

  const passportTelemetry = institutionalTrustPassportEngine.getTelemetry();
  const federationTelemetry = legalIntelligenceFederationProtocolEngine.getTelemetry();
  const observatoryTelemetry = globalRegulatoryIntelligenceObservatoryEngine.getTelemetry();
  const gatewayTelemetry = enterpriseGovernanceApiGatewayEngine.getTelemetry();
  const verificationTelemetry = independentVerificationEcosystemEngine.getTelemetry();

  const passports = institutionalTrustPassportEngine.getActivePassports();
  const signals = legalIntelligenceFederationProtocolEngine.getActiveSignals();
  const reports = globalRegulatoryIntelligenceObservatoryEngine.getObservatoryReports();
  const sessions = enterpriseGovernanceApiGatewayEngine.getActiveEnterpriseSessions();
  const auditLogs = independentVerificationEcosystemEngine.getIndependentAuditLogs();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Header Cockpit */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Institutional Intelligence Marketplace & Governed Exchange
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  v29.0.0 Enterprise Release
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Governed Institutional Trust Economy • Multi-Party Passports • LIFP 2.0 Protocol • Zero-Knowledge Verification
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-mono">
            <Lock className="w-3.5 h-3.5" />
            Rule Zero Sealed 🔒
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Neutrality Enforced
          </div>
        </div>
      </div>

      {/* Sovereign Motto Alert */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/20 via-slate-900/40 to-slate-950 border border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-400" />
          <span className="text-sm text-amber-200 font-medium font-serif italic">
            "AI suggests. Humans authorize. Systems enforce boundaries."
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          JUR-CHR-ETM-2026-V29 / JUR-POL-EFP-2026-V29
        </span>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Active Passports</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{passportTelemetry.totalPassportsCount}</div>
          <div className="text-xs text-emerald-400 mt-1">Multi-Party Verified</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider">LIFP 2.0 Signals</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{federationTelemetry.activeFederationSignalsCount}</div>
          <div className="text-xs text-cyan-300 mt-1">Zero Payload Transfer</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Observatory Alerts</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">{observatoryTelemetry.totalObservatoryReportsCount}</div>
          <div className="text-xs text-violet-300 mt-1">Gazette Anchored</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Gateway Latency</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{gatewayTelemetry.averageLatencyMs}ms</div>
          <div className="text-xs text-emerald-300 mt-1">Stateless Sessions</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider">ZKP Audits Validated</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{verificationTelemetry.totalIndependentAuditsCount}</div>
          <div className="text-xs text-indigo-300 mt-1">Zero-Knowledge Proof</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('passports')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'passports'
              ? 'border-amber-400 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          Trust Passports ({passports.length})
        </button>
        <button
          onClick={() => setActiveTab('federation')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'federation'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          LIFP 2.0 Signals ({signals.length})
        </button>
        <button
          onClick={() => setActiveTab('observatory')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'observatory'
              ? 'border-violet-400 text-violet-400 bg-violet-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          Regulatory Observatory ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('gateway')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'gateway'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          Governance Gateway ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'verification'
              ? 'border-indigo-400 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          ZKP Verification ({auditLogs.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'passports' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-slate-300">Multi-Party Verifiable Institutional Trust Passports</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {passports.map((p) => (
              <div key={p.passportId} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                    {p.institutionType}
                  </span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    Trust {p.compositeTrustScore}%
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{p.institutionNameEn}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-serif">{p.institutionNameAr}</p>
                </div>
                <div className="text-xs text-slate-400 space-y-1 border-t border-slate-800/80 pt-2">
                  <div>Jurisdiction: <span className="text-slate-200 font-mono">{p.jurisdictionSovereignty}</span></div>
                  <div>Attestations: <span className="text-amber-300 font-mono">{p.attestations.length} Active Seal(s)</span></div>
                  <div className="truncate text-[10px] text-slate-500 font-mono">{p.cryptographicPassportDigestSha512}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'federation' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-slate-300">LIFP 2.0 Stateless Federation Signal Exchange</div>
          <div className="space-y-3">
            {signals.map((sig) => (
              <div key={sig.packetId} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      {sig.signalType}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{sig.payloadSchemaVersion}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Route: <span className="text-cyan-300 font-mono">{sig.sourceNodeId}</span> ➔ <span className="text-cyan-300 font-mono">{sig.destinationNodeId}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Zero Payload Verified
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">{sig.metadataDigestSha512}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'observatory' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-slate-300">Global Regulatory Intelligence Observatory Reports</div>
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.reportId} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
                      {r.jurisdictionCode} • {r.statutoryArea}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{r.regulatoryTrendType}</span>
                  </div>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Counsel Reviewed
                  </span>
                </div>
                <p className="text-xs text-slate-200">{r.observatorySummaryEn}</p>
                <p className="text-xs text-slate-400 font-serif">{r.observatorySummaryAr}</p>
                <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
                  Official Gazette: {r.sourceOfficialGazette} ({r.sourcePublicationDate})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'gateway' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-slate-300">Stateless Enterprise Governance API Sessions</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((s) => (
              <div key={s.sessionId} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {s.enterpriseSystemType}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">{s.latencyMs} ms</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{s.enterpriseOrgName}</h4>
                  <p className="text-xs text-slate-400 font-mono">Scope: {s.jurisdictionScope}</p>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate border-t border-slate-800/60 pt-2">
                  HMAC Seal: {s.hmacSha256SecurityToken}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-slate-300">Zero-Knowledge Proof (ZKP) Independent Auditor Ledger</div>
          <div className="space-y-3">
            {auditLogs.map((l) => (
              <div key={l.auditEntryId} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                      {l.verificationScope}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{l.auditStandardCode}</span>
                  </div>
                  <div className="text-xs text-slate-200 font-bold">{l.independentAuditorName}</div>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> {l.proofResult}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">{l.zkProofToken}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
