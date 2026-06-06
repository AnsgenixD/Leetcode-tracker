// src/hooks/useProgress.ts

import { useState, useEffect, useMemo, useCallback, FormEvent } from 'react';
import { DEFAULT_DSA_ROADMAP, extractLeetCodeSlug } from '../data';
import { CURATED_ROADMAPS } from '../data/roadmaps';
import { 
  DSATopic, 
  LeetCodeProblem, 
  ProblemProgress, 
  ExtensionLogEntry, 
  UserStats, 
  Difficulty, 
  AlgoSettings,
  RoadmapProblem
} from '../types';

function getCategoryIconAndDesc(category: string): { iconName: string; description: string } {
  const norm = category.toLowerCase().trim();
  if (norm.includes('array') || norm.includes('hash')) {
    return {
      iconName: 'Grid',
      description: 'Fundamental lookup patterns, hashing counters, and array positioning.'
    };
  }
  if (norm.includes('pointer')) {
    return {
      iconName: 'ArrowLeftRight',
      description: 'Linear scanning using dual indexes to find pairs, subsets, or palindromes.'
    };
  }
  if (norm.includes('window')) {
    return {
      iconName: 'Minimize2',
      description: 'Dynamic subarray boundaries to capture optimal contiguous segments.'
    };
  }
  if (norm.includes('stack')) {
    return {
      iconName: 'Layers',
      description: 'Last-In, First-Out (LIFO) tracking for nested patterns, parentheses, and evaluations.'
    };
  }
  if (norm.includes('search')) {
    return {
      iconName: 'Search',
      description: 'O(log N) partitioning of ordered arrays to narrow coordinates quickly.'
    };
  }
  if (norm.includes('list')) {
    return {
      iconName: 'GitFork',
      description: 'Node chaining, pointer manipulation, and cycle tracking strategies.'
    };
  }
  if (norm.includes('tree')) {
    return {
      iconName: 'GitMerge',
      description: 'Hierarchical node traversal, preorder/inorder parsing, and BST properties.'
    };
  }
  if (norm.includes('backtracking')) {
    return {
      iconName: 'CornerDownLeft',
      description: 'Permutation, combinations, and exhausting search spaces recursively.'
    };
  }
  if (norm.includes('graph')) {
    return {
      iconName: 'Share2',
      description: 'Shortest path solutions, topological sorting, and recursive explorations.'
    };
  }
  if (norm.includes('programming') || norm.includes('dp')) {
    return {
      iconName: 'TrendingUp',
      description: 'Breaking issues into reusable overlapping sub-problems using memoization or tabulating.'
    };
  }
  if (norm.includes('sorting')) {
    return {
      iconName: 'Activity',
      description: 'Ordering algorithms and binary operations.'
    };
  }
  return {
    iconName: 'AlertCircle',
    description: 'Custom added problems and imports from external browser triggers.'
  };
}
import { calculateSM2, DEFAULT_ALGO_SETTINGS } from '../utils/sm2';
import { getVirtualTimestamp, toDateString } from '../utils/time';

// Storage keys
export const PROGRESS_STORAGE_KEY = 'dsa_tracker_progress_v1';
const STATS_STORAGE_KEY = 'dsa_tracker_stats_v1';
const ROADMAP_STORAGE_KEY = 'dsa_tracker_roadmap_v1';
const EXT_LOG_STORAGE_KEY = 'dsa_tracker_ext_log_v1';
const ALGO_SETTINGS_STORAGE_KEY = 'dsa_tracker_algo_settings_v1';
const TIME_OFFSET_STORAGE_KEY = 'dsa_tracker_time_offset_msg_v1';

export function useProgress() {
  // --------- States ---------
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(() => {
    const saved = localStorage.getItem('dsa_tracker_selected_roadmap_id_v1');
    return saved || 'blind75';
  });

  const [customProblems, setCustomProblems] = useState<RoadmapProblem[]>(() => {
    const saved = localStorage.getItem('dsa_tracker_custom_problems_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync selectedRoadmapId
  useEffect(() => {
    localStorage.setItem('dsa_tracker_selected_roadmap_id_v1', selectedRoadmapId);
  }, [selectedRoadmapId]);

  // Sync customProblems
  useEffect(() => {
    localStorage.setItem('dsa_tracker_custom_problems_v1', JSON.stringify(customProblems));
  }, [customProblems]);

  // ========== FIX #1: Build memoized slug→problem index for O(1) lookups ==========
  const slugProblemIndex = useMemo(() => {
    const index = new Map<string, RoadmapProblem>();
    CURATED_ROADMAPS.forEach(roadmap => {
      roadmap.problems.forEach(prob => {
        index.set(prob.id, prob);
        // Also cache the extracted slug version
        const extracted = extractLeetCodeSlug(prob.url);
        if (extracted) {
          index.set(extracted, prob);
        }
      });
    });
    customProblems.forEach(prob => {
      index.set(prob.id, prob);
      const extracted = extractLeetCodeSlug(prob.url);
      if (extracted) {
        index.set(extracted, prob);
      }
    });
    return index;
  }, [customProblems]);

  // Dynamically compute the unified combined problems list
  const combinedProblems = useMemo(() => {
    const selected = CURATED_ROADMAPS.find(r => r.id === selectedRoadmapId) || CURATED_ROADMAPS[0];
    const std = selected.problems;
    return [...std, ...customProblems];
  }, [selectedRoadmapId, customProblems]);

  // Dynamically group combined problems to conform to DSATopic[]
  const roadmap = useMemo<DSATopic[]>(() => {
    const topicsMap: Record<string, { name: string; problems: LeetCodeProblem[] }> = {};
    
    combinedProblems.forEach(prob => {
      // derive slug safe topicId from category name
      const topicId = prob.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!topicsMap[topicId]) {
        topicsMap[topicId] = {
          name: prob.category,
          problems: []
        };
      }
      topicsMap[topicId].problems.push({
        id: prob.id,
        title: prob.title,
        url: prob.url,
        difficulty: prob.difficulty,
        topicId: topicId
      });
    });
    
    // Convert map to DSATopic[]
    return Object.entries(topicsMap).map(([topicId, item]) => {
      const { iconName, description } = getCategoryIconAndDesc(item.name);
      return {
        id: topicId,
        name: item.name,
        iconName,
        description,
        problems: item.problems
      };
    });
  }, [combinedProblems]);

  const setRoadmap = useCallback((updater: any) => {
    // Compat mock
  }, []);

  const [progress, setProgress] = useState<Record<string, ProblemProgress>>(() => {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { dailyGoal: 2, timeOffsetDays: 0 };
  });

  const [algoSettings, setAlgoSettings] = useState<AlgoSettings>(() => {
    const saved = localStorage.getItem(ALGO_SETTINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { ...DEFAULT_ALGO_SETTINGS };
  });

  const [timeOffset, setTimeOffset] = useState<number>(() => {
    const saved = localStorage.getItem(TIME_OFFSET_STORAGE_KEY);
    if (saved) return Number(saved);
    
    // Fallback or migrate from stats.timeOffsetDays
    const statsSaved = localStorage.getItem(STATS_STORAGE_KEY);
    if (statsSaved) {
      try {
        const parsed = JSON.parse(statsSaved);
        if (parsed.timeOffsetDays) {
          return parsed.timeOffsetDays * 24 * 60 * 60 * 1000;
        }
      } catch (e) {}
    }
    return 0;
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

  // Floating actionable toast alert state
  const [isSuccessActionAlert, setIsSuccessActionAlert] = useState<string | null>(null);

  // Persistence Effects

  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(EXT_LOG_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(ALGO_SETTINGS_STORAGE_KEY, JSON.stringify(algoSettings));
  }, [algoSettings]);

  useEffect(() => {
    localStorage.setItem(TIME_OFFSET_STORAGE_KEY, String(timeOffset));
  }, [timeOffset]);

  // --------- Helpers & Actions ---------
  const getVirtualTime = useCallback(() => {
    return getVirtualTimestamp(timeOffset);
  }, [timeOffset]);

  const triggerSuccessAlert = useCallback((message: string) => {
    setIsSuccessActionAlert(message);
    const id = setTimeout(() => {
      setIsSuccessActionAlert(null);
    }, 4000);
    return () => clearTimeout(id);
  }, []);

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
        const nextReviewAt = virtualNow + (1 * 24 * 60 * 60 * 1000);
        
        const newRecord: ProblemProgress = {
          problemId,
          solved: true,
          solvedAt: virtualNow,
          repetitions: 1,
          easeFactor: algoSettings.startingEase,
          interval: 1,
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
  }, [getVirtualTime, roadmap, addLog, algoSettings, triggerSuccessAlert]);

  const handleReviewCheckIn = useCallback((problemId: string, rating?: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    const virtualNow = getVirtualTime();

    setProgress(prev => {
      const current = prev[problemId];
      if (!current) return prev;

      const { repetitions: newRepetitions, interval: newInterval, easeFactor: newEaseFactor } = calculateSM2(
        rating,
        current.repetitions,
        current.interval,
        current.easeFactor,
        algoSettings
      );

      const nextReviewAt = virtualNow + (newInterval * 24 * 60 * 60 * 1000);

      const updatedRecord: ProblemProgress = {
        ...current,
        repetitions: newRepetitions,
        easeFactor: newEaseFactor,
        interval: newInterval,
        lastReviewedAt: virtualNow,
        nextReviewAt,
        history: [
          ...current.history,
          { action: 'reviewed', timestamp: virtualNow }
        ]
      };

      const targetProblem = roadmap.flatMap(t => t.problems).find(p => p.id === problemId);
      const masteryMsg = `Rating: ${rating || 'Good'}. Spaced repetition scheduled in ${newInterval} days (repetitions: ${newRepetitions}, EF: ${newEaseFactor.toFixed(2)}).`;

      addLog(
        targetProblem?.url || 'manual SRS',
        'matched',
        `Logged review check-in for '${targetProblem?.title || problemId}'. ${masteryMsg}`,
        targetProblem?.title
      );

      triggerSuccessAlert(`Logged review for "${targetProblem?.title || 'Problem'}" with ${rating || 'Good'}! Interval: ${newInterval}d`);

      return {
        ...prev,
        [problemId]: updatedRecord
      };
    });
  }, [getVirtualTime, roadmap, addLog, algoSettings, triggerSuccessAlert]);

  const handleExtensionPayload = useCallback((data: { url: string; timestamp?: number; rating?: 'Again' | 'Hard' | 'Good' | 'Easy' }) => {
    try {
      const safeData = {
        url: String(data?.url ?? ''),
        timestamp: data?.timestamp ? Number(data.timestamp) : undefined,
        rating: data?.rating
      };

      if (!safeData.url) {
        addLog('unknown', 'ignored', 'Extension sent blank or corrupt data.');
        return;
      }
      
      const virtualNow = getVirtualTime();
      const eventTime = safeData.timestamp || virtualNow;
      const urlSlug = extractLeetCodeSlug(safeData.url);
      
      if (!urlSlug) {
        addLog(safeData.url, 'no_match', 'Extension triggered: URL could not be parsed into a valid LeetCode slug.');
        return;
      }

      // ========== FIX #6: Use the slug index for O(1) lookup ==========
      const matchedProblem = slugProblemIndex.get(urlSlug);

      if (matchedProblem) {
        setProgress(prev => {
          const alreadyTracked = prev[matchedProblem.id];
          if (alreadyTracked && alreadyTracked.solved) {
            const { repetitions: newRepetitions, interval: newInterval, easeFactor: newEaseFactor } = calculateSM2(
              safeData.rating,
              alreadyTracked.repetitions,
              alreadyTracked.interval,
              alreadyTracked.easeFactor,
              algoSettings
            );

            const nextDue = eventTime + (newInterval * 24 * 60 * 60 * 1000);

            const updated: ProblemProgress = {
              ...alreadyTracked,
              repetitions: newRepetitions,
              easeFactor: newEaseFactor,
              interval: newInterval,
              lastReviewedAt: eventTime,
              nextReviewAt: nextDue,
              history: [
                ...alreadyTracked.history,
                { action: 'reviewed', timestamp: eventTime }
              ]
            };

            addLog(
              safeData.url,
              'matched',
              `Extension Auto-Review: Detected solve iteration for '${matchedProblem.title}'. Next review scheduled in ${newInterval} days (EF: ${newEaseFactor.toFixed(2)}).`,
              matchedProblem.title
            );

            triggerSuccessAlert(`Extension Auto-Review matched! Scheduled "${matchedProblem.title}" review in ${newInterval} days.`);
            return { ...prev, [matchedProblem.id]: updated };
          } else {
            const nextDue = eventTime + (1 * 24 * 60 * 60 * 1000);
            
            const newRecord: ProblemProgress = {
              problemId: matchedProblem.id,
              solved: true,
              solvedAt: eventTime,
              repetitions: 1,
              easeFactor: algoSettings.startingEase,
              interval: 1,
              lastReviewedAt: null,
              nextReviewAt: nextDue,
              history: [{ action: 'solved', timestamp: eventTime }]
            };

            addLog(
              safeData.url,
              'matched',
              `Extension auto-solve: Matched '${matchedProblem.title}'. Marked as solved! Next spaced review scheduled in 1 day.`,
              matchedProblem.title
            );

            triggerSuccessAlert(`Extension Auto-Solve! Resolved "${matchedProblem.title}" & added to 1d queue.`);
            return { ...prev, [matchedProblem.id]: newRecord };
          }
        });
      } else {
        const formattedTitle = urlSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const newCustomProblem: RoadmapProblem = {
          id: urlSlug,
          title: formattedTitle,
          url: safeData.url,
          difficulty: 'Medium',
          category: 'Custom Imports'
        };

        setCustomProblems(prev => {
          const updated = [...prev, newCustomProblem];
          localStorage.setItem('dsa_tracker_custom_problems_v1', JSON.stringify(updated));
          return updated;
        });

        setProgress(prev => {
          const nextDue = eventTime + (1 * 24 * 60 * 60 * 1000);
          
          const newRecord: ProblemProgress = {
            problemId: urlSlug,
            solved: true,
            solvedAt: eventTime,
            repetitions: 1,
            easeFactor: algoSettings.startingEase,
            interval: 1,
            lastReviewedAt: null,
            nextReviewAt: nextDue,
            history: [{ action: 'solved', timestamp: eventTime }]
          };

          addLog(
            safeData.url,
            'matched',
            `Extension Auto-Import: Problem '${formattedTitle}' was not in standard track. Dynamically appended to 'Custom Imports' and auto-solved!`,
            formattedTitle
          );

          triggerSuccessAlert(`Extension Custom Import! Created & solved "${formattedTitle}" dynamically!`);
          return { ...prev, [urlSlug]: newRecord };
        });
      }
    } catch (err: any) {
      console.error("handleExtensionPayload CRASHED:", err?.message, err?.stack);
    }
  }, [getVirtualTime, roadmap, addLog, algoSettings, triggerSuccessAlert, slugProblemIndex]);

  // Bind Custom Event Listener
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const raw = (e as CustomEvent).detail;
        const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
        console.log("leetcode:problem received:", payload);
        handleExtensionPayload(payload);
      } catch(err: any) {
        console.error("Event handler CRASHED:", err?.message);
      }
    };

    document.addEventListener("leetcode:problem", handler);
    return () => document.removeEventListener("leetcode:problem", handler);
  }, [handleExtensionPayload]);

  const handleAddCustomProblemFromData = useCallback((problemData: { title: string; url: string; topicId: string; difficulty: Difficulty }) => {
    const slug = extractLeetCodeSlug(problemData.url) || Math.random().toString(36).substring(4);
    
    const exists = roadmap.flatMap(t => t.problems).some(p => p.id === slug);
    if (exists) {
      alert("A problem with this URL/Slug already exists inside the database!");
      return false;
    }

    const readableCategoryMap: Record<string, string> = {
      'arrays-hashing': 'Arrays & Hashing',
      'two-pointers': 'Two Pointers',
      'sliding-window': 'Sliding Window',
      'stack': 'Stack',
      'binary-search': 'Binary Search',
      'linked-list': 'Linked List',
      'linked-lists': 'Linked Lists',
      'trees': 'Trees',
      'backtracking': 'Backtracking',
      'graphs': 'Graphs',
      'dynamic-programming': 'Dynamic Programming',
      'sorting': 'Sorting',
      'arrays': 'Arrays'
    };
    const categoryName = readableCategoryMap[problemData.topicId] || problemData.topicId;

    const newProblem: RoadmapProblem = {
      id: slug,
      title: problemData.title,
      url: problemData.url,
      difficulty: problemData.difficulty,
      category: categoryName
    };

    setCustomProblems(prev => {
      const updated = [...prev, newProblem];
      localStorage.setItem('dsa_tracker_custom_problems_v1', JSON.stringify(updated));
      return updated;
    });

    triggerSuccessAlert(`Custom problem "${problemData.title}" added to category list!`);
    return true;
  }, [roadmap, triggerSuccessAlert]);

  const handleRemoveCustomProblem = useCallback((topicId: string, problemId: string) => {
    if (!confirm("Are you sure you want to delete this problem from the roadmap tracking? All stored stats for it will be erased too.")) {
      return;
    }
    
    setCustomProblems(prev => {
      const updated = prev.filter(p => p.id !== problemId);
      localStorage.setItem('dsa_tracker_custom_problems_v1', JSON.stringify(updated));
      return updated;
    });

    setProgress(prev => {
      const updated = { ...prev };
      delete updated[problemId];
      return updated;
    });

    triggerSuccessAlert("Problem removed from track.");
  }, [triggerSuccessAlert]);

  const handleResetEntireTracker = useCallback(() => {
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
      setCustomProblems([]);
      localStorage.removeItem('dsa_tracker_custom_problems_v1');
      setSelectedRoadmapId('blind75');
      setTimeOffset(0);
      triggerSuccessAlert("Tracker states fully rejuvenated.");
    }
  }, [triggerSuccessAlert]);

  // ========== FIX #2 & #3: Single-pass statistics computation ==========
  const {
    totalProblemsCount,
    solvedProblemsCount,
    difficultyStats,
    topicProgressMap,
    categoryWeaknessStats,
    allProblemsFlat
  } = useMemo(() => {
    let total = 0;
    let solved = 0;
    const diffStats = {
      Easy: { solved: 0, total: 0 },
      Medium: { solved: 0, total: 0 },
      Hard: { solved: 0, total: 0 }
    };
    const topicMap: Record<string, { solved: number; total: number; percent: number }> = {};
    const weaknessStats: { topicId: string; topicName: string; averageEase: number; totalTracked: number; iconName: string }[] = [];
    const problems: LeetCodeProblem[] = [];

    // Single iteration through roadmap
    roadmap.forEach(topic => {
      let topicSolved = 0;
      let topicTotal = 0;
      let topicSumEase = 0;
      let topicTrackedCount = 0;

      topic.problems.forEach(prob => {
        total++;
        topicTotal++;
        problems.push(prob);

        const prog = progress[prob.id];
        const isSolved = prog?.solved ?? false;

        if (isSolved) {
          solved++;
          topicSolved++;
        }

        // Difficulty stats
        const diff = prob.difficulty as keyof typeof diffStats;
        if (diffStats[diff]) {
          diffStats[diff].total += 1;
          if (isSolved) {
            diffStats[diff].solved += 1;
          }
        }

        // Weakness tracking
        if (isSolved && prog) {
          topicSumEase += prog.easeFactor;
          topicTrackedCount++;
        }
      });

      // Compute topic progress
      const topicPercent = topicTotal > 0 ? Math.round((topicSolved / topicTotal) * 100) : 0;
      topicMap[topic.id] = { solved: topicSolved, total: topicTotal, percent: topicPercent };

      // Add to weakness stats if tracked
      if (topicTrackedCount > 0) {
        weaknessStats.push({
          topicId: topic.id,
          topicName: topic.name,
          averageEase: topicSumEase / topicTrackedCount,
          totalTracked: topicTrackedCount,
          iconName: topic.iconName
        });
      }
    });

    weaknessStats.sort((a, b) => a.averageEase - b.averageEase);

    return {
      totalProblemsCount: total,
      solvedProblemsCount: solved,
      difficultyStats: diffStats,
      topicProgressMap: topicMap,
      categoryWeaknessStats: weaknessStats,
      allProblemsFlat: problems
    };
  }, [roadmap, progress]);

  const completionPercentage = useMemo(() => {
    if (totalProblemsCount === 0) return 0;
    return Math.round((solvedProblemsCount / totalProblemsCount) * 100);
  }, [totalProblemsCount, solvedProblemsCount]);

  const solvedTodayCount = useMemo(() => {
    const virtualNow = getVirtualTime();
    const startOfVirtualToday = new Date(virtualNow);
    startOfVirtualToday.setHours(0, 0, 0, 0);
    const startOfVirtualTodayMs = startOfVirtualToday.getTime();

    return Object.values(progress).filter(p => {
      if (!p.solved || !p.solvedAt) return false;
      const hasActivityToday = p.history.some(h => h.timestamp >= startOfVirtualTodayMs && h.timestamp <= virtualNow);
      return hasActivityToday;
    }).length;
  }, [progress, getVirtualTime]);

  // ========== FIX #4 & #5: Optimized heatmap and streak calculations ==========
  const { streaks, contributionCounts, cachedLastVirtualDay } = useMemo(() => {
    const virtualNow = getVirtualTime();
    const todayDate = new Date(virtualNow);
    todayDate.setHours(0, 0, 0, 0);
    const cachedDay = todayDate.getTime();

    const counts: Record<string, number> = {};
    const dateSet = new Set<string>();

    Object.values(progress).forEach((p: ProblemProgress) => {
      if (p.history) {
        p.history.forEach((h) => {
          const dateString = toDateString(h.timestamp);
          counts[dateString] = (counts[dateString] || 0) + 1;
          dateSet.add(dateString);
        });
      }
    });

    const sortedDates = Array.from(dateSet).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    let currentStreak = 0;
    let maxStreak = 0;

    const getVirtualDateString = (dayOffset: number) => {
      const d = new Date(virtualNow + (dayOffset * 24 * 60 * 60 * 1000));
      return d.toISOString().split('T')[0];
    };

    const todayStr = getVirtualDateString(0);
    const yesterdayStr = getVirtualDateString(-1);

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

    if (sortedDates.length > 0) {
      let tempStreak = 1;
      const sortedTs = sortedDates.map(d => new Date(d).getTime()).sort((a, b) => a - b);
      let localMax = 1;

      for (let i = 1; i < sortedTs.length; i++) {
        const diffDays = (sortedTs[i] - sortedTs[i-1]) / (24 * 60 * 60 * 1000);
        if (diffDays <= 1.1 && diffDays >= 0.9) {
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

    maxStreak = Math.max(maxStreak, currentStreak);

    return {
      streaks: {
        currentStreak,
        maxStreak,
        activityDates: sortedDates
      },
      contributionCounts: counts,
      cachedLastVirtualDay: cachedDay
    };
  }, [progress, getVirtualTime]);

  // ========== FIX #4: Cache heatmap only on day boundary ==========
  const { contributionDays, contributionWeeks } = useMemo(() => {
    const virtualNow = getVirtualTime();
    const list = [];

    // Generate precisely 91 days (13 weeks of 7-day columns)
    for (let dayOffset = -90; dayOffset <= 0; dayOffset++) {
      const ms = virtualNow + (dayOffset * 24 * 60 * 60 * 1000);
      const d = new Date(ms);
      const dateString = toDateString(d);
      const count = contributionCounts[dateString] || 0;
      
      list.push({
        date: d,
        dateString,
        count
      });
    }

    const weeksList = [];
    for (let i = 0; i < list.length; i += 7) {
      weeksList.push(list.slice(i, i + 7));
    }

    return {
      contributionDays: list,
      contributionWeeks: weeksList
    };
  }, [contributionCounts, getVirtualTime]);

  const spacedRepetitionQueue = useMemo(() => {
    const virtualNow = getVirtualTime();
    const list: { problem: LeetCodeProblem; progress: ProblemProgress; daysUntilDue: number }[] = [];

    // Use the flattened problems array instead of nested roadmap
    allProblemsFlat.forEach(prob => {
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

    return list.sort((a, b) => (a.progress.nextReviewAt || 0) - (b.progress.nextReviewAt || 0));
  }, [allProblemsFlat, progress, getVirtualTime]);

  const completedReviewSessionsCount = useMemo(() => {
    return Object.values(progress).reduce((sum, p) => {
      return sum + p.history.filter(h => h.action === 'reviewed').length;
    }, 0);
  }, [progress]);

  return {
    roadmap,
    setRoadmap,
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
    isSuccessActionAlert,
    setIsSuccessActionAlert,
    
    // Virtual Clocks & Logging Actions
    getVirtualTime,
    addLog,
    triggerSuccessAlert,
    
    // Core Actions
    handleToggleSolve,
    handleReviewCheckIn,
    handleExtensionPayload,
    handleAddCustomProblemFromData,
    handleRemoveCustomProblem,
    handleResetEntireTracker,
    
    // Stats Engine
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
  };
}
