import { useState, useEffect, useCallback, useRef } from "react";

const MAX_HISTORY = 12;
const POLL_INTERVAL = 5000;

const INITIAL_DATA = {
  temperature: 25.0,
  humidity: 55.0,
  soil_moisture_raw: 2800,
  soil_moisture_percent: 35,
  smoke_raw: 150,
  smoke_detected: false,
};

const drift = { temperature: 25.0, humidity: 55.0, soil: 35.0, smoke: 150.0 };
const DRIFT = { temperature: 0.3, humidity: 0.5, soil: 0.8, smoke: 5 };
const LIMITS = { temperature: [18, 42], humidity: [25, 85], soil: [5, 80], smoke: [80, 280] };

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function driftValue(current, rate, limits) {
  const midpoint = (limits[0] + limits[1]) / 2;
  const pull = (midpoint - current) * 0.01;
  const noise = (Math.random() - 0.5) * 2 * rate;
  return clamp(current + pull + noise, limits[0], limits[1]);
}

function generateDemoData() {
  drift.temperature = driftValue(drift.temperature, DRIFT.temperature, LIMITS.temperature);
  drift.humidity = driftValue(drift.humidity, DRIFT.humidity, LIMITS.humidity);
  drift.soil = driftValue(drift.soil, DRIFT.soil, LIMITS.soil);
  drift.smoke = driftValue(drift.smoke, DRIFT.smoke, LIMITS.smoke);

  const soilPct = Math.round(drift.soil);
  return {
    temperature: +drift.temperature.toFixed(1),
    humidity: +drift.humidity.toFixed(1),
    soil_moisture_raw: Math.round(4095 - (soilPct / 100) * (4095 - 1200)),
    soil_moisture_percent: soilPct,
    smoke_raw: Math.round(drift.smoke),
    smoke_detected: Math.round(drift.smoke) > 250,
  };
}

function getTimestamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function useSensorData() {
  const [currentData, setCurrentData] = useState(INITIAL_DATA);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const errorCountRef = useRef(0);

  const baseUrl = process.env.REACT_APP_ESP32_SERVER_URL;
  const isDemo = process.env.REACT_APP_DEMO_MODE === "true";

  const fetchData = useCallback(async () => {
    if (isDemo) {
      const data = generateDemoData();
      setCurrentData(data);
      setIsConnected(true);
      setError(null);
      setIsLoading(false);
      setHistory((prev) => {
        const next = [...prev, { ...data, time: getTimestamp() }];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
      return;
    }

    if (!baseUrl || baseUrl.includes("<ESP32_IP_ADDRESS>")) {
      setIsLoading(false);
      setIsConnected(false);
      setError("ESP32 URL not configured in .env");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/`, {
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setCurrentData(data);
      setIsConnected(true);
      setError(null);
      setIsLoading(false);
      errorCountRef.current = 0;

      setHistory((prev) => {
        const next = [...prev, { ...data, time: getTimestamp() }];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
    } catch (err) {
      errorCountRef.current += 1;
      setIsConnected(false);
      setIsLoading(false);

      if (errorCountRef.current >= 2) {
        if (err.name === "TimeoutError") {
          setError("Connection timed out. Is the ESP32 powered on?");
        } else if (err.message.includes("Failed to fetch")) {
          setError("Cannot reach ESP32. Add CORS header to your ESP32 sketch: server.sendHeader(\"Access-Control-Allow-Origin\", \"*\");");
        } else {
          setError(err.message);
        }
      }
    }
  }, [baseUrl, isDemo]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  return { currentData, history, isConnected, isLoading, error };
}
