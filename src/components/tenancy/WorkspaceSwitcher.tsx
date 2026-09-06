/**
 * src/components/tenancy/WorkspaceSwitcher.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Authenticated Workspace Switcher
 * Sprint 02 (Phase 6)
 *
 * Scopes authenticated user session to specific departments & workspaces
 * within the active organization boundary.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Layers, ChevronDown, Check, Plus, Briefcase, Scale, ShieldCheck, DollarSign } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { usePlatformLocale } from '../../lib/universalTranslator';
import { WorkspaceDepartment } from '../../types/saas';

const DEPT_ICONS: Record<WorkspaceDepartment, React.ElementType> = {
  legal: Scale,
  procurement: Briefcase,
  compliance: ShieldCheck,
  finance: DollarSign,
  hr: Briefcase,
  general: Layers,
};

const DEPT_COLORS: Record<WorkspaceDepartment, string> = {
  legal: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  procurement: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  compliance: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  finance: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  hr: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  general: 'text-slate-300 bg-slate-500/10 border-slate-500/30',
};

export const WorkspaceSwitcher: React.FC = () => {
  const { workspace, workspaces, organization, switchWorkspace, createWorkspace, currentRole } = useSaaS();
  const { isRtl } = usePlatformLocale();

  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsDept, setNewWsDept] = useState<WorkspaceDepartment>('general');
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!organization || !workspace) return null;

  const IconComponent = DEPT_ICONS[workspace.department] || Layers;

  async function handleSwitch(wsId: string) {
    if (wsId === workspace?.id) {
      setIsOpen(false);
      return;
    }
    await switchWorkspace(wsId);
    setIsOpen(false);
  }

  async function handleCreateWorkspace(e: React.FormEvent) {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setIsCreating(true);
    try {
      await createWorkspace({ name: newWsName.trim(), department: newWsDept });
      setNewWsName('');
      setShowCreateModal(false);
      setIsOpen(false);
    } catch (err) {
      console.error('Error creating workspace:', err);
    } finally {
      setIsCreating(false);
    }
  }

  // Can user create workspaces? (Owner, Admin, or Legal)
  const canCreate = ['Owner', 'Admin', 'Legal'].includes(currentRole);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Switcher Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-xs font-medium text-slate-300 shadow-sm"
        title={workspace.name}
        aria-label="Workspace Switcher"
      >
        <div className={`p-0.5 rounded border ${DEPT_COLORS[workspace.department]}`}>
          <IconComponent className="w-3 h-3" />
        </div>
        <span className="max-w-[100px] sm:max-w-[140px] truncate">{workspace.name}</span>
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
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
            <span>{isRtl ? 'مساحات العمل (Workspaces)' : 'Workspaces'}</span>
            <span className="text-[9px] font-mono text-cyan-400/80">{workspaces.length} total</span>
          </div>

          <div className="py-1 max-h-56 overflow-y-auto space-y-0.5">
            {workspaces.map((ws) => {
              const isSelected = ws.id === workspace.id;
              const ItemIcon = DEPT_ICONS[ws.department] || Layers;
              return (
                <button
                  key={ws.id}
                  onClick={() => handleSwitch(ws.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <ItemIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="truncate">
                      <div className="truncate font-semibold">{ws.name}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{ws.department}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {canCreate && (
            <div className="pt-1 mt-1 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'مساحة عمل جديدة...' : 'New Workspace...'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Layers className="w-5 h-5" />
              <span>{isRtl ? 'إضافة مساحة عمل جديدة' : 'Add New Workspace'}</span>
            </div>
            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'اسم مساحة العمل' : 'Workspace Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  placeholder={isRtl ? 'مثال: العقود الدولية والتحكيم' : 'e.g. International Arbitrations'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'القسم / التخصص' : 'Department / Category'}
                </label>
                <select
                  value={newWsDept}
                  onChange={(e) => setNewWsDept(e.target.value as WorkspaceDepartment)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="legal">{isRtl ? 'الإدارة القانونية (Legal)' : 'Legal Operations'}</option>
                  <option value="procurement">{isRtl ? 'المشتريات والتوريد (Procurement)' : 'Procurement'}</option>
                  <option value="compliance">{isRtl ? 'الامتثال والحوكمة (Compliance)' : 'Compliance'}</option>
                  <option value="finance">{isRtl ? 'المالية والاستثمار (Finance)' : 'Finance'}</option>
                  <option value="general">{isRtl ? 'عام (General)' : 'General'}</option>
                </select>
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
                  disabled={isCreating || !newWsName.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
                >
                  {isCreating ? (isRtl ? 'جاري الإضافة...' : 'Adding...') : isRtl ? 'تأكيد الإضافة' : 'Add Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;
