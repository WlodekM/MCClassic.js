import { readdirSync, statSync } from 'fs';
import { resolve, join, extname, basename as getBasename } from 'path';

/**
 * Load modules from a directory.
 *
 * @param {string} dir - The directory to load modules from.
 * @param {string[]} [basenames] - Optional list of basenames to explicitly include.
 * @returns {Promise<Object>} - Object with loaded modules.
 */
export default async function requireIndex(dir, basenames) {
    const requires = {};

    if (arguments.length === 2) {
        // if basenames argument is passed, explicitly include those files
        await Promise.all(basenames.map(async (basename) => {
            const filepath = resolve(join(dir, basename));
            requires[basename] = (await import(filepath)).default;
        }));
    } else if (arguments.length === 1) {
        // if basenames arguments isn't passed, require all javascript
        // files (except for those prefixed with _) and all directories

        const files = readdirSync(dir);

        // sort files in lowercase alpha for linux
        files.sort((a, b) => {
            a = a.toLowerCase();
            b = b.toLowerCase();

            if (a < b) {
                return -1;
            } else if (b < a) {
                return 1;
            } else {
                return 0;
            }
        });

        await Promise.all(files.map(async (filename) => {
            // ignore index.js and files prefixed with underscore and
            if (filename === 'index.js' || filename[0] === '_' || filename[0] === '.') {
                return;
            }

            const filepath = resolve(join(dir, filename));
            const ext = extname(filename);
            const stats = statSync(filepath);

            // don't require non-javascript files (.txt .md etc.)
            const exts = ['.js', '.mjs', '.cjs', '.node', '.json'];
            if (stats.isFile() && exts.indexOf(ext) === -1) {
                return;
            }

            const basename = getBasename(filename, ext);

            requires[basename] = (await import(filepath)).default;
        }));
    } else {
        throw new Error('Must pass directory as first argument');
    }

    return requires;
}
