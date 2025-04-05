import { dataStore } from '$lib/stores/dataStore';

export const load = async ({ fetch }) => {
    const storedData = dataStore.get('animeData');
    if (storedData) {
        return { animeData: storedData };
    }

    const animeData = await fetch('/api/get/anilist/anime').then(r => r.json());
    dataStore.set('animeData', animeData);
    return { animeData };
};