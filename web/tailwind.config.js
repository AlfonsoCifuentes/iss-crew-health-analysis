/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ISS Hero Image Inspired Palette
        iss: {
          gold: '#edcd4e',
          blue: '#74aee0',
          silver: '#d4d8db',
          white: '#edf5fc',
          black: '#000000',
        },
        // Backwards compatibility with existing code
        space: {
          deep: '#000000',
          blue: '#74aee0',
          black: '#000000',
        },
        nebula: {
          purple: '#edcd4e',
          pink: '#74aee0',
          cyan: '#74aee0',
        },
        star: {
          gold: '#edcd4e',
          silver: '#d4d8db',
        },
        asteroid: {
          gray: '#d4d8db',
        },
        moon: {
          gray: '#d4d8db',
        },
        cosmic: {
          white: '#edf5fc',
        },
        // Status colors
        success: '#74aee0',
        warning: '#edcd4e',
        danger: '#dc2626',
        info: '#74aee0',
      },
      backgroundImage: {
        'gradient-cosmic': 'linear-gradient(135deg, #0B1426 0%, #1E3A8A 50%, #6366F1 100%)',
        'gradient-nebula': 'linear-gradient(45deg, #6366F1 0%, #EC4899 50%, #06B6D4 100%)',
        'gradient-stars': 'radial-gradient(circle at 20% 80%, #F59E0B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E5E7EB 0%, transparent 50%), radial-gradient(circle at 40% 40%, #06B6D4 0%, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'orbit': 'orbit 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.3, transform: 'scale(0.8)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
      },
      fontFamily: {
        'space': ['Inter', 'system-ui', 'sans-serif'],
        'mono-space': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'mega': ['6rem', { lineHeight: '1', fontWeight: '900' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'cosmic': '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
        'nebula': '0 20px 40px -12px rgba(147, 51, 234, 0.3)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.5)',
      },
    },
  },
  plugins: [],
}
