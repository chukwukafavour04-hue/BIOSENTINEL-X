import React, { useState } from 'react';
import { NIGERIA_STATES } from '../../data/seedData';
import { useData } from '../../context/DataContext';
import { Biohazard, Droplets, Bug, AlertTriangle, Layers, Eye, Compass, Info } from 'lucide-react';
import { ZoonoticReport, EnvironmentalReport, VectorReport, Investigation } from '../../types';

interface NigeriaMapProps {
  onSelectState?: (stateName: string) => void;
  height?: number;
}

export const NigeriaMap: React.FC<NigeriaMapProps> = ({
  onSelectState,
  height = 540,
}) => {
  const {
    selectedState,
    setSelectedState,
    zoonoticReports,
    environmentalReports,
    vectorReports,
    investigations,
  } = useData();

  // Layer visibility toggles
  const [showZoonotic, setShowZoonotic] = useState(true);
  const [showEnvironmental, setShowEnvironmental] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showInvestigations, setShowInvestigations] = useState(true);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<{
    type: 'zoonotic' | 'environmental' | 'vector' | 'investigation';
    data: any;
  } | null>(null);

  // Geo projection helper: maps lat (4.0 to 14.0) and lng (2.5 to 14.5) to SVG viewbox 1000x750
  const projectCoords = (lat: number, lng: number) => {
    const minLng = 2.5;
    const maxLng = 14.8;
    const minLat = 4.0;
    const maxLat = 14.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 880 + 60;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 620 + 60;
    return { x, y };
  };

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    if (onSelectState) onSelectState(stateName);
  };

  // Compute risk level per state for color styling
  const getStateRisk = (stateName: string) => {
    const zCount = zoonoticReports.filter((z) => z.state === stateName).length;
    const eCount = environmentalReports.filter((e) => e.state === stateName && (e.severity === 'critical' || e.severity === 'elevated')).length;
    const vCount = vectorReports.filter((v) => v.state === stateName && v.larvalIndexBreteau > 50).length;
    const total = zCount * 3 + eCount * 2 + vCount * 2;
    if (total >= 5) return 'critical';
    if (total >= 2) return 'elevated';
    if (total >= 1) return 'moderate';
    return 'nominal';
  };

  return (
    <div className="relative w-full bg-[#050811] rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Map Header Toolbar */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>NIGERIA ONE HEALTH SPATIAL RADAR</span>
          </div>
          <span className="text-slate-500 font-mono">|</span>
          <span className="text-slate-400 font-mono text-[11px]">
            Selected: <strong className="text-white font-medium">{selectedState}</strong>
          </span>
          {selectedState !== 'All Nigeria' && (
            <button
              onClick={() => setSelectedState('All Nigeria')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-mono"
            >
              Reset to Federal Overview
            </button>
          )}
        </div>

        {/* Multi-Layer Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 font-mono uppercase mr-1">Layers:</span>
          <button
            onClick={() => setShowZoonotic(!showZoonotic)}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
              showZoonotic
                ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Biohazard className="w-3.5 h-3.5" />
            <span>Zoonotic ({zoonoticReports.length})</span>
          </button>
          <button
            onClick={() => setShowEnvironmental(!showEnvironmental)}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
              showEnvironmental
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Environmental ({environmentalReports.length})</span>
          </button>
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
              showVectors
                ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Vectors ({vectorReports.length})</span>
          </button>
          <button
            onClick={() => setShowInvestigations(!showInvestigations)}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
              showInvestigations
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Investigations ({investigations.length})</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 1000 720"
          className="w-full h-full select-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, #081126 0%, #03060E 100%)' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>

            {/* Pulsing Alert Filter */}
            <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#EF4444" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="envGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
              <stop offset="80%" stopColor="#06B6D4" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Technical Grid */}
          <rect width="1000" height="720" fill="url(#radarGrid)" />

          {/* Nigeria Border Contour (Geometric Cartographic Approximation) */}
          <path
            d="M 120 220 L 260 140 L 370 110 L 530 140 L 680 180 L 820 180 L 920 220 L 930 330 L 880 430 L 830 520 L 730 630 L 670 710 L 580 740 L 460 760 L 380 730 L 240 710 L 230 630 L 260 550 L 270 420 L 210 320 Z"
            fill="#0B132B"
            fillOpacity="0.6"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* State Territories Polygonal Nodes */}
          {NIGERIA_STATES.map((state) => {
            const { x, y } = projectCoords(state.coordinates.lat, state.coordinates.lng);
            const isSelected = selectedState === state.name;
            const isHovered = hoveredState === state.name;
            const risk = getStateRisk(state.name);

            let stateFill = '#0F172A';
            let strokeColor = '#334155';
            if (risk === 'critical') {
              stateFill = '#3B131E';
              strokeColor = '#F43F5E';
            } else if (risk === 'elevated') {
              stateFill = '#2A2010';
              strokeColor = '#F59E0B';
            } else if (risk === 'moderate') {
              stateFill = '#0D2838';
              strokeColor = '#06B6D4';
            }

            if (isSelected) {
              stateFill = '#064E3B';
              strokeColor = '#10B981';
            }

            return (
              <g
                key={state.code}
                onClick={() => handleStateClick(state.name)}
                onMouseEnter={() => setHoveredState(state.name)}
                onMouseLeave={() => setHoveredState(null)}
                className="cursor-pointer transition-all duration-150"
              >
                {/* State Node Base Circle / Territory Region */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 32 : isHovered ? 28 : 22}
                  fill={stateFill}
                  stroke={isSelected ? '#10B981' : isHovered ? '#38BDF8' : strokeColor}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                  className="transition-all duration-200"
                />

                {/* State Acronym Label */}
                <text
                  x={x}
                  y={y - 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isSelected ? '#34D399' : '#E2E8F0'}
                  fontSize={isSelected ? '12px' : '10px'}
                  fontWeight={isSelected || isHovered ? '700' : '600'}
                  fontFamily="monospace"
                  className="pointer-events-none select-none tracking-wider"
                >
                  {state.code}
                </text>

                {/* Subtitle Full Name when Hovered or Selected */}
                {(isSelected || isHovered) && (
                  <text
                    x={x}
                    y={y + 16}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="9px"
                    fontFamily="sans-serif"
                    fontWeight="500"
                    className="pointer-events-none"
                  >
                    {state.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* LAYER 1: Zoonotic Disease Event Hotspots */}
          {showZoonotic &&
            zoonoticReports.map((report) => {
              const { x, y } = projectCoords(report.coordinates.lat, report.coordinates.lng);
              const isMatch = selectedState === 'All Nigeria' || report.state === selectedState;
              if (!isMatch) return null;

              return (
                <g
                  key={report.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin({ type: 'zoonotic', data: report });
                  }}
                  className="cursor-pointer"
                >
                  <circle cx={x + 10} cy={y - 10} r="18" fill="url(#hotspotGlow)" />
                  <circle
                    cx={x + 10}
                    cy={y - 10}
                    r="6"
                    fill="#EF4444"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <text
                    x={x + 18}
                    y={y - 8}
                    fill="#FCA5A5"
                    fontSize="9px"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {report.diseaseName.split(' ')[0]} ({report.humanCases}H)
                  </text>
                </g>
              );
            })}

          {/* LAYER 2: Environmental Hazard Markers */}
          {showEnvironmental &&
            environmentalReports.map((report) => {
              const { x, y } = projectCoords(report.coordinates.lat, report.coordinates.lng);
              const isMatch = selectedState === 'All Nigeria' || report.state === selectedState;
              if (!isMatch) return null;

              return (
                <g
                  key={report.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin({ type: 'environmental', data: report });
                  }}
                  className="cursor-pointer"
                >
                  <circle cx={x - 12} cy={y + 8} r="14" fill="url(#envGlow)" />
                  <rect
                    x={x - 16}
                    y={y + 4}
                    width="8"
                    height="8"
                    fill="#06B6D4"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    transform={`rotate(45 ${x - 12} ${y + 8})`}
                  />
                  <text
                    x={x - 12}
                    y={y + 20}
                    textAnchor="middle"
                    fill="#67E8F9"
                    fontSize="8px"
                    fontFamily="monospace"
                  >
                    {report.indicatorType.toUpperCase()}
                  </text>
                </g>
              );
            })}

          {/* LAYER 3: Vector Surveillance Collection Points */}
          {showVectors &&
            vectorReports.map((report) => {
              const { x, y } = projectCoords(report.coordinates.lat, report.coordinates.lng);
              const isMatch = selectedState === 'All Nigeria' || report.state === selectedState;
              if (!isMatch) return null;

              return (
                <g
                  key={report.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin({ type: 'vector', data: report });
                  }}
                  className="cursor-pointer"
                >
                  <circle
                    cx={x - 8}
                    cy={y - 12}
                    r="5"
                    fill="#F59E0B"
                    stroke="#000000"
                    strokeWidth="1"
                  />
                  <text
                    x={x - 8}
                    y={y - 18}
                    textAnchor="middle"
                    fill="#FDE68A"
                    fontSize="8px"
                    fontFamily="monospace"
                  >
                    BI:{report.larvalIndexBreteau}
                  </text>
                </g>
              );
            })}

          {/* LAYER 4: Emergency Response Investigation Rings */}
          {showInvestigations &&
            investigations.map((inv) => {
              const stateObj = NIGERIA_STATES.find((s) => s.name === inv.state);
              if (!stateObj) return null;
              const { x, y } = projectCoords(stateObj.coordinates.lat, stateObj.coordinates.lng);
              const isMatch = selectedState === 'All Nigeria' || inv.state === selectedState;
              if (!isMatch) return null;

              return (
                <g
                  key={inv.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin({ type: 'investigation', data: inv });
                  }}
                  className="cursor-pointer"
                >
                  <circle
                    cx={x}
                    cy={y}
                    r="38"
                    fill="none"
                    stroke={inv.priority === 'urgent' ? '#F43F5E' : '#10B981'}
                    strokeWidth="1.8"
                    strokeDasharray="5 3"
                    className="animate-spin-slow origin-center"
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                  <circle
                    cx={x}
                    cy={y + 24}
                    r="7"
                    fill="#10B981"
                    stroke="#042F2E"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={y + 27}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="8px"
                    fontWeight="bold"
                  >
                    !
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Selected Pin Details Overlay Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 max-w-sm bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
              <span className="font-semibold text-white uppercase text-[11px] flex items-center gap-1.5">
                {selectedPin.type === 'zoonotic' && <Biohazard className="w-3.5 h-3.5 text-rose-400" />}
                {selectedPin.type === 'environmental' && <Droplets className="w-3.5 h-3.5 text-cyan-400" />}
                {selectedPin.type === 'vector' && <Bug className="w-3.5 h-3.5 text-amber-400" />}
                {selectedPin.type === 'investigation' && <AlertTriangle className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{selectedPin.type} Telemetry</span>
              </span>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-white px-1 font-mono"
              >
                ✕
              </button>
            </div>

            {selectedPin.type === 'zoonotic' && (
              <div>
                <div className="font-bold text-slate-100 text-sm">{selectedPin.data.diseaseName}</div>
                <div className="text-slate-400 text-[11px] mb-1.5">
                  {selectedPin.data.lga} LGA, {selectedPin.data.state} State
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px] bg-slate-950/60 p-2 rounded mb-1.5">
                  <div>Human: <strong className="text-white">{selectedPin.data.humanCases} cases</strong></div>
                  <div>Deaths: <strong className="text-rose-400">{selectedPin.data.humanDeaths}</strong></div>
                  <div>Animal Host: <span className="text-slate-300 truncate">{selectedPin.data.animalSpecies.split(' ')[0]}</span></div>
                  <div>Lab: <strong className="text-emerald-400">{selectedPin.data.labStatus}</strong></div>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{selectedPin.data.notes}</p>
              </div>
            )}

            {selectedPin.type === 'environmental' && (
              <div>
                <div className="font-bold text-slate-100 text-sm capitalize">{selectedPin.data.indicatorType} Alert</div>
                <div className="text-slate-400 text-[11px] mb-1.5">
                  {selectedPin.data.lga} LGA, {selectedPin.data.state} State
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px] bg-slate-950/60 p-2 rounded mb-1.5">
                  <div>Coliform: <strong className="text-rose-400">{selectedPin.data.waterColiformCount || 'N/A'} CFU</strong></div>
                  <div>Inundation: <strong className="text-cyan-400">{selectedPin.data.floodInundationLevel || 'None'}</strong></div>
                  <div>Rainfall: <strong>{selectedPin.data.rainfallMm} mm</strong></div>
                  <div>Severity: <strong className="text-amber-400 uppercase">{selectedPin.data.severity}</strong></div>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{selectedPin.data.notes}</p>
              </div>
            )}

            {selectedPin.type === 'vector' && (
              <div>
                <div className="font-bold text-slate-100 text-sm">{selectedPin.data.species}</div>
                <div className="text-slate-400 text-[11px] mb-1.5">
                  {selectedPin.data.lga} LGA, {selectedPin.data.state} State
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px] bg-slate-950/60 p-2 rounded mb-1.5">
                  <div>Breteau Index: <strong className="text-rose-400">{selectedPin.data.larvalIndexBreteau}</strong></div>
                  <div>Adult Catch: <strong>{selectedPin.data.adultTrapCatchPerNight}/night</strong></div>
                  <div>Resistance: <span className="text-amber-400">{selectedPin.data.insecticideResistance}</span></div>
                  <div>Pathogen: <strong className="text-cyan-300">{selectedPin.data.pathogenDetected}</strong></div>
                </div>
              </div>
            )}

            {selectedPin.type === 'investigation' && (
              <div>
                <div className="font-bold text-slate-100 text-sm">{selectedPin.data.investigationNumber}</div>
                <div className="text-slate-400 text-[11px] mb-1.5">{selectedPin.data.title}</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px] bg-slate-950/60 p-2 rounded mb-1.5">
                  <div>Status: <strong className="text-emerald-400 uppercase">{selectedPin.data.status.replace(/_/g, ' ')}</strong></div>
                  <div>Priority: <strong className="text-rose-400 uppercase">{selectedPin.data.priority}</strong></div>
                  <div>Lead: <span className="text-slate-300 truncate">{selectedPin.data.teamLead}</span></div>
                  <div>Contacts: <strong>{selectedPin.data.contactsTraced} traced</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend bar */}
        <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 shadow-xl space-y-1.5 hidden sm:block">
          <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1">Radar Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Zoonotic Spillover Cluster</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rotate-45 bg-cyan-400"></span>
            <span>Environmental Inundation / Coliform</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Vector Density Index &gt;50</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-dashed border-emerald-400 rounded-full"></span>
            <span>Active Multidisciplinary Cordon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
