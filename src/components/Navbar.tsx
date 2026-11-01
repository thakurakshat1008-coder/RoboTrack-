import React, { useState, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { Sun, Moon, Zap } from 'lucide-react';

interface NavbarProps {
  onOpenDashboard: (tab?: string) => void;
  onOpenAuth: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenDashboard, 
  onOpenAuth 
}) => {
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

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#070B14]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#111B2C] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single element brand wordmark */}
        <a href="#hero" className="flex items-center gap-2 shrink-0">
          <Logo size="md" />
        </a>

        {/* Zone 2: 4-5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-[#8996AA]">
          <a href="#story" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Lifecycle
          </a>
          <a href="#blueprint" className="hover:text-[#E8B4A2] dark:hover:text-[#EADCC9] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1">
            <span>CAD Blueprint</span>
          </a>
          <a href="#features" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Modules
          </a>
          <button
            onClick={() => onOpenDashboard('simulator')}
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            <span>Wokwi Sim</span>
          </button>
          <a href="#telemetry-preview" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Telemetry
          </a>
          <button 
            onClick={onOpenAuth} 
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Access Roles
          </button>
        </nav>

        {/* Zone 3: Primary actions + Theme switch */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme switch button */}
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

          <button
            onClick={() => onOpenDashboard('overview')}
            className="px-4 py-2 text-xs font-semibold text-white dark:text-[#070B14] bg-cyan-600 dark:bg-cyan-400 hover:bg-cyan-500 dark:hover:bg-cyan-300 rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Launch Command Center
          </button>
        </div>
      </div>
    </header>
  );
};
