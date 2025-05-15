import dynamic from "next/dynamic";
import { BarChart3, MapPin, Car, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, SpeedData, TimeRange } from "./types";
import { TrafficCharts } from "./TrafficCharts";

interface SimpleGoogleMapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: {
      lat: number;
      lng: number;
    };
    title: string;
    status: "online" | "offline";
    onClick?: () => void;
  }>;
}

// Dynamic import for GoogleMap to avoid SSR issues
const GoogleMapComponent = dynamic<SimpleGoogleMapProps>(
  () => import("@/components/ui/SimpleGoogleMap"),
  { ssr: false }
);

interface MapAndStatsProps {
  selectedCamera: {
    id: string;
    name: string;
  };
  availableCameras: Camera[];
  mapCenter: {
    lat: number;
    lng: number;
  };
  mapZoom: number;
  isTestMode: boolean;
  speedData: SpeedData;
  timeRange: TimeRange;
  onTimeRangeChange: (newTimeRange: TimeRange) => void;
  onTestModeToggle: () => void;
  onCameraSelect: (camera: Camera) => void;
}

export function MapAndStats({
  selectedCamera,
  availableCameras,
  mapCenter,
  mapZoom,
  isTestMode,
  speedData,
  timeRange,
  onTimeRangeChange,
  onTestModeToggle,
  onCameraSelect,
}: MapAndStatsProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span>Thống kê giao thông</span>
          </CardTitle>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
            <MapPin className="h-3 w-3 inline mr-0.5" /> {selectedCamera.name}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="bando" className="w-full">
          <TabsList className="mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <TabsTrigger
              value="bando"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300"
            >
              Bản đồ & Camera
            </TabsTrigger>
            <TabsTrigger
              value="thongke"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300"
            >
              Thống kê
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="bando"
            className="animate-in fade-in-50 duration-300"
          >
            <MapView 
              selectedCamera={selectedCamera}
              availableCameras={availableCameras}
              isTestMode={isTestMode}
              mapCenter={mapCenter}
              mapZoom={mapZoom}
              onTestModeToggle={onTestModeToggle}
              onCameraSelect={onCameraSelect}
            />
          </TabsContent>

          <TabsContent
            value="thongke"
            className="animate-in fade-in-50 duration-300"
          >
            <TrafficCharts 
              speedData={speedData}
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MapView({
  selectedCamera,
  availableCameras,
  isTestMode,
  mapCenter,
  mapZoom,
  onTestModeToggle,
  onCameraSelect,
}: {
  selectedCamera: {
    id: string;
    name: string;
  };
  availableCameras: Camera[];
  isTestMode: boolean;
  mapCenter: {
    lat: number;
    lng: number;
  };
  mapZoom: number;
  onTestModeToggle: () => void;
  onCameraSelect: (camera: Camera) => void;
}) {
  return (
    <>
      <div className="mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Bản đồ & Chọn camera
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nhấn vào biểu tượng camera trên bản đồ để xem dữ liệu.
              Hiển thị {availableCameras.length} camera.
            </p>
          </div>
          <button
            onClick={onTestModeToggle}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          >
            {isTestMode ? "Thoát thử nghiệm" : "Thử nghiệm"}
          </button>
        </div>
      </div>

      <div className="h-[500px] overflow-hidden rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 relative">
        <GoogleMapComponent
          center={mapCenter}
          zoom={mapZoom}
          markers={availableCameras.map((camera) => ({
            id: camera.id,
            position: camera.location,
            title: camera.name,
            status: camera.status,
            onClick: () => onCameraSelect(camera),
          }))}
        />

        <div className="absolute top-2 right-2 bg-white dark:bg-slate-800 shadow-md rounded-md p-2 z-10 text-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Camera trực tuyến</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Camera ngoại tuyến</span>
          </div>
        </div>

        <div className="absolute bottom-2 left-2 bg-white dark:bg-slate-800 shadow-md rounded-md p-2 z-10">
          <h4 className="text-xs font-semibold mb-1">Đang hiển thị:</h4>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs">{selectedCamera.name}</span>
          </div>
        </div>
      </div>
    </>
  );
}
