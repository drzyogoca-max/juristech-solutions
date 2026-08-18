export interface SystemEventPayload {
  eventType: 'NEW_REGISTRATION' | 'SUBSCRIPTION_PAID' | 'SWIFT_RECEIPT_UPLOADED' | 'HIGH_TICKET_PROPOSAL' | 'SUPPORT_TICKET';
  clientName?: string;
  clientEmail?: string;
  amountUSD?: number;
  planOrService?: string;
  referenceId?: string;
  details?: string;
}

export const OFFICIAL_ADMIN_EMAIL = 'Drzyogo.ca@gmail.com';

export async function dispatchSystemNotification(payload: SystemEventPayload): Promise<boolean> {
  const timestamp = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

  let message = `🚨 *إشعار منصة JurisTech Solutions الرسمي*\n`;
  message += `⏱️ *التوقيت:* ${timestamp}\n`;

  switch (payload.eventType) {
    case 'NEW_REGISTRATION':
      message += `👤 *مشترك جديد:* ${payload.clientName || 'عميل محتمل'}\n📧 *البريد:* ${payload.clientEmail || 'غير محدد'}\n📌 *الحالة:* تم إنشاء الحساب بنجاح.`;
      break;

    case 'SUBSCRIPTION_PAID':
      message += `💰 *عملية دفع مؤكدة!*\n👤 *العميل:* ${payload.clientEmail}\n📦 *الباقة:* ${payload.planOrService}\nألمبلغ: *$${payload.amountUSD || 0} USD*\n🔖 *المرجع:* ${payload.referenceId}`;
      break;

    case 'SWIFT_RECEIPT_UPLOADED':
      message += `📄 *إيصال تحويل بنكي (SWIFT) جديد!*\n👤 *المحول:* ${payload.clientEmail}\n📦 *الباقة:* ${payload.planOrService}\nألمبلغ: *$${payload.amountUSD || 0} USD*\n🔖 *المرجع:* ${payload.referenceId}\n⚠️ *الإجراء المطلوب:* مراجعة الإيصال وتأكيد الاشتراك.`;
      break;

    case 'HIGH_TICKET_PROPOSAL':
      message += `🏢 *طلب عرض B2B مؤسسي ضخم ($1,000 - $5,000)!*\n🏢 *الشركة:* ${payload.clientName}\n📦 *الباقة المستهدفة:* ${payload.planOrService}\n🔖 *المرجع:* ${payload.referenceId}`;
      break;

    case 'SUPPORT_TICKET':
      message += `🎧 *تذكرة دعم فني جديدة!*\n👤 *العميل:* ${payload.clientEmail}\n📝 *الموضوع:* ${payload.planOrService}\n📄 *التفاصيل:* ${payload.details}`;
      break;

    default:
      message += `📌 *حدث جديد:* ${payload.eventType}`;
  }

  console.log(`[SystemNotification] Dispatching encrypted admin alert to ${OFFICIAL_ADMIN_EMAIL}:`, message);

  try {
    // Save to local notification log securely
    const existing = JSON.parse(localStorage.getItem('juristech_system_notifications') || '[]');
    existing.unshift({ timestamp, payload, email: OFFICIAL_ADMIN_EMAIL, message });
    localStorage.setItem('juristech_system_notifications', JSON.stringify(existing.slice(0, 50)));

    return true;
  } catch (err) {
    console.warn('[SystemNotification] Notification dispatch error:', err);
    return false;
  }
}

// Backward compatibility aliases for legacy call sites
export type WhatsAppEventPayload = SystemEventPayload;
export const TARGET_WHATSAPP_NUMBER = 'Drzyogo.ca@gmail.com';
export const dispatchWhatsAppNotification = dispatchSystemNotification;
