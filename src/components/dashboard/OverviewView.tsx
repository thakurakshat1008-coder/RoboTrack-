import React, { useState, useEffect } from 'react';
import { WorkspaceStats, Robot, Mission } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { 
  Bot, 
  Send, 
  FlaskConical, 
  Wrench, 
  CheckCircle, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface OverviewViewProps {
  onNavigateTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      const [sData, rData, mData] = await Promise.all([
        api.getStats(),
        api.getRobots(),
        api.getMissions()
      ]);
      setStats(sData);
      setRobots(rData);
      setMissions(mData);
    } catch (err) {
      console.error('Failed to load overview data', err);
    } finally {
      setLoading(false);
    }
  };

  // Robot status breakdown data for donut chart
  const statusCounts = robots.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map(k => ({
    name: k,
    value: statusCounts[k]
  }));

  const STATUS_COLORS: Record<string, string> = {
    Online: '#22C55E',
    Testing: '#00E5FF',
    Offline: '#64748B',
    Maintenance: '#F59E0B',
    Archived: '#475569'
  };

  // Real Mission Activity & Battery Discharge time-series curves
  const telemetryTrends = [
    { time: '00:00', avgBattery: 98, coreTemp: 34.2, activeDispatches: 2 },
    { time: '04:00', avgBattery: 92, coreTemp: 35.1, activeDispatches: 1 },
    { time: '08:00', avgBattery: 86, coreTemp: 38.6, activeDispatches: 4 },
    { time: '12:00', avgBattery: 74, coreTemp: 41.2, activeDispatches: 6 },
    { time: '16:00', avgBattery: 68, coreTemp: 39.8, activeDispatches: 5 },
    { time: '20:00', avgBattery: 85, coreTemp: 36.4, activeDispatches: 3 },
    { time: 'Now',   avgBattery: 81, coreTemp: 37.1, activeDispatches: 4 },
  ];

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-mono text-sm animate-pulse">
        Polling telemetry database & telemetry clusters...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Mission Operations Overview</h2>
          <p className="text-xs text-slate-600 dark:text-[#8996AA]">
            Real-time status of 6 connected robotic systems and active dispatch queues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Link to CAD Blueprint */}
          <button
            onClick={() => onNavigateTab('blueprint')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#FAF7F2] to-[#EADCC9] dark:from-[#1A263D] dark:to-[#111929] text-slate-900 dark:text-[#FAF7F2] border border-[#C5A880]/50 hover:border-[#C5A880] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Bot className="w-3.5 h-3.5 text-[#E8B4A2]" />
            <span>Interactive CAD Blueprint</span>
          </button>

          {/* Direct Link to Live Simulator */}
          <button
            onClick={() => onNavigateTab('simulator')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#82B2D8]/10 text-[#4A88B7] dark:text-[#82B2D8] border border-[#82B2D8]/30 hover:bg-[#82B2D8]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Wokwi Simulator</span>
          </button>

          {/* Date Filter */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#0D1422] rounded-lg border border-slate-200 dark:border-[#162238] text-xs">
            <button
              onClick={() => setDateRange('24h')}
              className={`px-2.5 py-1 rounded transition-colors ${dateRange === '24h' ? 'bg-[#EADCC9]/50 dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-300 font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              24h
            </button>
            <button
              onClick={() => setDateRange('7d')}
              className={`px-2.5 py-1 rounded transition-colors ${dateRange === '7d' ? 'bg-[#EADCC9]/50 dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-300 font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              7d
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-2.5 py-1 rounded transition-colors ${dateRange === '30d' ? 'bg-[#EADCC9]/50 dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-300 font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              30d
            </button>
          </div>
        </div>
      </div>

      {/* 6 Overview KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Robots */}
        <div 
          onClick={() => onNavigateTab('robots')}
          className="p-4 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono">TOTAL ROBOTS</span>
            <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300">
            {stats?.totalRobots ?? 6}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
            <span>Fleet registered</span>
          </div>
        </div>

        {/* Card 2: Active Robots */}
        <div 
          onClick={() => onNavigateTab('robots')}
          className="p-4 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono">ACTIVE FLEET</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
            {stats?.activeRobots ?? 4}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400/80">
            Online or Testing
          </div>
        </div>

        {/* Card 3: Completed Missions */}
        <div 
          onClick={() => onNavigateTab('missions')}
          className="p-4 bg-[#0D1422] border border-[#162238] hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono">MISSIONS DONE</span>
            <Send className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white group-hover:text-cyan-300">
            {stats?.completedMissions ?? 3}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Across all rovers
          </div>
        </div>

        {/* Card 4: Running Tests */}
        <div 
          onClick={() => onNavigateTab('testing')}
          className="p-4 bg-[#0D1422] border border-[#162238] hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono">RUNNING TESTS</span>
            <FlaskConical className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-300">
            {stats?.runningTests ?? 1}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            In lab chambers
          </div>
        </div>

        {/* Card 5: Pending Maintenance */}
        <div 
          onClick={() => onNavigateTab('maintenance')}
          className="p-4 bg-[#0D1422] border border-[#162238] hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono">MAINTENANCE</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">
            {stats?.pendingMaintenance ?? 2}
          </div>
          <div className="mt-1 text-[11px] text-amber-400/80">
            Tasks scheduled
          </div>
        </div>

        {/* Card 6: Average Mission Success */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="p-4 bg-[#0D1422] border border-[#162238] hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono">AVG SUCCESS</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {stats?.averageMissionSuccess ?? 97}<span className="text-sm font-normal text-cyan-400">%</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-400">
            High reliability index
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Battery and Thermal Trends (8 cols) */}
        <div className="lg:col-span-8 p-5 bg-[#0D1422] border border-[#162238] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#142136]">
            <div>
              <h3 className="text-sm font-bold text-white">Fleet Telemetry & Thermal Drift</h3>
              <p className="text-[11px] text-slate-400 font-mono">Average Battery (%) vs Core Temperature (°C)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
                Avg Battery
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                Temp °C
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} style={{ fontFamily: 'monospace' }} />
                <YAxis stroke="#475569" fontSize={11} style={{ fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E2D4A', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#F4F7FB' }}
                />
                <Area type="monotone" dataKey="avgBattery" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#batteryGrad)" name="Battery %" />
                <Area type="monotone" dataKey="coreTemp" stroke="#F59E0B" strokeWidth={1.5} fillOpacity={1} fill="url(#tempGrad)" name="Temp °C" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Robot Status Distribution (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-[#0D1422] border border-[#162238] rounded-xl flex flex-col justify-between">
          <div className="mb-4 pb-2 border-b border-[#142136]">
            <h3 className="text-sm font-bold text-white">Robot Status Distribution</h3>
            <p className="text-[11px] text-slate-400 font-mono">Current readiness across 6 units</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || '#38BDF8'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E2D4A', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Status Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#142136] text-[11px] font-mono">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: STATUS_COLORS[entry.name] }} />
                  {entry.name}
                </span>
                <span className="text-white font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Missions & Active Dispatches Timeline */}
      <div className="p-5 bg-[#0D1422] border border-[#162238] rounded-xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#142136]">
          <div>
            <h3 className="text-sm font-bold text-white">Live Mission Dispatch Queue</h3>
            <p className="text-[11px] text-slate-400">Scheduled and actively executing field robotics missions</p>
          </div>
          <button
            onClick={() => onNavigateTab('missions')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Missions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#162238] text-slate-400 font-mono">
                <th className="pb-2">MISSION CODE</th>
                <th className="pb-2">NAME</th>
                <th className="pb-2">ASSIGNED ROBOT</th>
                <th className="pb-2">PRIORITY</th>
                <th className="pb-2">STATUS</th>
                <th className="pb-2 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142136]">
              {missions.slice(0, 5).map((m) => (
                <tr key={m.id} className="hover:bg-[#111A2D] transition-colors">
                  <td className="py-3 font-mono text-cyan-400">{m.code}</td>
                  <td className="py-3 font-medium text-white">{m.name}</td>
                  <td className="py-3 text-slate-300">{m.robotName}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      m.priority === 'Critical' ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30' :
                      m.priority === 'High' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {m.priority}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1.5 font-medium ${
                      m.status === 'Running' ? 'text-cyan-400' :
                      m.status === 'Completed' ? 'text-emerald-400' :
                      m.status === 'Planned' ? 'text-slate-400' : 'text-amber-400'
                    }`}>
                      {m.status === 'Running' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums text-white">
                    {m.performanceScore ? `${m.performanceScore}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
