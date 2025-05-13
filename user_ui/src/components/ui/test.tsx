// import { useEffect } from "react";
// import { useGoongMap } from "@/hooks/useGoongMap";
// import { useTrafficData } from "@/hooks/useTrafficData";
// import GoongMapLoader from "@/components/ui/GoongMapLoader";

// export default function MapPage() {
//   const containerId = "map-container";
//   const { map, setIsGoongLoaded } = useGoongMap(containerId);
//   const roadData = useTrafficData(5000); // Cập nhật mỗi 5 giây

//   useEffect(() => {
//     if (!map) return;
//     const goongjs = (window as any).goongjs;
//     if (!goongjs) return;

//     // Thêm dữ liệu giao thông động vào bản đồ
//     if (!map.getSource("traffic-data")) {
//       map.addSource("traffic-data", {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: [],
//         },
//       });

//       map.addLayer({
//         id: "traffic-layer",
//         type: "line",
//         source: "traffic-data",
//         layout: { "line-join": "round", "line-cap": "round" },
//         paint: {
//           "line-width": 5,
//           "line-color": ["get", "color"], // Sử dụng dữ liệu động
//         },
//       });
//     }

//     // Cập nhật dữ liệu khi roadData thay đổi
//     if (map.getSource("traffic-data")) {
//       const geojsonData = {
//         type: "FeatureCollection",
//         features: roadData.map((road) => ({
//           type: "Feature",
//           geometry: { type: "LineString", coordinates: road.coordinates },
//           properties: { color: getColorForCongestion(road.congestionLevel) },
//         })),
//       };

//       (map.getSource("traffic-data") as any).setData(geojsonData);
//     }
//   }, [map, roadData]);

//   return (
//     <div className="relative w-full h-full">
//       <GoongMapLoader onLoad={() => setIsGoongLoaded(true)} />
//       <div id={containerId} className="absolute w-full h-full z-0" />
//     </div>
//   );
// }

// // Hàm lấy màu theo mức độ tắc nghẽn
// function getColorForCongestion(level: number) {
//   return ["#00FF00", "#FFFF00", "#FFA500", "#FF0000", "#000000"][level - 1] || "#808080";
// }
