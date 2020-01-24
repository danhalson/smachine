import run, {END_STATE} from '../main';
import MessageHandler from "../utils/Messages";
import strings from "../resources/app_messages.json";
import {States} from '../types/main';

const msgs = new MessageHandler(strings);

const states: States = {
    getInitialState: () => 'state1'
};

it("throws if the state is not defined", async () => {
    const mockMainCallable = () => run({...states, undefinedState: () => END_STATE});
    await expect(mockMainCallable()).rejects.toThrow(msgs.getMessage('invalid_state'));
});

it("throws if incorrect END_STATE returned", async () => {
    const mockMainCallable = () => run({...states, state1: () => 'continue'});
    await expect(mockMainCallable()).rejects.toThrow(msgs.getMessage('invalid_state'));
});

it("returns as expected for a well formed state", async () => {
    const mockMain = await run({...states, state1: () => END_STATE});
    expect(mockMain).toBe(END_STATE);
});

it("calls all the expected states, and ends gracefully", async () => {
    const seenStates: string[] = [];
    const mockMain = await run({
        ...states,
        state1: () => {
            seenStates.push('state1');
            return 'state2';
        },
        state2: () => {
            seenStates.push('state2');
            return END_STATE;
        }
    });
    expect(seenStates).toEqual(['state1', 'state2']);
    expect(mockMain).toBe(END_STATE);
});

it("calls all the expected states in the correct order, and ends", async () => {
    const seenStates: string[] = [];
    const mockMain = await run({
        ...states,
        state1: () => {
            seenStates.push('state1');
            return 'state3';
        },
        state2: () => {
            seenStates.push('state2');
            return 'state4';
        },
        state3: () => {
            seenStates.push('state3');
            return 'state2';
        },
        state4: () => {
            seenStates.push('state4');
            return END_STATE;
        }
    });
    expect(seenStates).toEqual(['state1', 'state3', 'state2', 'state4']);
    expect(mockMain).toBe(END_STATE);
});

it("throws after 10 calls to the same state", async () => {
    let count = 0;
    const mockMainCallable = () => run({
        ...states,
        state1: () => 'state2',
        state2: () => {
            count++;
            return count < 11 ? 'state3' : 'state4';
        },
        state3: () => 'state2',
        state4: () => END_STATE
    });
    await expect(mockMainCallable()).rejects.toThrow(
        msgs.getMessage('max_calls', {activeState: 'state2'})
    );
});

