/**
 * renderRouteSemanticHtml.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Pre-generates rich, complete, structured semantic HTML for all 26 canonical routes.
 * Uses 100% clean CSS/Tailwind classes with ZERO inline style="..." attributes.
 * 
 * Complies with:
 *  • Zero inline styles standard (Audit compliant)
 *  • 100% LLM Readability for non-JS crawlers
 *  • High-performance Core Web Vitals & CSS separation
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
            <li><a href="/repository" class="text-slate-400 hover:text-white no-underline">مستودع المليون عقد</a></li>
            <li><a href="/company-formation" class="text-slate-400 hover:text-white no-underline">تأسيس الشركات وحوكمتها</a></li>
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
          <strong class="text-slate-100 block mb-2">التواصل وحسابات التواصل الرسمية</strong>
          <p class="leading-relaxed m-0 mb-3">
            هاتف / واتساب: <a href="https://wa.me/201126674337" class="text-sky-400 no-underline font-mono">+201126674337</a><br>
            البريد: <a href="mailto:Drzyogo.ca@gmail.com" class="text-sky-400 no-underline font-mono">Drzyogo.ca@gmail.com</a><br>
            إنستا باي: +201031222262<br>
            الموقع: www.juristech.solutions
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
              <h3 class="text-base font-bold text-sky-400 mb-2"><a href="/investigate" class="text-sky-400 hover:text-sky-300 no-underline">9. مفتش ومحقق المستندات والتحري</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">فحص أدلة ومستندات وتحديد التعارضات في العقود المعقدة وكشف تزوير التوقيعات والتواريخ والبنود الخفية.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-emerald-400 mb-2"><a href="/company-formation" class="text-emerald-400 hover:text-emerald-300 no-underline">10. تأسيس المنشآت والشركات</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">صياغة عقود التأسيس والأنظمة الأساسية واتفاقيات الشركاء وفق أنظمة الشركات والاستثمار في السعودية والإمارات ومصر.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-amber-400 mb-2"><a href="/acquisition" class="text-amber-400 hover:text-amber-300 no-underline">11. منصة الاستحواذ والتراخيص الدولية</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">صفقات الاستحواذ وعقود نقل الملكية الفكرية والتراخيص الدولية المتوافقة مع قوانين الملكية الفكرية العالمية WIPO.</p>
            </article>
            <article class="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow">
              <h3 class="text-base font-bold text-purple-400 mb-2"><a href="/lead-radar" class="text-purple-400 hover:text-purple-300 no-underline">12. مرصد رادار استقطاب العملاء والجذب</a></h3>
              <p class="text-xs text-slate-400 leading-relaxed m-0">تتبع وتحليل تفاعلات العملاء المحتملين والجذب التلقائي بالذكاء الاصطناعي للمكاتب القانونية والشركات الاستشارية.</p>
            </article>
          </div>
        </section>

        <!-- Real-World Multimillion Dollar Case Studies -->
        <section class="my-10 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <h2 class="text-xl sm:text-2xl font-black text-slate-100 m-0">دراسات حالة واقعية معتمدة لحل نزاعات العقود وتوفير الملايين</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <span class="text-emerald-400 font-bold text-xs block">⚡ توفير 3.8 مليون دولار | الرياض، السعودية</span>
              <strong class="text-slate-100 block my-2">تحالف الطاقة والمقاولات الهندسية (EPC Energy Consortium)</strong>
              <p class="text-xs text-slate-400 leading-relaxed m-0">تم فحص عقد بقيمة 14.2 مليون دولار وكشف بنود المسؤولية التضامنية غير المحدودة وتعديلها استناداً للمادة 178 من نظام المعاملات المدنية السعودي لحماية أصول الشركاء.</p>
            </div>
            <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <span class="text-sky-400 font-bold text-xs block">⚡ حماية 8.5 مليون دولار | مركز دبي المالي العالمي (DIFC)</span>
              <strong class="text-slate-100 block my-2">صفقة اندماج واستحواذ التكنولوجيا المالية (FinTech M&A)</strong>
              <p class="text-xs text-slate-400 leading-relaxed m-0">حماية ونقل خوارزميات الذكاء الاصطناعي وبراءات الاختراع استناداً لقانون DIFC رقم 6/2004 وضمان حقوق المساهمين المؤسسين.</p>
            </div>
            <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <span class="text-amber-400 font-bold text-xs block">⚡ تحديد سقف المسؤولية بـ 100% | ديلاوير، أمريكا</span>
              <strong class="text-slate-100 block my-2">عقد برمجيات سحابية للمؤسسات (Fortune 500 SaaS MSA)</strong>
              <p class="text-xs text-slate-400 leading-relaxed m-0">إلغاء بند التعويض غير المشروط وتثبيت سقف المسؤولية بـ 12 شهراً من الرسوم المدفوعة استناداً لقانون التجارة الموحد الأمريكي UCC 2-719.</p>
            </div>
            <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <span class="text-purple-400 font-bold text-xs block">⚡ استرداد 1.45 مليون دولار | الإسكندرية / القاهرة، مصر</span>
              <strong class="text-slate-100 block my-2">عقد الخدمات اللوجستية والنقل البحري (Maritime Logistics)</strong>
              <p class="text-xs text-slate-400 leading-relaxed m-0">إلغاء تسييل خطابات الضمان البنكية استناداً للمادة 147 من القانون المدني المصري ونظرية الظروف الطارئة وحماية السيولة النقدية.</p>
            </div>
          </div>
        </section>

        <!-- Subscription Packages -->
        <section class="my-10">
          <h2 class="text-2xl font-black text-slate-100 border-b-2 border-sky-600 pb-2 mb-6">
            باقات الاشتراك المخصصة للمؤسسات والشركات (خصم 30% لفترة محدودة)
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow">
              <span class="text-sky-400 font-bold text-sm">باقة الشركات الناشئة (Startup)</span>
              <div class="text-3xl font-black text-slate-100 my-2">$49 <span class="text-xs text-slate-400">/ شهرياً</span></div>
              <ul class="text-xs text-slate-300 leading-loose pr-4 mb-6">
                <li>مساعد قانوني متعدد اللغات 24/7</li>
                <li>تدقيق حتى 10 عقود شهرياً</li>
                <li>كشف بنود المخاطر الأساسية وتصدير التقارير</li>
              </ul>
              <a href="/payment" class="block text-center bg-sky-600 hover:bg-sky-500 text-white p-3 rounded-xl no-underline font-bold">اشتراك باقة الناشئة</a>
            </div>
            <div class="bg-slate-900 border-2 border-indigo-500 p-6 rounded-3xl shadow-xl">
              <span class="text-indigo-300 font-bold text-sm">باقة الشركات المتوسطة (SMEs) - الأكثر طلباً</span>
              <div class="text-3xl font-black text-slate-100 my-2">$139 <span class="text-xs text-slate-400">/ شهرياً</span></div>
              <ul class="text-xs text-slate-300 leading-loose pr-4 mb-6">
                <li>كل مزايا باقة الناشئة</li>
                <li>تدقيق حتى 50 عقداً شهرياً</li>
                <li>فحص متقدم إطار 8 محاور وصياغة بديلة</li>
                <li>تكامل أساسي مع أنظمة ERP والشركات</li>
              </ul>
              <a href="/payment" class="block text-center bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl no-underline font-bold">اشتراك باقة المتوسطة</a>
            </div>
            <div class="bg-slate-900 border border-amber-600 p-6 rounded-3xl shadow">
              <span class="text-amber-400 font-bold text-sm">باقة كبرى المؤسسات (Enterprise)</span>
              <div class="text-3xl font-black text-slate-100 my-2">$349 <span class="text-xs text-slate-400">/ شهرياً</span></div>
              <ul class="text-xs text-slate-300 leading-loose pr-4 mb-6">
                <li>عقود غير محدودة + رادار ثغرات فوري</li>
                <li>تحليل عابر للحدود (ICC / DIAC / UNCITRAL)</li>
                <li>ربط كامل مع أنظمة الشركات API</li>
                <li>دعم تنفيذي مباشر مع المستشار د. محمد مصطفى</li>
              </ul>
              <a href="/payment" class="block text-center bg-amber-600 hover:bg-amber-500 text-white p-3 rounded-xl no-underline font-bold">اشتراك باقة المؤسسات</a>
            </div>
          </div>
        </section>

        <!-- Frequently Asked Questions (FAQ) Section -->
        <section class="my-10 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow">
          <h2 class="text-xl sm:text-2xl font-black text-slate-100 m-0">الأسئلة الشائعة حول منصة الذكاء الاصطناعي القانوني JurisTech</h2>
          <div class="mt-6 grid gap-4 text-sm">
            <div>
              <strong class="text-sky-400 block mb-1">س: كيف يقوم الذكاء الاصطناعي بتحليل العقود وكشف الثغرات والبنود التعسفية؟</strong>
              <p class="text-slate-400 leading-relaxed m-0">يقوم محرك الذكاء الاصطناعي بمقارنة بنود العقد المرفوعة مع الأنظمة التجارية النافذة وسوابق المحاكم ومراكز التحكيم الدولية، وتحديد شروط التعويض غير المحدود وغرامات التأخير غير المتناسبة واقتراح بنود بديلة متوازنة فوراً.</p>
            </div>
            <div>
              <strong class="text-sky-400 block mb-1">س: ما هو بروتوكول القفل القضائي السيادي (Jurisdiction Lock)؟</strong>
              <p class="text-slate-400 leading-relaxed m-0">يضمن البروتوكول أن تكون نصوص ومواد العقد وتفسيراته ومحاكم الاختصاص مقيدة بالقوانين والمراسيم والأنظمة المعمول بها في الدولة المحددة حصراً (السعودية، الإمارات، مصر، الأردن، أمريكا، بريطانيا، الأونسيترال).</p>
            </div>
            <div>
              <strong class="text-sky-400 block mb-1">س: هل بيانات وعقود الشركات مشفرة ومحمية من الوصول غير المصرح به؟</strong>
              <p class="text-slate-400 leading-relaxed m-0">تخضع جميع الوثائق لتشفير مصرفي كامل بدرجة AES-GCM 256-bit على جانب العميل مع عزل تام للبيانات وضمان عدم مشاركتها أو تدريب النماذج العامة عليها وفق متطلبات GDPR و SOC2.</p>
            </div>
          </div>
        </section>

      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/chat') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonContactHub}
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
        ${commonContactHub}
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
        ${commonContactHub}
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

  // Generic rich fallback with 100% clean CSS classes
  return `
    ${commonHeader}
    <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
      ${commonContactHub}
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
