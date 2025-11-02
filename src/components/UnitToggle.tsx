import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { setUnit } from "../features/settingsSlice";
import { FaTemperatureHigh } from "react-icons/fa";

const UnitToggle: React.FC = () => {
  const dispatch = useDispatch();
  const unit = useSelector((state: RootState) => state.settings.unit);

  const toggleUnit = () => {
    dispatch(setUnit(unit === "metric" ? "imperial" : "metric"));
  };

  return (
    <button
      onClick={toggleUnit}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-500 text-white font-medium hover:bg-sky-600 transition"
    >
      <FaTemperatureHigh />
      {unit === "metric" ? "°C" : "°F"}
    </button>
  );
};

export default UnitToggle;
