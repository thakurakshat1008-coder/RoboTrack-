import React, { useState, useEffect } from 'react';
import { User } from '../../types/index.ts';
import { Logo } from '../Logo.tsx';
import { 
  LayoutDashboard, 
  Bot, 
  Send, 
  Activity, 
  FlaskConical, 
  Cpu, 
  BarChart3, 
  Wrench, 
  FileText, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Globe, 
  ChevronRight, 
  Shield, 
  Radio,
  Zap,
  Sun,
  Moon,
  CloudUpload,
  Compass
} from 'lucide-react';

export type DashboardTab = 
  | 'overview' 
  | 'robots' 
  | 'blueprint'
  | 'missions' 
  | 'telemetry' 
  | 'simulator'
  | 'testing' 
  | 'inventory' 
  | 'analytics' 
  | 'maintenance' 
  | 'activity' 
  | 'settings';

interface DashboardLayoutProps {
  user: User;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onExitToWebsite: () => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  globalSearchQuery: string;
  onSearchChange: (query: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  activeTab,
  onTabChange,
  onExitToWebsite,
  onLogout,
  onOpenAuth,
  globalSearchQuery,
  onSearchChange,
  children
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('robotrack_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('robotrack_theme', 'light');
    }
  };

  const navItems = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'robots' as DashboardTab, label: 'My Robots', icon: Bot },
    { id: 'blueprint' as DashboardTab, label: 'CAD Blueprint', icon: Compass, badge: 'Interactive' },
    { id: 'missions' as DashboardTab, label: 'Missions', icon: Send },
    { id: 'telemetry' as DashboardTab, label: 'Telemetry', icon: Activity },
    { id: 'simulator' as DashboardTab, label: 'Live Simulator', icon: Zap, badge: 'Wokwi' },
    { id: 'testing' as DashboardTab, label: 'Testing Lab', icon: FlaskConical },
    { id: 'inventory' as DashboardTab, label: 'Components & Specs', icon: Cpu },
    { id: 'analytics' as DashboardTab, label: 'Analytics', icon: BarChart3 },
    { id: 'maintenance' as DashboardTab, label: 'Maintenance', icon: Wrench },
    { id: 'activity' as DashboardTab, label: 'Activity Logs', icon: FileText },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings },
  ];

  const getBreadcrumbTitle = () => {
    const item = navItems.find(n => n.id === activeTab);
    return item ? item.label : 'Overview';
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-[#F4F7FB] overflow-hidden font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 shrink-0 bg-white dark:bg-[#0A0F1D] border-r border-slate-200 dark:border-[#142136] flex flex-col justify-between shadow-sm">
        <div>
          {/* Top Brand Logo */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-[#142136]">
            <Logo size="sm" />
            <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/20">
              v2.4
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-semibold border-l-2 border-cyan-500 dark:border-cyan-400'
                      : 'text-slate-600 dark:text-[#8996AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111A2D]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-[#6C7B95]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Workspace & Role Tray */}
        <div className="p-3 border-t border-slate-200 dark:border-[#142136] bg-slate-50/80 dark:bg-[#070B14]/60">
          <div className="p-3 rounded-lg bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] mb-2 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                {user.name}
              </span>
              <button
                onClick={onOpenAuth}
                className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-400/30 hover:bg-cyan-200 dark:hover:bg-cyan-500/30 transition-colors"
                title="Click to switch RBAC role"
              >
                {user.role}
              </button>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[#6C7B95] truncate">
              {user.organization}
            </div>

            {/* Optional Cloud Sync Notice */}
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#142136] flex items-center justify-between text-[10px]">
              <span className="text-slate-400">History saved locally</span>
              <button
                onClick={onOpenAuth}
                className="text-cyan-600 dark:text-cyan-400 hover:underline font-mono flex items-center gap-1"
              >
                <CloudUpload className="w-2.5 h-2.5" />
                <span>Save account</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1">
            <button
              onClick={onExitToWebsite}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#111A2D] transition-colors"
              title="Return to Marketing Landing Page"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Stage */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar following Top Bar Contract */}
        <header className="h-16 px-6 bg-white/80 dark:bg-[#0A0F1D]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#142136] flex items-center justify-between gap-6 shrink-0 shadow-sm">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 whitespace-nowrap">
            <span className="text-slate-400">RoboTrack</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{getBreadcrumbTitle()}</span>
          </div>

          {/* Center Search Input */}
          <div className="relative max-w-md w-full hidden sm:block">
            <input
              type="text"
              placeholder="Search robots, missions, telemetry, components..."
              value={globalSearchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-1.5 pl-8 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1A263C] rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Right Status Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#111A2D] transition-colors cursor-pointer border border-slate-200 dark:border-[#1E2D4A]"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Simulation Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] text-[11px] font-mono text-slate-700 dark:text-slate-300">
              <Radio className="w-3 h-3 text-cyan-500 animate-pulse" />
              <span>SIMULATION ACTIVE</span>
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111A2D] transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#1E2D4A] rounded-xl shadow-2xl p-4 z-50 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white mb-2 pb-2 border-b border-slate-200 dark:border-[#162238] flex items-center justify-between">
                    <span>Recent Notifications</span>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400">3 new</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2 rounded bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#142136]">
                      <div className="text-slate-900 dark:text-white font-medium">Mission MSN-2026-081 Active</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Ares-IV running perimeter scanning baseline.</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#142136]">
                      <div className="text-amber-600 dark:text-amber-400 font-medium">Low Stock Warning: LiFePO4</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Inventory SKU: BAT-LIFE-24V has only 1 unit remaining.</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#142136]">
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium">Test Run TST-001 Passed</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">High-Torque Speed & Brake test verified.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role indicator badge */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0D1422] border border-slate-200 dark:border-[#1A263C] hover:border-cyan-500 text-xs font-mono text-cyan-700 dark:text-cyan-300 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="capitalize">{user.role}</span>
            </button>
          </div>
        </header>

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#070B14] animated-grid transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
