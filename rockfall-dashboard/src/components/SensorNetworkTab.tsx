import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, ShieldAlert, Cpu, CheckSquare } from 'lucide-react';
import { SensorData } from '../types';

interface SensorNetworkTabProps {
  sensors: SensorData[];
  onToggleStatus: (id: string) => void;
  onCalibrate: (id: string) => void;
}

export default function SensorNetworkTab({
  sensors,
  onToggleStatus,
  onCalibrate,
}: SensorNetworkTabProps) {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const selectedSensor = sensors.find(s => s.id === selectedSensorId);

  return (
    <div className="grid grid-cols-12 gap-6 w-full max-w-[1440px] mx-auto select-none font-mono">
      {/* SENSOR MONITORING DIRECTORY TABLE */}
      <div className="col-span-12 lg:col-span-8 bg-[#1f2020] border-2 border-[#4d4732] p-5">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#4d4732]">
          <h3 className="text-xs font-black text-[#ffd700] uppercase tracking-wider">
            SENSOR FEED DIRECTORY (ACTIVE TRANSMITTERS)
          </h3>
          <span className="text-[10px] text-[#00FF41]">● CONNECTIVITY SYNCD</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#4d4732] text-[#d0c6ab] uppercase text-[10px] pb-2">
                <th className="py-2.5 px-3">NODE ID</th>
                <th className="py-2.5 px-3">SENSING CLUSTER</th>
                <th className="py-2.5 px-3">TELEMETRY</th>
                <th className="py-2.5 px-3">THRESHOLD LIMIT</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3 text-right">CONTROLS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4d4732]/30 text-white">
              {sensors.map((sensor) => (
                <tr
                  key={sensor.id}
                  onClick={() => setSelectedSensorId(sensor.id)}
                  className={`hover:bg-[#1b1c1c] transition-colors cursor-pointer ${
                    selectedSensorId === sensor.id ? 'bg-[#1b1c1c] border-l-4 border-orange-500' : ''
                  }`}
                >
                  <td className="py-3.5 px-3 font-bold text-[#ffd700]">{sensor.id}</td>
                  <td className="py-3.5 px-3 text-[#e4e2e1] uppercase">{sensor.name}</td>
                  <td className="py-3.5 px-3 font-bold">
                    {sensor.value.toFixed(2)} <span className="text-[10px] text-[#d0c6ab] font-normal">{sensor.unit}</span>
                  </td>
                  <td className="py-3.5 px-3 text-[#d0c6ab]">
                    {sensor.threshold} {sensor.unit}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 border ${
                        sensor.status === 'ONLINE'
                          ? 'bg-[#00FF41]/5 text-[#00FF41] border-[#00ff41]/20'
                          : sensor.status === 'FAULT'
                            ? 'bg-red-950/20 text-red-500 border-red-950'
                            : 'bg-[#353535] text-[#d0c6ab] border-[#4d4732]'
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onCalibrate(sensor.id)}
                        className="text-[10px] border border-[#4d4732] px-2 py-1 bg-[#131313] text-[#ffd700] hover:bg-neutral-900 active:scale-95 transition-transform cursor-pointer uppercase"
                      >
                        Calibrate
                      </button>
                      <button
                        onClick={() => onToggleStatus(sensor.id)}
                        className={`text-[9px] px-2 py-1 uppercase font-bold cursor-pointer ${
                          sensor.status === 'ONLINE'
                            ? 'bg-[#93000a] border border-red-900/50 text-white'
                            : 'bg-green-600 border border-green-500 text-white'
                        }`}
                      >
                        {sensor.status === 'ONLINE' ? 'Disable' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SENSOR CONFIGURATION & SPECIFICATION SIDE PANEL */}
      <div className="col-span-12 lg:col-span-4 bg-[#1f2020] border-2 border-[#4d4732] p-5 flex flex-col justify-between h-fit">
        <div>
          <div className="border-b border-[#4d4732] pb-3 mb-4 flex gap-2 items-center text-orange-500 uppercase">
            <Cpu className="w-4 h-4" />
            <h3 className="text-xs font-black">NODE SPECIFICATIONS</h3>
          </div>

          {selectedSensor ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[#d0c6ab] text-[10px] uppercase">SELECTED INSTANCE</span>
                <h4 className="text-sm font-bold text-white uppercase mt-0.5">{selectedSensor.name} ({selectedSensor.id})</h4>
              </div>

              <div className="grid grid-cols-2 gap-3.5 bg-[#131313] p-3 border border-[#4d4732]/30">
                <div>
                  <div className="text-[9px] text-[#d0c6ab]">CURRENT READING</div>
                  <div className="text-base font-bold text-[#ffd700] mt-0.5">
                    {selectedSensor.value.toFixed(2)} {selectedSensor.unit}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-[#d0c6ab]">STATUS VECTOR</div>
                  <div className="text-sm font-bold text-[#00FF41] mt-1 uppercase">{selectedSensor.status}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between border-b border-[#4d4732]/20 py-1.5">
                  <span className="text-[#d0c6ab]">Hardware Tag:</span>
                  <span className="text-white">TRANS_UNIT_{selectedSensor.id}</span>
                </div>
                <div className="flex justify-between border-b border-[#4d4732]/20 py-1.5">
                  <span className="text-[#d0c6ab]">Sensing Frequency:</span>
                  <span className="text-white">2.4 GHz LoRaWAN</span>
                </div>
                <div className="flex justify-between border-b border-[#4d4732]/20 py-1.5">
                  <span className="text-[#d0c6ab]">Power Vector:</span>
                  <span className="text-white">Battery (96% Solar Sync)</span>
                </div>
              </div>

              {/* Mock telemetry historical visualization trend */}
              <div className="mt-4 bg-[#131313] p-3 border border-[#4d4732]/40">
                <span className="text-[#d0c6ab] text-[9px] uppercase tracking-wide">TELEMETRY HISTOGRAM (24H)</span>
                <div className="h-20 w-full flex items-end gap-1 px-1 border-b border-l border-[#4d4732]/50 mt-2">
                  {selectedSensor.history.map((val, idx) => {
                    const normHeight = Math.min(((val / selectedSensor.threshold) * 80), 100);
                    return (
                      <div
                        key={idx}
                        className={`w-full hover:bg-[#ffd700] transition-all ${
                          val > selectedSensor.threshold ? 'bg-red-500' : 'bg-orange-500/50'
                        }`}
                        style={{ height: `${normHeight}%` }}
                        title={`Reading: ${val} ${selectedSensor.unit}`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#d0c6ab] italic text-xs leading-relaxed border border-dashed border-[#4d4732] bg-[#1a1a1a]">
              "Select a specific sensor node from the grid table to inspect and modify calibration values, diagnostic trends, and hardware details."
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#4d4732]/50">
          <div className="text-[10px] text-[#ffd700] uppercase mb-2 flex items-center gap-1">
            <ToggleRight className="w-4 h-4 text-orange-500" />
            <span>GLOBAL CALIBRATION DRIFT</span>
          </div>
          <p className="text-[11px] text-[#d0c6ab] leading-relaxed italic">
            "All telemetry readings have standard mechanical filters to counter seismic interference from nearby active heavy extraction vehicle tracks."
          </p>
        </div>
      </div>
    </div>
  );
}
