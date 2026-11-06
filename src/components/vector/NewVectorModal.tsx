import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { NIGERIA_STATES } from '../../data/seedData';
import { VectorType } from '../../types';
import { X, Plus, Bug } from 'lucide-react';

interface NewVectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewVectorModal: React.FC<NewVectorModalProps> = ({ isOpen, onClose }) => {
  const { addVectorReport } = useData();
  const { currentUser } = useAuth();

  const [vectorType, setVectorType] = useState<VectorType>('mosquito');
  const [species, setSpecies] = useState('Aedes aegypti');
  const [selectedStateName, setSelectedStateName] = useState('Oyo');
  const [lga, setLga] = useState('Ibadan North');
  const [collectionSiteType, setCollectionSiteType] = useState('Household compound artificial water containers & tyres');
  const [larvalIndexBreteau, setLarvalIndexBreteau] = useState<number>(55);
  const [adultTrapCatchPerNight, setAdultTrapCatchPerNight] = useState<number>(38);
  const [pathogenDetected, setPathogenDetected] = useState('Dengue virus');
  const [insecticideResistance, setInsecticideResistance] = useState<'susceptible' | 'pyrethroid_resistant' | 'organophosphate_resistant' | 'dual_resistant'>('pyrethroid_resistant');
  const [interventionsApplied, setInterventionsApplied] = useState('Larviciding with Temephos, IRS');
  const [collectionDate, setReportingDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentStateObj = NIGERIA_STATES.find((s) => s.name === selectedStateName) || NIGERIA_STATES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addVectorReport({
        vectorType,
        species,
        state: selectedStateName,
        lga,
        collectionSiteType,
        coordinates: currentStateObj.coordinates,
        collectionDate,
        larvalIndexBreteau: Number(larvalIndexBreteau) || 0,
        adultTrapCatchPerNight: Number(adultTrapCatchPerNight) || 0,
        pathogenDetected,
        insecticideResistance,
        interventionsApplied: interventionsApplied ? interventionsApplied.split(',').map((s) => s.trim()) : [],
        notes: notes || `Entomological trap surveillance logged by ${currentUser.displayName}.`,
      });
      onClose();
    } catch (err) {
      console.error('Failed to submit vector report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-white my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Log Vector Surveillance & Resistance Record</h2>
              <p className="text-xs text-slate-400">Record larval Breteau index, adult trap catch, molecular pathogen detection</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Vector Genus / Category</label>
              <select
                value={vectorType}
                onChange={(e) => setVectorType(e.target.value as VectorType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="mosquito">Mosquito (Aedes, Anopheles, Culex)</option>
                <option value="tick">Tick (Hyalomma, Rhipicephalus)</option>
                <option value="blackfly">Blackfly (Simulium)</option>
                <option value="sandfly">Sandfly (Phlebotomus)</option>
                <option value="tsetse">Tsetse Fly (Glossina)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Species Name</label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white italic"
                placeholder="e.g. Aedes aegypti, Hyalomma dromedarii"
              />
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
              <label className="block text-slate-300 font-medium mb-1">Collection Habitat / Site Type</label>
              <input
                type="text"
                value={collectionSiteType}
                onChange={(e) => setCollectionSiteType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                placeholder="e.g. Urban storm gutters, abattoir perimeter"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Collection Date</label>
              <input
                type="date"
                value={collectionDate}
                onChange={(e) => setReportingDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Larval Breteau Index</label>
              <input
                type="number"
                value={larvalIndexBreteau}
                onChange={(e) => setLarvalIndexBreteau(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-rose-400 font-mono font-bold"
                placeholder="Alert > 50"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Adult Trap Catch / Night</label>
              <input
                type="number"
                value={adultTrapCatchPerNight}
                onChange={(e) => setAdultTrapCatchPerNight(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Pathogen Detected</label>
              <input
                type="text"
                value={pathogenDetected}
                onChange={(e) => setPathogenDetected(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-cyan-300 font-mono"
                placeholder="e.g. Dengue, CCHFV"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Resistance Profile</label>
              <select
                value={insecticideResistance}
                onChange={(e) => setInsecticideResistance(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-amber-300 font-mono"
              >
                <option value="susceptible">Susceptible</option>
                <option value="pyrethroid_resistant">Pyrethroid Resistant</option>
                <option value="organophosphate_resistant">Organophosphate Resistant</option>
                <option value="dual_resistant">Dual Resistant</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Interventions Applied (comma-separated)</label>
            <input
              type="text"
              value={interventionsApplied}
              onChange={(e) => setInterventionsApplied(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              placeholder="e.g. Larviciding with Bti, LLIN distribution, IRS"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Field Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="Bioassay test results, knockdown time, container types..."
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
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Vector Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
