import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Bell, Scale, Clock, ShieldAlert, Lock, Calendar, CheckCircle2,
  Sparkles, ArrowRight, Zap, Wrench, Loader2, AlertTriangle, RefreshCw, Check
} from 'lucide-react';
import {
  LegalAlert,
  getStoredAlerts,
  seedPlatformAlerts,
  resolveAlert,
  syncAlertsFromSupabase
} from '../lib/alertsManager';
import { useAuth } from '../lib/authContext';

interface LegalAlertsFeedProps {
  adminOnly?: boolean;
}

export const LegalAlertsFeed: React.FC<LegalAlertsFeedProps> = ({ adminOnly = false }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { isAdmin } = useAuth();

  const [filter, setFilter] = useState<'ALL' | 'contract_renewal' | 'legal_update' | 'platform_notice' | 'PENDING'>('ALL');
  const [alerts, setAlerts] = useState<LegalAlert[]>([]);
  const [fixingId, setFixingId] = useState<string | null>(null);
  const [isFixingAll, setIsFixingAll] = useState(false);

  const refreshAlerts = () => {
    seedPlatformAlerts();
    setAlerts(getStoredAlerts());
  };

  useEffect(() => {
    refreshAlerts();
    syncAlertsFromSupabase().then(() => setAlerts(getStoredAlerts()));
  }, []);

  // Hide internal compliance alert feed from non-admin visitors if adminOnly requested
  if (adminOnly && !isAdmin) {
    return null;
  }

  const handleFixOneByOne = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFixingId(id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    resolveAlert(id);
    setAlerts(getStoredAlerts());
    setFixingId(null);
  };

  const handleFixAllOneByOne = async () => {
    setIsFixingAll(true);
    const pendingList = alerts.filter((a) => a.status === 'pending');
    for (const item of pendingList) {
      setFixingId(item.id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      resolveAlert(item.id);
      setAlerts(getStoredAlerts());
    }
    setFixingId(null);
    setIsFixingAll(false);
  };

  const pendingCount = alerts.filter((a) => a.status === 'pending').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;
  const totalCount = alerts.length;
  const completionPercentage = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 100;

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'PENDING') return alert.status === 'pending';
    if (filter === 'ALL') return true;
    return alert.alert_type === filter;
  });

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full space-y-4 my-6 font-sans">
      {/* Top Remediation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className={`p-3.5 rounded-2xl border ${pendingCount > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
            {pendingCount > 0 ? <AlertTriangle className="w-7 h-7 animate-pulse" /> : <CheckCircle2 className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-xl font-black text-white">
                {isRtl ? 'تنبيهات الامتثال والإصلاح الفردي (One-by-One Fix)' : 'Legal Compliance Alerts & One-by-One Fix'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded-full font-mono font-bold border border-amber-500/40">
                {pendingCount} {isRtl ? 'معلق للإصلاح' : 'Pending Fix'}
              </span>
              {resolvedCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full font-mono font-bold border border-emerald-500/30">
                  {resolvedCount} {isRtl ? 'تم إصلاحه وتوثيقه' : 'Fixed & Logged'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isRtl ? 'قم بمراجعة وإصلاح كل تنبيه قانوني على حِدة بشكل يدوي وتوثيقه في سجل التدقيق المباشر' : 'Review and remediate each legal alert individually with full audit logging'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {pendingCount > 0 && (
            <button
              onClick={handleFixAllOneByOne}
              disabled={isFixingAll}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {isFixingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isRtl ? 'جاري الإصلاح والتوثيق...' : 'Fixing One-by-One...'}</span>
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  <span>{isRtl ? '⚡ إصلاح الكل عنصر تلو الآخر' : '⚡ Fix All One-by-One'}</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === 'ALL' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === 'PENDING' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? `⚠️ المعلقة (${pendingCount})` : `⚠️ Pending (${pendingCount})`}
            </button>
            <button
              onClick={() => setFilter('contract_renewal')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === 'contract_renewal' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? '🔄 التجديدات' : '🔄 Renewals'}
            </button>
            <button
              onClick={() => setFilter('legal_update')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === 'legal_update' ? 'bg-indigo-500 text-white font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? '⚖️ التشريعات' : '⚖️ Regulations'}
            </button>
          </div>
        </div>
      </div>

      {/* Audit Trail Progress Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <span>{isRtl ? 'نسبة الامتثال والإصلاح الفردي:' : 'Compliance Remediation Progress:'}</span>
          <strong className="text-emerald-400 font-bold">{completionPercentage}% ({resolvedCount}/{totalCount} {isRtl ? 'مكتمَل' : 'Fixed'})</strong>
        </div>
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
            {isRtl ? 'لا توجد تنبيهات مطابقة للتصفية الحالية' : 'No alerts match current filter'}
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isPending = alert.status === 'pending';
            const isCurrentFixing = fixingId === alert.id;

            let categoryBadgeClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
            let icon = Scale;

            if (alert.alert_type === 'contract_renewal') {
              categoryBadgeClass = alert.priority === 'high'
                ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30';
              icon = Clock;
            } else if (alert.alert_type === 'platform_notice') {
              categoryBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              icon = Lock;
            }

            const IconComp = icon;

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:shadow-xl ${
                  isPending
                    ? 'bg-slate-900 border-amber-500/40 shadow-md'
                    : 'bg-slate-900/60 border-emerald-500/30 opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border flex items-center gap-1.5 ${categoryBadgeClass}`}>
                      <IconComp className="w-3.5 h-3.5" />
                      <span>
                        {isRtl
                          ? { contract_renewal: 'تجديد عقد', legal_update: 'تحديث قانوني', platform_notice: 'إشعار منصة', session_expiry: 'انتهاء جلسة' }[alert.alert_type]
                          : { contract_renewal: 'Renewal', legal_update: 'Legal Update', platform_notice: 'Notice', session_expiry: 'Session' }[alert.alert_type]}
                      </span>
                    </span>

                    {/* Status Badge */}
                    {isPending ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-amber-400" />
                        <span>{isRtl ? 'معلق للإصلاح' : 'Needs Fix'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{isRtl ? 'تم الإصلاح وتوثيقه' : 'Fixed & Logged'}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-white leading-snug mb-2">
                    {isRtl ? alert.title_ar : alert.title_en}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {isRtl ? alert.description_ar : alert.description_en}
                  </p>

                  {alert.remediation_notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
                      <strong className="block text-emerald-400 font-bold mb-0.5">{isRtl ? 'ملاحظة التوثيق وسجل التدقيق:' : 'Audit Trail Record:'}</strong>
                      {alert.remediation_notes}
                    </div>
                  )}
                </div>

                {/* Bottom Action Area */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  {isPending ? (
                    <button
                      onClick={(e) => handleFixOneByOne(alert.id, e)}
                      disabled={isCurrentFixing}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isCurrentFixing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{isRtl ? 'جاري الإصلاح...' : 'Fixing Item...'}</span>
                        </>
                      ) : (
                        <>
                          <Wrench className="w-3.5 h-3.5" />
                          <span>
                            {alert.alert_type === 'contract_renewal'
                              ? (isRtl ? 'تجديد العقد (Fix & Renew)' : 'Renew & Protect')
                              : alert.alert_type === 'legal_update'
                              ? (isRtl ? 'إصلاح البنود فورياً' : 'Fix Clause Now')
                              : (isRtl ? 'إصلاح وتأكيد' : 'Fix & Resolve')}
                          </span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'مُصلَح وموثّق في السجل' : 'Fixed & Logged in Audit'}</span>
                    </span>
                  )}

                  {alert.action_url && (
                    <Link
                      to={alert.action_url}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline"
                    >
                      <span>{isRtl ? 'التفاصيل' : 'Review Details'}</span>
                      <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LegalAlertsFeed;
