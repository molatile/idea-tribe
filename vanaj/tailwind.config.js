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
          cream: '#FDF6EC',
          'dark-cream': '#F5EDD9',
          dark: '#1B4332',
          'very-dark': '#0D1F17'
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
