import { Sprout, Home } from "lucide-react";
import { useMode } from "../context/ModeContext";

export default function ModeSwitcher() {
  const { mode, toggleMode } = useMode();

  return (
    <button
      onClick={toggleMode}
      className="relative flex items-center bg-slate-100/80 border border-slate-200/80 rounded-2xl px-1 py-1 cursor-pointer group transition-all duration-300 hover:bg-slate-100 hover:shadow-sm"
      aria-label={`Switch to ${mode === "agriculture" ? "Home" : "Agriculture"} mode`}
    >
      {/* Sliding highlight */}
      <span
        className={`absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-xl transition-all duration-300 ease-out ${
          mode === "agriculture"
            ? "left-1 bg-white shadow-sm border border-emerald-200/50"
            : "left-[calc(50%+1px)] bg-white shadow-sm border border-blue-200/50"
        }`}
      />

      <span
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
          mode === "agriculture" ? "text-emerald-600" : "text-slate-400"
        }`}
      >
        <Sprout className="w-4 h-4" strokeWidth={2} />
        <span className="hidden sm:inline">Agri</span>
      </span>

      <span
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
          mode === "home" ? "text-blue-600" : "text-slate-400"
        }`}
      >
        <Home className="w-4 h-4" strokeWidth={2} />
        <span className="hidden sm:inline">Home</span>
      </span>
    </button>
  );
}
