/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f7ff',
          100: '#d6eaff',
          200: '#a8d0ff',
          300: '#6ab4ff',
          400: '#3399ff',
          500: '#0066ff',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001a40',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          950: '#090d16',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fadeIn': 'fadeIn 0.4s ease-out both',
        'slideUp': 'slideUp 0.4s ease-out both',
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 15px rgba(0, 102, 255, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 102, 255, 0.6)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
