/**
 * src/components/PayTabsReviewModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * PayTabs Gateway Review Notice Modal
 * Informs customers that the primary card processing gateway is currently
 * under official compliance review (merchant KYC submitted) and routes them
 * to instant verified settlement channels (SWIFT, Binance Pay, InstaPay, Proforma).
 */

import React from 'react';
import { X, Clock, Building2, Smartphone, Zap, FileText } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';

interface PayTabsReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: any;
  onSelectMethod: (method: 'wire' | 'binance' | 'instapay' | 'proforma', plan: any) => void;
}

export default function PayTabsReviewModal({
  isOpen,
  onClose,
  selectedPlan,
  onSelectMethod
}: PayTabsReviewModalProps) {
  const { l } = usePlatformLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-lg w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider block">
              {l('بوابة الدفع الرئيسية — الحالة الرسمية', 'Primary Payment Gateway — Status')}
            </span>
            <h3 className="text-lg font-black text-white">
              {l('الدفع بالبطاقات (PayTabs) — قيد مراجعة الحساب', 'PayTabs Card Checkout — Under Merchant Review')}
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            {l(
              'تم تقديم طلب اعتماد حساب التاجر رسمياً لبوابة PayTabs كبوابة دفع رئيسية، والحساب حالياً قيد المراجعة والتدقيق الإجرائي النهائي من مزود الخدمة قبل التفعيل المباشر للبطاقات.',
              'Corporate merchant KYC application has been officially submitted to PayTabs as our primary card gateway. The account is currently under active compliance review prior to live card checkout activation.'
            )}
          </p>
          <p className="text-slate-400 text-[11px]">
            {l(
              'لتفعيل اشتراكك فوراً دون انتظار اكتمال المراجعة، يرجى استخدام إحدى القنوات المعتمدة المباشرة التالية:',
              'To activate your subscription immediately, please use one of our active direct channels:'
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSelectMethod('wire', selectedPlan)}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-sky-300 flex items-center gap-2 justify-center transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>SWIFT Wire</span>
          </button>

          <button
            onClick={() => onSelectMethod('binance', selectedPlan)}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-2 justify-center transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Binance Pay</span>
          </button>

          <button
            onClick={() => onSelectMethod('instapay', selectedPlan)}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-300 flex items-center gap-2 justify-center transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>InstaPay (Egypt)</span>
          </button>

          <button
            onClick={() => onSelectMethod('proforma', selectedPlan)}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2 justify-center transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Proforma Invoice</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">{l('استفسار تنفيذي مباشر:', 'Direct Executive Contact:')}</span>
          <a href="mailto:founder@juristech.solutions" className="text-sky-400 hover:underline font-mono">founder@juristech.solutions</a>
        </div>
      </div>
    </div>
  );
}
