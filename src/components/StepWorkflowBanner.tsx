import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, AlertTriangle, MessageSquare, Download } from 'lucide-react';
import { useContract } from '../context/ContractContext';

export default function StepWorkflowBanner() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isRtl = i18n.language === 'ar';
  const { contractState } = useContract();

  const steps = [
    {
      num: 1,
      id: 'step-1',
      path: '/contracts',
      titleAr: '1. رفع الفحص والتحليل',
      titleEn: '1. Smart Upload & OCR',
      descAr: contractState.fileName ? `تم الرفع: ${contractState.fileName}` : 'استخراج نصوص العقود بالذكاء الاصطناعي',
      descEn: contractState.fileName ? `Uploaded: ${contractState.fileName}` : 'Native Language Extraction',
      icon: Upload,
      activeRoutes: ['/contracts', '/contract-generator'],
    },
    {
      num: 2,
      id: 'step-2',
      path: '/risk',
      titleAr: '2. التدقيق وخريطة المخاطر',
      titleEn: '2. Heatmap Audit & Redlines',
      descAr: contractState.auditResults ? `التقييم: ${contractState.auditResults.riskScore}%` : 'تحليل البنود وإصدار الصياغة البديلة',
      descEn: contractState.auditResults ? `Score: ${contractState.auditResults.riskScore}%` : 'Zero-Risk Clause Rewrites',
      icon: AlertTriangle,
      activeRoutes: ['/risk', '/risk-analysis'],
    },
    {
      num: 3,
      id: 'step-3',
      path: '/negotiation',
      titleAr: '3. التوافق والتوقيع المعتمد',
      titleEn: '3. AI Compromise & E-Sign',
      descAr: 'غرفة التفاوض والختم الرقمي SHA-256',
      descEn: 'Certified Digital Sealing',
      icon: MessageSquare,
      activeRoutes: ['/negotiation', '/negotiate'],
    },
    {
      num: 4,
      id: 'step-4',
      path: '/enterprise-audit',
      titleAr: '4. التصدير المعتمد M&A',
      titleEn: '4. Bilingual PDF/Word Export',
      descAr: 'تصدير وثائق الصفقات المعتمدة',
      descEn: 'Official Platform Seals',
      icon: Download,
      activeRoutes: ['/enterprise-audit'],
    },
  ];

  return (
    <div className="bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 p-3.5 sticky top-16 z-30 backdrop-blur-md min-h-[72px] contain-layout" dir={isRtl ? 'rtl' : 'ltr'}>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {steps.map((step) => {
            const isActive = step.activeRoutes.includes(location.pathname);
            const Icon = step.icon;

            return (
              <Link
                key={step.id}
                to={step.path}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950 to-slate-900 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-950/40 scale-101'
                    : 'bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:border-slate-700 hover:text-slate-800 dark:text-slate-200'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl shrink-0 font-black text-xs ${
                    isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="truncate flex-1">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-cyan-400 block">
                    STEP 0{step.num}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {isRtl ? step.titleAr : step.titleEn}
                  </h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate font-medium">
                    {isRtl ? step.descAr : step.descEn}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
