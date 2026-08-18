export type SupportedLanguage = 'ar' | 'en' | 'de' | 'fr' | 'es' | 'zh' | 'tr';

export function detectPromptLanguage(prompt: string): SupportedLanguage {
  // Arabic script detection
  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(prompt)) {
    return 'ar';
  }

  // Chinese script detection
  if (/[\u4e00-\u9fa5]/.test(prompt)) {
    return 'zh';
  }

  // Turkish specific characters & words
  if (/[ğüşıöçĞÜŞİÖÇ]/i.test(prompt) || /\b(ve|bir|bu|ile|için|sözleşme|hukuk|maddi|hakkında|nasıl|nedir)\b/i.test(prompt)) {
    return 'tr';
  }

  // German specific words & characters
  if (/[äöüß]/i.test(prompt) || /\b(und|der|die|das|ist|nicht|für|mit|vertrag|recht|wie|was)\b/i.test(prompt)) {
    return 'de';
  }

  // French specific words & characters
  if (/[éèêëàâùûîïç]/i.test(prompt) || /\b(et|le|la|les|est|pas|pour|avec|contrat|droit|comment|que)\b/i.test(prompt)) {
    return 'fr';
  }

  // Spanish specific words & characters
  if (/[ñáéíóú]/i.test(prompt) || /\b(y|el|la|los|es|no|para|con|contrato|derecho|cómo|qué)\b/i.test(prompt)) {
    return 'es';
  }

  // Default to English
  return 'en';
}

export function enforceLanguageMirroringPrompt(prompt: string, userLang: SupportedLanguage): string {
  const instructions: Record<SupportedLanguage, string> = {
    ar: '\n\n[تنبيه إلزامي: يجب أن تكون الإجابة باللغة العربية الفصحى القانونية الدقيقة دون استخدام لغات أخرى.]',
    en: '\n\n[STRICT MANDATE: You MUST respond purely in professional English without language mixing.]',
    de: '\n\n[STRENGES MANDAT: Sie MÜSSEN ausschließlich auf professionellem Deutsch antworten.]',
    fr: '\n\n[MANDAT STRICT: Vous DEVEZ répondre exclusivement en français juridique professionnel.]',
    es: '\n\n[MANDATO ESTRICTO: DEBE responder exclusivamente en español jurídico profesional.]',
    zh: '\n\n[严格指令：必须完全使用专业中文回答。]',
    tr: '\n\n[KESİN TALİMAT: Tamamen profesyonel Türkçe hukuk diliyle yanıt vermelisiniz.]',
  };

  return `${prompt}${instructions[userLang] || instructions.en}`;
}
