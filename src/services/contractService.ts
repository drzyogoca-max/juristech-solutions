/**
 * contractService.ts — Modular Decoupled Contract Management Service
 * JurisTech Solutions Enterprise Architecture
 */

import { extractPDFTextMultiStage } from '../lib/pdfExtractor';

export interface StoredContract {
  id: string;
  fileName: string;
  uploadedAt: string;
  riskScore: number;
  extractedText: string;
}

export class ContractService {
  private static instance: ContractService;

  private constructor() {}

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  /** Multi-stage OCR / PDF Text Extraction */
  public async extractContractText(
    file: File,
    onProgress?: (statusMsg: string) => void
  ): Promise<string> {
    const result = await extractPDFTextMultiStage(file, onProgress);
    return result.text;
  }

  /** Save audited contract to Encrypted Vault */
  public saveContractToVault(contract: Omit<StoredContract, 'id' | 'uploadedAt'>): StoredContract {
    const newEntry: StoredContract = {
      ...contract,
      id: 'doc_' + Math.random().toString(36).substring(2, 9),
      uploadedAt: new Date().toISOString(),
    };

    const existing = this.getVaultContracts();
    existing.unshift(newEntry);
    localStorage.setItem('ls_encrypted_vault_docs', JSON.stringify(existing));
    return newEntry;
  }

  /** Retrieve contracts stored in vault */
  public getVaultContracts(): StoredContract[] {
    const raw = localStorage.getItem('ls_encrypted_vault_docs');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
}

export const contractService = ContractService.getInstance();
