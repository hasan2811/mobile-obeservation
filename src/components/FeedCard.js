import React from 'react';
import { MapPin, Clock, User, ArrowRight } from 'lucide-react';

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

const FeedCard = ({ obs, onClick }) => {
    // Check if obs.raw.files exists, else fall back to fotoUrl or standard method
    let imageUrl = null;
    if (obs.raw && obs.raw.files && obs.raw.files.length > 0) {
        // This implies the backend or local state has files array. 
        // If it's a new local upload (Base64), we might need to handle it.
        // But usually we sync 'id' or 'url'.
        // Let's assume obs.raw.fotoUrl exists from backend or we find a way.
    }

    // Fallback: Try to find image url in raw data
    imageUrl = getDirectImageUrl(obs.raw?.fotoUrl || obs.raw?.gambar || obs.raw?.files?.[0]?.url);

    // If no image, maybe show a gradient placeholder or a pattern
    const hasImage = !!imageUrl;

    return (
        <article
            onClick={() => onClick(obs)}
            className="group relative w-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-[#1e293b] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer mb-6"
        >
            <div className={`relative ${hasImage ? 'h-[400px]' : 'h-[200px]'} w-full`}>
                {hasImage ? (
                    <>
                        <img
                            src={imageUrl}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={obs.title}
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent opacity-90" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 shadow-lg 
                            ${obs.title.includes('Unsafe') ? 'bg-red-500/80 text-white' :
                                obs.title.includes('Safe') ? 'bg-emerald-500/80 text-white' :
                                    'bg-blue-500/80 text-white'}`}>
                            {obs.title}
                        </span>
                    </div>

                    <div className="space-y-2 mb-2">
                        <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
                            {obs.description}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-gray-300 font-medium">
                            <div className="flex items-center gap-1">
                                <MapPin size={14} className="text-blue-400" />
                                {obs.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={14} className="text-amber-400" />
                                {obs.history[0]?.timestamp}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white border border-white/20">
                                {obs.creatorName[0]}
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Reported By</p>
                                <p className="text-xs text-white font-semibold">{obs.creatorName}</p>
                            </div>
                        </div>

                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5
                            ${obs.status === 'Closed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                obs.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                            {obs.status}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default FeedCard;
