// // import axios from "axios";
// import { api } from "./axiosInstance";
// import { Camera } from "@/types/camera";

// export async function getCameras() {
//   const response = await api.get("/api/cameras");
//   return response.data;
// }

// export async function deleteCamera(id: string) {
//   return await api.delete(`/api/cameras/${id}`);
// }

// export async function updateCameraPosition(id: string, lat: number, lng: number) {
//   await api.put(`/api/cameras/${id}`, {
//     location: { type: "Point", coordinates: [lng, lat] },
//   });
// }

// export async function createCamera(camera: Omit<Camera, "_id" | "CreatedDate" | "ModifiedDate">) {
//   const response = await api.post("/api/cameras", camera);
//   return response.data;
// }

// export async function updateCamera(id: string, updatedData: Partial<Camera>) {
//   const response = await api.put(`/api/cameras/${id}`, updatedData);
//   return response.data;
// }

import { api } from "./axiosInstance"
import { Camera } from "@/types/camera"

// GET: Danh sách camera
export async function getCameras(): Promise<Camera[]> {
  const response = await api.get("/api/cameras")
  return response.data.data
}

// DELETE: Xoá camera theo ID
export async function deleteCamera(id: string) {
  return await api.delete(`/api/cameras/${id}`)
}

// PUT: Cập nhật vị trí camera (lat/lng)
// export async function updateCameraPosition(id: string, lat: number, lng: number) {
//   const formData = new URLSearchParams()
//   formData.append("lat", lat.toString())
//   formData.append("lng", lng.toString())

//   return await api.post(`/api/cameras/${id}/position`, formData, {
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//   })
// }

// POST: Tạo camera mới (bỏ _id, CreatedDate, ModifiedDate)
export async function createCamera(camera: Omit<Camera, "_id" | "CreatedDate" | "ModifiedDate">) {
  const response = await api.post("/api/cameras", camera)
  return response.data
}

// PUT: Cập nhật thông tin camera (toàn phần hoặc partial)
export async function updateCamera(id: string, updatedData: Partial<Camera>) {
  const response = await api.put(`/api/cameras/${id}`, updatedData)
  return response.data
}

export async function updateCameraPosition(id: string, lat: number, lng: number) {
  const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString() });

  return await api.post(`/api/cameras/${id}/position?${params.toString()}`);
}

