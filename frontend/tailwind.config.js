/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: "#f472b6", // blue
        "primary-dark": "#f472b6", // darker blue
        "primary-light": "#6cb2eb", // lighter blue

        // Secondary colors
        secondary: "#38c172", // green
        "secondary-dark": "#2e8540", // darker green
        "secondary-light": "#7dd5a2", // lighter green

        // Accent colors
        accent: "#9561e2", // purple
        "accent-dark": "#794acf", // darker purple
        "accent-light": "#b187ea", // lighter purple

        // Neutral colors
        black: "#000000", // black
        white: "#ffffff", // white
        gray: "#718096", // gray
        "gray-light": "#cbd5e0", // light gray
        "gray-dark": "#4a5568", // dark gray
      },
    },
  },
  plugins: [require("daisyui")],
};
