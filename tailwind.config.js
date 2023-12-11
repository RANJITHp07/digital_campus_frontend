/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',  // Small screens
        'md': '768px',  // Medium screens
        'xm': '900px',  // screen between medium and large
        'lg': '1025px', // Large screens
        'xl': '1281px', // Extra-large screens
      },
    },
  },
  plugins: [],
}
