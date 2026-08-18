import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MessageSquare, Headphones, Send, CheckCircle2, Lock, Mail, HelpCircle, ChevronDown, ChevronUp, Video, Play, ArrowUpRight } from 'lucide-react';
import { dispatchReceiptEmail } from '../lib/emailNotifier';
import SEO from '../components/SEO';
import EncryptedSupportMessengerModal from '../components/EncryptedSupportMessengerModal';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
}

export default function SupportPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TICK-1082',
      subject: isRtl ? 'استفسار عن تفعيل مفاتيح بوابات Stripe / Tap' : 'Query regarding Stripe / Tap API activation',
      category: 'Billing & Payments',
      status: 'Resolved',
      createdAt: 'منذ يومين',
    },
  ]);

  async function handleSubmitTicket() {
    if (!subject.trim() || !details.trim()) return;

    const newTicket: Ticket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category,
      status: 'Open',
      createdAt: 'الآن',
    };

    setTickets([newTicket, ...tickets]);
    setSubmitted(true);
    await dispatchReceiptEmail({
      clientEmail: 'juristech.solutions@outlook.com',
      clientRef: subject,
      transactionId: newTicket.id,
      planName: `Support Inquiry (${category})`,
      amount: 0,
      receiptUrl: 'https://juristech.solutions/support',
      timestamp: new Date().toISOString(),
    });

    setSubject('');
    setDetails('');
    setTimeout(() => setSubmitted(false), 4000);
  }

  const FAQS = [
    {
      qAr: 'كيف يعمل نظام التوافق التشريعي الجغرافي (GeoIP)؟',
      qEn: 'How does the GeoIP Automated Legal Jurisdiction work?',
      aAr: 'يتعرف النظام تلقائياً على دولة الزائر فور دخوله المنصة، ويقوم بتزويد جميع استشارات محرر العقود ومحلل المخاطر بالقوانين واللوائح المحلية المعتمدة في دولتك.',
      aEn: 'The system auto-detects your country upon entry and feeds all contract generation & risk tools with local statutory laws.',
    },
    {
      qAr: 'ما هي طرق الدفع المتاحة لرفع إيصالات التحويل البنكي (SWIFT)؟',
      qEn: 'What payment options are available for Direct Bank Wire (SWIFT)?',
      aAr: 'يمكنك الدفع الفوري عبر PayPal Commercial أو استخدام نافذة التحويل البنكي (SWIFT) لرفع الإيصال وتلقي التأكيد التلقائي والإشعار الفوري.',
      aEn: 'You can pay via PayPal Commercial or upload bank wire receipts via the SWIFT modal with instant automated email dispatch.',
    },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Headphones className="w-4 h-4" />
            <span>{isRtl ? 'مركز الدعم الفني وتذاكر الخدمة المباشرة' : 'Technical Support & Helpdesk Hub'}</span>
          </div>
          <h1 className="text-3xl font-extrabold">{isRtl ? 'مركز الدعم الفني والدعم المباشر' : '24/7 Technical Support & Helpdesk'}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {isRtl ? 'فريق الدعم الفني والقانوني في منصة JurisTech Solutions جاهز لمساعدتك على مدار الساعة' : 'Dedicated 24/7 technical and legal support for JurisTech Solutions subscribers'}
          </p>
        </div>

        {/* Video Tutorial Hub Distribution Banner */}
        <Link
          to="/video-hub"
          className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl hover:border-cyan-500/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Play className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 mb-1">
                <Video className="w-3 h-3" />
                <span>6 LANGUAGES TUTORIALS</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">
                {isRtl ? 'مركز الفيديو الشامل والدليل التعليمي للمنصة' : 'Multilingual Video Tutorial Hub'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {isRtl
                  ? 'شاهد الشرح المرئي لجميع أدوات الذكاء الاصطناعي، صياغة العقود، وإدارة الاشتراك باللغات الست.'
                  : 'Watch interactive video walkthroughs for AI tools, contract audits, and subscriptions.'}
              </p>
            </div>
          </div>
          <span className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shrink-0 group-hover:bg-cyan-400 transition-all">
            <span>{isRtl ? 'مشاهدة الدليل المرئي' : 'Watch Video Tutorials'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </Link>

        {/* Quick Contact Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setIsMessengerOpen(true)}
            className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-between hover:bg-cyan-500/20 transition-all text-right"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 shrink-0" />
              <div>
                <span className="font-bold text-sm block">{isRtl ? 'بوابة المراسلات التفاعلية المشفرة' : 'Encrypted Support Ticket Desk'}</span>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">256-bit Secure Support Protocol</span>
              </div>
            </div>
            <Send className="w-4 h-4 shrink-0" />
          </button>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-3">
            <Mail className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-sm block">{isRtl ? 'البريد الرسمي للدعم الإداري' : 'Official Admin Email'}</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">Drzyogo.ca@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Instant Consultations Module */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base">
                    {isRtl ? 'مسار الاستشارات الفورية المباشرة السريعة' : 'Instant 1-on-1 Legal Consultations'}
                  </h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    {isRtl ? 'متاح الآن' : 'Live Available'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'تواصل فوري مع مستشار قانوني مختص أو اطلب فحصاً عاجلاً لعقدك خلال دقائق.' : 'Instant escalation path to senior legal counsel for urgent contract reviews.'}
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20 shrink-0">
              ⏱️ {isRtl ? 'متوسط زمن الاستجابة: 3 دقائق' : 'Est. Wait Time: ~3 mins'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <Link
              to="/chat"
              className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-right transition-all group"
            >
              <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
                {isRtl ? '🤖 المستشار الذكي (10 رسائل مجاناً)' : '🤖 AI Legal Chatbot (10 Free Messages)'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {isRtl ? 'رد فوري على أسئلة العقود والقوانين' : 'Instant response on contract clauses'}
              </span>
            </Link>

            <Link
              to="/contracts"
              className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-right transition-all group"
            >
              <span className="text-xs font-bold text-white block group-hover:text-indigo-300 transition-colors">
                {isRtl ? '📋 فحص ثغرات وتدقيق العقد' : '📋 AI Contract Gap Audit'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {isRtl ? 'رصد الثغرات والمخاطر ومقترحات التعديل' : 'Identify hidden loopholes & redlines'}
              </span>
            </Link>

            <button
              onClick={() => setIsMessengerOpen(true)}
              className="p-3.5 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 text-right transition-all group"
            >
              <span className="text-xs font-bold text-cyan-400 block group-hover:text-cyan-300 transition-colors">
                {isRtl ? '🔒 استشارة مشفرة وتصعيد تذكرة عاجلة' : '🔒 Encrypted Counsel & Urgent Ticket'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {isRtl ? 'تصعيد الحالات المعقدة للمستشار القانوني' : 'Escalate complex cases securely to legal counsel'}
              </span>
            </button>
          </div>
        </div>

        {/* Support Ticket Submission */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{isRtl ? 'إرسال تذكرة دعم فني جديدة' : 'Submit a Support Ticket'}</h3>

          {submitted && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{isRtl ? 'تم إرسال تذكرة الدعم بنجاح وسيتواصل معك الفريق الفني خلال دقائق.' : 'Ticket submitted successfully! Admin notification dispatched.'}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{isRtl ? 'موضوع التذكرة' : 'Ticket Subject'}</label>
              <input
                type="text"
                placeholder={isRtl ? 'عنوان الاستفسار أو المشكلة' : 'Subject of inquiry...'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{isRtl ? 'قسم الاستفسار' : 'Category'}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Technical">{isRtl ? 'دعم فني وتطوير' : 'Technical Support'}</option>
                <option value="Billing & Payments">{isRtl ? 'الفواتير والمدفوعات' : 'Billing & Payments'}</option>
                <option value="Legal & Jurisdiction">{isRtl ? 'استفسارات الأنظمة والتوافق' : 'Legal & Compliance'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{isRtl ? 'تفاصيل الرسالة أو المشكلة' : 'Inquiry Details'}</label>
            <textarea
              rows={4}
              placeholder={isRtl ? 'اشرح بالتفصيل كيف يمكننا مساعدتك...' : 'Explain your issue in detail...'}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans leading-relaxed"
            />
          </div>

          <button
            onClick={handleSubmitTicket}
            disabled={!subject.trim() || !details.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
          >
            <Send className="w-4 h-4" />
            <span>{isRtl ? 'إرسال التذكرة لفريق الدعم' : 'Submit Support Ticket'}</span>
          </button>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>{isRtl ? 'الأسئلة الشائعة والإجابات التشغيلية' : 'Frequently Asked Questions'}</span>
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-4 text-right flex items-center justify-between text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-cyan-400 transition-colors"
                >
                  <span>{isRtl ? faq.qAr : faq.qEn}</span>
                  {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 dark:text-slate-400" />}
                </button>

                {expandedFaq === i && (
                  <div className="px-4 pb-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-900 pt-3">
                    {isRtl ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EncryptedSupportMessengerModal
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
      />
    </main>
  );
}
