import { Marker } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";

interface Camera {
  Id: string;
  Title: string;
  DisplayName: string;
  SnapshotUrl: string | null;
  Location: {
    type: "Point";
    coordinates: [number, number];
  };
  Status: string;
}

interface CameraLayerProps {
  cameras: Camera[];
  showCamera: boolean;
  map: google.maps.Map | null;
}

const CameraLayer: React.FC<CameraLayerProps> = ({ cameras, showCamera }) => {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCamera) return;
    setSnapshotUrl(`http://camera.thongtingiaothong.vn/api/snapshot/${selectedCamera.Id}?t=${Date.now()}`);
    const interval = setInterval(() => {
      setSnapshotUrl(`http://camera.thongtingiaothong.vn/api/snapshot/${selectedCamera.Id}?t=${Date.now()}`);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedCamera]);

  return (
    <>
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open);
          if (!open) setSelectedCamera(null);
        }}
      >
        <DialogContent className="bg-white border-gray-200 text-gray-800 max-w-[100vh] max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {selectedCamera?.DisplayName}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Video camera giao thông - cập nhật mỗi 15s
            </DialogDescription>
          </DialogHeader>
          {snapshotUrl ? (
            <div className="relative w-100 h-[380px]">
              <Image
                src={snapshotUrl || "/placeholder.png"}
                alt={selectedCamera?.DisplayName || "Camera"}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
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
      {showCamera && cameras.map((camera, index) => (
        <Marker
          key={index}
          position={{
            lat: camera.Location.coordinates[1],
            lng: camera.Location.coordinates[0],
          }}
          icon={camera.Status === "active" ? {
            url: "/image/cctv_camera_active.png",
            scaledSize: new window.google.maps.Size(30, 30),
          } : {
            url: "/image/cctv_camera_inactive.png",
            scaledSize: new window.google.maps.Size(30, 30),
          }}
          title={camera.DisplayName}
          onClick={() => {
            setSelectedCamera(camera);
            setSnapshotUrl(`http://camera.thongtingiaothong.vn/api/snapshot/${camera.Id}?t=${Date.now()}`);
            setShowDialog(true);
          }}
        />
      ))}
    </>
  );
};

export default CameraLayer;
