import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { NewVectorModal } from './NewVectorModal';
import {
  Bug,
  Plus,
  Search,
  ShieldCheck,
  AlertTriangle,
  Microscope,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const VectorModule: React.FC = () => {
  const { filteredVectors, selectedState } = useData();
  const { canEditModule } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genusFilter, setGenusFilter] = useState<string>('All');

  const displayedReports = filteredVectors.filter((r) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        r.species.toLowerCase().includes(q) ||
        r.vectorType.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.lga.toLowerCase().includes(q) ||
        r.pathogenDetected.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (genusFilter !== 'All' && r.vectorType !== genusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Bug className="w-4 h-4" />
            <span>ENTOMOLOGICAL & VECTOR SURVEILLANCE</span>
          </div>
          <h1 className="text-xl font-bold text-white font-display">
            Vector Density, Resistance & Pathogen Screening
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Surveillance of Aedes, Anopheles, Culex, Hyalomma ticks, and Blackflies across breeding ecologies to preempt vector-borne zoonotic flare-ups.
          </p>
        </div>

        {canEditModule('vector') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Vector Surveillance</span>
          </button>
        )}
      </div>

      {/* Entomology Specimen & Resistance Spotlight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specimen Visual & Alert */}
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-slate-800 bg-[#070E1C] p-6 text-white flex flex-col justify-between shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none mix-blend-screen hidden sm:block">
            <img
              src="/src/assets/images/vector_surveillance_specimen_1793996791414.jpg"
              alt="Aedes aegypti entomological specimen"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <Microscope className="w-4 h-4 text-amber-400" />
              <span>WHO VECTOR ALERT THRESHOLD SURPASSED</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              Aedes aegypti Larval Surge: Ibadan North (Breteau Index: 68)
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Household container breeding surveys indicate extreme Breteau Index of <strong>68 positive containers / 100 inspected dwellings</strong> (WHO epidemic risk threshold is &gt;50). CDC bottle bioassays confirmed severe resistance to synthetic pyrethroids.
            </p>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <div className="text-slate-400 text-[10px]">BRETEAU INDEX</div>
              <div className="text-base font-bold text-rose-400">68.0</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">PATHOGEN DETECTED</div>
              <div className="text-base font-bold text-cyan-300">Dengue Virus (DEN-2)</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">INSECTICIDE PROFILE</div>
              <div className="text-base font-bold text-amber-400">Pyrethroid Resistant</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">RECOMMENDED VECTOR ACTION</div>
              <div className="text-base font-bold text-emerald-400">Temephos & Bti</div>
            </div>
          </div>
        </div>

        {/* Resistance & Vector Distribution Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Insecticide Resistance Monitoring
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Bioassay evaluations demonstrate growing resistance against conventional LLIN pyrethroids, requiring immediate rotation to organophosphates.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium font-sans">Pyrethroids (Deltamethrin)</div>
                  <div className="text-[10px] text-slate-400">42% Knockdown @ 60m</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800 uppercase">
                  Resistant
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium font-sans">Organophosphates (Pirimiphos)</div>
                  <div className="text-[10px] text-slate-400">96% Knockdown @ 60m</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                  Susceptible
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium font-sans">Biological Larvicide (Bti)</div>
                  <div className="text-[10px] text-slate-400">99% Larval Mortality</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                  Optimal
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            One Health Action: Replace damaged nets with PBO-synergist nets in high Breteau index zones.
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
            placeholder="Search species, pathogen, state, or LGA..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <span className="text-slate-500 text-[10px] font-mono">GENUS:</span>
            <select
              value={genusFilter}
              onChange={(e) => setGenusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Vectors</option>
              <option value="mosquito" className="bg-slate-900">Mosquitoes</option>
              <option value="tick" className="bg-slate-900">Ticks</option>
              <option value="blackfly" className="bg-slate-900">Blackflies</option>
              <option value="sandfly" className="bg-slate-900">Sandflies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Structured Surveillance Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Vector Species & Habitat</th>
                <th className="py-3 px-4">Surveillance Location</th>
                <th className="py-3 px-4 text-right">Breteau Index</th>
                <th className="py-3 px-4 text-right">Adult Trap Catch</th>
                <th className="py-3 px-4">Pathogen Detected</th>
                <th className="py-3 px-4">Resistance & Interventions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {displayedReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-mono text-xs">
                    No vector surveillance records match current filters.
                  </td>
                </tr>
              ) : (
                displayedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white italic">{report.species}</div>
                      <div className="text-[11px] text-slate-400 capitalize">{report.vectorType}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{report.collectionSiteType}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">
                        {report.lga} LGA, {report.state}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        Sampled: {report.collectionDate}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono">
                      {report.larvalIndexBreteau > 0 ? (
                        <div>
                          <span
                            className={`font-semibold text-sm ${
                              report.larvalIndexBreteau > 50
                                ? 'text-rose-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {report.larvalIndexBreteau}
                          </span>
                          <div className="text-[10px] text-slate-500">
                            {report.larvalIndexBreteau > 50 ? 'Threshold Surpassed' : 'Moderate'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-200">
                      <div>{report.adultTrapCatchPerNight} / night</div>
                      <div className="text-[10px] text-slate-500">CDC Light Trap</div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div
                        className={`font-semibold ${
                          report.pathogenDetected !== 'none' ? 'text-cyan-300' : 'text-slate-400'
                        }`}
                      >
                        {report.pathogenDetected}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-[11px] font-mono capitalize text-amber-300">
                        {report.insecticideResistance.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {report.interventionsApplied.join(', ') || 'No active intervention'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewVectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
