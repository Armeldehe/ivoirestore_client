/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // IvoireStore brand palette
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#F7841D", // primary orange
          600: "#ea6d00",
          700: "#c05500",
          800: "#9a3f00",
          900: "#7c3200",
        },
        navy: {
          50: "#f0f3f8",
          100: "#dde4ef",
          200: "#bac9df",
          300: "#8ea6c9",
          400: "#5e7fae",
          500: "#34436F", // primary dark blue
          600: "#2c3960",
          700: "#232e50",
          800: "#1b2340",
          900: "#111830",
          950: "#090d1e",
        },
        brand: {
          500: "#F7841D",
          600: "#ea6d00",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          800: "#1b2340",
          900: "#111830",
          950: "#090d1e",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
