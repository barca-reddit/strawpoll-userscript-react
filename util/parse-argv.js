export const parseArgs = (argv) => {
    const args = Object.assign({}, ...argv.slice(2).map(arg => {
        const [key, value] = arg.split('=');
        return {
            [key]: value === 'true' || value === 'false'
                ? value === 'true'
                : value
        }
    }));

    if (!args.env || typeof args.watch !== 'boolean') {
        throw new Error('missing or invalid arguments');
    }

    return args;
}