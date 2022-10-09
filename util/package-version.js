import { fileURLToPath } from 'node:url';
import fse from 'fs-extra';

export class Package {
    static async getCurrentVersion() {
        const [major, minor, patch] = (await fse.readJson('./package.json', { encoding: 'utf-8' })).version.split('.');
        return {
            major: +major,
            minor: +minor,
            patch: +patch,
            string: `${major}.${minor}.${patch}`
        }
    }

    static getBumpVersion({ release, version }) {
        switch (release) {
            case 'major': return `${version.major + 1}.${version.minor}.${version.patch}`;
            case 'minor': return `${version.major}.${version.minor + 1}.${version.patch}`;
            case 'patch': return `${version.major}.${version.minor}.${version.patch + 1}`;
            default: console.error(new Error('Invalid option, expected major, minor, patch')); process.exit(1);
        }
    }

    static async updateCurrentVersion({ version }) {
        const pkg = await fse.readJson('./package.json', { encoding: 'utf-8' });
        pkg.version = version;
        await fse.writeJson('./package.json', pkg, { encoding: 'utf-8', spaces: 4 });

        console.log(`Updated package.json release version to ${version}`);
    }
}

/** Run this line only if the file is being called directly */
if (fileURLToPath(import.meta.url) === process.argv[1]) {
    process.stdout.write((await Package.getCurrentVersion()).string);
}
