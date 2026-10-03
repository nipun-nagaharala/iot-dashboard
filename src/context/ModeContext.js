import { createContext, useContext, useState, useCallback } from "react";

const ModeContext = createContext(null);

export const MODES = {
  agriculture: {
    id: "agriculture",
    label: "Agriculture",
    icon: "sprout",
    accent: "emerald",
    gradient: "from-emerald-600/20 via-green-600/10 to-teal-600/5",
    headerGradient: "from-emerald-400 to-teal-300",
    dotColor: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
    cardBorder: "hover:border-emerald-500/20",
    subtitle: "Crop & soil monitoring",
  },
  home: {
    id: "home",
    label: "Home",
    icon: "home",
    accent: "blue",
    gradient: "from-blue-600/20 via-indigo-600/10 to-slate-600/5",
    headerGradient: "from-blue-400 to-cyan-300",
    dotColor: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]",
    cardBorder: "hover:border-blue-500/20",
    subtitle: "Safety, flood & environment monitoring",
  },
};

const AGRICULTURE_METRICS = [
  { type: "temperature", label: "Temperature", key: "temperature", decimals: 1, unit: "°C" },
  { type: "humidity", label: "Humidity", key: "humidity", decimals: 1, unit: "%" },
  { type: "soil", label: "Soil Moisture", key: "soil_moisture_percent", decimals: 0, unit: "%" },
  { type: "rain", label: "Rainfall", key: "rainfall", decimals: 1, unit: "mm", fallback: "—" },
];

const HOME_METRICS = [
  { type: "temperature", label: "Temperature", key: "temperature", decimals: 1, unit: "°C" },
  { type: "humidity", label: "Humidity", key: "humidity", decimals: 1, unit: "%" },
  { type: "smoke", label: "Smoke Level", key: "smoke_raw", decimals: 0, unit: "PPM" },
  { type: "flood", label: "Flood Level", key: "soil_moisture_percent", decimals: 0, unit: "%" },
];

export function getMetricsForMode(mode) {
  return mode === "agriculture" ? AGRICULTURE_METRICS : HOME_METRICS;
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState("agriculture");

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "agriculture" ? "home" : "agriculture"));
  }, []);

  return (
    <ModeContext.Provider value={{ mode, toggleMode, config: MODES[mode] }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
}
