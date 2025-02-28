"use client";

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import { MapSearchBox } from "@/components/ui/MapSearchBox";
import LocationButton from "@/components/ui/LocationButton";
import { Menu } from "lucide-react";
import Sidebar from "./components/sidebar";
import MapLayer from "./components/MapLayer"; // Import component MapLayer

const DEFAULT_LOCATION = { lat: 10.762622, lng: 106.660172 }; // Tọa độ Quận 10, TP.HCM

export default function FullScreenMap() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState({
    name: "Bản đồ",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  });

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
        <TileLayer url={selectedLayer.url} />
        <UpdateMapView location={location} />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Lớp giao diện trên bản đồ */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="flex flex-row m-4 ml-0 space-x-4">
          {/* Thanh bên */}
          <div className="pointer-events-auto">
            {isSidebarOpen && (
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            )}
          </div>

          {/* Nút menu */}
          <button
            className="bg-white p-3 rounded-full shadow-lg pointer-events-auto hover:bg-blue-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu color="black" size={24} />
          </button>

          {/* Ô nhập địa điểm */}
          <div
            className={`flex bg-white shadow-xl rounded-full pointer-events-auto transition-transform duration-300 ${
              isSidebarOpen ? "transform translate-x-64" : ""
            }`}
          >
            <MapSearchBox />
          </div>
        </div>

        {/* Nút định vị */}
        <div className="absolute bottom-40 right-16 pointer-events-auto">
          <LocationButton onClick={getUserLocation} />
        </div>

        {/* 🌍 Map Layer Control */}
        <div className={`absolute bottom-8 left-4 pointer-events-auto ${
              isSidebarOpen ? "transform translate-x-80" : ""
            }`}>
        <MapLayer selectedLayer={selectedLayer.name} setSelectedLayer={setSelectedLayer} />
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
