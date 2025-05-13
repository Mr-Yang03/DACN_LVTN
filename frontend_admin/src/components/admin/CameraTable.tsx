"use client";

import React, { useState, useEffect } from "react";
import { Camera } from "@/types/camera";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Camera as CameraIcon, Edit, Trash2, ArrowUpDown, MapPin } from "lucide-react";
import Image from "next/image";

interface CameraTableProps {
  cameras: Camera[];
  onEditCamera: (camera: Camera) => void;
  onDeleteCamera: (cameraId: string) => void;
  onUpdatePosition: (camera: Camera) => void;
}

type SortField = "DisplayName" | "District" | null;

const CameraTable: React.FC<CameraTableProps> = ({ cameras, onEditCamera, onDeleteCamera, onUpdatePosition }) => {
  const [searchName, setSearchName] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const pageSize = 8;

  const filteredCameras = cameras
    .filter((camera) =>
      camera.DisplayName?.toLowerCase().includes(searchName.toLowerCase())
    )
    .filter((camera) =>
      camera.District?.toLowerCase().includes(searchDistrict.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const totalPages = Math.ceil(filteredCameras.length / pageSize);
  const paginatedCameras = filteredCameras.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => setCurrentPage(1), [searchName, searchDistrict]);

  useEffect(() => {
    if (selectedCamera && selectedCamera.SnapshotUrl) {
      const interval = setInterval(() => {
        setSnapshotUrl(`http://camera.thongtingiaothong.vn/api/snapshot/${selectedCamera._id}?t=${Date.now()}`);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [selectedCamera]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>Danh sách Camera</CardTitle>
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            placeholder="Tìm theo tên hiển thị..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="max-w-sm"
          />
          <Input
            placeholder="Tìm theo quận..."
            value={searchDistrict}
            onChange={(e) => setSearchDistrict(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center py-2 px-4 border-b text-center cursor-pointer" style={{ width: "35%" }} onClick={() => handleSort("DisplayName")}>
                  Tên hiển thị <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead className="text-center py-2 px-4 border-b text-center cursor-pointer" style={{ width: "25%" }} onClick={() => handleSort("District")}>
                  Quận <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead className="text-center py-2 px-4 border-b text-center" style={{ width: "10%" }}>Trạng thái</TableHead>
                <TableHead className="text-center py-2 px-4 border-b text-center" style={{ width: "30%" }}> </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedCameras.length > 0 ? (
                paginatedCameras.map((camera) => (
                  <TableRow key={camera._id}>
                    <TableCell className="text-center py-2 px-4 border-b text-center max-w-[200px] truncate" style={{ width: "35%" }}>{camera.DisplayName || "Chưa có tên"}</TableCell>
                    <TableCell className="text-center py-2 px-4 border-b text-center" style={{ width: "25%" }}>{camera.District || "Chưa có quận"}</TableCell>
                    <TableCell className="text-center py-2 px-4 border-b text-center" style={{ width: "10%" }}>
                      {camera.CamStatus === "UP" ? <span className="text-green-600">✅</span> : <span className="text-red-600">❌</span>}
                    </TableCell>
                    <TableCell className="text-center py-2 px-4 border-b text-center space-x-2" style={{ width: "30%" }}>
                      <Button variant="outline" onClick={() => {
                        setSelectedCamera(camera);
                        setSnapshotUrl(`http://camera.thongtingiaothong.vn/api/snapshot/${camera._id}?t=${Date.now()}`);
                      }}>
                        <CameraIcon size={16} />
                      </Button>
                      <Button variant="outline" onClick={() => onEditCamera(camera)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline" className="text-red-600" onClick={() => {
                        if (confirm("Bạn có chắc muốn xoá camera này?")) {
                          onDeleteCamera(camera._id);
                        }
                      }}>
                        <Trash2 size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onUpdatePosition(camera)}>
                        <MapPin size={16} />
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Trước</Button>
            <span className="text-sm text-muted-foreground">Trang {currentPage} / {totalPages}</span>
            <Button variant="outline" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Tiếp</Button>
          </div>
        )}
      </CardContent>

      {/* Dialog hiển thị ảnh */}
      {selectedCamera && (
        <Dialog open={!!selectedCamera} onOpenChange={(open) => !open && setSelectedCamera(null)}>
          <DialogContent className="max-w-[100vh] max-h-[100vh] overflow-y-auto bg-white text-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">{selectedCamera.DisplayName}</DialogTitle>
              <DialogDescription className="text-center text-gray-500">
                Camera giao thông - cập nhật mỗi 15 giây
              </DialogDescription>
            </DialogHeader>
            {snapshotUrl ? (
              <div className="relative w-full h-[380px]">
                <Image
                  src={snapshotUrl}
                  alt={selectedCamera.DisplayName || "Camera"}
                  fill
                  className="object-contain rounded-lg mt-4"
                />
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-4">Camera hiện không hoạt động</p>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default CameraTable;
