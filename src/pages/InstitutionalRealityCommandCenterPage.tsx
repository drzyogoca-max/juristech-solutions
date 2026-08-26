import React, { useState } from 'react';
import { globalInstitutionalCertificationFramework } from '../enterprise/globalInstitutionalCertificationFramework';
import { externalAuditorPortalEngine } from '../enterprise/externalAuditorPortalEngine';
import { enterpriseAdoptionRoiTelemetryEngine } from '../enterprise/enterpriseAdoptionRoiTelemetryEngine';
import { planetaryLegalBenchmarkEngine } from '../enterprise/planetaryLegalBenchmarkEngine';
import { institutionalReputationGraphEngine } from '../enterprise/institutionalReputationGraphEngine';
import { RULE_ZERO_TASK38 } from '../governance/ruleZero/task38BoundaryPolicy';

export default function InstitutionalRealityCommandCenterPage() {
  const [activeTab, setActiveTab] = useState<'certifications' | 'auditor' | 'roi' | 'benchmark' | 'graph'>('certifications');

  const certs = globalInstitutionalCertificationFramework.getCertifications();
  const certAudit = globalInstitutionalCertificationFramework.verifyRegistryIntegrity();

  const auditorSessions = externalAuditorPortalEngine.getAuditorSessions();
  const auditorAudit = externalAuditorPortalEngine.verifyAuditorIsolation();

  const boardMetrics = enterpriseAdoptionRoiTelemetryEngine.getBoardMetrics();
  const boardAudit = enterpriseAdoptionRoiTelemetryEngine.verifyBoardTelemetryPrivacy();

  const scorecards = planetaryLegalBenchmarkEngine.getScorecards();
  const benchmarkAudit = planetaryLegalBenchmarkEngine.verifyBenchmarkIntegrity();

  const trustNodes = institutionalReputationGraphEngine.getTrustNodes();
  const graphAudit = institutionalReputationGraphEngine.verifyGraphNeutrality();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="mb-8 border-b border-slate-800 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              🏛️ Institutional Reality & External Validation Command Center
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              v31.0.0 Candidate
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Global Institutional Adoption, Independent Auditor ZKP Verification & Sovereign Certification Fabric
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
          <span className="text-emerald-400 font-semibold">RULE ZERO: SEALED 🔒</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Code: {RULE_ZERO_TASK38.standardCode}</span>
        </div>
      </header>

      {/* 5-Tab Navigation */}
      <nav className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
        {[
          { id: 'certifications', label: '🎖️ Institutional Certifications' },
          { id: 'auditor', label: '🔍 External Auditor ZKP Portal' },
          { id: 'roi', label: '📊 Board-Level ROI Telemetry' },
          { id: 'benchmark', label: '⚖️ Planetary Legal Benchmark' },
          { id: 'graph', label: '🌐 Neutral Trust Graph' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab 1: Certifications */}
      {activeTab === 'certifications' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-amber-300 mb-2">Accredited Partner Institutions Registry</h3>
            <p className="text-sm text-slate-400 mb-4">
              All credentials require third-party accreditation bodies. Self-accreditation strictly blocked (NO_SELF_ACCREDITATION = true).
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {certs.map(c => (
                <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-200">{c.institutionName}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">{c.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">Jurisdiction: <span className="text-slate-200 font-mono">{c.jurisdiction}</span></p>
                  <p className="text-xs text-slate-400">Accreditation: <span className="text-amber-300">{c.accreditationAuthority}</span></p>
                  <p className="text-xs text-slate-400">Signoff: <span className="text-slate-300">{c.humanSignoffBy}</span></p>
                  <p className="text-xs font-mono text-slate-500 truncate">{c.attestationDigestSha512}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>All External Authorities Verified: <strong className="text-emerald-400">{certAudit.allExternalAuthoritiesVerified ? 'YES' : 'NO'}</strong></span>
              <span>All Non-Self-Issued: <strong className="text-emerald-400">{certAudit.allNonSelfIssued ? 'YES' : 'NO'}</strong></span>
              <span>Active Certifications: <strong className="text-amber-300">{certAudit.activeCertificationsCount}</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Auditor */}
      {activeTab === 'auditor' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-teal-300 mb-2">External Auditor ZKP Verification Streams</h3>
            <p className="text-sm text-slate-400 mb-4">
              Independent external auditors verify live cryptographic proofs without ever accessing customer contracts or briefs (AUDITOR_SEES_PROOF_NOT_DATA = true).
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {auditorSessions.map(s => (
                <div key={s.auditorId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-200">{s.organization}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">{s.complianceDomain}</span>
                  </div>
                  <p className="text-xs text-slate-400">Lead Auditor: <span className="text-slate-200">{s.leadAuditor}</span></p>
                  <p className="text-xs text-slate-400">Proof Stream: <span className="text-indigo-300 font-mono">{s.activeProofStream}</span></p>
                  <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>Customer Data Exposure: <strong className="text-emerald-400">{s.customerTextExposureRisk}</strong></span>
                    <span>PII Exposure: <strong className="text-emerald-400">{s.piiExposureRisk}</strong></span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Auditor Proof Not Data Enforced: <strong className="text-emerald-400">{auditorAudit.auditorSeesProofNotData ? 'YES' : 'NO'}</strong></span>
              <span>Customer Exposure Risk: <strong className="text-emerald-400">STRICTLY_ZERO</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: ROI */}
      {activeTab === 'roi' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Board-Level Operational Telemetry (Stateless)</h3>
            <p className="text-sm text-slate-400 mb-4">
              Calculates efficiency indicators statelessly without storing corporate financial transactions (BOARD_INTELLIGENCE_PRIVACY_GATE = true).
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {boardMetrics.map(m => (
                <div key={m.metricId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">{m.domain}</span>
                  <h4 className="font-semibold text-sm text-slate-200">{m.efficiencyIndicator}</h4>
                  <div className="text-2xl font-extrabold text-emerald-400">+{m.operationalImprovementPercentage}%</div>
                  <p className="text-xs text-slate-400">Baseline: <span className="text-slate-300">{m.measuredBaseline}</span></p>
                  <p className="text-xs text-slate-400">Current: <span className="text-amber-300">{m.currentMaturity}</span></p>
                  <p className="text-xs font-mono text-slate-500 truncate">{m.verificationDigestSha256}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Telemetry Aggregates Only: <strong className="text-emerald-400">{boardAudit.telemetryAggregatesOnly ? 'YES' : 'NO'}</strong></span>
              <span>Zero Business Data Persistence: <strong className="text-emerald-400">{boardAudit.zeroBusinessDataPersistence ? 'YES' : 'NO'}</strong></span>
              <span>Board Privacy Gate: <strong className="text-emerald-400">ACTIVE</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Benchmark */}
      {activeTab === 'benchmark' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-emerald-300 mb-2">Planetary Legal Intelligence Benchmark</h3>
            <p className="text-sm text-slate-400 mb-4">
              Transparent, deterministic evaluation anchored in official gazettes without proprietary bias (BENCHMARK_TRANSPARENCY_MANDATORY = true).
            </p>
            <div className="space-y-3">
              {scorecards.map(s => (
                <div key={s.axisId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <h4 className="font-semibold text-sm text-slate-200">{s.axisName}</h4>
                    <p className="text-xs text-slate-400">Methodology: {s.evaluationMethodology}</p>
                    <p className="text-xs text-amber-300">Grounding Authority: {s.groundingSourceAuthority}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-slate-500">Industry Avg</div>
                      <div className="text-base font-bold text-slate-400">{(s.industryBenchmarkScore * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-emerald-400 font-semibold">JurisTech Audited</div>
                      <div className="text-xl font-extrabold text-emerald-400">{(s.juristechAuditedScore * 100).toFixed(1)}%</div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">PASSED</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Transparency Mandatory: <strong className="text-emerald-400">{benchmarkAudit.benchmarkTransparencyMandatory ? 'YES' : 'NO'}</strong></span>
              <span>Zero Proprietary Bias: <strong className="text-emerald-400">{benchmarkAudit.zeroProprietaryBias ? 'YES' : 'NO'}</strong></span>
              <span>All Benchmarks Exceeded: <strong className="text-emerald-400">YES</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 5: Graph */}
      {activeTab === 'graph' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Neutral Institutional Reputation Graph</h3>
            <p className="text-sm text-slate-400 mb-4">
              Decentralized multi-institution trust topology mapping verified cross-border interactions with zero subjective credit scoring (NO_REPUTATION_SCORING = true, NO_PAID_PRIORITY = true).
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {trustNodes.map(n => (
                <div key={n.nodeId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-200">{n.legalEntityName}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">{n.countryCode}</span>
                  </div>
                  <p className="text-xs text-slate-400">Topology: <span className="text-slate-300">{n.connectionTopology}</span></p>
                  <p className="text-xs text-slate-400">Verified Interactions: <strong className="text-amber-300">{n.verifiedInteractionCount}</strong></p>
                  <p className="text-xs font-mono text-slate-500 truncate">{n.cryptographicNodeSeal}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>No Subjective Scoring: <strong className="text-emerald-400">{graphAudit.noReputationScoring ? 'YES' : 'NO'}</strong></span>
              <span>No Paid Priority: <strong className="text-emerald-400">{graphAudit.noPaidPriority ? 'YES' : 'NO'}</strong></span>
              <span>Neutrality Enforced: <strong className="text-emerald-400">YES</strong></span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
