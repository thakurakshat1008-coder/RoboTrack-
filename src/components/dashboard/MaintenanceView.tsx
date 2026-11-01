import React, { useState, useEffect } from 'react';
import { MaintenanceTask, MaintenancePriority, MaintenanceStatus, Robot, User } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { 
  Wrench, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Bot, 
  UserCheck, 
  FileText, 
  X,
  Sparkles
} from 'lucide-react';

interface MaintenanceViewProps {
  user: User;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ user }) => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formRobotId, setFormRobotId] = useState('');
  const [formAssignee, setFormAssignee] = useState('Kenji Sato');
  const [formPriority, setFormPriority] = useState<MaintenancePriority>('Medium');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formReplaced, setFormReplaced] = useState('');
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tList, rList] = await Promise.all([
        api.getMaintenanceTasks(),
        api.getRobots()
      ]);
      setTasks(tList);
      setRobots(rList);
      if (rList.length > 0 && !formRobotId) {
        setFormRobotId(rList[0].id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load maintenance tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const robot = robots.find(r => r.id === formRobotId);
      const created = await api.createMaintenanceTask({
        taskTitle: formTitle,
        robotId: formRobotId,
        robotName: robot?.name,
        assignedTo: formAssignee,
        priority: formPriority,
        status: 'Pending',
        scheduledDate: formDate,
        replacedComponents: formReplaced ? formReplaced.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        notes: formNotes
      });
      setTasks([created, ...tasks]);
      setIsScheduleOpen(false);
      setFormTitle('');
      setFormNotes('');
      setFormReplaced('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule task');
    }
  };

  const handleStatusChange = async (id: string, status: MaintenanceStatus) => {
    try {
      const updated = await api.updateMaintenanceStatus(id, status);
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (statusFilter === 'ALL') return true;
    return t.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#142136]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Robotics Maintenance & Diagnostics</h2>
          <p className="text-xs text-[#8996AA]">
            Track harmonic drive calibrations, ultrasonic array alignments, sensor replacements, and firmware patches.
          </p>
        </div>

        {user.role !== 'viewer' && (
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-semibold text-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Task</span>
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
        {['ALL', 'Pending', 'In Progress', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded transition-colors ${
              statusFilter === st ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="p-5 bg-[#0D1422] border border-[#162238] rounded-xl hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    task.priority === 'Emergency' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/40' :
                    task.priority === 'High' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {task.priority} Priority
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    task.status === 'In Progress' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30' :
                    task.status === 'Completed' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {task.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {task.taskTitle}
                </h3>

                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  {task.notes}
                </p>
              </div>

              {/* Assignee & Dates & Actions */}
              <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">ROBOT PLATFORM</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    {task.robotName}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">ENGINEER</span>
                  <span className="text-slate-300 font-medium">
                    {task.assignedTo}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">SCHEDULED</span>
                  <span className="text-slate-400">
                    {task.scheduledDate}
                  </span>
                </div>

                {user.role !== 'viewer' && (
                  <div className="flex items-center gap-1.5 self-end lg:self-center">
                    {task.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'In Progress')}
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 rounded text-xs transition-colors cursor-pointer"
                      >
                        Start Service
                      </button>
                    )}
                    {task.status === 'In Progress' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'Completed')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-300 rounded text-xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {task.replacedComponents && task.replacedComponents.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#142136] flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500">Replaced components:</span>
                {task.replacedComponents.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#070B14] border border-[#1E2D4A] text-cyan-300 text-[11px]">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Schedule Maintenance Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D1422] border border-[#1E2D4A] rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#162238]">
              <h3 className="text-lg font-bold text-white">Schedule Maintenance Task</h3>
              <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-DOF Harmonic Drive Gear Lubrication"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
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
                      <option key={r.id} value={r.id}>{r.code} - {r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as MaintenancePriority)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Assigned Engineer</label>
                  <input
                    type="text"
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Scheduled Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Replaced Components (Optional, comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Ultrasonic Transducer Mod A, Encoder Cable"
                  value={formReplaced}
                  onChange={(e) => setFormReplaced(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Maintenance Notes</label>
                <textarea
                  rows={2}
                  placeholder="Diagnostics, motor torque feedback, alignment procedure..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-bold text-xs rounded-lg transition-colors cursor-pointer mt-4"
              >
                Schedule Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
