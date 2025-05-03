"use client";

import { useEffect, useState, useCallback } from "react";
import { useLoadScript, GoogleMap, Marker, TrafficLayer } from "@react-google-maps/api";
import { getCameras, getTrafficStatus } from "@/apis/trafficApi";
import { MapPin, Layers, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

interface Camera {
  Id: string;
  Title: string;
  DisplayName: string;
  SnapshotUrl: string | null;
  Location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface TrafficMapViewProps {
  selectedCameraId?: number;
  onCameraSelect?: (cameraId: number, name: string) => void;
  showTrafficFlow?: boolean;
}

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

const TrafficMapView = ({ selectedCameraId, onCameraSelect, showTrafficFlow = true }: TrafficMapViewProps) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 10.7731, lng: 106.7024 }); // Default center (HCM City)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [showTraffic, setShowTraffic] = useState(showTrafficFlow);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  
  // Load Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries,
  });

  // Fetch cameras
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setIsLoading(true);
        const response = await getCameras({});
        setCameras(response.cameras);
        
        // If a camera is selected, center the map on it
        if (selectedCameraId) {
          const selectedCam = response.cameras.find(
            (cam: Camera) => cam.Id === selectedCameraId.toString()
          );
          if (selectedCam) {
            setMapCenter({
              lat: selectedCam.Location.coordinates[1],
              lng: selectedCam.Location.coordinates[0]
            });
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu camera:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCameras();
  }, [selectedCameraId]);

  // Handle camera click
  const handleCameraClick = useCallback((camera: Camera) => {
    // Set selected camera for dialog
    setSelectedCamera(camera);
    setSnapshotUrl(`http://camera.thongtingiaothong.vn/api/snapshot/${camera.Id}?t=${Date.now()}`);
    setShowDialog(true);
    
    // Call parent callback if provided
    if (onCameraSelect) {
      // Parse camera ID back to number format for compatability
      try {
        onCameraSelect(parseInt(camera.Id), camera.DisplayName);
      } catch (e) {
        console.error("Error parsing camera ID:", e);
      }
    }
  }, [onCameraSelect]);

  // Update snapshot URL every 15 seconds
  useEffect(() => {
    if (!selectedCamera || !selectedCamera.SnapshotUrl) return;
    
    const interval = setInterval(() => {
      setSnapshotUrl(`http://camera.thongtingiaothong.vn/api/snapshot/${selectedCamera.Id}?t=${Date.now()}`);
    }, 15000);
    
    return () => clearInterval(interval);
  }, [selectedCamera]);

  // Render loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-slate-600 dark:text-slate-300">Đang tải dữ liệu bản đồ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
        center={mapCenter}
        zoom={13}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
        }}
        onLoad={(map) => setMapInstance(map)}
      >
        {/* Traffic layer */}
        {showTraffic && <TrafficLayer />}
        
        {/* Camera markers */}
        {cameras.map((camera) => (
          <Marker
            key={camera.Id}
            position={{
              lat: camera.Location.coordinates[1],  // Latitude is second in the coordinates array
              lng: camera.Location.coordinates[0],  // Longitude is first in the coordinates array
            }}
            icon={{
              url: "/image/cctv_camera_active.png",
              scaledSize: new window.google.maps.Size(32, 32),
            }}
            title={camera.DisplayName}
            onClick={() => handleCameraClick(camera)}
          />
        ))}
      </GoogleMap>
      
      {/* Controls overlay */}
      <div className="absolute top-3 right-3 z-10 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md">
        <Button 
          size="sm" 
          variant={showTraffic ? "default" : "outline"}
          className="mb-2 w-full"
          onClick={() => setShowTraffic(!showTraffic)}
        >
          <Layers className="h-4 w-4 mr-1" /> 
          {showTraffic ? "Ẩn luồng giao thông" : "Hiện luồng giao thông"}
        </Button>
        
        <div className="text-xs p-2 bg-gray-100 dark:bg-slate-700 rounded-md">
          <div className="font-medium mb-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-blue-600" />
            <span>Chú thích</span>
          </div>
          <div className="flex items-center mb-1 text-[11px]">
            <span className="w-4 h-2 bg-[#00D084] inline-block rounded mr-1"></span>
            <span>Thông thoáng</span>
          </div>
          <div className="flex items-center mb-1 text-[11px]">
            <span className="w-4 h-2 bg-[#FFEB3B] inline-block rounded mr-1"></span>
            <span>Đông</span>
          </div>
          <div className="flex items-center mb-1 text-[11px]">
            <span className="w-4 h-2 bg-[#FF9800] inline-block rounded mr-1"></span>
            <span>Ùn tắc nhẹ</span>
          </div>
          <div className="flex items-center text-[11px]">
            <span className="w-4 h-2 bg-[#B71C1C] inline-block rounded mr-1"></span>
            <span>Ùn tắc nặng</span>
          </div>
        </div>
      </div>
      
      {/* Camera preview dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              {selectedCamera?.DisplayName}
            </DialogTitle>
          </DialogHeader>
          
          {snapshotUrl ? (
            <div className="relative w-full aspect-video overflow-hidden rounded-md">
              <Image
                src={snapshotUrl}
                alt={selectedCamera?.DisplayName || "Camera preview"}
                fill
                className="object-cover"
                unoptimized // For dynamic URLs
              />
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Cập nhật mỗi 15 giây
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-center text-sm">Camera hiện không có dữ liệu hình ảnh</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrafficMapView;