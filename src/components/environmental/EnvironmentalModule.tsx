import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { NewEnvironmentalModal } from './NewEnvironmentalModal';
import {
  Droplets,
  Plus,
  Search,
  Waves,
  Trash2,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Gauge,
} from 'lucide-react';
import { EnvironmentalIndicatorType, SeverityLevel } from '../../types';

export const EnvironmentalModule: React.FC = () => {
  const { filteredEnvironmental, selectedState } = useData();
  const { canEditModule } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const displayedReports = filteredEnvironmental.filter((r) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        r.indicatorType.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.lga.toLowerCase().includes(q) ||
        r.locationDetails.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (typeFilter !== 'All' && r.indicatorType !== typeFilter) return false;
    return true;
  });

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-950/80 text-rose-300 border border-rose-800">
            Critical Hazard
          </span>
        );
      case 'elevated':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/80 text-amber-300 border border-amber-800">
            Elevated
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800">
            Moderate
          </span>
        );
      case 'nominal':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
            Nominal
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Droplets className="w-4 h-4" />
            <span>ENVIRONMENTAL HEALTH SURVEILLANCE RADAR</span>
          </div>
          <h1 className="text-xl font-bold text-white font-display">
            Environmental Intelligence, Hydrology & Water Quality
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Correlating water quality coliform counts, seasonal flood inundation, abattoir visceral bio-waste, and temperature indicators with infectious disease vectors.
          </p>
        </div>

        {canEditModule('environmental') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/40 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Environmental Alert</span>
          </button>
        )}
      </div>

      {/* Hydrology & Remote Sensing Feature Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-slate-800 bg-[#070E1C] p-6 text-white flex flex-col justify-between shadow-xl">
          <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-screen">
            <img
              src="/src/assets/images/environmental_hydrology_satellite_1793996791431.jpg"
              alt="Hydrological satellite basin observation"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-cyan-400" />
                <span>BENUE & NIGER RIVER BASIN FLOOD INUNDATION TELEMETRY</span>
              </span>
              <span className="text-slate-400">GAUGE STATION MKD-04</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Critical Inundation Alert: Lower Benue Embankment Breach
            </h2>
            <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
              River levels measured at <strong>+1.9m above seasonal flood threshold</strong>. Contaminated flood surge has inundated domestic boreholes and peri-urban vegetable gardens in Makurdi, creating ideal conditions for secondary waterborne transmission and rodent displacements.
            </p>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <div className="text-slate-400 text-[10px]">WATER COLIFORM</div>
              <div className="text-base font-bold text-rose-400">520 CFU/100mL</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">DISPLACED POP.</div>
              <div className="text-base font-bold text-white">4,200 Persons</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">STAGNATION RISK</div>
              <div className="text-base font-bold text-amber-400">Critical</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">CHLORINATION ACTION</div>
              <div className="text-base font-bold text-emerald-400">In Progress</div>
            </div>
          </div>
        </div>

        {/* Environmental Threat Gauges */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Sanitary Vulnerability Indices
              </span>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span>Waterborne Enteric Threat (Cholera/Vibrio)</span>
                  <span className="text-rose-400 font-mono font-semibold">High (88%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-rose-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span>Abattoir Bio-Waste Contamination</span>
                  <span className="text-amber-400 font-mono font-semibold">Elevated (74%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[74%] h-full bg-amber-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span>Mining / Heavy Metal Runoff (Zamfara)</span>
                  <span className="text-cyan-400 font-mono font-semibold">Local Hotspot</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[62%] h-full bg-cyan-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span>Climatic Heat Stress (Sokoto / Yobe)</span>
                  <span className="text-emerald-400 font-mono font-semibold">38.6°C</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[50%] h-full bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
            One Health Guideline: Ensure drinking water chlorination threshold $\ge$ 0.5mg/L free residual chlorine at consumption point.
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indicator, location, or LGA..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <span className="text-slate-500 text-[10px] font-mono">DOMAIN:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Indicators</option>
              <option value="water_quality" className="bg-slate-900">Water Quality</option>
              <option value="flooding" className="bg-slate-900">Flooding</option>
              <option value="waste_management" className="bg-slate-900">Waste Management</option>
              <option value="climatic" className="bg-slate-900">Climatic / Heat</option>
              <option value="contamination" className="bg-slate-900">Chemical Contamination</option>
            </select>
          </div>
        </div>
      </div>

      {/* Structured Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Indicator & Domain</th>
                <th className="py-3 px-4">Location & Facility</th>
                <th className="py-3 px-4 text-right">Water Coliform</th>
                <th className="py-3 px-4">Inundation & Waste Risk</th>
                <th className="py-3 px-4 text-right">Climate Readings</th>
                <th className="py-3 px-4 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {displayedReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-mono text-xs">
                    No environmental records matching current filters.
                  </td>
                </tr>
              ) : (
                displayedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white capitalize">{report.indicatorType.replace(/_/g, ' ')}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{report.notes}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">
                        {report.lga} LGA, {report.state}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {report.locationDetails}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono">
                      {report.waterColiformCount !== undefined ? (
                        <div>
                          <span
                            className={`font-semibold ${
                              report.waterColiformCount > 300
                                ? 'text-rose-400'
                                : report.waterColiformCount > 100
                                ? 'text-amber-400'
                                : 'text-slate-200'
                            }`}
                          >
                            {report.waterColiformCount} CFU
                          </span>
                          <div className="text-[10px] text-slate-500">Turbidity: {report.waterTurbidity || '—'} NTU</div>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-300 text-xs">
                        Flood: <strong className="text-white">{report.floodInundationLevel || 'None'}</strong>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Abattoir: {report.abattoirWasteDisposal || 'N/A'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono">
                      <div className="text-slate-200">{report.temperatureC}°C · {report.humidityPercent}% RH</div>
                      <div className="text-cyan-400 text-[10px]">{report.rainfallMm} mm rainfall</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {getSeverityBadge(report.severity)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewEnvironmentalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
