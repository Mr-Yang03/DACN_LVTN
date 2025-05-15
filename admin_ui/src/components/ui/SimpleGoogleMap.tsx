"use client";

import { useEffect, useRef, useState } from "react";
import { 
  GoogleMap, 
  Marker as GoogleMapMarker,
  TrafficLayer,
  StandaloneSearchBox
} from "@react-google-maps/api";
import { useGoogleMapsScript } from "@/lib/google-maps-loader";

interface MarkerProps {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  status: 'online' | 'offline';
  onClick?: () => void;
}

interface SimpleGoogleMapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: MarkerProps[];
  showTraffic?: boolean;
}

export default function SimpleGoogleMap({ 
  center, 
  zoom = 12, 
  markers = [],
  showTraffic = false
}: SimpleGoogleMapProps) {
  const { isLoaded } = useGoogleMapsScript();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const searchBoxRef = useRef<HTMLInputElement>(null);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const onSearchBoxLoad = (searchBoxInstance: google.maps.places.SearchBox) => {
    setSearchBox(searchBoxInstance);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0 && map) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          map.panTo(place.geometry.location);
          map.setZoom(15);
        }
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Đang tải bản đồ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 left-4 z-10 w-1/4 max-w-md">
        <StandaloneSearchBox
          onLoad={onSearchBoxLoad}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Tìm kiếm địa điểm..."
            className="w-full p-2 rounded-full shadow-md border-none outline-none text-sm shadow-lg"
            ref={searchBoxRef}
          />
        </StandaloneSearchBox>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        }}
      >
        <TrafficLayer />
        
        {markers.map((marker) => (
          <GoogleMapMarker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            onClick={marker.onClick}
            icon={{
              url: marker.status === "online" 
                ? "/image/cctv_camera_active.png" 
                : "/image/cctv_camera_inactive.png",
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}