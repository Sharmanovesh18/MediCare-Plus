/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#0D9488",
        'secondary': "#0F172A",
        'accent': "#F0FDFA",
      },
      gridTemplateColumns:{
        'auto':'grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))'
      }
    },
  },
  plugins: [],
}
