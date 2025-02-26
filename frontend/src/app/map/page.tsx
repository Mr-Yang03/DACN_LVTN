"use client";

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import { MapSearchBox } from "@/components/ui/MapSearchBox";
import LocationButton from "@/components/ui/LocationButton";
import { Menu } from "lucide-react";

const DEFAULT_LOCATION = { lat: 10.762622, lng: 106.660172 }; // Tọa độ Quận 10, TP.HCM

export default function FullScreenMap() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  // Hàm lấy vị trí
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error);
          setLocation(DEFAULT_LOCATION);
        }
      );
    } else {
      console.warn("Trình duyệt không hỗ trợ Geolocation");
      setLocation(DEFAULT_LOCATION);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Bản đồ OpenStreetMap */}
      <MapContainer
        key={location.lat + location.lng}
        center={location}
        zoom={15}
        className="absolute w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <UpdateMapView location={location} />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Lớp giao diện trên bản đồ */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="flex flew-row m-4 space-x-4">
          {/* Nút menu */}
          <button className="bg-white p-3 rounded-full shadow-lg pointer-events-auto">
            <Menu color="black" size={24} />
          </button>

          {/* Ô nhập địa điểm */}
          <div className="bg-white shadow-xl rounded-full pointer-events-auto">
            <MapSearchBox />
          </div>
        </div>

        {/* Nút định vị */}
        <div className="absolute bottom-40 right-16 pointer-events-auto">
          <LocationButton onClick={getUserLocation} />
        </div>
      </div>
    </div>
  );
}

function UpdateMapView({
  location,
}: {
  location: { lat: number; lng: number };
}) {
  const map = useMap();
  useEffect(() => {
    map.setView([location.lat, location.lng], 15);
  }, [location, map]);
  return null;
}
