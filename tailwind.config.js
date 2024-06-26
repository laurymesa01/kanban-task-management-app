/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
    colors: {
      'main-purple': '#635FC7',
      'main-purple-hover': '#A8A4FF',
      'black': '#000112',
      'very-dark-grey': '#20212C',
      'dark-grey': '#2B2C37',
      'lines-dark': '#3E3F4E',
      'medium-grey': '#828FA3',
      'lines-light': '#E4EBFA',
      'light-grey': '#F4F7FD',
      'white': '#FFFFFF',
      'red': '#EA5555',
      'red-hover': '#FF9898'
    },
    fontFamily: {
      'jakarta': 'Plus Jakarta Sans'
    },
    fontSize: {
      'xs': '12px',
      'sm': '15px',
      'base': '18px',
      'lg': '20px',
      'xl': '24px'
    }
  },
  plugins: [],
}

