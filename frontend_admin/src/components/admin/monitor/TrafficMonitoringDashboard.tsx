"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  Maximize2,
  Volume2,
  Camera,
  Activity,
  AlertTriangle,
  Car,
  Clock,
  TrendingUp,
  BarChart3,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCameras, getCameraSpeedData, getVehicleTypeData } from "@/apis/trafficApi";

// Dynamic import for ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

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

const GoogleMapComponent = dynamic<SimpleGoogleMapProps>(
  () => import("@/components/ui/SimpleGoogleMap"),
  { ssr: false }
);

interface Camera {
  id: string;
  name: string;
  status: "online" | "offline";
  location: {
    lat: number;
    lng: number;
  };
}

export function TrafficMonitoringDashboard() {
  const [selectedCamera, setSelectedCamera] = useState({
    id: "",
    name: "Hãy chọn một camera",
    status: "online",
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("5:00");
  const [activeTab, setActiveTab] = useState("thongke");

  const [availableCameras, setAvailableCameras] = useState<Camera[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 10.7731, lng: 106.7024 });
  const [mapZoom, setMapZoom] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [snapshotUrl, setSnapshotUrl] = useState("");
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [refreshRate, setRefreshRate] = useState(1000);
  const [isTestMode, setIsTestMode] = useState(false);
  const testVideoUrl = "D:/HCMUT/DO_AN/final/output.mp4";
  const [timeRange, setTimeRange] = useState<{ hours: number, label: string }>({ hours: 1, label: '1 giờ' });

  // Add vehicle type data state
  const [vehicleTypeData, setVehicleTypeData] = useState<{
    totalVehicles: number;
    vehicleTypes: {
      motorcycle: { count: number; percentage: number };
      car: { count: number; percentage: number };
      truck: { count: number; percentage: number };
      bus: { count: number; percentage: number };
    };
    isLoading: boolean;
  }>({
    totalVehicles: 0,
    vehicleTypes: {
      motorcycle: { count: 0, percentage: 0 },
      car: { count: 0, percentage: 0 },
      truck: { count: 0, percentage: 0 },
      bus: { count: 0, percentage: 0 }
    },
    isLoading: false,
  });

  // Add speed data state
  const [speedData, setSpeedData] = useState<{
    timestamps: string[];
    speeds: number[];
    vehicleCounts: number[];
    isLoading: boolean;
  }>({
    timestamps: ["09:30 AM", "09:45 AM", "09:59 AM", "10:19 AM", "10:34 AM"],
    speeds: [30, 45, 25, 35, 20],
    vehicleCounts: [20, 45, 30, 50, 35],
    isLoading: false,
  });

  // Function to calculate congestion level based on LOS (Level of Service) from API
  const calculateCongestion = (congestionLevel: string): number => {
    // LOS is typically rated as A, B, C, D, E, F where A is best and F is worst
    switch (congestionLevel) {
      case "A":
        return 0; // Free flow
      case "B":
        return 30; // Reasonably free flow
      case "C":
        return 50; // Stable flow
      case "D":
        return 70; // Approaching unstable flow
      case "E":
        return 85; // Unstable flow
      case "F":
        return 100; // Forced or breakdown flow
      default:
        return 50; // Default to middle value if unknown
    }
  };

  // Function to get congestion level text
  const getCongestionLevel = (congestionLevel: string): string => {
    switch (congestionLevel) {
      case "A":
        return "Mức A: Lưu thông tự do";
      case "B":
        return "Mức B: Lưu thông tương đối tự do";
      case "C":
        return "Mức C: Lưu thông ổn định";
      case "D":
        return "Mức D: Tiệm cận lưu thông không ổn định";
      case "E":
        return "Mức E: Lưu thông không ổn định";
      case "F":
        return "Mức F: Lưu thông tắc nghẽn";
      default:
        return "Không xác định";
    }
  };

  // Function to get the appropriate color class for congestion level
  const getCongestionColorClass = (congestionLevel: string): string => {
    switch (congestionLevel) {
      case "A":
        return "bg-green-500 text-white";
      case "B":
        return "bg-green-400 text-white";
      case "C":
        return "bg-yellow-400 text-gray-800";
      case "D":
        return "bg-amber-500 text-white";
      case "E":
        return "bg-orange-500 text-white";
      case "F":
        return "bg-red-500 text-white";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  // Function to get short congestion text for display
  const getShortCongestionText = (congestionLevel: string): string => {
    switch (congestionLevel) {
      case "A":
        return "Lưu thông tự do";
      case "B":
        return "Thông thoáng";
      case "C":
        return "Ổn định";
      case "D":
        return "Đông đúc";
      case "E":
        return "Kẹt xe";
      case "F":
        return "Tắc nghẽn";
      default:
        return "Đang tải...";
    }
  };

  // Function to extract congestion level letter from full congestion text
  const extractCongestionLevel = (congestionText: string): string => {
    // Check if the text follows the format "Mức X: ..."
    const match = congestionText.match(/Mức ([A-F])\:/);
    if (match && match[1]) {
      return match[1]; // Return the level letter (A, B, C, D, E, or F)
    }
    return "default"; // Return default if no match
  };

  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState({
    totalVehicles: 0,
    avgSpeed: 0,
    congestionLevel: "Đang tải...",
    incidents: 0,
    congestionPercent: 0,
  });

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setIsLoading(true);
        const response = await getCameras({});

        const camerasData = response.cameras.map((camera: any) => ({
          id: camera.Id,
          name: camera.DisplayName,
          status: camera.Status === "active" ? "online" : "offline",
          location: {
            lat: camera.Location.coordinates[1],
            lng: camera.Location.coordinates[0],
          },
        }));

        setAvailableCameras(camerasData);

        if (camerasData.length > 0) {
          setSelectedCamera(camerasData[0]);
          updateSnapshotUrl(camerasData[0].id);
        }
      } catch (err) {
        console.error("Error fetching cameras:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCameras();
  }, []);

  useEffect(() => {
    if (selectedCamera.id) {
      fetchSpeedData(selectedCamera.id);
      fetchVehicleTypeData(selectedCamera.id);
    }
  }, [selectedCamera.id, timeRange.hours]);

  // Function to fetch real-time speed data for the selected camera
  const fetchSpeedData = async (cameraId: string) => {
    if (!cameraId) return;

    try {
      setSpeedData((prev) => ({ ...prev, isLoading: true }));

      // Get speed data for the selected time range
      const response = await getCameraSpeedData({ 
        cameraId, 
        hours: timeRange.hours 
      });

      console.log(response);

      if (response && response.data) {
        let formattedData = response.data;
        
        // If we have more than 12 data points, select 12 evenly distributed points
        if (formattedData.length > 12) {
          const step = (formattedData.length - 1) / 11; // To get exactly 12 points
          const distributedData = [];
          
          for (let i = 0; i < 12; i++) {
            const index = Math.min(Math.floor(i * step), formattedData.length - 1);
            distributedData.push(formattedData[index]);
          }
          
          formattedData = distributedData;
        }
        // If we have fewer than 12 data points, use all available data

        // Format data for display
        const timestamps = formattedData.map((item: any) =>
          new Date(item.timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );

        const speeds = formattedData.map((item: any) => item.averageSpeed || 0);
        const vehicleCounts = formattedData.map(
          (item: any) => item.vehicleCount || 0
        );

        setSpeedData({
          timestamps,
          speeds,
          vehicleCounts,
          isLoading: false,
        });

        // Update the analytics data with the latest values
        if (speeds.length > 0 && vehicleCounts.length > 0) {
          setAnalyticsData((prev) => ({
            ...prev,
            avgSpeed: Math.round(speeds[speeds.length - 1]),
            totalVehicles: vehicleCounts.reduce(
              (sum: number, count: number) => sum + count,
              0
            ),
            congestionPercent: calculateCongestion(
              formattedData[formattedData.length - 1].congestionLevel
            ),
            congestionLevel: getCongestionLevel(
              formattedData[formattedData.length - 1].congestionLevel
            ),
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching speed data:", error);
      setSpeedData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Function to fetch vehicle type data
  const fetchVehicleTypeData = async (cameraId: string) => {
    if (!cameraId) return;

    try {
      setVehicleTypeData((prev) => ({ ...prev, isLoading: true }));

      // Get vehicle type data for the selected time range
      const response = await getVehicleTypeData({ 
        cameraId, 
        hours: timeRange.hours 
      });

      console.log("Vehicle type data:", response);

      if (response && response.vehicleTypes) {
        setVehicleTypeData({
          totalVehicles: response.totalVehicles,
          vehicleTypes: {
            motorcycle: response.vehicleTypes.motorcycle,
            car: response.vehicleTypes.car,
            truck: response.vehicleTypes.truck,
            bus: response.vehicleTypes.bus
          },
          isLoading: false
        });

        // Update analytics data
        setAnalyticsData((prev) => ({
          ...prev,
          totalVehicles: response.totalVehicles
        }));
      }
    } catch (error) {
      console.error("Error fetching vehicle type data:", error);
      setVehicleTypeData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updateSnapshotUrl = (cameraId: string) => {
    if (cameraId) {
      setSnapshotUrl(
        `http://camera.thongtingiaothong.vn/api/snapshot/${cameraId}?t=${Date.now()}`
      );
    }
  };

  useEffect(() => {
    if (isPlaying && selectedCamera.id) {
      const refreshInterval = setInterval(() => {
        updateSnapshotUrl(selectedCamera.id);
      }, 10000);

      return () => {
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }
      };
    }
  }, [isPlaying, selectedCamera.id]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRefreshRateChange = (newRate: number) => {
    setRefreshRate(newRate);
  };

  const handleCameraSelect = (camera: any) => {
    setSelectedCamera(camera);
    updateSnapshotUrl(camera.id);
  };

  const handleMapCameraSelect = (camera: Camera) => {
    setSelectedCamera(camera);
    updateSnapshotUrl(camera.id);
  };

  const handleFullScreenToggle = () => {
    if (feedContainerRef.current) {
      if (!isFullScreen) {
        if (feedContainerRef.current.requestFullscreen) {
          feedContainerRef.current.requestFullscreen();
        } else if ((feedContainerRef.current as any).webkitRequestFullscreen) {
          (feedContainerRef.current as any).webkitRequestFullscreen();
        } else if ((feedContainerRef.current as any).msRequestFullscreen) {
          (feedContainerRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentDateTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentDateTime.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const vehicleOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false },
      fontFamily: "Inter",
      background: "transparent",
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 0,
        blur: 4,
        opacity: 0.1,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    grid: {
      show: true,
      borderColor: "#f1f1f1",
      strokeDashArray: 1,
      position: "back",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#2563eb"],
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: speedData.timestamps,
      labels: {
        style: {
          colors: ["#718096"],
          fontSize: "11px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 60,
      tickAmount: 4,
      labels: {
        style: {
          colors: ["#718096"],
          fontSize: "11px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
        },
        formatter: function (value: number) {
          return value.toFixed(0);
        },
      },
    },
    colors: ["#3b82f6"],
    tooltip: {
      theme: "light",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      x: {
        show: true,
        format: "HH:mm",
      },
      y: {
        formatter: function (value: number) {
          return value + " xe";
        },
      },
      marker: {
        show: true,
      },
    },
    markers: {
      size: 5,
      colors: ["#3b82f6"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
  };

  const speedOptions: ApexOptions = {
    ...vehicleOptions,
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#10b981"],
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    colors: ["#059669"],
    tooltip: {
      ...vehicleOptions.tooltip,
      y: {
        formatter: function (value: number) {
          return value + " km/h";
        },
      },
    },
    markers: {
      ...vehicleOptions.markers,
      colors: ["#059669"],
    },
  };

  const vehicleSeries = [
    {
      name: "Số lượng phương tiện",
      data: speedData.vehicleCounts,
    },
  ];

  const speedSeries = [
    {
      name: "Tốc độ trung bình",
      data: speedData.speeds,
    },
  ];

  return (
    <div className="flex flex-col gap-6 mx-auto px-4 py-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Camera className="h-5 w-5 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Giám sát giao thông
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Theo dõi và phân tích tình hình giao thông trực tiếp
          </p>
        </div>
        <div className="flex flex-col items-end mt-2 md:mt-0 space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              {formattedTime}
            </span>
          </div>
          <span className="text-xs text-slate-500 capitalize">
            {formattedDate}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative" ref={feedContainerRef}>
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                {isTestMode ? (
                  // <video
                  //   src={testVideoUrl}
                  //   controls
                  //   autoPlay
                  //   className="w-full h-full object-contain"
                  // />
                  <iframe
                    width="946"
                    height="514"
                    src="https://www.youtube.com/embed/cCrahzMyTko"
                    title="Speed estimation"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : snapshotUrl && selectedCamera.id ? (
                  <Image
                    src={snapshotUrl}
                    alt={`Camera feed from ${selectedCamera.name}`}
                    className="w-full h-full object-contain"
                    onError={() => {
                      console.error("Error loading snapshot");
                    }}
                    width={1280}
                    height={720}
                  />
                ) : (
                  <div className="text-center px-6 py-10">
                    <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                      <Camera className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-white font-medium mb-3">
                      {selectedCamera.name}
                    </p>
                    <p className="text-sm text-slate-400">
                      Đang tải dữ liệu video...
                    </p>
                  </div>
                )}
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedCamera.status === "online"
                      ? "bg-green-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                ></span>
                <span className="text-xs font-medium text-white capitalize">
                  {selectedCamera.status === "online"
                    ? "Trực tuyến"
                    : "Ngoại tuyến"}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/30 text-white p-3 flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  onClick={() => updateSnapshotUrl(selectedCamera.id)}
                >
                  <RefreshCw size={16} />
                </button>
                <div className="flex-1"></div>
                <button
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  onClick={handleFullScreenToggle}
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  {selectedCamera.name}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dữ liệu từ camera được chọn trên bản đồ. Nhấn vào biểu tượng
                camera để thay đổi góc nhìn.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span>Dữ liệu phân tích</span>
                </CardTitle>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                  Cập nhật: {formattedTime}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="tongquan" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <TabsTrigger
                    value="tongquan"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300"
                  >
                    Tổng quan
                  </TabsTrigger>
                  <TabsTrigger
                    value="phuongtien"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300"
                  >
                    Phương tiện
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tongquan">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-800/70">
                      <CardContent className="pt-4 text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-blue-900/40">
                          <Car className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                        </div>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          {analyticsData.totalVehicles}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Tổng phương tiện
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-emerald-50 to-white dark:from-slate-800 dark:to-slate-800/70">
                      <CardContent className="pt-4 text-center">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-emerald-900/40">
                          <TrendingUp className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                        </div>
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                          {analyticsData.avgSpeed} km/h
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Tốc độ trung bình
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-amber-50 to-white dark:from-slate-800 dark:to-slate-800/70">
                      <CardContent className="pt-4 text-center">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-amber-900/40">
                          <BarChart3 className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                        </div>
                        <div
                          className={`text-sm font-bold ${getCongestionColorClass(
                            selectedCamera.id
                              ? extractCongestionLevel(
                                  analyticsData.congestionLevel
                                )
                              : "default"
                          )} px-2 rounded-full py-1 inline-block`}
                        >
                          {getShortCongestionText(
                            selectedCamera.id
                              ? extractCongestionLevel(
                                  analyticsData.congestionLevel
                                )
                              : "default"
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Mức độ ùn tắc
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-red-50 to-white dark:from-slate-800 dark:to-slate-800/70">
                      <CardContent className="pt-4 text-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-red-900/40">
                          <AlertTriangle className="h-4 w-4 text-red-700 dark:text-red-300" />
                        </div>
                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                          {analyticsData.incidents}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Sự cố phát hiện
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-5 p-3 bg-white rounded-lg shadow-sm dark:bg-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Mức độ ùn tắc
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCongestionColorClass(
                          selectedCamera.id
                            ? extractCongestionLevel(
                                analyticsData.congestionLevel
                              )
                            : "default"
                        )}`}
                      >
                        {analyticsData.congestionPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                      <div
                        className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${analyticsData.congestionPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Thông thoáng
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Kẹt xe
                      </span>
                    </div>
                    <div className="text-xs text-center mt-2 text-slate-600 dark:text-slate-400">
                      {selectedCamera.id
                        ? analyticsData.congestionLevel
                        : "Chọn camera để xem mức độ ùn tắc"}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="phuongtien"
                  className="animate-in fade-in-50 duration-300"
                >
                  <div className="space-y-4 p-3 bg-white rounded-lg shadow-sm dark:bg-slate-800">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">
                          Phân loại phương tiện
                        </span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                        Tổng: {analyticsData.totalVehicles}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-xs font-medium w-20 text-slate-700 dark:text-slate-300">
                          Xe máy
                        </span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: "72%" }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          69{" "}
                          <span className="text-slate-500 font-normal">
                            (72%)
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-xs font-medium w-20 text-slate-700 dark:text-slate-300">
                          Ô tô
                        </span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                            <div
                              className="bg-green-500 h-full rounded-full"
                              style={{ width: "22%" }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          21{" "}
                          <span className="text-slate-500 font-normal">
                            (22%)
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-xs font-medium w-20 text-slate-700 dark:text-slate-300">
                          Xe tải
                        </span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: "5%" }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          5{" "}
                          <span className="text-slate-500 font-normal">
                            (5%)
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-xs font-medium w-20 text-slate-700 dark:text-slate-300">
                          Xe buýt
                        </span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                            <div
                              className="bg-purple-500 h-full rounded-full"
                              style={{ width: "1%" }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          1{" "}
                          <span className="text-slate-500 font-normal">
                            (1%)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
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
                    onClick={() => setIsTestMode(!isTestMode)}
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
                    onClick: () => handleMapCameraSelect(camera),
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
            </TabsContent>

            <TabsContent
              value="thongke"
              className="animate-in fade-in-50 duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Car className="h-3.5 w-3.5 text-blue-600" />
                      Số lượng phương tiện
                    </h3>
                    <div className="flex items-center gap-2">
                      <select 
                        className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full dark:bg-slate-700 dark:text-slate-300 border-none focus:ring-1 focus:ring-blue-500"
                        value={timeRange.hours}
                        onChange={(e) => setTimeRange({ 
                          hours: Number(e.target.value), 
                          label: e.target.options[e.target.selectedIndex].text 
                        })}
                      >
                        <option value="0.5">30 phút</option>
                        <option value="1">1 giờ</option>
                        <option value="24">1 ngày</option>
                      </select>
                    </div>
                  </div>
                  <div className="h-[250px]">
                    <ReactApexChart
                      options={vehicleOptions}
                      series={vehicleSeries}
                      type="line"
                      height={250}
                    />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                      Tốc độ trung bình (km/h)
                    </h3>
                    <div className="flex items-center gap-2">
                      <select 
                        className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full dark:bg-slate-700 dark:text-slate-300 border-none focus:ring-1 focus:ring-blue-500"
                        value={timeRange.hours}
                        onChange={(e) => setTimeRange({ 
                          hours: Number(e.target.value), 
                          label: e.target.options[e.target.selectedIndex].text 
                        })}
                      >
                        <option value="0.5">30 phút</option>
                        <option value="1">1 giờ</option>
                        <option value="24">1 ngày</option>
                      </select>
                    </div>
                  </div>
                  <div className="h-[250px]">
                    <ReactApexChart
                      options={speedOptions}
                      series={speedSeries}
                      type="line"
                      height={250}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
