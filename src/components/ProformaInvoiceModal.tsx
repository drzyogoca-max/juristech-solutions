import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Download, Printer, CheckCircle2, ShieldCheck, FileText, X, Sparkles, Copy, Check, Lock, Smartphone } from 'lucide-react';
import { OFFICIAL_BANK_ACCOUNT } from '../lib/financialGateway';

export interface ProformaInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanName?: string;
  defaultPlanPrice?: number;
}

export default function ProformaInvoiceModal({
  isOpen,
  onClose,
  defaultPlanName = 'حزمة الشركات الصغرى (Startup Plan)',
  defaultPlanPrice = 49,
}: ProformaInvoiceModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [companyName, setCompanyName] = useState('');
  const [crOrTaxId, setCrOrTaxId] = useState('');
  const [corporateEmail, setCorporateEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(defaultPlanPrice);
  const [selectedPlanName, setSelectedPlanName] = useState(defaultPlanName);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const invoiceNumber = `INV-PROFORMA-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const egpAmount = Math.round(selectedPlanPrice * 50);

  function handlePrintInvoice() {
    window.print();
  }

  function handleCopyDetails() {
    const text = `فاتورة مبدئية رقم: ${invoiceNumber}\nالشركة: ${companyName}\nالمبلغ: $${selectedPlanPrice} USD (${egpAmount.toLocaleString()} EGP)\nحساب SWIFT: ${OFFICIAL_BANK_ACCOUNT.iban}\nإنستا باي: +201031222262`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative text-slate-100 font-sans max-h-[90vh] overflow-y-auto print:max-w-none print:w-full print:bg-white print:text-black print:p-0">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {isRtl ? 'اصدار فاتورة مطالبات رسمية للشركة (Proforma B2B Invoice)' : 'Generate Corporate Proforma B2B Invoice'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'فاتورة مبدئية موجهة للقسم المالي في شركتك للصرف عبر التحويل البنكي SWIFT أو InstaPay' : 'Official PDF Proforma Invoice for Corporate Accounts Payable'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!generated ? (
          /* FORM INPUTS */
          <form onSubmit={(e) => { e.preventDefault(); setGenerated(true); }} className="space-y-4 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {isRtl ? 'اسم الشركة / المؤسسة الرسمي:' : 'Official Corporate Entity Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={isRtl ? 'مثال: شركة أوراسكوم أو الهندسية المتقدمة' : 'e.g. Apex Global Corp LLC'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {isRtl ? 'رقم السجل التجاري / الرقم الضريبي:' : 'Tax ID / CR Number:'}
                </label>
                <input
                  type="text"
                  required
                  value={crOrTaxId}
                  onChange={(e) => setCrOrTaxId(e.target.value)}
                  placeholder={isRtl ? 'مثال: 1010884920 / VAT 300482910' : 'e.g. CR 904812 / VAT 3004812'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {isRtl ? 'البريد الإلكتروني المعتمد للمالية:' : 'Finance / Accounts Email:'}
                </label>
                <input
                  type="email"
                  required
                  value={corporateEmail}
                  onChange={(e) => setCorporateEmail(e.target.value)}
                  placeholder="finance@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {isRtl ? 'الباقة والخدمة المطلوبة:' : 'Select Subscription Package:'}
                </label>
                <select
                  value={selectedPlanPrice}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    setSelectedPlanPrice(price);
                    setSelectedPlanName(price === 349 ? 'حزمة الشركات الكبرى (Enterprise Plan)' : price === 139 ? 'حزمة الشركات المتوسطة (SMEs Plan)' : 'حزمة الشركات الصغرى (Startup Plan)');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={49}>حزمة الناشئة — $49 / شهر (2,450 EGP)</option>
                  <option value={139}>حزمة المتوسطة — $139 / شهر (6,950 EGP)</option>
                  <option value={349}>حزمة الكبرى — $349 / شهر (17,450 EGP)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                {isRtl ? 'عنوان مقَر الشركة:' : 'Corporate Address:'}
              </label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder={isRtl ? 'مثال: الرياض، برج المملكة / القاهرة، التجمع الخامس' : 'e.g. Riyadh, KSA / Cairo, Egypt'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>{isRtl ? 'توليد الفاتورة الضريبية المبدئية الآن' : 'Generate Proforma Invoice Now'}</span>
            </button>
          </form>
        ) : (
          /* PREVIEW & PRINTABLE INVOICE DOCUMENT */
          <div className="space-y-6">
            
            {/* Invoice Document Box */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40 text-xs space-y-6 print:bg-white print:text-black print:border-none print:p-0">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4 print:border-black">
                <div>
                  <h2 className="text-xl font-black text-amber-400 print:text-black">JurisTech Solutions</h2>
                  <p className="text-[11px] text-slate-400 print:text-gray-600">Sovereign AI Legal Intelligence & Enterprise Governance Platform</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Tax ID: EG-300291029 | Commercial Reg: 902812</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[11px] print:bg-gray-200 print:text-black">
                    PROFORMA B2B INVOICE
                  </span>
                  <div className="mt-2 font-mono text-[11px] text-slate-300 print:text-black">
                    <div>Ref: <strong className="text-amber-400 print:text-black">{invoiceNumber}</strong></div>
                    <div>Date: {invoiceDate}</div>
                  </div>
                </div>
              </div>

              {/* Billed To Section */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 print:bg-gray-50 print:border-gray-300 print:text-black">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Billed To (العميل):</span>
                  <div className="font-extrabold text-white text-sm print:text-black">{companyName}</div>
                  <div className="text-[11px] text-slate-300 print:text-black font-mono">Tax / CR: {crOrTaxId}</div>
                  <div className="text-[11px] text-slate-400 print:text-black">{corporateEmail}</div>
                  {companyAddress && <div className="text-[10px] text-slate-500 print:text-black">{companyAddress}</div>}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Provider (المورد):</span>
                  <div className="font-bold text-slate-200 print:text-black">JurisTech Solutions Platform</div>
                  <div className="text-[11px] text-slate-400 print:text-black">Official Email: juristech.solutions@outlook.com</div>
                  <div className="text-[11px] text-slate-400 print:text-black">WhatsApp / Phone: +201126674337</div>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-right" dir={isRtl ? 'rtl' : 'ltr'}>
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono print:border-black print:text-black">
                    <th className="py-2 text-right">{isRtl ? 'الخدمة / الباقة' : 'Service / Plan'}</th>
                    <th className="py-2 text-center">{isRtl ? 'المدة' : 'Period'}</th>
                    <th className="py-2 text-left">{isRtl ? 'المبلغ ($)' : 'Amount ($)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                  <tr>
                    <td className="py-3 font-bold text-white print:text-black">
                      {selectedPlanName}
                      <div className="text-[10px] text-slate-400 font-normal">تفعيل الوصول الكامل لصياغة وتدقيق العقود والـ AI Redlines</div>
                    </td>
                    <td className="py-3 text-center text-slate-300 font-mono print:text-black">1 Month</td>
                    <td className="py-3 text-left font-black text-amber-300 font-mono text-sm print:text-black">${selectedPlanPrice} USD</td>
                  </tr>
                </tbody>
              </table>

              {/* Total Summary */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between font-mono print:bg-gray-100 print:border-gray-400">
                <span className="font-bold text-slate-200 print:text-black text-xs">
                  {isRtl ? 'إجمالي المطلوب تحويله:' : 'Total Amount Payable:'}
                </span>
                <div className="text-right">
                  <div className="text-lg font-black text-amber-400 print:text-black">${selectedPlanPrice} USD</div>
                  <div className="text-[11px] text-slate-400 print:text-black font-bold">({egpAmount.toLocaleString()} EGP)</div>
                </div>
              </div>

              {/* Payment Accounts Box */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block print:text-black">
                  {isRtl ? 'بيانات الحسابات البنكية الرسمية للدفع:' : 'Official Bank Payment Destinations:'}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 print:bg-white">
                    <span className="font-bold text-amber-300 block">1. SWIFT Bank Wire (تحويل بنكي):</span>
                    <div>Bank: {OFFICIAL_BANK_ACCOUNT.bankNameEn}</div>
                    <div>IBAN: {OFFICIAL_BANK_ACCOUNT.iban}</div>
                    <div>SWIFT: {OFFICIAL_BANK_ACCOUNT.swiftCode}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 print:bg-white">
                    <span className="font-bold text-emerald-300 block">2. InstaPay Egypt (إنستا باي):</span>
                    <div>Receiver: +201031222262</div>
                    <div>Local: 01031222262</div>
                    <div>Status: Instant Active</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Print & Action Controls */}
            <div className="flex flex-col sm:flex-row gap-3 print:hidden">
              <button
                onClick={handlePrintInvoice}
                className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isRtl ? 'طباعة / حفظ الفاتورة كـ PDF' : 'Print / Save Invoice as PDF'}</span>
              </button>

              <button
                onClick={handleCopyDetails}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ بيانات التحويل' : 'Copy Transfer Details')}</span>
              </button>

              <button
                onClick={() => setGenerated(false)}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                {isRtl ? 'تعديل البيانات' : 'Edit Details'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
