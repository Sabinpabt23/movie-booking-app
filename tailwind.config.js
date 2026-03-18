/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#f97316",
          "primary-content": "#ffffff",
          "secondary": "#f97316",
          "secondary-content": "#ffffff",
          "accent": "#f97316",
          "accent-content": "#ffffff",
          "neutral": "#3d4451",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f5f5f5",
          "base-300": "#e5e5e5",
          "base-content": "#1f2937",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
    defaultTheme: "mytheme",
  },
}