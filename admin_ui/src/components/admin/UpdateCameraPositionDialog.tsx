
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Camera } from "@/types/camera";
import { useGoogleMapsScript } from "@/lib/google-maps-loader";

interface UpdateCameraPositionDialogProps {
  open: boolean;
  camera: Camera | null;
  onClose: () => void;
  onSave: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: "100%",
  height: "480px",
};

export default function UpdateCameraPositionDialog({
  open,
  camera,
  onClose,
  onSave,
}: UpdateCameraPositionDialogProps) {
  const { isLoaded } = useGoogleMapsScript();

  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);

  // Đồng bộ vị trí khi mở dialog hoặc khi camera thay đổi
  useEffect(() => {
    if (camera?.Location?.coordinates?.length === 2) {
      const newLat = camera.Location.coordinates[1];
      const newLng = camera.Location.coordinates[0];
      setLat(newLat);
      setLng(newLng);
      setPosition({ lat: newLat, lng: newLng });
    }
  }, [camera, open]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setLat(newPos.lat);
      setLng(newPos.lng);
      setPosition(newPos);
    }
  };

  const handleLatLngChange = () => {
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition({ lat, lng });
    }
  };

  if (!isLoaded || !camera) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Cập nhật vị trí camera: {camera.Title}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mt-2 mb-2">
          <Input
            type="number"
            value={lat}
            step="0.000001"
            onChange={(e) => setLat(parseFloat(e.target.value))}
            onBlur={handleLatLngChange}
            placeholder="Latitude"
            className="w-full"
          />
          <Input
            type="number"
            value={lng}
            step="0.000001"
            onChange={(e) => setLng(parseFloat(e.target.value))}
            onBlur={handleLatLngChange}
            placeholder="Longitude"
            className="w-full"
          />
        </div>

        <div className="w-full h-[480px]">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position || { lat: 10.762622, lng: 106.660172 }}
            zoom={15}
            onClick={handleMapClick}
          >
            {position && <Marker position={position} draggable onDragEnd={handleMapClick} />}
          </GoogleMap>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button onClick={() => onSave(lat, lng)} disabled={isNaN(lat) || isNaN(lng)}>
            Lưu vị trí
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
