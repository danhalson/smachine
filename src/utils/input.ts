import readline from 'readline';

const createRl = (message: string) => readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: message
});

/**
 * Gets user input
 */
export const getUserInput = async (message: string) => {
    const rl = createRl(message);
    rl.prompt();

    for await (const line of rl) {
        return line;
    }
};