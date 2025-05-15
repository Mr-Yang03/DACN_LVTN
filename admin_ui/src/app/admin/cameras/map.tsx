"use client";

import { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { getCameras, updateCameraPosition } from "@/apis/cameraApi";
import { Camera } from "@/types/camera";
import { useGoogleMapsScript } from "@/lib/google-maps-loader";

export default function CameraMapEditor() {
  const { isLoaded } = useGoogleMapsScript();

  const [cameras, setCameras] = useState<Camera[]>([]);

  useEffect(() => {
    async function fetchCameras() {
      const data = await getCameras();
      setCameras(data);
    }
    fetchCameras();
  }, []);

  const handleMarkerDragEnd = async (cameraId: string, lat: number, lng: number) => {
    await updateCameraPosition(cameraId, lat, lng);
    alert("Đã cập nhật vị trí camera!");
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full h-screen">
      <GoogleMap
        center={{ lat: 10.7769, lng: 106.7009 }}
        zoom={12}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        {cameras.map((camera) => (
          <Marker
            key={camera._id}
            position={{
              lat: camera.Location.coordinates[1],
              lng: camera.Location.coordinates[0],
            }}
            draggable
            onDragEnd={(e) => {
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();
              if (lat !== undefined && lng !== undefined) {
                handleMarkerDragEnd(camera._id, lat, lng);
              }
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
