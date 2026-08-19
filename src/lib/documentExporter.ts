import { exportLegalContractPDF } from './pdfExporter';
import { deferToNextTick } from './asyncWorkerEngine';
import { getJurisdictionProfile } from './jurisdictionResolver';
import { generateAndDownloadWordDocument } from '../utils/export-utils';

export { generateAndDownloadWordDocument };

export function exportDocumentMultiFormat(
  content: string,
  title: string,
  partyA: string,
  partyB: string,
  format: 'pdf' | 'docx' | 'txt' | 'html',
  langCode?: 'ar' | 'en',
  jurisdictionCode?: string
) {
  const sanitizeTitle = title.replace(/\s+/g, '_');
  const isRtl = langCode ? langCode === 'ar' : /[\u0600-\u06FF]/.test(content);
  const jurProfile = getJurisdictionProfile(jurisdictionCode || (isRtl ? 'JO' : 'US'));

  if (format === 'pdf') {
    deferToNextTick(() => {
      exportLegalContractPDF(content, title, partyA, partyB, undefined, undefined, undefined, isRtl ? 'ar' : 'en');
    });
    return;
  }

  deferToNextTick(() => {
    // ── 1. TXT EXPORT ────────────────────────────────────────────────────────
    if (format === 'txt') {
      const textData = isRtl
        ? `================================================================================
حلول جوريس تك — وثيقة قانونية معتمدة ورسمية (نسخة نصية)
العنوان: ${title}
الطرف الأول: ${partyA || 'غير محدد'} | الطرف الثاني: ${partyB || 'غير محدد'}
الدولة والاختصاص القضائي: ${jurProfile.countryAr} (${jurProfile.code})
القانون النافذ: ${jurProfile.governingLawAr}
المحاكم المختصة حصرياً: ${jurProfile.exclusiveCourtsAr}
حقوق النشر: جميع الحقوق محفوظة © 2026 حلول جوريس تك.
الموقع الإلكتروني: https://www.juristech.solutions
--------------------------------------------------------------------------------
إشعار استقلالية قانونية: هذه الوثيقة صادرة عبر منصة جوريس تك الذكية المعتمدة دولياً.
================================================================================

${content}`
        : `================================================================================
JURISTECH SOLUTIONS — OFFICIAL CERTIFIED LEGAL DOCUMENT (TEXT FORMAT)
Title: ${title}
Party A: ${partyA || 'N/A'} | Party B: ${partyB || 'N/A'}
Jurisdiction: ${jurProfile.countryEn} (${jurProfile.code})
Governing Law: ${jurProfile.governingLawEn}
Exclusive Court Venue: ${jurProfile.exclusiveCourtsEn}
Copyright: Copyright © 2026 JurisTech Solutions. All Rights Reserved.
Domain: https://www.juristech.solutions
--------------------------------------------------------------------------------
LEGAL NOTICE: Generated via JurisTech AI Sovereign Legal System.
================================================================================

${content}`;

      const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
      downloadBlobAccelerated(blob, `${isRtl ? 'عقد_معتمد' : 'JurisTech'}_${sanitizeTitle}.txt`);
      return;
    }

    // ── 2. HTML EXPORT ───────────────────────────────────────────────────────
    if (format === 'html') {
      const htmlData = isRtl
        ? `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>${title} - حلول جوريس تك</title>
<style>
  body { font-family: 'Cairo', 'Traditional Arabic', system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; line-height: 1.8; direction: rtl; text-align: right; }
  .header { border-bottom: 2px solid #22d3ee; padding-bottom: 20px; margin-bottom: 20px; }
  .title { font-size: 24px; font-weight: bold; color: #22d3ee; }
  .disclaimer { background: #451a03; border: 1px solid #f59e0b; color: #fef3c7; padding: 12px 18px; border-radius: 8px; font-size: 12px; margin-bottom: 20px; font-weight: bold; }
  .parties { background: #1e293b; padding: 15px; border-radius: 12px; font-size: 14px; margin-bottom: 20px; border: 1px solid #334155; }
  .content { background: #020617; padding: 25px; border-radius: 12px; white-space: pre-wrap; font-size: 14px; border: 1px solid #334155; line-height: 2; }
</style>
</head>
<body>
<div class="header">
  <div class="title">حلول جوريس تك — ${title}</div>
  <div style="font-size:12px; color:#94a3b8;">https://www.juristech.solutions | الاختصاص القضائي: ${jurProfile.countryAr}</div>
</div>
<div class="disclaimer">
  إشعار استقلالية وقانون نافذ: تخضع هذه الوثيقة لأحكام ${jurProfile.governingLawAr} وتختص المباشرة حصرياً ${jurProfile.exclusiveCourtsAr}.
</div>
<div class="parties">
  <strong>الطرف الأول:</strong> ${partyA || 'غير محدد'} &nbsp;|&nbsp; <strong>الطرف الثاني:</strong> ${partyB || 'غير محدد'}
</div>
<div class="content">${escapeHtml(content)}</div>
</body>
</html>`
        : `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<title>${title} - JurisTech Solutions</title>
<style>
  body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; line-height: 1.8; direction: ltr; text-align: left; }
  .header { border-bottom: 2px solid #22d3ee; padding-bottom: 20px; margin-bottom: 20px; }
  .title { font-size: 24px; font-weight: bold; color: #22d3ee; }
  .disclaimer { background: #451a03; border: 1px solid #f59e0b; color: #fef3c7; padding: 12px 18px; border-radius: 8px; font-size: 12px; margin-bottom: 20px; font-weight: bold; }
  .parties { background: #1e293b; padding: 15px; border-radius: 12px; font-size: 14px; margin-bottom: 20px; border: 1px solid #334155; }
  .content { background: #020617; padding: 25px; border-radius: 12px; white-space: pre-wrap; font-size: 14px; border: 1px solid #334155; line-height: 2; }
</style>
</head>
<body>
<div class="header">
  <div class="title">JurisTech Solutions — ${title}</div>
  <div style="font-size:12px; color:#94a3b8;">https://www.juristech.solutions | Jurisdiction: ${jurProfile.countryEn}</div>
</div>
<div class="disclaimer">
  Governing Law Notice: Governed by ${jurProfile.governingLawEn}. Subject to ${jurProfile.exclusiveCourtsEn}.
</div>
<div class="parties">
  <strong>Party A:</strong> ${partyA || 'N/A'} &nbsp;|&nbsp; <strong>Party B:</strong> ${partyB || 'N/A'}
</div>
<div class="content">${escapeHtml(content)}</div>
</body>
</html>`;

      const blob = new Blob([htmlData], { type: 'text/html;charset=utf-8' });
      downloadBlobAccelerated(blob, `${isRtl ? 'مستند_معتمد' : 'JurisTech'}_${sanitizeTitle}.html`);
      return;
    }

    // ── 3. WORD (.DOCX) EXPORT — NATIVE MICROSOFT OFFICE OPENXML WORD FORMAT ──────
    if (format === 'docx') {
      const isLegalShield = typeof window !== 'undefined' && window.location.hostname.toLowerCase().includes('legalshield');
      const platformTitle = isLegalShield ? 'حلول جوريس تك / LegalShield Solution' : 'حلول جوريس تك (JurisTech Solutions)';
      const platformTitleEn = isLegalShield ? 'JurisTech Solutions & LegalShield Solution' : 'JurisTech Solutions';

      const headerPrefix = isRtl
        ? `${platformTitle} — وثيقة قانونية معتمدة ورسمية\nالعنوان: ${title}\nالطرف الأول: ${partyA || 'غير محدد'} | الطرف الثاني: ${partyB || 'غير محدد'}\nالدولة والاختصاص القضائي: ${jurProfile.countryAr} (${jurProfile.code})\nالقانون النافذ: ${jurProfile.governingLawAr}\n--------------------------------------------------------------------------------\n\n`
        : `${platformTitleEn} — Official Certified Legal Document\nTitle: ${title}\nParty A: ${partyA || 'N/A'} | Party B: ${partyB || 'N/A'}\nJurisdiction: ${jurProfile.countryEn} (${jurProfile.code})\nGoverning Law: ${jurProfile.governingLawEn}\n--------------------------------------------------------------------------------\n\n`;

      const fullContentToExport = headerPrefix + content;
      generateAndDownloadWordDocument(title, fullContentToExport, langCode || (isRtl ? 'ar' : 'en'));
      return;
    }



  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function downloadBlobAccelerated(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Instant memory cleanup to prevent RAM leaks
  setTimeout(() => URL.revokeObjectURL(url), 200);
}
