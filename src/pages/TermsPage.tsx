/**
 * src/pages/TermsPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JURISTECH — Official Terms of Service
 * Last Updated: August 25, 2026
 * 20 sections — bilingual EN / AR — Production Ready for Merchant Verification.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Scale, ShieldAlert, CreditCard, Tag, XCircle, RotateCcw,
  Ban, Cpu, Lock, Globe, AlertTriangle, RefreshCw, Mail, ShieldCheck,
  FileText, Users, Zap, Server, BookOpen,
} from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const SUPPORT_EMAIL = 'juristech.solutions@outlook.com';
const LAST_UPDATED = 'August 25, 2026';

const ACCENT_BORDER: Record<string, string> = {
  blue: 'border-blue-500/30 bg-blue-500/5',
  amber: 'border-amber-500/30 bg-amber-500/5',
  emerald: 'border-emerald-500/30 bg-emerald-500/5',
  purple: 'border-purple-500/30 bg-purple-500/5',
  cyan: 'border-cyan-500/30 bg-cyan-500/5',
  orange: 'border-orange-500/30 bg-orange-500/5',
  sky: 'border-sky-500/30 bg-sky-500/5',
  red: 'border-red-500/30 bg-red-500/5',
  indigo: 'border-indigo-500/30 bg-indigo-500/5',
  yellow: 'border-yellow-500/30 bg-yellow-500/5',
  teal: 'border-teal-500/30 bg-teal-500/5',
  slate: 'border-slate-600/30 bg-slate-800/20',
};

const ACCENT_TEXT: Record<string, string> = {
  blue: 'text-blue-400', amber: 'text-amber-400', emerald: 'text-emerald-400',
  purple: 'text-purple-400', cyan: 'text-cyan-400', orange: 'text-orange-400',
  sky: 'text-sky-400', red: 'text-red-400', indigo: 'text-indigo-400',
  yellow: 'text-yellow-400', teal: 'text-teal-400', slate: 'text-slate-300',
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

export default function TermsPage() {
  const { i18n } = useTranslation();
  const ar = i18n.language === 'ar';

  const sections: Sec[] = [
    {
      num: 1, icon: <BookOpen className="w-5 h-5" />, accent: 'blue',
      enTitle: 'About JURISTECH', arTitle: 'عن جوريستك',
      enBody: <p>JURISTECH is a software-as-a-service (SaaS) platform providing digital legal technology and business workflow tools. The Service may include AI-assisted legal technology, document intelligence, workflow automation, compliance-related tools, business management functionality, reporting, and related software features.</p>,
      arBody: <p>جوريستك هي منصة برمجيات كخدمة (SaaS) تقدم تقنيات قانونية رقمية وأدوات أتمتة سير العمل التجاري، بما يشمل التقنية القانونية المعززة بالذكاء الاصطناعي، وذكاء المستندات، وأتمتة المهام، وأدوات الامتثال، وإدارة الأعمال، والتقارير.</p>,
    },
    {
      num: 2, icon: <ShieldAlert className="w-5 h-5" />, accent: 'amber',
      enTitle: 'Not Legal Advice', arTitle: 'ليس استشارة قانونية',
      enBody: (
        <div className="space-y-2">
          <p>JURISTECH is a technology platform and does not itself provide legal advice, legal representation, or attorney-client services.</p>
          <p className="text-slate-400">Information, documents, summaries, recommendations, or AI-generated outputs provided through the Service are technology-assisted outputs and should not be treated as a substitute for advice from a qualified lawyer or other appropriately licensed professional. You are responsible for reviewing and independently verifying information before relying on it.</p>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>جوريستك منصة تقنية ولا تقدم استشارات قانونية أو تمثيلاً قانونياً أو خدمات محاماة.</p>
          <p className="text-slate-400">المعلومات والمستندات والملخصات والتوصيات والمخرجات المولّدة بالذكاء الاصطناعي عبر الخدمة هي مخرجات تقنية مساعدة ولا تُعدّ بديلاً عن استشارة محامٍ مرخص أو متخصص معتمد. أنت مسؤول عن مراجعة المعلومات والتحقق منها بصورة مستقلة.</p>
        </div>
      ),
    },
    {
      num: 3, icon: <Users className="w-5 h-5" />, accent: 'emerald',
      enTitle: 'Eligibility and Accounts', arTitle: 'الأهلية والحسابات',
      enBody: (
        <div className="space-y-2">
          <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for activity conducted through your account.</p>
          <p className="text-slate-400">You must not:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>impersonate another person or organization;</li>
            <li>provide false or misleading information;</li>
            <li>attempt to gain unauthorized access to another account;</li>
            <li>interfere with the security or operation of the Service;</li>
            <li>use the Service for unlawful purposes.</li>
          </ul>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>يجب تقديم معلومات دقيقة عند إنشاء الحساب. أنت مسؤول عن سرية بيانات اعتماد حسابك وعن جميع الأنشطة التي تجري من خلاله.</p>
          <p className="text-slate-400">يُحظر عليك:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>انتحال صفة شخص أو منظمة أخرى؛</li>
            <li>تقديم معلومات كاذبة أو مضللة؛</li>
            <li>محاولة الوصول غير المصرح به إلى حساب آخر؛</li>
            <li>التدخل في أمان الخدمة أو تشغيلها؛</li>
            <li>استخدام الخدمة لأغراض غير مشروعة.</li>
          </ul>
        </div>
      ),
    },
    {
      num: 4, icon: <CreditCard className="w-5 h-5" />, accent: 'purple',
      enTitle: 'Subscriptions and Billing', arTitle: 'الاشتراكات والفوترة',
      enBody: (
        <div className="space-y-3">
          <p>Certain features of JURISTECH may require a paid subscription. Available plans, features, billing intervals, and prices are displayed on the JURISTECH pricing page.</p>
          <p className="text-slate-400">Subscription charges are processed through the payment provider presented during checkout. A subscription becomes active only after the payment provider confirms successful payment and JURISTECH server-side systems verify the corresponding subscription status.</p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            ⚠️ A browser redirect, URL parameter, local browser storage value, or client-side state does not by itself create a paid subscription or grant paid access.
          </div>
        </div>
      ),
      arBody: (
        <div className="space-y-3">
          <p>قد تتطلب بعض ميزات جوريستك اشتراكاً مدفوعاً. تُعرض الخطط المتاحة والميزات وفترات الفوترة والأسعار على صفحة التسعير.</p>
          <p className="text-slate-400">تُعالَج رسوم الاشتراك عبر مزود الدفع المقدَّم عند الدفع. يصبح الاشتراك نشطاً فقط بعد أن يؤكد مزود الدفع نجاح الدفع وتتحقق أنظمة الخادم لدى جوريستك من حالة الاشتراك المقابلة.</p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            ⚠️ لا يُنشئ إعادة التوجيه عبر المتصفح أو معامل URL أو قيمة التخزين المحلي أو الحالة من جانب العميل بحد ذاتها اشتراكاً مدفوعاً أو صلاحية وصول مدفوع.
          </div>
        </div>
      ),
    },
    {
      num: 5, icon: <Tag className="w-5 h-5" />, accent: 'cyan',
      enTitle: 'Pricing', arTitle: 'التسعير',
      enBody: <p>Prices displayed on the JURISTECH website are subject to change. Where applicable, the final amount charged to a customer is determined by the applicable checkout and payment-provider configuration. JURISTECH does not rely solely on client-side pricing information to authorize paid access.</p>,
      arBody: <p>الأسعار المعروضة على موقع جوريستك عرضة للتغيير. عند الاقتضاء، يحدد المبلغ النهائي المحصّل من العميل إعداد الدفع ومزود الدفع المعمول به. لا تعتمد جوريستك فقط على معلومات التسعير من جانب العميل للسماح بالوصول المدفوع.</p>,
    },
    {
      num: 6, icon: <XCircle className="w-5 h-5" />, accent: 'orange',
      enTitle: 'Cancellation', arTitle: 'الإلغاء',
      enBody: <p>You may cancel your subscription through the available account or payment-provider cancellation mechanism. Where a subscription is scheduled to cancel at the end of a billing period, access may continue until the end of the applicable paid period unless otherwise stated. After the subscription expires or is cancelled, access to paid features may be disabled.</p>,
      arBody: <p>يمكنك إلغاء اشتراكك من خلال آلية الإلغاء المتاحة في الحساب أو مزود الدفع. عند جدولة الإلغاء في نهاية فترة الفوترة، قد يستمر الوصول حتى نهاية الفترة المدفوعة المعمول بها ما لم يُذكر خلاف ذلك. بعد انتهاء صلاحية الاشتراك أو إلغائه، قد يُعطَّل الوصول إلى الميزات المدفوعة.</p>,
    },
    {
      num: 7, icon: <RotateCcw className="w-5 h-5" />, accent: 'sky',
      enTitle: 'Refunds', arTitle: 'المبالغ المستردة',
      enBody: <p>Refund requests are handled according to the JURISTECH Refund Policy. Please review: <Link to="/refund" className="text-sky-400 hover:text-sky-300 underline underline-offset-2">https://juristech.solutions/refund</Link></p>,
      arBody: <p>تُعالَج طلبات الاسترداد وفق سياسة الاسترداد الخاصة بجوريستك. يرجى مراجعة: <Link to="/refund" className="text-sky-400 hover:text-sky-300 underline underline-offset-2">https://juristech.solutions/refund</Link></p>,
    },
    {
      num: 8, icon: <Ban className="w-5 h-5" />, accent: 'red',
      enTitle: 'Acceptable Use', arTitle: 'الاستخدام المقبول',
      enBody: (
        <div className="space-y-2">
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>conduct unlawful activity;</li>
            <li>violate the rights of others;</li>
            <li>upload malicious code;</li>
            <li>attempt to bypass authentication or access controls;</li>
            <li>interfere with the Service or its infrastructure;</li>
            <li>reverse engineer or circumvent security mechanisms;</li>
            <li>abuse automated systems;</li>
            <li>submit fraudulent payment information;</li>
            <li>use the Service in a manner prohibited by applicable law.</li>
          </ul>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>توافق على عدم استخدام الخدمة من أجل:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>ممارسة أنشطة غير مشروعة؛</li>
            <li>انتهاك حقوق الآخرين؛</li>
            <li>رفع شفرات برمجية ضارة؛</li>
            <li>محاولة تجاوز المصادقة أو ضوابط الوصول؛</li>
            <li>التدخل في الخدمة أو بنيتها التحتية؛</li>
            <li>الهندسة العكسية أو التحايل على آليات الأمان؛</li>
            <li>إساءة استخدام الأنظمة الآلية؛</li>
            <li>تقديم معلومات دفع احتيالية؛</li>
            <li>استخدام الخدمة بأي طريقة يحظرها القانون.</li>
          </ul>
        </div>
      ),
    },
    {
      num: 9, icon: <Lock className="w-5 h-5" />, accent: 'emerald',
      enTitle: 'Intellectual Property', arTitle: 'الملكية الفكرية',
      enBody: <p>The JURISTECH software, interface, branding, design, documentation, and underlying technology are protected by applicable intellectual-property laws. Except for rights expressly granted under these Terms, no ownership rights are transferred to you. You retain ownership of content that you lawfully submit to the Service, subject to the rights necessary for JURISTECH to operate the Service.</p>,
      arBody: <p>تُحمى برامج جوريستك وواجهتها وعلامتها التجارية وتصميمها ووثائقها والتقنية الأساسية بقوانين الملكية الفكرية المعمول بها. لا تُنقل إليك حقوق الملكية إلا ما صرّح به في هذه الشروط. تحتفظ بملكية المحتوى الذي تقدمه بصورة مشروعة إلى الخدمة، مع منح الحقوق اللازمة لتشغيل جوريستك للخدمة.</p>,
    },
    {
      num: 10, icon: <FileText className="w-5 h-5" />, accent: 'indigo',
      enTitle: 'User Content', arTitle: 'محتوى المستخدم',
      enBody: <p>You are responsible for content and information that you submit to the Service. You represent that you have the necessary rights and permissions to submit such content. You grant JURISTECH the limited rights necessary to host, process, transmit, and otherwise use submitted content solely to provide, maintain, secure, and improve the Service, subject to applicable law and our Privacy Policy.</p>,
      arBody: <p>أنت مسؤول عن المحتوى والمعلومات التي تقدمها إلى الخدمة. تُقرّ بامتلاك الحقوق والأذونات اللازمة لتقديم هذا المحتوى. تمنح جوريستك الحقوق المحدودة اللازمة لاستضافة المحتوى المقدَّم ومعالجته ونقله واستخدامه فقط لتقديم الخدمة وصيانتها وتأمينها وتحسينها، وفق القانون المعمول به وسياسة الخصوصية.</p>,
    },
    {
      num: 11, icon: <Cpu className="w-5 h-5" />, accent: 'purple',
      enTitle: 'AI-Generated Output', arTitle: 'المخرجات المولّدة بالذكاء الاصطناعي',
      enBody: <p>Some features may use artificial intelligence or machine-learning technology. AI-generated outputs may contain errors, omissions, or inaccuracies. You are responsible for evaluating outputs before using them in legal, commercial, financial, compliance, or other consequential decisions.</p>,
      arBody: <p>قد تستخدم بعض الميزات تقنيات الذكاء الاصطناعي أو التعلم الآلي. قد تحتوي المخرجات المولّدة بالذكاء الاصطناعي على أخطاء أو سهو أو معلومات غير دقيقة. أنت مسؤول عن تقييم المخرجات قبل استخدامها في القرارات القانونية أو التجارية أو المالية أو الامتثالية أو غيرها من القرارات ذات العواقب.</p>,
    },
    {
      num: 12, icon: <Zap className="w-5 h-5" />, accent: 'yellow',
      enTitle: 'Third-Party Services', arTitle: 'خدمات الطرف الثالث',
      enBody: <p>The Service may integrate with third-party services, including payment processors, analytics providers, hosting providers, authentication services, and other technology providers. Third-party services may be governed by their own terms and privacy policies.</p>,
      arBody: <p>قد تتكامل الخدمة مع خدمات طرف ثالث، بما يشمل معالجات الدفع ومزودي التحليلات ومزودي الاستضافة وخدمات المصادقة وغيرها من مزودي التقنية. قد تخضع خدمات الطرف الثالث لشروطها وسياسات الخصوصية الخاصة بها.</p>,
    },
    {
      num: 13, icon: <Server className="w-5 h-5" />, accent: 'teal',
      enTitle: 'Service Availability', arTitle: 'توفر الخدمة',
      enBody: <p>We aim to maintain reliable availability of the Service but do not guarantee uninterrupted or error-free operation. Maintenance, upgrades, security events, infrastructure failures, and circumstances outside our reasonable control may temporarily affect availability.</p>,
      arBody: <p>نسعى للحفاظ على توفر موثوق للخدمة لكننا لا نضمن تشغيلاً متواصلاً أو خالياً من الأخطاء. قد تؤثر عمليات الصيانة والترقيات وأحداث الأمان وإخفاقات البنية التحتية والظروف خارج سيطرتنا المعقولة مؤقتاً على التوفر.</p>,
    },
    {
      num: 14, icon: <ShieldCheck className="w-5 h-5" />, accent: 'emerald',
      enTitle: 'Security', arTitle: 'الأمان',
      enBody: <p>JURISTECH implements reasonable technical and organizational safeguards designed to protect the Service and information processed through it. No internet-based system can be guaranteed to be completely secure.</p>,
      arBody: <p>تطبّق جوريستك ضمانات تقنية وتنظيمية معقولة مصممة لحماية الخدمة والمعلومات المعالَجة من خلالها. لا يمكن ضمان أمان أي نظام قائم على الإنترنت بالكامل.</p>,
    },
    {
      num: 15, icon: <AlertTriangle className="w-5 h-5" />, accent: 'orange',
      enTitle: 'Termination', arTitle: 'الإنهاء',
      enBody: (
        <div className="space-y-2">
          <p>We may suspend or terminate access where reasonably necessary to:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>prevent abuse or security threats;</li>
            <li>comply with applicable law;</li>
            <li>address fraudulent activity;</li>
            <li>enforce these Terms; or</li>
            <li>protect the Service, users, or third parties.</li>
          </ul>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>قد نوقف الوصول أو نُنهيه عند الضرورة المعقولة من أجل:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>منع الإساءة أو التهديدات الأمنية؛</li>
            <li>الامتثال للقانون المعمول به؛</li>
            <li>معالجة الأنشطة الاحتيالية؛</li>
            <li>تطبيق هذه الشروط؛ أو</li>
            <li>حماية الخدمة أو المستخدمين أو الأطراف الثالثة.</li>
          </ul>
        </div>
      ),
    },
    {
      num: 16, icon: <ShieldAlert className="w-5 h-5" />, accent: 'red',
      enTitle: 'Disclaimers', arTitle: 'إخلاء المسؤولية',
      enBody: <p>To the maximum extent permitted by applicable law, the Service is provided on an "as available" and "as is" basis. JURISTECH does not guarantee that the Service or any output will be accurate, complete, uninterrupted, or suitable for every particular purpose.</p>,
      arBody: <p>بالقدر الأقصى المسموح به بموجب القانون المعمول به، تُقدَّم الخدمة على أساس "كما هي متاحة" و"كما هي". لا تضمن جوريستك دقة الخدمة أو أي مخرجاتها أو اكتمالها أو استمراريتها أو ملاءمتها لكل غرض بعينه.</p>,
    },
    {
      num: 17, icon: <Scale className="w-5 h-5" />, accent: 'slate',
      enTitle: 'Limitation of Liability', arTitle: 'تحديد المسؤولية',
      enBody: (
        <div className="space-y-2">
          <p>To the maximum extent permitted by applicable law, JURISTECH will not be liable for indirect, incidental, consequential, special, or punitive damages arising from use of the Service.</p>
          <p className="text-slate-400 text-sm">Nothing in these Terms excludes liability that cannot lawfully be excluded or limited.</p>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>بالقدر الأقصى المسموح به بموجب القانون، لن تكون جوريستك مسؤولة عن الأضرار غير المباشرة أو العرضية أو التبعية أو الخاصة أو العقابية الناشئة عن استخدام الخدمة.</p>
          <p className="text-slate-400 text-sm">لا يستثني أي بند في هذه الشروط المسؤولية التي لا يمكن استثناؤها أو تحديدها قانوناً.</p>
        </div>
      ),
    },
    {
      num: 18, icon: <RefreshCw className="w-5 h-5" />, accent: 'blue',
      enTitle: 'Changes to These Terms', arTitle: 'التغييرات على هذه الشروط',
      enBody: <p>We may update these Terms from time to time. When material changes are made, the updated version will be published on this page with a revised "Last Updated" date.</p>,
      arBody: <p>قد نحدّث هذه الشروط من حين لآخر. عند إجراء تغييرات جوهرية، سيُنشر الإصدار المحدَّث على هذه الصفحة بتاريخ "آخر تحديث" منقَّح.</p>,
    },
    {
      num: 19, icon: <Globe className="w-5 h-5" />, accent: 'indigo',
      enTitle: 'Governing Law', arTitle: 'القانون الحاكم',
      enBody: <p>The governing law and dispute-resolution provisions applicable to the Service will depend on the legal structure and jurisdiction applicable to JURISTECH. Nothing in these Terms is intended to create rights that cannot lawfully be excluded.</p>,
      arBody: <p>تعتمد أحكام القانون الحاكم وتسوية النزاعات المطبَّقة على الخدمة على الهيكل القانوني ونطاق الاختصاص القضائي المعمول به لجوريستك. لا يُقصد من أي بند في هذه الشروط إنشاء حقوق لا يمكن استثناؤها قانوناً.</p>,
    },
    {
      num: 20, icon: <Mail className="w-5 h-5" />, accent: 'sky',
      enTitle: 'Contact', arTitle: 'التواصل',
      enBody: (
        <div className="space-y-3">
          <p>For questions regarding these Terms:</p>
          <div className="space-y-1 text-sm text-slate-300">
            <div className="font-bold text-white">JURISTECH</div>
            <div>Website: <a href="https://juristech.solutions" className="text-sky-400 hover:text-sky-300">https://juristech.solutions</a></div>
            <div>Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sky-400 hover:text-sky-300">{SUPPORT_EMAIL}</a></div>
          </div>
        </div>
      ),
      arBody: (
        <div className="space-y-3">
          <p>للاستفسار عن هذه الشروط:</p>
          <div className="space-y-1 text-sm text-slate-300">
            <div className="font-bold text-white">JURISTECH</div>
            <div>الموقع: <a href="https://juristech.solutions" className="text-sky-400 hover:text-sky-300">https://juristech.solutions</a></div>
            <div>البريد: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sky-400 hover:text-sky-300">{SUPPORT_EMAIL}</a></div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 ${ar ? 'rtl' : 'ltr'}`}>
      <SEO
        title={`${ar ? 'شروط الخدمة' : 'Terms of Service'} | JURISTECH`}
        description={ar ? 'الشروط والأحكام الرسمية لمنصة JURISTECH — آخر تحديث: أغسطس 2026' : 'Official Terms of Service for JURISTECH — Last Updated: August 25, 2026'}
      />
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20 text-blue-400">
            <Scale className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {ar ? 'شروط الخدمة' : 'Terms of Service'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {ar ? 'بوصولك إلى جوريستك أو استخدامها، فإنك توافق على الالتزام بهذه الشروط.' : 'By accessing or using JURISTECH, you agree to be bound by these Terms.'}
          </p>
          <p className="text-xs text-slate-500 font-mono">{ar ? 'آخر تحديث:' : 'Last Updated:'} {LAST_UPDATED}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            {[
              { to: '/pricing', label: ar ? 'الأسعار' : 'Pricing', active: false },
              { to: '/terms', label: ar ? 'شروط الخدمة' : 'Terms of Service', active: true },
              { to: '/privacy', label: ar ? 'سياسة الخصوصية' : 'Privacy Policy', active: false },
              { to: '/refund', label: ar ? 'سياسة الاسترداد' : 'Refund Policy', active: false },
            ].map(({ to, label, active }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  active ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
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
          <p className="text-sm font-semibold text-white">
            {ar ? 'باستخدامك لجوريستك، فإنك تُقرّ بأنك قرأت هذه الشروط وفهمتها.' : 'By using JURISTECH, you acknowledge that you have read and understood these Terms of Service.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <Link to="/pricing" className="hover:text-slate-300">{ar ? 'الأسعار' : 'Pricing'}</Link>
            <span>·</span>
            <Link to="/privacy" className="hover:text-slate-300">{ar ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
            <span>·</span>
            <Link to="/refund" className="hover:text-slate-300">{ar ? 'سياسة الاسترداد' : 'Refund Policy'}</Link>
            <span>·</span>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-slate-300">{SUPPORT_EMAIL}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

