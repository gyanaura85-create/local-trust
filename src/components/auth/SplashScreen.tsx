import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NearKartLogo } from '../common/NearKartLogo';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div 
      onClick={() => navigateTo('login')}
      className="relative w-full h-full min-h-[600px] flex flex-col justify-between items-center py-10 px-6 bg-gradient-to-b from-[#EBF4FE] via-[#F4F9FE] to-[#FFFFFF] cursor-pointer overflow-hidden select-none"
    >
      {/* Top curved decorative swooshes matching screenshot 1 */}
      <div className="absolute top-0 left-0 w-72 h-44 pointer-events-none opacity-90">
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M-50 -20C50 40 180 80 280 20L200 -50Z" fill="#155EEF" fillOpacity="0.8" />
          <path d="M-30 -10C80 60 220 90 320 0L240 -40Z" fill="#16A34A" fillOpacity="0.8" />
          <path d="M-10 10C90 70 200 60 290 -10" stroke="#93C5FD" strokeWidth="2" strokeOpacity="0.6" />
        </svg>
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center pt-16 z-10">
        {/* NearKart Logo & Tagline */}
        <NearKartLogo size="xl" showTagline={true} />

        {/* Circular dots loader matching screenshot 1 */}
        <div className="mt-14 flex flex-col items-center">
          <div className="relative w-12 h-12 flex items-center justify-center animate-spin" style={{ animationDuration: '1.4s' }}>
            {/* 12 radial colored dots */}
            {[
              { angle: 0, color: '#155EEF', opacity: 1 },
              { angle: 30, color: '#1E40AF', opacity: 0.9 },
              { angle: 60, color: '#1E3A8A', opacity: 0.8 },
              { angle: 90, color: '#16A34A', opacity: 0.75 },
              { angle: 120, color: '#22C55E', opacity: 0.7 },
              { angle: 150, color: '#4ADE80', opacity: 0.6 },
              { angle: 180, color: '#86EFAC', opacity: 0.5 },
              { angle: 210, color: '#93C5FD', opacity: 0.4 },
              { angle: 240, color: '#60A5FA', opacity: 0.35 },
              { angle: 270, color: '#3B82F6', opacity: 0.3 },
              { angle: 300, color: '#2563EB', opacity: 0.25 },
              { angle: 330, color: '#1D4ED8', opacity: 0.2 }
            ].map((dot, i) => {
              const rad = (dot.angle * Math.PI) / 180;
              const r = 18; // radius
              const x = 24 + r * Math.sin(rad);
              const y = 24 - r * Math.cos(rad);
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: dot.color,
                    opacity: dot.opacity,
                    left: `${x - 4}px`,
                    top: `${y - 4}px`
                  }}
                />
              );
            })}
          </div>
          <span className="text-sm font-semibold text-blue-900 mt-3 tracking-wide">
            Loading...
          </span>
        </div>
      </div>

      {/* Cityscape illustration at bottom */}
      <div className="w-full relative mt-auto flex flex-col items-center pointer-events-none">
        <svg viewBox="0 0 400 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-36 opacity-75">
          {/* Subtle Buildings */}
          <rect x="20" y="60" width="28" height="60" rx="3" fill="#BFDBFE" />
          <rect x="60" y="45" width="34" height="75" rx="3" fill="#93C5FD" />
          <rect x="110" y="70" width="30" height="50" rx="3" fill="#BFDBFE" />
          <rect x="155" y="35" width="40" height="85" rx="3" fill="#93C5FD" />
          <rect x="210" y="55" width="32" height="65" rx="3" fill="#BFDBFE" />
          <rect x="260" y="40" width="36" height="80" rx="3" fill="#93C5FD" />
          <rect x="315" y="65" width="30" height="55" rx="3" fill="#BFDBFE" />
          {/* Windows */}
          <rect x="68" y="55" width="6" height="8" rx="1" fill="#FFFFFF" opacity="0.8" />
          <rect x="80" y="55" width="6" height="8" rx="1" fill="#FFFFFF" opacity="0.8" />
          <rect x="165" y="45" width="7" height="9" rx="1" fill="#FFFFFF" opacity="0.8" />
          <rect x="178" y="45" width="7" height="9" rx="1" fill="#FFFFFF" opacity="0.8" />
          <rect x="270" y="50" width="6" height="8" rx="1" fill="#FFFFFF" opacity="0.8" />
          {/* Trees & Hill slope */}
          <circle cx="50" cy="95" r="14" fill="#60A5FA" opacity="0.7" />
          <circle cx="145" cy="100" r="16" fill="#3B82F6" opacity="0.5" />
          <circle cx="248" cy="98" r="15" fill="#60A5FA" opacity="0.7" />
          <circle cx="305" cy="105" r="12" fill="#3B82F6" opacity="0.5" />
          {/* Green-Blue bottom wave curve */}
          <path d="M-10 120C80 90 320 90 410 120V140H-10Z" fill="#155EEF" fillOpacity="0.9" />
          <path d="M-10 125C90 100 310 95 410 130V140H-10Z" fill="#16A34A" />
        </svg>
      </div>

    </div>
  );
};
