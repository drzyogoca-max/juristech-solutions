import React, { useState } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Award, 
  Activity, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  ExternalLink,
  Layers,
  Scale
} from 'lucide-react';
import { multiJurisdictionalScaleEngine } from '../enterprise/multiJurisdictionalScaleEngine';
import { institutionalMaturityMatrixEngine } from '../enterprise/institutionalMaturityMatrixEngine';
import { externalTrustVerificationGateway } from '../enterprise/externalTrustVerificationGateway';
import { hyperReliabilityFabric } from '../enterprise/hyperReliabilityFabric';

export default function InstitutionalScaleCommandCenterPage() {
  const [activeTab, setActiveTab] = useState<'radar' | 'matrix' | 'gateway' | 'reliability' | 'charters'>('radar');

  const scaleOverview = multiJurisdictionalScaleEngine.getMultiJurisdictionalScaleOverview();
  const matrixOverview = institutionalMaturityMatrixEngine.getInstitutionalMaturityMatrixOverview();
  const verificationOverview = externalTrustVerificationGateway.getExternalTrustVerificationOverview();
  const reliabilityOverview = hyperReliabilityFabric.getHyperReliabilityFabricOverview();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Institutional Scale & Global Verification Command Center
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            JurisTech Solutions v27.0.0 — Multi-Jurisdictional Statutory Expansion & Verifiable Trust Architecture
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <Lock className="w-3.5 h-3.5" />
            Rule Zero 100% Enforced
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            <CheckCircle className="w-3.5 h-3.5" />
            99.999% SLA Uptime
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'radar' 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          Jurisdiction Scale Radar ({scaleOverview.totalMonitoredJurisdictionsCount})
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'matrix' 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Institutional Maturity Matrix ({matrixOverview.overallInstitutionalMaturityScorePct}%)
        </button>

        <button
          onClick={() => setActiveTab('gateway')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'gateway' 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          External Verifiable Proofs ({verificationOverview.totalVerifiableProofsCount})
        </button>

        <button
          onClick={() => setActiveTab('reliability')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'reliability' 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          Hyper-Reliability Telemetry (99.999%)
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
          Global Charters & Policies
        </button>
      </div>

      {/* Tab 1: Jurisdiction Scale Radar */}
      {activeTab === 'radar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitored Sovereign Nodes</span>
              <p className="text-3xl font-bold text-cyan-400 mt-2">{scaleOverview.totalMonitoredJurisdictionsCount} Jurisdictions</p>
              <span className="text-xs text-slate-500 mt-1 block">Official gazette statutory feeds</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Tracked Statutes</span>
              <p className="text-3xl font-bold text-emerald-400 mt-2">{scaleOverview.totalActiveTrackedStatutesCount} Statutes</p>
              <span className="text-xs text-slate-500 mt-1 block">Grounded legislative records</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Provenance Health</span>
              <p className="text-3xl font-bold text-blue-400 mt-2">{scaleOverview.averageStatutoryHealthIndexPct}%</p>
              <span className="text-xs text-slate-500 mt-1 block">Zero statutory hallucination</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/80">
              <h2 className="text-sm font-semibold text-slate-200">Official Gazettes Statutory Ledger</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/80 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Jurisdiction</th>
                    <th className="px-4 py-3">Legal System</th>
                    <th className="px-4 py-3">Official Gazette Source</th>
                    <th className="px-4 py-3">Tracked Statutes</th>
                    <th className="px-4 py-3">Health Index</th>
                    <th className="px-4 py-3">Provenance Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {scaleOverview.jurisdictions.map((j) => (
                    <tr key={j.jurisdictionId} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-white">
                        {j.countryNameEn}
                        <span className="block text-xs text-slate-400">{j.countryNameAr}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300">{j.legalSystemType}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {j.officialGazetteSourceEn}
                        <span className="block text-xs text-slate-500">{j.officialGazetteSourceAr}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-400">{j.trackedStatutesCount}</td>
                      <td className="px-4 py-3 font-semibold text-cyan-400">{j.statutoryHealthIndexPct}%</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{j.statutoryProvenanceHashSha512.slice(0, 16)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Institutional Maturity Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Overall Institutional Maturity Index</h2>
                <p className="text-sm text-slate-400">Non-discriminatory enterprise readiness score with 100% explainability</p>
              </div>
              <span className="text-4xl font-extrabold text-cyan-400">{matrixOverview.overallInstitutionalMaturityScorePct}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matrixOverview.dimensions.map((d) => (
              <div key={d.dimensionKey} className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{d.dimensionTitleEn}</span>
                  <span className="text-emerald-400 font-bold text-lg">{d.scorePct}%</span>
                </div>
                <span className="text-xs text-slate-400 block font-arabic">{d.dimensionTitleAr}</span>
                <p className="text-xs text-slate-300">{d.explanationEn}</p>
                <p className="text-xs text-slate-400 font-arabic">{d.explanationAr}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
                  <span>Ref: {d.auditTrailReference}</span>
                  <span>Weight: {d.weightPct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: External Verifiable Proofs */}
      {activeTab === 'gateway' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verificationOverview.proofs.map((p) => (
              <div key={p.proofId} className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40">
                    {p.standardKey}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {p.attestationStatus}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{p.standardTitleEn}</h3>
                <span className="text-xs text-slate-400 block font-arabic">{p.standardTitleAr}</span>
                <p className="text-xs text-slate-300">Certifying Body: {p.certifyingBodyEn}</p>
                <p className="text-xs text-slate-400 font-arabic">{p.certifyingBodyAr}</p>
                <div className="p-2.5 bg-slate-950/70 rounded-lg text-xs font-mono text-slate-400 border border-slate-800">
                  <span className="text-slate-500 block">SHA-512 Verifiable Seal:</span>
                  {p.cryptographicProofHashSha512}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
                  <span>Signatory: {p.humanSignatoryRole}</span>
                  <span>Valid Thru: {p.validThroughDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Hyper-Reliability Telemetry */}
      {activeTab === 'reliability' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Uptime Availability</span>
              <p className="text-3xl font-bold text-emerald-400 mt-2">{reliabilityOverview.platformUptimeSlaPct}%</p>
              <span className="text-xs text-slate-500 mt-1 block">Five-Nines Global SLA</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mean Response Latency</span>
              <p className="text-3xl font-bold text-cyan-400 mt-2">{reliabilityOverview.meanGlobalLatencyMs}ms</p>
              <span className="text-xs text-slate-500 mt-1 block">Global Edge Invariant</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Boundary Breaches</span>
              <p className="text-3xl font-bold text-white mt-2">{reliabilityOverview.securityBreachCount}</p>
              <span className="text-xs text-slate-500 mt-1 block">100% Boundary Isolation</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Client Payloads Monitored</span>
              <p className="text-3xl font-bold text-purple-400 mt-2">{reliabilityOverview.clientPayloadsMonitoredCount}</p>
              <span className="text-xs text-slate-500 mt-1 block">Observability Without Surveillance</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Hyper-Reliability Infrastructure Telemetry Node Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reliabilityOverview.metrics.map((m) => (
                <div key={m.metricKey} className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm text-white block">{m.metricTitleEn}</span>
                    <span className="text-xs text-slate-400 font-arabic">{m.metricTitleAr}</span>
                    <span className="text-xs text-slate-500 mt-1 block font-mono">{m.benchmarkStandard}</span>
                  </div>
                  <span className="text-emerald-400 font-bold text-sm bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                    {m.metricValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Charters & Policies */}
      {activeTab === 'charters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <BookOpen className="w-5 h-5" />
              <h2 className="font-bold text-white">Enterprise Global Scale Charter</h2>
            </div>
            <p className="text-xs text-slate-400">Document Code: JUR-CHR-GSC-2026-V27</p>
            <div className="text-xs text-slate-300 space-y-2 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <p>• Multi-jurisdiction statutory ingestion across 10 sovereign nodes.</p>
              <p>• Mandatory official gazette source verification.</p>
              <p>• Zero autonomous policy mutation invariant.</p>
              <p>• Mandatory dual human legal officer sign-off.</p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="font-bold text-white">Enterprise External Verification Policy</h2>
            </div>
            <p className="text-xs text-slate-400">Document Code: JUR-POL-EVP-2026-V27</p>
            <div className="text-xs text-slate-300 space-y-2 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <p>• Public verifiable SHA-512 conformity proofs.</p>
              <p>• Strict zero exposure of confidential client contracts.</p>
              <p>• Observability without surveillance protocol.</p>
              <p>• 100% preservation of payment gateways and zero DB migrations.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
