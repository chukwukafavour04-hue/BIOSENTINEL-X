import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  BarChart3,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ReportingModule: React.FC = () => {
  const {
    zoonoticReports,
    environmentalReports,
    vectorReports,
    investigations,
    stats,
    selectedState,
  } = useData();
  const { currentUser } = useAuth();

  const [reportType, setReportType] = useState<'sitrep' | 'management' | 'data_export'>('sitrep');

  // CSV Generator function
  const exportToCSV = (dataset: 'zoonotic' | 'environmental' | 'vector' | 'investigations') => {
    let headers: string[] = [];
    let rows: any[] = [];
    let filename = '';

    if (dataset === 'zoonotic') {
      filename = `biosentinel_zoonotic_surveillance_${new Date().toISOString().slice(0, 10)}.csv`;
      headers = ['ID', 'Disease Name', 'Category', 'Animal Species', 'Animal Cases', 'Human Cases', 'Human Deaths', 'State', 'LGA', 'Lab Status', 'Lab Method', 'Source', 'Reporting Date'];
      rows = zoonoticReports.map((r) => [
        r.id,
        `"${r.diseaseName}"`,
        `"${r.diseaseCategory}"`,
        `"${r.animalSpecies}"`,
        r.animalCases,
        r.humanCases,
        r.humanDeaths,
        `"${r.state}"`,
        `"${r.lga}"`,
        `"${r.labStatus}"`,
        `"${r.labMethod}"`,
        `"${r.source}"`,
        r.reportingDate,
      ]);
    } else if (dataset === 'environmental') {
      filename = `biosentinel_environmental_surveillance_${new Date().toISOString().slice(0, 10)}.csv`;
      headers = ['ID', 'Indicator Type', 'State', 'LGA', 'Severity', 'Coliform (CFU/100mL)', 'Turbidity (NTU)', 'Flood Level', 'Abattoir Waste', 'Temperature (C)', 'Rainfall (mm)', 'Reporting Date'];
      rows = environmentalReports.map((r) => [
        r.id,
        `"${r.indicatorType}"`,
        `"${r.state}"`,
        `"${r.lga}"`,
        `"${r.severity}"`,
        r.waterColiformCount || '',
        r.waterTurbidity || '',
        `"${r.floodInundationLevel || ''}"`,
        `"${r.abattoirWasteDisposal || ''}"`,
        r.temperatureC,
        r.rainfallMm,
        r.reportingDate,
      ]);
    } else if (dataset === 'vector') {
      filename = `biosentinel_vector_surveillance_${new Date().toISOString().slice(0, 10)}.csv`;
      headers = ['ID', 'Vector Genus', 'Species', 'State', 'LGA', 'Larval Breteau Index', 'Adult Trap Catch', 'Pathogen Detected', 'Resistance Profile', 'Collection Date'];
      rows = vectorReports.map((r) => [
        r.id,
        `"${r.vectorType}"`,
        `"${r.species}"`,
        `"${r.state}"`,
        `"${r.lga}"`,
        r.larvalIndexBreteau,
        r.adultTrapCatchPerNight,
        `"${r.pathogenDetected}"`,
        `"${r.insecticideResistance}"`,
        r.collectionDate,
      ]);
    } else if (dataset === 'investigations') {
      filename = `biosentinel_emergency_investigations_${new Date().toISOString().slice(0, 10)}.csv`;
      headers = ['ID', 'Investigation Number', 'Title', 'State', 'LGA', 'Priority', 'Status', 'Team Lead', 'Confirmed Cases', 'Contacts Traced', 'Created At'];
      rows = investigations.map((r) => [
        r.id,
        `"${r.investigationNumber}"`,
        `"${r.title}"`,
        `"${r.state}"`,
        `"${r.lga}"`,
        `"${r.priority}"`,
        `"${r.status}"`,
        `"${r.teamLead}"`,
        r.confirmedCases,
        r.contactsTraced,
        r.createdAt,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>EXECUTIVE REPORTING & DATA EXPORTS</span>
          </div>
          <h1 className="text-xl font-bold text-white font-display">
            One Health Analytics & Institutional Reporting
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Generate print-ready formatted situation reports (SitReps), export granular surveillance CSV datasets, and review institutional rapid response governance metrics.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setReportType('sitrep')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              reportType === 'sitrep' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Formatted SitRep
          </button>
          <button
            onClick={() => setReportType('management')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              reportType === 'management' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Institutional Metrics
          </button>
          <button
            onClick={() => setReportType('data_export')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              reportType === 'data_export' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            CSV Data Exports
          </button>
        </div>
      </div>

      {/* REPORT TYPE 1: Formatted Printable Situation Report */}
      {reportType === 'sitrep' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400 font-mono">
              PREVIEWING: <strong className="text-white">Federal One Health Situation Briefing</strong>
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-2 border border-slate-700"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          {/* Institutional Print Formatted Sheet */}
          <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-300 max-w-4xl mx-auto space-y-6 font-sans">
            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
              <div>
                <div className="text-[11px] font-mono tracking-widest text-emerald-800 font-bold uppercase">
                  FEDERAL REPUBLIC OF NIGERIA · ONE HEALTH INTER-AGENCY PLATFORM
                </div>
                <h1 className="text-2xl font-extrabold text-slate-950 mt-1 font-display tracking-tight">
                  BIOSENTINEL X EPIDEMIOLOGICAL SITUATION REPORT
                </h1>
                <div className="text-xs text-slate-600 mt-1">
                  Joint Technical Surveillance: Federal Ministry of Health · Federal Ministry of Agriculture · Federal Ministry of Environment
                </div>
              </div>
              <div className="text-right font-mono text-xs text-slate-700">
                <div className="font-bold">SITREP NO: BSX-2026-W45</div>
                <div>DATE: {new Date().toLocaleDateString()}</div>
                <div>CLASSIFICATION: RESTRICTED</div>
              </div>
            </div>

            {/* Executive Summary Block */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold mb-1">
                1. Executive Overview & Threat Calculus
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed text-justify bg-slate-50 p-4 rounded-lg border border-slate-200">
                During the current reporting cycle, multi-domain surveillance indicates an elevated composite spillover risk score of <strong>{stats.spilloverRiskScore}/100</strong> across Nigerian sentinel zones. Hospital sentinel admissions track <strong>{stats.totalHumanCases} laboratory-suspected and confirmed human cases</strong> with <strong>{stats.totalHumanDeaths} fatalities</strong>, predominantly clustered in the Edo-Ondo Lassa transmission corridor and Kano avian holdings. Active river embankment submersion along the Benue basin correlates with coliform counts surpassing safe potable standards by 10x.
              </p>
            </div>

            {/* Cross-Sectoral Incident Breakdown */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold mb-2">
                2. Cross-Sectoral Intelligence Telemetry
              </h2>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="text-slate-600 text-[10px]">HUMAN CLINICAL SIGNALS</div>
                  <div className="text-lg font-bold text-slate-900">{stats.totalHumanCases} Cases</div>
                  <div className="text-[11px] text-rose-700">{stats.totalHumanDeaths} deaths documented</div>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="text-slate-600 text-[10px]">ANIMAL BURDEN</div>
                  <div className="text-lg font-bold text-slate-900">{stats.totalAnimalCases.toLocaleString()}</div>
                  <div className="text-[11px] text-amber-700">Infected / Culled</div>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="text-slate-600 text-[10px]">ACTIVE FIELD CORDONS</div>
                  <div className="text-lg font-bold text-slate-900">{stats.activeInvestigationsCount} Investigations</div>
                  <div className="text-[11px] text-emerald-700">Multidisciplinary teams</div>
                </div>
              </div>
            </div>

            {/* Active Zoonotic Table in SitRep */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold mb-2">
                3. High-Priority Zoonotic Index Incidents
              </h2>
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 font-mono text-[10px] uppercase text-slate-700">
                  <tr>
                    <th className="p-2 border-b">Disease</th>
                    <th className="p-2 border-b">Animal Reservoir</th>
                    <th className="p-2 border-b">Jurisdiction</th>
                    <th className="p-2 border-b text-right">Human</th>
                    <th className="p-2 border-b text-right">Animal</th>
                    <th className="p-2 border-b">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {zoonoticReports.slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td className="p-2 font-semibold">{r.diseaseName}</td>
                      <td className="p-2 text-slate-600">{r.animalSpecies.split(' ')[0]}</td>
                      <td className="p-2">{r.lga}, {r.state}</td>
                      <td className="p-2 text-right font-mono font-semibold">{r.humanCases} ({r.humanDeaths}D)</td>
                      <td className="p-2 text-right font-mono">{r.animalCases}</td>
                      <td className="p-2 uppercase font-mono text-[10px] text-emerald-800 font-semibold">{r.labStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature Block */}
            <div className="pt-6 border-t-2 border-slate-900 flex items-center justify-between text-xs font-mono">
              <div>
                <div className="font-bold text-slate-900">{currentUser.displayName}</div>
                <div className="text-slate-600">{currentUser.facility}</div>
                <div className="text-[10px] text-slate-500">Federal One Health Technical Taskforce</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">VERIFIED OFFICIAL BRIEFING</div>
                <div className="text-slate-600">STAMP: BSX-NATIONAL-COMMAND</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT TYPE 2: Institutional Management Metrics */}
      {reportType === 'management' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="text-xs font-mono text-slate-400 mb-1">AVERAGE LAB TURNAROUND</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">18.4 Hours</div>
              <div className="text-[11px] text-slate-400 mt-1">WHO standard: &lt;24 hours</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="text-xs font-mono text-slate-400 mb-1">FIELD DISPATCH LATENCY</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">4.2 Hours</div>
              <div className="text-[11px] text-slate-400 mt-1">From alert verification</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="text-xs font-mono text-slate-400 mb-1">CONTACT TRACING EFFICIENCY</div>
              <div className="text-2xl font-bold font-mono text-white">94.8%</div>
              <div className="text-[11px] text-emerald-400 mt-1">148 of 156 tracked</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="text-xs font-mono text-slate-400 mb-1">ONE HEALTH SYNERGY INDEX</div>
              <div className="text-2xl font-bold font-mono text-amber-400">92/100</div>
              <div className="text-[11px] text-slate-400 mt-1">Tri-ministerial coordination</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Institutional Capacity & Field Readiness Audit
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Molecular Diagnostic Surge Capacity (PCR / Sequencing)</div>
                  <div className="text-slate-400 text-[11px]">National Reference Lab Gaduwa, ISTH Irrua, and NVRI Vom operating at nominal capacity.</div>
                </div>
                <span className="text-emerald-400 font-mono font-semibold">100% OPERATIONAL</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Therapeutic & Vaccine Stockpile Reserve (Ribavirin / Rabies PEP)</div>
                  <div className="text-slate-400 text-[11px]">Sufficient strategic stockpiles for 45-day sustained cluster response.</div>
                </div>
                <span className="text-emerald-400 font-mono font-semibold">SUFFICIENT</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Cross-Border Pastoral Surveillance (Cameroon / Niger / Chad)</div>
                  <div className="text-slate-400 text-[11px]">Borno and Yobe livestock checkposts require additional rapid tick-screening kits.</div>
                </div>
                <span className="text-amber-400 font-mono font-semibold">PARTIAL REINFORCEMENT</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT TYPE 3: CSV Data Exports */}
      {reportType === 'data_export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-rose-400 uppercase font-bold mb-1">
                DATASET 01 · ZOONOTIC INTELLIGENCE
              </div>
              <h3 className="font-bold text-white text-sm">Zoonotic Disease Surveillance Records</h3>
              <p className="text-xs text-slate-400 mt-1">
                Complete tabular exports of all reported pathogens, animal reservoir species, human cases, deaths, diagnostic methods, and laboratory confirmation statuses.
              </p>
              <div className="text-xs font-mono text-slate-500 mt-2">
                Total Records: <strong>{zoonoticReports.length} rows</strong>
              </div>
            </div>
            <button
              onClick={() => exportToCSV('zoonotic')}
              className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <Download className="w-4 h-4 text-rose-400" />
              <span>Download Zoonotic CSV</span>
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase font-bold mb-1">
                DATASET 02 · ENVIRONMENTAL TELEMETRY
              </div>
              <h3 className="font-bold text-white text-sm">Water Quality & Flood Hazard Telemetry</h3>
              <p className="text-xs text-slate-400 mt-1">
                Export coliform CFU counts, turbidity readings, pH values, flood inundation severity, displaced counts, and rainfall statistics across all LGAs.
              </p>
              <div className="text-xs font-mono text-slate-500 mt-2">
                Total Records: <strong>{environmentalReports.length} rows</strong>
              </div>
            </div>
            <button
              onClick={() => exportToCSV('environmental')}
              className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download Environmental CSV</span>
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase font-bold mb-1">
                DATASET 03 · ENTOMOLOGY
              </div>
              <h3 className="font-bold text-white text-sm">Vector Surveillance & Resistance Logs</h3>
              <p className="text-xs text-slate-400 mt-1">
                Export Aedes, Anopheles, tick, and blackfly density indices, larval Breteau scores, adult CDC light trap counts, and insecticide bioassay resistance profiles.
              </p>
              <div className="text-xs font-mono text-slate-500 mt-2">
                Total Records: <strong>{vectorReports.length} rows</strong>
              </div>
            </div>
            <button
              onClick={() => exportToCSV('vector')}
              className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download Vector CSV</span>
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase font-bold mb-1">
                DATASET 04 · EMERGENCY AUDIT
              </div>
              <h3 className="font-bold text-white text-sm">Field Investigations & Response History</h3>
              <p className="text-xs text-slate-400 mt-1">
                Export full incident lifecycle histories, officer assignments, confirmed cases, contacts traced, and intervention logs for audit and compliance.
              </p>
              <div className="text-xs font-mono text-slate-500 mt-2">
                Total Records: <strong>{investigations.length} rows</strong>
              </div>
            </div>
            <button
              onClick={() => exportToCSV('investigations')}
              className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Investigation CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
