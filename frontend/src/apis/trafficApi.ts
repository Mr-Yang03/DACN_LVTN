import { api } from "./axiosInstance";


export interface RealTimeTrafficParams {
  lng: number;
  lat: number;
  start_time: string;
  end_time: string;
}

export const getRealTimeTrafficStatus = async ({
  lng,
  lat,
  start_time,
  end_time,
}: RealTimeTrafficParams) => {
  const response = await api.get("/traffic/status", {
    params: {
      lng,
      lat,
      start_time,
      end_time,
    },
  });
  return response.data;
};

export const getCameras = async ({}) => {
  const response = await api.get("/traffic/camera");
  return response.data;
};

// New function to get camera speed data
export interface CameraSpeedParams {
  cameraId: string;
  hours?: number; // Hours of data to retrieve (optional, defaults to 1 hour)
}

export const getCameraSpeedData = async ({ cameraId, hours = 1 }: CameraSpeedParams) => {
  // Calculate time range (from X hours ago until now)
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - (hours * 60 * 60 * 1000));
  
  const response = await api.get(`/traffic/camera/${cameraId}/speed`, {
    params: {
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    },
  });
  return response.data;
};

// Function to get vehicle type data (motorcycles, cars, trucks, buses)
export interface VehicleTypeParams {
  cameraId: string;
  hours?: number; // Hours of data to retrieve (optional, defaults to 1 hour)
}

export interface VehicleTypeData {
  totalVehicles: number;
  vehicleTypes: {
    motorcycle: {
      count: number;
      percentage: number;
    };
    car: {
      count: number;
      percentage: number;
    };
    truck: {
      count: number;
      percentage: number;
    };
    bus: {
      count: number;
      percentage: number;
    };
  };
  timestamp: string;
}

export const getVehicleTypeData = async ({ cameraId, hours = 1 }: VehicleTypeParams) => {
  // Calculate time range (from X hours ago until now)
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - (hours * 60 * 60 * 1000));
  
  const response = await api.get(`/traffic/camera/${cameraId}/vehicle-types`, {
    params: {
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    },
  });
  return response.data;
};

