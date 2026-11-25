/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Colour scheme: change these values to re-theme the whole site.
      colors: {
        canvas: "#F5F3EE", // page background (warm off-white)
        surface: "#FFFFFF", // cards
        subtle: "#FAF9F6", // option tiles, inputs at rest
        line: "#E4E1DA", // borders
        ink: "#15171B", // main text
        muted: "#6E7178", // secondary text
        accent: {
          DEFAULT: "#2445FF", // cobalt
          hover: "#1A36D9",
          soft: "#ECEFFF",
        },
      },
      fontFamily: {
        sans: ['"Archivo"', "system-ui", "-apple-system", '"Segoe UI"', "sans-serif"],
        display: ['"Archivo"', "system-ui", "sans-serif"],
      },
      keyframes: {
        "success-pop": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "step-in": {
          "0%": { opacity: "0", transform: "translateX(14px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "success-pop": "success-pop 0.28s cubic-bezier(.2,.9,.3,1.2)",
        "step-in": "step-in 0.3s cubic-bezier(.2,.8,.2,1)",
        "rise-in": "rise-in 0.6s cubic-bezier(.2,.8,.2,1) both",
      },
    },
  },
};
