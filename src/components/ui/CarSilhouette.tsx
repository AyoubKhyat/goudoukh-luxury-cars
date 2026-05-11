"use client";

type Category = "Supercar" | "SUV" | "Sedan" | "Convertible";

function SupercarSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <path
        d="M60 105 C60 105 75 65 120 55 C150 48 180 45 200 45 C230 45 270 48 295 60 C320 72 340 85 350 105 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Roof / cabin */}
      <path
        d="M135 55 C135 55 150 32 190 28 C220 25 245 28 260 35 C270 39 280 50 285 60 L135 55Z"
        fill={color}
        opacity="0.7"
      />
      {/* Windshield */}
      <path
        d="M145 55 C145 55 155 35 190 31 C215 28 238 32 252 38 L265 55 Z"
        fill="white"
        opacity="0.15"
      />
      {/* Rear windshield */}
      <path
        d="M265 55 C265 55 270 42 275 38 L285 55 Z"
        fill="white"
        opacity="0.1"
      />
      {/* Headlight */}
      <ellipse cx="340" cy="95" rx="8" ry="5" fill="white" opacity="0.7" />
      {/* Tail light */}
      <ellipse cx="68" cy="95" rx="6" ry="4" fill="#cc0000" opacity="0.8" />
      {/* Front wheel */}
      <circle cx="295" cy="110" r="22" fill="#1a1a1a" />
      <circle cx="295" cy="110" r="14" fill="#333" />
      <circle cx="295" cy="110" r="5" fill="#555" />
      {/* Rear wheel */}
      <circle cx="115" cy="110" r="22" fill="#1a1a1a" />
      <circle cx="115" cy="110" r="14" fill="#333" />
      <circle cx="115" cy="110" r="5" fill="#555" />
      {/* Ground shadow */}
      <ellipse cx="200" cy="135" rx="160" ry="8" fill="black" opacity="0.08" />
      {/* Side line accent */}
      <path d="M75 100 L340 100" stroke="white" strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}

function SUVSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <path
        d="M55 120 L55 80 C55 75 65 70 80 68 L320 68 C340 68 348 75 350 80 L350 120 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Roof */}
      <path
        d="M90 68 L90 38 C90 33 100 28 115 26 L290 26 C305 28 315 33 315 38 L315 68 Z"
        fill={color}
        opacity="0.7"
      />
      {/* Front windshield */}
      <path
        d="M290 68 L290 30 C290 28 295 26 300 28 L315 38 L315 68 Z"
        fill="white"
        opacity="0.15"
      />
      {/* Side windows */}
      <path
        d="M120 65 L120 32 C120 30 130 28 140 28 L280 28 C285 28 288 30 288 32 L288 65 Z"
        fill="white"
        opacity="0.1"
      />
      {/* Window pillar */}
      <rect x="200" y="28" width="4" height="37" fill={color} opacity="0.7" />
      {/* Headlight */}
      <rect x="342" y="82" width="10" height="8" rx="2" fill="white" opacity="0.7" />
      {/* Tail light */}
      <rect x="55" y="82" width="8" height="8" rx="2" fill="#cc0000" opacity="0.8" />
      {/* Roof rails */}
      <rect x="100" y="23" width="210" height="2" rx="1" fill="#888" opacity="0.4" />
      {/* Front wheel */}
      <circle cx="300" cy="125" r="26" fill="#1a1a1a" />
      <circle cx="300" cy="125" r="17" fill="#333" />
      <circle cx="300" cy="125" r="6" fill="#555" />
      {/* Rear wheel */}
      <circle cx="110" cy="125" r="26" fill="#1a1a1a" />
      <circle cx="110" cy="125" r="17" fill="#333" />
      <circle cx="110" cy="125" r="6" fill="#555" />
      {/* Ground shadow */}
      <ellipse cx="200" cy="155" rx="165" ry="8" fill="black" opacity="0.08" />
      {/* Side accent */}
      <path d="M60 105 L345 105" stroke="white" strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}

function SedanSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <path
        d="M55 110 C55 100 60 85 75 78 L330 78 C345 78 350 90 350 110 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Roof */}
      <path
        d="M110 78 C110 78 125 38 170 32 C200 28 240 28 265 32 C295 38 310 65 310 78 Z"
        fill={color}
        opacity="0.7"
      />
      {/* Front windshield */}
      <path
        d="M265 35 C280 42 295 55 305 75 L285 75 L265 35 Z"
        fill="white"
        opacity="0.15"
      />
      {/* Rear windshield */}
      <path
        d="M170 35 C155 42 140 55 130 75 L150 75 L170 35 Z"
        fill="white"
        opacity="0.12"
      />
      {/* Side windows */}
      <path
        d="M155 75 L175 38 C190 32 230 32 250 38 L280 75 Z"
        fill="white"
        opacity="0.1"
      />
      {/* Window pillar */}
      <rect x="215" y="35" width="3" height="40" fill={color} opacity="0.7" transform="rotate(-2 215 35)" />
      {/* Headlight */}
      <ellipse cx="345" cy="95" rx="6" ry="5" fill="white" opacity="0.7" />
      {/* Tail light */}
      <ellipse cx="60" cy="98" rx="5" ry="4" fill="#cc0000" opacity="0.8" />
      {/* Front wheel */}
      <circle cx="300" cy="115" r="24" fill="#1a1a1a" />
      <circle cx="300" cy="115" r="15" fill="#333" />
      <circle cx="300" cy="115" r="5" fill="#555" />
      {/* Rear wheel */}
      <circle cx="110" cy="115" r="24" fill="#1a1a1a" />
      <circle cx="110" cy="115" r="15" fill="#333" />
      <circle cx="110" cy="115" r="5" fill="#555" />
      {/* Ground shadow */}
      <ellipse cx="200" cy="142" rx="160" ry="8" fill="black" opacity="0.08" />
      {/* Chrome strip */}
      <path d="M70 100 L340 100" stroke="white" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

function ConvertibleSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <path
        d="M60 105 C60 105 70 70 110 60 C145 52 170 50 200 50 C240 50 280 55 310 65 C335 75 345 90 350 105 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Low windshield frame */}
      <path
        d="M260 58 L270 42 L278 42 L268 58 Z"
        fill="#888"
        opacity="0.6"
      />
      {/* Windshield glass */}
      <path
        d="M262 56 L270 44 L276 44 L268 56 Z"
        fill="white"
        opacity="0.2"
      />
      {/* Interior hint */}
      <path
        d="M140 58 C140 58 160 50 200 48 C230 47 258 50 258 58 Z"
        fill={color}
        opacity="0.5"
      />
      {/* Seats */}
      <ellipse cx="200" cy="55" rx="15" ry="5" fill="#1a1a1a" opacity="0.3" />
      <ellipse cx="240" cy="55" rx="15" ry="5" fill="#1a1a1a" opacity="0.3" />
      {/* Headlight */}
      <ellipse cx="342" cy="95" rx="7" ry="5" fill="white" opacity="0.7" />
      {/* Tail light */}
      <ellipse cx="66" cy="95" rx="5" ry="4" fill="#cc0000" opacity="0.8" />
      {/* Front wheel */}
      <circle cx="300" cy="110" r="22" fill="#1a1a1a" />
      <circle cx="300" cy="110" r="14" fill="#333" />
      <circle cx="300" cy="110" r="5" fill="#555" />
      {/* Rear wheel */}
      <circle cx="115" cy="110" r="22" fill="#1a1a1a" />
      <circle cx="115" cy="110" r="14" fill="#333" />
      <circle cx="115" cy="110" r="5" fill="#555" />
      {/* Ground shadow */}
      <ellipse cx="200" cy="135" rx="160" ry="8" fill="black" opacity="0.08" />
      {/* Side accent line */}
      <path d="M75 98 L340 98" stroke="white" strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}

export default function CarSilhouette({ category, color }: { category: string; color: string }) {
  switch (category) {
    case "SUV":
      return <SUVSVG color={color} />;
    case "Sedan":
      return <SedanSVG color={color} />;
    case "Convertible":
      return <ConvertibleSVG color={color} />;
    default:
      return <SupercarSVG color={color} />;
  }
}
