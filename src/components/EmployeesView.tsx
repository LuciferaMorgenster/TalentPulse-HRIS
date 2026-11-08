import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, Download, MoreHorizontal, 
  CheckCircle2, XCircle, Eye, Edit2, Trash2, Calculator, Briefcase
} from 'lucide-react';
import { Employee, EmploymentType, EmployeeStatus } from '../types';
import { Translations } from '../translations';

interface EmployeesViewProps {
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (empId: string) => void;
  onAddEmployee: () => void;
  t: Translations;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  onSelectEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onAddEmployee,
  t,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const departments = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department));
    return ['all', ...Array.from(depts)];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.skills.some((s) => s.toLowerCase().includes(q));

      const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
      const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
      const matchesType = selectedType === 'all' || emp.employmentType === selectedType;

      return matchesSearch && matchesDept && matchesStatus && matchesType;
    });
  }, [employees, searchQuery, selectedDept, selectedStatus, selectedType]);

  const handleExportCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Department', 'Type', 'Gross Salary', 'IBAN', 'Tax ID', 'BoekhoudGemak Synced', 'Kopilot Synced'];
    const rows = filteredEmployees.map((e) => [
      e.id,
      `"${e.firstName}"`,
      `"${e.lastName}"`,
      `"${e.email}"`,
      `"${e.role}"`,
      `"${e.department}"`,
      `"${e.employmentType}"`,
      e.salary.amount,
      `"${e.iban}"`,
      `"${e.taxId}"`,
      e.boekhoudGemakSync.synced ? 'Yes' : 'No',
      e.kopilotSync.synced ? 'Yes' : 'No',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `talentpulse_employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      
      {/* Action Bar & Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">{t.allDepartments}</option>
            {departments.filter((d) => d !== 'all').map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">{t.allStatuses}</option>
            <option value="Active">{t.statusActive}</option>
            <option value="On Leave">{t.statusOnLeave}</option>
            <option value="Onboarding">{t.statusOnboarding}</option>
            <option value="Departed">{t.statusDeparted}</option>
          </select>

          {/* Contract Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none hidden sm:block"
          >
            <option value="all">{t.allTypes}</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contractor">Contractor</option>
            <option value="Intern">Intern</option>
          </select>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add Employee CTA */}
          <button
            type="button"
            onClick={onAddEmployee}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addEmployee}</span>
          </button>
        </div>

      </div>

      {/* High-Density Data Grid */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">{t.colName}</th>
                <th className="py-3 px-4">{t.colRole}</th>
                <th className="py-3 px-4">{t.colDept}</th>
                <th className="py-3 px-4">{t.colType}</th>
                <th className="py-3 px-4 text-right">{t.colSalary}</th>
                <th className="py-3 px-4">{t.colIntegrations}</th>
                <th className="py-3 px-4">{t.colStatus}</th>
                <th className="py-3 px-4 text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No employees matched the search filter.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectEmployee(emp)}
                  >
                    {/* Employee Profile & Initial */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {emp.role}
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {emp.department}
                    </td>

                    {/* Type & Hours */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <div>{emp.employmentType}</div>
                      <div className="text-[11px] text-slate-400 font-mono tabular-nums">{emp.hoursPerWeek}h/wk</div>
                    </td>

                    {/* Gross Salary */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                      €{emp.salary.amount.toLocaleString()}
                    </td>

                    {/* BoekhoudGemak & Kopilot Sync status */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span 
                          className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded ${
                            emp.boekhoudGemakSync.synced 
                              ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300' 
                              : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                          }`}
                          title={emp.boekhoudGemakSync.synced ? 'BoekhoudGemak Synced' : 'Not Synced to BoekhoudGemak'}
                        >
                          <Calculator className="w-3 h-3" />
                          <span>BG</span>
                        </span>
                        <span 
                          className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded ${
                            emp.kopilotSync.synced 
                              ? 'text-purple-700 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300' 
                              : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                          }`}
                          title={emp.kopilotSync.synced ? 'Kopilot Project Synced' : 'Not Synced to Kopilot'}
                        >
                          <Briefcase className="w-3 h-3" />
                          <span>KP</span>
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : emp.status === 'On Leave'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Row Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectEmployee(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
                          title={t.viewProfile}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditEmployee(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title={t.editEmployee}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove ${emp.firstName} ${emp.lastName}?`)) {
                              onDeleteEmployee(emp.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          title={t.deleteEmployee}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="py-3 px-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Showing {filteredEmployees.length} of {employees.length} personnel records</span>
          <span className="font-mono tabular-nums">Total Payroll: €{filteredEmployees.reduce((sum, e) => sum + e.salary.amount, 0).toLocaleString()} / mo</span>
        </div>
      </div>

    </div>
  );
};
