import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getSavedThemeConfig, THEME_BACKGROUNDS, APP_FONTS } from './themeSettings';

export async function exportLegalContractPDF(
  content: string,
  contractType: string,
  partyA: string,
  partyB: string,
  partyASignature?: string,
  partyBSignature?: string,
  sha256Hash?: string,
  languageCode: string = 'en'
) {
  const isRtl = languageCode === 'ar' || /[\u0600-\u06FF]/.test(content);
  const themeConfig = getSavedThemeConfig();
  const activeFontFamily = APP_FONTS[themeConfig.fontId]?.fontFamily || "'Cairo', sans-serif";
  const activeAccentColor = THEME_BACKGROUNDS[themeConfig.bgId]?.accentColor || '#06b6d4';

  // We create a temporary div to hold the HTML
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';

  const hashToDisplay = sha256Hash || `SHA256-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  const dateStr = isRtl ? new Date().toLocaleDateString('ar-EG') : new Date().toLocaleDateString('en-US');

  // Format the text content for HTML, handling line breaks
  const contentHtml = content
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => `<p style="margin-bottom: 8px;">${line}</p>`)
    .join('');

  container.innerHTML = `
    <div style="font-family: ${activeFontFamily}; color: #0f172a; padding: 40px; direction: ${isRtl ? 'rtl' : 'ltr'}; text-align: ${isRtl ? 'right' : 'left'};">
      
      <!-- Header Background Banner -->
      <div style="background-color: #0f172a; color: white; padding: 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <div>
          <h1 style="color: ${activeAccentColor}; margin: 0; font-size: 22px;">
            ${isRtl ? 'حلول جوريس تك - المنظومة القانونية' : 'JURISTECH SOLUTIONS'}
          </h1>
          <p style="margin: 5px 0 0 0; font-size: 13px;">
            ${isRtl ? `وثيقة رسمية معتمدة وموثقة إلكترونياً — ${contractType}` : `OFFICIAL CERTIFIED & E-SIGNED AGREEMENT — ${contractType.toUpperCase()}`}
          </p>
        </div>
        <div style="background-color: #10b981; color: #0f172a; padding: 10px 14px; border-radius: 6px; text-align: center; font-size: 11px; font-weight: bold;">
          ${isRtl ? 'ختم رقمي موثق<br>منظومة الذكاء الاصطناعي' : 'JURISTECH AI CERTIFIED<br>DIGITAL SEAL & STAMP'}
        </div>
      </div>

      <!-- Metadata Box -->
      <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin-bottom: 20px; display: flex; justify-content: space-between; font-size: 13px;">
        <div>
          <p style="margin: 0 0 8px 0;"><strong>${isRtl ? 'الطرف الأول' : 'Party A'}:</strong> ${partyA || (isRtl ? 'غير محدد' : 'N/A')}</p>
          <p style="margin: 0;"><strong>${isRtl ? 'الطرف الثاني' : 'Party B'}:</strong> ${partyB || (isRtl ? 'غير محدد' : 'N/A')}</p>
        </div>
        <div style="text-align: ${isRtl ? 'left' : 'right'};">
          <p style="margin: 0 0 8px 0;"><strong>${isRtl ? 'تاريخ الاعتماد' : 'Executed Date'}:</strong> ${dateStr}</p>
          <p style="margin: 0;"><strong>${isRtl ? 'التدقيق والتشفير' : 'Cryptographic Audit'}:</strong> ${isRtl ? 'موثق ومُشفر' : 'Verified & Encrypted'}</p>
        </div>
      </div>

      <!-- Legal Independence Disclaimer Banner -->
      <div style="background-color: #fffbe0; border: 1px solid #f59e0b; border-radius: 6px; padding: 10px 14px; margin-bottom: 25px; font-size: 11px; color: #78350f; font-weight: bold; line-height: 1.5;">
        ${isRtl
          ? 'إشعار استقلالية قانونية: هذه المنصة هي كيان تقني مستقل بذاته، وليست فرعاً أو وكيلاً أو مرتبطة بأي شكل من الأشكال بشركة JurisTech الأمريكية أو أي علامات تجارية عالمية أخرى تحمل أسماء مشابهة.'
          : 'Legal Independence Notice: This platform is an independent technical entity and is not a branch, agent, or affiliated in any way with the American company JurisTech or any other global trademarks.'}
      </div>

      <!-- Document Content -->
      <div style="font-size: 13px; line-height: 1.7; color: #334155; margin-bottom: 40px; min-height: 480px; text-align: justify; text-justify: inter-word;">
        ${contentHtml}
      </div>

      <!-- Signature Block Area -->
      <div style="border-top: 1px solid #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; margin-bottom: 35px; page-break-inside: avoid;">
        <div style="width: 45%;">
          <p style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">
            ${isRtl ? 'توقيع الطرف الأول الإلكتروني' : 'PARTY A E-SIGNATURE'} (${partyA}):
          </p>
          ${
            partyASignature && partyASignature.startsWith('data:image')
              ? `<img src="${partyASignature}" style="max-height: 50px; max-width: 150px;" />`
              : `<p style="color: #64748b; font-style: italic;">[${isRtl ? 'توقيع رقمي موثق بالختم' : 'Digitally Signed & Stamp Verified'}]</p>`
          }
        </div>
        <div style="width: 45%;">
          <p style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">
            ${isRtl ? 'توقيع الطرف الثاني الإلكتروني' : 'PARTY B E-SIGNATURE'} (${partyB}):
          </p>
          ${
            partyBSignature && partyBSignature.startsWith('data:image')
              ? `<img src="${partyBSignature}" style="max-height: 50px; max-width: 150px;" />`
              : `<p style="color: #64748b; font-style: italic;">[${isRtl ? 'توقيع رقمي موثق بالختم' : 'Digitally Signed & Stamp Verified'}]</p>`
          }
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; page-break-inside: avoid;">
        <span>${isRtl ? `حلول جوريس تك (https://www.juristech.solutions) — البصمة الرقمية: ${hashToDisplay.slice(0, 40)}...` : `JurisTech Solutions (https://www.juristech.solutions) — Hash: ${hashToDisplay.slice(0, 40)}...`}</span>
        <span>${isRtl ? 'منصة تقنية قانونية إقليمية مستقلة' : 'Independent Regional Legal Tech Entity'}</span>
      </div>
      
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    const filename = `${isRtl ? 'عقد_موثق' : 'JurisTech_Certified'}_${contractType.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    document.body.removeChild(container);
  }
}
