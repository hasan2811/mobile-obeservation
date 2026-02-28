import React, { useMemo, useState, useRef } from 'react';
import { BarChart3, PieChart, Star, LogOut, ChevronLeft, Award, Shield, Camera, Settings, X, Plus, Trash2 } from 'lucide-react';
import HSSELogo from '../components/HSSELogo';

const BRAND = 'linear-gradient(135deg, #f28367 0%, #ff5282 100%)';
const BRAND_SHADOW = '0 8px 24px rgba(255,82,130,0.3)';

// ─── Settings Modal (Company & Location dropdown configurator) ───
const SettingsModal = ({ onClose }) => {
    const [tab, setTab] = useState('companies');

    const [companies, setCompanies] = useState(() => {
        try { return JSON.parse(localStorage.getItem('hsse_companies')) || ['Company A', 'Company B']; }
        catch { return ['Company A', 'Company B']; }
    });
    const [locations, setLocations] = useState(() => {
        try { return JSON.parse(localStorage.getItem('hsse_locations')) || ['Location A', 'Location B']; }
        catch { return ['Location A', 'Location B']; }
    });
    const [newItem, setNewItem] = useState('');

    const current = tab === 'companies' ? companies : locations;
    const setCurrent = tab === 'companies' ? setCompanies : setLocations;
    const storageKey = tab === 'companies' ? 'hsse_companies' : 'hsse_locations';

    const addItem = () => {
        if (!newItem.trim()) return;
        const updated = [...current, newItem.trim()];
        setCurrent(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setNewItem('');
    };

    const removeItem = (i) => {
        const updated = current.filter((_, idx) => idx !== i);
        setCurrent(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--bg-card)] w-full max-w-md rounded-t-[2.5rem] p-6 pt-8 shadow-2xl border border-[var(--border-color)] max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight">Form Settings</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                        <X size={16} />
                    </button>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest opacity-50 mb-5 shrink-0">
                    Customize dropdown options in observation form
                </p>

                {/* Tab Toggle */}
                <div className="flex bg-[var(--bg-main)] rounded-2xl p-1.5 mb-5 shadow-inner border border-[var(--border-color)] shrink-0">
                    {['companies', 'locations'].map(t => (
                        <button key={t} onClick={() => { setTab(t); setNewItem(''); }}
                            className="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            style={tab === t ? { background: BRAND, color: 'white', boxShadow: BRAND_SHADOW } : { color: 'var(--text-secondary)' }}>
                            {t === 'companies' ? '🏢 Companies' : '📍 Locations'}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    {current.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] group">
                            <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 w-5 shrink-0">{i + 1}</span>
                            <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">{item}</span>
                            <button onClick={() => removeItem(i)}
                                className="w-7 h-7 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ))}
                    {current.length === 0 && (
                        <p className="text-center text-xs text-[var(--text-secondary)] opacity-40 py-8 font-black uppercase tracking-widest">No items yet</p>
                    )}
                </div>

                {/* Add new */}
                <div className="flex gap-2 shrink-0">
                    <input
                        type="text"
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addItem()}
                        placeholder={`Add new ${tab === 'companies' ? 'company' : 'location'}...`}
                        className="flex-1 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 focus:outline-none focus:border-[#ff5282]/40 font-medium transition-all"
                    />
                    <button onClick={addItem}
                        className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-lg active:scale-95 transition-all"
                        style={{ background: BRAND, boxShadow: BRAND_SHADOW }}>
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Profile Component ───
const Profile = ({ user, observations, onLogout, onBack }) => {
    const [showSettings, setShowSettings] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('profile_photo_' + user.username) || null);
    const photoInputRef = useRef();

    const personalStats = useMemo(() => {
        const myReports = observations.filter(o => o.creatorName === user.username);
        const categories = {};
        myReports.forEach(r => { const cat = r.title || 'Other'; categories[cat] = (categories[cat] || 0) + 1; });
        const hazards = {};
        myReports.forEach(r => { const hz = r.raw?.subCategory || 'Other'; hazards[hz] = (hazards[hz] || 0) + 1; });
        let totalRating = 0, ratingCount = 0;
        myReports.forEach(r => { if (r.history) r.history.forEach(h => { if (h.rating) { totalRating += h.rating; ratingCount++; } }); });
        return {
            total: myReports.length,
            categories: Object.entries(categories).sort((a, b) => b[1] - a[1]),
            hazards: Object.entries(hazards).sort((a, b) => b[1] - a[1]).slice(0, 5),
            avgRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0",
            ratingCount
        };
    }, [user, observations]);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            setProfilePhoto(dataUrl);
            localStorage.setItem('profile_photo_' + user.username, dataUrl);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] animate-fade-in text-[var(--text-primary)] pb-6 transition-colors duration-300">

            {/* Header */}
            <div className="px-5 flex justify-between items-center border-b border-[var(--border-color)] bg-[var(--bg-main)]/95 backdrop-blur-xl sticky top-0 z-50 transition-colors" style={{ height: '56px' }}>
                <button onClick={onBack}
                    className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all active:scale-95">
                    <ChevronLeft size={18} />
                </button>
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-70">My Profile</h2>
                <button onClick={() => setShowSettings(true)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 border"
                    style={{ background: 'rgba(242,131,103,0.1)', borderColor: 'rgba(255,82,130,0.25)', color: '#ff5282' }}>
                    <Settings size={16} />
                </button>
            </div>

            {/* Profile Hero */}
            <div className="p-8 flex flex-col items-center">
                {/* Avatar with photo upload */}
                <div className="relative group mb-5">
                    <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden shadow-2xl border-2"
                        style={{ borderColor: 'rgba(255,82,130,0.3)', boxShadow: '0 16px 40px rgba(255,82,130,0.2)' }}>
                        {profilePhoto
                            ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white"
                                style={{ background: BRAND }}>
                                {user.username[0].toUpperCase()}
                            </div>
                        }
                    </div>
                    {/* Camera overlay */}
                    <button onClick={() => photoInputRef.current?.click()}
                        className="absolute inset-0 rounded-[2.5rem] bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1">
                        <Camera size={20} className="text-white" />
                        <span className="text-[8px] font-black text-white uppercase tracking-wide">Change</span>
                    </button>
                    <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    {/* Online badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-[var(--bg-main)] flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Shield size={14} className="text-white" />
                    </div>
                </div>

                <h1 className="text-2xl font-black text-[var(--text-primary)] mb-0.5 leading-tight tracking-tight">{user.username}</h1>
                <p className="text-xs text-[var(--text-secondary)] font-medium opacity-60 mb-1">{user.email}</p>
                {(user.company || user.position) && (
                    <p className="text-[10px] text-[var(--text-secondary)] opacity-50 font-bold mb-2">
                        {[user.position, user.company].filter(Boolean).join(' · ')}
                    </p>
                )}
                <div className="mt-2 px-5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ background: 'rgba(242,131,103,0.08)', borderColor: 'rgba(255,82,130,0.25)', color: '#ff5282' }}>
                    {user.role}
                </div>
            </div>

            <div className="px-5 space-y-5">

                {/* Performance Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-[2.5rem] shadow-xl transition-colors">
                        <div className="mb-2" style={{ color: '#ff5282' }}><BarChart3 size={22} /></div>
                        <p className="text-4xl font-black text-[var(--text-primary)]">{personalStats.total}</p>
                        <p className="text-[9px] text-[var(--text-secondary)] uppercase font-black tracking-widest opacity-50 mt-1">Total Reports</p>
                    </div>
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-[2.5rem] shadow-xl transition-colors">
                        <div className="text-amber-500 mb-2"><Star size={22} className="fill-amber-500/20" /></div>
                        <p className="text-4xl font-black text-[var(--text-primary)]">{personalStats.avgRating}</p>
                        <p className="text-[9px] text-[var(--text-secondary)] uppercase font-black tracking-widest opacity-50 mt-1">Avg. Rating ({personalStats.ratingCount})</p>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-6 shadow-xl transition-colors">
                    <div className="flex items-center gap-2 mb-5">
                        <PieChart size={18} className="text-purple-500" />
                        <h3 className="font-black text-[10px] uppercase tracking-[0.12em] text-[var(--text-primary)] opacity-70">Category Breakdown</h3>
                    </div>
                    <div className="space-y-5">
                        {personalStats.categories.length > 0 ? personalStats.categories.map(([name, count]) => (
                            <div key={name}>
                                <div className="flex justify-between text-xs mb-1.5 px-1">
                                    <span className="text-[var(--text-secondary)] font-black uppercase tracking-tighter opacity-70 text-[10px]">{name}</span>
                                    <span className="text-[var(--text-primary)] font-black">{count}</span>
                                </div>
                                <div className="h-2 w-full bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-color)]">
                                    <div className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${(count / personalStats.total) * 100}%`,
                                            background: name.includes('Unsafe') ? '#ef4444' : name.includes('Safe') ? '#10b981' : BRAND
                                        }} />
                                </div>
                            </div>
                        )) : (
                            <p className="text-xs text-[var(--text-secondary)] italic opacity-40 text-center py-4 font-black uppercase tracking-widest">No data yet</p>
                        )}
                    </div>
                </div>

                {/* Top Hazards */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-6 shadow-xl transition-colors">
                    <div className="flex items-center gap-2 mb-5">
                        <Award size={18} className="text-amber-500" />
                        <h3 className="font-black text-[10px] uppercase tracking-[0.12em] text-[var(--text-primary)] opacity-70">Hazard Observations</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {personalStats.hazards.length > 0 ? personalStats.hazards.map(([name, count]) => (
                            <div key={name} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
                                <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase opacity-70">{name}</span>
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-lg"
                                    style={{ background: 'rgba(242,131,103,0.1)', color: '#f28367', border: '1px solid rgba(242,131,103,0.2)' }}>{count}</span>
                            </div>
                        )) : (
                            <p className="text-xs text-[var(--text-secondary)] opacity-40 text-center py-4 font-black uppercase tracking-widest w-full">No hazard data yet</p>
                        )}
                    </div>
                </div>

                {/* AI Settings */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-6 shadow-xl transition-colors"
                    style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-black text-[10px] uppercase tracking-[0.12em] text-indigo-500">AI Settings</h3>
                    </div>
                    <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)] mb-2 opacity-70">
                            Your Gemini API Key (Optional)
                        </label>
                        <input
                            type="password"
                            placeholder="AIza... (leave blank to disable AI)"
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/30 focus:outline-none focus:border-indigo-500/40 transition-all font-mono"
                            defaultValue={localStorage.getItem('userGeminiKey') || ''}
                            onChange={(e) => {
                                if (e.target.value.trim()) localStorage.setItem('userGeminiKey', e.target.value.trim());
                                else localStorage.removeItem('userGeminiKey');
                            }}
                        />
                        <div className="flex items-center gap-2 mt-3 p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)]">
                            <div className={`w-2.5 h-2.5 rounded-full ${localStorage.getItem('userGeminiKey') ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                            <p className="text-[10px] font-bold text-[var(--text-secondary)]">
                                AI: {localStorage.getItem('userGeminiKey') ? '✅ Enabled' : '⚠️ Disabled — Enter key above'}
                            </p>
                        </div>
                        <p className="text-[9px] text-[var(--text-secondary)] mt-2 opacity-50 leading-relaxed">
                            Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">Google AI Studio</a>
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <div className="pt-2 pb-6">
                    <button onClick={onLogout}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-3xl bg-red-500/5 border border-red-500/20 text-red-500 font-black uppercase tracking-widest transition-all active:scale-95 text-xs">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-6 opacity-20">
                        <HSSELogo size={14} />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">HSSE.Tech v2.0 · Meram Platform</span>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </div>
    );
};

export default Profile;
