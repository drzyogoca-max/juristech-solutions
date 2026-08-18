/**
 * DigitalInvoiceModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Digital Invoice & Subscription Confirmation Modal
 * Renders official tax invoice with SHA-256 verification seal and PDF export.
 */

import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck, X, Download, Printer, CheckCircle2, Lock, FileText, Globe, ExternalLink, QrCode
} from 'lucide-react';
import { BillingTransaction } from '../lib/financialGateway';
import { exportLegalContractPDF } from '../lib/pdfExporter';

interface DigitalInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: BillingTransaction | null;
}

export default function DigitalInvoiceModal({ isOpen, onClose, transaction }: DigitalInvoiceModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !transaction) return null;

  const issueDate = new Date(transaction.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const expiryDate = new Date(transaction.expiresAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const summaryText = isRtl
      ? `فاتورة سداد إلكترونية رسمية
رقم الفاتورة: ${transaction.invoiceId}
المستفيد / العميل: ${transaction.userName} (${transaction.userEmail})
الباقة / الخدمة: ${transaction.planName}
المبلغ المدفوع: ${transaction.amountUSD} دولار أمريكي
وسيلة الدفع: ${transaction.paymentMethod}
تاريخ الإصدار: ${issueDate}
تاريخ الانتهاء: ${expiryDate}
رمز التوثيق والتشفير: ${transaction.sha256Hash}
حالة الفاتورة: مدفوعة وموثقة رسمياً`.trim()
      : `OFFICIAL DIGITAL INVOICE & RECEIPT
Invoice ID: ${transaction.invoiceId}
Customer: ${transaction.userName} (${transaction.userEmail})
Plan: ${transaction.planName}
Amount Paid: $${transaction.amountUSD} USD
Payment Method: ${transaction.paymentMethod}
Issue Date: ${issueDate}
Expiry Date: ${expiryDate}
Verification Hash: ${transaction.sha256Hash}
Status: OFFICIAL E-PAID & ACTIVE`.trim();

    exportLegalContractPDF(
      summaryText,
      `INVOICE-${transaction.invoiceId}`,
      'Legal Shield Solution Ltd.',
      transaction.userName,
      'Legal Shield Financial System',
      transaction.userName,
      transaction.sha256Hash,
      isRtl ? 'ar' : 'en'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {isRtl ? 'الفاتورة الرقمية الموثقة والتأكيد الفوري' : 'Official Digital Tax Invoice'}
              </h2>
              <p className="text-[11px] text-cyan-400 font-mono">
                {isRtl ? 'نظام الاشتراكات التلقائي — https://juristech.solutions' : 'Automated Subscription System — https://juristech.solutions'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Body Container */}
        <div ref={printRef} className="p-6 sm:p-8 space-y-6 overflow-y-auto font-sans">
          
          {/* Invoice Header Details */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-black text-cyan-500 uppercase tracking-widest block mb-1">
                {isRtl ? 'المصدر / المزود الرسمي' : 'ISSUER / SERVICE PROVIDER'}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Legal Shield Solution</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Global Autonomous Legal Advisory Platform<br />
                Domain: <a href="https://juristech.solutions" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">https://juristech.solutions</a><br />
                Support: <span className="font-mono text-cyan-400">Drzyogo.ca@gmail.com</span>
              </p>
            </div>

            <div className="sm:text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isRtl ? 'دفع مؤكد 100% - نشط' : 'PAID & ACTIVATED'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {isRtl ? 'رقم الفاتورة:' : 'Invoice No:'} <strong className="text-slate-900 dark:text-white font-bold">{transaction.invoiceId}</strong>
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                {isRtl ? 'رقم المعاملة:' : 'TXN Ref:'} <strong className="text-slate-900 dark:text-white">{transaction.id}</strong>
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                {isRtl ? 'تاريخ الإصدار:' : 'Issue Date:'} {issueDate}
              </p>
            </div>
          </div>

          {/* Subscriber Recipient Info */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {isRtl ? 'بيانات المشترك والجهة المتعاقدة' : 'SUBSCRIBER DETAILS'}
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{transaction.userName}</p>
              {transaction.companyName && (
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  {isRtl ? 'الشركة:' : 'Company:'} <strong>{transaction.companyName}</strong>
                </p>
              )}
              <p className="text-xs font-mono text-cyan-400 mt-0.5">{transaction.userEmail}</p>
              {transaction.customerPhone && (
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                  {isRtl ? 'الهاتف:' : 'Phone:'} {transaction.customerPhone}
                </p>
              )}
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {isRtl ? 'تفاصيل الاشتراك والانتهاء' : 'SUBSCRIPTION DURATION'}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {isRtl ? 'تاريخ بداية التفعيل:' : 'Start Date:'} <strong className="font-mono">{issueDate}</strong>
              </p>
              <p className="text-xs text-emerald-400 font-bold mt-0.5">
                {isRtl ? 'ساري حتى تاريخ:' : 'Valid Until:'} <strong className="font-mono text-emerald-400">{expiryDate}</strong>
              </p>
            </div>
          </div>

          {/* Anti-Fraud SWIFT Financial Traceability Info Box */}
          {(transaction.swiftCode || transaction.senderBankName) && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs font-mono space-y-1">
              <span className="font-bold text-red-400 block font-sans">
                {isRtl ? 'بيانات التحقق وتتبع الحوالة البنكية لمنع الاحتيال (SWIFT Audit Trace):' : 'Anti-Fraud SWIFT Transfer Verification Info:'}
              </span>
              <div className="text-slate-800 dark:text-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] mt-1.5" dir="ltr">
                <div><strong className="text-cyan-400">{isRtl ? 'البنك المحول منه:' : 'Sender Bank:'}</strong> {transaction.senderBankName || 'N/A'}</div>
                <div><strong className="text-cyan-400">{isRtl ? 'كود السويفت (SWIFT):' : 'Sender SWIFT:'}</strong> {transaction.swiftCode || 'N/A'}</div>
                <div className="sm:col-span-2"><strong className="text-cyan-400">{isRtl ? 'مرجع التحويل الفريد:' : 'Unique Reference Code:'}</strong> {transaction.id}</div>
              </div>
            </div>
          )}

          {/* Itemized Invoice Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-right" dir={isRtl ? 'rtl' : 'ltr'}>
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 text-left">{isRtl ? 'الوصف وخطة الاشتراك' : 'Description'}</th>
                  <th className="p-3.5">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</th>
                  <th className="p-3.5">{isRtl ? 'المدة' : 'Cycle'}</th>
                  <th className="p-3.5 text-left">{isRtl ? 'المبلغ الصافي' : 'Subtotal'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                <tr>
                  <td className="p-3.5 text-left">
                    <span className="font-bold text-slate-900 dark:text-white block">{transaction.planName}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      {isRtl ? 'وصول شامل وغير محدود لكافة الخدمات القانونية والاستشارية' : 'Full unlimited AI Legal & Contract Advisory Suite'}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-cyan-400 font-bold">{transaction.paymentMethod}</td>
                  <td className="p-3.5 font-mono">{transaction.planId === 'enterprise' ? '1 Year' : '30 Days'}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white text-left">${transaction.amountUSD.toFixed(2)}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 font-bold">
                <tr>
                  <td colSpan={3} className="p-3.5 text-left">{isRtl ? 'المجموع الكلي المعتمد (USD):' : 'Total Paid Amount (USD):'}</td>
                  <td className="p-3.5 text-left font-mono text-base font-black text-emerald-400">${transaction.amountUSD.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Official Bank Account Beneficiary Info Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono space-y-1.5">
            <span className="font-bold text-amber-400 block font-sans">
              {isRtl ? 'بيانات الحساب البنكي الرسمي المعتمد للمحولات (Official Beneficiary Account):' : 'Official Beneficiary Wire Bank Details:'}
            </span>
            <div className="text-slate-800 dark:text-slate-200 space-y-0.5 text-[11px]">
              <div><strong className="text-cyan-400">{isRtl ? 'البنك:' : 'Bank:'}</strong> بنك البركة (Al Baraka Bank) — فرع الحديقة الدولية (Al Hadiqa Al dawlia Branch)</div>
              <div><strong className="text-cyan-400">{isRtl ? 'المستفيد:' : 'Beneficiary:'}</strong> محمد مصطفى محمد (MHAMMAD MUSTAFA MHAMMAD)</div>
              <div><strong className="text-cyan-400">IBAN:</strong> <span className="text-amber-300 font-bold select-all">EG310022012880211102491757001</span> | <strong className="text-cyan-400">SWIFT:</strong> <span className="text-cyan-300 font-bold">ABRKEGCAXXX</span></div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Digital Verification Seal */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {isRtl ? 'ختم التوثيق الرقمي السيادي SHA-256' : 'SHA-256 Sovereign Verification Seal'}
              </span>
              <p className="text-[10px] font-mono text-slate-400 break-all mt-1">
                {transaction.sha256Hash}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isRtl ? 'تحميل الفاتورة PDF' : 'Download Invoice PDF'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{isRtl ? 'طباعة' : 'Print Invoice'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-colors"
          >
            {isRtl ? 'إغلاق ومتابعة للخدمات' : 'Close & Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}
