import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

/**
 * دالة دقيقة لتنظيف النص من أي رموز تحكم مخفية أو \r التي تسبب تلف ملفات Word XML
 */
function sanitizeXmlText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r/g, '') // إزالة \r الناتجة عن سياق Windows CRLF
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); // إزالة رموز ASCII غير القابلة للطباعة
}

export async function generateAndDownloadWordDocument(title: string, content: string, langCode?: string) {
  try {
    const isLegalShieldDomain = typeof window !== 'undefined' && window.location.hostname.toLowerCase().includes('legalshield');
    const platformBrand = isLegalShieldDomain ? "JurisTech Solutions & LegalShield Solution" : "JurisTech Solutions";

    // 1. تنظيف النص والتأكد من خلوه من رموز XML الفاسدة
    const cleanTitle = sanitizeXmlText(title) || `${platformBrand} Document`;
    const rawContent = sanitizeXmlText(content) || "No content provided.";

    // 1. الضغط الفائق للفراغات: إزالة الفراغات المكررة المتتالية وضمان خلو الملف تماماً من المسافات العشوائية
    const normalizedContent = rawContent.replace(/\n\s*\n\s*\n+/g, '\n\n');

    // فحص اتجاه اللغة بدقة تامة (عربي = RTL / لغات أخرى = LTR)
    const isArabicChar = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFE]/.test(normalizedContent) || /[\u0600-\u06FF]/.test(cleanTitle);
    const isRtl = langCode ? langCode === 'ar' : isArabicChar;

    // 2. تقسيم المحتوى إلى أسطر نظيفة دون أي \r أو \n داخل الأسطر
    const lines = normalizedContent.split('\n');

    const paragraphs: Paragraph[] = [];
    let lastWasEmpty = false;

    // إضافة عنوان المستند الرئيسي بأعلى المعايير
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: isRtl,
        spacing: { after: 200, before: 100 },
        children: [
          new TextRun({
            text: cleanTitle,
            bold: true,
            size: 32, // 16pt
            font: "Arial",
            color: "0369A1",
            rightToLeft: isRtl,
          }),
        ],
      })
    );

    // خط فاصل جمالي
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "___________________________________________________",
            color: "CBD5E1",
            size: 20,
          }),
        ],
      })
    );

    // معالجة كل سطر بشكل مستقل كفقرة Word سليمة 100% مع ضمان الخلو التام من الفراغات المكررة
    lines.forEach((line) => {
      const cleanLine = sanitizeXmlText(line);
      const isEmpty = !cleanLine.trim();

      if (isEmpty) {
        if (!lastWasEmpty) {
          // سطر فارغ واحد فقط للمسافة الفاصلة النظيفة
          paragraphs.push(
            new Paragraph({
              spacing: { after: 60 },
              children: [],
            })
          );
          lastWasEmpty = true;
        }
        return;
      }

      lastWasEmpty = false;

      const isHeading = cleanLine.startsWith('البند') ||
                        cleanLine.startsWith('SECTION') ||
                        cleanLine.startsWith('ARTICLE') ||
                        cleanLine.startsWith('المادة') ||
                        cleanLine.startsWith('###') ||
                        cleanLine.startsWith('##');

      const textWithoutMarkdown = cleanLine.replace(/^#+\s*/, '');
      const lineHasArabic = /[\u0600-\u06FF]/.test(textWithoutMarkdown);
      const lineIsRtl = isRtl || lineHasArabic;

      paragraphs.push(
        new Paragraph({
          alignment: lineIsRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
          bidirectional: lineIsRtl,
          spacing: { after: isHeading ? 160 : 100 },
          children: [
            new TextRun({
              text: textWithoutMarkdown,
              font: lineIsRtl ? "Arial" : "Calibri",
              size: isHeading ? 26 : 24, // 13pt للعناوين، 12pt للنصوص
              bold: isHeading,
              color: isHeading ? "0F172A" : "333333",
              rightToLeft: lineIsRtl,
            }),
          ],
        })
      );
    });

    // إضافة الختم الرقمي والتوقيع في نهاية المستند دون رموز \n عشوائية
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 60 },
        children: [
          new TextRun({
            text: "___________________________________________________",
            color: "CBD5E1",
            size: 20,
          }),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        bidirectional: isRtl,
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({
            text: `Generated securely via ${platformBrand}`,
            bold: true,
            size: 20,
            color: "0284C7",
            rightToLeft: isRtl,
          }),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        bidirectional: isRtl,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "Certified by Dr. Mohammed Mustafa (Strategic Advisor)",
            italics: true,
            size: 18,
            color: "64748B",
            rightToLeft: isRtl,
          }),
        ],
      })
    );

    // 3. بناء المستند بالخصائص الكاملة والمتوافقة 100% مع Microsoft Word
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });


    // 4. تحويل المستند إلى بايتات OpenXML ثنائية معتمدة وتنزيلها
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanTitle.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "_")}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // تنظيف الذاكرة بعد 500 مللي ثانية لمنع إلغاء التنزيل المبكر في متصفحات Safari/Chrome
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 500);

    return { success: true };
  } catch (error) {
    console.error("Error generating Word document:", error);
    return { success: false, error };
  }
}
