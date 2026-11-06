import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { NigeriaMap } from './NigeriaMap';
import { NIGERIA_STATES } from '../../data/seedData';
import {
  MapPin,
  Filter,
  Biohazard,
  Droplets,
  Bug,
  AlertTriangle,
  Compass,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react';

export const GeospatialIntelligence: React.FC = () => {
  const {
    selectedState,
    setSelectedState,
    selectedLga,
    setSelectedLga,
    filteredZoonotic,
    filteredEnvironmental,
    filteredVectors,
    filteredInvestigations,
  } = useData();

  const currentStateObj = NIGERIA_STATES.find((s) => s.name === selectedState);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>NIGERIAN GEOGRAPHIC INFORMATION SYSTEM (GIS)</span>
          </div>
          <h1 className="text-xl font-bold text-white font-display">
            Geospatial One Health Surveillance & Risk Mapping
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Interactive spatial analysis across all 36 Nigerian States and the Federal Capital Territory. Filter by state and LGA to inspect co-located zoonotic clusters, environmental floodwaters, and vector densities.
          </p>
        </div>

        {/* State and LGA Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300">
            <span className="text-slate-500 text-[10px] font-mono">STATE:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All Nigeria" className="bg-slate-900">All Nigeria (Federal)</option>
              {NIGERIA_STATES.map((s) => (
                <option key={s.name} value={s.name} className="bg-slate-900">
                  {s.name} ({s.zone})
                </option>
              ))}
            </select>
          </div>

          {currentStateObj && (
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300">
              <span className="text-slate-500 text-[10px] font-mono">LGA:</span>
              <select
                value={selectedLga}
                onChange={(e) => setSelectedLga(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="All LGAs" className="bg-slate-900">All LGAs ({currentStateObj.lgas.length})</option>
                {currentStateObj.lgas.map((l) => (
                  <option key={l} value={l} className="bg-slate-900">
                    {l}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <NigeriaMap height={540} />

      {/* Detailed Jurisdiction Intelligence Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* State Metadata */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              CURRENT GEOGRAPHIC FOCUS
            </div>
            <div className="text-xl font-bold text-white font-display">
              {selectedState}
            </div>
            {currentStateObj && (
              <div className="text-xs text-slate-400 mt-1 font-mono space-y-0.5">
                <div>Capital: <span className="text-slate-200">{currentStateObj.capital}</span></div>
                <div>Zone: <span className="text-emerald-400">{currentStateObj.zone}</span></div>
                <div>LGAs: <span className="text-slate-300">{currentStateObj.lgas.length} administrative areas</span></div>
                <div>Coordinates: <span className="text-cyan-300">{currentStateObj.coordinates.lat.toFixed(3)}°N, {currentStateObj.coordinates.lng.toFixed(3)}°E</span></div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Click on any circle node on the radar above to re-center the entire platform on that Nigerian state.
          </div>
        </div>

        {/* Zoonotic Reports in this State */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-rose-400 mb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Biohazard className="w-3.5 h-3.5" />
                <span>ZOONOTIC SIGNALS</span>
              </span>
              <span className="text-slate-400">{filteredZoonotic.length}</span>
            </div>
            <div className="space-y-2 text-xs">
              {filteredZoonotic.length === 0 ? (
                <div className="text-slate-500 text-xs italic py-2">No active zoonotic signals in this scope.</div>
              ) : (
                filteredZoonotic.slice(0, 2).map((z) => (
                  <div key={z.id} className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                    <div className="font-semibold text-white">{z.diseaseName}</div>
                    <div className="text-[11px] text-slate-400">{z.lga} LGA · {z.humanCases} human cases</div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            Includes clinical sentinel and abattoir records.
          </div>
        </div>

        {/* Environmental Hazards in this State */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Droplets className="w-3.5 h-3.5" />
                <span>ENVIRONMENTAL ALERTS</span>
              </span>
              <span className="text-slate-400">{filteredEnvironmental.length}</span>
            </div>
            <div className="space-y-2 text-xs">
              {filteredEnvironmental.length === 0 ? (
                <div className="text-slate-500 text-xs italic py-2">No active environmental alerts in this scope.</div>
              ) : (
                filteredEnvironmental.slice(0, 2).map((e) => (
                  <div key={e.id} className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                    <div className="font-semibold text-white capitalize">{e.indicatorType.replace(/_/g, ' ')}</div>
                    <div className="text-[11px] text-slate-400">{e.lga} LGA · {e.severity} severity</div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            Water coliform, flood levels & climate telemetry.
          </div>
        </div>

        {/* Vectors & Field Responses in this State */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ACTIVE CORDONS</span>
              </span>
              <span className="text-slate-400">{filteredInvestigations.length}</span>
            </div>
            <div className="space-y-2 text-xs">
              {filteredInvestigations.length === 0 ? (
                <div className="text-slate-500 text-xs italic py-2">No active investigations in this scope.</div>
              ) : (
                filteredInvestigations.slice(0, 2).map((inv) => (
                  <div key={inv.id} className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                    <div className="font-semibold text-white line-clamp-1">{inv.title}</div>
                    <div className="text-[11px] text-emerald-400 font-mono capitalize">{inv.status.replace(/_/g, ' ')}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            Multidisciplinary One Health response units.
          </div>
        </div>
      </div>
    </div>
  );
};
