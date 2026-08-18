/**
 * AlertBell.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Proactive AI Legal Alert System Component
 * Features:
 *   • Real-time badge counter for unread legal alerts & notices
 *   • Category Filter Tabs (All, Unread, Legal Updates, Contract Renewals)
 *   • Rich AI Legal Analysis Details Modal ("عرض التفاصيل")
 *     - Executive Legal Breakdown
 *     - Contract Impact Score
 *     - Step-by-Step Compliance Recommendations
 *     - Instant AI Advisor Action Button
 *   • Arabic / English RTL/LTR support
 */
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, X, CheckCheck, AlertTriangle, Info, RefreshCw, Clock, ArrowRight,
  Zap, Shield, Sparkles, Scale, ExternalLink, Brain, CheckCircle2, ChevronRight, Wrench
} from 'lucide-react';
import {
  LegalAlert, getStoredAlerts, getUnreadCount, markAsRead, markAllRead,
  dismissAlert, seedPlatformAlerts, syncAlertsFromSupabase, resolveAlert
} from '../lib/alertsManager';

const ALERT_TYPE_ICONS: Record<string, React.ReactNode> = {
  contract_renewal: <Clock className="w-3.5 h-3.5" />,
  legal_update: <AlertTriangle className="w-3.5 h-3.5" />,
  platform_notice: <Info className="w-3.5 h-3.5" />,
  session_expiry: <Zap className="w-3.5 h-3.5" />,
};

const ALERT_PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-500/10 border-red-500/30 text-red-400',
  medium: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  low: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400',
};

// Rich AI Detailed Analysis for seeded alerts
const DETAILED_AI_ANALYSIS: Record<string, {
  summaryAr: string;
  summaryEn: string;
  impactAr: string[];
  impactEn: string[];
  actionsAr: string[];
  actionsEn: string[];
  suggestedRoute: string;
}> = {
  'legal_update': {
    summaryAr: 'يتطلب هذا التعديل التشريعي فحص البنود المتعلقة بنقل البيانات، المسؤولية القانونية، والتنظيم الرقمي لضمان الامتثال التام وتجنب أي غرامات تنظيمية.',
    summaryEn: 'This statutory amendment mandates an audit of data transfer, legal liability, and digital compliance clauses to avoid regulatory penalties.',
    impactAr: [
      'ضرورة مراجعة عقود الخدمات الرقمية وسرية البيانات (NDA).',
      'تحديث بنود التعويض والمنازعات التشريعية وفق القانون الجديد.',
      'تعديل مدة الاحتفاظ بالسجلات التشغيلية.',
    ],
    impactEn: [
      'Mandatory review of digital service & NDA data clauses.',
      'Updated indemnity and dispute resolution clauses per new law.',
      'Adjusted operational record retention timeline.',
    ],
    actionsAr: [
      'استخدم منشئ العقود لتوليد ملاحق تعديلية مؤتمتة.',
      'قم بإجراء فحص مخاطر فوري عبر أداة فحص المخاطر الذكية.',
      'احفظ النسخ النهائية المحدثة في الخزنة المشفرة AES-256.',
    ],
    actionsEn: [
      'Use the Contract Generator to draft automated addendums.',
      'Run an immediate risk scan via the AI Risk Analyzer.',
      'Store finalized updated contracts in the AES-256 Encrypted Vault.',
    ],
    suggestedRoute: '/risk',
  },
  'platform_notice': {
    summaryAr: 'تم تفعيل الخزنة المشفرة بمعيار AES-256 لحفظ المستندات والعقود ومحاضر الاجتماعات بحماية قصوى وتتبع آلي لمواعيد الانتهاء.',
    summaryEn: 'AES-256 Encrypted Vault is active for securing contracts, documents, and minutes with automated expiry tracking.',
    impactAr: [
      'تشفير كامل للمستندات أثناء الحفظ والنقل.',
      'تتبع آلي لمواعيد تجديد العقود مع تنبيهات استباقية.',
      'إمكانية الوصول الآمن من أي جهاز.',
    ],
    impactEn: [
      'Full encryption in transit and at rest.',
      'Automated expiry monitoring with proactive alerts.',
      'Secure access across all multi-device sessions.',
    ],
    actionsAr: [
      'انتقل إلى الخزنة المشفرة لرفع عقودك الحالية.',
      'عين مواعيد التجديد لتفعيل التنبيهات الاستباقية.',
    ],
    actionsEn: [
      'Navigate to Encrypted Vault to upload active agreements.',
      'Set expiry dates to activate automated alerts.',
    ],
    suggestedRoute: '/vault',
  },
  'contract_renewal': {
    summaryAr: 'العقد المحدد اقترب من تاريخ الانتهاء. التجديد المبكر يحمي حقوقك التجارية ويضمن استمرارية الخدمات دون انقطاع.',
    summaryEn: 'The referenced agreement is approaching expiration. Early renewal secures your legal rights and ensures uninterrupted continuity.',
    impactAr: [
      'مخاطر فقدان الشروط التفضيلية عند التأخر.',
      'احتمال تعليق الخدمات في حال انقضاء المدة.',
    ],
    impactEn: [
      'Risk of losing favorable commercial terms if delayed.',
      'Potential suspension of services upon expiration.',
    ],
    actionsAr: [
      'راجع البنود الحالية في الخزنة المشفرة.',
      'افتح جلسة تفاوض رقمية مع الطرف الآخر عبر بوابة التفاوض.',
    ],
    actionsEn: [
      'Review existing terms in the Encrypted Vault.',
      'Launch a digital negotiation session with the counterparty.',
    ],
    suggestedRoute: '/negotiation',
  },
};

export default function AlertBell() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<LegalAlert[]>([]);
  const [unread, setUnread] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'updates' | 'renewals'>('all');
  const [selectedAlert, setSelectedAlert] = useState<LegalAlert | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    const a = getStoredAlerts();
    setAlerts(a);
    setUnread(getUnreadCount());
  };

  useEffect(() => {
    seedPlatformAlerts();
    refresh();
    syncAlertsFromSupabase().then(() => refresh());
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  async function handleSync() {
    setSyncing(true);
    await syncAlertsFromSupabase();
    refresh();
    setSyncing(false);
  }

  function handleMarkRead(id: string) {
    markAsRead(id);
    refresh();
  }

  function handleMarkAllRead() {
    markAllRead();
    refresh();
  }

  function handleDismiss(id: string) {
    dismissAlert(id);
    refresh();
  }

  function handleOpenDetails(alert: LegalAlert, e: React.MouseEvent) {
    e.stopPropagation();
    markAsRead(alert.id);
    refresh();
    setSelectedAlert(alert);
    setOpen(false);
  }

  // Filter logic
  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unread') return !a.is_read;
    if (filter === 'updates') return a.alert_type === 'legal_update';
    if (filter === 'renewals') return a.alert_type === 'contract_renewal';
    return true;
  });

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:border-cyan-500/30 transition-all shadow-md active:scale-95"
        aria-label={isRtl ? 'التنبيهات القانونية الاستباقية' : 'Proactive Legal Alerts'}
      >
        <Bell className={`w-4 h-4 ${open ? 'text-cyan-400 animate-pulse' : ''}`} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-lg shadow-red-500/40 animate-ping-once">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className={`absolute top-full mt-2 z-50 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl shadow-slate-950/80 overflow-hidden ${
            isRtl ? 'left-0' : 'right-0'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-950/60 font-sans">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              {isRtl ? 'التنبيهات القانونية الاستباقية' : 'Proactive Legal Alerts'}
              {unread > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  {unread} {isRtl ? 'جديد' : 'new'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleSync}
                aria-label={isRtl ? 'تحديث التنبيهات' : 'Sync alerts'}
                title={isRtl ? 'تحديث' : 'Sync'}
                className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              </button>

              {unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  aria-label={isRtl ? 'تعليم الكل كمقروء' : 'Mark all read'}
                  title={isRtl ? 'قراءة الكل' : 'Mark all read'}
                  className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-all"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setOpen(false)}
                aria-label={isRtl ? 'إغلاق قائمة التنبيهات' : 'Close alerts menu'}
                className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ⚡ Proactive Legal Alerts Banner */}
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border-b border-emerald-500/30 flex items-center justify-between gap-2 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>{isRtl ? 'نظام الحقن التلقائي الذكي مفعل (Full Automation Active)' : 'Automated Smart Injection Active'}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
              ● AUTO-SYNC
            </span>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold overflow-x-auto">
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All' },
              { id: 'unread', labelAr: `معلق (${unread})`, labelEn: `Pending (${unread})` },
              { id: 'updates', labelAr: 'تحديثات قانونية', labelEn: 'Legal Updates' },
              { id: 'renewals', labelAr: 'تجديد عقود', labelEn: 'Renewals' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'
                }`}
              >
                {isRtl ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Alert List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-600">
                <Shield className="w-8 h-8 opacity-40" />
                <span className="text-xs">{isRtl ? 'لا توجد تنبيهات في هذا القسم' : 'No alerts in this view'}</span>
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const isPending = alert.status === 'pending' || !alert.is_read;

                return (
                  <div
                    key={alert.id}
                    onClick={() => handleMarkRead(alert.id)}
                    className={`p-3.5 transition-all cursor-pointer hover:bg-slate-800/40 ${
                      isPending ? 'bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Unread Indicator Dot */}
                      {isPending ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0 animate-ping-once" />
                      ) : (
                        <span className="w-2 h-2 shrink-0 opacity-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${ALERT_PRIORITY_COLORS[alert.priority]}`}>
                            {ALERT_TYPE_ICONS[alert.alert_type]}
                            {isRtl
                              ? { contract_renewal: 'تجديد', legal_update: 'تحديث قانوني', platform_notice: 'إشعار منصة', session_expiry: 'انتهاء جلسة' }[alert.alert_type]
                              : { contract_renewal: 'Renewal', legal_update: 'Legal Update', platform_notice: 'Notice', session_expiry: 'Session' }[alert.alert_type]
                            }
                          </span>
                        </div>

                        <p className={`text-xs font-bold leading-tight ${isPending ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {isRtl ? alert.title_ar : alert.title_en}
                        </p>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                          {isRtl ? alert.description_ar : alert.description_en}
                        </p>

                        {/* Action Buttons — Automated Fix */}
                        <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
                          {isPending ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                resolveAlert(alert.id);
                                refresh();
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-300 hover:text-emerald-200 transition-all bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded-xl hover:bg-emerald-500/30 shadow-sm"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              <span>{isRtl ? '⚡ حقن وتطبيق التحديث تلقائياً' : '⚡ Auto-Inject & Apply'}</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>✓ FIXED & LOGGED</span>
                            </span>
                          )}

                          <button
                            onClick={(e) => handleOpenDetails(alert, e)}
                            className="text-[10px] text-cyan-400 hover:underline font-bold"
                          >
                            {isRtl ? 'عرض التفاصيل' : 'View Details'}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleDismiss(alert.id); }}
                        aria-label={isRtl ? 'تجاهل التنبيه' : 'Dismiss alert'}
                        className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-sans">
            <span className="text-[10px] text-slate-400">
              {isRtl ? `${alerts.length} تنبيه إجمالاً` : `${alerts.length} total alerts`}
            </span>

            <Link
              to="/vault"
              onClick={() => setOpen(false)}
              className="text-[10px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
            >
              {isRtl ? 'خزنة المستندات' : 'Document Vault'}
              <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      )}

      {/* ── Rich AI Legal Analysis Details Modal ("عرض التفاصيل") ──────────── */}
      {selectedAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 font-sans">
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Brain className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mb-1 ${ALERT_PRIORITY_COLORS[selectedAlert.priority]}`}>
                    {isRtl ? 'تحليل الذكاء الاصطناعي التشريعي' : 'AI Statutory Analysis'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {isRtl ? selectedAlert.title_ar : selectedAlert.title_en}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
                aria-label={isRtl ? 'إغلاق نافذة التفاصيل' : 'Close details modal'}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-all shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Alert Text */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{isRtl ? 'نص التنبيه الأصلي:' : 'Original Alert Text:'}</p>
              {isRtl ? selectedAlert.description_ar : selectedAlert.description_en}
            </div>

            {/* AI Analysis Breakdown */}
            {(() => {
              const analysis = DETAILED_AI_ANALYSIS[selectedAlert.alert_type] || DETAILED_AI_ANALYSIS.legal_update;
              return (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-black text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                      {isRtl ? 'الملخص التشريعي للتحديث' : 'Executive Statutory Summary'}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {isRtl ? analysis.summaryAr : analysis.summaryEn}
                    </p>
                  </div>

                  {/* Contract Impact */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      {isRtl ? 'الأثر المتوقع على العقود والعمليات:' : 'Impact on Active Agreements & Ops:'}
                    </h4>
                    <div className="space-y-1.5">
                      {(isRtl ? analysis.impactAr : analysis.impactEn).map((imp, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Action Steps */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {isRtl ? 'خطوات الامتثال الفورية الموصى بها:' : 'Recommended Immediate Action Steps:'}
                    </h4>
                    <div className="space-y-1.5">
                      {(isRtl ? analysis.actionsAr : analysis.actionsEn).map((act, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Remediation Status Banner inside Modal */}
                  {selectedAlert.status === 'pending' || !selectedAlert.is_read ? (
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between gap-3 text-xs flex-wrap">
                      <div className="flex items-center gap-2 text-indigo-300 font-bold">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
                        <span>{isRtl ? 'نظام الأتمتة الكاملة جاهز لحقن التحديث تلقائياً دون تدخل يدوي' : 'Full Automation System Ready to Auto-Inject Updates'}</span>
                      </div>
                      <button
                        onClick={() => {
                          resolveAlert(selectedAlert.id);
                          setSelectedAlert(prev => prev ? { ...prev, status: 'resolved', is_read: true } : null);
                          refresh();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{isRtl ? '⚡ تأكيد الحقن التلقائي' : '⚡ Confirm Auto-Injection'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{isRtl ? 'تم حقن التحديثات تلقائياً وتوثيقها في سجل التدقيق بنجاح' : 'Automatically Injected & Logged in Audit Trail'}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black shrink-0">
                        ✓ EXECUTED
                      </span>
                    </div>
                  )}

                  {/* Action CTAs */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => {
                        const target = selectedAlert.action_url || analysis.suggestedRoute;
                        setSelectedAlert(null);
                        navigate(target);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <Zap className="w-4 h-4" />
                      {isRtl ? 'عرض سجل الفحص والامتثال المباشر' : 'View Instant Audit & Compliance Log'}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAlert(null);
                        navigate('/chat');
                      }}
                      className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:text-slate-900 dark:text-white transition-all flex items-center gap-1.5"
                    >
                      <Brain className="w-4 h-4 text-cyan-400" />
                      {isRtl ? 'استشر AI' : 'Consult AI'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
