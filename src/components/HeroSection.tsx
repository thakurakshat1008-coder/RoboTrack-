import React from 'react';
import { RoverCanvas } from './RoverCanvas.tsx';

interface HeroSectionProps {
  onLaunchCommandCenter: () => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onLaunchCommandCenter, 
  onExplore 
}) => {
  return (
    <section id="hero" className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-6 py-12 overflow-hidden bg-slate-50 dark:bg-[#070B14] animated-grid transition-colors duration-200">
      {/* Background glow & coordinate lines */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Hero Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        {/* Technical Header Metadata Label (Zero-Pill discipline: unboxed text with separators) */}
        <div className="flex items-center gap-2 text-xs font-tech text-[#C5A880] dark:text-[#EADCC9] mb-6 tracking-widest uppercase">
          <span>FLEET KINEMATICS</span>
          <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">/</span>
          <span>ROS2 & MICRO-XRCE</span>
          <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">/</span>
          <span>AUTONOMOUS COMMAND v2.4</span>
        </div>

        {/* Main Display Headline with Chakra Petch font-display */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-[#FAF7F2] max-w-4xl leading-[1.1] text-balance mb-6 font-display uppercase">
          THE FUTURE OF ROBOTICS. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A880] via-[#E8B4A2] to-[#82B2D8]">
            UNDER YOUR CONTROL.
          </span>
        </h1>

        {/* Supporting Subtext */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#8996AA] max-w-2xl text-balance mb-10 leading-relaxed font-sans font-normal">
          One intelligent workspace to manage robotic systems, monitor missions, analyze telemetry, and transform experiments into engineering breakthroughs.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={onLaunchCommandCenter}
            className="px-7 py-3 text-sm font-semibold text-slate-900 dark:text-[#0A0D14] bg-gradient-to-r from-[#EADCC9] to-[#E8B4A2] hover:opacity-90 rounded-xl shadow-[0_4px_20px_rgba(232,180,162,0.3)] transition-all cursor-pointer whitespace-nowrap font-tech uppercase tracking-wider"
          >
            Launch Command Center
          </button>
          
          <button
            onClick={onExplore}
            className="px-7 py-3 text-sm font-medium text-slate-700 dark:text-[#FAF7F2] bg-white dark:bg-[#0D1422] hover:bg-slate-100 dark:hover:bg-[#131E33] border border-slate-300 dark:border-[#1E2D4A] hover:border-[#C5A880]/50 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm font-sans"
          >
            Explore Platform
          </button>
        </div>

        {/* Central Visual Focus: Autonomous Rover Model with Telemetry Cards */}
        <div className="w-full relative">
          <RoverCanvas />

          {/* Floating Metric 1: Telemetry Stream */}
          <div className="hidden lg:flex absolute top-12 left-0 flex-col items-start p-4 bg-white/90 dark:bg-[#0D1422]/90 border border-slate-200 dark:border-[#1A263C] rounded-2xl backdrop-blur-md shadow-xl text-left max-w-[210px]">
            <span className="text-[11px] font-tech uppercase text-slate-500 dark:text-slate-400 mb-1">Telemetry Stream</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-[#FAF7F2]">
              420.8 <span className="text-xs font-normal text-[#82B2D8]">Hz</span>
            </span>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-[#849B74] inline-block"></span>
              <span>Packet Loss: 0.00%</span>
            </div>
          </div>

          {/* Floating Metric 2: Autonomous Navigation Margin */}
          <div className="hidden lg:flex absolute bottom-12 right-0 flex-col items-start p-4 bg-white/90 dark:bg-[#0D1422]/90 border border-slate-200 dark:border-[#1A263C] rounded-2xl backdrop-blur-md shadow-xl text-left max-w-[210px]">
            <span className="text-[11px] font-tech uppercase text-slate-500 dark:text-slate-400 mb-1">Obstacle Margin</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-[#FAF7F2]">
              1.84 <span className="text-xs font-normal text-[#E8B4A2]">m</span>
            </span>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-[#82B2D8] inline-block"></span>
              <span>Trajectory: Nominal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
