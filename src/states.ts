import {END_STATE} from './main';
import {getUserInput} from './utils/input';
import {States} from "./types/main";
import MessageHandler from "./utils/Messages";
import strings from "./resources/states_messages.json";

const msgs = new MessageHandler(strings);

export const states: States = {
    getInitialState: () => 'start',
    start: async () => {
        const resp = await getUserInput(msgs.getMessage('where_to'));
        return resp === 'middle' ? 'middle' : resp === 'end' ? 'end' : 'unknown';
    },
    middle: () => {
        console.log(msgs.getMessage('middle'));
        return 'end';
    },
    unknown: () => {
        console.log(msgs.getMessage('unknown'));
        return 'start';
    },
    end: () => {
        console.log(msgs.getMessage('end'));
        return END_STATE;
    }
}

export default states;