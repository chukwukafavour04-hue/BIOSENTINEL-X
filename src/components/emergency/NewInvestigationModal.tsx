import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { NIGERIA_STATES } from '../../data/seedData';
import { InvestigationPriority, IncidentLifecycle } from '../../types';
import { X, Plus, AlertTriangle } from 'lucide-react';

interface NewInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewInvestigationModal: React.FC<NewInvestigationModalProps> = ({ isOpen, onClose }) => {
  const { addInvestigation } = useData();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('Suspected Lassa Spillover Cluster & Rodent Exclusion');
  const [diseaseOrThreat, setDiseaseOrThreat] = useState('Lassa Fever (Arenaviridae)');
  const [selectedStateName, setSelectedStateName] = useState('Edo');
  const [lga, setLga] = useState('Esan West');
  const [priority, setPriority] = useState<InvestigationPriority>('urgent');
  const [status, setStatus] = useState<IncidentLifecycle>('rapid_response_dispatched');
  const [teamLead, setTeamLead] = useState(currentUser.displayName);
  const [assignedOfficers, setAssignedOfficers] = useState('Dr. Chukwuka Favour, Dr. Ibrahim Garba, Engr. Folashade Adeleke');
  const [triggerSignalType, setTriggerSignalType] = useState('Multi-source syndromic spike + Rodent trap count +42%');
  const [confirmedCases, setConfirmedCases] = useState<number>(12);
  const [contactsTraced, setContactsTraced] = useState<number>(45);
  const [ringsVaccinated, setRingsVaccinated] = useState<number>(0);
  const [initialObservation, setInitialObservation] = useState('Triage post established at local referral hospital with negative pressure barrier nursing.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentStateObj = NIGERIA_STATES.find((s) => s.name === selectedStateName) || NIGERIA_STATES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addInvestigation({
        title,
        diseaseOrThreat,
        state: selectedStateName,
        lga,
        priority,
        status,
        teamLead,
        assignedOfficers: assignedOfficers.split(',').map((s) => s.trim()),
        triggerSignalType,
        confirmedCases: Number(confirmedCases) || 0,
        contactsTraced: Number(contactsTraced) || 0,
        ringsVaccinated: Number(ringsVaccinated) || 0,
        fieldObservations: [
          {
            id: `obs-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            officerName: currentUser.displayName,
            role: currentUser.role,
            notes: initialObservation || 'Initial outbreak investigation launched.',
            category: 'clinical',
          },
        ],
        interventionsDocumented: [
          {
            id: `int-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            type: 'Deployment of Rapid Response Team',
            details: 'Multi-sectoral team deployed with diagnostic equipment and emergency PPE.',
            status: 'in_progress',
          },
        ],
        finalReportBrief: 'Investigation initialized under Federal One Health rapid response protocol.',
      });
      onClose();
    } catch (err) {
      console.error('Failed to create investigation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-white my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Launch Emergency Response Investigation</h2>
              <p className="text-xs text-slate-400">Deploy multidisciplinary One Health field cordons and incident tracking</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Investigation Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Esan West Lassa Spillover Multi-Sectoral Containment"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Pathogen / Threat</label>
              <input
                type="text"
                value={diseaseOrThreat}
                onChange={(e) => setDiseaseOrThreat(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                placeholder="e.g. Lassa Fever, H5N1, Cholera"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Priority Classification</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as InvestigationPriority)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              >
                <option value="urgent">Urgent (Immediate Deployment)</option>
                <option value="high">High (24h Dispatch)</option>
                <option value="medium">Medium (Routine Sentinel)</option>
                <option value="low">Low (Monitoring)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">State</label>
              <select
                value={selectedStateName}
                onChange={(e) => {
                  setSelectedStateName(e.target.value);
                  const st = NIGERIA_STATES.find((s) => s.name === e.target.value);
                  if (st && st.lgas.length > 0) setLga(st.lgas[0]);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                {NIGERIA_STATES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.zone})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">LGA</label>
              <select
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                {currentStateObj.lgas.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Incident Team Lead</label>
              <input
                type="text"
                value={teamLead}
                onChange={(e) => setTeamLead(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Investigation Lifecycle Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IncidentLifecycle)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              >
                <option value="alert_raised">Alert Raised</option>
                <option value="rapid_response_dispatched">Rapid Response Dispatched</option>
                <option value="lab_confirmation">Lab Confirmation Phase</option>
                <option value="one_health_containment">One Health Containment Active</option>
                <option value="resolved">Resolved / Post-Incident Audit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Assigned Field Officers (comma-separated)</label>
            <input
              type="text"
              value={assignedOfficers}
              onChange={(e) => setAssignedOfficers(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Trigger Signal Rationale</label>
            <input
              type="text"
              value={triggerSignalType}
              onChange={(e) => setTriggerSignalType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              placeholder="e.g. Rodent trap surge + 4 human febrile admissions"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Confirmed Cases</label>
              <input
                type="number"
                value={confirmedCases}
                onChange={(e) => setConfirmedCases(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Contacts Traced</label>
              <input
                type="number"
                value={contactsTraced}
                onChange={(e) => setContactsTraced(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-emerald-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Rings Vaccinated</label>
              <input
                type="number"
                value={ringsVaccinated}
                onChange={(e) => setRingsVaccinated(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-cyan-300 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Initial Field Observation</label>
            <textarea
              value={initialObservation}
              onChange={(e) => setInitialObservation(e.target.value)}
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Investigation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
