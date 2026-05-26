import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#070707',
        dark2: '#0F0F12',
        card: '#141420',
        gold: '#FFD23F',
        gold2: '#FFB627',
        'gold-warm': '#FF9500',
        purple: '#A930F0',
        'purple-elec': '#C13EFF',
        violet: '#6B3FA0',
        pink: '#FF2D8E',
        silver: '#A5B0BD',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
