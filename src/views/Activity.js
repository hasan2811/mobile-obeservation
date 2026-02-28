import React, { useState, useEffect } from 'react';
import { FileText, ChevronLeft, ChevronRight, PlusCircle, Star } from 'lucide-react';
import ObservationCard from '../components/ObservationCard';

const ITEMS_PER_PAGE = 5;

const EmptyActivityState = () => (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="relative mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-[2.5rem] flex items-center justify-center border border-purple-500/20 shadow-inner">
                <FileText size={48} className="text-purple-400 opacity-60" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 border-2 border-[var(--bg-card)]">
                <PlusCircle size={16} className="text-white" />
            </div>
        </div>
        <h3 className="text-[var(--text-primary)] text-base font-black uppercase tracking-tight mb-2 text-center">
            No Reports Yet
        </h3>
        <p className="text-[11px] text-[var(--text-secondary)] font-medium text-center max-w-[220px] leading-relaxed opacity-60 mb-6">
            You haven't created any observation reports. Be an HSE Champion today!
        </p>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-purple-400 opacity-70">
            <Star size={12} className="fill-purple-400" />
            Tap the + button below to get started
            <Star size={12} className="fill-purple-400" />
        </div>
    </div>
);

const Activity = ({ activity, onReview }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(activity.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedActivity = activity.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Summary counters
    const openCount = activity.filter(a => a.status === 'Open').length;
    const pendingCount = activity.filter(a => a.status === 'Pending').length;
    const closedCount = activity.filter(a => a.status === 'Closed').length;

    useEffect(() => {
        setCurrentPage(1);
    }, [activity.length]);

    return (
        <div className="p-5 pb-6 animate-fade-in text-[var(--text-primary)] min-h-screen transition-colors duration-300">
            <div className="mb-6">
                <h2 className="text-2xl font-black flex items-center gap-2.5 mb-1">
                    <FileText className="text-purple-500" size={24} />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500 tracking-tight">My Reports</span>
                </h2>
                <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-50">
                    {activity.length} report{activity.length !== 1 ? 's' : ''} total
                </p>
            </div>

            {/* Mini Summary Bar */}
            {activity.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3 text-center">
                        <p className="text-xl font-black text-blue-400">{openCount}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-blue-400 opacity-70">Open</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-center">
                        <p className="text-xl font-black text-amber-400">{pendingCount}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-amber-400 opacity-70">Pending</p>
                        {pendingCount > 0 && (
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mx-auto mt-0.5 animate-pulse" />
                        )}
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-center">
                        <p className="text-xl font-black text-emerald-400">{closedCount}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400 opacity-70">Done</p>
                    </div>
                </div>
            )}

            {activity.length === 0 ? (
                <EmptyActivityState />
            ) : (
                <>
                    {/* Pending Review Alert */}
                    {pendingCount > 0 && (
                        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                            <Star size={14} className="text-amber-400 fill-amber-400 shrink-0 animate-pulse" />
                            <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                                {pendingCount} report{pendingCount !== 1 ? 's' : ''} ready to review &amp; close!
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {paginatedActivity.map(obs => (
                            <ObservationCard
                                key={obs.id}
                                obs={obs}
                                isCreator={true}
                                onReview={onReview}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-color)]">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--bg-main)] transition-all disabled:opacity-20 active:scale-95 shadow-sm"
                            >
                                <ChevronLeft size={16} /> Prev
                            </button>
                            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--bg-main)] transition-all disabled:opacity-20 active:scale-95 shadow-sm"
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

export default Activity;
