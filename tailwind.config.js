/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF6EF",
        "cream-deep": "#F0E8DA",
        ink: "#1C1917",
        "ink-soft": "#44403C",
        "ink-muted": "#78716C",
        gold: "#C8952A",
        "gold-light": "#F5DFA0",
        "gold-dark": "#8B6318",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      boxShadow: {
        gold: "0 4px 20px rgba(200,149,42,0.25)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
