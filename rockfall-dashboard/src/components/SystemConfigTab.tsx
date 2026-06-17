import React from 'react';
import { Settings, Shield, RefreshCw, Sliders, Server, HardDrive, Info } from 'lucide-react';

interface SystemConfigTabProps {
  thresholds: {
    vibration: number;
    slopeTilt: number;
    moisture: number;
  };
  simulationSpeed: 'OFF' | '1X' | '5X' | '10X';
  isAutoDiagnosticsEnabled: boolean;
  onUpdateThreshold: (key: string, value: number) => void;
  onUpdateSimSpeed: (speed: 'OFF' | '1X' | '5X' | '10X') => void;
  onToggleAutoDiag: () => void;
}

export default function SystemConfigTab({
  thresholds,
  simulationSpeed,
  isAutoDiagnosticsEnabled,
  onUpdateThreshold,
  onUpdateSimSpeed,
  onToggleAutoDiag,
}: SystemConfigTabProps) {
  return (
    <div className="grid grid-cols-12 gap-6 w-full max-w-[1440px] mx-auto select-none font-mono">
      {/* THRESHOLD GATES SETTINGS PANEL */}
      <div className="col-span-12 lg:col-span-6 bg-[#1f2020] border-2 border-[#4d4732] p-5">
        <div className="border-b border-[#4d4732] pb-3 mb-5 flex gap-2 items-center text-[#ffd700] uppercase text-xs font-black">
          <Sliders className="w-4 h-4 text-orange-500" />
          <span>SAFETY TELEMETRY GATES & THRESHOLDS</span>
        </div>

        <p className="text-[11px] text-[#d0c6ab] leading-relaxed mb-6">
          Set the maximum values before alarms are triggered. Readings exceeding these bounds instantly sound emergency alert logs.
        </p>

        <div className="space-y-5 text-xs">
          {/* Vibration Gate limit slider */}
          <div className="bg-[#131313] p-4.5 border border-[#4d4732]/30">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-[#e4e2e1] uppercase">VIBRATION LIMIT ALARM</span>
              <span className="text-[#ffd700] font-bold">{thresholds.vibration} g</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={thresholds.vibration}
              onChange={(e) => onUpdateThreshold('vibration', parseFloat(e.target.value))}
              className="w-full accent-orange-500 bg-neutral-800 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#d0c6ab] mt-1.5">
              <span>0.1g (Sensitive)</span>
              <span>2.0g (Heavy Blast limit)</span>
            </div>
          </div>

          {/* Slope Tilt Gate slider */}
          <div className="bg-[#131313] p-4.5 border border-[#4d4732]/30">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-[#e4e2e1] uppercase">SLOPE TILT SHIFT BOUNDARY</span>
              <span className="text-[#ffd700] font-bold">{thresholds.slopeTilt}°</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="30.0"
              step="0.5"
              value={thresholds.slopeTilt}
              onChange={(e) => onUpdateThreshold('slopeTilt', parseFloat(e.target.value))}
              className="w-full accent-orange-500 bg-neutral-800 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#d0c6ab] mt-1.5">
              <span>2.0° (Soft Slope)</span>
              <span>30.0° (Steep Shear face)</span>
            </div>
          </div>

          {/* Moisture slider */}
          <div className="bg-[#131313] p-4.5 border border-[#4d4732]/30">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-[#e4e2e1] uppercase">AGGREGATE MOISTURE ALARM GATE</span>
              <span className="text-[#ffd700] font-bold">{thresholds.moisture}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="1"
              value={thresholds.moisture}
              onChange={(e) => onUpdateThreshold('moisture', parseInt(e.target.value))}
              className="w-full accent-orange-500 bg-neutral-800 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#d0c6ab] mt-1.5">
              <span>10% (Arid bedrock)</span>
              <span>80% (Saturated landslide trigger)</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE SIMULATOR & HARDWARE DIAGNOSTICS CONTROL PANEL */}
      <div className="col-span-12 lg:col-span-6 bg-[#1f2020] border-2 border-[#4d4732] p-5 flex flex-col justify-between h-auto">
        <div className="space-y-6">
          <div className="border-b border-[#4d4732] pb-3 mb-5 flex gap-2 items-center text-[#ffd700] uppercase text-xs font-black">
            <Server className="w-4 h-4 text-orange-500" />
            <span>DATA SIMULATOR & SYSTEM DEPLOYMENT</span>
          </div>

          <div className="space-y-4">
            {/* Simulation Speed Toggles */}
            <div className="bg-[#131313] p-4 border border-[#4d4732]/30">
              <span className="text-[10px] text-[#ffd700] uppercase block mb-2 font-bold select-none">
                Background Telemetry Simulation frequency
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {(['OFF', '1X', '5X', '10X'] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => onUpdateSimSpeed(speed)}
                    className={`text-xs py-2 border cursor-pointer font-bold uppercase transition-all ${
                      simulationSpeed === speed
                        ? 'bg-orange-600 border-orange-500 text-white font-black'
                        : 'bg-[#1b1c1c] border-[#4d4732] text-[#d0c6ab] hover:border-[#ffd700]'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="bg-[#131313] p-4.5 border border-[#4d4732]/30 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-[#e4e2e1] uppercase block">LIDAR AUTO DIAGNOSTICS</span>
                <span className="text-[9px] text-[#d0c6ab] mt-0.5 block">Continuously queries AI Processor telemetry filters</span>
              </div>
              <button
                onClick={onToggleAutoDiag}
                className={`px-3 py-1.5 text-[10px] font-bold border cursor-pointer uppercase ${
                  isAutoDiagnosticsEnabled
                    ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00ff41]/20'
                    : 'bg-[#353535]/30 text-[#d0c6ab] border-[#4d4732]'
                }`}
              >
                {isAutoDiagnosticsEnabled ? '● ENABLED' : '○ DEACTIVATED'}
              </button>
            </div>
          </div>
        </div>

        {/* Environmental Metadata Information box */}
        <div className="bg-[#131313] p-4 border border-[#4d4732]/30 text-xs text-[#d0c6ab] mt-6 leading-relaxed">
          <div className="flex gap-2 text-white font-bold mb-2 uppercase text-[10px] items-center">
            <Info className="w-4 h-4 text-[#ffd700]" />
            <span>DEPLOYMENT DETAILS</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span>Host Region:</span>
              <span className="text-[#e4e2e1]">Open-Pit Zone Shelf 1A</span>
            </div>
            <div className="flex justify-between">
              <span>Database Sync Protocol:</span>
              <span className="text-[#e4e2e1]">Wired LoRaWAN Direct Mesh</span>
            </div>
            <div className="flex justify-between">
              <span>Sensing Frequency Interval:</span>
              <span className="text-[#e4e2e1]">160 ms (Ultra High Resolution)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
