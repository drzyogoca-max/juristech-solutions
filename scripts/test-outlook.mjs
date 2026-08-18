import nodemailer from 'nodemailer';

async function testOutlook() {
  console.log('Testing Outlook SMTP for juristech.solutions@outlook.com...');

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
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"JurisTech Solutions" <juristech.solutions@outlook.com>',
      to: 'drzyogo.ca@gmail.com',
      subject: '⚖️ [JurisTech Solutions] عرض استقطاب وشراكة استراتيجية — النمذجة القانونية وخزينة 1M+ عقد معتمد',
      html: '<p>اختبار الإرسال الرسمي المباشر عبر خادم Outlook</p>'
    });
    console.log('✅ SUCCESS OUTLOOK! Message ID:', info.messageId);
  } catch (e) {
    console.log('❌ Outlook error:', e.message);
  }
}

testOutlook();
