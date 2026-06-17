import React from 'react';
import { AlertTriangle, Activity as LucideActivity, Map as LucideMap, Radio, Settings as LucideSettings } from 'lucide-react';

type TabType = 'TACTICAL_MAP' | 'SENSOR_NETWORK' | 'AI_RISK' | 'ALERT_HISTORY' | 'SYSTEM_CONFIG';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadAlertsCount: number;
  uptimePercent: number;
}

export default function Sidebar({ activeTab, setActiveTab, unreadAlertsCount, uptimePercent }: SidebarProps) {
  const menuItems = [
    {
      id: 'TACTICAL_MAP' as TabType,
      label: 'Tactical Map',
      icon: LucideMap,
    },
    {
      id: 'SENSOR_NETWORK' as TabType,
      label: 'Sensor Network',
      icon: Radio,
    },
    {
      id: 'AI_RISK' as TabType,
      label: 'AI Risk Analytics',
      icon: LucideActivity,
    },
    {
      id: 'ALERT_HISTORY' as TabType,
      label: 'Alert History',
      icon: AlertTriangle,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
    },
    {
      id: 'SYSTEM_CONFIG' as TabType,
      label: 'System Config',
      icon: LucideSettings,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#0e0e0e] border-r-2 border-[#4d4732] flex flex-col pt-24 z-40 select-none">
      <div className="px-6 mb-4 mt-2">
        <h2 className="font-mono text-sm font-black text-orange-500 uppercase tracking-widest">
          OPERATIONS
        </h2>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5 px-3">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-3.5 border-l-4 transition-all duration-150 font-mono text-xs uppercase tracking-wide cursor-pointer text-left ${
                isActive
                  ? 'bg-orange-600 border-orange-500 text-white font-bold'
                  : 'text-[#d0c6ab] border-transparent hover:bg-[#1f2020] hover:text-[#e4e2e1]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#d0c6ab]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-[#93000a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm animate-pulse border border-red-500">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#4d4732]">
        <div className="bg-[#1f2020] p-4 border-2 border-[#4d4732]">
          <div className="font-mono text-[10px] text-[#d0c6ab] mb-2 uppercase tracking-wider flex justify-between">
            <span>Node Connectivity</span>
            <span className="text-[#00FF41]">● CONNECTED</span>
          </div>
          <div className="flex gap-1.5">
            {/* Visual network nodes active */}
            <div className={`h-1.5 flex-1 ${uptimePercent >= 20 ? 'bg-[#00FF41]' : 'bg-[#353535]'}`}></div>
            <div className={`h-1.5 flex-1 ${uptimePercent >= 40 ? 'bg-[#00FF41]' : 'bg-[#353535]'}`}></div>
            <div className={`h-1.5 flex-1 ${uptimePercent >= 60 ? 'bg-[#00FF41]' : 'bg-[#353535]'}`}></div>
            <div className={`h-1.5 flex-1 ${uptimePercent >= 80 ? 'bg-[#00FF41]' : 'bg-[#353535]'}`}></div>
            <div className={`h-1.5 flex-1 ${uptimePercent >= 95 ? 'bg-[#00FF41]' : 'bg-[#353535]'}`}></div>
          </div>
          <div className="font-mono text-xs font-bold text-[#ffd700] mt-3">
            {uptimePercent}% SYSTEM UPTIME
          </div>
          <div className="font-mono text-[10px] text-[#d0c6ab] mt-1 uppercase">
            6/7 TRANSMITTERS ACTIVE
          </div>
        </div>
      </div>
    </aside>
  );
}
