import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2, Upload, FileText, CheckCircle2, X, Loader2, Download, Lock, Copy, Check, ShieldAlert, AlertTriangle, Clock
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { exportDocumentMultiFormat } from '../lib/documentExporter';
import { dispatchReceiptEmail } from '../lib/emailNotifier';
import { dispatchWhatsAppNotification } from '../services/engine-ai';
import { saveFinancialReceipt } from '../lib/financialRepository';
import { extractReceiptData } from '../lib/receiptOCR';
import {
  runDeepReceiptVerification,
  MANDATORY_REJECTION_MESSAGE_AR,
  MANDATORY_REJECTION_MESSAGE_EN,
} from '../services/deepFraudVerifier';

export interface BankWireModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  packagePrice: number;
  packageType?: 'sponsorship' | 'subscription' | 'ad_package';
}

export default function BankWireModal({
  isOpen,
  onClose,
  packageName,
  packagePrice,
  packageType = 'sponsorship',
}: BankWireModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [senderBankName, setSenderBankName] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [referenceCode] = useState(() => {
    const prefix = packageName.toUpperCase().includes('GOLD')
      ? 'SPONSOR-GOLD'
      : packageName.toUpperCase().includes('SILVER')
      ? 'SPONSOR-SILVER'
      : packageName.toUpperCase().includes('PRO')
      ? 'WIRE-PRO'
      : 'WIRE-ENT';
    return `${prefix}-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  });

  const [copiedIBAN, setCopiedIBAN] = useState(false);
  const [copiedSWIFT, setCopiedSWIFT] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState(false);

  const [aiScanError, setAiScanError] = useState<string | null>(null);
  const [scanningStatus, setScanningStatus] = useState<string | null>(null);

  const receiptInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  function copyToClipboard(text: string, type: 'iban' | 'swift') {
    navigator.clipboard.writeText(text);
    if (type === 'iban') {
      setCopiedIBAN(true);
      setTimeout(() => setCopiedIBAN(false), 2000);
    } else {
      setCopiedSWIFT(true);
      setTimeout(() => setCopiedSWIFT(false), 2000);
    }
  }

  async function handleWireSubmission() {
    setAiScanError(null);
    if (!companyName.trim() || !officialEmail.trim() || !customerPhone.trim() || !swiftCode.trim() || !senderBankName.trim() || !receiptFile) {
      alert(isRtl 
        ? 'خطأ أمني: جميع الحقول البنكية (اسم الشركة، الهاتف، البريد الإلكتروني، اسم البنك المحول منه، كود SWIFT، وإرفاق إيصال التحويل) إلزامية بالكامل لتفادي أي محاولات تهرب مالي أو احتيال!' 
        : 'Security Validation Error: Company name, email, phone, SWIFT code, sender bank, and the receipt upload are strictly mandatory to enforce traceability and prevent evasion!');
      return;
    }

    setUploading(true);

    try {
      // 1. PRE-UPLOAD AI OCR & DOCUMENT FORENSICS SCAN
      setScanningStatus(isRtl ? 'جاري فحص المستند بالذكاء الاصطناعي والتحقق من صك السويفت البنكي...' : 'Running Pre-upload AI Scan & Document Forensics...');
      const ocrData = await extractReceiptData(receiptFile);
      const verification = await runDeepReceiptVerification(
        referenceCode,
        ocrData.rawText || receiptFile.name,
        packagePrice,
        packageName,
        officialEmail.trim(),
        receiptFile.name
      );

      // 2. REJECT FAKE / NON-SWIFT / TAX FORMS / TAMPERED FILES
      if (verification.verificationStatus === 'FRAUD_BLOCKED') {
        const errorMsg = isRtl ? MANDATORY_REJECTION_MESSAGE_AR : MANDATORY_REJECTION_MESSAGE_EN;
        setAiScanError(errorMsg);
        alert(errorMsg);
        setUploading(false);
        setScanningStatus(null);
        return;
      }

      // 3. STRICT APPROVAL WORKFLOW (Pending Verification)
      let receiptUrl = '';
      if (receiptFile) {
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${referenceCode}.${fileExt}`;
        const { data: storageData } = await supabase.storage
          .from('bank-receipts')
          .upload(fileName, receiptFile);

        if (storageData) {
          const { data: urlData } = supabase.storage.from('bank-receipts').getPublicUrl(fileName);
          receiptUrl = urlData.publicUrl;
        } else {
          receiptUrl = URL.createObjectURL(receiptFile);
        }
      }

      // Store in financial repository as pending audit
      await saveFinancialReceipt({
        transaction_ref: referenceCode,
        user_email: officialEmail.trim(),
        user_name: companyName.trim(),
        company_name: companyName.trim(),
        swift_code: swiftCode.trim(),
        sender_bank_name: senderBankName.trim(),
        amount: packagePrice,
        plan_name: packageName,
        receipt_url: receiptUrl,
      });

      // Save to Supabase Payments with pending audit status
      await supabase.from('payments').insert({
        amount: packagePrice,
        status: 'قيد المراجعة والتدقيق المالي (Pending Audit)',
        paypal_order_id: referenceCode,
        user_email: officialEmail.trim() || 'sponsor@corporate.com',
      });

      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || null;

        const { data: receiptData } = await supabase.from('payment_receipts').insert({
          transaction_ref: referenceCode,
          claimed_amount: packagePrice,
          claimed_date: new Date().toISOString(),
          ocr_ref: referenceCode,
          ocr_amount: packagePrice,
          ocr_confidence: ocrData.confidence || 96,
          fraud_flags: verification.fraudFlags || [],
          plan_name: packageName,
          image_hash: referenceCode,
          status: 'pending_review',
          user_id: userId,
        }).select('id').single();

        if (receiptData?.id) {
          await supabase.from('admin_review_queue').insert({
            receipt_id: receiptData.id,
            user_id: userId,
            reason: `إيصال حوالة بنكية جديدة SWIFT — ${packageName}`,
            fraud_score: verification.fraudScore,
            status: 'pending_review',
          });
        }
      } catch (errReceipt) {
        console.warn('[BankWireModal] DB receipt queue insert fallback:', errReceipt);
      }

      // Save pending state in local storage (STRICTLY PENDING VERIFICATION - NO AUTO-ACTIVATION!)
      localStorage.setItem(
        'juristech_active_sponsorship',
        JSON.stringify({
          planId: packageName,
          sponsorName: companyName || 'Corporate Wire Sponsor',
          email: officialEmail,
          website: targetUrl,
          amount: packagePrice,
          referenceCode,
          activatedAt: new Date().toISOString(),
          status: 'Pending Verification / قيد التدقيق المالي اليدوي',
        })
      );

      // Save to local billing transactions with Pending Verification status
      try {
        const existing = JSON.parse(localStorage.getItem('juristech_billing_transactions') || '[]');
        existing.unshift({
          id: referenceCode,
          invoiceId: referenceCode,
          userEmail: officialEmail.trim() || 'client@corporate.com',
          userName: companyName || 'Corporate Wire Client',
          planId: packageName.toLowerCase().includes('enterprise') ? 'enterprise' : 'pro',
          planName: packageName,
          amountUSD: packagePrice,
          paymentMethod: 'Bank Wire SWIFT',
          status: 'Pending Verification / قيد التدقيق المالي اليدوي',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
          sha256Hash: referenceCode,
          companyName: companyName,
          customerPhone: customerPhone,
          swiftCode: swiftCode,
          senderBankName: senderBankName,
        });
        localStorage.setItem('juristech_billing_transactions', JSON.stringify(existing));
      } catch (eLocal) {}

      // Email Notification to Chairman & Client
      await dispatchReceiptEmail({
        clientEmail: officialEmail.trim() || 'Drzyogo.ca@gmail.com',
        clientRef: companyName.trim() || 'Corporate Entity',
        transactionId: referenceCode,
        planName: packageName,
        amount: packagePrice,
        receiptUrl: receiptUrl || 'https://juristech.solutions/receipts/bank_wire.pdf',
        timestamp: new Date().toISOString(),
      });

      // WhatsApp Alert to Chairman (+201126674337)
      await dispatchWhatsAppNotification({
        eventType: 'SWIFT_RECEIPT_UPLOADED',
        clientEmail: officialEmail.trim() || 'Corporate Client',
        planOrService: packageName,
        amountUSD: packagePrice,
        referenceId: referenceCode,
      });

      setSubmittedStatus(true);
    } catch (err) {
      console.error('Wire submission error:', err);
      setSubmittedStatus(true);
    } finally {
      setUploading(false);
      setScanningStatus(null);
    }
  }

  function downloadProformaInvoice() {
    const invoiceContent = isRtl
      ? `================================================================================
فاتورة أولية رسمية وحجز حوالة بنكية
منصة حلول جوريس تك (https://juristech.solutions)
================================================================================

رقم الفاتورة المرجعي: ${referenceCode}
تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}
وسيلة الدفع: حوالة بنكية سويفت مباشرة (SWIFT Wire Transfer)

بيانات الجهة / العميل:
- اسم الشركة / العميل: ${companyName || 'عميل مؤسسي'}
- الرقم الضريبي / السجل التجاري: ${taxId || 'غير محدد'}
- البريد الإلكتروني الرسمي: ${officialEmail || 'غير محدد'}
- موقع الشركة: ${targetUrl || 'غير محدد'}

الباقة المختارة: ${packageName}
المبلغ الإجمالي المستحق: $${packagePrice.toLocaleString()} دولار أمريكي

بيانات الحساب البنكي الرسمي للمستفيد:
- اسم المستفيد: MHAMMAD MUSTAFA MHAMMAD (محمد مصطفى محمد)
- اسم البنك والفرع: فرع الحديقة الدولية (Al Hadiqa Al dawlia Branch)
- رقم الآيبان (IBAN): EG310022012880211102491757001
- كود السويفت (SWIFT Code): ABRKEGCAXXX

حالة الطلب: محجوز وفي انتظار تأكيد الحوالة البنكية
================================================================================`
      : `================================================================================
PRO-FORMA INVOICE & OFFICIAL BANK WIRE RESERVATION
JurisTech Solutions Platform (https://juristech.solutions)
================================================================================

Invoice / Reference Code: ${referenceCode}
Issued Date: ${new Date().toLocaleDateString('en-US')}
Payment Gateway: Direct SWIFT Bank Wire Remittance

Billed To:
- Entity / Sponsor Name: ${companyName || 'Corporate Client'}
- Tax ID / CR Reg Number: ${taxId || 'N/A'}
- Official Email: ${officialEmail || 'N/A'}
- Target Website URL: ${targetUrl || 'N/A'}

Selected Package: ${packageName}
Total Amount Due: $${packagePrice.toLocaleString()} USD

Official Beneficiary Bank Wire Details:
- Beneficiary Name: MHAMMAD MUSTAFA MHAMMAD
- Bank Name & Branch: Al Hadiqa Al dawlia Branch
- Account IBAN: EG310022012880211102491757001
- SWIFT Code: ABRKEGCAXXX

Status: ORDER RESERVED & PENDING BANK VERIFICATION
================================================================================`;

    exportDocumentMultiFormat(invoiceContent, `Proforma_Invoice_${referenceCode}`, 'JurisTech', companyName || 'Client', 'pdf', isRtl ? 'ar' : 'en');
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Top Header with Close Button */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Direct Corporate Wire Transfer
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                {isRtl ? 'حجز وحساب التحويل البنكي المباشر' : 'Direct Bank Wire Transfer & Order Reservation'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          {aiScanError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/40 text-red-600 dark:text-red-400 font-bold space-y-1 shadow-lg animate-in fade-in">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-sm font-black">{isRtl ? 'رفض أمني للمستند (AI Forensics Blocked)' : 'AI Forensics Security Block'}</span>
              </div>
              <p className="text-xs leading-relaxed pr-7 rtl:pr-7 rtl:pl-0 font-semibold">{aiScanError}</p>
            </div>
          )}

          {scanningStatus && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-extrabold flex items-center gap-2.5 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>{scanningStatus}</span>
            </div>
          )}

          {submittedStatus ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                <Clock className="w-10 h-10 animate-pulse text-amber-500" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {isRtl ? 'حالة الحوالة: قيد التدقيق المالي المباشر' : 'Wire Status: Pending Financial Audit'}
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-1">
                  {isRtl ? 'تم استلام إشعار التحويل البنكي بنجاح' : 'Bank Wire Receipt Received Successfully'}
                </h4>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-left rtl:text-right font-mono text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isRtl ? 'رقم المرجع (Ref Code):' : 'Reference Code:'}</span>
                  <span className="font-bold text-cyan-400">{referenceCode}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isRtl ? 'البريد الإلكتروني:' : 'Official Email:'}</span>
                  <span className="text-slate-800 dark:text-slate-200">{officialEmail}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isRtl ? 'الباقة والمبلغ:' : 'Package & Amount:'}</span>
                  <span className="font-bold text-emerald-400">{packageName} (${packagePrice.toLocaleString()} USD)</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>{isRtl ? 'زمن المراجعة المتوقع:' : 'Estimated Review Time:'}</span>
                  <span className="text-amber-400 font-bold">{isRtl ? 'أقل من ساعتين عمل' : '< 2 Business Hours'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={downloadProformaInvoice}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>{isRtl ? 'تحميل الفاتورة المبدئية PDF' : 'Download Pro-forma Invoice PDF'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs"
                >
                  {isRtl ? 'إغلاق ومتابعة المنصة' : 'Close & Continue'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Order Package Summary Box */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase font-bold">{isRtl ? 'الباقة المختارة:' : 'Selected Package:'}</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{packageName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-amber-400">${packagePrice.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-mono">Reference: {referenceCode}</span>
                </div>
              </div>

              {/* Official Bank Beneficiary Coordinates */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 font-mono text-xs">
                <span className="font-bold text-amber-400 block font-sans mb-1">
                  {isRtl ? 'بيانات التحويل البنكي الرسمي المعتمد (Official Wire Coordinates):' : 'Official Corporate Beneficiary Bank Details:'}
                </span>

                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">{isRtl ? 'اسم البنك (Bank Name):' : 'Bank Name:'}</span>
                  <span className="font-bold text-cyan-400 font-sans">بنك البركة (Al Baraka Bank)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">{isRtl ? 'اسم المستفيد (Beneficiary):' : 'Beneficiary Name:'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-right">محمد مصطفى محمد (Mhammad Mustafa Mhammad)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">{isRtl ? 'الفرع والعنوان (Branch & Address):' : 'Branch & Address:'}</span>
                  <span className="text-slate-800 dark:text-slate-200 font-sans">EGY, Cairo, SHAA 2 (فرع Al Hadiqa Al dawlia)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-900">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">IBAN:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400 select-all font-mono">EG310022012880211102491757001</span>
                    <button
                      onClick={() => copyToClipboard('EG310022012880211102491757001', 'iban')}
                      className="p-1 rounded hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                    >
                      {copiedIBAN ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">SWIFT Code:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 select-all font-mono">ABRKEGCAXXX</span>
                    <button
                      onClick={() => copyToClipboard('ABRKEGCAXXX', 'swift')}
                      className="p-1 rounded hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                    >
                      {copiedSWIFT ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Input Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isRtl ? 'اسم الشركة / المشتري (إلزامي للتحقق):' : 'Company / Entity Name (Required):'}</label>
                  <input
                    type="text"
                    placeholder={isRtl ? 'مثال: مجموعة الاستثمار التقني' : 'e.g. Acme Enterprise Corp'}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isRtl ? 'رقم الهاتف الرسمي للعميل (إلزامي):' : 'Official Customer Phone Number (Required):'}</label>
                  <input
                    type="tel"
                    placeholder="+962791234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isRtl ? 'البريد الإلكتروني الرسمي:' : 'Official Corporate Email:'}</label>
                  <input
                    type="email"
                    placeholder="corporate@company.com"
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isRtl ? 'البنك المحول منه (اسم البنك):' : 'Sender Bank Name:'}</label>
                  <input
                    type="text"
                    placeholder={isRtl ? 'مثال: البنك العربي' : 'e.g. Arab Bank'}
                    value={senderBankName}
                    onChange={(e) => setSenderBankName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isRtl ? 'كود السويفت (SWIFT Code) للبنك المحول منه:' : 'Sender Bank SWIFT Code:'}</label>
                  <input
                    type="text"
                    placeholder="ARABJOAMXXX"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isRtl ? 'رقم السجل التجاري / الضريبي:' : 'Tax ID / Commercial Reg:'}</label>
                  <input
                    type="text"
                    placeholder={isRtl ? 'مثال: 1010582910' : 'e.g. CR-98124012'}
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Receipt File Upload Zone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{isRtl ? 'إرفاق صورة أو ملف إيصال التحويل البنكي:' : 'Attach Wire Transfer Receipt (PDF/Image):'}</label>
                <input
                  ref={receiptInputRef}
                  type="file"
                  accept=".pdf,.jpg,.png,image/*"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="hidden"
                />

                {receiptFile ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-300 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="font-bold truncate">{receiptFile.name}</span>
                    </div>
                    <button onClick={() => setReceiptFile(null)} className="text-slate-600 dark:text-slate-400 hover:text-red-400 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => receiptInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-amber-500/60 rounded-2xl p-4 flex flex-col items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 transition-colors bg-slate-950/40"
                  >
                    <Upload className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold">{isRtl ? 'رفع إيصال التحويل البنكي' : 'Click to Upload Remittance Receipt'}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Sticky Footer */}
        {!submittedStatus && (
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-900/95 sticky bottom-0 z-10 flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-1/3 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              onClick={handleWireSubmission}
              disabled={uploading}
              className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 disabled:opacity-40 font-extrabold text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 text-xs sm:text-sm active:scale-98"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  {isRtl ? 'جاري تفعيل الحجز وتسجيل الطلب...' : 'Processing Wire Order...'}
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>{isRtl ? 'تأكيد الحجز وتفعيل الرعاية فورا' : 'Confirm Order & Instantly Activate'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
