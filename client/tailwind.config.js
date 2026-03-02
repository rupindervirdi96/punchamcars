/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ui: ['"Segoe UI"', "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
      keyframes: {
        "success-pop": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "success-pop": "success-pop 0.22s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
    },
  },
};
