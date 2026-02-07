import React, { useEffect } from 'react';
import { PartyPopper } from 'lucide-react';

const SuccessCelebration = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[var(--bg-main)]/95 backdrop-blur-2xl animate-fade-in p-6 text-center transition-colors duration-500">
            <div className="relative mb-8">
                <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center animate-bounce shadow-2xl">
                    <PartyPopper size={56} className="text-blue-500" />
                </div>
                {/* Decorative particles */}
                <div className="absolute -top-4 -left-4 w-5 h-5 bg-purple-500 rounded-full animate-ping opacity-50" />
                <div className="absolute top-10 -right-8 w-4 h-4 bg-emerald-500 rounded-full animate-ping delay-75 opacity-50" />
                <div className="absolute -bottom-6 right-12 w-6 h-6 bg-orange-500 rounded-full animate-ping delay-150 opacity-50" />
            </div>

            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-3 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-blue-500 to-indigo-600">MISSION COMPLETE</h2>
            <p className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em] text-[10px] max-w-[240px] leading-relaxed opacity-70">
                {message || "Data synchronized with global systems"}
            </p>

            <div className="mt-12 flex gap-1.5">
                <div className="w-16 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/20" />
                <div className="w-2 h-1.5 bg-[var(--border-color)] rounded-full" />
                <div className="w-2 h-1.5 bg-[var(--border-color)] rounded-full" />
            </div>
        </div>

    );
};

export default SuccessCelebration;
