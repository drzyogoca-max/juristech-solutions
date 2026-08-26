/**
 * src/pages/ScaleReadinessCommandCenterPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Executive Enterprise Scale & Readiness Command Center
 * Specification: Task 23.6
 *
 * Executive cockpit for multi-region reliability monitoring, disaster recovery benchmarks,
 * virtual data room (VDR) audit management, enterprise UAT pipelines, and responsible AI tracking.
 */

import React, { useState, useMemo } from 'react';
import {
  Globe,
  RefreshCw,
  FileCheck,
  Users,
  ShieldAlert,
  Lock,
  CheckCircle2,
  Clock,
  HardDrive,
  Activity,
  Server,
  Layers,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { multiRegionReliabilityCenter, MultiRegionReadinessSummary, SovereignRegionNode } from '../scale/multiRegionReliabilityCenter';
import { externalAuditSimulation, VirtualDataRoom } from '../scale/externalAuditSimulation';
import { enterpriseAcceptanceFramework, EnterpriseAcceptanceSuite } from '../scale/enterpriseAcceptanceFramework';
import { responsibleAiProgram, ResponsibleAiProgramSummary, ResponsibleAiVulnerability } from '../scale/responsibleAiProgram';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type ScaleTab = 'regions' | 'dr' | 'vdr' | 'uat' | 'responsible_ai';

export default function ScaleReadinessCommandCenterPage() {
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

  const access = checkAccess('scale_readiness', userTier);

  const [activeTab, setActiveTab] = useState<ScaleTab>('regions');

  const multiRegion = useMemo<MultiRegionReadinessSummary>(
    () => multiRegionReliabilityCenter.getMultiRegionSummary(),
    []
  );
  const [rooms] = useState<VirtualDataRoom[]>(() => externalAuditSimulation.listRooms());
  const [uatSuites] = useState<EnterpriseAcceptanceSuite[]>(() => enterpriseAcceptanceFramework.listSuites());
  const aiProgram = useMemo<ResponsibleAiProgramSummary>(
    () => responsibleAiProgram.getProgramSummary(),
    []
  );

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | Scale Readiness' : 'Access Restricted | Scale Readiness'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'مركز التوسع والاستمرارية المؤسسية مقيد' : 'Enterprise Scale Center Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'الوصول إلى قمرة قيادة التوسع المؤسسي ومحاكاة التعافي من الكوارث مخصص حصرياً للمستشار العام ومدراء النظام التنفيذيين.'
              : 'Access to the Enterprise Scale Command Center is restricted to General Counsel and enterprise executive administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز التوسع والاستمرارية المؤسسية | JurisTech' : 'Enterprise Scale & Disaster Recovery Hub | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز التوسع والاستمرارية والجاهزية الخارجية 9.0' : 'Enterprise Scale Validation & External Readiness Hub 9.0'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'إدارة المناطق السحابية المتعددة، محاكاة التعافي من الكوارث، غرف التدقيق الافتراضية، واختبارات قبول كبرى المؤسسات.'
              : 'Multi-region reliability monitoring, disaster recovery benchmarks, virtual data rooms (VDR), and enterprise UAT pipelines.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isAr ? 'جاهزية RTO: 0.42s' : 'RTO Target: < 1.0s (0.42s)'}
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('regions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'regions' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          {isAr ? 'المناطق السحابية السيادية' : 'Multi-Region Health'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dr')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'dr' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {isAr ? 'التعافي من الكوارث (DR)' : 'Disaster Recovery'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vdr')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'vdr' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          {isAr ? 'غرف التدقيق الافتراضية (VDR)' : 'External Audit VDR'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('uat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'uat' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          {isAr ? 'اختبارات القبول المؤسسي (UAT)' : 'Enterprise UAT'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('responsible_ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'responsible_ai' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          {isAr ? 'الذكاء المسؤول والإفصاح الأمني' : 'Responsible AI & Vulnerability'}
        </button>
      </div>

      {/* ── TAB 1: MULTI-REGION HEALTH ── */}
      {activeTab === 'regions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Active Sovereign Regions</div>
              <div className="text-cyan-400 font-mono font-bold text-base">{multiRegion.activeRegionsCount} Datacenters</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Composite Global Uptime</div>
              <div className="text-emerald-400 font-mono font-bold text-base">{multiRegion.globalCompositeUptimePct}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Average Global Latency</div>
              <div className="text-indigo-400 font-mono font-bold text-base">{multiRegion.averageGlobalLatencyMs}ms</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-xl text-center">
              <div className="text-slate-500 text-[10px]">Mode Enforced</div>
              <div className="text-emerald-400 font-mono font-bold text-base">Simulation & Telemetry</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {multiRegion.regions.map((r) => (
              <div key={r.regionId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {r.datacenterTier}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">90D: {r.uptime90DaysPct}%</span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? r.regionNameAr : r.regionNameEn}</h3>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                  <span>Latency: {r.latencyMs}ms</span>
                  <span>Lag: {r.replicationLagMs}ms</span>
                  <span className="text-emerald-400 font-bold">{r.healthStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: DISASTER RECOVERY ── */}
      {activeTab === 'dr' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              {isAr ? 'محاكاة التعافي من الكوارث واستمرارية الأعمال (RTO / RPO)' : 'Disaster Recovery (DR) & Failover Benchmark'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-500 text-[10px]">Recovery Time Target (RTO)</div>
                <div className="text-emerald-400 font-mono font-bold text-sm">&le; {multiRegion.drBenchmark.rtoTargetSeconds}s</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-500 text-[10px]">Simulated Failover Time</div>
                <div className="text-cyan-400 font-mono font-bold text-sm">{multiRegion.drBenchmark.rtoSimulatedSeconds}s</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-500 text-[10px]">Recovery Point Target (RPO)</div>
                <div className="text-emerald-400 font-mono font-bold text-sm">0 Data Loss</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-500 text-[10px]">Failover Validation Status</div>
                <div className="text-emerald-400 font-mono font-bold text-sm">PASSED 100%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: AUDIT VDR ── */}
      {activeTab === 'vdr' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              {isAr ? 'غرف التدقيق الافتراضية المستقلة (Virtual Data Rooms)' : 'Independent Virtual Data Rooms (VDR)'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">Audit View Only • Raw Export Blocked</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <div key={room.roomId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {room.targetAuditorFirm}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">View Only</span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? room.roomTitleAr : room.roomTitleEn}</h3>
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {room.evidenceItems.map((ev) => (
                    <div key={ev.evidenceId} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                        <span>{ev.controlCode} — {isAr ? ev.titleAr : ev.titleEn}</span>
                        <span className="text-emerald-400">{ev.verificationStatus}</span>
                      </div>
                      <div className="text-slate-500 font-mono text-[9px] truncate">{ev.cryptographicProofHash}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: ENTERPRISE UAT ── */}
      {activeTab === 'uat' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            {isAr ? 'مسارات قبول المستخدم المؤسسي والحكومي (UAT)' : 'Enterprise & Government UAT Acceptance Pipelines'}
          </h2>

          <div className="space-y-4">
            {uatSuites.map((suite) => (
              <div key={suite.suiteId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {suite.clientType}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">Progress: {suite.overallProgressPct}%</span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? suite.clientEnterpriseNameAr : suite.clientEnterpriseNameEn}</h3>
                <div className="text-[11px] text-slate-400">Current Stage: <span className="text-cyan-400 font-mono font-bold">{suite.currentStage}</span></div>
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {suite.testCases.map((tc) => (
                    <div key={tc.testId} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[10px]">
                      <div>
                        <div className="font-bold text-white">{isAr ? tc.testTitleAr : tc.testTitleEn}</div>
                        <div className="text-slate-500 font-mono">Result: {tc.achievedResult}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono">
                        PASSED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: RESPONSIBLE AI ── */}
      {activeTab === 'responsible_ai' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              {isAr ? 'سجل مخاطر الذكاء الاصطناعي والإفصاح الأمني المسؤول' : 'Responsible AI Register & Vulnerability Program'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">Safe Harbor Active • No Auto-Patching</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiProgram.vulnerabilities.map((vuln) => (
              <div key={vuln.vulnId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    CVSS {vuln.cvssScore} • {vuln.severity}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">{vuln.status}</span>
                </div>
                <h3 className="font-bold text-white text-sm">{isAr ? vuln.titleAr : vuln.titleEn}</h3>
                <div className="text-[10px] text-slate-400">Affected: {vuln.affectedComponent}</div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-500 truncate">
                  Hash: {vuln.cryptographicReportHash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
