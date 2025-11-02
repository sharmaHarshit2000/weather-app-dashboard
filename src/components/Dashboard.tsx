import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { GeoLocation } from "../types/weather";
import CityCard from "./CityCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const unit = useSelector((state: RootState) => state.settings.unit);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <motion.h2
        className="text-3xl sm:text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Favorite Cities
      </motion.h2>

      {favorites.length === 0 ? (
        <motion.p
          className="text-gray-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No favorite cities yet. Try searching and adding one!
        </motion.p>
      ) : (
        <motion.div
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {favorites.map((city: GeoLocation, i) => (
            <motion.div
              key={`${city.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-4"
            >
              <CityCard city={city} unit={unit} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
