import React from 'react';
import { X, Maximize2 } from 'lucide-react';
import ObservationCard from './ObservationCard';

const getDirectImageUrl = (url) => {
    if (!url) return null;
    if (typeof url !== 'string') return null;
    if (url.startsWith('blob:')) return url;
    if (url.includes('googleusercontent.com')) return url;
    if (url.includes('drive.google.com')) {
        const idMatch = url.match(/id=([^&]+)/) || url.match(/\/d\/([^/]+)/);
        if (idMatch) return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
    return url;
};

const DetailModal = ({ obs, currentUser, onClose, onTakeAction, onReview }) => {
    if (!obs) return null;

    const isAssignee = obs.assigneeName === currentUser.username;
    const isCreator = obs.creatorName === currentUser.username;

    // Logic to extract image URL (same as FeedCard)
    const imageUrl = getDirectImageUrl(obs.raw?.fotoUrl || obs.raw?.gambar || obs.raw?.files?.[0]?.url);

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in py-4 sm:py-0 overflow-y-auto">
            <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl relative flex flex-col max-h-[95vh] transition-colors duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[var(--bg-main)]/80 backdrop-blur text-[var(--text-primary)] flex items-center justify-center hover:bg-[var(--bg-main)] transition-all shadow-lg border border-[var(--border-color)]"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="overflow-y-auto custom-scrollbar flex-1 pb-10">

                    {/* Image Section */}
                    {imageUrl && (
                        <div className="relative w-full h-72 sm:h-80 bg-[var(--bg-main)] group">
                            <img
                                src={imageUrl}
                                className="w-full h-full object-cover"
                                alt="Evidence"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-80"></div>
                            <div className="absolute bottom-0 left-0 p-6 z-10">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/10 shadow-lg mb-2 inline-block
                                    ${obs.title.includes('Unsafe') ? 'bg-red-500 text-white' :
                                        obs.title.includes('Safe') ? 'bg-emerald-500 text-white' :
                                            'bg-blue-500 text-white'}`}>
                                    {obs.title}
                                </span>
                            </div>
                            <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 p-2.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                                <Maximize2 size={16} />
                            </a>
                        </div>
                    )}

                    {!imageUrl && (
                        <div className="pt-16 pb-6 px-6 text-center">
                            <h2 className="text-xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                                Observation Detail
                            </h2>
                        </div>
                    )}

                    <div className="px-6 pb-6 relative z-10 -mt-6">
                        {/* Re-use the ObservationCard logic which handles status, history, actions nicely */}
                        <ObservationCard
                            obs={obs}
                            isAssignee={isAssignee}
                            isCreator={isCreator}
                            onTakeAction={onTakeAction}
                            onReview={onReview}
                            showFull={true}
                        />

                        {/* Additional Metadata */}
                        <div className="mt-4 pt-6 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-4 bg-[var(--bg-main)]/50 p-5 rounded-3xl shadow-inner transition-colors">
                            <div className="flex justify-between items-center">
                                <span className="font-black uppercase tracking-tighter opacity-60">Report ID</span>
                                <span className="font-mono text-blue-500 font-bold">{obs.id.slice(-8)}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-black uppercase tracking-tighter opacity-60">Location</span>
                                <span className="text-[var(--text-primary)] font-bold">{obs.location}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-black uppercase tracking-tighter opacity-60">Category</span>
                                <span className="text-[var(--text-primary)] font-bold">{obs.title}</span>
                            </div>
                            {obs.raw?.timestamp && (
                                <div className="flex justify-between flex-col gap-1">
                                    <span className="font-black uppercase tracking-tighter opacity-60">Full Timestamp</span>
                                    <span className="text-[var(--text-primary)] font-medium text-[10px]">{new Date(obs.raw.timestamp).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'medium' })}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default DetailModal;
