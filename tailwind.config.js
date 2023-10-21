/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './providers/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        tan: {
          1: '#E7E0D6',
          2: '#B7AC92',
        },
        'primary-blue': '#193266',
        green: '#5E7D57',
        brown: '#412D22',
      },
    },
    fontFamily: {
      body: ['Sarabun', 'sans-serif'],
    },
    fontSize: {
      'display-2xl': [
        '4.5rem',
        {
          lineHeight: '5.625rem',
          letterSpacing: '-2%',
        },
      ],
      'display-xl': [
        '3.75rem',
        {
          lineHeight: '4.5rem',
          letterSpacing: '-2%',
        },
      ],
      'display-lg': [
        '3rem',
        {
          lineHeight: '3.75rem',
          letterSpacing: '-2%',
        },
      ],
      'display-md': [
        '2.25rem',
        {
          lineHeight: '2.75rem',
          letterSpacing: '-2%',
        },
      ],
      'display-sm': ['1.875rem', '2.375rem'],
      'display-xs': ['1.5rem', '2rem'],
      xl: ['1.25rem', '1.875rem'],
      lg: ['1.125rem', '1.75rem'],
      md: ['1rem', '1.5rem'],
      sm: ['0.875rem', '1.25rem'],
      xs: ['0.75rem', '1.125rem'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
