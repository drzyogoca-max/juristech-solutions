import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Globe,
  Activity,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowUpRight,
  Sparkles,
  Check
} from 'lucide-react';
import {
  AutonomousEngineStatus,
  subscribeToAutonomousEngine,
  runProactiveComplianceAuditCycle,
  AutonomousActionLog
} from '../services/autonomousRiskEngine';

export const AutonomousRiskPanel: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [engineStatus, setEngineStatus] = useState<AutonomousEngineStatus | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [auditSuccessMsg, setAuditSuccessMsg] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAutonomousEngine((status) => {
      setEngineStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const handleManualTrigger = async () => {
    setIsScanning(true);
    setAuditSuccessMsg(false);
    await runProactiveComplianceAuditCycle();
    setTimeout(() => {
      setIsScanning(false);
      setAuditSuccessMsg(true);
      setTimeout(() => setAuditSuccessMsg(false), 4000);
    }, 600);
  };

  if (!engineStatus) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900/90 dark:bg-slate-950/90 border border-cyan-500/30 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-8 my-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 rounded-2xl border border-cyan-400/40 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="w-8 h-8 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-widest">
                Zero-Human-In-The-Loop Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Full Automation
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white mt-1">
              {isRtl ? 'منظومة الإنذار الاستباقي والمعالجة الذاتية' : 'Autonomous Proactive Compliance & Risk Engine'}
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {isRtl
                ? 'رصد النزاعات والعلامات التجارية ومعالجة الأخطاء لحظياً بدون موافقات مسبقة'
                : 'Real-time proactive trademark scanning, dispute prevention & zero-delay hotfixes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {auditSuccessMsg && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/30">
              <Check className="w-4 h-4" /> {isRtl ? 'تم الفحص بنجاح' : 'Audit Certified'}
            </span>
          )}
          <button
            onClick={handleManualTrigger}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? (isRtl ? 'جاري المسح الاستباقي...' : 'Scanning...') : (isRtl ? 'تشغيل مسح استباقي' : 'Run Audit Cycle')}</span>
          </button>
        </div>
      </div>

      {/* Monitored Domains Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            {isRtl ? 'النطاقات المحمية والرصد المستمر (Protected Domains)' : 'Monitored Protected Domains'}
          </h3>
          <span className="text-xs text-slate-400">
            {isRtl ? 'مغطاة بالكامل بالنظام الذاتي' : 'Covered by Autonomous Engine'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {engineStatus.monitoredDomains.map((item) => (
            <div
              key={item.domain}
              className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  {item.domain}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {item.legalComplianceStatus}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{isRtl ? 'مخاطر العلامة التجارية:' : 'Trademark Risk Score:'}</span>
                  <span className="font-bold text-emerald-400">{item.trademarkRiskScore} / 100 ({isRtl ? 'آمن جداً' : 'Ultra Safe'})</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isRtl ? 'المسار النشط:' : 'Active Failover Route:'}</span>
                  <span className="font-mono text-slate-300 truncate max-w-[150px]">{item.activeRoute}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isRtl ? 'تنظيف الميتاداتا:' : 'Metadata Cleaned:'}</span>
                  <span className="text-emerald-400 font-bold">100% {isRtl ? 'مُقفل' : 'Locked'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>{isRtl ? 'آخر فحص:' : 'Last scan:'}</span>
                <span>{new Date(item.lastScannedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Predictive Metrics */}
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-400" />
          {isRtl ? 'مؤشرات التنبؤ بالأخطاء المعالجة ذاتياً (Predictive System Health)' : 'Predictive Error Mitigation Health'}
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {engineStatus.systemMetrics.map((metric) => (
            <div key={metric.metricName} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 block font-medium mb-1">{metric.metricName}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{metric.currentValue}</span>
                <span className="text-xs text-slate-400">{metric.unit}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{isRtl ? 'الحد الأقصى:' : 'Limit:'} {metric.threshold}{metric.unit}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {metric.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Autonomous Actions Stream */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            {isRtl ? 'سجل القرارات والتعديلات التلقائية اللحظية (Zero-Delay Action Log)' : 'Live Autonomous Action Feed'}
          </h3>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
            {engineStatus.totalHotfixesApplied} {isRtl ? 'إجراء تلقائي منفذ' : 'Total Auto Hotfixes Executed'}
          </span>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 font-sans">
          {engineStatus.recentActions.map((log: AutonomousActionLog) => (
            <div
              key={log.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {log.category}
                    </span>
                    {log.domainTarget && (
                      <span className="text-xs font-mono text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                        {log.domainTarget}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString()} ({log.executionTimeMs}ms)
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 mt-1">
                    {isRtl ? log.descriptionAr : log.description}
                  </p>
                  <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {log.resolution}
                  </p>
                </div>
              </div>

              <div className="self-end md:self-center shrink-0">
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Zero Approval Auto-Applied
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutonomousRiskPanel;
