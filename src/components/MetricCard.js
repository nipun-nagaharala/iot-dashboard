import {
  Thermometer,
  Droplets,
  Sprout,
  ShieldAlert,
  CloudRain,
  Wind,
  Droplet,
} from "lucide-react";

const ICON_MAP = {
  temperature: Thermometer,
  humidity: Droplets,
  soil: Sprout,
  smoke: ShieldAlert,
  rain: CloudRain,
  flood: Droplet,
  air: Wind,
};

const AGRICULTURE_COLORS = {
  temperature: {
    icon: "text-orange-500",
    bg: "from-orange-50 to-amber-50",
    ring: "ring-orange-200",
    border: "border-orange-100",
  },
  humidity: {
    icon: "text-blue-500",
    bg: "from-blue-50 to-cyan-50",
    ring: "ring-blue-200",
    border: "border-blue-100",
  },
  soil: {
    icon: "text-emerald-500",
    bg: "from-emerald-50 to-green-50",
    ring: "ring-emerald-200",
    border: "border-emerald-100",
  },
  rain: {
    icon: "text-cyan-500",
    bg: "from-cyan-50 to-sky-50",
    ring: "ring-cyan-200",
    border: "border-cyan-100",
  },
  smoke: {
    icon: "text-red-500",
    bg: "from-red-50 to-rose-50",
    ring: "ring-red-200",
    border: "border-red-100",
  },
  air: {
    icon: "text-teal-500",
    bg: "from-teal-50 to-emerald-50",
    ring: "ring-teal-200",
    border: "border-teal-100",
  },
};

const HOME_COLORS = {
  temperature: {
    icon: "text-amber-500",
    bg: "from-amber-50 to-orange-50",
    ring: "ring-amber-200",
    border: "border-amber-100",
  },
  humidity: {
    icon: "text-sky-500",
    bg: "from-sky-50 to-blue-50",
    ring: "ring-sky-200",
    border: "border-sky-100",
  },
  soil: {
    icon: "text-emerald-500",
    bg: "from-emerald-50 to-green-50",
    ring: "ring-emerald-200",
    border: "border-emerald-100",
  },
  smoke: {
    icon: "text-red-500",
    bg: "from-red-50 to-rose-50",
    ring: "ring-red-200",
    border: "border-red-100",
  },
  flood: {
    icon: "text-cyan-500",
    bg: "from-cyan-50 to-blue-50",
    ring: "ring-cyan-200",
    border: "border-cyan-100",
  },
  rain: {
    icon: "text-cyan-500",
    bg: "from-cyan-50 to-sky-50",
    ring: "ring-cyan-200",
    border: "border-cyan-100",
  },
  air: {
    icon: "text-violet-500",
    bg: "from-violet-50 to-purple-50",
    ring: "ring-violet-200",
    border: "border-violet-100",
  },
};

export default function MetricCard({ type, label, value, unit, subtext, mode }) {
  const Icon = ICON_MAP[type];
  const palette = (mode === "agriculture" ? AGRICULTURE_COLORS : HOME_COLORS)[type];

  return (
    <div className={`glass-card-hover p-5 flex flex-col gap-3 bg-gradient-to-br ${palette.bg} border ${palette.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {label}
        </span>
        <div
          className={`w-11 h-11 rounded-2xl bg-white/80 ring-1 ${palette.ring} flex items-center justify-center shadow-sm`}
        >
          <Icon className={`w-5 h-5 ${palette.icon}`} strokeWidth={1.8} />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tracking-tight text-slate-800">{value}</span>
        <span className="text-sm font-medium text-slate-400">{unit}</span>
      </div>

      {subtext && (
        <span className="text-xs text-slate-400 leading-relaxed">{subtext}</span>
      )}
    </div>
  );
}
