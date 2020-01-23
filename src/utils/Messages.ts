import {Strings, Tokens} from "../types/main";

class MessageHandler {
    strings: Strings;

    constructor(newStrings: Strings) {
        this.strings = newStrings;
    }

    replaceTokens(message: string, tokens?: Tokens): string {
        if (tokens) {
            Object.keys(tokens).forEach(token => {
                message = message.replace(`[${token}]`, tokens[token]);
            });
        }
        return message;
    }

    getMessage(id: string, tokens?: Tokens): string {
        const {replaceTokens, strings} = this;
        return replaceTokens(strings[id], tokens);
    }
}

export default MessageHandler;