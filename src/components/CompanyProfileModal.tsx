import { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Upload, FileText, X, Check, Trash2, ShieldCheck, Image as ImageIcon, Paperclip, Plus, Download } from 'lucide-react';
import { CompanyProfile, AttachedDocument, getSavedCompanyProfile, saveCompanyProfile } from '../lib/companyProfile';
import { getUITranslations } from '../lib/uiTranslations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (profile: CompanyProfile) => void;
}

export default function CompanyProfileModal({ isOpen, onClose, onUpdate }: Props) {
  const { i18n, t } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const ui = getUITranslations(i18n.language);

  const [profile, setProfile] = useState<CompanyProfile>(getSavedCompanyProfile);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProfile(getSavedCompanyProfile());
    }
  }, [isOpen]);


  if (!isOpen) return null;

  function handleLogoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const updated = { ...profile, logoDataUrl: dataUrl };
      setProfile(updated);
    };
    reader.readAsDataURL(file);
  }

  function handleDocFileUpload(e: ChangeEvent<HTMLInputElement>, category: AttachedDocument['docCategory']) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: AttachedDocument[] = [];
    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const newDoc: AttachedDocument = {
          id: `doc-${Date.now()}-${idx}`,
          fileName: file.name,
          fileType: file.type,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          uploadDate: new Date().toISOString().split('T')[0],
          dataUrl,
          docCategory: category,
        };
        setProfile((prev) => {
          const updated = {
            ...prev,
            attachedDocuments: [...prev.attachedDocuments, newDoc],
          };
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  }

  function handleRemoveDoc(id: string) {
    const updated = {
      ...profile,
      attachedDocuments: profile.attachedDocuments.filter((d) => d.id !== id),
    };
    setProfile(updated);
  }

  function handleSave() {
    saveCompanyProfile(profile);
    if (onUpdate) onUpdate(profile);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl shadow-slate-900/20 dark:shadow-slate-950/90 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                {t('Company.subtitle')}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {t('Company.title')}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('Common.close')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {/* Logo & Company Basic Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          
          {/* Logo Upload Box */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            {profile.logoDataUrl ? (
              <img src={profile.logoDataUrl} alt="Company Logo" width={120} height={96} loading="lazy" decoding="async" className="max-h-24 max-w-full object-contain rounded-lg border border-slate-300 dark:border-slate-700" />

            ) : (
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <ImageIcon className="w-10 h-10" />
              </div>
            )}
            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md">
              <Upload className="w-3.5 h-3.5" />
              <span>{isRtl ? 'تحميل لوجو الشركة' : 'Upload Logo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>

          {/* Core Info Inputs */}
          <div className="md:col-span-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{isRtl ? 'اسم الشركة (عربي)' : 'Company Name (AR)'}</label>
                <input
                  type="text"
                  value={profile.companyNameAr}
                  onChange={(e) => setProfile({ ...profile, companyNameAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{isRtl ? 'اسم الشركة (English)' : 'Company Name (EN)'}</label>
                <input
                  type="text"
                  value={profile.companyNameEn}
                  onChange={(e) => setProfile({ ...profile, companyNameEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{isRtl ? 'السجل التجاري' : 'Commercial Register'}</label>
                <input
                  type="text"
                  value={profile.commercialRegister}
                  onChange={(e) => setProfile({ ...profile, commercialRegister: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{isRtl ? 'الرقم الضريبي' : 'Tax ID'}</label>
                <input
                  type="text"
                  value={profile.taxId}
                  onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Legal & Signatory Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{isRtl ? 'اسم المفوض بالتوقيع' : 'Authorized Signatory'}</label>
            <input
              type="text"
              value={profile.signatoryName}
              onChange={(e) => setProfile({ ...profile, signatoryName: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{isRtl ? 'الصفة الوظيفية' : 'Signatory Title'}</label>
            <input
              type="text"
              value={profile.signatoryTitle}
              onChange={(e) => setProfile({ ...profile, signatoryTitle: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{isRtl ? 'البريد الرسمي' : 'Corporate Email'}</label>
            <input
              type="email"
              value={profile.signatoryEmail}
              onChange={(e) => setProfile({ ...profile, signatoryEmail: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{isRtl ? 'العنوان والمقر' : 'Official Address'}</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
            />
          </div>
        </div>

        {/* Document Attachments Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{isRtl ? 'الوثائق والمرفقات الرسمية (سجل تجاري، تفويض، تراخيص):' : 'Attached Corporate Documents:'}</span>
            </label>
            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-800 dark:text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-slate-300 dark:border-slate-700">
              <Plus className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{isRtl ? 'إضافة ملف مرفق' : 'Attach Document'}</span>
              <input type="file" multiple className="hidden" onChange={(e) => handleDocFileUpload(e, 'other')} />
            </label>
          </div>

          <div className="space-y-2">
            {profile.attachedDocuments.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 font-semibold">
                {isRtl ? 'لا يوجد وثائق مرفقة بعد. اضغط إضافة ملف مرفق لرفع وثائق الشركة.' : 'No attached documents yet.'}
              </div>
            ) : (
              profile.attachedDocuments.map((doc) => (
                <div key={doc.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{doc.fileName}</p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-semibold">{doc.fileSize} • {doc.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {doc.dataUrl && (
                      <a href={doc.dataUrl} download={doc.fileName} className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button onClick={() => handleRemoveDoc(doc.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {successMsg ? (
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>{isRtl ? 'تم حفظ بيانات الشركة والوثائق بنجاح!' : 'Profile and documents saved!'}</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
              {isRtl ? 'تدمج البيانات واللوجو تلقائياً في ترويسات العقود' : 'Auto-injected into generated contracts'}
            </span>
          )}

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg transition-all"
          >
            {isRtl ? 'حفظ الاعتماد' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}
