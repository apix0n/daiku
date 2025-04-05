import { dataStore } from '$lib/stores/dataStore';

export const load = async ({ fetch }) => {
    const storedData = dataStore.get('mangaCollection');
    if (storedData) {
        return { mangaCollection: storedData };
    }

    const mangaCollection = await fetch('/api/get/mangacollec').then(r => r.json());
    dataStore.set('mangaCollection', mangaCollection);
    return { mangaCollection };
};