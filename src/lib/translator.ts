import { callAI } from './api';

export type SupportedLanguage = 'ar' | 'en' | 'fr' | 'de' | 'es' | 'zh' | 'tr';

export const LANGUAGE_NAMES: Record<SupportedLanguage, { nameAr: string; nameEn: string; dir: 'rtl' | 'ltr' }> = {
  ar: { nameAr: 'العربية', nameEn: 'Arabic', dir: 'rtl' },
  en: { nameAr: 'الإنجليزية', nameEn: 'English', dir: 'ltr' },
  fr: { nameAr: 'الفرنسية', nameEn: 'French', dir: 'ltr' },
  de: { nameAr: 'الألمانية', nameEn: 'German', dir: 'ltr' },
  es: { nameAr: 'الإسبانية', nameEn: 'Spanish', dir: 'ltr' },
  zh: { nameAr: 'الصينية', nameEn: 'Chinese', dir: 'ltr' },
  tr: { nameAr: 'التركية', nameEn: 'Turkish', dir: 'ltr' },
};

/**
 * Dynamic AI Translation Engine using Gemini 3.5 Flash
 * Translates any legal document, risk report, UI metadata, or chat payload into the target language.
 */
export async function translateDynamicAI(
  textOrPayload: string,
  targetLanguage: SupportedLanguage = 'en',
  sourceLanguage?: string
): Promise<string> {
  if (!textOrPayload || textOrPayload.trim().length === 0) return '';

  const langInfo = LANGUAGE_NAMES[targetLanguage] || LANGUAGE_NAMES.en;

  const systemInstruction = `You are an expert legal tech translator and AI localization engine. Translate the provided legal document, risk report, UI metadata, or chat response into the target language (${langInfo.nameEn} / Code: ${targetLanguage}). Maintain pristine legal terminology, proper grammar, and appropriate text direction (${langInfo.dir === 'rtl' ? 'RTL' : 'LTR'}). Output clean, formatted text without conversational commentary.`;

  const prompt = `${systemInstruction}\n\nContent to translate:\n${textOrPayload}`;

  try {
    const result = await callAI(prompt);
    return result.trim();
  } catch (err) {
    console.warn('[AI Translator Engine Error] Fallback to raw text:', err);
    return textOrPayload;
  }
}
