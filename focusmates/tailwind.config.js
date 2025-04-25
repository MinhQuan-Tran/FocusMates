/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'focusmate': "url('/bg.jpg')", // 👈 name it what you want
      },

      colors: {
        primary: '#2ECD96',     // Mint green - main brand
        accent: '#60A5FA',      // Sky blue - secondary highlight
        highlight: '#rgb(255 229 161)',   // Yellow - for CTAs or attention
        background: '#F9FAFB',  // Light background
        foreground: '#1E293B',  // Slate for text
        dark: '#0F172A',        // Dark mode background
        softYellow: 'rgb(255 229 161)',     
        softYellowHover: 'rgb(255 214 120)'
        
      },
    },
  },
  plugins: [],
};
