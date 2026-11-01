import React, { useState, useEffect } from 'react';
import { TestingSession, TestCategory, TestStatus, Robot, User } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { 
  FlaskConical, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Bot, 
  Layers, 
  Filter,
  X,
  FileCheck2
} from 'lucide-react';

interface TestingLabViewProps {
  user: User;
}

export const TestingLabView: React.FC<TestingLabViewProps> = ({ user }) => {
  const [sessions, setSessions] = useState<TestingSession[]>([]);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formRobotId, setFormRobotId] = useState('');
  const [formCategory, setFormCategory] = useState<TestCategory>('Speed Testing');
  const [formObjective, setFormObjective] = useState('');
  const [formDuration, setFormDuration] = useState(1800);
  const [formStatus, setFormStatus] = useState<TestStatus>('Passed');
  const [formResults, setFormResults] = useState('');
  const [formObservations, setFormObservations] = useState('');

  const testCategories: TestCategory[] = [
    'Speed Testing',
    'Sensor Testing',
    'Battery Testing',
    'Navigation Testing',
    'Stability Testing',
    'Obstacle Detection Testing'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sList, rList] = await Promise.all([
        api.getTestingSessions(),
        api.getRobots()
      ]);
      setSessions(sList);
      setRobots(rList);
      if (rList.length > 0 && !formRobotId) {
        setFormRobotId(rList[0].id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load test sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const created = await api.createTestingSession({
        testName: formName,
        robotId: formRobotId,
        testType: formCategory,
        date: new Date().toISOString().split('T')[0],
        testObjective: formObjective,
        testDurationSeconds: formDuration,
        status: formStatus,
        results: formResults,
        observations: formObservations,
        conductedBy: user.name
      });
      setSessions([created, ...sessions]);
      setIsLogOpen(false);
      setFormName('');
      setFormObjective('');
      setFormResults('');
      setFormObservations('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record test session');
    }
  };

  const passedCount = sessions.filter(s => s.status === 'Passed').length;
  const passRate = sessions.length > 0 ? Math.round((passedCount / sessions.length) * 100) : 100;

  const filteredSessions = sessions.filter(s => {
    if (selectedCategory === 'ALL') return true;
    return s.testType === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#142136]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Kinematic & Sensor Testing Lab</h2>
          <p className="text-xs text-[#8996AA]">
            Standardized benchmarks for validation across speed, LiDAR acuity, battery sag, and obstacle margins.
          </p>
        </div>

        {user.role !== 'viewer' && (
          <button
            onClick={() => setIsLogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-semibold text-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record Test Session</span>
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

      {/* Lab KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 mb-1">TOTAL SESSIONS</div>
          <div className="text-2xl font-bold font-mono text-white">{sessions.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Conducted to date</div>
        </div>

        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 mb-1">VERIFICATION PASS RATE</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{passRate}%</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">{passedCount} trials passed</div>
        </div>

        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 mb-1">WARNING / ANOMALIES</div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {sessions.filter(s => s.status === 'Warning' || s.status === 'Failed').length}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Requiring tuning</div>
        </div>

        <div className="p-4 bg-[#0D1422] border border-[#162238] rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 mb-1">ACTIVE BENCH RUNS</div>
          <div className="text-2xl font-bold font-mono text-indigo-300">
            {sessions.filter(s => s.status === 'In Progress').length || 1}
          </div>
          <div className="text-[11px] text-indigo-300/80 mt-1">In testing chambers</div>
        </div>
      </div>

      {/* Category Filter Selector */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-[#0D1422] border border-[#162238] rounded-xl text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded transition-colors ${selectedCategory === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'}`}
        >
          All Test Types
        </button>
        {testCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded transition-colors ${selectedCategory === cat ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Test Sessions Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="p-5 bg-[#0D1422] border border-[#162238] hover:border-slate-700 rounded-xl space-y-3 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                  <span className="text-cyan-400 font-semibold">{session.testType}</span>
                  <span>·</span>
                  <span>{session.date}</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {session.testName}
                </h3>
              </div>

              <span className={`px-2.5 py-1 rounded text-xs font-mono uppercase flex items-center gap-1.5 shrink-0 ${
                session.status === 'Passed' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                session.status === 'Warning' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' :
                session.status === 'In Progress' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30' :
                'bg-rose-950/60 text-rose-400 border border-rose-500/30'
              }`}>
                {session.status === 'Passed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {session.status === 'Warning' && <AlertTriangle className="w-3.5 h-3.5" />}
                {session.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-slate-400 font-mono">OBJECTIVE: </strong>{session.testObjective}
            </p>

            <div className="p-3 bg-[#070B14] border border-[#142136] rounded-lg text-xs font-mono space-y-1.5">
              <div className="text-cyan-300">
                <span className="text-slate-500">RESULTS: </span>{session.results}
              </div>
              <div className="text-slate-400 text-[11px]">
                <span className="text-slate-500">OBSERVATIONS: </span>{session.observations}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-[#142136]">
              <span className="flex items-center gap-1 text-slate-400">
                <Bot className="w-3 h-3 text-cyan-400" />
                {session.robotName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {Math.floor(session.testDurationSeconds / 60)}m test duration
              </span>
              <span>by {session.conductedBy}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Record Test Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D1422] border border-[#1E2D4A] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#162238]">
              <h3 className="text-lg font-bold text-white">Record Empirical Test Session</h3>
              <button onClick={() => setIsLogOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamic Incline Kinematic Stability Test"
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
                      <option key={r.id} value={r.id}>{r.code} - {r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Test Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as TestCategory)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {testCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Test Objective</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Specific parameters being tested and boundary conditions..."
                  value={formObjective}
                  onChange={(e) => setFormObjective(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status Outcome</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TestStatus)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Passed">Passed</option>
                    <option value="Warning">Warning</option>
                    <option value="Failed">Failed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Duration (Seconds)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Empirical Results</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Max speed 3.42 m/s achieved, 0.4m stopping distance"
                  value={formResults}
                  onChange={(e) => setFormResults(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Technical Observations & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Thermal drift observations, sensor anomalies, follow-up tickets..."
                  value={formObservations}
                  onChange={(e) => setFormObservations(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-bold text-xs rounded-lg transition-colors cursor-pointer mt-4"
              >
                Log Test Session
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
