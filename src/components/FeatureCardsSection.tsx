import React from 'react';
import { 
  Bot, 
  Send, 
  Activity, 
  FlaskConical, 
  Cpu, 
  BarChart3,
  ArrowRight,
  Zap,
  Compass
} from 'lucide-react';

interface FeatureCardsSectionProps {
  onSelectFeature: (tab: string) => void;
}

export const FeatureCardsSection: React.FC<FeatureCardsSectionProps> = ({ 
  onSelectFeature 
}) => {
  const features = [
    {
      id: 'blueprint',
      title: 'Interactive CAD Blueprint',
      icon: Compass,
      description: 'Explore full-fidelity multi-layer SVG CAD schematics of robot chassis with hoverable module inspection, telemetry HUD popups, and pinouts.',
      badge: 'Interactive CAD'
    },
    {
      id: 'robots',
      title: 'Robot Fleet Management',
      icon: Bot,
      description: 'Register and orchestrate autonomous rovers, quadruped scouts, robotic arms, and educational kits with hardware specs and firmware logs.',
      badge: 'Core Fleet'
    },
    {
      id: 'simulator',
      title: 'Wokwi Live Simulator',
      icon: Zap,
      description: 'Interactive embedded electronics rig with ESP32-S3, Arduino Uno R4, ultrasonic rangefinders, 128x64 OLED, servos, and live serial monitor.',
      badge: 'Hardware Sim'
    },
    {
      id: 'missions',
      title: 'Mission Operations',
      icon: Send,
      description: 'Schedule, dispatch, and track complex robotic missions with priority queues, real-time duration tracking, and objective verification.',
      badge: 'Execution'
    },
    {
      id: 'telemetry',
      title: 'Telemetry Monitoring',
      icon: Activity,
      description: 'Stream live 50Hz sensor metrics including battery discharge, thermal curves, IMU attitude, motor RPM, and LiDAR proximity readings.',
      badge: 'Real-Time'
    },
    {
      id: 'testing',
      title: 'Testing Laboratory',
      icon: FlaskConical,
      description: 'Conduct empirical test runs across speed, sensor accuracy, battery endurance, navigation tolerance, and dynamic obstacle evasion.',
      badge: 'Validation'
    },
    {
      id: 'inventory',
      title: 'Component Catalog & Specs',
      icon: Cpu,
      description: 'Full electrical pinouts, operating voltages, bus protocols (I2C, SPI, CAN), and package tolerances with low-stock warnings.',
      badge: 'Hardware Specs'
    },
    {
      id: 'analytics',
      title: 'Performance Analytics',
      icon: BarChart3,
      description: 'Deep dive into mission success rates, motor degradation trajectories, battery discharge profiles, and export CSV audit reports.',
      badge: 'Intelligence'
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-slate-50 dark:bg-[#070B14] transition-colors duration-200 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-tech text-[#C5A880] dark:text-[#EADCC9] tracking-widest uppercase mb-2">
            MODULAR COMMAND SUITE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#FAF7F2] tracking-tight mb-4 font-display uppercase">
            Unified Robotics Operations
          </h2>
          <p className="text-slate-600 dark:text-[#8996AA] text-sm sm:text-base leading-relaxed font-sans">
            Every tool required to take your robotic systems from initial lab prototyping to multi-unit production autonomy.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => onSelectFeature(feat.id)}
                className="group relative p-6 rounded-2xl bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] hover:border-[#C5A880]/50 shadow-sm hover:shadow-[0_8px_30px_rgba(232,180,162,0.15)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top Bar with Icon and Category Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#111B2C] border border-slate-200 dark:border-[#1E2D4A] flex items-center justify-center text-[#4A88B7] dark:text-[#82B2D8] group-hover:bg-[#EADCC9]/20 group-hover:border-[#C5A880]/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-tech text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#FAF7F2] mb-2.5 font-display uppercase tracking-tight group-hover:text-[#C5A880] dark:group-hover:text-[#E8B4A2] transition-colors">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-[#8996AA] leading-relaxed mb-6 font-sans">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom Action Affordance */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4A88B7] dark:text-[#82B2D8] group-hover:text-[#C5A880] dark:group-hover:text-[#E8B4A2] transition-colors font-tech uppercase tracking-wider">
                  <span>Open in Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
