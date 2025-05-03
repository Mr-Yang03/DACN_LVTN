"use client";

import React, { useState, useEffect } from "react";
import { Camera } from "@/types/camera";
import CameraTable from "@/components/admin/CameraTable";
import CameraFormDialog from "@/components/admin/CameraFormDialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_CAMERA_API_URL || "http://localhost:8009/api/cameras";

const AdminCamerasPage: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);

  // Fetch danh sách camera khi trang load
  const fetchCameras = async () => {
    try {
      const response = await axios.get(API_URL);
      setCameras(response.data.data); // Phụ thuộc vào cấu trúc JSON trả về
    } catch (error) {
      console.error("Lỗi khi tải camera:", error);
    }
  };

  useEffect(() => {
    fetchCameras(); // Fetch danh sách camera khi trang load
  }, []);

  // Lưu camera mới hoặc cập nhật camera cũ
  // const handleSaveCamera = async (camera: Camera) => {
  //   try {
  //     if (editingCamera) {
  //       // Cập nhật camera
  //       const response = await axios.put(`${API_URL}/${camera._id}`, camera);
  //       // Fetch lại danh sách camera sau khi cập nhật
  //       fetchCameras(); // Gọi lại hàm fetch để lấy dữ liệu mới
  //     } else {
  //       // Tạo camera mới
  //       const response = await axios.post(API_URL, camera);
  //       // Fetch lại danh sách camera sau khi thêm mới
  //       fetchCameras(); // Gọi lại hàm fetch để lấy dữ liệu mới
  //     }
  //     setOpenDialog(false);
  //     setEditingCamera(null); // Reset camera đang chỉnh sửa
  //   } catch (error) {
  //     console.error("Lỗi khi lưu camera:", error);
  //   }
  // };
  const handleSaveCamera = async (camera: Camera) => {
    try {
      if (editingCamera) {
        // Cập nhật camera
        await axios.put(`${API_URL}/${camera._id}`, camera); // Không cần response
        fetchCameras(); // Gọi lại hàm fetch để lấy dữ liệu mới
      } else {
        // Tạo camera mới
        await axios.post(API_URL, camera); // Không cần response
        fetchCameras(); // Gọi lại hàm fetch để lấy dữ liệu mới
      }
      setOpenDialog(false);
      setEditingCamera(null); // Reset camera đang chỉnh sửa
    } catch (error) {
      console.error("Lỗi khi lưu camera:", error);
    }
  };
  

  // Sửa camera
  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera); // Lưu camera cần chỉnh sửa
    setOpenDialog(true); // Mở dialog để chỉnh sửa
  };

  // 🗑 Xoá camera
  const handleDeleteCamera = async (cameraId: string) => {
    try {
      await axios.delete(`${API_URL}/${cameraId}`); // Xoá camera từ API
      // Fetch lại danh sách camera sau khi xoá
      fetchCameras(); // Gọi lại hàm fetch để lấy dữ liệu mới
    } catch (error) {
      console.error("Lỗi khi xoá camera:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Camera</h1>
        <Button onClick={() => {
          setEditingCamera(null); // Reset camera đang chỉnh sửa
          setOpenDialog(true); // Mở dialog để thêm camera mới
        }}>
          Thêm Camera
        </Button>
      </div>

      <CameraTable
        cameras={cameras} // Truyền danh sách camera vào bảng
        onEditCamera={handleEditCamera} // Sự kiện chỉnh sửa camera
        onDeleteCamera={handleDeleteCamera} // Sự kiện xoá camera
      />

      <CameraFormDialog
        open={openDialog} // Trạng thái mở/đóng form
        onClose={() => {
          setOpenDialog(false); // Đóng dialog
          setEditingCamera(null); // Reset camera đang chỉnh sửa
        }}
        onSave={handleSaveCamera} // Lưu camera
        initialData={editingCamera || undefined} // Truyền dữ liệu camera đang chỉnh sửa nếu có
      />
    </div>
  );
};

export default AdminCamerasPage;

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

//   // Fetch danh sách camera khi trang load
//   const fetchCameras = async () => {
//     try {
//       const data = await getCameras();
//       setCameras(data.data); // adjust if your API returns differently
//     } catch (error) {
//       console.error("Lỗi khi tải camera:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCameras();
//   }, []);

//   // Lưu camera mới hoặc cập nhật camera cũ
//   const handleSaveCamera = async (camera: Camera) => {
//     try {
//       if (editingCamera) {
//         await updateCamera(camera._id, camera);
//       } else {
//         await createCamera(camera);
//       }
//       fetchCameras();
//       setOpenDialog(false);
//       setEditingCamera(null);
//     } catch (error) {
//       console.error("Lỗi khi lưu camera:", error);
//     }
//   };

//   // Sửa camera
//   const handleEditCamera = (camera: Camera) => {
//     setEditingCamera(camera);
//     setOpenDialog(true);
//   };

//   // Xoá camera
//   const handleDeleteCamera = async (cameraId: string) => {
//     try {
//       await deleteCamera(cameraId);
//       fetchCameras();
//     } catch (error) {
//       console.error("Lỗi khi xoá camera:", error);
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
