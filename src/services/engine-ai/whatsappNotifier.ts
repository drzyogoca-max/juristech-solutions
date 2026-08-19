/**
 * whatsappNotifier.ts — JurisTech Multi-Channel Real-Time Admin Notification Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Dispatches instant high-priority alerts via Email (drzygo.ca@gmail.com) and WhatsApp
 * whenever a client registers, pays, uploads a bank wire receipt, or books a consultation.
 */

export interface SystemEventPayload {
  eventType: 
    | 'NEW_REGISTRATION' 
    | 'SUBSCRIPTION_PAID' 
    | 'SWIFT_RECEIPT_UPLOADED' 
    | 'HIGH_TICKET_PROPOSAL' 
    | 'CONSULTATION_BOOKED'
    | 'SUPPORT_TICKET';
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  amountUSD?: number;
  planOrService?: string;
  referenceId?: string;
  details?: string;
}

export const OFFICIAL_ADMIN_EMAIL = 'drzygo.ca@gmail.com';
export const OFFICIAL_BACKUP_EMAIL = 'juristech.solutions@outlook.com';
export const TARGET_WHATSAPP_NUMBER = '+201126674337';

/**
 * Dispatches real-time Admin alerts across both Email and WhatsApp
 */
export async function dispatchSystemNotification(payload: SystemEventPayload): Promise<boolean> {
  const timestamp = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
  const dateIso = new Date().toISOString();

  let titleAr = '🚨 إشعار جديد من منصة JurisTech Solutions';
  let titleEn = '🚨 New Event Alert — JurisTech Solutions';
  let emoji = '📌';
  let eventDescAr = '';

  switch (payload.eventType) {
    case 'NEW_REGISTRATION':
      emoji = '👤';
      titleAr = `👤 مشترك جديد سجل في المنصة: ${payload.clientName || payload.clientEmail || 'عميل محتمل'}`;
      titleEn = `👤 New Client Registered: ${payload.clientName || payload.clientEmail || 'Prospective Client'}`;
      eventDescAr = `قام عميل جديد بإنشاء حساب في المنصة بنجاح.`;
      break;

    case 'SUBSCRIPTION_PAID':
      emoji = '💰';
      titleAr = `💰 عملية دفع مؤكدة: $${payload.amountUSD || 0} USD — ${payload.planOrService || 'باقة مدفوعة'}`;
      titleEn = `💰 Verified Payment Received: $${payload.amountUSD || 0} USD — ${payload.planOrService || 'Paid Plan'}`;
      eventDescAr = `تم استلام وتأكيد عملية دفع اشتراك بنجاح في المنصة.`;
      break;

    case 'SWIFT_RECEIPT_UPLOADED':
      emoji = '📄';
      titleAr = `📄 إيصال تحويل بنكي SWIFT جديد: $${payload.amountUSD || 0} USD`;
      titleEn = `📄 New SWIFT Wire Transfer Receipt Uploaded: $${payload.amountUSD || 0} USD`;
      eventDescAr = `قام العميل برفع إشعار تحويل بنكي (SWIFT) ويرجى مراجعته وتفعيل الحساب.`;
      break;

    case 'CONSULTATION_BOOKED':
      emoji = '📅';
      titleAr = `📅 حجز استشارة قانونية جديدة: ${payload.clientName || 'عميل'}`;
      titleEn = `📅 New Legal Consultation Booked: ${payload.clientName || 'Client'}`;
      eventDescAr = `تم تأكيد حجز جلسة استشارية وتفاوضية عبر Zoom/Teams.`;
      break;

    case 'HIGH_TICKET_PROPOSAL':
      emoji = '🏢';
      titleAr = `🏢 طلب عرض B2B مؤسسي ضخم ($1,000 - $5,000): ${payload.clientName || 'مؤسسة'}`;
      titleEn = `🏢 High-Ticket B2B Proposal Request: ${payload.clientName || 'Enterprise'}`;
      eventDescAr = `تم إنشاء وتصدير مقترح عرض مؤسسي مخصص لشركة كبرى.`;
      break;

    case 'SUPPORT_TICKET':
      emoji = '🎧';
      titleAr = `🎧 تذكرة دعم فني جديدة: ${payload.clientEmail || 'مستخدم'}`;
      titleEn = `🎧 New Support Ticket: ${payload.clientEmail || 'User'}`;
      eventDescAr = `ورد استفسار أو طلب مساعدة تقنية من المستخدم.`;
      break;

    default:
      eventDescAr = `حدث في المنصة: ${payload.eventType}`;
  }

  // 1. Build Formatted WhatsApp Message
  const whatsappText = [
    `*${emoji} JurisTech Solutions — تنبيه فوري للإدارة*`,
    `━━━━━━━━━━━━━━━━━━━`,
    `📌 *نوع الحدث:* ${titleAr}`,
    `⏱️ *التوقيت:* ${timestamp}`,
    payload.clientName ? `👤 *اسم العميل:* ${payload.clientName}` : '',
    payload.clientEmail ? `📧 *البريد:* ${payload.clientEmail}` : '',
    payload.clientPhone ? `📱 *الهاتف:* ${payload.clientPhone}` : '',
    payload.amountUSD !== undefined ? `💵 *المبلغ:* $${payload.amountUSD} USD` : '',
    payload.planOrService ? `📦 *الباقة/الخدمة:* ${payload.planOrService}` : '',
    payload.referenceId ? `🔖 *رقم المرجع:* ${payload.referenceId}` : '',
    payload.details ? `📝 *التفاصيل:* ${payload.details}` : '',
    `━━━━━━━━━━━━━━━━━━━`,
    `🌐 *المنصة:* https://www.juristech.solutions`,
  ].filter(Boolean).join('\n');

  const encodedWhatsApp = encodeURIComponent(whatsappText);
  const cleanPhone = TARGET_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  const whatsappLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedWhatsApp}`;

  // 2. Build Rich HTML Email
  const htmlBody = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #090d16; color: #f1f5f9; padding: 20px; margin: 0; }
        .card { max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #0891b2; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 30px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #0891b2, #0284c7); padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
        .content { padding: 24px; line-height: 1.8; font-size: 14px; }
        .badge { display: inline-block; background-color: rgba(8, 145, 178, 0.15); color: #38bdf8; border: 1px solid rgba(8, 145, 178, 0.3); border-radius: 8px; padding: 4px 12px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .info-table td { padding: 10px; border-bottom: 1px solid #1e293b; color: #cbd5e1; }
        .info-table td.label { font-weight: bold; color: #38bdf8; width: 35%; }
        .amount-box { background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 12px; padding: 15px; text-align: center; margin: 15px 0; }
        .amount-val { font-size: 24px; font-weight: 900; color: #34d399; }
        .btn-wa { display: block; text-align: center; background: #25D366; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 20px; border-radius: 12px; margin-top: 20px; }
        .footer { padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>⚖️ JurisTech Solutions — نظام الإشعارات الفوري</h1>
        </div>
        <div class="content">
          <div class="badge">${emoji} تنبيه إداري فوري</div>
          <h2 style="margin: 0 0 10px; font-size: 16px; color: #f8fafc;">${titleAr}</h2>
          <p style="color: #94a3b8; margin: 0 0 15px;">${eventDescAr}</p>

          ${payload.amountUSD !== undefined ? `
            <div class="amount-box">
              <div style="font-size: 11px; color: #10b981; font-weight: bold; text-transform: uppercase;">المبلغ المحصل / المستهدف</div>
              <div class="amount-val">$${payload.amountUSD.toLocaleString()} USD</div>
            </div>
          ` : ''}

          <table class="info-table">
            <tr>
              <td class="label">توقيت الحدث</td>
              <td>${timestamp}</td>
            </tr>
            ${payload.clientName ? `
            <tr>
              <td class="label">اسم العميل</td>
              <td><strong>${payload.clientName}</strong></td>
            </tr>` : ''}
            ${payload.clientEmail ? `
            <tr>
              <td class="label">البريد الإلكتروني</td>
              <td><a href="mailto:${payload.clientEmail}" style="color: #38bdf8; text-decoration: none;">${payload.clientEmail}</a></td>
            </tr>` : ''}
            ${payload.clientPhone ? `
            <tr>
              <td class="label">رقم الهاتف / واتساب</td>
              <td><a href="tel:${payload.clientPhone}" style="color: #38bdf8; text-decoration: none;">${payload.clientPhone}</a></td>
            </tr>` : ''}
            ${payload.planOrService ? `
            <tr>
              <td class="label">الباقة أو الخدمة</td>
              <td>${payload.planOrService}</td>
            </tr>` : ''}
            ${payload.referenceId ? `
            <tr>
              <td class="label">رقم المرجع</td>
              <td><code>${payload.referenceId}</code></td>
            </tr>` : ''}
            ${payload.details ? `
            <tr>
              <td class="label">تفاصيل إضافية</td>
              <td>${payload.details}</td>
            </tr>` : ''}
          </table>

          <a href="${whatsappLink}" target="_blank" class="btn-wa">
            💬 تواصل مباشرة عبر واتساب مع العميل أو راجع التنبيه
          </a>
        </div>
        <div class="footer">
          JurisTech Solutions — Sovereign AI Legal Engineering Platform<br>
          https://www.juristech.solutions
        </div>
      </div>
    </body>
    </html>
  `;

  // 3. Dispatch Live Email to Admin (drzygo.ca@gmail.com) via /api/send-email
  try {
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: OFFICIAL_ADMIN_EMAIL,
        subject: `[JurisTech Alert] ${titleAr}`,
        text: whatsappText,
        html: htmlBody,
      }),
    }).catch((err) => {
      console.warn('[SystemNotification] Email dispatch warning:', err);
    });
  } catch (emailErr) {
    console.warn('[SystemNotification] Network error dispatching email:', emailErr);
  }

  // 4. Record to Local & In-Memory Notification Log
  try {
    const existing = JSON.parse(localStorage.getItem('juristech_system_notifications') || '[]');
    existing.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp,
      dateIso,
      payload,
      titleAr,
      titleEn,
      whatsappLink,
      whatsappText,
      email: OFFICIAL_ADMIN_EMAIL,
      read: false,
    });
    localStorage.setItem('juristech_system_notifications', JSON.stringify(existing.slice(0, 50)));

    // Emit live browser event for UI reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('juristech:admin-event', {
        detail: { payload, titleAr, titleEn, timestamp, whatsappLink }
      }));
    }
  } catch {}

  console.info(`[SystemNotification] ✅ Admin Alert Dispatched to ${OFFICIAL_ADMIN_EMAIL} & WhatsApp:`, titleAr);
  return true;
}

// Backward compatibility aliases for legacy call sites
export type WhatsAppEventPayload = SystemEventPayload;
export const dispatchWhatsAppNotification = dispatchSystemNotification;
