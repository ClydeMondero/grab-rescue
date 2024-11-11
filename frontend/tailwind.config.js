/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enables dark mode using a 'dark' class
  theme: {
    extend: {
      colors: {
        primary: "#00B14F",
        "primary-medium": "#557C55",
        "primary-dark": "#002e27",
        secondary: "#FF5757",
        highlight: "#3B82F6",
        background: "#fff",
        "background-light": "#f5f5f5",
        "background-medium": "#bebebe",
        "background-dark": "#363A45",
        "text-primary": "#242A2E",
        "text-secondary": "#697078",
        error: "#e74c3c",
        success: "#2ecc71",
        warning: "#f1c40f",
        info: "#3498db",
        border: "#E5E9F0",
        shadow: "rgba(0, 0, 0, 0.15)",

        // Dark mode equivalents
        "dark-primary": "#00a241",
        "dark-primary-medium": "#4a6b4a",
        "dark-primary-dark": "#001c17",
        "dark-secondary": "#ff4343",
        "dark-highlight": "#2563eb",
        "dark-background": "#121212",
        "dark-background-light": "#1e1e1e",
        "dark-background-medium": "#444444",
        "dark-background-dark": "#1a1d24",
        "dark-text-primary": "#e0e6ed",
        "dark-text-secondary": "#9ca3af",
        "dark-error": "#e74c3c",
        "dark-success": "#27ae60",
        "dark-warning": "#f39c12",
        "dark-info": "#2980b9",
        "dark-border": "#3e4550",
        "dark-shadow": "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["Courier New", "monospace"],
        custom: ["'CustomFont', sans-serif"], // Add any custom font families here
      },
    },
  },
  plugins: [],
};
