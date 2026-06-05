// src/components/Dashboard/DailyQueue.tsx

import React from 'react';
import { motion } from 'motion/react';
import { Activity, CheckCircle2, Flame, ExternalLink, AlertCircle } from 'lucide-react';
import { LeetCodeProblem, ProblemProgress, AlgoSettings, DSATopic } from '../../types';

interface QueueItem {
  problem: LeetCodeProblem;
  progress: ProblemProgress;
  daysUntilDue: number;
}

interface DailyQueueProps {
  spacedRepetitionQueue: QueueItem[];
  handleReviewCheckIn: (problemId: string, rating: 'Again' | 'Hard' | 'Good' | 'Easy') => void;
  algoSettings: AlgoSettings;
  roadmap: DSATopic[];
  setActiveTab: (tab: string) => void;
}

export const DailyQueue: React.FC<DailyQueueProps> = ({
  spacedRepetitionQueue,
  handleReviewCheckIn,
  algoSettings,
  roadmap,
  setActiveTab
}) => {
  return (
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
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Spaced Repetition Review Queue</h2>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Spaced repetition helps you retain coding solutions by reviewing them periodically. This system tracks solved items that have hit their scheduled review date using the SM-2 algorithm. Keep your memory sharp by completing reviews on time under the Daily Due Queue.
            </p>
          </div>
        </div>
      </div>

      {/* Main queue area */}
      <div className="space-y-3">
        {spacedRepetitionQueue.length === 0 ? (
          <div className="text-center py-12 p-8 bg-[#101421] border border-white/[0.04] rounded-2xl space-y-4">
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-full w-fit mx-auto text-emerald-400 flex items-center justify-center">
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
              className="px-4 py-1.5 bg-[#090b10] hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-white/[0.04] cursor-pointer"
            >
              View Roadmap Track
            </button>
          </div>
        ) : (
          spacedRepetitionQueue.map(({ problem, progress: progRecord }) => {
            const currentIntervalDays = progRecord.interval;
            const categoryName = roadmap.find(t => t.id === problem.topicId)?.name || "DSA Category";
            
            return (
              <div 
                key={problem.id}
                className="bg-[#101421] border border-rose-500/15 hover:border-rose-500/25 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/5 text-rose-400 border border-rose-500/10 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{problem.title}</span>
                      <a 
                        href={problem.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-teal-400 transition flex items-center justify-center"
                      >
                        <ExternalLink size={11} />
                      </a>
                      <span className="text-[10px] bg-slate-900 border border-white/5 text-slate-400 px-2 py-0.2 rounded">
                        {categoryName}
                      </span>
                    </div>

                    {/* Scheduling statuses */}
                    <div className="flex items-center gap-4 mt-1.5 text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1 font-semibold text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                        <AlertCircle size={10} />
                        Review Due Now ({currentIntervalDays}d Cycle)
                      </span>
                      <span>Solved: {new Date(progRecord.solvedAt || 0).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Prominent Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-slate-500 uppercase font-mono mr-1 hidden sm:inline">Self-Rate Problem:</span>
                  <button
                    onClick={() => handleReviewCheckIn(problem.id, 'Again')}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl transition cursor-pointer"
                    title="Again (Reset progress, review in 1 day)"
                  >
                    Again
                  </button>
                  <button
                    onClick={() => handleReviewCheckIn(problem.id, 'Hard')}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl transition cursor-pointer"
                    title={`Hard (Scale interval x${algoSettings.hardModifier})`}
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => handleReviewCheckIn(problem.id, 'Good')}
                    className="px-3 py-1.5 bg-[#121f24] hover:bg-[#16272e] border border-teal-500/25 text-teal-300 text-xs font-bold rounded-xl transition cursor-pointer"
                    title="Good (Standard SM-2 interval increase)"
                  >
                    Good
                  </button>
                  <button
                    onClick={() => handleReviewCheckIn(problem.id, 'Easy')}
                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-xl transition cursor-pointer"
                    title={`Easy (Scale interval x${algoSettings.easyBonus})`}
                  >
                    Easy
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </motion.div>
  );
};
