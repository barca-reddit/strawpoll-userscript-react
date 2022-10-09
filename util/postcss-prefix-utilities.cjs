/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = ({ prefix } = {}) => {
    return {
        postcssPlugin: 'postcss-prefix-utilities',
        Rule(rule) {
            rule.selectors = rule?.raws?.tailwind?.layer === 'utilities'
                ? rule.selectors.map(selector => prefix + ' ' + selector)
                : rule.selectors
        },
    }
}

module.exports.postcss = true;