import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { GeoLocation, WeatherCurrent, WeatherForecast, WeatherHistory } from '../types/weather'

const KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE = import.meta.env.VITE_WEATHER_API_BASE || 'https://api.weatherapi.com/v1'

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE,
    prepareHeaders: (headers) => {
      // WeatherAPI uses key as a query param, not header, so this is optional
      return headers
    },
  }),
  endpoints: (builder) => ({
    // 🌍 Search city / autocomplete
    searchGeo: builder.query<GeoLocation[], string>({
      query: (q) => `/search.json?key=${KEY}&q=${encodeURIComponent(q)}`,
    }),

    // 🌤 Current weather
    getCurrentByCoords: builder.query<WeatherCurrent, { q: string }>({
      query: ({ q }) => `/current.json?key=${KEY}&q=${encodeURIComponent(q)}&aqi=no`,
    }),

    // 📈 Forecast (daily + hourly)
    getForecast: builder.query<WeatherForecast, { q: string; days?: number }>({
      query: ({ q, days = 7 }) =>
        `/forecast.json?key=${KEY}&q=${encodeURIComponent(q)}&days=${days}&aqi=no&alerts=no`,
    }),

    // 🕰 Historical weather
    getHistory: builder.query<WeatherHistory, { q: string; dt: string }>({
      query: ({ q, dt }) =>
        `/history.json?key=${KEY}&q=${encodeURIComponent(q)}&dt=${dt}&aqi=no&alerts=no`,
    }),
  }),
})

export const {
  useSearchGeoQuery,
  useGetCurrentByCoordsQuery,
  useGetForecastQuery,
  useGetHistoryQuery,
} = weatherApi
