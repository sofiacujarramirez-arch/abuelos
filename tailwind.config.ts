import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-lora)", "serif"],
      },
      colors: {
        parchment: "#F5EFE0",
        cream: "#E8D9BB",
        gold: "#D4A96A",
        tobacco: "#8B6E4A",
        inkwell: "#2A1F0F",
        letter: { DEFAULT: "#1A5A8A", tint: "#A8D4F0" },
        envelope: { DEFAULT: "#9B3228", tint: "#FAD9D5" },
        garden: { DEFAULT: "#2D6140", tint: "#D4E8D0" },
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 6.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.15" }],
        "subhead": ["1.75rem", { lineHeight: "1.3" }],
        "body-lg": ["1.25rem", { lineHeight: "1.65" }],
        "body": ["1.125rem", { lineHeight: "1.65" }],
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 1px 1px, rgba(139,110,74,0.07) 1px, transparent 0)",
      },
      backgroundSize: {
        grain: "24px 24px",
      },
      boxShadow: {
        photo: "0 4px 16px -4px rgba(42,31,15,0.25), 0 2px 4px rgba(42,31,15,0.1)",
        "photo-lg": "0 12px 36px -8px rgba(42,31,15,0.3), 0 4px 8px rgba(42,31,15,0.12)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
