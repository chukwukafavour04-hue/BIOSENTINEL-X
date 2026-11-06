import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { NewInvestigationModal } from './NewInvestigationModal';
import {
  AlertTriangle,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  Shield,
  Send,
  MessageSquare,
  FileCheck,
  ChevronRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Investigation, IncidentLifecycle } from '../../types';

export const EmergencyModule: React.FC = () => {
  const { filteredInvestigations, updateInvestigation } = useData();
  const { currentUser, canEditModule } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvId, setSelectedInvId] = useState<string | null>(null);

  // New observation state
  const [newObsNotes, setNewObsNotes] = useState('');
  const [newObsCategory, setNewObsCategory] = useState<'clinical' | 'veterinary' | 'environmental' | 'community'>('clinical');

  const selectedInv = filteredInvestigations.find((i) => i.id === selectedInvId) || filteredInvestigations[0];

  const lifecycleStages: Array<{ id: IncidentLifecycle; label: string }> = [
    { id: 'alert_raised', label: '1. Alert Raised' },
    { id: 'rapid_response_dispatched', label: '2. Rapid Response Dispatched' },
    { id: 'lab_confirmation', label: '3. Lab Confirmation' },
    { id: 'one_health_containment', label: '4. One Health Containment' },
    { id: 'resolved', label: '5. Resolved' },
  ];

  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInv || !newObsNotes.trim()) return;

    const newObs = {
      id: `obs-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      officerName: currentUser.displayName,
      role: currentUser.role,
      notes: newObsNotes.trim(),
      category: newObsCategory,
    };

    await updateInvestigation(selectedInv.id, {
      fieldObservations: [newObs, ...selectedInv.fieldObservations],
    });
    setNewObsNotes('');
  };

  const handleUpdateStatus = async (newStatus: IncidentLifecycle) => {
    if (!selectedInv) return;
    await updateInvestigation(selectedInv.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>ONE HEALTH MULTIDISCIPLINARY RAPID RESPONSE</span>
          </div>
          <h1 className="text-xl font-bold text-white font-display">
            Emergency Response & Field Investigation Management
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Coordinate joint field deployments, assign veterinary and human health epidemiologists, record field observations, and track containment cordons.
          </p>
        </div>

        {canEditModule('investigation') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Field Investigation</span>
          </button>
        )}
      </div>

      {/* Lifecycle Stage Cards (Workflow Pipeline) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {lifecycleStages.map((stage) => {
          const count = filteredInvestigations.filter((i) => i.status === stage.id).length;
          return (
            <div
              key={stage.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between"
            >
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {stage.label}
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {count}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">active cordons</div>
            </div>
          );
        })}
      </div>

      {/* Active Investigations & Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investigation List (1 col) */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
            Active One Health Inquiries ({filteredInvestigations.length})
          </div>

          <div className="space-y-2.5">
            {filteredInvestigations.map((inv) => {
              const isSelected = selectedInv?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvId(inv.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="text-slate-400 text-[11px]">{inv.investigationNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                        inv.priority === 'urgent'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {inv.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xs leading-snug line-clamp-2">
                    {inv.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2 font-mono">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{inv.lga}, {inv.state}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400">Team Lead: <strong className="text-slate-200">{inv.teamLead.split(' ')[1] || inv.teamLead}</strong></span>
                    <span className="text-emerald-400 font-mono capitalize">
                      {inv.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Investigation Deep Dive (2 cols) */}
        {selectedInv && (
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-white space-y-6 shadow-2xl">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {selectedInv.investigationNumber}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400 font-mono">{selectedInv.lga} LGA, {selectedInv.state} State</span>
                </div>
                {/* Status Switcher Dropdown */}
                {canEditModule('investigation') && (
                  <select
                    value={selectedInv.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as IncidentLifecycle)}
                    className="bg-slate-800 border border-slate-700 text-emerald-400 rounded-lg px-2.5 py-1 text-xs font-mono font-semibold cursor-pointer"
                  >
                    {lifecycleStages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <h2 className="text-lg font-bold text-white font-display">
                {selectedInv.title}
              </h2>
              <div className="text-xs text-slate-400 mt-1">
                Trigger: <strong className="text-slate-200">{selectedInv.triggerSignalType}</strong>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 font-mono text-xs">
              <div>
                <div className="text-slate-500 text-[10px]">CONFIRMED CASES</div>
                <div className="text-lg font-bold text-rose-400 tabular-nums">
                  {selectedInv.confirmedCases}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">CONTACTS TRACED</div>
                <div className="text-lg font-bold text-emerald-400 tabular-nums">
                  {selectedInv.contactsTraced}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">RINGS VACCINATED</div>
                <div className="text-lg font-bold text-cyan-300 tabular-nums">
                  {selectedInv.ringsVaccinated}
                </div>
              </div>
            </div>

            {/* Multidisciplinary Taskforce Roster */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Assigned Inter-Agency Taskforce Officers</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedInv.assignedOfficers.map((officer, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      {officer.charAt(0)}
                    </div>
                    <span className="text-slate-200">{officer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documented Containment Interventions */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Documented One Health Interventions</span>
              </div>
              <div className="space-y-2 text-xs">
                {selectedInv.interventionsDocumented.map((int) => (
                  <div
                    key={int.id}
                    className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-white">{int.type}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{int.details}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">Logged: {int.date}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                      {int.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Observations Timeline & Submission */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                <span>Field Observation Timeline</span>
                <span className="text-[11px] font-normal text-slate-500">{selectedInv.fieldObservations.length} entries</span>
              </div>

              {/* Add Observation Form */}
              {canEditModule('investigation') && (
                <form onSubmit={handleAddObservation} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px] font-mono">OBSERVATION TYPE:</span>
                    <select
                      value={newObsCategory}
                      onChange={(e) => setNewObsCategory(e.target.value as any)}
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                    >
                      <option value="clinical">Clinical / Human Hospital</option>
                      <option value="veterinary">Veterinary / Livestock</option>
                      <option value="environmental">Environmental / Water</option>
                      <option value="community">Community / Contact</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newObsNotes}
                      onChange={(e) => setNewObsNotes(e.target.value)}
                      placeholder="Record new observation, biological sample swab, or containment step..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={!newObsNotes.trim()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 disabled:opacity-50"
                    >
                      <Send className="w-3 h-3" />
                      <span>Log</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Observations List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedInv.fieldObservations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                      <span className="font-semibold text-slate-200">{obs.officerName}</span>
                      <span className="text-slate-500">{obs.date}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{obs.notes}</p>
                    <div className="text-[10px] text-cyan-400 font-mono uppercase mt-1">
                      Sector: {obs.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <NewInvestigationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
