import React, { useState, useEffect } from 'react';
import { Mission, MissionPriority, MissionStatus, Robot, User } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { 
  Send, 
  Plus, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Bot, 
  Flag, 
  FileText, 
  AlertCircle,
  X,
  Calendar,
  Sparkles
} from 'lucide-react';

interface MissionsViewProps {
  user: User;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ user }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formRobotId, setFormRobotId] = useState('');
  const [formPriority, setFormPriority] = useState<MissionPriority>('Normal');
  const [formObjective, setFormObjective] = useState('');
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mList, rList] = await Promise.all([
        api.getMissions(),
        api.getRobots()
      ]);
      setMissions(mList);
      setRobots(rList);
      if (rList.length > 0 && !formRobotId) {
        setFormRobotId(rList[0].id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load mission data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const created = await api.createMission({
        name: formName,
        code: formCode || `MSN-2026-${Math.floor(Math.random() * 800 + 100)}`,
        robotId: formRobotId,
        priority: formPriority,
        status: 'Planned',
        objective: formObjective,
        scheduledStart: new Date().toISOString(),
        notes: formNotes,
        createdBy: user.name
      });
      setMissions([created, ...missions]);
      setIsCreateOpen(false);
      setFormName('');
      setFormObjective('');
      setFormNotes('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create mission');
    }
  };

  const handleStatusChange = async (id: string, status: MissionStatus) => {
    try {
      const updated = await api.updateMissionStatus(id, status);
      setMissions(missions.map(m => m.id === updated.id ? updated : m));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update mission status');
    }
  };

  const filteredMissions = missions.filter(m => {
    if (statusFilter === 'ALL') return true;
    return m.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#142136]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mission Control & Dispatch</h2>
          <p className="text-xs text-[#8996AA]">
            Orchestrate operational objectives, autonomous routines, and safety checkpoints.
          </p>
        </div>

        {user.role !== 'viewer' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-semibold text-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Mission</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0D1422] rounded-lg border border-[#162238] text-xs">
        {['ALL', 'Running', 'Planned', 'Completed', 'Failed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded transition-colors ${
              statusFilter === st 
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Missions List */}
      <div className="space-y-4">
        {filteredMissions.map((mission) => {
          return (
            <div
              key={mission.id}
              className="p-5 bg-[#0D1422] border border-[#162238] rounded-xl hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Mission Core Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {mission.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      mission.priority === 'Critical' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' :
                      mission.priority === 'High' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {mission.priority} Priority
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      mission.status === 'Running' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 animate-pulse' :
                      mission.status === 'Completed' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                      mission.status === 'Planned' ? 'bg-blue-950/40 text-blue-300 border border-blue-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {mission.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {mission.name}
                  </h3>

                  <p className="text-xs text-[#8996AA] max-w-2xl leading-relaxed">
                    {mission.objective}
                  </p>
                </div>

                {/* Assigned Robot & Performance */}
                <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px]">ASSIGNED ROBOT</span>
                    <span className="text-white font-medium flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      {mission.robotName || 'Unassigned'}
                    </span>
                  </div>

                  {mission.durationSeconds && (
                    <div className="flex flex-col">
                      <span className="text-slate-500 text-[10px]">DURATION</span>
                      <span className="text-white font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        {Math.floor(mission.durationSeconds / 60)}m {mission.durationSeconds % 60}s
                      </span>
                    </div>
                  )}

                  {mission.performanceScore && (
                    <div className="flex flex-col">
                      <span className="text-slate-500 text-[10px]">PERFORMANCE</span>
                      <span className="text-emerald-400 font-bold">
                        {mission.performanceScore}%
                      </span>
                    </div>
                  )}

                  {/* Operational Action Controls (Role-protected) */}
                  {user.role !== 'viewer' && (
                    <div className="flex items-center gap-1.5 self-end lg:self-center">
                      {mission.status === 'Planned' && (
                        <button
                          onClick={() => handleStatusChange(mission.id, 'Running')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 rounded text-xs transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                          <span>Dispatch</span>
                        </button>
                      )}

                      {mission.status === 'Running' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(mission.id, 'Completed')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-300 rounded text-xs transition-colors cursor-pointer"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Complete</span>
                          </button>
                          <button
                            onClick={() => handleStatusChange(mission.id, 'Cancelled')}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 rounded text-xs transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Abort</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {mission.notes && (
                <div className="mt-3 pt-3 border-t border-[#142136] text-[11px] text-slate-400 font-mono">
                  <span className="text-slate-500">Telemetry Notes: </span>
                  {mission.notes}
                </div>
              )}
            </div>
          );
        })}

        {filteredMissions.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-[#0D1422] rounded-xl border border-[#162238]">
            No missions found under status "{statusFilter}".
          </div>
        )}
      </div>

      {/* Create Mission Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D1422] border border-[#1E2D4A] rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#162238]">
              <h3 className="text-lg font-bold text-white">Schedule Robotics Mission</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Mission Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Perimeter Scanning Phase 2"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Target Robot</label>
                  <select
                    value={formRobotId}
                    onChange={(e) => setFormRobotId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {robots.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.code} - {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Priority Queue</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as MissionPriority)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Mission Objective</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed flight/nav path objectives, tolerances, and geofence guidelines..."
                  value={formObjective}
                  onChange={(e) => setFormObjective(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Initial Technical Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Solid-state LiDAR running in high-sensitivity mode"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-bold text-xs rounded-lg transition-colors cursor-pointer mt-4"
              >
                Dispatch to Operational Queue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
