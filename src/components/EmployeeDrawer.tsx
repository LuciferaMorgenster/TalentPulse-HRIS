import React, { useState } from 'react';
import { 
  X, Mail, Phone, MapPin, Calendar, Clock, DollarSign, 
  Shield, CheckCircle2, AlertCircle, Edit2, Trash2, Briefcase, Calculator
} from 'lucide-react';
import { Employee } from '../types';
import { Translations } from '../translations';

interface EmployeeDrawerProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
  onDelete: (empId: string) => void;
  onToggleBoekhoudGemak: (empId: string) => void;
  onToggleKopilot: (empId: string) => void;
  t: Translations;
}

export const EmployeeDrawer: React.FC<EmployeeDrawerProps> = ({
  employee,
  onClose,
  onEdit,
  onDelete,
  onToggleBoekhoudGemak,
  onToggleKopilot,
  t,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'capacity'>('overview');

  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/70 dark:bg-slate-800/40">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {employee.firstName[0]}{employee.lastName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    employee.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : employee.status === 'On Leave'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {employee.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {employee.role} · <span className="text-slate-700 dark:text-slate-300">{employee.department}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(employee)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                title={t.editEmployee}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to remove ${employee.firstName} ${employee.lastName}?`)) {
                    onDelete(employee.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title={t.deleteEmployee}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-6 bg-white dark:bg-slate-900 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Overview & Role
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('financial')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'financial'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Financial & BoekhoudGemak
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('capacity')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'capacity'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Capacity & Kopilot Project
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {activeTab === 'overview' && (
              <>
                {/* Contact information */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t.contactDetails}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{employee.location}</span>
                    </div>
                  </div>
                </div>

                {/* Job & Contract parameters */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t.jobDetails}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">{t.employmentType}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.employmentType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.hoursPerWeek}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">{employee.hoursPerWeek} hrs/week</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.startDate}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{employee.startDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.contractEnd}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {employee.contractEndDate || 'Indefinite / Permanent'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block">{t.manager}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.managerName || 'Direct Executive'}</span>
                    </div>
                  </div>
                </div>

                {/* PTO Allowance */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      PTO & Holiday Entitlement
                    </h4>
                    <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {employee.ptoAllowanceDays - employee.ptoUsedDays} Days Remaining
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (employee.ptoUsedDays / employee.ptoAllowanceDays) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Used: {employee.ptoUsedDays} days</span>
                    <span>Annual Quota: {employee.ptoAllowanceDays} days</span>
                  </div>
                </div>

                {/* Notes */}
                {employee.notes && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      Personnel Dossier Notes
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {employee.notes}
                    </p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'financial' && (
              <>
                {/* Salary & Compensation */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Compensation
                  </h4>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Gross Monthly Salary:</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      €{employee.salary.amount.toLocaleString()} / mo
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Annualized Estimate (incl. 8% holiday allowance):</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                      €{(employee.salary.amount * 12.96).toLocaleString()} / yr
                    </span>
                  </div>
                </div>

                {/* Fiscal & Banking */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t.financialCompliance}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">{t.taxId}</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{employee.taxId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.iban}</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{employee.iban}</span>
                    </div>
                  </div>
                </div>

                {/* BoekhoudGemak Integration Card */}
                <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          BoekhoudGemak Sync
                        </h4>
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                          Payroll Journal & SEPA Export
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleBoekhoudGemak(employee.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        employee.boekhoudGemakSync.synced
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {employee.boekhoudGemakSync.synced ? 'Synced' : 'Enable Sync'}
                    </button>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 pt-2 border-t border-emerald-200/40 dark:border-emerald-800/40">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ledger Mapping:</span>
                      <span className="font-mono font-semibold">{employee.boekhoudGemakSync.ledgerCode || 'BG-AUTO'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Synced:</span>
                      <span className="font-mono">{employee.boekhoudGemakSync.lastSync || 'Never'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'capacity' && (
              <>
                {/* Skills Inventory */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Skills Matrix & Competencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {employee.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Kopilot Project Integration Card */}
                <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Kopilot Project Integration
                        </h4>
                        <span className="text-[11px] text-purple-700 dark:text-purple-300">
                          Capacity & Resource Allocation
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleKopilot(employee.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        employee.kopilotSync.synced
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {employee.kopilotSync.synced ? 'Synced' : 'Enable Sync'}
                    </button>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 pt-2 border-t border-purple-200/40 dark:border-purple-800/40">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Workspaces:</span>
                      <span className="font-semibold">
                        {employee.kopilotSync.activeProjects.length > 0
                          ? employee.kopilotSync.activeProjects.join(', ')
                          : 'Unassigned'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Allocated Capacity:</span>
                      <span className="font-mono font-semibold">{employee.hoursPerWeek} hrs/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Synced:</span>
                      <span className="font-mono">{employee.kopilotSync.lastSync || 'Never'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={() => onEdit(employee)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              {t.editEmployee}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
