import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-dm-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
        serif: ["var(--font-dm-serif)", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondary: "var(--secondary)",
        status: {
          green: "#22c55e",
        },
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      letterSpacing: {
        widest: '0.2em',
      }
    },
  },
  plugins: [],
};
export default config;
