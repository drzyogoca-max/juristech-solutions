import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { detectDocumentLanguage, sanitizeText } from '../lib/pdfExtractor';

export interface AuditItem {
  clause: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  vector: 'Financial' | 'Operational' | 'IP' | 'Regulatory';
  explanationAr: string;
  explanationEn: string;
  suggestedRedlineAr: string;
  suggestedRedlineEn: string;
}

export interface CachedAuditResult {
  riskScore: number;
  overallAssessmentAr: string;
  overallAssessmentEn: string;
  docLanguage: 'ar' | 'en' | 'fr' | 'de' | 'es' | 'zh' | 'tr';
  strategicRecommendationsAr?: string[];
  strategicRecommendationsEn?: string[];
  items: AuditItem[];
}

export interface ContractState {
  fileName: string;
  extractedText: string;
  documentLanguage: 'ar' | 'en' | 'fr' | 'de' | 'es' | 'zh' | 'tr';
  isRTL: boolean;
  auditResults: CachedAuditResult | null;
  uploadedAt: string | null;
}

interface ContractContextType {
  contractState: ContractState;
  setContractData: (data: {
    fileName: string;
    extractedText: string;
    auditResults?: CachedAuditResult | null;
  }) => void;
  clearContractData: () => void;
  updateAuditResults: (results: CachedAuditResult) => void;
}

const DEFAULT_STATE: ContractState = {
  fileName: '',
  extractedText: '',
  documentLanguage: 'en',
  isRTL: false,
  auditResults: null,
  uploadedAt: null,
};

const ContractContext = createContext<ContractContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'juristech_global_contract_state';

export function ContractProvider({ children }: { children: ReactNode }) {
  const [contractState, setContractState] = useState<ContractState>(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        const saved = sessionStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.extractedText) {
            parsed.extractedText = sanitizeText(parsed.extractedText);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load contract state from session:', e);
    }
    return DEFAULT_STATE;
  });

  // Sync to sessionStorage (session-scoped, non-leaking)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contractState));
      }
    } catch (e) {
      console.warn('Failed to persist contract state to session:', e);
    }
  }, [contractState]);

  const setContractData = ({
    fileName,
    extractedText,
    auditResults = null,
  }: {
    fileName: string;
    extractedText: string;
    auditResults?: CachedAuditResult | null;
  }) => {
    const cleanText = sanitizeText(extractedText);
    const docLanguage = detectDocumentLanguage(cleanText);
    const isRTL = docLanguage === 'ar' || /[\u0600-\u06FF]/.test(cleanText);

    setContractState({
      fileName,
      extractedText: cleanText,
      documentLanguage: docLanguage,
      isRTL,
      auditResults,
      uploadedAt: new Date().toISOString(),
    });
  };

  const updateAuditResults = (results: CachedAuditResult) => {
    setContractState((prev) => ({
      ...prev,
      auditResults: results,
      documentLanguage: results.docLanguage || prev.documentLanguage,
      isRTL: results.docLanguage === 'ar' || prev.isRTL,
    }));
  };

  const clearContractData = () => {
    setContractState(DEFAULT_STATE);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <ContractContext.Provider
      value={{
        contractState,
        setContractData,
        clearContractData,
        updateAuditResults,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}
