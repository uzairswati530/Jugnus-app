/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#b42f2f',
        'primary-dim': 'rgba(180,47,47,0.2)',
        'primary-border': 'rgba(180,47,47,0.3)',
        surface: '#111111',
        'surface-2': '#1a1a1a',
        'surface-3': '#222222',
      },
    },
  },
  plugins: [],
};
