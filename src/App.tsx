/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from './types/index.ts';
import { api } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ScrollStorySection } from './components/ScrollStorySection.tsx';
import { FeatureCardsSection } from './components/FeatureCardsSection.tsx';
import { PerformancePreviewSection } from './components/PerformancePreviewSection.tsx';
import { BlueprintSection } from './components/BlueprintSection.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Logo } from './components/Logo.tsx';

// Dashboard Views
import { DashboardLayout, DashboardTab } from './components/dashboard/DashboardLayout.tsx';
import { OverviewView } from './components/dashboard/OverviewView.tsx';
import { RobotsView } from './components/dashboard/RobotsView.tsx';
import { BlueprintView } from './components/dashboard/BlueprintView.tsx';
import { MissionsView } from './components/dashboard/MissionsView.tsx';
import { TelemetryView } from './components/dashboard/TelemetryView.tsx';
import { WokwiSimulatorView } from './components/dashboard/WokwiSimulatorView.tsx';
import { TestingLabView } from './components/dashboard/TestingLabView.tsx';
import { InventoryView } from './components/dashboard/InventoryView.tsx';
import { AnalyticsView } from './components/dashboard/AnalyticsView.tsx';
import { MaintenanceView } from './components/dashboard/MaintenanceView.tsx';
import { ActivityLogsView } from './components/dashboard/ActivityLogsView.tsx';
import { SettingsView } from './components/dashboard/SettingsView.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [user, setUser] = useState<User>(api.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [telemetryRobotId, setTelemetryRobotId] = useState<string | undefined>();

  useEffect(() => {
    setUser(api.getCurrentUser());
    // Initialize theme
    const savedTheme = localStorage.getItem('robotrack_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLaunchDashboard = (targetTab: string = 'overview') => {
    setActiveTab(targetTab as DashboardTab);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFeature = (featureId: string) => {
    handleLaunchDashboard(featureId);
  };

  const handleSelectRobotForTelemetry = (robotId: string) => {
    setTelemetryRobotId(robotId);
    setActiveTab('telemetry');
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    const defaultUser: User = {
      id: 'usr-guest',
      name: 'Guest Engineer',
      email: 'guest@robotrack.io',
      role: 'viewer',
      organization: 'Public Observatory'
    };
    api.setCurrentUser(defaultUser);
    setUser(defaultUser);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-[#F4F7FB] selection:bg-cyan-500/20 selection:text-cyan-300 transition-colors duration-200">
      {currentView === 'landing' ? (
        /* Cinematic Landing Page */
        <div className="flex flex-col min-h-screen">
          <Navbar 
            onOpenDashboard={handleLaunchDashboard}
            onOpenAuth={() => setIsAuthOpen(true)}
          />

          <main className="flex-1">
            {/* Section A: Hero */}
            <HeroSection 
              onLaunchCommandCenter={() => handleLaunchDashboard('overview')}
              onExplore={() => {
                const el = document.getElementById('story');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Section B: Scroll-Based Word Storytelling */}
            <ScrollStorySection />

            {/* Section C: Interactive Robot CAD Blueprint Architecture */}
            <BlueprintSection 
              onOpenDashboard={handleLaunchDashboard}
            />

            {/* Section D: Platform Features */}
            <FeatureCardsSection 
              onSelectFeature={handleSelectFeature}
            />

            {/* Section D: Performance Preview & Section E: Final CTA */}
            <PerformancePreviewSection 
              onEnterPlatform={() => handleLaunchDashboard('overview')}
            />
          </main>

          {/* Clean Footer (Anti-Slop compliant: no fake telemetry tickers or pseudo-engines) */}
          <footer className="border-t border-slate-200 dark:border-[#111B2C] bg-white dark:bg-[#05080F] py-12 px-6 transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Logo size="sm" />
                <span className="text-xs text-slate-500 font-mono">
                  Autonomous Fleet Management & Mission Operations
                </span>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <button 
                  onClick={() => handleLaunchDashboard('robots')} 
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Robots
                </button>
                <button 
                  onClick={() => handleLaunchDashboard('blueprint')} 
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  CAD Blueprint
                </button>
                <button 
                  onClick={() => handleLaunchDashboard('simulator')} 
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Wokwi Simulator
                </button>
                <button 
                  onClick={() => handleLaunchDashboard('telemetry')} 
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Telemetry
                </button>
                <button 
                  onClick={() => handleLaunchDashboard('testing')} 
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Testing Lab
                </button>
                <button 
                  onClick={() => setIsAuthOpen(true)} 
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Role Matrix
                </button>
              </div>

              <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                &copy; {new Date().getFullYear()} RoboTrack Inc. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      ) : (
        /* Full Command Center Dashboard */
        <DashboardLayout
          user={user}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onExitToWebsite={() => setCurrentView('landing')}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthOpen(true)}
          globalSearchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        >
          {activeTab === 'overview' && (
            <OverviewView onNavigateTab={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'robots' && (
            <RobotsView 
              user={user} 
              searchFilter={globalSearch} 
              onSelectForTelemetry={handleSelectRobotForTelemetry} 
            />
          )}
          {activeTab === 'blueprint' && (
            <BlueprintView 
              onNavigateToSimulator={() => setActiveTab('simulator')}
              onNavigateToInventory={() => setActiveTab('inventory')}
            />
          )}
          {activeTab === 'missions' && (
            <MissionsView user={user} />
          )}
          {activeTab === 'telemetry' && (
            <TelemetryView initialRobotId={telemetryRobotId} />
          )}
          {activeTab === 'simulator' && (
            <WokwiSimulatorView />
          )}
          {activeTab === 'testing' && (
            <TestingLabView user={user} />
          )}
          {activeTab === 'inventory' && (
            <InventoryView 
              user={user} 
              onNavigateToSimulator={() => setActiveTab('simulator')}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}
          {activeTab === 'maintenance' && (
            <MaintenanceView user={user} />
          )}
          {activeTab === 'activity' && (
            <ActivityLogsView />
          )}
          {activeTab === 'settings' && (
            <SettingsView user={user} onUserUpdate={setUser} />
          )}
        </DashboardLayout>
      )}

      {/* Global Authentication & RBAC Modal (Optional Cloud Account Save) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
