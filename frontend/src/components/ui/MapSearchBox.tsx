"use client";

import { useState } from "react";
import { Search} from "lucide-react";

export function MapSearchBox() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== "") {
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      window.open(searchUrl, "_blank");
    }
  };

  return (
    <div className="flex items-center bg-white rounded-full px-2 py-1 md:w-94 w-90">
      {/* Ô nhập liệu */}
      <input
        type="text"
        className="flex-1 outline-none text-gray-700 placeholder-gray-400 px-2"
        placeholder="Tìm kiếm vị trí..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Nút tìm kiếm */}
      <button
        onClick={handleSearch}
        className="p-2 text-black rounded-full hover:bg-gray-100 transition"
        aria-label="Tìm kiếm"
      >
        <Search size={20} />
      </button>

      {/* Nút chỉ đường */}
      {/* <button
        className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition ml-2"
        aria-label="Đường đi"
      >
        <Navigation size={20} />
      </button> */}
    </div>
  );
}
