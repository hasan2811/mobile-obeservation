import React, { useState } from 'react';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import ObservationCard from '../components/ObservationCard';

const ITEMS_PER_PAGE = 5;

const Tasks = ({ tasks, onTakeAction }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedTasks = tasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="p-5 pb-24 animate-fade-in text-[var(--text-primary)] min-h-screen transition-colors duration-300">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <ClipboardList className="text-blue-500" size={26} />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 tracking-tight">Assigned Tasks</span>
            </h2>

            {tasks.length === 0 ? (
                <div className="text-center p-14 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-color)] animate-fade-in shadow-xl transition-colors">
                    <div className="w-20 h-20 bg-[var(--bg-main)] rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-[var(--text-secondary)] opacity-30 shadow-inner">
                        <ClipboardList size={36} />
                    </div>
                    <p className="text-[var(--text-primary)] text-sm font-black uppercase tracking-tight">No pending tasks</p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-2 font-bold uppercase tracking-widest opacity-60">You're all caught up!</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4 min-h-[400px]">
                        {paginatedTasks.map(obs => (
                            <ObservationCard
                                key={obs.id}
                                obs={obs}
                                isAssignee={true}
                                onTakeAction={onTakeAction}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-10 pt-8 border-t border-[var(--border-color)]">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-all disabled:opacity-20 disabled:scale-95 active:scale-95 shadow-lg shadow-black/5"
                            >
                                <ChevronLeft size={18} />
                                Prev
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] opacity-60">
                                    {currentPage} / {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-all disabled:opacity-20 disabled:scale-95 active:scale-95 shadow-lg shadow-black/5"
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>

    );
};

export default Tasks;
