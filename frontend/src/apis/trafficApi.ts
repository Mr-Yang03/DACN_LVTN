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

