
import { useState, useEffect } from "react";
import { SectorName } from "../types";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import TacticalMapTab from "../components/TacticalMapTab";
import SensorNetworkTab from "../components/SensorNetworkTab";
import AiRiskAnalyticsTab from "../components/AiRiskAnalyticsTab";
import AlertHistoryTab from "../components/AlertHistoryTab";
import SystemConfigTab from "../components/SystemConfigTab";
type TabType =
  | "TACTICAL_MAP"
  | "SENSOR_NETWORK"
  | "AI_RISK"
  | "ALERT_HISTORY"
  | "SYSTEM_CONFIG";
function Dashboard() {
 
  const [activeTab, setActiveTab] = useState<TabType>("TACTICAL_MAP");
   useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
    }
  }, []);
 const [telemetry, setTelemetry] = useState({
  vibration: 0.36,
  slopeTilt: 6.8,
  moisture: 22,
  rainfall: 0,
});
const [simulationMode, setSimulationMode] = useState(false);
const riskLevel =
  telemetry.vibration > 1.5 ||
  telemetry.slopeTilt > 18 ||
  telemetry.moisture > 60
    ? "CRITICAL"
    : telemetry.vibration > 1.0 ||
      telemetry.slopeTilt > 12 ||
      telemetry.moisture > 40
    ? "HIGH"
    : telemetry.vibration > 0.6
    ? "MEDIUM"
    : "LOW";
const [stats, setStats] = useState({
  totalReadings: 0,
  totalAlerts: 0,
  latestRisk: "LOW",
});
const [alerts, setAlerts] = useState<any[]>([]);
useEffect(() => {
  const fetchSensors = async () => {
    try {
      const response = await fetch("https://rockfall-backend-7qfn.onrender.com/sensors");
      const data = await response.json();

      setTelemetry(data);
    } catch (error) {
      console.error("Failed to fetch sensor data:", error);
    }
  };

  fetchSensors();

  const interval = setInterval(fetchSensors, 5000);

  return () => clearInterval(interval);
}, [simulationMode]);
useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch(
        "https://rockfall-backend-7qfn.onrender.com/dashboard-stats"
      );

      const data = await response.json();

      setStats(data);
    } catch (error) {
      console.error("Stats error:", error);
    }
  };

  fetchStats();
}, []);
useEffect(() => {
  const fetchAlerts = async () => {
    try {
      const response = await fetch(
        "https://rockfall-backend-7qfn.onrender.com/alerts"
      );

      const data = await response.json();

      setAlerts(data);
    } catch (error) {
      console.error("Alerts error:", error);
    }
  };

  fetchAlerts();

  const interval = setInterval(fetchAlerts, 5000);

  return () => clearInterval(interval);
}, []);
useEffect(() => {
  const interval = setInterval(() => {
    setTelemetry((prev) => ({
      vibration: +Math.max(
        0.1,
        Math.min(
          2.0,
          prev.vibration + (Math.random() - 0.5) * 0.15
        )
      ).toFixed(2),

      slopeTilt: +Math.max(
        4,
        Math.min(
          18,
          prev.slopeTilt + (Math.random() - 0.5) * 0.03
        )
      ).toFixed(2),

      moisture: Math.max(
        15,
        Math.min(
          60,
          prev.moisture + Math.round((Math.random() - 0.5) * 1)
        )
      ),

      rainfall: prev.rainfall,
    }));
  }, 3000);

  return () => clearInterval(interval);
}, []);
useEffect(() => {
  const rainInterval = setInterval(() => {
    setTelemetry((prev) => ({
      ...prev,
      rainfall:
        Math.random() > 0.85
          ? Math.floor(Math.random() * 12)
          : prev.rainfall,
    }));
  }, 30000);

  return () => clearInterval(rainInterval);
}, []);
const simulateRockfall = () => {
  setSimulationMode(true);

  setTelemetry({
    vibration: 1.8,
    slopeTilt: 18,
    moisture: 75,
    rainfall: 12,
  });
};
const resetTelemetry = () => {
  setSimulationMode(false);

  setTelemetry({
    vibration: 0.36,
    slopeTilt: 6.8,
    moisture: 22,
    rainfall: 0,
  });
};
  const [thresholds, setThresholds] = useState({
    vibration: 1.0,
    slopeTilt: 12,
    moisture: 40,
  });

  const [simulationSpeed, setSimulationSpeed] =
    useState<"OFF" | "1X" | "5X" | "10X">("1X");

  const [autoDiagnostics, setAutoDiagnostics] = useState(true);

  const sensorsData = [
  {
    id: "S1",
    name: "Vibration Sensor",
    value: telemetry.vibration,
    unit: "g",
    status: "ONLINE",
    threshold: thresholds.vibration,
    history: [0.2, 0.3, 0.4, 0.5, telemetry.vibration],
  },
];
 const markers = [
  {
    id: "01",
    label: "A1",
    name: "Sector Alpha-1",
    top: "35%",
    left: "30%",
    telemetry: {
      vibration: telemetry.vibration,
      slopeTilt: telemetry.slopeTilt,
      moisture: telemetry.moisture,
      rainfall: telemetry.rainfall,
    },
    stability: "STABLE_SEISMIC",
    surveillance: "NOMINAL",
    transmitters: ["TX1"],
  },

  {
    id: "02",
    label: "A2",
    name: "Sector Alpha-2",
    top: "45%",
    left: "60%",
    telemetry: {
      vibration: 0.42,
      slopeTilt: 7.1,
      moisture: 24,
      rainfall: 2,
    },
    stability: "STABLE_SEISMIC",
    surveillance: "NOMINAL",
    transmitters: ["TX2"],
  },

  {
    id: "03",
    label: "B1",
    name: "Sector Beta-1",
    top: "55%",
    left: "40%",
    telemetry: {
      vibration: 0.88,
      slopeTilt: 11.5,
      moisture: 35,
      rainfall: 4,
    },
    stability: "WARNING_DISPLACEMENT",
    surveillance: "WARNING",
    transmitters: ["TX3"],
  },

  {
    id: "04",
    label: "B2",
    name: "Sector Beta-2",
    top: "25%",
    left: "70%",
    telemetry: {
      vibration: 0.55,
      slopeTilt: 8.2,
      moisture: 28,
      rainfall: 1,
    },
    stability: "STABLE_SEISMIC",
    surveillance: "NOMINAL",
    transmitters: ["TX4"],
  },

  {
    id: "05",
    label: "D4",
    name: "Sector Delta-4",
    top: "70%",
    left: "75%",
    telemetry: {
      vibration: 1.3,
      slopeTilt: 15,
      moisture: 50,
      rainfall: 8,
    },
    stability: "CRITICAL_MOVEMENT",
    surveillance: "CRITICAL",
    transmitters: ["TX5"],
  },
];
const formattedAlerts = alerts.map((alert: any) => ({
  id: alert._id,
  timestamp: new Date(alert.timestamp).toLocaleTimeString(),

  type: (
    alert.type === "HIGH_MOISTURE"
      ? "EMERGENCY"
      : "WARNING"
  ) as any,

  sector: "ALPHA-1" as SectorName,

  message: alert.message,
  acknowledged: false,
}));
const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

  return (
    <div className="min-h-screen bg-[#131313] text-white">
      <Header
        threatLevel="DELTA"
        isSirenActive={false}
        onReset={() => alert("Reset App Data")}
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
       unreadAlertsCount={alerts.length}
        uptimePercent={95}
      />

     
        <main className="ml-72 pt-24 p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
  <div className="bg-gray-800 p-4 rounded">
    <h3 className="text-sm">Total Readings</h3>
    <p className="text-3xl font-bold">
      {stats.totalReadings}
    </p>
  </div>

  <div className="bg-gray-800 p-4 rounded">
    <h3 className="text-sm">Total Alerts</h3>
    <p className="text-3xl font-bold">
      {stats.totalAlerts}
    </p>
  </div>

  <div className="bg-gray-800 p-4 rounded">
    <h3 className="text-sm">Risk Level</h3>
  <p
  className={`text-3xl font-bold ${
    riskLevel === "CRITICAL"
      ? "text-red-500"
      : riskLevel === "HIGH"
      ? "text-orange-500"
      : riskLevel === "MEDIUM"
      ? "text-yellow-400"
      : "text-green-500"
  }`}
>
  {riskLevel}
</p>
  </div>
</div>

<div className="mb-4 flex gap-3">
  <button
    onClick={simulateRockfall}
    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-bold"
  >
    SIMULATE ROCKFALL
  </button>

  <button
    onClick={resetTelemetry}
    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-bold"
  >
    RESET MINE
  </button>
</div>
        {activeTab === "TACTICAL_MAP" && (
         <TacticalMapTab
  sensors={telemetry}
            alerts={[
              {
                id: "1",
                type: "WARNING",
                sector: "BETA-1",
                timestamp: "12:30",
                message: "Slope movement detected",
                acknowledged: false,
              },
              {
                id: "2",
                type: "EMERGENCY",
                sector: "DELTA-4",
                timestamp: "12:45",
                message: "Rockfall risk elevated",
                acknowledged: false,
              },
            ]}
            isSirenActive={false}
            onTriggerSiren={() => alert("Emergency Siren Activated")}
            onAcknowledgeAlert={(id) =>
              console.log("Acknowledged Alert:", id)
            }
          />
        )}

      {activeTab === "SENSOR_NETWORK" && (
  <SensorNetworkTab
    sensors={sensorsData as any}
    onToggleStatus={() => {}}
    onCalibrate={() => {}}
  />
)}
       {activeTab === "AI_RISK" && (
  <AiRiskAnalyticsTab
    markers={markers as any}
    isSirenActive={false}
  />
)}
      {activeTab === "ALERT_HISTORY" && (
  <AlertHistoryTab
    alerts={formattedAlerts}
    onAcknowledgeAlert={() => {}}
    onClearAllAlerts={() => {}}
    onAddCustomAlert={() => {}}
  />
)}
{activeTab === "SYSTEM_CONFIG" && (
  <SystemConfigTab
    thresholds={thresholds}
    simulationSpeed={simulationSpeed}
    isAutoDiagnosticsEnabled={autoDiagnostics}
    onUpdateThreshold={(key, value) =>
      setThresholds({
        ...thresholds,
        [key]: value,
      })
    }
    onUpdateSimSpeed={(speed) =>
      setSimulationSpeed(speed)
    }
    onToggleAutoDiag={() =>
      setAutoDiagnostics(!autoDiagnostics)
    }
  />
)}
      </main>
    </div>
  );
}

export default Dashboard;