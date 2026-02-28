import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const SuccessCelebration = ({ message, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const enterTimer = setTimeout(() => setVisible(true), 10);

        // Auto-dismiss after 1.8 detik
        const exitTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // tunggu animasi keluar
        }, 1800);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
        };
    }, [onClose]);

    return (
        <div
            className="absolute top-4 left-1/2 z-[150] transition-all duration-300"
            style={{
                transform: `translateX(-50%) translateY(${visible ? '0px' : '-80px'})`,
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 cursor-pointer"
                style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    backgroundColor: 'var(--bg-card)',
                    minWidth: '220px',
                    maxWidth: '300px',
                }}
                onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                }}
            >
                {/* Icon */}
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-400 leading-tight">
                        Berhasil!
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-snug truncate mt-0.5">
                        {message || 'Data tersimpan'}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                            animation: visible ? 'shrink-bar 1.8s linear forwards' : 'none',
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes shrink-bar {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default SuccessCelebration;
