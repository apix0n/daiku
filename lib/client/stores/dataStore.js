import { writable } from 'svelte/store';

const createDataStore = () => {
    const { subscribe, set, update } = writable({});

    return {
        subscribe,
        get: (key) => {
            let storedData;
            subscribe(data => storedData = data[key])();
            return storedData;
        },
        set: (key, value) => update(data => ({ ...data, [key]: value }))
    };
};

export const dataStore = createDataStore();
