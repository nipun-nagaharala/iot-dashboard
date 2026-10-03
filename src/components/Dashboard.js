import { Loader2, Wifi, WifiOff, Sparkles } from "lucide-react";
import MetricCard from "./MetricCard";
import StatusPanel from "./StatusPanel";
import SensorChart from "./SensorChart";
import ModeSwitcher from "./ModeSwitcher";
import AgricultureHero from "../illustrations/AgricultureHero";
import HomeHero from "../illustrations/HomeHero";
import FloatingDots from "../illustrations/FloatingDots";
import ChatBot from "./ChatBot";
import useSensorData from "../hooks/useSensorData";
import { useMode, getMetricsForMode } from "../context/ModeContext";

const FALLBACK_VALUE = "—";

export default function Dashboard() {
  const { currentData, history, isConnected, isLoading, error } = useSensorData();
  const { mode, config } = useMode();
  const metrics = getMetricsForMode(mode);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-100/10 to-blue-100/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800">
                  IoT{" "}
                  <span
                    className={
                      mode === "agriculture" ? "text-gradient-agri" : "text-gradient-home"
                    }
                  >
                    {config.label}
                  </span>
                </h1>
                <p className="text-xs text-slate-400">{config.subtitle}</p>
              </div>
            </div>
            <ModeSwitcher />
          </div>

          <div className="flex items-center gap-3 glass-card px-4 py-2">
            <span className={isConnected ? "status-dot-connected" : "status-dot-disconnected"} />
            <span className="text-sm text-slate-600 font-medium">
              {isLoading ? (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Connecting...
                </span>
              ) : isConnected ? (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <Wifi className="w-3.5 h-3.5" /> Live
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-red-400">
                  <WifiOff className="w-3.5 h-3.5" /> Offline
                </span>
              )}
            </span>
          </div>
        </header>

        {/* Hero illustration */}
        <div className="relative">
          <FloatingDots mode={mode} />
          <div className="glass-card overflow-hidden">
            {mode === "agriculture" ? (
              <AgricultureHero className="w-full h-auto" />
            ) : (
              <HomeHero className="w-full h-auto" />
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && history.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">Connecting to ESP32 sensor...</p>
              <p className="text-xs text-slate-400 mt-1">Please wait while we establish a connection</p>
            </div>
          </div>
        )}

        {/* Content */}
        {(!isLoading || history.length > 0) && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((m) => (
                <MetricCard
                  key={`${mode}-${m.type}`}
                  type={m.type}
                  label={m.label}
                  value={
                    currentData[m.key] != null
                      ? typeof m.decimals === "number"
                        ? Number(currentData[m.key]).toFixed(m.decimals)
                        : currentData[m.key]
                      : m.fallback || FALLBACK_VALUE
                  }
                  unit={m.unit}
                  subtext={getSubtext(mode, m.type, currentData)}
                  mode={mode}
                />
              ))}
            </div>

            {/* Status Panel */}
            <StatusPanel data={currentData} isConnected={isConnected} error={error} mode={mode} />

            {/* Chart */}
            <SensorChart history={history} mode={mode} />

            {/* Footer */}
            <footer className="text-center py-4">
              <p className="text-xs text-slate-300">
                IoT Dashboard &middot; Real-time ESP32 monitoring &middot; Updates every 5s
              </p>
            </footer>
          </>
        )}
      </div>

      {/* AI Chat Assistant */}
      <ChatBot sensorData={currentData} />
    </div>
  );
}

function getSubtext(mode, type, data) {
  if (mode === "agriculture") {
    switch (type) {
      case "soil":
        return data.soil_moisture_percent < 30 ? "Needs watering" : "Hydration OK";
      case "humidity":
        return "Relative humidity";
      case "temperature":
        return data.temperature > 35 ? "Above safe range" : "Normal range";
      default:
        return null;
    }
  }
  switch (type) {
    case "smoke":
      return data.smoke_detected ? "Smoke detected!" : "No smoke detected";
    case "temperature":
      return data.temperature > 35 ? "Above safe range" : "Normal range";
    case "humidity":
      return "Relative humidity";
    case "flood":
      return data.soil_moisture_percent > 70 ? "Flood risk!" : "Level safe";
    default:
      return null;
  }
}
