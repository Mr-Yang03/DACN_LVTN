// hooks/useGoogleMapsLogic.ts
import { useEffect, useMemo, useState } from "react";

export function useGoogleMapsLogic(
  latitude: number,
  longitude: number,
  setLatitude: (lat: number) => void,
  setLongitude: (lng: number) => void
) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const center = useMemo(
    () => ({
      lat: latitude || 10.762622,
      lng: longitude || 106.660172,
    }),
    [latitude, longitude]
  );

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
    if (!map) return;

    const listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      const placeId = (e.domEvent?.target as HTMLElement)?.getAttribute("data-place-id");

      if (placeId) {
        e.stop();
        const service = new google.maps.places.PlacesService(map);
        service.getDetails({ placeId }, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
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
        if (lat && lng) {
          setLatitude(lat);
          setLongitude(lng);
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (
              status === google.maps.GeocoderStatus.OK &&
              results &&
              results[0]
            ) {
              const pid = results[0].place_id;
              const service = new google.maps.places.PlacesService(map);
              service.getDetails({ placeId: pid }, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                  setSelectedPlace(place);
                }
              });
            }
          });
        }
      }
    });

    return () => listener.remove();
  }, [map]);

  return {
    map,
    setMap,
    directions,
    setDirections,
    selectedPlace,
    setSelectedPlace,
    center,
    handlePlaceSelected,
  };
}
