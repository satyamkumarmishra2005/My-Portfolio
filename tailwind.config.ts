import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Background colors - using CSS variables for theme support
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-tertiary": "var(--bg-tertiary)",
        // Accent colors
        "accent-blue": "#3b82f6",
        "accent-cyan": "#06b6d4",
        "accent-purple": "#8b5cf6",
        "accent-pink": "#ec4899",
        "accent-green": "#10b981",
        // Text colors - using CSS variables for theme support
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        // Border colors - using CSS variables for theme support
        "border-subtle": "var(--border-subtle)",
        "border-accent": "var(--border-accent)",
        // Legacy support
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        heading: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.1)',
        'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;
