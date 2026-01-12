/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",

        card: "rgb(var(--card))",
        "card-foreground": "rgb(var(--card-foreground))",

        primary: "rgb(var(--primary))",
        "primary-foreground": "rgb(var(--primary-foreground))",

        muted: "rgb(var(--muted))",
        "muted-foreground": "rgb(var(--muted-foreground))",

        border: "rgb(var(--border))",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
    },
  },
  plugins: [],
};
