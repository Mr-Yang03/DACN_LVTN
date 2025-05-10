"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "@/types/camera";

interface CameraFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (camera: Camera) => void;
  initialData?: Camera;
}

const CameraFormDialog: React.FC<CameraFormDialogProps> = ({ open, onClose, onSave, initialData }) => {
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
      // Reset fields if no initialData
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Chỉnh sửa Camera" : "Thêm Camera"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
          <Input placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <Input placeholder="Cam Status" value={camStatus} onChange={(e) => setCamStatus(e.target.value)} />
          <Input type="number" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(parseFloat(e.target.value))} />
          <Input type="number" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(parseFloat(e.target.value))} />
          <Input type="number" placeholder="Angle" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} />
          <Input placeholder="Management Unit" value={managementUnit} onChange={(e) => setManagementUnit(e.target.value)} />
          <Input placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
          <Input placeholder="Snapshot URL" value={snapshotUrl} onChange={(e) => setSnapshotUrl(e.target.value)} />
          <Input placeholder="Cam Type" value={camType} onChange={(e) => setCamType(e.target.value)} />
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={ptz} onChange={(e) => setPtz(e.target.checked)} />
            <label>PTZ (Camera xoay)</label>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CameraFormDialog;
