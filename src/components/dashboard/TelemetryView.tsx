import React, { useState, useEffect, useRef } from 'react';
import { Robot, TelemetryReading } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { 
  Activity, 
  BatteryCharging, 
  Thermometer, 
  Gauge, 
  Radar, 
  Compass, 
  Play, 
  Pause, 
  RotateCcw, 
  Code2, 
  Wifi, 
  ShieldCheck, 
  AlertTriangle,
  Zap,
  Sliders,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

interface TelemetryViewProps {
  initialRobotId?: string;
}

interface TelemetryPoint {
  time: string;
  battery: number;
  temp: number;
  speed: number;
  motorRpm: number;
  currentAmps: number;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ initialRobotId }) => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [selectedRobotId, setSelectedRobotId] = useState<string>('');
  const [mode, setMode] = useState<'simulation' | 'hardware'>('simulation');
  const [isPaused, setIsPaused] = useState(false);
  const [updateIntervalMs, setUpdateIntervalMs] = useState(1000);
  const [currentReading, setCurrentReading] = useState<TelemetryReading | null>(null);
  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [showHardwareDoc, setShowHardwareDoc] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  useEffect(() => {
    loadRobots();
  }, []);

  const loadRobots = async () => {
    try {
      const data = await api.getRobots();
      setRobots(data);
      const initial = initialRobotId || (data.length > 0 ? data[0].id : '');
      setSelectedRobotId(initial);
    } catch (err) {
      console.error(err);
    }
  };

  // Telemetry stream generator
  useEffect(() => {
    if (!selectedRobotId || isPaused || mode === 'hardware') return;

    const fetchSample = async () => {
      try {
        const res = await api.getSimulatedTelemetry(selectedRobotId);
        const r = res.reading;
        setCurrentReading(r);

        const timeStr = new Date(r.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        setHistory(prev => {
          const next = [...prev, {
            time: timeStr,
            battery: r.batteryPercentage,
            temp: r.temperatureCelsius,
            speed: r.speedMps,
            motorRpm: r.motorRpm,
            currentAmps: r.currentDrawAmps
          }];
          return next.slice(-25); // retain last 25 readings
        });
      } catch (err) {
        console.error('Failed to poll telemetry sample', err);
      }
    };

    fetchSample();
    const interval = setInterval(fetchSample, updateIntervalMs);
    return () => clearInterval(interval);
  }, [selectedRobotId, isPaused, updateIntervalMs, mode]);

  const activeRobot = robots.find(r => r.id === selectedRobotId);

  const curlExample = `curl -X POST https://hub.robotrack.io/api/hardware/telemetry \\
  -H "Content-Type: application/json" \\
  -H "X-Robot-Key: rtk_hw_live_secret_9942" \\
  -d '{
    "robotId": "${selectedRobotId || 'rbt-001'}",
    "reading": {
      "batteryPercentage": 89.4,
      "temperatureCelsius": 37.8,
      "speedMps": 1.45,
      "distanceTraveledM": 12.8,
      "motorRpm": 620,
      "motorLoadPercent": 42,
      "signalDbm": -65,
      "lidarDistanceM": 3.4,
      "imuPitch": 1.2,
      "imuRoll": -0.8,
      "imuYaw": 142.0,
      "currentDrawAmps": 3.1
    }
  }'`;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#142136]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Telemetry & Sensor Telepresence</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
              mode === 'simulation' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
            }`}>
              {mode === 'simulation' ? 'SIMULATION MODE' : 'HARDWARE REST LINK'}
            </span>
          </div>
          <p className="text-xs text-[#8996AA]">
            {mode === 'simulation' 
              ? 'SIMULATION MODE: Generating kinematic drift & thermal curves based on robotic chassis physics.'
              : 'HARDWARE LINK: Awaiting real telemetry packets via REST or WebSockets at /api/hardware/telemetry.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto text-xs">
          {/* Target Robot Selector */}
          <select
            value={selectedRobotId}
            onChange={(e) => setSelectedRobotId(e.target.value)}
            className="bg-[#0D1422] border border-[#1E2D4A] rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
          >
            {robots.map(r => (
              <option key={r.id} value={r.id}>
                {r.code} - {r.name}
              </option>
            ))}
          </select>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-[#0D1422] border border-[#1E2D4A] rounded-lg">
            <button
              onClick={() => setMode('simulation')}
              className={`px-3 py-1 rounded transition-colors ${mode === 'simulation' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Simulation
            </button>
            <button
              onClick={() => setMode('hardware')}
              className={`px-3 py-1 rounded transition-colors ${mode === 'hardware' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Hardware Link
            </button>
          </div>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono transition-colors cursor-pointer ${
              isPaused 
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300' 
                : 'bg-[#0D1422] border-[#1E2D4A] text-slate-300 hover:text-white'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Hardware API Docs Button */}
          <button
            onClick={() => setShowHardwareDoc(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/50 rounded-lg font-mono transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Connect Hardware</span>
          </button>
        </div>
      </div>

      {/* Mode Banner / Disclaimer */}
      {mode === 'simulation' ? (
        <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>
              <strong>SIMULATION MODE ACTIVE:</strong> Generating realistic telemetry models. Connect physical robot or embedded ROS2 node to stream real hardware readings.
            </span>
          </div>

          {/* Interval Selector */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span>Interval:</span>
            {[500, 1000, 2000, 5000].map(ms => (
              <button
                key={ms}
                onClick={() => setUpdateIntervalMs(ms)}
                className={`px-2 py-0.5 rounded border ${updateIntervalMs === ms ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200' : 'border-slate-800 text-slate-400'}`}
              >
                {ms >= 1000 ? `${ms / 1000}s` : `${ms}ms`}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>Awaiting Physical Hardware:</strong> Send HTTP POST requests to <code className="bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono text-emerald-200">/api/hardware/telemetry</code> to ingest live data.
            </span>
          </div>
          <button
            onClick={() => setShowHardwareDoc(true)}
            className="underline hover:text-white font-mono"
          >
            View API Docs & Key
          </button>
        </div>
      )}

      {/* Live HUD Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Battery */}
        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">BATTERY</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-white">
            {currentReading?.batteryPercentage ?? activeRobot?.batteryLevel ?? 90}
            <span className="text-xs font-normal text-slate-400 ml-1">%</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">24.2V Balanced</div>
        </div>

        {/* Temperature */}
        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">CORE TEMP</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-white">
            {currentReading?.temperatureCelsius ?? 36.5}
            <span className="text-xs font-normal text-slate-400 ml-1">°C</span>
          </div>
          <div className="text-[11px] font-mono text-amber-400 mt-1">Within Safe Limits</div>
        </div>

        {/* Ground Speed */}
        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">VELOCITY</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-white">
            {currentReading?.speedMps ?? 1.25}
            <span className="text-xs font-normal text-slate-400 ml-1">m/s</span>
          </div>
          <div className="text-[11px] font-mono text-cyan-400 mt-1">
            {currentReading?.motorRpm ?? 520} RPM
          </div>
        </div>

        {/* LiDAR Distance */}
        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">LIDAR FRONT</span>
            <Radar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-white">
            {currentReading?.lidarDistanceM ?? 4.15}
            <span className="text-xs font-normal text-slate-400 ml-1">m</span>
          </div>
          <div className="text-[11px] font-mono text-indigo-300 mt-1">Clearance Safe</div>
        </div>

        {/* Current Draw */}
        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">CURRENT DRAW</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-white">
            {currentReading?.currentDrawAmps ?? 2.8}
            <span className="text-xs font-normal text-slate-400 ml-1">A</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Power: 67.8W</div>
        </div>

        {/* System Health */}
        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">SYSTEM HEALTH</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-xl font-bold uppercase text-emerald-400">
            {currentReading?.systemHealth ?? 'Nominal'}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Faults: 0</div>
        </div>
      </div>

      {/* Interactive Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Battery Discharge & Current Draw over time */}
        <div className="p-5 bg-[#0D1422] border border-[#162238] rounded-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#142136]">
            <div>
              <h3 className="text-sm font-bold text-white">Battery Level & Current Draw</h3>
              <p className="text-[11px] font-mono text-slate-400">Live sliding window (Last 25 data points)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Battery %
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Current (A)
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#162238" />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} style={{ fontFamily: 'monospace' }} />
                <YAxis stroke="#475569" fontSize={10} style={{ fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E2D4A', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="battery" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.15} strokeWidth={2} name="Battery %" />
                <Area type="monotone" dataKey="currentAmps" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} strokeWidth={1.5} name="Current (A)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Motor Velocity & Temperature curves */}
        <div className="p-5 bg-[#0D1422] border border-[#162238] rounded-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#142136]">
            <div>
              <h3 className="text-sm font-bold text-white">Velocity & Core Temperature</h3>
              <p className="text-[11px] font-mono text-slate-400">Kinematic velocity (m/s) vs Thermal index (°C)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-400" /> Velocity (m/s)
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Temp (°C)
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#162238" />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} style={{ fontFamily: 'monospace' }} />
                <YAxis stroke="#475569" fontSize={10} style={{ fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E2D4A', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="speed" stroke="#818CF8" strokeWidth={2} dot={false} name="Velocity (m/s)" />
                <Line type="monotone" dataKey="temp" stroke="#F43F5E" strokeWidth={1.5} dot={false} name="Temp (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hardware Connection Modal & API Documentation */}
      {showHardwareDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D1422] border border-[#1E2D4A] rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#162238]">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Physical Hardware Integration API</h3>
              </div>
              <button onClick={() => setShowHardwareDoc(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                You can easily stream live telemetry from physical microcontrollers (ESP32, Raspberry Pi, Arduino, STM32, or ROS2 nodes) into RoboTrack using our unified ingestion endpoint.
              </p>

              <div>
                <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                  <span>cURL Integration Snippet:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(curlExample);
                      setCopiedCurl(true);
                      setTimeout(() => setCopiedCurl(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    {copiedCurl ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-[#070B14] border border-[#1A263C] rounded-lg font-mono text-[11px] text-cyan-200 overflow-x-auto whitespace-pre leading-relaxed">
                  {curlExample}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-white">Supported Protocols:</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded bg-[#070B14] border border-[#162238]">
                    <div className="text-cyan-400 font-bold font-mono">REST JSON Webhook</div>
                    <div className="text-slate-400 mt-0.5">Recommended for 1–10 Hz sampling from Wi-Fi or LTE modems.</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#070B14] border border-[#162238]">
                    <div className="text-indigo-400 font-bold font-mono">WebSocket Sub-ms Stream</div>
                    <div className="text-slate-400 mt-0.5">High-rate 50–200 Hz streaming for LiDAR, point clouds, and IMUs.</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowHardwareDoc(false);
                    setMode('hardware');
                  }}
                  className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-bold rounded-lg transition-colors"
                >
                  Switch Dashboard to Hardware Listening Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
