/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface LeetCodeProblem {
  id: string;
  title: string;
  url: string;
  difficulty: Difficulty;
  topicId: string;
}

export interface DSATopic {
  id: string;
  name: string;
  iconName: string; // lucide icon identifier
  description: string;
  problems: LeetCodeProblem[];
}

export interface ProblemHistoryEntry {
  action: 'solved' | 'reviewed';
  timestamp: number;
  simulatedOffset?: number; // debug aid
}

export interface ProblemProgress {
  problemId: string;
  solved: boolean;
  solvedAt: number | null; // Timestamp
  repetitions: number;
  easeFactor: number;
  interval: number;
  lastReviewedAt: number | null; // Timestamp
  nextReviewAt: number | null; // Timestamp representing when it is due
  history: ProblemHistoryEntry[];
}

export interface ExtensionLogEntry {
  id: string;
  timestamp: number;
  url: string;
  status: 'matched' | 'no_match' | 'ignored';
  matchedProblemTitle?: string;
  message: string;
}

export interface UserStats {
  dailyGoal: number; // Number of problems targeted per day
  timeOffsetDays: number; // Debug offset in days to simulate time passage
}

export interface AlgoSettings {
  startingEase: number;
  maxInterval: number;
  hardModifier: number;
  easyBonus: number;
}

export interface RoadmapProblem {
  id: string; // url slug
  title: string;
  difficulty: Difficulty;
  category: string; // topic name (e.g. 'Arrays & Hashing', 'Linked Lists')
  url: string;
}

export interface CuratedRoadmap {
  id: string; // 'blind75', 'neetcode150', 'dsa-fundamentals'
  name: string;
  description: string;
  problems: RoadmapProblem[];
}

