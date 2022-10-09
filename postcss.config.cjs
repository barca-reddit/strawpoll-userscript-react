const tailwindcss = require('tailwindcss');
const postCSSImport = require('postcss-import');
const postCSSPrefixUtilities = require('./util/postcss-prefix-utilities.cjs');

module.exports = {
    plugins: [
        postCSSImport(),
        tailwindcss('./tailwind.config.cjs'),
        postCSSPrefixUtilities({ prefix: '.user-script' })
    ]
};