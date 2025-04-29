import { useEffect, useRef } from "react";
import { useGoongMap } from "@/hooks/useGoongMap";
import GoongMapLoader from "@/components/ui/GoongMapLoader";

interface MapPageProps {
  controls?: {
    navigation?: boolean;
    geolocate?: boolean;
    search?: boolean;
  };
  onMapClick?: ({ lngLat }: { lngLat: { lat: number; lng: number } }) => void;
}

export default function MapPage({ controls = {}, onMapClick }: MapPageProps) {
  const containerId = "map-container";
  const { map, setIsGoongLoaded } = useGoongMap(containerId);
  const hoverMarkerRef = useRef<any>(null); // marker khi di chuột
  const clickMarkerRef = useRef<any>(null); // marker khi click

  const formatCoord = (num: number) => {
    return num.toFixed(6).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    if (!map) return;
    const goongjs = (window as any).goongjs;
    const GoongGeocoder = (window as any).GoongGeocoder;
    if (!goongjs || !GoongGeocoder) return;

    // Marker tạm khi di chuột
    map.on("mousemove", (e: any) => {
      if (clickMarkerRef.current) return; // không hiển thị marker tạm khi đã click
      if (!hoverMarkerRef.current) {
        hoverMarkerRef.current = new goongjs.Marker({
          color: "#FF0000",
          opacity: 0.5,
        }).setLngLat(e.lngLat).addTo(map);
      } else {
        hoverMarkerRef.current.setLngLat(e.lngLat);
      }
    });

    // Marker chính khi click
    map.on("click", (e: any) => {
      // Xóa marker tạm
      if (hoverMarkerRef.current) {
        hoverMarkerRef.current.remove();
        hoverMarkerRef.current = null;
      }

      // Xóa marker cũ (nếu có)
      if (clickMarkerRef.current) {
        clickMarkerRef.current.remove();
        clickMarkerRef.current = null;
      }

      const popup = new goongjs.Popup({ offset: 25 })
        .setHTML(
          `<div style="
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 12px 16px;
              border-radius: 10px;
              background: linear-gradient(135deg, #ffffff, #f9f9f9);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              color: #333;
              min-width: 200px;
          ">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 18px;">📍</span>
              <strong style="font-size: 16px;">Vị trí được chọn</strong>
            </div>
            <div style="font-size: 14px; line-height: 1.5; margin-bottom: 8px;">
              <div><span style="color: #666;">Vĩ độ:</span> <strong>${formatCoord(e.lngLat.lat)}</strong></div>
              <div><span style="color: #666;">Kinh độ:</span> <strong>${formatCoord(e.lngLat.lng)}</strong></div>
            </div>
          </div>`
        );

      clickMarkerRef.current = new goongjs.Marker({
        color: "#FF0000",
        draggable: true,
      })
        .setLngLat(e.lngLat)
        .setPopup(popup)
        .addTo(map)
        .togglePopup();

      if (onMapClick) {
        onMapClick({ lngLat: e.lngLat });
      }
    });

    // Controls
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

    if (controls.search) {
      const geocoder = new GoongGeocoder({
        accessToken: process.env.NEXT_PUBLIC_GOONG_API_KEY,
        goongjs: goongjs,
      });

      map.addControl(geocoder, "top-left");
    }

    return () => {
      if (hoverMarkerRef.current) hoverMarkerRef.current.remove();
      if (clickMarkerRef.current) clickMarkerRef.current.remove();
    };
  }, [map]);

  return (
    <div className="relative w-full h-full">
      <GoongMapLoader onLoad={() => setIsGoongLoaded(true)} />
      <div id={containerId} className="absolute w-full h-full z-0" />
    </div>
  );
}
