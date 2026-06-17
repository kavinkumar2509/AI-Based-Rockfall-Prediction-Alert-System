export type SensorType = 'Inclinometer' | 'Seismic Geophone' | 'Extensometer' | 'Radar Ranger' | 'Rain Gauge';
export type SectorName = 'North Crest' | 'West Wall' | 'East Ramp' | 'South Crest';
export type SensorStatus = 'ONLINE' | 'WARNING' | 'OFFLINE';
export type LogType = 'INFO' | 'WARNING' | 'ALERT' | 'AI_REPORT';

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  sector: SectorName;
  status: SensorStatus;
  battery: number;
  reading: number;
  unit: string;
  lastUpdate: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  sector?: SectorName | string;
  type: LogType;
  message: string;
}

export interface GeotechnicalReport {
  statusLevel: 'OPTIMAL' | 'EVALUATE' | 'CRITICAL_ALERT';
  hazardIndex: number;
  analysis: string;
  remediation: string[];
  evacuationZones: string[];
  safetyMessage: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface SectorMetrics {
  name: SectorName;
  tremor: number; // Gs
  rainfall: number; // mm/hr
  displacement: number; // mm/hr
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}
