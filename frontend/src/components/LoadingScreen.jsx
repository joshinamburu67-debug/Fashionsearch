import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ statusMessage = "Finding Costume & Comparing Store Prices..." }) {
  const [dots, setDots] = useState('');
  const [progressStep, setProgressStep] = useState(0);

  const steps = [
    "Reading costume color, length & silhouette with Gemini AI",
    "Searching Amazon Associates product catalog",
    "Querying Myntra, Ajio, Flipkart via Cuelinks",
    "Calculating lowest prices & max discount deals",
    "Compiling best buy recommendations"
  ];

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 450);

    const stepInterval = setInterval(() => {
      setProgressStep(prev => (prev + 1) % steps.length);
    }, 1800);

    return () => {
      clearInterval(dotInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-brand-50 via-white to-brand-100 p-6 select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-200/40 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-sky-200/30 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Emblem: ONLY the letters 'F' and 'S' (with 'S' wrapped around 'F' like a snake) */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-8 snake-glow">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full filter drop-shadow-xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Letter F Gradient */}
              <linearGradient id="fGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>

              {/* Snake S Gradient */}
              <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              {/* Snake Scales Pattern */}
              <linearGradient id="snakeBelly" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="100%" stopColor="#E0F2FE" />
              </linearGradient>

              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Letter 'F' (Modern, elegant architectural geometry) */}
            <g id="letter-F">
              {/* Vertical Spine of F */}
              <rect x="78" y="32" width="22" height="136" rx="6" fill="url(#fGradient)" />
              {/* Top Arm of F */}
              <rect x="78" y="32" width="68" height="20" rx="6" fill="url(#fGradient)" />
              {/* Middle Bar of F */}
              <rect x="78" y="88" width="50" height="18" rx="5" fill="url(#fGradient)" />
              
              {/* Subtle metallic reflection on F */}
              <path d="M82 36 L82 162" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <path d="M82 36 L140 36" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>

            {/* Letter 'S' Wrapped around 'F' as an organic, graceful Snake */}
            <g id="snake-S" filter="url(#softGlow)">
              {/* Snake Shadow behind spine */}
              <path
                d="M 148 48 
                   C 130 18, 62 20, 56 60 
                   C 50 100, 150 96, 144 140 
                   C 138 180, 70 182, 52 152"
                stroke="#0369A1"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.35"
              />

              {/* Snake Outer Main Body (Forms the 'S' looping around 'F') */}
              <path
                className="snake-s-path"
                d="M 152 46 
                   C 132 16, 60 18, 54 62 
                   C 48 102, 152 98, 146 142 
                   C 140 184, 68 186, 48 154"
                stroke="url(#snakeGradient)"
                strokeWidth="15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Snake Inner Belly Accent for 3D coiling depth */}
              <path
                d="M 150 46 
                   C 131 19, 64 21, 58 62 
                   C 52 100, 148 98, 142 140 
                   C 136 180, 72 182, 52 154"
                stroke="url(#snakeBelly)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 6"
                opacity="0.9"
              />

              {/* Snake Head (At top right of S curve) */}
              <g transform="translate(152, 46) rotate(-25)">
                <ellipse cx="0" cy="0" rx="9" ry="6" fill="#0284C7" />
                <ellipse cx="0" cy="0" rx="7" ry="4" fill="#38BDF8" />
                {/* Snake eye with jewel glow */}
                <circle cx="3" cy="-2" r="1.8" fill="#FFFFFF" />
                <circle cx="3.2" cy="-2" r="0.9" fill="#0C4A6E" />
                {/* Forked tongue flicking out */}
                <path d="M 9 0 L 14 -2 M 9 0 L 14 2" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" />
              </g>

              {/* Snake Tail (Tapering gracefully around base of F) */}
              <path
                d="M 52 154 C 42 142, 38 128, 44 116"
                stroke="url(#snakeGradient)"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 44 116 C 46 110, 48 106, 50 102"
                stroke="#38BDF8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Brand identity badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-brand-200 shadow-sm text-xs font-semibold text-brand-700 tracking-wider uppercase mb-5">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
          Fashionsearch Lens
        </div>

        {/* Dynamic status message */}
        <h3 className="text-lg font-bold text-slate-800 tracking-tight min-h-[3.5rem] flex items-center justify-center px-4">
          {steps[progressStep]}{dots}
        </h3>

        {/* The Animated Water Bar (Water moves continuously from left to right) */}
        <div className="w-full mt-4 px-2">
          <div className="water-container">
            {/* Layer 1: Background Deep Water Flowing Left to Right */}
            <div className="water-wave-layer-1"></div>
            {/* Layer 2: Mid-level Turquoise Wave Flowing Left to Right */}
            <div className="water-wave-layer-2"></div>
            {/* Layer 3: Surface Light Blue Wave Flowing */}
            <div className="water-wave-layer-3"></div>

            {/* Bubble Particles rising through moving water */}
            <span className="bubble" style={{ left: '15%', animationDelay: '0s', width: '6px', height: '6px' }}></span>
            <span className="bubble" style={{ left: '35%', animationDelay: '0.7s', width: '8px', height: '8px' }}></span>
            <span className="bubble" style={{ left: '60%', animationDelay: '1.2s', width: '5px', height: '5px' }}></span>
            <span className="bubble" style={{ left: '80%', animationDelay: '0.4s', width: '7px', height: '7px' }}></span>

            {/* Glass sheen highlight on water surface */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-full"></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-brand-700/80 font-medium mt-2 px-1">
            <span>Water Flow Engine</span>
            <span className="font-mono">Processing Wave...</span>
          </div>
        </div>

        {/* Light Blue & White Aesthetic Subtext */}
        <p className="text-xs text-slate-400 mt-6 max-w-xs font-light">
          Powered by Gemini Vision AI • Comparing Amazon & Cuelinks Partners
        </p>
      </div>
    </div>
  );
}
