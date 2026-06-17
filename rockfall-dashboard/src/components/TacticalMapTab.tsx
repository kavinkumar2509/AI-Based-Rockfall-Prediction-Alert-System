import React, { useState, useEffect } from 'react';
import { Play, Activity, Thermometer, Droplet, CloudRain, ListFilter, AlertOctagon, HelpCircle } from 'lucide-react';
import { HudMarker, SafetyAlert } from '../types';

interface TacticalMapTabProps {
  sensors: {
    vibration: number;
    slopeTilt: number;
    moisture: number;
    rainfall: number;
  };
  alerts: SafetyAlert[];
  isSirenActive: boolean;
  onTriggerSiren: () => void;
  onAcknowledgeAlert: (id: string) => void;
}

const hudMarkers: HudMarker[] = [
  {
    id: '01',
    label: '01',
    name: 'Sector Alpha-1',
    top: '28%',
    left: '52%',
    telemetry: { vibration: 0.36, slopeTilt: 6.86, moisture: 18, rainfall: 0 },
    stability: 'STABLE_SEISMIC',
    surveillance: 'NOMINAL',
    transmitters: ['Vibration Array #1', 'Inclinometer T-89']
  },
  {
    id: '02',
    label: '02',
    name: 'Sector Beta-1',
    top: '38%',
    left: '58%',
    telemetry: { vibration: 0.48, slopeTilt: 11.23, moisture: 24, rainfall: 2 },
    stability: 'WARNING_DISPLACEMENT',
    surveillance: 'WARNING',
    transmitters: ['Vibration Array #2', 'Telemetry Probe S-04']
  },
  {
    id: '03',
    label: '03',
    name: 'Sector Delta-4',
    top: '31%',
    left: '65%',
    telemetry: { vibration: 0.82, slopeTilt: 16.45, moisture: 38, rainfall: 12 },
    stability: 'CRITICAL_MOVEMENT',
    surveillance: 'CRITICAL',
    transmitters: ['Sensor T-89 Recalib', 'Pluviometer R-02']
  },
  {
    id: '04',
    label: '04',
    name: 'Sector Gamma-2',
    top: '41%',
    left: '52%',
    telemetry: { vibration: 0.21, slopeTilt: 3.42, moisture: 12, rainfall: 0 },
    stability: 'STABLE_SEISMIC',
    surveillance: 'NOMINAL',
    transmitters: ['Vibration Array #4', 'Inclinometer T-91']
  }
];

export default function TacticalMapTab({
  sensors,
  alerts,
  isSirenActive,
  onTriggerSiren,
  onAcknowledgeAlert
}: TacticalMapTabProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>('01');
  const selectedSector = hudMarkers.find(m => m.id === selectedMarkerId) || hudMarkers[0];

  // Dynamic fluctuation of values
  const [liveVib, setLiveVib] = useState(sensors.vibration);
  const [liveTilt, setLiveTilt] = useState(sensors.slopeTilt);
  const [liveMoist, setLiveMoist] = useState(sensors.moisture);

  useEffect(() => {
    setLiveVib(isSirenActive ? 1.84 : sensors.vibration);
    setLiveTilt(isSirenActive ? 22.45 : sensors.slopeTilt);
    setLiveMoist(isSirenActive ? 48.0 : sensors.moisture);
  }, [isSirenActive, sensors]);

  // Compute aggregated risk index
 const baseRisk = Math.min(
  100,
  Math.round(
    (liveVib * 60) +
    (liveTilt * 2) +
    (liveMoist * 0.5)
  )
);
  const textRating = baseRisk > 75 ? 'DANGER' : baseRisk > 35 ? 'MODERATE' : 'NOMINAL';
  const strokeColor = baseRisk > 75 ? '#ef4444' : baseRisk > 35 ? '#f97316' : '#00FF41';

  // SVG parameters for radial circle
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (baseRisk / 100) * circumference;

  return (
    <div className="grid grid-cols-12 gap-6 w-full max-w-[1440px] mx-auto select-none">
      
      {/* COLUMN 1: INTERACTIVE REAL-TIME TELEMETRY SENSORS & THREAT RATINGS */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        
        {/* Real-time Telemetry Card */}
        <div className="bg-[#1f2020] p-5 border-2 border-[#4d4732] relative overflow-hidden">
          {/* Vertical moving scanline */}
<div
  className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500/10 pointer-events-none animate-[scan_4s_linear_infinite]"
></div>          
          <h3 className="font-mono text-xs font-black text-[#ffd700] uppercase tracking-wider mb-4 flex justify-between items-center">
            <span>REAL-TIME TELEMETRY</span>
            <span className="text-[10px] text-[#00FF41] animate-pulse">● LIVE SYNC</span>
          </h3>
          
          <div className="space-y-3">
            {/* VIBRATION feed */}
            <div className={`p-3.5 bg-[#1b1c1c] border-l-4 ${isSirenActive ? 'border-red-500' : 'border-[#ffd700]'} transition-colors`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-[#d0c6ab]">VIBRATION</span>
                <span className={`font-mono text-[10px] ${isSirenActive ? 'text-red-500 animate-pulse font-bold' : 'text-[#00FF41]'}`}>
                  {isSirenActive ? 'OVER LIMIT' : 'ONLINE'}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-mono font-bold ${isSirenActive ? 'text-red-500' : 'text-[#fff6df]'}`}>
                  {liveVib.toFixed(2)}
                </span>
                <span className="text-xs text-[#d0c6ab] font-mono">g</span>
              </div>
            </div>

            {/* SLOPE TILT feed */}
            <div className={`p-3.5 bg-[#1b1c1c] border-l-4 ${isSirenActive ? 'border-red-500' : 'border-orange-500'} transition-colors`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-[#d0c6ab]">SLOPE TILT</span>
                <span className={`font-mono text-[10px] ${isSirenActive ? 'text-red-500 font-bold' : 'text-[#00FF41]'}`}>
                  {isSirenActive ? 'CRITICAL' : 'ONLINE'}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-mono font-bold ${isSirenActive ? 'text-red-500' : 'text-[#fff6df]'}`}>
                  {liveTilt.toFixed(2)}°
                </span>
                <span className="text-xs text-[#d0c6ab] font-mono">tilt</span>
              </div>
            </div>

            {/* MOISTURE feed */}
            <div className="p-3.5 bg-[#1b1c1c] border-l-4 border-[#4d4732]">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-[#d0c6ab]">MOISTURE</span>
                <span className="font-mono text-[10px] text-[#00FF41]">ONLINE</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-[#fff6df]">
                  {Math.round(liveMoist)}
                </span>
                <span className="text-xs text-[#d0c6ab] font-mono">%</span>
              </div>
            </div>

            {/* RAINFALL feed */}
            <div className="p-3.5 bg-[#1b1c1c] border-l-4 border-[#4d4732]">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-[#d0c6ab]">RAINFALL</span>
                <span className="font-mono text-[10px] text-[#d0c6ab]">STANDBY</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-[#fff6df]">
                  {sensors.rainfall}
                </span>
                <span className="text-xs text-[#d0c6ab] font-mono">mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregated Risk Gauge Card */}
        <div className="bg-[#1f2020] p-5 border-2 border-[#4d4732] flex flex-col items-center">
          <h3 className="font-mono text-xs font-black text-[#ffd700] uppercase tracking-wider mb-5 w-full text-left">
            AGGREGATED RISK
          </h3>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-[#353535]"
                cx="80"
                cy="80"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="7"
              />
              <circle
                cx="80"
                cy="80"
                fill="transparent"
                r={radius}
                stroke={strokeColor}
                strokeWidth="11"
                className="transition-all duration-700 ease-out"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black font-mono transition-colors text-[#fff6df]`}>
                {baseRisk}%
              </span>
              <span className="font-mono text-[10px] font-bold tracking-widest mt-1" style={{ color: strokeColor }}>
                {textRating}
              </span>
            </div>
          </div>
          
          <p className="text-[11px] font-mono text-[#d0c6ab] text-center mt-5 leading-snug italic px-1">
            "HIGH-GRADE EXTRACTION TIER. MONITOR SEISMIC AMPLITUDES TO SECURE OPERATIONS AREA BOUNDARIES."
          </p>
        </div>
      </div>

      {/* COLUMN 2: MAIN TACTICAL HUD MAP WINDOW */}
      <div className="col-span-12 lg:col-span-6 space-y-6">
        
        {/* Map Container */}
        <div className="bg-[#0e0e0e] border-2 border-[#4d4732] h-[460px] relative flex flex-col overflow-hidden">
          
          {/* Active scanning state placard */}
          <div className="absolute top-4 left-4 z-10 bg-[#131313]/90 p-3 border-2 border-[#4d4732] backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-ping"></span>
              <span className="font-mono text-[11px] font-bold text-[#ffd700]">AI RADAR ACTIVE</span>
            </div>
            <div className="text-[10px] text-[#d0c6ab] font-mono leading-none">
              COORD_GRID: 23°11'N, 107°54'W
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10 bg-[#131313]/95 px-3 py-1.5 border border-[#4d4732] text-[10px] font-mono text-[#d0c6ab]">
            SCAN CONTRAST: <span className="text-[#ffd700] font-bold">0.82</span>
          </div>

          {/* Pit Mine image base */}
          <div className="absolute inset-0 z-0 select-none">
            <img
              className="w-full h-full object-cover opacity-65 grayscale contract-125 hover:grayscale-50 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC6QvdNQDgSPXTgYUXIreBaKrfGD1kfn9OcU4qlFZPYGScaCLLXai_QC81yUw3RoH2pi8GI97YWJldySp8-jRRVmEXn2CthE3vOjIqymDNIfnAqhO_4rPIqsqXj6U3a2XoMHGrHWFi4b5FnO6XVgT1lDyCfc5t7jXULVsNmasXTHxjfAYtDJ4mzE3YudT25pnKfbCh5E2z_KE3XvL65m6oVgR1PDe29oK4vB7hZlmiNht2t5APvk9S647L4eAAbeiulr0RWwCmklQ"
              alt="Open-pit safety maps monitoring visual"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Interactive Radar overlays */}
          <div className="absolute inset-0 pointer-events-none border-[12px] border-[#1f2020]/20">
            {/* Ring pulse simulation card */}
            <div className={`absolute top-[33%] left-[55%] w-32 h-32 border-2 ${isSirenActive ? 'border-red-500 animate-ping' : 'border-[#ffd700]/30 rounded-full animate-pulse'}`}></div>
            <div className={`absolute top-[28%] left-[62%] w-20 h-20 border ${isSirenActive ? 'border-red-500/20' : 'border-orange-500/30'} rounded-full animate-pulse`}></div>
          </div>

          {/* Clickable Indicators mapping Sector points 01, 02, 03, 04 */}
          {hudMarkers.map((marker) => {
            const isSelected = selectedMarkerId === marker.id;
            const isCriticalPoint = isSirenActive || marker.id === '03';
            
            return (
              <button
                key={marker.id}
                onClick={() => setSelectedMarkerId(marker.id)}
                className={`absolute z-20 px-2 py-1 font-mono text-[11px] font-bold border cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 ${
                  isSelected
                    ? 'bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-900/30'
                    : isCriticalPoint && marker.id === '03'
                      ? 'bg-red-950/80 border-red-500 text-red-500 animate-pulse'
                      : 'bg-[#131313]/90 border-[#4d4732] text-[#d0c6ab] hover:border-[#ffd700]'
                }`}
                style={{ top: marker.top, left: marker.left }}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : isCriticalPoint && marker.id === '03' ? 'bg-red-500 animate-ping' : 'bg-[#ffd700]'}`}></span>
                {marker.label}
              </button>
            );
          })}

          {/* Dynamic technical HUD readout overlay at bottom */}
          <div className="absolute bottom-4 left-4 z-10 bg-[#131313]/90 p-3 border-2 border-[#4d4732] font-mono text-[10px] text-[#d0c6ab]">
            <div>SYSTEMS: <span className={isSirenActive ? 'text-red-500 font-bold' : 'text-[#00FF41] font-bold'}>{isSirenActive ? 'EMERGENCY_SIREN_TRIGGERED' : selectedSector.stability}</span></div>
            <div className="mt-1">LIDAR RADIAL RESOLUTION: 0.12m</div>
            <div className="text-[9px] text-[#ffd700]/70 mt-1 uppercase">★ Interactive HUD Marker Point {selectedMarkerId} Selected</div>
          </div>
        </div>

        {/* BOTTOM METRIC SUMMARY BOXES OR WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Sector Overview */}
          <div className="bg-[#1f2020] p-4.5 border-2 border-[#4d4732] flex flex-col justify-between">
            <div>
              <h4 className="font-mono text-xs font-black text-[#d0c6ab] mb-2.5 uppercase tracking-wider">
                SECTOR OVERVIEW
              </h4>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#d0c6ab]">Zone Tag:</span>
                  <span className="text-[#fff6df] font-bold uppercase">{selectedSector.name.split(' ')[1] || 'ALPHA-1'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#d0c6ab]">Surveillance:</span>
                  <span className={`font-bold uppercase ${isSirenActive ? 'text-red-500' : selectedSector.surveillance === 'CRITICAL' ? 'text-red-400' : selectedSector.surveillance === 'WARNING' ? 'text-orange-400' : 'text-[#00FF41]'}`}>
                    {isSirenActive ? 'CRITICAL' : selectedSector.surveillance}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 text-[10px] font-mono text-[#d0c6ab] flex justify-between border-t border-[#4d4732]/50 pt-2.5">
              <span>Connected Nodes:</span>
              <span className="text-white font-bold">{selectedSector.transmitters.length} Nodes</span>
            </div>
          </div>

          {/* Active Transmitters */}
          <div className="bg-[#1f2020] p-4.5 border-2 border-[#4d4732]">
            <h4 className="font-mono text-xs font-black text-[#d0c6ab] mb-2.5 uppercase tracking-wider">
              ACTIVE TRANSMITTERS
            </h4>
            <div className="space-y-1.5 font-mono text-xs max-h-24 overflow-y-auto">
              <div className="bg-[#1b1c1c] px-2 py-1 flex justify-between border border-[#4d4732]/30 text-[10px]">
                <span className="text-[#d0c6ab]">Vib Array #1</span>
                <span className="text-[#00FF41] font-bold">0.36 g</span>
              </div>
              <div className="bg-[#1b1c1c] px-2 py-1 flex justify-between border border-[#4d4732]/30 text-[10px]">
                <span className="text-[#d0c6ab]">Pluviometer R-02</span>
                <span className="text-[#00FF41] font-bold">0 mm</span>
              </div>
            </div>
          </div>

          {/* Hardware Integrity Bar Progress Indicators */}
          <div className="bg-[#1f2020] p-5 border-2 border-[#4d4732]">
            <h4 className="font-mono text-[10px] font-black text-[#ffd700] mb-3 uppercase tracking-wider">
              HARDWARE INTEGRITY
            </h4>
            <div className="space-y-2.5">
              {/* Progress 1 */}
              <div>
                <div className="flex justify-between font-mono text-[9px] text-[#d0c6ab] mb-1">
                  <span>VIBRATOR ARRAYS</span>
                  <span className="text-[#00FF41]">100%</span>
                </div>
                <div className="h-1.5 bg-[#353535]">
                  <div className="h-full bg-[#00FF41]" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              {/* Progress 2 */}
              <div>
                <div className="flex justify-between font-mono text-[9px] text-[#d0c6ab] mb-1">
                  <span>INCLINOMETER T-89</span>
                  <span className="text-orange-400">92%</span>
                </div>
                <div className="h-1.5 bg-[#353535]">
                  <div className="h-full bg-orange-400" style={{ width: '92%' }}></div>
                </div>
              </div>

              {/* Progress 3 */}
              <div>
                <div className="flex justify-between font-mono text-[9px] text-[#d0c6ab] mb-1">
                  <span>AI PROCESSOR TPU-X</span>
                  <span className={isSirenActive ? 'text-red-500 font-bold' : 'text-orange-400 font-bold'}>
                    {isSirenActive ? 'OVERLOAD' : 'ACTIVE'}
                  </span>
                </div>
                <div className="h-1.5 bg-[#353535]">
                  <div className={`h-full ${isSirenActive ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* COLUMN 3: SAFETY ALERTS LOGGER MODULE */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        
        {/* Safety Alerts Card */}
        <div className="bg-[#1f2020] h-[460px] border-2 border-[#4d4732] flex flex-col justify-between">
          
          <div className="p-4 border-b border-[#4d4732] flex justify-between items-center bg-[#1b1c1c]">
            <h3 className="font-mono text-xs font-black text-[#ffd700] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
              <span>SAFETY ALERTS LOG</span>
            </h3>
            <ListFilter className="w-4 h-4 text-[#d0c6ab]" />
          </div>

          {/* Interactive list of current alerts */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#4d4732]/40 scrollbar-thin">
            {alerts.filter(a => !a.acknowledged).length === 0 ? (
              <div className="p-8 text-center text-[#d0c6ab] font-mono text-xs mt-12 py-10">
                NO SECTOR ALERTS RECORDED
              </div>
            ) : (
              alerts.filter(a => !a.acknowledged).map((alert) => {
                const isEmergency = alert.type === 'EMERGENCY';
                const isWarning = alert.type === 'WARNING';
                const badgeStyle = isEmergency
                  ? 'text-red-500 bg-red-950/20 font-bold'
                  : isWarning
                    ? 'text-orange-400 bg-orange-950/20 font-bold'
                    : 'text-[#00FF41] bg-[#00FF41]/5';
                
                return (
                  <div key={alert.id} className={`p-4 transition-colors ${isEmergency ? 'bg-red-950/10 border-l-4 border-red-500' : isWarning ? 'bg-orange-950/5 border-l-4 border-orange-500' : 'bg-[#131313]/30'}`}>
                    <div className="flex justify-between items-start mb-1.5 font-mono text-[9px]">
                      <span className={`px-1.5 py-0.5 border ${isEmergency ? 'border-red-900/50' : isWarning ? 'border-orange-900/50' : 'border-green-900/10'} uppercase tracking-tight ${badgeStyle}`}>
                        {alert.type} • {alert.sector}
                      </span>
                      <span className="text-[#d0c6ab] tracking-tight">{alert.timestamp}</span>
                    </div>
                    <div className="text-xs text-[#e4e2e1] font-sans leading-relaxed">
                      {alert.message}
                    </div>
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="mt-2.5 font-mono text-[9px] text-[#ffd700] hover:text-white uppercase tracking-wider border border-[#4d4732] px-2 py-1 bg-[#1b1c1c] active:bg-[#131313] transition-colors cursor-pointer"
                    >
                      Clear / Ack Alert
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Action Trigger zone */}
          <div className="p-4.5 bg-[#1b1c1c] border-t-2 border-[#4d4732] space-y-3">
            <h4 className="font-mono text-[10px] text-[#ffd700] font-black uppercase tracking-wider">
              RECOMMENDED ACTIONS
            </h4>
            
            {isSirenActive ? (
              <button
                onClick={onTriggerSiren}
                className="w-full bg-[#1b1c1c] text-red-500 border border-red-500 font-mono text-center font-black py-3 uppercase tracking-wide text-xs hover:bg-neutral-900 active:scale-98 transition-transform cursor-pointer"
              >
                ■ SILENCE EMER SIREN
              </button>
            ) : (
              <button
                id="emergency-siren-trigger"
                onClick={onTriggerSiren}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-mono text-center font-black py-3.5 uppercase tracking-wide text-xs active:scale-98 transition-transform cursor-pointer shadow-md shadow-red-900/20"
              >
                ● TRIGGER SECTOR SIREN
              </button>
            )}
          </div>
        </div>

        {/* Diagnostic assessment details */}
        <div className="bg-[#1f2020] p-4.5 border-2 border-[#4d4732] font-mono text-xs">
          <div className="flex justify-between items-center mb-2.5 text-[#ffd700] font-black uppercase text-[10px]">
            <span>GEOTECHNICAL BRIEF</span>
            <span>OK</span>
          </div>
          <div className="text-[11px] leading-relaxed text-[#d0c6ab] italic">
            "Last structural displacement analysis indicates nominal stress distribution across central bench grids. Rainfall is monitored closely."
          </div>
        </div>
      </div>

    </div>
  );
}
