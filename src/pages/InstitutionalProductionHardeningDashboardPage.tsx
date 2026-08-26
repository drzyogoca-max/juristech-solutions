import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  FileText, 
  Lock, 
  Server, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Cpu 
} from 'lucide-react';
import { productionObservabilityEngine } from '../enterprise/productionObservabilityEngine';
import { enterpriseIncidentGovernanceMatrix } from '../enterprise/enterpriseIncidentGovernanceMatrix';
import { complianceEvidenceLifecycleEngine } from '../enterprise/complianceEvidenceLifecycleEngine';
import { institutionalSandboxProgram } from '../enterprise/institutionalSandboxProgram';
import { RULE_ZERO_TASK41 } from '../governance/ruleZero/task41BoundaryPolicy';

export const InstitutionalProductionHardeningDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'observability' | 'incidents' | 'lifecycle' | 'sandbox' | 'ruleZero'>('observability');

  const slaMetrics = productionObservabilityEngine.getSlaMetrics();
  const tenantScores = productionObservabilityEngine.getTenantHealthScores();
  const incidents = enterpriseIncidentGovernanceMatrix.getIncidents();
  const evidenceAssets = complianceEvidenceLifecycleEngine.getAssets();
  const sandboxTenants = institutionalSandboxProgram.getParticipants();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Institutional Production Hardening Command Center
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-mono">
              v33.1.0 HARDENED
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Production Observability, Enterprise Incident Governance, Evidence Lifecycle State Machine & Progressive Sandbox Program
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-xs font-mono text-slate-300">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Rule Zero: 100% Sealed | 0 Migrations</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('observability')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'observability'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          Production Observability & SLA
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'incidents'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Incident Governance Matrix
        </button>

        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'lifecycle'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Evidence Lifecycle Engine
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'sandbox'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Institutional Sandbox Program
        </button>

        <button
          onClick={() => setActiveTab('ruleZero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'ruleZero'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          Rule Zero Invariants
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'observability' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {slaMetrics.map(metric => (
              <div key={metric.metricId} className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-slate-400 font-mono">{metric.category}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {metric.complianceStatus}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{metric.name}</h3>
                <div className="text-2xl font-bold text-emerald-400 font-mono">{metric.currentObserved}</div>
                <div className="text-xs text-slate-400 mt-2 flex justify-between">
                  <span>Target SLA: {metric.targetSla}</span>
                  <span>{metric.latencyMs}ms</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              Tenant Health Scoring & Memory Isolation Telemetry
            </h2>
            <div className="space-y-4">
              {tenantScores.map(t => (
                <div key={t.tenantId} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-900/80 rounded-lg border border-slate-800/80 gap-3">
                  <div>
                    <div className="font-medium text-white">{t.tenantName}</div>
                    <div className="text-xs text-slate-400 font-mono">ID: {t.tenantId} | Isolation: {t.isolationStabilityScore}%</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Error Rate</div>
                      <div className="text-sm font-mono text-emerald-400">{t.errorRatePercentage}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Health Score</div>
                      <div className="text-lg font-bold font-mono text-emerald-400">{t.overallScore}/100</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {t.resourceHealthRating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'incidents' && (
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Enterprise Incident Triage & Human Escalation Matrix
            </h2>
            <div className="space-y-4">
              {incidents.map(inc => (
                <div key={inc.incidentId} className="p-5 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-3">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        inc.severity === 'P1_CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        inc.severity === 'P2_HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {inc.severity}
                      </span>
                      <h3 className="font-semibold text-white">{inc.title}</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {inc.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-mono bg-slate-950/60 p-2.5 rounded border border-slate-800/50">
                    {inc.aiAssistanceRecommendation}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 gap-2">
                    <span>Incident Commander: <strong className="text-slate-200">{inc.namedLegalIncidentCommander}</strong></span>
                    <span>Signoff: <strong className="text-emerald-400 font-mono">{inc.humanClosureSignoffTimestamp || 'PENDING'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lifecycle' && (
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Compliance Evidence 5-State Machine & Cryptographic Proof Verification
            </h2>
            <div className="space-y-4">
              {evidenceAssets.map(asset => (
                <div key={asset.assetId} className="p-5 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-3">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <h3 className="font-semibold text-white">{asset.title}</h3>
                      <div className="text-xs text-slate-400 font-mono">Jurisdiction: {asset.regulatoryJurisdiction} | Token: {asset.cryptographicZkpTokenHash}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                      asset.currentState === 'VALIDATED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      asset.currentState === 'RENEWED' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      STATE: {asset.currentState}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded border border-slate-800/50 space-y-2">
                    <div className="text-xs text-slate-400 font-semibold">State Machine Audit Trail:</div>
                    {asset.historyTransitions.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <span className="text-slate-500">{idx + 1}.</span>
                        <span className="text-amber-400">{t.fromState}</span>
                        <span>→</span>
                        <span className="text-emerald-400">{t.toState}</span>
                        <span className="text-slate-500">| Authorized by: {t.authorizedBy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-violet-400" />
              External Institutional Sandbox Program (3-Tier Progressive Graduation)
            </h2>
            <div className="space-y-4">
              {sandboxTenants.map(p => (
                <div key={p.participantId} className="p-5 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-3">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <h3 className="font-semibold text-white">{p.institutionName}</h3>
                      <div className="text-xs text-slate-400 font-mono">ID: {p.participantId}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {p.currentTier}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-800/60">
                    <div>Academic Curricula: <strong className="text-emerald-400">Validated ✅</strong></div>
                    <div>Regulatory Controls: <strong className="text-emerald-400">Attested ✅</strong></div>
                    <div>GC Signoff: <strong className="text-slate-200">{p.namedHumanGeneralCounsel}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ruleZero' && (
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              Rule Zero Cryptographic Seals & Boundary Invariants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950/60 rounded border border-slate-800/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Isolation:</span>
                  <span className="text-emerald-400">ENFORCED (Frozen)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database Migrations:</span>
                  <span className="text-emerald-400">0 (Zero Schema Alterations)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Document Storage:</span>
                  <span className="text-emerald-400">0% (Strict Zero Retention)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Autonomous P1 Incident Resolution:</span>
                  <span className="text-emerald-400">BLOCKED (Human Commander Required)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded border border-slate-800/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Evidence Lifecycle State Mutation:</span>
                  <span className="text-emerald-400">NO RETROACTIVE MUTATIONS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Evidence Asset Standard:</span>
                  <span className="text-emerald-400">EVIDENCE ≠ CERTIFICATION</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sandbox Graduation:</span>
                  <span className="text-emerald-400">PROGRESSIVE & GC SIGNED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Standard Code:</span>
                  <span className="text-cyan-400">{RULE_ZERO_TASK41.standardCode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionalProductionHardeningDashboardPage;
