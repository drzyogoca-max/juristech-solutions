/**
 * src/components/tenancy/WorkspaceOrganizationHub.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Interactive Enterprise Workspaces & Organizations Hub
 * Specification: TENANCY-REPAIR-P0
 *
 * Full functional tenancy control center:
 *   • Real organization switching & creation
 *   • Real workspace switching, creation, and department categorization
 *   • Organization team and RBAC access trigger
 *   • Scoped workspace resource overview & isolation metrics
 *   • 100% 7-Language dynamic localization (AR, EN, FR, ES, DE, TR, ZH)
 *   • Fully adaptive RTL / LTR layout
 */

import React, { useState, lazy, Suspense } from 'react';
import {
  Building2,
  Layers,
  Users,
  Plus,
  Check,
  ShieldCheck,
  Briefcase,
  Scale,
  DollarSign,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Shield,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { usePlatformLocale } from '../../lib/universalTranslator';
import { WorkspaceDepartment, SaaSRole, OrganizationType } from '../../types/saas';

const TeamManagementModal = lazy(() => import('../team/TeamManagementModal'));

const DEPT_ICONS: Record<WorkspaceDepartment, React.ElementType> = {
  legal: Scale,
  procurement: Briefcase,
  compliance: ShieldCheck,
  finance: DollarSign,
  hr: Briefcase,
  general: Layers,
};

const DEPT_COLORS: Record<WorkspaceDepartment, { text: string; bg: string; border: string }> = {
  legal: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  procurement: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  compliance: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  finance: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  hr: { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  general: { text: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
};

const ROLE_COLORS: Record<SaaSRole, string> = {
  Owner: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Admin: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  Legal: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  Compliance: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Finance: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  Procurement: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Analyst: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Viewer: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
};

interface Props {
  onOpenTeamModal?: () => void;
}

export const WorkspaceOrganizationHub: React.FC<Props> = ({ onOpenTeamModal }) => {
  const {
    organization,
    organizations,
    workspace,
    workspaces,
    currentRole,
    switchOrganization,
    switchWorkspace,
    createOrganization,
    createWorkspace,
  } = useSaaS();

  const { l, isRtl, lang } = usePlatformLocale();

  // Modals & Creation States
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showCreateWsModal, setShowCreateWsModal] = useState(false);
  const [showLocalTeamModal, setShowLocalTeamModal] = useState(false);

  // New Org Form
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState<OrganizationType>('enterprise_group');
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  // New Ws Form
  const [newWsName, setNewWsName] = useState('');
  const [newWsDept, setNewWsDept] = useState<WorkspaceDepartment>('legal');
  const [isCreatingWs, setIsCreatingWs] = useState(false);

  // Switching indicators
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const canCreate = ['Owner', 'Admin', 'Legal'].includes(currentRole);

  async function handleSwitchWorkspace(wsId: string) {
    if (wsId === workspace?.id) return;
    setSwitchingId(wsId);
    try {
      await switchWorkspace(wsId);
    } finally {
      setSwitchingId(null);
    }
  }

  async function handleSwitchOrg(orgId: string) {
    if (orgId === organization?.id) return;
    setSwitchingId(orgId);
    try {
      await switchOrganization(orgId);
    } finally {
      setSwitchingId(null);
    }
  }

  async function handleCreateOrgSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setIsCreatingOrg(true);
    try {
      await createOrganization({
        name: newOrgName.trim(),
        type: newOrgType,
      });
      setNewOrgName('');
      setShowCreateOrgModal(false);
    } catch (err) {
      console.error('Error creating organization:', err);
    } finally {
      setIsCreatingOrg(false);
    }
  }

  async function handleCreateWsSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setIsCreatingWs(true);
    try {
      await createWorkspace({
        name: newWsName.trim(),
        department: newWsDept,
      });
      setNewWsName('');
      setShowCreateWsModal(false);
    } catch (err) {
      console.error('Error creating workspace:', err);
    } finally {
      setIsCreatingWs(false);
    }
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={lang}
      className="card-lawtech-lux rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 font-sans"
    >
      {/* ── Top Header & Active Tenancy Identification ─────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-600/30 via-indigo-600/30 to-purple-600/30 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <Building2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-white">
                {l('مساحات العمل والمؤسسات السحابية', 'Multi-Tenant Workspaces & Organizations')}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{l('بيئة مشفرة ومعزولة', 'Isolated Multi-Tenant Active')}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {l(
                'عزل كامل للبيانات، إدارة الصلاحيات متعددة المستويات، وفصل العمليات القانونية للشركات.',
                'Enterprise tenant boundaries, fine-grained RBAC permissions, and isolated legal operations.'
              )}
            </p>
          </div>
        </div>

        {/* Global Tenancy Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Manage Team Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenTeamModal) onOpenTeamModal();
              else setShowLocalTeamModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>{l('إدارة الفريق والصلاحيات', 'Team & RBAC Roles')}</span>
          </button>

          {/* New Workspace Button */}
          {canCreate && (
            <button
              type="button"
              onClick={() => setShowCreateWsModal(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{l('مساحة عمل جديدة', 'New Workspace')}</span>
            </button>
          )}

          {/* New Org Button */}
          <button
            type="button"
            onClick={() => setShowCreateOrgModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 text-white border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>{l('مؤسسة جديدة', 'New Organization')}</span>
          </button>
        </div>
      </div>

      {/* ── Active Scope Status Card ────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Active Organization */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            {l('المؤسسة الحالية (Active Org)', 'Active Organization')}
          </span>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-bold text-slate-100 truncate text-sm">
              {organization?.name || l('المؤسسة الافتراضية', 'Personal Enterprise')}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {organization?.type || 'ENTERPRISE'} • {organization?.primaryJurisdiction || 'GLOBAL'}
          </span>
        </div>

        {/* Active Workspace */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            {l('مساحة العمل المفتوحة', 'Current Active Workspace')}
          </span>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="font-bold text-slate-100 truncate text-sm">
              {workspace?.name || l('المساحة العامة', 'Primary Workspace')}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono capitalize">
            {workspace?.department || 'general'}
          </span>
        </div>

        {/* User Role */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            {l('صلاحيتك في المؤسسة', 'Your Role / Permissions')}
          </span>
          <div>
            <span className={`inline-block px-2 py-0.5 rounded-md font-mono font-bold text-xs border ${ROLE_COLORS[currentRole]}`}>
              {currentRole}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            {canCreate ? l('صلاحيات كاملة لإنشاء وتعديل المساحات', 'Full creation & administrative access') : l('صلاحية مراجعة واستعراض', 'View & Review clearance')}
          </span>
        </div>

        {/* Multi-Tenancy Boundary */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            {l('إجمالي مساحات المنشأة', 'Total Workspaces In Scope')}
          </span>
          <div className="text-lg font-black text-cyan-400">
            {workspaces.length} {l('مساحات نشطة', 'Active Workspaces')}
          </div>
          <span className="text-[10px] text-slate-500">
            {l('عزل تشفيري مستقل لكل مساحة', 'Cryptographic boundary segregation')}
          </span>
        </div>
      </div>

      {/* ── Interactive Workspace Grid ───────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{l('مساحات العمل التابعة للمؤسسة (انقر للتبديل الفوري):', 'Workspaces in this Organization (Click to switch):')}</span>
          </h3>
          <span className="text-[10px] text-slate-500">
            {organizations.length > 1 && `${organizations.length} ${l('مؤسسات متصلة', 'Organizations linked')}`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {workspaces.map((ws) => {
            const isSelected = ws.id === workspace?.id;
            const isSwitching = switchingId === ws.id;
            const Icon = DEPT_ICONS[ws.department] || Layers;
            const colors = DEPT_COLORS[ws.department] || DEPT_COLORS.general;

            return (
              <div
                key={ws.id}
                onClick={() => handleSwitchWorkspace(ws.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-500/60 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 truncate">
                      <div className={`p-2 rounded-xl border ${colors.bg} ${colors.text} ${colors.border}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-xs text-white truncate group-hover:text-cyan-300 transition-colors">
                          {ws.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 capitalize">
                          {ws.department}
                        </span>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3" />
                        <span>{l('النشطة حالياً', 'Active')}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors flex items-center gap-1 shrink-0">
                        <span>{isSwitching ? l('جاري التبديل...', 'Switching...') : l('تبديل', 'Switch')}</span>
                        <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {ws.description || l('مساحة عمل مخصصة للعمليات القانونية وتدقيق العقود ومراجعة المخاطر.', 'Dedicated workspace for legal operations, contract auditing, and risk management.')}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>
                    {ws.allowedJurisdictions && ws.allowedJurisdictions.length > 0
                      ? ws.allowedJurisdictions.join(' • ')
                      : 'GLOBAL • GCC • US'}
                  </span>
                  <span className="text-slate-500">
                    {l('عزل معتمد', 'Isolated')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Create Organization Modal ────────────────────────────────────────── */}
      {showCreateOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Building2 className="w-5 h-5" />
              <span>{l('إنشاء مؤسسة سحابية جديدة', 'Create New Organization')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {l(
                'سيتم إنشاء بيئة مؤسسية مستقلة مع تطبيق حواجز العزل التام للمستندات والعمليات.',
                'A dedicated multi-tenant organizational boundary with segregated workspaces and assets.'
              )}
            </p>
            <form onSubmit={handleCreateOrgSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {l('اسم المؤسسة أو الشركة *', 'Organization Name *')}
                </label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder={l('مثال: شركة اليمامة للاستشارات القابضة', 'e.g. Acme Legal Holdings LLC')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {l('نوع المؤسسة', 'Organization Structure Type')}
                </label>
                <select
                  value={newOrgType}
                  onChange={(e) => setNewOrgType(e.target.value as OrganizationType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="enterprise_group">{l('مؤسسة كبرى / مجموعة شركات (Enterprise Group)', 'Enterprise Group / Multinational')}</option>
                  <option value="law_firm">{l('مكتب محاماة واستشارات (Law Firm)', 'Law Firm / Legal Practice')}</option>
                  <option value="company">{l('شركة تجارية / تشغيلية (Company)', 'Commercial Company')}</option>
                  <option value="legal_department">{l('إدارة شؤون قانونية داخلية (Legal Department)', 'In-house Legal Department')}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateOrgModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  {l('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isCreatingOrg || !newOrgName.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
                >
                  {isCreatingOrg ? l('جاري الإنشاء...', 'Creating...') : l('تأكيد إنشاء المؤسسة', 'Create Organization')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Workspace Modal ───────────────────────────────────────────── */}
      {showCreateWsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Layers className="w-5 h-5" />
              <span>{l('إضافة مساحة عمل جديدة للمؤسسة', 'Add New Workspace to Organization')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {l(
                'تساعد مساحات العمل على تنظيم العقود وتدقيق المخاطر حسب الأقسام والتخصصات.',
                'Workspaces isolate contracts, audits, and workflows by department or operational unit.'
              )}
            </p>
            <form onSubmit={handleCreateWsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {l('اسم مساحة العمل *', 'Workspace Name *')}
                </label>
                <input
                  type="text"
                  required
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  placeholder={l('مثال: عقود التحكيم الدولي والنزاعات', 'e.g. International Dispute & Arbitration')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {l('القسم / التخصص *', 'Department / Classification *')}
                </label>
                <select
                  value={newWsDept}
                  onChange={(e) => setNewWsDept(e.target.value as WorkspaceDepartment)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="legal">{l('الشؤون القانونية والعقود (Legal Ops)', 'Legal Operations')}</option>
                  <option value="procurement">{l('المشتريات وسلاسل الإمداد (Procurement)', 'Procurement & Supply Chain')}</option>
                  <option value="compliance">{l('الامتثال والحوكمة (Compliance)', 'Compliance & Governance')}</option>
                  <option value="finance">{l('المالية والاستثمار (Finance & M&A)', 'Finance & Investments')}</option>
                  <option value="hr">{l('الموارد البشرية والعمل (Human Resources)', 'Human Resources')}</option>
                  <option value="general">{l('عام / إدارة تنفيذية (General)', 'General / Executive')}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateWsModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  {l('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isCreatingWs || !newWsName.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
                >
                  {isCreatingWs ? l('جاري الإضافة...', 'Adding...') : l('تأكيد إنشاء المساحة', 'Create Workspace')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Local Team Management Modal ─────────────────────────────────────── */}
      {showLocalTeamModal && (
        <Suspense fallback={null}>
          <TeamManagementModal
            isOpen={showLocalTeamModal}
            onClose={() => setShowLocalTeamModal(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default WorkspaceOrganizationHub;
