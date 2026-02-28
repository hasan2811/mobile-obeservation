import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardList, ChevronLeft, ChevronRight, WifiOff, RefreshCw, Clock } from 'lucide-react';
import ObservationCard from '../components/ObservationCard';

const ITEMS_PER_PAGE = 5;

// Empty State Component
const EmptyTaskState = () => (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="relative mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/20 shadow-inner">
                <ClipboardList size={48} className="text-emerald-400 opacity-60" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-[var(--bg-card)]">
                <span className="text-white text-sm font-black">✓</span>
            </div>
        </div>
        <h3 className="text-[var(--text-primary)] text-base font-black uppercase tracking-tight mb-2">
            All Clear! 🎉
        </h3>
        <p className="text-[11px] text-[var(--text-secondary)] font-medium text-center max-w-[220px] leading-relaxed opacity-60">
            No pending tasks assigned to you. You're good!
        </p>
        <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Status: Clear</span>
        </div>
    </div>
);

// Offline Queue Banner
const OfflineQueueBanner = ({ queue, onRetry, isOnline }) => {
    if (queue.length === 0) return null;
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border mb-4 ${isOnline ? 'bg-blue-500/10 border-blue-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
            {isOnline ? (
                <RefreshCw size={16} className="text-blue-400 animate-spin shrink-0" />
            ) : (
                <WifiOff size={16} className="text-amber-400 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wide">
                    {isOnline ? 'Syncing...' : 'Offline Mode'}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)] opacity-70">
                    {queue.length} report(s) pending sync
                </p>
            </div>
            {isOnline && (
                <button onClick={onRetry} className="text-[10px] font-black text-blue-400 uppercase tracking-wider px-3 py-1.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    Sync
                </button>
            )}
        </div>
    );
};

const Tasks = ({ tasks, onTakeAction, offlineQueue = [], isOnline = true, onRetryQueue }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedTasks = tasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 when tasks change
    useEffect(() => {
        setCurrentPage(1);
    }, [tasks.length]);

    return (
        <div className="p-5 pb-6 animate-fade-in text-[var(--text-primary)] min-h-screen transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-2.5">
                        <ClipboardList className="text-blue-500" size={24} />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 tracking-tight">My Tasks</span>
                    </h2>
                    <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-50 mt-0.5">
                        {tasks.length} active task{tasks.length !== 1 ? 's' : ''}
                    </p>
                </div>
                {!isOnline && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <WifiOff size={12} className="text-amber-400" />
                        <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Offline</span>
                    </div>
                )}
            </div>

            {/* Offline Queue Banner */}
            <OfflineQueueBanner queue={offlineQueue} onRetry={onRetryQueue} isOnline={isOnline} />

            {tasks.length === 0 ? (
                <EmptyTaskState />
            ) : (
                <>
                    {/* Priority indicator */}
                    {tasks.filter(t => t.status === 'Open').length > 0 && (
                        <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-red-500/5 border border-red-500/15 rounded-2xl">
                            <Clock size={14} className="text-red-400" />
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">
                                {tasks.filter(t => t.status === 'Open').length} need immediate action!
                            </span>
                        </div>
                    )}

                    <div className="space-y-4">
                        {paginatedTasks.map(obs => (
                            <ObservationCard
                                key={obs.id}
                                obs={obs}
                                isAssignee={true}
                                onTakeAction={onTakeAction}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-color)]">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-all disabled:opacity-20 active:scale-95 shadow-sm"
                            >
                                <ChevronLeft size={16} /> Prev
                            </button>
                            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-all disabled:opacity-20 active:scale-95 shadow-sm"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Tasks;
