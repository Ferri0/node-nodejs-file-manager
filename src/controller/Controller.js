import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

import { CustomFS } from '../customFS/CustomFS.js';
import { BrotliZlib } from '../brotliZlib/BrotliZlib.js';
import { CustomOS } from '../customOS/CustomOS.js';
import { Logger } from '../logger/Logger.js';

export class Controller {
    constructor(username) {
        this.logger = new Logger(username);
        this.customFS = new CustomFS(this.logger);
        this.customOS = new CustomOS(this.logger);
        this.brotliZlib = new BrotliZlib(this.logger);

        this.customFS.redirectToHomeDirectory();

        this.logger.logWelcomeMessage();
        this.logger.logCurrentDirectory();

        this.commandsMap = {
            up: this.up,
            cd: this.cd,
            ls: this.ls,
            cat: this.cat,
            add: this.add,
            rn: this.rn,
            cp: this.cp,
            mv: this.mv,
            rm: this.rm,
            watch: this.watch,
            os: this.os,
            hash: this.hash,
            compress: this.compress,
            decompress: this.decompress,
        };

        process.on('SIGINT', () => {
            const isInterruptSignal = true;

            this.logger.logGoodbyeMessage(isInterruptSignal);
            process.exit();
        });
    }

    async input(data) {
        const cliArguments = data.toString().trim().split(' ');

        const command = cliArguments.shift();

        if (command === '.exit') {
            this.logger.logGoodbyeMessage();
            process.exit();
        } else {
            const commandMethod = this.commandsMap[command];

            if (commandMethod) {
                await commandMethod(cliArguments);
            } else {
                this.logger.logInvalidInputMessage();
            }

            this.logger.logCurrentDirectory(this.customFS.cwd);
        }
    }

    up = async () => {
        this.customFS.redirectToPath('..');
    };

    cd = async (cliArguments) => {
        const requiredArgument = cliArguments[0];

        if (requiredArgument) {
            this.customFS.redirectToPath(requiredArgument);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };

    ls = async () => {
        await this.customFS.listFolderContent();
    };

    cat = async (cliArguments) => {
        const requiredArgument = cliArguments[0];

        if (requiredArgument) {
            this.customFS.readFile(requiredArgument);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };

    add = async (cliArguments) => {
        const requiredArgument = cliArguments[0];

        if (requiredArgument) {
            await this.customFS.createFile(requiredArgument);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };

    rn = async (cliArguments) => {
        const requiredArgument1 = cliArguments[0];
        const requiredArgument2 = cliArguments[1];

        if (requiredArgument1 && requiredArgument2) {
            await this.customFS.renameFile(requiredArgument1, requiredArgument2);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };

    cp = async (cliArguments) => {
        const requiredArgument1 = cliArguments[0];
        const requiredArgument2 = cliArguments[1];

        if (requiredArgument1 && requiredArgument2) {
            await this.customFS.copyFile(requiredArgument1, requiredArgument2);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };

    mv = async (cliArguments) => {
        const requiredArgument1 = cliArguments[0];
        const requiredArgument2 = cliArguments[1];

        if (requiredArgument1 && requiredArgument2) {
            await this.customFS.moveFile(requiredArgument1, requiredArgument2);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };

    rm = async (cliArguments) => {
        const requiredArgument = cliArguments[0];

        if (requiredArgument) {
            await this.customFS.removeFile(requiredArgument);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };

    watch = async (cliArguments) => {
        const requiredArgument = cliArguments[0];

        if (requiredArgument) {
            await this.customFS.watchFile(requiredArgument);
        } else {
            this.logger.logInvalidInputMessage();
        }
    }

    os = async (cliArguments) => {
        const requiredArgument = cliArguments[0];

        if (requiredArgument) {
            this.customOS.getOsInfo(requiredArgument);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };

    hash = async (cliArguments) => {
        const requiredArgument = cliArguments[0];

        if (requiredArgument) {
            const fileBuffer = await readFile(requiredArgument);

            const hashSum = createHash('sha256');
            hashSum.update(fileBuffer);

            const hexValue = hashSum.digest('hex');

            this.logger.log(hexValue);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };

    compress = async (cliArguments) => {
        const requiredArgument1 = cliArguments[0];
        const requiredArgument2 = cliArguments[1];

        if (requiredArgument1 && requiredArgument2) {
            await this.brotliZlib.compress(requiredArgument1, requiredArgument2);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };

    decompress = async (cliArguments) => {
        const requiredArgument1 = cliArguments[0];
        const requiredArgument2 = cliArguments[1];

        if (requiredArgument1 && requiredArgument2) {
            await this.brotliZlib.decompress(requiredArgument1, requiredArgument2);
        } else {
            this.logger.logInvalidInputMessage();
        }
    };
}
