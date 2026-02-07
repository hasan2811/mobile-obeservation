import React, { useState } from 'react';

const ReviewModal = ({ onClose, onSubmit }) => {
    const [action, setAction] = useState('close'); // 'close' or 'reopen'
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = () => {
        onSubmit({ action, comment, rating });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in shadow-2xl">
            <div className="bg-[var(--bg-card)] w-full max-w-sm rounded-[2.5rem] p-7 pt-9 shadow-2xl border border-[var(--border-color)] text-center relative overflow-hidden transition-colors duration-300">

                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>

                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2 mt-2 tracking-tight">Review Action</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-8 px-6 font-bold uppercase tracking-widest opacity-60">Verify task completion details</p>

                <div className="flex bg-[var(--bg-main)] rounded-2xl p-1.5 mb-8 shadow-inner border border-[var(--border-color)]">
                    <button
                        onClick={() => setAction('close')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${action === 'close' ? 'bg-emerald-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                        Approve
                    </button>
                    <button
                        onClick={() => setAction('reopen')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${action === 'reopen' ? 'bg-red-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                        Reopen
                    </button>
                </div>

                <div className="px-2 min-h-[140px]">
                    {action === 'close' ? (
                        <div className="animate-fade-in">
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-[0.2em] block mb-4 opacity-70">Rate Experience</label>
                            <div className="flex justify-center gap-3 mb-5">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} onClick={() => setRating(star)} className="focus:outline-none text-4xl transition-transform hover:scale-110 active:scale-95 drop-shadow-sm">
                                        <span style={{ color: star <= rating ? '#fbbf24' : 'var(--border-color)' }}>★</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 h-4">
                                {rating > 0 ? (rating === 5 ? "Excellent work!" : "Verified & Rated") : "Provide a rating"}
                            </p>
                        </div>
                    ) : (
                        <div className="animate-fade-in text-left">
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-[0.2em] block mb-3 opacity-70">Rejection Reason</label>
                            <textarea
                                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm focus:border-red-500/50 focus:outline-none resize-none h-28 shadow-inner placeholder-[var(--text-secondary)]/30 transition-all font-medium"
                                placeholder="Why is this task not complete? Please specify..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mt-8">
                    <button onClick={onClose} className="flex-1 py-4 text-[var(--text-secondary)] font-black uppercase tracking-widest hover:text-[var(--text-primary)] rounded-2xl hover:bg-[var(--bg-main)] transition-all text-[10px]">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={action === 'close' && rating === 0}
                        className="flex-1 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest rounded-2xl py-4 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs shadow-xl active:scale-95">
                        Confirm
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ReviewModal;
