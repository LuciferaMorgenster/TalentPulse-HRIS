import React, { useState } from 'react';
import { 
  Calculator, Briefcase, RefreshCw, CheckCircle2, 
  ArrowUpRight, ShieldCheck, Database, FileText, Check, Clock
} from 'lucide-react';
import { SyncLog, Employee } from '../types';
import { Translations } from '../translations';

interface IntegrationsViewProps {
  employees: Employee[];
  syncLogs: SyncLog[];
  onTriggerSyncBoekhoudGemak: () => void;
  onTriggerSyncKopilot: () => void;
  onTriggerSyncAll: () => void;
  isSyncingAll: boolean;
  t: Translations;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  employees,
  syncLogs,
  onTriggerSyncBoekhoudGemak,
  onTriggerSyncKopilot,
  onTriggerSyncAll,
  isSyncingAll,
  t,
}) => {
  const [bgSyncing, setBgSyncing] = useState(false);
  const [kpSyncing, setKpSyncing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSyncBG = () => {
    setBgSyncing(true);
    setTimeout(() => {
      onTriggerSyncBoekhoudGemak();
      setBgSyncing(false);
      setNotification('BoekhoudGemak payroll records synchronized successfully!');
      setTimeout(() => setNotification(null), 3000);
    }, 1200);
  };

  const handleSyncKP = () => {
    setKpSyncing(true);
    setTimeout(() => {
      onTriggerSyncKopilot();
      setKpSyncing(false);
      setNotification('Kopilot Project workforce capacity synchronized successfully!');
      setTimeout(() => setNotification(null), 3000);
    }, 1200);
  };

  const bgSyncedCount = employees.filter((e) => e.boekhoudGemakSync.synced).length;
  const kpSyncedCount = employees.filter((e) => e.kopilotSync.synced).length;
  const totalWeeklyCapacity = employees.reduce((acc, e) => acc + (e.kopilotSync.synced ? e.hoursPerWeek : 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header and Global Sync */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            {t.integrationsTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.integrationsSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onTriggerSyncAll}
          disabled={isSyncingAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
          <span>{isSyncingAll ? t.syncing : t.syncAll}</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Two Integration Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BoekhoudGemak Integration Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xs">
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  BoekhoudGemak
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Accounting & Payroll Integration
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Listed & Connected
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.boekhoudGemakFullDesc}
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Synchronized Dossiers:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {bgSyncedCount} of {employees.length} Personnel
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Total Monthly Gross:</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                €{employees.reduce((acc, e) => acc + (e.boekhoudGemakSync.synced ? e.salary.amount : 0), 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Fiscal Compliance Format:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">Dutch Tax / BSN Compliant</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>SEPA Journal Ledger:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">BG-SAL-2026-ACTIVE</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSyncBG}
              disabled={bgSyncing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${bgSyncing ? 'animate-spin' : ''}`} />
              <span>{bgSyncing ? t.syncing : 'Sync BoekhoudGemak'}</span>
            </button>
            <a
              href="#open-boekhoudgemak"
              onClick={(e) => {
                e.preventDefault();
                alert('Opening BoekhoudGemak workspace in your application suite.');
              }}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <span>Open App</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Kopilot Project Integration Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xs">
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Kopilot Project
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Project Delivery & Task Allocation
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              Listed & Connected
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.kopilotFullDesc}
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Synchronized Staff:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {kpSyncedCount} of {employees.length} Personnel
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Allocated Weekly Capacity:</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                {totalWeeklyCapacity} Hours / Week
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Active Workspaces:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                5 Sprints & Projects
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Absence Calendar Bridge:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">Live Auto-Deduction Active</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSyncKP}
              disabled={kpSyncing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${kpSyncing ? 'animate-spin' : ''}`} />
              <span>{kpSyncing ? t.syncing : 'Sync Kopilot Project'}</span>
            </button>
            <a
              href="#open-kopilot"
              onClick={(e) => {
                e.preventDefault();
                alert('Opening Kopilot Project workspace in your application suite.');
              }}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <span>Open App</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

      {/* Sync Activity & Audit Log */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.syncLogs}
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {syncLogs.length} Events Logged
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {syncLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.system === 'BoekhoudGemak'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                  }`}>
                    {log.system}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {log.action}
                  </span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">
                  {log.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 pl-1 leading-relaxed">
                {log.details}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
