import { State } from '../reducers';
import { storageKey } from './localstorage.effects';

export { LocalStorageEffects } from './localstorage.effects';
export { SaveState } from './localstorage.actions';

export function getInitialState(): Partial<State> | undefined {
    const state = localStorage[storageKey];
    return state ? JSON.parse(state) : undefined;
}
