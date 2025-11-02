import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import SearchBar from "../components/SearchBar";
import Dashboard from "../components/Dashboard";
import { motion } from "framer-motion";

const DashboardPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen flex flex-col items-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-6"
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to Your Weather Dashboard
        </h2>
        <p className="text-gray-300 mt-2">
          Search for cities, view forecasts, and track weather trends.
        </p>
      </motion.div>

      <SearchBar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        {user ? (
          <Dashboard /> 
        ) : (
          <div className="text-center text-gray-300 mt-8">
            Please sign in with Google to see your favorite cities.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
