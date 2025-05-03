"use client";

import { useEffect, useState } from "react";
import CameraTable from "@/components/admin/CameraTable";
import CameraFormDialog from "@/components/admin/CameraFormDialog";
import { getCameras, deleteCamera, updateCamera, createCamera } from "@/apis/cameraApi";
import { Camera } from "@/types/camera";

export default function CameraManagementPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);

  // Fetch list khi trang load
  useEffect(() => {
    fetchCameras();
  }, []); // Lấy danh sách camera khi trang load

  const fetchCameras = async () => {
    try {
      const data = await getCameras();
      setCameras(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách camera:", err);
    }
  };

  // Thêm hoặc cập nhật camera
  const handleSaveCamera = async (camera: Camera) => {
    try {
      if (editingCamera) {
        // Cập nhật camera
        const updated = await updateCamera(camera._id, camera);
        setCameras((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c)) // Cập nhật camera trong state
        );
      } else {
        // Tạo camera mới
        const created = await createCamera(camera);
        setCameras((prev) => [...prev, created]); // Thêm camera vào danh sách
      }
      setOpenForm(false);
      setEditingCamera(null); // Reset camera đang chỉnh sửa
    } catch (err) {
      console.error("Lỗi khi lưu camera:", err);
    }
  };

  // Chọn camera để chỉnh sửa
  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera);  // Lưu camera cần chỉnh sửa
    setOpenForm(true);  // Mở form chỉnh sửa
  };

  // Xoá camera
  const handleDeleteCamera = async (cameraId: string) => {
    try {
      await deleteCamera(cameraId); // Gọi API xoá camera
      setCameras((prev) => prev.filter((c) => c._id !== cameraId)); // Cập nhật lại danh sách camera
    } catch (err) {
      alert("Xoá thất bại!");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Quản lý Camera</h1>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => {
            setEditingCamera(null);  // Reset camera đang chỉnh sửa
            setOpenForm(true);  // Mở form thêm camera mới
          }}
        >
          Thêm Camera
        </button>
      </div>

      <CameraTable
        cameras={cameras}
        onEditCamera={handleEditCamera}
        onDeleteCamera={handleDeleteCamera}
      />

      {openForm && (
        <CameraFormDialog
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setEditingCamera(null);  // Reset camera khi đóng form
          }}
          onSave={handleSaveCamera}
          initialData={editingCamera || undefined}  // Truyền dữ liệu camera nếu đang chỉnh sửa
        />
      )}
    </div>
  );
}
