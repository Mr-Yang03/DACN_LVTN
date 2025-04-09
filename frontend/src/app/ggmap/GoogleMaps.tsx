"use client";

import {
  GoogleMap,
  Marker,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import React from "react";
import { useEffect, useState } from "react";
import SearchBox from "@/components/ui/SearchBox";
import LocationButton from "@/components/ui/LocationButton";
import PlaceDetail from "@/components/ui/PlaceDetail";
import { useGoogleMapsLogic } from "@/hooks/useGoogleMap";
import { getCameras } from "@/apis/trafficApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";

interface GoogleMapsProps {
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  latitude: number;
  longitude: number;
  showCamera: boolean;
  style?: React.CSSProperties;
}

interface Camera {
  Title: string;
  DisplayName: string;
  SnapshotUrl: string | null;
  Location: {
    type: "Point";
    coordinates: [number, number];
  };
}

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
];

const GoogleMaps: React.FC<GoogleMapsProps> = ({
  setLatitude,
  setLongitude,
  latitude,
  longitude,
  showCamera,
  style = { width: "100%", height: "100vh" },
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries,
  });
  const [cameras, setCameras] = useState<Camera[]>([]);
  const {
    map,
    setMap,
    directions,
    setDirections,
    selectedPlace,
    setSelectedPlace,
    center,
    handlePlaceSelected,
  } = useGoogleMapsLogic(latitude, longitude, setLatitude, setLongitude);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchCameras = async () => {
      try {
        const response = await getCameras({});
        setCameras(response.cameras);
      } catch (err) {
        console.error("Lỗi khi tải camera:", err);
      }
    };

    fetchCameras();
  }, [isLoaded]);

  useEffect(() => {
    if (!selectedCamera || !selectedCamera.SnapshotUrl) return;

    const interval = setInterval(() => {
      setSnapshotUrl(`${selectedCamera.SnapshotUrl}?t=${Date.now()}`);
    }, 15000); // 15s

    return () => clearInterval(interval);
  }, [selectedCamera]);

  if (!isLoaded) return null;

  return (
    <>
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open);
          if (!open) setSelectedCamera(null);
        }}
      >
        <DialogContent className="bg-white border-gray-200 text-gray-800 w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {selectedCamera?.DisplayName}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Video camera giao thông - cập nhật mỗi 15s
            </DialogDescription>
          </DialogHeader>

          {snapshotUrl ? (
            <Image
              src={snapshotUrl || "/placeholder.png"}
              alt={selectedCamera?.DisplayName || "Camera"}
              className="w-full rounded-lg mt-4"
              width={800}
              height={600}
            />
          ) : (
            <p className="text-center text-gray-500 mt-4">
              Camera hiện không hoạt động
            </p>
          )}
        </DialogContent>
      </Dialog>
      <div className="relative w-full h-screen flex flex-row">
        <PlaceDetail
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
        <GoogleMap
          center={center}
          zoom={16}
          mapContainerStyle={style}
          onLoad={(mapInstance) => setMap(mapInstance)}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
          }}
        >
          <SearchBox
            onPlaceSelected={(lat, lng, placeId) =>
              handlePlaceSelected(lat, lng, placeId)
            }
            onDirectionsReady={(dir) => setDirections(dir)}
            selectedPlace={selectedPlace}
          />
          <Marker position={center} />
          <LocationButton
            map={map}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />
          {directions && <DirectionsRenderer directions={directions} />}
          {showCamera &&
            cameras.map((camera, index) => (
              <Marker
                key={index}
                position={{
                  lat: camera.Location.coordinates[1],
                  lng: camera.Location.coordinates[0],
                }}
                icon={{
                  url: camera.SnapshotUrl
                    ? "/image/cctv_camera_active.png"
                    : "/image/cctv_camera_inactive.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
                title={camera.DisplayName}
                onClick={() => {
                  setSelectedCamera(camera);
                  setSnapshotUrl(
                    camera.SnapshotUrl ? `${camera.SnapshotUrl}` : null
                  );
                  setShowDialog(true);
                }}
              />
            ))}
        </GoogleMap>
      </div>
    </>
  );
};

export default GoogleMaps;
