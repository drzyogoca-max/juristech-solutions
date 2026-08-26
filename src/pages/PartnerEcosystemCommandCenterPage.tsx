import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { partnerTrustNetwork } from '../enterprise/partnerTrustNetwork';
import { integrationMarketplace } from '../enterprise/integrationMarketplace';
import { globalRegulatoryExpansion } from '../enterprise/globalRegulatoryExpansion';
import { ecosystemAttestationRegistry } from '../enterprise/ecosystemAttestationRegistry';
import { 
  Network, 
  Cpu, 
  Globe2, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Layers, 
  Building2, 
  Lock, 
  ArrowUpRight, 
  Activity,
  Zap,
  FileCheck
} from 'lucide-react';

type ActiveTab = 'partner_network' | 'integration_health' | 'regulatory_expansion' | 'channel_performance' | 'executive_attestation';

export default function PartnerEcosystemCommandCenterPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const [activeTab, setActiveTab] = useState<ActiveTab>('partner_network');

  const partnerOverview = partnerTrustNetwork.getPartnerTrustNetworkOverview();
  const integrationOverview = integrationMarketplace.getIntegrationMarketplaceOverview();
  const expansionOverview = globalRegulatoryExpansion.getRegulatoryExpansionOverview();
  const attestationOverview = ecosystemAttestationRegistry.getEcosystemAttestationOverview();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-cyan-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Network className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                {isAr ? 'مركز قيادة منظومة الشركاء والتكامل المؤسسي 15.0' : 'Enterprise Ecosystem & Partner Network Command Center 15.0'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {isAr 
                  ? 'إدارة شبكة الشركاء المعتمدين، صحة الموصلات والروابط، التوسع التنظيمي الدولي، وميثاق الحوكمة v22.0.0'
                  : 'Certified Partner Trust Network, Enterprise Connector Fabric, Global Regulatory Expansion & Governance v22.0.0'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Ecosystem Trust Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-indigo-500/30 rounded-xl px-4 py-2.5 shadow-lg shadow-indigo-950/20">
          <ShieldCheck className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <div className="text-xs text-slate-400">{isAr ? 'مؤشر ثقة المنظومة الشامل' : 'Ecosystem Trust Score'}</div>
            <div className="text-sm font-bold text-indigo-300">{partnerOverview.ecosystemTrustScore} / 100 ({isAr ? 'امتثال مثالي' : 'Optimal Compliance'})</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('partner_network')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'partner_network'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Building2 className="w-4 h-4" />
          {isAr ? 'شبكة الشركاء المعتمدين' : 'Partner Network'}
        </button>

        <button
          onClick={() => setActiveTab('integration_health')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'integration_health'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Cpu className="w-4 h-4" />
          {isAr ? 'سوق الموصلات والتكامل' : 'Integration Connectors'}
        </button>

        <button
          onClick={() => setActiveTab('regulatory_expansion')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'regulatory_expansion'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Globe2 className="w-4 h-4" />
          {isAr ? 'التوسع التنظيمي الدولي' : 'Regulatory Expansion'}
        </button>

        <button
          onClick={() => setActiveTab('channel_performance')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'channel_performance'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Activity className="w-4 h-4" />
          {isAr ? 'أداء القنوات و SLA' : 'Channel Performance'}
        </button>

        <button
          onClick={() => setActiveTab('executive_attestation')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'executive_attestation'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Award className="w-4 h-4" />
          {isAr ? 'سجل الإثباتات والاعتماد' : 'Attestation Registry'}
        </button>
      </div>

      {/* Tab 1: Partner Network */}
      {activeTab === 'partner_network' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'إجمالي الشركاء المعتمدين' : 'Certified Partners'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{partnerOverview.totalCertifiedPartners}</div>
              <div className="text-xs text-indigo-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isAr ? '100% مدققين أمنياً' : '100% Security Audited'}
              </div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'شركاء سياديين Tier-1' : 'Tier-1 Strategic Partners'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{partnerOverview.tier1StrategicPartnersCount}</div>
              <div className="text-xs text-slate-400 mt-2">{isAr ? 'تحالفات سيادية واستراتيجية' : 'Sovereign alliances'}</div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'متوسط الامتثال لـ SLA' : 'Avg SLA Compliance'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{partnerOverview.averageNetworkSlaCompliancePct}%</div>
              <div className="text-xs text-emerald-400 mt-2">{isAr ? 'أعلى من الحد الأدنى 99.5%' : '>99.5% threshold met'}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              {isAr ? 'سجل تحالفات الشركاء وشبكة التوزيع المعتمدة' : 'Certified Partner Trust Network Registry'}
            </h3>
            <div className="space-y-4">
              {partnerOverview.partners.map((p) => (
                <div key={p.partnerId} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{p.partnerName}</div>
                      <div className="text-xs text-slate-400">{p.partnerType} • {p.accreditedLawyersOrAuditorsCount} {isAr ? 'محامي/مدقق معتمد' : 'Accredited Counsel/Auditors'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">{isAr ? 'التثبيتات النشطة' : 'Active Deployments'}</div>
                        <div className="text-sm font-bold text-indigo-300">{p.activeClientDeploymentsCount} {isAr ? 'جهة' : 'Clients'}</div>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {p.certificationTier}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                    <div>{isAr ? 'النطاق القضائي:' : 'Jurisdictions:'} <span className="text-slate-300 font-mono">{p.jurisdictionScope.join(', ')}</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-medium">SLA: {p.slaComplianceRatePct}%</span>
                      <span className="font-mono text-slate-500 truncate max-w-xs">{p.evidenceDigestSha512}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Integration Connectors */}
      {activeTab === 'integration_health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'الموصلات المؤسسية المعتمدة' : 'Certified Connectors'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{integrationOverview.totalCertifiedConnectors} {isAr ? 'موصلات' : 'Connectors'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'التكاملات المؤسسية النشطة' : 'Active Integrations'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{integrationOverview.activeEnterpriseIntegrationsCount}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط زمن الاستجابة' : 'Avg Latency'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{integrationOverview.averageConnectorLatencyMs} ms</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationOverview.connectors.map((conn) => (
              <div key={conn.connectorId} className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{conn.connectorName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{conn.targetSystem} • {conn.category}</div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    {conn.healthStatus}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div>{isAr ? 'نوع التكامل والبروتوكول:' : 'Integration & Protocol:'} <span className="text-slate-300">{conn.integrationType} ({conn.supportedProtocols.join(', ')})</span></div>
                  <div>{isAr ? 'عزل بدون تخزين البيانات:' : 'Zero-Knowledge Enclave:'} <span className="text-emerald-400 font-bold">{conn.zeroKnowledgePayloadEnforced ? (isAr ? 'مفعل وصارم' : 'Enforced') : 'No'}</span></div>
                  <div className="font-mono text-slate-500 truncate">{conn.cryptographicSchemaHashSha512}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Regulatory Expansion */}
      {activeTab === 'regulatory_expansion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'الولايات القضائية المراقبة' : 'Monitored Jurisdictions'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{expansionOverview.totalMonitoredJurisdictions} {isAr ? 'أسواق دولية' : 'Markets'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط الجاهزية التنظيمية' : 'Avg Expansion Readiness'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{expansionOverview.averageExpansionReadinessPct}%</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'أسواق متوافقة منخفضة المخاطر' : 'Low Risk Harmonized Markets'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{expansionOverview.lowRiskHarmonizedCount}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expansionOverview.markets.map((m) => (
              <div key={m.jurisdictionCode} className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{m.countryOrRegionName} ({m.jurisdictionCode})</div>
                    <div className="text-xs text-slate-400 mt-0.5">{m.sovereignDataResidencyMandate}</div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                    {m.readinessScorePct}% {isAr ? 'جاهزية' : 'Ready'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                  <div>{isAr ? 'الأنظمة المرجعية:' : 'Primary Statutes:'} <span className="text-slate-300">{m.primaryStatutes.join(', ')}</span></div>
                  <div>{isAr ? 'حالة السحابة السيادية:' : 'Sovereign Enclave:'} <span className="text-emerald-400 font-bold">{m.sovereignEnclaveCertified ? (isAr ? 'معتمدة ومطابقة' : 'Certified') : 'Pending'}</span></div>
                  <div className="font-mono text-slate-500 truncate">{m.regulatoryEvidenceHashSha512}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Channel Performance */}
      {activeTab === 'channel_performance' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              {isAr ? 'مصفوفة مؤشرات أداء قنوات التوزيع والامتثال التشغيلي' : 'Channel Performance & Sovereign Telemetry Matrix'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                <div className="font-bold text-indigo-300">{isAr ? 'حوكمة اتفاقيات مستوى الخدمة (SLA)' : 'SLA Compliance Governance'}</div>
                <p className="text-slate-400">
                  {isAr 
                    ? 'يتم قياس جودة الردود، سرعة استجابة الموصلات، والامتثال التنظيمي للشركاء بشكل مستمر مع إطلاق تنبيهات تلقائية عند انخفاض الأداء دون 99.5%.'
                    : 'Continuous monitoring of connector latency, response fidelity, and partner compliance guarantees 99.5%+ uptime.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                <div className="font-bold text-indigo-300">{isAr ? 'حظر التدخل التجاري الآلي' : 'Zero Commercial Auto-Commitment'}</div>
                <p className="text-slate-400">
                  {isAr 
                    ? 'محركات المنظومة تعمل كطبقة تحليل استرشادية دون إنشاء أي التزامات تجارية أو حصرية تعاقدية آلية.'
                    : 'All partner telemetry operates in advisory mode without generating automated commercial warranties or binding commitments.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Attestation Registry */}
      {activeTab === 'executive_attestation' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              {isAr ? 'سجل الإثباتات التنظيمية والاعتماد التنفيذي المشفر v22.0.0' : 'Ecosystem Attestation Registry & Executive Charter'}
            </h3>
            <div className="space-y-4">
              {attestationOverview.attestations.map((att) => (
                <div key={att.attestationId} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{att.subjectName}</div>
                      <div className="text-xs text-slate-400">{att.attestationStandard} • {att.attestedByRole}</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      {att.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{new Date(att.attestationTimestamp).toLocaleDateString()}</span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{att.fingerprintSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
