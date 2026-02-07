/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', 'box-shadow': '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '70%': { transform: 'scale(1)', 'box-shadow': '0 0 0 10px rgba(239, 68, 68, 0)' },
          '100%': { transform: 'scale(0.8)', 'box-shadow': '0 0 0 0 rgba(239, 68, 68, 0)' },
        },
      },
    },
  },
  plugins: [],
}