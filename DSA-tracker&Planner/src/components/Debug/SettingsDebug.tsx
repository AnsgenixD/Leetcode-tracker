// src/components/Debug/SettingsDebug.tsx

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Clock, Terminal, AlertCircle, RefreshCw } from 'lucide-react';
import { AlgoSettings, ProblemProgress, ExtensionLogEntry } from '../../types';
import { PROGRESS_STORAGE_KEY } from '../../hooks/useProgress'; // fallback/display key

interface SettingsDebugProps {
  algoSettings: AlgoSettings;
  setAlgoSettings: React.Dispatch<React.SetStateAction<AlgoSettings>>;
  timeOffset: number;
  setTimeOffset: React.Dispatch<React.SetStateAction<number>>;
  getVirtualTime: () => number;
  progress: Record<string, ProblemProgress>;
  setProgress: React.Dispatch<React.SetStateAction<Record<string, ProblemProgress>>>;
  logs: ExtensionLogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<ExtensionLogEntry[]>>;
  handleResetEntireTracker: () => void;
  triggerSuccessAlert: (message: string) => void;
}

export const SettingsDebug: React.FC<SettingsDebugProps> = ({
  algoSettings,
  setAlgoSettings,
  timeOffset,
  setTimeOffset,
  getVirtualTime,
  progress,
  setProgress,
  logs,
  setLogs,
  handleResetEntireTracker,
  triggerSuccessAlert
}) => {
  // Local state for manual event dispatcher simulation
  const [simUrl, setSimUrl] = useState('https://leetcode.com/problems/contains-duplicate/');
  const [simRating, setSimRating] = useState<'Again' | 'Hard' | 'Good' | 'Easy'>('Good');

  const handleSimulateDispatch = () => {
    if (!simUrl.trim()) return;
    
    // Construct custom event payload
    const eventDetail = {
      url: simUrl.trim(),
      timestamp: getVirtualTime(),
      rating: simRating
    };

    // Dispatch custom event to simulate the browser extension activity
    const customEvent = new CustomEvent('leetcode:problem', {
      detail: JSON.stringify(eventDetail)
    });
    
    document.dispatchEvent(customEvent);
  };

  const handleScrubDatabase = () => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to completely scrub all LeetCode progress data? This is irreversible!")) {
      setProgress({});
      triggerSuccessAlert("All user progress data deleted successfully!");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      id="settings-tab-view"
    >
      {/* Header / Info box */}
      <div className="p-5 bg-gradient-to-br from-[#121622] to-[#101421] border border-white/[0.04] rounded-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-5 -translate-y-5 p-10 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Anki Algorithm Settings & Inspector</h2>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Tune the core Spaced Repetition (SM-2) configurations to tailor intervals to your memory cycle, simulate external Chrome events, or inspect raw state records in real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION A: ALGORITHM SETTINGS */}
        <div className="bg-[#101421] border border-white/[0.04] rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                SM-2 Algorithm Configuration
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                These adjust the multipliers and defaults used by the spaced repetition formula for reviews.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Starting Ease Factor</span>
                  <span className="text-teal-400 font-mono font-normal">Default: 2.50</span>
                </label>
                <input 
                  type="number" 
                  step="0.05"
                  min="1.3"
                  max="4.0"
                  value={algoSettings.startingEase}
                  onChange={(e) => setAlgoSettings(prev => ({ ...prev, startingEase: parseFloat(e.target.value) || 2.5 }))}
                  className="w-full bg-[#090b10] border border-white/[0.06] rounded-xl py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500 transition"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Lower values mean reviews will appear more frequently initially (recommended min: 1.3).
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Maximum Review Interval</span>
                  <span className="text-teal-400 font-mono font-normal">Default: 120 days</span>
                </label>
                <input 
                  type="number" 
                  min="1"
                  max="365"
                  value={algoSettings.maxInterval}
                  onChange={(e) => setAlgoSettings(prev => ({ ...prev, maxInterval: parseInt(e.target.value, 10) || 120 }))}
                  className="w-full bg-[#090b10] border border-white/[0.06] rounded-xl py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500 transition"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  The maximum possible interval (in days) a problem can reach before being capped.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Hard Interval Modifier</span>
                  <span className="text-teal-400 font-mono font-normal">Default: 1.20</span>
                </label>
                <input 
                  type="number" 
                  step="0.05"
                  min="1.0"
                  max="2.0"
                  value={algoSettings.hardModifier}
                  onChange={(e) => setAlgoSettings(prev => ({ ...prev, hardModifier: parseFloat(e.target.value) || 1.2 }))}
                  className="w-full bg-[#090b10] border border-white/[0.06] rounded-xl py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500 transition"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Multiplier for previous interval when marking a problem as [Hard].
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Easy Bonus Modifier</span>
                  <span className="text-teal-400 font-mono font-normal">Default: 1.30</span>
                </label>
                <input 
                  type="number" 
                  step="0.05"
                  min="1.0"
                  max="3.0"
                  value={algoSettings.easyBonus}
                  onChange={(e) => setAlgoSettings(prev => ({ ...prev, easyBonus: parseFloat(e.target.value) || 1.3 }))}
                  className="w-full bg-[#090b10] border border-white/[0.06] rounded-xl py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500 transition"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Bonus multiplier applied on top of ease factor when marking a problem as [Easy].
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-6 border-t border-white/[0.04] flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setAlgoSettings({
                  startingEase: 2.50,
                  maxInterval: 120,
                  hardModifier: 1.2,
                  easyBonus: 1.3
                });
                triggerSuccessAlert("SM-2 configurations restored to defaults!");
              }}
              className="px-3.5 py-1.5 border border-white/5 hover:border-white/10 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Restore Defaults
            </button>

            <button
              onClick={() => triggerSuccessAlert("Settings saved & updated instantly!")}
              className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500/20 to-indigo-500/20 hover:from-teal-500/35 hover:to-indigo-500/35 text-teal-300 border border-teal-500/30 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Save Multipliers
            </button>
          </div>
        </div>

        {/* SECTION B: RAW DATA INSPECTOR */}
        <div className="bg-[#101421] border border-white/[0.04] rounded-2xl p-6 flex flex-col h-full justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  Local Storage Data Inspector
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Raw state object mapping active problems, easeFactors, repetitions, and nextReview deadlines.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleScrubDatabase}
                  className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-[10px] font-bold rounded transition cursor-pointer"
                >
                  Scrub Database
                </button>
                <button
                  onClick={handleResetEntireTracker}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 text-[10px] font-bold rounded transition cursor-pointer"
                >
                  Full Wipe Out Log
                </button>
              </div>
            </div>

            {/* Search / filter progress view */}
            <div className="min-h-[220px] flex flex-col bg-[#090b10] border border-white/[0.04] rounded-xl overflow-hidden font-mono text-[10px]">
              <div className="p-2 border-b border-white/[0.04] bg-white/[0.02] flex items-center justify-between text-slate-500">
                <span>LOCAL STORAGE METRIC REPO</span>
                <span>{Object.keys(progress).length} Problems Tracked</span>
              </div>
              
              <div className="p-3 overflow-auto max-h-[260px] leading-relaxed text-slate-300">
                {Object.keys(progress).length === 0 ? (
                  <div className="text-center py-12 text-slate-500 italic">No progress data stored yet! Check in or simulate an event first.</div>
                ) : (
                  <pre className="whitespace-pre-wrap select-all text-[11px] leading-relaxed font-mono">
                    {JSON.stringify(progress, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 p-3 rounded-lg border border-white/[0.02]">
            <span className="text-[11px] font-bold text-slate-300 block mb-1">Sandbox Live Values Debug:</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
              <div>At system now: <span className="text-slate-200">{new Date(Date.now()).toLocaleTimeString()}</span></div>
              <div>Virtual clock: <span className="text-teal-400 font-bold">{new Date(getVirtualTime()).toLocaleTimeString()}</span></div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION C: PIPELINE SIMULATION TERMINAL & CHROME LOGS */}
      <div className="bg-[#101421] border border-white/[0.04] rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              Chrome Extension Pipeline Simulator & Logs Console
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Your chrome extension submits a payload to this sandbox when users click "Submit" on LeetCode. You can replicate that event below.
            </p>
          </div>
          <button
            onClick={() => {
              setLogs([
                {
                  id: Math.random().toString(36).substring(4),
                  timestamp: getVirtualTime(),
                  url: 'system',
                  status: 'ignored',
                  message: 'Pipeline console logs manually cleared.'
                }
              ]);
            }}
            className="px-2.5 py-1 text-[10px] hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-white/5 cursor-pointer flex items-center gap-1"
          >
            <RefreshCw size={10} />
            Reset Logs List
          </button>
        </div>

        {/* Dispatch Simulator Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-[#090b10] border border-white/[0.04] rounded-xl items-end">
          <div className="md:col-span-6 space-y-1.5">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Simulate URL / Slug Link</span>
            <input 
              type="text" 
              value={simUrl}
              onChange={(e) => setSimUrl(e.target.value)}
              className="w-full bg-[#101421] border border-white/[0.05] rounded-lg py-1.5 px-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
              placeholder="e.g. https://leetcode.com/problems/two-sum/"
            />
          </div>
          <div className="md:col-span-3 space-y-1.5">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Self-Rating Choice</span>
            <select
              value={simRating}
              onChange={(e) => setSimRating(e.target.value as any)}
              className="w-full bg-[#101421] border border-white/[0.05] rounded-lg p-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="Again">Again (Reset to 1d)</option>
              <option value="Hard">Hard (Modifier multiplier)</option>
              <option value="Good">Good (SM-2 increase)</option>
              <option value="Easy">Easy (Easy bonus multiplier)</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button
              onClick={handleSimulateDispatch}
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow shadow-indigo-500/10 flex items-center justify-center gap-1"
            >
              <Activity size={12} />
              Simulate Code Solve Submit
            </button>
          </div>
        </div>

        {/* Live log entries */}
        <div className="bg-[#090b10] border border-white/[0.04] rounded-xl overflow-hidden font-mono text-[11px] h-64 flex flex-col justify-between">
          <div className="p-2 border-b border-white/[0.04] bg-white/[0.02] flex items-center justify-between text-slate-500 text-[10px]">
            <span>STREAMS LISTENER: customEvent('leetcode:problem')</span>
            <span>Real-time Sync Active</span>
          </div>
          <div className="p-3 overflow-auto flex-grow space-y-2 leading-relaxed">
            {logs.map((log) => {
              let tagColor = 'bg-slate-800 text-slate-400 border border-white/5';
              if (log.status === 'matched') {
                tagColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15';
              } else if (log.status === 'no_match') {
                tagColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/15';
              }
              const logTime = new Date(log.timestamp).toLocaleTimeString();
              
              return (
                <div key={log.id} className="p-2 bg-white/[0.01] border border-white/[0.02] rounded flex items-start gap-2 animate-fade-in text-[10.5px]">
                  <span className="text-slate-500 shrink-0 font-medium">[{logTime}]</span>
                  <span className={`px-1 py-0.2 text-[9px] rounded uppercase shrink-0 font-bold ${tagColor}`}>
                    {log.status === 'matched' ? 'Active Sync' : log.status === 'no_match' ? 'Unassigned' : 'System'}
                  </span>
                  <div>
                    <span className="text-indigo-300 font-semibold">{log.url} ~ </span>
                    <span className="text-slate-300 leading-normal">{log.message}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export { PROGRESS_STORAGE_KEY };
