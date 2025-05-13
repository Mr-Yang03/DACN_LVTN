"use client";

import React from "react";
import "leaflet/dist/leaflet.css";
import GoongMap from "@/components/ui/GoongMap";
import CardStatistic from "@/components/ui/CardStatistic";
import { useWeather } from "@/hooks/useWeather";
import { useEffect, useState } from "react";
import { getCameras } from "@/apis/trafficApi";
import Image from "next/image";

interface Camera {
  Id: string;
  Title: string;
  DisplayName: string;
  SnapshotUrl: string | null;
  Location: {
    type: "Point";
    coordinates: [number, number];
  };
  Status: string;
}

const Page: React.FC = () => {
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCameras = async () => {
    try {
      setIsLoading(true);
      const response = await getCameras({});
      setCameras(response.cameras);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const activeCameras = cameras.filter((camera) => camera.Status === "active");
  const inactiveCameras = cameras.filter((camera) => camera.Status !== "active");

  return (
    <>
      {/* Giới thiệu và hình ảnh minh họa */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[center_top_-1px]" />
        <div
            className="absolute inset-0 bg-[url('/image/giaothonghcm.jpg?height=600&width=1200')] bg-cover bg-center"
        />
        <div
          className="container relative z-10 py-12"
        >
          <div
            className="max-w-2xl m-10 p-10 bg-gray-400 bg-opacity-80 rounded-lg"
          >
            <h1 className="text-5xl font-bold p-4 text-left text-gray-100">
              Hệ thống giám sát
              <div
                className="pt-4"
              >
                giao thông đô thị
              </div>
            </h1>
            <p className="text-lg p-5 text-justify text-gray-100">
              Theo dõi, phân tích và tối ưu hóa lưu thông một cách thông minh và hiệu quả. Cập nhật trạng thái giao thông theo thời gian thực để hỗ trợ di chuyển an toàn và tiện lợi.
            </p>
          </div>
        </div>
      </div>

      {/* Tóm tắt dữ liệu giao thông */} 
      <div
        className="w-full flex flex-col p-4"
      >
        <div
          className="p-2 flex"
        >
          <div
            className="w-4/5"
          >
            <p
              className="text-3xl font-bold"
            >
              <a href="#">Thống kê</a>
            </p>
          </div>
            
          <div
            className="w-1/5 flex items-center justify-center text-blue-600"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-chevrons-right"
            >
              <path d="m6 17 5-5-5-5"/>
              <path d="m13 17 5-5-5-5"/>
            </svg>
            <a href="#">Xem thống kê chi tiết</a>
          </div>
        </div>
        <div
          className="w-full flex items-center justify-between"
        >
          <CardStatistic
            title="Tổng phương tiện"
            value="1,234"
            description="+20.1% so với giờ trước"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-car h-4 w-4 text-muted-foreground"
              >
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                <circle cx="7" cy="17" r="2"></circle>
                <path d="M9 17h6"></path>
                <circle cx="17" cy="17" r="2"></circle>
              </svg>
            }
          />
          <CardStatistic
            title="Camera hoạt động"
            value={`${activeCameras.length}/${cameras.length}`}
            description={`${inactiveCameras.length} camera đang bảo trì`}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-camera h-4 w-4 text-muted-foreground"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            }
          />
          <CardStatistic
            title="Cảnh báo"
            value="3"
            description="Trong 24h qua"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-triangle-alert h-4 w-4 text-muted-foreground"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
              </svg>
            }
          />
          <CardStatistic
            title="Thời tiết tại TP. Hồ Chí Minh"
            value={weatherLoading ? "Đang tải..." : weatherError ? "Lỗi" : weather ? `${weather.temp}°C` : "--"}
            description={weatherLoading ? "Đang lấy dữ liệu thời tiết" : weatherError ? weatherError : weather ? `Trạng thái: ${weather.description}, cập nhật lúc ${weather.time}` : ""}
            icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-sun h-4 w-4 text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2"/>
                  <path d="M12 20v2"/>
                  <path d="m4.93 4.93 1.41 1.41"/>
                  <path d="m17.66 17.66 1.41 1.41"/>
                  <path d="M2 12h2"/>
                  <path d="M20 12h2"/>
                  <path d="m6.34 17.66-1.41 1.41"/>
                  <path d="m19.07 4.93-1.41 1.41"/>
                </svg>
            }
          />
        </div>
      </div>

      {/* Xem bản đồ và camera an ninh */}
      <div
        className="w-full flex items-center px-4"
      >
        {/* Bản đồ giao thông */}
        <div
          className="w-7/12 m-2 p-5 border-2 rounded-lg bg-white"
        >
          <div
            className="py-3 flex"
          >
            <div
              className="flex w-1/2"
            >
              <p
                className="text-2xl font-bold"
              >
                <a href="/map">
                  Bản đồ giao thông
                </a>
              </p>
            </div>
            <div
              className="flex w-1/2 justify-end items-center text-blue-600"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-chevrons-right"
              >
                <path d="m6 17 5-5-5-5"/>
                <path d="m13 17 5-5-5-5"/>
              </svg>
              <a href="/ggmap">Xem chi tiết bản đồ</a>
            </div>
          </div>
          <div
            className="h-[28rem] z-0"
          >
            <div
              className="h-full"
            >
              {typeof window !== "undefined" && (
                <GoongMap controls={{ navigation: true, geolocate: true}} />
              )}
            </div>
          </div>
        </div>
        
        {/* Xem camera an ninh */}
        <div
          className="w-5/12 m-2 p-5 border-2 rounded-lg bg-white"
        >
          <div
            className="py-3 flex"
          >
            <div className="flex w-3/5">
              <p
                className="text-2xl font-bold"
              >
                Camera giao thông
              </p>
            </div>
            <div
              className="flex w-2/5 justify-end items-center text-blue-600"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-chevrons-right"
              >
                <path d="m6 17 5-5-5-5"/>
                <path d="m13 17 5-5-5-5"/>
              </svg>
              <a href="/ggmap">Xem thêm camera</a>
            </div>
          </div>
          <div
            className="h-[450] overflow-y-auto"
          >
            <div className="grid grid-rows-2 gap-2">
              <div className="p-2 border-gray-900 border-2 rounded-lg">
                <div key={activeCameras[0]?.Id} className="relative w-full h-[200px]">
                  <Image
                    src={activeCameras[0]?.SnapshotUrl || "/placeholder.png"}
                    alt={activeCameras[0]?.DisplayName || "Camera"}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {activeCameras.slice(3, 7).map((camera) => (
                  <div key={camera.Id} className="w-full">
                    <div className="relative h-[100px]">
                      <Image
                        src={camera.SnapshotUrl || "/placeholder.png"}
                        alt={camera.DisplayName || "Camera"}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>  
    </>
  );
}

export default Page;
