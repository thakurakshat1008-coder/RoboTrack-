import React, { useState } from 'react';

export const RoverCanvas: React.FC = () => {
  const [activeSensor, setActiveSensor] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-[16/10] max-w-2xl mx-auto flex items-center justify-center select-none">
      {/* Background scanline & circular radar grid */}
      <div className="absolute inset-0 scanline-grid opacity-30 rounded-2xl pointer-events-none" />
      
      {/* Radial sweep aura */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-cyan-500/15 pointer-events-none flex items-center justify-center">
        <div className="w-[260px] h-[260px] rounded-full border border-cyan-500/20" />
        <div className="w-[160px] h-[160px] rounded-full border border-cyan-500/25" />
        <div className="absolute inset-0 radar-sweep rounded-full bg-gradient-to-tr from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      </div>

      {/* Technical HUD Floating Overlays */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-cyan-400/80 bg-[#070B14]/80 px-2.5 py-1 rounded border border-cyan-500/20 backdrop-blur-sm">
        <span className="text-slate-400">POS: </span>37°46'29.7"N 122°25'09.8"W
      </div>

      <div className="absolute top-4 right-4 z-10 font-mono text-[11px] text-cyan-400/80 bg-[#070B14]/80 px-2.5 py-1 rounded border border-cyan-500/20 backdrop-blur-sm">
        <span className="text-slate-400">MODE: </span>AUTONOMOUS SCOUT
      </div>

      <div className="absolute bottom-4 left-4 z-10 font-mono text-[11px] text-slate-400 bg-[#070B14]/80 px-2.5 py-1 rounded border border-slate-800 backdrop-blur-sm">
        <span>LIDAR PULSE: </span>
        <span className="text-emerald-400 font-bold">ACTIVE (128-BEAM)</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 font-mono text-[11px] text-slate-400 bg-[#070B14]/80 px-2.5 py-1 rounded border border-slate-800 backdrop-blur-sm">
        <span>EST. LATENCY: </span>
        <span className="text-cyan-400 font-bold">14.2 ms</span>
      </div>

      {/* Main Isometric Autonomous Rover SVG Model */}
      <div className="relative z-0 w-full h-full flex items-center justify-center p-6 transition-transform duration-500 hover:scale-[1.02]">
        <svg 
          viewBox="0 0 640 400" 
          className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,229,255,0.12)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for Chassis and Metallic Panels */}
            <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E2A40" />
              <stop offset="50%" stopColor="#0F1726" />
              <stop offset="100%" stopColor="#080E18" />
            </linearGradient>

            <linearGradient id="armorHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3478F6" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>

            <linearGradient id="wheelTread" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#162030" />
              <stop offset="50%" stopColor="#2A3952" />
              <stop offset="100%" stopColor="#0F1522" />
            </linearGradient>

            <radialGradient id="sensorGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ground Calibration Shadow */}
          <ellipse cx="320" cy="350" rx="230" ry="26" fill="#03060B" opacity="0.85" />
          <ellipse cx="320" cy="350" rx="170" ry="16" fill="#00E5FF" opacity="0.06" />

          {/* Laser Scanning Cone Projected Forward */}
          <polygon 
            points="320,110 520,320 600,280" 
            fill="url(#sensorGlow)" 
            opacity="0.18" 
          />
          <line x1="320" y1="110" x2="520" y2="320" stroke="#00E5FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
          <line x1="320" y1="110" x2="600" y2="280" stroke="#00E5FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

          {/* Suspension Links & Axles */}
          {/* Back Left Wheel Link */}
          <path d="M220 250 L140 280 L140 310" stroke="#25354F" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          {/* Back Right Wheel Link */}
          <path d="M420 250 L500 280 L500 310" stroke="#25354F" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          {/* Front Center Pivot Links */}
          <path d="M250 270 L210 325" stroke="#374E73" strokeWidth="12" strokeLinecap="round" />
          <path d="M390 270 L430 325" stroke="#374E73" strokeWidth="12" strokeLinecap="round" />

          {/* WHEEL 1: Rear-Left */}
          <g>
            <rect x="110" y="270" width="46" height="75" rx="12" fill="url(#wheelTread)" stroke="#344865" strokeWidth="2" />
            <line x1="110" y1="290" x2="156" y2="290" stroke="#00E5FF" strokeWidth="1" opacity="0.4" />
            <line x1="110" y1="315" x2="156" y2="315" stroke="#00E5FF" strokeWidth="1" opacity="0.4" />
            <circle cx="133" cy="307" r="8" fill="#0A101A" stroke="#00E5FF" strokeWidth="1.5" />
          </g>

          {/* WHEEL 2: Rear-Right */}
          <g>
            <rect x="484" y="270" width="46" height="75" rx="12" fill="url(#wheelTread)" stroke="#344865" strokeWidth="2" />
            <line x1="484" y1="290" x2="530" y2="290" stroke="#00E5FF" strokeWidth="1" opacity="0.4" />
            <line x1="484" y1="315" x2="530" y2="315" stroke="#00E5FF" strokeWidth="1" opacity="0.4" />
            <circle cx="507" cy="307" r="8" fill="#0A101A" stroke="#00E5FF" strokeWidth="1.5" />
          </g>

          {/* Lower Chassis Base Skid Plate */}
          <polygon points="190,265 450,265 420,310 220,310" fill="#0B121E" stroke="#1F2F4A" strokeWidth="2" />

          {/* MAIN CHASSIS BODY (Faceted Stealth Polygonal Armor) */}
          <polygon 
            points="180,245 220,180 420,180 460,245 435,275 205,275" 
            fill="url(#chassisGrad)" 
            stroke="#2B3E5C" 
            strokeWidth="2.5" 
          />

          {/* Upper Deck Shell with Angled Cutouts */}
          <polygon 
            points="230,180 270,140 370,140 410,180 395,210 245,210" 
            fill="#121D2C" 
            stroke="#3E5882" 
            strokeWidth="1.8" 
          />

          {/* Neon Energy Status Rail */}
          <path 
            d="M205 240 L435 240" 
            stroke="#00E5FF" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="filter drop-shadow-[0_0_8px_#00E5FF]" 
          />
          <path 
            d="M245 210 L395 210" 
            stroke="#3478F6" 
            strokeWidth="2" 
            strokeLinecap="round" 
            className="filter drop-shadow-[0_0_6px_#3478F6]" 
          />

          {/* WHEEL 3: Front-Left (Foreground) */}
          <g className="cursor-pointer" onMouseEnter={() => setActiveSensor('Drive Motor Left')}>
            <rect x="180" y="285" width="56" height="88" rx="14" fill="url(#wheelTread)" stroke="#4A658E" strokeWidth="2.5" />
            {/* Mecanum / Omnidirectional Angled Rollers */}
            <line x1="184" y1="300" x2="232" y2="310" stroke="#00E5FF" strokeWidth="1.8" opacity="0.6" />
            <line x1="184" y1="322" x2="232" y2="332" stroke="#00E5FF" strokeWidth="1.8" opacity="0.6" />
            <line x1="184" y1="344" x2="232" y2="354" stroke="#00E5FF" strokeWidth="1.8" opacity="0.6" />
            {/* Motor hub & axle */}
            <circle cx="208" cy="329" r="12" fill="#0C1420" stroke="#00E5FF" strokeWidth="2" />
            <circle cx="208" cy="329" r="4" fill="#00E5FF" />
          </g>

          {/* WHEEL 4: Front-Right (Foreground) */}
          <g className="cursor-pointer" onMouseEnter={() => setActiveSensor('Drive Motor Right')}>
            <rect x="404" y="285" width="56" height="88" rx="14" fill="url(#wheelTread)" stroke="#4A658E" strokeWidth="2.5" />
            {/* Rollers */}
            <line x1="408" y1="310" x2="456" y2="300" stroke="#00E5FF" strokeWidth="1.8" opacity="0.6" />
            <line x1="408" y1="332" x2="456" y2="322" stroke="#00E5FF" strokeWidth="1.8" opacity="0.6" />
            <line x1="408" y1="354" x2="456" y2="344" stroke="#00E5FF" strokeWidth="1.8" opacity="0.6" />
            {/* Hub */}
            <circle cx="432" cy="329" r="12" fill="#0C1420" stroke="#00E5FF" strokeWidth="2" />
            <circle cx="432" cy="329" r="4" fill="#00E5FF" />
          </g>

          {/* ROTATING 3D OPTICAL LIDAR TURRET */}
          <g className="cursor-pointer" onMouseEnter={() => setActiveSensor('3D Solid-State LiDAR')}>
            {/* Mast Base */}
            <rect x="306" y="125" width="28" height="20" rx="3" fill="#1C283B" stroke="#3D567D" strokeWidth="1.5" />
            {/* Spinning Head Housing */}
            <rect x="296" y="90" width="48" height="36" rx="8" fill="#0B1320" stroke="#00E5FF" strokeWidth="2" className="filter drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]" />
            {/* Optical Sensor Aperture */}
            <rect x="304" y="98" width="32" height="12" rx="3" fill="#00E5FF" opacity="0.9" />
            <line x1="320" y1="94" x2="320" y2="82" stroke="#00E5FF" strokeWidth="2" />
            <circle cx="320" cy="80" r="3" fill="#3478F6" />
          </g>

          {/* DUAL STEREO DEPTH CAMERAS ON FOREGROUND NOSE */}
          <g className="cursor-pointer" onMouseEnter={() => setActiveSensor('RealSense Stereo Depth Camera')}>
            <rect x="285" y="200" width="70" height="20" rx="5" fill="#0A111C" stroke="#2D4263" strokeWidth="1.5" />
            <circle cx="300" cy="210" r="4.5" fill="#00E5FF" opacity="0.8" />
            <circle cx="340" cy="210" r="4.5" fill="#00E5FF" opacity="0.8" />
            <circle cx="320" cy="210" r="2.5" fill="#8B5CF6" />
          </g>

          {/* COMMUNICATION ANTENNA & BEACON */}
          <g>
            <line x1="250" y1="140" x2="235" y2="75" stroke="#4A658E" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="235" cy="73" r="3.5" fill="#8B5CF6" className="filter drop-shadow-[0_0_6px_#8B5CF6]" />
            <path d="M228 65 A10 10 0 0 1 242 65" stroke="#8B5CF6" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M224 58 A16 16 0 0 1 246 58" stroke="#8B5CF6" strokeWidth="1.5" fill="none" opacity="0.4" />
          </g>

          {/* Crosshair target indicator */}
          <g transform="translate(320, 210)">
            <circle cx="0" cy="0" r="16" stroke="#00E5FF" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4" />
            <line x1="-22" y1="0" x2="22" y2="0" stroke="#00E5FF" strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="-22" x2="0" y2="22" stroke="#00E5FF" strokeWidth="1" opacity="0.5" />
          </g>
        </svg>
      </div>

      {/* Sensor Inspection Tooltip */}
      {activeSensor && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-3 py-1.5 bg-[#0D1422]/95 border border-cyan-400 text-cyan-300 font-mono text-xs rounded shadow-lg pointer-events-none">
          CALIBRATED: {activeSensor}
        </div>
      )}
    </div>
  );
};
