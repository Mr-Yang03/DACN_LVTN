/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useGoongMap } from "@/hooks/useGoongMap";
import GoongMapLoader from "@/components/ui/GoongMapLoader";

interface MapPageProps {
  controls?: {
    navigation?: boolean;
    geolocate?: boolean;
  };
}

export default function MapPage({ controls = {} }: MapPageProps) {
  const containerId = "map-container";
  const { map, setIsGoongLoaded } = useGoongMap(containerId);

  useEffect(() => {
    if (!map) return;
    const goongjs = (window as any).goongjs;
    if (!goongjs) return;

    // Thêm điều khiển zoom nếu được yêu cầu
    if (controls.navigation) {
      map.addControl(new goongjs.NavigationControl(), "bottom-right");
    }

    // Thêm nút định vị nếu được yêu cầu
    if (controls.geolocate) {
      const geolocate = new goongjs.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      });

      map.addControl(geolocate, "bottom-right");
      map.on("load", () => geolocate.trigger());
    }
    
  }, [map, controls]);

  return (
    <div className="relative w-full h-full">
      <GoongMapLoader onLoad={() => setIsGoongLoaded(true)} />
      <div id={containerId} className="absolute w-full h-full z-0" />
    </div>
  );
}
