/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'mobile': { 'max': '550px' },
      
      'tab': { 'max': '900px', 'min': '550px' },
    },
    extend: {},
  },
  plugins: [],
}
