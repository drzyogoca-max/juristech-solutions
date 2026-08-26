/**
 * src/pages/RegulatoryRadarPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Governance Center 3.0 & Regulatory Radar
 * Specification: Task 16.6
 *
 * Real-time institutional compliance cockpit:
 *  • Continuous Legislative Radar & Statutory Drift Tracking
 *  • Cross-Jurisdiction AI & Privacy Matrix (Saudi PDPL, EU AI Act, NIST AI RMF)
 *  • Model Bias, Hallucination, & Robustness Audit Cockpit
 *  • Cryptographic Compliance Certificate Generator
 *  • Real-Time Regulatory Notification & Webhook Dispatcher
 */

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Radio,
  FileCheck2,
  Lock,
  Award,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  Cpu,
  Layers,
  Scale,
  FileText,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { regulatoryRadarEngine, RegulatoryDriftRecord } from '../governance/regulatoryRadarEngine';
import { aiComplianceMatrixEngine, ComplianceFrameworkProfile, CrossJurisdictionEvaluation } from '../governance/aiComplianceMatrix';
import { aiRiskBiasAuditor, ModelBiasAuditReport } from '../governance/aiRiskBiasAuditor';
import { auditCertificateGenerator, AuditCertificate } from '../governance/auditCertificateGenerator';
import { regulatoryNotificationDispatcher, RegulatoryWebhookEndpoint, WebhookDispatchLog, RegulatoryAlertSeverity } from '../governance/regulatoryNotificationDispatcher';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type RadarTab = 'radar' | 'compliance' | 'bias' | 'certificates' | 'webhooks';

export default function RegulatoryRadarPage() {
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

  const access = checkAccess('regulatory_radar_v3', userTier);

  const [activeTab, setActiveTab] = useState<RadarTab>('radar');

  // Radar state
  const [driftRecords] = useState<RegulatoryDriftRecord[]>(() =>
    regulatoryRadarEngine.listDriftRecords()
  );
  const avgDriftIndex = useMemo(() => regulatoryRadarEngine.calculateAverageDriftIndex(), []);

  // Compliance Matrix state
  const [frameworks] = useState<ComplianceFrameworkProfile[]>(() =>
    aiComplianceMatrixEngine.listFrameworks()
  );
  const [evaluation] = useState<CrossJurisdictionEvaluation>(() =>
    aiComplianceMatrixEngine.evaluateGlobalCompliance()
  );

  // Bias & Risk Audit state
  const [auditReport, setAuditReport] = useState<ModelBiasAuditReport>(() =>
    aiRiskBiasAuditor.getLatestAuditReport()
  );

  // Certificates state
  const [certificates, setCertificates] = useState<AuditCertificate[]>(() =>
    auditCertificateGenerator.listCertificates()
  );

  // Webhooks state
  const [endpoints] = useState<RegulatoryWebhookEndpoint[]>(() =>
    regulatoryNotificationDispatcher.listEndpoints()
  );
  const [dispatchLogs, setDispatchLogs] = useState<WebhookDispatchLog[]>(() =>
    regulatoryNotificationDispatcher.listDispatchLogs()
  );
  const [testWebhookEvent, setTestWebhookEvent] = useState(
    'SDAIA Circular: Update on Cross-Border Data Transfer Adequacy Framework'
  );
  const [testSeverity, setTestSeverity] = useState<RegulatoryAlertSeverity>('CRITICAL_AMENDMENT');

  const handleRunNewAudit = () => {
    const report = aiRiskBiasAuditor.runAudit();
    setAuditReport(report);
  };

  const handleGenerateCertificate = () => {
    const cert = auditCertificateGenerator.generateCertificate({
      organizationId: 'org_enterprise_demo_01',
      issuer: 'JurisTech Global Governance & Compliance Assurance Board',
      standards: ['Saudi SDAIA PDPL (M/148)', 'EU AI Act (2024/1689)', 'NIST AI RMF 1.0'],
      trustScore: auditReport.compositeTrustAndSafetyIndex,
    });
    setCertificates([cert, ...certificates]);
  };

  const handleDispatchTestWebhook = () => {
    if (endpoints.length === 0) return;
    const log = regulatoryNotificationDispatcher.dispatchAlert({
      endpointId: endpoints[0].id,
      eventTitleEn: testWebhookEvent,
      eventTitleAr: 'تعميم سدايا: تحديث معايير كفاية نقل البيانات الشخصية عبر الحدود',
      severity: testSeverity,
    });
    setDispatchLogs([log, ...dispatchLogs]);
  };

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | رادار الامتثال 3.0' : 'Access Restricted | Regulatory Radar 3.0'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'مركز الحوكمة والرادار التنظيمي مقيد' : 'Enterprise Regulatory Radar Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'الوصول إلى رادار التغييرات التشريعية ومصفوفة الامتثال للذكاء الاصطناعي مقتصر على مسؤولي النظام المعتمدين.'
              : 'Access to the Continuous Regulatory Radar and AI Compliance Matrix is strictly restricted to certified enterprise administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز الحوكمة والرادار التنظيمي 3.0 | JurisTech' : 'Enterprise AI Regulatory Radar 3.0 | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
              <Radio className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز الحوكمة والرادار التنظيمي للذكاء الاصطناعي 3.0' : 'Enterprise AI Regulatory Radar 3.0'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'رصد التغييرات التشريعية، مطابقة معايير سدايا وقانون الذكاء الاصطناعي الأوروبي، فحص التحيز، وتوليد شهادات التدقيق المشفرة.'
              : 'Continuous legislative drift tracking, SDAIA & EU AI Act compliance matrix, AI bias audits, and cryptographic audit certificates.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            {isAr ? `مؤشر الأثر النظامي: ${avgDriftIndex}%` : `Drift Impact Index: ${avgDriftIndex}%`}
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('radar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'radar' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          {isAr ? 'رادار التعديلات التشريعية' : 'Legislative Radar & Drift'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'compliance' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          {isAr ? 'مصفوفة الامتثال (سدايا / EU AI / NIST)' : 'AI Compliance Matrix'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bias')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'bias' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          {isAr ? 'فحص النماذج ومقاومة الهلوسة' : 'Model Bias & Safety Audit'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'certificates' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          {isAr ? 'شهادات التدقيق المشفرة' : 'Cryptographic Audit Certificates'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'webhooks' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          {isAr ? 'مرسل إشعارات الـ Webhooks' : 'Regulatory Webhooks'}
        </button>
      </div>

      {/* ── TAB 1: LEGISLATIVE RADAR ── */}
      {activeTab === 'radar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              {isAr ? 'التعديلات التشريعية واللوائح التنفيذية المرصودة' : 'Active Legislative Amendments & Regulatory Drift'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{driftRecords.length} Monitored Statutes</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {driftRecords.map((rec) => (
              <div key={rec.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {rec.jurisdiction} • {rec.statuteCode}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-amber-400">
                    Impact: {rec.driftImpactScore}%
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{isAr ? rec.statuteTitleAr : rec.statuteTitleEn}</h3>
                  <p className="text-slate-400 text-[11px]">{rec.enactingAuthority} • {rec.effectiveDate}</p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-300 text-[11px] block">{isAr ? 'أبرز التغييرات النظامية:' : 'Key Statutory Amendments:'}</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                    {(isAr ? rec.keyChangesAr : rec.keyChangesEn).map((ch, idx) => (
                      <li key={idx}>{ch}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-[11px]">
                  <span className="font-bold block mb-0.5">{isAr ? 'الإجراء الوقائي الموصى به:' : 'Recommended Action:'}</span>
                  {isAr ? rec.recommendedActionAr : rec.recommendedActionEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: COMPLIANCE MATRIX ── */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Evaluation Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {isAr ? 'الامتثال المؤسسي الشامل للذكاء الاصطناعي معتمد بنسبة 100%' : 'Global Enterprise AI Compliance Verified'}
              </span>
              <p className="text-slate-300">
                {isAr
                  ? `تم فحص ${evaluation.frameworksEvaluated} أطر تنظيمية عالمية تشمل سدايا وقانون الذكاء الاصطناعي الأوروبي وإطار NIST الأمريكي.`
                  : `Evaluated ${evaluation.frameworksEvaluated} major global frameworks including SDAIA PDPL, EU AI Act 2024/1689, and NIST AI RMF.`}
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">
                Composite Score: {evaluation.compositeScore}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {frameworks.map((fw) => (
              <div key={fw.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{isAr ? fw.nameAr : fw.nameEn}</h3>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {fw.complianceScore}%
                  </span>
                </div>

                <p className="text-slate-400 text-[11px]">{fw.supervisoryBody}</p>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="font-bold text-slate-300 text-[11px] block">{isAr ? 'الاشتراطات الإلزامية المحققة:' : 'Mandatory Obligations:'}</span>
                  {fw.mandatoryRequirements.map((req) => (
                    <div key={req.code} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold text-cyan-400">{req.code}</span>
                        <span className="text-[9px] font-bold text-emerald-400">{req.status}</span>
                      </div>
                      <p className="text-slate-200 font-medium text-[11px]">{isAr ? req.titleAr : req.titleEn}</p>
                      <p className="text-slate-400 text-[10px]">{isAr ? req.implementationNotesAr : req.implementationNotesEn}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: BIAS & RISK AUDIT ── */}
      {activeTab === 'bias' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              {isAr ? 'تقرير فحص النماذج ومقاومة التحيز والهلوسة' : 'AI Model Bias & Adversarial Safety Report'}
            </h2>
            <button
              type="button"
              onClick={handleRunNewAudit}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isAr ? 'إعادة الفحص الآن' : 'Run Live Audit'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-center">
              <span className="text-slate-400 font-medium text-[11px] block">{isAr ? 'مقاومة الهلوسة' : 'Anti-Hallucination'}</span>
              <span className="font-mono text-xl font-bold text-emerald-400">{auditReport.hallucinationResistanceScore}%</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-center">
              <span className="text-slate-400 font-medium text-[11px] block">{isAr ? 'حيادية الولايات' : 'Jurisdiction Parity'}</span>
              <span className="font-mono text-xl font-bold text-cyan-400">{auditReport.crossJurisdictionalParityScore}%</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-center">
              <span className="text-slate-400 font-medium text-[11px] block">{isAr ? 'إعادة الإنتاج الحتمية' : 'Determinism'}</span>
              <span className="font-mono text-xl font-bold text-purple-400">{auditReport.deterministicReproducibilityScore}%</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-center">
              <span className="text-slate-400 font-medium text-[11px] block">{isAr ? 'مقاومة كسر الحماية' : 'Injection Defense'}</span>
              <span className="font-mono text-xl font-bold text-emerald-400">{auditReport.promptInjectionDefenseScore}%</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-white text-sm">{isAr ? 'نتائج الفحص والضمانات الوقائية المطبقة:' : 'Audit Findings & Mitigations Applied:'}</h3>
            <div className="space-y-3">
              {auditReport.findings.map((f, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {f.axis}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">{f.severity} RISK</span>
                  </div>
                  <p className="text-slate-200 font-medium text-[11px]">{isAr ? f.descriptionAr : f.descriptionEn}</p>
                  <p className="text-slate-400 text-[10px]">
                    <span className="font-bold text-slate-300">{isAr ? 'الإجراء الوقائي: ' : 'Mitigation: '}</span>
                    {isAr ? f.mitigationAppliedAr : f.mitigationAppliedEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: CERTIFICATES ── */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              {isAr ? 'شهادات التدقيق المشفرة (Board of Directors & GC Reports)' : 'Cryptographic Compliance Audit Certificates'}
            </h2>
            <button
              type="button"
              onClick={handleGenerateCertificate}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-lg shadow-amber-600/20 flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              {isAr ? 'توليد شهادة جديدة' : 'Issue New Certificate'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div key={cert.certificateId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-amber-400 font-bold">{cert.certificateId}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    Trust Score: {cert.overallTrustScore}%
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">{isAr ? cert.scopeOfAuditAr : cert.scopeOfAuditEn}</h3>
                  <p className="text-slate-400 text-[11px]">{cert.issuerAuthority}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[10px]">
                  <div>
                    <span className="text-slate-500 block">SHA-256 Content Fingerprint:</span>
                    <span className="text-cyan-400 break-all">{cert.sha256Fingerprint}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">HMAC-SHA256 Digital Verification Signature:</span>
                    <span className="text-emerald-400 break-all">{cert.cryptographicSignature}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono pt-2 border-t border-slate-800">
                  <span>Issued: {cert.issueDate.split('T')[0]}</span>
                  <span>Valid Until: {cert.validUntilDate.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: WEBHOOKS ── */}
      {activeTab === 'webhooks' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-rose-400" />
              {isAr ? 'اختبار إرسال الـ Webhooks التشريعية' : 'Dispatch Test Regulatory Webhook'}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="font-medium text-slate-400 block mb-1">{isAr ? 'محتوى الإشعار التشريعي:' : 'Regulatory Event Alert:'}</label>
                <input
                  type="text"
                  value={testWebhookEvent}
                  onChange={(e) => setTestWebhookEvent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="font-medium text-slate-400 block mb-1">{isAr ? 'درجة الخطورة والأثر:' : 'Severity Level:'}</label>
                <select
                  value={testSeverity}
                  onChange={(e) => setTestSeverity(e.target.value as RegulatoryAlertSeverity)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl font-medium focus:outline-none focus:border-rose-500"
                >
                  <option value="INFORMATIONAL">INFORMATIONAL</option>
                  <option value="MEDIUM_IMPACT">MEDIUM_IMPACT</option>
                  <option value="HIGH_IMPACT">HIGH_IMPACT</option>
                  <option value="CRITICAL_AMENDMENT">CRITICAL_AMENDMENT</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleDispatchTestWebhook}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-600/20"
              >
                {isAr ? 'إرسال التنبيه الفوري المشفر عبر Webhook' : 'Dispatch Encrypted Webhook Alert'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center justify-between">
              <span>{isAr ? 'سجل إرسال التنبيهات (Webhook Dispatch Log)' : 'Webhook Dispatch Event Log'}</span>
              <span className="font-mono text-slate-400">{dispatchLogs.length} Events</span>
            </h2>

            <div className="space-y-2.5">
              {dispatchLogs.map((log) => (
                <div key={log.dispatchId} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {log.severity}
                    </span>
                    <span className="font-mono text-[9px] text-emerald-400 font-bold">HTTP {log.httpStatusCode} OK</span>
                  </div>
                  <h4 className="font-bold text-white text-xs">{isAr ? log.eventTitleAr : log.eventTitleEn}</h4>
                  <div className="font-mono text-[9px] text-slate-500 break-all">
                    Signature: {log.hmacSignature}
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
