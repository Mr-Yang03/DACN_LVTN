import React from "react";

interface CustomMapTypeControlProps {
  mapType: string; // changed from google.maps.MapTypeId
  setMapType: (type: string) => void; // changed from google.maps.MapTypeId
  map: google.maps.Map | null;
}

const CustomMapTypeControl: React.FC<CustomMapTypeControlProps> = ({ mapType, setMapType, map }) => {
  // Helper to set map type safely
  const handleSetMapType = (type: string) => {
    setMapType(type);
    if (map) map.setMapTypeId(type as google.maps.MapTypeId);
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white rounded-xl shadow-md p-1">
      <button
        className={`border-none rounded-lg px-4 py-1 font-semibold cursor-pointer transition-colors duration-150 ${mapType === "roadmap" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
        onClick={() => handleSetMapType("roadmap")}
      >
        Bản đồ
      </button>
      <button
        className={`border-none rounded-lg px-4 py-1 font-semibold cursor-pointer transition-colors duration-150 ${mapType === "satellite" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
        onClick={() => handleSetMapType("satellite")}
      >
        Vệ tinh
      </button>
    </div>
  );
};

export default CustomMapTypeControl;
