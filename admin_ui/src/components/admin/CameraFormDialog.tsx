
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "@/types/camera";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMapsScript } from "@/lib/google-maps-loader";

interface CameraFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (camera: Camera) => void;
  initialData?: Camera;
}

const CameraFormDialog: React.FC<CameraFormDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const { isLoaded } = useGoogleMapsScript();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [camStatus, setCamStatus] = useState("UP");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [angle, setAngle] = useState(0);
  const [managementUnit, setManagementUnit] = useState("");
  const [district, setDistrict] = useState("");
  const [snapshotUrl, setSnapshotUrl] = useState("");
  const [ptz, setPtz] = useState(false);
  const [camType, setCamType] = useState("");
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.Title || "");
      setCode(initialData.Code || "");
      setDisplayName(initialData.DisplayName || "");
      setCamStatus(initialData.CamStatus || "UP");
      setLatitude(initialData.Location?.coordinates[1] || 0);
      setLongitude(initialData.Location?.coordinates[0] || 0);
      setAngle(initialData.Angle || 0);
      setManagementUnit(initialData.ManagementUnit || "");
      setDistrict(initialData.District || "");
      setSnapshotUrl(initialData.SnapshotUrl || "");
      setPtz(initialData.PTZ === "True");
      setCamType(initialData.CamType || "");
    } else {
      setTitle("");
      setCode("");
      setDisplayName("");
      setCamStatus("UP");
      setLatitude(0);
      setLongitude(0);
      setAngle(0);
      setManagementUnit("");
      setDistrict("");
      setSnapshotUrl("");
      setPtz(false);
      setCamType("");
    }
  }, [initialData]);

  useEffect(() => {
    setPosition({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setPosition({ lat, lng });
        },
        (error) => {
          console.error("Lỗi định vị:", error);
          alert("Không thể lấy vị trí hiện tại.");
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị.");
    }
  };

  const handleSave = () => {
    const newCamera: Camera = {
      _id: initialData?._id || Date.now().toString(),
      Title: title,
      Code: code,
      Location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      SnapshotUrl: snapshotUrl || null,
      CamType: camType || "default_type",
      Publish: "True",
      ManagementUnit: managementUnit || null,
      CamStatus: camStatus,
      PTZ: ptz ? "True" : "False",
      Angle: angle,
      DisplayName: displayName,
      VideoUrl: null,
      VideoStreaming: 0,
      DataId: null,
      NodeId: "",
      Path: "",
      CreatedDate: initialData?.CreatedDate || new Date().toISOString(),
      ModifiedDate: new Date().toISOString(),
      DynamicProperties: initialData?.DynamicProperties || [],
      District: district || null,
    };

    onSave(newCamera);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>{initialData ? "Chỉnh sửa Camera" : "Thêm Camera"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Map bên trái */}
          {/* <div className="w-full md:w-3/5 min-h-[400px] aspect-[4/3] rounded-lg overflow-hidden"> */}
          <div className="w-full md:w-3/5 aspect-[4/3] min-h-[300px] md:min-h-[500px] rounded-lg overflow-hidden">

            {isLoaded && (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={position}
                zoom={15}
                onClick={(e) => {
                  if (e.latLng) {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setLatitude(lat);
                    setLongitude(lng);
                    setPosition({ lat, lng });
                  }
                }}
              >
                <Marker position={position} />
              </GoogleMap>
            )}
          </div>

          {/* Form bên phải */}
          <div className="w-full md:w-1/2 space-y-3">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
            <Input placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Input placeholder="Cam Status" value={camStatus} onChange={(e) => setCamStatus(e.target.value)} />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
              />
            </div>
            <Button type="button" onClick={handleGetCurrentLocation}>
              Lấy vị trí hiện tại
            </Button>
            <Input
              type="number"
              placeholder="Angle"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
            />
            <Input placeholder="Management Unit" value={managementUnit} onChange={(e) => setManagementUnit(e.target.value)} />
            <Input placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
            <Input placeholder="Snapshot URL" value={snapshotUrl} onChange={(e) => setSnapshotUrl(e.target.value)} />
            <Input placeholder="Cam Type" value={camType} onChange={(e) => setCamType(e.target.value)} />
            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={ptz} onChange={(e) => setPtz(e.target.checked)} />
              <label>PTZ (Camera xoay)</label>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CameraFormDialog;
