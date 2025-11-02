import { useState, useEffect, useRef } from "react";
import { useSearchGeoQuery } from "../api/weatherApi";
import useDebounce from "../hooks/useDebounce";
import type { GeoLocation } from "../types/weather";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite } from "../features/favoritesSlice";
import type { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const deb = useDebounce(q, 400);
  const { data, isFetching } = useSearchGeoQuery(deb, { skip: !deb });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const favorites = useSelector((state: RootState) => state.favorites.items);

  // Close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setShowSuggestions(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    navigate(`/city/${encodeURIComponent(city.name)}`);
    setQ("");
    setShowSuggestions(false);
  };

  const handleAddFavorite = (city: GeoLocation) => {
    if (!favorites.some((c) => c.lat === city.lat && c.lon === city.lon)) {
      dispatch(addFavorite(city));
    }
  };

  const handleChange = (value: string) => {
    setQ(value);
    setShowSuggestions(!!value);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg mx-auto">
      <input
        value={q}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setShowSuggestions(!!q)}
        placeholder="Search city..."
        className="w-full rounded-xl p-3 pl-4 shadow-lg backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      {isFetching && showSuggestions && (
        <div className="absolute right-4 top-3 text-sm text-gray-200 animate-pulse">
          Loading...
        </div>
      )}

      <AnimatePresence>
        {data && data.length > 0 && showSuggestions && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-2 bg-gray-900/90 border border-gray-700 rounded-2xl shadow-2xl max-h-64 overflow-auto z-20"
          >
            {data.map((g: GeoLocation, i) => {
              const isFav = favorites.some(
                (c) => c.lat === g.lat && c.lon === g.lon
              );
              return (
                <motion.li
                  key={`${g.lat}-${g.lon}-${i}`}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                  className="cursor-pointer px-4 py-3 flex justify-between items-center transition"
                >
                  <span
                    onClick={() => handleSelect(g)}
                    className="text-gray-100 truncate"
                  >
                    {g.name}, {g.country}
                  </span>
                  <button
                    onClick={() => handleAddFavorite(g)}
                    disabled={isFav}
                    title={isFav ? "Already favorite" : "Add to favorites"}
                    className={`ml-2 text-xl transition-colors ${
                      isFav
                        ? "text-red-500"
                        : "text-gray-100 hover:text-red-400"
                    }`}
                  >
                    {isFav ? <AiFillHeart /> : <AiOutlineHeart />}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
