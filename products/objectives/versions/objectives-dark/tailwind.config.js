/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#1c1c1c',
          900: '#1c1c1c',
          850: '#232323',
          800: '#2e2e2e',
          750: '#2e2e2e',
          700: '#343434',
          600: '#3e3e3e',
        },
        muted: '#a0a0a0',
        faint: '#7e7e7e',
        accent: {
          200: '#b6f2d5',
          300: '#73e2ab',
          400: '#3ecf8e',
          500: '#3ecf8e',
          600: '#4dda9c',
          700: '#3ecf8e',
          800: '#2dbd7c',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        '2xs': ['11px', '14px'],
      },
      borderRadius: {
        '4xl': '28px',
      },
    },
  },
  plugins: [],
}
