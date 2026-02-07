import React from 'react';
import { Home, List, FileText, Plus, Grid } from 'lucide-react';

const BottomNav = ({ activeTab, onChangeTab, onAddClick, pendingTasksCount, reviewCount }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-panel border-t border-[var(--border-color)] pb-2 pt-2 px-6 flex justify-between items-end z-40 bg-[var(--bg-main)]/90 backdrop-blur-xl h-[88px] transition-colors duration-300">
            <button
                onClick={() => onChangeTab('dashboard')}
                className={`flex flex-col items-center gap-1 w-14 pb-4 transition-colors ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-slate-500'}`}>
                <Home size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
                <span className="text-[10px] font-medium uppercase tracking-tighter">Home</span>
            </button>

            <button
                onClick={() => onChangeTab('feed')}
                className={`flex flex-col items-center gap-1 w-14 pb-4 transition-colors ${activeTab === 'feed' ? 'text-blue-500' : 'text-slate-500'}`}>
                <Grid size={24} strokeWidth={activeTab === 'feed' ? 2.5 : 2} />
                <span className="text-[10px] font-medium uppercase tracking-tighter">Feed</span>
            </button>

            <div className="relative -top-8">
                <button
                    onClick={onAddClick}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border-4 border-[var(--bg-main)] transition-all active:scale-95 hover:scale-105">
                    <Plus size={32} />
                </button>
            </div>

            <button
                onClick={() => onChangeTab('tasks')}
                className={`flex flex-col items-center gap-1 w-14 pb-4 transition-colors ${activeTab === 'tasks' ? 'text-blue-500' : 'text-slate-500'}`}>
                <div className="relative">
                    <List size={24} strokeWidth={activeTab === 'tasks' ? 2.5 : 2} />
                    {pendingTasksCount > 0 &&
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[var(--bg-main)]"></span>
                    }
                </div>
                <span className="text-[10px] font-medium uppercase tracking-tighter">Tasks</span>
            </button>

            <button
                onClick={() => onChangeTab('activity')}
                className={`flex flex-col items-center gap-1 w-14 pb-4 transition-colors ${activeTab === 'activity' ? 'text-blue-500' : 'text-slate-500'}`}>
                <div className="relative">
                    <FileText size={24} strokeWidth={activeTab === 'activity' ? 2.5 : 2} />
                    {reviewCount > 0 &&
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-[var(--bg-main)] animate-pulse"></span>
                    }
                </div>
                <span className="text-[10px] font-medium uppercase tracking-tighter">Activity</span>
            </button>
        </div>

    );
};

export default BottomNav;
