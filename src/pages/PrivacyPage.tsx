/**
 * src/pages/PrivacyPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JURISTECH — Official Privacy Policy
 * Last Updated: August 25, 2026
 * 15 sections — bilingual EN / AR — Production Ready for Merchant Verification.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck, Lock, Eye, FileText, Server, UserCheck,
  Cookie, Globe, Mail, Database, AlertTriangle, RefreshCw, Zap, Users
} from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const DPO_EMAIL = 'juristech.solutions@outlook.com';
const LAST_UPDATED = 'August 25, 2026';

const ACCENT_BORDER: Record<string, string> = {
  emerald: 'border-emerald-500/30 bg-emerald-500/5',
  blue: 'border-blue-500/30 bg-blue-500/5',
  purple: 'border-purple-500/30 bg-purple-500/5',
  amber: 'border-amber-500/30 bg-amber-500/5',
  cyan: 'border-cyan-500/30 bg-cyan-500/5',
  orange: 'border-orange-500/30 bg-orange-500/5',
  sky: 'border-sky-500/30 bg-sky-500/5',
  red: 'border-red-500/30 bg-red-500/5',
  indigo: 'border-indigo-500/30 bg-indigo-500/5',
  teal: 'border-teal-500/30 bg-teal-500/5',
  slate: 'border-slate-600/30 bg-slate-800/20',
};

const ACCENT_TEXT: Record<string, string> = {
  emerald: 'text-emerald-400', blue: 'text-blue-400', purple: 'text-purple-400',
  amber: 'text-amber-400', cyan: 'text-cyan-400', orange: 'text-orange-400',
  sky: 'text-sky-400', red: 'text-red-400', indigo: 'text-indigo-400',
  teal: 'text-teal-400', slate: 'text-slate-300',
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

export default function PrivacyPage() {
  const { i18n } = useTranslation();
  const ar = i18n.language === 'ar';

  const sections: Sec[] = [
    {
      num: 1, icon: <Database className="w-5 h-5" />, accent: 'blue',
      enTitle: 'Information We May Collect', arTitle: 'المعلومات التي قد نجمعها',
      enBody: (
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-white mb-1">Account Information</p>
            <p className="text-slate-400 text-sm">name; email address; account credentials; organization information; subscription information.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Business and Service Information</p>
            <p className="text-slate-400 text-sm">information submitted through forms; information necessary to provide requested software functionality; documents or content voluntarily submitted by users.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Payment Information</p>
            <p className="text-slate-400 text-sm">Payment transactions may be processed by third-party payment providers. JURISTECH does not need to store complete payment-card numbers when payment processing is handled by an authorized third-party payment provider.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Technical Information</p>
            <p className="text-slate-400 text-sm">IP address; browser type; device information; operating system; pages visited; referring pages; timestamps; general usage information; security and diagnostic logs.</p>
          </div>
        </div>
      ),
      arBody: (
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-white mb-1">معلومات الحساب</p>
            <p className="text-slate-400 text-sm">الاسم؛ البريد الإلكتروني؛ بيانات اعتماد الحساب؛ معلومات المؤسسة؛ معلومات الاشتراك.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">معلومات الأعمال والخدمة</p>
            <p className="text-slate-400 text-sm">المعلومات المقدمة من خلال النماذج؛ المعلومات اللازمة لتقديم وظائف البرمجيات المطلوبة؛ المستندات أو المحتوى المقدم طوعاً من المستخدمين.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">معلومات الدفع</p>
            <p className="text-slate-400 text-sm">قد تتم معالجة معاملات الدفع من قبل مزودي دفع تابعين لجهات خارجية. لا تحتاج جوريستك لتخزين أرقام بطاقات الدفع الكاملة عندما تتم المعالجة من قبل مزود دفع معتمد.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">المعلومات التقنية</p>
            <p className="text-slate-400 text-sm">عنوان IP؛ نوع المتصفح؛ معلومات الجهاز؛ نظام التشغيل؛ الصفحات التي تمت زيارتها؛ الصفحات المرجعية؛ الطوابع الزمنية؛ معلومات الاستخدام العامة؛ سجلات الأمان والتشخيص.</p>
          </div>
        </div>
      ),
    },
    {
      num: 2, icon: <Eye className="w-5 h-5" />, accent: 'emerald',
      enTitle: 'How We Use Information', arTitle: 'كيفية استخدام المعلومات',
      enBody: (
        <div className="space-y-2">
          <p>We may use information to:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>create and maintain accounts;</li>
            <li>provide the Service;</li>
            <li>process subscriptions and payments;</li>
            <li>verify subscription status;</li>
            <li>provide customer support;</li>
            <li>maintain security;</li>
            <li>detect fraud and abuse;</li>
            <li>troubleshoot technical problems;</li>
            <li>improve our products;</li>
            <li>understand product usage;</li>
            <li>comply with legal obligations.</li>
          </ul>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>قد نستخدم المعلومات من أجل:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>إنشاء الحسابات والحفاظ عليها؛</li>
            <li>تقديم الخدمة؛</li>
            <li>معالجة الاشتراكات والمدفوعات؛</li>
            <li>التحقق من حالة الاشتراك؛</li>
            <li>تقديم دعم العملاء؛</li>
            <li>الحفاظ على الأمان؛</li>
            <li>اكتشاف الاحتيال وإساءة الاستخدام؛</li>
            <li>استكشاف المشكلات التقنية وإصلاحها؛</li>
            <li>تحسين منتجاتنا؛</li>
            <li>فهم استخدام المنتج؛</li>
            <li>الامتثال للالتزامات القانونية.</li>
          </ul>
        </div>
      ),
    },
    {
      num: 3, icon: <Lock className="w-5 h-5" />, accent: 'purple',
      enTitle: 'Payment Processing', arTitle: 'معالجة الدفع',
      enBody: (
        <div className="space-y-2">
          <p>Payments may be processed by third-party payment providers. When you purchase a JURISTECH subscription, the payment provider may process payment and transaction information under its own privacy policy and terms.</p>
          <p className="text-slate-400">JURISTECH receives information necessary to identify the applicable customer, transaction, and subscription status.</p>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            ✓ Paid access is granted based on server-side verification of the subscription/payment state.
          </div>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>قد تتم معالجة المدفوعات من قبل مزودي دفع تابعين لجهات خارجية. عند شراء اشتراك في جوريستك، قد يعالج مزود الدفع معلومات الدفع والمعاملات بموجب سياسة الخصوصية والشروط الخاصة به.</p>
          <p className="text-slate-400">تتلقى جوريستك المعلومات اللازمة لتحديد العميل المعني والمعاملة وحالة الاشتراك.</p>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            ✓ يُمنح الوصول المدفوع بناءً على التحقق من جانب الخادم لحالة الاشتراك/الدفع.
          </div>
        </div>
      ),
    },
    {
      num: 4, icon: <FileText className="w-5 h-5" />, accent: 'cyan',
      enTitle: 'Analytics', arTitle: 'التحليلات',
      enBody: <p>JURISTECH may use analytics technologies to understand website and product usage. Analytics may include browser-based analytics and server-side telemetry where configured. Analytics information is used for operational, security, performance, and product-improvement purposes.</p>,
      arBody: <p>قد تستخدم جوريستك تقنيات التحليلات لفهم استخدام الموقع والمنتج. قد تشمل التحليلات القياسات القائمة على المتصفح والقياس عن بعد من جانب الخادم عند تكوينه. تُستخدم معلومات التحليلات لأغراض تشغيلية وأمنية وأداء وتحسين المنتجات.</p>,
    },
    {
      num: 5, icon: <Cookie className="w-5 h-5" />, accent: 'amber',
      enTitle: 'Cookies and Local Storage', arTitle: 'ملفات تعريف الارتباط والتخزين المحلي',
      enBody: (
        <div className="space-y-2">
          <p>The website may use cookies, session technologies, or browser storage for functionality, authentication, preferences, security, and analytics.</p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            ⚠️ Browser storage does not independently establish entitlement to paid JURISTECH services. Paid subscription access is determined by server-side account and subscription state.
          </div>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>قد يستخدم الموقع ملفات تعريف الارتباط أو تقنيات الجلسة أو تخزين المتصفح للوظائف والمصادقة والتفضيلات والأمان والتحليلات.</p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            ⚠️ لا يؤسس تخزين المتصفح بشكل مستقل استحقاقاً لخدمات جوريستك المدفوعة. يتم تحديد الوصول إلى الاشتراك المدفوع من خلال حالة الحساب والاشتراك من جانب الخادم.
          </div>
        </div>
      ),
    },
    {
      num: 6, icon: <Zap className="w-5 h-5" />, accent: 'purple',
      enTitle: 'AI and Automated Processing', arTitle: 'الذكاء الاصطناعي والمعالجة الآلية',
      enBody: <p>Certain JURISTECH features may use artificial intelligence or automated processing. Where information is processed by AI-enabled functionality, the processing is performed to provide the requested feature and related service functionality. Users should avoid submitting highly sensitive information unless such submission is necessary and appropriate for the requested service.</p>,
      arBody: <p>قد تستخدم بعض ميزات جوريستك الذكاء الاصطناعي أو المعالجة الآلية. عندما تتم معالجة المعلومات بواسطة وظائف تدعم الذكاء الاصطناعي، يتم تنفيذ المعالجة لتقديم الميزة المطلوبة ووظائف الخدمة ذات الصلة. يجب على المستخدمين تجنب تقديم معلومات حساسة للغاية إلا إذا كان ذلك ضرورياً ومناسباً للخدمة المطلوبة.</p>,
    },
    {
      num: 7, icon: <Users className="w-5 h-5" />, accent: 'teal',
      enTitle: 'Data Sharing', arTitle: 'مشاركة البيانات',
      enBody: (
        <div className="space-y-2">
          <p>We may share information with service providers that help us operate JURISTECH, including providers for: hosting; authentication; payment processing; analytics; infrastructure; security; customer support.</p>
          <p className="text-slate-400">We do not sell personal information merely because a user accesses the Service. We may disclose information when required by law, legal process, or to protect the rights, security, or property of JURISTECH, our users, or others.</p>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>قد نشارك المعلومات مع مزودي الخدمات الذين يساعدوننا في تشغيل جوريستك، بما في ذلك مزودو: الاستضافة؛ المصادقة؛ معالجة الدفع؛ التحليلات؛ البنية التحتية؛ الأمان؛ دعم العملاء.</p>
          <p className="text-slate-400">نحن لا نبيع المعلومات الشخصية لمجرد وصول المستخدم إلى الخدمة. يجوز لنا الكشف عن المعلومات عند الاقتضاء بموجب القانون أو الإجراءات القانونية أو لحماية حقوق أو أمان أو ممتلكات جوريستك أو مستخدمينا أو الآخرين.</p>
        </div>
      ),
    },
    {
      num: 8, icon: <Database className="w-5 h-5" />, accent: 'indigo',
      enTitle: 'Data Retention', arTitle: 'الاحتفاظ بالبيانات',
      enBody: <p>We retain information for as long as reasonably necessary to provide the Service, maintain business and security records, resolve disputes, comply with legal obligations, and enforce agreements. Retention periods may vary depending on the type of information and the purpose for which it is processed.</p>,
      arBody: <p>نحتفظ بالمعلومات طالما كان ذلك ضرورياً بشكل معقول لتقديم الخدمة، والاحتفاظ بسجلات الأعمال والأمان، وحل النزاعات، والامتثال للالتزامات القانونية، وإنفاذ الاتفاقيات. قد تختلف فترات الاحتفاظ حسب نوع المعلومات والغرض الذي تتم معالجتها من أجله.</p>,
    },
    {
      num: 9, icon: <ShieldCheck className="w-5 h-5" />, accent: 'emerald',
      enTitle: 'Data Security', arTitle: 'أمان البيانات',
      enBody: (
        <div className="space-y-2">
          <p>We use reasonable technical and organizational measures intended to protect information against unauthorized access, alteration, disclosure, or destruction. Security measures may include authentication controls, access controls, encryption where appropriate, server-side authorization, and monitoring.</p>
          <p className="text-slate-400 text-sm">However, no online service can guarantee absolute security.</p>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>نحن نستخدم تدابير تقنية وتنظيمية معقولة تهدف إلى حماية المعلومات من الوصول غير المصرح به أو التغيير أو الإفصاح أو التدمير. قد تشمل التدابير الأمنية ضوابط المصادقة، وضوابط الوصول، والتشفير حيثما كان ذلك مناسباً، والترخيص من جانب الخادم، والمراقبة.</p>
          <p className="text-slate-400 text-sm">ومع ذلك، لا يمكن لأي خدمة عبر الإنترنت أن تضمن الأمان المطلق.</p>
        </div>
      ),
    },
    {
      num: 10, icon: <Globe className="w-5 h-5" />, accent: 'blue',
      enTitle: 'International Data Processing', arTitle: 'المعالجة الدولية للبيانات',
      enBody: <p>Because JURISTECH and its service providers may operate using infrastructure located in different countries, information may be processed or stored internationally. Where applicable law requires specific safeguards for international transfers, we will seek to apply appropriate safeguards.</p>,
      arBody: <p>نظراً لأن جوريستك ومزودي خدماتها قد يعملون باستخدام بنية تحتية تقع في بلدان مختلفة، فقد تتم معالجة المعلومات أو تخزينها دولياً. عندما يتطلب القانون المعمول به ضمانات محددة لعمليات النقل الدولي، سنسعى لتطبيق الضمانات المناسبة.</p>,
    },
    {
      num: 11, icon: <UserCheck className="w-5 h-5" />, accent: 'purple',
      enTitle: 'Your Rights', arTitle: 'حقوقك',
      enBody: (
        <div className="space-y-2">
          <p>Depending on your location and applicable law, you may have rights concerning your personal information, including rights to: access information; request correction; request deletion; object to certain processing; request restriction; request data portability; withdraw consent where processing is based on consent.</p>
          <p className="text-slate-400">Requests may be submitted using the contact information below.</p>
        </div>
      ),
      arBody: (
        <div className="space-y-2">
          <p>اعتماداً على موقعك والقانون المعمول به، قد يكون لديك حقوق تتعلق بمعلوماتك الشخصية، بما في ذلك حقوق: الوصول إلى المعلومات؛ طلب التصحيح؛ طلب الحذف؛ الاعتراض على معالجة معينة؛ طلب التقييد؛ طلب قابلية نقل البيانات؛ سحب الموافقة عندما تستند المعالجة إلى الموافقة.</p>
          <p className="text-slate-400">يمكن تقديم الطلبات باستخدام معلومات الاتصال أدناه.</p>
        </div>
      ),
    },
    {
      num: 12, icon: <AlertTriangle className="w-5 h-5" />, accent: 'orange',
      enTitle: 'Children', arTitle: 'الأطفال',
      enBody: <p>JURISTECH is not intended to be used by children where such use is prohibited by applicable law. We do not knowingly request unnecessary personal information from children.</p>,
      arBody: <p>جوريستك غير مخصصة للاستخدام من قبل الأطفال عندما يكون هذا الاستخدام محظوراً بموجب القانون المعمول به. نحن لا نطلب عن علم معلومات شخصية غير ضرورية من الأطفال.</p>,
    },
    {
      num: 13, icon: <Server className="w-5 h-5" />, accent: 'slate',
      enTitle: 'Third-Party Links', arTitle: 'روابط الطرف الثالث',
      enBody: <p>The Service may contain links to third-party websites or services. JURISTECH is not responsible for the privacy practices of third-party websites. Users should review the privacy policies of those services before providing information.</p>,
      arBody: <p>قد تحتوي الخدمة على روابط لمواقع أو خدمات تابعة لجهات خارجية. جوريستك ليست مسؤولة عن ممارسات الخصوصية لمواقع الطرف الثالث. يجب على المستخدمين مراجعة سياسات الخصوصية لتلك الخدمات قبل تقديم المعلومات.</p>,
    },
    {
      num: 14, icon: <RefreshCw className="w-5 h-5" />, accent: 'blue',
      enTitle: 'Policy Changes', arTitle: 'تغييرات السياسة',
      enBody: <p>We may update this Privacy Policy periodically. The latest version will always be published on this page with an updated "Last Updated" date.</p>,
      arBody: <p>قد نحدّث سياسة الخصوصية هذه بشكل دوري. سيتم دائماً نشر أحدث إصدار على هذه الصفحة بتاريخ "آخر تحديث" منقح.</p>,
    },
    {
      num: 15, icon: <Mail className="w-5 h-5" />, accent: 'sky',
      enTitle: 'Contact', arTitle: 'التواصل',
      enBody: (
        <div className="space-y-3">
          <p>For privacy questions or requests:</p>
          <div className="space-y-1 text-sm text-slate-300">
            <div className="font-bold text-white">JURISTECH</div>
            <div>Website: <a href="https://juristech.solutions" className="text-sky-400 hover:text-sky-300">https://juristech.solutions</a></div>
            <div>Email: <a href={`mailto:${DPO_EMAIL}`} className="text-sky-400 hover:text-sky-300">{DPO_EMAIL}</a></div>
            <div className="text-slate-400">Subject line: <span className="font-mono text-sky-300">"Privacy Request"</span></div>
          </div>
          <p className="text-slate-400 text-sm">We will review privacy requests and respond in accordance with applicable law.</p>
        </div>
      ),
      arBody: (
        <div className="space-y-3">
          <p>للأسئلة أو الطلبات المتعلقة بالخصوصية:</p>
          <div className="space-y-1 text-sm text-slate-300">
            <div className="font-bold text-white">JURISTECH</div>
            <div>الموقع: <a href="https://juristech.solutions" className="text-sky-400 hover:text-sky-300">https://juristech.solutions</a></div>
            <div>البريد: <a href={`mailto:${DPO_EMAIL}`} className="text-sky-400 hover:text-sky-300">{DPO_EMAIL}</a></div>
            <div className="text-slate-400">سطر الموضوع: <span className="font-mono text-sky-300">"Privacy Request"</span></div>
          </div>
          <p className="text-slate-400 text-sm">سنراجع طلبات الخصوصية ونرد وفقاً للقانون المعمول به.</p>
        </div>
      ),
    },
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 ${ar ? 'rtl' : 'ltr'}`}>
      <SEO
        title={`${ar ? 'سياسة الخصوصية' : 'Privacy Policy'} | JURISTECH`}
        description={ar ? 'سياسة الخصوصية الرسمية لمنصة JURISTECH — آخر تحديث: أغسطس 2026' : 'Official Privacy Policy for JURISTECH — Last Updated: August 25, 2026'}
      />
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {ar ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {ar ? 'كيف تجمع جوريستك المعلومات وتستخدمها وتخزنها وتحميها عند استخدام خدماتنا.' : 'How JURISTECH collects, uses, stores, and protects information when you access or use our services.'}
          </p>
          <p className="text-xs text-slate-500 font-mono">{ar ? 'آخر تحديث:' : 'Last Updated:'} {LAST_UPDATED}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            {[
              { to: '/pricing', label: ar ? 'الأسعار' : 'Pricing', active: false },
              { to: '/terms', label: ar ? 'شروط الخدمة' : 'Terms of Service', active: false },
              { to: '/privacy', label: ar ? 'سياسة الخصوصية' : 'Privacy Policy', active: true },
              { to: '/refund', label: ar ? 'سياسة الاسترداد' : 'Refund Policy', active: false },
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
            <Link to="/refund" className="hover:text-slate-300">{ar ? 'سياسة الاسترداد' : 'Refund Policy'}</Link>
            <span>·</span>
            <a href={`mailto:${DPO_EMAIL}`} className="hover:text-slate-300">{DPO_EMAIL}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
