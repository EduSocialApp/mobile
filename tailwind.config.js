// tailwind.config.js
module.exports = {
    content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './App.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                background: '#fffffe',
                headline: '#272343',
                paragraph: '#2d334a',
                primary: '#ffd803',
                secondary: '#e3f6f5',
                tertiary: '#bae8e8',
            },
        },
    },
    plugins: [],
}
