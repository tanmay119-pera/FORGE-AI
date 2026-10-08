import React from 'react';

interface ForgeIconProps {
  className?: string;
  size?: number;
}

export const ForgeIcon: React.FC<ForgeIconProps> = ({ className = 'w-6 h-6', size = 24 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]"
      >
        <defs>
          <linearGradient id="forgeGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c084fc" />
            <stop offset="0.5" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="flameCore" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="0.6" stopColor="#d8b4fe" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Outer Hexagonal Shield / Anvil Diamond */}
        <path
          d="M24 3L42 13.5V34.5L24 45L6 34.5V13.5L24 3Z"
          fill="url(#forgeGrad)"
          stroke="#e9d5ff"
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Inner Soundwave / Forge Energy Flame */}
        <path
          d="M24 10C24 10 30 18 30 25C30 28.3 27.3 31 24 31C20.7 31 18 28.3 18 25C18 18 24 10 24 10Z"
          fill="url(#flameCore)"
        />

        {/* Sonic Wave Bars in the Core */}
        <line x1="20" y1="23" x2="20" y2="27" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="19" x2="24" y2="31" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="23" x2="28" y2="27" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

        {/* Bottom Sparkle Pivot */}
        <circle cx="24" cy="38" r="2" fill="#ffffff" />
      </svg>
    </div>
  );
};
