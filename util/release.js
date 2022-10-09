#!/usr/bin/env node
import inquirer from 'inquirer';
import { Package } from './package-version.js';
import { Compiler } from '../esbuild.js';

const currentVersion = await Package.getCurrentVersion();

inquirer.prompt([
    {
        type: 'list',
        name: 'release',
        message: `Please select release type (current v${currentVersion.string}):`,
        choices: [
            { type: 'choice', name: `major > ${Package.getBumpVersion({ release: 'major', version: currentVersion })}`, value: 'major' },
            { type: 'choice', name: `minor > ${Package.getBumpVersion({ release: 'minor', version: currentVersion })}`, value: 'minor' },
            { type: 'choice', name: `patch > ${Package.getBumpVersion({ release: 'patch', version: currentVersion })}`, value: 'patch' },
        ]
    }
])
    .then(async ({ release }) => {
        const releaseVersion = Package.getBumpVersion({ release: release, version: currentVersion });

        const compiler = new Compiler({ env: 'prod', ver: releaseVersion });
        await compiler.build();

        await Package.updateCurrentVersion({ version: releaseVersion })
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });