// src/App.tsx

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Flame, 
  Award, 
  Calendar, 
  X, 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  Activity, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';

// Core State Hook & Types
import { useProgress } from './hooks/useProgress';

// Subcomponents
import { ContributionHeatmap } from './components/Dashboard/ContributionHeatmap';
import { WeaknessAnalytics } from './components/Dashboard/WeaknessAnalytics';
import { DailyQueue } from './components/Dashboard/DailyQueue';
import { RoadmapList } from './components/Roadmap/RoadmapList';
import { SettingsDebug } from './components/Debug/SettingsDebug';

function ToastNotification() {
  const [message, setMessage] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail;
      setMessage(msg);
      setIsExiting(false);

      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);

      // Start exit animation after 3.8s
      exitTimerRef.current = setTimeout(() => {
        setIsExiting(true);
      }, 3800);

      // Remove toast completely after 4s
      clearTimerRef.current = setTimeout(() => {
        setMessage(null);
        setIsExiting(false);
      }, 4000);
    };

    document.addEventListener('dsa-tracker:toast', handleToast);
    return () => {
      document.removeEventListener('dsa-tracker:toast', handleToast);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  if (!message) return null;

  const handleClose = () => {
    setIsExiting(true);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => {
      setMessage(null);
      setIsExiting(false);
    }, 150); // Match fadeOut duration
  };

  return (
    <div 
      className={`fixed top-6 left-1/2 -translate-x-1/2 bg-[#121622] border-2 border-teal-500/60 shadow-[0_8px_30px_rgb(0,0,0,0.8)] px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-medium text-teal-100 z-50 ${
        isExiting ? 'animate-toast-out' : 'animate-toast-in'
      }`}
      id="toast-notification"
    >
      <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
      <span>{message}</span>
      <button 
        onClick={handleClose} 
        className="ml-2 text-slate-400 hover:text-slate-100 p-0.5 cursor-pointer flex items-center justify-center font-sans"
      >
        <X size={15} />
      </button>
    </div>
  );
}

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roadmap' | 'queue' | 'settings'>('dashboard');

  // Destructure from core progress hook
  const {
    roadmap,
    selectedRoadmapId,
    setSelectedRoadmapId,
    progress,
    setProgress,
    stats,
    setStats,
    algoSettings,
    setAlgoSettings,
    timeOffset,
    setTimeOffset,
    logs,
    setLogs,

    
    // Core helpers
    getVirtualTime,
    triggerSuccessAlert,
    handleToggleSolve,
    handleReviewCheckIn,
    handleAddCustomProblemFromData,
    handleRemoveCustomProblem,
    handleResetEntireTracker,
    
    // Metrics Computations
    totalProblemsCount,
    solvedProblemsCount,
    completionPercentage,
    solvedTodayCount,
    difficultyStats,
    spacedRepetitionQueue,
    completedReviewSessionsCount,
    streaks,
    topicProgressMap,
    contributionWeeks,
    categoryWeaknessStats
  } = useProgress();

  return (
    <div id="app-container" className="min-h-screen bg-[#090b10] text-[#dedee6] font-sans antialiased selection:bg-teal-500/20 selection:text-teal-300">
      
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 via-indigo-500 to-rose-500 shadow-[0_1px_20px_rgba(20,184,166,0.3)] z-50"></div>

      {/* Floating Action Event Success Toast */}
      <ToastNotification />

      {/* Primary Navigation Shell */}
      <header className="sticky top-0 bg-[#090b10]/95 backdrop-blur-xl border-b border-white/[0.04] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight text-white flex items-center gap-2">
                DSA Tracker & Planner
              </h1>
              <p className="text-xs text-slate-400">LeetCode Spaced Repetition Syllabus</p>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="hidden md:flex items-center gap-4 bg-slate-900/30 px-3 py-1.5 rounded-lg border border-white/[0.03]">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-gray-200">{streaks.currentStreak}d Streak</span>
            </div>
            <div className="w-[1px] h-4 bg-white/10"></div>
            <div className="text-xs text-slate-300">
              Score: <span className="font-mono font-bold text-teal-400">{solvedProblemsCount}</span>
              <span className="text-slate-500 font-mono font-sans"> / {totalProblemsCount}</span>
            </div>
          </div>

          {/* Nav Tab Controls */}
          <nav className="flex items-center gap-1.5 bg-[#101421] p-1 rounded-xl border border-white/[0.05]">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Overview
            </button>
            <button
              id="nav-tab-roadmap"
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Roadmap Track
              {totalProblemsCount > 0 && (
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-sans">
                  {solvedProblemsCount}/{totalProblemsCount}
                </span>
              )}
            </button>
            <button
              id="nav-tab-queue"
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 relative cursor-pointer ${
                activeTab === 'queue'
                  ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Daily Due Queue
              {spacedRepetitionQueue.length > 0 && (
                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce font-sans">
                  {spacedRepetitionQueue.length}
                </span>
              )}
            </button>
            <button
              id="nav-tab-settings"
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Settings & Debug
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Spaced Repetition Time Machine Widget */}
        <div className="mb-6 p-4 bg-gradient-to-r from-slate-900 to-[#101421] border border-indigo-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center animate-pulse">
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap text-sans">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Spaced Repetition Time Machine</span>
                {timeOffset > 0 && (
                  <span className="text-[10px] bg-indigo-500/25 text-indigo-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    +{(timeOffset / (24 * 60 * 60 * 1000)).toFixed(1)}d Simulated Future
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Current Sandbox Date: <strong className="text-indigo-300 font-bold">{new Date(getVirtualTime()).toISOString().replace('T', ' ').substring(0, 19)} UTC</strong>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setTimeOffset(prev => prev + 1 * 24 * 60 * 60 * 1000)}
              className="px-2.5 py-1.5 bg-[#090b10] hover:bg-indigo-950/40 border border-white/5 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200 text-xs font-semibold rounded-lg transition cursor-pointer font-sans"
            >
              +1 Day
            </button>
            <button
              onClick={() => setTimeOffset(prev => prev + 3 * 24 * 60 * 60 * 1000)}
              className="px-2.5 py-1.5 bg-[#090b10] hover:bg-indigo-950/40 border border-white/5 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200 text-xs font-semibold rounded-lg transition cursor-pointer font-sans"
            >
              +3 Days
            </button>
            <button
              onClick={() => setTimeOffset(prev => prev + 7 * 24 * 60 * 60 * 1000)}
              className="px-2.5 py-1.5 bg-[#090b10] hover:bg-indigo-950/40 border border-white/5 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200 text-xs font-semibold rounded-lg transition cursor-pointer font-sans"
            >
              +7 Days
            </button>
            {timeOffset !== 0 && (
              <button
                onClick={() => setTimeOffset(0)}
                className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-bold rounded-lg transition cursor-pointer font-sans"
              >
                Reset Time
              </button>
            )}
          </div>
        </div>

        {/* ===================== VIEW 1: OVERVIEW DASHBOARD ===================== */}
        {activeTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
            id="dashboard-tab-view"
          >
            {/* Row 1: KPI Visual Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card A: Overall Roadmap progress */}
              <div id="stat-card-progress" className="bg-[#101421] border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-300">
                  <Award className="w-24 h-24 text-teal-400 font-sans" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Roadmap Solved</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">{completionPercentage}%</span>
                  <span className="text-xs text-slate-400">({solvedProblemsCount} of {totalProblemsCount} units)</span>
                </div>
                {/* Custom Tailwind Mini-Bar */}
                <div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
                </div>
              </div>

              {/* Card B: Spaced Repetition Due Index */}
              <div id="stat-card-srs" className="bg-[#101421] border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-300">
                  <Calendar className="w-24 h-24 text-rose-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Daily To-Do Review Queue</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">{spacedRepetitionQueue.length}</span>
                  <span className="text-xs text-slate-400">rehearsals due now</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Needs instant attention</span>
                  <button 
                    onClick={() => setActiveTab('queue')}
                    className="text-teal-400 hover:text-teal-300 font-bold hover:underline py-0.5 cursor-pointer font-sans"
                  >
                    Resolve →
                  </button>
                </div>
              </div>

              {/* Card C: Streak Engine Metrics */}
              <div id="stat-card-streak" className="bg-[#101421] border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-300">
                  <Flame className="w-24 h-24 text-orange-400 animate-pulse" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Consistent Track Streak</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono flex items-center gap-1">
                    {streaks.currentStreak} <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">days</span>
                  </span>
                  <span className="text-xs text-slate-400">/ max: {streaks.maxStreak}d</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  <span className="text-[11px] text-slate-300 truncate font-sans">
                    {streaks.currentStreak > 0 ? "Daily streak is active, keep it up!" : "Solve a problem today to light the fire!"}
                  </span>
                </div>
              </div>

              {/* Card D: Daily Target Progression Arc */}
              <div id="stat-card-goal" className="bg-[#101421] border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden group">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Daily Target Progress</p>
                
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-white font-mono">{solvedTodayCount}</span>
                      <span className="text-slate-500 text-lg">/</span>
                      <span className="text-lg font-bold text-slate-300 font-mono">{stats.dailyGoal}</span>
                    </div>
                    <span className="text-xs text-slate-400">solves done today</span>
                  </div>
                  
                  {/* Goal Increment Controls */}
                  <div className="flex flex-col items-center gap-1 bg-[#090b10] border border-white/[0.04] p-1.5 rounded-xl">
                    <button 
                      onClick={() => setStats(prev => ({ ...prev, dailyGoal: Math.min(20, prev.dailyGoal + 1) }))}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer flex items-center justify-center font-sans"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">GOAL</span>
                    <button 
                      onClick={() => setStats(prev => ({ ...prev, dailyGoal: Math.max(1, prev.dailyGoal - 1) }))}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer flex items-center justify-center font-sans"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${solvedTodayCount >= stats.dailyGoal ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-teal-400'} transition-all`} 
                      style={{ width: `${Math.min(100, (solvedTodayCount / stats.dailyGoal) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                    <span>{solvedTodayCount >= stats.dailyGoal ? "🔥 Target achieved!" : `${stats.dailyGoal - solvedTodayCount} left to hit daily goal`}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2: Secondary Insights - Difficulty Breakdown, Calendar Heat Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Difficulty visualizer */}
              <div className="lg:col-span-5 bg-[#101421] border border-white/[0.05] p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" />
                    Syllabus Mastery Distribution
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Completion ratios segmented by problem difficulties.</p>
                </div>

                <div className="space-y-4 font-sans">
                  
                  {/* Category 1: Easy */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Easy Tiers
                      </span>
                      <span className="text-slate-300 font-mono">{difficultyStats.Easy.solved} <span className="text-slate-500 font-sans">of</span> {difficultyStats.Easy.total}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000" 
                        style={{ width: `${difficultyStats.Easy.total > 0 ? (difficultyStats.Easy.solved / difficultyStats.Easy.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Category 2: Medium */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-amber-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        Medium Tiers
                      </span>
                      <span className="text-slate-300 font-mono">{difficultyStats.Medium.solved} <span className="text-slate-500 font-sans">of</span> {difficultyStats.Medium.total}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-1000" 
                        style={{ width: `${difficultyStats.Medium.total > 0 ? (difficultyStats.Medium.solved / difficultyStats.Medium.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Category 3: Hard */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        Hard Tiers
                      </span>
                      <span className="text-slate-300 font-mono">{difficultyStats.Hard.solved} <span className="text-slate-500 font-sans">of</span> {difficultyStats.Hard.total}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 transition-all duration-1000" 
                        style={{ width: `${difficultyStats.Hard.total > 0 ? (difficultyStats.Hard.solved / difficultyStats.Hard.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                </div>

                <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-center justify-between text-xs font-sans">
                  <span className="text-slate-400 font-medium">Mastered reviews logged:</span>
                  <span className="font-mono font-bold text-white text-sm bg-[#090b10] px-2 py-0.5 rounded border border-white/[0.05]">
                    {completedReviewSessionsCount} times
                  </span>
                </div>
              </div>

              {/* Right Column: GitHub-Style Contribution Heatmap component */}
              <ContributionHeatmap 
                contributionWeeks={contributionWeeks}
                completedReviewSessionsCount={completedReviewSessionsCount}
              />

            </div>

            {/* Category Weakness Radar visualizer */}
            <WeaknessAnalytics 
              categoryWeaknessStats={categoryWeaknessStats}
            />

            {/* Action Panel directions */}
            <div className="p-4 bg-gradient-to-br from-[#121727] to-[#101421] border border-white/[0.05] rounded-2xl flex flex-wrap items-center justify-between gap-4 font-sans">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-teal-500/10 text-teal-400 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Interactive DSA Roadmap Checklist</h4>
                  <p className="text-[11px] text-slate-400">Check off standard problems across key coding categories.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveTab('roadmap')}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-500/10 transition-all duration-200 cursor-pointer"
                >
                  Configure Roadmap →
                </button>
              </div>
            </div>

          </motion.div>
        )}

        {/* ===================== VIEW 2: ROADMAP TRACK ===================== */}
        {activeTab === 'roadmap' && (
          <RoadmapList 
            roadmap={roadmap}
            progress={progress}
            topicProgressMap={topicProgressMap}
            handleToggleSolve={handleToggleSolve}
            handleReviewCheckIn={handleReviewCheckIn}
            handleAddCustomProblemFromData={handleAddCustomProblemFromData}
            handleRemoveCustomProblem={handleRemoveCustomProblem}
            selectedRoadmapId={selectedRoadmapId}
            setSelectedRoadmapId={setSelectedRoadmapId}
          />
        )}

        {/* ===================== VIEW 3: DAILY DUE QUEUE (SPACED REPETITION) ===================== */}
        {activeTab === 'queue' && (
          <DailyQueue 
            spacedRepetitionQueue={spacedRepetitionQueue}
            handleReviewCheckIn={handleReviewCheckIn}
            algoSettings={algoSettings}
            roadmap={roadmap}
            setActiveTab={setActiveTab}
          />
        )}

        {/* ===================== VIEW 4: ANKI SETTINGS & DEBUG ===================== */}
        {activeTab === 'settings' && (
          <SettingsDebug 
            algoSettings={algoSettings}
            setAlgoSettings={setAlgoSettings}
            timeOffset={timeOffset}
            setTimeOffset={setTimeOffset}
            getVirtualTime={getVirtualTime}
            progress={progress}
            setProgress={setProgress}
            logs={logs}
            setLogs={setLogs}
            handleResetEntireTracker={handleResetEntireTracker}
            triggerSuccessAlert={triggerSuccessAlert}
          />
        )}

      </main>

      {/* Persistent Footer */}
      <footer className="mt-12 border-t border-white/[0.04] py-6 text-center text-xs text-slate-500 bg-[#07090e] font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 LeetCode Spaced Repetition Tracker. All data is saved locally.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Local Database Sync Active
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-[11px] font-mono text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
              UTC {new Date(getVirtualTime()).toISOString().replace('T', ' ').substring(0, 19)}
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
