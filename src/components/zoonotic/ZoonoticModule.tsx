import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { NewZoonoticModal } from './NewZoonoticModal';
import {
  Biohazard,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertCircle,
  PawPrint,
  Users,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { DiseaseCategory, LabConfirmationStatus } from '../../types';

export const ZoonoticModule: React.FC = () => {
  const { filteredZoonotic, selectedState, setSelectedState } = useData();
  const { canEditModule } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const displayedReports = filteredZoonotic.filter((r) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        r.diseaseName.toLowerCase().includes(q) ||
        r.animalSpecies.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.lga.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (categoryFilter !== 'All' && r.diseaseCategory !== categoryFilter) return false;
    if (statusFilter !== 'All' && r.labStatus !== statusFilter) return false;
    return true;
  });

  const selectedReport = filteredZoonotic.find((r) => r.id === selectedReportId) || displayedReports[0];

  const getLabStatusBadge = (status: LabConfirmationStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lab Confirmed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 text-amber-400 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending Analysis</span>
          </span>
        );
      case 'suspected':
        return (
          <span className="flex items-center gap-1.5 text-rose-400 font-mono text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Suspected Syndromic</span>
          </span>
        );
      case 'inconclusive':
        return (
          <span className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Inconclusive</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-1">
            <Biohazard className="w-4 h-4" />
            <span>ZOONOTIC EPIDEMIOLOGICAL SURVEILLANCE</span>
          </div>
          <h1 className="text-xl font-bold text-white font-display">
            Zoonotic Disease & Spillover Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Structured monitoring of pathogens transmitting across animal reservoir interfaces, human healthcare sentinels, abattoirs, and domestic settlements.
          </p>
        </div>

        {canEditModule('zoonotic') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Zoonotic Report</span>
          </button>
        )}
      </div>

      {/* Spillover Pathway Visualizer Spotlight */}
      {selectedReport && (
        <div className="bg-[#080E1C] border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>SPILLOVER TRANSMISSION PATHWAY ANALYSIS:</span>
              <strong className="text-white font-sans">{selectedReport.diseaseName}</strong>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{selectedReport.lga} LGA, {selectedReport.state}</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Risk Score: <strong className="text-rose-400 font-bold">{selectedReport.riskScore}/100</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Step 1: Animal Reservoir */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 font-mono">
                  <span>STEP 1: ANIMAL RESERVOIR</span>
                  <PawPrint className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-bold text-slate-100 text-sm">{selectedReport.animalSpecies}</div>
                <div className="text-[11px] text-amber-300 font-mono mt-1">
                  Estimated Cases/Shedding: {selectedReport.animalCases.toLocaleString()}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                Source: {selectedReport.source}
              </div>
            </div>

            {/* Step 2: Transmission Interface */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 font-mono">
                  <span>STEP 2: SPILLOVER INTERFACE</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="font-bold text-slate-100 text-sm">Environmental & Occupational Exposure</div>
                <div className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                  {selectedReport.locationDetails}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                Status: <span className="text-cyan-400 capitalize">{selectedReport.investigationStatus.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {/* Step 3: Human Clinical Manifestation */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 font-mono">
                  <span>STEP 3: HUMAN ADMISSION</span>
                  <Users className="w-4 h-4 text-rose-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-white text-lg font-mono">{selectedReport.humanCases} cases</span>
                  <span className="text-rose-400 font-mono text-[11px]">({selectedReport.humanDeaths} fatalities)</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-1">
                  Method: {selectedReport.labMethod}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span>Confirmation</span>
                {getLabStatusBadge(selectedReport.labStatus)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pathogen, species, LGA, or state..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <span className="text-slate-500 text-[10px] font-mono">CATEGORY:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Categories</option>
              <option value="Viral Hemorrhagic Fever" className="bg-slate-900">Viral Hemorrhagic</option>
              <option value="Respiratory Zoonosis" className="bg-slate-900">Respiratory Zoonosis</option>
              <option value="Bacterial Zoonosis" className="bg-slate-900">Bacterial Zoonosis</option>
              <option value="Arboviral Disease" className="bg-slate-900">Arboviral Disease</option>
              <option value="Poxvirus" className="bg-slate-900">Poxvirus</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <span className="text-slate-500 text-[10px] font-mono">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Statuses</option>
              <option value="confirmed" className="bg-slate-900">Confirmed</option>
              <option value="pending" className="bg-slate-900">Pending</option>
              <option value="suspected" className="bg-slate-900">Suspected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Structured Surveillance Table (Zero-Pill Discipline, High Density) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Disease & Host Species</th>
                <th className="py-3 px-4">Location & Facility</th>
                <th className="py-3 px-4 text-right">Human Impact</th>
                <th className="py-3 px-4 text-right">Animal Burden</th>
                <th className="py-3 px-4">Lab Method & Status</th>
                <th className="py-3 px-4">Surveillance Source</th>
                <th className="py-3 px-4 text-right">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {displayedReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono text-xs">
                    No zoonotic surveillance records match current filters.
                  </td>
                </tr>
              ) : (
                displayedReports.map((report) => {
                  const isSelected = selectedReport?.id === report.id;
                  return (
                    <tr
                      key={report.id}
                      onClick={() => setSelectedReportId(report.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Disease & Host */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white text-xs">{report.diseaseName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {report.animalSpecies}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{report.diseaseCategory}</div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">
                          {report.lga} LGA, {report.state}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {report.locationDetails}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Reported: {report.reportingDate}
                        </div>
                      </td>

                      {/* Human Cases */}
                      <td className="py-3 px-4 text-right font-mono">
                        <div className="text-slate-100 font-semibold">{report.humanCases} cases</div>
                        <div className="text-rose-400 text-[11px]">
                          {report.humanDeaths > 0 ? `${report.humanDeaths} deaths` : '0 deaths'}
                        </div>
                      </td>

                      {/* Animal Burden */}
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        <div>{report.animalCases.toLocaleString()} infected</div>
                        <div className="text-slate-500 text-[10px]">Reservoir signal</div>
                      </td>

                      {/* Lab Status */}
                      <td className="py-3 px-4">
                        {getLabStatusBadge(report.labStatus)}
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{report.labMethod}</div>
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4">
                        <div className="text-slate-300 text-xs">{report.source}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                          {report.reportedBy}
                        </div>
                      </td>

                      {/* Risk */}
                      <td className="py-3 px-4 text-right font-mono">
                        <span
                          className={`font-bold ${
                            report.riskScore >= 85
                              ? 'text-rose-400'
                              : report.riskScore >= 70
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {report.riskScore}/100
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewZoonoticModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
