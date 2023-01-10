import { stat } from 'node:fs/promises';

/**
 * Service function, used to check is file or folder exist
 *
 * @param {string} filePath - Path to the file or the folder
 * @returns {Promise<boolean>} - Indicates is file or folder exist or not
 */
export const isFileExist = async (filePath) => {
    return await stat(filePath)
        .then(() => true)
        .catch(() => false);
};
