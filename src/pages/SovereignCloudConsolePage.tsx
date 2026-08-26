/**
 * src/pages/SovereignCloudConsolePage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Global Sovereign Cloud Console
 * Specification: Task 17.6
 *
 * Command cockpit for private VPC deployment monitoring, custom grounding lexicon rules,
 * enterprise role hierarchy delegation, Cloud API v2.0 metrics, and legal cyber defense telemetry.
 */

import React, { useState, useMemo } from 'react';
import {
  Cloud,
  Server,
  Shield,
  Layers,
  Users,
  Cpu,
  Lock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Play,
  Key,
  Database,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { sovereignVpcAdapter, SovereignVpcEndpoint, SovereignDeploymentType } from '../cloud/sovereignVpcAdapter';
import { enterpriseGroundingPipeline, CustomGroundingRule } from '../cloud/enterpriseGroundingPipeline';
import { enterpriseRoleHierarchyEngine, RoleHierarchyNode } from '../cloud/enterpriseRoleHierarchy';
import { unifiedCloudApiGateway, CloudApiResponse } from '../cloud/unifiedCloudApiGateway';
import { legalThreatDefenseCenter, LegalThreatEvent } from '../cloud/legalThreatDefenseCenter';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type CloudConsoleTab = 'vpc' | 'grounding' | 'roles' | 'api' | 'threats';

export default function SovereignCloudConsolePage() {
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

  const access = checkAccess('sovereign_cloud_console', userTier);

  const [activeTab, setActiveTab] = useState<CloudConsoleTab>('vpc');

  // VPC State
  const [vpcEndpoints, setVpcEndpoints] = useState<SovereignVpcEndpoint[]>(() =>
    sovereignVpcAdapter.listEndpoints()
  );

  // Grounding State
  const [groundingRules, setGroundingRules] = useState<CustomGroundingRule[]>(() =>
    enterpriseGroundingPipeline.listGroundingRules()
  );
  const [newTermEn, setNewTermEn] = useState('');
  const [newTermAr, setNewTermAr] = useState('');
  const [newStandardEn, setNewStandardEn] = useState('');
  const [newStandardAr, setNewStandardAr] = useState('');

  // Roles State
  const [roles] = useState<RoleHierarchyNode[]>(() =>
    enterpriseRoleHierarchyEngine.listAllRoles()
  );

  // API State
  const [apiResponse, setApiResponse] = useState<CloudApiResponse | null>(null);

  // Threats State
  const [threatEvents] = useState<LegalThreatEvent[]>(() =>
    legalThreatDefenseCenter.listThreatEvents()
  );
  const defenseScore = useMemo(() => legalThreatDefenseCenter.getDefenseIndex(), []);

  const handleTestApi = () => {
    const res = unifiedCloudApiGateway.routeRequest({
      endpoint: '/v2/cloud/analyze',
      organizationId: 'org_enterprise_demo_01',
      apiKeyHash: 'hash_live_test_key_01',
      hmacSignature: 'sig_hmac_test_v2',
      payload: { mode: 'SOVEREIGN_PRIVATE_VPC' },
    });
    setApiResponse(res);
  };

  const handleAddGroundingRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTermEn || !newTermAr) return;
    const rule = enterpriseGroundingPipeline.addGroundingRule({
      organizationId: 'org_enterprise_demo_01',
      termEn: newTermEn,
      termAr: newTermAr,
      preferredStandardEn: newStandardEn,
      preferredStandardAr: newStandardAr,
      category: 'CUSTOM_LEXICON',
    });
    setGroundingRules([rule, ...groundingRules]);
    setNewTermEn('');
    setNewTermAr('');
    setNewStandardEn('');
    setNewStandardAr('');
  };

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | السحابة السيادية' : 'Access Restricted | Sovereign Cloud'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'قمرة قيادة السحابة السيادية مقيدة' : 'Sovereign Cloud Console Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'الوصول إلى لوحة تحكم السحابة السيادية والنماذج الخاصة مخصص حصرياً للمسؤولين المعتمدين.'
              : 'Access to the Sovereign Cloud Console and Private AI Endpoints is restricted to certified enterprise administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'قمرة قيادة السحابة السيادية للمؤسسات | JurisTech' : 'Sovereign Enterprise Cloud Console | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
              <Cloud className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'قمرة قيادة السحابة السيادية والذكاء الاصطناعي الخاص' : 'Sovereign Enterprise AI Cloud Console'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'إدارة بيئات VPC المعزولة، مسار الإسناد المؤسسي المخصص، شجرة الصلاحيات التدرجية، وبوابة Cloud API v2.0.'
              : 'Private VPC & on-premise LLM monitoring, custom enterprise grounding, multi-tenant RBAC, and Cloud API v2.0.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isAr ? `مؤشر الدفاع السيبراني: ${defenseScore}%` : `Cyber Defense Index: ${defenseScore}%`}
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('vpc')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'vpc' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          {isAr ? 'البيئات المعزولة (Private VPC)' : 'Sovereign VPC Endpoints'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('grounding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'grounding' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          {isAr ? 'الإسناد والمصطلحات المؤسسية' : 'Enterprise Grounding'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'roles' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          {isAr ? 'شجرة الصلاحيات وسقوف التوقيع' : 'Role Hierarchy & Limits'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'api' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          {isAr ? 'بوابة Cloud API v2.0' : 'Cloud API v2.0 Gateway'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('threats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'threats' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          {isAr ? 'مركز الدفاع السيبراني القانوني' : 'Legal Threat Defense'}
        </button>
      </div>

      {/* ── TAB 1: VPC ENDPOINTS ── */}
      {activeTab === 'vpc' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              {isAr ? 'البيئات السحابية السيادية والنماذج الخاصة المتصلة' : 'Active Sovereign Private VPC Endpoints'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{vpcEndpoints.length} Isolated Clusters</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {vpcEndpoints.map((ep) => (
              <div key={ep.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {ep.deploymentType}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    Latency: {ep.latencyMs}ms
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{ep.modelIdentifier}</h3>
                  <p className="text-slate-400 text-[11px] font-mono">{ep.dataSovereigntyRegion}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] space-y-1">
                  <div className="text-slate-400 truncate">Endpoint: {ep.endpointUrl}</div>
                  <div className="text-slate-500 truncate">TLS Fingerprint: {ep.tlsFingerprint}</div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {ep.status}
                  </span>
                  <span className="text-slate-500">Heartbeat: {ep.lastHeartbeat.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: ENTERPRISE GROUNDING ── */}
      {activeTab === 'grounding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              {isAr ? 'إضافة قاعدة إسناد / مصطلح مؤسسي جديد' : 'Add Custom Grounding Rule'}
            </h2>

            <form onSubmit={handleAddGroundingRule} className="space-y-3">
              <div>
                <label className="font-medium text-slate-400 block mb-1">{isAr ? 'المصطلح (إنجليزي):' : 'Term / Policy (English):'}</label>
                <input
                  type="text"
                  value={newTermEn}
                  onChange={(e) => setNewTermEn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="font-medium text-slate-400 block mb-1">{isAr ? 'المصطلح (عربي):' : 'Term / Policy (Arabic):'}</label>
                <input
                  type="text"
                  value={newTermAr}
                  onChange={(e) => setNewTermAr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="font-medium text-slate-400 block mb-1">{isAr ? 'المعيار المعتمد للمؤسسة:' : 'Institutional Standard (English):'}</label>
                <textarea
                  rows={2}
                  value={newStandardEn}
                  onChange={(e) => setNewStandardEn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-purple-500 font-medium text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-600/20"
              >
                {isAr ? 'حفظ قاعدة الإسناد' : 'Save Grounding Rule'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center justify-between">
              <span>{isAr ? 'قواعد الإسناد والمصطلحات المؤسسية النشطة' : 'Active Institutional Grounding Lexicon'}</span>
              <span className="text-xs text-slate-400 font-mono">{groundingRules.length} Rules</span>
            </h2>

            <div className="space-y-3">
              {groundingRules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {rule.category}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{rule.updatedAt.split('T')[0]}</span>
                  </div>

                  <h3 className="font-bold text-white text-sm">{isAr ? rule.termAr : rule.termEn}</h3>
                  <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {isAr ? rule.preferredStandardAr : rule.preferredStandardEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: ROLE HIERARCHY ── */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              {isAr ? 'شجرة الصلاحيات التدرجية وسقوف التوقيع المالي والقانوني' : 'Enterprise Multi-Tier Role Hierarchy & Signing Authority'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{roles.length} Roles Defined</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r) => (
              <div key={r.role} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Rank Level: {r.rankLevel}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    {r.maxSigningAuthorityUSD >= 1000000000 ? 'Unlimited' : `$${r.maxSigningAuthorityUSD.toLocaleString()} USD`}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{isAr ? r.titleAr : r.titleEn}</h3>
                  <p className="text-slate-400 text-[10px] font-mono">{r.role}</p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{isAr ? 'التفويض والإرسال الخارجي:' : 'External Dispatch:'}</span>
                    <span className={r.canAuthorizeExternalDispatch ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                      {r.canAuthorizeExternalDispatch ? 'Authorized' : 'Restricted'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{isAr ? 'إدارة السحابة السيادية:' : 'Manage Sovereign VPC:'}</span>
                    <span className={r.canManageSovereignVpc ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                      {r.canManageSovereignVpc ? 'Authorized' : 'Restricted'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{isAr ? 'إصدار شهادات التدقيق:' : 'Issue Certificates:'}</span>
                    <span className={r.canIssueAuditCertificates ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                      {r.canIssueAuditCertificates ? 'Authorized' : 'Restricted'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: API V2 TELEMETRY ── */}
      {activeTab === 'api' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              {isAr ? 'اختبار مسارات Cloud API v2.0 الموحدة' : 'Live Cloud API v2.0 Router Simulator'}
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-1.5">
                <div className="text-cyan-400 font-bold">POST /v2/cloud/analyze</div>
                <div className="text-slate-400">Authorization: HMAC-SHA256 (Signed Header)</div>
                <div className="text-slate-500">Execution Mode: SOVEREIGN_PRIVATE_VPC</div>
              </div>

              <button
                type="button"
                onClick={handleTestApi}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-600/20"
              >
                {isAr ? 'تنفيذ طلب تجريبي عبر البوابة v2.0' : 'Send Test Request via Gateway v2.0'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center justify-between">
              <span>{isAr ? 'استجابة البوابة اللحظية' : 'Gateway v2.0 Response'}</span>
              {apiResponse && (
                <span className="font-mono text-emerald-400">Latency: {apiResponse.latencyMs}ms</span>
              )}
            </h2>

            {apiResponse ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-bold">{apiResponse.statusText}</span>
                  <span className="text-slate-400">HTTP {apiResponse.statusCode}</span>
                </div>
                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(apiResponse.data, null, 2)}
                </pre>
                <div className="text-emerald-400 pt-2 border-t border-slate-800">
                  Privacy Guarantee: {apiResponse.privacyGuarantee}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                {isAr ? 'اضغط على تنفيذ طلب تجريبي لمشاهدة الاستجابة اللحظية.' : 'Click send test request to view live gateway execution.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 5: THREAT DEFENSE ── */}
      {activeTab === 'threats' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-400" />
              {isAr ? 'سجل التهديدات والاعتراضات السيبرانية القانونية' : 'Legal Threat Intelligence & Cyber Defense Stream'}
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-400">Defense Index: {defenseScore}%</span>
          </div>

          <div className="space-y-3">
            {threatEvents.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    {t.threatType} • {t.severity}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">{t.status}</span>
                </div>

                <div className="text-slate-200 font-medium">{t.mitigationAction}</div>
                <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] pt-1 border-t border-slate-800">
                  <span>Source IP: {t.sourceIpMasked}</span>
                  <span>Detected: {t.detectedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
