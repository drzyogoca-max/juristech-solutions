/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          DEFAULT: '#111827',
          elevated: '#1a2035',
          deep: '#0a0b14',
          overlay: '#0f1629',
        },
        success: { DEFAULT: '#10b981', light: '#34d399', dark: '#059669' },
        danger:  { DEFAULT: '#ef4444', light: '#f87171', dark: '#dc2626' },
        warning: { DEFAULT: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
      },
      fontFamily: {
        sans:    ['Inter', 'Cairo', 'system-ui', '-apple-system', 'sans-serif'],
        arabic:  ['Cairo', 'system-ui', 'sans-serif'],
        english: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'brand':      '0 0 30px -5px rgba(99,102,241,0.35)',
        'brand-sm':   '0 0 15px -3px rgba(99,102,241,0.25)',
        'brand-lg':   '0 0 60px -10px rgba(99,102,241,0.45)',
        'cyan-glow':  '0 0 30px -5px rgba(6,182,212,0.35)',
        'amber-glow': '0 0 25px -5px rgba(245,158,11,0.35)',
        'glass':      '0 8px 32px 0 rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-lg':   '0 20px 60px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        'card':       '0 4px 24px -4px rgba(0,0,0,0.5)',
        'card-hover': '0 12px 40px -6px rgba(99,102,241,0.3)',
        'nav':        '0 4px 30px -4px rgba(0,0,0,0.6)',
        'luxury':     '0 25px 50px -12px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        'mesh-hero':        'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.10) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(79,70,229,0.08) 0%, transparent 60%)',
        'mesh-card':        'radial-gradient(ellipse at top left, rgba(99,102,241,0.08) 0%, transparent 60%)',
        'mesh-page':        'radial-gradient(ellipse at 10% 15%, rgba(99,102,241,0.12) 0%, transparent 40%), radial-gradient(ellipse at 90% 85%, rgba(6,182,212,0.08) 0%, transparent 40%)',
        'gradient-brand':   'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        'gradient-hero':    'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
        'gradient-gold':    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-surface': 'linear-gradient(135deg, #111827 0%, #1a2035 100%)',
        'shimmer':          'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.1) 50%, transparent 100%)',
      },
      animation: {
        'glow-pulse':  'glow-pulse 3s ease-in-out infinite',
        'shimmer':     'shimmer 2.5s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'brand-pulse': 'brand-pulse 2s ease-in-out infinite',
        'slide-up':    'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in':     'fade-in 0.3s ease-out',
        'scale-in':    'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0)' },
          '50%':       { boxShadow: '0 0 25px 5px rgba(99,102,241,0.2)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-10px)' },
        },
        'brand-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%':       { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backdropBlur: {
        '3xl': '48px',
        '4xl': '64px',
      },
    },
  },
  plugins: [],
};

