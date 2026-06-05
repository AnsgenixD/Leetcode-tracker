// src/components/Dashboard/WeaknessAnalytics.tsx

import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { renderTopicIcon } from '../../utils/icons';

interface WeaknessItem {
  topicId: string;
  topicName: string;
  averageEase: number;
  totalTracked: number;
  iconName: string;
}

interface WeaknessAnalyticsProps {
  categoryWeaknessStats: WeaknessItem[];
}

export const WeaknessAnalytics: React.FC<WeaknessAnalyticsProps> = ({
  categoryWeaknessStats
}) => {
  return (
    <div id="category-weakness-radar" className="bg-[#101421] border border-white/[0.05] p-6 rounded-2xl relative overflow-hidden space-y-5">
      <div className="absolute right-0 top-0 translate-x-5 -translate-y-5 p-10 bg-rose-500/5 rounded-full blur-3xl"></div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-400 rotate-180" />
            Syllabus Category Weakness Radar
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Ranks your active DSA chapters by their Average Ease Factor (lowest ease = weakest retention).
          </p>
        </div>
        
        {categoryWeaknessStats.length > 0 && (
          <span className="text-[11px] text-slate-300 bg-slate-900 border border-white/5 px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Weakest: <strong className="text-rose-400">{categoryWeaknessStats[0].topicName}</strong>
          </span>
        )}
      </div>

      {categoryWeaknessStats.length === 0 ? (
        <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-white/[0.02] text-slate-500 italic text-[11px]">
          <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2.5 flex items-center justify-center" />
          No spaced repetition data indexed yet. Keep solving standard roadmap questions or rate them from the roadmap logs to compile memory analytics!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {categoryWeaknessStats.map((item, idx) => {
            const requiresStudy = item.averageEase < 1.5;
            // Ease Factor scale from 1.30 to 3.00
            const normalizedPercentage = Math.min(100, Math.max(8, ((item.averageEase - 1.3) / (3.0 - 1.3)) * 100));
            
            let barColor = 'bg-teal-400';
            let badgeColor = 'bg-teal-500/10 text-teal-300 border border-teal-500/20';
            
            if (requiresStudy) {
              barColor = 'bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.3)] animate-pulse';
              badgeColor = 'bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold';
            } else if (item.averageEase < 2.0) {
              barColor = 'bg-gradient-to-r from-amber-500 to-yellow-400';
              badgeColor = 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
            }

            return (
              <div key={item.topicId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#090b10]/60 border border-white/[0.03] rounded-xl hover:border-white/[0.06] transition duration-200">
                <div className="flex items-center gap-3 w-full sm:w-1/3">
                  <div className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-400 flex items-center justify-center">
                    {renderTopicIcon(item.iconName, 14)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-white leading-none">
                        {item.topicName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({item.totalTracked} solved)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                      Rank <span className="text-rose-400">#{idx + 1}</span> Weakest Retention
                    </div>
                  </div>
                </div>

                {/* Horizontal Bar Visualizer */}
                <div className="flex-grow flex items-center gap-4 w-full sm:w-2/3">
                  <div className="flex-grow">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                      <span>Avg Ease Factor: <strong className="text-white font-bold">{item.averageEase.toFixed(2)}</strong></span>
                      <span className="text-[9px] text-slate-500">Scale: 1.30 (Weakest) → 3.00+</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} transition-all duration-1000`} 
                        style={{ width: `${normalizedPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="min-w-[120px] text-right flex justify-end">
                    {requiresStudy ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 ${badgeColor}`}>
                        <AlertCircle size={10} className="text-rose-400" />
                        Requires Study!
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[10px] ${badgeColor}`}>
                        Stable Memory
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
