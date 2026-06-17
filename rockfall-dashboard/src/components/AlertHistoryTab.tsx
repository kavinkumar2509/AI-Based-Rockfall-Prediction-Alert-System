import React, { useState } from 'react';
import { SafetyAlert, AlertType, SectorName } from '../types';
import { Filter, Trash2, CheckCircle, Clock, AlertTriangle, Plus, Newspaper } from 'lucide-react';

interface AlertHistoryTabProps {
  alerts: SafetyAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onClearAllAlerts: () => void;
  onAddCustomAlert: (type: AlertType, sector: SectorName, message: string) => void;
}

export default function AlertHistoryTab({
  alerts,
  onAcknowledgeAlert,
  onClearAllAlerts,
  onAddCustomAlert,
}: AlertHistoryTabProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [newAlertType, setNewAlertType] = useState<AlertType>('WARNING');
  const [newAlertSector, setNewAlertSector] = useState<SectorName>('ALPHA-1');
  const [newAlertMessage, setNewAlertMessage] = useState<string>('');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'ACTIVE') return !alert.acknowledged;
    if (filterType === 'CLEARED') return alert.acknowledged;
    return alert.type === filterType;
  });

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertMessage.trim()) return;
    onAddCustomAlert(newAlertType, newAlertSector, newAlertMessage);
    setNewAlertMessage('');
  };

  return (
    <div className="grid grid-cols-12 gap-6 w-full max-w-[1440px] mx-auto select-none font-mono">
      {/* HISTORICAL ALERT FEED ENGINE */}
      <div className="col-span-12 lg:col-span-8 bg-[#1f2020] border-2 border-[#4d4732] p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 border-b border-[#4d4732] pb-4 mb-4">
          <div>
            <h3 className="text-xs font-black text-[#ffd700] uppercase tracking-wider">
              OPERATIONAL ALERTS HISTORY LOG
            </h3>
            <span className="text-[10px] text-[#d0c6ab] tracking-wider uppercase">Audit Ledger ({filteredAlerts.length} Entries)</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onClearAllAlerts}
              className="text-[10px] border border-red-900/50 px-2.5 py-1.5 bg-[#93000a] text-white hover:bg-red-900 transition-colors cursor-pointer uppercase flex items-center gap-1 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Log
            </button>
          </div>
        </div>

        {/* Filtering buttons */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['ALL', 'ACTIVE', 'CLEARED', 'ROUTINE', 'MAINTENANCE', 'WARNING', 'EMERGENCY'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`text-[9px] font-bold border px-2.5 py-1 uppercase cursor-pointer ${
                filterType === f
                  ? 'bg-orange-600 border-orange-500 text-white font-black'
                  : 'bg-[#131313] border-[#4d4732] text-[#d0c6ab] hover:border-[#ffd700]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Alerts table list container */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredAlerts.length === 0 ? (
            <div className="py-16 text-center text-[#d0c6ab] italic text-xs border border-dashed border-[#4d4732] bg-[#1a1a1a]">
              "No safety alarm files matched the filtering requirements."
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isEmergency = alert.type === 'EMERGENCY';
              const isWarning = alert.type === 'WARNING';
              const isMaint = alert.type === 'MAINTENANCE';

              return (
                <div
                  key={alert.id}
                  className={`p-4 border-2 flex justify-between items-center ${
                    alert.acknowledged
                      ? 'bg-[#131313]/60 border-[#4d4732]/40 opacity-60'
                      : isEmergency
                        ? 'bg-[#93000a]/10 border-red-500 warning-glow'
                        : isWarning
                          ? 'bg-orange-950/10 border-orange-500'
                          : isMaint
                            ? 'bg-neutral-900 border-yellow-500/50'
                            : 'bg-neutral-900 border-[#4d4732]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 border uppercase ${
                          alert.acknowledged
                            ? 'bg-slate-900 text-[#d0c6ab] border-[#4d4732]'
                            : isEmergency
                              ? 'bg-red-600 text-white border-red-500'
                              : isWarning
                                ? 'bg-orange-500 text-white border-orange-400'
                                : 'bg-[#1b1c1c] text-[#ffd700] border-[#4d4732]'
                        }`}
                      >
                        {alert.type} • {alert.sector}
                      </span>
                      <span className="text-[10px] text-[#d0c6ab] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#e4e2e1] leading-relaxed pr-6">{alert.message}</p>
                  </div>

                  {!alert.acknowledged ? (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="text-[9px] font-bold bg-[#131313] hover:bg-neutral-950 text-[#ffd700] border border-[#4d4732] px-3 py-1.5 uppercase tracking-wide cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#00FF41]" />
                      Clear
                    </button>
                  ) : (
                    <span className="text-[#00FF41] text-[9px] font-bold flex items-center gap-1 uppercase shrink-0">
                      ✓ CLEARED
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* OPERATOR MANUAL MEMO REPORT PANEL */}
      <div className="col-span-12 lg:col-span-4 bg-[#1f2020] border-2 border-[#4d4732] p-5 h-fit">
        <div className="border-b border-[#4d4732] pb-3 mb-4 flex gap-2 items-center text-[#ffd700] uppercase text-xs font-black">
          <Newspaper className="w-4 h-4 text-orange-500" />
          <span>OPERATOR SECTOR SIGNAL OVERRIDE</span>
        </div>

        <p className="text-[11px] text-[#d0c6ab] leading-relaxed mb-4">
          Manually register a safety event or geological check-up report to broadcast alerts immediately to other active bridge dashboards.
        </p>

        <form onSubmit={handleSubmitCustom} className="space-y-4">
          <div>
            <label className="text-[9px] text-[#ffd700] uppercase block mb-1">Signal Severity</label>
            <select
              value={newAlertType}
              onChange={(e) => setNewAlertType(e.target.value as AlertType)}
              className="w-full bg-[#131313] text-[#fff6df] border border-[#4d4732] px-3 py-2 text-xs focus:outline-none focus:border-[#ffd700] cursor-pointer"
            >
              <option value="ROUTINE">ROUTINE CHECKS</option>
              <option value="MAINTENANCE">MAINTENANCE REPORT</option>
              <option value="WARNING">STABILITY WARNING</option>
              <option value="EMERGENCY">CRITICAL EMERGENCY</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] text-[#ffd700] uppercase block mb-1">Target Sector Coordinate</label>
            <select
              value={newAlertSector}
              onChange={(e) => setNewAlertSector(e.target.value as SectorName)}
              className="w-full bg-[#131313] text-[#fff6df] border border-[#4d4732] px-3 py-2 text-xs focus:outline-none focus:border-[#ffd700] cursor-pointer"
            >
              <option value="ALPHA-1">ALPHA-1 (PIT WEST)</option>
              <option value="ALPHA-2">ALPHA-2 (BENCH LEVEL 3)</option>
              <option value="BETA-1">BETA-1 (RAMP ENTRY)</option>
              <option value="BETA-2">BETA-2 (STABLE STORAGE)</option>
              <option value="DELTA-4">DELTA-4 (NIGHT EXTRACTION)</option>
              <option value="OVERALL">OVERALL SENSOR GRID</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] text-[#ffd700] uppercase block mb-1">Broadcast message</label>
            <textarea
              value={newAlertMessage}
              onChange={(e) => setNewAlertMessage(e.target.value)}
              placeholder="Describe observation e.g. Loose rock boulders detected on west rim shelf..."
              rows={4}
              className="w-full bg-[#131313] text-[#fff6df] border border-[#4d4732] px-3 py-2 text-xs focus:outline-none focus:border-[#ffd700] placeholder-gray-600 block resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 uppercase text-xs tracking-wider flex items-center justify-center gap-1.5 active:scale-98 transition-transform cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Broadcast Hazard Alert
          </button>
        </form>
      </div>
    </div>
  );
}
