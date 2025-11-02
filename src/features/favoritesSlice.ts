import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { GeoLocation } from "../types/weather";

interface FavoritesState {
  items: GeoLocation[];
}

const initialState: FavoritesState = {
  items: JSON.parse(localStorage.getItem("favorites") || "[]"),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<GeoLocation>) => {
      const exists = state.items.some(
        (c) => c.lat === action.payload.lat && c.lon === action.payload.lon
      );
      if (!exists) {
        state.items.unshift(action.payload);
        localStorage.setItem("favorites", JSON.stringify(state.items));
      }
    },
    removeFavorite: (state, action: PayloadAction<GeoLocation>) => {
      state.items = state.items.filter(
        (c) => !(c.lat === action.payload.lat && c.lon === action.payload.lon)
      );
      localStorage.setItem("favorites", JSON.stringify(state.items));
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem("favorites");
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
