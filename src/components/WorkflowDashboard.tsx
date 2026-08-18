import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ShieldAlert,
  MessageSquare,
  Download,
  Upload,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  Globe
} from 'lucide-react';

export const WorkflowDashboard: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();

  const steps = [
    {
      stepNum: isRtl ? 'الخطوة 1' : 'Step 1',
      title: isRtl ? 'مراجعة العقد' : 'Contract Review',
      description: isRtl
        ? 'رفع وتحليل العقود القانونية بدقة فائقة وفق لوائح منطقتك.'
        : 'Upload and analyze legal contracts with high precision.',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      borderColor: 'hover:border-blue-500/60',
      icon: FileText,
      link: '/contracts',
    },
    {
      stepNum: isRtl ? 'الخطوة 2' : 'Step 2',
      title: isRtl ? 'كشف المخاطر' : 'Risk Detection',
      description: isRtl
        ? 'رصد الثغرات القانونية وبنود الضمان والشرط الجزائي.'
        : 'Detect legal traps, financial liabilities & uncapped risks.',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      borderColor: 'hover:border-amber-500/60',
      icon: ShieldAlert,
      link: '/risk',
    },
    {
      stepNum: isRtl ? 'الخطوة 3' : 'Step 3',
      title: isRtl ? 'أسئلة استفسارية' : 'Legal AI Inquiry',
      description: isRtl
        ? 'توجيه أسئلة تحليلية إضافية للمستشار الذكي.'
        : 'Ask analytical legal questions to the AI advisor.',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      borderColor: 'hover:border-purple-500/60',
      icon: MessageSquare,
      link: '/chat',
    },
    {
      stepNum: isRtl ? 'الخطوة 4' : 'Step 4',
      title: isRtl ? 'تصدير الملخص' : 'Export Summary',
      description: isRtl
        ? 'استخراج التقارير والوثائق القانونية المعتمدة مع الختم.'
        : 'Generate certified legal reports and executive docs.',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      borderColor: 'hover:border-emerald-500/60',
      icon: Download,
      link: '/reports',
    },
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full space-y-6 my-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'مسار العمل المهني المتسلسل' : 'Professional Sequential Workflow'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isRtl ? 'نظام سير العمل المستند للعقود والمخاطر' : 'Workflow-Based Legal Suite'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {isRtl
              ? 'اتبع التسلسل المهني الموصى به لإدارة عقودك وتأمين المؤسسة من المخاطر التشريعية:'
              : 'Follow the recommended step-by-step workflow to audit contracts and eliminate legal traps:'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isRtl ? 'نظام التوافق النافذ نشط' : 'Statutory Flow Active'}</span>
          </span>
        </div>
      </div>

      {/* 4-Step Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step) => {
          const IconComponent = step.icon;
          return (
            <div
              key={step.title}
              onClick={() => navigate(step.link)}
              className={`p-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm ${step.borderColor} transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${step.badgeColor} uppercase tracking-wider`}>
                    {step.stepNum}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-cyan-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-500 group-hover:text-cyan-400">
                <span>{isRtl ? 'البدء بالمرحلة' : 'Start Step'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        <Link
          to="/contracts"
          aria-label={isRtl ? 'رفع عقد جديد' : 'Upload New Contract'}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>{isRtl ? 'رفع عقد جديد' : 'Upload New Contract'}</span>
        </Link>

        <Link
          to="/chat"
          aria-label={isRtl ? 'طرح سؤال قانوني' : 'Ask Legal Question'}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all shadow-md active:scale-95"
        >
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span>{isRtl ? 'طرح سؤال قانوني' : 'Ask Legal Question'}</span>
        </Link>

        <Link
          to="/reports"
          aria-label={isRtl ? 'توليد تقرير شامل' : 'Generate Report'}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all shadow-md active:scale-95"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? 'توليد تقرير شامل' : 'Generate Report'}</span>
        </Link>

        <Link
          to="/risk"
          aria-label={isRtl ? 'مراجعة ملخص المخاطر' : 'Review Risk Summary'}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all shadow-md active:scale-95"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>{isRtl ? 'مراجعة ملخص المخاطر' : 'Review Risk Summary'}</span>
        </Link>
      </div>
    </div>
  );
};

export default WorkflowDashboard;
