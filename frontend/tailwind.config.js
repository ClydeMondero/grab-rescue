/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00B14F",
        "primary-dark": "#002E27",
        secondary: "#FF5757",
        highlight: "#3B82F6",
        background: "#fff",
        "background-light": "#EAEFF2",
        "background-dark": "#363A45",
        "text-primary": "#242A2E",
        "text-secondary": "#697078",
        error: "#e74c3c",
        success: "#2ecc71",
        warning: "#f1c40f",
        info: "#3498db",
        border: "#E5E9F0",
        shadow: "rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
