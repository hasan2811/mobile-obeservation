import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="text-emerald-400" size={18} />,
        error: <AlertCircle className="text-red-400" size={18} />,
        info: <Info className="text-blue-400" size={18} />,
        loading: <Loader2 className="text-blue-400 animate-spin" size={18} />
    };

    const colors = {
        success: 'border-emerald-500/20 bg-emerald-500/5',
        error: 'border-red-500/20 bg-red-500/5',
        info: 'border-blue-500/20 bg-blue-500/5',
        loading: 'border-blue-500/20 bg-blue-500/5'
    };

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm animate-fade-in">
            <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md bg-[var(--bg-card)] border-[var(--border-color)] ${colors[type]}`}>
                <div className="shrink-0">{icons[type]}</div>
                <div className="flex-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] truncate">{message}</div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-[var(--bg-main)] text-[var(--text-secondary)] transition-all active:scale-90"
                >
                    <X size={14} />
                </button>
            </div>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-[var(--border-color)] w-full overflow-hidden rounded-b-2xl opacity-40">
                <div className={`h-full animate-toast-progress ${type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
            </div>
        </div>

    );
};

export default Toast;
