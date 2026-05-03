import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FFFFFE',
          100: '#FAF7EE',
          200: '#F0E8D0',
          300: '#E0CFA8',
        },
        forest: {
          50:  '#FFFDF5',
          100: '#FFF5DC',
          200: '#FFE9B0',
          300: '#E8C97A',
          400: '#C9A840',
          600: '#8B6914',
          700: '#6E5010',
          800: '#4E3810',
          900: '#321F06',
          950: '#1E1204',
        },
        gold: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#F0C96A',
          400: '#DBB060',
          500: '#C9963A',
          600: '#B7870C',
          700: '#92660A',
        },
        night: {
          50:  '#FDFAF5',
          700: '#3A2810',
          800: '#2A1C0A',
          900: '#1A1006',
          950: '#0E0903',
        }
      },
      fontFamily: {
        arabic: ['Amiri', 'Noto Naskh Arabic', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft':    '0 2px 16px rgba(120, 82, 24, 0.10)',
        'medium':  '0 6px 32px rgba(120, 82, 24, 0.16)',
        'strong':  '0 16px 56px rgba(120, 82, 24, 0.22)',
        'gold':    '0 4px 24px rgba(201, 150, 58, 0.35)',
        'glass':   '0 8px 32px rgba(120, 82, 24, 0.10), inset 0 1px 0 rgba(255,240,200,0.6)',
        'dark-soft': '0 2px 16px rgba(0,0,0,0.20)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards',
        'slide-left': 'slideLeft 0.3s ease forwards',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        'breathe':    'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideLeft: { from: { opacity: '0', transform: 'translateX(24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.55' } },
        breathe:   { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.04)' } },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      backgroundImage: {
        'gradient-spiritual': 'linear-gradient(135deg, #6E5010 0%, #8B6914 50%, #6E5010 100%)',
        'gradient-dawn':      'linear-gradient(160deg, #FAF7EE 0%, #F5EDD8 60%, #EDE0C0 100%)',
        'gradient-dusk':      'linear-gradient(135deg, #1A1006 0%, #2A1C0A 50%, #160E04 100%)',
        'gradient-morning':   'linear-gradient(160deg, #2A1C0A 0%, #3A2810 45%, #1E1204 100%)',
        'gradient-evening':   'linear-gradient(135deg, #0E0903 0%, #1A1006 50%, #0A0702 100%)',
        'gradient-gold':      'linear-gradient(135deg, #C9963A 0%, #DBB060 100%)',
        'gradient-cream':     'linear-gradient(160deg, #FAF7EE 0%, #FFF5DC 60%, #FAF0D8 100%)',
      }
    },
  },
  plugins: [],
} satisfies Config
