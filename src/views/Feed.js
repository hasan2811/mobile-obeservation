import React, { useState } from 'react';
import { Activity as LucideActivity, ChevronLeft, ChevronRight, Loader2, Search, X, SlidersHorizontal } from 'lucide-react';
import FeedCard from '../components/FeedCard';

const CATEGORY_FILTERS = ["All", "Unsafe Action", "Unsafe Condition", "Safe Action", "Safe Condition", "Nearmiss"];
const STATUS_FILTERS = ["All Status", "Open", "Pending", "Closed"];

const EmptyState = ({ searchQuery, activeFilter }) => (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-[2rem] flex items-center justify-center border border-blue-500/20 shadow-inner">
                <LucideActivity size={40} className="text-blue-400 opacity-50" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full flex items-center justify-center">
                <Search size={11} className="text-[var(--text-secondary)]" />
            </div>
        </div>
        <p className="text-[var(--text-primary)] text-sm font-black uppercase tracking-tight mb-2">
            {searchQuery ? 'No results found' : 'No data yet'}
        </p>
        <p className="text-[11px] text-[var(--text-secondary)] font-medium text-center max-w-[200px] leading-relaxed opacity-60">
            {searchQuery
                ? `No results for "${searchQuery}"`
                : activeFilter !== 'All'
                    ? `No observations with category "${activeFilter}"`
                    : 'No reports yet. Be the first to submit one!'}
        </p>
    </div>
);

const Feed = ({ feedData, page, onPageChange, hasMore, loading, onSelectObs }) => {
    const [activeFilter, setActiveFilter] = useState("All");
    const [activeStatus, setActiveStatus] = useState("All Status");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const filteredData = feedData.filter(obs => {
        const matchesCategory = activeFilter === "All" || obs.title === activeFilter;
        const matchesStatus = activeStatus === "All Status" || obs.status === activeStatus;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q ||
            (obs.description || '').toLowerCase().includes(q) ||
            (obs.location || '').toLowerCase().includes(q) ||
            (obs.creatorName || '').toLowerCase().includes(q) ||
            (obs.raw?.company || '').toLowerCase().includes(q) ||
            (obs.raw?.subCategory || '').toLowerCase().includes(q);
        return matchesCategory && matchesStatus && matchesSearch;
    });

    const activeFilterCount = (activeFilter !== 'All' ? 1 : 0) + (activeStatus !== 'All Status' ? 1 : 0);

    const clearAll = () => {
        setActiveFilter('All');
        setActiveStatus('All Status');
        setSearchQuery('');
    };

    return (
        <div className="p-5 pb-6 space-y-4 animate-fade-in text-[var(--text-primary)] transition-colors duration-300">
            <header className="space-y-3">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <LucideActivity size={22} className="text-blue-500" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 tracking-tight">Activity Feed</span>
                        </h2>
                        <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-50 mt-0.5">
                            {filteredData.length} observation{filteredData.length !== 1 ? 's' : ''} • Page {page}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilters(v => !v)}
                        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${showFilters ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)]'}`}
                    >
                        <SlidersHorizontal size={13} />
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-black flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors opacity-50" size={16} />
                    <input
                        type="text"
                        placeholder="Search description, location, reporter..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl py-3.5 pl-11 pr-10 text-sm text-[var(--text-primary)] focus:border-blue-500/60 focus:outline-none transition-all placeholder-[var(--text-secondary)]/40"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--border-color)] flex items-center justify-center">
                            <X size={12} className="text-[var(--text-secondary)]" />
                        </button>
                    )}
                </div>

                {/* Expandable Filter Panel */}
                {showFilters && (
                    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 space-y-3 animate-fade-in shadow-lg">
                        {/* Category Filter */}
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-60 mb-2">Category</p>
                            <div className="flex gap-1.5 flex-wrap">
                                {CATEGORY_FILTERS.map(f => (
                                    <button key={f} onClick={() => setActiveFilter(f)}
                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${activeFilter === f
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20'
                                            : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Status Filter */}
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-60 mb-2">Status</p>
                            <div className="flex gap-1.5 flex-wrap">
                                {STATUS_FILTERS.map(f => {
                                    const color = f === 'Open' ? 'bg-blue-600 border-blue-500' : f === 'Pending' ? 'bg-amber-500 border-amber-400' : f === 'Closed' ? 'bg-emerald-600 border-emerald-500' : 'bg-blue-600 border-blue-500';
                                    return (
                                        <button key={f} onClick={() => setActiveStatus(f)}
                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${activeStatus === f
                                                ? `${color} text-white shadow-md`
                                                : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                                            {f}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Clear Filters */}
                        {activeFilterCount > 0 && (
                            <button onClick={clearAll} className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-red-400 border border-red-500/20 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-all flex items-center justify-center gap-1.5">
                                <X size={11} /> Reset All Filters
                            </button>
                        )}
                    </div>
                )}
            </header>

            {/* Feed List */}
            <div className="space-y-4 min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 pointer-events-none">
                        <svg className="hsse-loader w-14 h-14 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
                            <g fill="#ff5282">
                                <rect x="10" y="54" width="100" height="14" rx="7" />
                                <path d="M 44 54 V 16 Q 60 8 76 16 V 54 Z" />
                                <path d="M 36 54 V 28 A 22 28 0 0 0 16 54 Z" />
                                <path d="M 84 54 V 28 A 22 28 0 0 1 104 54 Z" />
                            </g>
                            <g stroke="#f28367" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                                <path className="goggles" d="M 34 76 H 86 A 10 10 0 0 1 96 86 V 88 A 10 10 0 0 1 86 98 H 70 A 10 10 0 0 0 50 98 H 34 A 10 10 0 0 1 24 88 V 86 A 10 10 0 0 1 34 76 Z" />
                                <path d="M 12 82 V 92 M 108 82 V 92" />
                            </g>
                        </svg>
                        <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Loading Observations...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <EmptyState searchQuery={searchQuery} activeFilter={activeFilter} />
                ) : (
                    filteredData.map(obs => (
                        <FeedCard key={obs.id} obs={obs} onClick={onSelectObs} />
                    ))
                )}
            </div>

            {/* Pagination */}
            {!loading && filteredData.length > 0 && (
                <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1 || loading}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-all disabled:opacity-20 active:scale-95 shadow-sm"
                    >
                        <ChevronLeft size={16} /> Prev
                    </button>

                    <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-blue-600/20">
                        {page}
                    </span>

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={!hasMore || loading}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-all disabled:opacity-20 active:scale-95 shadow-sm"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Feed;
