import { AlertTriangle, CheckCircle, Flame, Info, Droplets, Droplet } from "lucide-react";

function getAlerts(data, mode) {
  const alerts = [];

  if (mode === "home") {
    if (data.smoke_raw > 300) {
      alerts.push({
        level: "critical",
        icon: Flame,
        message: "CRITICAL: Smoke/Gas Detected!",
        detail: `Smoke level at ${data.smoke_raw} PPM — exceeds safe threshold of 300.`,
      });
    } else {
      alerts.push({
        level: "ok",
        icon: CheckCircle,
        message: "Air quality: No smoke detected.",
        detail: `Smoke level at ${data.smoke_raw} PPM — within safe range.`,
      });
    }

    if (data.soil_moisture_percent > 70) {
      alerts.push({
        level: "critical",
        icon: Droplet,
        message: "CRITICAL: High flood level detected!",
        detail: `Flood level at ${data.soil_moisture_percent}% — exceeds safe threshold of 70%.`,
      });
    } else if (data.soil_moisture_percent > 50) {
      alerts.push({
        level: "warning",
        icon: AlertTriangle,
        message: "Elevated water level detected.",
        detail: `Flood level at ${data.soil_moisture_percent}% — monitor closely.`,
      });
    } else {
      alerts.push({
        level: "ok",
        icon: CheckCircle,
        message: "Flood level: Normal.",
        detail: `Water level at ${data.soil_moisture_percent}% — within safe range.`,
      });
    }
  }

  if (mode === "agriculture") {
    if (data.soil_moisture_percent < 30) {
      alerts.push({
        level: "warning",
        icon: Droplets,
        message: "Status: Soil dry. Watering required.",
        detail: `Soil moisture at ${data.soil_moisture_percent}% — below 30% threshold.`,
      });
    } else {
      alerts.push({
        level: "ok",
        icon: CheckCircle,
        message: "Status: Soil hydration optimal.",
        detail: `Soil moisture at ${data.soil_moisture_percent}%.`,
      });
    }

    if (data.humidity < 20) {
      alerts.push({
        level: "warning",
        icon: AlertTriangle,
        message: "Very low humidity detected.",
        detail: `Humidity at ${data.humidity}% — crops may need misting.`,
      });
    }
  }

  if (data.temperature > 35) {
    alerts.push({
      level: "warning",
      icon: AlertTriangle,
      message: "High ambient temperature detected.",
      detail: `Temperature at ${data.temperature}°C — exceeds 35°C.`,
    });
  }

  return alerts;
}

function getSummary(alerts) {
  const hasCritical = alerts.some((a) => a.level === "critical");
  const hasWarning = alerts.some((a) => a.level === "warning");

  if (hasCritical)
    return {
      text: "Critical issues detected — immediate action required.",
      color: "text-red-500",
      bg: "bg-red-50",
    };
  if (hasWarning)
    return {
      text: "Warnings present — review conditions.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    };
  return {
    text: "All systems nominal.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  };
}

const LEVEL_STYLES = {
  critical: {
    wrapper: "border-red-200 bg-red-50/80",
    icon: "text-red-400",
    message: "text-red-700",
    detail: "text-red-500/80",
    dot: "bg-red-400",
  },
  warning: {
    wrapper: "border-amber-200 bg-amber-50/80",
    icon: "text-amber-400",
    message: "text-amber-700",
    detail: "text-amber-500/80",
    dot: "bg-amber-400",
  },
  ok: {
    wrapper: "border-emerald-200 bg-emerald-50/80",
    icon: "text-emerald-400",
    message: "text-emerald-700",
    detail: "text-emerald-500/80",
    dot: "bg-emerald-400",
  },
};

export default function StatusPanel({ data, isConnected, error, mode }) {
  const alerts = getAlerts(data, mode);
  const summary = getSummary(alerts);

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
            <Info className="w-4 h-4 text-slate-500" strokeWidth={2} />
          </div>
          System Status &amp; Alerts
        </h2>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5">
          <span className={isConnected ? "status-dot-connected" : "status-dot-disconnected"} />
          <span className="text-xs font-medium text-slate-500">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {alerts.map((alert, i) => {
          const style = LEVEL_STYLES[alert.level];
          const Icon = alert.icon;
          return (
            <div key={i} className={`border rounded-2xl p-4 flex items-start gap-3 ${style.wrapper}`}>
              <div className={`w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <Icon className={`w-4 h-4 ${style.icon}`} strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={`text-sm font-semibold ${style.message}`}>{alert.message}</span>
                <span className={`text-xs ${style.detail}`}>{alert.detail}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-1 border-t border-slate-100 pt-3 flex items-center gap-2 rounded-xl px-3 py-2 ${summary.bg}`}>
        <span className={`text-sm font-medium ${summary.color}`}>{summary.text}</span>
      </div>
    </div>
  );
}
