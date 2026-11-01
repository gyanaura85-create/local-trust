import React from 'react';

interface NearKartLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const NearKartLogo: React.FC<NearKartLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = ''
}) => {
  const iconDimensions = {
    sm: { width: 44, height: 44, text: 'text-lg', tag: 'text-[9px]' },
    md: { width: 72, height: 72, text: 'text-2xl', tag: 'text-xs' },
    lg: { width: 108, height: 108, text: 'text-3xl', tag: 'text-sm' },
    xl: { width: 136, height: 136, text: 'text-4xl', tag: 'text-base' }
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
      {/* 3D Metallic Shopping Bag + Cart Graphic */}
      <div className="relative mb-2 flex items-center justify-center">
        <svg
          width={iconDimensions.width}
          height={iconDimensions.height}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <defs>
            {/* Metallic Bag Gradient */}
            <linearGradient id="metallicBag" x1="20" y1="20" x2="130" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#85C1F8" />
              <stop offset="25%" stopColor="#2B7CD3" />
              <stop offset="50%" stopColor="#1254A8" />
              <stop offset="75%" stopColor="#2F87E5" />
              <stop offset="100%" stopColor="#0B3C7A" />
            </linearGradient>

            {/* Gloss Highlight */}
            <linearGradient id="bagGloss" x1="50" y1="20" x2="110" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
            </linearGradient>

            {/* Handle Silver Gradient */}
            <linearGradient id="handleGrad" x1="50" y1="10" x2="110" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C8E1FF" />
              <stop offset="45%" stopColor="#4F95E6" />
              <stop offset="85%" stopColor="#1B4F94" />
              <stop offset="100%" stopColor="#0E3263" />
            </linearGradient>

            {/* Green Cart Gradient */}
            <linearGradient id="greenCart" x1="100" y1="90" x2="155" y2="145" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="40%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>

            <filter id="shadow" x="0" y="0" width="160" height="160" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Bag Handle */}
          <path
            d="M58 54V36C58 23.8497 67.8497 14 80 14C92.1503 14 102 23.8497 102 36V54"
            stroke="url(#handleGrad)"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Bag Body with House & Diagonal N cutouts */}
          <rect
            x="36"
            y="48"
            width="88"
            height="86"
            rx="18"
            fill="url(#metallicBag)"
            filter="url(#shadow)"
          />
          {/* Surface Gloss Specular Overlay */}
          <rect
            x="36"
            y="48"
            width="88"
            height="86"
            rx="18"
            fill="url(#bagGloss)"
          />

          {/* Stylized "N" Diagonal Slashes inside bag */}
          <path
            d="M54 116L98 62M54 62V116M98 62V116"
            stroke="#FFFFFF"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* House Door / Windows Accent */}
          <rect x="67" y="112" width="10" height="12" rx="1.5" fill="#0D366B" />
          <rect x="81" y="112" width="10" height="12" rx="1.5" fill="#0D366B" />

          {/* 3D Green Supermarket Cart Attached at Right */}
          <g filter="url(#shadow)">
            {/* Basket wireframe */}
            <path
              d="M112 94H144L140 120H116L112 94Z"
              fill="url(#greenCart)"
              stroke="#15803D"
              strokeWidth="1.5"
            />
            {/* Horizontal basket bars */}
            <line x1="114" y1="102" x2="142" y2="102" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="115" y1="110" x2="140" y2="110" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            {/* Wheels */}
            <circle cx="121" cy="129" r="6" fill="#15803D" stroke="#86EFAC" strokeWidth="2.5" />
            <circle cx="137" cy="129" r="6" fill="#15803D" stroke="#86EFAC" strokeWidth="2.5" />
            <circle cx="121" cy="129" r="2" fill="#FFFFFF" />
            <circle cx="137" cy="129" r="2" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Brand Text: NearKart */}
      <div className={`font-extrabold tracking-tight flex items-center justify-center leading-none ${iconDimensions.text}`}>
        <span className="text-[#004BB7] drop-shadow-sm">Near</span>
        <span className="text-[#15803D] drop-shadow-sm ml-0.5">Kart</span>
      </div>

      {/* Tagline */}
      {showTagline && (
        <p className={`text-[#0F294A] font-medium tracking-tight mt-1 opacity-90 ${iconDimensions.tag}`}>
          Your neighbourhood, your marketplace.
        </p>
      )}
    </div>
  );
};
