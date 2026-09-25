import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const LeftLogo: React.FC<LogoProps> = ({ className = 'w-24 h-24', size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SVS True Wealth India Logo"
    >
      <defs>
        {/* Outer Ring Gradient - Deep Emerald Green */}
        <linearGradient id="leftLogoGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#02522b" />
          <stop offset="50%" stopColor="#006837" />
          <stop offset="100%" stopColor="#003d20" />
        </linearGradient>

        {/* Center Circle Gradient - Rich Magenta */}
        <linearGradient id="leftLogoMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9e0059" />
          <stop offset="50%" stopColor="#c2185b" />
          <stop offset="100%" stopColor="#70003c" />
        </linearGradient>

        {/* Gold Accent Metallic Gradient */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe279" />
          <stop offset="30%" stopColor="#ffd700" />
          <stop offset="70%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>

        {/* Curved Paths for Text */}
        <path id="textArcTopLeft" d="M 30,100 A 70,70 0 1,1 170,100" />
        <path id="textArcBottomLeft" d="M 170,100 A 70,70 0 0,1 30,100" />
      </defs>

      {/* Outer Shadow Circle */}
      <circle cx="100" cy="100" r="96" fill="rgba(0,0,0,0.3)" />

      {/* Outer Gold Ring */}
      <circle cx="100" cy="100" r="94" fill="url(#goldGradient)" />

      {/* Main Green Ring */}
      <circle cx="100" cy="100" r="90" fill="url(#leftLogoGreen)" />

      {/* Inner Gold Border */}
      <circle cx="100" cy="100" r="66" fill="url(#goldGradient)" />

      {/* Inner Magenta Center */}
      <circle cx="100" cy="100" r="62" fill="url(#leftLogoMagenta)" />

      {/* Curved Text - Top: TRUE WEALTH INDIA LLP */}
      <text fill="url(#goldGradient)" fontSize="13.5" fontWeight="900" letterSpacing="2.5">
        <textPath href="#textArcTopLeft" startOffset="50%" textAnchor="middle">
          TRUE WEALTH INDIA LLP
        </textPath>
      </text>

      {/* Curved Text - Bottom: TRUE WEALTH INDIA */}
      <text fill="url(#goldGradient)" fontSize="12" fontWeight="800" letterSpacing="2">
        <textPath href="#textArcBottomLeft" startOffset="50%" textAnchor="middle">
          ★ TRUE WEALTH INDIA ★
        </textPath>
      </text>

      {/* Center Grid / Architectural Symbol */}
      <g transform="translate(100, 68)">
        {/* Arch Frame */}
        <path
          d="M-14,8 C-14,-6 0,-14 0,-14 C0,-14 14,-6 14,8 L14,14 L-14,14 Z"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
        />
        {/* Grid lines */}
        <line x1="-14" y1="2" x2="14" y2="2" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <line x1="-14" y1="8" x2="14" y2="8" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <line x1="0" y1="-12" x2="0" y2="14" stroke="url(#goldGradient)" strokeWidth="1.5" />
      </g>

      {/* Center SVS Text */}
      <text
        x="100"
        y="115"
        fill="#ffffff"
        fontSize="32"
        fontWeight="900"
        fontFamily="Impact, sans-serif"
        textAnchor="middle"
        letterSpacing="2"
        stroke="#ffd700"
        strokeWidth="1"
      >
        SVS
      </text>

      {/* Center Subtext: SRIVASUDA */}
      <text
        x="100"
        y="132"
        fill="url(#goldGradient)"
        fontSize="11"
        fontWeight="800"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="1.5"
      >
        SRIVASUDA
      </text>

      {/* Bottom 3 Decorative Stars in Center Circle */}
      <g fill="url(#goldGradient)" transform="translate(100, 146)">
        <polygon points="0,-4 1.2,-1 4,-1 1.8,1 2.5,4 0,2 -2.5,4 -1.8,1 -4,-1 -1.2,-1" />
        <polygon points="-12,-4 -10.8,-1 -8,-1 -10.2,1 -9.5,4 -12,2 -14.5,4 -13.8,1 -16,-1 -13.2,-1" />
        <polygon points="12,-4 13.2,-1 16,-1 13.8,1 14.5,4 12,2 9.5,4 10.2,1 8,-1 10.8,-1" />
      </g>
    </svg>
  );
};
