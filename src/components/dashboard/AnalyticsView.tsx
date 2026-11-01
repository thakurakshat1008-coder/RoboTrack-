import React, { useState, useEffect } from 'react';
import { Robot, Mission, TestingSession, MaintenanceTask, InventoryItem } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Bot, 
  Wrench,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [testing, setTesting] = useState<TestingSession[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceTask[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [r, m, t, mnt, inv] = await Promise.all([
        api.getRobots(),
        api.getMissions(),
        api.getTestingSessions(),
        api.getMaintenanceTasks(),
        api.getInventory()
      ]);
      setRobots(r);
      setMissions(m);
      setTesting(t);
      setMaintenance(mnt);
      setInventory(inv);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Robot utilization data for charts
  const utilizationData = robots.map(r => ({
    name: r.code,
    fullName: r.name,
    missions: r.totalMissions,
    hours: r.operationalHours,
    battery: r.batteryLevel
  }));

  const totalMissions = missions.length;
  const completedMissions = missions.filter(m => m.status === 'Completed').length;
  const failedMissions = missions.filter(m => m.status === 'Failed' || m.status === 'Cancelled').length;
  const successRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 100;
  
  const totalDuration = missions.reduce((acc, m) => acc + (m.durationSeconds || 0), 0);
  const avgDurationMin = totalMissions > 0 ? Math.round(totalDuration / totalMissions / 60) : 45;

  // Export CSV Report
  const handleExportCsv = () => {
    const headers = ['Robot Code', 'Robot Name', 'Category', 'Status', 'Missions', 'Operational Hours', 'Battery %', 'Controller'];
    const rows = robots.map(r => [
      r.code,
      `"${r.name}"`,
      `"${r.type}"`,
      r.status,
      r.totalMissions,
      r.operationalHours,
      `${r.batteryLevel}%`,
      `"${r.controller}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `robotrack_fleet_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#142136]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Fleet Analytics & Verification Reports</h2>
          <p className="text-xs text-[#8996AA]">
            Aggregate performance telemetry, utilization benchmarks, and compliance export logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D1422] hover:bg-[#131E33] border border-[#1E2D4A] hover:border-cyan-500/40 text-slate-200 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D1422] hover:bg-[#131E33] border border-[#1E2D4A] hover:border-cyan-500/40 text-slate-200 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 mb-1">MISSION SUCCESS RATE</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{successRate}%</div>
          <div className="text-[11px] text-slate-400 mt-1">{completedMissions} of {totalMissions} objectives verified</div>
        </div>

        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 mb-1">AVG MISSION RUNTIME</div>
          <div className="text-2xl font-bold font-mono text-white">{avgDurationMin} <span className="text-xs font-normal text-slate-400">min</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Autonomous battery envelope</div>
        </div>

        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 mb-1">TEST BENCH VALIDATIONS</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{testing.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 6 robotic platforms</div>
        </div>

        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 mb-1">SCHEDULED MAINTENANCE</div>
          <div className="text-2xl font-bold font-mono text-amber-400">{maintenance.length}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">Preventative service items</div>
        </div>
      </div>

      {/* Robot Utilization Chart */}
      <div className="p-5 bg-[#0D1422] border border-[#162238] rounded-xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#142136]">
          <div>
            <h3 className="text-sm font-bold text-white">Robot Fleet Utilization & Flight Hours</h3>
            <p className="text-[11px] font-mono text-slate-400">Total Operational Hours vs Completed Mission Count</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Operational Hours
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Missions Count
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#162238" />
              <XAxis dataKey="name" stroke="#475569" fontSize={11} style={{ fontFamily: 'monospace' }} />
              <YAxis stroke="#475569" fontSize={11} style={{ fontFamily: 'monospace' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E2D4A', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="hours" fill="#00E5FF" radius={[4, 4, 0, 0]} name="Operating Hours" />
              <Bar dataKey="missions" fill="#818CF8" radius={[4, 4, 0, 0]} name="Mission Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fleet Comparison Matrix */}
      <div className="p-5 bg-[#0D1422] border border-[#162238] rounded-xl overflow-x-auto">
        <div className="mb-4 pb-2 border-b border-[#142136]">
          <h3 className="text-sm font-bold text-white">Fleet Specification & Reliability Matrix</h3>
          <p className="text-[11px] text-slate-400">Hardware controllers and uptime comparison across registered robots</p>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#162238] text-slate-400 font-mono">
              <th className="pb-2">CODE</th>
              <th className="pb-2">ROBOT PLATFORM</th>
              <th className="pb-2">CATEGORY</th>
              <th className="pb-2">CONTROLLER HARDWARE</th>
              <th className="pb-2">BATTERY</th>
              <th className="pb-2">MISSIONS</th>
              <th className="pb-2 text-right">TOTAL HOURS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#142136]">
            {robots.map((r) => (
              <tr key={r.id} className="hover:bg-[#111A2D] transition-colors">
                <td className="py-3 font-mono text-cyan-400">{r.code}</td>
                <td className="py-3 font-medium text-white">{r.name}</td>
                <td className="py-3 text-slate-400 font-mono text-[11px]">{r.type}</td>
                <td className="py-3 text-slate-300 font-mono text-[11px]">{r.controller}</td>
                <td className="py-3 font-mono">
                  <span className={r.batteryLevel > 50 ? 'text-emerald-400' : 'text-amber-400'}>
                    {r.batteryLevel}%
                  </span>
                </td>
                <td className="py-3 font-mono text-white">{r.totalMissions}</td>
                <td className="py-3 text-right font-mono text-cyan-300">{r.operationalHours}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
