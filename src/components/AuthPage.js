import React, { useState } from 'react';
import { Shield, User, Mail, Lock, AlertTriangle, Loader2, ArrowRight, Sun, Moon } from 'lucide-react';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz3o-973C9Bzhovhljs63_Ch_3rxc2u_FwPL-aDN9EHLV7-8dscLpCFHJTZEFv2-0Ed4w/exec";

const AuthPage = ({ onLogin, isDark, toggleTheme }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'User' });

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
        <div className="min-h-screen font-display flex items-center justify-center p-4 transition-colors duration-300 bg-[var(--bg-main)] text-[var(--text-primary)] relative">
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-lg z-50 transition-transform hover:rotate-12"
            >
                {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-500" />}
            </button>

            <div className="w-full max-w-md bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-color)] shadow-xl overflow-hidden relative transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="p-8 pt-12">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                            <Shield size={32} className="text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">HSSE.Tech Platform</h1>
                        <p className="text-[var(--text-secondary)] text-sm mt-1">HSSE Integrated System</p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-4">
                            <div className="bg-[var(--input-bg)] rounded-2xl p-2 border border-[var(--border-color)] focus-within:border-blue-500/50 transition-colors flex items-center gap-3 shadow-inner">
                                <User size={18} className="text-[var(--text-secondary)] ml-2" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Email or Username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="bg-transparent w-full p-2 outline-none text-sm placeholder:text-slate-500 text-[var(--text-primary)]"
                                />
                            </div>

                            {!isLogin && (
                                <div className="bg-[var(--input-bg)] rounded-2xl p-2 border border-[var(--border-color)] focus-within:border-blue-500/50 transition-colors flex items-center gap-3 shadow-inner">
                                    <Mail size={18} className="text-[var(--text-secondary)] ml-2" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-transparent w-full p-2 outline-none text-sm placeholder:text-slate-500 text-[var(--text-primary)]"
                                    />
                                </div>
                            )}

                            <div className="bg-[var(--input-bg)] rounded-2xl p-2 border border-[var(--border-color)] focus-within:border-blue-500/50 transition-colors flex items-center gap-3 shadow-inner">
                                <Lock size={18} className="text-[var(--text-secondary)] ml-2" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="bg-transparent w-full p-2 outline-none text-sm placeholder:text-slate-500 text-[var(--text-primary)]"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-500">
                                <AlertTriangle size={14} /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>


                    <div className="mt-8 text-center">
                        <p className="text-[var(--text-secondary)] text-xs">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                                className="text-[#2b8cee] font-bold hover:underline"
                            >
                                {isLogin ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
