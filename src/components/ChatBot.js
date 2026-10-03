import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Trash2, Bot, User } from "lucide-react";
import useChat from "../hooks/useChat";
import { useMode } from "../context/ModeContext";

export default function ChatBot({ sensorData }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, config } = useMode();
  const { messages, isLoading, error, sendMessage, clearChat } = useChat(mode, sensorData);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const accentColor =
    mode === "agriculture"
      ? "bg-emerald-500 hover:bg-emerald-600"
      : "bg-blue-500 hover:bg-blue-600";

  const headerGradient =
    mode === "agriculture"
      ? "from-emerald-500 to-teal-400"
      : "from-blue-500 to-cyan-400";

  const suggestions =
    mode === "agriculture"
      ? [
          "Should I water my crops now?",
          "What does the soil moisture mean?",
          "Is the temperature safe for my plants?",
          "How can I improve soil health?",
        ]
      : [
          "Is the air quality safe?",
          "What should I do about the smoke reading?",
          "Is the flood level dangerous?",
          "How can I improve indoor air quality?",
        ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl ${accentColor} text-white shadow-lg shadow-black/10 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl`}
        aria-label={isOpen ? "Close chat" : "Open AI assistant"}
      >
        {isOpen ? (
          <X className="w-5 h-5" strokeWidth={2} />
        ) : (
          <MessageCircle className="w-5 h-5" strokeWidth={2} />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]">
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 border border-slate-200/80 flex flex-col overflow-hidden"
               style={{ height: "520px" }}>

            {/* Header */}
            <div className={`bg-gradient-to-r ${headerGradient} px-5 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {mode === "agriculture" ? "Farm Assistant" : "Home Assistant"}
                  </h3>
                  <p className="text-xs text-white/70">
                    {sensorData?.temperature != null
                      ? `Live data: ${sensorData.temperature}C, ${sensorData.humidity}%`
                      : "Waiting for sensor data..."}
                  </p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${headerGradient} flex items-center justify-center shadow-lg`}>
                    <Bot className="w-7 h-7 text-white" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {mode === "agriculture"
                        ? "Ask me about your crops"
                        : "Ask me about your home"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      I have access to your live sensor data
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s)}
                        className="text-left text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl px-3 py-2 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-slate-800 text-white rounded-br-md"
                        : "bg-slate-100 text-slate-700 rounded-bl-md"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.role === "assistant" && (
                        <Bot className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      )}
                      {msg.role === "user" && (
                        <User className="w-3.5 h-3.5 text-white/60 mt-0.5 flex-shrink-0" />
                      )}
                      <span>{msg.content}</span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  <p className="text-xs text-red-500">{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2 bg-slate-50 rounded-2xl border border-slate-200/80 px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    mode === "agriculture"
                      ? "Ask about your crops..."
                      : "Ask about your home..."
                  }
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    input.trim() && !isLoading
                      ? `${accentColor} text-white shadow-sm`
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
