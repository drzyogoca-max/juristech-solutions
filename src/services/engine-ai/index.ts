import { detectPromptLanguage, enforceLanguageMirroringPrompt, SupportedLanguage } from './languageDetector';
import { executeEngineAISearch, EngineAISearchResponse, SearchResultItem } from './engineAISearch';
import { dispatchWhatsAppNotification, dispatchSystemNotification, WhatsAppEventPayload, SystemEventPayload, TARGET_WHATSAPP_NUMBER, OFFICIAL_ADMIN_EMAIL } from './whatsappNotifier';
import { solveLegalPrompt, classifyLegalPrompt, generateCarSaleContract, generateNdaContract, generateEmploymentContract, LegalAnalysisResult } from './legalIntelligenceEngine';

export {
  detectPromptLanguage,
  enforceLanguageMirroringPrompt,
  executeEngineAISearch,
  dispatchWhatsAppNotification,
  dispatchSystemNotification,
  solveLegalPrompt,
  classifyLegalPrompt,
  generateCarSaleContract,
  generateNdaContract,
  generateEmploymentContract,
  TARGET_WHATSAPP_NUMBER,
  OFFICIAL_ADMIN_EMAIL,
};

export type {
  SupportedLanguage,
  EngineAISearchResponse,
  SearchResultItem,
  WhatsAppEventPayload,
  SystemEventPayload,
  LegalAnalysisResult,
};


