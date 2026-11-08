import React, { useState, useRef, useEffect } from 'react';
import { Layers, ChevronDown, CheckCircle2, ArrowUpRight, RefreshCw, Briefcase, Calculator } from 'lucide-react';
import { Translations } from '../translations';

interface EcosystemSwitcherProps {
  t: Translations;
  onOpenIntegrations: () => void;
  isSyncingAll?: boolean;
}

export const EcosystemSwitcher: React.FC<EcosystemSwitcherProps> = ({
  t,
  onOpenIntegrations,
  isSyncingAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors border border-slate-200/60 dark:border-slate-700"
        title={t.connectedApps}
        aria-expanded={isOpen}
      >
        <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span className="hidden sm:inline font-semibold">{t.connectedApps}</span>
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 text-xs">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.connectedApps} (Your App List)
            </span>
          </div>

          <div className="py-1 space-y-1">
            {/* Active app: TalentPulse */}
            <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  TalentPulse HRIS
                </span>
                <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">Active</span>
              </div>
              <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 mt-0.5">
                Personnel Information & Dossier Management
              </p>
            </div>

            {/* BoekhoudGemak */}
            <div className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                  BoekhoudGemak
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.boekhoudGemakShortDesc}
              </p>
              <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] text-slate-400">Ledger: BG-SAL-2026</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenIntegrations();
                  }}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-medium"
                >
                  Manage Sync
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Kopilot Project */}
            <div className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                  Kopilot Project
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.kopilotShortDesc}
              </p>
              <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] text-slate-400">Allocation: 194h/wk</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenIntegrations();
                  }}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-medium"
                >
                  Manage Sync
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenIntegrations();
              }}
              className="w-full py-1.5 px-2 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{t.integrationsTitle}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
