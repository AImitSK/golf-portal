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
        background: "var(--background)",
        foreground: "var(--foreground)",
        'brand': {
          DEFAULT: '#2B5835',    // Dunkelgrün
          light: '#C5D1C8',      // Hellgrau-Grün
          lighter: '#E1E6E2',    // Sehr helles Grau-Grün
          accent: '#76B947',     // Helles Grün (Award)
          error: '#D64933',      // Rot (User Tipp)
          dark: '#333333',       // Dunkelgrau
          gray: '#999999',       // Mittelgrau
          lightgray: '#E5E5E5',  // Hellgrau
        },
      },
    },
  },
  plugins: [],
}
export default config;
