import React from 'react';
import {
  LayoutDashboard,
  Biohazard,
  Droplets,
  Bug,
  BrainCircuit,
  MapPin,
  AlertTriangle,
  FileSpreadsheet,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
}) => {
  const { stats, selectedState } = useData();

  const navItems = [
    {
      id: 'command_centre',
      label: 'Command Centre',
      icon: LayoutDashboard,
      badge: stats.criticalAlertsCount > 0 ? `${stats.criticalAlertsCount} alerts` : undefined,
      badgeColor: 'bg-rose-950/80 text-rose-300 border border-rose-800/60',
    },
    {
      id: 'zoonotic',
      label: 'Zoonotic Intelligence',
      icon: Biohazard,
      badge: `${stats.totalHumanCases} cases`,
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60',
    },
    {
      id: 'environmental',
      label: 'Environmental Health',
      icon: Droplets,
    },
    {
      id: 'vector',
      label: 'Vector Surveillance',
      icon: Bug,
    },
    {
      id: 'ai_analyst',
      label: 'Biosentinel AI Analyst',
      icon: BrainCircuit,
      badge: 'Gemini',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60',
    },
    {
      id: 'geospatial',
      label: 'Geospatial Intelligence',
      icon: MapPin,
    },
    {
      id: 'emergency',
      label: 'Emergency Responses',
      icon: AlertTriangle,
      badge: stats.activeInvestigationsCount > 0 ? `${stats.activeInvestigationsCount} active` : undefined,
      badgeColor: 'bg-amber-950/80 text-amber-300 border border-amber-800/60',
    },
    {
      id: 'reporting',
      label: 'Reporting & Analytics',
      icon: FileSpreadsheet,
    },
    {
      id: 'audit',
      label: 'Security & Audit Logs',
      icon: ShieldAlert,
    },
  ];

  return (
    <aside
      className={`bg-[#060A14] border-r border-slate-800/80 flex flex-col justify-between transition-all duration-200 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="py-4">
        {/* Active Scope Card */}
        {!isCollapsed && (
          <div className="mx-3 mb-4 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Surveillance Scope</span>
            </div>
            <div className="font-semibold text-slate-200 truncate">{selectedState}</div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
              <span>Threat Level</span>
              <span className={`font-mono font-semibold ${
                stats.spilloverRiskScore > 75 ? 'text-rose-400' : stats.spilloverRiskScore > 50 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {stats.spilloverRiskScore}/100
              </span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800/90 text-white border border-slate-700/80 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
                title={item.label}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                />
                {!isCollapsed && (
                  <div className="flex-1 text-left flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ml-1.5 ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer system details */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/70 text-[11px] text-slate-400">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span>PLATFORM</span>
            <span className="text-emerald-400">OPERATIONAL</span>
          </div>
          <div className="text-slate-400 text-[10px]">
            Federal One Health Inter-Agency Protocol v3.4
          </div>
        </div>
      )}
    </aside>
  );
};
