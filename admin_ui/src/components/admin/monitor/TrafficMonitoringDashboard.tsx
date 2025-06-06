"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  getCameras, 
  getCameraSpeedData, 
  getVehicleTypeData 
} from "@/apis/trafficApi";

import { DashboardHeader } from "./DashboardHeader";
import { VideoFeed } from "./VideoFeed";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { MapAndStats } from "./MapAndStats";
import { 
  Camera, 
  VehicleTypeData, 
  SpeedData, 
  AnalyticsData, 
  TimeRange 
} from "./types";
import { 
  calculateCongestion, 
  getCongestionLevel 
} from "./utils";

export function TrafficMonitoringDashboard() {
  // Camera and UI state
  const [selectedCamera, setSelectedCamera] = useState<Camera & { name: string }>({
    id: "",
    name: "Hãy chọn một camera",
    status: "online",
    location: { lat: 0, lng: 0 }
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const [availableCameras, setAvailableCameras] = useState<Camera[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 10.7731, lng: 106.7024 });
  const [mapZoom, setMapZoom] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [snapshotUrl, setSnapshotUrl] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRange>({ 
    hours: 1, 
    label: '1 giờ' 
  });
  
  // Data states
  const [vehicleTypeData, setVehicleTypeData] = useState<VehicleTypeData>({
    totalVehicles: 100,
    vehicleTypes: {
      motorcycle: { count: 52, percentage: 52 },
      car: { count: 30, percentage: 29 },
      truck: { count: 0, percentage: 0 },
      bus: { count: 19, percentage: 19 }
    },
    isLoading: false,
  });

  const [speedData, setSpeedData] = useState<SpeedData>({
    timestamps: ["09:30 AM", "09:45 AM", "09:59 AM", "10:19 AM", "10:34 AM"],
    speeds: [30, 45, 25, 35, 20],
    vehicleCounts: [20, 45, 30, 50, 35],
    isLoading: false,
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalVehicles: 100,
    avgSpeed: 0,
    congestionLevel: "Đang tải...",
    incidents: 0,
    congestionPercent: 0,
  });

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update snapshot URL
  const updateSnapshotUrl = useCallback((cameraId: string) => {
    if (cameraId) {
      setSnapshotUrl(
        `http://camera.thongtingiaothong.vn/api/snapshot/${cameraId}?t=${Date.now()}`
      );
    }
  }, []);

  // Fetch speed data for the selected camera
  const fetchSpeedData = useCallback(async (cameraId: string) => {
    if (!cameraId) return;

    try {
      setSpeedData((prev) => ({ ...prev, isLoading: true }));

      // Get speed data for the selected time range
      const response = await getCameraSpeedData({ 
        cameraId, 
        hours: timeRange.hours 
      });

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
        // Format data for display
        const timestamps = formattedData.map((item: any) => {
          // Parse DD/MM/YYYY HH:MM:SS format
          const [datePart, timePart] = item.timestamp.split(' ');
          if (datePart && timePart) {
            const [day, month, year] = datePart.split('/');
            const dateObj = new Date(`${year}-${month}-${day}T${timePart}`);
            
            return dateObj.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            });
          }
          return "00:00"; // Fallback
        });


        const speeds = formattedData.map((item: any) => item.averageSpeed || 0);
        const vehicleCounts = formattedData.map(
          (item: any) => item.vehicleCount || Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000
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
            totalVehicles: vehicleCounts[vehicleCounts.length - 1],
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
  }, [timeRange.hours]);

  // Fetch vehicle type data
  const fetchVehicleTypeData = useCallback(async (cameraId: string) => {
    if (!cameraId) return;

    try {
      setVehicleTypeData((prev) => ({ ...prev, isLoading: true }));

      // Get vehicle type data for the selected time range
      const response = await getVehicleTypeData({ 
        cameraId, 
        hours: timeRange.hours 
      });


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
  }, [timeRange.hours]);

  // Fetch cameras on initial load
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
          // Find the first active/online camera
            const activeCamera: Camera & { name: string } = camerasData.find((camera: Camera & { name: string }) => camera.status === "online") || camerasData[0];
          setSelectedCamera(activeCamera);
          updateSnapshotUrl(activeCamera.id);
        }
      } catch (err) {
        console.error("Error fetching cameras:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCameras();
  }, [updateSnapshotUrl]);

  // Fetch data when selected camera or time range changes
  useEffect(() => {
    if (selectedCamera.id) {
      fetchSpeedData(selectedCamera.id);
      fetchVehicleTypeData(selectedCamera.id);
    }
  }, [selectedCamera.id, timeRange.hours, fetchSpeedData, fetchVehicleTypeData]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-refresh snapshot when playing
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
  }, [isPlaying, selectedCamera.id, updateSnapshotUrl]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCameraSelect = (camera: Camera) => {
    setSelectedCamera(camera as Camera & { name: string });
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

  const handleTestModeToggle = () => {
    setIsTestMode(!isTestMode);
  };

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
  };

  const formattedTime = currentDateTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex flex-col gap-6 mx-auto px-4 py-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-lg shadow-sm">
      {/* Dashboard Header */}
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feed */}
        <div className="lg:col-span-2">
          <VideoFeed 
            selectedCamera={selectedCamera}
            isTestMode={isTestMode}
            isPlaying={isPlaying}
            snapshotUrl={snapshotUrl}
            onPlayPause={handlePlayPause}
            onRefreshSnapshot={updateSnapshotUrl}
            onFullScreenToggle={handleFullScreenToggle}
          />
        </div>

        {/* Analytics Dashboard */}
        <div>
          <AnalyticsDashboard 
            analyticsData={analyticsData}
            vehicleTypeData={vehicleTypeData}
            selectedCameraId={selectedCamera.id}
            formattedTime={formattedTime}
            isTestMode={isTestMode}
          />
        </div>
      </div>

      {/* Map and Statistics */}
      <MapAndStats 
        selectedCamera={selectedCamera}
        availableCameras={availableCameras}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        isTestMode={isTestMode}
        speedData={speedData}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onTestModeToggle={handleTestModeToggle}
        onCameraSelect={handleCameraSelect}
      />
    </div>
  );
}
