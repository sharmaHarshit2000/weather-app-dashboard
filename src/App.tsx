import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import CityPage from "./pages/CityPage";
import UnitToggle from "./components/UnitToggle";
import UserMenu from "./components/UserMenu";

export default function App() {

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-[#0a0f2c] via-[#1b1f47] to-[#141c3a] text-white">

        {/* Header */}
        <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-sky-400 tracking-tight">
              🌦️ Weather Analytics Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <UnitToggle />
              <UserMenu /> 
            </div>
          </div>
        </header>

        <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-8 space-y-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/city/:name" element={<CityPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="w-full text-center text-gray-300 py-4 border-t border-white/20 bg-white/10 backdrop-blur-md mt-auto">
          © {new Date().getFullYear()} Weather Dashboard. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}
