import { Plus, User, Clock, RefreshCw, Check, Star } from 'lucide-react';
import { getHDImageUrl } from '../utils/imageUtils';

const ActionStory = ({ history }) => {
    // Fallback if history is undefined or empty
    const displayHistory = history && history.length > 0 ? history : [
        { action: 'No history available', timestamp: '', user: 'System', comment: '' }
    ];

    return (
        <div className="pl-2 pt-2">
            <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-transparent">
                {displayHistory.map((item, index) => (
                    <div key={index} className="relative group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className={`absolute -left-6 w-5 h-5 rounded-full border-2 border-[var(--bg-main)] flex items-center justify-center
                            ${item.action === 'Created' ? 'bg-blue-500' :
                                item.action === 'Assigned' ? 'bg-purple-500' :
                                    item.action === 'Action Taken' ? 'bg-amber-500' :
                                        item.action === 'Reopened' ? 'bg-red-500' :
                                            'bg-emerald-500'}`}>
                            {item.action === 'Created' && <Plus size={10} className="text-white" />}
                            {item.action === 'Assigned' && <User size={10} className="text-white" />}
                            {item.action === 'Action Taken' && <Clock size={10} className="text-white" />}
                            {item.action === 'Reopened' && <RefreshCw size={10} className="text-white" />}
                            {(item.action === 'Closed' || item.action === 'Completed') && <Check size={10} className="text-white" />}
                        </div>
                        <div className="bg-[var(--bg-card)] p-3 rounded-xl border-2 border-[var(--border-color)] border-l-4 border-l-transparent hover:border-l-blue-400 transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-sm text-[var(--text-primary)]">{item.action}</h4>
                                <span className="text-[10px] text-[var(--text-secondary)]">{item.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                                    {(item.user && item.user[0]) || '?'}
                                </div>
                                <span className="text-xs text-[var(--text-primary)] font-medium">{item.user || 'Unknown User'}</span>
                            </div>
                            {item.comment && (
                                <div className="text-xs text-[var(--text-secondary)] italic bg-[var(--border-color)]/30 p-2 rounded-lg border border-[var(--border-color)]">
                                    "{item.comment}"
                                </div>
                            )}
                            {item.proofUrl && (
                                <div className="mt-2 rounded-lg overflow-hidden border-2 border-[var(--border-color)]">
                                    <img
                                        src={getHDImageUrl(item.proofUrl)}
                                        referrerPolicy="no-referrer"
                                        crossOrigin="anonymous"
                                        alt="Action Proof"
                                        className="hd-image !h-32"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {item.rating && (
                                <div className="flex gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className={i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActionStory;
