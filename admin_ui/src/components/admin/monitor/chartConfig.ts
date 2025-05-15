import { ApexOptions } from "apexcharts";
import { SpeedData } from "./types";

export const createVehicleChartOptions = (speedData: SpeedData): ApexOptions => {
  return {
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
};

export const createSpeedChartOptions = (baseOptions: ApexOptions): ApexOptions => {
  return {
    ...baseOptions,
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
      ...(baseOptions.tooltip as object),
      y: {
        formatter: function (value: number) {
          return value + " km/h";
        },
      },
    },
    markers: {
      ...(baseOptions.markers as object),
      colors: ["#059669"],
    },
  };
};

export const createVehicleSeries = (vehicleCounts: number[]) => [
  {
    name: "Số lượng phương tiện",
    data: vehicleCounts,
  },
];

export const createSpeedSeries = (speeds: number[]) => [
  {
    name: "Tốc độ trung bình",
    data: speeds,
  },
];
