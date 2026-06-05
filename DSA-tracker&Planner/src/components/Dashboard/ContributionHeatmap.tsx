// src/components/Dashboard/ContributionHeatmap.tsx

import React from 'react';
import { Grid, Calendar } from 'lucide-react';

interface HeatmapDay {
  date: Date;
  dateString: string;
  count: number;
}

interface ContributionHeatmapProps {
  contributionWeeks: HeatmapDay[][];
  completedReviewSessionsCount: number;
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  contributionWeeks,
  completedReviewSessionsCount
}) => {
  return (
    <div className="lg:col-span-7 bg-[#101421] border border-white/[0.05] p-6 rounded-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Grid className="w-4 h-4 text-emerald-400" />
            91-Day Contribution Matrix
          </h3>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">
            GitHub-Style
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Visualizing solutions & check-ins completed in the last 91 days.
        </p>
        
        {/* Heatmap Grid Wrapper for responsive layout */}
        <div className="mt-5 overflow-auto max-w-full">
          <div className="flex items-start gap-2 min-w-[340px]">
            {/* Day of week labels */}
            <div className="flex flex-col gap-1 pt-0.5 text-center text-[9px] font-bold text-slate-500 font-mono w-5">
              <span className="h-[22px] flex items-center justify-center">S</span>
              <span className="h-[22px] flex items-center justify-center">M</span>
              <span className="h-[22px] flex items-center justify-center">T</span>
              <span className="h-[22px] flex items-center justify-center text-indigo-400 animate-pulse">W</span>
              <span className="h-[22px] flex items-center justify-center">T</span>
              <span className="h-[22px] flex items-center justify-center">F</span>
              <span className="h-[22px] flex items-center justify-center">S</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-1">
              {contributionWeeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((item) => {
                    let cellBg = 'bg-[#090b10] border-white/[0.03] text-slate-600 hover:border-slate-700';
                    let countText = 'No active check-ins';
                    
                    if (item.count === 1) {
                      cellBg = 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400/80 hover:bg-emerald-900/40 font-semibold';
                      countText = '1 session completed';
                    } else if (item.count === 2) {
                      cellBg = 'bg-emerald-800/25 border-emerald-500/35 text-emerald-300 hover:bg-emerald-800/35 font-semibold';
                      countText = '2 sessions completed';
                    } else if (item.count >= 3) {
                      cellBg = 'bg-gradient-to-br from-emerald-500/35 to-teal-400/35 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.25)] text-emerald-100 hover:from-emerald-500/45 hover:to-teal-400/45 font-bold';
                      countText = `${item.count} sessions completed`;
                    }

                    const formattedDateLabel = item.date.toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <div key={item.dateString} className="group relative cursor-pointer font-mono">
                        <div 
                          className={`w-[22px] h-[22px] rounded-sm border flex items-center justify-center text-[9px] transition-all duration-300 ${cellBg}`}
                        >
                          {item.date.getDate()}
                        </div>
                        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#090b10] border border-white/[0.12] text-[10px] px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap z-50 text-slate-200">
                          <span className="font-semibold text-slate-300">{formattedDateLabel}</span>
                          <div className="w-full h-[1px] bg-white/[0.05] my-1"></div>
                          <span className="text-teal-400 font-semibold">{countText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="mt-4 pt-4 border-t border-white/[0.03] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Less</span>
            <div className="w-[14px] h-[14px] rounded-sm bg-[#090b10] border border-white/[0.03]"></div>
            <div className="w-[14px] h-[14px] rounded-sm bg-emerald-950/40 border border-emerald-500/20"></div>
            <div className="w-[14px] h-[14px] rounded-sm bg-emerald-800/25 border border-emerald-500/35"></div>
            <div className="w-[14px] h-[14px] rounded-sm bg-gradient-to-br from-emerald-500/35 to-teal-400/35 border border-emerald-500/50"></div>
            <span>More</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">91 Days Activity Canvas</span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-[#090b10]/60 rounded-xl border border-white/[0.03] flex items-start gap-3">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 flex items-center justify-center">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-200">Consistency Breeds Mastery</h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Every code submit and manual SRS rating logged is permanently captured in your grid representation. Aim for green checks daily.
          </p>
        </div>
      </div>
    </div>
  );
};
