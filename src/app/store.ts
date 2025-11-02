import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { weatherApi } from "../api/weatherApi";
import favoritesReducer from "../features/favoritesSlice";
import settingsReducer from "../features/settingsSlice";
import authReducer from "../features/authSlice";

const rootReducer = combineReducers({
  [weatherApi.reducerPath]: weatherApi.reducer,
  favorites: favoritesReducer,
  settings: settingsReducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["favorites", "settings", "auth", weatherApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(weatherApi.middleware),
  devTools: import.meta.env.MODE !== "production",
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
