export type Language = 'en' | 'nl' | 'de' | 'fr' | 'es';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contractor' | 'Intern';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Onboarding' | 'Departed';
export type LeaveType = 'Vacation' | 'Sick' | 'Parental' | 'Unpaid' | 'Training';
export type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  employmentType: EmploymentType;
  startDate: string;
  contractEndDate?: string;
  salary: {
    amount: number;
    currency: string;
    period: 'month' | 'year';
  };
  managerId?: string;
  managerName?: string;
  status: EmployeeStatus;
  skills: string[];
  location: string;
  iban: string;
  taxId: string; // BSN or national tax number
  hoursPerWeek: number;
  ptoAllowanceDays: number;
  ptoUsedDays: number;
  notes?: string;
  boekhoudGemakSync: {
    synced: boolean;
    lastSync?: string;
    ledgerCode?: string;
  };
  kopilotSync: {
    synced: boolean;
    lastSync?: string;
    activeProjects: string[];
    capacityHours: number;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: LeaveStatus;
  reason: string;
  requestedOn: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  rating: number; // 1 to 5
  reviewerName: string;
  goalsCompleted: number;
  totalGoals: number;
  feedback: string;
  date: string;
}

export interface SyncLog {
  id: string;
  system: 'BoekhoudGemak' | 'Kopilot Project';
  action: string;
  timestamp: string;
  status: 'Success' | 'In Progress' | 'Warning';
  details: string;
}
