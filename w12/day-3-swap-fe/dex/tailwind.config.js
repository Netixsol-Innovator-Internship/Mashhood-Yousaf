/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx}", "./components/**/*.{js,ts,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          100: "#1E1E1E",
          200: "#2D2D2D",
          300: "#3A3A3A",
          400: "#4A4A4A",
        },
        primary: {
          500: "#7C3AED",
          600: "#6D28D9",
        },
        accent: {
          green: "#10B981",
          red: "#EF4444",
        },
      },
    },
  },
  plugins: [],
};
