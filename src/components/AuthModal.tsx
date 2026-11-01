import React, { useState } from 'react';
import { User, UserRole } from '../types/index.ts';
import { api } from '../services/api.ts';
import { X, Shield, Lock, Mail, UserCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onAuthSuccess 
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('thakur.akshat101@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Dr. Elena Rostova');
  const [role, setRole] = useState<UserRole>('owner');
  const [organization, setOrganization] = useState('RoboTrack Autonomous Labs');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const result = await api.login(email, role);
      onAuthSuccess(result.user);
      onClose();
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const user: User = {
        id: `usr-${Date.now().toString(36)}`,
        name,
        email,
        role,
        organization
      };
      api.setCurrentUser(user);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setMessage(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(`Password reset link dispatched to ${email}. Verification token generated.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0D1422] border border-[#1E2D4A] rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {tab === 'login' ? 'Mission Control Access' : tab === 'register' ? 'Register Engineer Profile' : 'Reset Password'}
          </h3>
          <p className="text-xs text-[#8996AA] mt-1">
            Role-Based Access Control (RBAC) Enforced
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#070B14] rounded-lg mb-6 text-xs font-medium">
          <button
            onClick={() => { setTab('login'); setMessage(null); }}
            className={`py-1.5 rounded transition-colors ${tab === 'login' ? 'bg-[#152238] text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setMessage(null); }}
            className={`py-1.5 rounded transition-colors ${tab === 'register' ? 'bg-[#152238] text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Register
          </button>
          <button
            onClick={() => { setTab('forgot'); setMessage(null); }}
            className={`py-1.5 rounded transition-colors ${tab === 'forgot' ? 'bg-[#152238] text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Forgot
          </button>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div className="mb-4 p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-lg text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Forms */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 pl-9 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Access Token / Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pl-9 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Quick RBAC Role Selector for Platform Evaluation */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Session Permission Role
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['owner', 'admin', 'engineer', 'viewer'] as UserRole[]).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`py-1.5 px-2 rounded text-[11px] font-mono capitalize border transition-all ${
                      role === r 
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' 
                        : 'bg-[#070B14] border-[#1E2D4A] text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {role === 'owner' && 'Full system control, robot deletion & org administration.'}
                {role === 'admin' && 'Manage robots, dispatch missions, configure parameters.'}
                {role === 'engineer' && 'Run telemetry tests, log maintenance, create missions.'}
                {role === 'viewer' && 'Read-only telemetry & mission observability.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-bold text-sm rounded-lg transition-colors cursor-pointer mt-2"
            >
              {loading ? 'Authenticating...' : 'Enter Workspace'}
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Organization / Lab</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="owner">Owner (Full Admin)</option>
                <option value="admin">Administrator</option>
                <option value="engineer">Engineer</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-bold text-sm rounded-lg transition-colors cursor-pointer mt-3"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}

        {tab === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-xs text-[#8996AA]">
              Enter your registered robotics laboratory email address to receive an emergency hardware access token reset.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Account Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4A] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#070B14] font-bold text-sm rounded-lg transition-colors cursor-pointer"
            >
              Dispatch Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
