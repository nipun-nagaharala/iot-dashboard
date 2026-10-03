export default function AgricultureHero({ className = "" }) {
  return (
    <svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyAgri" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="plant1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="plant2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="600" height="200" rx="16" fill="url(#skyAgri)" />

      {/* Sun */}
      <circle cx="480" cy="55" r="30" fill="url(#sunGrad)" opacity="0.9" />
      <circle cx="480" cy="55" r="40" fill="#fbbf24" opacity="0.15" />

      {/* Clouds */}
      <g opacity="0.6">
        <ellipse cx="120" cy="40" rx="30" ry="12" fill="white" />
        <ellipse cx="145" cy="35" rx="25" ry="14" fill="white" />
        <ellipse cx="105" cy="38" rx="20" ry="10" fill="white" />
      </g>
      <g opacity="0.4">
        <ellipse cx="350" cy="55" rx="22" ry="9" fill="white" />
        <ellipse cx="370" cy="51" rx="18" ry="10" fill="white" />
      </g>

      {/* Ground */}
      <path d="M0 145 Q150 135 300 142 Q450 150 600 140 L600 200 L0 200 Z" fill="url(#ground)" opacity="0.3" />
      <path d="M0 155 Q150 148 300 153 Q450 158 600 150 L600 200 L0 200 Z" fill="url(#ground)" opacity="0.2" />

      {/* Plants */}
      {/* Tall plant left */}
      <rect x="98" y="100" width="4" height="50" rx="2" fill="#16a34a" />
      <ellipse cx="100" cy="95" rx="15" ry="12" fill="url(#plant1)" />
      <ellipse cx="88" cy="100" rx="10" ry="8" fill="url(#plant2)" transform="rotate(-20 88 100)" />
      <ellipse cx="112" cy="100" rx="10" ry="8" fill="url(#plant2)" transform="rotate(20 112 100)" />

      {/* Medium plant */}
      <rect x="198" y="115" width="3" height="38" rx="1.5" fill="#16a34a" />
      <ellipse cx="200" cy="110" rx="12" ry="10" fill="url(#plant1)" />
      <ellipse cx="190" cy="114" rx="8" ry="6" fill="url(#plant2)" transform="rotate(-25 190 114)" />
      <ellipse cx="210" cy="114" rx="8" ry="6" fill="url(#plant2)" transform="rotate(25 210 114)" />

      {/* Flower */}
      <rect x="298" y="108" width="3" height="45" rx="1.5" fill="#16a34a" />
      <circle cx="300" cy="102" r="8" fill="#f472b6" opacity="0.9" />
      <circle cx="300" cy="102" r="4" fill="#fbbf24" />

      {/* Small sprout right */}
      <rect x="448" y="130" width="2.5" height="22" rx="1" fill="#22c55e" />
      <ellipse cx="450" cy="127" rx="8" ry="6" fill="#4ade80" />
      <ellipse cx="442" cy="130" rx="6" ry="4.5" fill="#86efac" transform="rotate(-30 442 130)" />

      {/* Soil dots */}
      <circle cx="100" cy="160" r="2" fill="#92400e" opacity="0.3" />
      <circle cx="200" cy="162" r="1.5" fill="#92400e" opacity="0.25" />
      <circle cx="300" cy="158" r="2.5" fill="#92400e" opacity="0.2" />
      <circle cx="450" cy="155" r="1.5" fill="#92400e" opacity="0.3" />

      {/* Rain drops */}
      <g opacity="0.2" fill="#3b82f6">
        <path d="M150 25 l2 8 a2 2 0 0 1-4 0z" />
        <path d="M250 15 l1.5 6 a1.5 1.5 0 0 1-3 0z" />
        <path d="M400 30 l2 7 a2 2 0 0 1-4 0z" />
      </g>
    </svg>
  );
}
