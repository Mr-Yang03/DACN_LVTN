import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  onPlaceSelected: (lat: number, lng: number, placeId?: string) => void;
  onDirectionsReady: (directions: google.maps.DirectionsResult) => void;
  selectedPlace?: google.maps.places.PlaceResult | null;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onPlaceSelected,
  selectedPlace,
}) => {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<google.maps.LatLng | null>(null);

  useEffect(() => {
    if (selectedPlace?.name) {
      setInput(selectedPlace.name);
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCurrentLocation(
            new google.maps.LatLng(coords.latitude, coords.longitude)
          );
        },
        () => {
          setCurrentLocation(new google.maps.LatLng(10.7769, 106.7009));
        }
      );
    } else {
      setCurrentLocation(new google.maps.LatLng(10.7769, 106.7009));
    }
  }, []);

  useEffect(() => {
    if (!window.google) return;
    autocompleteService.current = new google.maps.places.AutocompleteService();
    const dummy = document.createElement("div");
    placesService.current = new google.maps.places.PlacesService(dummy);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          language: "vi",
          componentRestrictions: { country: "vn" },
          location:
            currentLocation || new google.maps.LatLng(10.7769, 106.7009),
          radius: 50000,
        },
        (preds) => {
          setPredictions(preds || []);
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handleSelect = (placeId: string) => {
    if (placesService.current) {
      placesService.current.getDetails({ placeId }, (place) => {
        if (place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          onPlaceSelected(lat, lng, place.place_id);
          setInput(place.formatted_address || "");
          setPredictions([]);
        }
      });
    }
  };

  return (
    <div className="absolute top-[20px] left-[20px] w-[250px] md:w-[350px]">
      <div className="flex items-center bg-white p-3 rounded-full shadow-md">
        <Search className="text-gray-500 mr-2" size={20} />
        <input
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && predictions.length > 0) {
              handleSelect(predictions[0].place_id);
            }
          }}
          placeholder="Tìm địa điểm"
          className="w-full outline-none text-sm"
        />
        {input && (
          <button
            onClick={() => {
              setInput("");
              setPredictions([]);
              // onPlaceSelected(0, 0);
            }}
            className="text-gray-400 hover:text-gray-600 mx-2"
          >
            ✕
          </button>
        )}
      </div>

      {predictions.length > 0 && (
        <ul className="bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto">
          {predictions.map((pred) => (
            <li
              key={pred.place_id}
              onClick={() => handleSelect(pred.place_id)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">
                {pred.structured_formatting.main_text}
              </div>
              <div className="text-xs text-gray-500">
                {pred.structured_formatting.secondary_text}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
