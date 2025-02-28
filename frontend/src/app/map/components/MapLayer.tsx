import { Layers, Map, Bus, Bike } from "lucide-react";
import { useState } from "react";

const layers = [
  {
    name: "Bản đồ",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    icon: <Map className="w-6 h-6 text-blue-600" />,
  },
  {
    name: "Địa hình",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    icon: <Layers className="w-6 h-6 text-gray-600" />,
  },
  {
    name: "Giao thông",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    icon: <Map className="w-6 h-6 text-red-600" />,
  },
  {
    name: "Chuyến tuyến",
    url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=YOUR_API_KEY",
    icon: <Bus className="w-6 h-6 text-purple-600" />,
  },
  {
    name: "Đi xe đạp",
    url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=YOUR_API_KEY",
    icon: <Bike className="w-6 h-6 text-green-600" />,
  },
];

interface MapLayerProps {
  selectedLayer: string;
  setSelectedLayer: (layer: { name: string; url: string }) => void;
}

export default function MapLayer({
  selectedLayer,
  setSelectedLayer,
}: MapLayerProps) {
  const [isMapLayer, setIsMapLayer] = useState(false);
  return (
    <div className="flex flex-row space-x-2">
        <div className="flex flex-col">
            <div className="flex-1"></div>
      <button
        className="p-2 rounded-lg flex items-center space-x-2 bg-white hover:bg-gray-100 h-12 "
        onClick={() => setIsMapLayer(!isMapLayer)}
        >
        <Layers className="w-8 h-8 text-blue-600" />
        <span className="text-sm">Lớp bản đồ</span>
      </button>
          </div>
      {isMapLayer && (
        <div className="bg-white shadow-lg rounded-lg p-2 flex flex-col space-y-2 pointer-events-auto">
          {layers.map((layer) => (
            <button
              key={layer.name}
              className={`p-2 rounded-lg flex items-center space-x-2 ${
                selectedLayer === layer.name
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedLayer(layer)}
            >
              {layer.icon}
              <span className="text-sm">{layer.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
