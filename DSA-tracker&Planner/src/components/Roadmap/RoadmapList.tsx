// src/components/Roadmap/RoadmapList.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  PlusCircle, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Clock, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { DSATopic, ProblemProgress, Difficulty } from '../../types';
import { renderTopicIcon } from '../../utils/icons';
import { CURATED_ROADMAPS } from '../../data/roadmaps';

interface RoadmapListProps {
  roadmap: DSATopic[];
  progress: Record<string, ProblemProgress>;
  topicProgressMap: Record<string, { solved: number; total: number; percent: number }>;
  handleToggleSolve: (problemId: string) => void;
  handleReviewCheckIn: (problemId: string, rating?: 'Again' | 'Hard' | 'Good' | 'Easy') => void;
  handleAddCustomProblemFromData: (problemData: { title: string; url: string; topicId: string; difficulty: Difficulty }) => boolean;
  handleRemoveCustomProblem: (topicId: string, problemId: string) => void;
  selectedRoadmapId: string;
  setSelectedRoadmapId: (id: string) => void;
}

export const RoadmapList: React.FC<RoadmapListProps> = ({
  roadmap,
  progress,
  topicProgressMap,
  handleToggleSolve,
  handleReviewCheckIn,
  handleAddCustomProblemFromData,
  handleRemoveCustomProblem,
  selectedRoadmapId,
  setSelectedRoadmapId
}) => {
  // --- UI States Local to Roadmap Track ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('All');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>('arrays-hashing');

  // Input states for custom injection
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customDifficulty, setCustomDifficulty] = useState<Difficulty>('Medium');
  const [customTopicId, setCustomTopicId] = useState(roadmap[0]?.id || 'arrays-hashing');

  // Manual Form Submission
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customUrl.trim()) return;

    const success = handleAddCustomProblemFromData({
      title: customTitle,
      url: customUrl,
      topicId: customTopicId,
      difficulty: customDifficulty
    });

    if (success) {
      // Reset & close modal
      setCustomTitle('');
      setCustomUrl('');
      setIsAddingQuestion(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      id="roadmap-tab-view"
    >
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#101421] border border-white/[0.05] rounded-2xl">
        
        <div className="flex flex-wrap items-center gap-4 flex-grow max-w-2xl">
          {/* Curated Roadmap Selection */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium font-sans whitespace-nowrap">Active Syllabi:</span>
            <select 
              value={selectedRoadmapId}
              onChange={(e) => {
                setSelectedRoadmapId(e.target.value);
                setSearchQuery('');
                // Find first topic of new roadmap and expand it
                const sel = CURATED_ROADMAPS.find(r => r.id === e.target.value);
                if (sel && sel.problems.length > 0) {
                  const firstSlug = sel.problems[0].category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  setExpandedTopic(firstSlug);
                }
              }}
              className="bg-[#090b10] border border-white/[0.05] text-xs font-semibold text-teal-400 font-sans rounded-lg p-1.5 focus:outline-none focus:border-teal-500/40 cursor-pointer"
            >
              {CURATED_ROADMAPS.map(r => (
                <option key={r.id} value={r.id} className="text-slate-300 bg-[#090b10]">{r.name}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090b10] border border-white/[0.05] focus:outline-none focus:border-teal-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 flex items-center justify-center bg-transparent border-none cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium font-sans">Difficulty:</span>
            <select 
              value={selectedDifficultyFilter}
              onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
              className="bg-[#090b10] border border-white/[0.05] text-xs text-slate-300 rounded-lg p-1.5 focus:outline-none focus:border-teal-500/40 cursor-pointer"
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
            className="px-3.5 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-xl text-xs font-semibold border border-teal-500/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <PlusCircle size={15} />
            Add Custom Problem
          </button>
        </div>

      </div>

      {/* Custom Question Modal (Overlay on top of dashboard) */}
      <AnimatePresence>
        {isAddingQuestion && (
          <div className="fixed inset-0 bg-[#090b10]/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
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

              <form onSubmit={onFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Problem Title</label>
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
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">LeetCode URL / Slug</label>
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
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Topic Syllabus</label>
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
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Difficulty</label>
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
                    className="px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
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
                className="w-full p-5 flex flex-wrap items-center justify-between gap-4 text-left/right bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 border border-white/5 rounded-lg text-teal-400 flex items-center justify-center">
                    {renderTopicIcon(topic.iconName, 18)}
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
                      <div className="h-full bg-teal-400 transition-all duration-500" style={{ width: `${progressStats.percent}%` }}></div>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={18} className="text-slate-400 flex items-center justify-center" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 flex items-center justify-center" />
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
                              className="p-1 text-slate-400 hover:text-white transition flex items-center justify-center"
                              title={isSolved ? "Mark unsolved" : "Mark completed"}
                            >
                              {isSolved ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/10" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                              )}
                            </button>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-semibold ${isSolved ? 'text-emerald-100 line-through decoration-emerald-800' : 'text-slate-200'}`}>
                                  {prob.title}
                                </span>
                                
                                {/* Direct Leetcode target link */}
                                <a 
                                  href={prob.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-slate-500 hover:text-teal-400 p-0.5 transition flex items-center justify-center"
                                  title="Open External LeetCode URL"
                                >
                                  <ExternalLink size={12} />
                                </a>
                              </div>

                              {/* Spaced Repetition Tags under Problems */}
                              {isSolved && progRecord && (
                                <div className="mt-1 space-y-1.5">
                                  <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-[9px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                                      Solved
                                    </span>
                                    {progRecord.nextReviewAt ? (
                                      <span className="text-[9px] text-slate-400 font-mono bg-slate-900 border border-white/5 px-1.5 py-0.2 rounded flex items-center gap-1">
                                        <Clock size={10} className="text-teal-400" />
                                        Interval: {progRecord.interval}d (Reps: {progRecord.repetitions}, EF: {progRecord.easeFactor.toFixed(2)})
                                      </span>
                                    ) : (
                                      <span className="text-[9px] text-teal-400 font-mono bg-teal-500/5 border border-teal-500/10 px-1.5 py-0.2 rounded flex items-center gap-1 font-bold">
                                        🌟 Mastered Fully
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                    <span className="text-[9px] text-slate-500 uppercase font-mono mr-1">Re-rate:</span>
                                    <button
                                      onClick={() => handleReviewCheckIn(prob.id, 'Again')}
                                      className="px-1.5 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 rounded text-[9px] font-bold transition cursor-pointer"
                                      title="Rate Again"
                                    >
                                      Again
                                    </button>
                                    <button
                                      onClick={() => handleReviewCheckIn(prob.id, 'Hard')}
                                      className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 rounded text-[9px] font-bold transition cursor-pointer"
                                      title="Rate Hard"
                                    >
                                      Hard
                                    </button>
                                    <button
                                      onClick={() => handleReviewCheckIn(prob.id, 'Good')}
                                      className="px-1.5 py-0.5 bg-[#121f24] hover:bg-[#16272e] border border-teal-500/20 text-teal-300 rounded text-[9px] font-bold transition cursor-pointer"
                                      title="Rate Good"
                                    >
                                      Good
                                    </button>
                                    <button
                                      onClick={() => handleReviewCheckIn(prob.id, 'Easy')}
                                      className="px-1.5 py-0.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 text-blue-300 rounded text-[9px] font-bold transition cursor-pointer"
                                      title="Rate Easy"
                                    >
                                      Easy
                                    </button>
                                  </div>
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
                            {!CURATED_ROADMAPS.flatMap(r => r.problems).some(p => p.id === prob.id) && (
                              <button 
                                onClick={() => handleRemoveCustomProblem(topic.id, prob.id)}
                                className="p-1 hover:bg-rose-500/15 text-slate-500 hover:text-rose-400 rounded transition cursor-pointer flex items-center justify-center"
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
        <div className="text-center py-12 p-8 bg-[#101421] border border-white/[0.04] rounded-2xl flex flex-col items-center justify-center">
          <AlertCircle className="w-8 h-8 text-slate-500 mb-3" />
          <h4 className="text-xs font-semibold text-white">No roadmap items matched your filters.</h4>
          <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or difficulty settings!</p>
        </div>
      )}

    </motion.div>
  );
};
