import React, { useState, useMemo } from 'react';
import { Sparkles, BarChart3, AlertTriangle, CheckCircle, Activity as LucideActivity, FileText, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ user, stats, observations, aiInsight, isGeneratingInsight, onGenerateInsight, onTaskClick, onActivityClick, onFeedClick, onProfileClick }) => {
    const [daysRange, setDaysRange] = useState(7);
    const firstName = user?.username ? user.username.split(' ')[0] : 'User';

    // Process chart data
    const chartData = useMemo(() => {
        const data = [];
        const now = new Date();

        for (let i = daysRange - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            // Filter observations for this specific day
            const dayObs = observations.filter(obs => {
                const obsDate = new Date(obs.raw?.timestamp || obs.id).toISOString().split('T')[0];
                return obsDate === dateStr;
            });

            data.push({
                name: displayDate,
                total: dayObs.length,
                open: dayObs.filter(o => o.status === 'Open').length,
                closed: dayObs.filter(o => o.status === 'Closed').length,
                pending: dayObs.filter(o => o.status === 'Pending').length
            });
        }
        return data;
    }, [observations, daysRange]);

    return (
        <div className="p-5 pb-24 space-y-6 animate-fade-in text-[var(--text-primary)] transition-colors duration-300">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 tracking-tight">Hi, {firstName}</h1>
                    <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-60">Welcome back</p>
                </div>
                <button
                    className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all hover:rotate-3 rotate-3"
                    onClick={onProfileClick}
                >
                    {firstName[0]}
                </button>
            </header>

            {/* Trend Chart Section */}
            <div className="bg-[var(--bg-card)] rounded-[2.5rem] p-6 border border-[var(--border-color)] shadow-xl relative overflow-hidden transition-all">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={18} className="text-blue-500" />
                        <h3 className="font-black text-[var(--text-primary)] text-[10px] uppercase tracking-widest">Observation Trends</h3>
                    </div>

                    {/* Time Range Selector */}
                    <div className="flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-color)]">
                        {[7, 30].map(val => (
                            <button
                                key={val}
                                onClick={() => setDaysRange(val)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${daysRange === val ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-[var(--text-secondary)] opacity-60'}`}
                            >
                                {val === 7 ? '7 Days' : '1 Month'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-48 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fontWeight: 700, fill: 'var(--text-secondary)' }}
                                interval={daysRange === 30 ? 6 : 0}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--bg-card)',
                                    borderColor: 'var(--border-color)',
                                    borderRadius: '1rem',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    color: 'var(--text-primary)',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ fontSize: '9px' }}
                                cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                                animationDuration={1000}
                                name="Total"
                            />
                            <Area
                                type="monotone"
                                dataKey="open"
                                stroke="#ef4444"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorOpen)"
                                animationDuration={1000}
                                name="Open"
                            />
                            <Area
                                type="monotone"
                                dataKey="closed"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorClosed)"
                                animationDuration={1000}
                                name="Closed"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-color)] opacity-60">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Total</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Open</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Closed</span>
                        </div>
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Updated just now</span>
                </div>
            </div>

            {/* AI Insight (Manual Trigger) */}
            <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-indigo-500/20 rounded-[2.5rem] p-7 pt-9 relative overflow-hidden shadow-2xl shadow-indigo-500/5 transition-colors group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={60} className="text-indigo-500" />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <Sparkles size={20} className="text-indigo-500 animate-pulse" />
                        <h3 className="font-black text-indigo-500 text-[10px] uppercase tracking-[0.2em]">Safety Intelligence</h3>
                    </div>
                    {!aiInsight && !isGeneratingInsight && (
                        <button
                            onClick={onGenerateInsight}
                            className="text-[10px] font-black text-white bg-indigo-600 px-4 py-2 rounded-full shadow-lg shadow-indigo-500/20 active:scale-95 transition-all uppercase tracking-widest"
                        >
                            Analyze Now
                        </button>
                    )}
                    {isGeneratingInsight && (
                        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                            <Loader2 size={12} className="animate-spin" />
                            Analyzing...
                        </div>
                    )}
                </div>
                {aiInsight ? (
                    <p className="text-sm text-[var(--text-primary)] italic leading-relaxed font-medium opacity-90">"{aiInsight}"</p>
                ) : !isGeneratingInsight ? (
                    <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed font-medium opacity-60">
                        Click "Analyze Now" to get professional safety insights based on latest reports.
                    </p>
                ) : null}
            </div>

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
                <div onClick={onTaskClick} className="bg-[var(--bg-card)] p-5 rounded-[2rem] relative overflow-hidden btn-press cursor-pointer border border-[var(--border-color)] hover:border-blue-500/40 transition-all shadow-xl flex items-center justify-between group">
                    <div className="relative z-10">
                        <div className="text-lg font-black text-blue-500 mb-1 leading-tight tracking-tight uppercase tracking-tighter">My Pending Tasks</div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-60">Manage your assignments</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <FileText className="text-blue-500" size={24} />
                    </div>
                </div>
                <div onClick={onActivityClick} className="bg-[var(--bg-card)] p-5 rounded-[2rem] relative overflow-hidden btn-press cursor-pointer border border-[var(--border-color)] hover:border-purple-500/40 transition-all shadow-xl flex items-center justify-between group">
                    <div className="relative z-10">
                        <div className="text-lg font-black text-purple-500 mb-1 leading-tight tracking-tight uppercase tracking-tighter">Report Activity</div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-60">Track what you've submitted</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <ArrowRight className="text-purple-500" size={24} />
                    </div>
                </div>
                <div onClick={onFeedClick} className="bg-[var(--bg-card)] p-5 rounded-[2rem] relative overflow-hidden btn-press cursor-pointer border border-[var(--border-color)] hover:border-teal-500/40 transition-all shadow-xl flex items-center justify-between group">
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

