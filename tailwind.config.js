/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f5f9",
          100: "#e6e8f2",
          200: "#c8cce3",
          300: "#a1a8cc",
          400: "#7480b0",
          500: "#545d93",
          600: "#414876",
          700: "#343a5e",
          800: "#20233d",
          900: "#14162a",
          950: "#0b0c1a",
        },
        amber: {
          400: "#f7b955",
          500: "#f2a531",
          600: "#dc8b1a",
        },
        porcelain: "#f7f7f5",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(11,12,26,0.08), 0 1px 2px rgba(11,12,26,0.06)",
        card: "0 10px 30px -12px rgba(11,12,26,0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
