"use client";

import React, { useState } from "react";
import GoogleMaps from "./GoogleMaps";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";

export default function FullScreenMap() {
  const [latitude, setLatitude] = useState<number>(10.762622);
  const [longitude, setLongitude] = useState<number>(106.660172);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex flex-row w-full h-full">
      {/* UI điều khiển */}
      <div className="inset-0 z-10 height-[100vh] bg-white pointer-events-none shadow-lg z-100">
        <div className="flex flex-col space-x-4 h-full border-r border-gray-200">
          {/* Nút mở Sidebar */}
          {!isSidebarOpen && (
            <button
              className="bg-white p-1 rounded-full pointer-events-auto px-4 pt-4"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu color="black" size={24} />
            </button>
          )}

          {/* Sidebar */}
          <div className="pointer-events-auto h-full">
            {isSidebarOpen && (
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            )}
          </div>
        </div>
      </div>

      {/* Bản đồ */}
      <GoogleMaps
        latitude={latitude}
        longitude={longitude}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
      />
    </div>
  );
}
