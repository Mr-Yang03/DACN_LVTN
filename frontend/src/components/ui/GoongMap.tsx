/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect} from "react";
import { useGoongMap } from "@/hooks/useGoongMap";
import GoongMapLoader from "@/components/ui/GoongMapLoader";

interface MapPageProps {
  controls?: {
    navigation?: boolean;
    geolocate?: boolean;
    search?: boolean;
  }
}

export default function MapPage({ controls = {} }: MapPageProps) {
  const containerId = "map-container";
  const { map, setIsGoongLoaded } = useGoongMap(containerId);

  useEffect(() => {
    if (!map) return;
    const goongjs = (window as any).goongjs;
    const GoongGeocoder = (window as any).GoongGeocoder;
    if (!goongjs || !GoongGeocoder) return;

    if (controls.navigation) {
      map.addControl(new goongjs.NavigationControl(), "bottom-right");
    }

    if (controls.geolocate) {
      const geolocate = new goongjs.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      });
      
      map.addControl(geolocate, "bottom-right");
      map.on("load", () => geolocate.trigger());
    }

    // Đợi script load xong rồi mới thêm GoongGeocoder
    if (controls.search) {
      if (typeof GoongGeocoder !== "undefined") {
        const geocoder = new GoongGeocoder({
          accessToken: process.env.NEXT_PUBLIC_GOONG_API_KEY,
          goongjs: goongjs,
        });

        map.addControl(geocoder, "top-left");

        const geocoderContainer = document.querySelector(".mapboxgl-ctrl-top-left");
        if (geocoderContainer) {
          (geocoderContainer as HTMLElement).style.top = "12px";
          (geocoderContainer as HTMLElement).style.left = "70px";
            (geocoderContainer as HTMLElement).style.width = "1000px";
            (geocoderContainer as HTMLElement).style.height = "200px";
              (geocoderContainer as HTMLElement).style.borderRadius = "8px";
        }
        
      }
    }
  }, [map]);

  return (
    <div className="relative w-full h-full">
      <GoongMapLoader onLoad={() => setIsGoongLoaded(true)} />
      <div id={containerId} className="absolute w-full h-full z-0" />
    </div>
  );
}
