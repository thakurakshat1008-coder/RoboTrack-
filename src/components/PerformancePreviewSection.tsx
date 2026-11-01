import React, { useState, useEffect } from 'react';
import { 
  BatteryCharging, 
  Thermometer, 
  Gauge, 
  Radar, 
  ShieldCheck, 
  Wifi,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PerformancePreviewProps {
  onEnterPlatform: () => void;
}

export const PerformancePreviewSection: React.FC<PerformancePreviewProps> = ({ 
  onEnterPlatform 
}) => {
  // Live simulated readings
  const [battery, setBattery] = useState(94.2);
  const [temperature, setTemperature] = useState(38.4);
  const [speed, setSpeed] = useState(1.45);
  const [lidarRange, setLidarRange] = useState(4.28);
  const [activeHeading, setActiveHeading] = useState(148);

  useEffect(() => {
    const timer = setInterval(() => {
      setBattery(prev => +(Math.max(20, prev - 0.05 + (Math.random() * 0.02 - 0.01))).toFixed(1));
      setTemperature(prev => +(38 + Math.sin(Date.now() / 3000) * 1.8).toFixed(1));
      setSpeed(prev => +(1.4 + Math.cos(Date.now() / 2000) * 0.35).toFixed(2));
      setLidarRange(prev => +(4.2 + Math.sin(Date.now() / 1500) * 1.2).toFixed(2));
      setActiveHeading(prev => (prev + 1) % 360);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="telemetry-preview" className="py-24 px-6 bg-slate-100/60 dark:bg-[#05080F] border-t border-slate-200 dark:border-[#111B2C] animated-grid transition-colors duration-200 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 tracking-wider mb-2">
              REAL-TIME SENSOR OBSERVABILITY
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Live Telemetry Preview
            </h2>
          </div>

          {/* Explicit Simulation Mode Disclaimer Badge */}
          <div className="p-2.5 px-3.5 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-800 dark:text-cyan-300 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>SIMULATION MODE ACTIVE (SYNTHETIC KINEMATICS STREAM)</span>
          </div>
        </div>

        {/* Live Gauges & Telemetry Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Card 1: Battery */}
          <div className="p-4 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] rounded-xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span className="font-mono">BATTERY</span>
              <BatteryCharging className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {battery} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">%</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              25.4V Nominal
            </div>
          </div>

          {/* Card 2: Temperature */}
          <div className="p-4 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] rounded-xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span className="font-mono">CORE TEMP</span>
              <Thermometer className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {temperature} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">°C</span>
            </div>
            <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-mono">
              Thermal Margin: OK
            </div>
          </div>

          {/* Card 3: Speed */}
          <div className="p-4 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] rounded-xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span className="font-mono">VELOCITY</span>
              <Gauge className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {speed} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">m/s</span>
            </div>
            <div className="mt-2 text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">
              5.22 km/h Ground
            </div>
          </div>

          {/* Card 4: LiDAR Obstacle Distance */}
          <div className="p-4 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] rounded-xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span className="font-mono">LIDAR PROX</span>
              <Radar className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {lidarRange} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">m</span>
            </div>
            <div className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-300 font-mono">
              Path Unobstructed
            </div>
          </div>

          {/* Card 5: Heading */}
          <div className="p-4 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] rounded-xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span className="font-mono">HEADING</span>
              <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {activeHeading}° <span className="text-xs font-normal text-slate-500 dark:text-slate-400">SE</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              IMU 9-DOF Locked
            </div>
          </div>

          {/* Card 6: 5G Signal */}
          <div className="p-4 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] rounded-xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span className="font-mono">SIGNAL</span>
              <Wifi className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              -62 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">dBm</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              5G SA Carrier OK
            </div>
          </div>
        </div>

        {/* Section E: Final Call to Action */}
        <div className="mt-20 p-10 sm:p-14 rounded-2xl bg-gradient-to-b from-white to-slate-100 dark:from-[#0D1422] dark:to-[#080E18] border border-cyan-200 dark:border-cyan-500/30 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 tracking-wider mb-3">
              ROBOTRACK AUTONOMY PLATFORM
            </div>

            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              YOUR NEXT BREAKTHROUGH STARTS HERE.
            </h3>

            <p className="text-slate-600 dark:text-[#8996AA] text-base mb-8 leading-relaxed">
              Equip your robotics engineering organization with real-time fleet intelligence, automated mission verification, and empirical telemetry records.
            </p>

            <button
              onClick={onEnterPlatform}
              className="px-8 py-3.5 text-base font-bold text-white dark:text-[#070B14] bg-cyan-600 dark:bg-cyan-400 hover:bg-cyan-500 dark:hover:bg-cyan-300 rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Enter RoboTrack</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
