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

export interface ProblemProgress {
  problemId: string;
  solved: boolean;
  solvedAt: number | null; // Timestamp
  intervals: number[]; // e.g. [1, 3, 7]
  intervalIndex: number; // current active index in intervals (0 = 1 day, 1 = 3 days, 2 = 7 days, 3 = fully Mastered)
  lastReviewedAt: number | null; // Timestamp
  nextReviewAt: number | null; // Timestamp representing when it is due
  history: {
    action: 'solved' | 'reviewed';
    timestamp: number;
    simulatedOffset?: number; // debug aid
  }[];
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
