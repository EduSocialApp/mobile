// tailwind.config.js
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./App.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                'primary': {
                    'DEFAULT': '#2C3E50',
                    '200': '#57687c',
                    '300': '#b4c7dd'
                },
                'accent': {
                    'DEFAULT': '#F7CAC9',
                    '200': '#926b6a',
                },
                'background': {
                    'DEFAULT': '#F2F2F2',
                    '200': '#e8e8e8',
                    '300': '#bfbfbf'
                },
            }
        },
    },
    plugins: [],
}