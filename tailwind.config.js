import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#397ae3",
        secondary: "#59a9fd",
        accent: "#d9eafe",
        grey: "#b4c1c6",
        purple: "#a37979",
        cherryRed: "#db6079",//"#D2042D",
        lightCherryRed: "#db6079"
        // darkgreen: "#00363b",
        // green: "#069088",
        // yellow: "#fcba03",
        // themeRed: "#ff0059f"
      },
      boxShadow: {
        "custom-blue": '0 10px 20px -5px rgba(89, 169, 253, 0.2)',
        'custom-black': '0 1px 15px 4px rgba(0,0,0,0.2)', //shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)]
        'custom-white': '0 -4px 10px -2px rgba(255, 255, 255, 0.1)' 
      },
      fontFamily: {
        'caveat': ['"Caveat"', 'cursive'],
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(135deg, hsla(58, 77%, 50%, 1) 0%, hsla(217, 75%, 56%, 1) 0%, hsla(210, 14%, 91%, 1) 0%, hsla(217, 75%, 56%, 1) 70%)',
        'button-gradient': 'linear-gradient(135deg, hsla(217, 75%, 66%, 1) 0%, hsla(217, 75%, 56%, 1) 50%, hsla(217, 75%, 46%, 1) 100%)',
      },
      keyframes: {
        fadeUpDown: {
          '0%, 20%, 100%': { opacity: '0', transform: 'translateY(20px)' },
          '40%, 60%': { opacity: '1', transform: 'translateY(0)' },
          '80%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(10deg) scale(1.2)' },
          '75%': { transform: 'rotate(-10deg) scale(1.2)' },
        },
      },
      animation: {
        'placeholder-animation': 'fadeUpDown 3s linear infinite',
        'wobble-slow': 'wobble 1.5s ease-in-out infinite',
      },
    },
  },
  safelist: [
    // Artistic
    'bg-gradient-to-br',
    'from-[#FFB0A1]',
    'via-[#FFD2C4]',
    'to-[#FFE5DA]',
    // Meditation
    'from-[#ECA676]',
    'via-[#F3C1A1]',
    'to-[#F9D9C5]',
    // Diet
    'from-[#FFDA7A]',
    'via-[#FFE7A2]',
    'to-[#FFF3CC]',
    // Hydration
    'from-[#7FCFFF]',
    'via-[#A9E2FF]',
    'to-[#D1F1FF]',
    // Time Management
    'from-[#FFE07F]',
    'via-[#FFEBA2]',
    'to-[#FFF5CC]',
    // Task Management
    'from-[#668BB3]',
    'via-[#87A4C5]',
    'to-[#B0C3DB]',
    // Health
    'from-[#FF9A9A]',
    'via-[#FFB8B8]',
    'to-[#FFD3D3]',
    // Fitness
    'from-[#666666]',
    'via-[#8C8C8C]',
    'to-[#B2B2B2]',
    // Lifestyle
    'from-[#8FE7A8]',
    'via-[#A7F0BD]',
    'to-[#CFF8DC]',
    // Productivity
    'from-[#B87575]',
    'via-[#D09A9A]',
    'to-[#EBC2C2]',
  ],
  darkMode: "class",
  plugins: [nextui()],
}
