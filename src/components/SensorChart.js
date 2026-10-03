import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-3 shadow-lg text-xs">
      <p className="text-slate-500 mb-1.5 font-medium">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}:{" "}
          <span className="font-semibold text-slate-700">
            {entry.value}
            {entry.dataKey === "temperature" ? "°C" : entry.dataKey === "humidity" ? "%" : ""}
          </span>
        </p>
      ))}
    </div>
  );
};

const MODE_LINES = {
  agriculture: [
    { key: "temperature", name: "Temperature (°C)", color: "#f97316" },
    { key: "humidity", name: "Humidity (%)", color: "#10b981" },
    { key: "soil_moisture_percent", name: "Soil Moisture (%)", color: "#8b5cf6" },
  ],
  home: [
    { key: "temperature", name: "Temperature (°C)", color: "#f59e0b" },
    { key: "humidity", name: "Humidity (%)", color: "#3b82f6" },
    { key: "soil_moisture_percent", name: "Flood Level (%)", color: "#22c55e" },
    { key: "smoke_raw", name: "Smoke (PPM)", color: "#ef4444" },
  ],
};

export default function SensorChart({ history, mode }) {
  const lines = MODE_LINES[mode] || MODE_LINES.agriculture;

  if (!history.length) {
    return (
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Historical Trends
        </h2>
        <div className="h-80 flex items-center justify-center text-slate-400 text-sm">
          Waiting for sensor data...
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Historical Trends
        </h2>
        <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
          Last {history.length} reading{history.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              iconType="circle"
              iconSize={8}
            />
            {lines.map((l) => (
              <Line
                key={`${mode}-${l.key}`}
                type="monotone"
                dataKey={l.key}
                name={l.name}
                stroke={l.color}
                strokeWidth={2.5}
                dot={{ r: 4, fill: "white", stroke: l.color, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: l.color, strokeWidth: 2, fill: "white" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
