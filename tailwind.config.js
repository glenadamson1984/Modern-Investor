module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        zooming: {
          "0%": { top: "0px" },
          "100%": { top: "-20px" },
        },
      },
      animation: {
        zoom: "zooming 2s linear infinite",
      },
    },
    fontFamily: {
      Inter: ["Inter"],
    },
    colors: {
      white: "#fff",
      offWhite: "#f5f5f5",
      whiteBorder: "#e8e8e8",
      red: "#E51F28",
      pink: "#ff408b",
      green: "#7bcda4",
      darkGreen: "#1a4d3a",
      black: "#232323",
      darkGrey: "#262626",
      grey: "#6B6B6B",
      darkWhite: "#BFBFBF",
    },
    fontWeight: {
      hairline: 100,
      "extra-light": 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      "extra-bold": 800,
      black: 900,
    },
  },
  plugins: [],
};
