import dynamic from "next/dynamic";
import { Car, TrendingUp } from "lucide-react";
import { SpeedData, TimeRange } from "./types";
import { 
  createVehicleChartOptions, 
  createSpeedChartOptions, 
  createVehicleSeries, 
  createSpeedSeries 
} from "./chartConfig";

// Dynamic import for ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface TrafficChartsProps {
  speedData: SpeedData;
  timeRange: TimeRange;
  onTimeRangeChange: (newTimeRange: TimeRange) => void;
}

export function TrafficCharts({ 
  speedData, 
  timeRange, 
  onTimeRangeChange 
}: TrafficChartsProps) {  // Create chart options
  const vehicleOptions = createVehicleChartOptions(speedData);
  const speedOptions = createSpeedChartOptions(vehicleOptions, speedData);
  
  // Create series data
  const vehicleSeries = createVehicleSeries(speedData.vehicleCounts);
  const speedSeries = createSpeedSeries(speedData.speeds);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTimeRangeChange({ 
      hours: Number(e.target.value), 
      label: e.target.options[e.target.selectedIndex].text 
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VehicleCountChart 
        vehicleOptions={vehicleOptions}
        vehicleSeries={vehicleSeries}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />
      
      <SpeedChart 
        speedOptions={speedOptions}
        speedSeries={speedSeries}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />
    </div>
  );
}

function VehicleCountChart({ 
  vehicleOptions, 
  vehicleSeries, 
  timeRange, 
  onTimeRangeChange 
}: { 
  vehicleOptions: any; 
  vehicleSeries: any[];
  timeRange: TimeRange;
  onTimeRangeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
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
            onChange={onTimeRangeChange}
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
  );
}

function SpeedChart({ 
  speedOptions, 
  speedSeries, 
  timeRange, 
  onTimeRangeChange 
}: { 
  speedOptions: any; 
  speedSeries: any[];
  timeRange: TimeRange;
  onTimeRangeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
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
            onChange={onTimeRangeChange}
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
  );
}
