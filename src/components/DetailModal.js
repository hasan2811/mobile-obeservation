import { X, Maximize2, Trash2, MapPin, User, Users, Tag, Building2, ShieldAlert, CheckCircle2, Clock, Camera, FileText, Star, Check, AlertTriangle, RefreshCw, Plus } from 'lucide-react';
import { getHDImageUrl } from '../utils/imageUtils';

const StatusBadge = ({ status }) => {
    const cfg = {
        'Open': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/40', dot: 'bg-blue-400' },
        'Pending': { color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', dot: 'bg-amber-400' },
        'Closed': { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', dot: 'bg-emerald-400' },
    }[status] || { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', dot: 'bg-slate-400' };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            {status}
        </span>
    );
};

const InfoRow = ({ icon: Icon, label, value, accent }) => {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-color)] last:border-0">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] min-w-0">
                <Icon size={13} className="shrink-0 opacity-60" />
                <span className="text-[10px] font-black uppercase tracking-[0.12em] opacity-70">{label}</span>
            </div>
            <span className={`text-xs font-bold text-right truncate max-w-[55%] ${accent || 'text-[var(--text-primary)]'}`}>{value}</span>
        </div>
    );
};

const PhotoSection = ({ url, label, badge }) => {
    const hd = getHDImageUrl(url);
    if (!hd) return null;
    return (
        <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-lg group">
            <img
                src={hd}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                alt={label}
                loading="eager"
                className="w-full object-cover max-h-64"
                style={{ display: 'block' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/80">{label}</span>
                {badge && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${badge.includes('Unsafe') ? 'bg-red-500' : badge.includes('Safe') ? 'bg-emerald-500' : badge.includes('Nearmiss') ? 'bg-orange-500' : 'bg-blue-500'}`}>
                        {badge}
                    </span>
                )}
            </div>
            <a
                href={hd}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg"
            >
                <Maximize2 size={14} />
            </a>
        </div>
    );
};

const TimelineItem = ({ item, index }) => {
    const actionCfg = {
        'Created': { bg: 'bg-blue-500', icon: <Plus size={9} className="text-white" />, border: 'border-l-blue-500' },
        'Action Taken': { bg: 'bg-amber-500', icon: <Check size={9} className="text-white" />, border: 'border-l-amber-500' },
        'Action Taken (Syncing...)': { bg: 'bg-amber-400', icon: <Clock size={9} className="text-white" />, border: 'border-l-amber-400' },
        'Closed': { bg: 'bg-emerald-500', icon: <CheckCircle2 size={9} className="text-white" />, border: 'border-l-emerald-500' },
        'Verified & Closed': { bg: 'bg-emerald-500', icon: <CheckCircle2 size={9} className="text-white" />, border: 'border-l-emerald-500' },
        'Reopened': { bg: 'bg-red-500', icon: <RefreshCw size={9} className="text-white" />, border: 'border-l-red-500' },
    };
    const cfg = actionCfg[item.action] || { bg: 'bg-slate-500', icon: <Clock size={9} className="text-white" />, border: 'border-l-slate-500' };
    const proofUrl = getHDImageUrl(item.proofUrl);

    return (
        <div className="relative pl-7 pb-5 last:pb-0 animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
            {/* Vertical line */}
            <div className="absolute left-2.5 top-5 bottom-0 w-px bg-gradient-to-b from-[var(--border-color)] to-transparent" />
            {/* Dot */}
            <div className={`absolute left-0 top-0 w-5 h-5 rounded-full ${cfg.bg} flex items-center justify-center shadow-md border-2 border-[var(--bg-card)]`}>
                {cfg.icon}
            </div>

            <div className={`bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] border-l-4 ${cfg.border} p-3.5 shadow-sm space-y-2`}>
                {/* Action title + time */}
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] leading-tight">{item.action}</h4>
                    <span className="text-[10px] text-[var(--text-secondary)] whitespace-nowrap shrink-0">{item.timestamp}</span>
                </div>
                {/* User */}
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {item.user?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] font-medium">{item.user || 'Unknown'}</span>
                </div>
                {/* Comment/Notes */}
                {item.comment && (
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-2.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1 opacity-60">Notes</p>
                        <p className="text-xs text-[var(--text-primary)] leading-relaxed">{item.comment}</p>
                    </div>
                )}
                {/* Proof Photo */}
                {proofUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-amber-500/30 group cursor-pointer shadow-md">
                        <img
                            src={proofUrl}
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            alt="Action Proof"
                            className="w-full object-cover"
                            style={{ maxHeight: '180px' }}
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <Camera size={10} className="text-amber-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-amber-300">Action Proof</span>
                            </div>
                            <a
                                href={proofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-black/50 rounded-full text-white opacity-70 hover:opacity-100 transition-all"
                                onClick={e => e.stopPropagation()}
                            >
                                <Maximize2 size={10} />
                            </a>
                        </div>
                    </div>
                )}
                {/* Star Rating */}
                {item.rating && (
                    <div className="flex items-center gap-1 pt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const DetailModal = ({ obs, currentUser, onClose, onTakeAction, onReview, onDelete }) => {
    if (!obs) return null;

    const isAssignee = obs.assigneeName === currentUser.username;
    const isCreator = obs.creatorName === currentUser.username;

    // Observation original photo
    const imageUrl = getHDImageUrl(obs.raw?.fotoUrl || obs.raw?.gambar || obs.raw?.files?.[0]?.url);
    // Proof photo from Take Action
    const proofUrl = getHDImageUrl(obs.raw?.proofUrl);

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto py-4 sm:py-6">
            <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl relative flex flex-col max-h-[95vh] transition-colors duration-300">

                {/* Sticky Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-md rounded-t-[2.5rem]">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-60 mb-0.5">Observation Detail</p>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={obs.status} />
                            <span className="text-[9px] font-mono text-[var(--text-secondary)] opacity-50">#{obs.id?.slice(-6)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isCreator && obs.status !== 'Closed' && (
                            <button
                                onClick={() => {
                                    if (window.confirm('⚠️ Delete this observation? This action cannot be undone.')) {
                                        onDelete(obs);
                                    }
                                }}
                                className="w-9 h-9 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/30"
                                title="Delete"
                            >
                                <Trash2 size={15} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center justify-center hover:text-[var(--text-primary)] transition-all border border-[var(--border-color)]"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto custom-scrollbar flex-1 p-5 space-y-5">

                    {/* ─── SECTION 1: Foto Observation ─── */}
                    {imageUrl && (
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-60 mb-2 flex items-center gap-1.5">
                                <Camera size={10} /> Observation Photo
                            </p>
                            <PhotoSection url={imageUrl} label="Incident Photo" badge={obs.title} />
                        </div>
                    )}

                    {/* ─── SECTION 2: Info Utama ─── */}
                    <div className="bg-[var(--bg-main)] rounded-2xl p-4 border border-[var(--border-color)] space-y-0">
                        <div className="mb-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 ${obs.title?.includes('Unsafe') ? 'bg-red-500/20 text-red-400' : obs.title?.includes('Safe') ? 'bg-emerald-500/20 text-emerald-400' : obs.title?.includes('Nearmiss') ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {obs.title}
                            </span>
                            <h2 className="text-base font-bold text-[var(--text-primary)] leading-snug">{obs.description}</h2>
                        </div>
                        <InfoRow icon={Tag} label="Sub Category" value={obs.raw?.subCategory} accent="text-purple-400" />
                        <InfoRow icon={Building2} label="Company" value={obs.raw?.company} />
                        <InfoRow icon={MapPin} label="Location" value={obs.location} accent="text-blue-400" />
                        <InfoRow icon={User} label="Reported By" value={obs.creatorName} />
                        <InfoRow icon={Users} label="Assigned To" value={obs.assigneeName} accent="text-amber-400" />
                        <InfoRow icon={Clock} label="Report Time" value={obs.raw?.timestamp ? new Date(obs.raw.timestamp).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' }) : null} />
                    </div>

                    {/* ─── SECTION 3: Rekomendasi ─── */}
                    {obs.recommendation && (
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2 flex items-center gap-1.5">
                                <ShieldAlert size={10} /> Corrective Action Recommendation
                            </p>
                            <p className="text-sm text-[var(--text-primary)] leading-relaxed italic">"{obs.recommendation}"</p>
                        </div>
                    )}

                    {/* ─── SECTION 4: Foto Bukti Take Action ─── */}
                    {proofUrl && (
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2 flex items-center gap-1.5">
                                <Camera size={10} /> Action Evidence
                            </p>
                            <PhotoSection url={proofUrl} label="Action Completion Photo" />
                            {obs.raw?.actionNotes && (
                                <div className="mt-2 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-3.5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1">
                                        <FileText size={9} /> Action Notes
                                    </p>
                                    <p className="text-sm text-[var(--text-primary)] leading-relaxed">{obs.raw.actionNotes}</p>
                                    {obs.raw.actionBy && (
                                        <p className="text-[10px] text-[var(--text-secondary)] mt-2 font-medium">
                                            By: <span className="text-amber-400 font-bold">{obs.raw.actionBy}</span>
                                            {obs.raw.actionDate && <span className="ml-2 opacity-60">• {new Date(obs.raw.actionDate).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─── SECTION 5: Timeline / Action Story ─── */}
                    {obs.history && obs.history.length > 0 && (
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-60 mb-3 flex items-center gap-1.5">
                                <Clock size={10} /> Activity History
                            </p>
                            <div className="space-y-0">
                                {obs.history.map((item, i) => (
                                    <TimelineItem key={i} item={item} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ─── SECTION 6: Action Buttons ─── */}
                    <div className="pt-2 space-y-3">
                        {isAssignee && obs.status === 'Open' && (
                            <button
                                onClick={() => onTakeAction(obs.id)}
                                className="w-full text-white py-3.5 rounded-2xl text-sm font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #f28367 0%, #ff5282 100%)', boxShadow: '0 8px 20px rgba(255,82,130,0.3)' }}
                            >
                                <Check size={18} /> Take Action
                            </button>
                        )}
                        {isCreator && obs.status === 'Pending' && (
                            <button
                                onClick={() => onReview(obs.id)}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Star size={18} /> Review & Close
                            </button>
                        )}
                        {obs.status === 'Closed' && (
                            <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} /> Observation Closed
                            </div>
                        )}
                        {obs.status === 'Open' && !isAssignee && (
                            <div className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-secondary)] py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 opacity-60">
                                <AlertTriangle size={14} /> Waiting for action from {obs.assigneeName}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DetailModal;
