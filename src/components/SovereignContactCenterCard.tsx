import React from 'react';
import { usePlatformLocale } from '../lib/universalTranslator';
import { MessageCircle, Mail, Zap, Building2 } from 'lucide-react';

export default function SovereignContactCenterCard() {
  const { l, isRtl } = usePlatformLocale();

  return (
    <section className="bg-slate-900/90 border-2 border-sky-600/60 rounded-3xl p-5 sm:p-6 my-6 text-slate-100 shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 end-0 w-64 h-32 bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-sky-400 m-0">
            {l('مركز الدعم الفني وأتمتة العمليات العقدية', 'Technical Support & Contract Workflow Automation Command Center')}
          </h2>
          <p className="text-xs text-slate-300 mt-1 mb-0">
            {l(
              'مركز الدعم الفني والتقني وإدارة منظومة الذكاء الاصطناعي العقدي 24/7',
              '24/7 Technical Support & AI Contract Workflow Administration'
            )}
          </p>
        </div>
        <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{l('متصل الآن 24/7', 'Online 24/7')}</span>
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        {/* WhatsApp */}
        <div className="bg-slate-950 border border-emerald-600/40 p-4 rounded-2xl shadow hover:border-emerald-500 transition-colors">
          <strong className="text-emerald-400 block mb-1 text-xs sm:text-sm">
            {l('💬 واتساب الدعم الفني المباشر:', '💬 Direct Technical Support WhatsApp:')}
          </strong>
          <a
            href="https://wa.me/201126674337?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D9%86%D8%B5%D8%A9%20JurisTech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-100 font-bold hover:text-emerald-300 transition-colors block font-mono select-all text-sm"
          >
            +201126674337
          </a>
          <span className="block text-xs text-slate-400 mt-1">
            {l('استجابة فورية ودعم تشغيلي للمنصة', 'Instant response & platform operational support')}
          </span>
        </div>

        {/* Official Email */}
        <div className="bg-slate-950 border border-sky-600/40 p-4 rounded-2xl shadow hover:border-sky-500 transition-colors">
          <strong className="text-sky-400 block mb-1 text-xs sm:text-sm">
            {l('📧 البريد الرسمي للإدارة والتقنية:', '📧 Official Executive & Technical Email:')}
          </strong>
          <a
            href="mailto:founder@juristech.solutions?subject=Executive%20Technical%20Inquiry"
            className="text-slate-100 font-bold hover:text-sky-300 transition-colors block font-mono select-all text-sm truncate"
          >
            founder@juristech.solutions
          </a>
          <span className="block text-xs text-slate-400 mt-1">
            {l('تنسيق التكامل المؤسسي والاشتراكات', 'Enterprise integration & subscription coordination')}
          </span>
        </div>

        {/* InstaPay */}
        <div className="bg-slate-950 border border-purple-600/40 p-4 rounded-2xl shadow hover:border-purple-500 transition-colors">
          <strong className="text-purple-400 block mb-1 text-xs sm:text-sm">
            {l('⚡ إنستا باي مصر (InstaPay):', '⚡ InstaPay Egypt Settlement:')}
          </strong>
          <span className="text-slate-100 font-bold font-mono select-all block text-sm">
            +201031222262
          </span>
          <span className="block text-xs text-slate-400 mt-1">
            {l('تفعيل فوري للاشتراكات والخدمات', 'Instant subscription & services activation')}
          </span>
        </div>

        {/* SWIFT / Bank Wire */}
        <div className="bg-slate-950 border border-amber-600/40 p-4 rounded-2xl shadow hover:border-amber-500 transition-colors">
          <strong className="text-amber-400 block mb-1 text-xs sm:text-sm">
            {l('🏦 التحويل البنكي وحوالات SWIFT:', '🏦 SWIFT Wire & Invoicing:')}
          </strong>
          <a
            href="/payment"
            className="text-slate-100 font-bold hover:text-amber-300 transition-colors block text-sm"
          >
            {l('بوابات الدفع والفواتير الرسمية', 'Official Billing & Proforma Gateways')}
          </a>
          <span className="block text-xs text-slate-400 mt-1">
            {l('حسابات الشركات وفواتير Proforma', 'Corporate accounts & proforma invoices')}
          </span>
        </div>
      </div>
    </section>
  );
}
