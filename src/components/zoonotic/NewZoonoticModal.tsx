import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { NIGERIA_STATES } from '../../data/seedData';
import { DiseaseCategory, LabConfirmationStatus, InvestigationStatus } from '../../types';
import { X, Plus, Biohazard } from 'lucide-react';

interface NewZoonoticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewZoonoticModal: React.FC<NewZoonoticModalProps> = ({ isOpen, onClose }) => {
  const { addZoonoticReport } = useData();
  const { currentUser } = useAuth();

  const [diseaseName, setDiseaseName] = useState('Lassa Fever');
  const [diseaseCategory, setDiseaseCategory] = useState<DiseaseCategory>('Viral Hemorrhagic Fever');
  const [animalSpecies, setAnimalSpecies] = useState('Mastomys natalensis (Rodent)');
  const [animalCases, setAnimalCases] = useState(25);
  const [humanCases, setHumanCases] = useState(4);
  const [humanDeaths, setHumanDeaths] = useState(0);
  const [selectedStateName, setSelectedStateName] = useState('Edo');
  const [lga, setLga] = useState('Esan West');
  const [locationDetails, setLocationDetails] = useState('');
  const [labStatus, setLabStatus] = useState<LabConfirmationStatus>('confirmed');
  const [labMethod, setLabMethod] = useState('RT-PCR');
  const [reportingDate, setReportingDate] = useState(new Date().toISOString().slice(0, 10));
  const [onsetDate, setOnsetDate] = useState(new Date().toISOString().slice(0, 10));
  const [investigationStatus, setInvestigationStatus] = useState<InvestigationStatus>('field_dispatched');
  const [source, setSource] = useState<'Veterinary Clinic' | 'Hospital Sentinel' | 'Abattoir Surveillance' | 'Community Health Worker' | 'Wildlife Ranger'>('Hospital Sentinel');
  const [riskScore, setRiskScore] = useState(75);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentStateObj = NIGERIA_STATES.find((s) => s.name === selectedStateName) || NIGERIA_STATES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addZoonoticReport({
        diseaseName,
        diseaseCategory,
        animalSpecies,
        animalCases: Number(animalCases) || 0,
        humanCases: Number(humanCases) || 0,
        humanDeaths: Number(humanDeaths) || 0,
        state: selectedStateName,
        lga,
        locationDetails: locationDetails || `${lga} Central Healthcare and Veterinary Catchment`,
        coordinates: currentStateObj.coordinates,
        labStatus,
        labMethod,
        reportingDate,
        onsetDate,
        investigationStatus,
        source,
        riskScore: Number(riskScore) || 50,
        notes: notes || `One Health surveillance report logged by ${currentUser.displayName}.`,
      });
      onClose();
    } catch (err) {
      console.error('Failed to submit zoonotic report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-white my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Biohazard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Log Structured Zoonotic Spillover Record</h2>
              <p className="text-xs text-slate-400">Connect animal host reservoir data with human sentinel observations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Disease Name</label>
              <input
                type="text"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Lassa Fever, Avian Influenza, Anthrax"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Disease Category</label>
              <select
                value={diseaseCategory}
                onChange={(e) => setDiseaseCategory(e.target.value as DiseaseCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Viral Hemorrhagic Fever">Viral Hemorrhagic Fever</option>
                <option value="Respiratory Zoonosis">Respiratory Zoonosis</option>
                <option value="Bacterial Zoonosis">Bacterial Zoonosis</option>
                <option value="Arboviral Disease">Arboviral Disease</option>
                <option value="Poxvirus">Poxvirus</option>
                <option value="Parasitic / Protozoan">Parasitic / Protozoan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Animal Reservoir / Host Species</label>
              <input
                type="text"
                value={animalSpecies}
                onChange={(e) => setAnimalSpecies(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Mastomys natalensis, Gallus domesticus, Bovine"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Animal Cases / Sick</label>
              <input
                type="number"
                min="0"
                value={animalCases}
                onChange={(e) => setAnimalCases(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Human Cases</label>
              <input
                type="number"
                min="0"
                value={humanCases}
                onChange={(e) => setHumanCases(Number(e.target.value))}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Human Deaths</label>
              <input
                type="number"
                min="0"
                value={humanDeaths}
                onChange={(e) => setHumanDeaths(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-rose-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Lab Status</label>
              <select
                value={labStatus}
                onChange={(e) => setLabStatus(e.target.value as LabConfirmationStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="suspected">Suspected</option>
                <option value="inconclusive">Inconclusive</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Risk Score (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={riskScore}
                onChange={(e) => setRiskScore(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <label className="block text-slate-300 font-medium mb-1">Local Government Area (LGA)</label>
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
            <div>
              <label className="block text-slate-300 font-medium mb-1">Diagnostic Method</label>
              <input
                type="text"
                value={labMethod}
                onChange={(e) => setLabMethod(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                placeholder="RT-PCR, Serology, Sequencing"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Surveillance Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="Hospital Sentinel">Hospital Sentinel</option>
                <option value="Veterinary Clinic">Veterinary Clinic</option>
                <option value="Abattoir Surveillance">Abattoir Surveillance</option>
                <option value="Community Health Worker">Community Health Worker</option>
                <option value="Wildlife Ranger">Wildlife Ranger</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Investigation Status</label>
              <select
                value={investigationStatus}
                onChange={(e) => setInvestigationStatus(e.target.value as InvestigationStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="triaged">Triaged</option>
                <option value="field_dispatched">Field Team Dispatched</option>
                <option value="sample_in_transit">Sample In Transit</option>
                <option value="sequenced">Genomic Sequenced</option>
                <option value="closed">Closed / Contained</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Reporting Date</label>
              <input
                type="date"
                value={reportingDate}
                onChange={(e) => setReportingDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Epidemiological Field Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Detail spillover context, contact exposures, food handling, livestock movement, or clinical observations..."
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
              <span>{isSubmitting ? 'Registering...' : 'Register Zoonotic Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
