import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Users, Star, Clock, ChevronDown } from 'lucide-react';

// ─── localStorage helpers untuk track assign frequency ───
const STORAGE_KEY = 'hsse_assign_freq';

const getFreqMap = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
};

export const recordAssignment = (userId) => {
    if (!userId) return;
    const freq = getFreqMap();
    freq[userId] = (freq[userId] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freq));
};

// ─── Avatar helper ───
const initials = (name = '') => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
const AVATAR_COLORS = [
    'linear-gradient(135deg,#f28367,#ff5282)',
    'linear-gradient(135deg,#3b82f6,#6366f1)',
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
    'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    'linear-gradient(135deg,#06b6d4,#0891b2)',
];
const avatarGradient = (id = '') => AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];

// ─── User Avatar Bubble ───
const UserAvatar = ({ user, size = 32 }) => {
    const photo = localStorage.getItem('profile_photo_' + user.name);
    return (
        <div className="rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white font-black"
            style={{ width: size, height: size, background: avatarGradient(user.id), fontSize: size * 0.35 }}>
            {photo
                ? <img src={photo} alt={user.name} className="w-full h-full object-cover" />
                : initials(user.name)
            }
        </div>
    );
};

// ─── SmartAssigneePicker Component ───
const SmartAssigneePicker = ({ users, currentUser, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef();
    const containerRef = useRef();

    // Build sorted user list: frequent first, then alphabetical
    const sortedUsers = useMemo(() => {
        const freq = getFreqMap();
        const available = users.filter(u => u.id !== currentUser?.id);
        return [...available].sort((a, b) => {
            const fa = freq[a.id] || 0;
            const fb = freq[b.id] || 0;
            if (fb !== fa) return fb - fa; // frequent first
            return (a.name || '').localeCompare(b.name || '');
        });
    }, [users, currentUser]);

    const frequentUsers = useMemo(() => {
        const freq = getFreqMap();
        return sortedUsers.filter(u => (freq[u.id] || 0) > 0).slice(0, 5);
    }, [sortedUsers]);

    const filtered = useMemo(() => {
        if (!query.trim()) return sortedUsers;
        const q = query.toLowerCase();
        return sortedUsers.filter(u =>
            u.name?.toLowerCase().includes(q) ||
            u.role?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    }, [query, sortedUsers]);

    const selectedUser = users.find(u => u.id === value);

    // Close on outside click
    useEffect(() => {
        const handle = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    const select = (user) => {
        onChange(user.id);
        setOpen(false);
        setQuery('');
    };

    const freq = getFreqMap();

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50); }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl transition-all text-left hover:border-[#ff5282]/30"
                style={{ borderColor: open ? 'rgba(255,82,130,0.4)' : undefined }}
            >
                {selectedUser ? (
                    <>
                        <UserAvatar user={selectedUser} size={28} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{selectedUser.name}</p>
                            {selectedUser.role && (
                                <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wide opacity-60 truncate">{selectedUser.role}</p>
                            )}
                        </div>
                        {freq[selectedUser.id] > 0 && (
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md shrink-0"
                                style={{ background: 'rgba(255,82,130,0.08)', border: '1px solid rgba(255,82,130,0.2)' }}>
                                <Star size={8} style={{ color: '#ff5282', fill: '#ff5282' }} />
                                <span className="text-[8px] font-black" style={{ color: '#ff5282' }}>{freq[selectedUser.id]}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <span className="text-[var(--text-secondary)] text-sm opacity-40 flex-1">Select assignee...</span>
                )}
                <ChevronDown size={14} className="text-[var(--text-secondary)] opacity-40 shrink-0 transition-transform"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute left-0 right-0 top-full mt-2 z-[80] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
                    style={{ maxHeight: '320px', display: 'flex', flexDirection: 'column' }}>

                    {/* Search input */}
                    <div className="px-3 pt-3 pb-2 shrink-0">
                        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)]">
                            <Search size={13} className="text-[var(--text-secondary)] opacity-50 shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search by name or role..."
                                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 outline-none"
                            />
                            {query && (
                                <button onClick={() => setQuery('')} className="opacity-40 hover:opacity-70 transition-opacity">
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Frequent Users (quick picks) */}
                    {!query && frequentUsers.length > 0 && (
                        <div className="px-3 pb-2 shrink-0">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-40 mb-2 flex items-center gap-1">
                                <Star size={8} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                                Frequent Assignees
                            </p>
                            <div className="flex gap-1.5 flex-wrap">
                                {frequentUsers.map(u => (
                                    <button
                                        key={u.id}
                                        type="button"
                                        onClick={() => select(u)}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 hover:border-[#ff5282]/40"
                                        style={{
                                            background: value === u.id ? 'rgba(255,82,130,0.1)' : 'var(--bg-main)',
                                            borderColor: value === u.id ? 'rgba(255,82,130,0.4)' : 'var(--border-color)'
                                        }}
                                    >
                                        <UserAvatar user={u} size={20} />
                                        <span className="text-[10px] font-black text-[var(--text-primary)] max-w-[60px] truncate">{u.name?.split(' ')[0]}</span>
                                        <span className="text-[8px] font-black opacity-50" style={{ color: '#f59e0b' }}>{freq[u.id]}×</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    {!query && frequentUsers.length > 0 && (
                        <div className="mx-3 border-t border-[var(--border-color)] mb-1" />
                    )}

                    {/* Full list */}
                    <div className="overflow-y-auto flex-1">
                        {filtered.length === 0 ? (
                            <div className="py-8 text-center">
                                <Users size={28} className="mx-auto text-[var(--text-secondary)] opacity-20 mb-2" />
                                <p className="text-xs text-[var(--text-secondary)] opacity-40 font-black uppercase tracking-widest">No users found</p>
                            </div>
                        ) : (
                            <div className="p-2 space-y-0.5">
                                {!query && filtered.length > 0 && (
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-30 px-2 pt-1 pb-1.5 flex items-center gap-1">
                                        <Clock size={8} />
                                        All Users ({filtered.length})
                                    </p>
                                )}
                                {filtered.map(u => {
                                    const isSelected = value === u.id;
                                    const assignCount = freq[u.id] || 0;
                                    return (
                                        <button
                                            key={u.id}
                                            type="button"
                                            onClick={() => select(u)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-[0.98] text-left"
                                            style={{
                                                background: isSelected ? 'rgba(255,82,130,0.08)' : 'transparent',
                                                border: isSelected ? '1px solid rgba(255,82,130,0.25)' : '1px solid transparent',
                                            }}
                                        >
                                            <UserAvatar user={u} size={34} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{u.name}</p>
                                                    {assignCount >= 3 && (
                                                        <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md shrink-0"
                                                            style={{ background: 'rgba(255,82,130,0.1)', color: '#ff5282', border: '1px solid rgba(255,82,130,0.2)' }}>
                                                            Top
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[9px] text-[var(--text-secondary)] opacity-50 uppercase tracking-wide truncate">
                                                    {[u.role, u.company].filter(Boolean).join(' · ') || 'Team Member'}
                                                </p>
                                            </div>
                                            <div className="shrink-0 flex flex-col items-end gap-0.5">
                                                {assignCount > 0 && (
                                                    <div className="flex items-center gap-0.5">
                                                        <Clock size={8} className="opacity-40 text-[var(--text-secondary)]" />
                                                        <span className="text-[8px] text-[var(--text-secondary)] opacity-40 font-black">{assignCount}×</span>
                                                    </div>
                                                )}
                                                {isSelected && (
                                                    <div className="w-4 h-4 rounded-full flex items-center justify-center"
                                                        style={{ background: 'linear-gradient(135deg,#f28367,#ff5282)' }}>
                                                        <span className="text-white text-[8px] font-black">✓</span>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartAssigneePicker;
