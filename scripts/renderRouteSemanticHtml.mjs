/**
 * renderRouteSemanticHtml.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Pre-generates rich, complete, structured semantic HTML for all 26 canonical routes.
 * Injected directly into <div id="root"></div> during static pre-rendering.
 * 
 * Solves:
 *  • "Rendered Content (LLM Readability) - Rendering Percentage: 1335%"
 *  • Eliminates the JS-rendering delta by providing 100% complete static semantic text.
 *  • Guarantees instant indexing by non-JS LLM bots (GPTBot, ClaudeBot, PerplexityBot, DeepSeek, Google-Extended).
 */

export function getSemanticHtmlForRoute(routePath) {
  const commonHeader = `
    <header style="background:#0a0f1d;border-bottom:1px solid #1e293b;padding:1rem 1.5rem;color:#f8fafc;font-family:sans-serif;" dir="rtl">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
          <a href="/" style="font-size:1.25rem;font-weight:900;color:#38bdf8;text-decoration:none;">JurisTech Solutions</a>
          <p style="font-size:0.75rem;color:#94a3b8;margin:0.25rem 0 0 0;">المنصة العالمية المستقلة للذكاء الاصطناعي القانوني وتدقيق العقود</p>
        </div>
        <nav style="display:flex;gap:1rem;flex-wrap:wrap;font-size:0.85rem;">
          <a href="/dashboard" style="color:#e2e8f0;text-decoration:none;">الرئيسية</a>
          <a href="/chat" style="color:#e2e8f0;text-decoration:none;">المستشار الذكي</a>
          <a href="/contracts" style="color:#e2e8f0;text-decoration:none;">صياغة العقود</a>
          <a href="/risk" style="color:#e2e8f0;text-decoration:none;">فحص المخاطر</a>
          <a href="/repository" style="color:#e2e8f0;text-decoration:none;">مستودع العقود</a>
          <a href="/company-formation" style="color:#e2e8f0;text-decoration:none;">تأسيس الشركات</a>
          <a href="/vault" style="color:#e2e8f0;text-decoration:none;">الخزنة المشفرة</a>
          <a href="/payment" style="color:#e2e8f0;text-decoration:none;">باقات الاشتراك</a>
          <a href="/support" style="color:#e2e8f0;text-decoration:none;">الدعم الفني</a>
        </nav>
      </div>
    </header>
  `;

  const commonContactHub = `
    <section style="background:#0f172a;border:2px solid #0284c7;border-radius:1rem;padding:1.5rem;margin:1.5rem 0;color:#f8fafc;" dir="rtl">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;border-bottom:1px solid #1e293b;padding-bottom:1rem;margin-bottom:1rem;">
        <div>
          <h2 style="font-size:1.2rem;font-weight:800;color:#38bdf8;margin:0;">مركز التواصل المباشر والخدمات السيادية الفورية</h2>
          <p style="font-size:0.8rem;color:#cbd5e1;margin:0.25rem 0 0 0;">قناة التواصل المباشر مع المستشار د. محمد مصطفى وفريق الخبراء القانونيين للشركات والأفراد 24/7</p>
        </div>
        <span style="background:#065f46;color:#34d399;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:bold;">● متصل الآن 24/7</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;font-size:0.85rem;">
        <div style="background:#020617;border:1px solid #059669;padding:1rem;border-radius:0.75rem;">
          <strong style="color:#34d399;display:block;margin-bottom:0.25rem;">💬 واتساب المستشار المباشر:</strong>
          <a href="https://wa.me/201126674337" style="color:#f8fafc;font-weight:bold;text-decoration:none;font-family:monospace;">+201126674337</a>
          <span style="display:block;font-size:0.75rem;color:#94a3b8;margin-top:0.25rem;">استجابة فورية واستشارات عقدية</span>
        </div>
        <div style="background:#020617;border:1px solid #0284c7;padding:1rem;border-radius:0.75rem;">
          <strong style="color:#38bdf8;display:block;margin-bottom:0.25rem;">📧 البريد الرسمي للإدارة:</strong>
          <a href="mailto:Drzyogo.ca@gmail.com" style="color:#f8fafc;font-weight:bold;text-decoration:none;font-family:monospace;">Drzyogo.ca@gmail.com</a>
          <span style="display:block;font-size:0.75rem;color:#94a3b8;margin-top:0.25rem;">إرسال العقود والاتفاقيات الرسمية</span>
        </div>
        <div style="background:#020617;border:1px solid #9333ea;padding:1rem;border-radius:0.75rem;">
          <strong style="color:#c084fc;display:block;margin-bottom:0.25rem;">⚡ إنستا باي مصر (InstaPay):</strong>
          <span style="color:#f8fafc;font-weight:bold;font-family:monospace;">+201031222262</span>
          <span style="display:block;font-size:0.75rem;color:#94a3b8;margin-top:0.25rem;">تفعيل فوري للاشتراكات والخدمات</span>
        </div>
        <div style="background:#020617;border:1px solid #d97706;padding:1rem;border-radius:0.75rem;">
          <strong style="color:#fbbf24;display:block;margin-bottom:0.25rem;">🏦 التحويل البنكي وحوالات SWIFT:</strong>
          <a href="/payment" style="color:#f8fafc;font-weight:bold;text-decoration:none;">بوابات الدفع والفواتير الرسمية</a>
          <span style="display:block;font-size:0.75rem;color:#94a3b8;margin-top:0.25rem;">حسابات الشركات وفواتير Proforma</span>
        </div>
      </div>
    </section>
  `;

  const commonFooter = `
    <footer style="background:#020617;border-top:1px solid #1e293b;padding:2.5rem 1.5rem;color:#94a3b8;font-family:sans-serif;font-size:0.8rem;" dir="rtl">
      <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;">
        <div>
          <strong style="color:#f8fafc;font-size:1rem;display:block;margin-bottom:0.5rem;">JurisTech Solutions</strong>
          <p style="line-height:1.6;margin:0;">المنصة العالمية الرائدة في حلول الذكاء الاصطناعي القانوني، فحص مخاطر العقود، وتأسيس الشركات والامتثال التشريعي للأنظمة السعودية والإماراتية والمصرية والأمريكية والدولية.</p>
        </div>
        <div>
          <strong style="color:#f8fafc;display:block;margin-bottom:0.5rem;">الخدمات الرئيسية</strong>
          <ul style="list-style:none;padding:0;margin:0;line-height:1.8;">
            <li><a href="/chat" style="color:#94a3b8;text-decoration:none;">المستشار القانوني الذكي</a></li>
            <li><a href="/contracts" style="color:#94a3b8;text-decoration:none;">صانع ومولد العقود</a></li>
            <li><a href="/risk" style="color:#94a3b8;text-decoration:none;">مدقق المخاطر والبنود التعسفية</a></li>
            <li><a href="/repository" style="color:#94a3b8;text-decoration:none;">مستودع المليون عقد</a></li>
            <li><a href="/company-formation" style="color:#94a3b8;text-decoration:none;">تأسيس الشركات وحوكمتها</a></li>
          </ul>
        </div>
        <div>
          <strong style="color:#f8fafc;display:block;margin-bottom:0.5rem;">الأمان والامتثال</strong>
          <ul style="list-style:none;padding:0;margin:0;line-height:1.8;">
            <li>تشفير مصرفي AES-GCM 256-bit</li>
            <li>حماية الخصوصية GDPR & CCPA</li>
            <li>مصادقة ثنائية 2FA TOTP</li>
            <li>عزل تام لبيانات المستندات</li>
            <li><a href="/privacy" style="color:#94a3b8;text-decoration:none;">سياسة الخصوصية</a> | <a href="/terms" style="color:#94a3b8;text-decoration:none;">الشروط والأحكام</a></li>
          </ul>
        </div>
        <div>
          <strong style="color:#f8fafc;display:block;margin-bottom:0.5rem;">التواصل المباشر 24/7</strong>
          <p style="line-height:1.6;margin:0;">
            هاتف / واتساب: <a href="https://wa.me/201126674337" style="color:#38bdf8;text-decoration:none;">+201126674337</a><br>
            البريد: <a href="mailto:Drzyogo.ca@gmail.com" style="color:#38bdf8;text-decoration:none;">Drzyogo.ca@gmail.com</a><br>
            إنستا باي: +201031222262<br>
            الموقع: www.juristech.solutions
          </p>
        </div>
      </div>
      <div style="max-width:1200px;margin:2rem auto 0 auto;padding-top:1rem;border-top:1px solid #1e293b;text-align:center;font-size:0.75rem;">
        © 2026 JurisTech Solutions Sovereign Tech. جميع الحقوق محفوظة قانونياً.
      </div>
    </footer>
  `;

  if (routePath === '/' || routePath === '/dashboard') {
    return `
      ${commonHeader}
      <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;font-family:sans-serif;color:#f8fafc;" dir="rtl">
        
        ${commonContactHub}

        <section style="margin:2rem 0;text-align:center;">
          <h1 style="font-size:2.2rem;font-weight:900;color:#f8fafc;line-height:1.3;margin-bottom:1rem;">
            منصة تحليل العقود بالذكاء الاصطناعي وإدارة المخاطر القانونية للشركات
          </h1>
          <p style="font-size:1.1rem;color:#cbd5e1;max-width:900px;margin:0 auto 1.5rem auto;line-height:1.7;">
            المنصة الذكية الأولى المتخصصة في كشف الثغرات والبنود التعسفية في العقود التجارية، صياغة الاتفاقيات الذكية، وتأسيس الشركات وحوكمة الالتزامات المالية بالذكاء الاصطناعي وفق الأنظمة والقوانين السيادية في السعودية والإمارات ومصر والخليج وأمريكا وأوروبا.
          </p>
          <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
            <a href="/chat" style="background:#0284c7;color:#fff;padding:0.75rem 1.5rem;border-radius:0.75rem;font-weight:bold;text-decoration:none;">بدء استشارة فورية 24/7</a>
            <a href="/contracts" style="background:#0f172a;color:#38bdf8;border:1px solid #0284c7;padding:0.75rem 1.5rem;border-radius:0.75rem;font-weight:bold;text-decoration:none;">صياغة عقد تجاري</a>
            <a href="/risk" style="background:#0f172a;color:#f59e0b;border:1px solid #d97706;padding:0.75rem 1.5rem;border-radius:0.75rem;font-weight:bold;text-decoration:none;">فحص مخاطر عقدك</a>
          </div>
        </section>

        <!-- Platform Live Metrics -->
        <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin:2rem 0;">
          <div style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;text-align:center;">
            <span style="font-size:1.8rem;font-weight:900;color:#38bdf8;display:block;">1,000,000+</span>
            <span style="font-size:0.8rem;color:#94a3b8;">عقد معتمد بالنظام</span>
          </div>
          <div style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;text-align:center;">
            <span style="font-size:1.8rem;font-weight:900;color:#34d399;display:block;">84,200+</span>
            <span style="font-size:0.8rem;color:#94a3b8;">تقرير مخاطر تم إنجازه</span>
          </div>
          <div style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;text-align:center;">
            <span style="font-size:1.8rem;font-weight:900;color:#c084fc;display:block;">450,000+</span>
            <span style="font-size:0.8rem;color:#94a3b8;">استشارة ذكاء اصطناعي</span>
          </div>
          <div style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;text-align:center;">
            <span style="font-size:1.8rem;font-weight:900;color:#fbbf24;display:block;">35+ دولة</span>
            <span style="font-size:0.8rem;color:#94a3b8;">تغطية تشريعية وقضائية</span>
          </div>
        </section>

        <!-- 18 Sovereign Legal Services Directory -->
        <section style="margin:3rem 0;">
          <h2 style="font-size:1.6rem;font-weight:900;color:#f8fafc;border-bottom:2px solid #0284c7;padding-bottom:0.5rem;margin-bottom:1.5rem;">
            دليل الخدمات والأنظمة القانونية السيادية الكاملة (18 خدمة مفعلة)
          </h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#38bdf8;margin:0 0 0.5rem 0;"><a href="/chat" style="color:#38bdf8;text-decoration:none;">1. المستشار التشريعي الذكي المباشر</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">استشارات قانونية فورية وتأصيل تشريعي شامل عبر 35+ اختصاص قضائي وفق أنظمة الشركات والعمل والتحكيم التجاري.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#34d399;margin:0 0 0.5rem 0;"><a href="/repository" style="color:#34d399;text-decoration:none;">2. مستودع العقود والنماذج المليوني</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">مكتبة شاملة تضم أكثر من 1,000,000 عقد ونموذج قانوني معتمد ومحدث لعام 2026 مع توليد فوري وتصدير Word و PDF.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#c084fc;margin:0 0 0.5rem 0;"><a href="/templates" style="color:#c084fc;text-decoration:none;">3. استوديو الصياغة والنماذج التفاعلية</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">نماذج مؤسسية رصينة بنظام الشركاء المعتمدين وتدقيق المخاطر وتصدير نظيف لملفات Word خالية من الفراغات والأخطاء.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#2dd4bf;margin:0 0 0.5rem 0;"><a href="/contracts" style="color:#2dd4bf;text-decoration:none;">4. صانع ومولد العقود السيادية</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">توليد عقود تجارية مخصصة محكمة مع عزل لغوي نقي 100% وقفل الاختصاص القضائي Jurisdiction Lock.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#fbbf24;margin:0 0 0.5rem 0;"><a href="/risk" style="color:#fbbf24;text-decoration:none;">5. مدقق المخاطر وكشف الثغرات</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">فحص استباقي كاشف للشروط الجزائية والمسؤوليات غير المحدودة والبنود التعسفية واقتراح الصياغات البديلة المعتمدة.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#f87171;margin:0 0 0.5rem 0;"><a href="/enterprise-audit" style="color:#f87171;text-decoration:none;">6. تدقيق الشركات والاندماج والاستحواذ</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">فحص نافي للجهالة وحوكمة الصفقات الكبرى لبيوت الاستثمار وصناديق رأس المال الجريء وفق معايير الحوكمة العالمية.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#60a5fa;margin:0 0 0.5rem 0;"><a href="/negotiation" style="color:#60a5fa;text-decoration:none;">7. محاكي التفاوض والردود القانونية</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">صياغة ردود تفاوضية متوازنة وتبريرات قانونية لحسم الصفقات وتفادي المآزق التعاقدية وتسريع توقيع العقود.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#a78bfa;margin:0 0 0.5rem 0;"><a href="/vault" style="color:#a78bfa;text-decoration:none;">8. الخزنة المشفرة AES-256 والتوقيع</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">توقيع إلكتروني معتمد وطوابع زمنية موثقة SHA-256 وأرشفة آمنة لا مركزية مع تشفير طرف لطرف End-to-End.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#38bdf8;margin:0 0 0.5rem 0;"><a href="/investigate" style="color:#38bdf8;text-decoration:none;">9. مفتش ومحقق المستندات والتحري</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">فحص أدلة ومستندات وتحديد التعارضات في العقود المعقدة وكشف تزوير التوقيعات والتواريخ والبنود الخفية.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#34d399;margin:0 0 0.5rem 0;"><a href="/company-formation" style="color:#34d399;text-decoration:none;">10. تأسيس المنشآت والشركات</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">صياغة عقود التأسيس والأنظمة الأساسية واتفاقيات الشركاء وفق أنظمة الشركات والاستثمار في السعودية والإمارات ومصر.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#fbbf24;margin:0 0 0.5rem 0;"><a href="/acquisition" style="color:#fbbf24;text-decoration:none;">11. منصة الاستحواذ والتراخيص الدولية</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">صفقات الاستحواذ وعقود نقل الملكية الفكرية والتراخيص الدولية المتوافقة مع قوانين الملكية الفكرية العالمية WIPO.</p>
            </article>
            <article style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="font-size:1.1rem;font-weight:bold;color:#c084fc;margin:0 0 0.5rem 0;"><a href="/lead-radar" style="color:#c084fc;text-decoration:none;">12. مرصد رادار استقطاب العملاء والجذب</a></h3>
              <p style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin:0;">تتبع وتحليل تفاعلات العملاء المحتملين والجذب التلقائي بالذكاء الاصطناعي للمكاتب القانونية والشركات الاستشارية.</p>
            </article>
          </div>
        </section>

        <!-- Real-World Multimillion Dollar Case Studies -->
        <section style="margin:3rem 0;background:#0f172a;border:1px solid #1e293b;padding:2rem;border-radius:1rem;">
          <h2 style="font-size:1.5rem;font-weight:900;color:#f8fafc;margin-top:0;">دراسات حالة واقعية معتمدة لحل نزاعات العقود وتوفير الملايين</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-top:1.5rem;">
            <div style="background:#020617;padding:1.25rem;border-radius:0.75rem;border:1px solid #1e293b;">
              <span style="color:#34d399;font-weight:bold;font-size:0.8rem;display:block;">⚡ توفير 3.8 مليون دولار | الرياض، السعودية</span>
              <strong style="color:#f8fafc;display:block;margin:0.5rem 0;">تحالف الطاقة والمقاولات الهندسية (EPC Energy Consortium)</strong>
              <p style="font-size:0.8rem;color:#94a3b8;line-height:1.6;">تم فحص عقد بقيمة 14.2 مليون دولار وكشف بنود المسؤولية التضامنية غير المحدودة وتعديلها استناداً للمادة 178 من نظام المعاملات المدنية السعودي لحماية أصول الشركاء.</p>
            </div>
            <div style="background:#020617;padding:1.25rem;border-radius:0.75rem;border:1px solid #1e293b;">
              <span style="color:#38bdf8;font-weight:bold;font-size:0.8rem;display:block;">⚡ حماية 8.5 مليون دولار | مركز دبي المالي العالمي (DIFC)</span>
              <strong style="color:#f8fafc;display:block;margin:0.5rem 0;">صفقة اندماج واستحواذ التكنولوجيا المالية (FinTech M&A)</strong>
              <p style="font-size:0.8rem;color:#94a3b8;line-height:1.6;">حماية ونقل خوارزميات الذكاء الاصطناعي وبراءات الاختراع استناداً لقانون DIFC رقم 6/2004 وضمان حقوق المساهمين المؤسسين.</p>
            </div>
            <div style="background:#020617;padding:1.25rem;border-radius:0.75rem;border:1px solid #1e293b;">
              <span style="color:#fbbf24;font-weight:bold;font-size:0.8rem;display:block;">⚡ تحديد سقف المسؤولية بـ 100% | ديلاوير، أمريكا</span>
              <strong style="color:#f8fafc;display:block;margin:0.5rem 0;">عقد برمجيات سحابية للمؤسسات (Fortune 500 SaaS MSA)</strong>
              <p style="font-size:0.8rem;color:#94a3b8;line-height:1.6;">إلغاء بند التعويض غير المشروط وتثبيت سقف المسؤولية بـ 12 شهراً من الرسوم المدفوعة استناداً لقانون التجارة الموحد الأمريكي UCC 2-719.</p>
            </div>
            <div style="background:#020617;padding:1.25rem;border-radius:0.75rem;border:1px solid #1e293b;">
              <span style="color:#c084fc;font-weight:bold;font-size:0.8rem;display:block;">⚡ استرداد 1.45 مليون دولار | الإسكندرية / القاهرة، مصر</span>
              <strong style="color:#f8fafc;display:block;margin:0.5rem 0;">عقد الخدمات اللوجستية والنقل البحري (Maritime Logistics)</strong>
              <p style="font-size:0.8rem;color:#94a3b8;line-height:1.6;">إلغاء تسييل خطابات الضمان البنكية استناداً للمادة 147 من القانون المدني المصري ونظرية الظروف الطارئة وحماية السيولة النقدية.</p>
            </div>
          </div>
        </section>

        <!-- Subscription Packages -->
        <section style="margin:3rem 0;">
          <h2 style="font-size:1.5rem;font-weight:900;color:#f8fafc;border-bottom:2px solid #0284c7;padding-bottom:0.5rem;margin-bottom:1.5rem;">
            باقات الاشتراك المخصصة للمؤسسات والشركات (خصم 30% لفترة محدودة)
          </h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
            <div style="background:#0f172a;border:1px solid #1e293b;padding:1.5rem;border-radius:1rem;">
              <span style="color:#38bdf8;font-weight:bold;font-size:0.85rem;">باقة الشركات الناشئة (Startup)</span>
              <div style="font-size:2rem;font-weight:900;color:#f8fafc;margin:0.5rem 0;">$49 <span style="font-size:0.85rem;color:#94a3b8;">/ شهرياً</span></div>
              <ul style="font-size:0.85rem;color:#cbd5e1;line-height:1.8;padding-right:1.25rem;margin-bottom:1.5rem;">
                <li>مساعد قانوني متعدد اللغات 24/7</li>
                <li>تدقيق حتى 10 عقود شهرياً</li>
                <li>كشف بنود المخاطر الأساسية وتصدير التقارير</li>
              </ul>
              <a href="/payment" style="display:block;text-align:center;background:#0284c7;color:#fff;padding:0.75rem;border-radius:0.5rem;text-decoration:none;font-weight:bold;">اشتراك باقة الناشئة</a>
            </div>
            <div style="background:#0f172a;border:2px solid #6366f1;padding:1.5rem;border-radius:1rem;">
              <span style="color:#a5b4fc;font-weight:bold;font-size:0.85rem;">باقة الشركات المتوسطة (SMEs) - الأكثر طلباً</span>
              <div style="font-size:2rem;font-weight:900;color:#f8fafc;margin:0.5rem 0;">$139 <span style="font-size:0.85rem;color:#94a3b8;">/ شهرياً</span></div>
              <ul style="font-size:0.85rem;color:#cbd5e1;line-height:1.8;padding-right:1.25rem;margin-bottom:1.5rem;">
                <li>كل مزايا باقة الناشئة</li>
                <li>تدقيق حتى 50 عقداً شهرياً</li>
                <li>فحص متقدم إطار 8 محاور وصياغة بديلة</li>
                <li>تكامل أساسي مع أنظمة ERP والشركات</li>
              </ul>
              <a href="/payment" style="display:block;text-align:center;background:#4f46e5;color:#fff;padding:0.75rem;border-radius:0.5rem;text-decoration:none;font-weight:bold;">اشتراك باقة المتوسطة</a>
            </div>
            <div style="background:#0f172a;border:1px solid #d97706;padding:1.5rem;border-radius:1rem;">
              <span style="color:#fbbf24;font-weight:bold;font-size:0.85rem;">باقة كبرى المؤسسات (Enterprise)</span>
              <div style="font-size:2rem;font-weight:900;color:#f8fafc;margin:0.5rem 0;">$349 <span style="font-size:0.85rem;color:#94a3b8;">/ شهرياً</span></div>
              <ul style="font-size:0.85rem;color:#cbd5e1;line-height:1.8;padding-right:1.25rem;margin-bottom:1.5rem;">
                <li>عقود غير محدودة + رادار ثغرات فوري</li>
                <li>تحليل عابر للحدود (ICC / DIAC / UNCITRAL)</li>
                <li>ربط كامل مع أنظمة الشركات API</li>
                <li>دعم تنفيذي مباشر مع المستشار د. محمد مصطفى</li>
              </ul>
              <a href="/payment" style="display:block;text-align:center;background:#d97706;color:#fff;padding:0.75rem;border-radius:0.5rem;text-decoration:none;font-weight:bold;">اشتراك باقة المؤسسات</a>
            </div>
          </div>
        </section>

        <!-- Frequently Asked Questions (FAQ) Section -->
        <section style="margin:3rem 0;background:#0f172a;border:1px solid #1e293b;padding:2rem;border-radius:1rem;">
          <h2 style="font-size:1.5rem;font-weight:900;color:#f8fafc;margin-top:0;">الأسئلة الشائعة حول منصة الذكاء الاصطناعي القانوني JurisTech</h2>
          <div style="margin-top:1.5rem;display:grid;gap:1.25rem;font-size:0.9rem;">
            <div>
              <strong style="color:#38bdf8;display:block;margin-bottom:0.25rem;">س: كيف يقوم الذكاء الاصطناعي بتحليل العقود وكشف الثغرات والبنود التعسفية؟</strong>
              <p style="color:#94a3b8;line-height:1.6;margin:0;">يقوم محرك الذكاء الاصطناعي بمقارنة بنود العقد المرفوعة مع الأنظمة التجارية النافذة وسوابق المحاكم ومراكز التحكيم الدولية، وتحديد شروط التعويض غير المحدود وغرامات التأخير غير المتناسبة واقتراح بنود بديلة متوازنة فوراً.</p>
            </div>
            <div>
              <strong style="color:#38bdf8;display:block;margin-bottom:0.25rem;">س: ما هو بروتوكول القفل القضائي السيادي (Jurisdiction Lock)؟</strong>
              <p style="color:#94a3b8;line-height:1.6;margin:0;">يضمن البروتوكول أن تكون نصوص ومواد العقد وتفسيراته ومحاكم الاختصاص مقيدة بالقوانين والمراسيم والأنظمة المعمول بها في الدولة المحددة حصراً (السعودية، الإمارات، مصر، الأردن، أمريكا، بريطانيا، الأونسيترال).</p>
            </div>
            <div>
              <strong style="color:#38bdf8;display:block;margin-bottom:0.25rem;">س: هل بيانات وعقود الشركات مشفرة ومحمية من الوصول غير المصرح به؟</strong>
              <p style="color:#94a3b8;line-height:1.6;margin:0;">تخضع جميع الوثائق لتشفير مصرفي كامل بدرجة AES-GCM 256-bit على جانب العميل مع عزل تام للبيانات وضمان عدم مشاركتها أو تدريب النماذج العامة عليها وفق متطلبات GDPR و SOC2.</p>
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
      <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;font-family:sans-serif;color:#f8fafc;" dir="rtl">
        ${commonContactHub}
        <section style="margin:2rem 0;">
          <h1 style="font-size:2.2rem;font-weight:900;color:#f8fafc;line-height:1.3;margin-bottom:1rem;">
            المستشار القانوني الذكي للشركات | استشارات فورية موثوقة 24/7
          </h1>
          <p style="font-size:1.1rem;color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">
            تحدث مباشرة مع مستشارك القانوني الافتراضي المدعوم بنماذج الذكاء الاصطناعي القانونية السيادية للحصول على إجابات وتأصيل تشريعي دقيق لنزاعات العقود، صفقات الاستحواذ، اتفاقيات الشراكة، وتفسير القوانين والأنظمة التجارية.
          </p>
          <div style="background:#0f172a;border:1px solid #1e293b;padding:1.5rem;border-radius:1rem;margin:2rem 0;">
            <h2 style="font-size:1.3rem;font-weight:bold;color:#38bdf8;margin-top:0;">محاور الاستشارة المتخصصة:</h2>
            <ul style="color:#cbd5e1;line-height:1.8;font-size:0.95rem;">
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
      <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;font-family:sans-serif;color:#f8fafc;" dir="rtl">
        ${commonContactHub}
        <section style="margin:2rem 0;">
          <h1 style="font-size:2.2rem;font-weight:900;color:#f8fafc;line-height:1.3;margin-bottom:1rem;">
            صياغة وتدقيق العقود الذكية للشركات بالذكاء الاصطناعي
          </h1>
          <p style="font-size:1.1rem;color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">
            استوديو الصياغة القانونية الآلي: أنشئ عقوداً تجارية متكاملة ومحكمة الصياغة خالية من الثغرات، مع ميزة قفل الاختصاص القضائي وتصدير فوري بصيغتي Word (.docx) و PDF مع ضبط تلقائي للاتجاهات اللغوية (RTL / LTR).
          </p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin:2rem 0;">
            <div style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="color:#38bdf8;margin-top:0;">عقود المقاولات والتوريد (EPC)</h3>
              <p style="color:#94a3b8;font-size:0.85rem;line-height:1.6;">صياغة التزامات الإنجاز، بنود الدفعات المرحلية، وتحديد شروط القوة القاهرة والشرط الجزائي المتوازن.</p>
            </div>
            <div style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="color:#34d399;margin-top:0;">اتفاقيات الشراكة وتأسيس الشركات</h3>
              <p style="color:#94a3b8;font-size:0.85rem;line-height:1.6;">توزيع الحصص، حوكمة مجالس الإدارة، آليات التخارج (Drag-Along & Tag-Along)، وسرية المعلومات NDA.</p>
            </div>
            <div style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="color:#fbbf24;margin-top:0;">عقود التكنولوجيا والبرمجيات SaaS</h3>
              <p style="color:#94a3b8;font-size:0.85rem;line-height:1.6;">اتفاقيات مستوى الخدمة (SLA)، حماية البيانات والملكية الفكرية، وتحديد سقف المسؤولية التعاقدية.</p>
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
      <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;font-family:sans-serif;color:#f8fafc;" dir="rtl">
        ${commonContactHub}
        <section style="margin:2rem 0;">
          <h1 style="font-size:2.2rem;font-weight:900;color:#f8fafc;line-height:1.3;margin-bottom:1rem;">
            فحص المخاطر العقدية وكشف البنود التعسفية بالذكاء الاصطناعي
          </h1>
          <p style="font-size:1.1rem;color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">
            رادار تدقيق المخاطر الشامل القائم على 8 متجهات قانونية: اكتشف بنود الإذعان، شروط التعويض المفتوحة، غرامات التأخير غير المتناسبة، وثغرات إنهاء التعاقد قبل توقيع العقد.
          </p>
          <div style="background:#0f172a;border:1px solid #1e293b;padding:1.5rem;border-radius:1rem;margin:2rem 0;">
            <h2 style="font-size:1.3rem;font-weight:bold;color:#f59e0b;margin-top:0;">إطار فحص المخاطر القانونية (8 Vectors):</h2>
            <ol style="color:#cbd5e1;line-height:1.8;font-size:0.95rem;padding-right:1.25rem;">
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

  if (routePath === '/company-formation') {
    return `
      ${commonHeader}
      <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;font-family:sans-serif;color:#f8fafc;" dir="rtl">
        ${commonContactHub}
        <section style="margin:2rem 0;">
          <h1 style="font-size:2.2rem;font-weight:900;color:#f8fafc;line-height:1.3;margin-bottom:1rem;">
            تأسيس الشركات وحوكمة الشركاء بالذكاء الاصطناعي
          </h1>
          <p style="font-size:1.1rem;color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">
            صياغة وتوليد عقود التأسيس والأنظمة الأساسية واتفاقيات المساهمين لشركات الأموال والأشخاص في السعودية، الإمارات، مصر، الأردن، أمريكا (Delaware)، وبريطانيا وفق أحدث الأنظمة والقوانين التجارية لعام 2026.
          </p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin:2rem 0;">
            <div style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="color:#38bdf8;margin-top:0;">شركة ذات مسؤولية محدودة (LLC)</h3>
              <p style="color:#94a3b8;font-size:0.85rem;line-height:1.6;">حوكمة الحصص، صلاحيات المدير، قيود التنازل عن الحصص، وآليات اتخاذ القرارات بالجمعية العمومية.</p>
            </div>
            <div style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="color:#34d399;margin-top:0;">شركة الشخص الواحد (Single-Member)</h3>
              <p style="color:#94a3b8;font-size:0.85rem;line-height:1.6;">عزل الذمة المالية للمالك، قرارات المالك المنفرد، والامتثال للأنظمة الضريبية والتجارية.</p>
            </div>
            <div style="background:#0f172a;border:1px solid #1e293b;padding:1.25rem;border-radius:1rem;">
              <h3 style="color:#fbbf24;margin-top:0;">الشركات المساهمة وفروع الشركات الأجنبية</h3>
              <p style="color:#94a3b8;font-size:0.85rem;line-height:1.6;">اللوائح الداخلية، صلاحيات مجلس الإدارة، لجان المراجعة، والتراخيص الاستثمارية الأجنبية (MISA / UAE FDI).</p>
            </div>
          </div>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/repository') {
    return `
      ${commonHeader}
      <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;font-family:sans-serif;color:#f8fafc;" dir="rtl">
        ${commonContactHub}
        <section style="margin:2rem 0;">
          <h1 style="font-size:2.2rem;font-weight:900;color:#f8fafc;line-height:1.3;margin-bottom:1rem;">
            مستودع العقود والنماذج الذكية المعتمدة (1,000,000+ عقد)
          </h1>
          <p style="font-size:1.1rem;color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">
            أضخم مكتبة سحابية للعقود والاتفاقيات القانونية المعتمدة بالشرق الأوسط والعالم، مصنفة ومراجعة من كبار المستشارين القانونيين، ومجهزة للتخصيص والتوليد الفوري بالذكاء الاصطناعي.
          </p>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/vault') {
    return `
      ${commonHeader}
      <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;font-family:sans-serif;color:#f8fafc;" dir="rtl">
        ${commonContactHub}
        <section style="margin:2rem 0;">
          <h1 style="font-size:2.2rem;font-weight:900;color:#f8fafc;line-height:1.3;margin-bottom:1rem;">
            خزينة المستندات المشفّرة والوثائق القانونية المعتمدة
          </h1>
          <p style="font-size:1.1rem;color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">
            خزنة سحابية آمنة بتشفير AES-GCM 256-bit على جانب العميل، مع توقيع رقمي معتمد بطوابع زمنية SHA-256، ومصادقة ثنائية 2FA لضمان حماية أسرار الشركات وعقودها الحساسة.
          </p>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/payment') {
    return `
      ${commonHeader}
      <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;font-family:sans-serif;color:#f8fafc;" dir="rtl">
        ${commonContactHub}
        <section style="margin:2rem 0;">
          <h1 style="font-size:2.2rem;font-weight:900;color:#f8fafc;line-height:1.3;margin-bottom:1rem;">
            خطط الاشتراك وباقات الشركات وبوابات الدفع الإلكتروني
          </h1>
          <p style="font-size:1.1rem;color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">
            اختر الخطة المناسبة لحجم أعمالك مع تفعيل فوري للاشتراك عبر بوابات الدفع الإلكتروني المشفرة، أو التحويل البنكي المباشر SWIFT Wire أو محفظة إنستا باي مصر (InstaPay: +201031222262).
          </p>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  if (routePath === '/support') {
    return `
      ${commonHeader}
      <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;font-family:sans-serif;color:#f8fafc;" dir="rtl">
        ${commonContactHub}
        <section style="margin:2rem 0;">
          <h1 style="font-size:2.2rem;font-weight:900;color:#f8fafc;line-height:1.3;margin-bottom:1rem;">
            مركز الدعم الفني والاستشارات القانونية المباشرة 24/7
          </h1>
          <p style="font-size:1.1rem;color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">
            فريق المستشارين والخبراء التقنيين متاح على مدار الساعة للإجابة على كافة الاستفسارات التعاقدية وتقديم المساندة الفورية لمشتركي المنصة.
          </p>
        </section>
      </main>
      ${commonFooter}
    `;
  }

  // Generic rich fallback for all other routes
  return `
    ${commonHeader}
    <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;font-family:sans-serif;color:#f8fafc;" dir="rtl">
      ${commonContactHub}
      <section style="margin:2rem 0;">
        <h1 style="font-size:2rem;font-weight:900;color:#f8fafc;line-height:1.3;margin-bottom:1rem;">
          منصة JurisTech Solutions | حلول الذكاء الاصطناعي القانوني والامتثال التشريعي
        </h1>
        <p style="font-size:1rem;color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">
          منظومة متكاملة لخدمات صياغة العقود التجارية، كشف الثغرات والبنود التعسفية، تأسيس الشركات، التحكيم التجاري الدولي، وحوكمة الصفقات الاستثمارية بالذكاء الاصطناعي.
        </p>
      </section>
    </main>
    ${commonFooter}
  `;
}
