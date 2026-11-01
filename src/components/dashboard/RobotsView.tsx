import React, { useState, useEffect } from 'react';
import { Robot, RobotType, RobotStatus, User } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { 
  Bot, 
  Plus, 
  Search, 
  Filter, 
  BatteryCharging, 
  Cpu, 
  Radio, 
  Trash2, 
  Edit3, 
  Eye, 
  X, 
  Check, 
  AlertTriangle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface RobotsViewProps {
  user: User;
  searchFilter?: string;
  onSelectForTelemetry?: (robotId: string) => void;
}

export const RobotsView: React.FC<RobotsViewProps> = ({ 
  user, 
  searchFilter = '',
  onSelectForTelemetry 
}) => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeRobot, setActiveRobot] = useState<Robot | null>(null);
  
  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states for register / edit
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<RobotType>('Autonomous Mobile Robot');
  const [formStatus, setFormStatus] = useState<RobotStatus>('Online');
  const [formDescription, setFormDescription] = useState('');
  const [formManufacturer, setFormManufacturer] = useState('RoboTrack Dynamics');
  const [formController, setFormController] = useState('NVIDIA Jetson AGX Orin + STM32');
  const [formSensors, setFormSensors] = useState('3D Solid-State LiDAR, RealSense D435i, IMU 9-DOF');
  const [formProtocol, setFormProtocol] = useState('ROS2 Humble / Micro-XRCE');
  const [formBattery, setFormBattery] = useState(90);

  const robotTypes: RobotType[] = [
    'Autonomous Mobile Robot',
    'Robotic Arm',
    'Quadruped',
    'Robotics Car',
    'Line-Following Robot',
    'Obstacle-Avoiding Robot',
    'Educational Kit',
    'Custom Experimental'
  ];

  const robotStatuses: RobotStatus[] = [
    'Online',
    'Offline',
    'Testing',
    'Maintenance',
    'Archived'
  ];

  useEffect(() => {
    loadRobots();
  }, []);

  const loadRobots = async () => {
    try {
      const data = await api.getRobots();
      setRobots(data);
      if (data.length > 0 && !activeRobot) {
        setActiveRobot(data[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load robots');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const newRobot = await api.createRobot({
        name: formName,
        code: formCode || `RBT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        type: formType,
        status: formStatus,
        description: formDescription,
        manufacturer: formManufacturer,
        controller: formController,
        sensors: formSensors.split(',').map(s => s.trim()).filter(Boolean),
        communicationProtocol: formProtocol,
        registrationDate: new Date().toISOString().split('T')[0],
        batteryLevel: formBattery,
        firmwareVersion: 'v1.0.0',
        totalMissions: 0,
        operationalHours: 0
      });
      setRobots([newRobot, ...robots]);
      setActiveRobot(newRobot);
      setIsRegisterOpen(false);
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRobot) return;
    setErrorMsg(null);
    try {
      const updated = await api.updateRobot(activeRobot.id, {
        name: formName,
        type: formType,
        status: formStatus,
        description: formDescription,
        manufacturer: formManufacturer,
        controller: formController,
        sensors: formSensors.split(',').map(s => s.trim()).filter(Boolean),
        communicationProtocol: formProtocol,
        batteryLevel: formBattery
      });
      setRobots(robots.map(r => r.id === updated.id ? updated : r));
      setActiveRobot(updated);
      setIsEditOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Edit failed');
    }
  };

  const handleDelete = async (robotId: string) => {
    if (!confirm('Are you sure you want to decommission this robot?')) return;
    setErrorMsg(null);
    try {
      await api.deleteRobot(robotId);
      const remaining = robots.filter(r => r.id !== robotId);
      setRobots(remaining);
      setActiveRobot(remaining[0] || null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete robot');
    }
  };

  const openEditModal = (robot: Robot) => {
    setActiveRobot(robot);
    setFormName(robot.name);
    setFormCode(robot.code);
    setFormType(robot.type);
    setFormStatus(robot.status);
    setFormDescription(robot.description);
    setFormManufacturer(robot.manufacturer);
    setFormController(robot.controller);
    setFormSensors(robot.sensors.join(', '));
    setFormProtocol(robot.communicationProtocol);
    setFormBattery(robot.batteryLevel);
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormCode('');
    setFormType('Autonomous Mobile Robot');
    setFormStatus('Online');
    setFormDescription('');
    setFormManufacturer('RoboTrack Dynamics');
    setFormController('NVIDIA Jetson AGX Orin + STM32');
    setFormSensors('3D Solid-State LiDAR, RealSense D435i, IMU 9-DOF');
    setFormProtocol('ROS2 Humble / Micro-XRCE');
    setFormBattery(95);
  };

  // Filter robots
  const filteredRobots = robots.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.controller.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesType = selectedType === 'ALL' || r.type === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#142136]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Fleet Robot Registry</h2>
          <p className="text-xs text-[#8996AA]">
            Register, configure, and monitor all mobile and articulated robotic platforms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Permission: Viewers cannot register */}
          {user.role !== 'viewer' && (
            <button
              onClick={() => { resetForm(); setIsRegisterOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Robot</span>
            </button>
          )}
        </div>
      </div>

      {/* Error / Feedback Banner */}
      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-[#0D1422] border border-[#162238] rounded-xl text-xs">
        <span className="font-mono text-slate-400 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          FILTERS:
        </span>

        {/* Category Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-[#070B14] border border-[#1E2D4A] rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="ALL">All Robot Categories</option>
          {robotTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-[#070B14] border border-[#1E2D4A] rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="ALL">All Statuses</option>
          {robotStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <span className="ml-auto font-mono text-slate-500">
          Showing {filteredRobots.length} of {robots.length} robots
        </span>
      </div>

      {/* Main Grid + Detail Split Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Robots Cards Grid (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredRobots.map((robot) => {
            const isSelected = activeRobot?.id === robot.id;
            return (
              <div
                key={robot.id}
                onClick={() => setActiveRobot(robot)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#121D30] border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                    : 'bg-[#0D1422] border-[#162238] hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Line: Code & Status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-cyan-400">
                      {robot.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      robot.status === 'Online' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                      robot.status === 'Testing' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30' :
                      robot.status === 'Maintenance' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {robot.status}
                    </span>
                  </div>

                  {/* Name and Type */}
                  <h3 className="text-base font-bold text-white mb-1">
                    {robot.name}
                  </h3>
                  <div className="text-xs text-[#8996AA] mb-3">
                    {robot.type}
                  </div>

                  {/* Specs Quick Pill Strip */}
                  <div className="space-y-1.5 text-[11px] font-mono text-slate-400 pb-3 border-b border-[#142136]">
                    <div className="flex items-center gap-1.5 truncate">
                      <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{robot.controller}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Radio className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span className="truncate">{robot.communicationProtocol}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Battery and Missions counter */}
                <div className="mt-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1 text-slate-300">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{robot.batteryLevel}%</span>
                  </div>
                  <div className="text-slate-400">
                    {robot.totalMissions} missions · {robot.operationalHours}h
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Robot Detailed Profile (5 cols) */}
        <div className="lg:col-span-5">
          {activeRobot ? (
            <div className="p-6 bg-[#0D1422] border border-[#1E2D4A] rounded-2xl shadow-xl sticky top-20">
              <div className="flex items-start justify-between pb-4 mb-4 border-b border-[#162238]">
                <div>
                  <span className="text-xs font-mono text-cyan-400">{activeRobot.code}</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{activeRobot.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">{activeRobot.type}</div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2">
                  {user.role !== 'viewer' && (
                    <button
                      onClick={() => openEditModal(activeRobot)}
                      className="p-1.5 rounded-lg bg-[#142136] hover:bg-[#1C2F4D] text-slate-300 hover:text-white transition-colors"
                      title="Edit Robot Parameters"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  {(user.role === 'owner' || user.role === 'admin') && (
                    <button
                      onClick={() => handleDelete(activeRobot.id)}
                      className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Decommission Robot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {activeRobot.description}
              </p>

              {/* Technical Specifications Matrix */}
              <div className="space-y-3 mb-6 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-[#070B14] border border-[#142136]">
                  <span className="text-slate-400 font-mono">Manufacturer</span>
                  <span className="text-white font-medium">{activeRobot.manufacturer}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#070B14] border border-[#142136]">
                  <span className="text-slate-400 font-mono">Flight/Edge Controller</span>
                  <span className="text-cyan-300 font-mono font-medium">{activeRobot.controller}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#070B14] border border-[#142136]">
                  <span className="text-slate-400 font-mono">Comm Protocol</span>
                  <span className="text-white font-mono">{activeRobot.communicationProtocol}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#070B14] border border-[#142136]">
                  <span className="text-slate-400 font-mono">Firmware Release</span>
                  <span className="text-emerald-400 font-mono">{activeRobot.firmwareVersion}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#070B14] border border-[#142136]">
                  <span className="text-slate-400 font-mono">Current IP Node</span>
                  <span className="text-indigo-300 font-mono">{activeRobot.ipAddress || '192.168.10.x'}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#070B14] border border-[#142136]">
                  <span className="text-slate-400 font-mono">Station Location</span>
                  <span className="text-white">{activeRobot.location || 'Lab Bay 1'}</span>
                </div>
              </div>

              {/* Integrated Sensors List */}
              <div className="mb-6">
                <div className="text-xs font-mono text-slate-400 mb-2">INTEGRATED SENSOR PAYLOAD:</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeRobot.sensors.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-[#070B14] border border-[#1A263C] text-[11px] font-mono text-cyan-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button: Jump to Live Telemetry */}
              {onSelectForTelemetry && (
                <button
                  onClick={() => onSelectForTelemetry(activeRobot.id)}
                  className="w-full py-2.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open Live Telemetry Feed</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-[#0D1422] rounded-xl border border-[#162238]">
              Select a robot from the registry to inspect parameters.
            </div>
          )}
        </div>
      </div>

      {/* Register New Robot Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D1422] border border-[#1E2D4A] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#162238]">
              <h3 className="text-lg font-bold text-white">Register New Robotic Platform</h3>
              <button onClick={() => setIsRegisterOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Robot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ares-IV Autonomous Scout"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Identification Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RBT-ARES"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Robot Category</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as RobotType)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {robotTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Mission payload, capabilities, and structural specs..."
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Manufacturer / Lab</label>
                  <input
                    type="text"
                    value={formManufacturer}
                    onChange={(e) => setFormManufacturer(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Initial Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as RobotStatus)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {robotStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Controller Hardware</label>
                <input
                  type="text"
                  value={formController}
                  onChange={(e) => setFormController(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Sensors (comma-separated)</label>
                <input
                  type="text"
                  value={formSensors}
                  onChange={(e) => setFormSensors(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Protocol</label>
                  <input
                    type="text"
                    value={formProtocol}
                    onChange={(e) => setFormProtocol(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Battery %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formBattery}
                    onChange={(e) => setFormBattery(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-bold text-xs rounded-lg transition-colors cursor-pointer mt-4"
              >
                Register Robot into Database
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Robot Modal */}
      {isEditOpen && activeRobot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D1422] border border-[#1E2D4A] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#162238]">
              <h3 className="text-lg font-bold text-white">Edit {activeRobot.name}</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Robot Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as RobotType)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {robotTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as RobotStatus)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {robotStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Controller</label>
                <input
                  type="text"
                  value={formController}
                  onChange={(e) => setFormController(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Sensors</label>
                <input
                  type="text"
                  value={formSensors}
                  onChange={(e) => setFormSensors(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-bold text-xs rounded-lg transition-colors cursor-pointer mt-4"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
