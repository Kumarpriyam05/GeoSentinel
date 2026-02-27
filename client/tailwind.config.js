/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          50: "rgb(var(--base-50) / <alpha-value>)",
          100: "rgb(var(--base-100) / <alpha-value>)",
          200: "rgb(var(--base-200) / <alpha-value>)",
          300: "rgb(var(--base-300) / <alpha-value>)",
          400: "rgb(var(--base-400) / <alpha-value>)",
          500: "rgb(var(--base-500) / <alpha-value>)",
          600: "rgb(var(--base-600) / <alpha-value>)",
          700: "rgb(var(--base-700) / <alpha-value>)",
          800: "rgb(var(--base-800) / <alpha-value>)",
          900: "rgb(var(--base-900) / <alpha-value>)",
        },
        accent: {
          400: "rgb(var(--accent-400) / <alpha-value>)",
          500: "rgb(var(--accent-500) / <alpha-value>)",
          600: "rgb(var(--accent-600) / <alpha-value>)",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--accent-500) / 0.24), 0 14px 35px -18px rgb(var(--accent-500) / 0.75)",
        soft: "0 10px 40px -24px rgb(15 23 42 / 0.35)",
      },
      borderRadius: {
        xl: "0.95rem",
        "2xl": "1.2rem",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        floatGlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "pulse-soft": "pulseSoft 2.2s ease-in-out infinite",
        "float-glow": "floatGlow 5s ease-in-out infinite",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at 20% 20%, rgb(var(--accent-500) / 0.3), transparent 45%), radial-gradient(circle at 80% 0%, rgb(var(--base-500) / 0.25), transparent 42%), linear-gradient(125deg, rgb(var(--base-900) / 1), rgb(var(--base-800) / 1))",
      },
    },
  },
  plugins: [],
};
