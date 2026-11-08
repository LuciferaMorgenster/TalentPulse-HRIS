import React from 'react';
import { Users, ChevronDown, ArrowRight } from 'lucide-react';
import { Employee } from '../types';
import { Translations } from '../translations';

interface OrgChartViewProps {
  employees: Employee[];
  onOpenEmployeeProfile: (emp: Employee) => void;
  t: Translations;
}

export const OrgChartView: React.FC<OrgChartViewProps> = ({
  employees,
  onOpenEmployeeProfile,
  t,
}) => {
  // Group employees by department
  const depts = Array.from(new Set(employees.map((e) => e.department)));

  const sanne = employees.find((e) => e.role.includes('VP of Engineering'));
  const emma = employees.find((e) => e.role.includes('Head of People'));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
          {t.orgChartTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t.orgChartSubtitle}
        </p>
      </div>

      {/* Visual Hierarchy Tree */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-8 shadow-2xs overflow-x-auto">
        
        {/* Level 1: Board / Executive */}
        <div className="flex flex-col items-center">
          <div className="px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-center shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 dark:text-slate-600 block">
              Governance
            </span>
            <span className="text-sm font-bold font-display">Executive Board & Founders</span>
          </div>
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Level 2: Department Heads & VPs */}
        <div className="flex flex-wrap justify-center gap-6 relative">
          
          {/* Engineering Lead */}
          {sanne && (
            <div 
              onClick={() => onOpenEmployeeProfile(sanne)}
              className="w-64 p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 hover:border-blue-400 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  {sanne.firstName[0]}{sanne.lastName[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {sanne.firstName} {sanne.lastName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{sanne.role}</p>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    Engineering Division Lead
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* People & Operations Lead */}
          {emma && (
            <div 
              onClick={() => onOpenEmployeeProfile(emma)}
              className="w-64 p-4 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/30 hover:border-purple-400 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                  {emma.firstName[0]}{emma.lastName[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    {emma.firstName} {emma.lastName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{emma.role}</p>
                  <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                    Operations & Culture Lead
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Level 3: Department Squads Grid */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 text-center">
            Departmental Breakdown & Team Members
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {depts.map((dept) => {
              const teamMembers = employees.filter((e) => e.department === dept);
              return (
                <div
                  key={dept}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {dept}
                    </h4>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {teamMembers.length} Members
                    </span>
                  </div>

                  <div className="space-y-2">
                    {teamMembers.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => onOpenEmployeeProfile(emp)}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50/60 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700 flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 block">
                              {emp.firstName} {emp.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                              {emp.role}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          emp.status === 'Active' ? 'text-emerald-700 dark:text-emerald-300' :
                          emp.status === 'On Leave' ? 'text-amber-700 dark:text-amber-300' :
                          'text-blue-700 dark:text-blue-300'
                        }`}>
                          {emp.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
