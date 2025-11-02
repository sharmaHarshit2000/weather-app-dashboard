import React, { useState, useEffect } from "react";
import {
  useGetCurrentByCoordsQuery,
  useGetForecastQuery,
  useGetHistoryQuery,
} from "../api/weatherApi";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { motion } from "framer-motion";
import WeatherChart from "../components/WeatherChart"; 

interface CityDetailProps {
  cityName: string;
}

const CityDetail: React.FC<CityDetailProps> = ({ cityName }) => {
  const unit = useSelector((state: RootState) => state.settings.unit);

  const { data: currentData, refetch: refetchCurrent } =
    useGetCurrentByCoordsQuery({ q: cityName });
  const { data: forecastData, refetch: refetchForecast } =
    useGetForecastQuery({ q: cityName, days: 7 });

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const getDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  const history1 = useGetHistoryQuery({ q: cityName, dt: formatDate(getDate(1)) });
  const history2 = useGetHistoryQuery({ q: cityName, dt: formatDate(getDate(2)) });
  const history3 = useGetHistoryQuery({ q: cityName, dt: formatDate(getDate(3)) });

  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [hourStart, setHourStart] = useState(0);
  const hourRangeLength = 6;

  useEffect(() => {
    const merged: any[] = [];
    [history1, history2, history3].forEach((h) => {
      if (h.data?.forecast?.forecastday?.[0]?.hour) {
        merged.push(
          ...h.data.forecast.forecastday[0].hour.map((hr: any) => ({
            label: new Date(hr.time).toLocaleDateString() + " " + new Date(hr.time).getHours() + ":00",
            tempC: hr.temp_c,
            tempF: hr.temp_f,
          }))
        );
      }
    });
    setHistoricalData(merged);
  }, [history1.data, history2.data, history3.data]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      refetchCurrent();
      refetchForecast();
    }, 60000);
    return () => clearInterval(interval);
  }, [refetchCurrent, refetchForecast]);

  if (!currentData || !forecastData)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading weather data...
      </div>
    );

  const current = currentData.current;
  const forecast = forecastData.forecast.forecastday;
  const temp = unit === "metric" ? current.temp_c : current.temp_f;
  const icon = current.condition.icon.startsWith("//")
    ? `https:${current.condition.icon}`
    : current.condition.icon;

  const hourlyData = forecast.flatMap((day) =>
    day.hour.map((h) => ({
      hour: new Date(h.time).getHours(),
      label: new Date(h.time).getHours() + ":00",
      tempC: h.temp_c,
      tempF: h.temp_f,
      feelsC: h.feelslike_c,
      feelsF: h.feelslike_f,
    }))
  );

  const filteredHourly = hourlyData.filter(
    (h) => h.hour >= hourStart && h.hour < hourStart + hourRangeLength
  );

  const dailyData = forecast.map((day) => ({
    date: new Date(day.date).toLocaleDateString(),
    label: new Date(day.date).toLocaleDateString(),
    temp: unit === "metric" ? day.day.avgtemp_c : day.day.avgtemp_f,
    precip: day.day.totalprecip_mm,
    wind: unit === "metric" ? day.day.maxwind_kph : day.day.maxwind_mph,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2c] via-[#1b1f47] to-[#141c3a] text-white p-6">
      
      {/* HEADER */}
      <motion.div
        className="max-w-3xl mx-auto mb-8 text-center"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          {currentData.location.name}
        </h2>
        <p className="text-lg text-gray-300 mt-1 capitalize">{current.condition.text}</p>
      </motion.div>

      {/* CURRENT WEATHER */}
      <motion.div
        className="max-w-3xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-6 transition-transform hover:scale-[1.01]"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img src={icon} alt={current.condition.text} className="w-28 h-28 drop-shadow-lg" />
        <div>
          <p className="text-6xl font-bold text-blue-300 drop-shadow-sm">
            {Math.round(temp)}°{unit === "metric" ? "C" : "F"}
          </p>
          <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-200">
            <p>🌡️ Feels Like: {unit === "metric" ? current.feelslike_c : current.feelslike_f}°</p>
            <p>💧 Humidity: {current.humidity}%</p>
            <p>💨 Wind: {unit === "metric" ? `${current.wind_kph} kph` : `${current.wind_mph} mph`}</p>
            <p>📊 Pressure: {current.pressure_mb} mb</p>
            <p>☀️ UV Index: {current.uv}</p>
            <p>👁️ Visibility: {current.vis_km} km</p>
          </div>
        </div>
      </motion.div>

      {/* SLIDER */}
      <div className="max-w-3xl mx-auto mb-8">
        <label className="block mb-2 font-semibold text-indigo-300">
          Hour Range: {hourStart}:00 - {hourStart + hourRangeLength}:00
        </label>
        <input
          type="range"
          min={0}
          max={23 - hourRangeLength}
          value={hourStart}
          onChange={(e) => setHourStart(Number(e.target.value))}
          className="w-full accent-indigo-500 cursor-pointer"
        />
      </div>

      {/* HOURLY CHART */}
      <WeatherChart
        title="Hourly Temperature"
        data={filteredHourly}
        dataKey={unit === "metric" ? "tempC" : "tempF"}
        yFormatter={(v) => `${Math.round(v)}°`}
        lineColor="#ff7300"
      />
      <WeatherChart
        title="Hourly Feels Like"
        data={filteredHourly}
        dataKey={unit === "metric" ? "feelsC" : "feelsF"}
        yFormatter={(v) => `${Math.round(v)}°`}
        lineColor="#1f77b4"
      />

      {/* FORECAST CHARTS */}
      {["Temperature", "Precipitation", "Wind"].map((type) => (
        <WeatherChart
          key={type}
          title={`7-Day ${type} Forecast`}
          data={dailyData}
          dataKey={type === "Temperature" ? "temp" : type === "Precipitation" ? "precip" : "wind"}
          yFormatter={(v) =>
            type === "Temperature"
              ? `${Math.round(v)}°`
              : type === "Precipitation"
              ? `${v} mm`
              : `${v} ${unit === "metric" ? "kph" : "mph"}`
          }
          lineColor={type === "Temperature" ? "#ff7300" : type === "Precipitation" ? "#8e44ad" : "#2ca02c"}
        />
      ))}

      {/* HISTORICAL DATA */}
      {historicalData.length === 0 ? (
        <p className="text-gray-500 text-center">Loading historical data...</p>
      ) : (
        <WeatherChart
          title="Historical Temperature (Last 3 Days)"
          data={historicalData}
          dataKey={unit === "metric" ? "tempC" : "tempF"}
          yFormatter={(v) => `${Math.round(v)}°`}
          lineColor="#ff7300"
        />
      )}
    </div>
  );
};

export default CityDetail;
