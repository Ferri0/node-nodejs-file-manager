import { basename, dirname, join, extname } from 'node:path';

import { isFileExist as checkIsFileExist } from './isFileExists.js';
import { isDirectory as checkIsDirectory } from './isDirectory.js';

/**
 * Service function responsible for validating and formatting path cli arguments
 *
 * @param {string} pathToFile - Path to target file, must contain filename
 * @param {string} destinationPath - Destination path, might contain filename with extension or lead to folder
 * @param {string} [targetExtension] - In some cases we need to change extension of destination file, it can be specified here
 * @param {boolean} [decompress] - Indicates that decompression operation performing
 * @returns {Promise<{formattedPathToFile, formattedDestinationPath: (string|*)}>}
 */
export const getFormattedPaths = async ({ pathToFile, destinationPath, targetExtension, decompress }) => {
    const destinationDirectory = dirname(destinationPath);

    const destinationFilename = basename(destinationPath);
    const initialFileFilename = basename(pathToFile);

    const isDestinationIsDirectory = await checkIsDirectory(destinationFilename);

    const isFileExist = await checkIsFileExist(pathToFile);
    const isDestinationExist = isDestinationIsDirectory
        ? await checkIsFileExist(destinationDirectory)
        : !(await checkIsFileExist(destinationPath));

    if (!isFileExist || !isDestinationExist || !initialFileFilename) {
        throw new Error();
    }

    const formattedPathToFile = pathToFile;
    let formattedDestinationPath = isDestinationIsDirectory
        ? join(destinationPath, initialFileFilename)
        : destinationPath;

    if (targetExtension) {
        const destinationExtension = extname(formattedDestinationPath);

        if (targetExtension !== destinationExtension) {
            if (destinationExtension !== '') {
                formattedDestinationPath = formattedDestinationPath.replace(destinationExtension, '');
            }

            formattedDestinationPath += targetExtension;
        }
    }

    if (decompress) {
        const destinationExtension = extname(formattedDestinationPath);

        if (destinationExtension === '.bc') {
            formattedDestinationPath = formattedDestinationPath.replace(destinationExtension, '.txt');
        }
    }

    const isFormattedDestinationFileExist = await checkIsFileExist(formattedDestinationPath);

    if (isFormattedDestinationFileExist && !isDestinationIsDirectory) {
        throw new Error();
    }

    return { formattedPathToFile, formattedDestinationPath };
};
