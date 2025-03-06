"use client";

import { useState } from "react";
// import goongjs from "@goongmaps/goong-js";
// import "@goongmaps/goong-js/dist/goong-js.css";
import { Menu } from "lucide-react";
import Sidebar from "./components/sidebar";
// import LocationButton from "@/components/ui/LocationButton";
// import { MapSearchBox } from "@/components/ui/MapSearchBox";
// import MapLayer from "./components/MapLayer";
import GoongMap from "@/components/ui/GoongMap";

export default function FullScreenMap() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="relative w-full h-full">
      {/* Bản đồ */}
      <GoongMap
        controls={{ navigation: true, geolocate: true, search: true }}
      />

      {/* UI điều khiển */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="flex flex-row m-4 ml-0 space-x-4">
          {/* Sidebar */}
          <div className="pointer-events-auto">
            {isSidebarOpen && (
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            )}
          </div>

          {/* Nút mở Sidebar */}
          <button
            className="bg-white p-3 rounded-full shadow-lg pointer-events-auto hover:bg-blue-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu color="black" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
