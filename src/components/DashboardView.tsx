import React from 'react';
import { 
  Users, Calendar, Clock, RefreshCw, 
  ArrowRight, CheckCircle2, ChevronRight, Calculator, Briefcase
} from 'lucide-react';
import { Employee, LeaveRequest, SyncLog } from '../types';
import { Translations } from '../translations';

interface DashboardViewProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  syncLogs: SyncLog[];
  onSelectTab: (tab: string) => void;
  onOpenEmployeeProfile: (emp: Employee) => void;
  onTriggerSyncAll: () => void;
  isSyncingAll: boolean;
  t: Translations;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  leaveRequests,
  syncLogs,
  onSelectTab,
  onOpenEmployeeProfile,
  onTriggerSyncAll,
  isSyncingAll,
  t,
}) => {
  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  
  // Calculate total monthly payroll
  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + e.salary.amount, 0);
  
  // Calculate average weekly hours
  const avgHours = totalEmployees > 0 
    ? Math.round(employees.reduce((sum, e) => sum + e.hoursPerWeek, 0) / totalEmployees) 
    : 40;

  // Contracts expiring in < 60 days
  const now = new Date('2026-11-07');
  const expiringContracts = employees.filter((e) => {
    if (!e.contractEndDate) return false;
    const end = new Date(e.contractEndDate);
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 60;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Cover Image */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm">
        <div className="relative h-64 sm:h-72 w-full">
          <img
            src="/cover.jpg"
            alt="TalentPulse HR Executive Dashboard"
            className="w-full h-full object-cover object-center opacity-45 transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-300">
                TalentPulse HRIS · v2.6.4
              </span>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span className="text-xs text-slate-300">
                Connected to BoekhoudGemak & Kopilot Project
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2 max-w-2xl text-balance">
              {t.coverBannerTitle}
            </h1>
            <p className="text-sm text-slate-200 max-w-3xl mb-4 leading-relaxed line-clamp-2">
              {t.coverBannerDesc}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onTriggerSyncAll}
                disabled={isSyncingAll}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
                <span>{isSyncingAll ? t.syncing : t.coverBannerAction}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('employees')}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg backdrop-blur-sm transition-colors border border-white/10"
              >
                <span>{t.navEmployees}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Employees */}
        <div 
          onClick={() => onSelectTab('employees')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.totalPersonnel}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalEmployees}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              100% recorded
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{activeCount} {t.statusActive.toLowerCase()}</span>
            <span>·</span>
            <span>{onLeaveCount} {t.statusOnLeave.toLowerCase()}</span>
          </div>
        </div>

        {/* KPI 2: Pending Leave Requests */}
        <div 
          onClick={() => onSelectTab('leave')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.pendingLeave}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {pendingLeaves}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Action required
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Review holiday & absence requests
          </div>
        </div>

        {/* KPI 3: Contracts Expiring Soon */}
        <div 
          onClick={() => onSelectTab('contracts')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.contractsReview}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {expiringContracts.length}
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              Within 60 days
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Monthly gross: €{totalMonthlyPayroll.toLocaleString()}
          </div>
        </div>

        {/* KPI 4: Ecosystem Sync Status */}
        <div 
          onClick={() => onSelectTab('integrations')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Ecosystem Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              BoekhoudGemak & Kopilot
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>2 Connected Services Synced</span>
          </div>
        </div>

      </div>

      {/* Two-Column Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Quick Roster & Upcoming Leaves */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Roster List */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Key Personnel & Department Leads
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct overview of active employees, roles, and connected integrations
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('employees')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{t.viewAll}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {employees.slice(0, 5).map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => onOpenEmployeeProfile(emp)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/50 px-2 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {emp.firstName} {emp.lastName}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{emp.department}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{emp.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-xs">
                      {emp.boekhoudGemakSync.synced && (
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          BoekhoudGemak
                        </span>
                      )}
                      {emp.kopilotSync.synced && (
                        <span className="text-[11px] text-purple-700 dark:text-purple-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-purple-500" />
                          Kopilot
                        </span>
                      )}
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      emp.status === 'Active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : emp.status === 'On Leave'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                    }`}>
                      {emp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Absence Approvals */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {t.leaveTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Active absence requests awaiting approval
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('leave')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{t.viewAll}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {leaveRequests.filter((l) => l.status === 'Pending').length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  No pending absence requests. All requests are up to date!
                </div>
              ) : (
                leaveRequests
                  .filter((l) => l.status === 'Pending')
                  .map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {req.employeeName}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500">{req.type}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {req.startDate} to {req.endDate} ({req.daysCount} days) · &ldquo;{req.reason}&rdquo;
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectTab('leave')}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                      >
                        Review
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column (1 span): BoekhoudGemak & Kopilot Connected Console */}
        <div className="space-y-6">
          
          {/* BoekhoudGemak Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    BoekhoudGemak
                  </h4>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    App Listed & Connected
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {t.boekhoudGemakFullDesc}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs mb-4">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Monthly Payroll Sum:</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  €{totalMonthlyPayroll.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>SEPA/IBAN Verified:</span>
                <span className="font-semibold text-emerald-600">
                  {employees.filter((e) => e.iban).length} / {totalEmployees}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Fiscal BSN Synced:</span>
                <span className="font-semibold text-emerald-600">
                  {employees.filter((e) => e.taxId).length} / {totalEmployees}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('integrations')}
              className="w-full py-2 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800 text-center"
            >
              Open BoekhoudGemak Console
            </button>
          </div>

          {/* Kopilot Project Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Kopilot Project
                  </h4>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    App Listed & Connected
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {t.kopilotFullDesc}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs mb-4">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Active Projects:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  5 Workspaces
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Total Weekly Capacity:</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  {employees.reduce((acc, e) => acc + (e.kopilotSync.synced ? e.hoursPerWeek : 0), 0)} hrs/wk
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Assigned Staff:</span>
                <span className="font-semibold text-purple-600">
                  {employees.filter((e) => e.kopilotSync.synced).length} Personnel
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('integrations')}
              className="w-full py-2 px-3 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors border border-purple-200 dark:border-purple-800 text-center"
            >
              Open Kopilot Project Console
            </button>
          </div>

          {/* Recent Audit / Sync Logs Snippet */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              {t.syncLogs}
            </h4>
            <div className="space-y-2.5">
              {syncLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.system}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.timestamp.split(' ')[1]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
