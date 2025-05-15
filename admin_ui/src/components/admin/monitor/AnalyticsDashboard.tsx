import { Activity, BarChart3, Car, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsData, VehicleTypeData } from "./types";
import { 
  getCongestionColorClass, 
  getShortCongestionText, 
  extractCongestionLevel
} from "./utils";

interface AnalyticsDashboardProps {
  analyticsData: AnalyticsData;
  vehicleTypeData: VehicleTypeData;
  selectedCameraId: string;
  formattedTime: string;
}

export function AnalyticsDashboard({
  analyticsData,
  vehicleTypeData,
  selectedCameraId,
  formattedTime,
}: AnalyticsDashboardProps) {
  return (
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
            <OverviewTab 
              analyticsData={analyticsData} 
              selectedCameraId={selectedCameraId}
            />
          </TabsContent>

          <TabsContent
            value="phuongtien"
            className="animate-in fade-in-50 duration-300"
          >
            <VehicleTypesTab 
              vehicleTypeData={vehicleTypeData} 
              totalVehicles={analyticsData.totalVehicles} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function OverviewTab({ 
  analyticsData, 
  selectedCameraId 
}: { 
  analyticsData: AnalyticsData;
  selectedCameraId: string;
}) {
  return (
    <>
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
                selectedCameraId
                  ? extractCongestionLevel(analyticsData.congestionLevel)
                  : "default"
              )} px-2 rounded-full py-1 inline-block`}
            >
              {getShortCongestionText(
                selectedCameraId
                  ? extractCongestionLevel(analyticsData.congestionLevel)
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
              selectedCameraId
                ? extractCongestionLevel(analyticsData.congestionLevel)
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
          {selectedCameraId
            ? analyticsData.congestionLevel
            : "Chọn camera để xem mức độ ùn tắc"}
        </div>
      </div>
    </>
  );
}

function VehicleTypesTab({ 
  vehicleTypeData,
  totalVehicles
}: { 
  vehicleTypeData: VehicleTypeData;
  totalVehicles: number;
}) {
  return (
    <div className="space-y-4 p-3 bg-white rounded-lg shadow-sm dark:bg-slate-800">
      <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-sm">
            Phân loại phương tiện
          </span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
          Tổng: {totalVehicles}
        </span>
      </div>

      <div className="space-y-3">
        <VehicleTypeRow 
          type="Xe máy"
          count={vehicleTypeData.vehicleTypes.motorcycle.count}
          percentage={vehicleTypeData.vehicleTypes.motorcycle.percentage}
          colorClass="bg-blue-500"
        />

        <VehicleTypeRow 
          type="Ô tô"
          count={vehicleTypeData.vehicleTypes.car.count}
          percentage={vehicleTypeData.vehicleTypes.car.percentage}
          colorClass="bg-green-500"
        />

        <VehicleTypeRow 
          type="Xe tải"
          count={vehicleTypeData.vehicleTypes.truck.count}
          percentage={vehicleTypeData.vehicleTypes.truck.percentage}
          colorClass="bg-amber-500"
        />

        <VehicleTypeRow 
          type="Xe buýt"
          count={vehicleTypeData.vehicleTypes.bus.count}
          percentage={vehicleTypeData.vehicleTypes.bus.percentage}
          colorClass="bg-purple-500"
        />
      </div>
    </div>
  );
}

function VehicleTypeRow({ 
  type, 
  count, 
  percentage, 
  colorClass 
}: { 
  type: string;
  count: number;
  percentage: number;
  colorClass: string;
}) {
  return (
    <div className="flex items-center">
      <span className="text-xs font-medium w-20 text-slate-700 dark:text-slate-300">
        {type}
      </span>
      <div className="flex-1 mx-2">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
          <div
            className={`${colorClass} h-full rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {count}{" "}
        <span className="text-slate-500 font-normal">
          ({percentage}%)
        </span>
      </span>
    </div>
  );
}
