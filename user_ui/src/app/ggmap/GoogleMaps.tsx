"use client";

import {
  GoogleMap,
  Marker,
  useLoadScript,
  TrafficLayer,
} from "@react-google-maps/api";
import React from "react";
import { useEffect, useState } from "react";
import SearchBox from "@/components/ui/SearchBox";
import LocationButton from "@/components/ui/LocationButton";
import PlaceDetail from "@/components/ui/PlaceDetail";
import { useGoogleMapsLogic } from "@/hooks/useGoogleMap";
import { getCameras } from "@/apis/trafficApi";
import CameraLayer from "./components/CameraLayer";
import DirectionsLayer from "./components/DirectionsLayer";
import CustomMapTypeControl from "./components/CustomMapTypeControl";

// Thanh trạng thái giao thông sử dụng Tailwind CSS
const TrafficStatusBar = () => (
  <div
    className="fixed left-1/2 bottom-6 z-[1000] flex items-center gap-1 px-2.5 py-1 rounded-lg shadow-lg bg-white font-medium text-[15px] justify-center"
  >
    <span className="mr-2 italic text-xs">Nhanh</span>
    <span className="w-6 h-3 bg-[#00D084] inline-block" />
    <span className="w-6 h-3 bg-[#FFEB3B] inline-block" />
    <span className="w-6 h-3 bg-[#FF9800] inline-block" />
    <span className="w-6 h-3 bg-[#B71C1C] inline-block" />
    <span className="ml-2 italic text-xs">Chậm</span>
  </div>
);

interface GoogleMapsProps {
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  latitude: number;
  longitude: number;
  showCamera: boolean;
  showTraffic: boolean;
  style?: React.CSSProperties;
}

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

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
];

const GoogleMaps: React.FC<GoogleMapsProps> = ({
  setLatitude,
  setLongitude,
  latitude,
  longitude,
  showCamera,
  showTraffic,
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
  const [mapType, setMapType] = useState<string>("roadmap");

  const effectiveMapType =
    mapType === "satellite" && showTraffic ? "hybrid" : mapType;

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

  if (!isLoaded) return null;

  return (
    <>
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
            mapTypeId: effectiveMapType as google.maps.MapTypeId,
          }}
        >
          <CustomMapTypeControl
            mapType={mapType}
            setMapType={setMapType}
            map={map}
          />
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
          {showTraffic && <TrafficLayer />}
          <DirectionsLayer directions={directions} />
          <CameraLayer cameras={cameras} showCamera={showCamera} map={map} />
        </GoogleMap>
      </div>
      {showTraffic && <TrafficStatusBar />}
    </>
  );
};

export default GoogleMaps;
