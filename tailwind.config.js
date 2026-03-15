/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4A2F6E",
        "primary-light": "#6B4F8E",
        secondary: "#C9963A",
        "secondary-light": "#D4AD5E",
        cream: "#FAF6F0",
        "dark-bg": "#1A1420",
        "green-hope": "#2D6A4F",
        crimson: "#8B2635",
        "text-main": "#2C2C2C",
        "text-soft": "#6B6B6B",
      },
      fontFamily: {
        "playfair": ["PlayfairDisplay_700Bold"],
        "playfair-italic": ["PlayfairDisplay_400Regular_Italic"],
        "garamond": ["EBGaramond_400Regular"],
        "garamond-italic": ["EBGaramond_400Regular_Italic"],
        "inter": ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-bold": ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
