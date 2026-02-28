import React, { useState } from 'react';

// Visual star component with glow effect
const StarIcon = ({ filled, hovered, onClick, onMouseEnter, onMouseLeave, index }) => {
    const active = filled || hovered;
    return (
        <button
            type="button"
            onClick={() => onClick(index)}
            onMouseEnter={() => onMouseEnter(index)}
            onMouseLeave={onMouseLeave}
            className="focus:outline-none transition-all duration-150 active:scale-90"
            style={{ transform: active ? 'scale(1.15)' : 'scale(1)' }}
        >
            <svg viewBox="0 0 24 24" width="40" height="40" className="transition-all duration-150"
                style={{
                    filter: active ? 'drop-shadow(0 0 8px rgba(251,191,36,0.6))' : 'none',
                }}>
                <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={active ? '#fbbf24' : 'none'}
                    stroke={active ? '#fbbf24' : '#374151'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent! ⭐'];

const ReviewModal = ({ onClose, onSubmit }) => {
    const [action, setAction] = useState('close');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);

    const handleSubmit = () => {
        onSubmit({ action, comment, rating });
    };

    const BRAND = 'linear-gradient(135deg, #f28367 0%, #ff5282 100%)';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--bg-card)] w-full max-w-sm rounded-[2.5rem] p-7 pt-9 shadow-2xl border border-[var(--border-color)] text-center relative overflow-hidden transition-colors duration-300">

                {/* Brand top strip */}
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: BRAND }} />

                <h3 className="text-xl font-black text-[var(--text-primary)] mb-1 mt-2 tracking-tight">Review Action</h3>
                <p className="text-[10px] text-[var(--text-secondary)] mb-7 font-black uppercase tracking-[0.2em] opacity-50">Verify task completion</p>

                {/* Action Toggle */}
                <div className="flex bg-[var(--bg-main)] rounded-2xl p-1.5 mb-7 shadow-inner border border-[var(--border-color)]">
                    <button
                        onClick={() => setAction('close')}
                        className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        style={action === 'close' ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', boxShadow: '0 4px 12px rgba(16,185,129,0.35)' } : { color: 'var(--text-secondary)' }}
                    >
                        ✓ Approve
                    </button>
                    <button
                        onClick={() => setAction('reopen')}
                        className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        style={action === 'reopen' ? { background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', boxShadow: '0 4px 12px rgba(239,68,68,0.35)' } : { color: 'var(--text-secondary)' }}
                    >
                        ↩ Reopen
                    </button>
                </div>

                <div className="min-h-[160px]">
                    {action === 'close' ? (
                        <div className="animate-fade-in">
                            <p className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-[0.2em] mb-5 opacity-60">
                                Rate the work quality
                            </p>

                            {/* Star Rating */}
                            <div className="flex justify-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <StarIcon
                                        key={star}
                                        index={star}
                                        filled={star <= rating}
                                        hovered={star <= hovered && hovered > 0}
                                        onClick={(s) => setRating(s)}
                                        onMouseEnter={(s) => setHovered(s)}
                                        onMouseLeave={() => setHovered(0)}
                                    />
                                ))}
                            </div>

                            {/* Rating label */}
                            <div className="h-8 flex items-center justify-center">
                                {(hovered > 0 || rating > 0) ? (
                                    <span className="text-sm font-black"
                                        style={{ color: hovered > 0 ? '#fbbf24' : (rating === 5 ? '#10b981' : '#f59e0b') }}>
                                        {RATING_LABELS[hovered || rating]}
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-[var(--text-secondary)] opacity-40 uppercase tracking-widest font-black">
                                        Tap a star to rate
                                    </span>
                                )}
                            </div>

                            {/* Star count display */}
                            {rating > 0 && (
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <div key={s} className="w-1.5 h-1.5 rounded-full transition-all"
                                            style={{ background: s <= rating ? '#fbbf24' : 'var(--border-color)' }} />
                                    ))}
                                    <span className="text-[9px] font-black text-[var(--text-secondary)] ml-2 opacity-60">{rating}/5</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="animate-fade-in text-left">
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-[0.2em] block mb-3 opacity-60">
                                Reason for Reopening
                            </label>
                            <textarea
                                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm focus:outline-none resize-none h-28 shadow-inner placeholder-[var(--text-secondary)]/30 transition-all font-medium"
                                style={{ focusBorderColor: '#ff5282' }}
                                placeholder="Why is this task not complete? Please specify..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 text-[var(--text-secondary)] font-black uppercase tracking-widest rounded-2xl border border-[var(--border-color)] hover:bg-[var(--bg-main)] transition-all text-[10px] active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={action === 'close' && rating === 0}
                        className="flex-2 px-8 py-3.5 text-white font-black uppercase tracking-widest rounded-2xl transition-all text-[10px] shadow-xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                            background: (action === 'close' && rating === 0) ? 'var(--border-color)' : BRAND,
                            boxShadow: (action === 'close' && rating === 0) ? 'none' : '0 8px 20px rgba(255,82,130,0.35)',
                            flex: 1.5
                        }}
                    >
                        {action === 'close' ? '✓ Confirm' : '↩ Reopen'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
