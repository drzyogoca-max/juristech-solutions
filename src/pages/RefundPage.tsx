/**
 * src/pages/RefundPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JURISTECH — Official Refund Policy
 * Last Updated: August 25, 2026
 * 10 sections — bilingual EN / AR — Production Ready for Merchant Verification.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  RotateCcw, CreditCard, XCircle, CheckCircle, AlertTriangle,
  Shield, Clock, Mail, FileText
} from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const SUPPORT_EMAIL = 'juristech.solutions@outlook.com';
const LAST_UPDATED = 'August 25, 2026';

const ACCENT_BORDER: Record<string, string> = {
  blue: 'border-blue-500/30 bg-blue-500/5',
  emerald: 'border-emerald-500/30 bg-emerald-500/5',
  amber: 'border-amber-500/30 bg-amber-500/5',
  orange: 'border-orange-500/30 bg-orange-500/5',
  purple: 'border-purple-500/30 bg-purple-500/5',
  cyan: 'border-cyan-500/30 bg-cyan-500/5',
  sky: 'border-sky-500/30 bg-sky-500/5',
  red: 'border-red-500/30 bg-red-500/5',
  teal: 'border-teal-500/30 bg-teal-500/5',
  indigo: 'border-indigo-500/30 bg-indigo-500/5',
};

const ACCENT_TEXT: Record<string, string> = {
  blue: 'text-blue-400', emerald: 'text-emerald-400', amber: 'text-amber-400',
  orange: 'text-orange-400', purple: 'text-purple-400', cyan: 'text-cyan-400',
  sky: 'text-sky-400', red: 'text-red-400', teal: 'text-teal-400', indigo: 'text-indigo-400',
};

interface Sec {
  num: number;
  icon: React.ReactNode;
  accent: string;
  enTitle: string;
  arTitle: string;
  enBody: React.ReactNode;
  arBody: React.ReactNode;
}

export default function RefundPage() {
  const { i18n } = useTranslation();
  const ar = i18n.language === 'ar';

  const sections: Sec[] = [
    {
      num: 1, icon: <FileText className="w-5 h-5" />, accent: 'blue',
      enTitle: 'Subscriptions', arTitle: 'الاشتراكات',
      enBody: (
        <div className="space-y-2">
          <p>JURISTECH offers subscription-based digital software services. Available plans and prices are displayed at: <Link to="/pricing" className="text-sky-400 hover:text-sky-300">https://juristech.solutions/pricing</Link></p>
          <p className="text-slate-400 text-sm">Subscription billing may be processed by a third-party payment provider.</p>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>تقدم جوريستك خدمات برمجية رقمية قائمة على الاشتراك. الخطط المتاحة والأسعار معروضة على: <Link to="/pricing" className="text-sky-400 hover:text-sky-300">https://juristech.solutions/pricing</Link></p>
          <p className="text-slate-400 text-sm">قد تتم معالجة فوترة الاشتراك من قبل مزود دفع تابع لجهة خارجية.</p>
        </div>
      ),
    },
    {
      num: 2, icon: <XCircle className="w-5 h-5" />, accent: 'orange',
      enTitle: 'Cancellation', arTitle: 'الإلغاء',
      enBody: (
        <div className="space-y-2">
          <p>Customers may cancel their subscription using the available cancellation mechanism provided through JURISTECH or the applicable payment provider.</p>
          <p className="text-slate-400 text-sm">Unless otherwise required by applicable law, cancelling a subscription does not automatically create a refund for a period that has already been paid for. Where cancellation is scheduled for the end of a billing period, access may continue until the end of that period.</p>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>يجوز للعملاء إلغاء اشتراكهم باستخدام آلية الإلغاء المتاحة المقدمة من خلال جوريستك أو مزود الدفع المعمول به.</p>
          <p className="text-slate-400 text-sm">ما لم ينص القانون المعمول به على خلاف ذلك، فإن إلغاء الاشتراك لا ينشئ تلقائياً استرداداً للمبلغ عن فترة تم دفع ثمنها بالفعل. عندما تتم جدولة الإلغاء لنهاية فترة الفوترة، قد يستمر الوصول حتى نهاية تلك الفترة.</p>
        </div>
      ),
    },
    {
      num: 3, icon: <RotateCcw className="w-5 h-5" />, accent: 'emerald',
      enTitle: 'Refund Requests', arTitle: 'طلبات الاسترداد',
      enBody: (
        <div className="space-y-3">
          <p>Customers may contact JURISTECH to request a refund. Refund requests should include:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>customer name;</li>
            <li>account email address;</li>
            <li>relevant subscription or transaction information;</li>
            <li>reason for the request.</li>
          </ul>
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sm text-slate-300 space-y-1">
            <div>Submit to: <a href={`mailto:${SUPPORT_EMAIL}?subject=Refund Request`} className="text-sky-400 hover:text-sky-300 font-bold">{SUPPORT_EMAIL}</a></div>
            <div className="text-slate-400 text-xs">Subject: <span className="font-mono text-sky-300">"Refund Request"</span></div>
          </div>
        </div>
      ),
      arBody: (
        <div className="space-y-3">
          <p>يمكن للعملاء التواصل مع جوريستك لطلب استرداد الأموال. يجب أن تتضمن طلبات الاسترداد:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>اسم العميل؛</li>
            <li>عنوان البريد الإلكتروني للحساب؛</li>
            <li>معلومات الاشتراك أو المعاملة ذات الصلة؛</li>
            <li>سبب الطلب.</li>
          </ul>
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sm text-slate-300 space-y-1">
            <div>إرسال إلى: <a href={`mailto:${SUPPORT_EMAIL}?subject=Refund Request`} className="text-sky-400 hover:text-sky-300 font-bold">{SUPPORT_EMAIL}</a></div>
            <div className="text-slate-400 text-xs">الموضوع: <span className="font-mono text-sky-300">"Refund Request"</span></div>
          </div>
        </div>
      ),
    },
    {
      num: 4, icon: <CheckCircle className="w-5 h-5" />, accent: 'purple',
      enTitle: 'Refund Eligibility', arTitle: 'أهلية الاسترداد',
      enBody: (
        <div className="space-y-2">
          <p>Refunds may be considered on a case-by-case basis, subject to:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>applicable law;</li>
            <li>the circumstances of the transaction;</li>
            <li>whether the service has been materially used;</li>
            <li>duplicate or erroneous charges;</li>
            <li>payment-provider rules;</li>
            <li>any applicable statutory consumer rights.</li>
          </ul>
          <p className="text-slate-400 text-sm">Nothing in this policy limits mandatory consumer rights that cannot lawfully be excluded.</p>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>قد يتم النظر في استرداد المبالغ على أساس كل حالة على حدة، رهناً بما يلي:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>القانون المعمول به؛</li>
            <li>ظروف المعاملة؛</li>
            <li>ما إذا كانت الخدمة قد استخدمت بشكل جوهري؛</li>
            <li>الرسوم المكررة أو الخاطئة؛</li>
            <li>قواعد مزود الدفع؛</li>
            <li>أي حقوق قانونية معمول بها للمستهلك.</li>
          </ul>
          <p className="text-slate-400 text-sm">لا شيء في هذه السياسة يحد من حقوق المستهلك الإلزامية التي لا يمكن استبعادها قانوناً.</p>
        </div>
      ),
    },
    {
      num: 5, icon: <AlertTriangle className="w-5 h-5" />, accent: 'amber',
      enTitle: 'Duplicate or Erroneous Charges', arTitle: 'الرسوم المكررة أو الخاطئة',
      enBody: <p>If you believe you were charged more than once for the same subscription or were charged due to an apparent billing error, contact us promptly. We will review the transaction and, where appropriate, arrange correction or refund through the applicable payment process.</p>,
      arBody: <p>إذا كنت تعتقد أنه تم تحصيل رسوم منك أكثر من مرة مقابل نفس الاشتراك أو تم تحصيل رسوم منك بسبب خطأ واضح في الفوترة، فاتصل بنا على الفور. سنراجع المعاملة ونقوم، عند الاقتضاء، بترتيب التصحيح أو الاسترداد من خلال عملية الدفع المعمول بها.</p>,
    },
    {
      num: 6, icon: <Shield className="w-5 h-5" />, accent: 'cyan',
      enTitle: 'Refunds Following Service Issues', arTitle: 'الاسترداد بعد مشكلات الخدمة',
      enBody: <p>If a material technical problem prevents access to a paid service, please contact support with details of the issue. We may investigate the incident and, where appropriate, provide a service credit, partial refund, or other reasonable resolution.</p>,
      arBody: <p>إذا منعت مشكلة فنية جوهرية الوصول إلى خدمة مدفوعة، يرجى الاتصال بالدعم مع تفاصيل المشكلة. يجوز لنا التحقيق في الحادث وتقديم رصيد خدمة أو استرداد جزئي أو حل معقول آخر عند الاقتضاء.</p>,
    },
    {
      num: 7, icon: <CreditCard className="w-5 h-5" />, accent: 'indigo',
      enTitle: 'Payment-Provider Processing', arTitle: 'معالجة مزود الدفع',
      enBody: <p>Where a third-party payment provider processes the transaction, refunds may be processed through that provider. The payment provider may also apply its own operational requirements and processing timelines.</p>,
      arBody: <p>عندما يعالج مزود دفع تابع لجهة خارجية المعاملة، قد تتم معالجة عمليات الاسترداد من خلال ذلك المزود. قد يطبق مزود الدفع أيضاً متطلباته التشغيلية والجداول الزمنية للمعالجة الخاصة به.</p>,
    },
    {
      num: 8, icon: <Clock className="w-5 h-5" />, accent: 'teal',
      enTitle: 'Refund Processing Time', arTitle: 'وقت معالجة الاسترداد',
      enBody: <p>Approved refunds are generally returned through the original payment method. The time required for the refund to appear in the customer's account may depend on the payment provider and the customer's financial institution.</p>,
      arBody: <p>يتم إرجاع المبالغ المستردة المعتمدة عموماً من خلال طريقة الدفع الأصلية. قد يعتمد الوقت اللازم لظهور المبلغ المسترد في حساب العميل على مزود الدفع والمؤسسة المالية للعميل.</p>,
    },
    {
      num: 9, icon: <AlertTriangle className="w-5 h-5" />, accent: 'red',
      enTitle: 'Fraudulent or Unauthorized Transactions', arTitle: 'المعاملات الاحتيالية أو غير المصرح بها',
      enBody: <p>If you believe a transaction was unauthorized, contact us immediately. We may request information necessary to investigate the transaction and may coordinate with the relevant payment provider.</p>,
      arBody: <p>إذا كنت تعتقد أن هناك معاملة غير مصرح بها، فاتصل بنا على الفور. قد نطلب المعلومات اللازمة للتحقيق في المعاملة وقد ننسق مع مزود الدفع المعني.</p>,
    },
    {
      num: 10, icon: <Mail className="w-5 h-5" />, accent: 'sky',
      enTitle: 'Contact', arTitle: 'التواصل',
      enBody: (
        <div className="space-y-3">
          <p>Refund and billing questions:</p>
          <div className="space-y-1 text-sm text-slate-300">
            <div className="font-bold text-white">JURISTECH</div>
            <div>Website: <a href="https://juristech.solutions" className="text-sky-400 hover:text-sky-300">https://juristech.solutions</a></div>
            <div>Email: <a href={`mailto:${SUPPORT_EMAIL}?subject=Refund Request`} className="text-sky-400 hover:text-sky-300">{SUPPORT_EMAIL}</a></div>
            <div className="text-slate-400">Subject line: <span className="font-mono text-sky-300">"Refund Request"</span></div>
          </div>
          <p className="text-slate-400 text-sm">We aim to review refund requests promptly and fairly, subject to applicable law and the terms governing the relevant transaction.</p>
        </div>
      ),
      arBody: (
        <div className="space-y-3">
          <p>أسئلة الاسترداد والفوترة:</p>
          <div className="space-y-1 text-sm text-slate-300">
            <div className="font-bold text-white">JURISTECH</div>
            <div>الموقع: <a href="https://juristech.solutions" className="text-sky-400 hover:text-sky-300">https://juristech.solutions</a></div>
            <div>البريد: <a href={`mailto:${SUPPORT_EMAIL}?subject=Refund Request`} className="text-sky-400 hover:text-sky-300">{SUPPORT_EMAIL}</a></div>
            <div className="text-slate-400">سطر الموضوع: <span className="font-mono text-sky-300">"Refund Request"</span></div>
          </div>
          <p className="text-slate-400 text-sm">نحن نهدف إلى مراجعة طلبات الاسترداد على الفور وبإنصاف، وفقاً للقانون المعمول به والشروط التي تحكم المعاملة ذات الصلة.</p>
        </div>
      ),
    },
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 ${ar ? 'rtl' : 'ltr'}`}>
      <SEO
        title={`${ar ? 'سياسة الاسترداد' : 'Refund Policy'} | JURISTECH`}
        description={ar ? 'سياسة الاسترداد الرسمية لمنصة JURISTECH — آخر تحديث: أغسطس 2026' : 'Official Refund Policy for JURISTECH — Last Updated: August 25, 2026'}
      />
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 text-emerald-400">
            <RotateCcw className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {ar ? 'سياسة الاسترداد' : 'Refund Policy'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {ar ? 'كيفية التعامل مع عمليات استرداد المبالغ وإلغاء الاشتراكات في جوريستك.' : 'How refunds and subscription cancellations are handled for JURISTECH paid software subscriptions.'}
          </p>
          <p className="text-xs text-slate-500 font-mono">{ar ? 'آخر تحديث:' : 'Last Updated:'} {LAST_UPDATED}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            {[
              { to: '/pricing', label: ar ? 'الأسعار' : 'Pricing', active: false },
              { to: '/terms', label: ar ? 'شروط الخدمة' : 'Terms of Service', active: false },
              { to: '/privacy', label: ar ? 'سياسة الخصوصية' : 'Privacy Policy', active: false },
              { to: '/refund', label: ar ? 'سياسة الاسترداد' : 'Refund Policy', active: true },
            ].map(({ to, label, active }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  active ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <div key={s.num} className={`rounded-2xl border p-6 sm:p-8 space-y-4 ${ACCENT_BORDER[s.accent] ?? 'border-slate-800 bg-slate-900/40'}`}>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-3">
                <span className={`flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700 shrink-0 ${ACCENT_TEXT[s.accent] ?? 'text-slate-400'}`}>
                  {s.icon}
                </span>
                <span>{s.num}. {ar ? s.arTitle : s.enTitle}</span>
              </h2>
              <div className="text-sm leading-relaxed text-slate-300">
                {ar ? s.arBody : s.enBody}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <Link to="/pricing" className="hover:text-slate-300">{ar ? 'الأسعار' : 'Pricing'}</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-slate-300">{ar ? 'شروط الخدمة' : 'Terms of Service'}</Link>
            <span>·</span>
            <Link to="/privacy" className="hover:text-slate-300">{ar ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
            <span>·</span>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-slate-300">{SUPPORT_EMAIL}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
