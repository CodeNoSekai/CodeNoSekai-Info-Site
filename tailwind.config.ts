import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090a0f',
        surface: '#11131a',
        'surface-elevated': '#171a24',
        border: '#242938',
        'border-strong': '#3b435a',
        accent: {
          green: '#22c55e',
          cyan: '#06b6d4',
          amber: '#f59e0b',
          purple: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px rgba(255, 255, 255, 0.9)',
        'brutal-sm': '2px 2px 0px 0px rgba(255, 255, 255, 0.9)',
        'brutal-green': '4px 4px 0px 0px #22c55e',
        'brutal-cyan': '4px 4px 0px 0px #06b6d4',
        'brutal-dark': '4px 4px 0px 0px #000000',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        'dots-pattern': "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
        'dots-sm': '16px 16px',
      },
    },
  },
  plugins: [],
};

export default config;
