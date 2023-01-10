export class Logger {
    constructor(username) {
        this.username = username;
    }

    log = (message) => {
        process.stdout.write(message + '\n');
    };

    table = (tabularData) => {
        console.table(tabularData);
    };

    logWelcomeMessage = () => {
        if (this.username) {
            this.log(`Welcome to the File Manager, ${this.username}!`);
        } else {
            this.log('Welcome to the File Manager!');
        }
    };

    logGoodbyeMessage = (isInterruptSignal = false) => {
        const maybeNewLine = isInterruptSignal ? '\n' : '';

        if (this.username) {
            this.log(`${maybeNewLine}Thank you for using File Manager, ${this.username}, goodbye!`);
        } else {
            this.log(`${maybeNewLine}Thank you for using File Manager, goodbye!`);
        }
    };

    logCurrentDirectory = () => {
        this.log(`You are currently in ${process.cwd()}`);
    };

    logInvalidInputMessage = () => {
        this.log('Invalid input');
    };

    logOperationFailedMessage = () => {
        this.log('Operation failed');
    };

    logFolderContent = (tabularData) => {
        this.table(tabularData);
    };
}
