import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: "#004A93",
        warmYellow: "#F2C166",
        orange: "#F28705",
        light: "#F2EEEE",
        offWhite: "#F2ECE6",
        dark: "#2A2A2A",
        hover: {
          yellow: "#F5CD85",
        },
      },
      fontFamily: {
        sofiaPro: "var(--font-sofia-pro)",
        spaceMono: "var(--font-space-mono)",
      },
    },
  },
  plugins: [],
} satisfies Config;
