/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#1e3a8a',
          navy: '#0f172a',
          emerald: '#059669',
          amber: '#d97706',
          rose: '#e11d48',
          slate: '#334155',
        }
      }
    },
  },
  plugins: [],
}
