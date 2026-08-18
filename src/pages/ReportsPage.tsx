import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3, FileText, AlertTriangle, TrendingUp,
  Loader2, ShieldCheck, ShieldAlert, Calendar, ChevronRight, Download
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import SEO from '../components/SEO';
import { generateAndDownloadWordDocument } from '../utils/export-utils';


interface RiskReport {
  id: string;
  file_name: string | null;
  risk_score: number;
  missing_clauses: string[];
  recommendations: string[];
  created_at: string;
}

interface Contract {
  id: string;
  contract_type: string;
  party_a: string;
  party_b: string;
  created_at: string;
}

interface Stats {
  totalContracts: number;
  totalRiskReports: number;
  avgRiskScore: number;
  highRiskCount: number;
}

function RiskBadge({ score }: { score: number }) {
  if (score < 30) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <ShieldCheck className="w-3 h-3" /> {score}%
    </span>
  );
  if (score < 60) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <AlertTriangle className="w-3 h-3" /> {score}%
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
      <ShieldAlert className="w-3 h-3" /> {score}%
    </span>
  );
}

export default function ReportsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalContracts: 0,
    totalRiskReports: 0,
    avgRiskScore: 0,
    highRiskCount: 0,
  });
  const [riskReports, setRiskReports] = useState<RiskReport[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [activeTab, setActiveTab] = useState<'risk' | 'contracts'>('risk');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [
          { count: contractsCount },
          { count: riskCount },
          { data: riskData },
          { data: contractData },
        ] = await Promise.all([
          supabase.from('contracts').select('*', { count: 'exact', head: true }),
          supabase.from('risk_assessments').select('*', { count: 'exact', head: true }),
          supabase.from('risk_assessments')
            .select('id, file_name, risk_score, missing_clauses, recommendations, created_at')
            .order('created_at', { ascending: false })
            .limit(10),
          supabase.from('contracts')
            .select('id, contract_type, party_a, party_b, created_at')
            .order('created_at', { ascending: false })
            .limit(10),
        ]);

        const reports = riskData || [];
        const avg = reports.length > 0
          ? Math.round(reports.reduce((s, r) => s + r.risk_score, 0) / reports.length)
          : 0;
        const highRisk = reports.filter(r => r.risk_score >= 60).length;

        setStats({
          totalContracts: contractsCount || 0,
          totalRiskReports: riskCount || 0,
          avgRiskScore: avg,
          highRiskCount: highRisk,
        });
        setRiskReports(reports);
        setContracts(contractData || []);
      } catch (err) {
        console.error('Error fetching reports data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    {
      label: t('Reports.totalContracts'),
      value: stats.totalContracts,
      icon: FileText,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      border: 'border-cyan-500/20',
    },
    {
      label: t('Reports.totalRiskReports'),
      value: stats.totalRiskReports,
      icon: BarChart3,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
      border: 'border-violet-500/20',
    },
    {
      label: t('Reports.avgRiskScore'),
      value: `${stats.avgRiskScore}%`,
      icon: TrendingUp,
      color: stats.avgRiskScore < 30 ? 'text-emerald-400' : stats.avgRiskScore < 60 ? 'text-amber-400' : 'text-red-400',
      bg: stats.avgRiskScore < 30 ? 'bg-emerald-400/10' : stats.avgRiskScore < 60 ? 'bg-amber-400/10' : 'bg-red-400/10',
      border: stats.avgRiskScore < 30 ? 'border-emerald-500/20' : stats.avgRiskScore < 60 ? 'border-amber-500/20' : 'border-red-500/20',
    },
    {
      label: t('Reports.highRisk'),
      value: stats.highRiskCount,
      icon: ShieldAlert,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-500/20',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('Reports.title')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm sm:text-base">
          {isRtl ? 'نظرة شاملة على نشاطك القانوني وتحليلات المخاطر' : 'A comprehensive view of your legal activity and risk analytics'}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border ${border} hover:border-opacity-60 transition-all duration-200 shadow-md`}>
              <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs font-medium mb-1 leading-tight">{label}</p>
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-slate-500 dark:text-slate-400 dark:text-slate-400 mt-1" />
              ) : (
                <p className={`text-2xl sm:text-3xl font-extrabold ${color}`}>{value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Risk Score Visual Bar */}
        {!loading && stats.totalRiskReports > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 mb-6 shadow-md">
            <h2 className="text-base font-bold mb-4 text-slate-800 dark:text-slate-200">
              {isRtl ? 'توزيع درجات المخاطر' : 'Risk Score Distribution'}
            </h2>
            <div className="space-y-3">
              {[
                { label: isRtl ? 'منخفض (0–29%)' : 'Low (0–29%)', count: riskReports.filter(r => r.risk_score < 30).length, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
                { label: isRtl ? 'متوسط (30–59%)' : 'Medium (30–59%)', count: riskReports.filter(r => r.risk_score >= 30 && r.risk_score < 60).length, color: 'bg-amber-400', textColor: 'text-amber-400' },
                { label: isRtl ? 'مرتفع (60–100%)' : 'High (60–100%)', count: riskReports.filter(r => r.risk_score >= 60).length, color: 'bg-red-400', textColor: 'text-red-400' },
              ].map(({ label, count, color, textColor }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 dark:text-slate-400 w-32 shrink-0">{label}</span>
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-700`}
                      style={{ width: riskReports.length > 0 ? `${(count / riskReports.length) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${textColor} w-6 text-right`}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('risk')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                activeTab === 'risk'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              {t('Reports.riskTab')}
              {stats.totalRiskReports > 0 && (
                <span className="text-xs bg-amber-400/15 text-amber-400 px-1.5 py-0.5 rounded-full">
                  {stats.totalRiskReports}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                activeTab === 'contracts'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              {t('Reports.contractsTab')}
              {stats.totalContracts > 0 && (
                <span className="text-xs bg-cyan-400/15 text-cyan-400 px-1.5 py-0.5 rounded-full">
                  {stats.totalContracts}
                </span>
              )}
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-slate-500 dark:text-slate-400 dark:text-slate-400" />
              </div>
            ) : activeTab === 'risk' ? (
              riskReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertTriangle className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {isRtl ? 'لا توجد تقارير مخاطر بعد.' : 'No risk reports yet.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                        <th className={`pb-3 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'المستند' : 'Document'}</th>
                        <th className="pb-3 font-semibold text-center">{t('Risk.riskScore')}</th>
                        <th className={`pb-3 font-semibold hidden sm:table-cell ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'البنود المفقودة' : 'Missing Clauses'}</th>
                        <th className={`pb-3 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>
                          <Calendar className="w-3.5 h-3.5 inline" />
                        </th>
                        <th className="pb-3 font-semibold text-center">{isRtl ? 'تصدير Word' : 'Export Word'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {riskReports.map((report) => {
                        const handleExportReportWord = () => {
                          const docTitle = report.file_name || (isRtl ? 'تقرير فحص المخاطر' : 'Risk Audit Report');
                          const reportText = `${isRtl ? 'تقرير فحص المخاطر والامتداد التشريعي' : 'Contract Risk Audit Report'}\n\n` +
                            `${isRtl ? 'درجة المخاطرة العامة' : 'Overall Risk Score'}: ${report.risk_score}%\n\n` +
                            `${isRtl ? 'البنود غير المتوازنة والمفقودة:' : 'Missing / High Risk Clauses:'}\n` +
                            (report.missing_clauses || []).map(c => `• ${c}`).join('\n') + `\n\n` +
                            `${isRtl ? 'التوصيات والصياغات الحمائية المقترحة:' : 'Recommendations & Protective Redlines:'}\n` +
                            (report.recommendations || []).map(r => `• ${r}`).join('\n');
                          generateAndDownloadWordDocument(docTitle, reportText);
                        };

                        return (
                          <tr key={report.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <div className="shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                </div>
                                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[120px] sm:max-w-[200px]">
                                  {report.file_name || (isRtl ? 'نص يدوي' : 'Manual Text')}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-center">
                              <RiskBadge score={report.risk_score} />
                            </td>
                            <td className="py-3 pr-4 hidden sm:table-cell">
                              <span className="text-slate-600 dark:text-slate-400 text-xs">{report.missing_clauses?.length ?? 0}</span>
                            </td>
                            <td className="py-3">
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(report.created_at).toLocaleDateString(i18n.language, {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <button
                                onClick={handleExportReportWord}
                                title={isRtl ? 'تحميل ملف Word (.docx)' : 'Download Word (.docx)'}
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">Word</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                  </table>
                </div>
              )
            ) : (
              contracts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {isRtl ? 'لا توجد عقود مُنشأة بعد.' : 'No contracts generated yet.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                        <th className={`pb-3 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t('Contracts.contractType')}</th>
                        <th className={`pb-3 font-semibold hidden sm:table-cell ${isRtl ? 'text-right' : 'text-left'}`}>{t('Contracts.partyA')}</th>
                        <th className={`pb-3 font-semibold hidden sm:table-cell ${isRtl ? 'text-right' : 'text-left'}`}>{t('Contracts.partyB')}</th>
                        <th className={`pb-3 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>
                          <Calendar className="w-3.5 h-3.5 inline" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {contracts.map((contract) => (
                        <tr key={contract.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="shrink-0 w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                              </div>
                              <span className="font-medium text-slate-800 dark:text-slate-200">{contract.contract_type}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 hidden sm:table-cell">
                            <span className="text-slate-700 dark:text-slate-300 text-xs truncate max-w-[120px] block">{contract.party_a}</span>
                          </td>
                          <td className="py-3 pr-4 hidden sm:table-cell">
                            <span className="text-slate-700 dark:text-slate-300 text-xs truncate max-w-[120px] block">{contract.party_b}</span>
                          </td>
                          <td className="py-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400">
                              {new Date(contract.created_at).toLocaleDateString(i18n.language, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>

          {!loading && (
            <div className="px-5 pb-4 flex items-center justify-end">
              <span className="text-xs text-slate-600 flex items-center gap-1">
                {isRtl ? 'آخر 10 سجلات' : 'Showing last 10 records'} <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
