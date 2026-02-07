import React, { useState } from 'react';
import { Activity as LucideActivity, ChevronLeft, ChevronRight, Loader2, Filter, Search } from 'lucide-react';
import FeedCard from '../components/FeedCard';

const FILTERS = ["All", "Unsafe Action", "Unsafe Condition", "Safe Action", "Safe Condition", "Nearmiss"];

const Feed = ({ feedData, page, onPageChange, hasMore, loading, onSelectObs }) => {
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter logic (applies to the current page's data)
    const filteredData = feedData.filter(obs => {
        const matchesCategory = activeFilter === "All" || obs.title === activeFilter;
        const matchesSearch = obs.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obs.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obs.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="p-5 pb-24 space-y-6 animate-fade-in text-[var(--text-primary)] transition-colors duration-300">
            <header className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <LucideActivity size={24} className="text-blue-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 tracking-tight">Activity Feed</span>
                    </h2>
                    <div className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] shadow-sm">
                        Page {page}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors opacity-50" size={18} />
                    <input
                        type="text"
                        placeholder="Search current page results..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-all backdrop-blur-sm shadow-inner placeholder-[var(--text-secondary)]/40"
                    />
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar -mx-5 px-5">
                    {FILTERS.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === filter
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20 scale-105'
                                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-blue-500 hover:border-blue-500/30'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </header>

            <div className="space-y-6 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 animate-pulse">
                        <Loader2 size={48} className="text-blue-500 animate-spin mb-4 opacity-50" />
                        <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Scanning Observations...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center p-14 bg-[var(--bg-card)] rounded-[3rem] border border-[var(--border-color)] animate-fade-in shadow-xl transition-colors">
                        <div className="w-20 h-20 bg-[var(--bg-main)] rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-[var(--text-secondary)] opacity-30 shadow-inner">
                            <LucideActivity size={36} />
                        </div>
                        <p className="text-[var(--text-primary)] text-sm font-black uppercase tracking-tight">No results found</p>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-2 font-bold uppercase tracking-widest opacity-60">Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    filteredData.map(obs => (
                        <FeedCard key={obs.id} obs={obs} onClick={onSelectObs} />
                    ))
                )}
            </div>

            {/* Traditional Pagination Controls */}
            <div className="flex items-center justify-between pt-8 border-t border-[var(--border-color)]">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-all disabled:opacity-20 disabled:scale-95 active:scale-95 shadow-lg shadow-black/5"
                >
                    <ChevronLeft size={18} />
                    Prev
                </button>

                <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-xs font-black text-white shadow-xl shadow-blue-600/20">
                        {page}
                    </span>
                    {hasMore && !loading && (
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    )}
                </div>

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={!hasMore || loading}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-all disabled:opacity-20 disabled:scale-95 active:scale-95 shadow-lg shadow-black/5"
                >
                    Next
                    <ChevronRight size={18} />
                </button>
            </div>

            <p className="text-center text-[9px] text-[var(--text-secondary)] font-black tracking-[0.3em] uppercase opacity-40 py-4">
                Global Stream | 10 per page
            </p>
        </div>
    );
};

export default Feed;
