import React from 'react';
import { ArrowRight, List, ChevronRight, Check, Star } from 'lucide-react';
import ActionStory from './ActionStory';

const ObservationCard = ({ obs, isAssignee, isCreator, onTakeAction, onReview, showFull = false }) => {
    const statusColor = {
        'Open': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'Pending': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        'Closed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    }[obs.status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

    const creatorName = obs.creatorName || 'Unknown';
    const assigneeName = obs.assigneeName || 'Unassigned';

    return (
        <div className="glass-panel rounded-2xl p-4 mb-4 shadow-xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md transition-colors duration-300">
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                    {obs.status}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                    {obs.history && obs.history[0] ? obs.history[0].timestamp : ''}
                </span>
            </div>

            <h3 className="font-bold text-lg text-[var(--text-primary)] mb-1 leading-tight">{obs.title}</h3>
            <p className={`text-sm text-[var(--text-secondary)] mb-4 leading-relaxed ${showFull ? '' : 'line-clamp-2'}`}>{obs.description}</p>

            {showFull && obs.recommendation && (
                <div className="mb-4 bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 animate-fade-in">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Recommendation Action</p>
                    <p className="text-sm text-[var(--text-primary)] italic font-medium opacity-90">"{obs.recommendation}"</p>
                </div>
            )}

            <div className="flex justify-between items-center bg-[var(--bg-main)] p-2.5 rounded-xl mb-4 border border-[var(--border-color)]">

                <div className="flex items-center gap-2">
                    <div className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-tighter">From</div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                            {creatorName[0]}
                        </span>
                        <span className="text-xs text-[var(--text-primary)] font-bold opacity-80">{creatorName}</span>
                    </div>
                </div>
                <ArrowRight size={12} className="text-[var(--text-secondary)] opacity-50" />
                <div className="flex items-center gap-2">
                    <div className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-tighter">To</div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                            {assigneeName[0]}
                        </span>
                        <span className="text-xs text-[var(--text-primary)] font-bold opacity-80">{assigneeName}</span>
                    </div>
                </div>
            </div>

            <details className="group">
                <summary className="flex items-center gap-2 text-xs text-blue-500 font-bold cursor-pointer mb-3 select-none list-none uppercase tracking-wider">
                    <List size={14} /> View Action Story
                    <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                </summary>
                <div className="pb-2">
                    <ActionStory history={obs.history} />
                </div>
            </details>


            <div className="flex gap-2 mt-2">
                {isAssignee && obs.status === 'Open' && (
                    <button
                        onClick={() => onTakeAction(obs.id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={16} /> Take Action
                    </button>
                )}
                {isCreator && obs.status === 'Pending' && (
                    <button
                        onClick={() => onReview(obs.id)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-2 rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Star size={16} /> Review
                    </button>
                )}
                {obs.status === 'Closed' && (
                    <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-default">
                        <Check size={16} /> Completed
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObservationCard;
