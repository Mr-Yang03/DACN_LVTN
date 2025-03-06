"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { Menu } from "lucide-react";
import Sidebar from "./components/sidebar";
import LocationButton from "@/components/ui/LocationButton";
import { MapSearchBox } from "@/components/ui/MapSearchBox";
import MapLayer from "./components/MapLayer";

const DEFAULT_LOCATION = { lat: 10.762622, lng: 106.660172 }; // Quận 10, TP.HCM
const GOONG_API_KEY = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY;

export default function FullScreenMap() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGoongLoaded, setIsGoongLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null);
  const [selectedLayer, setSelectedLayer] = useState({
    name: "Goong Map",
    style: "https://tiles.goong.io/assets/goong_map_web.json",
  });
  const [isBrowser, setIsBrowser] = useState(false);
  const mapInitialized = useRef(false);

  // Set isBrowser to true once component is mounted
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Lấy vị trí người dùng - only execute in browser
  const getUserLocation = () => {
    if (!isBrowser) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          if (map) map.setCenter([newLocation.lng, newLocation.lat]);
          console.log("Vị trí của bạn:", newLocation);
        },
        () => setLocation(DEFAULT_LOCATION)
      );
    }
  };

  // Initialize map after Goong is loaded and we're in the browser
  useEffect(() => {
    if (!isBrowser || !isGoongLoaded || mapInitialized.current) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const goongjs = (window as any).goongjs;
      if (!goongjs) return;

      goongjs.accessToken = GOONG_API_KEY;
      const newMap = new goongjs.Map({
        container: "map",
        style: selectedLayer.style,
        center: [location.lng, location.lat],
        zoom: 15,
      });

      setMap(newMap);
      mapInitialized.current = true;

      getUserLocation();

      return () => {
        if (newMap) newMap.remove();
        mapInitialized.current = false;
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [isBrowser, isGoongLoaded, selectedLayer, location.lat, location.lng]);

  // Update map when layer or location changes
  useEffect(() => {
    if (!map || !isBrowser) return;
    
    try {
      map.setStyle(selectedLayer.style);
      map.setCenter([location.lng, location.lat]);
    } catch (error) {
      console.error("Error updating map:", error);
    }
  }, [map, selectedLayer.style, location.lng, location.lat, isBrowser]);

  return (
    <div className="relative w-full h-full">
      {/* Script GoongJS */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.js"
        strategy="lazyOnload"
        onLoad={() => setIsGoongLoaded(true)}
      />
      {isBrowser && (
        <link
          href="https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.css"
          rel="stylesheet"
        />
      )}

      {/* Bản đồ */}
      <div id="map" className="absolute w-full h-full z-0" />

      {/* UI điều khiển */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="flex flex-row m-4 ml-0 space-x-4">
          {/* Sidebar */}
          <div className="pointer-events-auto">
            {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
          </div>

          {/* Nút mở Sidebar */}
          <button
            className="bg-white p-3 rounded-full shadow-lg pointer-events-auto hover:bg-blue-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu color="black" size={24} />
          </button>

          {/* Ô tìm kiếm */}
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

        {/* Lựa chọn Layer bản đồ */}
        <div
          className={`absolute bottom-8 left-4 pointer-events-auto ${
            isSidebarOpen ? "transform translate-x-80" : ""
          }`}
        >
          <MapLayer selectedLayer={selectedLayer.name} setSelectedLayer={setSelectedLayer} />
        </div>
      </div>
    </div>
  );
}