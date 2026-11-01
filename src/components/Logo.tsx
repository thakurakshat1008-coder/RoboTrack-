import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showWordmark = true 
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textMap = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-extrabold'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision CAD Aerospace Emblem */}
      <div 
        className={`relative ${sizeMap[size]} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#EADCC9] dark:from-[#111927] dark:to-[#0A0E18] border border-[#C5A880]/30 dark:border-[#E8B4A2]/30 shadow-[0_2px_12px_rgba(232,180,162,0.18)] dark:shadow-[0_0_20px_rgba(232,180,162,0.15)] group transition-transform duration-300 hover:scale-105`}
      >
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full p-1.5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Champagne Gold to Rose Gold Gradient */}
            <linearGradient id="champagne-rose" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EADCC9" />
              <stop offset="45%" stopColor="#E8B4A2" />
              <stop offset="100%" stopColor="#82B2D8" />
            </linearGradient>

            <linearGradient id="metallic-gold" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D4C3AA" />
              <stop offset="50%" stopColor="#E8B4A2" />
              <stop offset="100%" stopColor="#A99DC9" />
            </linearGradient>
          </defs>

          {/* Hexagonal Outer Aerospace Frame */}
          <polygon 
            points="18,3.5 30.5,10.75 30.5,25.25 18,32.5 5.5,25.25 5.5,10.75" 
            stroke="url(#metallic-gold)" 
            strokeWidth="1.6"
            strokeLinejoin="round"
            className="opacity-90"
            fill="none" 
          />

          {/* Precision Corner Datum Marks */}
          <circle cx="18" cy="3.5" r="1.3" fill="#E8B4A2" />
          <circle cx="30.5" cy="25.25" r="1.3" fill="#82B2D8" />
          <circle cx="5.5" cy="25.25" r="1.3" fill="#849B74" />
          
          {/* Internal Concentric Calibration Ring */}
          <circle 
            cx="18" 
            cy="18" 
            r="8" 
            stroke="url(#champagne-rose)" 
            strokeWidth="1.2" 
            strokeDasharray="2 2"
            className="opacity-75"
          />

          {/* Articulated Kinematic Vector Trajectory */}
          <path 
            d="M9.5 18h3.5l2.5-5.5 5 11 3-6.5 2.5 1h3" 
            stroke="url(#champagne-rose)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Central Telemetry Core */}
          <circle cx="18" cy="18" r="2.2" fill="#E8B4A2" />
          <circle cx="18" cy="18" r="0.9" fill="#FAF7F2" />
        </svg>
      </div>

      {showWordmark && (
        <span className={`tracking-tight text-slate-900 dark:text-[#FAF7F2] whitespace-nowrap ${textMap[size]}`}>
          Robo<span className="text-[#C5A880] dark:text-[#E8B4A2]">Track</span>
        </span>
      )}
    </div>
  );
};
