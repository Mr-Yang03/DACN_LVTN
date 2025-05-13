// "use client";

// import React, { useState, useEffect } from "react";
// import { Camera } from "@/types/camera";
// import CameraTable from "@/components/admin/CameraTable";
// import CameraFormDialog from "@/components/admin/CameraFormDialog";
// import { Button } from "@/components/ui/button";
// import {
//   getCameras,
//   createCamera,
//   updateCamera,
//   deleteCamera,
// } from "@/apis/cameraApi";

// const AdminCamerasPage: React.FC = () => {
//   const [cameras, setCameras] = useState<Camera[]>([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editingCamera, setEditingCamera] = useState<Camera | null>(null);

//   const fetchCameras = async () => {
//     try {
//       const data = await getCameras();
//       setCameras(data);
//     } catch (error) {
//       console.error("Lỗi khi tải danh sách camera:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCameras();
//   }, []);

//   const handleSaveCamera = async (camera: Camera) => {
//     try {
//       if (editingCamera) {
//         await updateCamera(camera._id, camera);
//       } else {
//         await createCamera(camera);
//       }
//       await fetchCameras();
//       setOpenDialog(false);
//       setEditingCamera(null);
//     } catch (error) {
//       console.error("Lỗi khi lưu camera:", error);
//     }
//   };

//   const handleEditCamera = (camera: Camera) => {
//     setEditingCamera(camera);
//     setOpenDialog(true);
//   };

//   const handleDeleteCamera = async (cameraId: string) => {
//     try {
//       await deleteCamera(cameraId);
//       await fetchCameras();
//     } catch (error) {
//       console.error("Lỗi khi xóa camera:", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Quản lý Camera</h1>
//         <Button
//           onClick={() => {
//             setEditingCamera(null);
//             setOpenDialog(true);
//           }}
//         >
//           Thêm Camera
//         </Button>
//       </div>

//       <CameraTable
//         cameras={cameras}
//         onEditCamera={handleEditCamera}
//         onDeleteCamera={handleDeleteCamera}
//       />

//       <CameraFormDialog
//         open={openDialog}
//         onClose={() => {
//           setOpenDialog(false);
//           setEditingCamera(null);
//         }}
//         onSave={handleSaveCamera}
//         initialData={editingCamera || undefined}
//       />
//     </div>
//   );
// };

// export default AdminCamerasPage;
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

const AdminCamerasPage: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Camera</h1>
        <Button
          onClick={() => {
            setEditingCamera(null);
            setOpenDialog(true);
          }}
        >
          Thêm Camera
        </Button>
      </div>

      <CameraTable
        cameras={cameras}
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
        onSave={async (lat, lng) => {
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