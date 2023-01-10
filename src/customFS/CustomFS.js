import os from 'os';
import { dirname, join } from 'node:path';
import { appendFile, rm, readdir, stat, rename } from 'node:fs/promises';
import { createReadStream, createWriteStream, watch } from 'node:fs';

import { getSortedFolderContent } from '../services/getSortedFolderContent.js';
import { isFileExist as checkIsFileExist } from '../services/isFileExists.js';
import { getFormattedPaths } from '../services/getFormattedPaths.js';

export class CustomFS {
    constructor(logger) {
        this.logger = logger;
    }

    redirectToPath = (path) => {
        try {
            process.chdir(path);
            this.cwd = process.cwd();
        } catch {
            this.logger.logOperationFailedMessage();
        }
    };

    redirectToHomeDirectory = () => {
        this.redirectToPath(os.homedir());
    };

    listFolderContent = async () => {
        try {
            const rawFolderContent = await readdir(this.cwd);

            const folderContentPromisified = await Promise.allSettled(
                rawFolderContent.map(async (fileName) => {
                    const fileStat = await stat(fileName);
                    const fileType = fileStat.isDirectory() ? 'directory' : 'file';

                    return { name: fileName, type: fileType };
                })
            );

            const folderContent = folderContentPromisified
                .filter((el) => el.status === 'fulfilled')
                .map((el) => el.value);

            const sortedFolderContent = getSortedFolderContent(folderContent);

            this.logger.logFolderContent(sortedFolderContent);
        } catch {
            this.logger.logOperationFailedMessage();
        }
    };

    readFile = (pathToFile) => {
        const logError = this.logger.logOperationFailedMessage;

        try {
            const readableStream = createReadStream(pathToFile);

            readableStream
                .on('error', () => logError())
                .pipe(process.stdout)
                .on('error', () => logError());
        } catch {
            logError();
        }
    };

    createFile = async (pathToFile) => {
        try {
            const isFileExist = await checkIsFileExist(pathToFile);

            if (isFileExist) {
                throw new Error();
            }

            await appendFile(pathToFile, '');
        } catch {
            this.logger.logOperationFailedMessage();
        }
    };

    renameFile = async (pathToFile, newFilename) => {
        try {
            const isFileExist = await checkIsFileExist(pathToFile);

            if (!isFileExist) {
                throw new Error();
            }

            const pathToFileDir = dirname(pathToFile);

            await rename(pathToFile, join(pathToFileDir, newFilename));
        } catch {
            this.logger.logOperationFailedMessage();
        }
    };

    copyFile = async (pathToFile, destinationPath) => {
        try {
            const { formattedPathToFile, formattedDestinationPath } = await getFormattedPaths({
                pathToFile,
                destinationPath,
            });

            const readFileStream = createReadStream(formattedPathToFile);
            const writeFileStream = createWriteStream(formattedDestinationPath);

            readFileStream.pipe(writeFileStream);

            writeFileStream.on('error', () => {
                this.logger.logOperationFailedMessage();
            });
        } catch {
            this.logger.logOperationFailedMessage();
        }
    };

    moveFile = async (pathToFile, destinationPath) => {
        try {
            const { formattedPathToFile, formattedDestinationPath } = await getFormattedPaths({
                pathToFile,
                destinationPath,
            });

            const readFileStream = createReadStream(formattedPathToFile);
            const writeFileStream = createWriteStream(formattedDestinationPath);

            readFileStream.pipe(writeFileStream).on('close', async () => {
                await this.removeFile(pathToFile);
            });

            writeFileStream.on('error', () => {
                this.logger.logOperationFailedMessage();
            });
        } catch {
            this.logger.logOperationFailedMessage();
        }
    };

    removeFile = async (pathToFile) => {
        try {
            await rm(pathToFile);
        } catch {
            this.logger.logOperationFailedMessage();
        }
    };

    watchFile = async (pathToFile) => {
        try {
            watch(pathToFile, 'utf-8').on('change', function () {
                this.logger.log('File changed')
            }.bind(this))
        } catch {
            this.logger.logOperationFailedMessage();
        }
    }
}
