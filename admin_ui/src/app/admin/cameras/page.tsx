"use client";

import React, { useState, useEffect } from "react";
import { Camera } from "@/types/camera";
import CameraTable from "@/components/admin/CameraTable";
import CameraFormDialog from "@/components/admin/CameraFormDialog";
import UpdateCameraPositionDialog from "@/components/admin/UpdateCameraPositionDialog";
import { Button } from "@/components/ui/button";
import {
  getCameras,
  createCamera,
  updateCamera,
  deleteCamera,
  updateCameraPosition,
} from "@/apis/cameraApi";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AdminCamerasPage: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [filteredCameras, setFilteredCameras] = useState<Camera[]>([]);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [openMapDialog, setOpenMapDialog] = useState(false);

  const fetchCameras = async () => {
    try {
      const data = await getCameras();
      setCameras(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách camera:", error);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  useEffect(() => {
    if (showOnlyActive) {
      setFilteredCameras(cameras.filter(camera => camera.CamStatus === "UP"));
    } else {
      setFilteredCameras(cameras);
    }
  }, [cameras, showOnlyActive]);

  const activeCount = cameras.filter(camera => camera.CamStatus === "UP").length;
  const totalCount = cameras.length;

  const handleSaveCamera = async (camera: Camera) => {
    try {
      if (editingCamera) {
        await updateCamera(camera._id, camera);
      } else {
        await createCamera(camera);
      }
      await fetchCameras();
      setOpenDialog(false);
      setEditingCamera(null);
    } catch (error) {
      console.error("Lỗi khi lưu camera:", error);
    }
  };

  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera);
    setOpenDialog(true);
  };

  const handleDeleteCamera = async (cameraId: string) => {
    try {
      await deleteCamera(cameraId);
      await fetchCameras();
    } catch (error) {
      console.error("Lỗi khi xóa camera:", error);
    }
  };

  const handleUpdatePosition = (camera: Camera) => {
    setSelectedCamera(camera);
    setOpenMapDialog(true);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-950 p-4 sm:p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
        <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white">
              Quản lý Camera
            </h1>
            <div className="text-sm text-slate-500 mt-1">
              <Badge variant="outline" className="mr-2 bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                {activeCount} đang hoạt động
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
                {totalCount - activeCount} không hoạt động
              </Badge>
            </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="active-filter" 
              checked={showOnlyActive} 
              onCheckedChange={setShowOnlyActive}
            />
            <Label htmlFor="active-filter">Chỉ hiển thị camera đang hoạt động</Label>
          </div>
          <Button
            onClick={() => {
              setEditingCamera(null);
              setOpenDialog(true);
            }}
          >
            Thêm Camera
          </Button>
        </div>
      </div>

      <CameraTable
        cameras={filteredCameras}
        onEditCamera={handleEditCamera}
        onDeleteCamera={handleDeleteCamera}
        onUpdatePosition={handleUpdatePosition}
      />

      <CameraFormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingCamera(null);
        }}
        onSave={handleSaveCamera}
        initialData={editingCamera || undefined}
      />

      <UpdateCameraPositionDialog
        open={openMapDialog}
        camera={selectedCamera}
        onClose={() => setOpenMapDialog(false)}
        onSave={async (lat: number, lng: number) => {
          if (selectedCamera) {
            await updateCameraPosition(selectedCamera._id, lat, lng);
            await fetchCameras();
            setOpenMapDialog(false);
          }
        }}
      />
    </div>
  );
};

export default AdminCamerasPage;