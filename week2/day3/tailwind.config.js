// tailwind.config.js
module.exports = {
  content: [
    "./*.html", // For HTML files
    "./src/**/*.{js,jsx}", // For React or JS projects
  ],
  theme: {
    extend: {
      colors: {
        figmaWhite: "rgba(255,255,255,1)",
        jetBlack: "rgba(0,0,0,1)",
        orange: "rgba(252,138,6,1)",
      },
    },
  },
  plugins: [],
};
