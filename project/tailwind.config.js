/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette based on the provided image
        'orange': '#E9631A',
        'flash-white': '#EFEFEF',
        'dark-slate': '#315762',
        // Additional shades for better design flexibility
        'orange-light': '#F2844A',
        'orange-dark': '#C54A0A',
        'flash-white-light': '#F8F8F8',
        'flash-white-dark': '#E0E0E0',
        'dark-slate-light': '#4A7A8A',
        'dark-slate-dark': '#1F3A42',
      }
    },
  },
  plugins: [],
};
