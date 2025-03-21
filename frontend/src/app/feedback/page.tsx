"use client";

// import GoongMap from "@/components/ui/GoongMap";
import { ReportForm } from "./report-form";

export default function ReportPage() {
  return (
    <div className="w-full flex flex-col">
      <div className="text-3xl font-bold text-center p-4 mt-4">
        Phản ánh tình trạng giao thông
      </div>
      <div className="text-center text-gray-800 mb-4">
      Gửi thông tin phản ánh về tình trạng giao thông để giúp chúng tôi cải thiện hệ thống giám sát
      </div>
      <div className="flex w-full my-4 items-center justify-center">
        {/* <div className="w-1/2 p-4 ml-4 rounded-lg bg-white border-2">
          <GoongMap
            controls={{ navigation: true, geolocate: true, search: true }}
          />
        </div> */}
        <div className="w-1/2 px-4">
            <ReportForm />
        </div>
      </div>
    </div>
  );
};
