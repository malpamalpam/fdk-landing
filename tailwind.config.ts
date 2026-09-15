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
      },
      borderRadius: {
        btn: "4px",
        card: "12px",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
