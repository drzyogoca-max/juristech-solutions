/**
 * src/components/tenancy/OrganizationSwitcher.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Authenticated Organization Switcher
 * Sprint 02 (Phase 5)
 *
 * Real multi-tenant organization selector in the application header/navbar.
 * Scopes application data context without cross-tenant leakage.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Check, Plus, Shield, Sparkles } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { usePlatformLocale } from '../../lib/universalTranslator';
import { SaaSRole } from '../../types/saas';

const ROLE_BADGE_COLORS: Record<SaaSRole, string> = {
  Owner: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Admin: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  Legal: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  Compliance: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Finance: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  Procurement: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Analyst: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Viewer: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
};

export const OrganizationSwitcher: React.FC = () => {
  const { organization, organizations, currentRole, switchOrganization, createOrganization } = useSaaS();
  const { isRtl } = usePlatformLocale();

  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!organization) return null;

  async function handleSwitch(orgId: string) {
    if (orgId === organization?.id) {
      setIsOpen(false);
      return;
    }
    await switchOrganization(orgId);
    setIsOpen(false);
  }

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setIsCreating(true);
    try {
      await createOrganization({ name: newOrgName.trim() });
      setNewOrgName('');
      setShowCreateModal(false);
      setIsOpen(false);
    } catch (err) {
      console.error('Error creating organization:', err);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Switcher Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/60 hover:border-cyan-500/40 transition-all text-xs font-semibold text-slate-200 shadow-sm"
        title={organization.name}
        aria-label="Organization Switcher"
      >
        <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="max-w-[120px] sm:max-w-[160px] truncate">{organization.name}</span>

        {/* Role Badge */}
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${ROLE_BADGE_COLORS[currentRole]}`}
        >
          {currentRole}
        </span>

        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl backdrop-blur-xl p-1.5 text-xs animate-in fade-in zoom-in-95 duration-100 ${
            isRtl ? 'left-0' : 'right-0'
          }`}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            {isRtl ? 'المؤسسات المتاحة (Organizations)' : 'Available Organizations'}
          </div>

          <div className="py-1 max-h-56 overflow-y-auto space-y-0.5">
            {organizations.map((org) => {
              const isSelected = org.id === organization.id;
              return (
                <button
                  key={org.id}
                  onClick={() => handleSwitch(org.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{org.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Create New Org Trigger */}
          <div className="pt-1 mt-1 border-t border-slate-800">
            <button
              onClick={() => {
                setShowCreateModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إنشاء مؤسسة جديدة...' : 'New Organization...'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Building2 className="w-5 h-5" />
              <span>{isRtl ? 'إنشاء مؤسسة سحابية جديدة' : 'Create New Organization'}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl
                ? 'سيتم إنشاء مساحة مؤسسية مستقلة مع تطبيق حواجز العزل التام للمستندات والعمليات.'
                : 'A dedicated multi-tenant organizational boundary with segregated workspaces and assets.'}
            </p>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'اسم المؤسسة أو الشركة' : 'Organization Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder={isRtl ? 'مثال: شركة اليمامة القابضة' : 'e.g. Acme Global Holdings LLC'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newOrgName.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
                >
                  {isCreating ? (isRtl ? 'جاري الإنشاء...' : 'Creating...') : isRtl ? 'تأكيد الإنشاء' : 'Create Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSwitcher;
