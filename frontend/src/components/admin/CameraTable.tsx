"use client";

import React, { useState, useEffect } from "react";
import { Camera } from "@/types/camera";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Camera as CameraIcon, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

interface CameraTableProps {
  cameras: Camera[];
  onEditCamera: (camera: Camera) => void;
  onDeleteCamera: (cameraId: string) => void; // 🆕 thêm prop mới
}

const CameraTable: React.FC<CameraTableProps> = ({ cameras, onEditCamera, onDeleteCamera }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const pageSize = 8;

  // const filteredCameras = cameras.filter(camera =>
  //   camera.DisplayName?.toLowerCase().includes(search.toLowerCase())
  // );
  const filteredCameras = cameras.filter(camera =>
    camera.DisplayName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCameras.length / pageSize);
  const paginatedCameras = filteredCameras.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => setCurrentPage(1), [search]);

  useEffect(() => {
    if (selectedCamera && selectedCamera.SnapshotUrl) {
      const interval = setInterval(() => {
        setSnapshotUrl(`http://camera.thongtingiaothong.vn/api/snapshot/${selectedCamera._id}?t=${Date.now()}`);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [selectedCamera]);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>Danh sách Camera</CardTitle>
        <Input
          placeholder="Tìm kiếm theo tên hiển thị..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center py-2 px-4 border-b text-center max-w-[200px] truncate" style={{ width: "40%" }}>Tên hiển thị</TableHead>
                <TableHead className="text-center py-2 px-4 border-b text-center" style={{ width: "25%" }}>Quận</TableHead>
                <TableHead className="text-center py-2 px-4 border-b text-center" style={{ width: "10%" }}>Trạng thái</TableHead>
                <TableHead className="text-center py-2 px-4 border-b text-center" style={{ width: "25%" }}>Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedCameras.length > 0 ? (
                paginatedCameras.map((camera) => (
                  <TableRow key={camera._id}>
                    <TableCell className="text-center py-2 px-4 border-b text-center max-w-[200px] truncate" style={{ width: "40%" }}>{camera.DisplayName || "Chưa có tên"}</TableCell>
                    <TableCell className="text-center py-2 px-4 border-b text-center" style={{ width: "25%" }}>{camera.District || "Chưa có quận"}</TableCell>
                    <TableCell className="text-center py-2 px-4 border-b text-center" style={{ width: "10%" }}>
                      {camera.CamStatus === "UP" ? <span className="text-green-600">✅</span> : <span className="text-red-600">❌</span>}
                    </TableCell>
                    <TableCell className="text-center space-x-2 py-2 px-4 border-b text-center" style={{ width: "25%" }}>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCamera(camera);
                          setSnapshotUrl(`http://camera.thongtingiaothong.vn/api/snapshot/${camera._id}?t=${Date.now()}`);
                        }}
                      >
                        <CameraIcon size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onEditCamera(camera)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (confirm("Bạn có chắc chắn muốn xoá camera này?")) {
                            onDeleteCamera(camera._id);
                          }
                        }}
                        className="text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                    Không tìm thấy camera phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Trước</Button>
            <span className="text-sm text-muted-foreground">Trang {currentPage} / {totalPages}</span>
            <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Tiếp</Button>
          </div>
        )}
      </CardContent>

      {selectedCamera && (
        <Dialog open={!!selectedCamera} onOpenChange={(open) => !open && setSelectedCamera(null)}>
          <DialogContent className="bg-white border-gray-200 text-gray-800 max-w-[100vh] max-h-[100vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                {selectedCamera.DisplayName}
              </DialogTitle>
              <DialogDescription className="text-center text-gray-500">
                Camera giao thông - cập nhật mỗi 15s
              </DialogDescription>
            </DialogHeader>
            {snapshotUrl ? (
              <div className="relative w-100 h-[380px]">
                <Image
                  src={snapshotUrl}
                  alt={selectedCamera.DisplayName || "Camera"}
                  fill
                  className="object-contain rounded-lg mt-4"
                />
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-4">
                Camera hiện không hoạt động
              </p>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default CameraTable;