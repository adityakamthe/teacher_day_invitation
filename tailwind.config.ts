import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF3E4",
        sand: "#F3E1BE",
        paper: "#FFFCF4",
        gold: {
          light: "#E8C77E",
          DEFAULT: "#B27F2E",
          deep: "#8C6222",
        },
        maroon: {
          DEFAULT: "#7A2A2E",
          deep: "#5C1D21",
          soft: "#9E3C41",
        },
        ink: {
          DEFAULT: "#3D2B1E",
          soft: "#6B5842",
          light: "#8C7A65",
        },
        flame: {
          DEFAULT: "#FF9142",
          core: "#FFD98A",
          glow: "rgba(255, 145, 66, 0.4)",
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-mukta)", "Mukta", "sans-serif"],
      },
      boxShadow: {
        'card-warm': '0 1px 0 rgba(255,255,255,0.7) inset, 0 30px 60px -25px rgba(122,42,46,0.35), 0 8px 20px -10px rgba(140,98,34,0.25)',
        'envelope-warm': '0 25px 50px -20px rgba(122,42,46,0.45), 0 10px 25px -10px rgba(140,98,34,0.35)',
        'gold-glow': '0 0 25px rgba(232, 199, 126, 0.55)',
      },
      animation: {
        'flicker': 'flicker 2.4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2.4s ease-in-out infinite',
        'slow-spin': 'slowSpin 26s linear infinite',
        'drift': 'drift 12s ease-in infinite',
        'bob': 'bob 3.2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1) rotate(0deg)' },
          '25%': { transform: 'scaleY(1.08) scaleX(0.95) rotate(-2deg)' },
          '50%': { transform: 'scaleY(0.94) scaleX(1.06) rotate(1.5deg)' },
          '75%': { transform: 'scaleY(1.05) scaleX(0.96) rotate(-1deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.85', transform: 'translateX(-50%) scale(1)' },
          '50%': { opacity: '1', transform: 'translateX(-50%) scale(1.08)' },
        },
        slowSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
