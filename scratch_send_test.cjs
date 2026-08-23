const nodemailer = require('nodemailer');

async function sendTestProposal() {
  const SMTP_HOST = 'smtp-mail.outlook.com';
  const SMTP_PORT = 587;
  const SMTP_USER = 'juristech.solutions@outlook.com';
  const SMTP_PASS = 'jiyviwbzzisldwvt';
  const TARGET_EMAIL = 'drzyogo.ca@gmail.com';

  console.log(`[Email Dispatch Test] Connecting to Outlook SMTP server (${SMTP_HOST}:${SMTP_PORT})...`);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // 587 uses STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false, ciphers: 'SSLv3' },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 20px; max-width: 650px; margin: 0 auto; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
      <div style="text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 25px;">
        <h1 style="color: #38bdf8; margin: 0; font-size: 26px; font-weight: 900;">JurisTech Solutions ⚖️</h1>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">منظومة الذكاء الاصطناعي القانونية السيادية للمؤسسات والشركات</p>
      </div>

      <div style="background-color: #1e293b; padding: 20px; border-radius: 16px; border-right: 4px solid #06b6d4; margin-bottom: 20px;">
        <h2 style="color: #f1f5f9; margin-top: 0; font-size: 18px;">عرض شراكة واستثمار مؤسسي مخصص 🚀</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          سعادة الدكتور محمد مصطفى المحترم،<br />
          تحية طيبة وبعد،،
        </p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7;">
          يسرنا في منصة <strong>JurisTech Solutions</strong> أن نرفع لسعادتكم هذا العرض الاستثماري المعتمد للاستفادة من البنية التحتية السيادية للذكاء الاصطناعي القانوني، وتفعيل باقة <strong>غرفة الصفقات المؤسسية VIP Deal Room</strong>.
        </p>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="color: #38bdf8; font-size: 15px; border-bottom: 1px solid #334155; padding-bottom: 8px;">مزايا العرض المؤسسي المعتمد:</h3>
        <ul style="color: #e2e8f0; font-size: 13px; line-height: 2;">
          <li>✨ <strong>رادار الصفقات ومستكشف الاحتياجات (DealShield 360™):</strong> تشخيص فورياً لجميع الثغرات والأنظمة القضائية لـ 12 دولة (السعودية، الإمارات، ديلاوير، بريطانيا).</li>
          <li>🛡️ <strong>فحص المخاطر التعاقدية (&lt; 90ms):</strong> كشف البنود التعسفية وفخاخ المسؤولية غير المحدودة بالذكاء الاصطناعي.</li>
          <li>📜 <strong>مستودع المليون عقد المشفر (Mega Repository):</strong> النمذجة الفورية وتوليد العقود بالختم الرسمي المشفر.</li>
          <li>💳 <strong>السداد المصرفي المباشر (SWIFT & Pro-Forma Invoice):</strong> إصدار فواتير ضريبية رسمية معتمدة للحسابات.</li>
        </ul>
      </div>

      <div style="background-color: #0284c7; padding: 15px 20px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
        <span style="color: #ffffff; font-size: 14px; font-weight: bold; display: block;">باقة غرفة الصفقات المؤسسية الكبرى (VIP Deal Room): $999 USD</span>
      </div>

      <div style="border-top: 1px solid #334155; pt: 20px; margin-top: 25px; color: #94a3b8; font-size: 12px; line-height: 1.8;">
        <strong>JurisTech Solutions Executive Proxy</strong><br />
        <strong>Dr. Mohammad Mustafa, PhD</strong> — Founder & Executive Chairman<br />
        📧 Official Sender: <a href="mailto:juristech.solutions@outlook.com" style="color: #38bdf8; text-decoration: none;">juristech.solutions@outlook.com</a><br />
        💬 Direct WhatsApp: <a href="https://wa.me/201126674337" style="color: #38bdf8; text-decoration: none;">+201126674337</a><br />
        🌐 Website: <a href="https://www.juristech.solutions" style="color: #38bdf8; text-decoration: none;">https://www.juristech.solutions</a>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Dr. Mohammad Mustafa — JurisTech Solutions" <${SMTP_USER}>`,
      to: TARGET_EMAIL,
      bcc: SMTP_USER,
      subject: `[JurisTech Solutions] عرض شراكة واستثمار مؤسسي مخصص — سعادة الدكتور محمد مصطفى`,
      text: `عرض شراكة واستثمار مؤسسي مخصص لسعادة الدكتور محمد مصطفى من منصة JurisTech Solutions. البريد الرسمي: ${SMTP_USER}`,
      html: htmlContent,
      headers: {
        'X-JurisTech-Dispatch': 'Executive-Direct-Test',
        'X-Admin-Copy': TARGET_EMAIL,
      },
    });

    console.log('✅ SUCCESS_EMAIL_SENT: Email dispatched cleanly via Outlook SMTP.');
    console.log('Message ID:', info.messageId);
    console.log('Accepted Recipients:', info.accepted);
    return true;
  } catch (err) {
    console.error('❌ Error sending test email via Outlook SMTP:', err);
    return false;
  }
}

sendTestProposal();
