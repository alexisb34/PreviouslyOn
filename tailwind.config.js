/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      'xxs': '340px',
      'xs': '475px',
      ...defaultTheme.screens,
    },
  },
  variants: {},
  plugins: [],
}
