import { callAI } from './api';

export interface SWIFTAuditResult {
  isVerified: boolean;
  fraudRiskScore: number; // 0 (legit) to 100 (fraudulent)
  extractedTxId: string;
  extractedAmountUSD: number;
  extractedSenderName: string;
  auditExplanationAr: string;
  auditExplanationEn: string;
}

export async function auditSWIFTReceiptAntiFraud(
  receiptBase64OrText: string,
  expectedPlanPriceUSD: number
): Promise<SWIFTAuditResult> {
  const prompt = `Perform an AI Anti-Fraud OCR audit on the uploaded payment receipt data below:

Data / Text: "${receiptBase64OrText.slice(0, 500)}"
Expected Plan Price: $${expectedPlanPriceUSD} USD

Tasks:
1. Extract Transaction Reference Number / SWIFT Code.
2. Extract Amount Transferred.
3. Extract Sender Name.
4. Calculate Fraud Risk Score (0 = 100% Legitimate, 100 = High Risk Fraud).
5. Verify if Transferred Amount matches or exceeds Expected Plan Price ($${expectedPlanPriceUSD}).

Respond ONLY with JSON: {"isVerified": bool, "fraudRiskScore": 0-100, "txId": "...", "amount": 0, "senderName": "...", "explanationAr": "...", "explanationEn": "..."}`;

  try {
    const aiAnalysis = await callAI(prompt);

    // Attempt structured JSON parse first
    const jsonMatch = aiAnalysis.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (typeof parsed.isVerified === 'boolean' && typeof parsed.fraudRiskScore === 'number') {
          return {
            isVerified: parsed.isVerified,
            fraudRiskScore: Math.max(0, Math.min(100, parsed.fraudRiskScore)),
            extractedTxId: parsed.txId || 'N/A',
            extractedAmountUSD: parsed.amount || 0,
            extractedSenderName: parsed.senderName || 'Unknown',
            auditExplanationAr: parsed.explanationAr || '',
            auditExplanationEn: parsed.explanationEn || '',
          };
        }
      } catch { /* fall through to text analysis */ }
    }

    // Text-based fallback analysis
    const lowerAnalysis = aiAnalysis.toLowerCase();
    const isVerified =
      !lowerAnalysis.includes('fraud') &&
      !lowerAnalysis.includes('mismatch') &&
      !lowerAnalysis.includes('suspicious') &&
      !lowerAnalysis.includes('invalid') &&
      !lowerAnalysis.includes('fake');

    const riskScore = isVerified ? 8 : 88;

    return {
      isVerified,
      fraudRiskScore: riskScore,
      extractedTxId: 'PENDING-MANUAL-REVIEW',
      extractedAmountUSD: expectedPlanPriceUSD,
      extractedSenderName: 'Requires Manual Verification',
      auditExplanationAr: isVerified
        ? 'تحليل الذكاء الاصطناعي: لم يُرصد أي مؤشر احتيال في الإيصال المقدم.'
        : 'تحذير مخاطر: رُصد تضارب في القيمة المدفوعة أو تعذّر التحقق من صحة الإيصال.',
      auditExplanationEn: isVerified
        ? 'AI Analysis: No fraud indicators detected in the submitted receipt.'
        : 'Fraud Warning: Amount mismatch or unverifiable receipt integrity detected.',
    };
  } catch (err) {
    // ⚠️ SECURITY FIX: Exception MUST NOT auto-approve payments
    console.error('[AntiFraudAuditor] Exception during audit — denying by default:', err);

    return {
      isVerified: false,          // ← FIXED: was incorrectly true
      fraudRiskScore: 95,         // ← High risk on failure
      extractedTxId: 'AUDIT-FAILED',
      extractedAmountUSD: 0,
      extractedSenderName: 'Unverifiable',
      auditExplanationAr: 'فشل نظام التدقيق الآلي. يُرفض الطلب تلقائياً لأسباب أمنية. يرجى التواصل مع الدعم.',
      auditExplanationEn: 'Automated audit system failure. Payment denied by default for security. Please contact support.',
    };
  }
}
