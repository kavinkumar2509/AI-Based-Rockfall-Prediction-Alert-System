export type AlertType = 'ROUTINE' | 'MAINTENANCE' | 'WARNING' | 'EMERGENCY';
export type SectorName = 'ALPHA-1' | 'ALPHA-2' | 'BETA-1' | 'BETA-2' | 'DELTA-4' | 'OVERALL';

export interface SafetyAlert {
  id: string;
  timestamp: string;
  type: AlertType;
  sector: SectorName;
  message: string;
  acknowledged: boolean;
}

export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'ONLINE' | 'STANDBY' | 'FAULT';
  threshold: number;
  history: number[];
}

export interface HudMarker {
  id: string;
  label: string;
  name: string;
  top: string;
  left: string;
  telemetry: {
    vibration: number;
    slopeTilt: number;
    moisture: number;
    rainfall: number;
  };
  stability: 'STABLE_SEISMIC' | 'WARNING_DISPLACEMENT' | 'CRITICAL_MOVEMENT';
  surveillance: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  transmitters: string[];
}
