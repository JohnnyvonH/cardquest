/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dungeon: {
          stone: '#2d2a3e',
          dark: '#1a1625',
          purple: '#433d5c',
          gold: '#fbbf24',
          blood: '#dc2626',
        },
      },
      backgroundImage: {
        'dungeon-gradient': 'linear-gradient(135deg, #1a1625 0%, #2d2a3e 50%, #1a1625 100%)',
        'card-rare': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        'card-uncommon': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'card-common': 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.5)',
        'glow-red': '0 0 20px rgba(220, 38, 38, 0.5)',
        'dungeon': '0 10px 40px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}