import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#00BBFF",
        brandDark: "#0099D6",
        ink: "#1A1E23",
        body: "#4b5563",
        surface: "#F7F7F7",
        // Bizky-style palette for multi-site landings
        navy: "#191B3F",
        navySoft: "#1A1B41",
        lime: "#C6FF39",
        limeSoft: "#C5FF5C",
        lavender: "#B4BAD9",
        surfaceSite: "#F4F6FF",
        surfaceAlt: "#F1F1F1",
        muted: "#666666",
      },
      borderRadius: {
        btn: "4px",
        card: "12px",
        pill: "50px",
        "card-site": "16px",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", ...defaultTheme.fontFamily.sans],
        site: ["var(--font-readex-pro)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
