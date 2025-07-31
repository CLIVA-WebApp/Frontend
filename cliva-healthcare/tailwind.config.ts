import type { Config } from "tailwindcss"
import defaultConfig from "shadcn/ui/tailwind.config"

export default {
  ...defaultConfig,
  content: [
    ...defaultConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        primary: {
          DEFAULT: "#12A048",
          foreground: "#FEFEFE",
        },
        secondary: {
          DEFAULT: "#FF2C2C",
          foreground: "#FEFEFE",
        },
        accent: {
          DEFAULT: "#FBB917",
          foreground: "#1D567C",
        },
        muted: {
          DEFAULT: "#E9E9E9",
          foreground: "#8A8A8A",
        },
        card: {
          DEFAULT: "#FEFEFE",
          foreground: "#1D567C",
        },
        destructive: {
          DEFAULT: "#D1553F",
          foreground: "#FEFEFE",
        },
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
} satisfies Config
