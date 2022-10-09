const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.tsx'],
    darkMode: ['class', '.modal-dark'],
    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            },
            animation: {
                fadeIn: 'fadeIn .3s ease-out forwards'
            }
        },
    },
    plugins: [],
}
