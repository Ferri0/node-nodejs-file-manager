import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

import { getFormattedPaths } from '../services/getFormattedPaths.js';

export class BrotliZlib {
    constructor(logger) {
        this.logger = logger;
    }

    compress = async (pathToFile, destinationPath) => {
        try {
            const { formattedPathToFile, formattedDestinationPath } = await getFormattedPaths({
                pathToFile,
                destinationPath,
                targetExtension: '.bc',
            });

            const readStream = createReadStream(formattedPathToFile);
            const writeStream = createWriteStream(formattedDestinationPath);
            const brotliCompressStream = createBrotliCompress();

            readStream.pipe(brotliCompressStream).pipe(writeStream);
        } catch {
            this.logger.logOperationFailedMessage();
        }
    };

    decompress = async (pathToFile, destinationPath) => {
        try {
            const { formattedPathToFile, formattedDestinationPath } = await getFormattedPaths({
                pathToFile,
                destinationPath,
                decompress: true
            });

            const readStream = createReadStream(formattedPathToFile);
            const writeStream = createWriteStream(formattedDestinationPath);
            const brotliDecompressStream = createBrotliDecompress();

            readStream.pipe(brotliDecompressStream).pipe(writeStream);
        } catch {
            this.logger.logOperationFailedMessage();
        }
    };
}
