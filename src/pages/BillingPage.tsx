/**
 * src/pages/BillingPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Account Billing & Subscription Management
 * Route: /billing
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, Crown, Calendar, ShieldCheck, AlertCircle, RefreshCw,
  XCircle, CheckCircle2, FileText, Download, Zap, ExternalLink, Sparkles,
  ArrowRight, Shield, Lock, LogIn, User, Loader2
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';
import { BillingTransaction } from '../lib/financialGateway';
import DigitalInvoiceModal from '../components/DigitalInvoiceModal';
import CustomerAuthModal from '../components/CustomerAuthModal';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';

export interface UserReceipt {
  id: string;
  transaction_ref: string;
  claimed_amount: number;
  claimed_date: string;
  plan_id: string;
  plan_name: string;
  status: string;
  created_at: string;
}

export const TIER_PRICING: Record<string, { amount: number; formatted: string; periodEn: string; periodAr: string }> = {
  Startup: { amount: 49, formatted: '$49.00', periodEn: '/ mo', periodAr: '/ شهرياً' },
  SMEs: { amount: 139, formatted: '$139.00', periodEn: '/ mo', periodAr: '/ شهرياً' },
  Enterprise: { amount: 349, formatted: '$349.00', periodEn: '/ mo', periodAr: '/ شهرياً' },
  Pro: { amount: 99, formatted: '$99.00', periodEn: '/ mo', periodAr: '/ شهرياً' },
  'Free Trial': { amount: 0, formatted: '$0.00', periodEn: '(Free Trial)', periodAr: '(تجربة مجانية)' },
};

export const TIER_ENTITLEMENTS: Record<string, { en: string[]; ar: string[] }> = {
  Startup: {
    en: [
      'Google Gemini Pro Sovereign Legal Advisor (7 Languages)',
      'Up to 10 Contract Ingestions / month (PDF, Word, TXT)',
      'Standard Statutory Risk & Penalty Detection',
      'Certified PDF & Word (.docx) Document Export',
      'DealShield 360™: 3 Enterprise Need Diagnostics / month',
      'Regional Coverage (Saudi Arabia, UAE, Egypt, Jordan)',
      'Standard AES-256 Cryptographic Cloud Vault',
    ],
    ar: [
      'المستشار القانوني السيادي مدعوم بـ Google Gemini Pro (7 لغات)',
      'رفع وتفريغ حتى 10 عقود شهرياً (PDF, Word, TXT)',
      'كشف المخاطر التشريعية والشروط الجزائية الأساسية',
      'تصدير معتمد بصيغ PDF و Word (.docx) بالختم الرسمي',
      'DealShield 360™: 3 فحوصات تشخيصية لاحتياجات الشركة شهرياً',
      'تغطية تشريعية إقليمية (السعودية، الإمارات، مصر، الأردن)',
      'خزنة سحابية مؤمنة بتشفير AES-256 قياسي',
    ],
  },
  SMEs: {
    en: [
      'Everything in Startup Plan',
      'Google AI Pro Sovereign Core (Gemini Ultra Deep Reasoning)',
      'Cross-Border Deal Simulator (15 Simulations / month)',
      'Harmonized Bridging Clauses for Multi-Jurisdiction Contracts',
      'Autonomous AI Negotiation Agents & Tactical Redlines',
      'Virtual Courtroom Simulation & Win Probability Forecasting',
      'Up to 50 Contract Audits & Multi-Format Ingestions / month',
      'Comprehensive 9-Jurisdiction Statutory Coverage',
      'Two-Factor Authentication (2FA TOTP) + TLS 1.3 Security',
    ],
    ar: [
      'كل مزايا باقة الشركات الصغرى والناشئة',
      'محرك Google AI Pro السيادي (تفكير فائق وتحليل عميق بالذكاء الاصطناعي)',
      'محاكي الصفقات العابرة للحدود (15 محاكاة نزاع وازدواج قضائي شهرياً)',
      'توليد بنود التجسير المنسجمة (Harmonized Bridging Clauses)',
      'وكلاء التفاوض الآلي وخطوط التعديل التكتيكية (Tactical Redlines)',
      'محاكاة جلسات المرافعة وتوقع نسب كسب القضايا والتحكيم التجاري',
      'تدقيق وتفريغ حتى 50 عقداً شهرياً بجميع الصيغ',
      'تغطية تشريعية كاملة لـ 9 ولايات قضائية',
      'مصادقة ثنائية مشفرة (2FA TOTP) وأمان TLS 1.3 فائق الأمان',
    ],
  },
  Enterprise: {
    en: [
      'Everything in SMEs & Growth Plan',
      'Unlimited DealShield 360™ Simulations (Up to 5 Jurisdictions)',
      'Unlimited Predictive M&A Intelligence & Deal EBITDA Valuations',
      'Forensic Stylometric Fraud, Forgery & Tampering Detection',
      'Cross-Border Statutory Compliance (PDPL, GDPR, EU AI Act, FATF)',
      'Unlimited Contract Audits & Instant Gap Identification',
      'Multi-User Departmental Access & Role-Based Control (RBAC)',
      'End-to-End Encrypted Sovereign Vault with Digital Timestamps',
      'Dedicated 24/7 Enterprise Technical Support Priority Access',
    ],
    ar: [
      'كل مزايا حزمة الشركات المتوسطة والنمو',
      'محاكاة صفقات دولية غير محدودة عبر DealShield (حتى 5 ولايات قضائية معاً)',
      'الاستحواذ والاندماج التنبؤي غير المحدود وتقييم صفقات الـ M&A و EBITDA',
      'كشف التزوير والاحتيال والتحريف بالقياس النصي الحيوي (Forensic Stylometry)',
      'الامتثال التشريعي العابر للحدود (PDPL, GDPR, EU AI Act, FATF AML)',
      'تدقيق وتوليد عقود غير محدود مع رصد فوري للثغرات الصامتة',
      'إدارة متعددة المستخدمين وأدوار الصلاحيات المتقدمة (RBAC)',
      'خزنة سحابية سيادية بتشفير طرفي E2EE وطوابع زمنية رقمية معتمدة',
      'دعم فني مخصص 24/7 لتشغيل المنظومة وأتمتة العقود',
    ],
  },
  Pro: {
    en: [
      'Everything in Startup Plan',
      'Advanced Contract Risk Scanning & Analysis',
      'Multi-Format Document Export (PDF, Word, TXT)',
      'Direct Technical Support Access',
    ],
    ar: [
      'كل مزايا باقة الشركات الصغرى والناشئة',
      'تدقيق وتحليل متقدم لمخاطر العقود',
      'تصدير المستندات بصيغ متعددة',
      'دعم فني مباشر ومخصص',
    ],
  },
  'Free Trial': {
    en: [
      'Basic AI Legal Consultation (5 inquiries / day)',
      'Standard Contract Risk Diagnostic Preview (2 total drafts)',
      'Standard Legal Notice & Disclaimer Watermark',
      'Public Regulatory Framework Exploration',
    ],
    ar: [
      'استشارات قانونية بالذكاء الاصطناعي (5 استفسارات يومياً)',
      'معاينة وتوليد العقود الأساسية (عقدين تجريبيين مدى الحياة)',
      'علامة مائية معتمدة على الوثائق التجريبية',
      'استكشاف الأطر التنظيمية والتشريعية العامة',
    ],
  },
};

export function receiptToTransaction(receipt: UserReceipt, userEmail: string, userName: string): BillingTransaction {
  return {
    id: receipt.id,
    invoiceId: `RCP-${receipt.transaction_ref || receipt.id.substring(0, 8).toUpperCase()}`,
    userEmail: userEmail,
    userName: userName || userEmail.split('@')[0] || 'Customer',
    planId: (receipt.plan_id?.toLowerCase() || 'startup') as any,
    planName: receipt.plan_name || 'Legal AI Retainer',
    amountUSD: Number(receipt.claimed_amount) || 0,
    paymentMethod: 'Bank Wire SWIFT',
    status: receipt.status === 'verified' ? 'Paid' : (receipt.status === 'pending' ? 'Pending' : 'Completed'),
    createdAt: receipt.created_at || new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    sha256Hash: receipt.id,
  };
}

export default function BillingPage() {
  const { isSubscriber, tier, status, daysLeft, startDate, endDate, paymentMethod, cancelSubscription, refresh } = useSubscription();
  const { user, loading: authLoading } = useAuth();
  const { l, isRtl } = usePlatformLocale();
  const navigate = useNavigate();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<BillingTransaction | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Real Database-Backed Receipts State
  const [receipts, setReceipts] = useState<UserReceipt[]>([]);
  const [receiptsLoading, setReceiptsLoading] = useState(true);
  const [receiptsError, setReceiptsError] = useState<string | null>(null);

  const fetchReceipts = useCallback(async () => {
    if (!user?.id) {
      setReceipts([]);
      setReceiptsLoading(false);
      return;
    }
    setReceiptsLoading(true);
    setReceiptsError(null);
    try {
      const { data, error } = await supabase
        .from('payment_receipts')
        .select('id, transaction_ref, claimed_amount, claimed_date, plan_id, plan_name, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[BillingPage] Error fetching receipts:', error.message);
        setReceiptsError(error.message);
        setReceipts([]);
      } else {
        setReceipts((data as UserReceipt[]) || []);
      }
    } catch (err: any) {
      console.warn('[BillingPage] Unexpected error fetching receipts:', err);
      setReceiptsError(err?.message || 'Failed to fetch receipts');
      setReceipts([]);
    } finally {
      setReceiptsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchReceipts();
    } else {
      setReceipts([]);
      setReceiptsLoading(false);
    }
  }, [user?.id, fetchReceipts]);

  const handleSubscribe = () => {
    navigate('/pricing');
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelSubscription();
      setCancelModalOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  const isCancelled = status === 'Cancelled';
  const planPricing = TIER_PRICING[tier] || TIER_PRICING['Free Trial'];
  const entitlements = (TIER_ENTITLEMENTS[tier] || TIER_ENTITLEMENTS['Free Trial'])[isRtl ? 'ar' : 'en'];

  const getStatusBadge = (rcpStatus: string) => {
    switch (rcpStatus?.toLowerCase()) {
      case 'verified':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            {l('موثق ومقبول', 'Verified')}
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
            {l('قيد المراجعة', 'Pending Review')}
          </span>
        );
      case 'flagged':
        return (
          <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold">
            {l('مراجعة إضافية', 'Needs Audit')}
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
            {l('مرفوض', 'Rejected')}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold">
            {rcpStatus}
          </span>
        );
    }
  };

  // ── 1. Loading State ──
  if (authLoading) {
    return (
      <div className={`min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center ${isRtl ? 'rtl' : 'ltr'}`}>
        <div className="flex flex-col items-center gap-4 text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs text-slate-400">{l('جاري التحقق من جلسة الحساب...', 'Verifying account session...')}</p>
        </div>
      </div>
    );
  }

  // ── 2. Strict Auth Gate for Unauthenticated Visitors ──
  if (!user) {
    return (
      <div className={`min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 ${isRtl ? 'rtl' : 'ltr'}`}>
        <SEO
          title={`${isRtl ? 'تسجيل الدخول إلى بوابة الفوترة' : 'Customer Portal Login'} | JURISTECH`}
          description="Sign in to access your JURISTECH customer billing portal, subscription details, and verified receipts."
        />

        {showAuthModal && (
          <CustomerAuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode="login"
          />
        )}

        <div className="max-w-md mx-auto pt-16 space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{l('بوابة العميل والفوترة الرسمية', 'Official Customer Portal')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {l('تسجيل الدخول مطلوب للوصول إلى البوابة', 'Customer Sign-In Required')}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              {l(
                'للاطلاع على تفاصيل اشتراكك، إيصالات السداد المعتمدة، وإدارة الحساب، يرجى تسجيل الدخول أو إنشاء حساب عميل جديد.',
                'To view your active subscription, verified cryptographic payment receipts, and manage your account, please sign in or register.'
              )}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-2xl">
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>{l('تسجيل الدخول / إنشاء حساب', 'Sign In / Register')}</span>
            </button>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <Link to="/pricing" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                <span>{l('استعراض الباقات والأسعار', 'View Pricing & Plans')}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link to="/support" className="hover:text-cyan-300 transition-colors">
                {l('المساعدة والدعم', 'Support')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 3. Authenticated Customer Self-Service Portal ──

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={`${isRtl ? 'إدارة الاشتراك والفوترة' : 'Billing & Subscription'} | JURISTECH`}
        description="Manage your JURISTECH sovereign AI subscription, billing details, and invoices."
      />

      {/* Invoice Modal */}
      {activeInvoice && (
        <DigitalInvoiceModal
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
          transaction={activeInvoice}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-white">
                {l('تأكيد إلغاء التجديد التلقائي؟', 'Confirm Subscription Cancellation?')}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {l(
                  'سيظل بإمكانك استخدام الميزات المدفوعة حتى نهاية فترة الفوترة الحالية. لن يتم تحصيل أي مبالغ جديدة مستقبلاً.',
                  'Your paid features remain accessible until the end of your billing cycle. No further automatic charges will occur.'
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                {l('التراجع', 'Keep Subscription')}
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold transition-all cursor-pointer"
              >
                {cancelling ? l('جاري الإلغاء...', 'Cancelling...') : l('تأكيد الإلغاء', 'Cancel Now')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{l('بوابة الدفع والفوترة الرسمية', 'Official Merchant Billing Portal')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {l('إدارة الاشتراك والفوترة', 'Account Billing & Subscription')}
            </h1>
            <p className="text-xs text-slate-400">
              {user.email}
            </p>
          </div>

          {/* Secure Portal Indicator */}
          <div className="flex items-center gap-2 p-2 px-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">{l('نظام الفوترة:', 'Billing Engine:')}</span>
            <span className="px-3 py-1 rounded-xl font-bold font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              🔒 TLS 1.3 Verified
            </span>
          </div>
        </div>

        {/* Customer Account Profile Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-cyan-500/10 select-none shrink-0">
                {(user.email?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    {l('حساب عميل موثق', 'Verified Customer')}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                tier === 'Enterprise'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : tier === 'SMEs'
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : tier === 'Startup'
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : tier === 'Pro'
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : status === 'Active'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                {tier === 'Free Trial' ? (status === 'Active' ? l('تجربة مجانية (نشطة)', 'Free Trial (Active)') : l('تجربة مجانية (منتهية)', 'Free Trial (Expired)')) : tier}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block">{l('معرف الحساب (User ID)', 'Account ID (User ID)')}</span>
              <span className="text-slate-300 font-bold truncate block" title={user.id}>{user.id}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block">{l('تاريخ التسجيل', 'Member Since')}</span>
              <span className="text-slate-300 font-bold block">
                {user.created_at ? new Date(user.created_at).toISOString().substring(0, 10) : '—'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block">{l('طريقة تسجيل الدخول', 'Auth Method')}</span>
              <span className="text-cyan-400 font-bold block">
                {user.app_metadata?.provider ? String(user.app_metadata.provider).toUpperCase() : 'EMAIL / PASSWORD'}
              </span>
            </div>
          </div>
        </div>

        {/* Current Plan Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                    {tier === 'Free Trial' ? l('حالة التقييم التجريبي', 'Evaluation Plan') : l('الخطة الحالية', 'Current Active Plan')}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {tier === 'Free Trial'
                      ? (status === 'Active'
                          ? l('تجربة مجانية — نشطة (تقييم 14 يوماً)', 'Free Trial — Active (14-day evaluation)')
                          : l('انتهت التجربة المجانية', 'Free Trial (Evaluation Expired)'))
                      : `${tier} Legal AI Retainer`}
                  </h3>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                tier === 'Free Trial'
                  ? (status === 'Active'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-500/20 border-red-500/40 text-red-300')
                  : (status === 'Active'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : isCancelled
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-red-500/20 border-red-500/40 text-red-300')
              }`}>
                {tier === 'Free Trial'
                  ? (status === 'Active' ? '● Free Trial — Active' : '● Trial Expired')
                  : (status === 'Active' ? '● Active' : isCancelled ? '● Cancelled' : '● Expired')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 block">{l('قيمة الاشتراك', 'Plan Amount')}</span>
                <span className="font-mono font-bold text-white text-sm">
                  {tier === 'Free Trial' ? (
                    <span className="text-emerald-400 font-mono">{l('0$ (تقييم 14 يوماً)', '$0.00 (14-day evaluation)')}</span>
                  ) : (
                    <>
                      {planPricing.formatted} <span className="text-xs text-slate-400 font-normal">{isRtl ? planPricing.periodAr : planPricing.periodEn}</span>
                    </>
                  )}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">
                  {tier === 'Free Trial' ? l('بداية التقييم', 'Trial Start') : l('تاريخ البدء', 'Start Date')}
                </span>
                <span className="font-mono text-slate-300">{startDate}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">
                  {tier === 'Free Trial' ? l('نهاية التقييم', 'Trial Expiry') : l('تاريخ التجديد', 'Renewal Date')}
                </span>
                <span className={`font-mono font-bold ${tier === 'Free Trial' ? (status === 'Active' ? 'text-amber-300' : 'text-slate-500') : 'text-cyan-400'}`}>
                  {endDate}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">{l('الأيام المتبقية', 'Days Remaining')}</span>
                <span className={`font-mono font-black ${status === 'Active' ? 'text-amber-400' : 'text-red-400'}`}>
                  {daysLeft} {l('يوم', 'days')}
                </span>
              </div>
            </div>

            {/* Gateway & Settlement Details */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Primary Gateway:</span>
                <span className="text-sky-300 font-bold">PayTabs (Under Merchant Review)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Active Direct Settlement:</span>
                <span className="text-slate-300">Bank Wire SWIFT / Binance Pay / InstaPay Egypt</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Payment Channel:</span>
                <span className="text-emerald-400">{paymentMethod || 'Manual Verified Settlement'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!isSubscriber || isCancelled ? (
                <button
                  onClick={handleSubscribe}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {tier === 'Free Trial'
                      ? l('الترقية إلى باقة مدفوعة', 'Upgrade to Paid Plan')
                      : l('تفعيل / تجديد الخطة', 'Subscribe / Upgrade Plan')}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSubscribe}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{l('ترقية الخطة أو تحديث طريقة الدفع', 'Upgrade Plan / Payment Method')}</span>
                  </button>

                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{l('إلغاء التجديد', 'Cancel Subscription')}</span>
                  </button>
                </>
              )}

              <Link
                to="/pricing"
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <span>{l('مقارنة الخطط الكاملة', 'View All Plans')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Guarantee & Support Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-black text-white text-base">
                {l('حماية المعاملات والامتثال المالي', 'Security & Financial Compliance')}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {l(
                  'تُدار جميع العمليات المالية باشتراطات أمان بنكية مشفرة عبر بروتوكول TLS 1.3 مع دعم التحويلات المباشرة (Bank Wire SWIFT، Binance Pay، InstaPay) وبوابة PayTabs للبطاقات الائتمانية قيد المراجعة.',
                  'All digital transactions are protected via TLS 1.3 encryption and institutional verification. Currently supporting direct verified settlements (SWIFT, Binance Pay, InstaPay) with PayTabs card checkout under merchant review.'
                )}
              </p>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{l('تفعيل فوري لكافة محركات الذكاء الاصطناعي', 'Instant access to all Sovereign AI Engines')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{l('إلغاء الاشتراك بنقرة واحدة في أي وقت', 'One-click cancellation anytime')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><Link to="/refund" className="text-sky-400 underline">{l('سياسة استرداد عادلة ومحمية', 'Protected Refund Policy')}</Link></span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              <span>{l('دعم الفوترة والاسترداد:', 'Billing & Refund Support:')} </span>
              <a href="mailto:founder@juristech.solutions" className="text-sky-400 hover:underline">founder@juristech.solutions</a>
            </div>
          </div>
        </div>

        {/* Plan Capabilities & Entitlements Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-black text-white">
                {l(`صلاحيات ومزايا الباقة الحالية (${tier})`, `Current Tier Capabilities & Entitlements (${tier})`)}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {tier === 'Free Trial' ? (status === 'Active' ? 'Free Trial — Active' : 'Trial Expired') : status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {entitlements.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Database-Backed Invoices & Receipts History */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-black text-white">
                {l('سجل إيصالات السداد المعتمدة', 'Verified Payment Receipts & Invoices')}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">RLS Protected • Database-Backed</span>
          </div>

          {receiptsLoading ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-3 text-cyan-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs text-slate-400">{l('جاري تحميل سجل الإيصالات...', 'Loading receipts from database...')}</span>
            </div>
          ) : receiptsError ? (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{receiptsError}</span>
            </div>
          ) : receipts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-300">
                  {l('لا توجد إيصالات سداد مسجلة حتى الآن', 'No Payment Receipts Found')}
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {l(
                    'ستظهر هنا إيصالات التحويل البنكي والمدفوعات فور رفعها واعتمادها عبر بوابة التحقق الرسمية.',
                    'Your verified SWIFT bank transfers, digital receipts, and invoices will be cataloged here once submitted.'
                  )}
                </p>
              </div>
              <div className="pt-1">
                <Link
                  to="/payment"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{l('سداد أو رفع إيصال اشتراك', 'Submit Payment Receipt')}</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-start font-mono">
                    <th className="pb-3 text-start">{l('مرجع الإيصال', 'Receipt Reference')}</th>
                    <th className="pb-3 text-start">{l('الباقة', 'Plan')}</th>
                    <th className="pb-3 text-start">{l('المبلغ', 'Amount')}</th>
                    <th className="pb-3 text-start">{l('التاريخ', 'Date')}</th>
                    <th className="pb-3 text-start">{l('الحالة', 'Status')}</th>
                    <th className="pb-3 text-end">{l('الإجراء', 'Action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {receipts.map((rcp) => (
                    <tr key={rcp.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-bold text-white">
                        <span className="text-cyan-400 font-mono">{rcp.transaction_ref || rcp.id.substring(0, 12)}</span>
                      </td>
                      <td className="py-3 text-slate-300">{rcp.plan_name}</td>
                      <td className="py-3 font-bold text-emerald-400">${Number(rcp.claimed_amount).toFixed(2)}</td>
                      <td className="py-3 text-slate-500">{rcp.claimed_date || rcp.created_at?.substring(0, 10)}</td>
                      <td className="py-3">
                        {getStatusBadge(rcp.status)}
                      </td>
                      <td className="py-3 text-end">
                        <button
                          onClick={() => setActiveInvoice(receiptToTransaction(rcp, user.email || '', user.user_metadata?.full_name || ''))}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-bold flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>{l('عرض الفاتورة', 'Invoice')}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
