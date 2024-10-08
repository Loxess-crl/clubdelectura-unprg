/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  content: ["./src/**/*.{html,astro,tsx}"],
  theme: {
    extend: {
      colors: {
        banner: "#90AACF",
      },
      fontFamily: {
        allura: ["Allura", "cursive"],
        edu: ["Edu AU VIC WA NT Guides", "cursive"],
        sans: ["Lora", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out forwards",
        down: "down 0.5s ease-in-out forwards",
        up: "up 0.5s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        down: {
          "0%": {
            transform: "translateY(-100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
        up: {
          "0%": {
            transform: "translateY(100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [],
};
