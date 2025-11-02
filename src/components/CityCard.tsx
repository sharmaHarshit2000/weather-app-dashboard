import React, { useEffect, useState } from "react";
import { useGetCurrentByCoordsQuery } from "../api/weatherApi";
import type { GeoLocation } from "../types/weather";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../features/favoritesSlice";
import type { RootState } from "../app/store";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface CityCardProps {
  city: GeoLocation;
  unit: "metric" | "imperial";
}

const CityCard: React.FC<CityCardProps> = ({ city, unit }) => {
  const { data, isFetching, isError, refetch } = useGetCurrentByCoordsQuery(
    { q: city.name },
    { pollingInterval: 60000 }
  );

  const [prevTemp, setPrevTemp] = useState<number | null>(null);
  const currentTemp = data
    ? unit === "metric"
      ? data.current.temp_c
      : data.current.temp_f
    : null;

  useEffect(() => {
    if (currentTemp !== null && currentTemp !== prevTemp) {
      setPrevTemp(currentTemp);
    }
  }, [currentTemp]);

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some(
    (c) => c.lat === city.lat && c.lon === city.lon
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(city));
    } else {
      dispatch(addFavorite(city));
    }
  };

  if (isFetching) {
    return (
      <div className="p-4 rounded-2xl bg-gray-200 animate-pulse h-48 flex flex-col justify-between" />
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 rounded-2xl bg-red-100 text-red-600 text-center flex flex-col justify-center h-48">
        <p>Failed to load {city.name}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-1 bg-red-200 rounded hover:bg-red-300 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const icon = data.current.condition.icon.startsWith("//")
    ? `https:${data.current.condition.icon}`
    : data.current.condition.icon;
  const desc = data.current.condition.text;

  return (
    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-xl hover:shadow-2xl transition-all duration-300 text-white flex flex-col justify-between h-48">
      {/* Favorite toggle */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 text-2xl hover:scale-110 transition-transform"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>

      <Link
        to={`/city/${encodeURIComponent(city.name)}`}
        className="flex flex-col justify-between h-full"
      >
        <div>
          <h2 className="font-bold text-xl">{city.name}</h2>
          <p className="text-sm text-white/80">{city.country}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <p
              className={`text-2xl font-bold transition-colors duration-500 ${
                prevTemp !== null && currentTemp! > prevTemp!
                  ? "text-green-300"
                  : prevTemp !== null && currentTemp! < prevTemp!
                  ? "text-red-300"
                  : "text-white"
              }`}
            >
              {Math.round(currentTemp!)}°{unit === "metric" ? "C" : "F"}
            </p>
            <p className="capitalize text-white/80">{desc}</p>
          </div>
          <img src={icon} alt={desc} className="w-16 h-16" />
        </div>

        <div className="mt-3 text-sm text-white/70 flex justify-between">
          <span>Humidity: {data.current.humidity}%</span>
          <span>
            Wind: {unit === "metric"
              ? `${data.current.wind_kph} kph`
              : `${data.current.wind_mph} mph`}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default CityCard;
