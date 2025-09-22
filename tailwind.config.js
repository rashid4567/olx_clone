/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",             
    "./src/**/*.{html,js,jsx,ts,tsx}", 
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", 
    "node_modules/flowbite/**/*.js",                     
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin")   
  ],
};
