import {StateVisits, States} from "./types/main";
import MessageHandler from "./utils/Messages";
import strings from "./resources/app_messages.json";

/**
 * Prevent a state from being called indefinitely
 */
export const MAX_CALLS = 10;

/**
 * This must be returned by the final state
 */
export const END_STATE = 'done';

/**
 * Create a handler for errors
 */
const msgs = new MessageHandler(strings);

/**
 * Helper function to log the number of visits to each state
 */
export function logStateVisits(log: StateVisits, activeState: string) {
    if (log[activeState]) {
        log[activeState] = log[activeState] + 1;
    } else {
        log = {...log, [activeState]: 1};
    }

    return log;
}

/**
 * Recursively calls each defined state until END_STATE is returned.
 * As a precaution if a state is visited more than MAX_CALLS it will throw.
 */
export async function getNextState(activeState: string, states: States, visits: StateVisits): Promise<string> {
    visits = logStateVisits(visits, activeState);

    if (visits[activeState] > MAX_CALLS) {
        throw new Error(msgs.getMessage('max_calls', {activeState}));
    }

    if (activeState === END_STATE) {
        return activeState;
    }

    if (!states[activeState]) {
        throw new Error(msgs.getMessage('invalid_state'));
    }

    activeState = await states[activeState]();
    return getNextState(activeState, states, visits);
}

// TODO: Handle ctrl+c gracefuly
export default async function run(states: States) {
    const visits: StateVisits = {};
    const initialState = await states.getInitialState();

    // Run, then return the last used state (mainly for test purposes)
    return await getNextState(initialState, states, visits);
}