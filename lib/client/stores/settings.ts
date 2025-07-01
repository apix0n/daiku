import { writable } from 'svelte/store';

export type Settings = {
    theme: string;
    showSpecials: boolean;
    showNotchSticker: boolean;
    titleLanguage: TitleSelect;
    multiLineBooks: boolean;
    showBookType: boolean;
    showNextBooksCount: boolean;
};

export type TitleSelect = 'locale' | 'english' | 'romaji' | 'native';

const defaultSettings: Settings = {
    theme: '',
    showSpecials: false,
    showNotchSticker: true,
    titleLanguage: 'english',
    multiLineBooks: false,
    showBookType: true,
    showNextBooksCount: false
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
