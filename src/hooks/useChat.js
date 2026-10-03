import { useState, useCallback } from "react";

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const MODEL = "mistral-small-latest";

function buildSystemPrompt(mode, sensorData) {
  const readingBlock = sensorData
    ? [
        `Current sensor readings:`,
        `- Temperature: ${sensorData.temperature} C`,
        `- Humidity: ${sensorData.humidity}%`,
        `- Soil Moisture: ${sensorData.soil_moisture_percent}% (raw: ${sensorData.soil_moisture_raw})`,
        `- Smoke Level: ${sensorData.smoke_raw} PPM (detected: ${sensorData.smoke_detected})`,
      ].join("\n")
    : "No sensor data available yet.";

  if (mode === "agriculture") {
    return [
      "You are an agricultural IoT assistant embedded in a sensor monitoring dashboard.",
      "You help farmers understand their sensor readings and make decisions about crops, irrigation, and soil health.",
      "Rules:",
      "- Use the sensor data below to answer accurately.",
      "- Give practical, actionable advice.",
      "- Keep responses concise, 2-4 sentences max unless the user asks for detail.",
      "- Use plain text only. No bullet symbols, no asterisks, no hash marks, no emojis.",
      "- Write in a professional but friendly tone.",
      "- If asked about something unrelated to agriculture or sensors, politely redirect to your purpose.",
      "",
      readingBlock,
    ].join("\n");
  }

  return [
    "You are a smart home IoT assistant embedded in a sensor monitoring dashboard.",
    "You help homeowners understand their sensor readings and maintain a safe, comfortable living environment.",
    "You monitor temperature, humidity, smoke levels, and flood/water levels.",
    "Rules:",
    "- Use the sensor data below to answer accurately.",
    "- Give practical, actionable advice.",
    "- Keep responses concise, 2-4 sentences max unless the user asks for detail.",
    "- Use plain text only. No bullet symbols, no asterisks, no hash marks, no emojis.",
    "- Write in a professional but friendly tone.",
    "- If asked about something unrelated to home safety or sensors, politely redirect to your purpose.",
    "",
    readingBlock,
  ].join("\n");
}

function stripFormatting(text) {
  return text
    .replace(/[*_#`~\[\]]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function useChat(mode, sensorData) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (userText) => {
      if (!userText.trim() || isLoading) return;

      const userMessage = { role: "user", content: userText.trim() };
      const newMessages = [...messages, userMessage];

      setMessages(newMessages);
      setIsLoading(true);
      setError(null);

      const apiKey = process.env.REACT_APP_MISTRAL_API_KEY;

      if (!apiKey) {
        setError("API key not configured. Set REACT_APP_MISTRAL_API_KEY in .env");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(MISTRAL_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: "system", content: buildSystemPrompt(mode, sensorData) },
              ...newMessages.map((m) => ({ role: m.role, content: m.content })),
            ],
            temperature: 0.4,
            max_tokens: 300,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(
            errData?.error?.message || `API returned status ${response.status}`
          );
        }

        const data = await response.json();
        const reply = stripFormatting(data.choices[0].message.content);

        setMessages((prev) => [...prev, userMessage, { role: "assistant", content: reply }]);
      } catch (err) {
        setError(err.message || "Failed to get AI response");
        setMessages((prev) => [...prev, userMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, mode, sensorData]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
