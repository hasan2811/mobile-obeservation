import React, { useMemo } from 'react';
import { User, Shield, BarChart3, PieChart, Star, LogOut, ChevronLeft, Award } from 'lucide-react';

const Profile = ({ user, observations, onLogout, onBack }) => {
    // Calculate Personal Stats
    const personalStats = useMemo(() => {
        const myReports = observations.filter(o => o.creatorName === user.username);

        // Category Breakdown
        const categories = {};
        myReports.forEach(r => {
            const cat = r.title || 'Other';
            categories[cat] = (categories[cat] || 0) + 1;
        });

        // Hazard Type Breakdown
        const hazards = {};
        myReports.forEach(r => {
            const hz = r.raw?.subCategory || 'Other';
            hazards[hz] = (hazards[hz] || 0) + 1;
        });

        // Average Rating (from Action History if it exists)
        let totalRating = 0;
        let ratingCount = 0;
        myReports.forEach(r => {
            if (r.history) {
                r.history.forEach(h => {
                    if (h.rating) {
                        totalRating += h.rating;
                        ratingCount++;
                    }
                });
            }
        });

        return {
            total: myReports.length,
            categories: Object.entries(categories).sort((a, b) => b[1] - a[1]),
            hazards: Object.entries(hazards).sort((a, b) => b[1] - a[1]).slice(0, 5), // Top 5
            avgRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0",
            ratingCount
        };
    }, [user, observations]);

    return (
        <div className="min-h-screen bg-[var(--bg-main)] animate-fade-in text-[var(--text-primary)] pb-24 transition-colors duration-300">
            {/* Header / Back */}
            <div className="p-5 flex justify-between items-center bg-[var(--bg-card)]/50 backdrop-blur-xl border-b border-[var(--border-color)] sticky top-0 z-50">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-80">Account Performance</h2>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Profile Intro */}
            <div className="p-8 flex flex-col items-center">
                <div className="relative group mb-4">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                        {user.username[0]}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-[var(--bg-main)] flex items-center justify-center shadow-lg">
                        <Shield size={14} className="text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-black text-[var(--text-primary)] mb-1 leading-tight tracking-tight">{user.username}</h1>
                <p className="text-sm text-[var(--text-secondary)] font-bold lowercase italic opacity-70">{user.email}</p>
                <div className="mt-5 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                    {user.role}
                </div>
            </div>

            <div className="px-5 space-y-6">

                {/* Performance Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-[2.5rem] shadow-xl transition-colors">
                        <div className="text-blue-500 mb-2">
                            <BarChart3 size={24} />
                        </div>
                        <p className="text-4xl font-black text-[var(--text-primary)]">{personalStats.total}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest opacity-60">Total Reports</p>
                    </div>
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-[2.5rem] shadow-xl transition-colors">
                        <div className="text-amber-500 mb-2">
                            <Star size={24} className="fill-amber-500/20" />
                        </div>
                        <p className="text-4xl font-black text-[var(--text-primary)]">{personalStats.avgRating}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest opacity-60">Avg Rating ({personalStats.ratingCount})</p>
                    </div>
                </div>

                {/* Categories Chart Alternative */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-7 shadow-xl transition-colors">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart size={20} className="text-purple-500" />
                        <h3 className="font-black text-xs uppercase tracking-[0.1em] text-[var(--text-primary)] opacity-80">Category Distribution</h3>
                    </div>
                    <div className="space-y-6">
                        {personalStats.categories.length > 0 ? (
                            personalStats.categories.map(([name, count]) => (
                                <div key={name}>
                                    <div className="flex justify-between text-xs mb-2 px-1">
                                        <span className="text-[var(--text-secondary)] font-black uppercase tracking-tighter opacity-70">{name}</span>
                                        <span className="text-[var(--text-primary)] font-black">{count}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-[var(--bg-main)] rounded-full overflow-hidden shadow-inner border border-[var(--border-color)]">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 shadow-sm ${name.includes('Unsafe') ? 'bg-red-500' :
                                                name.includes('Safe') ? 'bg-emerald-500' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${(count / personalStats.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-[var(--text-secondary)] italic opacity-50 text-center py-4 uppercase font-bold tracking-widest">No category data yet.</p>
                        )}
                    </div>
                </div>

                {/* Top Hazards Identification */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-7 shadow-xl transition-colors">
                    <div className="flex items-center gap-2 mb-6">
                        <Award size={20} className="text-amber-500" />
                        <h3 className="font-black text-xs uppercase tracking-[0.1em] text-[var(--text-primary)] opacity-80">Hazard Observations</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {personalStats.hazards.length > 0 ? (
                            personalStats.hazards.map(([name, count]) => (
                                <div key={name} className="flex items-center gap-3 px-4 py-2.5 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] shadow-sm">
                                    <span className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-tighter opacity-80">{name}</span>
                                    <span className="text-[10px] font-black bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-lg border border-blue-500/10 shadow-inner">{count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-[var(--text-secondary)] italic opacity-50 text-center py-4 uppercase font-bold tracking-widest w-full">No hazard data yet.</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 px-2">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-3xl bg-red-500/5 border border-red-500/20 text-red-500 font-black uppercase tracking-widest hover:bg-red-500/10 transition-all active:scale-95 shadow-lg shadow-red-500/5"
                    >
                        <LogOut size={20} />
                        Log Out Account
                    </button>

                    <p className="text-center text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-[0.4em] py-8 opacity-40">
                        Employee Report Summary V1.3
                    </p>
                </div>
            </div>
        </div>

    );
};

export default Profile;
