import os from 'node:os';

export class CustomOS {
    constructor(logger) {
        this.logger = logger;
    }

    getOsInfo = (argument) => {
        switch (argument) {
            case '--EOL':
                const escapedEOL = os.EOL.replace('\n', '\\n').replace('\r', '\\r');

                this.logger.log(escapedEOL);
                break;
            case '--cpus':
                const rawCpusInfo = os.cpus();

                const formattedCpusInfo = rawCpusInfo.map(({ model, speed }) => {
                    return { model, clockRate: `${speed / 1000}GHz` };
                });

                const output = { cpusNumber: rawCpusInfo.length, cpusInfo: formattedCpusInfo };

                const formattedCpusInfoJson = JSON.stringify(output, null, 2);

                this.logger.log(formattedCpusInfoJson);
                break;
            case '--homedir':
                const homedirPath = os.homedir();

                this.logger.log(homedirPath);
                break;
            case '--username':
                const username = os.userInfo().username;

                this.logger.log(username);
                break;
            case '--architecture':
                const architectureType = os.arch();

                this.logger.log(architectureType);
                break;
            default:
                this.logger.logInvalidInputMessage();
                break;
        }
    };
}
