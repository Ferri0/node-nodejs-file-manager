import { stat } from 'node:fs/promises';

/**
 * Service function, check is file a folder or not
 *
 * @param {string} filePath - Path to the file or the folder
 * @returns {Promise<boolean>} - Indicates is file a folder or not
 */
export const isDirectory = async (filePath) => {
    let isFileNotExist = false;

    const fileStat = await stat(filePath).catch(() => (isFileNotExist = true));

    return isFileNotExist ? false : fileStat.isDirectory();
};
