import React, { useState, useRef } from 'react';
import { 
  BLUEPRINT_COMPONENTS, 
  BlueprintComponent 
} from '../data/blueprintComponents.ts';
import { 
  Cpu, 
  Crosshair, 
  Layers, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  Info,
  Radio,
  Activity,
  Sparkles,
  Thermometer,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

interface BlueprintSectionProps {
  onOpenDashboard: (tab?: string) => void;
}

export const BlueprintSection: React.FC<BlueprintSectionProps> = ({ 
  onOpenDashboard 
}) => {
  const [selectedId, setSelectedId] = useState<string>('bp-lidar');
  const [hoveredId, setHoveredId] = useState<string | null>('bp-lidar');
  const [activeProjection, setActiveProjection] = useState<'isometric' | 'topDown' | 'sideElevation'>('isometric');
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = BLUEPRINT_COMPONENTS.find(c => c.id === selectedId) || BLUEPRINT_COMPONENTS[0];
  const hovered = hoveredId ? (BLUEPRINT_COMPONENTS.find(c => c.id === hoveredId) || selected) : selected;

  // Handle pointer tracking for dynamic popup positioning
  const handleModulePointerMove = (e: React.MouseEvent, componentId: string) => {
    setHoveredId(componentId);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverPos({ x, y });
  };

  const handleModulePointerLeave = () => {
    setHoveredId(null);
    setHoverPos(null);
  };

  return (
    <section id="blueprint" className="py-24 px-6 relative bg-[#FAF7F2] dark:bg-[#070B14] border-t border-[#E5DFD7] dark:border-[#111B2C] transition-colors duration-200">
      {/* Background CAD Phosphor ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#EADCC9]/20 via-[#82B2D8]/10 to-[#E8B4A2]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with distinctive technical typography */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-white dark:bg-[#0D1422] text-[#6E6659] dark:text-[#EADCC9] border border-[#C5A880]/30 shadow-xs mb-3">
            <Crosshair className="w-3.5 h-3.5 text-[#E8B4A2]" />
            Subsystem Architecture & Interactive CAD Schematics
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#FAF7F2] font-display uppercase leading-tight">
            Interactive Robot Chassis Map
          </h2>

          <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-[#8996AA] font-sans">
            Hover over any distinct module on the chassis map (LiDAR, Motor Drive, Control Board, Energy Core) to trigger the live hardware telemetry HUD. Click to lock and inspect pinouts.
          </p>
        </div>

        {/* Blueprint Container */}
        <div className="rounded-3xl bg-white dark:bg-[#0A0E1A] border border-[#E5DFD7] dark:border-[#1E2B45] shadow-xl overflow-hidden">
          {/* Top Control Bar */}
          <div className="px-6 py-4 bg-[#F4EDE4]/60 dark:bg-[#080D18] border-b border-[#E5DFD7] dark:border-[#1E2B45] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8B4A2] animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-[#EADCC9]">
                ARES-IV CAD PLATFORM • INTERACTIVE CHASSIS MAP
              </span>
            </div>

            {/* Projection selector */}
            <div className="inline-flex rounded-xl bg-white dark:bg-[#0D1422] p-1 border border-slate-200 dark:border-[#1E2D4A] text-xs font-semibold">
              <button
                onClick={() => setActiveProjection('isometric')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeProjection === 'isometric'
                    ? 'bg-[#EADCC9]/40 dark:bg-[#1C273C] text-slate-900 dark:text-[#FAF7F2] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Isometric 3D
              </button>
              <button
                onClick={() => setActiveProjection('topDown')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeProjection === 'topDown'
                    ? 'bg-[#EADCC9]/40 dark:bg-[#1C273C] text-slate-900 dark:text-[#FAF7F2] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Top-Down Plan
              </button>
              <button
                onClick={() => setActiveProjection('sideElevation')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeProjection === 'sideElevation'
                    ? 'bg-[#EADCC9]/40 dark:bg-[#1C273C] text-slate-900 dark:text-[#FAF7F2] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Side Profile
              </button>
            </div>
          </div>

          {/* Main Grid: Interactive Chassis Map (7 cols) + Locked Technical Dossier (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-[#1E2B45]">
            {/* Interactive SVG Chassis Map */}
            <div 
              ref={containerRef}
              className="lg:col-span-7 p-6 blueprint-cad-grid relative flex flex-col items-center justify-center min-h-[520px] select-none"
            >
              <svg 
                viewBox="0 0 800 600" 
                className="w-full h-auto max-h-[520px] drop-shadow-md select-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="landing-blueprint-chassis" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4A88B7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#82B2D8" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="lidar-sweep-laser" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#82B2D8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#82B2D8" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="jetson-heat-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#849B74" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#849B74" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Dimension reference markings */}
                <g className="opacity-70 font-mono text-[11px]">
                  <line x1="120" y1="550" x2="680" y2="550" stroke="#82B2D8" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="120" y1="542" x2="120" y2="558" stroke="#82B2D8" strokeWidth="1.5" />
                  <line x1="680" y1="542" x2="680" y2="558" stroke="#82B2D8" strokeWidth="1.5" />
                  <text x="400" y="565" fill="#82B2D8" textAnchor="middle">WHEELBASE: 380 mm • CHASSIS WIDTH: 320 mm</text>
                </g>

                {/* Projections & Interactive Module Silhouettes */}
                {activeProjection === 'isometric' && (
                  <g>
                    {/* Shadow / Ground Plane */}
                    <ellipse cx="400" cy="480" rx="260" ry="60" fill="url(#landing-blueprint-chassis)" />

                    {/* MODULE: Rear-Left & Rear-Right Mecanum Wheels */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-mecanum')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-mecanum')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-mecanum')}
                      className="cursor-pointer"
                    >
                      <rect 
                        x="180" y="420" width="60" height="90" rx="14" 
                        fill="#1C273C" 
                        stroke={hovered?.id === 'bp-mecanum' ? '#E8B4A2' : '#82B2D8'} 
                        strokeWidth={hovered?.id === 'bp-mecanum' ? '3' : '1.8'} 
                      />
                      <rect 
                        x="560" y="420" width="60" height="90" rx="14" 
                        fill="#1C273C" 
                        stroke={hovered?.id === 'bp-mecanum' ? '#E8B4A2' : '#82B2D8'} 
                        strokeWidth={hovered?.id === 'bp-mecanum' ? '3' : '1.8'} 
                      />
                    </g>

                    {/* MODULE: Power / LiFePO4 Battery Core (Under-slung Chassis Floor) */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-battery')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-battery')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-battery')}
                      className="cursor-pointer"
                    >
                      <polygon 
                        points="240,430 560,430 520,380 280,380" 
                        fill={hovered?.id === 'bp-battery' ? '#1C2740' : '#152136'} 
                        stroke={hovered?.id === 'bp-battery' ? '#A99DC9' : '#82B2D8'} 
                        strokeWidth={hovered?.id === 'bp-battery' ? '2.5' : '1.5'} 
                      />
                      <rect x="320" y="375" width="160" height="35" rx="5" fill="#171A2E" stroke="#A99DC9" strokeWidth="1.5" />
                      <text x="400" y="397" fill="#A99DC9" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        LiFePO4 24V 25Ah BATTERY
                      </text>
                    </g>

                    {/* MODULE: Carbon-Titanium Chassis Armor Spine */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-chassis')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-chassis')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-chassis')}
                      className="cursor-pointer"
                    >
                      <polygon 
                        points="220,370 580,370 530,260 270,260" 
                        fill="#0F172A" 
                        stroke={hovered?.id === 'bp-chassis' ? '#EADCC9' : '#4A88B7'} 
                        strokeWidth={hovered?.id === 'bp-chassis' ? '3' : '2.4'} 
                      />
                      <polygon points="280,260 520,260 480,230 320,230" fill="#1E293B" stroke="#EADCC9" strokeWidth="1.8" />
                    </g>

                    {/* MODULE: Control Board / Jetson AGX Orin Brain */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-jetson')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-jetson')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-jetson')}
                      className="cursor-pointer"
                    >
                      {hovered?.id === 'bp-jetson' && (
                        <circle cx="400" cy="260" r="45" fill="url(#jetson-heat-glow)" />
                      )}
                      <rect 
                        x="345" y="238" width="110" height="44" rx="4" 
                        fill={hovered?.id === 'bp-jetson' ? '#143022' : '#0D1F17'} 
                        stroke={hovered?.id === 'bp-jetson' ? '#849B74' : '#5C7350'} 
                        strokeWidth={hovered?.id === 'bp-jetson' ? '2.8' : '2'} 
                      />
                      <text x="400" y="264" fill="#849B74" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        NVIDIA JETSON ORIN
                      </text>
                    </g>

                    {/* MODULE: Motion Co-Processor MCU (ESP32-S3) */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-esp32')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-esp32')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-esp32')}
                      className="cursor-pointer"
                    >
                      <rect 
                        x="295" y="275" width="45" height="28" rx="3" 
                        fill={hovered?.id === 'bp-esp32' ? '#2A2412' : '#1C190D'} 
                        stroke={hovered?.id === 'bp-esp32' ? '#F3DC9B' : '#C5A880'} 
                        strokeWidth={hovered?.id === 'bp-esp32' ? '2.2' : '1.5'} 
                      />
                      <text x="317" y="293" fill="#F3DC9B" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        ESP32
                      </text>
                    </g>

                    {/* MODULE: Motor Drive Front-Left */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-motor-fl')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-motor-fl')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-motor-fl')}
                      className="cursor-pointer"
                    >
                      <rect 
                        x="150" y="470" width="60" height="85" rx="14" 
                        fill="#1C273C" 
                        stroke={hovered?.id === 'bp-motor-fl' ? '#EADCC9' : '#82B2D8'} 
                        strokeWidth={hovered?.id === 'bp-motor-fl' ? '3' : '2'} 
                      />
                      <circle cx="180" cy="512" r="16" fill="#0E1624" stroke="#EADCC9" strokeWidth="1.5" />
                    </g>

                    {/* MODULE: Motor Drive Front-Right */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-motor-fr')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-motor-fr')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-motor-fr')}
                      className="cursor-pointer"
                    >
                      <rect 
                        x="590" y="470" width="60" height="85" rx="14" 
                        fill="#1C273C" 
                        stroke={hovered?.id === 'bp-motor-fr' ? '#EADCC9' : '#82B2D8'} 
                        strokeWidth={hovered?.id === 'bp-motor-fr' ? '3' : '2'} 
                      />
                      <circle cx="620" cy="512" r="16" fill="#0E1624" stroke="#EADCC9" strokeWidth="1.5" />
                    </g>

                    {/* MODULE: Forward Sensor Mast & Optical Pylon */}
                    <path d="M400 230 L400 130" stroke="#82B2D8" strokeWidth="3" />
                    
                    {/* MODULE: Stereo Depth Vision Camera (Intel RealSense) */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-realsense')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-realsense')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-realsense')}
                      className="cursor-pointer"
                    >
                      <path d="M400 180 L520 180" stroke="#E8B4A2" strokeWidth="2" strokeDasharray="3 2" />
                      <rect 
                        x="510" y="165" width="48" height="26" rx="4" 
                        fill={hovered?.id === 'bp-realsense' ? '#3B1F22' : '#241416'} 
                        stroke="#E8B4A2" 
                        strokeWidth={hovered?.id === 'bp-realsense' ? '2.5' : '1.8'} 
                      />
                      <circle cx="522" cy="178" r="4.5" fill="#E8B4A2" />
                      <circle cx="544" cy="178" r="4.5" fill="#E8B4A2" />
                    </g>

                    {/* MODULE: LiDAR Module (Ouster OS1-32 Top Scanner) */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-lidar')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-lidar')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-lidar')}
                      className="cursor-pointer"
                    >
                      {/* Active laser fan preview */}
                      <path d="M400 110 L260 30 M400 110 L540 30" stroke="#82B2D8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                      <polygon points="400,110 260,30 540,30" fill="url(#lidar-sweep-laser)" />

                      <rect 
                        x="365" y="90" width="70" height="42" rx="8" 
                        fill={hovered?.id === 'bp-lidar' ? '#142745' : '#0E1A2E'} 
                        stroke="#82B2D8" 
                        strokeWidth={hovered?.id === 'bp-lidar' ? '3' : '2.5'} 
                      />
                      <ellipse cx="400" cy="90" rx="35" ry="10" fill="#162744" stroke="#82B2D8" strokeWidth="1.5" />
                    </g>

                    {/* MODULE: Front Ultrasonic Sonar Array */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-sonar')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-sonar')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-sonar')}
                      className="cursor-pointer"
                    >
                      <rect 
                        x="585" y="360" width="46" height="22" rx="3" 
                        fill="#1C1810" 
                        stroke="#F3DC9B" 
                        strokeWidth={hovered?.id === 'bp-sonar' ? '2.5' : '1.6'} 
                      />
                      <circle cx="597" cy="371" r="5" fill="#F3DC9B" opacity="0.9" />
                      <circle cx="619" cy="371" r="5" fill="#F3DC9B" opacity="0.9" />
                    </g>

                    {/* MODULE: 5G Telemetry & RF Antenna Mast */}
                    <g 
                      onMouseEnter={(e) => handleModulePointerMove(e, 'bp-5g')}
                      onMouseMove={(e) => handleModulePointerMove(e, 'bp-5g')}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId('bp-5g')}
                      className="cursor-pointer"
                    >
                      <line x1="280" y1="260" x2="250" y2="180" stroke="#82B2D8" strokeWidth="2" />
                      <circle cx="250" cy="180" r="5" fill="#82B2D8" />
                      <path d="M242 172 A12 12 0 0 1 258 172" stroke="#82B2D8" strokeWidth="1.5" fill="none" />
                      <path d="M236 166 A20 20 0 0 1 264 166" stroke="#82B2D8" strokeWidth="1.2" fill="none" opacity="0.6" />
                    </g>
                  </g>
                )}

                {activeProjection === 'topDown' && (
                  <g>
                    {/* 360° LiDAR Sensing Radar Arc Radius */}
                    <circle cx="400" cy="300" r="210" fill="none" stroke="#82B2D8" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                    {/* Forward RealSense Camera Field of View */}
                    <polygon points="400,300 680,180 680,420" fill="#E8B4A2" fillOpacity="0.08" stroke="#E8B4A2" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Chassis Outer Perimeter */}
                    <rect x="260" y="150" width="280" height="300" rx="18" fill="#0D1422" stroke="#4A88B7" strokeWidth="2.5" />

                    {/* 4 Corner Mecanum Wheels */}
                    <rect x="190" y="160" width="55" height="100" rx="10" fill="#1C273C" stroke="#82B2D8" strokeWidth="2" />
                    <rect x="555" y="160" width="55" height="100" rx="10" fill="#1C273C" stroke="#82B2D8" strokeWidth="2" />
                    <rect x="190" y="340" width="55" height="100" rx="10" fill="#1C273C" stroke="#82B2D8" strokeWidth="2" />
                    <rect x="555" y="340" width="55" height="100" rx="10" fill="#1C273C" stroke="#82B2D8" strokeWidth="2" />

                    {/* Battery Bay */}
                    <rect x="290" y="350" width="220" height="75" rx="6" fill="#152136" stroke="#A99DC9" strokeWidth="2" />
                    <text x="400" y="392" fill="#A99DC9" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      LiFePO4 BATTERY CELL ARRAY
                    </text>

                    {/* Jetson AGX Orin Brain in Center */}
                    <rect x="330" y="240" width="140" height="85" rx="6" fill="#0D1F17" stroke="#849B74" strokeWidth="2" />
                    <text x="400" y="285" fill="#849B74" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      NVIDIA AGX ORIN
                    </text>

                    {/* Top LiDAR */}
                    <circle cx="400" cy="280" r="28" fill="#0E1A2E" stroke="#82B2D8" strokeWidth="2.5" />
                    <circle cx="400" cy="280" r="8" fill="#82B2D8" />

                    {/* Front Sonar */}
                    <circle cx="560" cy="200" r="6" fill="#F3DC9B" />
                    <circle cx="560" cy="400" r="6" fill="#F3DC9B" />
                  </g>
                )}

                {activeProjection === 'sideElevation' && (
                  <g>
                    <line x1="80" y1="490" x2="720" y2="490" stroke="#6E6659" strokeWidth="2" />
                    <circle cx="240" cy="450" r="48" fill="#1C273C" stroke="#82B2D8" strokeWidth="2.5" />
                    <circle cx="560" cy="450" r="48" fill="#1C273C" stroke="#82B2D8" strokeWidth="2.5" />
                    <path d="M180 430 L620 430 L610 320 L500 280 L220 280 L180 340 Z" fill="#0F172A" stroke="#4A88B7" strokeWidth="2.5" />
                    <rect x="385" y="160" width="30" height="110" fill="#172238" stroke="#82B2D8" strokeWidth="2" />
                    <rect x="375" y="110" width="50" height="50" rx="6" fill="#0E1A2E" stroke="#82B2D8" strokeWidth="2.5" />
                  </g>
                )}

                {/* Hotspot Pin Nodes across all components */}
                {BLUEPRINT_COMPONENTS.map((comp, idx) => {
                  const coords = comp.coords[activeProjection];
                  const svgX = (coords.x / 100) * 800;
                  const svgY = (coords.y / 100) * 600;
                  const isHovered = hovered?.id === comp.id;
                  const isSelected = selected.id === comp.id;

                  return (
                    <g 
                      key={comp.id}
                      onMouseEnter={(e) => handleModulePointerMove(e, comp.id)}
                      onMouseMove={(e) => handleModulePointerMove(e, comp.id)}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedId(comp.id)}
                      className="cursor-pointer group"
                    >
                      {(isHovered || isSelected) && (
                        <>
                          <circle cx={svgX} cy={svgY} r="26" fill={comp.colorAccent} fillOpacity="0.22" className="animate-pulse" />
                          <circle cx={svgX} cy={svgY} r="18" fill="none" stroke={comp.colorAccent} strokeWidth="1.5" strokeDasharray="3 2" />
                        </>
                      )}
                      <circle 
                        cx={svgX} 
                        cy={svgY} 
                        r="12" 
                        fill={isSelected ? comp.colorAccent : (isHovered ? comp.colorAccent : '#0A0F1D')} 
                        stroke={comp.colorAccent} 
                        strokeWidth="2" 
                        className="transition-transform group-hover:scale-125"
                      />
                      <text 
                        x={svgX} 
                        y={svgY + 3.5} 
                        fill={(isSelected || isHovered) ? '#0A0F1D' : comp.colorAccent} 
                        fontSize="9" 
                        fontFamily="monospace" 
                        fontWeight="bold" 
                        textAnchor="middle"
                      >
                        {idx + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* DYNAMIC HOVER POPUP HUD CARD */}
              {hovered && (
                <div 
                  className="pointer-events-none absolute z-30 transition-all duration-150 ease-out"
                  style={{
                    left: hoverPos ? Math.min(Math.max(hoverPos.x + 20, 20), 460) : '24px',
                    top: hoverPos ? Math.min(Math.max(hoverPos.y - 40, 20), 300) : '24px',
                  }}
                >
                  <div className="w-[320px] rounded-2xl bg-slate-900/95 dark:bg-[#070D18]/95 backdrop-blur-xl border border-slate-700 dark:border-[#C5A880]/40 shadow-2xl p-4 text-xs font-mono text-slate-200">
                    {/* Top Status Tag */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-2 h-2 rounded-full animate-ping" 
                          style={{ backgroundColor: hovered.colorAccent }}
                        />
                        <span className="font-bold text-[10px] tracking-wider uppercase text-slate-300">
                          {hovered.code}
                        </span>
                      </div>
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ 
                          backgroundColor: `${hovered.colorAccent}25`,
                          color: hovered.colorAccent
                        }}
                      >
                        {hovered.status}
                      </span>
                    </div>

                    {/* Component Name */}
                    <div className="pt-2">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans">
                        {hovered.subsystem}
                      </div>
                      <h4 className="text-sm font-bold text-white font-tech mt-0.5 leading-snug">
                        {hovered.name}
                      </h4>
                    </div>

                    {/* Engineering Function summary */}
                    <p className="mt-2 text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-2">
                      {hovered.primaryFunction}
                    </p>

                    {/* Technical Properties Grid */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-slate-400 block">Operating Voltage</span>
                        <span className="font-bold text-white">{hovered.operatingVoltage}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Current Draw</span>
                        <span className="font-bold text-white">{hovered.currentDraw}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Bus Protocol</span>
                        <span className="font-bold text-white truncate block">{hovered.busProtocol}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Mass / Size</span>
                        <span className="font-bold text-white">{hovered.weight}</span>
                      </div>
                    </div>

                    {/* Live Telemetry Diagnostic Snapshot */}
                    <div className="mt-3 p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Activity className="w-3 h-3" />
                        <span>{hovered.telemetry.operationalMode}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-300">
                        <Thermometer className="w-3 h-3" />
                        <span>{hovered.telemetry.temperature}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-[9px] text-slate-400 text-center tracking-wider">
                      Click module to inspect full pinout wiring dossier
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Hotspot Hint Bar */}
              <div className="mt-4 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-[#0D1422]/90 border border-slate-200 dark:border-[#1E2B45] text-xs font-mono text-slate-600 dark:text-[#EADCC9] flex items-center gap-2">
                <Crosshair className="w-3.5 h-3.5 text-[#E8B4A2]" />
                <span>Hover over any chassis component to trigger the live hardware telemetry HUD</span>
              </div>
            </div>

            {/* Locked Technical Dossier (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-white dark:bg-[#0A0E1A] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span 
                    className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold"
                    style={{ 
                      backgroundColor: `${selected.colorAccent}20`,
                      color: selected.colorAccent,
                      border: `1px solid ${selected.colorAccent}40`
                    }}
                  >
                    {selected.code} • {selected.subsystem}
                  </span>
                  <span className="text-xs font-medium text-[#5C7350] dark:text-[#849B74] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#849B74]" />
                    {selected.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-[#FAF7F2] font-display">
                  {selected.name}
                </h3>

                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-[#E8B4A2]" />
                  <span>Mounting Datum: {selected.location}</span>
                </p>

                {/* Primary Function & Role */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0D1422] border border-slate-200 dark:border-[#182338]">
                  <div className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#EADCC9]" />
                    <span>Primary Engineering Role & Architecture:</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {selected.primaryFunction}
                  </p>
                </div>

                {/* Technical Specifications Grid */}
                <div className="mt-5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#141F33]">
                    <span className="text-slate-500 dark:text-slate-400">Operating Voltage:</span>
                    <span className="font-semibold text-slate-800 dark:text-[#FAF7F2]">{selected.operatingVoltage}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#141F33]">
                    <span className="text-slate-500 dark:text-slate-400">Bus / Protocol:</span>
                    <span className="font-semibold text-slate-800 dark:text-[#FAF7F2]">{selected.busProtocol}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#141F33]">
                    <span className="text-slate-500 dark:text-slate-400">Current / Power:</span>
                    <span className="font-semibold text-slate-800 dark:text-[#FAF7F2]">{selected.currentDraw}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#141F33]">
                    <span className="text-slate-500 dark:text-slate-400">Dimensions & Mass:</span>
                    <span className="font-semibold text-slate-800 dark:text-[#FAF7F2]">{selected.dimensions} • {selected.weight}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#141F33]">
                    <span className="text-slate-500 dark:text-slate-400">Tolerance:</span>
                    <span className="font-semibold text-slate-800 dark:text-[#FAF7F2]">{selected.tolerance}</span>
                  </div>
                </div>

                {/* Core Capabilities */}
                <div className="mt-4">
                  <div className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F3DC9B]" />
                    <span>Key Engineering Features:</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                    {selected.keyFeatures.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#C5A880]">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#182338] flex flex-wrap gap-2">
                <button
                  onClick={() => onOpenDashboard('blueprint')}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FAF7F2] to-[#EADCC9] dark:from-[#1C273C] dark:to-[#111929] text-slate-900 dark:text-[#FAF7F2] border border-[#C5A880]/50 hover:border-[#C5A880] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Cpu className="w-3.5 h-3.5 text-[#E8B4A2]" />
                  <span>Open Full CAD Dossier</span>
                </button>

                {selected.simulatorCompatible && (
                  <button
                    onClick={() => onOpenDashboard('simulator')}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#82B2D8]/10 text-[#4A88B7] dark:text-[#82B2D8] border border-[#82B2D8]/30 hover:bg-[#82B2D8]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Live Simulator</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
