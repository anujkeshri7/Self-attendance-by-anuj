/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      content: {
        files: [
          './app/**/*.{js,ts,jsx,tsx}',
          './components/**/*.{js,ts,jsx,tsx}',
          './lib/**/*.{js,ts,jsx,tsx}',
        ],
        negated: [
          // Exclude unnecessary patterns
        ],
      },
    },
  },
}

export default config
