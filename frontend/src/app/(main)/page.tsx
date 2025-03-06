"use client";

import React from "react";
import "leaflet/dist/leaflet.css";
import GoongMap from "@/components/ui/GoongMap";

// import "@/app/globals.css";

const Page: React.FC = () => {
  return (
    <>
      {/* Giới thiệu và hình ảnh minh họa */}
      <div className="h-[auto] p-4 relative w-full flex items-center bg-white">
        <div className="w-1/2 ">
          <h1 className="text-5xl font-bold p-4 text-left">
            Hệ thống giám sát
            <div className="pt-4">giao thông đô thị</div>
          </h1>
          <p className="text-lg p-5 text-justify">
            Theo dõi, phân tích và tối ưu hóa lưu thông một cách thông minh và
            hiệu quả. Cập nhật trạng thái giao thông theo thời gian thực để hỗ
            trợ di chuyển an toàn và tiện lợi.
          </p>
        </div>
        <div className="w-1/2">
          <img
            src="/image/giaothonghcm.jpg"
            alt="Giao thông HCM"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>

      {/* Tóm tắt dữ liệu giao thông */}
      <div className="w-full flex items-center p-4">
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
      </div>

      {/* Xem bản đồ và camera an ninh */}
      <div className="w-full flex items-center px-4">
        {/* Bản đồ giao thông */}
        <div className="w-7/12 m-2 p-5 border-2 rounded-lg bg-white">
          <div className="py-3">
            <p className="text-2xl font-bold">Bản đồ giao thông</p>
          </div>
          <div className="h-[450] z-0">
            <div className="h-full">
              {typeof window !== "undefined" && (
                <GoongMap controls={{ navigation: true, geolocate: true}} />
              )}
            </div>
          </div>
        </div>

        {/* Xem camera an ninh */}
        <div className="w-5/12 m-2 p-5 border-2 rounded-lg bg-white">
          <div className="py-3">
            <p className="text-2xl font-bold">Camera giao thông</p>
          </div>
          <div className="h-[450] overflow-y-auto">
            <p>Đang cập nhật dữ liệu ...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
