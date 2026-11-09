import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#041a14',
        deep: '#02110d',
        mint: '#79f8bc',
        pale: '#eafff3',
        mutedMint: '#a9c8b8',
        surface: '#051f17',
        surfaceHover: '#082c21',
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
