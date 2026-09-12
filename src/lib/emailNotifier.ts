export interface ReceiptNotificationPayload {
  clientEmail: string;
  clientRef: string;
  transactionId: string;
  planName: string;
  amount: number;
  receiptUrl: string;
  timestamp: string;
}

export interface ConsultationBookingPayload {
  advisorId: string;
  advisorName: string;
  consultationType: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  preferredDate: string;
  preferredTime: string;
  subjectDetails: string;
}

const OFFICIAL_ADMIN_EMAIL = 'founder@juristech.solutions';
const MANDATORY_ADMIN_COPY = 'founder@juristech.solutions';

export async function dispatchReceiptEmail(payload: ReceiptNotificationPayload): Promise<{ success: boolean; message: string }> {
  console.log('[Real Email Automation] Dispatching live email via /api/send-email with Admin BCC:', payload);

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactionalType: 'RECEIPT_NOTIFICATION',
        to: payload.clientEmail,
        bcc: [MANDATORY_ADMIN_COPY, OFFICIAL_ADMIN_EMAIL],
        adminCopy: MANDATORY_ADMIN_COPY,
        officialAdminCopy: OFFICIAL_ADMIN_EMAIL,
        subject: `[JurisTech Solutions] ${payload.planName} — إشعار رسمي (${payload.transactionId})`,
        text: `العميل: ${payload.clientRef} | المعاملة: ${payload.transactionId} | المبلغ: ${payload.amount} USD | الباقة: ${payload.planName}`,
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 25px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
            <h2 style="color: #06b6d4; margin-top: 0;">JurisTech Solutions ⚖️</h2>
            <h3 style="color: #38bdf8;">إشعار رسمي وعرض معتمد</h3>
            <p><strong>العميل المستهدف:</strong> ${payload.clientRef} (${payload.clientEmail})</p>
            <p><strong>رقم المعاملة / العرض:</strong> ${payload.transactionId}</p>
            <p><strong>الخدمة / الباقة:</strong> ${payload.planName}</p>
            <p><strong>القيمة:</strong> ${payload.amount} USD</p>
            <p><strong>التاريخ والوقت:</strong> ${payload.timestamp}</p>
            <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
            <p style="font-size: 13px; color: #94a3b8;">
              تم الإرسال التلقائي والفعلي عبر النظام الذكي للمنصة مع إشعار نسخة المسؤول (${MANDATORY_ADMIN_COPY}).<br />
              البريد الرسمي المعتمد: <strong>${OFFICIAL_ADMIN_EMAIL}</strong>
            </p>
          </div>
        `,
        payload,
      }),
    });


    let resData: any = {};
    try {
      resData = await res.json();
    } catch {
      resData = {};
    }

    if (res.ok && resData.success !== false) {
      return { success: true, message: resData.details || resData.message || 'Real email dispatched successfully via /api/send-email' };
    } else {
      console.warn('[Real Email Automation] Primary route returned failure:', res.status, resData);
      return {
        success: false,
        message: resData.error || resData.message || `Dispatch failed with HTTP ${res.status}`,
      };
    }
  } catch (err: any) {
    console.error('[Real Email Automation] Primary dispatch exception:', err);
    return {
      success: false,
      message: err?.message || 'Network error during email dispatch',
    };
  }
}

/**
 * Dispatch Advisor & Live Legal Consultation Requests directly to founder@juristech.solutions
 */
export async function dispatchConsultationBooking(payload: ConsultationBookingPayload): Promise<{ success: boolean; bookingId: string; message?: string }> {
  const bookingId = `BOOK-${Date.now().toString(36).toUpperCase()}`;
  console.log(`[Consultation Dispatcher] Sending booking ${bookingId} directly to ${OFFICIAL_ADMIN_EMAIL}:`, payload);

  // Save locally in admin queue
  try {
    const existingStr = localStorage.getItem('ls_consultation_bookings');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift({
      bookingId,
      ...payload,
      createdAt: new Date().toISOString(),
      status: 'pending_review',
    });
    localStorage.setItem('ls_consultation_bookings', JSON.stringify(existing));
  } catch (e) {
    console.warn('Error archiving consultation booking locally:', e);
  }

  // Dispatch via API to official admin email and mandatory admin copy
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactionalType: 'CONSULTATION_BOOKING',
        to: OFFICIAL_ADMIN_EMAIL,
        bcc: [MANDATORY_ADMIN_COPY, OFFICIAL_ADMIN_EMAIL],
        adminCopy: MANDATORY_ADMIN_COPY,
        replyTo: payload.clientEmail,
        subject: `⚖️ [JurisTech Solutions] [Legal Consultation Booking] ${payload.advisorName} — ${payload.clientName} (${payload.companyName || 'Individual'})`,
        text: `New consultation booking request:\nClient: ${payload.clientName}\nEmail: ${payload.clientEmail}\nPhone: ${payload.clientPhone}\nCompany: ${payload.companyName}\nAdvisor: ${payload.advisorName}\nType: ${payload.consultationType}\nDate: ${payload.preferredDate} at ${payload.preferredTime}\nNotes: ${payload.subjectDetails}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 25px; background: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #06b6d4;">
            <h2 style="color: #38bdf8; margin-top: 0;">JurisTech Solutions — Legal Consultation Booking 🏛️</h2>
            <p><strong>Booking Ref ID:</strong> <span style="color: #06b6d4; font-family: monospace;">${bookingId}</span></p>
            <hr style="border: 0; border-top: 1px solid #334155; margin: 15px 0;" />
            <h3 style="color: #f59e0b;">Target Advisor:</h3>
            <p style="font-size: 16px; font-weight: bold; color: #ffffff;">${payload.advisorName}</p>
            <h3 style="color: #38bdf8;">Client & Company Coordinates:</h3>
            <ul>
              <li><strong>Full Name:</strong> ${payload.clientName}</li>
              <li><strong>Email Address:</strong> <a href="mailto:${payload.clientEmail}" style="color: #38bdf8;">${payload.clientEmail}</a></li>
              <li><strong>Phone / WhatsApp:</strong> ${payload.clientPhone || 'N/A'}</li>
              <li><strong>Company Entity:</strong> ${payload.companyName || 'N/A'}</li>
            </ul>
            <h3 style="color: #10b981;">Session Preferred Slot:</h3>
            <p><strong>Method:</strong> ${payload.consultationType} | <strong>Date:</strong> ${payload.preferredDate} | <strong>Time:</strong> ${payload.preferredTime}</p>
            <h3 style="color: #cbd5e1;">Case Summary & Notes:</h3>
            <div style="background: #1e293b; padding: 15px; border-radius: 10px; font-size: 13px; color: #e2e8f0; line-height: 1.6;">
              ${payload.subjectDetails || 'No additional notes specified.'}
            </div>
            <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8;">
              Dispatched automatically to official inbox <strong>${OFFICIAL_ADMIN_EMAIL}</strong>
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) {
      return { success: true, bookingId };
    } else {
      const err = await res.json().catch(() => ({}));
      console.warn('[Consultation Dispatcher] Dispatch returned error:', res.status, err);
      return { success: false, bookingId, message: err.error || err.message || `Dispatch failed with status ${res.status}` };
    }
  } catch (err: any) {
    console.warn('[Consultation Dispatcher] HTTP dispatch warning:', err);
    return { success: false, bookingId, message: err?.message || 'Network error during booking dispatch' };
  }
}

export interface EmailNotificationOptions {
  toEmail: string;
  subjectAr?: string;
  subjectEn?: string;
  bodyAr?: string;
  bodyEn?: string;
}

export async function sendEmailNotification(
  toOrOptions: string | EmailNotificationOptions,
  subjectParam?: string,
  bodyParam?: string
): Promise<boolean> {
  let to = '';
  let subject = '';
  let body = '';

  if (typeof toOrOptions === 'object') {
    to = toOrOptions.toEmail;
    subject = toOrOptions.subjectAr || toOrOptions.subjectEn || 'JurisTech Solutions Notification';
    body = toOrOptions.bodyAr || toOrOptions.bodyEn || '';
  } else {
    to = toOrOptions;
    subject = subjectParam || '';
    body = bodyParam || '';
  }

  console.log(`[Email Dispatcher] Sending email to ${to}:`, { subject, body });
  try {
    await dispatchReceiptEmail({
      clientEmail: to,
      clientRef: 'GATEWAY-SUB',
      transactionId: `SUB-${Date.now()}`,
      planName: subject,
      amount: 0,
      receiptUrl: 'https://juristech.solutions/payment',
      timestamp: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.warn('Email dispatch warning:', err);
    return false;
  }
}

/**
 * Dispatch automated 2FA OTP security verification codes to official email
 */
export async function dispatch2FAOtpEmail(targetEmail: string, otpCode: string): Promise<boolean> {
  const recipient = targetEmail || OFFICIAL_ADMIN_EMAIL;
  console.log(`[2FA Email Dispatcher] Triggering live 2FA OTP (${otpCode}) email to ${recipient}...`);
  console.info(
    `%c 🔑 JurisTech 2FA Security OTP for ${recipient}: ${otpCode}`,
    'background: #0284c7; color: #ffffff; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;'
  );

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipient,
        subject: `[JurisTech Solutions] 🔐 رمز المصادقة الثنائية (2FA OTP): ${otpCode}`,
        text: `رمز التحقق الخاص بك لربط الجلسة ودخول المنصة هو: ${otpCode} (صالح لمدة 5 دقائق)`,
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 25px; background: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #0284c7;">
            <h2 style="color: #38bdf8; margin-top: 0;">JurisTech Solutions ⚖️</h2>
            <h3 style="color: #06b6d4;">🔐 رمز المصادقة الثنائية (2FA Verification)</h3>
            <p style="font-size: 14px; color: #cbd5e1;">تم إرسال هذا الرمز بناءً على طلب دخول مسؤول النظام أو إجراء أمني حرج.</p>
            <div style="background: #1e293b; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; border: 1px dashed #38bdf8;">
              <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">${otpCode}</span>
            </div>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
              • هذا الرمز صالح لمدة <strong>5 دقائق فقط</strong>.<br />
              • البريد الإلكتروني المستهدف: <strong>${recipient}</strong><br />
              • لا تشارك هذا الرمز مع أي شخص.
            </p>
            <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">JurisTech Solutions Enterprise Security Infrastructure</p>
          </div>
        `,
      }),
    });

    if (res.ok) {
      console.log(`[2FA Email Dispatcher] Successfully sent 2FA email to ${recipient}`);
      return true;
    }
  } catch (err) {
    console.warn('[2FA Email Dispatcher] HTTP dispatch warning:', err);
  }
  return true;
}

