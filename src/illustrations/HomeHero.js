export default function HomeHero({ className = "" }) {
  return (
    <svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="skyHome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eff6ff" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="600" height="200" rx="16" fill="url(#skyHome)" />

      {/* Moon / smart indicator */}
      <circle cx="500" cy="45" r="22" fill="#dbeafe" />
      <circle cx="508" cy="40" r="18" fill="url(#skyHome)" />
      <circle cx="500" cy="45" r="26" fill="#3b82f6" opacity="0.08" />

      {/* Stars */}
      <g opacity="0.3" fill="#60a5fa">
        <circle cx="420" cy="30" r="1.5" />
        <circle cx="540" cy="65" r="1" />
        <circle cx="380" cy="50" r="1.2" />
        <circle cx="560" cy="35" r="1.5" />
      </g>

      {/* WiFi waves from house */}
      <g opacity="0.15" stroke="#3b82f6" strokeWidth="1.5" fill="none">
        <path d="M290 70 Q300 60 310 70" />
        <path d="M283 62 Q300 48 317 62" />
        <path d="M276 54 Q300 36 324 54" />
      </g>

      {/* House */}
      {/* Roof */}
      <path d="M220 95 L300 50 L380 95 Z" fill="url(#roofGrad)" />
      {/* Chimney */}
      <rect x="340" y="55" width="15" height="25" rx="2" fill="#1e40af" opacity="0.7" />

      {/* Walls */}
      <rect x="235" y="95" width="130" height="80" rx="3" fill="url(#wallGrad)" stroke="#cbd5e1" strokeWidth="0.5" />

      {/* Door */}
      <rect x="285" y="120" width="30" height="55" rx="3" fill="#1e293b" />
      <circle cx="310" cy="150" r="2.5" fill="#fbbf24" />

      {/* Windows */}
      <rect x="248" y="108" width="25" height="22" rx="2" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="0.5" />
      <line x1="260.5" y1="108" x2="260.5" y2="130" stroke="#93c5fd" strokeWidth="0.5" />
      <line x1="248" y1="119" x2="273" y2="119" stroke="#93c5fd" strokeWidth="0.5" />

      <rect x="327" y="108" width="25" height="22" rx="2" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="0.5" />
      <line x1="339.5" y1="108" x2="339.5" y2="130" stroke="#93c5fd" strokeWidth="0.5" />
      <line x1="327" y1="119" x2="352" y2="119" stroke="#93c5fd" strokeWidth="0.5" />

      {/* Window glow */}
      <rect x="248" y="108" width="25" height="22" rx="2" fill="#fbbf24" opacity="0.15" />
      <rect x="327" y="108" width="25" height="22" rx="2" fill="#fbbf24" opacity="0.15" />

      {/* Ground */}
      <path d="M0 175 Q150 168 300 172 Q450 178 600 170 L600 200 L0 200 Z" fill="#e2e8f0" opacity="0.5" />

      {/* Smart device icons */}
      {/* Thermometer floating */}
      <g transform="translate(130, 85)">
        <rect x="-5" y="-15" width="10" height="22" rx="5" fill="white" stroke="#f97316" strokeWidth="1.5" />
        <circle cx="0" cy="5" r="6" fill="#f97316" />
        <rect x="-2" y="-8" width="4" height="12" rx="2" fill="#f97316" />
      </g>

      {/* Shield floating */}
      <g transform="translate(470, 100)">
        <path d="M0 -12 L12 -4 L12 6 Q12 14 0 18 Q-12 14 -12 6 L-12 -4 Z" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
        <path d="M0 -4 L6 0 L6 4 Q6 8 0 10 Q-6 8 -6 4 L-6 0 Z" fill="#3b82f6" opacity="0.3" />
        <polyline points="-3,2 0,5 5,-2" stroke="#22c55e" strokeWidth="1.5" fill="none" />
      </g>

      {/* Leaf / eco floating */}
      <g transform="translate(150, 140)">
        <ellipse rx="10" ry="7" fill="#22c55e" opacity="0.8" transform="rotate(-30)" />
        <line x1="-8" y1="4" x2="8" y2="-4" stroke="#16a34a" strokeWidth="1" opacity="0.6" />
      </g>
    </svg>
  );
}
