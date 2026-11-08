import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { EmployeeDrawer } from './components/EmployeeDrawer';
import { EmployeeModal } from './components/EmployeeModal';
import { LeaveView } from './components/LeaveView';
import { ContractsView } from './components/ContractsView';
import { IntegrationsView } from './components/IntegrationsView';
import { OrgChartView } from './components/OrgChartView';
import { SupportModal } from './components/SupportModal';
import { Employee, LeaveRequest, SyncLog, Language } from './types';
import { translations } from './translations';
import { INITIAL_EMPLOYEES, INITIAL_LEAVE_REQUESTS, INITIAL_SYNC_LOGS } from './data/seedData';
import { Heart, ExternalLink } from 'lucide-react';

export default function App() {
  // Multilingual state (Default is English as requested)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('talentpulse_lang');
    return (saved as Language) || 'en';
  });

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('talentpulse_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Core data states with LocalStorage persistence
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('talentpulse_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('talentpulse_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(() => {
    const saved = localStorage.getItem('talentpulse_sync_logs');
    return saved ? JSON.parse(saved) : INITIAL_SYNC_LOGS;
  });

  // Modals & Drawers
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Employee | null>(null);

  // Global Syncing state
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Sync theme to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('talentpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('talentpulse_theme', 'light');
    }
  }, [darkMode]);

  // Sync language to LocalStorage
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('talentpulse_lang', lang);
  };

  // Persist data changes
  useEffect(() => {
    localStorage.setItem('talentpulse_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('talentpulse_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('talentpulse_sync_logs', JSON.stringify(syncLogs));
  }, [syncLogs]);

  // Current translation bundle
  const t = translations[language];

  // Employee CRUD handlers
  const handleSaveEmployee = (data: Partial<Employee>) => {
    if (data.id) {
      // Update
      const updated = employees.map((emp) =>
        emp.id === data.id ? ({ ...emp, ...data } as Employee) : emp
      );
      setEmployees(updated);
      if (selectedProfile && selectedProfile.id === data.id) {
        setSelectedProfile({ ...selectedProfile, ...data } as Employee);
      }
    } else {
      // Create new
      const newEmployee: Employee = {
        id: `emp-${Date.now().toString().slice(-4)}`,
        firstName: data.firstName || 'New',
        lastName: data.lastName || 'Colleague',
        email: data.email || 'employee@talentpulse.io',
        phone: data.phone || '+31 6 0000 0000',
        role: data.role || 'Team Member',
        department: data.department || 'Engineering',
        employmentType: data.employmentType || 'Full-time',
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        contractEndDate: data.contractEndDate,
        salary: data.salary || { amount: 4500, currency: 'EUR', period: 'month' },
        hoursPerWeek: data.hoursPerWeek || 40,
        ptoAllowanceDays: 25,
        ptoUsedDays: 0,
        status: data.status || 'Active',
        skills: data.skills || ['Communication'],
        location: data.location || 'Amsterdam, Netherlands',
        iban: data.iban || 'NL00BANK0000000000',
        taxId: data.taxId || 'BSN-000000000',
        managerName: data.managerName || 'Direct Lead',
        notes: data.notes || '',
        boekhoudGemakSync: {
          synced: true,
          lastSync: new Date().toISOString().replace('T', ' ').slice(0, 16),
          ledgerCode: `BG-SAL-${Date.now().toString().slice(-4)}`,
        },
        kopilotSync: {
          synced: true,
          lastSync: new Date().toISOString().replace('T', ' ').slice(0, 16),
          activeProjects: ['General Workforce Pool'],
          capacityHours: data.hoursPerWeek || 40,
        },
      };

      setEmployees([newEmployee, ...employees]);

      // Add audit log
      const newLog: SyncLog = {
        id: `sync-${Date.now()}`,
        system: 'BoekhoudGemak',
        action: 'New Employee Profile Provisioned',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'Success',
        details: `Employee ${newEmployee.firstName} ${newEmployee.lastName} (${newEmployee.role}) registered and auto-mapped to BoekhoudGemak payroll ledger.`,
      };
      setSyncLogs([newLog, ...syncLogs]);
    }
  };

  const handleDeleteEmployee = (empId: string) => {
    setEmployees(employees.filter((e) => e.id !== empId));
    if (selectedProfile && selectedProfile.id === empId) {
      setSelectedProfile(null);
    }
  };

  // Leave Handlers
  const handleApproveLeave = (requestId: string) => {
    const req = leaveRequests.find((r) => r.id === requestId);
    if (!req) return;

    // Update leave request
    setLeaveRequests(
      leaveRequests.map((r) => (r.id === requestId ? { ...r, status: 'Approved' } : r))
    );

    // Deduct PTO from employee
    setEmployees(
      employees.map((emp) => {
        if (emp.id === req.employeeId) {
          return {
            ...emp,
            ptoUsedDays: emp.ptoUsedDays + req.daysCount,
          };
        }
        return emp;
      })
    );

    // Add log
    const log: SyncLog = {
      id: `sync-${Date.now()}`,
      system: 'Kopilot Project',
      action: 'Absence Calendar Sync',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Success',
      details: `${req.employeeName} approved absence (${req.daysCount} days: ${req.startDate} to ${req.endDate}) synchronized with Kopilot Project capacity schedule.`,
    };
    setSyncLogs([log, ...syncLogs]);
  };

  const handleRejectLeave = (requestId: string) => {
    setLeaveRequests(
      leaveRequests.map((r) => (r.id === requestId ? { ...r, status: 'Rejected' } : r))
    );
  };

  const handleSubmitLeave = (
    data: Omit<LeaveRequest, 'id' | 'status' | 'requestedOn'>
  ) => {
    const newReq: LeaveRequest = {
      id: `lr-${Date.now()}`,
      ...data,
      status: 'Pending',
      requestedOn: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests([newReq, ...leaveRequests]);
  };

  // Toggle single employee integrations
  const handleToggleBoekhoudGemak = (empId: string) => {
    setEmployees(
      employees.map((emp) => {
        if (emp.id === empId) {
          const current = emp.boekhoudGemakSync.synced;
          return {
            ...emp,
            boekhoudGemakSync: {
              ...emp.boekhoudGemakSync,
              synced: !current,
              lastSync: !current
                ? new Date().toISOString().replace('T', ' ').slice(0, 16)
                : emp.boekhoudGemakSync.lastSync,
            },
          };
        }
        return emp;
      })
    );
  };

  const handleToggleKopilot = (empId: string) => {
    setEmployees(
      employees.map((emp) => {
        if (emp.id === empId) {
          const current = emp.kopilotSync.synced;
          return {
            ...emp,
            kopilotSync: {
              ...emp.kopilotSync,
              synced: !current,
              lastSync: !current
                ? new Date().toISOString().replace('T', ' ').slice(0, 16)
                : emp.kopilotSync.lastSync,
            },
          };
        }
        return emp;
      })
    );
  };

  // Global Sync All Simulation
  const handleTriggerSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
      
      // Update all employees' sync timestamps
      setEmployees((prev) =>
        prev.map((e) => ({
          ...e,
          boekhoudGemakSync: { ...e.boekhoudGemakSync, synced: true, lastSync: nowStr },
          kopilotSync: { ...e.kopilotSync, synced: true, lastSync: nowStr },
        }))
      );

      // Create new audit logs
      const bgLog: SyncLog = {
        id: `sync-${Date.now()}-bg`,
        system: 'BoekhoudGemak',
        action: 'Full Workforce Payroll Batch Sync',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'Success',
        details: `All ${employees.length} employee dossiers successfully validated and exported to BoekhoudGemak payroll journals.`,
      };

      const kpLog: SyncLog = {
        id: `sync-${Date.now()}-kp`,
        system: 'Kopilot Project',
        action: 'Capacity & Resource Matrix Sync',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'Success',
        details: `Full staff capacity allocations and skills matrix synchronized across Kopilot Project active workspaces.`,
      };

      setSyncLogs((prev) => [bgLog, kpLog, ...prev]);
      setIsSyncingAll(false);
    }, 1500);
  };

  // Export BoekhoudGemak Payroll JSON/CSV
  const handleExportBoekhoudGemak = () => {
    const payrollPayload = {
      sourceApp: 'TalentPulse HRIS',
      targetApp: 'BoekhoudGemak',
      exportTimestamp: new Date().toISOString(),
      fiscalYear: 2026,
      currency: 'EUR',
      totalGrossPayroll: employees.reduce((sum, e) => sum + e.salary.amount, 0),
      employeesCount: employees.length,
      records: employees.map((e) => ({
        employeeId: e.id,
        name: `${e.firstName} ${e.lastName}`,
        taxId: e.taxId,
        iban: e.iban,
        monthlyGross: e.salary.amount,
        hoursPerWeek: e.hoursPerWeek,
        department: e.department,
        ledgerCode: e.boekhoudGemakSync.ledgerCode || 'BG-AUTO',
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payrollPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `boekhoudgemak_payroll_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    // Log the export
    const log: SyncLog = {
      id: `sync-${Date.now()}`,
      system: 'BoekhoudGemak',
      action: 'Payroll Journal Export Downloaded',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Success',
      details: `Generated and downloaded verified BoekhoudGemak payroll ledger packet for ${employees.length} personnel.`,
    };
    setSyncLogs([log, ...syncLogs]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Navigation Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAddEmployee={() => {
          setEditingEmployee(null);
          setIsEmployeeModalOpen(true);
        }}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        t={t}
        isSyncingAll={isSyncingAll}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            employees={employees}
            leaveRequests={leaveRequests}
            syncLogs={syncLogs}
            onSelectTab={setCurrentTab}
            onOpenEmployeeProfile={(emp) => setSelectedProfile(emp)}
            onTriggerSyncAll={handleTriggerSyncAll}
            isSyncingAll={isSyncingAll}
            t={t}
          />
        )}

        {currentTab === 'employees' && (
          <EmployeesView
            employees={employees}
            onSelectEmployee={(emp) => setSelectedProfile(emp)}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
            onAddEmployee={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            t={t}
          />
        )}

        {currentTab === 'leave' && (
          <LeaveView
            employees={employees}
            leaveRequests={leaveRequests}
            onApproveLeave={handleApproveLeave}
            onRejectLeave={handleRejectLeave}
            onSubmitLeave={handleSubmitLeave}
            t={t}
          />
        )}

        {currentTab === 'contracts' && (
          <ContractsView
            employees={employees}
            onExportBoekhoudGemak={handleExportBoekhoudGemak}
            onOpenEmployeeProfile={(emp) => setSelectedProfile(emp)}
            t={t}
          />
        )}

        {currentTab === 'integrations' && (
          <IntegrationsView
            employees={employees}
            syncLogs={syncLogs}
            onTriggerSyncBoekhoudGemak={handleTriggerSyncAll}
            onTriggerSyncKopilot={handleTriggerSyncAll}
            onTriggerSyncAll={handleTriggerSyncAll}
            isSyncingAll={isSyncingAll}
            t={t}
          />
        )}

        {currentTab === 'org' && (
          <OrgChartView
            employees={employees}
            onOpenEmployeeProfile={(emp) => setSelectedProfile(emp)}
            t={t}
          />
        )}
      </main>

      {/* Slide-over Employee Dossier Drawer */}
      <EmployeeDrawer
        employee={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onEdit={(emp) => {
          setSelectedProfile(null);
          setEditingEmployee(emp);
          setIsEmployeeModalOpen(true);
        }}
        onDelete={handleDeleteEmployee}
        onToggleBoekhoudGemak={handleToggleBoekhoudGemak}
        onToggleKopilot={handleToggleKopilot}
        t={t}
      />

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialEmployee={editingEmployee}
        t={t}
      />

      {/* Support / Sponsor Modal (PayPal: luciferamorgenster@gmail.com) */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        t={t}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">TalentPulse HRIS</span>
            <span>·</span>
            <span>Connected with BoekhoudGemak & Kopilot Project</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 hover:underline font-semibold"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Support via PayPal (luciferamorgenster@gmail.com)</span>
            </button>
            <span>·</span>
            <span className="uppercase text-[11px] font-bold tracking-wider text-slate-400">
              Lang: {language.toUpperCase()}
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
