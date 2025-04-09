
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Raleway", ...fontFamily.sans],
        serif: ["Playfair Display", ...fontFamily.serif],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        "filiyaa-peach": {
          50: "#FFF7F5",
          100: "#FFECE8",
          200: "#FFD6CD",
          300: "#FFB4A1",
          400: "#FF8D70",
          500: "#FF6B45",
          600: "#F34A1E",
          700: "#D93812",
          800: "#B02A10",
          900: "#942411",
        },
        "filiyaa-pink": {
          50: "#FFF5F7",
          100: "#FFEBEF",
          200: "#FFD1DD",
          300: "#FFB0C5",
          400: "#FF85A3",
          500: "#FF5B85",
          600: "#FF2D64",
          700: "#F4104D",
          800: "#C20D3D",
          900: "#9A0B32",
        },
        "filiyaa-cream": {
          50: "#FFFDF9",
          100: "#FFF9F0",
          200: "#FFF1D9",
          300: "#FFE2B3",
          400: "#FFD08C",
          500: "#FFBC61",
          600: "#FFA630",
          700: "#F08A00",
          800: "#C26C00",
          900: "#9A5500",
        },
        // New premium color palette
        "heartfelt-cream": "#EBE8DB",
        "heartfelt-pink": "#D76C82",
        "heartfelt-burgundy": "#B03052",
        "heartfelt-dark": "#3D0301",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
