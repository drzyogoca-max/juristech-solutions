/**
 * companyProfile.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Company Metadata & Attachments Management System
 */

export interface AttachedDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  dataUrl?: string;
  docCategory: 'commercial_register' | 'tax_card' | 'power_of_attorney' | 'license' | 'other';
}

export interface CompanyProfile {
  companyNameAr: string;
  companyNameEn: string;
  taxId: string;
  commercialRegister: string;
  legalStructure: string;
  country: string;
  address: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryEmail: string;
  signatoryPhone: string;
  logoDataUrl?: string;
  attachedDocuments: AttachedDocument[];
}

const DEFAULT_PROFILE: CompanyProfile = {
  companyNameAr: 'شركة الحلول القانونية السيادية ش.م.م',
  companyNameEn: 'JurisTech Sovereign Tech Solutions S.A.E',
  taxId: '694-204-182',
  commercialRegister: '109284',
  legalStructure: 'شركة مساهمة (S.A.E / Corp)',
  country: 'مصر (مقر رئيسي) / الولايات المتحدة (فرع دولي)',
  address: 'برج الأمل التجاري، الحي المالي، القاهرة / وادي السيليكون، كاليفورنيا',
  signatoryName: 'د. أحمد صلاح الدين',
  signatoryTitle: 'الرئيس التنفيذي والمفوض بالتوقيع',
  signatoryEmail: 'Drzyogo.ca@gmail.com',
  signatoryPhone: '+1 (800) JURIS-TECH (Official Emergency Line)',
  attachedDocuments: [
    {
      id: 'doc-1',
      fileName: 'السجل_التجاري_المعتمد_2026.pdf',
      fileType: 'application/pdf',
      fileSize: '1.8 MB',
      uploadDate: '2026-07-26',
      docCategory: 'commercial_register',
    },
    {
      id: 'doc-2',
      fileName: 'البطاقة_الضربية_الموثقة.pdf',
      fileType: 'application/pdf',
      fileSize: '950 KB',
      uploadDate: '2026-07-26',
      docCategory: 'tax_card',
    },
  ],
};

export function getSavedCompanyProfile(): CompanyProfile {
  try {
    const saved = localStorage.getItem('juristech_company_profile');
    if (saved) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    }
  } catch {}
  return DEFAULT_PROFILE;
}

export function saveCompanyProfile(profile: CompanyProfile): void {
  try {
    localStorage.setItem('juristech_company_profile', JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save company profile:', e);
  }
}
