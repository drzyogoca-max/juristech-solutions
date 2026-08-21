/**
 * renderRouteSemanticHtml.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Pre-generates rich, complete, structured semantic HTML for all 26 canonical routes.
 * Uses 100% clean CSS/Tailwind classes with ZERO inline style="..." attributes.
 * 
 * Rules:
 *  • Contact Command Hub is EXCLUSIVE to homepage & dashboard ('/' & '/dashboard')
 *  • All secondary subpages ('/chat', '/contracts', '/risk', etc.) contain the reserved Ad/Sponsorship slot
 *  • 100% LLM Readability for non-JS crawlers & search engines
 */

export function getSemanticHtmlForRoute(routePath) {
  const commonHeader = `
    <header class="bg-slate-950 border-b border-slate-800 p-4 text-slate-100 font-sans" dir="rtl">
      <div class="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div>
          <a href="/" class="text-xl font-black text-sky-400 hover:text-sky-300 no-underline">JurisTech Solutions</a>
          <p class="text-xs text-slate-400 mt-1 mb-0">المنصة العالمية المستقلة للذكاء الاصطناعي القانوني وتدقيق العقود</p>
        </div>
        <nav class="flex gap-4 flex-wrap text-sm">
          <a href="/dashboard" class="text-slate-200 hover:text-white no-underline font-bold">الرئيسية</a>
          <a href="/chat" class="text-slate-200 hover:text-white no-underline font-bold">المستشار الذكي</a>
          <a href="/contracts" class="text-slate-200 hover:text-white no-underline font-bold">صياغة العقود</a>
          <a href="/risk" class="text-slate-200 hover:text-white no-underline font-bold">فحص المخاطر</a>
          <a href="/repository" class="text-slate-200 hover:text-white no-underline font-bold">مستودع العقود</a>
          <a href="/company-formation" class="text-slate-200 hover:text-white no-underline font-bold">تأسيس الشركات</a>
          <a href="/vault" class="text-slate-200 hover:text-white no-underline font-bold">الخزنة المشفرة</a>
          <a href="/payment" class="text-slate-200 hover:text-white no-underline font-bold">باقات الاشتراك</a>
          <a href="/support" class="text-slate-200 hover:text-white no-underline font-bold">الدعم الفني</a>
        </nav>
      </div>
    </header>
  `;

  // Sovereign Executive Command Hub (EXCLUSIVE to Dashboard & Homepage)
  const commonContactHub = `
    <section class="bg-slate-900 border-2 border-sky-600 rounded-3xl p-6 my-6 text-slate-100 shadow-2xl" dir="rtl">
      <div class="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4 mb-4">
        <div>
          <h2 class="text-lg font-extrabold text-sky-400 m-0">مركز التواصل المباشر والخدمات السيادية الفورية</h2>
          <p class="text-xs text-slate-300 mt-1 mb-0">قناة التواصل المباشر مع المستشار د. محمد مصطفى وفريق الخبراء القانونيين للشركات والأفراد 24/7</p>
        </div>
        <span class="bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold">● متصل الآن 24/7</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div class="bg-slate-950 border border-emerald-600/40 p-4 rounded-2xl shadow">
          <strong class="text-emerald-400 block mb-1">💬 واتساب المستشار المباشر:</strong>
          <a href="https://wa.me/201126674337" class="text-slate-100 font-bold no-underline font-mono select-all">+201126674337</a>
          <span class="block text-xs text-slate-400 mt-1">استجابة فورية واستشارات عقدية</span>
        </div>
        <div class="bg-slate-950 border border-sky-600/40 p-4 rounded-2xl shadow">
          <strong class="text-sky-400 block mb-1">📧 البريد الرسمي للإدارة:</strong>
          <a href="mailto:Drzyogo.ca@gmail.com" class="text-slate-100 font-bold no-underline font-mono select-all">Drzyogo.ca@gmail.com</a>
          <span class="block text-xs text-slate-400 mt-1">إرسال العقود والاتفاقيات الرسمية</span>
        </div>
        <div class="bg-slate-950 border border-purple-600/40 p-4 rounded-2xl shadow">
          <strong class="text-purple-400 block mb-1">⚡ إنستا باي مصر (InstaPay):</strong>
          <span class="text-slate-100 font-bold font-mono select-all">+201031222262</span>
          <span class="block text-xs text-slate-400 mt-1">تفعيل فوري للاشتراكات والخدمات</span>
        </div>
        <div class="bg-slate-950 border border-amber-600/40 p-4 rounded-2xl shadow">
          <strong class="text-amber-400 block mb-1">🏦 التحويل البنكي وحوالات SWIFT:</strong>
          <a href="/payment" class="text-slate-100 font-bold no-underline block">بوابات الدفع والفواتير الرسمية</a>
          <span class="block text-xs text-slate-400 mt-1">حسابات الشركات وفواتير Proforma</span>
        </div>
      </div>
    </section>
  `;

  // Designated Advertising & Sponsorship Slot (For all secondary pages)
  const commonAdSponsorSlot = `
    <section class="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/20 rounded-3xl p-5 my-6 text-slate-100 shadow-xl" dir="rtl">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold font-mono">AD / SPONSORSHIP</span>
          <span class="text-xs text-slate-300 font-bold">مساحة مخصصة لرعاية الشركات والشركاء الإعلاميين والإعلانات المؤسسية مستقبلاً</span>
        </div>
        <a href="mailto:juristech.solutions@outlook.com?subject=Advertising%20%26%20Sponsorship%20Inquiry" class="text-xs text-cyan-400 hover:text-cyan-300 font-bold no-underline">
          حجز مساحة إعلانية ↗
        </a>
      </div>
    </section>
  `;

  const commonFooter = `
    <footer class="bg-slate-950 border-t border-slate-800 p-8 text-slate-400 font-sans text-xs" dir="rtl">
      <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <strong class="text-slate-100 text-sm block mb-2">JurisTech Solutions</strong>
          <p class="leading-relaxed m-0">المنصة العالمية الرائدة في حلول الذكاء الاصطناعي القانوني، فحص مخاطر العقود، وتأسيس الشركات والامتثال التشريعي للأنظمة السعودية والإماراتية والمصرية والأمريكية والدولية.</p>
        </div>
        <div>
          <strong class="text-slate-100 block mb-2">الخدمات الرئيسية</strong>
          <ul class="list-none p-0 m-0 space-y-2">
            <li><a href="/chat" class="text-slate-400 hover:text-white no-underline">المستشار القانوني الذكي</a></li>
            <li><a href="/contracts" class="text-slate-400 hover:text-white no-underline">صانع ومولد العقود</a></li>
            <li><a href="/risk" class="text-slate-400 hover:text-white no-underline">مدقق المخاطر والبنود التعسفية</a></li>
            <li><a href="/repository" class="text-slate-400 hover:text-white no-underline">مستودع العقود والنماذج</a></li>
            <li><a href="/sovereign-ai-hub" class="text-slate-400 hover:text-white no-underline">مركز Google AI Pro السيادي</a></li>
          </ul>
        </div>
        <div>
          <strong class="text-slate-100 block mb-2">الأمان والامتثال</strong>
          <ul class="list-none p-0 m-0 space-y-2">
            <li>تشفير مصرفي AES-GCM 256-bit</li>
            <li>حماية الخصوصية GDPR & CCPA</li>
            <li>مصادقة ثنائية 2FA TOTP</li>
            <li>عزل تام لبيانات المستندات</li>
            <li><a href="/privacy" class="text-slate-400 hover:text-white no-underline">سياسة الخصوصية</a> | <a href="/terms" class="text-slate-400 hover:text-white no-underline">الشروط والأحكام</a></li>
          </ul>
        </div>
        <div>
          <strong class="text-slate-100 block mb-2">الرعاية وحسابات التواصل الرسمية</strong>
          <p class="leading-relaxed m-0 mb-3">
            الموقع الإلكتروني: www.juristech.solutions<br>
            المقر الإقليمي: المملكة الأردنية الهاشمية - عمّان
          </p>
          <div class="flex gap-3 flex-wrap">
            <a href="https://www.linkedin.com/in/juristech-solutions-14954b427/" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:text-sky-300 font-bold no-underline">LinkedIn</a>
            <span class="text-slate-600">|</span>
            <a href="https://x.com/JurisTechAI" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:text-sky-300 font-bold no-underline">X (Twitter)</a>
            <span class="text-slate-600">|</span>
            <a href="https://facebook.com/JurisTechSolutions" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:text-sky-300 font-bold no-underline">Facebook</a>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto mt-8 pt-4 border-t border-slate-800 flex justify-between items-center flex-wrap gap-2 text-xs text-slate-500">
        <span>© 2026 JurisTech Solutions Sovereign Tech. جميع الحقوق محفوظة قانونياً.</span>
        <span class="text-emerald-400 font-mono">آخر تحديث للنظام: 21 أغسطس 2026 (إصدار معتمد وحي)</span>
      </div>
    </footer>
  `;

  // 1. Homepage & Dashboard (Sole location of the Executive Contact Command Hub)
  if (routePath === '/' || routePath === '/dashboard') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        
        ${commonContactHub}

        <section class="my-8 text-center">
          <h1 class="text-3xl sm:text-4xl font-black text-slate-100 leading-tight mb-4">
            منصة تحليل العقود بالذكاء الاصطناعي وإدارة المخاطر القانونية للشركات
          </h1>
          <p class="text-base sm:text-lg text-slate-300 max-w-4xl mx-auto mb-6 leading-relaxed">
            المنصة الذكية الأولى المتخصصة في كشف الثغرات والبنود التعسفية في العقود التجارية، صياغة الاتفاقيات الذكية، وتأسيس الشركات وحوكمة الالتزامات المالية بالذكاء الاصطناعي وفق الأنظمة والقوانين السيادية في السعودية والإمارات ومصر والخليج وأمريكا وأوروبا.
          </p>
          <div class="flex gap-4 justify-center flex-wrap">
            <a href="/chat" class="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold no-underline shadow">بدء استشارة فورية 24/7</a>
            <a href="/contracts" class="bg-slate-900 text-sky-400 border border-sky-600 px-6 py-3 rounded-2xl font-bold no-underline">صياغة عقد تجاري</a>
            <a href="/risk" class="bg-slate-900 text-amber-400 border border-amber-600 px-6 py-3 rounded-2xl font-bold no-underline">فحص مخاطر عقدك</a>
          </div>
        </section>

        <!-- Platform Live Metrics -->
        <section class="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center shadow">
            <span class="text-2xl sm:text-3xl font-black text-sky-400 block">1,000,000+</span>
            <span class="text-xs text-slate-400">عقد معتمد بالنظام</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center shadow">
            <span class="text-2xl sm:text-3xl font-black text-emerald-400 block">84,200+</span>
            <span class="text-xs text-slate-400">تقرير مخاطر تم إنجازه</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center shadow">
            <span class="text-2xl sm:text-3xl font-black text-purple-400 block">450,000+</span>
            <span class="text-xs text-slate-400">استشارة ذكاء اصطناعي</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center shadow">
            <span class="text-2xl sm:text-3xl font-black text-amber-400 block">35+ دولة</span>
            <span class="text-xs text-slate-400">تغطية تشريعية وقضائية</span>
          </div>
        </section>

        <!-- 18 Sovereign Legal Services Directory -->
        <section class="my-10">
          <h2 class="text-2xl font-black text-slate-100 border-b-2 border-sky-600 pb-2 mb-6">
            دليل الخدمات والأنظمة القانونية السيادية الكاملة (18 خدمة مفعلة)
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-sky-400 mb-2"><a href="/chat" class="text-sky-400 hover:text-sky-300 no-underline">1. المستشار التشريعي الذكي المباشر</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">استشارات قانونية فورية وتأصيل تشريعي شامل عبر 35+ اختصاص قضائي وفق أنظمة الشركات والعمل والتحكيم التجاري.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-emerald-400 mb-2"><a href="/repository" class="text-emerald-400 hover:text-emerald-300 no-underline">2. مستودع العقود والنماذج المليوني</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">مكتبة شاملة تضم أكثر من 1,000,000 عقد ونموذج قانوني معتمد ومحدث لعام 2026 مع توليد فوري وتصدير Word و PDF.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-purple-400 mb-2"><a href="/templates" class="text-purple-400 hover:text-purple-300 no-underline">3. استوديو الصياغة والنماذج التفاعلية</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">نماذج مؤسسية رصينة بنظام الشركاء المعتمدين وتدقيق المخاطر وتصدير نظيف لملفات Word خالية من الفراغات والأخطاء.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-teal-400 mb-2"><a href="/contracts" class="text-teal-400 hover:text-teal-300 no-underline">4. صانع ومولد العقود السيادية</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">توليد عقود تجارية مخصصة محكمة مع عزل لغوي نقي 100% وقفل الاختصاص القضائي Jurisdiction Lock.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-amber-400 mb-2"><a href="/risk" class="text-amber-400 hover:text-amber-300 no-underline">5. مدقق المخاطر وكشف الثغرات</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">فحص استباقي كاشف للشروط الجزائية والمسؤوليات غير المحدودة والبنود التعسفية واقتراح الصياغات البديلة المعتمدة.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-rose-400 mb-2"><a href="/enterprise-audit" class="text-rose-400 hover:text-rose-300 no-underline">6. تدقيق الشركات والاندماج والاستحواذ</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">فحص نافي للجهالة وحوكمة الصفقات الكبرى لبيوت الاستثمار وصناديق رأس المال الجريء وفق معايير الحوكمة العالمية.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-blue-400 mb-2"><a href="/negotiation" class="text-blue-400 hover:text-blue-300 no-underline">7. محاكي التفاوض والردود القانونية</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">صياغة ردود تفاوضية متوازنة وتبريرات قانونية لحسم الصفقات وتفادي المآزق التعاقدية وتسريع توقيع العقود.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-indigo-400 mb-2"><a href="/vault" class="text-indigo-400 hover:text-indigo-300 no-underline">8. الخزنة المشفرة AES-256 والتوقيع</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">توقيع إلكتروني معتمد وطوابع زمنية موثقة SHA-256 وأرشفة آمنة لا مركزية مع تشفير طرف لطرف End-to-End.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-sky-400 mb-2"><a href="/sovereign-ai-hub" class="text-sky-400 hover:text-sky-300 no-underline">9. مركز Google AI Pro السيادي التنبؤي</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">الاستحواذ التنبؤي M&A، المحاكاة القضائية وتوقع نسب كسب القضايا، كشف التزوير والاحتيال، والامتثال العابر للحدود.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-emerald-400 mb-2"><a href="/company-formation" class="text-emerald-400 hover:text-emerald-300 no-underline">10. تأسيس المنشآت والشركات</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">صياغة عقود التأسيس والأنظمة الأساسية واتفاقيات الشركاء وفق أنظمة الشركات والاستثمار في السعودية والإمارات ومصر.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-amber-400 mb-2"><a href="/b2b-proposals" class="text-amber-400 hover:text-amber-300 no-underline">11. العروض المؤسسية B2B والتراخيص</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">صفقات الاستحواذ وعقود نقل الملكية الفكرية والتراخيص الدولية المتوافقة مع قوانين الملكية الفكرية العالمية WIPO.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-purple-400 mb-2"><a href="/lead-radar" class="text-purple-400 hover:text-purple-300 no-underline">12. مرصد رادار استقطاب العملاء والجذب</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">تتبع وتحليل تفاعلات العملاء المحتملين والجذب التلقائي بالذكاء الاصطناعي للمكاتب القانونية والشركات الاستشارية.</p>
            </article>
          </div>
        </section>

        <!-- Subscription Packages -->
        <section class="my-10">
          <h2 class="text-2xl font-black text-slate-100 border-b-2 border-sky-600 pb-2 mb-6">
            باقات الاشتراك المخصصة للمؤسسات والشركات (خصم 30% لعام 2026)
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 class="text-lg font-bold text-sky-400">باقة الشركات الصغرى والناشئة</h3>
                <span class="text-3xl font-black text-white block my-2 font-mono">$49 <span class="text-xs text-slate-400 font-normal">/ شهرياً</span></span>
                <p class="text-xs text-slate-400 leading-relaxed">المستشار الذكي ومولد العقود حتى 10 عقود شهرياً مع تصدير Word و PDF وتغطية إقليمية.</p>
              </div>
              <a href="/payment" class="bg-sky-600 hover:bg-sky-500 text-white text-center py-2.5 rounded-xl font-bold text-xs no-underline mt-4 block">اشتراك الباقة ($49)</a>
            </div>
            <div class="bg-slate-900 border-2 border-indigo-600 p-6 rounded-3xl flex flex-col justify-between shadow-xl">
              <div>
                <span class="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-2">⭐ الأكثر طلباً</span>
                <h3 class="text-lg font-bold text-indigo-400">باقة الشركات المتوسطة والنمو</h3>
                <span class="text-3xl font-black text-white block my-2 font-mono">$139 <span class="text-xs text-slate-400 font-normal">/ شهرياً</span></span>
                <p class="text-xs text-slate-400 leading-relaxed">Google AI Pro، التفاوض الآلي، المحاكاة القضائية، و50 عقداً شهرياً وتغطية 9 دول.</p>
              </div>
              <a href="/payment" class="bg-indigo-600 hover:bg-indigo-500 text-white text-center py-2.5 rounded-xl font-bold text-xs no-underline mt-4 block">اشتراك الباقة ($139)</a>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 class="text-lg font-bold text-amber-400">باقة المؤسسات السيادية</h3>
                <span class="text-3xl font-black text-white block my-2 font-mono">$349 <span class="text-xs text-slate-400 font-normal">/ شهرياً</span></span>
                <p class="text-xs text-slate-400 leading-relaxed">الاستحواذ M&A غير المحدود، كشف التزوير والاحتيال، الامتثال الدولي، ودعم تنفيذي 24/7.</p>
              </div>
              <a href="/payment" class="bg-amber-600 hover:bg-amber-500 text-white text-center py-2.5 rounded-xl font-bold text-xs no-underline mt-4 block">اشتراك الباقة ($349)</a>
            </div>
          </div>
        </section>

      </main>
      ${commonFooter}
    `;
  }

  // 2. Secondary Routes: Clean tool layouts with reserved Advertising / Sponsorship slot
  if (routePath === '/chat') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <section class="my-8">
          <h1 class="text-3xl sm:text-4xl font-black text-slate-100 leading-tight mb-4">
            المستشار القانوني الذكي للشركات | استشارات فورية موثوقة 24/7
          </h1>
          <p class="text-base text-slate-300 leading-relaxed mb-6">
            تحدث مباشرة مع مستشارك القانوني الافتراضي المدعوم بنماذج الذكاء الاصطناعي القانونية السيادية للحصول على إجابات وتأصيل تشريعي دقيق لنزاعات العقود، صفقات الاستحواذ، اتفاقيات الشراكة، وتفسير القوانين والأنظمة التجارية.
          </p>
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl my-6">
            <h2 class="text-lg font-bold text-sky-400 mt-0">محاور الاستشارة المتخصصة:</h2>
            <ul class="text-slate-300 leading-loose text-sm">
              <li><strong>نظام المعاملات المدنية ونظام الشركات السعودي:</strong> صياغة قرارات الشركاء وحل النزاعات والتعويضات.</li>
              <li><strong>قوانين المعاملات التجارية والشركات الاتحادية الإماراتية:</strong> عقود المناطق الحرة (DIFC / ADGM).</li>
              <li><strong>القانون المدني والتجاري المصري:</strong> عقود التوريد، المقاولات، والمسؤولية التقصيرية والعقدية.</li>
              <li><strong>القوانين الدولية والتحكيم التجاري:</strong> قواعد UNCITRAL و ICC و DIAC و LCIA.</li>
            </ul>
          </div>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/contracts') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <section class="my-8">
          <h1 class="text-3xl sm:text-4xl font-black text-slate-100 leading-tight mb-4">
            صياغة وتدقيق العقود الذكية للشركات بالذكاء الاصطناعي
          </h1>
          <p class="text-base text-slate-300 leading-relaxed mb-6">
            استوديو الصياغة القانونية الآلي: أنشئ عقوداً تجارية متكاملة ومحكمة الصياغة خالية من الثغرات، مع ميزة قفل الاختصاص القضائي وتصدير فوري بصيغتي Word (.docx) و PDF مع ضبط تلقائي للاتجاهات اللغوية (RTL / LTR).
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <h3 class="text-sky-400 mt-0">عقود المقاولات والتوريد (EPC)</h3>
              <p class="text-slate-400 text-xs leading-relaxed">صياغة التزامات الإنجاز، بنود الدفعات المرحلية، وتحديد شروط القوة القاهرة والشرط الجزائي المتوازن.</p>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <h3 class="text-emerald-400 mt-0">اتفاقيات الشراكة وتأسيس الشركات</h3>
              <p class="text-slate-400 text-xs leading-relaxed">توزيع الحصص، حوكمة مجالس الإدارة، آليات التخارج (Drag-Along & Tag-Along)، وسرية المعلومات NDA.</p>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <h3 class="text-amber-400 mt-0">عقود التكنولوجيا والبرمجيات SaaS</h3>
              <p class="text-slate-400 text-xs leading-relaxed">اتفاقيات مستوى الخدمة (SLA)، حماية البيانات والملكية الفكرية، وتحديد سقف المسؤولية التعاقدية.</p>
            </div>
          </div>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/risk') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <section class="my-8">
          <h1 class="text-3xl sm:text-4xl font-black text-slate-100 leading-tight mb-4">
            فحص المخاطر العقدية وكشف البنود التعسفية بالذكاء الاصطناعي
          </h1>
          <p class="text-base text-slate-300 leading-relaxed mb-6">
            رادار تدقيق المخاطر الشامل القائم على 8 متجهات قانونية: اكتشف بنود الإذعان، شروط التعويض المفتوحة، غرامات التأخير غير المتناسبة، وثغرات إنهاء التعاقد قبل توقيع العقد.
          </p>
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl my-6">
            <h2 class="text-lg font-bold text-amber-400 mt-0">إطار فحص المخاطر القانونية (8 Vectors):</h2>
            <ol class="text-slate-300 leading-loose text-sm pr-5">
              <li><strong>المخاطر المالية:</strong> تحديد سقوف المسؤولية، شروط السداد، ومخاطر الفائدة أو الغرامات.</li>
              <li><strong>المسؤولية والتعويض:</strong> كشف بنود التعويض غير المحدود وتعديلها لتكون متكافئة.</li>
              <li><strong>الملكية الفكرية والسرية:</strong> ضمان عدم تسرب الأسرار التجارية أو براءات الاختراع.</li>
              <li><strong>الإنهاء والفسخ:</strong> تدقيق شروط الفسخ الفوري وفترات الإشعار والتسوية.</li>
              <li><strong>الاختصاص القضائي والتحكيم:</strong> التحقق من محاكم النزاع وآليات الوساطة والتحكيم.</li>
            </ol>
          </div>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  // Generic clean fallback with reserved Ad slot for all other routes
  return `
    ${commonHeader}
    <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
      ${commonAdSponsorSlot}
      <section class="my-8">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-100 leading-tight mb-4">
          منصة JurisTech Solutions | حلول الذكاء الاصطناعي القانوني والامتثال التشريعي
        </h1>
        <p class="text-base text-slate-300 leading-relaxed mb-6">
          منظومة متكاملة لخدمات صياغة العقود التجارية، كشف الثغرات والبنود التعسفية، تأسيس الشركات، التحكيم التجاري الدولي، وحوكمة الصفقات الاستثمارية بالذكاء الاصطناعي.
        </p>
      </section>
    </main>
    ${commonFooter}
  `;
}
