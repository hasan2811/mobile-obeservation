import React from 'react';

// Pulse animation style
const pulse = { animation: 'skeleton-pulse 1.5s ease-in-out infinite' };

const SkeletonBox = ({ w = 'w-full', h = 'h-4', rounded = 'rounded-xl', className = '' }) => (
    <div
        className={`${w} ${h} ${rounded} ${className} bg-[var(--border-color)]`}
        style={pulse}
    />
);

// Dashboard skeleton
export const DashboardSkeleton = () => (
    <div className="p-5 pb-24 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
                <SkeletonBox w="w-36" h="h-7" rounded="rounded-lg" />
                <SkeletonBox w="w-24" h="h-3" rounded="rounded-md" />
            </div>
            <SkeletonBox w="w-11" h="h-11" rounded="rounded-2xl" />
        </div>
        {/* Chart */}
        <div className="bg-[var(--bg-card)] rounded-[2.5rem] p-6 border border-[var(--border-color)] space-y-4">
            <div className="flex justify-between">
                <SkeletonBox w="w-40" h="h-4" rounded="rounded-md" />
                <SkeletonBox w="w-24" h="h-8" rounded="rounded-xl" />
            </div>
            <SkeletonBox w="w-full" h="h-48" rounded="rounded-2xl" />
            <div className="flex gap-4">
                {[1, 2, 3].map(i => <SkeletonBox key={i} w="w-16" h="h-3" rounded="rounded-md" />)}
            </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[var(--bg-card)] p-6 rounded-[2.5rem] border border-[var(--border-color)] space-y-3">
                    <SkeletonBox w="w-20" h="h-3" rounded="rounded-md" />
                    <SkeletonBox w="w-12" h="h-10" rounded="rounded-xl" />
                </div>
            ))}
        </div>
        {/* Nav Cards */}
        {[1, 2, 3].map(i => (
            <div key={i} className="bg-[var(--bg-card)] p-5 rounded-[2rem] border border-[var(--border-color)] flex justify-between items-center">
                <div className="space-y-2">
                    <SkeletonBox w="w-36" h="h-5" rounded="rounded-lg" />
                    <SkeletonBox w="w-48" h="h-3" rounded="rounded-md" />
                </div>
                <SkeletonBox w="w-12" h="h-12" rounded="rounded-2xl" />
            </div>
        ))}
    </div>
);

// Feed skeleton
export const FeedSkeleton = () => (
    <div className="p-5 pb-24 space-y-5 animate-fade-in">
        <div className="flex justify-between items-center">
            <SkeletonBox w="w-40" h="h-8" rounded="rounded-xl" />
            <SkeletonBox w="w-20" h="h-8" rounded="rounded-xl" />
        </div>
        <div className="flex justify-between items-center bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border-color)] overflow-hidden">
            <div className="w-full flex flex-col items-center justify-center p-10 pointer-events-none">
                <svg className="hsse-loader w-14 h-14 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
                    <g fill="#ff5282">
                        <rect x="10" y="54" width="100" height="14" rx="7" />
                        <path d="M 44 54 V 16 Q 60 8 76 16 V 54 Z" />
                        <path d="M 36 54 V 28 A 22 28 0 0 0 16 54 Z" />
                        <path d="M 84 54 V 28 A 22 28 0 0 1 104 54 Z" />
                    </g>
                    <g stroke="#f28367" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                        <path className="goggles" d="M 34 76 H 86 A 10 10 0 0 1 96 86 V 88 A 10 10 0 0 1 86 98 H 70 A 10 10 0 0 0 50 98 H 34 A 10 10 0 0 1 24 88 V 86 A 10 10 0 0 1 34 76 Z" />
                        <path d="M 12 82 V 92 M 108 82 V 92" />
                    </g>
                </svg>
                <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Syncing Data...</p>
            </div>
        </div>
        <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => <SkeletonBox key={i} w="w-24" h="h-9" rounded="rounded-xl" />)}
        </div>
        {[1, 2].map(i => (
            <div key={i} className="bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border-color)] overflow-hidden">
                <SkeletonBox w="w-full" h="h-48" rounded="rounded-none" />
                <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                        <SkeletonBox w="w-20" h="h-5" rounded="rounded-full" />
                        <SkeletonBox w="w-24" h="h-4" rounded="rounded-md" />
                    </div>
                    <SkeletonBox w="w-full" h="h-4" />
                    <SkeletonBox w="w-3/4" h="h-4" />
                    <SkeletonBox w="w-full" h="h-10" rounded="rounded-2xl" />
                </div>
            </div>
        ))}
    </div>
);

// Task skeleton
export const TaskSkeleton = () => (
    <div className="p-5 pb-24 space-y-4 animate-fade-in">
        <SkeletonBox w="w-48" h="h-8" rounded="rounded-xl" />
        {[1, 2, 3].map(i => (
            <div key={i} className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border-color)] space-y-3">
                <div className="flex justify-between">
                    <SkeletonBox w="w-20" h="h-5" rounded="rounded-full" />
                    <SkeletonBox w="w-28" h="h-4" rounded="rounded-md" />
                </div>
                <SkeletonBox w="w-full" h="h-5" rounded="rounded-lg" />
                <SkeletonBox w="w-3/4" h="h-4" rounded="rounded-md" />
                <SkeletonBox w="w-full" h="h-10" rounded="rounded-2xl" />
            </div>
        ))}
    </div>
);

// Add CSS to index via style injection
const skeletonCSS = `
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
`;

if (!document.getElementById('skeleton-css')) {
    const style = document.createElement('style');
    style.id = 'skeleton-css';
    style.textContent = skeletonCSS;
    document.head.appendChild(style);
}

export default SkeletonBox;
