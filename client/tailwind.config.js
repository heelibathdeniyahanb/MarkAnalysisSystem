/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Override the default font-sans
      },
      backgroundColor:['#1F1F1F'],
      colors: {
        textGray: '#939393', // Add a custom color for text
      },
    }
    ,
  },
  plugins: [],
}