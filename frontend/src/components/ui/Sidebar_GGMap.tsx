import React from "react";
import Image from "next/image";
import { MapPin, Phone, MapPinned, Clock, Link, X } from "lucide-react";

interface SidebarProps {
  place: google.maps.places.PlaceResult | null;
  onClose: () => void;
}

function getCompactHours(openingHours?: string[]): string {
  if (!openingHours || openingHours.length !== 7) return "N/A";

  const allSame = openingHours.every(
    (line) => line.split(": ")[1] === openingHours[0].split(": ")[1]
  );

  if (allSame) {
    return `Thứ 2 - Chủ Nhật: ${openingHours[0].split(": ")[1]}`;
  }

  return ""; // Có thể hiển thị dạng bình thường nếu không giống nhau
}

const Sidebar: React.FC<SidebarProps> = ({ place, onClose }) => {
  if (!place) return null;

  return (
    <div className="relative top-0 left-0 w-[500px] flex flex-col h-full bg-white shadow-lg overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-black z-10 hover:text-gray-700 "
        aria-label="Đóng"
      >
        <X size={23} />
      </button>
      {place.photos?.[0]?.getUrl && (
        <Image
          src={place.photos?.[0]?.getUrl() || ""}
          alt={place.name || "Image"}
          width={300}
          height={200}
          className="rounded w-full"
        />
      )}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-2">{place.name}</h2>
        <p className="text-sm">
          <span>{place.rating} </span>
          <span className="text-yellow-400">★ </span>
          <span>({place.user_ratings_total || "0"} đánh giá)</span>
        </p>
      </div>

      <hr />

      <div className="p-4 flex flex-col gap-2">
        <p className="text-sm mb-2 flex gap-3">
          <MapPin className="text-blue-600" size={23} />
          {place.formatted_address || "N/A"}
        </p>
        <p className="text-sm mb-2 flex gap-3">
          <MapPinned className="text-blue-600" size={18} />
          {place.geometry?.location?.lat()}, {place.geometry?.location?.lng()}
        </p>
        <p className="text-sm mb-2 flex gap-3">
          <Phone className="text-blue-600" size={18} />
          {place.formatted_phone_number || "N/A"}
        </p>
        <p className="text-sm mb-2 flex gap-3 items-center">
          <Clock className="text-blue-600" size={18} />
          {getCompactHours(place.opening_hours?.weekday_text) || "N/A"}
        </p>
        <p className="text-sm mb-2 flex gap-3 items-center">
          <Link className="text-blue-600" size={18} />
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {place.website || "N/A"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
