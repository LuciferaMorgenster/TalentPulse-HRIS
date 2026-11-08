import React from 'react';
import { 
  FileText, Download, AlertTriangle, CheckCircle2, 
  Calendar, DollarSign, Clock, Calculator, ArrowUpRight 
} from 'lucide-react';
import { Employee } from '../types';
import { Translations } from '../translations';

interface ContractsViewProps {
  employees: Employee[];
  onExportBoekhoudGemak: () => void;
  onOpenEmployeeProfile: (emp: Employee) => void;
  t: Translations;
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  employees,
  onExportBoekhoudGemak,
  onOpenEmployeeProfile,
  t,
}) => {
  const now = new Date('2026-11-07');

  const expiringContracts = employees.filter((e) => {
    if (!e.contractEndDate) return false;
    const end = new Date(e.contractEndDate);
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 60;
  });

  const totalMonthlyGross = employees.reduce((acc, e) => acc + e.salary.amount, 0);
  const totalAnnualCost = totalMonthlyGross * 12.96; // 8% vacation allowance included (Dutch standard)

  return (
    <div className="space-y-6">
      
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            {t.contractsTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.contractsSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onExportBoekhoudGemak}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Calculator className="w-4 h-4" />
          <span>{t.exportPayroll}</span>
        </button>
      </div>

      {/* Expiration Alert Banner (if any) */}
      {expiringContracts.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-900/70 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{expiringContracts.length} Contract(s) Expiring Within 60 Days:</span>
          </div>
          <div className="pl-6 space-y-1">
            {expiringContracts.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between">
                <span>
                  <strong>{emp.firstName} {emp.lastName}</strong> ({emp.role}) – Contract terminates on <span className="font-mono">{emp.contractEndDate}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onOpenEmployeeProfile(emp)}
                  className="text-blue-600 dark:text-blue-400 underline font-semibold ml-2 hover:text-blue-800"
                >
                  Review Dossier
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Total Monthly Gross Payroll
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            €{totalMonthlyGross.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Base salaries before tax & pension
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Projected Annualized Workforce Cost
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            €{Math.round(totalAnnualCost).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Includes standard 8% vakantiegeld
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            BoekhoudGemak Ledger Status
          </span>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-5 h-5" />
            <span>Ready for Payroll Posting</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            All SEPA/IBANs formatted
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Personnel Contracts & Compensation Roster
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {employees.length} Active Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Role & Dept</th>
                <th className="py-3 px-4">Contract Type</th>
                <th className="py-3 px-4">Hours/Wk</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Contract Expiry</th>
                <th className="py-3 px-4 text-right">Monthly Gross</th>
                <th className="py-3 px-4">BoekhoudGemak ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {employees.map((emp) => {
                const isExpiring = expiringContracts.some((e) => e.id === emp.id);
                return (
                  <tr
                    key={emp.id}
                    onClick={() => onOpenEmployeeProfile(emp)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <div>{emp.role}</div>
                      <div className="text-[11px] text-slate-400">{emp.department}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {emp.employmentType}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {emp.hoursPerWeek} hrs
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {emp.startDate}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {emp.contractEndDate ? (
                        <span className={isExpiring ? 'text-amber-600 font-bold flex items-center gap-1' : 'text-slate-600 dark:text-slate-400'}>
                          {isExpiring && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                          {emp.contractEndDate}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Indefinite</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      €{emp.salary.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                      {emp.boekhoudGemakSync.ledgerCode || 'BG-PENDING'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
