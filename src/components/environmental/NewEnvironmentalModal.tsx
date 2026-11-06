import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { NIGERIA_STATES } from '../../data/seedData';
import { EnvironmentalIndicatorType, SeverityLevel } from '../../types';
import { X, Plus, Droplets } from 'lucide-react';

interface NewEnvironmentalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewEnvironmentalModal: React.FC<NewEnvironmentalModalProps> = ({ isOpen, onClose }) => {
  const { addEnvironmentalReport } = useData();
  const { currentUser } = useAuth();

  const [indicatorType, setIndicatorType] = useState<EnvironmentalIndicatorType>('water_quality');
  const [selectedStateName, setSelectedStateName] = useState('Benue');
  const [lga, setLga] = useState('Makurdi');
  const [locationDetails, setLocationDetails] = useState('');
  const [waterColiformCount, setWaterColiformCount] = useState<number>(340);
  const [waterTurbidity, setWaterTurbidity] = useState<number>(28);
  const [waterPh, setWaterPh] = useState<number>(6.8);
  const [floodInundationLevel, setFloodInundationLevel] = useState<'None' | 'Minor Stagnation' | 'Severe River Overflow' | 'Catastrophic Submersion'>('Minor Stagnation');
  const [displacedCount, setDisplacedCount] = useState<number>(0);
  const [stagnantWaterRisk, setStagnantWaterRisk] = useState<'Low' | 'Moderate' | 'High' | 'Critical'>('High');
  const [openDefecationRisk, setOpenDefecationRisk] = useState<'Low' | 'Moderate' | 'High' | 'Severe'>('Moderate');
  const [abattoirWasteDisposal, setAbattoirWasteDisposal] = useState<'Regulated Incineration' | 'Septic Lagoon' | 'Direct Watercourse Discharge' | 'Uncontrolled Open Dump'>('Direct Watercourse Discharge');
  const [pesticideRunoff, setPesticideRunoff] = useState<'Negligible' | 'Detected' | 'Heavy Agricultural Runoff'>('Detected');
  const [temperatureC, setTemperatureC] = useState<number>(31.5);
  const [rainfallMm, setRainfallMm] = useState<number>(45.0);
  const [humidityPercent, setHumidityPercent] = useState<number>(82);
  const [severity, setSeverity] = useState<SeverityLevel>('elevated');
  const [reportingDate, setReportingDate] = useState(new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState('Hydrological & Environmental Sanitation Station');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentStateObj = NIGERIA_STATES.find((s) => s.name === selectedStateName) || NIGERIA_STATES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addEnvironmentalReport({
        indicatorType,
        state: selectedStateName,
        lga,
        locationDetails: locationDetails || `${lga} Waterway Basin and Drainage Network`,
        coordinates: currentStateObj.coordinates,
        waterColiformCount: Number(waterColiformCount) || undefined,
        waterTurbidity: Number(waterTurbidity) || undefined,
        waterPh: Number(waterPh) || undefined,
        floodInundationLevel,
        displacedCount: Number(displacedCount) || 0,
        stagnantWaterRisk,
        openDefecationRisk,
        abattoirWasteDisposal,
        pesticideRunoff,
        temperatureC: Number(temperatureC) || 30,
        rainfallMm: Number(rainfallMm) || 0,
        humidityPercent: Number(humidityPercent) || 70,
        severity,
        reportingDate,
        source,
        notes: notes || `Environmental sanitary hazard assessment logged by ${currentUser.displayName}.`,
      });
      onClose();
    } catch (err) {
      console.error('Failed to submit environmental report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-white my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Log Environmental Hazard & Water Quality Report</h2>
              <p className="text-xs text-slate-400">Track coliform counts, inundation, abattoir waste, and climatic indicators</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Indicator Domain</label>
              <select
                value={indicatorType}
                onChange={(e) => setIndicatorType(e.target.value as EnvironmentalIndicatorType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="water_quality">Water Quality & Potability</option>
                <option value="flooding">Flooding & River Inundation</option>
                <option value="sanitation">Sanitation & Drainage Blockage</option>
                <option value="waste_management">Abattoir & Bio-Waste Management</option>
                <option value="contamination">Chemical & Mining Contamination</option>
                <option value="climatic">Climatic & Heat Anomaly</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Severity Assessment</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              >
                <option value="nominal">Nominal / Baseline</option>
                <option value="moderate">Moderate / Watch</option>
                <option value="elevated">Elevated / High Threat</option>
                <option value="critical">Critical / Emergency</option>
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

          {/* Water & Inundation Specifics */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="text-[11px] font-mono uppercase text-cyan-400">Hydrological & Sanitary Measurements</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">Coliform (CFU/100mL)</label>
                <input
                  type="number"
                  value={waterColiformCount}
                  onChange={(e) => setWaterColiformCount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
                  placeholder="WHO Standard: 0"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">Turbidity (NTU)</label>
                <input
                  type="number"
                  value={waterTurbidity}
                  onChange={(e) => setWaterTurbidity(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">Water pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={waterPh}
                  onChange={(e) => setWaterPh(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">Flood Inundation Level</label>
                <select
                  value={floodInundationLevel}
                  onChange={(e) => setFloodInundationLevel(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="None">None</option>
                  <option value="Minor Stagnation">Minor Stagnation</option>
                  <option value="Severe River Overflow">Severe River Overflow</option>
                  <option value="Catastrophic Submersion">Catastrophic Submersion</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">Abattoir Waste Disposal</label>
                <select
                  value={abattoirWasteDisposal}
                  onChange={(e) => setAbattoirWasteDisposal(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="Regulated Incineration">Regulated Incineration</option>
                  <option value="Septic Lagoon">Septic Lagoon</option>
                  <option value="Direct Watercourse Discharge">Direct Watercourse Discharge</option>
                  <option value="Uncontrolled Open Dump">Uncontrolled Open Dump</option>
                </select>
              </div>
            </div>
          </div>

          {/* Climatic Factors */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Temperature (°C)</label>
              <input
                type="number"
                step="0.5"
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Rainfall (mm)</label>
              <input
                type="number"
                step="0.5"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Humidity (%)</label>
              <input
                type="number"
                value={humidityPercent}
                onChange={(e) => setHumidityPercent(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Observational Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
              placeholder="Record water testing kit details, breach locations, displaced settlements, or sanitary inspection findings..."
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
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Environmental Alert'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
