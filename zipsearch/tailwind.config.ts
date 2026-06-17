import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        accent: {
          indigo: '#6366f1',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
        },
        surface: {
          dark: '#0a0a1a',
          midnight: '#0f172a',
          deep: '#1e1b4b',
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        'fade-slide-in': 'fadeSlideIn 0.4s ease-out',
        'shake-x': 'shakeX 0.3s ease-in-out',
        'check-bounce': 'checkBounce 0.2s ease-out',
        'float': 'float 20s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shakeX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-10px)' },
          '40%': { transform: 'translateX(10px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        checkBounce: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '75%': { transform: 'translate(20px, 30px) scale(1.05)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} satisfies Config;
