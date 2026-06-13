/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#667eea',
          dark: '#818cf8',
          from: '#667eea',
          to: '#764ba2',
          'from-dark': '#818cf8',
          'to-dark': '#a78bfa',
        },
        accent: {
          DEFAULT: '#00d2ff',
          dark: '#38bdf8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', '-apple-system', 'Microsoft YaHei', 'sans-serif'],
        heading: ['Space Grotesk', 'Noto Sans SC', 'system-ui', '-apple-system', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      maxWidth: {
        '6xl': '1152px',
      },
    },
  },
  plugins: [],
};
