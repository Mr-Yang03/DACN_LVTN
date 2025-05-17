"use client";

import React from "react";
import "leaflet/dist/leaflet.css";
import GoongMap from "@/components/ui/GoongMap";
import CardStatistic from "@/components/ui/CardStatistic";
import { useOpenWeather } from "@/hooks/useOpenWeather";
import { useEffect, useState } from "react";
import { getCameras } from "@/apis/trafficApi";
import Image from "next/image";
import {
  CarIcon,
  CameraIcon,
  TriangleAlertIcon,
  SunIcon,
  ChevronsRightIcon,
  PressureIcon,
  VisibilityIcon,
  HumidityIcon,
  WindIcon,
} from "@/components/icons";

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
  const {
    data: weather,
    loading: weatherLoading,
    error: weatherError,
  } = useOpenWeather("Thành phố Hồ Chí Minh");
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraUrls, setCameraUrls] = useState<{ [key: string]: string }>({});

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

  const activeCameras = cameras.filter(
    (camera) => camera.Status === "active" && camera.SnapshotUrl
  );
  const inactiveCameras = cameras.filter(
    (camera) => camera.Status !== "active"
  );
  // Prepare camera IDs and snapshot URLs to use in the effect
  const cameraRefs = React.useRef<{
    ids: string[];
    urls: { [key: string]: string | null };
  }>({
    ids: [],
    urls: {},
  });

  // Update refs when active cameras change
  useEffect(() => {
    const firstthree = activeCameras.slice(0, 3);
    cameraRefs.current = {
      ids: firstthree.map((cam) => cam.Id),
      urls: Object.fromEntries(
        firstthree.map((cam) => [cam.Id, cam.SnapshotUrl])
      ),
    };
  }, [activeCameras]);

  // Update camera snapshots every 1 second
  useEffect(() => {
    if (cameraRefs.current.ids.length === 0) return;

    // Set initial URLs
    const timestamp = Date.now();
    const initialUrls: { [key: string]: string } = {};
    cameraRefs.current.ids.forEach((id) => {
      const snapshotUrl = cameraRefs.current.urls[id];
      if (snapshotUrl) {
        initialUrls[id] = `${snapshotUrl}?t=${timestamp}`;
      }
    });

    setCameraUrls(initialUrls);

    // Set up interval to refresh camera snapshots every 1 second
    const interval = setInterval(() => {
      setCameraUrls((prevUrls) => {
        const newTimestamp = Date.now();
        const newUrls = { ...prevUrls };
        cameraRefs.current.ids.forEach((id) => {
          const snapshotUrl = cameraRefs.current.urls[id];
          if (snapshotUrl) {
            newUrls[id] = `${snapshotUrl}?t=${newTimestamp}`;
          }
        });
        return newUrls;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cameraRefs.current.ids.length]);

  return (
    <>
      {/* Giới thiệu và hình ảnh minh họa */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[center_top_-1px]" />
        <div className="absolute inset-0 bg-[url('/image/giaothonghcm.jpg?height=600&width=1200')] bg-cover bg-center" />
        <div className="container relative z-10 py-12">
          <div className="max-w-2xl m-10 p-10 bg-gray-400 bg-opacity-80 rounded-lg">
            <h1 className="text-5xl font-bold p-4 text-left text-gray-100">
              Hệ thống giám sát
              <div className="pt-4">giao thông đô thị</div>
            </h1>
            <p className="text-lg p-5 text-justify text-gray-100">
              Theo dõi, phân tích và tối ưu hóa lưu thông một cách thông minh và
              hiệu quả. Cập nhật trạng thái giao thông theo thời gian thực để hỗ
              trợ di chuyển an toàn và tiện lợi.
            </p>
          </div>
        </div>
      </div>

      {/* Tóm tắt dữ liệu giao thông */}
      <div className="w-full flex flex-col p-4">
        <div className="p-2 flex">
          <div className="w-4/5">
            <p className="text-3xl font-bold">
              <a href="#">Thống kê</a>
            </p>
          </div>
        </div>        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Card 1: Tổng phương tiện */}
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng phương tiện</p>
                <h3 className="text-2xl font-bold mt-1">1,234</h3>
                <p className="text-xs text-green-600 mt-1">+20.1% so với giờ trước</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-full">
                <CarIcon className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Card 2: Camera hoạt động */}
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Camera hoạt động</p>
                <h3 className="text-2xl font-bold mt-1">{`${activeCameras.length}/${cameras.length}`}</h3>
                <p className="text-xs text-gray-600 mt-1">{`${inactiveCameras.length} camera đang bảo trì`}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-full">
                <CameraIcon className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Card 3: Cảnh báo */}
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cảnh báo</p>
                <h3 className="text-2xl font-bold mt-1">3</h3>
                <p className="text-xs text-gray-600 mt-1">Trong 24h qua</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-full">
                <TriangleAlertIcon className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Card 4: Thời tiết */}
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Thời tiết tại TP. Hồ Chí Minh</p>
                <h3 className="text-2xl font-bold mt-1">
                  {weatherLoading
                    ? "Đang tải..."
                    : weatherError
                    ? "Lỗi"
                    : weather
                    ? `${weather.temp}°C`
                    : "--"}
                </h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {weatherLoading
                    ? "Đang lấy dữ liệu thời tiết"
                    : weatherError
                    ? weatherError
                    : weather
                    ? `Trạng thái: ${weather.description}, cập nhật lúc ${weather.time}`
                    : ""}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-full">
                <SunIcon className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Xem bản đồ và camera an ninh */}
      <div className="w-full flex flex-col lg:flex-row items-center px-4">
        {/* Bản đồ giao thông */}
        <div className="w-full lg:w-7/12 m-2 p-5 border-2 rounded-lg bg-white">
          <div className="py-3 flex flex-col sm:flex-row">
            <div className="flex w-full sm:w-1/2 mb-2 sm:mb-0">
              <p className="text-xl sm:text-2xl font-bold">
                <a href="/map">Bản đồ giao thông</a>
              </p>
            </div>{" "}
            <div className="flex w-full sm:w-1/2 justify-start sm:justify-end items-center text-blue-600">
              <ChevronsRightIcon />
              <a href="/ggmap">Xem chi tiết bản đồ</a>
            </div>
          </div>
          <div className="h-[20rem] sm:h-[25rem] md:h-[28rem] z-0">
            <div className="h-full">
              {typeof window !== "undefined" && (
                <GoongMap controls={{ navigation: true, geolocate: true }} />
              )}
            </div>
          </div>
        </div>

        {/* Xem camera an ninh */}
        <div className="w-full lg:w-5/12 m-2 p-5 border-2 rounded-lg bg-white">
          <div className="py-3 flex flex-col sm:flex-row">
            <div className="flex w-full sm:w-3/5 mb-2 sm:mb-0">
              <p className="text-xl sm:text-2xl font-bold">Camera giao thông</p>
            </div>{" "}
            <div className="flex w-full sm:w-2/5 justify-start sm:justify-end items-center text-blue-600">
              <ChevronsRightIcon />
              <a href="/ggmap">Xem thêm camera</a>
            </div>
          </div>{" "}
          <div className="h-[350px] sm:h-[400px] md:h-[450px] overflow-hidden">
            {activeCameras.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Không có camera hoạt động</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
                {cameraRefs.current.ids.slice(0, 3).map((id, index) => {
                  const camera = activeCameras.find((c) => c.Id === id);
                  if (!camera) return null;

                  return (
                    <div
                      key={id}
                      className={`relative border border-gray-300 rounded-lg overflow-hidden ${
                        index === 0 ? "sm:row-span-2 sm:col-span-2" : ""
                      }`}
                    >
                      <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-br-md z-10">
                        {camera.DisplayName}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-green-600 text-white text-[10px] px-1 py-0.5 rounded-tl-md z-10">
                        LIVE
                      </div>
                      <div
                        className={`relative ${
                          index === 0 
                            ? "h-[200px] sm:h-[300px]" 
                            : "h-[120px] sm:h-[145px]"
                        } w-full`}
                      >
                        <Image
                          src={cameraUrls[id] || "/placeholder.png"}
                          alt={camera.DisplayName || "Camera"}
                          fill
                          className="object-cover"
                          priority={index === 0}
                          sizes={index === 0 ? "100vw" : "50vw"}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thông tin thời tiết chi tiết */}
      <div className="w-full flex flex-col px-4 mb-10">
        <div className="w-full m-2 p-3 sm:p-5 border-2 rounded-lg bg-white">
          <div className="py-3 flex">
            <div className="flex w-full">
              <p className="text-xl sm:text-2xl font-bold pb-2">Thông tin thời tiết</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Thông tin hiện tại */}
            <div className="col-span-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
                {weather?.city || "TP. Hồ Chí Minh"}
              </h3>

              {weatherLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : weatherError ? (
                <div className="text-center py-10">
                  <p className="text-lg">Không thể tải dữ liệu thời tiết</p>
                  <p className="text-sm mt-2">{weatherError}</p>
                </div>
              ) : weather ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl sm:text-5xl font-bold">{weather.temp}°C</div>
                      <div className="mt-2 capitalize">
                        {weather.description}
                      </div>
                      <div className="text-xs sm:text-sm mt-1">
                        Cập nhật: {weather.time}
                      </div>
                    </div>
                    <div className="weather-icon">
                      <Image
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt="weather icon"
                        width={60}
                        height={60}
                        unoptimized
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg">Chưa có dữ liệu thời tiết</p>
                </div>
              )}
            </div>

            {/* Chỉ số chất lượng không khí */}
            {/* Đoạn này không có dữ liệu AQI, PM2.5, PM10 nên sẽ thay bằng thông tin mây và nhiệt độ cảm nhận được */}
            <div className="col-span-1 bg-white rounded-xl p-6 shadow border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Thông tin bổ sung
              </h3>
              {weather ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Nhiệt độ cảm nhận</span>
                    <span className="text-blue-600 font-semibold">
                      {weather.feels_like}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mặt trời mọc</span>
                    <span className="text-blue-600 font-semibold">
                      {weather.sunrise}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mặt trời lặn</span>
                    <span className="text-blue-600 font-semibold">
                      {weather.sunset}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg">Không có dữ liệu</p>
                </div>
              )}
            </div>

            {/* Thông tin chi tiết khác */}
            <div className="col-span-1 bg-white rounded-xl p-6 shadow border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Thông số chi tiết
              </h3>
              {weather ? (
                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  <div className="flex items-center">
                    <PressureIcon className="text-blue-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Áp suất</div>
                      <div className="text-md font-medium">
                        {weather.pressure} hPa
                      </div>
                    </div>
                  </div>{" "}
                  <div className="flex items-center">
                    <VisibilityIcon className="text-blue-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Tầm nhìn</div>
                      <div className="text-md font-medium">
                        {weather.visibility / 1000} km
                      </div>
                    </div>
                  </div>{" "}
                  <div className="flex items-center">
                    <HumidityIcon className="text-blue-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Độ ẩm</div>
                      <div className="text-md font-medium">
                        {weather.humidity}%
                      </div>
                    </div>
                  </div>{" "}
                  <div className="flex items-center">
                    <WindIcon className="text-blue-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Gió</div>
                      <div className="text-md font-medium">
                        {weather.wind_speed} km/h
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-500">Không có dữ liệu</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
