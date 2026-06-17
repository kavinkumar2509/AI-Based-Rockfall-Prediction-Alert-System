import React, { useState } from 'react';
import { Sparkles, Brain, CheckSquare, CheckCircle, ShieldAlert, Cpu, AlertTriangle, AlertCircle } from 'lucide-react';
import { HudMarker } from '../types';

interface AiRiskAnalyticsTabProps {
  markers: HudMarker[];
  isSirenActive: boolean;
}

interface AiReport {
  assessment: string;
  confidence: number;
  riskScore: number;
  status: 'STABLE_SEISMIC' | 'WARNING_DISPLACEMENT' | 'CRITICAL_MOVEMENT';
  recommendations: string[];
}

export default function AiRiskAnalyticsTab({ markers, isSirenActive }: AiRiskAnalyticsTabProps) {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('01');
  const [report, setReport] = useState<AiReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedSector = markers.find(m => m.id === selectedSectorId) || markers[0];
  const predictionWindow =
  selectedSector.telemetry.vibration > 1.5
    ? "5 - 15 Minutes"
    : selectedSector.telemetry.vibration > 1.0
    ? "15 - 30 Minutes"
    : selectedSector.telemetry.vibration > 0.6
    ? "30 - 60 Minutes"
    : "No Immediate Threat";

const localRisk =
  selectedSector.telemetry.vibration > 1.5
    ? "CRITICAL"
    : selectedSector.telemetry.vibration > 1.0
    ? "HIGH"
    : selectedSector.telemetry.vibration > 0.6
    ? "MEDIUM"
    : "LOW";

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setReport(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: selectedSector.name,
          vibration: selectedSector.telemetry.vibration,
          slopeTilt: selectedSector.telemetry.slopeTilt,
          moisture: selectedSector.telemetry.moisture,
          rainfall: selectedSector.telemetry.rainfall,
        }),
      });

      if (!response.ok) {
        throw new Error('API server failed to respond properly.');
      }

      const data = await response.json();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected telemetry routing issue occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 w-full max-w-[1440px] mx-auto select-none font-mono">
      {/* SENSOR FEED PANEL */}
      <div className="col-span-12 lg:col-span-4 bg-[#1f2020] border-2 border-[#4d4732] p-5 flex flex-col justify-between">
        <div>
          <div className="border-b border-[#4d4732] pb-3 mb-4 flex gap-2 items-center text-[#ffd700] uppercase text-xs font-black">
            <Cpu className="w-4 h-4 text-orange-500" />
            <span>AI STABILITY ANALYSIS PORTAL</span>
          </div>

          <p className="text-[11px] text-[#d0c6ab] leading-relaxed mb-4">
            Select a target geological sector in the open-pit safety grid. The model assesses local displacement records against real-time seismic fluctuations to outline hazards.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-[#ffd700] uppercase block mb-1">Select Sector Area</label>
              <select
                value={selectedSectorId}
                onChange={(e) => setSelectedSectorId(e.target.value)}
                className="w-full bg-[#131313] text-[#fff6df] border border-[#4d4732] px-3 py-2 text-xs focus:outline-none focus:border-[#ffd700] cursor-pointer"
              >
                {markers.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#131313]">
                    {m.name} [ID: {m.id}]
                  </option>
                ))}
              </select>
            </div>

            {/* Readonly parameters checklist */}
            <div className="bg-[#131313] p-4.5 border border-[#4d4732]/30 space-y-2.5 text-xs">
              <div className="text-[10px] text-[#d0c6ab] uppercase tracking-wide border-b border-[#4d4732]/20 pb-1.5 mb-2 flex justify-between">
                <span>Telemetry Feed Vectors</span>
                <span className="text-[#00FF41]">ACTIVE</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-[#d0c6ab]">Vibration Amplitude:</span>
                <span className="text-white font-bold">{selectedSector.telemetry.vibration.toFixed(2)} g</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#d0c6ab]">Slope Inclinometer Tilt:</span>
                <span className="text-white font-bold">{selectedSector.telemetry.slopeTilt.toFixed(2)}°</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#d0c6ab]">Aggregate Moisture:</span>
                <span className="text-white font-bold">{selectedSector.telemetry.moisture}%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#d0c6ab]">Rainfall Gage Coefficient:</span>
                <span className="text-white font-bold">{selectedSector.telemetry.rainfall} mm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="w-full bg-[#ffd700] hover:bg-[#ffe16d] text-[#131313] font-bold py-3 uppercase text-xs tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-40 cursor-pointer"
          >
            <Brain className="w-4 h-4 animate-pulse text-neutral-800" />
            {isLoading ? 'ANALYZING GEOLOGICAL FEED...' : 'GENERATE AI STABILITY REPORT'}
          </button>
        </div>
      </div>

      {/* REPORT FEED DISPLAY */}
      <div className="col-span-12 lg:col-span-8 bg-[#1f2020] border-2 border-[#4d4732] p-5 flex flex-col justify-between min-h-[480px]">
        
        {isLoading ? (
          /* High-quality radar radar analysis sweep visual loading effect */
          <div className="flex-1 flex flex-col justify-center items-center py-10 space-y-5">
            <div className="relative w-24 h-24 border-4 border-[#353535] rounded-full flex items-center justify-center animate-spin">
              <div className="absolute top-0 left-0 w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-[#ffd700] uppercase animate-pulse">Running Geotechnical Lidar Analysis</h4>
              <p className="text-[10px] text-[#d0c6ab] mt-1.5 uppercase tracking-wide">Syncing terrain telemetry with model rules...</p>
            </div>
          </div>
        ) : errorMsg ? (
          <div className="flex-1 flex flex-col justify-center items-center py-10 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3 animate-bounce" />
            <span className="text-red-500 text-sm font-bold uppercase">AI ANALYTICS ENGINE OFFLINE</span>
            <p className="text-[11px] text-[#d0c6ab] mt-2 max-w-md bg-[#131313] border border-red-900/40 p-3 italic">
              "{errorMsg}"
            </p>
          </div>
        ) : report ? (
          <div className="space-y-5 animate-fade-in">
            {/* Report Header */}
            <div className="flex justify-between items-start border-b border-[#4d4732]/40 pb-3">
              <div>
                <span className="text-[9px] text-[#d0c6ab] uppercase">GEOTECHNICAL HAZARD ASSESSMENT REPORT</span>
                <h4 className="text-base font-bold text-white uppercase mt-0.5">{selectedSector.name}</h4>
              </div>
              <div className="bg-[#ffd700]/10 px-3 py-1 border border-[#ffd700] text-[#ffd700] text-[10px] uppercase font-bold">
                {report.confidence}% CONFIDENCE
              </div>
            </div>

            {/* Assessment Verbal Summary Card */}
            <div className="bg-[#131313] p-4.5 border border-[#4d4732]/40 border-l-4 border-orange-500">
              <span className="text-[#ffd700] text-[10px] uppercase font-bold tracking-wide">MODEL SUMMARY ASSESSMENT:</span>
              <p className="text-xs text-[#e4e2e1] leading-relaxed mt-2 italic">
                "{report.assessment}"
              </p>
            </div>

            {/* Risk rating score indicator sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
              <div className="bg-[#131313] p-4 border border-[#4d4732]/20">
                <div className="text-[9px] text-[#d0c6ab] uppercase mb-1">AGGREGATE AI RISK SCORE</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{report.riskScore}</span>
                  <span className="text-xs text-[#d0c6ab]/70">/ 100</span>
                </div>
                <div className="h-1.5 bg-[#353535] mt-2">
                  <div
                    className={`h-full ${report.riskScore > 70 ? 'bg-red-500' : report.riskScore > 35 ? 'bg-orange-500' : 'bg-[#00FF41]'}`}
                    style={{ width: `${report.riskScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-[#131313] p-4 border border-[#4d4732]/20">
                <div className="text-[9px] text-[#d0c6ab] uppercase mb-1">STABILITY HAZARD LEVEL</div>
                <div className="text-sm font-bold uppercase mt-1 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${report.status === 'CRITICAL_MOVEMENT' ? 'bg-red-500 animate-ping' : report.status === 'WARNING_DISPLACEMENT' ? 'bg-orange-500' : 'bg-[#00FF41]'}`}></span>
                  <span className={report.status === 'CRITICAL_MOVEMENT' ? 'text-red-500' : report.status === 'WARNING_DISPLACEMENT' ? 'text-orange-400' : 'text-[#00FF41]'}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations checklist list */}
            <div>
              <span className="text-white text-[10px] font-black uppercase tracking-wider block mb-2 px-1">MODEL PREVENTATIVE RECOMMENDATIONS:</span>
              <ul className="space-y-2">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="bg-[#131313] px-3.5 py-2.5 border border-[#4d4732]/20 flex items-start gap-3 text-xs leading-relaxed">
                    <CheckSquare className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                    <span className="text-[#e4e2e1]">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center py-12 text-center">
          <div className="text-center space-y-4">
  <Sparkles className="w-12 h-12 text-[#ffd700] mx-auto animate-pulse" />

  <h3 className="text-[#ffd700] text-lg font-bold uppercase">
    AI Prediction Engine
  </h3>

  <div className="bg-[#131313] border border-[#4d4732] p-4">
    <div className="text-xs text-[#d0c6ab]">
      Sector
    </div>
    <div className="text-white font-bold">
      {selectedSector.name}
    </div>
  </div>

  <div className="bg-[#131313] border border-[#4d4732] p-4">
    <div className="text-xs text-[#d0c6ab]">
      Predicted Risk
    </div>
    <div className="text-red-400 text-xl font-bold">
      {localRisk}
    </div>
  </div>

  <div className="bg-[#131313] border border-[#4d4732] p-4">
    <div className="text-xs text-[#d0c6ab]">
      Estimated Failure Window
    </div>
    <div className="text-yellow-400 font-bold">
      {predictionWindow}
    </div>
  </div>
</div>
            <p className="text-[11px] text-[#d0c6ab] mt-2 max-w-sm">
              Press "GENERATE AI STABILITY REPORT" to request a real-time safety vector calculation based on selected active sensor units telemetry feeds.
            </p>
          </div>
        )}

        {/* Global disclaimer warning notice */}
        <div className="mt-8 border-t border-[#4d4732]/40 pt-4 flex gap-3 text-[10px] text-[#d0c6ab] items-start italic leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
          <span>
            "AI safety reports are calculated via machine-learning geological models. Hand-vetting stability benchmarks remain mandatory for heavy excavation planning operations."
          </span>
        </div>

      </div>
    </div>
  );
}
