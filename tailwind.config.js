/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  // Сканировать папку src (если там что-то есть)
    "./app/**/*.{js,ts,jsx,tsx}",  // 👈 КРИТИЧЕСКИ ВАЖНО: сканировать корень App Router!
    "./components/**/*.{js,ts,jsx,tsx}", // На будущее для папки компонентов
  ],

  theme: {
    extend: {},
  },
  plugins: [],
}


