const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
      },
    },
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
