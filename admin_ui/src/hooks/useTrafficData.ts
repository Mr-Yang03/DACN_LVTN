import { useEffect, useState } from "react";

interface RoadSegment {
  id: string;
  coordinates: [number, number][];
  congestionLevel: number;
}

export function useTrafficData(updateInterval = 10000) {
  const [roadData, setRoadData] = useState<RoadSegment[]>([]);

  useEffect(() => {
    async function fetchTrafficData() {
      try {
        const response = await fetch("/api/traffic"); // API backend trả về dữ liệu giao thông
        const data = await response.json();
        setRoadData(data);
      } catch (error) {
        console.error("Error fetching traffic data:", error);
      }
    }

    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return roadData;
}
