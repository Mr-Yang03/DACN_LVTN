export interface Camera {
  id: string;
  name: string;
  status: "online" | "offline";
  location: {
    lat: number;
    lng: number;
  };
}

export interface VehicleTypeData {
  totalVehicles: number;
  vehicleTypes: {
    motorcycle: { count: number; percentage: number };
    car: { count: number; percentage: number };
    truck: { count: number; percentage: number };
    bus: { count: number; percentage: number };
  };
  isLoading: boolean;
}

export interface SpeedData {
  timestamps: string[];
  speeds: number[];
  vehicleCounts: number[];
  isLoading: boolean;
}

export interface AnalyticsData {
  totalVehicles: number;
  avgSpeed: number;
  congestionLevel: string;
  incidents: number;
  congestionPercent: number;
}

export interface TimeRange {
  hours: number;
  label: string;
}
