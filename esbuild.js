import { build } from 'esbuild';
import { watch } from 'chokidar';
import fse from 'fs-extra';
import postCSS from 'esbuild-postcss';

import { buildConfig } from './util/build-config.js';
import { parseArgs } from './util/parse-argv.js';
import { Package } from './util/package-version.js';
import { Server } from './util/file-server.js';

export class Compiler {
    /** @private */
    constructor({ env, ver }) {
        this.env = env;
        this.ver = ver;
    }

    /** @private */
    async buildTailwind() {
        await build({
            entryPoints: ['./src/css/tailwind.css'],
            outfile: './dist/style.user.css',
            bundle: true,
            minify: false,
            logLevel: 'info',
            plugins: [postCSS()],
        });
    }

    /** @private */
    async buildTypeScript() {
        await build({
            entryPoints: ['./src/index.tsx'],
            bundle: true,
            outfile: './dist/strawpoll.user.js',
            target: 'esnext',
            platform: 'browser',
            format: 'iife',
            charset: 'utf8',
            logLevel: 'info',
            ...await buildConfig({ env: this.env, ver: this.ver }),
        })
    }

    async build() {
        await Promise.all([
            this.buildTailwind(),
            this.buildTypeScript(),
        ])
    }

    async watch() {
        watch(['./src/**/*.*'], {
            persistent: true,
        }).on('all', async (event) => {
            if (event === 'change' || event === 'unlink') {
                await this.build();
            }
        })
    }
}


if (process.argv[2]) {
    const args = parseArgs(process.argv);

    if (!args.ver) {
        args.ver = (await Package.getCurrentVersion()).string;
    }

    console.log(`\n  env: ${args.env} | ver: ${args.ver} | watch: ${args.watch}`);

    const compiler = new Compiler({ env: args.env, ver: args.ver });
    const server = new Server();

    await fse.emptyDir('./dist');
    await compiler.build();

    if (args.watch) {
        server.create();
        compiler.watch();
    }
}


