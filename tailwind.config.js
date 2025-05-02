/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0066ff', // Primary blue
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        'secondary': {
          50: '#e6f9ff',
          100: '#b3ecff',
          200: '#80dfff',
          300: '#4dd2ff',
          400: '#1ac5ff',
          500: '#00b8ff', // Secondary blue
          600: '#0093cc',
          700: '#006e99',
          800: '#004966',
          900: '#002533',
        },
        'accent': {
          50: '#fff0e6',
          100: '#ffd1b3',
          200: '#ffb380',
          300: '#ff944d',
          400: '#ff751a',
          500: '#ff6600', // Accent orange
          600: '#cc5200',
          700: '#993d00',
          800: '#662900',
          900: '#331400',
        },
        'success': {
          50: '#e6ffe6',
          100: '#b3ffb3',
          200: '#80ff80',
          300: '#4dff4d',
          400: '#1aff1a',
          500: '#00ff00',
          600: '#00cc00',
          700: '#009900',
          800: '#006600',
          900: '#003300',
        },
        'warning': {
          50: '#fffbe6',
          100: '#fff2b3',
          200: '#ffe980',
          300: '#ffe04d',
          400: '#ffd71a',
          500: '#ffce00',
          600: '#cca500',
          700: '#997c00',
          800: '#665200',
          900: '#332900',
        },
        'error': {
          50: '#ffe6e6',
          100: '#ffb3b3',
          200: '#ff8080',
          300: '#ff4d4d',
          400: '#ff1a1a',
          500: '#ff0000',
          600: '#cc0000',
          700: '#990000',
          800: '#660000',
          900: '#330000',
        },
        'dark': {
          50: '#f2f2f2',
          100: '#d9d9d9',
          200: '#bfbfbf',
          300: '#a6a6a6',
          400: '#8c8c8c',
          500: '#737373',
          600: '#595959',
          700: '#404040',
          800: '#262626',
          900: '#0d0d0d',
          950: '#080808', // Almost black
        },
      },
      fontFamily: {
        'electa': ['Orbitron', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/hero-bg.jpg')",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
};