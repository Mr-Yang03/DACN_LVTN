/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const DEFAULT_LOCATION = { lat: 10.762622, lng: 106.660172 };
const GOONG_API_KEY = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY;

export function useGoongMap(containerId: string) {
  const [isGoongLoaded, setIsGoongLoaded] = useState(false);
  const [map, setMap] = useState<any>(null); // Dùng useState thay vì useRef

  useEffect(() => {
    if (!GOONG_API_KEY || !isGoongLoaded || map) return;

    try {
      const goongjs = (window as any).goongjs;
      if (!goongjs) return;

      goongjs.accessToken = GOONG_API_KEY;
      const newMap = new goongjs.Map({
        container: containerId,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat],
        zoom: 15,
      });

      setMap(newMap);

      return () => {
        newMap.remove();
        setMap(null);
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [isGoongLoaded]);

  return { map, setIsGoongLoaded };
}
