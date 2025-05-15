import { useState, useEffect } from "react";
import { Camera, Clock } from "lucide-react";

export function DashboardHeader() {
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

  return (
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
  );
}
