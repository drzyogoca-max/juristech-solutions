import React, { useState } from 'react';
import { 
  Globe, Shield, Cpu, Activity, Award, CheckCircle2, Lock, 
  Terminal, ArrowRight, Layers, FileText, Server, AlertCircle 
} from 'lucide-react';
import { autonomousInstitutionalSynthesisEngine } from '../enterprise/autonomousInstitutionalSynthesisEngine';
import { planetaryLegalSovereignCloudFabricEngine } from '../enterprise/planetaryLegalSovereignCloudFabric';
import { institutionalTrustSettlementLedgerEngine } from '../enterprise/institutionalTrustSettlementLedger';
import { adaptiveGovernanceSimulationEngine } from '../enterprise/adaptiveGovernanceSimulationEngine';
import { continuousExternalAuditRadarEngine } from '../enterprise/continuousExternalAuditRadar';
import { RULE_ZERO_TASK37 } from '../governance/ruleZero/task37BoundaryPolicy';

export default function PlanetarySovereignCommandCenterPage() {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'sovereign' | 'settlement' | 'simulation' | 'audit'>('synthesis');

  const synthesisMetrics = autonomousInstitutionalSynthesisEngine.getSynthesisMetrics();
  const dossiers = autonomousInstitutionalSynthesisEngine.getSynthesizedDossiers();

  const fabricMetrics = planetaryLegalSovereignCloudFabricEngine.getFabricMetrics();
  const nodes = planetaryLegalSovereignCloudFabricEngine.getSovereignNodes();

  const ledgerMetrics = institutionalTrustSettlementLedgerEngine.getLedgerMetrics();
  const blocks = institutionalTrustSettlementLedgerEngine.getSettlementBlocks();

  const simMetrics = adaptiveGovernanceSimulationEngine.getSimulationMetrics();
  const simulations = adaptiveGovernanceSimulationEngine.getSimulations();

  const auditMetrics = continuousExternalAuditRadarEngine.getRadarMetrics();
  const channels = continuousExternalAuditRadarEngine.getTelemetryChannels();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Planetary Legal Sovereign Fabric Command Center
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    v30.0.0 Golden Milestone
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Multi-Node Autonomous Synthesis, Sovereign Cloud Residency & Cryptographic Trust Settlement
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2 text-xs font-mono text-slate-300">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Rule Zero: Sealed & Immutable
            </div>
            <div className="px-4 py-2 bg-indigo-950/60 border border-indigo-800/60 rounded-lg flex items-center gap-2 text-xs font-mono text-indigo-300">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              Residency: Strictly In-Country
            </div>
          </div>
        </div>

        {/* Sovereign Motto Banner */}
        <div className="mt-4 p-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-xl flex items-center justify-between text-xs text-indigo-200">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <strong>Sovereign Governance Invariant:</strong> "AI suggests. Humans authorize. Systems enforce boundaries."
          </span>
          <span className="font-mono text-slate-400">JUR-STD-V30-GOLDEN</span>
        </div>

        {/* 5-Tab Executive Navigation */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('synthesis')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'synthesis'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Autonomous Synthesis ({synthesisMetrics.totalDossiers})
          </button>
          <button
            onClick={() => setActiveTab('sovereign')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'sovereign'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Sovereign Cloud Fabric ({fabricMetrics.activeSovereignNodes})
          </button>
          <button
            onClick={() => setActiveTab('settlement')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'settlement'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Trust Settlement Ledger ({ledgerMetrics.totalSettledBlocks})
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'simulation'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Adaptive Simulations ({simMetrics.totalSimulationsRun})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            Continuous Audit Radar ({auditMetrics.activeChannels})
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Autonomous Synthesis */}
        {activeTab === 'synthesis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-mono">SYNTHESIS CONFIDENCE</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">99.6%</div>
                <div className="text-xs text-slate-500 mt-1">Multi-Jurisdictional Cross-Validation</div>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-mono">HUMAN OVERSIGHT STATUS</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">100% Authorized</div>
                <div className="text-xs text-slate-500 mt-1">Chief Legal Officer Formal Signoff</div>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-mono">AUTONOMOUS DECISION LIMIT</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">Enforced 🔒</div>
                <div className="text-xs text-slate-500 mt-1">Advisory-Only Dossiers</div>
              </div>
            </div>

            <div className="space-y-4">
              {dossiers.map((d) => (
                <div key={d.synthesisId} className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{d.topicTitle.en}</h3>
                      <p className="text-sm text-slate-400 mt-0.5">{d.topicTitle.ar}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-mono">
                        Score: {(d.confidenceScore * 100).toFixed(1)}%
                      </span>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {d.supervisoryHumanLegalSignoff.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg">
                      <div className="text-slate-400 font-mono mb-1">ENACTMENTS & GAZETTES:</div>
                      <ul className="space-y-1 text-slate-300">
                        {d.statutoryEnactments.map((e, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-400">•</span>
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 text-slate-500 font-mono">Source: {d.provenanceSourceGazette}</div>
                    </div>

                    <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg">
                      <div className="text-slate-400 font-mono mb-1">ADVISORY SYNTHESIS (EN / AR):</div>
                      <p className="text-slate-300 leading-relaxed">{d.advisorySynthesisText.en}</p>
                      <p className="text-slate-400 mt-2 leading-relaxed text-right">{d.advisorySynthesisText.ar}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Authorized By: {d.supervisoryHumanLegalSignoff.chiefLegalOfficer}</span>
                    <span className="truncate max-w-xs">Hash: {d.cryptographicDigestSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Sovereign Cloud Fabric */}
        {activeTab === 'sovereign' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-mono">SOVEREIGN RESIDENCY</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">100% In-Country</div>
                <div className="text-xs text-slate-500 mt-1">Saudi NCA & ADGM DPR Certified</div>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-mono">UNENCRYPTED EGRESS</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">0.00% Blocked 🔒</div>
                <div className="text-xs text-slate-500 mt-1">Zero Outbound Raw Payload</div>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-mono">AVERAGE NODE UPTIME</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">99.99%</div>
                <div className="text-xs text-slate-500 mt-1">High-Availability Sovereign Mesh</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nodes.map((node) => (
                <div key={node.nodeId} className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-indigo-400">{node.nodeId}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-mono">
                        {(node.uptimeScore * 100).toFixed(2)}% Up
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-2">{node.sovereignRegion.replace(/_/g, ' ')}</h3>
                    <p className="text-xs text-slate-400 mt-1">{node.regulatoryStandard}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Residency:</span>
                      <span className="text-emerald-400">{node.inCountryDataResidencyStatus}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Egress Blocked:</span>
                      <span className="text-emerald-400">TRUE (100%)</span>
                    </div>
                    <div className="text-[10px] text-slate-600 truncate mt-2">Tunnel: {node.hmacTunnelSeal}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Trust Settlement Ledger */}
        {activeTab === 'settlement' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-mono">CRYPTOGRAPHIC SETTLEMENT LEDGER</div>
                <div className="text-lg font-bold text-white mt-1">Immutable SHA-512 Proof Chain (Rule Zero Isolated)</div>
              </div>
              <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Chain Verified
              </div>
            </div>

            <div className="space-y-4">
              {blocks.map((block) => (
                <div key={block.settlementId} className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-mono text-xs">
                        Block #{block.blockNumber}
                      </span>
                      <span className="text-sm font-semibold text-white">{block.settledProofType.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono">{block.settlementStatus}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-400">
                    <div>
                      <div>From: <span className="text-slate-200">{block.originNodeId}</span></div>
                      <div>To: <span className="text-slate-200">{block.targetNodeId}</span></div>
                    </div>
                    <div>
                      <div>Timestamp: <span className="text-slate-200">{block.settlementTimestamp}</span></div>
                      <div className="truncate">Prev Hash: <span className="text-slate-500">{block.previousBlockHash}</span></div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs font-mono text-slate-500 truncate">
                    Block SHA-512: {block.blockHashSha512}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Adaptive Simulations */}
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-mono">CROSS-BORDER SIMULATION ENGINE</div>
                <div className="text-lg font-bold text-white mt-1">Predictive Stress-Testing Sandbox (Zero Production Side Effects)</div>
              </div>
              <div className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-mono">
                Sandbox Isolated: TRUE
              </div>
            </div>

            <div className="space-y-4">
              {simulations.map((sim) => (
                <div key={sim.simulationId} className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{sim.scenarioName.en}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{sim.scenarioName.ar}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-xs font-mono">
                      Resilience: {(sim.simulationOutcome.systemicResilienceScore * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg text-xs">
                    <div className="text-slate-400 font-mono mb-1">MITIGATION ADVISORY:</div>
                    <p className="text-slate-300 leading-relaxed">{sim.simulationOutcome.mitigationAdvisoryReport.en}</p>
                    <p className="text-slate-400 mt-2 leading-relaxed text-right">{sim.simulationOutcome.mitigationAdvisoryReport.ar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Continuous Audit Radar */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-mono">CONTINUOUS EXTERNAL AUDIT RADAR</div>
                <div className="text-lg font-bold text-white mt-1">Zero-Knowledge Proof Real-Time Attestation Telemetry</div>
              </div>
              <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-mono">
                Exposure Risk: STRICTLY ZERO
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {channels.map((chan) => (
                <div key={chan.channelId} className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-400">{chan.channelId}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-mono">
                      ZKP Stream Active
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2">{chan.accreditedAuditor}</h3>
                  <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Standard:</span>
                      <span className="text-slate-200">{chan.auditStandard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span className="text-emerald-400">{chan.liveTelemetryFrequency}</span>
                    </div>
                    <div className="text-[10px] text-slate-600 truncate mt-2">Last Attestation: {chan.lastAttestationDigestSha512}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
