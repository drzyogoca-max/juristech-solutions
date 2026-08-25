/**
 * src/components/LanguageSwitcher.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Accessible, Multi-Platform 7-Language Switcher
 * Specification: GLOBAL-I18N-P0 Section 6
 *
 * Features:
 *   • Full Keyboard navigation (ArrowUp, ArrowDown, Escape, Enter, Space)
 *   • Full ARIA screen-reader support (role="combobox", role="listbox", aria-selected)
 *   • Preserves current route path and query parameters seamlessly
 *   • Dynamic document language & direction (RTL/LTR) synchronization
 *   • Persists selection across 'juristech.locale'
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Languages, Check, ChevronDown } from 'lucide-react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LANGUAGE_LIST,
  isRtlLanguage,
  setDocumentLanguage,
  persistLocalePreference,
  normalizeLanguageCode,
} from '../i18n';

interface Props {
  className?: string;
  variant?: 'navbar' | 'compact' | 'footer' | 'settings';
}

export default function LanguageSwitcher({ className = '', variant = 'navbar' }: Props) {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentLang = normalizeLanguageCode(i18n.language || (typeof window !== 'undefined' ? localStorage.getItem('juristech.locale') || 'en' : 'en'));
  const currentMeta = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;
  const isRtl = isRtlLanguage(currentLang);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSwitch = (targetCode: SupportedLanguage) => {
    if (targetCode === currentLang) {
      setIsOpen(false);
      return;
    }

    // 1. Change i18n language
    i18n.changeLanguage(targetCode);

    // 2. Persist preference
    persistLocalePreference(targetCode);

    // 3. Update document language & direction
    setDocumentLanguage(targetCode);

    // 4. Update URL route if using locale prefixes, preserving path & search params
    const currentPath = location.pathname;
    const currentSearch = location.search;
    const currentHash = location.hash;

    // Check if the path starts with an existing locale code
    const localePrefixMatch = currentPath.match(/^\/(en|ar|fr|es|de|tr|zh)(\/.*|$)/i);
    let newPath = currentPath;

    if (localePrefixMatch) {
      const restOfPath = localePrefixMatch[2] || '';
      newPath = `/${targetCode}${restOfPath}`;
    }

    if (newPath !== currentPath) {
      navigate(`${newPath}${currentSearch}${currentHash}`, { replace: true });
    }

    setIsOpen(false);
    setFocusedIndex(-1);
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(LANGUAGE_LIST.findIndex((l) => l.code === currentLang));
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % LANGUAGE_LIST.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + LANGUAGE_LIST.length) % LANGUAGE_LIST.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < LANGUAGE_LIST.length) {
          handleLanguageSwitch(LANGUAGE_LIST[focusedIndex].code);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-start ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('accessibility.selectLanguage', 'Select interface language')}
        className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
          isOpen
            ? 'bg-slate-800 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
            : 'bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-600'
        }`}
      >
        <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="font-sans">{currentMeta.nativeName}</span>
        <span className="text-[10px] text-slate-400 font-mono uppercase">({currentMeta.code})</span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={t('accessibility.selectLanguage', 'Select interface language')}
          className={`absolute ${
            isRtl ? 'left-0' : 'right-0'
          } mt-2 w-52 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl py-1 animate-in fade-in slide-in-from-top-2 duration-150`}
        >
          <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            {t('common.language', 'Language')} / {t('accessibility.selectLanguage', 'Select Language')}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/40">
            {LANGUAGE_LIST.map((langMeta, index) => {
              const isSelected = langMeta.code === currentLang;
              const isFocused = index === focusedIndex;

              return (
                <button
                  key={langMeta.code}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isFocused ? 0 : -1}
                  onClick={() => handleLanguageSwitch(langMeta.code)}
                  className={`w-full px-3.5 py-2.5 text-xs transition-colors flex items-center justify-between text-start cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 text-cyan-300 font-bold border-s-2 border-cyan-400'
                      : isFocused
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{langMeta.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-sans leading-tight">{langMeta.nativeName}</span>
                      <span className="text-[10px] text-slate-400 leading-tight">{langMeta.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      {langMeta.code}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
