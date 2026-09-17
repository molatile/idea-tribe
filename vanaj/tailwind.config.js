/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vanaj: {
          green: '#2D6A4F',
          ochre: '#C9952A',
          red: '#8B1A1A',
          cream: '#FDF0E0',
          'dark-cream': '#F5EDD9',
          dark: '#2C1A0E', /* changed from 1B4332 to Deep brown */
          'very-dark': '#1A0F08',
          earth: '#8B5E3C',
          gold: '#C9952A'
        }
      },
      fontFamily: {
        heading: ['"Tiro Devanagari Sanskrit"', 'serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
