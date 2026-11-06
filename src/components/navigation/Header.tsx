import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Shield, ChevronDown, UserCheck, RefreshCw, Radio } from 'lucide-react';
import { DEMO_USERS, NIGERIA_STATES } from '../../data/seedData';
import { UserRole } from '../../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, switchPersona, loginWithGoogle, logout, firebaseUser } = useAuth();
  const { selectedState, setSelectedState, stats, resetToDefaultSeed } = useData();
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'incident_commander':
        return 'Incident Commander';
      case 'epidemiologist':
        return 'Human Health (NCDC)';
      case 'veterinary_officer':
        return 'Animal Health (Veterinary)';
      case 'environmental_officer':
        return 'Environmental Officer';
      case 'researcher_observer':
        return 'International Observer';
      default:
        return 'Authorized Official';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#090D1A] border-b border-slate-800/80 text-white shadow-lg">
      <div className="flex items-center justify-between gap-6 px-6 py-3.5">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap font-display">
                BIOSENTINEL X
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                ONE HEALTH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block leading-none mt-0.5">
              Predicting Health Threats Before They Become Health Emergencies
            </p>
          </div>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('command_centre')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'command_centre'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Command Centre
          </button>
          <button
            onClick={() => setActiveTab('zoonotic')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'zoonotic'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Zoonotic Diseases
          </button>
          <button
            onClick={() => setActiveTab('geospatial')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'geospatial'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Geospatial Intel
          </button>
          <button
            onClick={() => setActiveTab('ai_analyst')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'ai_analyst'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            AI One Health Analyst
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'emergency'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Active Responses
          </button>
        </nav>

        {/* Zone 3: 1 primary action zone with Persona Switcher and State Filter */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Jurisdiction Selector */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <span className="text-slate-400 uppercase text-[10px] font-mono">Jurisdiction:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="All Nigeria" className="bg-slate-900 text-white">All Nigeria (Federal)</option>
              {NIGERIA_STATES.map((s) => (
                <option key={s.name} value={s.name} className="bg-slate-900 text-white">
                  {s.name} ({s.zone})
                </option>
              ))}
            </select>
          </div>

          {/* User Persona & Access Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                {currentUser.displayName.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold leading-tight text-white">{currentUser.displayName}</div>
                <div className="text-[10px] text-slate-400 font-mono leading-none">
                  {getRoleBadge(currentUser.role)}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {isPersonaMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-slate-800 mb-1">
                  <div className="text-xs font-semibold text-white">{currentUser.displayName}</div>
                  <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                    {currentUser.facility}
                  </div>
                </div>

                <div className="px-2 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Switch Institutional Role (RBAC)
                </div>

                {DEMO_USERS.map((user) => (
                  <button
                    key={user.role}
                    onClick={() => {
                      switchPersona(user.role);
                      setIsPersonaMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === user.role
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{user.displayName}</div>
                      <div className="text-[10px] text-slate-400">{getRoleBadge(user.role)}</div>
                    </div>
                    {currentUser.role === user.role && (
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                ))}

                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between gap-2 px-1">
                  <button
                    onClick={() => {
                      resetToDefaultSeed();
                      setIsPersonaMenuOpen(false);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-800"
                    title="Reset surveillance dataset to pristine demonstration state"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset Data
                  </button>

                  {firebaseUser ? (
                    <button
                      onClick={() => {
                        logout();
                        setIsPersonaMenuOpen(false);
                      }}
                      className="text-[11px] text-rose-400 hover:text-rose-300 py-1 px-2"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        loginWithGoogle();
                        setIsPersonaMenuOpen(false);
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 py-1 px-2 font-medium"
                    >
                      Google Sign-In
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
