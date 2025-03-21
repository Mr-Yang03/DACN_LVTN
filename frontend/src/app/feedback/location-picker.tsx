"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import GoongMap dynamically
const GoongMap = dynamic(() => import("@/components/ui/GoongMapWithMarker"), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-muted animate-pulse" />,
});

interface LocationValue {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<LocationValue>(value);

  const handleMapClick = (lat: number, lng: number) => {
    setTempLocation({
      lat,
      lng,
    });
  };

  const confirmLocation = () => {
    onChange(tempLocation);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex w-full space-x-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Chọn vị trí trên bản đồ"
          className="pl-9"
          readOnly
          value={`${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}`}
        />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" type="button">
            Chọn trên bản đồ
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle>Chọn vị trí trên bản đồ</DialogTitle>
            <DialogDescription>Click vào bản đồ để chọn vị trí mong muốn</DialogDescription>
          </DialogHeader>
          <div className="h-[400px] w-full rounded-md border overflow-hidden relative">
            <GoongMap
              controls={{ navigation: true, geolocate: true, search: true }}
              onMapClick={({ lngLat }) => {
                handleMapClick(lngLat.lat, lngLat.lng);
              }}
            />
          </div>
          <div className="flex mt-2 space-x-2 items-center justify-center">
            <Button onClick={confirmLocation}>Xác nhận</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
