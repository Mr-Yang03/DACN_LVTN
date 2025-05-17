import { useEffect, useState } from "react";

export interface OpenWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  description: string;
  icon: string;
  time: string;
  sunrise: string;
  sunset: string;
  city: string;
}

export function useOpenWeather(city: string = "Ho Chi Minh City") {
  const [data, setData] = useState<OpenWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace YOUR_API_KEY with your actual OpenWeatherMap API key
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric&lang=vi`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu thời tiết");
        const json = await res.json();
        setData({
          temp: json.main.temp,
          feels_like: json.main.feels_like,
          temp_min: json.main.temp_min,
          temp_max: json.main.temp_max,
          pressure: json.main.pressure,
          humidity: json.main.humidity,
          visibility: json.visibility,
          wind_speed: json.wind.speed,
          wind_deg: json.wind.deg,
          wind_gust: json.wind.gust,
          description: json.weather[0].description,
          icon: json.weather[0].icon,
          time: new Date(json.dt * 1000).toLocaleTimeString("vi-VN"),
          sunrise: new Date(json.sys.sunrise * 1000).toLocaleTimeString(
            "vi-VN"
          ),
          sunset: new Date(json.sys.sunset * 1000).toLocaleTimeString("vi-VN"),
          city: json.name,
        });
      } catch (e: any) {
        setError(e.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  return { data, loading, error };
}
