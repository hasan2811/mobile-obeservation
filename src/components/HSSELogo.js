import React from 'react';

// ──────────────────────────────────────────────────
// HSSELogo — Komponen logo resmi HSSE.Tech
// Gunakan prop `size` dalam pixel (default: 32)
// Gunakan prop `className` untuk styling tambahan
// ──────────────────────────────────────────────────
const HSSELogo = ({ size = 32, className = '' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        aria-label="HSSE Tech Logo"
    >
        <defs>
            <linearGradient id="hsseLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f28367" />
                <stop offset="100%" stopColor="#ff5282" />
            </linearGradient>
        </defs>
        <path
            fill="url(#hsseLogoGrad)"
            fillRule="evenodd"
            d="M 0 15 L 25 0 L 50 15 L 75 0 L 100 15 L 100 70 L 50 100 L 0 70 Z M 25 25 L 50 40 L 75 25 L 75 60 L 50 75 L 25 60 Z"
        />
    </svg>
);

// Brand gradient CSS string (untuk inline style)
export const BRAND_GRADIENT = 'linear-gradient(135deg, #f28367 0%, #ff5282 100%)';
export const BRAND_COLOR_FROM = '#f28367';  // coral
export const BRAND_COLOR_TO = '#ff5282';    // hot pink

// Brand gradient Tailwind-style untuk className
export const BRAND_GRADIENT_CLASS = 'bg-gradient-to-br from-[#f28367] to-[#ff5282]';
export const BRAND_TEXT_CLASS = 'bg-gradient-to-br from-[#f28367] to-[#ff5282] bg-clip-text text-transparent';

export default HSSELogo;
