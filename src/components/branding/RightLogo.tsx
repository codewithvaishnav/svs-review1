import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const RightLogo: React.FC<LogoProps> = ({ className = 'w-24 h-24', size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Srivasuda Foundation Logo"
    >
      <defs>
        {/* Outer Ring Gradient - Deep Emerald Green */}
        <linearGradient id="rightLogoGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#02522b" />
          <stop offset="50%" stopColor="#006837" />
          <stop offset="100%" stopColor="#003d20" />
        </linearGradient>

        {/* Center Circle Gradient - Rich Magenta */}
        <linearGradient id="rightLogoMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9e0059" />
          <stop offset="50%" stopColor="#c2185b" />
          <stop offset="100%" stopColor="#70003c" />
        </linearGradient>

        {/* Gold Accent Metallic Gradient */}
        <linearGradient id="goldGradientRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe279" />
          <stop offset="30%" stopColor="#ffd700" />
          <stop offset="70%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>

        {/* Curved Paths for Text */}
        <path id="textArcTopRight" d="M 30,100 A 70,70 0 1,1 170,100" />
        <path id="textArcBottomRight" d="M 170,100 A 70,70 0 0,1 30,100" />
      </defs>

      {/* Outer Shadow Circle */}
      <circle cx="100" cy="100" r="96" fill="rgba(0,0,0,0.3)" />

      {/* Outer Gold Ring */}
      <circle cx="100" cy="100" r="94" fill="url(#goldGradientRight)" />

      {/* Main Green Ring */}
      <circle cx="100" cy="100" r="90" fill="url(#rightLogoGreen)" />

      {/* Curved Text - Top: SRIVASUDA FOUNDATION */}
      <text fill="url(#goldGradientRight)" fontSize="13" fontWeight="900" letterSpacing="2">
        <textPath href="#textArcTopRight" startOffset="50%" textAnchor="middle">
          SRIVASUDA FOUNDATION
        </textPath>
      </text>

      {/* Curved Text - Bottom: CSR & WELFARE */}
      <text fill="url(#goldGradientRight)" fontSize="11" fontWeight="800" letterSpacing="1.8">
        <textPath href="#textArcBottomRight" startOffset="50%" textAnchor="middle">
          ★ SRIVASUDA FOUNDATION ★
        </textPath>
      </text>

      {/* Inner Ring with Joined Colored Hands Circle Symbol (Orange, Yellow, Green, Pink, Blue) */}
      <g transform="translate(100,100)">
        {/* Hand 1 - Top (Orange) */}
        <path d="M 0,-62 C 12,-62 18,-50 12,-38 C 6,-26 0,-26 0,-26 Z" fill="#ff7043" opacity="0.9" />
        <circle cx="0" cy="-56" r="5" fill="#ffa726" />

        {/* Hand 2 - Top Right (Yellow) */}
        <g transform="rotate(72)">
          <path d="M 0,-62 C 12,-62 18,-50 12,-38 C 6,-26 0,-26 0,-26 Z" fill="#ffee58" opacity="0.9" />
          <circle cx="0" cy="-56" r="5" fill="#fdd835" />
        </g>

        {/* Hand 3 - Bottom Right (Green) */}
        <g transform="rotate(144)">
          <path d="M 0,-62 C 12,-62 18,-50 12,-38 C 6,-26 0,-26 0,-26 Z" fill="#66bb6a" opacity="0.9" />
          <circle cx="0" cy="-56" r="5" fill="#43a047" />
        </g>

        {/* Hand 4 - Bottom Left (Blue) */}
        <g transform="rotate(216)">
          <path d="M 0,-62 C 12,-62 18,-50 12,-38 C 6,-26 0,-26 0,-26 Z" fill="#42a5f5" opacity="0.9" />
          <circle cx="0" cy="-56" r="5" fill="#1e88e5" />
        </g>

        {/* Hand 5 - Top Left (Pink) */}
        <g transform="rotate(288)">
          <path d="M 0,-62 C 12,-62 18,-50 12,-38 C 6,-26 0,-26 0,-26 Z" fill="#ec407a" opacity="0.9" />
          <circle cx="0" cy="-56" r="5" fill="#d81b60" />
        </g>
      </g>

      {/* Inner Gold Border */}
      <circle cx="100" cy="100" r="52" fill="url(#goldGradientRight)" />

      {/* Inner Magenta Center */}
      <circle cx="100" cy="100" r="48" fill="url(#rightLogoMagenta)" />

      {/* Architectural Window Symbol */}
      <g transform="translate(100, 78)">
        <path
          d="M-10,6 C-10,-4 0,-10 0,-10 C0,-10 10,-4 10,6 L10,10 L-10,10 Z"
          fill="none"
          stroke="url(#goldGradientRight)"
          strokeWidth="2"
        />
        <line x1="-10" y1="2" x2="10" y2="2" stroke="url(#goldGradientRight)" strokeWidth="1" />
        <line x1="0" y1="-8" x2="0" y2="10" stroke="url(#goldGradientRight)" strokeWidth="1" />
      </g>

      {/* Text inside magenta circle */}
      <text
        x="100"
        y="108"
        fill="#ffffff"
        fontSize="11"
        fontWeight="900"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="1"
      >
        SRIVASUDA
      </text>

      <text
        x="100"
        y="120"
        fill="url(#goldGradientRight)"
        fontSize="8"
        fontWeight="800"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="0.8"
      >
        FOUNDATION
      </text>

      {/* Decorative Gold Stars */}
      <g fill="url(#goldGradientRight)" transform="translate(100, 131)">
        <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" />
        <polygon points="-8,-3 -7,-1 -5,-1 -6.5,0.5 -6,3 -8,1.5 -10,3 -9.5,0.5 -11,-1 -9,-1" />
        <polygon points="8,-3 9,-1 11,-1 9.5,0.5 10,3 8,1.5 6,3 6.5,0.5 5,-1 7,-1" />
      </g>
    </svg>
  );
};
