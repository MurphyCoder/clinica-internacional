import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      transitionProperty: {
        height: "height",
        width: "width",
        spacing: "margin, padding",
      },
      colors: {
        primary: {
          100: "#0233a0",
          200: "#0233a0",
          300: "#0233a0",
          400: "#0233a0",
          500: "#0233a0",
          600: "#0233a0",
          700: "#0233a0",
          800: "#0233a0",
          900: "0233a0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
