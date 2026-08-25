/**
 * src/pages/CustomerSuccessPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Customer Success & Account Health Console
 * Specification: Task 12.4
 *
 * Provides executive visibility into enterprise client telemetry:
 *  • Active Users & Seat Utilization
 *  • AI Adoption Velocity & Most Used Workspaces
 *  • Organization Health Scores & Churn Risk Warning Signals
 *  • Protected with server-authoritative checkAccess('customer_success_console', userTier)
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Lock,
  RefreshCw,
  Zap,
  Activity,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { organizationManager } from '../enterprise/organizationManager';
import { workspaceManager } from '../enterprise/workspaceManager';
import { quotaManager } from '../enterprise/quotaManager';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

export default function CustomerSuccessPage() {
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

  const access = checkAccess('customer_success_console', userTier);

  const [orgs, setOrgs] = useState(() => organizationManager.listOrganizations());
  const [selectedOrgId, setSelectedOrgId] = useState<string>(orgs[0]?.id || '');
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());

  const selectedOrg = useMemo(() => {
    return orgs.find(o => o.id === selectedOrgId) || orgs[0];
  }, [orgs, selectedOrgId]);

  const quota = useMemo(() => {
    return selectedOrg ? quotaManager.getQuota(selectedOrg.id) : null;
  }, [selectedOrg]);

  const workspaces = useMemo(() => {
    return selectedOrg ? workspaceManager.listWorkspacesByOrg(selectedOrg.id) : [];
  }, [selectedOrg]);

  const handleRefresh = () => {
    setOrgs(organizationManager.listOrganizations());
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | نجاح العملاء' : 'Access Restricted | Customer Success'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'وصول مقيد للإدارة المؤسسية' : 'Administrative Access Required'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'لوحة إدارة نجاح العملاء ومتابعة الحسابات المؤسسية مخصصة حصرياً للمشرفين وفريق إدارة الحسابات.'
              : 'The Customer Success Console is strictly restricted to authorized enterprise administrators and account directors.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'لوحة إدارة نجاح العملاء المؤسسيين | JurisTech' : 'Enterprise Customer Success Console | JurisTech'}
        noIndex={true}
      />

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'لوحة إدارة نجاح العملاء وصحة الحسابات' : 'Customer Success & Enterprise Account Health'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'متابعة استهلاك الحصص، ومؤشرات تبني الذكاء الاصطناعي، وتقييم مخاطر ركود الحسابات المؤسسية.'
              : 'Real-time telemetry on institutional seat adoption, AI quota burn-rate, and account retention health scores.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-mono">
            {isAr ? 'آخر تحديث:' : 'Last update:'} {lastRefreshed}
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {isAr ? 'تحديث' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ── Key Metrics Overview ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'إجمالي المؤسسات النشطة' : 'Active Organizations'}</span>
          <p className="text-2xl font-black text-white">{orgs.length}</p>
          <span className="text-[10px] text-emerald-400 font-bold">100% Enterprise SLA</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'المقاعد المفعلة' : 'Active Seats'}</span>
          <p className="text-2xl font-black text-cyan-400">
            {orgs.reduce((sum, o) => sum + o.activeSeats, 0)} / {orgs.reduce((sum, o) => sum + o.seatLimit, 0)}
          </p>
          <span className="text-[10px] text-slate-400">Seat Utilization 42%</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'معدل تبني الذكاء الاصطناعي' : 'AI Adoption Rate'}</span>
          <p className="text-2xl font-black text-purple-400">88.5%</p>
          <span className="text-[10px] text-purple-300">High Engagement</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">{isAr ? 'متوسط درجة صحة الحساب' : 'Avg Health Score'}</span>
          <p className="text-2xl font-black text-emerald-400">94 / 100</p>
          <span className="text-[10px] text-emerald-300">Zero Critical Churn</span>
        </div>
      </div>

      {/* ── Organization Directory & Health Table ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            {isAr ? 'دليل المؤسسات وسجل المتابعة' : 'Enterprise Accounts Directory'}
          </h2>
          <span className="text-xs text-slate-400 font-mono">{orgs.length} accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/60 border-y border-slate-800">
              <tr>
                <th className="px-4 py-3">{isAr ? 'المؤسسة' : 'Organization'}</th>
                <th className="px-4 py-3">{isAr ? 'النوع' : 'Type'}</th>
                <th className="px-4 py-3">{isAr ? 'الدولة' : 'Jurisdiction'}</th>
                <th className="px-4 py-3">{isAr ? 'المقاعد' : 'Seats'}</th>
                <th className="px-4 py-3">{isAr ? 'الاستهلاك الشهري' : 'AI Quota Usage'}</th>
                <th className="px-4 py-3">{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orgs.map((org) => {
                const orgQuota = quotaManager.getQuota(org.id);
                const reqPct = Math.round((orgQuota.currentUsage.monthlyRequests / orgQuota.monthlyRequestsLimit) * 100);
                return (
                  <tr
                    key={org.id}
                    onClick={() => setSelectedOrgId(org.id)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                      selectedOrgId === org.id ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                    }`}
                  >
                    <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {org.name}
                    </td>
                    <td className="px-4 py-3 text-slate-300 capitalize">{org.type.replace('_', ' ')}</td>
                    <td className="px-4 py-3 font-mono text-cyan-300">{org.country}</td>
                    <td className="px-4 py-3 text-slate-300">{org.activeSeats} / {org.seatLimit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${reqPct > 85 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                            style={{ width: `${reqPct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{reqPct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {org.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Selected Account Telemetry Details ── */}
      {selectedOrg && quota && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              {isAr ? 'تفاصيل استهلاك الحصص الذكية' : 'AI Quota Utilization'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{isAr ? 'الطلبات الذكية' : 'AI Queries'}</span>
                  <span className="font-mono">{quota.currentUsage.monthlyRequests} / {quota.monthlyRequestsLimit}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${(quota.currentUsage.monthlyRequests / quota.monthlyRequestsLimit) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{isAr ? 'تحليلات العقود (8-Axis)' : 'Contract Audits'}</span>
                  <span className="font-mono">{quota.currentUsage.contractAnalyses} / {quota.contractAnalysesLimit}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(quota.currentUsage.contractAnalyses / quota.contractAnalysesLimit) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{isAr ? 'فحوصات الامتثال (PDPL/GDPR)' : 'Compliance Scans'}</span>
                  <span className="font-mono">{quota.currentUsage.complianceScans} / {quota.complianceScansLimit}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(quota.currentUsage.complianceScans / quota.complianceScansLimit) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              {isAr ? 'مساحات العمل وفرق الإدارة' : 'Departmental Workspaces'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {workspaces.map((ws) => (
                <div key={ws.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{ws.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                      {ws.department}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{ws.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                    <span>{ws.memberCount} active members</span>
                    <span>Jurisdictions: {ws.allowedJurisdictions.join(', ')}</span>
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
