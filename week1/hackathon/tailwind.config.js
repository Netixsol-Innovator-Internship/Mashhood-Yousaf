module.exports = {
  content: ["./*.html"], // This should come first
  theme: {
    extend: {
      zIndex: {
        "-10": "-10", // use string keys
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        mono: ['"Space Mono"', "Monaco", "monospace"], // custom mono font stack
        work: ['"Work Sans"', "sans-serif"],
        clash: ["Clash Display", "sans-serif"],
      },
    },
  },
  plugins: [],
};
