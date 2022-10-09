import { createServer } from 'node:http';
import { extname } from 'node:path';
import fse from 'fs-extra';
import chalk from "chalk";

const log = console.log;

export class Server {
    /** @private */
    constructor() {
        this.server;
        this.mimeTypes = {
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.map': 'application/json'
        };
        this.req;
    }
    logRequest(req) {
        log(`${chalk.green(`> http://localhost:5000${req.url}`)} ${chalk.gray(new Date().toLocaleString('en-GB', { timeStyle: 'medium' }))}`);
    }
    create() {
        this.server = createServer(async (req, res) => {
            try {
                this.logRequest(req);
                const file = await fse.readFile('./dist/' + req.url, { encoding: 'utf-8' });

                res.writeHead(200,
                    {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': this.mimeTypes[extname(req.url)],
                        'Cache-Control': 'no-store'
                    }
                ).end(file, 'utf-8');
            }
            catch (error) {
                log(chalk.red(error));
                res.writeHead(400).end();
            }
        });
        this.server.listen(5000);
        this.server.on('listening', async () => {
            (await fse.readdir('./dist')).forEach(item => log(chalk.blueBright(`> http://localhost:5000/${item}`)));
        });
    }
}