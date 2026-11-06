import React from 'react';
import { useData } from '../../context/DataContext';
import { NigeriaMap } from '../map/NigeriaMap';
import {
  Users,
  PawPrint,
  Droplets,
  Bug,
  AlertTriangle,
  Activity,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { NIGERIA_STATES } from '../../data/seedData';

interface CommandCentreProps {
  onNavigate: (tab: string) => void;
}

export const CommandCentre: React.FC<CommandCentreProps> = ({ onNavigate }) => {
  const {
    filteredZoonotic,
    filteredEnvironmental,
    filteredVectors,
    filteredInvestigations,
    stats,
    selectedState,
    setSelectedState,
  } = useData();

  // Zone aggregation
  const zones = ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West'] as const;
  const zoneBreakdown = zones.map((zone) => {
    const statesInZone = NIGERIA_STATES.filter((s) => s.zone === zone).map((s) => s.name);
    const zCount = filteredZoonotic.filter((r) => statesInZone.includes(r.state)).length;
    const hCases = filteredZoonotic
      .filter((r) => statesInZone.includes(r.state))
      .reduce((acc, curr) => acc + curr.humanCases, 0);
    const eCount = filteredEnvironmental.filter((r) => statesInZone.includes(r.state)).length;
    const invCount = filteredInvestigations.filter((r) => statesInZone.includes(r.state)).length;

    let riskLevel = 'Low';
    if (hCases > 20 || invCount >= 2) riskLevel = 'Urgent';
    else if (hCases > 5 || eCount >= 2) riskLevel = 'Elevated';
    else if (zCount > 0 || eCount > 0) riskLevel = 'Moderate';

    return {
      zone,
      zCount,
      hCases,
      eCount,
      invCount,
      riskLevel,
    };
  });

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner with Generated Intelligence Visual Asset */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#070D1B] p-6 lg:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen overflow-hidden">
          <img
            src="/src/assets/images/hero_onehealth_mesh_1793996790440.jpg"
            alt="One Health Neural Surveillance Network"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SYNCHRONIZED ONE HEALTH SURVEILLANCE TELEMETRY</span>
              <span aria-hidden="true">·</span>
              <span>FEDERAL STRATEGIC BRIEFING</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-display text-balance">
              National One Health Intelligence & Anomaly Command Centre
            </h1>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Synthesizing real-time human hospital sentinels, veterinary abattoir & wildlife surveillance, environmental hydrology sensors, and entomological vector densities across Nigerian ecological corridors.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-4">
              <span>Jurisdiction: <strong className="text-white font-mono">{selectedState}</strong></span>
              <span>Active Threat Level: <strong className={`font-mono ${stats.spilloverRiskScore > 70 ? 'text-rose-400' : 'text-amber-400'}`}>{stats.spilloverRiskScore > 75 ? 'CRITICAL SPILLOVER RISK' : 'ELEVATED MONITORING'} ({stats.spilloverRiskScore}/100)</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('ai_analyst')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Risk Synthesis</span>
            </button>
            <button
              onClick={() => onNavigate('reporting')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Executive SitRep PDF</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards (Tabular Numbers, Strictly Disciplined) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Human Health Signal */}
        <div
          onClick={() => onNavigate('zoonotic')}
          className="cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4.5 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono uppercase text-[11px] tracking-wider">Human Clinical Signals</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {stats.totalHumanCases}
            </span>
            <span className="text-xs font-mono text-rose-400">
              {stats.totalHumanDeaths} deaths
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Active Admissions</span>
            <span className="text-rose-300 font-mono">19 Lassa · 2 H5N1</span>
          </div>
        </div>

        {/* Animal Health Signal */}
        <div
          onClick={() => onNavigate('zoonotic')}
          className="cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4.5 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono uppercase text-[11px] tracking-wider">Animal Health Reports</span>
            <PawPrint className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {stats.totalAnimalCases.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400">
              infected/culled
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Primary Reservoirs</span>
            <span className="text-amber-300 font-mono">Poultry · Rodents · Cattle</span>
          </div>
        </div>

        {/* Environmental Indicators */}
        <div
          onClick={() => onNavigate('environmental')}
          className="cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4.5 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono uppercase text-[11px] tracking-wider">Environmental Hazards</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {filteredEnvironmental.length}
            </span>
            <span className="text-xs font-mono text-cyan-400">
              active alerts
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Water & Flooding</span>
            <span className="text-cyan-300 font-mono">Benue + Rivers + Kano</span>
          </div>
        </div>

        {/* Active Emergency Investigations */}
        <div
          onClick={() => onNavigate('emergency')}
          className="cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4.5 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono uppercase text-[11px] tracking-wider">Active Field Responses</span>
            <AlertTriangle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {stats.activeInvestigationsCount}
            </span>
            <span className="text-xs font-mono text-emerald-400">
              deployed cordons
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Field Teams</span>
            <span className="text-emerald-300 font-mono">148 Contacts Traced</span>
          </div>
        </div>
      </div>

      {/* Main Geospatial Radar Stage & Alert Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nigeria Spatial Radar (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <NigeriaMap height={460} onSelectState={(state) => setSelectedState(state)} />
        </div>

        {/* Active Outbreak Ticker & Immediate Response Panel (1 col) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                  Priority Action Stream
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">LIVE TRIAGE</span>
            </div>

            <div className="space-y-2.5">
              {filteredInvestigations.slice(0, 3).map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => onNavigate('emergency')}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-slate-400">{inv.investigationNumber}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                        inv.priority === 'urgent'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {inv.priority}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-100 line-clamp-1">{inv.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{inv.lga}, {inv.state}</span>
                    <span className="text-emerald-400 font-mono capitalize">{inv.status.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Environmental Cross-Signal */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5" />
                <span>Hydrology Cross-Signal Alert</span>
              </div>
              <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-slate-300">
                <div className="font-medium text-cyan-200">Benue River Inundation (+1.9m Flood Surge)</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Submerged domestic wells in Makurdi correlate with water coliform &gt;520 CFU/100mL. High risk of secondary waterborne cholera wave.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onNavigate('emergency')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
            >
              <span>Manage Emergency Operations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('geospatial')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Full GIS Map &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Geopolitical Zone Matrix & Cross-Domain Trend Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geopolitical Risk Matrix (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                Regional Risk Matrix by Geopolitical Zone
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated cross-domain threat scores across Nigeria's six regional health security zones
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">ZONE METRICS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-2 px-3">Geopolitical Zone</th>
                  <th className="py-2 px-3 text-right">Human Cases</th>
                  <th className="py-2 px-3 text-right">Zoonotic Signals</th>
                  <th className="py-2 px-3 text-right">Env Hazards</th>
                  <th className="py-2 px-3 text-right">Field Teams</th>
                  <th className="py-2 px-3 text-center">Threat Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {zoneBreakdown.map((row) => (
                  <tr key={row.zone} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-medium text-white flex items-center gap-2">
                      <span>{row.zone}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-200">
                      {row.hCases > 0 ? row.hCases : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                      {row.zCount}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                      {row.eCount}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                      {row.invCount}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                          row.riskLevel === 'Urgent'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                            : row.riskLevel === 'Elevated'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : row.riskLevel === 'Moderate'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {row.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Historical Transmission & Predictive Trajectory (1 col) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Cross-Domain Correlation
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Empirical correlation reveals a <strong>14-day lag</strong> between seasonal agricultural flood recession and rodent reservoir ingress into human domestic habitations.
            </p>

            {/* Synthetic Trend Bars */}
            <div className="mt-4 space-y-3 font-mono text-[11px]">
              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Rodent Trap Density (Mastomys)</span>
                  <span className="text-rose-400 font-semibold">+42% vs Baseline</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[84%] h-full bg-rose-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Aedes Breteau Index (Urban Oyo)</span>
                  <span className="text-amber-400 font-semibold">68 (Threshold &gt;50)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[74%] h-full bg-amber-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Water Coliform Overflow (Benue Basin)</span>
                  <span className="text-cyan-400 font-semibold">520 CFU / 100mL</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[92%] h-full bg-cyan-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Poultry Mortality Cluster (H5N1)</span>
                  <span className="text-emerald-400 font-semibold">3,400 culled</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[60%] h-full bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
            <span className="text-slate-300 font-semibold">Statistical Anomaly Engine:</span> Machine learning algorithms flag Edo-Ondo boundary as highest probability spillover corridor through November 2026.
          </div>
        </div>
      </div>
    </div>
  );
};
