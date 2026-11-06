import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  BrainCircuit,
  Sparkles,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Send,
  Loader2,
  RefreshCw,
  Compass,
  Download,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

export const BiosentinelAI: React.FC = () => {
  const {
    filteredZoonotic,
    filteredEnvironmental,
    filteredVectors,
    filteredInvestigations,
    selectedState,
    addAuditLog,
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'synthesis' | 'sitrep' | 'chat'>('synthesis');

  // Synthesis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState<any>(null);

  // SitRep State
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [sitrepResult, setSitrepResult] = useState<any>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text: `Hello. I am the BIOSENTINEL X One Health Intelligence Analyst powered by Gemini.\n\nI continuously monitor and cross-correlate human sentinel admissions, veterinary reservoir data, hydrological sensor readings, and entomological density indices across Nigerian ecological corridors.\n\nHow can I assist your epidemiological or field response taskforce today?`,
    },
  ]);

  // Execute Multi-Domain Signal Synthesis
  const handleRunSynthesis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoonoticSignals: filteredZoonotic,
          environmentalSignals: filteredEnvironmental,
          vectorSignals: filteredVectors,
          activeInvestigations: filteredInvestigations,
          selectedState: selectedState !== 'All Nigeria' ? selectedState : undefined,
        }),
      });

      if (!res.ok) throw new Error('Synthesis analysis failed');
      const data = await res.json();
      setSynthesisResult(data);
      await addAuditLog(
        'GENERATE_AI_SYNTHESIS',
        'ai_synthesis',
        `SYN-${Date.now()}`,
        `Executed Gemini One Health multi-domain anomaly synthesis for ${selectedState}.`
      );
    } catch (err) {
      console.error('Synthesis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Formal SitRep Brief
  const handleGenerateSitrep = async () => {
    setIsGeneratingBrief(true);
    try {
      const topZoonotic = filteredZoonotic[0];
      const res = await fetch('/api/gemini/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threatTitle: topZoonotic ? topZoonotic.diseaseName : 'National Multi-Domain Outbreak',
          state: selectedState !== 'All Nigeria' ? selectedState : 'National Sentinel Grid',
          lga: topZoonotic ? topZoonotic.lga : 'Multiple LGAs',
          humanCases: {
            totalCases: filteredZoonotic.reduce((acc, c) => acc + c.humanCases, 0),
            deaths: filteredZoonotic.reduce((acc, c) => acc + c.humanDeaths, 0),
          },
          animalData: filteredZoonotic.map((z) => ({
            species: z.animalSpecies,
            cases: z.animalCases,
            labStatus: z.labStatus,
          })),
          environmentalData: filteredEnvironmental.map((e) => ({
            type: e.indicatorType,
            coliform: e.waterColiformCount,
            flood: e.floodInundationLevel,
            rainfall: e.rainfallMm,
          })),
          responseStatus: 'Active Multi-Disciplinary Containment',
        }),
      });

      if (!res.ok) throw new Error('SitRep generation failed');
      const data = await res.json();
      setSitrepResult(data);
    } catch (err) {
      console.error('SitRep error:', err);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  // Chat message send
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/ask-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          conversationHistory: chatMessages,
          contextData: {
            scope: selectedState,
            zoonoticCount: filteredZoonotic.length,
            humanCases: filteredZoonotic.reduce((a, c) => a + c.humanCases, 0),
            environmentalAlerts: filteredEnvironmental.length,
            vectorAlerts: filteredVectors.length,
          },
        }),
      });

      if (!res.ok) throw new Error('Chat response failed');
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: 'model', text: data.answer }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Apologies, I encountered a connection interruption while querying the analytical model. Please verify your network and retry.',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <BrainCircuit className="w-4 h-4" />
            <span>INTELLIGENT ONE HEALTH ANALYST CORE</span>
          </div>
          <h1 className="text-xl font-bold text-white font-display">
            BIOSENTINEL AI: Epidemiological Anomaly & Risk Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Leveraging Gemini to synthesize multi-domain telemetry, detect cross-sectoral anomalies, conduct gap analyses, and generate official One Health investigation briefs.
          </p>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveSubTab('synthesis')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'synthesis'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Multi-Signal Synthesis
          </button>
          <button
            onClick={() => setActiveSubTab('sitrep')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'sitrep'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Situation Report (SitRep)
          </button>
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'chat'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive Analyst
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Multi-Signal Synthesis */}
      {activeSubTab === 'synthesis' && (
        <div className="space-y-6">
          {/* Action Trigger Card */}
          <div className="bg-[#080E1E] border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Automated One Health Anomaly Scan & Gap Analysis
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Synthesize {filteredZoonotic.length} zoonotic reports, {filteredEnvironmental.length} environmental alerts, and {filteredVectors.length} entomological traps currently in scope ({selectedState}).
              </p>
            </div>

            <button
              onClick={handleRunSynthesis}
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50 shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Telemetry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Anomaly Detection</span>
                </>
              )}
            </button>
          </div>

          {/* Synthesis Results Dashboard */}
          {synthesisResult && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Executive Summary & Threat Score Strip */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">
                    EXECUTIVE ANALYTICAL SUMMARY
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {synthesisResult.summary}
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    ANOMALY RISK INDEX
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold font-mono text-rose-400 tabular-nums">
                      {synthesisResult.anomalyScore || 78}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/100</span>
                  </div>
                  <div className="text-[11px] font-mono text-amber-400 uppercase font-semibold mt-1">
                    {synthesisResult.threatLevel || 'ELEVATED'}
                  </div>
                </div>
              </div>

              {/* CRITICAL DISTINCTION: Verified Observations vs Predicted Risks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Verified Observations (Empirical Facts) */}
                <div className="bg-slate-900/90 border border-emerald-900/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 pb-3 border-b border-slate-800 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold uppercase tracking-wider">VERIFIED OBSERVATIONS (EMPIRICAL DATA)</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {synthesisResult.verifiedObservations?.map((obs: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-emerald-400 font-mono text-[10px] shrink-0 mt-0.5">[OBS-{idx + 1}]</span>
                        <span className="leading-relaxed">{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Predicted Risks (Statistical Probabilities) */}
                <div className="bg-slate-900/90 border border-amber-900/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 pb-3 border-b border-slate-800 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="font-bold uppercase tracking-wider">PREDICTED RISKS (TRANSMISSION MODELS)</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {synthesisResult.predictedRisks?.map((risk: any, idx: number) => (
                      <div key={idx} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-white">{risk.threat}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950 text-amber-300 border border-amber-800">
                            {risk.probability} Probability
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mb-1">Location: {risk.location}</div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{risk.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cross-Domain Correlations & Gap Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cross-Domain Correlations */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold pb-3 border-b border-slate-800 mb-3">
                    Cross-Sectoral Telemetry Correlations
                  </div>
                  <div className="space-y-3 text-xs">
                    {synthesisResult.crossDomainCorrelations?.map((corr: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="text-[11px] font-mono text-cyan-300 font-semibold mb-1">
                          {corr.domainPair}
                        </div>
                        <p className="text-slate-300 leading-relaxed">{corr.finding}</p>
                        <div className="text-[11px] text-slate-400 mt-2 pt-1.5 border-t border-slate-800/60">
                          <strong>Public Health Implication:</strong> {corr.implication}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing & Conflicting Information (Gap Analysis) */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-bold">
                      Surveillance Gaps & Conflicting Data
                    </span>
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {synthesisResult.gapsAndConflicts?.map((gap: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                        <span className="text-rose-400 font-mono text-[11px]">✕</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Prioritized Recommendations */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <div className="text-xs font-mono uppercase text-emerald-400 font-bold mb-2">
                      Prioritized Field Protocols
                    </div>
                    <div className="space-y-2 text-xs">
                      {synthesisResult.actionableRecommendations?.map((rec: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded bg-emerald-950/20 border border-emerald-800/40 text-slate-300">
                          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                            <span className="text-emerald-400 font-semibold">{rec.targetAgency}</span>
                            <span className="text-slate-400 uppercase">{rec.priority} PRIORITY</span>
                          </div>
                          <div className="text-[11px] text-slate-200">{rec.action}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: One Health Situation Report (SitRep) */}
      {activeSubTab === 'sitrep' && (
        <div className="space-y-6">
          <div className="bg-[#080E1E] border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Automated One Health Situation Report (SitRep) Generator
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Compiles an authoritative briefing formatted for federal ministry leadership and WHO One Health coordination teams.
              </p>
            </div>

            <button
              onClick={handleGenerateSitrep}
              disabled={isGeneratingBrief}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 shrink-0"
            >
              {isGeneratingBrief ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting SitRep...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Generate Situation Brief</span>
                </>
              )}
            </button>
          </div>

          {sitrepResult && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8 text-white space-y-6 shadow-2xl animate-in fade-in duration-200">
              {/* Sitrep Header */}
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-mono text-emerald-400 font-bold tracking-wider">
                    {sitrepResult.classification}
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1 font-display">
                    One Health Integrated Epidemiological Situation Report
                  </h2>
                </div>
                <div className="text-right text-xs font-mono text-slate-400">
                  <div>ID: {sitrepResult.sitrepId}</div>
                  <div>Date: {new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                  1. Executive Incident Overview
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                  {sitrepResult.incidentOverview}
                </p>
              </div>

              {/* Epidemiological Triad */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
                  2. Epidemiological Triad Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] font-mono text-rose-400 font-bold mb-1">HOST FACTORS</div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {sitrepResult.epidemiologicalTriad?.hostFactors}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] font-mono text-amber-400 font-bold mb-1">AGENT FACTORS</div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {sitrepResult.epidemiologicalTriad?.agentFactors}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] font-mono text-cyan-400 font-bold mb-1">ENVIRONMENTAL FACTORS</div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {sitrepResult.epidemiologicalTriad?.environmentalFactors}
                    </p>
                  </div>
                </div>
              </div>

              {/* Containment Strategy */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
                  3. One Health Multi-Sectoral Containment Strategy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                    <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">HUMAN HEALTH (NCDC)</div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {sitrepResult.containmentStrategy?.humanContainment}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40">
                    <div className="text-[11px] font-mono text-amber-400 font-bold mb-1">ANIMAL HEALTH (VET)</div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {sitrepResult.containmentStrategy?.animalContainment}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-800/40">
                    <div className="text-[11px] font-mono text-cyan-400 font-bold mb-1">ENVIRONMENT & WATER</div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {sitrepResult.containmentStrategy?.environmentalContainment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Horizon */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs flex items-start gap-3">
                <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-[11px] text-cyan-400 uppercase font-bold">4. 14-Day Risk Horizon & Expansion Outlook</div>
                  <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">{sitrepResult.riskHorizon}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-right text-xs font-mono text-slate-400">
                Authorizing Body: <strong className="text-white">{sitrepResult.signOff}</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: Interactive Analyst Chat */}
      {activeSubTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="font-bold text-white font-mono">BIOSENTINEL AI CO-PILOT</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Grounded on Nigerian One Health Surveillance Context</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">GEMINI-3.8-FLASH</span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-2xl p-3.5 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-md'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    You
                  </div>
                )}
              </div>
            ))}
            {isChatLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 text-slate-400 text-xs italic font-mono">
                  Synthesizing One Health epidemiological records...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about Lassa transmission pathways, flood-driven cholera risks, vector control protocols..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Query</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
