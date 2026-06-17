import React from 'react';
import { Shield, RotateCcw, User, BellRing } from 'lucide-react';

interface HeaderProps {
  threatLevel: 'BETA' | 'DELTA' | 'CRITICAL';
  isSirenActive: boolean;
  onReset: () => void;
}

export default function Header({
  threatLevel,
  isSirenActive,
  onReset,
}: HeaderProps) {
  return (
    <header className="bg-[#1b1c1c] text-[#ffd700] border-b-2 border-[#4d4732] flex justify-between items-center px-6 lg:px-8 h-20 fixed top-0 left-0 right-0 z-50 select-none">
      <div className="flex items-center gap-4">
        <div
          className={`p-2.5 ${
            isSirenActive
              ? 'bg-[#93000a] text-white animate-pulse'
              : 'bg-[#1f2020] text-[#ffd700]'
          } border border-[#4d4732]`}
        >
          {isSirenActive ? (
            <BellRing className="w-8 h-8 animate-bounce text-red-500" />
          ) : (
            <Shield className="w-8 h-8 text-[#ffd700]" />
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="font-sans text-xl lg:text-2xl font-black tracking-tighter text-[#ffd700] uppercase leading-none">
            ROCKFALL COMMAND CENTER
          </h1>

          <span className="font-mono text-[10px] lg:text-xs text-[#d0c6ab] uppercase tracking-widest mt-1">
            OPEN-PIT MINE SAFETY MONITORING
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 bg-[#1f2020] px-2.5 py-1 text-xs border border-[#4d4732] font-mono">
            <span className="text-[#d0c6ab]">THREAT LEVEL:</span>

            <span
              className={`font-bold ${
                isSirenActive
                  ? 'text-red-500 animate-pulse'
                  : threatLevel === 'CRITICAL'
                  ? 'text-orange-500'
                  : 'text-[#ffd700]'
              }`}
            >
              {isSirenActive ? 'CRITICAL (SIREN)' : threatLevel}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isSirenActive
                  ? 'bg-red-500 animate-ping'
                  : 'bg-[#00FF41] animate-pulse'
              }`}
            ></div>

            <span className="font-mono text-[10px] text-[#d0c6ab] uppercase">
              {isSirenActive
                ? 'EMERGENCY OVERRIDE'
                : 'LIVE TELEMETRY SYNCED'}
            </span>
          </div>
        </div>

        <div className="hidden sm:block h-10 w-[2px] bg-[#4d4732]"></div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono hidden sm:block">
            <div className="text-xs text-semibold text-[#e4e2e1]">
              OPERATOR_ID: 882
            </div>

            <div className="flex gap-2 mt-1">
              <button
                onClick={onReset}
                className="text-[11px] text-red-400 uppercase cursor-pointer hover:underline"
              >
                Reset
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/';
                }}
                className="text-[11px] text-yellow-400 uppercase cursor-pointer hover:underline"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="w-10 h-10 border-2 border-[#4d4732] bg-[#353535] flex items-center justify-center text-white">
            <User className="w-5 h-5 text-[#d0c6ab]" />
          </div>
        </div>
      </div>
    </header>
  );
}