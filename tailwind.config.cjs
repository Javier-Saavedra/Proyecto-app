/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class", // 👈 clave: lo activamos por clase
  theme: {
    extend: {
      colors: {
        "uca-blue": "#002B5B",
        "uca-white": "#ffffff",
        "uca-gray": "#f5f5f5",
        "uca-green": "#28A745",
        "uca-red": "#DC3545"
      }
    }
  },
  plugins: [],
}
