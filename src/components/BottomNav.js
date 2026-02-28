import React from 'react';
import { Home, List, FileText, Plus, Grid } from 'lucide-react';

// Brand color untuk active state
const BRAND_ACTIVE_STYLE = {
    background: 'linear-gradient(135deg, #f28367, #ff5282)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
};

const NavBtn = ({ label, icon: Icon, isActive, onClick, badge, badgeColor }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 w-14 pb-3 transition-all active:scale-90">
        <div className="relative">
            <Icon
                size={23}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={isActive ? { color: '#ff5282' } : { color: '#64748b' }}
            />
            {badge > 0 && (
                <span className={`absolute -top-1.5 -right-2 min-w-[16px] h-4 ${badgeColor} rounded-full border border-[var(--bg-main)] flex items-center justify-center text-[8px] font-black text-white px-0.5`}>
                    {badge > 9 ? '9+' : badge}
                </span>
            )}
        </div>
        <span
            className="text-[9px] font-black uppercase tracking-tighter"
            style={isActive ? BRAND_ACTIVE_STYLE : { color: '#64748b' }}
        >
            {label}
        </span>
    </button>
);

const BottomNav = ({ activeTab, onChangeTab, onAddClick, pendingTasksCount, reviewCount, newFeedCount }) => {
    return (
        <div
            className="shrink-0 border-t border-[var(--border-color)] px-4 flex justify-between items-end z-40 bg-[var(--bg-main)]/95 backdrop-blur-2xl transition-colors duration-300"
            style={{ height: '72px', WebkitBackdropFilter: 'blur(24px)', paddingBottom: '8px', paddingTop: '6px' }}
        >
            <NavBtn label="Home" icon={Home} isActive={activeTab === 'dashboard'} onClick={() => onChangeTab('dashboard')} />
            <NavBtn label="Feed" icon={Grid} isActive={activeTab === 'feed'} onClick={() => onChangeTab('feed')}
                badge={newFeedCount} badgeColor="bg-[#ff5282] animate-bounce" />

            {/* FAB Add Button — brand gradient */}
            <div className="relative -top-7">
                <button
                    onClick={onAddClick}
                    className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-white border-4 border-[var(--bg-main)] transition-all active:scale-90 hover:scale-110"
                    style={{
                        background: 'linear-gradient(135deg, #f28367 0%, #ff5282 100%)',
                        boxShadow: '0 8px 24px rgba(255,82,130,0.4)',
                    }}
                >
                    <Plus size={28} strokeWidth={2.5} />
                </button>
                {/* Glow ring behind FAB */}
                <div className="absolute inset-0 rounded-full blur-lg opacity-30 -z-10"
                    style={{ background: 'linear-gradient(135deg, #f28367, #ff5282)' }} />
            </div>

            <NavBtn label="Tasks" icon={List} isActive={activeTab === 'tasks'} onClick={() => onChangeTab('tasks')}
                badge={pendingTasksCount} badgeColor="bg-red-500 animate-pulse" />
            <NavBtn label="Reports" icon={FileText} isActive={activeTab === 'activity'} onClick={() => onChangeTab('activity')}
                badge={reviewCount} badgeColor="bg-amber-500 animate-pulse" />
        </div>
    );
};

export default BottomNav;
