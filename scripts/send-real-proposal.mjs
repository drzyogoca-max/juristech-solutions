import nodemailer from 'nodemailer';

async function main() {
  console.log('Connecting to SMTP gateway via Gmail SSL...');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'drzyogo.ca@gmail.com',
      pass: 'orkbylzntvfecrmk',
    },
  });

  const mailOptions = {
    from: '"منصة جوريس تك للحلول القانونية الذكية" <drzyogo.ca@gmail.com>',
    to: 'drzyogo.ca@gmail.com',
    replyTo: 'juristech.solutions@outlook.com',
    subject: '⚖️ [JurisTech Solutions] عرض استقطاب وشراكة استراتيجية — النمذجة القانونية وخزينة 1M+ عقد معتمد',
    html: `
      <div dir="rtl" style="font-family: Arial, 'Segoe UI', Tahoma, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 30px; border-radius: 16px; max-width: 680px; margin: auto; border: 1px solid #1e293b; line-height: 1.8;">
        
        <div style="border-bottom: 2px solid #06b6d4; padding-bottom: 18px; margin-bottom: 20px; text-align: center;">
          <h1 style="color: #06b6d4; margin: 0; font-size: 24px;">منصة جوريس تك للحلول القانونية الذكية ⚖️</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">JurisTech Solutions & LegalShield Sovereign AI Vault</p>
        </div>

        <div style="background: rgba(6, 182, 212, 0.08); border-right: 4px solid #06b6d4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-weight: bold; color: #38bdf8; font-size: 15px;">
            السيد / الشريك التنفيذي المحترم — drzyogo.ca@gmail.com
          </p>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #cbd5e1;">
            تحية طيبة وبعد،، يسرنا تقديم هذا العرض المعتمد رسمياً للانضمام إلى نخبة شركائنا المؤسسيين.
          </p>
        </div>

        <h3 style="color: #f59e0b; font-size: 16px; margin-top: 20px;">🌟 أبرز المزايا المؤسسية المعتمدة لكم:</h3>
        <ul style="color: #e2e8f0; font-size: 13px; padding-right: 20px;">
          <li style="margin-bottom: 10px;"><strong>الوصول غير المحدود لـ 1,000,000+ عقد ونموذج تشريعي:</strong> مطابقة تامة للقوانين الأردنية، السعودية (م/132)، الإماراتية (DIFC)، الأمريكية (Delaware)، والاتفاقيات الدولية (UNCITRAL).</li>
          <li style="margin-bottom: 10px;"><strong>محرك رادار المخاطر والعوار القانوني (AI Risk Radar):</strong> تدقيق فوري للثغرات والبنود الباطلة في أقل من 5 مللي ثانية.</li>
          <li style="margin-bottom: 10px;"><strong>التوثيق الرقمي المشفر (SHA-256 Verified):</strong> أختام تشفير قانونية تضمن الحجية القضائية وتمنع التلاعب.</li>
          <li style="margin-bottom: 10px;"><strong>بوابة الرعاية والتحويل المالي المباشر (SWIFT Wire):</strong> إدارة الصفقات وتوزيع المستحقات الدولية.</li>
        </ul>

        <div style="background: #020617; border: 1px solid #334155; padding: 18px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <div style="font-size: 13px; color: #94a3b8;">قيمة الباقة المؤسسية الشاملة المعتمدة:</div>
          <div style="font-size: 28px; font-weight: bold; color: #10b981; margin: 6px 0;">$10,000 USD</div>
          <a href="https://juristech.solutions/sponsors-ads" style="display: inline-block; background: #06b6d4; color: #020617; font-weight: bold; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 13px; margin-top: 10px;">
            تفعيل الاشتراك والربط المؤسسي الفوري 🚀
          </a>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 18px; margin-top: 25px; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0; font-weight: bold; color: #e2e8f0;">✍️ د. محمد مصطفى (Dr. Mohammad Mustafa)</p>
          <p style="margin: 2px 0;">دكتور القانون التجاري الدولي والنمذجة الذكية — رئيس مجلس الإدارة</p>
          <p style="margin: 2px 0;">البريد الرسمي: <a href="mailto:juristech.solutions@outlook.com" style="color: #38bdf8;">juristech.solutions@outlook.com</a></p>
          <p style="margin: 2px 0;">المنصة الموحدة: <a href="https://juristech.solutions" style="color: #38bdf8;">Juristech.solutions</a> | <a href="https://legalshieldsolution.online" style="color: #38bdf8;">Legalshieldsolution.online</a></p>
        </div>

      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ SUCCESS! Email sent successfully to inbox.');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
}

main();
