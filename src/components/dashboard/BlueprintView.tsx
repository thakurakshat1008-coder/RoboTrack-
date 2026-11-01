import React, { useState, useRef } from 'react';
import { 
  BLUEPRINT_COMPONENTS, 
  BlueprintComponent, 
  BlueprintPin 
} from '../../data/blueprintComponents.ts';
import { 
  Cpu, 
  Layers, 
  Maximize2, 
  Zap, 
  Eye, 
  Compass, 
  Radio, 
  ShieldCheck, 
  Info, 
  ExternalLink, 
  Sliders, 
  Crosshair, 
  ChevronRight,
  CheckCircle2,
  Activity,
  Sparkles,
  FileText,
  Thermometer
} from 'lucide-react';

interface BlueprintViewProps {
  onNavigateToSimulator?: () => void;
  onNavigateToInventory?: () => void;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  onNavigateToSimulator,
  onNavigateToInventory
}) => {
  const [selectedComponentId, setSelectedComponentId] = useState<string>('bp-lidar');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'isometric' | 'topDown' | 'sideElevation'>('isometric');
  const [activeSubsystem, setActiveSubsystem] = useState<string>('All');
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedPin, setCopiedPin] = useState<string | null>(null);

  const selectedComponent = BLUEPRINT_COMPONENTS.find(c => c.id === selectedComponentId) || BLUEPRINT_COMPONENTS[0];
  const hoveredComponent = hoveredId ? (BLUEPRINT_COMPONENTS.find(c => c.id === hoveredId) || selectedComponent) : null;

  const handleModulePointerMove = (e: React.MouseEvent, componentId: string) => {
    setHoveredId(componentId);
    if (!canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverPos({ x, y });
  };

  const handleModulePointerLeave = () => {
    setHoveredId(null);
    setHoverPos(null);
  };

  const subsystems = [
    'All',
    'Perception & Vision',
    'Compute & Intelligence',
    'Powertrain & Actuation',
    'Power & Energy',
    'Telemetry & Comms',
    'Chassis & Structural'
  ];

  const filteredComponents = BLUEPRINT_COMPONENTS.filter(comp => {
    const matchesSubsystem = activeSubsystem === 'All' || comp.subsystem === activeSubsystem;
    const matchesSearch = searchQuery === '' || 
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.primaryFunction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubsystem && matchesSearch;
  });

  const handleCopyPin = (pin: BlueprintPin) => {
    navigator.clipboard?.writeText?.(`${pin.pin}: ${pin.label} (${pin.description})`);
    setCopiedPin(pin.pin);
    setTimeout(() => setCopiedPin(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1422] border border-[#E5DFD7] dark:border-[#1A263D] shadow-sm relative overflow-hidden transition-colors">
        {/* Subtle decorative champagne / rose gold ambient blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#EADCC9]/20 via-[#E8B4A2]/15 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#FAF7F2] dark:bg-[#111B2C] text-[#6E6659] dark:text-[#EADCC9] border border-[#C5A880]/30">
                Ares-IV System Architecture
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-[#5C7350] dark:text-[#849B74]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#849B74] animate-ping" />
                Live Interactive CAD
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#FAF7F2] flex items-center gap-2.5">
              Robot Blueprint & Component Architecture
            </h1>
            <p className="text-sm text-slate-600 dark:text-[#8996AA] max-w-2xl mt-1">
              Select any component directly on the CAD schematic or catalog to inspect its engineering functions, pinouts, bus protocols, and electrical tolerances.
            </p>
          </div>

          {/* Quick Stats / View Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-[#080E1C] p-1 border border-slate-200 dark:border-[#1E2D4A]">
              <button
                onClick={() => setViewMode('isometric')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'isometric'
                    ? 'bg-white dark:bg-[#15233C] text-slate-900 dark:text-[#EADCC9] shadow-sm border border-slate-200 dark:border-[#C5A880]/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Isometric 3D
              </button>
              <button
                onClick={() => setViewMode('topDown')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'topDown'
                    ? 'bg-white dark:bg-[#15233C] text-slate-900 dark:text-[#EADCC9] shadow-sm border border-slate-200 dark:border-[#C5A880]/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Top-Down Plan
              </button>
              <button
                onClick={() => setViewMode('sideElevation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'sideElevation'
                    ? 'bg-white dark:bg-[#15233C] text-slate-900 dark:text-[#EADCC9] shadow-sm border border-slate-200 dark:border-[#C5A880]/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Side Profile
              </button>
            </div>

            <button
              onClick={() => setShowDimensions(!showDimensions)}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                showDimensions 
                  ? 'bg-[#EADCC9]/20 text-[#6E6659] dark:text-[#EADCC9] border-[#C5A880]/40' 
                  : 'bg-slate-100 dark:bg-[#0D1422] text-slate-500 border-slate-200 dark:border-[#1E2D4A]'
              }`}
              title="Toggle Dimension Lines"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dimensions</span>
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                showGrid 
                  ? 'bg-[#82B2D8]/15 text-[#4A88B7] dark:text-[#82B2D8] border-[#82B2D8]/30' 
                  : 'bg-slate-100 dark:bg-[#0D1422] text-slate-500 border-slate-200 dark:border-[#1E2D4A]'
              }`}
              title="Toggle CAD Datum Grid"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CAD Grid</span>
            </button>
          </div>
        </div>

        {/* Subsystem Filter Bar */}
        <div className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1 text-xs">
          {subsystems.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubsystem(sub)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeSubsystem === sub
                  ? 'bg-gradient-to-r from-[#FAF7F2] to-[#EADCC9] dark:from-[#1A263D] dark:to-[#111929] text-slate-900 dark:text-[#FAF7F2] font-semibold border border-[#C5A880]/50 shadow-xs'
                  : 'text-slate-600 dark:text-[#8996AA] hover:bg-slate-100 dark:hover:bg-[#131D30] border border-transparent'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid: Left CAD Canvas, Right Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive CAD Blueprint Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-[#0A0E1A] border border-[#E5DFD7] dark:border-[#1E2B45] overflow-hidden shadow-sm relative">
            {/* Viewport Meta Bar */}
            <div className="px-4 py-2.5 bg-[#FAF7F2] dark:bg-[#080D18] border-b border-[#E5DFD7] dark:border-[#1E2B45] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E8B4A2]" />
                <span className="text-slate-700 dark:text-[#EADCC9] font-semibold uppercase">
                  VIEW: {viewMode.toUpperCase()} PROJECTION
                </span>
                <span className="text-slate-400 dark:text-slate-500">| SCALE 1:5 CAD</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <span>DATUM: (0.0, 0.0, 0.0)</span>
                <span>TOL: ISO 2768-m</span>
              </div>
            </div>

            {/* SVG Interactive Blueprint Canvas */}
            <div 
              ref={canvasContainerRef}
              className={`relative w-full aspect-[4/3] max-h-[580px] flex items-center justify-center p-4 select-none ${
                showGrid ? 'blueprint-cad-grid' : 'bg-slate-50 dark:bg-[#070B16]'
              }`}
            >
              <svg 
                viewBox="0 0 800 600" 
                className="w-full h-full drop-shadow-md select-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle Blueprint Gradients */}
                  <linearGradient id="chassis-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4A88B7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#82B2D8" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="armor-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EADCC9" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6E6659" stopOpacity="0.2" />
                  </linearGradient>
                  <radialGradient id="sensor-sweep-radar" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#82B2D8" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#82B2D8" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#82B2D8" stopOpacity="0" />
                  </radialGradient>
                  <pattern id="hatch-pattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#82B2D8" strokeWidth="0.7" opacity="0.3" />
                  </pattern>
                </defs>

                {/* 1. Dimension Overlays (When enabled) */}
                {showDimensions && (
                  <g className="opacity-80 transition-opacity">
                    {/* Horizontal Wheelbase / Length Leader */}
                    <line x1="120" y1="540" x2="680" y2="540" stroke="#82B2D8" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="120" y1="532" x2="120" y2="548" stroke="#82B2D8" strokeWidth="1.5" />
                    <line x1="680" y1="532" x2="680" y2="548" stroke="#82B2D8" strokeWidth="1.5" />
                    <text x="400" y="555" fill="#82B2D8" fontSize="11" fontFamily="monospace" textAnchor="middle">
                      LENGTH: 520 mm (±1.5mm)
                    </text>

                    {/* Vertical Sensor Mast Height Leader */}
                    <line x1="80" y1="110" x2="80" y2="500" stroke="#E8B4A2" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="72" y1="110" x2="88" y2="110" stroke="#E8B4A2" strokeWidth="1.5" />
                    <line x1="72" y1="500" x2="88" y2="500" stroke="#E8B4A2" strokeWidth="1.5" />
                    <text x="65" y="310" fill="#E8B4A2" fontSize="11" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 65 310)">
                      HEIGHT: 480 mm
                    </text>

                    {/* Ground Clearance Datum */}
                    <line x1="140" y1="500" x2="660" y2="500" stroke="#849B74" strokeWidth="1" strokeDasharray="2 4" />
                    <text x="695" y="504" fill="#849B74" fontSize="10" fontFamily="monospace">
                      DATUM CL: 65mm
                    </text>
                  </g>
                )}

                {/* 2. Vector Drawings by View Mode */}
                {viewMode === 'isometric' && (
                  <g className="transition-all duration-300">
                    {/* Isometric Ground Shadow & Grid Projection */}
                    <ellipse cx="400" cy="480" rx="260" ry="60" fill="url(#chassis-grad)" />

                    {/* 4 Mecanum Wheel Axle Blocks */}
                    {/* Rear Left Wheel */}
                    <g className="opacity-90">
                      <rect x="180" y="420" width="60" height="90" rx="14" fill="#1C273C" stroke="#82B2D8" strokeWidth="1.8" />
                      <line x1="180" y1="440" x2="240" y2="455" stroke="#EADCC9" strokeWidth="1.2" opacity="0.6" />
                      <line x1="180" y1="465" x2="240" y2="480" stroke="#EADCC9" strokeWidth="1.2" opacity="0.6" />
                      <line x1="180" y1="490" x2="240" y2="505" stroke="#EADCC9" strokeWidth="1.2" opacity="0.6" />
                    </g>
                    {/* Rear Right Wheel */}
                    <g className="opacity-90">
                      <rect x="560" y="420" width="60" height="90" rx="14" fill="#1C273C" stroke="#82B2D8" strokeWidth="1.8" />
                      <line x1="560" y1="455" x2="620" y2="440" stroke="#EADCC9" strokeWidth="1.2" opacity="0.6" />
                      <line x1="560" y1="480" x2="620" y2="465" stroke="#EADCC9" strokeWidth="1.2" opacity="0.6" />
                      <line x1="560" y1="505" x2="620" y2="490" stroke="#EADCC9" strokeWidth="1.2" opacity="0.6" />
                    </g>

                    {/* Lower Structural Sub-chassis / Battery Bay */}
                    <polygon 
                      points="240,430 560,430 520,380 280,380" 
                      fill="url(#hatch-pattern)" 
                      stroke="#82B2D8" 
                      strokeWidth="1.5" 
                    />
                    {/* Battery Box Outline */}
                    <rect x="320" y="360" width="160" height="48" rx="6" fill="#152136" stroke="#A99DC9" strokeWidth="2" />
                    <text x="400" y="388" fill="#A99DC9" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      LiFePO4 24V CORE
                    </text>

                    {/* Main Monocoque Chassis Tub */}
                    <polygon 
                      points="220,370 580,370 530,260 270,260" 
                      fill="#0F172A" 
                      stroke="#4A88B7" 
                      strokeWidth="2.4" 
                    />

                    {/* Upper Avionics Deck Plate */}
                    <polygon 
                      points="280,260 520,260 480,230 320,230" 
                      fill="#1E293B" 
                      stroke="#EADCC9" 
                      strokeWidth="1.8" 
                    />

                    {/* Jetson Orin Edge Compute Module (Center) */}
                    <rect x="350" y="240" width="100" height="42" rx="4" fill="#0D1F17" stroke="#849B74" strokeWidth="2" />
                    <text x="400" y="265" fill="#849B74" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      JETSON ORIN
                    </text>

                    {/* Front-Left & Front-Right Wheels */}
                    <g className="opacity-95">
                      <rect x="150" y="470" width="60" height="85" rx="14" fill="#1C273C" stroke="#EADCC9" strokeWidth="2" />
                      <line x1="150" y1="490" x2="210" y2="505" stroke="#E8B4A2" strokeWidth="1.4" />
                      <line x1="150" y1="515" x2="210" y2="530" stroke="#E8B4A2" strokeWidth="1.4" />
                    </g>
                    <g className="opacity-95">
                      <rect x="590" y="470" width="60" height="85" rx="14" fill="#1C273C" stroke="#EADCC9" strokeWidth="2" />
                      <line x1="590" y1="505" x2="650" y2="490" stroke="#E8B4A2" strokeWidth="1.4" />
                      <line x1="590" y1="530" x2="650" y2="515" stroke="#E8B4A2" strokeWidth="1.4" />
                    </g>

                    {/* Forward Sensor Mast & Pylon */}
                    <path d="M400 230 L400 130" stroke="#82B2D8" strokeWidth="3" />
                    <line x1="380" y1="180" x2="420" y2="180" stroke="#82B2D8" strokeWidth="2" />

                    {/* RealSense Stereo Camera Forward Arm */}
                    <path d="M400 180 L520 180" stroke="#E8B4A2" strokeWidth="2" strokeDasharray="3 2" />
                    <rect x="510" y="165" width="45" height="24" rx="4" fill="#241416" stroke="#E8B4A2" strokeWidth="2" />
                    <circle cx="522" cy="177" r="4" fill="#E8B4A2" />
                    <circle cx="542" cy="177" r="4" fill="#E8B4A2" />

                    {/* Top Ouster 3D LiDAR Sensor Cylindrical Head */}
                    <rect x="365" y="90" width="70" height="42" rx="8" fill="#0E1A2E" stroke="#82B2D8" strokeWidth="2.5" />
                    <ellipse cx="400" cy="90" rx="35" ry="10" fill="#162744" stroke="#82B2D8" strokeWidth="1.5" />
                    <line x1="365" y1="112" x2="435" y2="112" stroke="#82B2D8" strokeWidth="1.5" strokeDasharray="2 2" />
                    {/* Simulated 360 LiDAR Scan Wave Fan */}
                    <path d="M400 110 L280 40 M400 110 L520 40" stroke="#82B2D8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

                    {/* Ultrasonic Array at Front Bumper */}
                    <rect x="580" y="360" width="44" height="20" rx="3" fill="#1C1810" stroke="#F3DC9B" strokeWidth="1.8" />
                    <circle cx="592" cy="370" r="4.5" fill="#F3DC9B" opacity="0.8" />
                    <circle cx="612" cy="370" r="4.5" fill="#F3DC9B" opacity="0.8" />
                  </g>
                )}

                {viewMode === 'topDown' && (
                  <g className="transition-all duration-300">
                    {/* 360° LiDAR Sensing Radar Arc Radius */}
                    <circle cx="400" cy="300" r="220" fill="url(#sensor-sweep-radar)" stroke="#82B2D8" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="400" cy="300" r="140" fill="none" stroke="#82B2D8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
                    <line x1="180" y1="300" x2="620" y2="300" stroke="#82B2D8" strokeWidth="0.8" opacity="0.3" />
                    <line x1="400" y1="80" x2="400" y2="520" stroke="#82B2D8" strokeWidth="0.8" opacity="0.3" />

                    {/* Forward Field of View (RealSense Camera) */}
                    <polygon points="400,300 680,180 680,420" fill="#E8B4A2" fillOpacity="0.08" stroke="#E8B4A2" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Chassis Outer Perimeter */}
                    <rect x="260" y="150" width="280" height="300" rx="18" fill="#0D1422" stroke="#4A88B7" strokeWidth="2.5" />

                    {/* 4 Corner Mecanum Wheels */}
                    <rect x="190" y="160" width="55" height="100" rx="10" fill="#1C273C" stroke="#82B2D8" strokeWidth="2" />
                    <rect x="555" y="160" width="55" height="100" rx="10" fill="#1C273C" stroke="#82B2D8" strokeWidth="2" />
                    <rect x="190" y="340" width="55" height="100" rx="10" fill="#1C273C" stroke="#82B2D8" strokeWidth="2" />
                    <rect x="555" y="340" width="55" height="100" rx="10" fill="#1C273C" stroke="#82B2D8" strokeWidth="2" />

                    {/* Internal Component Layout */}
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

                    {/* Top LiDAR Mast */}
                    <circle cx="400" cy="280" r="28" fill="#0E1A2E" stroke="#82B2D8" strokeWidth="2.5" />
                    <circle cx="400" cy="280" r="8" fill="#82B2D8" />

                    {/* Front Bumper Ultrasonic Transducers */}
                    <circle cx="560" cy="200" r="6" fill="#F3DC9B" />
                    <circle cx="560" cy="400" r="6" fill="#F3DC9B" />
                  </g>
                )}

                {viewMode === 'sideElevation' && (
                  <g className="transition-all duration-300">
                    {/* Ground Line */}
                    <line x1="80" y1="490" x2="720" y2="490" stroke="#6E6659" strokeWidth="2" />
                    {/* Ground Hatch lines */}
                    <path d="M120 490 L100 510 M200 490 L180 510 M280 490 L260 510 M360 490 L340 510 M440 490 L420 510 M520 490 L500 510 M600 490 L580 510" stroke="#6E6659" strokeWidth="1" opacity="0.6" />

                    {/* Wheels Profile */}
                    <circle cx="240" cy="450" r="48" fill="#1C273C" stroke="#82B2D8" strokeWidth="2.5" />
                    <circle cx="240" cy="450" r="18" fill="#0B1220" stroke="#EADCC9" strokeWidth="1.5" />
                    
                    <circle cx="560" cy="450" r="48" fill="#1C273C" stroke="#82B2D8" strokeWidth="2.5" />
                    <circle cx="560" cy="450" r="18" fill="#0B1220" stroke="#EADCC9" strokeWidth="1.5" />

                    {/* Low-slung Battery Belly */}
                    <rect x="300" y="420" width="200" height="42" rx="6" fill="#152136" stroke="#A99DC9" strokeWidth="2" />

                    {/* Chassis Profile Body */}
                    <path d="M180 430 L620 430 L610 320 L500 280 L220 280 L180 340 Z" fill="#0F172A" stroke="#4A88B7" strokeWidth="2.5" />

                    {/* Center Electronics Enclosure */}
                    <rect x="320" y="270" width="160" height="50" rx="4" fill="#0D1F17" stroke="#849B74" strokeWidth="1.8" />

                    {/* Sensor Mast */}
                    <rect x="385" y="160" width="30" height="110" fill="#172238" stroke="#82B2D8" strokeWidth="2" />

                    {/* Top LiDAR */}
                    <rect x="375" y="110" width="50" height="50" rx="6" fill="#0E1A2E" stroke="#82B2D8" strokeWidth="2.5" />

                    {/* Forward Camera Arm */}
                    <path d="M415 220 L580 220 L590 200" stroke="#E8B4A2" strokeWidth="2" fill="none" strokeDasharray="3 2" />
                    <rect x="580" y="190" width="35" height="22" rx="3" fill="#241416" stroke="#E8B4A2" strokeWidth="2" />
                  </g>
                )}

                {/* 3. Interactive Hotspot Pins for All Components in Active View */}
                {filteredComponents.map((comp, idx) => {
                  const coords = comp.coords[viewMode];
                  const svgX = (coords.x / 100) * 800;
                  const svgY = (coords.y / 100) * 600;
                  const isSelected = comp.id === selectedComponentId;

                  return (
                    <g 
                      key={comp.id}
                      onMouseEnter={(e) => handleModulePointerMove(e, comp.id)}
                      onMouseMove={(e) => handleModulePointerMove(e, comp.id)}
                      onMouseLeave={handleModulePointerLeave}
                      onClick={() => setSelectedComponentId(comp.id)}
                      className="cursor-pointer group"
                      tabIndex={0}
                      role="button"
                      aria-label={`Select ${comp.name}`}
                    >
                      {/* Highlight Halo for Selected / Hovered Component */}
                      {(isSelected || hoveredComponent?.id === comp.id) && (
                        <>
                          <circle 
                            cx={svgX} 
                            cy={svgY} 
                            r="28" 
                            fill={comp.colorAccent} 
                            fillOpacity="0.22" 
                            className="animate-pulse"
                          />
                          <circle 
                            cx={svgX} 
                            cy={svgY} 
                            r="19" 
                            fill="none" 
                            stroke={comp.colorAccent} 
                            strokeWidth="1.8" 
                            strokeDasharray="4 2"
                          />
                          {/* Animated Pointer Leader Line to Component */}
                          <line 
                            x1={svgX} 
                            y1={svgY} 
                            x2={svgX + (svgX > 400 ? -35 : 35)} 
                            y2={svgY - 35} 
                            stroke={comp.colorAccent} 
                            strokeWidth="1.5" 
                          />
                          <rect 
                            x={svgX + (svgX > 400 ? -120 : 35)} 
                            y={svgY - 50} 
                            width="110" 
                            height="20" 
                            rx="3" 
                            fill="#0A0F1D" 
                            stroke={comp.colorAccent} 
                            strokeWidth="1.2" 
                          />
                          <text 
                            x={svgX + (svgX > 400 ? -65 : 90)} 
                            y={svgY - 36} 
                            fill={comp.colorAccent} 
                            fontSize="9" 
                            fontFamily="monospace" 
                            fontWeight="bold" 
                            textAnchor="middle"
                          >
                            {comp.code}
                          </text>
                        </>
                      )}

                      {/* Hotspot Outer Ring with Pulse Effect */}
                      <circle 
                        cx={svgX} 
                        cy={svgY} 
                        r="12" 
                        fill={isSelected ? comp.colorAccent : (hoveredComponent?.id === comp.id ? comp.colorAccent : '#0A0F1D')} 
                        stroke={comp.colorAccent} 
                        strokeWidth={isSelected ? '2.5' : '1.8'} 
                        className="transition-all duration-200 group-hover:scale-125"
                      />

                      {/* Inner Pin Number / Indicator */}
                      <text 
                        x={svgX} 
                        y={svgY + 3.5} 
                        fill={(isSelected || hoveredComponent?.id === comp.id) ? '#0A0F1D' : comp.colorAccent} 
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
              {hoveredComponent && (
                <div 
                  className="pointer-events-none absolute z-30 transition-all duration-150 ease-out"
                  style={{
                    left: hoverPos ? Math.min(Math.max(hoverPos.x + 20, 20), 460) : '24px',
                    top: hoverPos ? Math.min(Math.max(hoverPos.y - 40, 20), 320) : '24px',
                  }}
                >
                  <div className="w-[320px] rounded-2xl bg-slate-900/95 dark:bg-[#070D18]/95 backdrop-blur-xl border border-slate-700 dark:border-[#C5A880]/40 shadow-2xl p-4 text-xs font-mono text-slate-200">
                    {/* Top Status Tag */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-2 h-2 rounded-full animate-ping" 
                          style={{ backgroundColor: hoveredComponent.colorAccent }}
                        />
                        <span className="font-bold text-[10px] tracking-wider uppercase text-slate-300">
                          {hoveredComponent.code}
                        </span>
                      </div>
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ 
                          backgroundColor: `${hoveredComponent.colorAccent}25`,
                          color: hoveredComponent.colorAccent
                        }}
                      >
                        {hoveredComponent.status}
                      </span>
                    </div>

                    {/* Component Name */}
                    <div className="pt-2">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans">
                        {hoveredComponent.subsystem}
                      </div>
                      <h4 className="text-sm font-bold text-white font-tech mt-0.5 leading-snug">
                        {hoveredComponent.name}
                      </h4>
                    </div>

                    {/* Engineering Function */}
                    <p className="mt-2 text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-2">
                      {hoveredComponent.primaryFunction}
                    </p>

                    {/* Technical Properties Grid */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-slate-400 block">Operating Voltage</span>
                        <span className="font-bold text-white">{hoveredComponent.operatingVoltage}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Current Draw</span>
                        <span className="font-bold text-white">{hoveredComponent.currentDraw}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Bus Protocol</span>
                        <span className="font-bold text-white truncate block">{hoveredComponent.busProtocol}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Mass / Size</span>
                        <span className="font-bold text-white">{hoveredComponent.weight}</span>
                      </div>
                    </div>

                    {/* Live Telemetry Diagnostic Snapshot */}
                    <div className="mt-3 p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Activity className="w-3 h-3" />
                        <span>{hoveredComponent.telemetry.operationalMode}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-300">
                        <Thermometer className="w-3 h-3" />
                        <span>{hoveredComponent.telemetry.temperature}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-[9px] text-slate-400 text-center tracking-wider">
                      Click module to inspect full pinout wiring dossier
                    </div>
                  </div>
                </div>
              )}

              {/* Viewport Overlay Controls Tip */}
              <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-[#080D18]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E5DFD7] dark:border-[#1E2B45] text-[11px] font-mono text-slate-600 dark:text-[#EADCC9] flex items-center gap-2">
                <Crosshair className="w-3 h-3 text-[#E8B4A2]" />
                <span>Click any numbered hotspot pin to inspect technical parameters</span>
              </div>
            </div>

            {/* Sub-view thumbnails & quick selector carousel */}
            <div className="p-3 bg-slate-50 dark:bg-[#070B14] border-t border-[#E5DFD7] dark:border-[#1E2B45] flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 pl-1 shrink-0">
                Quick Select:
              </span>
              {filteredComponents.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedComponentId(c.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    c.id === selectedComponentId
                      ? 'bg-white dark:bg-[#15233C] text-slate-900 dark:text-[#FAF7F2] font-bold border border-[#C5A880]/50 shadow-xs'
                      : 'text-slate-600 dark:text-[#8996AA] hover:bg-slate-200 dark:hover:bg-[#111927]'
                  }`}
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: c.colorAccent }} 
                  />
                  <span>0{i + 1} {c.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: In-Depth Component Specifications Sheet (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-[#0D1422] border border-[#E5DFD7] dark:border-[#1E2B45] p-6 shadow-sm relative overflow-hidden transition-colors">
            {/* Component Header */}
            <div className="border-b border-slate-200 dark:border-[#182338] pb-5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span 
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wide"
                  style={{ 
                    backgroundColor: `${selectedComponent.colorAccent}20`,
                    color: selectedComponent.colorAccent,
                    border: `1px solid ${selectedComponent.colorAccent}40`
                  }}
                >
                  {selectedComponent.code} • {selectedComponent.subsystem}
                </span>

                <span className="flex items-center gap-1.5 text-xs font-medium text-[#5C7350] dark:text-[#849B74]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#849B74]" />
                  {selectedComponent.status}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-[#FAF7F2] leading-tight">
                {selectedComponent.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8996AA] font-mono mt-1 flex items-center gap-2">
                <Crosshair className="w-3 h-3 text-[#E8B4A2]" />
                Location: {selectedComponent.location}
              </p>
            </div>

            {/* Primary Engineering Function */}
            <div className="py-4 border-b border-slate-200 dark:border-[#182338]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#EADCC9]" />
                Primary Engineering Role & Function
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedComponent.primaryFunction}
              </p>
            </div>

            {/* Technical Specifications Grid (Unboxed, clean key-value) */}
            <div className="py-4 border-b border-slate-200 dark:border-[#182338]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#82B2D8]" />
                Electrical & Physical Properties
              </h3>

              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-mono">
                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[11px]">Operating Voltage</div>
                  <div className="text-slate-900 dark:text-[#FAF7F2] font-semibold mt-0.5">
                    {selectedComponent.operatingVoltage}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[11px]">Current Draw / Power</div>
                  <div className="text-slate-900 dark:text-[#FAF7F2] font-semibold mt-0.5">
                    {selectedComponent.currentDraw}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[11px]">Bus & Protocols</div>
                  <div className="text-slate-900 dark:text-[#FAF7F2] font-semibold mt-0.5">
                    {selectedComponent.busProtocol}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[11px]">Dimensions & Mass</div>
                  <div className="text-slate-900 dark:text-[#FAF7F2] font-semibold mt-0.5">
                    {selectedComponent.dimensions} • {selectedComponent.weight}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-slate-400 dark:text-slate-500 text-[11px]">Operating Tolerance</div>
                  <div className="text-slate-900 dark:text-[#FAF7F2] font-semibold mt-0.5">
                    {selectedComponent.tolerance}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Engineering Features */}
            <div className="py-4 border-b border-slate-200 dark:border-[#182338]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F3DC9B]" />
                Core Capabilities & Architecture
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedComponent.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C5A880] mt-0.5">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pinout & Terminal Mapping Table */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#A99DC9]" />
                  Pinout & Terminal Assignment
                </h3>
                {copiedPin && (
                  <span className="text-[10px] font-mono text-[#849B74]">
                    Copied pin {copiedPin}
                  </span>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-[#1A263D] overflow-hidden text-xs font-mono">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-[#0B101D] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#1A263D]">
                    <tr>
                      <th className="px-3 py-2 font-medium">Pin</th>
                      <th className="px-3 py-2 font-medium">Signal</th>
                      <th className="px-3 py-2 font-medium">Type</th>
                      <th className="px-3 py-2 font-medium">Function</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#152033] bg-white dark:bg-[#0E1526]">
                    {selectedComponent.pinout.map((pin) => (
                      <tr 
                        key={pin.pin} 
                        onClick={() => handleCopyPin(pin)}
                        className="hover:bg-slate-50 dark:hover:bg-[#131D30] cursor-pointer transition-colors"
                        title="Click to copy pin definition"
                      >
                        <td className="px-3 py-2 font-bold text-slate-800 dark:text-[#EADCC9]">
                          {pin.pin}
                        </td>
                        <td className="px-3 py-2 text-slate-900 dark:text-[#FAF7F2]">
                          {pin.label}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            pin.type === 'power' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                            pin.type === 'ground' ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' :
                            pin.type === 'bus' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300' :
                            pin.type === 'rf' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' :
                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {pin.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-500 dark:text-slate-400 text-[11px]">
                          {pin.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-[#182338] flex flex-wrap items-center gap-2">
              {selectedComponent.simulatorCompatible && onNavigateToSimulator && (
                <button
                  onClick={onNavigateToSimulator}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] dark:bg-[#121E33] text-[#4A88B7] dark:text-[#82B2D8] border border-[#82B2D8]/40 hover:bg-[#82B2D8]/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-[#82B2D8]" />
                  <span>Test in Wokwi Simulator</span>
                </button>
              )}

              {onNavigateToInventory && (
                <button
                  onClick={onNavigateToInventory}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#152033] hover:bg-slate-200 dark:hover:bg-[#1B2840] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-[#EADCC9]" />
                  <span>View in Parts Catalog</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
