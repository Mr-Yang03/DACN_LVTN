"use client";

import {
  GoogleMap,
  Marker,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import React, { useMemo, useState, useEffect } from "react";
import SearchBox from "@/components/ui/SearchBox";
import LocationButton from "@/components/ui/LocationButton";
import Sidebar from "@/components/ui/Sidebar_GGMap";

interface GoogleMapsProps {
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  latitude: number;
  longitude: number;
  style?: React.CSSProperties;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({
  setLatitude,
  setLongitude,
  latitude,
  longitude,
  style = { width: "100%", height: "100vh" },
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: ["places"],
  });

  const center = useMemo(
    () => ({
      lat: latitude || 10.762622,
      lng: longitude || 106.660172,
    }),
    [latitude, longitude]
  );

  // 🛰️ Lấy vị trí hiện tại khi vừa load map
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLatitude(coords.latitude);
          setLongitude(coords.longitude);
          map?.panTo({ lat: coords.latitude, lng: coords.longitude });
        },
        (error) => console.error("Lỗi khi lấy vị trí:", error)
      );
    }
  }, []);

  const handlePlaceSelected = (lat: number, lng: number, placeId?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    map?.panTo({ lat, lng });

    if (placeId && map) {
      const service = new google.maps.places.PlacesService(map);
      service.getDetails({ placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setSelectedPlace(place);
        }
      });
    }
  };

  useEffect(() => {
    if (map) {
      const listener = map.addListener(
        "click",
        (e: google.maps.MapMouseEvent) => {
          const placeId = (e.domEvent?.target as HTMLElement)?.getAttribute(
            "data-place-id"
          );
          if (placeId) {
            e.stop(); // Ngăn mặc định của Google
            const service = new google.maps.places.PlacesService(map);
            service.getDetails({ placeId }, (place, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                place
              ) {
                setLatitude(place.geometry?.location?.lat() || latitude);
                setLongitude(place.geometry?.location?.lng() || longitude);
                setSelectedPlace(place);
                if (place.geometry?.location) {
                  map.panTo(place.geometry.location);
                }
              }
            });
          } else {
            const lat = e.latLng?.lat();
            const lng = e.latLng?.lng();
            if (lat && lng && map) {
              setLatitude(lat);
              setLongitude(lng);
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode(
                { location: { lat, lng } },
                (results, status) => {
                  if (
                    status === google.maps.GeocoderStatus.OK &&
                    results &&
                    results[0]
                  ) {
                    const placeId = results[0].place_id;
                    const service = new google.maps.places.PlacesService(map);
                    service.getDetails({ placeId }, (place, status) => {
                      if (
                        status === google.maps.places.PlacesServiceStatus.OK &&
                        place
                      ) {
                        setSelectedPlace(place);
                      }
                    });
                  }
                }
              );
            }
          }
        }
      );

      return () => listener.remove();
    }
  }, [map]);

  if (!isLoaded) return null;

  return (
    <div className="relative w-full h-screen flex flex-row">
      <Sidebar place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      <GoogleMap
        center={center}
        zoom={16}
        mapContainerStyle={style}
        onLoad={(mapInstance) => setMap(mapInstance)}
        options={{
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        }}
      >
        <SearchBox
          onPlaceSelected={(lat, lng, placeId) =>
            handlePlaceSelected(lat, lng, placeId)
          }
          onDirectionsReady={(dir) => setDirections(dir)}
          selectedPlace={selectedPlace}
        />
        <Marker position={center} />
        <LocationButton
          map={map}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default GoogleMaps;
