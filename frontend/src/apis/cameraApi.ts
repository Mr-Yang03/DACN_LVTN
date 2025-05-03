// import axios from "axios";
import { api } from "./axiosInstance";
import { Camera } from "@/types/camera";

export async function getCameras() {
  const response = await api.get("/api/cameras");
  return response.data;
}

export async function deleteCamera(id: string) {
  return await api.delete(`/api/cameras/${id}`);
}

export async function updateCameraPosition(id: string, lat: number, lng: number) {
  await api.put(`/api/cameras/${id}`, {
    location: { type: "Point", coordinates: [lng, lat] },
  });
}

export async function createCamera(camera: Omit<Camera, "_id" | "CreatedDate" | "ModifiedDate">) {
  const response = await api.post("/api/cameras", camera);
  return response.data;
}

export async function updateCamera(id: string, updatedData: Partial<Camera>) {
  const response = await api.put(`/api/cameras/${id}`, updatedData);
  return response.data;
}