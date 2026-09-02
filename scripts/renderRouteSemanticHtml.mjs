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
            <li><a href="/privacy" class="text-slate-400 hover:text-white no-underline">سياسة الخصوصية</a> | <a href="/terms" class="text-slate-400 hover:text-white no-underline">الشروط والأحكام</a> | <a href="/refund" class="text-slate-400 hover:text-white no-underline">سياسة الاسترداد (Refund Policy)</a></li>
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

  if (routePath === '/privacy') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <article class="my-8 space-y-6">
          <header class="border-b border-slate-800 pb-6">
            <span class="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-wider">Official Legal Statement — GDPR & SDPL Compliant</span>
            <h1 class="text-3xl sm:text-5xl font-black text-slate-100 leading-tight mt-3 mb-2">
              سياسة الخصوصية وحماية البيانات الشخصية | JurisTech Privacy Policy
            </h1>
            <p class="text-xs text-slate-400 font-mono">تاريخ التحديث الأخير: 25 أغسطس 2026 | الإصدار المعتمد 4.2.0 | مسؤول حماية البيانات: juristech.solutions@outlook.com</p>
          </header>

          <div class="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-6 text-sm">
            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-cyan-400 m-0">1. المقدمة والالتزام بالحماية السيادية للبيانات (Introduction & Sovereign Data Pledge)</h2>
              <p>تلتزم منصة <strong>JurisTech Solutions</strong> بحماية الخصوصية والسرية التامة لكافة بيانات المستخدمين والعقود التجارية والوثائق المرفوعة. تخضع جميع عمليات جمع البيانات والمعالجة والتخزين لأعلى المعايير الأمنية العالمية وفقاً لنظام حماية البيانات الشخصية السعودي (SDPL)، لائحة حماية البيانات الاتحادية الإماراتية، اللائحة العامة لحماية البيانات الأوروبية (GDPR)، وتشريعات الخصوصية الأمريكية (CCPA/CPRA).</p>
            </section>

            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-emerald-400 m-0">2. المعلومات التي نجمعها (Information We Collect)</h2>
              <p>نجمع البيانات الضرورية فقط لتقديم وتطوير خدمات الذكاء الاصطناعي القانوني:</p>
              <ul class="list-disc pr-6 space-y-1 text-slate-300">
                <li><strong>بيانات الحساب والهوية:</strong> الاسم الكامل، البريد الإلكتروني المؤسسي، المسمى الوظيفي، واسم الشركة أو المكتب القانوني.</li>
                <li><strong>بيانات المستندات والعقود:</strong> نصوص العقود والاتفاقيات المرفوعة لأغراض الفحص والتدقيق الآلي فقط دون مشاركتها.</li>
                <li><strong>بيانات الجلسة والتقنيات:</strong> عنوان IP، نوع المتصفح، الروابط المزارة، والمؤشرات الفنية لضمان أمان النظام ومنع الاحتيال.</li>
              </ul>
            </section>

            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-purple-400 m-0">3. تشفير البيانات والعزل السيادي (Data Encryption & Sovereign Isolation)</h2>
              <p>يتم تشفير كافة البيانات والمستندات أثناء نقلها باستخدام بروتوكولات <strong>TLS 1.3 / HTTPS 256-bit</strong>، وأثناء تخزينها باستخدام تشفير <strong>AES-256 GCM</strong>. نضمن عدم استخدام العقود الخاصة بك أو بيانات شركتك لتنقيح أو تدريب أي نماذج ذكاء اصطناعي عامة ذات ملكية مشتركة.</p>
            </section>

            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-amber-400 m-0">4. عدم مشاركة البيانات وحظر البيع (Zero-Data Selling Mandate)</h2>
              <p>نؤكد بشكل حاسم وقاطع: <strong>JurisTech Solutions لا تبيع ولا تؤجر ولا تشارك</strong> أي بيانات شخصية أو عقود تجارية مع أي أطراف ثالثة أو شركات إعلانية أو وكالات تسويق تحت أي ظرف من الظروف.</p>
            </section>

            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-sky-400 m-0">5. حقوق المستخدم والتحكم في البيانات (User Rights & Data Control)</h2>
              <p>يحق لك في أي وقت: (1) طلب نسخة كاملة من بياناتك المخزنة، (2) طلب تصحيح أو تعديل أي بيانات غير دقيقة، (3) طلب حذف حسابك وكافة مستنداتك بشكل دائم من السيرفرات (Right to be Forgotten)، (4) تقديم اعتراض لمسؤول حماية البيانات عبر البريد الرسمى <code>juristech.solutions@outlook.com</code>.</p>
            </section>
          </div>
        </article>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/terms') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <article class="my-8 space-y-6">
          <header class="border-b border-slate-800 pb-6">
            <span class="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">Official Terms of Service — UNCITRAL & International Commercial Law Compliant</span>
            <h1 class="text-3xl sm:text-5xl font-black text-slate-100 leading-tight mt-3 mb-2">
              شروط وأحكام الخدمة واتفاقية الاستخدام | JurisTech Terms of Service
            </h1>
            <p class="text-xs text-slate-400 font-mono">تاريخ التحديث: 25 أغسطس 2026 | ملزمة قانونياً لكافة مستخدمي المنصة | الاستشارات: juristech.solutions@outlook.com</p>
          </header>

          <div class="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-6 text-sm">
            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-emerald-400 m-0">1. قبول الشروط والتأهيل الاستخدامي (Acceptance of Terms & Eligibility)</h2>
              <p>بوصولك أو استخدامك لمنصة <strong>JurisTech Solutions</strong>، فإنك تقر وتوافق على الالتزام الكامل بهذه الشروط والأحكام. إذا كنت تستخدم المنصة نيابة عن شركة أو كيان قانوني، فإنك تضمن امتلاكك الصلاحية النظامية الكاملة لإلزام ذلك الكيان بهذه الاتفاقية.</p>
            </section>

            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-sky-400 m-0">2. طبيعة الخدمات ومسؤولية الذكاء الاصطناعي (Nature of AI Legal Services)</h2>
              <p>تقدم المنصة أدوات ذكاء اصطناعي سيادية لتوليد العقود، فحص المخاطر، تدقيق البنود، واستشارات التحليل القانوني الآلي. تم تصميم هذه الأدوات لمساعدة المحامين، المستشارين القانونيين، ورؤساء الشركات. مخرجات الذكاء الاصطناعي تعتبر أدوات مساندة عالية الدقة ولا تغني عن المراجعة النهائية للمستشار القانوني المعتمد.</p>
            </section>

            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-amber-400 m-0">3. الملكية الفكرية والعقود الصادرة (Intellectual Property Rights)</h2>
              <p>تظل كافة العقود والاتفاقيات والتحليلات التي يقوم المستخدم بتوليدها أو تعديلها ملكاً خالصاً للمستخدم دون أي ادعاء ملكية من المنصة. وتظل المنصة مالكة لكافة حقوق الملكية الفكرية الخاصة بالخوارزميات، الواجهات، والتقنيات البرمجية.</p>
            </section>

            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-purple-400 m-0">4. باقات الاشتراك والاسترجاع والدفع (Billing, Subscriptions & Refund Terms)</h2>
              <p>تتم فوترة الاشتراكات شهرية أو سنوياً وفقاً للباقة المختارة ($49 باقة الناشئة، $139 باقة النمو، $349 باقة المؤسسات). يحق للمستخدم طلب إلغاء الاشتراك في أي وقت. يخضع استرجاع الأموال لسياسة الاسترجاع المعتمدة خلال 14 يوماً من تاريخ الاشتراك الأول شريطة عدم تجاوز استهلاك الاستشارات المحددة.</p>
            </section>

            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-cyan-400 m-0">5. القانون الواجب التطبيق وحل النزاعات (Governing Law & UNCITRAL Arbitration)</h2>
              <p>تخضع هذه الاتفاقية وتُفسر وفقاً للقوانين التجارية المعتمدة، ويتم تسوية أي نزاع ينشأ عنها عن طريق التحكيم التجاري وفقاً لقواعد لجنة الأمم المتحدة للقانون التجاري الدولي (UNCITRAL) أو المحاكم المختصة بمقر تسجيل الكيان.</p>
            </section>
          </div>
        </article>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/refund') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <article class="my-8 space-y-6">
          <header class="border-b border-slate-800 pb-6">
            <span class="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">Official Refund & Cancellation Policy — Consumer Rights Compliant</span>
            <h1 class="text-3xl sm:text-5xl font-black text-slate-100 leading-tight mt-3 mb-2">
              سياسة استرداد الأموال وإلغاء الاشتراك | JurisTech Refund Policy
            </h1>
            <p class="text-xs text-slate-400 font-mono">تاريخ التحديث: 25 أغسطس 2026 | مسؤول الدعم والفوترة: juristech.solutions@outlook.com</p>
          </header>

          <div class="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-6 text-sm">
            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-emerald-400 m-0">1. شروط وأهلية استرداد الأموال (Refund Eligibility)</h2>
              <p>تضمن <strong>JurisTech Solutions</strong> حق العميل في طلب استرداد المبالغ المدفوعة خلال 14 يوماً من تاريخ الاشتراك الأول، في حال عدم استخدام أكثر من 20% من حد الخدمة المتاح. تتم معالجة طلبات الاسترداد عبر مزود بوابة الدفع المعتمد Paddle (Merchant of Record).</p>
            </section>

            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-sky-400 m-0">2. آلية إلغاء الاشتراك (Subscription Cancellation)</h2>
              <p>يمكنك إلغاء تجديد الاشتراك في أي وقت من خلال لوحة التحكم أو عبر بوابة الإدارة الذاتية المتاحة. عند الإلغاء، يظل وصولك فعالاً حتى نهاية دوره الفوترة الحالية المدفوعة دون خصم أي مبالغ إضافية.</p>
            </section>

            <section class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 class="text-xl font-bold text-amber-400 m-0">3. تقديم طلب الاسترداد والجدول الزمني (Refund Processing & Support)</h2>
              <p>لتقديم طلب استرداد، يرجى مراسلة فريق الفوترة عبر البريد الرسمى <code>juristech.solutions@outlook.com</code> بكتّابة "Refund Request" في العنوان وتحديد بريد الحساب. يتم البت في الطلب وإعادة المبلغ لنفس طريقة الدفع خلال 5 إلى 10 أيام عمل.</p>
            </section>
          </div>
        </article>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/payment' || routePath === '/pricing' || routePath === '/billing') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <section class="my-8 text-center">
          <span class="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">Enterprise Pricing & Transparent Subscription Plans</span>
          <h1 class="text-3xl sm:text-5xl font-black text-slate-100 leading-tight mt-3 mb-4">
            باقات الاشتراك والحلول المالية المعتمدة للشركات لعام 2026
          </h1>
          <p class="text-base text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            اختر الباقة المناسبة لحجم أعمالك مع ضمانات الشفافية التامة، التفعيل الفوري، وتكلفة تقارن بـ 5% فقط من أتعاب المكاتب التقليدية.
          </p>

          <!-- Pricing Grid Cards (SSR Rendered for Search Engines & Bot Compliance) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 my-10 text-right">
            <!-- Startup Plan -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative">
              <div>
                <span class="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">باقة الشركات الناشئة</span>
                <h3 class="text-2xl font-black text-sky-400 mt-4 mb-2">Startup Legal AI Plan</h3>
                <p class="text-xs text-slate-400 leading-relaxed mb-6">مثالية للشركات الصغرى والمستقلين وصناع القرار الفرديين لتأمين العقود الأساسية.</p>
                <div class="my-4 border-y border-slate-800 py-4">
                  <span class="text-4xl font-black text-white font-mono">$49</span>
                  <span class="text-xs text-slate-400 font-mono"> / شهرياً</span>
                </div>
                <ul class="text-xs text-slate-300 space-y-3 my-6 list-none p-0">
                  <li class="flex items-center gap-2">✓ المستشار القانوني الذكي 24/7 (حتى 100 استشارة)</li>
                  <li class="flex items-center gap-2">✓ صياغة وتوليد 10 عقود شهرياً</li>
                  <li class="flex items-center gap-2">✓ فحص المخاطر والبنود التعسفية الأساسي</li>
                  <li class="flex items-center gap-2">✓ تصدير فوري بصيغة Word (.docx) و PDF</li>
                  <li class="flex items-center gap-2">✓ التغطية النظامية: السعودية، الإمارات، مصر</li>
                </ul>
              </div>
              <a href="/checkout?plan=startup" class="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-center no-underline block shadow-lg transition-all text-sm">
                اشترك الآن — باقة الناشئة ($49/mo)
              </a>
            </div>

            <!-- Growth Plan (Recommended) -->
            <div class="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative transform md:-translate-y-2">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow">
                ⭐ الأكثر طلباً للشركات والنمو
              </div>
              <div>
                <span class="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">باقة النمو والتوسع</span>
                <h3 class="text-2xl font-black text-indigo-400 mt-4 mb-2">Growth & M&A Plan</h3>
                <p class="text-xs text-slate-400 leading-relaxed mb-6">مصممة للشركات المتوسطة، بيوت الاستثمار، ومكاتب المحاماة ذات حجم الأعمال النشط.</p>
                <div class="my-4 border-y border-slate-800 py-4">
                  <span class="text-4xl font-black text-white font-mono">$139</span>
                  <span class="text-xs text-slate-400 font-mono"> / شهرياً</span>
                </div>
                <ul class="text-xs text-slate-300 space-y-3 my-6 list-none p-0">
                  <li class="flex items-center gap-2">✓ استشارات غير محدودة من Google AI Pro</li>
                  <li class="flex items-center gap-2">✓ صياغة وتوليد 50 عقداً شهرياً</li>
                  <li class="flex items-center gap-2">✓ فحص المخاطر عبر 8 متجهات قانونية شمولية</li>
                  <li class="flex items-center gap-2">✓ غرف التفاوض الآلي والتعديلات الذكية (Redlining)</li>
                  <li class="flex items-center gap-2">✓ التغطية النظامية: 9 دول (GCC + US + EU)</li>
                </ul>
              </div>
              <a href="/checkout?plan=growth" class="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-center no-underline block shadow-xl transition-all text-sm">
                اشترك الآن — باقة النمو ($139/mo)
              </a>
            </div>

            <!-- Enterprise Sovereign Plan -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative">
              <div>
                <span class="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">باقة المؤسسات والسيادة</span>
                <h3 class="text-2xl font-black text-amber-400 mt-4 mb-2">Sovereign Enterprise Plan</h3>
                <p class="text-xs text-slate-400 leading-relaxed mb-6">للمؤسسات الكبرى، البنوك، والمجموعات الاستثمارية التي تتطلب بيئة سيادية مخصصة.</p>
                <div class="my-4 border-y border-slate-800 py-4">
                  <span class="text-4xl font-black text-white font-mono">$349</span>
                  <span class="text-xs text-slate-400 font-mono"> / شهرياً</span>
                </div>
                <ul class="text-xs text-slate-300 space-y-3 my-6 list-none p-0">
                  <li class="flex items-center gap-2">✓ عقود واستشارات وتدقيق مخاطر غير محدود</li>
                  <li class="flex items-center gap-2">✓ كشف التزوير والاحتيال ومحاكاة القضايا</li>
                  <li class="flex items-center gap-2">✓ ربط API وسيرفرات سيادية مخصصة</li>
                  <li class="flex items-center gap-2">✓ دعم تنفيذي مباشر وإشعارات واتساب 24/7</li>
                  <li class="flex items-center gap-2">✓ التغطية النظامية: كافة الاختصاصات القضائية العالمية</li>
                </ul>
              </div>
              <a href="/checkout?plan=enterprise" class="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-center no-underline block shadow-lg transition-all text-sm">
                اشترك الآن — باقة المؤسسات ($349/mo)
              </a>
            </div>
          </div>

          <div class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl text-right max-w-4xl mx-auto my-8 space-y-3">
            <h3 class="text-lg font-bold text-sky-400 m-0">طرق الدفع والفوترة المعتمدة:</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              تتم معالجة كافة الاشتراكات والدفع الإلكتروني بأعلى مستويات الأمان عبر بوابة <strong>Paddle (Merchant of Record)</strong> المعتمدة عالمياً لبطاقات Visa و Mastercard و Apple Pay، إضافة إلى الفواتير الرسمية لحسابات الشركات (Proforma Invoices) والتحويلات البنكية المباشرة.
            </p>
          </div>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/about') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <section class="my-8">
          <h1 class="text-3xl sm:text-5xl font-black text-slate-100 leading-tight mb-4">
            عن المنصة والحوكمة المؤسسية | About JurisTech Solutions
          </h1>
          <p class="text-base text-slate-300 leading-relaxed mb-6">
            منصة <strong>JurisTech Solutions</strong> هي البنية التحتية العالمية الأولى المتخصصة في الذكاء الاصطناعي القانوني السيادي، صياغة وتدقيق العقود، حوكمة الشركات، والامتثال التنظيمي للشركات والمؤسسات الاستثمارية بإشراف المستشار د. محمد مصطفى.
          </p>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/support') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <section class="my-8">
          <h1 class="text-3xl sm:text-5xl font-black text-slate-100 leading-tight mb-4">
            مركز الدعم الفني والاستشارات المباشرة 24/7 | JurisTech Support
          </h1>
          <p class="text-base text-slate-300 leading-relaxed mb-6">
            فريق الدعم الفني والاستشاري المباشر متاح على مدار الساعة لمساعدة الشركات والمؤسسات في تفعيل الباقات، فحص العقود الحساسة، وحل أي استفسارات نظامية.
          </p>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/trust') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <section class="my-8">
          <h1 class="text-3xl sm:text-5xl font-black text-slate-100 leading-tight mb-4">
            مركز الثقة وأمان المعلومات | JurisTech Security & Trust Center
          </h1>
          <p class="text-base text-slate-300 leading-relaxed mb-6">
            بيئة أمنية سيادية مشفرة بمعايير التشفير البنكي AES-256 GCM و TLS 1.3 مع حماية كاملة للملكية الفكرية وعدم استخدام البيانات في تدريب النماذج العامة.
          </p>
        </section>
      </main>
      ${commonFooter}
    `;
  }

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

  if (routePath === '/deal-shield') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <section class="my-8">
          <h1 class="text-3xl sm:text-4xl font-black text-slate-100 leading-tight mb-4">
            رادار الصفقات ومستكشف الاحتياجات القانونية (DealShield 360™)
          </h1>
          <p class="text-base text-slate-300 leading-relaxed mb-6">
            محرك الذكاء الاصطناعي السيادي لتشخيص احتياجات الشركات وكشف الثغرات والاتفاقيات الإلزامية الناقصة، مع محاكاة التعارض التشريعي بين الأنظمة الدولية وصياغة البنود التوافقية الموحدة.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <h2 class="text-lg font-bold text-cyan-400 mt-0">1. المستكشف التشخيصي الذكي لاحتياجات الشركة</h2>
              <p class="text-xs text-slate-400 leading-relaxed">اكتب وصف صفقتك بلغة بسيطة ليقوم الذكاء الاصطناعي بتحليل المخاطر واستخراج العقود الواجب توقيعها فوراً.</p>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <h2 class="text-lg font-bold text-emerald-400 mt-0">2. محاكي الصفقات والتعارض التشريعي الدولي</h2>
              <p class="text-xs text-slate-400 leading-relaxed">فحص فوري لتوافق 2 إلى 3 أنظمة قضائية (السعودية، الإمارات، ديلاوير، بريطانيا) وتوليد البنود التوافقية المعتمدة.</p>
            </div>
          </div>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/youtube-studio' || routePath === '/youtube' || routePath === '/youtube-channel') {
    return `
      ${commonHeader}
      <main class="max-w-7xl mx-auto p-6 font-sans text-slate-100" dir="rtl">
        ${commonAdSponsorSlot}
        <section class="my-8">
          <h1 class="text-3xl sm:text-4xl font-black text-slate-100 leading-tight mb-4">
            إدارة قناة يوتيوب الرسمية والنشر اليومي الالي | JurisTech YouTube Studio
          </h1>
          <p class="text-base text-slate-300 leading-relaxed mb-6">
            استوديو الإدارة البرمجية لقناة يوتيوب الرسمية للمنصة المرتبطة بـ juristech.solutions@outlook.com بإشراف المستشار د. محمد مصطفى. توليد ونشر فيديوهات قانونية يومية صباحاً (09:00 AM) ومساءً (06:00 PM).
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <h2 class="text-lg font-bold text-red-500 mt-0">1. فيديو الصباح (Morning Briefing Slot - 9:00 AM UTC)</h2>
              <p class="text-xs text-slate-400 leading-relaxed">تحليل صفقات الاندماج والاستحواذ، مطابقة الأنظمة الدولية (ديلاوير، المعاملات المدنية م/191، دبي DIFC)، وفحوصات الشروط الفورية.</p>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <h2 class="text-lg font-bold text-cyan-400 mt-0">2. فيديو المساء (Evening Executive Briefing - 6:00 PM UTC)</h2>
              <p class="text-xs text-slate-400 leading-relaxed">إيجاز الإدارة العليا للرؤساء التنفيذيين والمدراء الماليين: الوقاية من فخاخ التعويض، خفض أتعاب المحاماة بنسبة 85%، والفواتير الأولية.</p>
            </div>
          </div>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/404') {
    return `
      ${commonHeader}
      <main class="max-w-4xl mx-auto p-8 font-sans text-slate-100 text-center my-12" dir="rtl">
        <h1 class="text-6xl sm:text-8xl font-black text-cyan-400 font-mono mb-4">404</h1>
        <h2 class="text-2xl font-bold text-slate-100 mb-4">عذراً، الصفحة أو الرابط المطلوب غير موجود</h2>
        <p class="text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
          يبدو أن الرابط القانوني أو المستند الذي تبحث عنه تم نقله أو تعديله. يمكنك العودة مباشرة إلى لوحة التحكم الرئيسية أو استخدام المستشار القانوني الذكي.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a href="/dashboard" class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-2xl font-bold no-underline shadow">العودة للرئيسية</a>
          <a href="/chat" class="bg-slate-900 text-cyan-400 border border-cyan-500 px-6 py-3 rounded-2xl font-bold no-underline">المستشار الذكي 24/7</a>
          <a href="/contracts" class="bg-slate-900 text-slate-200 border border-slate-700 px-6 py-3 rounded-2xl font-bold no-underline">صياغة العقود</a>
        </div>
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
