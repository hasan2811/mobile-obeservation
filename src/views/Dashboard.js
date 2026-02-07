import React from 'react';
import { Sparkles, BarChart3, AlertTriangle, CheckCircle, Activity as LucideActivity, FileText, ArrowRight } from 'lucide-react';

const Dashboard = ({ user, stats, aiInsight, onTaskClick, onActivityClick, onFeedClick, onProfileClick }) => {
    const firstName = user?.username ? user.username.split(' ')[0] : 'User';

    return (
        <div className="p-5 pb-24 space-y-6 animate-fade-in text-[var(--text-primary)] transition-colors duration-300">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 tracking-tight">Hi, {firstName}</h1>
                    <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-60">Welcome back</p>
                </div>
                {/* Profile Access via Avatar Click */}
                <button
                    className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all hover:rotate-3 rotate-3"
                    onClick={onProfileClick}
                >
                    {firstName[0]}
                </button>
            </header>

            {/* AI Insight (Prominent) */}
            {aiInsight && (
                <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-indigo-500/20 rounded-[2.5rem] p-7 pt-9 relative overflow-hidden shadow-2xl shadow-indigo-500/5 transition-colors group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles size={60} className="text-indigo-500" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={20} className="text-indigo-500 animate-pulse" />
                        <h3 className="font-black text-indigo-500 text-[10px] uppercase tracking-[0.2em]">Safety Intelligence</h3>
                    </div>
                    <p className="text-sm text-[var(--text-primary)] italic leading-relaxed font-medium opacity-90">"{aiInsight}"</p>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--bg-card)] p-6 rounded-[2.5rem] border border-[var(--border-color)] relative overflow-hidden shadow-xl hover:border-blue-500/30 transition-all group">
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1.5 opacity-60">Total Reports</p>
                    <p className="text-4xl font-black text-[var(--text-primary)] leading-none">{stats?.total || 0}</p>
                    <BarChart3 className="absolute -right-3 -bottom-3 text-[var(--text-secondary)] opacity-5 group-hover:opacity-10 transition-opacity" size={80} />
                </div>
                <div className="bg-red-500/5 p-6 rounded-[2.5rem] border border-red-500/20 relative overflow-hidden shadow-xl hover:bg-red-500/10 transition-all group">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1.5 opacity-80">Unsafe</p>
                    <p className="text-4xl font-black text-red-500 leading-none">{stats?.unsafe || 0}</p>
                    <AlertTriangle className="absolute -right-3 -bottom-3 text-red-500 opacity-10 group-hover:opacity-20 transition-opacity" size={80} />
                </div>
                <div className="bg-emerald-500/5 p-6 rounded-[2.5rem] border border-emerald-500/20 relative overflow-hidden shadow-xl hover:bg-emerald-500/10 transition-all group">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1.5 opacity-80">Safe</p>
                    <p className="text-4xl font-black text-emerald-500 leading-none">{stats?.safe || 0}</p>
                    <CheckCircle className="absolute -right-3 -bottom-3 text-emerald-500 opacity-10 group-hover:opacity-20 transition-opacity" size={80} />
                </div>
                <div className="bg-amber-500/5 p-6 rounded-[2.5rem] border border-amber-500/20 relative overflow-hidden shadow-xl hover:bg-amber-500/10 transition-all group">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1.5 opacity-80">Nearmiss</p>
                    <p className="text-4xl font-black text-amber-500 leading-none">{stats?.nearmiss || 0}</p>
                    <LucideActivity className="absolute -right-3 -bottom-3 text-amber-500 opacity-10 group-hover:opacity-20 transition-opacity" size={80} />
                </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 gap-4 pt-2">
                <div
                    onClick={onTaskClick}
                    className="bg-[var(--bg-card)] p-5 rounded-[2rem] relative overflow-hidden btn-press cursor-pointer border border-[var(--border-color)] hover:border-blue-500/40 transition-all shadow-xl flex items-center justify-between group">
                    <div className="relative z-10">
                        <div className="text-lg font-black text-blue-500 mb-1 leading-tight tracking-tight uppercase tracking-tighter">My Pending Tasks</div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-60">Manage your assignments</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <FileText className="text-blue-500" size={24} />
                    </div>
                </div>

                <div
                    onClick={onActivityClick}
                    className="bg-[var(--bg-card)] p-5 rounded-[2rem] relative overflow-hidden btn-press cursor-pointer border border-[var(--border-color)] hover:border-purple-500/40 transition-all shadow-xl flex items-center justify-between group">
                    <div className="relative z-10">
                        <div className="text-lg font-black text-purple-500 mb-1 leading-tight tracking-tight uppercase tracking-tighter">Report Activity</div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-60">Track what you've submitted</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <ArrowRight className="text-purple-500" size={24} />
                    </div>
                </div>

                <div
                    onClick={onFeedClick}
                    className="bg-[var(--bg-card)] p-5 rounded-[2rem] relative overflow-hidden btn-press cursor-pointer border border-[var(--border-color)] hover:border-teal-500/40 transition-all shadow-xl flex items-center justify-between group">
                    <div className="relative z-10">
                        <div className="text-lg font-black text-teal-500 mb-1 leading-tight tracking-tight uppercase tracking-tighter">Community Feed</div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-60">See what others are reporting</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <LucideActivity className="text-teal-400" size={24} />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
