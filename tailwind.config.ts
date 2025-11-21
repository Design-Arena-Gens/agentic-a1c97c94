import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#fdf7ed",
          100: "#f9e5c5",
          200: "#f3cb8d",
          300: "#ecab52",
          400: "#e28d24",
          500: "#c76f11",
          600: "#a0550c",
          700: "#7c400d",
          800: "#5a2f0d",
          900: "#3e2009"
        }
      },
      fontFamily: {
        display: ["'Baloo Bhaijaan 2'", "system-ui"],
        body: ["'Cairo'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
