import { LocateFixed } from "lucide-react";
import React from "react";

interface LocationButtonProps {
  map: google.maps.Map | null;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
}

const LocationButton: React.FC<LocationButtonProps> = ({
  map,
  setLatitude,
  setLongitude,
}) => {
  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          map?.panTo({ lat, lng });
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí:", error);
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị.");
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        bottom: "80px",
        right: "10px",
      }}
      className="absolute bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
    >
      <LocateFixed className="w-6 h-6 text-blue-700" />
    </button>
  );
};

export default LocationButton;
