import React, { useState, useEffect } from 'react';
import { ActivityLog } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { 
  FileText, 
  Filter, 
  Search, 
  Bot, 
  Send, 
  FlaskConical, 
  Cpu, 
  Wrench, 
  Shield, 
  Clock 
} from 'lucide-react';

export const ActivityLogsView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await api.getActivityLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'robot': return <Bot className="w-3.5 h-3.5 text-cyan-400" />;
      case 'mission': return <Send className="w-3.5 h-3.5 text-blue-400" />;
      case 'testing': return <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />;
      case 'inventory': return <Cpu className="w-3.5 h-3.5 text-amber-400" />;
      case 'maintenance': return <Wrench className="w-3.5 h-3.5 text-rose-400" />;
      default: return <Shield className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const filteredLogs = logs.filter(l => {
    const matchesCategory = selectedCategory === 'ALL' || l.category === selectedCategory;
    const matchesSearch = 
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#142136]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Audit & Activity Logs</h2>
          <p className="text-xs text-[#8996AA]">
            Immutable timestamped trail of all robot registrations, mission executions, and inventory events.
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-[#0D1422] px-3 py-1.5 rounded-lg border border-[#162238] self-start sm:self-auto">
          {logs.length} Total Audit Records
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#0D1422] border border-[#162238] rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'robot', 'mission', 'testing', 'inventory', 'maintenance', 'auth'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded capitalize transition-colors ${
                selectedCategory === cat ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search action or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 pl-8 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white focus:outline-none focus:border-cyan-400 text-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-5 bg-[#0D1422] border border-[#162238] rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#162238] text-slate-400 font-mono">
              <th className="pb-3">TIMESTAMP</th>
              <th className="pb-3">MODULE</th>
              <th className="pb-3">ACTION EVENT</th>
              <th className="pb-3">OPERATOR / USER</th>
              <th className="pb-3">ROLE</th>
              <th className="pb-3">DETAILS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#142136]">
            {filteredLogs.map((log) => {
              const dateStr = new Date(log.timestamp).toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              });

              return (
                <tr key={log.id} className="hover:bg-[#111A2D] transition-colors">
                  <td className="py-3 font-mono text-slate-400 whitespace-nowrap">
                    {dateStr}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <span className="flex items-center gap-1.5 capitalize text-slate-300 font-mono text-[11px]">
                      {getCategoryIcon(log.category)}
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-white whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 text-slate-300 whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-[#070B14] border border-[#1E2D4A] text-cyan-300 text-[10px] font-mono capitalize">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 max-w-md truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
