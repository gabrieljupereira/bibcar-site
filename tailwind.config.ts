import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#F7F5FF',
        dark2: '#EDE9FF',
        card: '#FFFFFF',
        gold: '#FFB800',
        gold2: '#FF9500',
        'gold-warm': '#FF7A00',
        purple: '#9B27D8',
        'purple-elec': '#A830E8',
        violet: '#6B3FA0',
        pink: '#E8267A',
        silver: '#64748B',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        bebas: ['Montserrat', 'sans-serif'],
        inter: ['Montserrat', 'sans-serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
