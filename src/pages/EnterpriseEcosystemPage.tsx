/**
 * src/pages/EnterpriseEcosystemPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Marketplace & AI Ecosystem Console
 * Specification: Task 13.6
 *
 * Consolidated Developer & Ecosystem Management:
 *  • Developer API Keys Management (Hashed SHA-256)
 *  • Specialized AI Agent Marketplace (M&A, ZATCA, Islamic Finance, PDPL)
 *  • Enterprise Partner Integrations (SharePoint, SAP, Salesforce, DocuSign, ZATCA)
 *  • Custom Enterprise AI Policy Rules & DSL
 *  • Regulatory Compliance Export Packages (SOC2 Type II, ISO 27001, PDPL)
 */

import React, { useState, useMemo } from 'react';
import {
  Key,
  ShoppingBag,
  Cpu,
  Plug,
  Shield,
  FileDown,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code,
  Activity,
  Layers,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { apiKeyManager, StoredApiKeyRecord, ApiKeyScope } from '../api/apiKeyManager';
import { agentMarketplace, SpecializedAgent } from '../ai/marketplace/agentMarketplace';
import { partnerIntegrationsManager, EnterpriseConnector } from '../integrations/partnerIntegrations';
import { customPolicyEngine, CustomEnterprisePolicy } from '../ai/policies/customPolicyEngine';
import { complianceExportEngine, ComplianceStandard, ComplianceExportPackage } from '../ecosystem/complianceExportEngine';
import { organizationManager } from '../enterprise/organizationManager';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type EcosystemTab = 'keys' | 'marketplace' | 'connectors' | 'policies' | 'compliance';

export default function EnterpriseEcosystemPage() {
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

  const access = checkAccess('enterprise_ecosystem_console', userTier);

  const [activeTab, setActiveTab] = useState<EcosystemTab>('keys');
  const [orgs] = useState(() => organizationManager.listOrganizations());
  const [selectedOrgId, setSelectedOrgId] = useState<string>(orgs[0]?.id || 'org_enterprise_demo_01');

  // API Key State
  const [keys, setKeys] = useState<StoredApiKeyRecord[]>(() => apiKeyManager.listApiKeys(selectedOrgId));
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRaw, setNewKeyRaw] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Marketplace State
  const [agents, setAgents] = useState<SpecializedAgent[]>(() => agentMarketplace.listAgents());

  // Connectors State
  const [connectors, setConnectors] = useState<EnterpriseConnector[]>(() => partnerIntegrationsManager.listConnectors());
  const [pingMessage, setPingMessage] = useState<string | null>(null);

  // Compliance Export State
  const [exportPackage, setExportPackage] = useState<ComplianceExportPackage | null>(null);

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const result = apiKeyManager.createApiKey({
      organizationId: selectedOrgId,
      name: newKeyName.trim(),
      environment: 'live',
      scopes: ['legal.research', 'contract.analyze', 'compliance.scan', 'document.generate'],
      rateLimitPerMinute: 120,
    });
    setNewKeyRaw(result.rawKey);
    setNewKeyName('');
    setKeys(apiKeyManager.listApiKeys(selectedOrgId));
  };

  const handleRevokeKey = (keyId: string) => {
    apiKeyManager.revokeApiKey(keyId);
    setKeys(apiKeyManager.listApiKeys(selectedOrgId));
  };

  const handleToggleAgent = (agentId: string) => {
    const isInstalled = agentMarketplace.isAgentInstalled(selectedOrgId, agentId);
    if (isInstalled) {
      agentMarketplace.uninstallAgent(selectedOrgId, agentId);
    } else {
      agentMarketplace.installAgent(selectedOrgId, agentId);
    }
    setAgents([...agentMarketplace.listAgents()]);
  };

  const handlePingConnector = (connectorId: string) => {
    const result = partnerIntegrationsManager.testConnection(connectorId);
    setConnectors([...partnerIntegrationsManager.listConnectors()]);
    setPingMessage(result.message);
    setTimeout(() => setPingMessage(null), 4000);
  };

  const handleGenerateExport = (std: ComplianceStandard) => {
    const pkg = complianceExportEngine.generateExportPackage(selectedOrgId, std);
    setExportPackage(pkg);
  };

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | منظومة المطورين والشركاء' : 'Access Restricted | Ecosystem'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'وصول مقيد للإدارة المؤسسية' : 'Enterprise Ecosystem Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'بوابة المطورين، وسوق الوكلاء المتخصصين، وروابط الشركاء مخصصة حصرياً لمدراء المنظومة المؤسسية.'
              : 'The Developer Gateway, AI Agent Marketplace, and Partner Connectors Hub is restricted to authorized enterprise administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'منظومة المطورين وسوق الوكلاء الذكي | JurisTech' : 'Enterprise Ecosystem & AI Marketplace | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'منظومة الذكاء الاصطناعي وسوق الوكلاء والمطورين' : 'Enterprise Marketplace & AI Ecosystem Hub'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'إدارة مفاتيح API، وتثبيت الوكلاء المتخصصين، وربط أنظمة الشركاء (SAP/SharePoint/DocuSign/ZATCA)، وتصدير الامتثال.'
              : 'Developer API Gateway, specialized legal agent catalog, enterprise partner connectors, and audit compliance export.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedOrgId}
            onChange={(e) => {
              setSelectedOrgId(e.target.value);
              setKeys(apiKeyManager.listApiKeys(e.target.value));
            }}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 font-semibold"
          >
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('keys')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'keys' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          {isAr ? 'مفاتيح المطورين (API Keys)' : 'Developer API Keys'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'marketplace' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {isAr ? 'سوق الوكلاء المتخصصين' : 'AI Agent Marketplace'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('connectors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'connectors' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Plug className="w-3.5 h-3.5" />
          {isAr ? 'موصلات الشركاء (Connectors)' : 'Partner Integrations'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'compliance' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <FileDown className="w-3.5 h-3.5" />
          {isAr ? 'حزم تصدير الامتثال (SOC2/PDPL)' : 'Compliance Exports'}
        </button>
      </div>

      {/* ── TAB 1: DEVELOPER API KEYS ── */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              {isAr ? 'توليد مفتاح API جديد للمؤسسة' : 'Generate New Developer API Key'}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder={isAr ? 'اسم المفتاح (مثال: Production Backend Service)' : 'Key name (e.g. Production Backend Service)'}
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleCreateKey}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/20"
              >
                {isAr ? 'إنشاء المفتاح' : 'Generate Key'}
              </button>
            </div>

            {newKeyRaw && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <p className="text-[11px] text-amber-300 font-bold">
                  ⚠️ {isAr ? 'انسخ هذا المفتاح الآن! لن يتم عرضه مرة أخرى لأسباب أمنية (يتم تخزين التجزئة المشفرة فقط):' : 'Copy this key now! For security reasons, it will not be displayed again (only SHA-256 hash is stored):'}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={newKeyRaw}
                    className="flex-1 bg-slate-950 font-mono text-xs text-amber-400 p-2.5 rounded-lg border border-amber-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(newKeyRaw);
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 2000);
                    }}
                    className="px-3 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all"
                  >
                    {copiedKey ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              {isAr ? 'سجل مفاتيح API المفعلة' : 'Active API Keys'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/60 border-y border-slate-800">
                  <tr>
                    <th className="px-4 py-3">{isAr ? 'الاسم' : 'Name'}</th>
                    <th className="px-4 py-3">{isAr ? 'المفتاح' : 'Key Prefix'}</th>
                    <th className="px-4 py-3">{isAr ? 'البيئة' : 'Env'}</th>
                    <th className="px-4 py-3">{isAr ? 'النطاقات' : 'Scopes'}</th>
                    <th className="px-4 py-3">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="px-4 py-3 text-right">{isAr ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-bold text-white">{k.name}</td>
                      <td className="px-4 py-3 font-mono text-cyan-400">{k.keyPrefix}</td>
                      <td className="px-4 py-3 uppercase font-mono text-[10px] text-slate-300">{k.environment}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {k.scopes.map(s => (
                            <span key={s} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          k.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {k.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {k.status === 'ACTIVE' && (
                          <button
                            type="button"
                            onClick={() => handleRevokeKey(k.id)}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Revoke Key"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: AGENT MARKETPLACE ── */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => {
            const isInstalled = agentMarketplace.isAgentInstalled(selectedOrgId, agent.id);
            return (
              <div key={agent.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                      {agent.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">v{agent.version}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {isAr ? agent.nameAr : agent.nameEn}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isAr ? agent.descriptionAr : agent.descriptionEn}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      Jurisdictions: {agent.jurisdictions.join(', ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${
                      agent.riskLevel === 'HIGH' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>
                      Risk: {agent.riskLevel}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                      Review: {agent.humanReviewPolicy}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">By {agent.author}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleAgent(agent.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isInstalled
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/20'
                    }`}
                  >
                    {isInstalled ? (isAr ? 'إلغاء التثبيت' : 'Uninstall') : (isAr ? 'تثبيت الوكيل' : 'Install Agent')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB 3: PARTNER INTEGRATIONS ── */}
      {activeTab === 'connectors' && (
        <div className="space-y-6">
          {pingMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {pingMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connectors.map((conn) => (
              <div key={conn.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    {conn.category.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {conn.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {isAr ? conn.nameAr : conn.nameEn}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr ? conn.descriptionAr : conn.descriptionEn}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Latency: {conn.latencyMs || 120}ms</span>
                  <span>Sync Events: {conn.syncEventsCount.toLocaleString()}</span>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">Auth: {conn.authType}</span>
                  <button
                    type="button"
                    onClick={() => handlePingConnector(conn.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    {isAr ? 'اختبار الاتصال' : 'Test Ping'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: COMPLIANCE EXPORTS ── */}
      {activeTab === 'compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileDown className="w-4 h-4 text-amber-400" />
              {isAr ? 'توليد حزم إثبات الامتثال الرسمي' : 'Generate Compliance Package'}
            </h2>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleGenerateExport('SOC2_TYPE_II')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all space-y-1 text-xs"
              >
                <span className="font-bold text-white block">SOC2 Type II Package</span>
                <span className="text-[11px] text-slate-400 block">Security, Availability & Processing Integrity</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateExport('ISO_27001')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all space-y-1 text-xs"
              >
                <span className="font-bold text-white block">ISO/IEC 27001:2022 ISMS</span>
                <span className="text-[11px] text-slate-400 block">Information Security Controls & Segregation</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateExport('PDPL_ARTICLE_29')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all space-y-1 text-xs"
              >
                <span className="font-bold text-white block">Saudi PDPL Article 29 Package</span>
                <span className="text-[11px] text-slate-400 block">Cross-Border Data Transfer & Masking Evidence</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              {isAr ? 'بيانات الشهادة المشفرة وسجل الامتثال' : 'Cryptographic Compliance Package Output'}
            </h2>

            {exportPackage ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 font-mono uppercase">{exportPackage.standard}</span>
                    <span className="font-mono text-[10px] text-slate-500">{exportPackage.generatedAt}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {isAr ? exportPackage.executiveSummaryAr : exportPackage.executiveSummaryEn}
                  </p>
                  <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500 truncate">
                    Verification Seal: {exportPackage.verificationHash}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Audited Events</span>
                    <span className="font-bold text-white">{exportPackage.metrics.totalAuditedEvents}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">AI Safety</span>
                    <span className="font-bold text-emerald-400">{exportPackage.metrics.aiSafetyScore}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Citations</span>
                    <span className="font-bold text-cyan-400">{exportPackage.metrics.citationComplianceRate}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Masking</span>
                    <span className="font-bold text-purple-400">{exportPackage.metrics.dataMaskingLevel}</span>
                  </div>
                </div>

                <p className="text-[10px] text-emerald-400 font-mono">
                  ✓ Certified by {exportPackage.certifiedBy}
                </p>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">
                {isAr ? 'اختر معياراً من القائمة الجانبية لتوليد حزمة الإثبات المشفرة.' : 'Select a compliance standard on the left to generate certified evidence package.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
