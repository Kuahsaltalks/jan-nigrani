/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: {
          900: '#0b1329',
          950: '#070c1b',
        },
        editorial: {
          bg: '#ffffff',
          surface: '#f8fafc',
          border: '#e2e8f0',
          subtle: '#64748b',
          heading: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
