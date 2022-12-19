/**
 * Service function, used to parse cli arguments and retrieve username value
 *
 * @returns {null|string} - Username value
 */
export const getUsername = () => {
    const cliArguments = process.argv.slice(2);

    let username = null;

    cliArguments.forEach((cliArgument) => {
        const keyValuePair = cliArgument.split('=');
        const isKeyValuePairProvided = keyValuePair.length === 2;

        if (isKeyValuePairProvided) {
            const [key, value] = keyValuePair;

            if (key === '--username') {
                username = value;
            }
        }
    });

    return username;
};
