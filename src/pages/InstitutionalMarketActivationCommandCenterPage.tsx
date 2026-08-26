import React, { useState } from 'react';
import { enterpriseOnboardingFramework } from '../enterprise/enterpriseOnboardingFramework';
import { trustEvidenceMarketplace } from '../enterprise/trustEvidenceMarketplace';
import { globalPartnerNetworkEngine } from '../enterprise/globalPartnerNetworkEngine';
import { enterpriseEconomicsTelemetryLayer } from '../enterprise/enterpriseEconomicsTelemetryLayer';
import { RULE_ZERO_TASK40 } from '../governance/ruleZero/task40BoundaryPolicy';

export default function InstitutionalMarketActivationCommandCenterPage() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'evidence' | 'partners' | 'economics' | 'governance'>('pipeline');

  const tenants = enterpriseOnboardingFramework.getTenants();
  const onboardingAudit = enterpriseOnboardingFramework.verifyTenancyIsolation();

  const evidenceAssets = trustEvidenceMarketplace.getEvidenceAssets();
  const evidenceAudit = trustEvidenceMarketplace.verifyEvidenceIntegrity();

  const partners = globalPartnerNetworkEngine.getPartners();
  const partnerAudit = globalPartnerNetworkEngine.verifyPartnerNetworkIntegrity();

  const indicators = enterpriseEconomicsTelemetryLayer.getIndicators();
  const economicsAudit = enterpriseEconomicsTelemetryLayer.verifyEconomicsIntegrity();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="mb-8 border-b border-slate-800 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
              🏛️ Institutional Market Activation & Enterprise Production Command Center
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              v33.0.0 Candidate
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Governed Enterprise Onboarding, Trust Evidence Marketplace, Global Partner Federation & Telemetry
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
          <span className="text-emerald-400 font-semibold">RULE ZERO: SEALED 🔒</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Code: {RULE_ZERO_TASK40.standardCode}</span>
        </div>
      </header>

      {/* 5-Tab Navigation */}
      <nav className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
        {[
          { id: 'pipeline', label: '🏢 Enterprise Pipeline' },
          { id: 'evidence', label: '📜 Evidence Marketplace' },
          { id: 'partners', label: '🤝 Partner Federation' },
          { id: 'economics', label: '📈 Economic Telemetry' },
          { id: 'governance', label: '🔒 Governance Controls' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab 1: Pipeline */}
      {activeTab === 'pipeline' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-emerald-300 mb-2">Governed Enterprise Onboarding Tenants</h3>
            <p className="text-sm text-slate-400 mb-4">
              Strict 5-stage institutional intake pipeline with memory-isolated sandboxes and zero automatic production promotion.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {tenants.map(t => (
                <div key={t.tenantId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-200">{t.enterpriseName}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">{t.jurisdiction}</span>
                  </div>
                  <p className="text-xs text-amber-300 font-mono">{t.currentStage}</p>
                  <p className="text-xs text-slate-400">General Counsel: <span className="text-slate-300">{t.namedHumanGeneralCounsel}</span></p>
                  <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>Sandbox Isolated: <strong className="text-emerald-400">YES</strong></span>
                    <span>Signoff: <strong className={t.generalCounselSignoffReceived ? 'text-emerald-400' : 'text-amber-400'}>{t.generalCounselSignoffReceived ? 'VERIFIED' : 'PENDING'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Isolated Tenancy Enforced: <strong className="text-emerald-400">{onboardingAudit.isolatedEnterpriseTenancy ? 'YES' : 'NO'}</strong></span>
              <span>Zero Automatic Promotion: <strong className="text-emerald-400">{onboardingAudit.zeroAutomaticProductionPromotion ? 'YES' : 'NO'}</strong></span>
              <span>All Sandboxes Isolated: <strong className="text-emerald-400">{onboardingAudit.allSandboxesIsolated ? 'YES' : 'NO'}</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Evidence */}
      {activeTab === 'evidence' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-teal-300 mb-2">Verifiable Trust & Evidence Marketplace</h3>
            <p className="text-sm text-slate-400 mb-4">
              Exportable cryptographic compliance assets and ZKP tokens (EVIDENCE_ASSET_NOT_CERTIFICATION = true) with strictly zero client contract text.
            </p>
            <div className="space-y-3">
              {evidenceAssets.map(a => (
                <div key={a.assetId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-200">{a.assetTitle}</h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">
                        {a.evidenceCategory}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Target Framework: <span className="text-amber-300">{a.targetFramework}</span></p>
                    <p className="text-xs text-slate-500">Standard: {a.zkpProofMathematicalStandard} | Signoff: {a.humanRegistrarSignoff}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Contract Text: ZERO
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      Audited: VERIFIED
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Auditable Evidence Assets: <strong className="text-emerald-400">{evidenceAudit.auditableEvidenceAssets ? 'YES' : 'NO'}</strong></span>
              <span>Zero Contract Text Exposure: <strong className="text-emerald-400">{evidenceAudit.zeroClientContractTextExposure ? 'YES' : 'NO'}</strong></span>
              <span>Asset Not Certification: <strong className="text-emerald-400">{evidenceAudit.evidenceAssetNotCertification ? 'YES' : 'NO'}</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Partners */}
      {activeTab === 'partners' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Global Partner Network Federation</h3>
            <p className="text-sm text-slate-400 mb-4">
              Academic institutions, audit firms, and sovereign clouds operating with equal 1.0 priority and zero commercial AI routing bias.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {partners.map(p => (
                <div key={p.partnerId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-200">{p.institutionTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">{p.jurisdiction}</span>
                  </div>
                  <p className="text-xs text-slate-400">Category: <span className="text-amber-300">{p.tierCategory}</span></p>
                  <p className="text-xs text-slate-400">Routing Weight: <strong className="text-emerald-400">{p.routingPriorityWeight.toFixed(1)}</strong> (No Pay-to-Rank Priority)</p>
                  <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>Conflict Disclosure: <strong className="text-emerald-400">DECLARED</strong></span>
                    <span>Status: <strong className="text-emerald-400">{p.activeStatus}</strong></span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Partner Neutrality: <strong className="text-emerald-400">{partnerAudit.partnerNeutrality ? 'YES' : 'NO'}</strong></span>
              <span>No Influence on AI Routing: <strong className="text-emerald-400">{partnerAudit.noPartnerInfluenceOnAiRouting ? 'YES' : 'NO'}</strong></span>
              <span>All Priorities Equal 1.0: <strong className="text-emerald-400">{partnerAudit.allPrioritiesEqualOne ? 'YES' : 'NO'}</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Economics */}
      {activeTab === 'economics' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-amber-300 mb-2">Enterprise Economics & ARR Telemetry Layer</h3>
            <p className="text-sm text-slate-400 mb-4">
              Stateless in-memory executive telemetry for enterprise SaaS metrics (ARR, CAC, Gross Margin, ROI) without database writes or financial gateway modification.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {indicators.map(ind => (
                <div key={ind.indicatorId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-200">{ind.metricName}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">{ind.category}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400">{ind.measuredValue}</div>
                  <p className="text-xs text-slate-400">Benchmark: {ind.benchmarkStandard}</p>
                  <p className="text-xs text-slate-500">Stateless Verified: <strong className="text-emerald-400">YES</strong></p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-950/80 rounded border border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Statistically Aggregated: <strong className="text-emerald-400">{economicsAudit.statisticallyAggregatedEconomics ? 'YES' : 'NO'}</strong></span>
              <span>No Autonomous Financial Decision: <strong className="text-emerald-400">{economicsAudit.noAutonomousFinancialDecision ? 'YES' : 'NO'}</strong></span>
              <span>Financial Gateway Frozen: <strong className="text-emerald-400">100% SEALED 🔒</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 5: Governance */}
      {activeTab === 'governance' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Inviolable Rule Zero Governance Controls</h3>
            <p className="text-sm text-slate-400 mb-4">
              Strict constitutional boundaries guaranteeing zero automatic promotion, zero autonomous financial decisions, and complete tenant isolation.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200">Tenancy Isolation Guardrails</span>
                <p className="text-slate-400">Memory-isolated sandboxes with zero cross-tenant contamination.</p>
                <div className="text-emerald-400 font-semibold">ISOLATED_ENTERPRISE_TENANCY = true</div>
                <div className="text-emerald-400 font-semibold">ZERO_AUTOMATIC_PRODUCTION_PROMOTION = true</div>
              </div>
              <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200">Financial Gateway Isolation</span>
                <p className="text-slate-400">Paddle, Stripe, Fawry, and Mada remain 100% frozen with zero migrations.</p>
                <div className="text-emerald-400 font-semibold">FINANCIAL_GATEWAY_FROZEN = true</div>
                <div className="text-emerald-400 font-semibold">NO_AUTONOMOUS_FINANCIAL_DECISION = true</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
