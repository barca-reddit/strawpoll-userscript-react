import fse from 'fs-extra';

const metadata = ({ env, ver }) => {
    const script = env === 'dev'
        ?
        {
            name: 'Strawpoll User Script React (Development)',
            version: ver,
            downloadURL: 'http://localhost:5000/strawpoll.user.js',
            css: null
        }
        :
        {
            name: 'Strawpoll User Script React',
            version: ver,
            downloadURL: 'https://raw.githubusercontent.com/barca-reddit/strawpoll-userscript-react/master/dist/strawpoll.user.js',
            css: 'https://raw.githubusercontent.com/barca-reddit/strawpoll-userscript-react/master/dist/style.user.css'
        }

    return (
        `// ==UserScript==\n` +
        `// @name          ${script.name}\n` +
        `// @namespace     strawpoll-userscript-react\n` +
        `// @version       ${script.version}\n` +
        `// @description   Violent Monkey user script that provides a React modal to create and submit match polls on Reddit and Discord.\n` +
        `// @author        decho\n` +
        `// @homepageURL   https://github.com/barca-reddit/strawpoll-userscript-react\n` +
        `// @downloadURL   ${script.downloadURL}\n` +
        `// @icon          https://cdn.discordapp.com/emojis/783962469000675328.webp\n` +
        (script.css ? `// @resource      css ${script.css}\n` : '') +
        `// @match         https://*.strawpoll.com/*\n` +
        `// @exclude-match https://*.strawpoll.com/docs/api/*\n` +
        `// @noframes\n` +
        (env !== 'dev' ? `// @grant         GM.getResourceText\n` : '') +
        `// @grant         GM.addStyle\n` +
        `// @grant         GM.listValues\n` +
        `// @grant         GM.getValue\n` +
        `// @grant         GM.setValue\n` +
        `// @run-at        document-start\n` +
        `// ==/UserScript==`
    )
}

export const buildConfig = async ({ env, ver }) => {
    return env === 'dev'
        ? {
            banner: { js: metadata({ env, ver }) + '\n' + await fse.readFile('./util/css-loader.js') },
            define: { 'process.env.NODE_ENV': '"development"' },
            minify: false,
            target: 'esnext'
        }
        : {
            banner: { js: metadata({ env, ver }) },
            define: { 'process.env.NODE_ENV': '"production"' },
            minify: true,
            target: 'es2020'
        }
}