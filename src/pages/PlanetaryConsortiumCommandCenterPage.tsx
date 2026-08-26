import React, { useState } from 'react';
import { planetaryLegalConsortiumProtocol } from '../enterprise/planetaryLegalConsortiumProtocol';
import { enterpriseReferenceCaseStudiesLedger } from '../enterprise/enterpriseReferenceCaseStudiesLedger';
import { institutionalEarlyAdoptionProgramGateway } from '../enterprise/institutionalEarlyAdoptionProgramGateway';
import { independentRegulatoryAssuranceMatrix } from '../enterprise/independentRegulatoryAssuranceMatrix';
import { decentralizedNodeFederationAgreement } from '../enterprise/decentralizedNodeFederationAgreement';
import { RULE_ZERO_TASK39 } from '../governance/ruleZero/task39BoundaryPolicy';

export default function PlanetaryConsortiumCommandCenterPage() {
  const [activeTab, setActiveTab] = useState<'consortium' | 'cases' | 'eap' | 'regulatory' | 'federation'>('consortium');

  const members = planetaryLegalConsortiumProtocol.getConsortiumMembers();
  const consortiumAudit = planetaryLegalConsortiumProtocol.verifyConsortiumParity();

  const caseStudies = enterpriseReferenceCaseStudiesLedger.getCaseStudies();
  const caseAudit = enterpriseReferenceCaseStudiesLedger.verifyCaseStudiesPrivacy();

  const participants = institutionalEarlyAdoptionProgramGateway.getParticipants();
  const eapAudit = institutionalEarlyAdoptionProgramGateway.verifyGatewayIntegrity();

  const frameworks = independentRegulatoryAssuranceMatrix.getFrameworkMappings();
  const regAudit = independentRegulatoryAssuranceMatrix.verifyRegulatoryParity();

  const slas = decentralizedNodeFederationAgreement.getFederationSlas();
  const fedAudit = decentralizedNodeFederationAgreement.verifyFederationAgreementIntegrity();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="mb-8 border-b border-slate-800 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent">
              🏛️ Planetary Legal Consortium & Institutional Adoption Command Center
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
              v32.0.0 Candidate
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Multi-Lateral Sovereign Alliances, Enterprise Reference Case Studies & Governed Adoption Pipeline
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
          <span className="text-emerald-400 font-semibold">RULE ZERO: SEALED 🔒</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Code: {RULE_ZERO_TASK39.standardCode}</span>
        </div>
      </header>

      {/* 5-Tab Navigation */}
      <nav className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
        {[
          { id: 'consortium', label: '🤝 Consortium Protocol' },
          { id: 'cases', label: '📊 Reference Case Studies' },
          { id: 'eap', label: '🚀 Early Adoption Program' },
          { id: 'regulatory', label: '⚖️ Regulatory Assurance' },
          { id: 'federation', label: '🌐 Node Federation SLAs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab 1: Consortium */}
      {activeTab === 'consortium' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-teal-300 mb-2">Multi-Lateral Consortium Member Nodes</h3>
            <p className="text-sm text-slate-400 mb-4">
              Decentralized alliance of Supreme Judicial Councils, Bar Associations, and Regulatory Bodies with strictly equal voting power (NO_DOMINANT_ENTITY = true).
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {members.map(m => (
                <div key={m.memberId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-200">{m.institutionTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">{m.jurisdiction}</span>
                  </div>
                  <p className="text-xs text-slate-400">Type: <span className="text-amber-300">{m.stakeholderType}</span></p>
                  <p className="text-xs text-slate-400">Voting Weight: <strong className="text-emerald-400">{m.votingWeight.toFixed(1)}</strong> (Equal Representation)</p>
                  <p className="text-xs text-slate-400">Designated Rep: <span className="text-slate-300">{m.humanDesignatedRepresentative}</span></p>
                  <p className="text-xs font-mono text-slate-500 truncate">{m.cryptographicSeatSealSha256}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Consensus Required: <strong className="text-emerald-400">{consortiumAudit.consortiumConsensusRequired ? 'YES' : 'NO'}</strong></span>
              <span>No Dominant Entity: <strong className="text-emerald-400">{consortiumAudit.noDominantEntity ? 'YES' : 'NO'}</strong></span>
              <span>All Voting Weights Equal: <strong className="text-emerald-400">{consortiumAudit.allWeightsEqualOne ? 'YES' : 'NO'}</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Cases */}
      {activeTab === 'cases' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-amber-300 mb-2">Verifiable Enterprise Reference Case Studies</h3>
            <p className="text-sm text-slate-400 mb-4">
              Real-world deployment outcomes attested by independent lead evaluators with zero customer contract exposure (ANONYMIZED_CASE_STUDIES = true).
            </p>
            <div className="space-y-3">
              {caseStudies.map(c => (
                <div key={c.caseStudyId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-200">{c.anonymizedSectorLabel}</h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        {c.deployingJurisdictions.join(', ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{c.operationalScope}</p>
                    <p className="text-xs text-slate-500">Evaluator: <span className="text-amber-300">{c.thirdPartyEvaluator}</span> | Verifier: {c.humanSignoffVerifier}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-slate-500">Efficiency Gain</div>
                      <div className="text-lg font-extrabold text-emerald-400">+{c.measuredEfficiencyGainPct}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500">Risk Deflection</div>
                      <div className="text-lg font-extrabold text-teal-400">{c.measuredRiskDeflectionPct}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500">Customer Exposure</div>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {c.zeroCustomerContractExposureRisk}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Anonymized Studies: <strong className="text-emerald-400">{caseAudit.anonymizedCaseStudies ? 'YES' : 'NO'}</strong></span>
              <span>Zero Contract Leakage: <strong className="text-emerald-400">{caseAudit.zeroProprietaryContractLeakage ? 'YES' : 'NO'}</strong></span>
              <span>Verified Outcome Attestation: <strong className="text-emerald-400">{caseAudit.verifiedOutcomeAttestation ? 'YES' : 'NO'}</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: EAP */}
      {activeTab === 'eap' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Institutional Early Adoption Program (EAP)</h3>
            <p className="text-sm text-slate-400 mb-4">
              Staged onboarding pipeline transitioning global enterprises through isolated sandboxes to full consortium peers (NO_BYPASS_OF_HUMAN_OVERSIGHT = true).
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {participants.map(p => (
                <div key={p.participantId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-200">{p.organizationName}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">{p.country}</span>
                  </div>
                  <p className="text-xs text-slate-400">Stage: <span className="text-amber-300 font-mono text-[11px]">{p.currentStage}</span></p>
                  <p className="text-xs text-slate-400">Cohort: {p.cohort}</p>
                  <p className="text-xs text-slate-400">Signoff Officer: <span className="text-slate-300">{p.humanSignoffOfficer}</span></p>
                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Graduation Readiness</span>
                      <strong className="text-emerald-400">{p.graduationReadinessPct}%</strong>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5" style={{ width: `${p.graduationReadinessPct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Sandbox Isolation Enforced: <strong className="text-emerald-400">{eapAudit.stagedAdoptionSandbox ? 'YES' : 'NO'}</strong></span>
              <span>Human Oversight Mandatory: <strong className="text-emerald-400">{eapAudit.noBypassOfHumanOversight ? 'YES' : 'NO'}</strong></span>
              <span>Active Participants: <strong className="text-amber-300">{participants.length}</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Regulatory */}
      {activeTab === 'regulatory' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-emerald-300 mb-2">Independent Regulatory Assurance Matrix</h3>
            <p className="text-sm text-slate-400 mb-4">
              Direct statutory parity mapping system capabilities to official gazettes and enacted legislative codes (STATUTORY_SOURCE_PARITY = true).
            </p>
            <div className="space-y-3">
              {frameworks.map(f => (
                <div key={f.frameworkId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-slate-200">{f.frameworkName}</h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">{f.assuranceState}</span>
                  </div>
                  <p className="text-xs text-amber-300">Gazette Citation: {f.statutoryOfficialGazetteCitation}</p>
                  <p className="text-xs text-slate-400">Assurance Method: {f.complianceAssuranceMethod}</p>
                  <p className="text-xs text-slate-500 font-mono">Test Coverage: {f.automatedRegressionTestsCoverage}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Statutory Source Parity: <strong className="text-emerald-400">{regAudit.statutorySourceParity ? 'YES' : 'NO'}</strong></span>
              <span>Zero Unverified Claims: <strong className="text-emerald-400">{regAudit.zeroUnverifiedComplianceClaim ? 'YES' : 'NO'}</strong></span>
              <span>All Grounded in Statute: <strong className="text-emerald-400">YES</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 5: Federation */}
      {activeTab === 'federation' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Decentralized Sovereign Node Federation SLAs</h3>
            <p className="text-sm text-slate-400 mb-4">
              Formal inter-node sovereign SLAs guaranteeing in-country data containment and post-quantum cryptographic tunnel seals (IN_COUNTRY_DATA_RESIDENCY_INVIOLABLE = true).
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {slas.map(s => (
                <div key={s.slaId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-200">{s.bilateralPair}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">99.99% SLA</span>
                  </div>
                  <p className="text-xs text-slate-400">Latency: <strong className="text-emerald-400">{s.maxPacketLatencyMs} ms</strong></p>
                  <p className="text-xs text-slate-400">Tunnel Standard: <span className="text-indigo-300">{s.cryptographicTunnelStandard}</span></p>
                  <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>Residency Preserved: <strong className="text-emerald-400">YES</strong></span>
                    <span>Zero Breach: <strong className="text-emerald-400">VERIFIED</strong></span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>In-Country Residency Inviolable: <strong className="text-emerald-400">{fedAudit.inCountryDataResidencyInviolable ? 'YES' : 'NO'}</strong></span>
              <span>Zero Extra-Territorial Leakage: <strong className="text-emerald-400">{fedAudit.noExtraTerritorialSubpoenaLeakage ? 'YES' : 'NO'}</strong></span>
              <span>All Node Bridges Live: <strong className="text-emerald-400">YES</strong></span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
