"use client";

import React from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// import "@/app/globals.css";

const Page: React.FC = () => {
  return (
    <>
      {/* Giới thiệu và hình ảnh minh họa */}
      <div className="h-[auto] p-4 relative w-full flex items-center bg-white">
        <div
          className="w-1/2 "
        >
          <h1 className="text-5xl font-bold p-4 text-left">
            Hệ thống giám sát
            <div
              className="pt-4"
            >
              giao thông đô thị
            </div>
          </h1>
          <p className="text-lg p-5 text-justify">
            Theo dõi, phân tích và tối ưu hóa lưu thông một cách thông minh và hiệu quả. Cập nhật trạng thái giao thông theo thời gian thực để hỗ trợ di chuyển an toàn và tiện lợi.
          </p>
        </div>
        <div
          className="w-1/2"
        >
          <img 
            src="/image/giaothonghcm.jpg" 
            alt="Giao thông HCM" 
            className="w-full h-auto rounded-lg" 
          />
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
          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm w-1/4 m-2"
            data-v0-t="card"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Tổng phương tiện
              </h3>
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
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% so với giờ trước
              </p>
            </div>
          </div>

          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm w-1/4 m-2"
            data-v0-t="card"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Camera hoạt động
              </h3>
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
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">12/15</div>
              <p className="text-xs text-muted-foreground">
                3 camera đang bảo trì
              </p>
            </div>
          </div>

          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm w-1/4 m-2"
            data-v0-t="card"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Cảnh báo
              </h3>
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
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Trong 24h qua
              </p>
            </div>
          </div>

          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm w-1/4 m-2"
            data-v0-t="card"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Thời tiết
              </h3>
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
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">35&deg;C</div>
              <p className="text-xs text-muted-foreground">
                Cập nhật lúc 14:35 ngày 06/03/2025
              </p>
            </div>
          </div>
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
              <a href="/map">Xem chi tiết bản đồ</a>
            </div>
          </div>
          <div
            className="h-[450] z-0"
          >
            <div
              className="h-full"
            >
              {typeof window !== "undefined" && (
                <MapContainer
                  center={[10.762622, 106.660172]}
                  zoom={15}
                  scrollWheelZoom={true}
                  className="w-full h-full z-0"
                  zoomControl={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <ZoomControl position="bottomright" />
                </MapContainer>
              )}
            </div>
          </div>
        </div>
        
        {/* Xem camera an ninh */}
        <div
          className="w-5/12 m-2 p-5 border-2 rounded-lg bg-white"
        >
          <div
            className="py-3"
          >
            <p
              className="text-2xl font-bold"
            >
              Camera giao thông
            </p>
          </div>
          <div
            className="h-[450] overflow-y-auto"
          >
            <p>Đang cập nhật dữ liệu ...</p>
          </div>
        </div>
      </div>  
    </>
  );
};

export default Page;
