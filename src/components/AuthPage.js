import React, { useState } from 'react';
import { User, Lock, AlertTriangle, Loader2, ArrowRight, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import HSSELogo from './HSSELogo';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz3o-973C9Bzhovhljs63_Ch_3rxc2u_FwPL-aDN9EHLV7-8dscLpCFHJTZEFv2-0Ed4w/exec";

const AuthPage = ({ onLogin, isDark, toggleTheme }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'User', company: '', position: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const action = isLogin ? 'login' : 'signup';
        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                body: JSON.stringify({ ...formData, action }),
                redirect: 'follow'
            });
            const result = await response.json();
            if (result.result === 'success') {
                onLogin(result.user);
            } else {
                setError(result.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-5 transition-colors duration-300 bg-[var(--bg-main)] text-[var(--text-primary)] relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.04]"
                    style={{ background: 'radial-gradient(circle, #ff5282, transparent)' }} />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-[0.04]"
                    style={{ background: 'radial-gradient(circle, #f28367, transparent)' }} />
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Theme toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-lg z-50 transition-all hover:scale-110 active:scale-95"
            >
                {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />}
            </button>

            {/* Card */}
            <div className="w-full max-w-sm bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl overflow-hidden relative">

                {/* Brand top strip */}
                <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #f28367, #ff5282)' }} />

                <div className="p-8 pt-10">
                    {/* Brand Hero */}
                    <div className="text-center mb-10">
                        {/* Logo */}
                        <div className="relative inline-flex mb-5">
                            <div className="w-20 h-20 rounded-[1.75rem] flex items-center justify-center shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(242,131,103,0.12) 0%, rgba(255,82,130,0.12) 100%)',
                                    border: '1.5px solid rgba(255,82,130,0.2)'
                                }}>
                                <HSSELogo size={48} />
                            </div>
                            {/* Live dot */}
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--bg-card)] bg-emerald-500 shadow-md shadow-emerald-500/30" />
                        </div>

                        {/* Brand name */}
                        <h1 className="text-2xl font-black tracking-tight mb-1">
                            <span style={{
                                background: 'linear-gradient(135deg, #f28367, #ff5282)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>HSSE</span>
                            <span className="text-[var(--text-primary)]">.Tech</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-50">
                            Meram Platform
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-2 opacity-60">
                            {isLogin ? 'Welcome back 👋' : 'Create a new account'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAuth} className="space-y-3">
                        {/* Username */}
                        <div className="bg-[var(--input-bg)] rounded-2xl px-4 py-1 border border-[var(--border-color)] focus-within:border-[#ff5282]/40 transition-colors flex items-center gap-3"
                            style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)' }}>
                            <User size={16} className="text-[var(--text-secondary)] shrink-0 opacity-60" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="bg-transparent w-full py-3 outline-none text-sm placeholder:text-[var(--text-secondary)]/40 text-[var(--text-primary)] font-medium"
                            />
                        </div>

                        {/* Email (register only) */}
                        {!isLogin && (
                            <div className="bg-[var(--input-bg)] rounded-2xl px-4 py-1 border border-[var(--border-color)] focus-within:border-[#ff5282]/40 transition-colors flex items-center gap-3"
                                style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)] opacity-60 shrink-0">
                                    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                <input type="email" name="email" placeholder="Email Address" required
                                    value={formData.email} onChange={handleChange}
                                    className="bg-transparent w-full py-3 outline-none text-sm placeholder:text-[var(--text-secondary)]/40 text-[var(--text-primary)] font-medium" />
                            </div>
                        )}

                        {/* Company + Position (register only) - 2 col */}
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[var(--input-bg)] rounded-2xl px-3 py-1 border border-[var(--border-color)] focus-within:border-[#ff5282]/40 transition-colors"
                                    style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)' }}>
                                    <input type="text" name="company" placeholder="Company"
                                        value={formData.company} onChange={handleChange}
                                        className="bg-transparent w-full py-2.5 outline-none text-sm placeholder:text-[var(--text-secondary)]/40 text-[var(--text-primary)] font-medium" />
                                </div>
                                <div className="bg-[var(--input-bg)] rounded-2xl px-3 py-1 border border-[var(--border-color)] focus-within:border-[#ff5282]/40 transition-colors"
                                    style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)' }}>
                                    <input type="text" name="position" placeholder="Position"
                                        value={formData.position} onChange={handleChange}
                                        className="bg-transparent w-full py-2.5 outline-none text-sm placeholder:text-[var(--text-secondary)]/40 text-[var(--text-primary)] font-medium" />
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div className="bg-[var(--input-bg)] rounded-2xl px-4 py-1 border border-[var(--border-color)] focus-within:border-[#ff5282]/40 transition-colors flex items-center gap-3"
                            style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)' }}>
                            <Lock size={16} className="text-[var(--text-secondary)] shrink-0 opacity-60" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-transparent w-full py-3 outline-none text-sm placeholder:text-[var(--text-secondary)]/40 text-[var(--text-primary)] font-medium"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="opacity-40 hover:opacity-70 transition-opacity">
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-500/8 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
                                <AlertTriangle size={13} /> {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            style={{
                                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #f28367 0%, #ff5282 100%)',
                                boxShadow: loading ? 'none' : '0 12px 28px rgba(255,82,130,0.3)'
                            }}
                        >
                            {loading
                                ? <Loader2 size={18} className="animate-spin" />
                                : <>
                                    <span className="tracking-wide text-sm">{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowRight size={16} />
                                </>
                            }
                        </button>
                    </form>

                    {/* Toggle login/register */}
                    <div className="mt-6 text-center">
                        <p className="text-[var(--text-secondary)] text-xs">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                                className="font-black hover:underline"
                                style={{ color: '#ff5282' }}
                            >
                                {isLogin ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </div>

                    {/* Footer brand */}
                    <p className="text-center text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-30 mt-8">
                        HSSE Tech © Meram Platform
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
