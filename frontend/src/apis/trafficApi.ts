import { api } from "./axiosInstance";

export interface TrafficParams {
  WSlat: number;
  WSlng: number;
  NElat: number;
  NElng: number;
  level?: number;
}

export const getTrafficStatus = async ({
  WSlat,
  WSlng,
  NElat,
  NElng,
  level = 0,
}: TrafficParams) => {
  const response = await api.get("/traffic/status", {
    params: {
      WSlat,
      WSlng,
      NElat,
      NElng,
      level,
    },
  });
  return response.data.data.features;
};

export const getCameras = async ({}) => {
  const response = await api.get("/traffic/camera");
  return response.data;
};

