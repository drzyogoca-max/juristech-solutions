import nodemailer from 'nodemailer';

async function executeTestDispatch() {
  console.log('------------------------------------------------------------');
  console.log('🚀 Executing Live Test Dispatch to: drzyogo.ca@gmail.com');
  console.log('------------------------------------------------------------');

  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: 'juristech.solutions@outlook.com',
      pass: 'orkbylzntvfecrmk',
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
    debug: true,
    logger: true,
  });

  const mailOptions = {
    from: '"JurisTech Solutions — إدارة المنصة القانونية" <juristech.solutions@outlook.com>',
    to: 'drzyogo.ca@gmail.com',
    subject: '⚖️ [JurisTech Solutions] إشعار إرسال تجريبي رسمي — التحقق من كفاءة النظام',
    html: `
      <div dir="rtl" style="font-family: Arial, Tahoma, sans-serif; background: #0f172a; color: #f8fafc; padding: 25px; border-radius: 14px; max-width: 650px; margin: auto; border: 1px solid #1e293b;">
        <h2 style="color: #06b6d4; margin-top: 0;">منصة جوريس تك للحلول القانونية الذكية ⚖️</h2>
        <p style="color: #38bdf8; font-weight: bold; font-size: 15px;">إشعار الفحص والتحقق من كفاءة الإرسال البرمجي الآلي</p>
        <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 4px 0;"><strong>البريد المستهدف:</strong> drzyogo.ca@gmail.com</p>
          <p style="margin: 4px 0;"><strong>البريد المرسل:</strong> juristech.solutions@outlook.com</p>
          <p style="margin: 4px 0;"><strong>التوقيت:</strong> ${new Date().toISOString()}</p>
          <p style="margin: 4px 0;"><strong>الحالة:</strong> تم تنفيذ أمر الإرسال التجريبي بنجاح عبر النظام الموحد.</p>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">
          هذه الرسالة صادرة آلياً لاختبار بوابات الاتصال والربط البرمجي للمنصتين:<br>
          https://juristech.solutions | https://legalshieldsolution.online
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ DISPATCH COMPLETED SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
    console.log('Server Response:', info.response);
  } catch (error) {
    console.error('⚠️ SMTP Execution Notice:', error.message);
  }
}

executeTestDispatch();
