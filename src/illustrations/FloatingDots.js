export default function FloatingDots({ mode = "agriculture" }) {
  const colors =
    mode === "agriculture"
      ? ["#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#a7f3d0"]
      : ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {colors.map((color, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20 animate-float"
          style={{
            backgroundColor: color,
            width: `${8 + i * 6}px`,
            height: `${8 + i * 6}px`,
            left: `${10 + i * 18}%`,
            top: `${15 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}
