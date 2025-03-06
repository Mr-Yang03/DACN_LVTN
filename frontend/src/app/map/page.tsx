"use client";

// import { useState, useEffect, useRef } from "react";
// import goongjs from "@goongmaps/goong-js";
// import "@goongmaps/goong-js/dist/goong-js.css";
// import { Menu } from "lucide-react";
// import Sidebar from "./components/sidebar";
// import LocationButton from "@/components/ui/LocationButton";
// import { MapSearchBox } from "@/components/ui/MapSearchBox";
// import MapLayer from "./components/MapLayer";
import GoongMap from "@/components/ui/GoongMap";


export default function FullScreenMap() {


  return (
    <div className="relative w-full h-full">
      {/* Bản đồ */}
      <GoongMap controls={{ navigation: true, geolocate: true }} />

      {/* UI điều khiển */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        
      </div>
    </div>
  );
}