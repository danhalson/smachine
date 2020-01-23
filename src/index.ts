import states from "./states";
import run from './main';

(async () => {
    try {
        await run(states);
    } catch (e) {
        console.error(e);
    }
})();