/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1950s retro kitchen palette
        'retro-mint': '#AADBD0',
        'retro-yellow': '#F9D976',
        'retro-red': '#E86B5C',
        'retro-blue': '#7BAFD4',
        'retro-pink': '#F4B8C1',
        'retro-cream': '#F9F5EB',
        'retro-teal': '#5A9E94',
        'retro-orange': '#F4A259',
      },
      fontFamily: {
        'retro': ['Playfair Display', 'serif'],
        'retro-sans': ['Poppins', 'sans-serif'],
        'dyslexic': ['OpenDyslexic', 'sans-serif'],
      },
      backgroundImage: {
        'retro-pattern': "url('/src/assets/patterns/retro-pattern.svg')",
        'checker-pattern': "url('/src/assets/patterns/checker-pattern.svg')",
      },
      boxShadow: {
        'retro': '4px 4px 0px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'retro': '0.5rem 0.5rem 0.25rem 0.25rem',
      },
    },
  },
  plugins: [],
}
