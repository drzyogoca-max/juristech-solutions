import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, DollarSign, TrendingUp, ShieldCheck, CheckCircle2, X } from 'lucide-react';

export interface ROICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ROICalculatorModal: React.FC<ROICalculatorModalProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [contractVolume, setContractVolume] = useState<number>(25);
  const [avgExternalLegalCost, setAvgExternalLegalCost] = useState<number>(350);

  if (!isOpen) return null;

  const traditionalAnnualCost = contractVolume * avgExternalLegalCost * 12;
  const platformAnnualCost = 499.99; // Enterprise Plan
  const estimatedSavings = Math.max(0, traditionalAnnualCost - platformAnnualCost);
  const roiPercentage = Math.round((estimatedSavings / platformAnnualCost) * 100);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-white dark:bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative overflow-hidden"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                ENTERPRISE FEASIBILITY & ROI
              </span>
              <h3 className="font-black text-lg text-slate-900 dark:text-white mt-0.5">
                {isRtl ? '💰 حاسبة العائد الاستثماري والوفر المالي' : '💰 Enterprise ROI & Feasibility Calculator'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 font-sans text-xs">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {isRtl ? 'عدد العقود التي تراجعها وتصدرها شهرياً:' : 'Monthly Contract Volume:'}
              </label>
              <span className="font-mono text-cyan-400 font-black text-sm">{contractVolume} {isRtl ? 'عقد' : 'contracts'}</span>
            </div>
            <input
              type="range"
              min={5}
              max={200}
              value={contractVolume}
              onChange={(e) => setContractVolume(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {isRtl ? 'المتوسط التقليدي لاستشارة العقد (USD):' : 'Avg External Legal Fee per Contract (USD):'}
              </label>
              <span className="font-mono text-amber-400 font-black text-sm">${avgExternalLegalCost}</span>
            </div>
            <input
              type="range"
              min={100}
              max={1500}
              step={50}
              value={avgExternalLegalCost}
              onChange={(e) => setAvgExternalLegalCost(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-3 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{isRtl ? 'التكلفة الاستشارية التقليدية سنوياً:' : 'Traditional Legal Cost / Year:'}</span>
              <strong className="text-red-400 line-through text-sm">${traditionalAnnualCost.toLocaleString()}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">{isRtl ? 'اشتراك منصة JurisTech سنوياً:' : 'JurisTech Platform Subscription:'}</span>
              <strong className="text-cyan-400 text-sm">${platformAnnualCost.toLocaleString()}</strong>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-amber-400 font-bold font-sans text-sm">{isRtl ? 'صافي الوفر المالي المباشر سنوياً:' : 'Net Annual Cost Savings:'}</span>
              <strong className="text-emerald-400 text-xl font-black">${estimatedSavings.toLocaleString()} USD</strong>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400 text-[11px] font-sans">{isRtl ? 'معدل العائد الاستثماري (ROI):' : 'Return on Investment (ROI):'}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                +{roiPercentage}% ROI
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isRtl
                ? '* تشمل الباقات الاستحواذ على منشئ العقود، التدقيق التلقائي بالذكاء الاصطناعي، وختم التوثيق الرقمي SHA-256.'
                : '* Enterprise plan includes contract generation, AI risk audit, and sovereign SHA-256 digital seals.'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-400/20"
        >
          {isRtl ? 'إغلاق واستكمال الخيار' : 'Close & Select Plan'}
        </button>
      </div>
    </div>
  );
};

export default ROICalculatorModal;
