import React, { useState, useEffect, useRef } from 'react';

interface StoryChapter {
  index: string;
  word: string;
  subtext: string;
  metric: string;
  detail: string;
  codeSnippet: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    index: '01',
    word: 'REGISTER',
    subtext: 'Bring every robotic system into one workspace.',
    metric: 'AMRs · Manipulators · Quadrupeds · Rovers',
    detail: 'Unique hardware UUID registration, kinematic configuration schemas, and firmware tracking across your entire research fleet.',
    codeSnippet: 'robotrack.register({ id: "RBT-ARES", type: "AMR", bus: "ROS2_HUMBLE" });'
  },
  {
    index: '02',
    word: 'CONNECT',
    subtext: 'Unify robotics data and telemetry.',
    metric: 'ROS2 / Micro-XRCE / WebSockets / 5G SA',
    detail: 'Sub-millisecond packet serialization bridging embedded microcontroller serial buses with cloud-side distributed databases.',
    codeSnippet: 'telemetryStream.connect({ endpoint: "wss://hub.robotrack.io/stream", rate: 200 });'
  },
  {
    index: '03',
    word: 'MONITOR',
    subtext: 'Observe performance and system health.',
    metric: 'Real-time Kinematics · Thermal · Battery Sag',
    detail: 'High-frequency telemetry visualization with automated fault-envelope detection, IMU attitude tracking, and live health flags.',
    codeSnippet: 'monitor.watch(["tempCelsius", "batteryPct", "motorRPM"], { threshold: "SAFETY_P1" });'
  },
  {
    index: '04',
    word: 'ANALYZE',
    subtext: 'Turn raw sensor readings into insights.',
    metric: 'Point Clouds · Odometry Drift · Fourier Transforms',
    detail: 'Transform millions of high-density LiDAR, encoder, and current draw points into actionable engineering optimizations.',
    codeSnippet: 'analytics.computeDriftCurve({ baseline: "ground_truth_rtk", toleranceMm: 0.05 });'
  },
  {
    index: '05',
    word: 'IMPROVE',
    subtext: 'Build smarter, more reliable robotic systems.',
    metric: 'Closed-Loop PID Tuning · MTBF Longevity',
    detail: 'Correlate field test failures directly to component batches, firmware revisions, and mechanical stress histories.',
    codeSnippet: 'maintenance.predictWear({ motorHours: 247.5, vibrationDelta: "+12.4%" });'
  },
  {
    index: '06',
    word: 'INNOVATE',
    subtext: 'Turn every experiment into progress.',
    metric: 'Empirical Breakthroughs · Scaled Autonomy',
    detail: 'Accelerate from proof-of-concept student kits to enterprise autonomous swarms with reproducible mission records.',
    codeSnippet: 'swarm.dispatch({ missionId: "MSN-2026-ALPHA", protocol: "COOPERATIVE_SLAM" });'
  }
];

export const ScrollStorySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoCycle, setIsAutoCycle] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Always word appearing continuous transitions (cycles smoothly every 4 seconds)
  useEffect(() => {
    if (!isAutoCycle) return;
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % CHAPTERS.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [isAutoCycle]);

  const currentChapter = CHAPTERS[activeStep];

  return (
    <section 
      id="story" 
      ref={containerRef} 
      onMouseEnter={() => setIsAutoCycle(false)}
      onMouseLeave={() => setIsAutoCycle(true)}
      className="relative py-24 bg-slate-100/70 dark:bg-[#05080F] border-t border-slate-200 dark:border-[#111B2C] animated-grid overflow-hidden select-none transition-colors duration-200"
    >
      {/* Background atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Lead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-slate-200 dark:border-[#142136]">
          <div>
            <div className="text-xs font-tech text-[#C5A880] dark:text-[#EADCC9] tracking-widest uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8B4A2] animate-pulse"></span>
              <span>CONTINUOUS LIFECYCLE REVEAL</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#FAF7F2] font-display uppercase tracking-tight">
              The Robotics Engineering Pipeline
            </h2>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0D1422] rounded-xl border border-slate-200 dark:border-[#1A2840] shadow-sm">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.index}
                onClick={() => {
                  setActiveStep(idx);
                  setIsAutoCycle(false);
                }}
                className={`px-3 py-1.5 text-xs font-tech font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider ${
                  activeStep === idx
                    ? 'bg-gradient-to-r from-[#EADCC9] to-[#E8B4A2] text-slate-900 shadow-md font-bold'
                    : 'text-slate-600 dark:text-[#8996AA] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {ch.index} {ch.word}
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Chapter Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[460px]">
          {/* Left Column: Big Word & Typography Reveal */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Step Counter */}
            <div className="flex items-center gap-3 text-[#C5A880] dark:text-[#EADCC9] font-tech text-xs tracking-widest uppercase mb-4">
              <span>PHASE {currentChapter.index}</span>
              <span className="w-12 h-px bg-[#E8B4A2]/40"></span>
              <span className="text-slate-400 dark:text-slate-500 font-sans">06 TOTAL PHASES</span>
            </div>

            {/* Oversized Cinematic Word with Character Reveal Effect & Chakra Petch display */}
            <h3 key={currentChapter.word} className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-[#FAF7F2] uppercase mb-6 leading-none font-display">
              {currentChapter.word.split('').map((char, i) => (
                <span
                  key={`${currentChapter.word}-${i}`}
                  className="inline-block"
                  style={{
                    animation: `fadeInChar 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s forwards`,
                    opacity: 0,
                    transform: 'translateY(20px)',
                    filter: 'blur(4px)'
                  }}
                >
                  {char}
                </span>
              ))}
            </h3>

            {/* Subtext Statement */}
            <p className="text-xl sm:text-2xl font-semibold text-[#6E6659] dark:text-[#EADCC9] mb-6 leading-snug font-sans">
              "{currentChapter.subtext}"
            </p>

            {/* Detail Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#8996AA] leading-relaxed max-w-xl mb-6 font-sans">
              {currentChapter.detail}
            </p>

            {/* Technical Capabilities Ribbon */}
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">CAPABILITY:</span>
              <span className="text-slate-700 dark:text-slate-300">{currentChapter.metric}</span>
            </div>

            {/* Auto-cycle indicator bar */}
            <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-6 overflow-hidden">
              <div 
                className="h-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${((activeStep + 1) / CHAPTERS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Right Column: Code & Hardware Simulation Preview */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Interactive Terminal Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="ml-2 text-slate-300">pipeline_stage_{currentChapter.index.toLowerCase()}.rs</span>
                </div>
                <span className="text-cyan-400 font-semibold">SYNCHRONIZED</span>
              </div>

              {/* Code Snippet */}
              <pre className="font-mono text-xs text-cyan-200 overflow-x-auto whitespace-pre-wrap leading-relaxed py-2">
                <code>{currentChapter.codeSnippet}</code>
              </pre>

              {/* Live Output Simulation */}
              <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pipeline status:</span>
                  <span className="text-emerald-400 font-bold">ACTIVE & REVEALING</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Data integrity:</span>
                  <span className="text-white font-mono">100.0% (Zero dropped frames)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transition mode:</span>
                  <span className="text-cyan-400 font-mono">Continuous Kinetic Flow</span>
                </div>
              </div>
            </div>

            {/* Quick Next / Prev Controls */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
              <button
                onClick={() => {
                  setActiveStep(prev => (prev > 0 ? prev - 1 : CHAPTERS.length - 1));
                  setIsAutoCycle(false);
                }}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              >
                ← PREV PHASE
              </button>
              <span>{activeStep + 1} of {CHAPTERS.length} ({isAutoCycle ? 'Auto-Advancing' : 'Paused'})</span>
              <button
                onClick={() => {
                  setActiveStep(prev => (prev < CHAPTERS.length - 1 ? prev + 1 : 0));
                  setIsAutoCycle(false);
                }}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              >
                NEXT PHASE →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInChar {
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
};
