import React, { useState } from 'react';
import { User, UserRole } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { 
  Settings, 
  Shield, 
  Key, 
  Database, 
  Radio, 
  Check, 
  Copy, 
  CheckCircle2, 
  Server,
  UserCheck
} from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUserUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [organization, setOrganization] = useState(user.organization);
  const [role, setRole] = useState<UserRole>(user.role);
  const [apiKey, setApiKey] = useState('rtk_hw_live_secret_9942');
  const [savedMsg, setSavedMsg] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      name,
      email,
      organization,
      role
    };
    api.setCurrentUser(updated);
    onUserUpdate(updated);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const permissionsMatrix = [
    { action: 'View Telemetry & Fleet Registry', owner: true, admin: true, engineer: true, viewer: true },
    { action: 'Dispatch & Schedule Missions', owner: true, admin: true, engineer: true, viewer: false },
    { action: 'Conduct & Record Lab Test Sessions', owner: true, admin: true, engineer: true, viewer: false },
    { action: 'Adjust Component Stock & Inventory', owner: true, admin: true, engineer: true, viewer: false },
    { action: 'Schedule & Complete Maintenance Tasks', owner: true, admin: true, engineer: true, viewer: false },
    { action: 'Register & Edit Robotic Hardware', owner: true, admin: true, engineer: true, viewer: false },
    { action: 'Decommission & Delete Robots', owner: true, admin: true, engineer: false, viewer: false },
    { action: 'Manage RBAC Permissions & Organization', owner: true, admin: false, engineer: false, viewer: false },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-[#142136]">
        <h2 className="text-2xl font-bold text-white tracking-tight">System Settings & RBAC Permissions</h2>
        <p className="text-xs text-[#8996AA]">
          Configure engineer profile, test role-based access control, and manage physical hardware API keys.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile parameters updated successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="p-6 bg-[#0D1422] border border-[#162238] rounded-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <span>Operator Profile</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Engineer Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Organization / Laboratory</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Current RBAC Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-white focus:outline-none focus:border-cyan-400 text-xs capitalize font-mono"
              >
                <option value="owner">Owner (Full Admin)</option>
                <option value="admin">Administrator</option>
                <option value="engineer">Engineer</option>
                <option value="viewer">Viewer (Read-Only)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Update Profile & Role
          </button>
        </form>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="p-6 bg-[#0D1422] border border-[#162238] rounded-xl overflow-x-auto">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Role-Based Access Control (RBAC) Specification</span>
          </h3>
          <p className="text-xs text-[#8996AA] mt-0.5">
            Server-side enforced authorizations across the platform.
          </p>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#162238] text-slate-400 font-mono">
              <th className="pb-3">ACTION PRIVILEGE</th>
              <th className="pb-3 text-center">OWNER</th>
              <th className="pb-3 text-center">ADMIN</th>
              <th className="pb-3 text-center">ENGINEER</th>
              <th className="pb-3 text-center">VIEWER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#142136]">
            {permissionsMatrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#111A2D] transition-colors">
                <td className="py-2.5 text-slate-200 font-medium">{row.action}</td>
                <td className="py-2.5 text-center">{row.owner ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : '—'}</td>
                <td className="py-2.5 text-center">{row.admin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : '—'}</td>
                <td className="py-2.5 text-center">{row.engineer ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : '—'}</td>
                <td className="py-2.5 text-center">{row.viewer ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hardware Telemetry API Key */}
      <div className="p-6 bg-[#0D1422] border border-[#162238] rounded-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <span>Hardware Telemetry Ingestion Credentials</span>
          </h3>
          <p className="text-xs text-[#8996AA] mt-0.5">
            Authenticate your autonomous rovers and microcontrollers when dispatching metrics to <code className="text-cyan-300 font-mono">/api/hardware/telemetry</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={apiKey}
            className="flex-1 px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-cyan-300 font-mono text-xs focus:outline-none"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(apiKey);
              setCopiedKey(true);
              setTimeout(() => setCopiedKey(false), 2000);
            }}
            className="px-4 py-2 bg-[#162238] hover:bg-[#1E2D4A] text-slate-200 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {copiedKey ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
          </button>
        </div>
      </div>

      {/* Free Persistent Database Status */}
      <div className="p-6 bg-[#0D1422] border border-[#162238] rounded-xl flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Zero-Cost Persistent Server Database Active</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            RoboTrack is operating with a high-performance, zero-cost, persistent database stored server-side with atomic synchronization. No external cloud credit card, billing setup, or payment details are required to run or publish this application.
          </p>
        </div>
      </div>
    </div>
  );
};
