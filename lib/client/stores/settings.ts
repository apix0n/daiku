import { writable } from 'svelte/store';

export type Settings = {
    theme: string;
    showSpecials: boolean;
};

const defaultSettings: Settings = {
    theme: '',
    showSpecials: false
};

function createSettingsStore() {
    let initial: Settings = defaultSettings;

    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('appSettings');
        if (stored) {
            try {
                initial = { ...defaultSettings, ...JSON.parse(stored) };
            } catch {
                initial = defaultSettings;
            }
        }
    }

    const store = writable<Settings>(initial);

    store.subscribe((value) => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('appSettings', JSON.stringify(value));
        }
    });

    return store;
}

export const settings = createSettingsStore();
