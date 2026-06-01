/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  TrendingUp, 
  GitFork, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Grid, 
  Search, 
  Award, 
  Activity, 
  RotateCcw, 
  Trash2, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  Plus, 
  X, 
  Clock, 
  Compass, 
  PlusCircle,
  ArrowLeftRight
} from 'lucide-react';
import { DEFAULT_DSA_ROADMAP, extractLeetCodeSlug } from './data';
import { DSATopic, LeetCodeProblem, ProblemProgress, ExtensionLogEntry, UserStats, Difficulty } from './types';

// Storage keys
const PROGRESS_STORAGE_KEY = 'dsa_tracker_progress_v1';
const STATS_STORAGE_KEY = 'dsa_tracker_stats_v1';
const ROADMAP_STORAGE_KEY = 'dsa_tracker_roadmap_v1';
const EXT_LOG_STORAGE_KEY = 'dsa_tracker_ext_log_v1';

export default function App() {
  // --------- States ---------
  const [roadmap, setRoadmap] = useState<DSATopic[]>(() => {
    const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_DSA_ROADMAP;
  });

  const [progress, setProgress] = useState<Record<string, ProblemProgress>>(() => {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { dailyGoal: 2, timeOffsetDays: 0 };
  });

  const [logs, setLogs] = useState<ExtensionLogEntry[]>(() => {
    const saved = localStorage.getItem(EXT_LOG_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      {
        id: 'initial',
        timestamp: Date.now(),
        url: 'system',
        status: 'ignored',
        message: 'Spaced repetition system initialized. Solve problems on LeetCode with the extension or mark them manually inside the roadmap.'
      }
    ];
  });

  // UI Tabs & Interactive States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roadmap' | 'queue'>('dashboard');
  const [expandedTopic, setExpandedTopic] = useState<string | null>('id-arrays-hashing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('All');
  
  // Custom question modal / state
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customDifficulty, setCustomDifficulty] = useState<Difficulty>('Easy');
  const [customTopicId, setCustomTopicId] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // Extension testing simulation state
  const [simUrl, setSimUrl] = useState('https://leetcode.com/problems/two-sum/');
  const [isSuccessActionAlert, setIsSuccessActionAlert] = useState<string | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmap));
  }, [roadmap]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(EXT_LOG_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  // --------- Time & Spaced Repetition Helpers ---------
  // Offset system clock visually for simulation
  const getVirtualTime = useCallback(() => {
    return Date.now() + (stats.timeOffsetDays * 24 * 60 * 60 * 1000);
  }, [stats.timeOffsetDays]);

  const addLog = useCallback((url: string, status: 'matched' | 'no_match' | 'ignored', message: string, matchedTitle?: string) => {
    const newEntry: ExtensionLogEntry = {
      id: Math.random().toString(36).substring(4),
      timestamp: getVirtualTime(),
      url,
      status,
      message,
      matchedProblemTitle: matchedTitle
    };
    setLogs(prev => [newEntry, ...prev].slice(0, 50)); // Limit to last 50 logs
  }, [getVirtualTime]);

  const triggerSuccessAlert = (message: string) => {
    setIsSuccessActionAlert(message);
    setTimeout(() => {
      setIsSuccessActionAlert(null);
    }, 4000);
  };

  // --------- Core Mutations ---------
  const handleToggleSolve = useCallback((problemId: string) => {
    const virtualNow = getVirtualTime();
    
    setProgress(prev => {
      const current = prev[problemId];
      if (current && current.solved) {
        // Toggle off: reset scheduling
        const updated = { ...prev };
        delete updated[problemId];
        addLog('manual', 'ignored', `Problem '${problemId}' marked as unsolved manually.`);
        return updated;
      } else {
        // Mark as solved initially
        const intervals = [1, 3, 7]; // 1 day, 3 days, 7 days
        const nextReviewAt = virtualNow + (intervals[0] * 24 * 60 * 60 * 1000);
        
        const newRecord: ProblemProgress = {
          problemId,
          solved: true,
          solvedAt: virtualNow,
          intervals,
          intervalIndex: 0,
          lastReviewedAt: null,
          nextReviewAt,
          history: [
            { action: 'solved', timestamp: virtualNow }
          ]
        };

        const targetProblem = roadmap.flatMap(t => t.problems).find(p => p.id === problemId);
        addLog(
          targetProblem?.url || 'manual',
          'matched',
          `Manual check-in: solved '${targetProblem?.title || problemId}'. Next spaced review scheduled in 1 day.`,
          targetProblem?.title
        );
        triggerSuccessAlert(`"${targetProblem?.title || 'Problem'}" marked solved! Scheduled for tomorrow is added.`);
        return {
          ...prev,
          [problemId]: newRecord
        };
      }
    });
  }, [getVirtualTime, roadmap, addLog]);

  // Daily Edge Queue "Check In / Log Session" action: progress Spaced Repetition level
  const handleReviewCheckIn = useCallback((problemId: string) => {
    const virtualNow = getVirtualTime();

    setProgress(prev => {
      const current = prev[problemId];
      if (!current) return prev;

      const nextIndex = current.intervalIndex + 1;
      const isMaxMastery = nextIndex >= current.intervals.length;
      
      // Calculate next review due date
      let nextReviewAt: number | null = null;
      if (!isMaxMastery) {
        const nextIntervalDays = current.intervals[nextIndex];
        nextReviewAt = virtualNow + (nextIntervalDays * 24 * 60 * 60 * 1000);
      }

      const updatedRecord: ProblemProgress = {
        ...current,
        intervalIndex: nextIndex,
        lastReviewedAt: virtualNow,
        nextReviewAt,
        history: [
          ...current.history,
          { action: 'reviewed', timestamp: virtualNow }
        ]
      };

      const targetProblem = roadmap.flatMap(t => t.problems).find(p => p.id === problemId);
      const masteryMsg = isMaxMastery 
        ? `Fully mastered! Completed all SRS cycles.` 
        : `Level ${nextIndex + 1} Spaced Repitition scheduled in ${current.intervals[nextIndex]} days.`;

      addLog(
        targetProblem?.url || 'manual SRS',
        'matched',
        `Logged review check-in for '${targetProblem?.title || problemId}'. ${masteryMsg}`,
        targetProblem?.title
      );

      triggerSuccessAlert(`Logged review for "${targetProblem?.title || 'Problem'}"! Current Level: ${nextIndex}/${current.intervals.length}`);

      return {
        ...prev,
        [problemId]: updatedRecord
      };
    });
  }, [getVirtualTime, roadmap, addLog]);

  // Browser Extension Simulation Engine (Global Window Function bound here)
  const handleExtensionPayload = useCallback((data: { url: string; timestamp?: number }) => {
    if (!data || !data.url) {
      addLog('unknown', 'ignored', 'Extension sent blank or corrupt data.');
      return;
    }
    
    const virtualNow = getVirtualTime();
    const eventTime = data.timestamp || virtualNow;
    const urlSlug = extractLeetCodeSlug(data.url);
    
    if (!urlSlug) {
      addLog(data.url, 'no_match', 'Extension triggered: URL could not be parsed into a valid LeetCode slug.');
      return;
    }

    // Try finding a matching problem in our static/dynamic roadmap
    const matchedProblem = roadmap
      .flatMap(t => t.problems)
      .find(p => p.id === urlSlug || extractLeetCodeSlug(p.url) === urlSlug);

    if (matchedProblem) {
      // Problem exists. Let's mark as solved!
      setProgress(prev => {
        const alreadyTracked = prev[matchedProblem.id];
        if (alreadyTracked && alreadyTracked.solved) {
          // If already solved, let's treat this as a study rehearsal / review!
          const nextIndex = Math.min(alreadyTracked.intervalIndex + 1, alreadyTracked.intervals.length);
          const isMaxMastery = nextIndex >= alreadyTracked.intervals.length;
          
          let nextDue: number | null = null;
          if (!isMaxMastery) {
            nextDue = eventTime + (alreadyTracked.intervals[nextIndex] * 24 * 60 * 60 * 1000);
          }

          const updated: ProblemProgress = {
            ...alreadyTracked,
            intervalIndex: nextIndex,
            lastReviewedAt: eventTime,
            nextReviewAt: nextDue,
            history: [
              ...alreadyTracked.history,
              { action: 'reviewed', timestamp: eventTime }
            ]
          };

          addLog(
            data.url,
            'matched',
            `Extension Auto-Review: Detected solve iteration for '${matchedProblem.title}'. Advanced SRS level to ${nextIndex}/${alreadyTracked.intervals.length}.`,
            matchedProblem.title
          );

          triggerSuccessAlert(`Extension Auto-Review matched! Advanced "${matchedProblem.title}" SRS to Level ${nextIndex}`);
          return { ...prev, [matchedProblem.id]: updated };
        } else {
          // Solved for first time
          const intervals = [1, 3, 7];
          const nextDue = eventTime + (intervals[0] * 24 * 60 * 60 * 1000);
          
          const newRecord: ProblemProgress = {
            problemId: matchedProblem.id,
            solved: true,
            solvedAt: eventTime,
            intervals,
            intervalIndex: 0,
            lastReviewedAt: null,
            nextReviewAt: nextDue,
            history: [{ action: 'solved', timestamp: eventTime }]
          };

          addLog(
            data.url,
            'matched',
            `Extension auto-solve: Matched '${matchedProblem.title}'. Marked as solved! Next spaced review scheduled in 1 day.`,
            matchedProblem.title
          );

          triggerSuccessAlert(`Extension Auto-Solve! Resolved "${matchedProblem.title}" & added to 1d queue.`);
          return { ...prev, [matchedProblem.id]: newRecord };
        }
      });
    } else {
      // Problem not found in preset roadmap. Let's auto-create it under an "Extension Import" category inside the active roadmap or first topic!
      const defaultTopicId = roadmap[0]?.id || 'arrays-hashing';
      const formattedTitle = urlSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const newCustomProblem: LeetCodeProblem = {
        id: urlSlug,
        title: formattedTitle,
        url: data.url,
        difficulty: 'Medium', // Default guess
        topicId: defaultTopicId
      };

      // Add to roadmap list
      setRoadmap(prev => prev.map(topic => {
        if (topic.id === defaultTopicId) {
          return {
            ...topic,
            problems: [...topic.problems, newCustomProblem]
          };
        }
        return topic;
      }));

      // Now set progress
      setProgress(prev => {
        const intervals = [1, 3, 7];
        const nextDue = eventTime + (intervals[0] * 24 * 60 * 60 * 1000);
        
        const newRecord: ProblemProgress = {
          problemId: urlSlug,
          solved: true,
          solvedAt: eventTime,
          intervals,
          intervalIndex: 0,
          lastReviewedAt: null,
          nextReviewAt: nextDue,
          history: [{ action: 'solved', timestamp: eventTime }]
        };

        addLog(
          data.url,
          'matched',
          `Extension Auto-Import: Problem '${formattedTitle}' was not in standard track. Dynamically appended to '${roadmap[0].name}' and auto-solved!`,
          formattedTitle
        );

        triggerSuccessAlert(`Extension Custom Import! Created & solved "${formattedTitle}" dynamically!`);
        return { ...prev, [urlSlug]: newRecord };
      });
    }
  }, [getVirtualTime, roadmap, addLog]);

  useEffect(() => {
    const handler = (e: Event) => {
      const payload = (e as CustomEvent).detail;
      handleExtensionPayload(payload);
    };

    // Works in both dev and production
    document.addEventListener("leetcode:problem", handler);

    // Bonus: also works via Vite HMR in dev
    if ((import.meta as any).hot) {
      (import.meta as any).hot.on('leetcode:problem', (payload: any) => {
        handleExtensionPayload(payload);
      });
    }

    return () => document.removeEventListener("leetcode:problem", handler);
  }, [handleExtensionPayload]);

  // Add custom problem via modal form
  const handleAddCustomProblem = (e: FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customUrl || !customTopicId) return;

    const slug = extractLeetCodeSlug(customUrl) || Math.random().toString(36).substring(4);
    
    // Check if exists
    const exists = roadmap.flatMap(t => t.problems).some(p => p.id === slug);
    if (exists) {
      alert("A problem with this URL/Slug already exists inside the database!");
      return;
    }

    const newProblem: LeetCodeProblem = {
      id: slug,
      title: customTitle,
      url: customUrl,
      difficulty: customDifficulty,
      topicId: customTopicId
    };

    setRoadmap(prev => prev.map(t => {
      if (t.id === customTopicId) {
        return {
          ...t,
          problems: [...t.problems, newProblem]
        };
      }
      return t;
    }));

    setCustomTitle('');
    setCustomUrl('');
    setIsAddingQuestion(false);
    triggerSuccessAlert(`Custom problem "${customTitle}" added to category list!`);
  };

  const handleRemoveCustomProblem = (topicId: string, problemId: string) => {
    if (!confirm("Are you sure you want to delete this problem from the roadmap tracking? All stored stats for it will be erased too.")) {
      return;
    }
    
    setRoadmap(prev => prev.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          problems: t.problems.filter(p => p.id !== problemId)
        };
      }
      return t;
    }));

    setProgress(prev => {
      const updated = { ...prev };
      delete updated[problemId];
      return updated;
    });

    triggerSuccessAlert("Problem removed from track.");
  };

  // Reset progress stats entirely
  const handleResetEntireTracker = () => {
    if (confirm("🚨 WARNING: This will reset all your solved problems, SRS histories, logged events, and virtual clocks. Type OK to confirm!")) {
      setProgress({});
      setStats({ dailyGoal: 2, timeOffsetDays: 0 });
      setLogs([
        {
          id: 'reset',
          timestamp: Date.now(),
          url: 'system',
          status: 'ignored',
          message: 'Workspace stats were fully reset to baseline values.'
        }
      ]);
      setRoadmap(DEFAULT_DSA_ROADMAP);
      triggerSuccessAlert("Tracker states fully rejuvenated.");
    }
  };

  // --------- Statistics Compilation ---------
  const totalProblemsCount = useMemo(() => {
    return roadmap.reduce((sum, t) => sum + t.problems.length, 0);
  }, [roadmap]);

  const solvedProblemsCount = useMemo(() => {
    return (Object.values(progress) as ProblemProgress[]).filter(p => p.solved).length;
  }, [progress]);

  const completionPercentage = useMemo(() => {
    if (totalProblemsCount === 0) return 0;
    return Math.round((solvedProblemsCount / totalProblemsCount) * 100);
  }, [totalProblemsCount, solvedProblemsCount]);

  // Solves completed today (virtual context)
  const solvedTodayCount = useMemo(() => {
    const virtualNow = getVirtualTime();
    const startOfVirtualToday = new Date(virtualNow);
    startOfVirtualToday.setHours(0, 0, 0, 0);
    const startOfVirtualTodayMs = startOfVirtualToday.getTime();

    // Sum matching activities done in this virtual 24h window
    return (Object.values(progress) as ProblemProgress[]).filter(p => {
      if (!p.solved || !p.solvedAt) return false;
      
      // Look through solve or review history in today
      const hasActivityToday = p.history.some(h => h.timestamp >= startOfVirtualTodayMs && h.timestamp <= virtualNow);
      return hasActivityToday;
    }).length;
  }, [progress, getVirtualTime]);

  const difficultyStats = useMemo(() => {
    const statsObj = {
      Easy: { solved: 0, total: 0 },
      Medium: { solved: 0, total: 0 },
      Hard: { solved: 0, total: 0 }
    };

    roadmap.forEach(topic => {
      topic.problems.forEach(prob => {
        const diff = prob.difficulty;
        if (statsObj[diff]) {
          statsObj[diff].total += 1;
          if (progress[prob.id]?.solved) {
            statsObj[diff].solved += 1;
          }
        }
      });
    });

    return statsObj;
  }, [roadmap, progress]);

  // Spaced repetition queue compiler: Find problems that are solved, not mastered yet, and nextReviewAt <= Virtual Time
  const spacedRepetitionQueue = useMemo(() => {
    const virtualNow = getVirtualTime();
    const list: { problem: LeetCodeProblem; progress: ProblemProgress; daysUntilDue: number }[] = [];

    roadmap.forEach(topic => {
      topic.problems.forEach(prob => {
        const prog = progress[prob.id];
        if (prog && prog.solved && prog.nextReviewAt !== null) {
          const isDue = prog.nextReviewAt <= virtualNow;
          const diffMs = prog.nextReviewAt - virtualNow;
          const daysUntilDue = diffMs / (24 * 60 * 60 * 1000);
          
          if (isDue) {
            list.push({
              problem: prob,
              progress: prog,
              daysUntilDue: Math.ceil(daysUntilDue)
            });
          }
        }
      });
    });

    return list.sort((a, b) => (a.progress.nextReviewAt || 0) - (b.progress.nextReviewAt || 0));
  }, [roadmap, progress, getVirtualTime]);

  // Solved history logs compiled
  const completedReviewSessionsCount = useMemo(() => {
    return (Object.values(progress) as ProblemProgress[]).reduce((sum, p) => {
      return sum + p.history.filter(h => h.action === 'reviewed').length;
    }, 0);
  }, [progress]);

  // Daily Streak Calculation:
  // Compile any activity (solve/review) within virtual days
  const streaks = useMemo(() => {
    const virtualNow = getVirtualTime();
    const sortedDates: string[] = [];
    
    // Group all histories into local date strings
    (Object.values(progress) as ProblemProgress[]).forEach(p => {
      p.history.forEach(h => {
        const d = new Date(h.timestamp);
        const dayString = d.toISOString().split('T')[0]; // "YYYY-MM-DD"
        if (!sortedDates.includes(dayString)) {
          sortedDates.push(dayString);
        }
      });
    });

    sortedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // descending (newest first)

    let currentStreak = 0;
    let maxStreak = 0;

    // Helper to get date string relative to virtual day offset
    const getVirtualDateString = (dayOffset: number) => {
      const d = new Date(virtualNow + (dayOffset * 24 * 60 * 60 * 1000));
      return d.toISOString().split('T')[0];
    };

    const todayStr = getVirtualDateString(0);
    const yesterdayStr = getVirtualDateString(-1);

    // Calculate current streak
    let trackingStr = todayStr;
    const hasActivityToday = sortedDates.includes(todayStr);
    const hasActivityYesterday = sortedDates.includes(yesterdayStr);

    if (hasActivityToday || hasActivityYesterday) {
      if (hasActivityToday) {
        currentStreak = 1;
        let checkOffset = -1;
        while (sortedDates.includes(getVirtualDateString(checkOffset))) {
          currentStreak++;
          checkOffset--;
        }
      } else {
        currentStreak = 1;
        let checkOffset = -2;
        while (sortedDates.includes(getVirtualDateString(checkOffset))) {
          currentStreak++;
          checkOffset--;
        }
      }
    }

    // Calculate maximum streak historically
    if (sortedDates.length > 0) {
      let tempStreak = 1;
      // We go forwards to find largest chain of consecutive days (difference of 1 day)
      const sortedTs = sortedDates.map(d => new Date(d).getTime()).sort((a,b)=> a-b);
      let localMax = 1;

      for (let i = 1; i < sortedTs.length; i++) {
        const diffDays = (sortedTs[i] - sortedTs[i-1]) / (24 * 60 * 60 * 1000);
        if (diffDays <= 1.1 && diffDays >= 0.9) { // close to 1 day due to clock offsets
          tempStreak++;
        } else if (diffDays > 1.1) {
          tempStreak = 1;
        }
        if (tempStreak > localMax) {
          localMax = tempStreak;
        }
      }
      maxStreak = localMax;
    }

    // Adjust in case current exceeds max
    maxStreak = Math.max(maxStreak, currentStreak);

    return {
      currentStreak,
      maxStreak,
      activityDates: sortedDates
    };
  }, [progress, getVirtualTime]);

  // Topic progress compiled for accordion statistics
  const topicProgressMap = useMemo(() => {
    const map: Record<string, { solved: number; total: number; percent: number }> = {};
    roadmap.forEach(topic => {
      const total = topic.problems.length;
      const solved = topic.problems.filter(p => progress[p.id]?.solved).length;
      const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
      map[topic.id] = { solved, total, percent };
    });
    return map;
  }, [roadmap, progress]);

  return (
    <div id="app-container" className="min-h-screen bg-[#090b10] text-[#dedee6] font-sans antialiased selection:bg-teal-500/20 selection:text-teal-300">
      
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 via-indigo-500 to-rose-500 shadow-[0_1px_20px_rgba(20,184,166,0.3)] z-50"></div>

      {/* Floating Action Event Success Toast */}
      <AnimatePresence>
        {isSuccessActionAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#121622] border-2 border-teal-500/60 shadow-[0_8px_30px_rgb(0,0,0,0.8)] px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-medium text-teal-100 z-50"
            id="toast-notification"
          >
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
            <span>{isSuccessActionAlert}</span>
            <button onClick={() => setIsSuccessActionAlert(null)} className="ml-2 text-slate-400 hover:text-slate-100 p-0.5">
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Navigation Shell */}
      <header className="sticky top-0 bg-[#090b10]/95 backdrop-blur-xl border-b border-white/[0.04] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
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
              <span className="text-slate-500 font-mono"> / {totalProblemsCount}</span>
            </div>
          </div>

          {/* Nav Tab Controls */}
          <nav className="flex items-center gap-1.5 bg-[#101421] p-1 rounded-xl border border-white/[0.05]">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
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
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'roadmap'
                  ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Roadmap Track
              {totalProblemsCount > 0 && (
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {solvedProblemsCount}/{totalProblemsCount}
                </span>
              )}
            </button>
            <button
              id="nav-tab-queue"
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 relative ${
                activeTab === 'queue'
                  ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Daily Due Queue
              {spacedRepetitionQueue.length > 0 && (
                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce">
                  {spacedRepetitionQueue.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Global Virtual Calendar Offset Status Indicator if Time Simulation is active */}
        {stats.timeOffsetDays > 0 && (
          <div className="mb-6 p-3 bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-500/30 rounded-xl flex items-center justify-between text-xs text-indigo-200 shadow-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>
                <strong>System Time Warp Active:</strong> Currently simulating <strong>+{stats.timeOffsetDays} Days</strong> in the future.
              </span>
            </div>
            <button 
              onClick={() => setStats(prev => ({ ...prev, timeOffsetDays: 0 }))}
              className="px-2.5 py-1 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded border border-indigo-400/30 transition-all font-mono font-bold"
            >
              Reset Clock Offset
            </button>
          </div>
        )}

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
                  <Award className="w-24 h-24 text-teal-400" />
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
                    className="text-teal-400 hover:text-teal-300 font-bold hover:underline py-0.5"
                  >
                    Resolve →
                  </button>
                </div>
              </div>

              {/* Card C: Streak Engine Metrics */}
              <div id="stat-card-streak" className="bg-[#101421] border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-300">
                  <Flame className="w-24 h-24 text-orange-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Consistent Track Streak</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono flex items-center gap-1">
                    {streaks.currentStreak} <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">days</span>
                  </span>
                  <span className="text-xs text-slate-400">/ max: {streaks.maxStreak}d</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  <span className="text-[11px] text-slate-300 truncate">
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
                      className="p-1 hover:bg-slate-800 rounded text-slate-300"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">GOAL</span>
                    <button 
                      onClick={() => setStats(prev => ({ ...prev, dailyGoal: Math.max(1, prev.dailyGoal - 1) }))}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300"
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

            {/* Row 2: Secondary Insights - Difficulty Breakdown, Calendar Heat Grid, Quick add problem */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Difficulty visualizer */}
              <div className="lg:col-span-5 bg-[#101421] border border-white/[0.05] p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" />
                    Syllabus Mastery Distribution
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Completion ratios segmented by problem tiers.</p>
                </div>

                <div className="space-y-4">
                  
                  {/* Category 1: Easy */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Easy Tiers
                      </span>
                      <span className="text-slate-300 font-mono">{difficultyStats.Easy.solved} <span className="text-slate-500">of</span> {difficultyStats.Easy.total}</span>
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
                      <span className="text-slate-300 font-mono">{difficultyStats.Medium.solved} <span className="text-slate-500">of</span> {difficultyStats.Medium.total}</span>
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
                      <span className="text-slate-300 font-mono">{difficultyStats.Hard.solved} <span className="text-slate-500">of</span> {difficultyStats.Hard.total}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 transition-all duration-1000" 
                        style={{ width: `${difficultyStats.Hard.total > 0 ? (difficultyStats.Hard.solved / difficultyStats.Hard.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                </div>

                <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400">Mastered reviews logged:</span>
                  <span className="font-mono font-bold text-white text-sm bg-[#090b10] px-2 py-0.5 rounded border border-white/[0.05]">
                    {completedReviewSessionsCount} times
                  </span>
                </div>
              </div>

              {/* Right Column: Custom Activity Heat Tracker & Motivational Message */}
              <div className="lg:col-span-7 bg-[#101421] border border-white/[0.05] p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                    <Grid className="w-4 h-4 text-indigo-400" />
                    Last 15-Day Consistency Heat Grid
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Daily solved counts shown in simulated virtual times.</p>
                  
                  {/* Heatmap Grid */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {Array.from({ length: 15 }).map((_, idx) => {
                      const dayOffset = -14 + idx;
                      const virtualNow = getVirtualTime();
                      const d = new Date(virtualNow + (dayOffset * 24 * 60 * 60 * 1000));
                      const dString = d.toISOString().split('T')[0];
                      const formattedDateLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      
                      const hasActivity = streaks.activityDates.includes(dString);
                      
                      return (
                        <div 
                          key={idx}
                          className="group relative cursor-default"
                        >
                          <div 
                            className={`w-9 h-9 rounded-lg border transition-all duration-300 flex items-center justify-center font-mono text-[10px] ${
                              hasActivity 
                                ? 'bg-gradient-to-br from-teal-500/30 to-indigo-600/45 border-teal-500/40 text-teal-200 font-bold shadow-[0_0_8px_rgba(20,184,166,0.15)]' 
                                : 'bg-[#090b10] border-white/[0.03] text-slate-600 hover:border-slate-800'
                            }`}
                          >
                            {d.getDate()}
                          </div>
                          <div className="absolute bottom-11 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#090b10] border border-white/[0.08] text-[9px] px-2 py-1 rounded shadow-xl whitespace-nowrap z-50 text-slate-300">
                            {formattedDateLabel}: {hasActivity ? "✅ Goal Active" : "❌ No solves logged"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#090b10]/80 rounded-xl border border-white/[0.03] flex items-start gap-3">
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Spaced Repetition Schedule</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      The interval review algorithm determines optimal times to revisit problems. Mark problems as solved or log check-in reviews to lock in your long-term memory.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Quick action buttons for tab directions */}
            <div className="p-4 bg-gradient-to-br from-[#121727] to-[#101421] border border-white/[0.05] rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
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
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-500/10 transition-all duration-200"
                >
                  Configure Roadmap →
                </button>
              </div>
            </div>

          </motion.div>
        )}

        {/* ===================== VIEW 2: ROADMAP TRACK ===================== */}
        {activeTab === 'roadmap' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
            id="roadmap-tab-view"
          >
            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#101421] border border-white/[0.05] rounded-2xl">
              
              <div className="flex items-center gap-2 flex-grow max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search standard/custom problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#090b10] border border-white/[0.05] focus:outline-none focus:border-teal-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-500"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                
                {/* Difficulty Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">Difficulty:</span>
                  <select 
                    value={selectedDifficultyFilter}
                    onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                    className="bg-[#090b10] border border-white/[0.05] text-xs text-slate-300 rounded-lg p-1.5 focus:outline-none focus:border-teal-500/40"
                  >
                    <option value="All">All Tiers</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Trigger Add Question Form button */}
                <button 
                  onClick={() => {
                    setIsAddingQuestion(true);
                    if (roadmap.length > 0) setCustomTopicId(roadmap[0].id);
                  }}
                  className="px-3.5 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-xl text-xs font-semibold border border-teal-500/30 flex items-center gap-1.5 transition"
                >
                  <PlusCircle size={15} />
                  Add Custom Problem
                </button>
              </div>

            </div>

            {/* Custom Question Modal (Overlay on top of dashboard) */}
            <AnimatePresence>
              {isAddingQuestion && (
                <div className="fixed inset-0 bg-[#090b10]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#101421] border border-white/[0.08] rounded-2xl w-full max-w-md p-6 overflow-hidden shadow-2xl relative"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] mb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Plus size={18} className="text-teal-400" />
                        Inject Custom Problem
                      </h3>
                      <button 
                        onClick={() => setIsAddingQuestion(false)}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleAddCustomProblem} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Problem Title</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Reverse Integer"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          className="w-full bg-[#090b10] border border-white/[0.05] focus:outline-none focus:border-teal-500 rounded-xl py-2 px-3 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">LeetCode URL / Slug</label>
                        <input 
                          type="url"
                          required
                          placeholder="e.g. https://leetcode.com/problems/reverse-integer/"
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          className="w-full bg-[#090b10] border border-white/[0.05] focus:outline-none focus:border-teal-500 rounded-xl py-2 px-3 text-xs text-slate-200 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Topic Syllabus</label>
                          <select 
                            value={customTopicId}
                            onChange={(e) => setCustomTopicId(e.target.value)}
                            className="w-full bg-[#090b10] border border-white/[0.05] focus:outline-none focus:border-teal-500 rounded-xl py-2 px-3 text-xs text-slate-200"
                          >
                            {roadmap.map(topic => (
                              <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Difficulty</label>
                          <select 
                            value={customDifficulty}
                            onChange={(e) => setCustomDifficulty(e.target.value as Difficulty)}
                            className="w-full bg-[#090b10] border border-white/[0.05] focus:outline-none focus:border-teal-500 rounded-xl py-2 px-3 text-xs text-slate-200"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/[0.04] flex items-center justify-end gap-3">
                        <button 
                          type="button"
                          onClick={() => setIsAddingQuestion(false)}
                          className="px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-semibold shadow"
                        >
                          Save to Syllabus
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Topics Loop & Problem Accordion */}
            <div className="space-y-4">
              {roadmap.map(topic => {
                const isExpanded = expandedTopic === topic.id;
                
                // Filter problems based on search and selected difficulty
                const filteredProblems = topic.problems.filter(prob => {
                  const matchSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                      prob.id.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchDiff = selectedDifficultyFilter === 'All' || prob.difficulty === selectedDifficultyFilter;
                  return matchSearch && matchDiff;
                });

                if (filteredProblems.length === 0 && (searchQuery !== '' || selectedDifficultyFilter !== 'All')) {
                  return null; // hide empty search categories
                }

                const progressStats = topicProgressMap[topic.id] || { solved: 0, total: 0, percent: 0 };

                return (
                  <div 
                    key={topic.id} 
                    className="bg-[#101421] border border-white/[0.04] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.08]"
                    id={`topic-accordion-${topic.id}`}
                  >
                    
                    {/* Topic Header Grid */}
                    <button
                      onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                      className="w-full p-5 flex flex-wrap items-center justify-between gap-4 text-left/right bg-white/[0.01] hover:bg-white/[0.03] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 border border-white/5 rounded-lg text-teal-400">
                          {topic.iconName === 'Grid' && <Grid size={18} />}
                          {topic.iconName === 'ArrowLeftRight' && <ArrowLeftRight size={18} />}
                          {topic.iconName === 'Minimize2' && <Compass size={18} />}
                          {topic.iconName === 'Layers' && <Layers size={18} />}
                          {topic.iconName === 'Search' && <Search size={18} />}
                          {topic.iconName === 'GitFork' && <GitFork size={18} />}
                          {topic.iconName === 'GitMerge' && <Activity size={18} />}
                          {topic.iconName === 'CornerDownLeft' && <RotateCcw size={18} />}
                          {topic.iconName === 'TrendingUp' && <TrendingUp size={18} />}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            {topic.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{topic.description}</p>
                        </div>
                      </div>

                      {/* Right Header Status info & progress bar */}
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end gap-1">
                          <span className="text-[11px] text-slate-400 font-mono">
                            Category Completed: <span className="text-teal-400 font-bold">{progressStats.solved}</span>/{progressStats.total}
                          </span>
                          <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-400" style={{ width: `${progressStats.percent}%` }}></div>
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp size={18} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={18} className="text-slate-400" />
                        )}
                      </div>

                    </button>

                    {/* Problems Children Area */}
                    {isExpanded && (
                      <div className="border-t border-white/[0.04] p-4 bg-[#0a0d17]/50 space-y-2">
                        {filteredProblems.length === 0 ? (
                          <p className="text-xs text-slate-500 py-4 text-center">No problems matching filters in this category.</p>
                        ) : (
                          filteredProblems.map(prob => {
                            const progRecord = progress[prob.id];
                            const isSolved = progRecord?.solved || false;
                            
                            return (
                              <div 
                                key={prob.id}
                                className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                                  isSolved 
                                    ? 'bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/30' 
                                    : 'bg-[#101421]/90 border-white/[0.03] hover:border-white/[0.08]'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {/* Checkbox Trigger Toggle btn */}
                                  <button
                                    onClick={() => handleToggleSolve(prob.id)}
                                    className="p-1 text-slate-400 hover:text-white transition"
                                    title={isSolved ? "Mark unsolved" : "Mark completed"}
                                  >
                                    {isSolved ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/10" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                                    )}
                                  </button>

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs font-semibold ${isSolved ? 'text-emerald-100 line-through decoration-emerald-800' : 'text-slate-200'}`}>
                                        {prob.title}
                                      </span>
                                      
                                      {/* Direct Leetcode target link */}
                                      <a 
                                        href={prob.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-slate-500 hover:text-teal-400 p-0.5 transition"
                                        title="Open External LeetCode URL"
                                      >
                                        <ExternalLink size={12} />
                                      </a>
                                    </div>

                                    {/* Spaced Repetition Tags under Problems */}
                                    {isSolved && progRecord && (
                                      <div className="flex flex-wrap gap-2 mt-1 items-center">
                                        <span className="text-[9px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                                          Solved
                                        </span>
                                        {progRecord.nextReviewAt ? (
                                          <span className="text-[9px] text-slate-400 font-mono bg-slate-900 border border-white/5 px-1.5 py-0.2 rounded flex items-center gap-1">
                                            <Clock size={10} className="text-teal-400" />
                                            Active SRS Level {progRecord.intervalIndex + 1}/3
                                          </span>
                                        ) : (
                                          <span className="text-[9px] text-teal-400 font-mono bg-teal-500/5 border border-teal-500/10 px-1.5 py-0.2 rounded flex items-center gap-1 font-bold">
                                            🌟 Mastered Fully
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Right Side actions Difficulty tags, Custom question garbage collector */}
                                <div className="flex items-center gap-3">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}>
                                    {prob.difficulty}
                                  </span>

                                  {/* Let them wipe out custom items if they added them */}
                                  {!DEFAULT_DSA_ROADMAP.flatMap(t => t.problems).some(p => p.id === prob.id) && (
                                    <button 
                                      onClick={() => handleRemoveCustomProblem(topic.id, prob.id)}
                                      className="p-1 hover:bg-rose-500/15 text-slate-500 hover:text-rose-400 rounded transition"
                                      title="Trash this custom problem"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  )}
                                </div>

                              </div>
                            );
                          })
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Zero State for Search matches */}
            {roadmap.every(topic => {
              const matches = topic.problems.filter(prob => {
                const matchSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    prob.id.toLowerCase().includes(searchQuery.toLowerCase());
                const matchDiff = selectedDifficultyFilter === 'All' || prob.difficulty === selectedDifficultyFilter;
                return matchSearch && matchDiff;
              });
              return matches.length === 0;
            }) && (
              <div className="text-center py-12 p-8 bg-[#101421] border border-white/[0.04] rounded-2xl">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <h4 className="text-xs font-semibold text-white">No roadmap items matched your filters.</h4>
                <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or difficulty settings!</p>
              </div>
            )}

          </motion.div>
        )}

        {/* ===================== VIEW 3: DAILY DUE QUEUE (SPACED REPETITION) ===================== */}
        {activeTab === 'queue' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
            id="queue-tab-view"
          >
            {/* Header / Info box */}
            <div className="p-5 bg-gradient-to-br from-[#121622] to-[#101421] border border-white/[0.04] rounded-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-5 -translate-y-5 p-10 bg-indigo-500/5 rounded-full blur-3xl"></div>
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">Spaced Repetition Review Queue</h2>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Spaced repetition helps you retain coding solutions by reviewing them periodically. This system tracks solved items that have hit their scheduled review date (1-day, 3-day, and 7-day intervals). Keep your memory sharp by completing reviews on time under the Daily Due Queue.
                  </p>
                </div>
              </div>
            </div>

            {/* Main queue area */}
            <div className="space-y-3">
              {spacedRepetitionQueue.length === 0 ? (
                <div className="text-center py-12 p-8 bg-[#101421] border border-white/[0.04] rounded-2xl space-y-4">
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-full w-fit mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Daily Review Queue is Empty</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      All your solved problems are currently reinforced and on track. Continue solving and tracking new questions inside the roadmap.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('roadmap')}
                    className="px-4 py-1.5 bg-[#090b10] hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-white/[0.04]"
                  >
                    View Roadmap Track
                  </button>
                </div>
              ) : (
                spacedRepetitionQueue.map(({ problem, progress: progRecord }) => {
                  const currentLevel = progRecord.intervalIndex;
                  const currentIntervalDays = progRecord.intervals[currentLevel];
                  
                  return (
                    <div 
                      key={problem.id}
                      className="bg-[#101421] border border-rose-500/15 hover:border-rose-500/25 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/5 text-rose-400 border border-rose-500/10 rounded-lg">
                          <Flame className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{problem.title}</span>
                            <a 
                              href={problem.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-teal-400 transition"
                            >
                              <ExternalLink size={11} />
                            </a>
                            <span className="text-[10px] bg-slate-900 border border-white/5 text-slate-400 px-2 py-0.2 rounded">
                              {roadmap.find(t => t.id === problem.topicId)?.name || "DSA Category"}
                            </span>
                          </div>

                          {/* Scheduling statuses */}
                          <div className="flex items-center gap-4 mt-1.5 text-[10px] text-slate-400 font-mono">
                            <span className="flex items-center gap-1 font-semibold text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                              <AlertCircle size={10} />
                              Review Level #{currentLevel + 1} Due Now ({currentIntervalDays}d Cycle)
                            </span>
                            <span>Solved: {new Date(progRecord.solvedAt || 0).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Prominent Action Button */}
                      <button
                        onClick={() => handleReviewCheckIn(problem.id)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-teal-500/20 border border-emerald-500/35 hover:border-emerald-500/60 text-emerald-300 hover:text-emerald-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition duration-200"
                        id={`check-in-btn-${problem.id}`}
                      >
                        <Check size={14} />
                        Check In & Log Session
                      </button>
                    </div>
                  );
                })
              )}
            </div>

          </motion.div>
        )}

      </main>

      {/* Persistent Footer */}
      <footer className="mt-12 border-t border-white/[0.04] py-6 text-center text-xs text-slate-500 bg-[#07090e]">
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
