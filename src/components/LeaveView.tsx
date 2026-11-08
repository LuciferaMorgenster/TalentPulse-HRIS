import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Plus, CheckCircle2, XCircle, Clock, 
  ChevronLeft, ChevronRight, User, AlertCircle 
} from 'lucide-react';
import { Employee, LeaveRequest, LeaveType } from '../types';
import { Translations } from '../translations';

interface LeaveViewProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  onApproveLeave: (requestId: string) => void;
  onRejectLeave: (requestId: string) => void;
  onSubmitLeave: (request: Omit<LeaveRequest, 'id' | 'status' | 'requestedOn'>) => void;
  t: Translations;
}

export const LeaveView: React.FC<LeaveViewProps> = ({
  employees,
  leaveRequests,
  onApproveLeave,
  onRejectLeave,
  onSubmitLeave,
  t,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // New request state
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<LeaveType>('Vacation');
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [daysCount, setDaysCount] = useState(5);
  const [reason, setReason] = useState('');

  // Calendar month state (November 2026)
  const [currentMonth, setCurrentMonth] = useState({ year: 2026, month: 10 }); // 0-indexed month (10 = November)

  const pendingCount = leaveRequests.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaveRequests.filter((l) => l.status === 'Approved').length;

  const filteredRequests = leaveRequests.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === selectedEmpId);
    if (!emp) return;

    onSubmitLeave({
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      type: leaveType,
      startDate,
      endDate,
      daysCount: Number(daysCount),
      reason: reason || 'Planned absence',
    });

    setIsModalOpen(false);
    setReason('');
  };

  // Calendar day generator for November 2026 (30 days)
  const daysInMonth = 30;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getAbsencesForDay = (dayNum: number) => {
    const dateStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
    return leaveRequests.filter((req) => {
      if (req.status !== 'Approved') return false;
      return dateStr >= req.startDate && dateStr <= req.endDate;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header and KPI strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            {t.leaveTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.leaveSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.requestLeave}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.pending} {t.leaveTitle}
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {pendingCount}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            Awaiting manager action
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Approved Absences
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {approvedCount}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Confirmed on company calendar
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Personnel Onboard
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {employees.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active tracking & entitlement quotas
          </div>
        </div>
      </div>

      {/* Main Grid: Request List & Visual Monthly Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Leave Requests Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Leave Requests & Approvals
              </h3>
              
              {/* Filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                {['all', 'Pending', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilterStatus(status)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredRequests.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No requests matching current filter.
                </div>
              ) : (
                filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {req.employeeName}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs text-slate-500">{req.department}</span>
                        <span className="text-slate-400">·</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          req.type === 'Vacation' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                          req.type === 'Sick' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {req.type}
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-2">
                        <span className="font-mono">{req.startDate}</span>
                        <span>to</span>
                        <span className="font-mono">{req.endDate}</span>
                        <span>({req.daysCount} days)</span>
                        {req.reason && <span className="italic text-slate-400">“{req.reason}”</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onApproveLeave(req.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.approve}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectLeave(req.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{t.reject}</span>
                          </button>
                        </>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right (1 col): Monthly Absence Calendar */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              November 2026 Calendar
            </h3>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
            <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty padding days for Sunday Nov 1 start if needed */}
            {daysArray.map((day) => {
              const absences = getAbsencesForDay(day);
              const hasAbsence = absences.length > 0;
              const isToday = day === 7;

              return (
                <div
                  key={day}
                  className={`min-h-[48px] p-1 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                    isToday
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/40'
                      : hasAbsence
                      ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20'
                      : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/20'
                  }`}
                >
                  <span className={`text-[10px] font-mono font-semibold ${
                    isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'
                  }`}>
                    {day}
                  </span>

                  {hasAbsence && (
                    <div className="space-y-0.5 mt-0.5">
                      {absences.map((a) => (
                        <div
                          key={a.id}
                          className="text-[9px] truncate px-1 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-medium"
                          title={`${a.employeeName} (${a.type})`}
                        >
                          {a.employeeName.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-blue-500" />
              <span>Current date marker (Nov 7, 2026)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-amber-400" />
              <span>Approved employee absence</span>
            </div>
          </div>
        </div>

      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.requestLeave}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Employee
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {t.leaveType}
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Vacation">{t.typeVacation}</option>
                  <option value="Sick">{t.typeSick}</option>
                  <option value="Parental">{t.typeParental}</option>
                  <option value="Training">{t.typeTraining}</option>
                  <option value="Unpaid">{t.typeUnpaid}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {t.startDate}
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {t.endDate}
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {t.leaveDays}
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={daysCount}
                  onChange={(e) => setDaysCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {t.leaveReason}
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Optional note for the approving manager..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
