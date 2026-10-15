import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Eye, ArrowRight, RefreshCw } from 'lucide-react';

/**
 * IntroLoadingScreen:
 * 1. Realistic, professional serpent coiled in the 'S' letter emblem.
 * 2. Uncoils and emerges from the 'S' letter.
 * 3. Takes a cinematic full round all over the user's screen (top, right, bottom, left).
 * 4. Slithers into a realistic 50mm x 50mm magnifying glass.
 * 5. Optical lens magnification & flash transition reveals the site!
 */
export default function IntroLoadingScreen({ onComplete }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('emerging'); // 'emerging' | 'circling' | 'entering' | 'completed'
  const [progressText, setProgressText] = useState('Serpent Awakening...');
  const [lensFlash, setLensFlash] = useState(false);
  const animFrameRef = useRef(null);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Number of body segments for ultra-smooth fluid movement
    const NUM_SEGMENTS = 70;
    const SEGMENT_SPACING = 6; // distance between segments
    const segments = [];
    
    // Initial position centered at 'S' emblem
    const startX = width * 0.5;
    const startY = height * 0.5;

    for (let i = 0; i < NUM_SEGMENTS; i++) {
      segments.push({
        x: startX - i * 3,
        y: startY + Math.sin(i * 0.25) * 8,
        angle: 0,
        lateralOffset: 0
      });
    }

    // Trajectory waypoints for taking a FULL ROUND all over the user's screen
    const waypoints = [
      { x: 0.50, y: 0.50 }, // 0: Center start (inside S)
      { x: 0.65, y: 0.38 }, // 1: Surge upwards-right
      { x: 0.88, y: 0.16 }, // 2: Top-Right margin
      { x: 0.50, y: 0.09 }, // 3: Across Top center
      { x: 0.12, y: 0.15 }, // 4: Top-Left margin
      { x: 0.08, y: 0.50 }, // 5: Down Left edge
      { x: 0.14, y: 0.84 }, // 6: Bottom-Left margin
      { x: 0.50, y: 0.91 }, // 7: Across Bottom center
      { x: 0.88, y: 0.84 }, // 8: Bottom-Right margin
      { x: 0.91, y: 0.50 }, // 9: Up Right edge
      { x: 0.72, y: 0.44 }, // 10: Inward loop toward center
      { x: 0.50, y: 0.50 }, // 11: Direct into 50mm x 50mm Magnifying Glass!
    ];

    // Spline curve interpolation
    function getSplinePoint(t) {
      const n = waypoints.length;
      const totalT = t * (n - 1);
      const i = Math.min(Math.floor(totalT), n - 2);
      const subT = totalT - i;

      // Catmull-Rom or Cubic smooth blend
      const p0 = waypoints[Math.max(0, i - 1)];
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];
      const p3 = waypoints[Math.min(n - 1, i + 2)];

      // Cubic Hermite calculation
      const t2 = subT * subT;
      const t3 = t2 * subT;

      const x =
        0.5 *
        ((2 * p1.x) +
          (-p0.x + p2.x) * subT +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

      const y =
        0.5 *
        ((2 * p1.y) +
          (-p0.y + p2.y) * subT +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

      return { x: x * width, y: y * height };
    }

    let startTime = performance.now();
    let currentT = 0;
    const TOTAL_DURATION = 6800; // ~6.8 seconds for cinematic full journey
    let headX = startX;
    let headY = startY;
    let headAngle = -Math.PI / 4;
    let tongueOut = 0;
    let particles = [];

    // Spiral into glass params
    let spiralRadius = 45;
    let spiralAngle = 0;
    let enteringGlass = false;
    let glassEntryStartTime = 0;

    const animate = (now) => {
      const elapsed = now - startTime;
      currentT = Math.min(elapsed / TOTAL_DURATION, 1.0);

      // Phase updates
      if (currentT < 0.15) {
        setPhase('emerging');
        setProgressText('Awakening from Letter S...');
      } else if (currentT < 0.82) {
        setPhase('circling');
        setProgressText('Circumnavigating Screen Perimeter...');
      } else if (currentT < 0.98) {
        setPhase('entering');
        setProgressText('Entering 50mm x 50mm Fashion Lens...');
      } else {
        if (!hasFinishedRef.current) {
          hasFinishedRef.current = true;
          setLensFlash(true);
          setProgressText('Fashion Vision AI Lens Focused!');
          setTimeout(() => {
            onComplete?.();
          }, 650);
        }
      }

      // Compute head target position
      if (currentT < 0.85) {
        const pt = getSplinePoint(currentT / 0.85);
        const nextPt = getSplinePoint(Math.min((currentT + 0.005) / 0.85, 1.0));
        headX = pt.x;
        headY = pt.y;
        headAngle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x);
      } else {
        // Entering the 50mm magnifying glass: spiral into center
        if (!enteringGlass) {
          enteringGlass = true;
          glassEntryStartTime = now;
        }
        const enterProgress = (currentT - 0.85) / 0.15;
        spiralRadius = Math.max(0, 48 * (1 - enterProgress));
        spiralAngle += 0.22;
        headX = width * 0.5 + Math.cos(spiralAngle) * spiralRadius;
        headY = height * 0.5 + Math.sin(spiralAngle) * spiralRadius;
        headAngle = spiralAngle + Math.PI / 2;
      }

      // Tongue flick logic
      const tongueCycle = Math.sin(now * 0.016);
      tongueOut = tongueCycle > 0.4 ? (tongueCycle - 0.4) * 1.6 : 0;

      // Update Head of Snake
      segments[0].x = headX;
      segments[0].y = headY;
      segments[0].angle = headAngle;

      // Update trailing body segments with realistic inverse kinematics & serpentine wave undulation
      const waveFreq = 0.24;
      const waveSpeed = 0.018;
      const waveAmp = 5.5;

      for (let i = 1; i < NUM_SEGMENTS; i++) {
        const prev = segments[i - 1];
        const curr = segments[i];

        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const dist = Math.hypot(dx, dy) || 1;

        // Position along the spine distance constraint
        const targetX = prev.x + (dx / dist) * SEGMENT_SPACING;
        const targetY = prev.y + (dy / dist) * SEGMENT_SPACING;

        // Serpentine lateral undulation (propagates down the body)
        const lateralOffset = Math.sin(i * waveFreq - now * waveSpeed) * waveAmp * (1 - (i / NUM_SEGMENTS) * 0.35);
        const normalAngle = prev.angle + Math.PI / 2;

        curr.x = targetX + Math.cos(normalAngle) * (lateralOffset * 0.2);
        curr.y = targetY + Math.sin(normalAngle) * (lateralOffset * 0.2);
        curr.angle = Math.atan2(prev.y - curr.y, prev.x - curr.x);
      }

      // Add sparkle dust particles from serpent motion
      if (Math.random() < 0.45 && currentT < 0.9) {
        const seg = segments[Math.floor(Math.random() * 20)];
        particles.push({
          x: seg.x + (Math.random() - 0.5) * 16,
          y: seg.y + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.4,
          alpha: 0.9,
          size: Math.random() * 3 + 1.5,
          color: Math.random() > 0.4 ? '#38bdf8' : '#34d399'
        });
      }

      // CLEAR CANVAS
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing magical trail & particles
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.025;

        if (pt.alpha <= 0) {
          particles.splice(p, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. DRAW REALISTIC SHADOW BENEATH ALL SEGMENTS
      ctx.save();
      ctx.shadowColor = 'rgba(2, 44, 76, 0.32)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetX = 12;
      ctx.shadowOffsetY = 18;

      ctx.beginPath();
      for (let i = NUM_SEGMENTS - 1; i >= 0; i--) {
        const seg = segments[i];
        const radius = getSegmentRadius(i, NUM_SEGMENTS);
        if (i === NUM_SEGMENTS - 1) {
          ctx.moveTo(seg.x, seg.y);
        } else {
          ctx.lineTo(seg.x, seg.y);
        }
      }
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(0, 20, 40, 0.2)';
      ctx.stroke();
      ctx.restore();

      // 3. DRAW REALISTIC SERPENT BODY SEGMENTS (TAIL TO HEAD)
      // High-grade luxury serpent with emerald, sapphire, metallic gold scales & 3D lighting
      for (let i = NUM_SEGMENTS - 1; i >= 1; i--) {
        const seg = segments[i];
        const prev = segments[i - 1];
        const radius = getSegmentRadius(i, NUM_SEGMENTS);
        const normAngle = seg.angle + Math.PI / 2;

        const leftX = seg.x + Math.cos(normAngle) * radius;
        const leftY = seg.y + Math.sin(normAngle) * radius;
        const rightX = seg.x - Math.cos(normAngle) * radius;
        const rightY = seg.y - Math.sin(normAngle) * radius;

        // 3D cylindrical lighting gradient across the body width
        const grad = ctx.createLinearGradient(leftX, leftY, rightX, rightY);
        // Dorsal (top) deep sapphire/emerald, central luminous jade/cyan, ventral pearl highlight
        grad.addColorStop(0.0, '#034a6e'); // deep ocean navy
        grad.addColorStop(0.2, '#065f46'); // imperial emerald
        grad.addColorStop(0.5, '#0ea5e9'); // vivid sapphire cyan
        grad.addColorStop(0.7, '#10b981'); // glowing jade
        grad.addColorStop(0.9, '#bae6fd'); // pearl ventral belly
        grad.addColorStop(1.0, '#0369a1'); // shadowed ridge

        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Diamond scale texture on dorsal spine (every 2nd segment)
        if (i % 2 === 0 && radius > 4) {
          ctx.fillStyle = i % 4 === 0 ? 'rgba(254, 240, 138, 0.7)' : 'rgba(255, 255, 255, 0.45)';
          ctx.beginPath();
          // Draw miniature scale diamond
          const scaleLen = radius * 0.45;
          const scaleWidth = radius * 0.3;
          ctx.save();
          ctx.translate(seg.x, seg.y);
          ctx.rotate(seg.angle);
          ctx.moveTo(scaleLen, 0);
          ctx.lineTo(0, -scaleWidth);
          ctx.lineTo(-scaleLen, 0);
          ctx.lineTo(0, scaleWidth);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }

      // 4. DRAW FORKED TONGUE (Flips out when tongueOut > 0)
      if (tongueOut > 0) {
        ctx.save();
        ctx.translate(headX, headY);
        ctx.rotate(headAngle);

        const tongueLength = 18 * tongueOut;
        const forkLength = 7 * tongueOut;

        ctx.strokeStyle = '#e11d48'; // deep serpent crimson
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 4;

        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(14 + tongueLength, 0);
        // Left fork
        ctx.lineTo(14 + tongueLength + forkLength, -4);
        // Right fork
        ctx.moveTo(14 + tongueLength, 0);
        ctx.lineTo(14 + tongueLength + forkLength, 4);
        ctx.stroke();
        ctx.restore();
      }

      // 5. DRAW HIGH-DETAIL REALISTIC VIPER HEAD
      ctx.save();
      ctx.translate(headX, headY);
      ctx.rotate(headAngle);

      // Head gradient: 3D sculpted metallic python head
      const headGrad = ctx.createRadialGradient(4, 0, 2, 0, 0, 18);
      headGrad.addColorStop(0, '#38bdf8');
      headGrad.addColorStop(0.4, '#0284c7');
      headGrad.addColorStop(0.8, '#065f46');
      headGrad.addColorStop(1, '#022c22');

      ctx.fillStyle = headGrad;
      ctx.shadowColor = 'rgba(2, 132, 199, 0.6)';
      ctx.shadowBlur = 10;

      // Realistic spade-shaped viper cranium
      ctx.beginPath();
      ctx.moveTo(16, 0); // Snout tip
      ctx.bezierCurveTo(14, -5, 6, -11, -3, -11); // Left brow & jaw muscle
      ctx.bezierCurveTo(-10, -11, -14, -7, -14, 0); // Back of skull
      ctx.bezierCurveTo(-14, 7, -10, 11, -3, 11); // Right jaw muscle
      ctx.bezierCurveTo(6, 11, 14, 5, 16, 0); // Right snout
      ctx.closePath();
      ctx.fill();

      // Supraocular ridges (brow bone highlights)
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.8)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(3, -7, 4, -0.4, 1.8);
      ctx.arc(3, 7, 4, -1.8, 0.4);
      ctx.stroke();

      // Nostril pit organs
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.arc(13, -2.2, 1, 0, Math.PI * 2);
      ctx.arc(13, 2.2, 1, 0, Math.PI * 2);
      ctx.fill();

      // Striking Piercing Eyes (Amber-Topaz with vertical slit pupil)
      drawSerpentEye(ctx, 3, -6.5);
      drawSerpentEye(ctx, 3, 6.5);

      // Skull Crown Diamond Scale
      ctx.fillStyle = '#fde047'; // 24k gold royal crown facet
      ctx.beginPath();
      ctx.moveTo(-1, 0);
      ctx.lineTo(-4, -2.5);
      ctx.lineTo(-7, 0);
      ctx.lineTo(-4, 2.5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onComplete]);

  // Helper to compute segment radius (tapered head, fuller mid-body, slim whip tail)
  function getSegmentRadius(index, total) {
    if (index < 4) return 8 + index * 1.5; // neck transition
    if (index < 30) return 13 + Math.sin((index / 30) * Math.PI) * 2.5; // thickest mid-body
    // Tail gradual taper
    const tailT = (index - 30) / (total - 30);
    return Math.max(1.8, 14 * (1 - tailT));
  }

  // Helper to draw realistic reptile eye with vertical slit pupil & jewel reflection
  function drawSerpentEye(ctx, x, y) {
    ctx.save();
    // Eye socket
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(x, y, 3.2, 2.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Amber-Gold Iris
    const eyeGrad = ctx.createRadialGradient(x, y, 0.5, x, y, 2.8);
    eyeGrad.addColorStop(0, '#fef08a'); // luminous gold center
    eyeGrad.addColorStop(0.7, '#f59e0b'); // amber edge
    eyeGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = eyeGrad;
    ctx.beginPath();
    ctx.arc(x, y, 2.6, 0, Math.PI * 2);
    ctx.fill();

    // Vertical slit pupil
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(x, y, 0.7, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Specular jewel reflection glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 0.9, y - 0.8, 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white select-none">
      {/* Dynamic Background Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* HTML5 Interactive Animation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />

      {/* Top Bar with Brand & Skip Option */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></span>
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
            Fashionsearch AI
          </span>
        </div>

        <button
          onClick={() => onComplete?.()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-slate-200 transition active:scale-95 group shadow-lg"
        >
          <span>Skip Animation</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* CENTERPIECE: The 'S' Letter Emblem & The 50mm x 50mm Magnifying Glass */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        {/* PHASE 1: The 'S' Emblem (Serpent Emerges From Here) */}
        <div
          className={`relative transition-all duration-700 flex flex-col items-center ${
            phase === 'entering' ? 'opacity-30 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
            {/* Architectural Letter 'S' with Luxury Glow */}
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_25px_rgba(56,189,248,0.45)]">
              <defs>
                <linearGradient id="sLetterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="neonS">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Letter F Subtle Spine Backdrop */}
              <rect x="36" y="22" width="10" height="56" rx="3" fill="#ffffff" opacity="0.18" />
              <rect x="36" y="22" width="28" height="8" rx="2.5" fill="#ffffff" opacity="0.18" />
              <rect x="36" y="44" width="20" height="7" rx="2" fill="#ffffff" opacity="0.18" />

              {/* The 'S' Contour Route where the snake is born */}
              <path
                d="M 68 28 C 58 12, 32 14, 30 34 C 28 54, 72 52, 68 70 C 64 88, 34 86, 26 72"
                stroke="url(#sLetterGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                filter="url(#neonS)"
                className="animate-pulse"
              />
              <circle cx="68" cy="28" r="4" fill="#38bdf8" />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 drop-shadow-md">
            Fashion<span className="text-sky-400">search</span>
          </h2>
          <p className="text-xs text-sky-200/80 font-medium">AI Costume Recognition Lens</p>
        </div>

        {/* 
          PHASE 2 & 3: The EXACT 50mm x 50mm MAGNIFYING GLASS 
          Required: Length 50mm and Width 50mm (CSS standard unit `50mm`)
        */}
        <div
          className={`absolute flex flex-col items-center transition-all duration-700 ${
            phase === 'entering' ? 'scale-110 opacity-100' : 'opacity-85 scale-100'
          }`}
          style={{
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%'
          }}
        >
          {/* THE 50mm x 50mm PHYSICAL MAGNIFYING GLASS */}
          <div
            id="magnifying-glass-50mm"
            style={{
              width: '50mm',
              height: '50mm',
              minWidth: '50mm',
              minHeight: '50mm'
            }}
            className={`relative rounded-full transition-all duration-500 flex items-center justify-center ${
              lensFlash
                ? 'shadow-[0_0_80px_rgba(56,189,248,1),0_0_120px_rgba(16,185,129,0.9)] scale-125 bg-white'
                : 'shadow-[0_0_35px_rgba(56,189,248,0.5),inset_0_0_20px_rgba(255,255,255,0.4)]'
            }`}
          >
            {/* Outer Premium Metallic Bezel (Polished Dual-Tone Platinum & Rose Gold) */}
            <div className="absolute inset-0 rounded-full border-[5px] border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.6)] bg-gradient-to-tr from-slate-400 via-sky-200 to-amber-200 p-[2px]">
              <div className="w-full h-full rounded-full border-[2px] border-slate-900/60"></div>
            </div>

            {/* Crystal Optical Lens Convex Refraction Surface */}
            <div className="absolute inset-[6px] rounded-full overflow-hidden bg-gradient-to-tr from-sky-500/20 via-white/10 to-emerald-400/20 backdrop-blur-[2px] border border-white/40">
              {/* Glass Specular Glare Arc */}
              <div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-b from-white/60 to-transparent transform -rotate-45 pointer-events-none"></div>

              {/* Optical Reticle / Crosshair Lens Markings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-sky-300/30"></div>
                <div className="h-full w-[1px] bg-sky-300/30"></div>
                <div className="w-8 h-8 rounded-full border border-sky-300/40 animate-ping"></div>
              </div>

              {/* Lens Specification Engraving */}
              <div className="absolute bottom-1 inset-x-0 text-center text-[7px] tracking-widest text-sky-300 font-mono font-bold uppercase opacity-80">
                50mm • OPTIC LENS
              </div>
            </div>

            {/* Magnifying Glass Ergonomic Luxury Handle */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '88%',
                left: '88%',
                width: '18px',
                height: '75px',
                transform: 'rotate(-45deg)',
                transformOrigin: 'top center'
              }}
            >
              {/* Handle Collar Fitting */}
              <div className="w-full h-4 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-sm shadow-md border-t border-white/50"></div>
              {/* Main Grip */}
              <div className="w-full h-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-b-xl border border-slate-700 shadow-xl flex flex-col justify-around py-2 items-center">
                <div className="w-3/4 h-[2px] bg-amber-400/40 rounded"></div>
                <div className="w-3/4 h-[2px] bg-amber-400/40 rounded"></div>
                <div className="w-3/4 h-[2px] bg-amber-400/40 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Banner & Lens Dimension Badge */}
      <div className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-center z-30 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-sky-500/30 shadow-lg text-xs font-semibold text-sky-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
          <span>{progressText}</span>
        </div>

        <p className="text-[11px] text-slate-400 max-w-sm">
          Realistic Serpent Screen Journey → Enters 50mm×50mm Optical Glass → Unlocks Visual Fashion Finder
        </p>
      </div>

      {/* Full-screen Radiant Flash on Lens Entrance */}
      {lensFlash && (
        <div className="absolute inset-0 bg-white pointer-events-none z-40 animate-out fade-out duration-700"></div>
      )}
    </div>
  );
}
