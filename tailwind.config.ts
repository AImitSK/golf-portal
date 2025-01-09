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
        // Deine Figma-Farben
        "dark-green": "var(--color-dark-green)",
        "dark-green-25": "var(--color-dark-green-25)",
        "dark-green-10": "var(--color-dark-green-10)",
        dark: "var(--color-dark)",
        white: "var(--color-white)",
        "dark-20": "var(--color-dark-20)",
        "dark-6": "var(--color-dark-6)",
        "cta-green": "var(--color-cta-green)",
        "aktion-red": "var(--color-aktion-red)",
        "aktion-red-over": "var(--color-aktion-red-over)",
        "cta-green-15": "var(--color-cta-green-15)",
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], // Lokale Schriftart "Roboto" integrieren
      },
    },
  },
  plugins: [],
} satisfies Config;