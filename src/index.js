import { Transform } from 'node:stream';

import { Controller } from './controller/Controller.js';
import { getUsername } from './services/getUsername.js';

const username = getUsername();

const CliController = new Controller(username);

const ControllerStream = new Transform({
    async transform(data, encoding, callback) {
        await CliController.input(data);

        callback(null, '');
    },
});

process.stdin.pipe(ControllerStream).pipe(process.stdout);
