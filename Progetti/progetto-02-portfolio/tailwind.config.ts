import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Stitch design system — "Lumina Tech Portfolio"
        primary: {
          DEFAULT: '#6366f1',   // indigo
          light: '#818cf8',
          dark: '#4f46e5',
          glow: 'rgba(99,102,241,0.15)',
        },
        secondary: {
          DEFAULT: '#8b5cf6',   // violet
          light: '#a78bfa',
        },
        surface: {
          base: '#0f172a',      // slate-950
          low: '#191c1e',
          DEFAULT: '#1d2022',
          high: '#272a2c',
          highest: '#323537',
        },
        border: {
          DEFAULT: '#334155',
          accent: 'rgba(99,102,241,0.4)',
        },
        text: {
          DEFAULT: '#f8fafc',
          muted: '#94a3b8',
          accent: '#c0c1ff',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))',
        'gradient-text': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'gradient-border': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(99,102,241,0.1)',
        'glow-md': '0 0 40px rgba(99,102,241,0.15)',
        'glow-lg': '0 0 80px rgba(99,102,241,0.12)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.12)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
