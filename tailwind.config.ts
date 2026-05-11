import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: "#ff5c00",
        "light-gray": "#f2f2f0",
        "dark-gray": "#1a1a1a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        bebas: ["var(--font-bebas)", "Bebas Neue", "Impact", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(4rem, 10vw, 8rem)", { lineHeight: "1" }],
        section: ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1.1" }],
      },
    },
  },
  plugins: [],
};

export default config;
